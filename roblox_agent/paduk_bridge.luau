--[[
  PADUK BRIDGE — Anime Zero live data collector
  ไฟล์เดียว โหลดแล้วรัน: ดึงข้อมูลจากบัญชีจริงในเกม แล้ว POST ไป localhost:3000/api/ingest
  ใช้กับ Roblox Luau (client) ผู้อีด executor โรบลอกซ์แหละ
  อนาคต: เปลี่ยน URL_BASE แล้ว Deploy เป็น Worker/Cloud ต่อ Vercel
--]]

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- ============================================================
-- CONFIG
-- ============================================================
local CONFIG = {
	-- เปลี่ยนเป็น URL ของ Vercel ในอนาคต (เช่น https://api.paduk.vercel.app)
	URL_BASE = "http://127.0.0.1:3000",
	INGEST_PATH = "/api/ingest",
	-- หยุดทันทีที่ push สำเร็จ → ทุกครั้งที่โหลดใหม่จะจับ "ตอนจบรัน" ได้เสมอ
	RUN_ONCE = true,            -- true = ส่งครั้งเดียวแล้วหยุด (โหมดทดสอบ)
	SEND_IMAGE_PORTRAITS = true, -- ส่ง assetId ของ skill icons/portraits
	SEND_ICON_PIXELS = true,     -- export รูปไอคอนจริงจากในเกม (asset private → อ่านพิกเซลเอง)
	ICON_MAX_PER_PUSH = 4,       -- จำกัดจำนวนไอคอน export ต่อรอบ (กัน payload ใหญ่/หน่วงเกม)
	HISTORY_MAX = 20,            -- จำนวนรอบสูงสุดที่เก็บใน runHistory (ต่อบัญชี)
}


-- ============================================================
-- ข้อมูลตัวละคร (ชื่อ ระดับ displayName + skill icons) — ของเกมจริง
-- ============================================================
local CHARACTERS: { [string]: { display: string, icons: { string } } } = {
	alucard = { display = "Immortal Sovereign", icons = { "121308679020768", "92642546123220", "72946536167487", "81998886810900" } },
	astra_yao = { display = "Astral Blossom", icons = { "76354811743721", "87322444097168", "113902696594779", "92195314002659" } },
	frieren = { display = "Silver Calamity", icons = { "85612669550281", "107550170508077", "132047617144127", "100801291893570", "122086112680485", "93283604834016" } },
	goku = { display = "Cosmic Warrior", icons = { "106985240726017", "136713611264193", "84309699941743", "73578231979842" } },
	guts = { display = "Dragon Eclipse", icons = { "100060499627114", "81010169273191", "96445203018486", "117510084568666" } },
	hutao = { display = "Flame Director", icons = { "114829747158566", "117698685881183", "76536998313969", "103006204968066", "112504828407340" } },
	juuzou = { display = "Twisted Agony", icons = { "93671861850826", "140270471778410", "85761866970787", "95135572477475" } },
	katakuri = { display = "Mochi Commander", icons = { "106304380555204", "119297192811229", "103942726502067", "94567414827406", "100268822325365" } },
	killua = { display = "Thunder Prodigy", icons = { "99451127178544", "98213633387371", "113297087955456", "86950601917988" } },
	luffy = { display = "Rubber Man", icons = { "131005601874828", "123148991066203", "91946771272926", "93201286072351" } },
	miyabi = { display = "Cataclysm", icons = { "105512641401891", "105423755477430", "81153938840708", "93667336439958" } },
	nagumo = { display = "Kings Gambit", icons = { "96013597539915", "73114873145946", "84215688510179", "124094903948542" } },
	rin = { display = "Inferno Prince", icons = { "100060499627114", "96445203018486", "119615753151643", "102855173613018" } },
	saber = { display = "Lights of Divinity", icons = { "115672765080141", "74772755124103", "116632554891670", "80467683551892" } },
	shanks = { display = "Divine Emperor", icons = { "119615753151643", "135767397322778", "78800803166262", "102855173613018" } },
	sukuna = { display = "Cursed King", icons = { "135549790468922", "96759091524423", "112001255751783", "116651453667701" } },
	sung_jinwoo = { display = "Shadow Monarch", icons = { "130397647033140", "116466948078735", "90096307791362", "119043188878451", "91940131299938" } },
	ye_shunguang = { display = "Ye-0", icons = { "105512641401891", "105423755477430", "81153938840708", "93667336439958" } },
}
-- ============================================================
-- CONFIG คงที่จากเกม (trait/evo/skilltree/material) — อ่านจาก game configs
-- ============================================================
local GAME_STATIC = nil
local function collectGameConfig()
	if GAME_STATIC then return GAME_STATIC end
	local cfg = { traits = {}, evolution = {}, materialDefs = {}, characterRarity = {}, skillTree = { branchOrder = {}, branches = {}, maxLevel = 110 } }
	pcall(function()
		local list = require(ReplicatedStorage.assets.config.Traits.traitConfig)
		for _, t in ipairs(list) do
			local buff = t.Buffs and t.Buffs[1] or {}
			cfg.traits[#cfg.traits+1] = { id = tonumber(t.Id) or 0, name = tostring(t.Name or "?"), rarity = tostring(t.Rarity or "Common"), icon = tostring(t.Icon or ""), buffType = tostring(buff.Type or ""), buffPercent = tonumber(buff.Percent) or 0 }
		end
	end)
	pcall(function()
		local ec = require(ReplicatedStorage.assets.config.evolutionConfig)
		for name, ecfg in pairs(ec) do
			local cur = {}
			if ecfg.currencies then
				for _, cc in ipairs(ecfg.currencies) do
					cur[#cur+1] = { currency = tostring(cc.currency), amount = tonumber(cc.amount) or 0 }
				end
			end
			cfg.evolution[tostring(name)] = { currencies = cur, ultimate = tostring(ecfg.ultimate or "") }
		end
	end)
	pcall(function()
		local mc = require(ReplicatedStorage.assets.config.materialConfig)
		for id, m in pairs(mc) do
			cfg.materialDefs[tostring(id)] = { name = tostring(m.Name or id), tier = tonumber(m.Tier) or 1, icon = tostring(m.Icon or "") }
		end
	end)
	pcall(function()
		local rc = require(ReplicatedStorage.assets.config.characterRollConfig)
		for name, rar in pairs(rc.rarityByCharacter or {}) do
			cfg.characterRarity[tostring(name)] = tostring(rar)
		end
	end)
	pcall(function()
		local stc = require(ReplicatedStorage.assets.config.characterSkillTreeConfig)
		cfg.skillTree.maxLevel = tonumber(stc.maxLevel) or 110
		for _, b in ipairs(stc.branchOrder) do cfg.skillTree.branchOrder[#cfg.skillTree.branchOrder+1] = tostring(b) end
		local sample = nil
		for _, ch in pairs(stc.characters) do sample = ch break end
		if sample and sample.branches then
			for bname, bdef in pairs(sample.branches) do
				local tiers = {}
				for i = 1, 5 do
					local t = bdef.tiers and bdef.tiers[i]
					local buff = t and t.buffs and t.buffs[1] or nil
					tiers[#tiers+1] = { title = t and tostring(t.title) or ("Tier " .. i), cost = t and tonumber(t.cost) or 0, desc = t and tostring(t.description or "") or "", buffType = buff and tostring(buff.Type or "") or "", buffPercent = buff and (tonumber(buff.Percent) or 0) or 0 }
				end
				cfg.skillTree.branches[tostring(bname)] = { icon = tostring(bdef.icon or ""), tiers = tiers }
			end
		end
	end)
	GAME_STATIC = cfg
	return GAME_STATIC
end

-- ============================================================
-- ผู้ช่วย: อ่านค่าจาก store เกม (dime API: .current / :get())
-- ============================================================
local function readValue(v)
	if v == nil then return nil end
	if type(v) ~= "table" then return v end
	if rawget(v, "current") ~= nil then return v.current end
	if type(v.get) == "function" then
		local ok, res = pcall(v.get, v)
		if ok then return res end
	end
	if rawget(v, "_value") ~= nil then return v._value end
	return nil
end

local function toNum(x)
	if x == nil then return 0 end
	local n = tonumber(tostring(x))
	return n or 0
end

-- base64 encoder (HttpService:Base64Encode โดน block ในบาง executor)
local function b64encode(data)
	local chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
	local out = {}
	for i = 1, #data, 3 do
		local a, b, c = data:byte(i) or 0, data:byte(i + 1) or 0, data:byte(i + 2) or 0
		local n = a * 65536 + b * 256 + c
		out[#out + 1] = chars:sub(math.floor(n / 262144) % 64 + 1, math.floor(n / 262144) % 64 + 1)
			.. chars:sub(math.floor(n / 4096) % 64 + 1, math.floor(n / 4096) % 64 + 1)
			.. chars:sub(math.floor(n / 64) % 64 + 1, math.floor(n / 64) % 64 + 1)
			.. chars:sub(n % 64 + 1, n % 64 + 1)
	end
	local pad = (3 - (#data % 3)) % 3
	local s = table.concat(out)
	if pad > 0 then s = s:sub(1, #s - pad) .. string.rep("=", pad) end
	return s
end

local BASE_XP = 100
local GROWTH = 1.035
local MAX_LEVEL = 110
local function levelFromXp(xpRaw)
	local xp = toNum(xpRaw)
	if xp <= 0 then return 1 end
	local total, level = 0, 1
	while level < MAX_LEVEL do
		total = total + BASE_XP * (GROWTH ^ (level - 1))
		if xp < total then return level end
		level = level + 1
	end
	return MAX_LEVEL
end

-- ============================================================
-- Progression จริงของเกม (player level / character level)
-- ============================================================
local PROG = nil -- cache { levelProgression, charLevelProgression }
local function getProgression()
	if PROG ~= nil then return PROG end
	PROG = { level = nil, charLevel = nil }
	pcall(function()
		local lp = require(ReplicatedStorage.global.utils.levelProgression)
		if type(lp) == "table" and type(lp.getProgress) == "function" then
			PROG.level = lp
		end
	end)
	pcall(function()
		local cl = require(ReplicatedStorage.global.utils.characterLevelProgression)
		if type(cl) == "table" and type(cl.getLevel) == "function" then
			PROG.charLevel = cl
		end
	end)
	return PROG
end

local DIFFICULTY_NAMES = { [1] = "Easy", [2] = "Medium", [3] = "Hard", [4] = "Nightmare" }
local function difficultyName(n)
	return DIFFICULTY_NAMES[tonumber(n)] or ("Difficulty " .. tostring(n))
end

local function colorToHex(c)
	if typeof(c) == "Color3" then
		return string.format("#%02X%02X%02X",
			math.floor(c.R * 255 + 0.5), math.floor(c.G * 255 + 0.5), math.floor(c.B * 255 + 0.5))
	end
	return ""
end

-- ============================================================
-- Run state (runStore) + runHistory collector
-- ============================================================
local runStoreLib = nil
local runCaptured = false -- กันบันทึกรอบเดิมซ้ำ (ในโหมด push ซ้ำ)
local function getRunStore()
	if runStoreLib ~= nil then return runStoreLib end
	pcall(function()
		local gs = ReplicatedStorage:FindFirstChild("game")
		if gs then runStoreLib = require(gs.stores.runStore) end
	end)
	return runStoreLib
end

local function readRunState()
	local lib = getRunStore()
	if not lib or not lib.store or not lib.store.state then return nil end
	local st = lib.store.state
	local function rv(v)
		if v == nil then return nil end
		if type(v) ~= "table" then return v end
		if rawget(v, "current") ~= nil then return v.current end
		if type(v.get) == "function" then
			local ok, res = pcall(v.get, v)
			if ok then return res end
		end
		if rawget(v, "_value") ~= nil then return v._value end
		return nil
	end
	local out = {
		status = rv(st.status) or "waiting",
		wave = toNum(rv(st.wave)),
		waveCount = toNum(rv(st.waveCount)),
		chapter = toNum(st.chapter and readValue(st.chapter)),
		difficulty = toNum(rv(st.difficulty)),
		area = toNum(rv(st.area)),
		areaCount = toNum(rv(st.areaCount)),
		remaining = toNum(st.remaining and readValue(st.remaining)),
		startedAt = rv(st.startedAt),
		finishedAt = rv(st.finishedAt),
	}
	return out
end

-- ============================================================
-- runHistory: บันทึก "ตอนจบรัน" (participant status ≠ active) พร้อม drops จริง
-- ============================================================
local MAT_CONFIG_CACHE = nil -- nil = ยังไม่โหลด, false = โหลดไม่ได้
local function getMatConfig()
	if MAT_CONFIG_CACHE == nil then
		local ok, cfg = pcall(function() return require(ReplicatedStorage.assets.config.materialConfig) end)
		MAT_CONFIG_CACHE = (ok and type(cfg) == "table") and cfg or false
	end
	return MAT_CONFIG_CACHE or nil
end
local function buildRunHistory()
	local rs = readRunState()
	if not rs then return nil end
	local plr = Players.LocalPlayer
	local uid = plr and tostring(plr.UserId) or ""
	local entry = nil
	pcall(function()
		local lib = getRunStore()
		local pmap = readValue(lib.store.state.participants) or {}
		local me = pmap[uid]
		if me and readValue(me.status) ~= "active" then
			-- จบรันแล้ว (active → done/victory/failed/...) — เก็บได้
			runCaptured = true
			-- แยก drops "id:count" (เรียงเอาอันได้เยอะสุด 8 ชิ้น)
			local all = {}
			for id, cnt in tostring(readValue(me.materials) or ""):gmatch("(%d+):(%d+)") do
				all[#all + 1] = { id = id, n = tonumber(cnt) or 0 }
			end
			table.sort(all, function(a, b) return a.n > b.n end)
			local drops = {}
			for i = 1, math.min(#all, 8) do
				local mid = all[i].id
				local mcfg = getMatConfig()
				mcfg = mcfg and (mcfg[mid] or mcfg[tonumber(mid)]) or nil
				drops[#drops + 1] = {
					id = mid,
					name = mcfg and mcfg.Name or ("Material " .. mid),
					amount = all[i].n,
					icon = mcfg and mcfg.Icon or "",
					tier = mcfg and tonumber(mcfg.Tier) or 1,
				}
			end
			entry = {
				id = os.date("!%Y%m%d%H%M%S"),
				time = tostring(os.time()),
				result = tostring(readValue(me.status) or ""),
				chapter = rs.chapter,
				difficulty = difficultyName(rs.difficulty),
				area = rs.area,
				areaCount = rs.areaCount,
				wave = rs.wave,
				waveCount = rs.waveCount,
				duration = rs.startedAt and (toNum(rs.finishedAt or os.time()) - toNum(rs.startedAt)) or 0,
				kills = toNum(readValue(me.kills)),
				damage = toNum(readValue(me.damage)),
				earned = toNum(readValue(me.earned)) + toNum(readValue(me.bonus)),
				gems = toNum(readValue(me.gems)),
				xp = toNum(readValue(me.xp)),
				unit = tostring(readValue(me.unit) or ""),
				elapsed = toNum(readValue(me.elapsed)),
				wavesCleared = toNum(readValue(me.wavesCleared)),
				drops = drops,
			}
		end
	end)
	if entry then
		return { entry } -- entry เดียวที่เพิ่งจับได้ (server จะ merge append เอง)
	end
	return nil
end

-- ============================================================
-- ดึงข้อมูลบัญชีจากเกม (Anime Zero)
-- ============================================================
local function collectAccountData()
	local plr = Players.LocalPlayer
	if not plr then return nil end

	local AccountNS = ReplicatedStorage:FindFirstChild("global")
		and ReplicatedStorage.global:FindFirstChild("stores")
		and ReplicatedStorage.global.stores:FindFirstChild("accountNamespace")

	local accountStore = nil
	if AccountNS then
		local ok, lib = pcall(function() return require(AccountNS) end)
		if ok and lib and type(lib.getLocalPlayerAccount) == "function" then
			pcall(function() accountStore = lib.getLocalPlayerAccount() end)
		end
	end

	-- leaderstats (Level)
	local leaderstats = plr:FindFirstChild("leaderstats")
	local levelLS = leaderstats and leaderstats:FindFirstChild("Level")
	local leaderLevel = levelLS and toNum(levelLS.Value) or nil

	-- currencies
	local currencies = {}
	if accountStore and accountStore.state and accountStore.state.currencies then
		for _, key in ipairs({ "money", "gems", "rolls", "xp", "traitRerolls" }) do
			local v = accountStore.state.currencies[key]
			if v then
				local val = readValue(v)
				if val ~= nil then currencies[key] = val end
			end
		end
	end

	-- selected character
	local selected = nil
	if accountStore and accountStore.state then
		selected = readValue(accountStore.state.character)
	end

	-- unlocked characters (slots)
	local unlocked = {}
	if accountStore and accountStore.state and accountStore.state.UnlockedCharacters then
		for i = 1, 8 do
			local slot = accountStore.state.UnlockedCharacters["Slot" .. i]
			if slot then
				local name = readValue(slot.Character)
				local isUnl = readValue(slot.Unlocked)
				if name and name ~= "" then
					unlocked[#unlocked+1] = { slot = i, character = name, unlocked = isUnl }
				end
			end
		end
	end

	-- equipped accessories (gear ของเกมนี้คือ accessory เท่านั้น ไม่มี weapon)
	local equipped = {}
	pcall(function()
		local ea = accountStore and accountStore.state and accountStore.state.equippedAccessories
		if not ea then return end
		for _, key in ipairs({ "Neck", "Face", "Head", "Back" }) do
			local slot = ea[key]
			if slot then
				local v = readValue(slot)
				if type(v) == "table" then
					equipped[string.lower(key)] = {
						id = tostring(readValue(v.Id) or ""),
						name = tostring(readValue(v.Name) or ""),
						tier = tonumber(tostring(readValue(v.Tier) or "")) or 0,
					}
				elseif v ~= nil then
					equipped[string.lower(key)] = { id = tostring(v), name = "", tier = 0 }
				end
			end
		end
	end)

	-- player stats จริงจาก playerStatsNamespace (reactive cells)
	local stats = {}
	pcall(function()
		local psns = ReplicatedStorage.global.stores:FindFirstChild("playerStatsNamespace")
		if not psns then return end
		local pslib = require(psns)
		if type(pslib.getLocalPlayerStats) ~= "function" then return end
		local psStore = pslib.getLocalPlayerStats()
		local sst = psStore and psStore.state and psStore.state.stats
		if type(sst) ~= "table" then return end
		for _, key in ipairs({ "Damage", "Coins", "Critical Chance", "Critical Damage", "Defense", "Drop Rate", "Exp", "HP", "Walk Speed", "Attack Speed", "Cooldown Reduction" }) do
			local cell = sst[key]
			if cell then
				local val = readValue(cell)
				if val ~= nil then stats[key] = val end
			end
		end
	end)

	-- characters data (ทุกตัว + level/xp/ultimate/skills/traitId)

        local characters = {}
        if accountStore and accountStore.state and accountStore.state.CharactersData then
                for key, cd in pairs(accountStore.state.CharactersData) do
                        if key ~= "_order" and key ~= "_dirty" and type(cd) == "table" then
                                local prog = cd.Progression
                                local xp = prog and readValue(prog.Xp) or 0
                                local ultimate = cd.IsUltimateUnlocked ~= nil and readValue(cd.IsUltimateUnlocked) or false
                                local trait = ""
                                if cd.TraitData and cd.TraitData.Trait then
                                        local t = readValue(cd.TraitData.Trait)
                                        if t ~= nil then trait = tostring(t) end
                                end
                                local skillLv = {}
                                if prog and prog.Skills then
                                        for sk, sv in pairs(prog.Skills) do
                                                if type(sk) == "string" and type(sv) == "table" then
                                                        local cur = tonumber(tostring(sv.current or "")) or 1
                                                        skillLv[tostring(sk)] = cur
                                                end
                                        end
                                end
                                local cInfo = CHARACTERS[key] or { display = key, icons = {} }
                                local isActive = false
                                if selected ~= nil and tostring(selected) == key then isActive = true end
                                local traitId = 0
                                if cd.TraitData and cd.TraitData.Trait then
                                        local tv2 = readValue(cd.TraitData.Trait)
                                        traitId = tonumber(tostring(tv2)) or 0
                                end
                                characters[#characters+1] = {
                                        name = key,
                                        displayName = cInfo.display,
                                        level = levelFromXp(xp),
                                        xp = toNum(xp),
                                        ultimate = ultimate == true,
                                        trait = trait,
                                        traitId = traitId,
                                        skills = skillLv,
                                        active = isActive,
                                        assetId = cInfo.icons[1] or "",
                                }
                        end
                end
        end

        local rarityColors = {}
pcall(function()
        local RB = require(ReplicatedStorage.assets.config.RarityBox)
        if RB and RB.Colors then
                for name, cs in pairs(RB.Colors) do
                        local c = nil
                        if typeof(cs) == "ColorSequence" then
                                local okK, kps = pcall(function() return cs.Keypoints end)
                                if okK and type(kps) == "table" and #kps > 0 then c = kps[#kps].Value end
                        elseif typeof(cs) == "Color3" then
                                c = cs
                        elseif type(cs) == "table" then
                                c = cs.Primary or cs.Color or cs.Main
                        end
                        if typeof(c) == "Color3" then
                                rarityColors[tostring(name)] = string.format("#%02X%02X%02X",
                                        math.floor(c.R * 255 + 0.5), math.floor(c.G * 255 + 0.5), math.floor(c.B * 255 + 0.5))
                        end
                end
        end
end)


        -- รายการไอเทมในกระเป๋า (material) + รูปจาก config ของเกม
        local items = {}
        local matConfig = nil
        pcall(function()
                matConfig = require(ReplicatedStorage.assets.config.materialConfig)
        end)
        if accountStore and accountStore.state and accountStore.state.material
                and accountStore.state.material.entries then
                for id, v in pairs(accountStore.state.material.entries) do
                        local n = toNum(readValue(v))
                        if n > 0 then
                                local k = tostring(id)
                                local cfg = matConfig and (matConfig[k] or matConfig[tonumber(k)]) or nil
                                items[#items+1] = {
                                        id = k,
                                        name = cfg and cfg.Name or ("Material " .. k),
                                        count = n,
                                        icon = cfg and cfg.Icon or "",
                                        tier = cfg and tonumber(cfg.Tier) or 1,
                                }
                        end
                end
        end
        table.sort(items, function(a, b) return a.count > b.count end)

        -- items map: id → {name,tier,icon} (สำหรับ drops/รูปไอคอนฝั่งเว็บ)
        local itemsById = {}
        for _, it in ipairs(items) do itemsById[it.id] = { name = it.name, tier = it.tier, icon = it.icon } end

        -- player level + XP จริงจาก progression module ของเกม
        local playerProg = nil
        local playerLevel, playerXp = leaderLevel, toNum(currencies.xp or 0)
        pcall(function()
                local lp = getProgression().level
                if lp and currencies.xp then
                        local ok, res = pcall(lp.getProgress, toNum(currencies.xp))
                        if ok and type(res) == "table" then
                                playerProg = res
                                playerLevel = toNum(res.level)
                        end
                end
        end)

        -- ตัวละครที่สวมใส่ (equipped slot) — การ์ดจาก config จริงของเกม
        local characterCard = nil
        local charStats = { level = 0, xp = 0, skillLevels = {}, trait = 0 }
        pcall(function()
                local selKey = tostring(selected or "")
                if selKey == "" then return end
                local cd = accountStore.state.CharactersData and accountStore.state.CharactersData[selKey] or nil
                local conf = (require(ReplicatedStorage.global.constants.characters).charactersByName or {})[selKey]
                local prog = cd and cd.Progression
                local cxp = toNum(prog and readValue(prog.Xp) or 0)
                local cLevel = levelFromXp(cxp)
                pcall(function()
                        local cl = getProgression().charLevel
                        if cl then cLevel = tonumber(cl.getLevel(cxp)) or cLevel end
                end)
                local skLv = {}
                if prog and prog.Skills then
                        for sk, sv in pairs(prog.Skills) do
                                if type(sk) == "string" and type(sv) == "table" then
                                        skLv[tostring(sk)] = tonumber(tostring(sv.current or "")) or 1
                                end
                        end
                end
                charStats = {
                        level = cLevel,
                        xp = cxp,
                        skillLevels = skLv,
                        trait = tonumber(tostring(cd and cd.TraitData and readValue(cd.TraitData.Trait) or 0)) or 0,
                }
                local scheme = (conf and conf.colorScheme) or {}
                local gcfg = collectGameConfig()
                local skillList = {}
                if conf and type(conf.skills) == "table" then
                        for _, s in ipairs(conf.skills) do
                                skillList[#skillList+1] = {
                                        name = tostring(s.Name or s.name or "?"),
                                        desc = tostring(s.Description or s.description or ""),
                                }
                        end
                end
                characterCard = {
                        id = selKey,
                        displayName = (conf and conf.displayName) or (CHARACTERS[selKey] and CHARACTERS[selKey].display) or selKey,
                        description = (conf and conf.description) or "",
                        rarity = (gcfg and gcfg.characterRarity and gcfg.characterRarity[selKey]) or "",
                        colorPrimary = colorToHex(scheme.primary),
                        colorSecondary = colorToHex(scheme.secondary),
                        colorTertiary = colorToHex(scheme.tertiary),
                        level = cLevel,
                        xp = cxp,
                        trait = charStats.trait,
                        skills = skillList,
                }
        end)

        -- live run state (runStore ของเกม)
        local run = readRunState()

        -- matchStats (reactive cells: damage/kills/played/wins/deaths)
        local ms = {}
        pcall(function()
                local mst = accountStore.state.matchStats
                for _, key in ipairs({ "damage", "kills", "played", "wins", "deaths" }) do
                        local cell = mst and mst[key]
                        if cell then
                                local v = readValue(cell)
                                if v ~= nil then ms[key] = v end
                        end
                end
        end)



        -- Export รูปไอคอนจากในเกม (private asset → อ่านพิกเซล → base64 ใน field png)
        if CONFIG.SEND_ICON_PIXELS then
		local AssetService = game:GetService("AssetService")
		_G.PADUK_ICON_CACHE = _G.PADUK_ICON_CACHE or {}
		local exported = 0
		for _, it in ipairs(items) do
			if it.icon ~= "" and it.icon ~= nil and _G.PADUK_ICON_CACHE[it.id] == nil
				and exported < (CONFIG.ICON_MAX_PER_PUSH or 4) then
				exported = exported + 1
				pcall(function()
					local assetId = tostring(it.icon):match("%d+") or ""
					if assetId == "" then return end
					local img = AssetService:CreateEditableImageAsync("rbxassetid://" .. assetId)
					local w, h = img.Size.X, img.Size.Y
					local src = img:ReadPixelsBuffer(Vector2.new(0, 0), Vector2.new(w, h))
					local tw, th = 128, 128
					local tbuf = buffer.create(tw * th * 4)
					local bw, bh = math.floor(w / tw), math.floor(h / th)
					if bw < 1 then bw = 1 end
					if bh < 1 then bh = 1 end
					for ty = 0, th - 1 do
						for tx = 0, tw - 1 do
							local r, g, b, a = 0, 0, 0, 0
							for yy = 0, bh - 1 do
								for xx = 0, bw - 1 do
									local si = (((ty * bh + yy) * w) + (tx * bw + xx)) * 4
									r = r + buffer.readu8(src, si)
									g = g + buffer.readu8(src, si + 1)
									b = b + buffer.readu8(src, si + 2)
									a = a + buffer.readu8(src, si + 3)
								end
							end
							local cnt = bw * bh
							local ti = (ty * tw + tx) * 4
							buffer.writeu8(tbuf, ti, math.floor(r / cnt + 0.5))
							buffer.writeu8(tbuf, ti + 1, math.floor(g / cnt + 0.5))
							buffer.writeu8(tbuf, ti + 2, math.floor(b / cnt + 0.5))
							buffer.writeu8(tbuf, ti + 3, math.floor(a / cnt + 0.5))
						end
					end
					_G.PADUK_ICON_CACHE[it.id] = b64encode(buffer.tostring(tbuf))
				end)
			end
		end
		for _, it in ipairs(items) do
			local b64 = _G.PADUK_ICON_CACHE[it.id]
			if b64 then it.png = b64 end
                end
        end
        return {
                player = {
                        username = plr.Name,
                        displayName = plr.DisplayName,
                        userId = plr.UserId,
                        leaderstatsLevel = leaderLevel,
                        -- ระดับ + XP จริงจาก progression modules ของเกม
                        level = playerLevel,
                        xp = playerXp,
                        xpNeeded = playerProg and toNum(playerProg.requiredXp) or 0,
                        xpCurrent = playerProg and toNum(playerProg.currentXp) or 0,
                        isMaxLevel = playerProg and playerProg.isMaxLevel == true or false,
                },
                account = {
                        selectedCharacter = selected,
                        currencies = currencies,
                        unlockedCharacters = unlocked,
                        equippedAccessories = equipped,
                },
                character = characterCard,
                characterStats = charStats,
                playerStats = stats,
                matchStats = ms,
                characters = characters,
                rarityColors = rarityColors,
                items = items,
                itemsById = itemsById,
                gameConfig = collectGameConfig(),
        }
end

-- ============================================================
-- buildPayload — ประกอบ payload ทั้งหมด (run/runHistory รวมใน live)
-- ============================================================
local function buildPayload()
        local data = collectAccountData() or {}
        local runHist = buildRunHistory()
        local payload = {
                source = "padawan_bridge",
                game = "Anime Zero [Void Arbiter]",
                placeId = tostring(game.PlaceId or 0),
                collectedAt = os.time(),
                live = {
                        account = data.account,
                        characters = data.characters,
                        matchStats = data.matchStats,
                        items = data.items,
                        rarityColors = data.rarityColors,
                        player = data.player,
                        gameConfig = data.gameConfig,
                        -- === ของใหม่ ===
                        itemsById = data.itemsById,
                        run = data.run,
                        runHistory = runHist,
                },
        }
        return HttpService:JSONEncode(payload)
end
local lastPushOk = false

local function trySendHttp(url, payload)
        local attempts = {
                function()
                        return (type(request) == "function" and request or error("no request"))({
                                Url = url, Method = "POST",
                                Headers = { ["Content-Type"] = "application/json" },
                                Body = payload,
                        })
                end,
                function()
                        return (type(syn) == "table" and type(syn.request) == "function" and syn.request or error("no syn.request"))({
                                Url = url, Method = "POST",
                                Headers = { ["Content-Type"] = "application/json" },
                                Body = payload,
                        })
                end,
                function()
                        return (type(http_request) == "function" and http_request or error("no http_request"))({
                                Url = url, Method = "POST",
                                Headers = { ["Content-Type"] = "application/json" },
                                Body = payload,
                        })
                end,
                function()
                        return HttpService:RequestAsync({
                                Url = url, Method = "POST",
                                Headers = { ["Content-Type"] = "application/json" },
                                Body = payload,
                        })
                end,
                function()
                        HttpService:PostAsync(url, payload, Enum.HttpContentType.ApplicationJson)
                        return nil
                end,
        }
        for i, fn in ipairs(attempts) do
                local ok, res = pcall(fn)
                if ok then
                        local status = type(res) == "table" and (res.StatusCode or res.statusCode)
                        if status == nil or status < 400 or res.Success == true then
                                return true, i, status
                        end
                end
        end
        return false, nil, nil
end

local function push()
        local ok, json = pcall(buildPayload)
        if not ok then
                warn("[PADUK] buildPayload failed: " .. tostring(json))
                return
        end
        local url = CONFIG.URL_BASE .. CONFIG.INGEST_PATH
        local okSend, methodIdx, status = trySendHttp(url, json)
        if okSend then
                if not lastPushOk then
                        print(("[PADUK] OK sent (method#%d%s) -> %s"):format(
                                methodIdx, status and (" status=" .. status) or "", CONFIG.URL_BASE))
                end
                lastPushOk = true
        else
                lastPushOk = false
                warn("[PADUK] send failed - all HTTP methods blocked")
        end
end

-- ============================================================
-- เริ่มทำงาน
-- ============================================================
print("[PADUK] PADUK BRIDGE START — เริ่มส่งข้อมูลไป " .. CONFIG.URL_BASE)
push()
if CONFIG.RUN_ONCE then
        print("[PADUK] RUN_ONCE")
else
        while true do
                task.wait(CONFIG.PUSH_INTERVAL)
                push()
        end
end
