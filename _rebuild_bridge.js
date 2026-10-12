// fix characters data block in paduk_bridge.luau (clean rebuild) — v3
var fs = require("fs");
var pth = "c:/Users/patta/Downloads/paduk-shop-vscode/roblox_agent/paduk_bridge.luau";
var lns = fs.readFileSync(pth, "utf8").split("\n");
var s0 = -1, e0 = -1;
for (var q = 0; q < lns.length; q++) {
  if (lns[q].indexOf("-- characters data") !== -1) { s0 = q; break; }
}
for (var w = s0; w < lns.length; w++) {
  if (lns[w].indexOf("เรียง characters") !== -1) { e0 = w; break; }
}
var blk = [
'\t-- characters data (ทุกตัว + level/xp/ultimate/skills/traitId)',
'\tlocal characters = {}',
'\tif accountStore and accountStore.state and accountStore.state.CharactersData then',
'\t\tfor key, cd in pairs(accountStore.state.CharactersData) do',
'\t\t\tif key ~= "_order" and key ~= "_dirty" and type(cd) == "table" then',
'\t\t\t\tlocal prog = cd.Progression',
'\t\t\t\tlocal xp = prog and readValue(prog.Xp) or 0',
'\t\t\t\tlocal ultimate = cd.IsUltimateUnlocked ~= nil and readValue(cd.IsUltimateUnlocked) or false',
'\t\t\t\tlocal trait = ""',
'\t\t\t\tif cd.TraitData and cd.TraitData.Trait then',
'\t\t\t\t\tlocal t = readValue(cd.TraitData.Trait)',
'\t\t\t\t\tif t ~= nil then trait = tostring(t) end',
'\t\t\t\tend',
'\t\t\t\tlocal skillLv = {}',
'\t\t\t\tif prog and prog.Skills then',
'\t\t\t\t\tfor sk, sv in pairs(prog.Skills) do',
'\t\t\t\t\t\tif type(sk) == "string" and type(sv) == "table" then',
'\t\t\t\t\t\t\tlocal cur = tonumber(tostring(sv.current or "")) or 1',
'\t\t\t\t\t\t\tskillLv[tostring(sk)] = cur',
'\t\t\t\t\t\tend',
'\t\t\t\t\tend',
'\t\t\t\tend',
'\t\t\t\tlocal cInfo = CHARACTERS[key] or { display = key, icons = {} }',
'\t\t\t\tlocal traitId = 0',
'\t\t\t\tif cd.TraitData and cd.TraitData.Trait then',
'\t\t\t\t\tlocal tv2 = readValue(cd.TraitData.Trait)',
'\t\t\t\t\ttraitId = tonumber(tostring(tv2)) or 0',
'\t\t\t\tend',
'\t\t\t\tcharacters[#characters+1] = {',
'\t\t\t\t\tname = key,',
'\t\t\t\t\tdisplayName = cInfo.display,',
'\t\t\t\t\tlevel = levelFromXp(xp),',
'\t\t\t\t\txp = toNum(xp),',
'\t\t\t\t\tultimate = ultimate == true,',
'\t\t\t\t\ttrait = trait,',
'\t\t\t\t\ttraitId = traitId,',
'\t\t\t\t\tskills = skillLv,',
'\t\t\t\t\tassetId = cInfo.icons[1] or "",',
'\t\t\t\t}',
'\t\t\t\t}',
'\t\t\tend',
'\t\tend',
'\tend',
'',
];
var o2 = lns.slice(0, s0).concat(blk, lns.slice(e0));
fs.writeFileSync(pth, o2.join("\n"), "utf8");
console.log("total:", o2.length);
console.log(o2.slice(Math.max(0, s0 - 2), s0 + 42).join("\n"));
