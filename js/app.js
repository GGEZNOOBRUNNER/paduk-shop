/* Inline mock data. Replace these arrays with API responses when connecting a backend. */
const accounts = [
 {id:"AZ-118",username:"Sh***in49",status:"FARMING",game:"Anime Zero",package:"ฟาร์มทุกวัน 1 วัน",progress:72,slot:"PC-3:2",elapsed:"13h",issue:true,stale:false,wave:54,kills:12400,level:74,characters:14,items:128,lastUpdate:Date.now()}
];
const rounds = [
 {result:"win",map:"Anime Zero",badge:"CLEAR",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×42","Gold ×1.2K"],wave:11,duration:"00:38:24",date:"10/10/2026",time:"05:45",day:"วันนี้"},
 {result:"restart",map:"Anime Zero",badge:"RESTARTED",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×18","Trait Shard ×4"],wave:8,duration:"00:24:11",date:"10/10/2026",time:"05:02",day:"วันนี้"},
 {result:"win",map:"Anime Zero",badge:"CLEAR",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×42"],wave:11,duration:"00:37:09",date:"10/10/2026",time:"04:20",day:"วันนี้"},
 {result:"lose",map:"Anime Zero",badge:"DISCONNECTED",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Gold ×320"],wave:5,duration:"00:15:40",date:"10/10/2026",time:"03:41",day:"วันนี้"},
 {result:"restart",map:"Anime Zero",badge:"RESTARTED",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×21","Gold ×840"],wave:9,duration:"00:29:03",date:"10/10/2026",time:"03:10",day:"วันนี้"},
 {result:"win",map:"Anime Zero",badge:"CLEAR",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×39"],wave:11,duration:"00:36:51",date:"10/10/2026",time:"02:26",day:"วันนี้"},
 {result:"win",map:"Anime Zero",badge:"CLEAR",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×42","Gold ×1.1K"],wave:11,duration:"00:38:02",date:"09/10/2026",time:"23:48",day:"09/10/2026"},
 {result:"restart",map:"Anime Zero",badge:"RESTARTED",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×15"],wave:7,duration:"00:22:14",date:"09/10/2026",time:"23:12",day:"09/10/2026"},
 {result:"lose",map:"Anime Zero",badge:"FAILED",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Gold ×190"],wave:3,duration:"00:09:58",date:"09/10/2026",time:"22:44",day:"09/10/2026"},
 {result:"win",map:"Anime Zero",badge:"CLEAR",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×40"],wave:11,duration:"00:37:42",date:"09/10/2026",time:"22:02",day:"09/10/2026"},
 {result:"restart",map:"Anime Zero",badge:"RESTARTED",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Trait Shard ×3","Gold ×620"],wave:6,duration:"00:19:21",date:"09/10/2026",time:"21:29",day:"09/10/2026"},
 {result:"win",map:"Anime Zero",badge:"CLEAR",mode:"Story",difficulty:"Nightmare",chapter:"Ch.4",loot:["Shadow Fragment ×37","Gold ×900"],wave:11,duration:"00:35:18",date:"09/10/2026",time:"20:51",day:"09/10/2026"}
];
const characters = [
 {name:"Sukuna",element:"FIRE",rarity:"MYTHIC",level:42,stage:"Stage 2/3",xp:62,ult:true,trait:"Exotic",active:true},
 {name:"Sung Jinwoo",element:"DARK",rarity:"MYTHIC",level:74,stage:"Stage 3/3",xp:82,ult:true,trait:"Overlord",active:true},
 {name:"Killua",element:"LIGHT",rarity:"LEGENDARY",level:39,stage:"Stage 2/3",xp:44,ult:true,trait:"Swift",active:false},
 {name:"Gojo",element:"ICE",rarity:"MYTHIC",level:51,stage:"Stage 2/3",xp:62,ult:false,trait:"Exotic",active:false},
 {name:"Itadori",element:"FIRE",rarity:"EPIC",level:28,stage:"Stage 1/3",xp:35,ult:false,trait:"Powerful",active:false},
 {name:"Levi",element:"WIND",rarity:"LEGENDARY",level:42,stage:"Stage 2/3",xp:62,ult:true,trait:"Swift",active:false},
 {name:"Tanjiro",element:"WATER",rarity:"RARE",level:22,stage:"Stage 1/3",xp:19,ult:false,trait:"Focused",active:false},
 {name:"Shadow",element:"DARK",rarity:"MYTHIC",level:0,stage:"Locked",xp:0,ult:false,trait:"—",active:false,locked:true},
 {name:"Rimuru",element:"WATER",rarity:"LEGENDARY",level:0,stage:"Locked",xp:0,ult:false,trait:"—",active:false,locked:true},
 {name:"Eren",element:"EARTH",rarity:"EPIC",level:0,stage:"Locked",xp:0,ult:false,trait:"—",active:false,locked:true}
];
const drops = [
 {name:"Shadow Fragment",amount:42,rarity:"Legendary",map:"Anime Zero Ch.4",time:"05:45"},
 {name:"Trait Shard",amount:18,rarity:"Epic",map:"Anime Zero Ch.4",time:"05:02"},
 {name:"Gold",amount:1200,rarity:"Common",map:"Anime Zero Ch.4",time:"04:20"},
 {name:"Arcane Core",amount:3,rarity:"Mythic",map:"Anime Zero Ch.4",time:"03:41"},
 {name:"Shadow Fragment",amount:21,rarity:"Legendary",map:"Anime Zero Ch.4",time:"03:10"},
 {name:"Trait Shard",amount:7,rarity:"Rare",map:"Anime Zero Ch.4",time:"02:26"},
 {name:"Gold",amount:840,rarity:"Common",map:"Anime Zero Ch.4",time:"23:48"},
 {name:"Night Token",amount:2,rarity:"Mythic",map:"Anime Zero Ch.4",time:"23:12"}
];
const state={page:"dashboard",dashboardMode:"picker",selectedGame:null,detailTab:"history",selectedId:"AZ-118",listView:false,lang:"TH",dropView:"cards",charSearch:"",charStatus:"all",charSort:"level",dropSearch:"",online:true,loading:true,toastTimer:null};
/* expose ให้ live.js เข้าถึงได้ (const ใน classic script ไม่ผูกกับ window เอง) */
window.state=state;window.accounts=accounts;window.characters=characters;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
/* ---- เก็บ/กู้สถานะหน้าเว็บ (F5 แล้วกลับมาหน้าเดิม ไม่ต้องกดใหม่) ---- */
const PERSIST_KEYS=["page","dashboardMode","selectedGame","detailTab","selectedId","listView","lang","dropView","charSearch","charStatus","charSort","dropSearch"];
let suppressHash=false;
function saveState(){try{const o={};PERSIST_KEYS.forEach(k=>o[k]=state[k]);o.t=Date.now();localStorage.setItem("paduk_state",JSON.stringify(o));}catch(e){}}
function hashFromState(){
 const p=state.page;
 if(p==="detail")return "#/detail/"+encodeURIComponent(state.selectedId||"AZ-118")+"/"+encodeURIComponent(state.detailTab||"history");
 if(p==="public")return "#/public";
 if(p==="support")return "#/support";
 if(p==="shop")return "#/shop";
 if(state.dashboardMode==="workspace")return "#/game/"+encodeURIComponent(state.selectedGame||"Anime Zero")+"/"+encodeURIComponent(state.detailTab||"history");
 return "#/home";
}
function parseHash(){
 const h=(location.hash||"").replace(/^#\/?/,"");if(!h)return null;
 const seg=h.split("/").map(s=>decodeURIComponent(s));const o={};
 if(seg[0]==="home"){o.page="dashboard";o.dashboardMode="picker";}
 else if(seg[0]==="game"&&seg[1]){o.page="dashboard";o.dashboardMode="workspace";o.selectedGame=seg[1];if(seg[2])o.detailTab=seg[2];}
 else if(seg[0]==="detail"&&seg[1]){o.page="detail";o.selectedId=seg[1];o.detailTab=seg[2]||"history";}
 else if(seg[0]==="public"){o.page="public";}
 else if(seg[0]==="support"){o.page="support";}
 else if(seg[0]==="shop"){o.page="shop";}
 else return null;
 return o;
}
function writeHash(){saveState();const h=hashFromState();if(location.hash!==h){suppressHash=true;try{location.hash=h;}catch(e){}setTimeout(()=>suppressHash=false,0);}}
function restoreState(){
 try{
  const raw=localStorage.getItem("paduk_state");
  if(raw){const o=JSON.parse(raw);PERSIST_KEYS.forEach(k=>{if(o&&o[k]!==undefined&&o[k]!==null&&o[k]!=="")state[k]=o[k];});}
  const fromHash=parseHash();if(fromHash)Object.assign(state,fromHash);
 }catch(e){}
}
function restoreView(){
 const p=state.page;
 $("#dashboardPage").classList.toggle("hidden",p!=="dashboard");
 $("#detailPage").classList.toggle("hidden",p!=="detail");
 $("#publicPage").classList.toggle("hidden",p!=="public");
 $("#shopPage").classList.toggle("hidden",p!=="shop");
 $("#supportPage").classList.toggle("hidden",p!=="support");
 $("#topbar").classList.toggle("hidden",p==="public");
 $$(".navbtn").forEach(b=>b.classList.toggle("active",b.dataset.page===p));
 if(p==="detail")renderDetail();
 else if(p==="public")renderPublic();
 else if(p==="dashboard"){
  if(state.dashboardMode==="workspace"){
   $("#gamePicker").classList.add("hidden");$("#dashboardWorkspace").classList.remove("hidden");
   $("#selectedGameName").textContent=state.selectedGame||"Anime Zero";
   const gf=$("#gameFilter");if(gf)gf.value=state.selectedGame||"all";
   renderStats();renderAccounts();
  }else{$("#gamePicker").classList.remove("hidden");$("#dashboardWorkspace").classList.add("hidden");}
 }
 if(state.lang==="EN")applyLanguage();
}
window.addEventListener("hashchange",()=>{if(suppressHash)return;const o=parseHash();if(!o)return;Object.assign(state,o);restoreView();});
const statusText={FARMING:"FARMING",PENDING:"PENDING",DONE:"DONE",CANCEL:"CANCEL",STALE:"STALE"};
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(message){const host=$("#toastHost");host.innerHTML=`<div class="toast">${esc(message)}</div>`;clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>host.innerHTML="",3200);}
function fmtNumber(n){if(n>=1e12)return (n/1e12).toFixed(2)+"T";if(n>=1e9)return (n/1e9).toFixed(2)+"B";if(n>=1e6)return (n/1e6).toFixed(2)+"M";if(n>=1e3)return (n/1e3).toFixed(2)+"K";return String(n);}
function timeNow(){return new Date().toLocaleTimeString("en-GB",{hour12:false});}
function statusChip(a){const stale=a.stale?"STALE":a.status;return `<span class="status-chip status-${stale.toLowerCase()}"><span class="${stale==='FARMING'?'dot pulse':'dot'}"></span>${statusText[stale]||stale}</span>`;}
function showGamePicker(){state.dashboardMode="picker";state.selectedGame=null;writeHash();$("#gamePicker").classList.remove("hidden");$("#dashboardWorkspace").classList.add("hidden");$("#gameSearch").value="";filterGameCards();window.scrollTo({top:0,behavior:"smooth"});}
function filterGameCards(){const q=($("#gameSearch")?.value||"").trim().toLowerCase();$$('[data-select-game]').forEach(card=>{card.classList.toggle("hidden",!card.dataset.selectGame.toLowerCase().includes(q));});const visible=$$('[data-select-game]').some(card=>!card.classList.contains("hidden"));let empty=$("#gameSearchEmpty");if(!visible){if(!empty){empty=document.createElement("div");empty.id="gameSearchEmpty";empty.className="empty-state";empty.style.gridColumn="1/-1";empty.innerHTML='<div class="state-icon">⌕</div><strong>ไม่พบเกมที่ค้นหา</strong><span>ลองค้นหาด้วยชื่อ Anime Zero</span>';}$("#gameCards").appendChild(empty);}else empty?.remove();if(state.lang==="EN")applyLanguage();}
function selectGame(game){state.selectedGame=game;state.dashboardMode="workspace";writeHash();$("#gamePicker").classList.add("hidden");$("#dashboardWorkspace").classList.remove("hidden");$("#selectedGameName").textContent=game;$("#gameFilter").value=game;$("#accountSearch").value="";$("#statusFilter").value="all";renderStats();renderAccounts();if(state.lang==="EN")applyLanguage();window.scrollTo({top:0,behavior:"smooth"});}
function renderStats(){const stats=[["All Accounts",1,"▦",""],["Farming",1,"↻","farming-stat"],["Pending",0,"◷",""],["Completed",0,"✓",""],["Cancel",0,"×",""]];$("#statsGrid").innerHTML=stats.map(([label,num,icon,cls])=>`<article class="stat-card ${cls}"><span class="stat-icon">${icon}</span><div class="stat-label">${label}</div><div class="stat-number ${label==='Farming'?'green':label==='Completed'?'cyan':label==='Cancel'?'red':''}">${num}</div><div class="stat-foot">SERVICE / ${label.toUpperCase()}</div></article>`).join("");if(state.lang==="EN")applyLanguage();}
function renderCard(a){const st=a.stale?"STALE":a.status;return `<article class="account-card ${a.issue?'issue':''} ${a.stale?'stale':''}" data-account="${esc(a.id)}"><div class="account-top">${statusChip(a)}${a.issue?'<span class="issue-mark" title="มีปัญหาที่ต้องตรวจสอบ">!</span>':''}</div><div class="account-identity"><div class="avatar">${esc(a.username.slice(0,2).toUpperCase())}</div><div style="min-width:0"><div class="account-name">${esc(a.username)}</div><div class="account-sub mono">${esc(a.id)} · ${esc(a.slot)}</div></div></div><div class="game-row"><span class="game-icon">◈</span><span>${esc(a.game)} ${a.game==="Anime Zero"?"[SHADOW MONARCH]":""}</span></div><div class="package-row"><span>▣</span><span>${esc(a.package)}</span></div><div class="progress-wrap"><div class="progress-head"><span>PROGRESS</span><strong class="mono ${a.status==='FARMING'?'cyan':''}" data-live="${esc(a.id)}">${a.progress}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${a.progress}%"></div></div></div><div class="account-footer"><span>${esc(a.slot)}</span><span>·</span><span>${esc(a.elapsed)}</span><span class="spacer"></span><button class="text-btn" data-detail="${esc(a.id)}">Details →</button></div></article>`;}
function renderAccounts(){const q=$("#accountSearch").value.trim().toLowerCase(),game=$("#gameFilter").value,status=$("#statusFilter").value;const filtered=accounts.filter(a=>(!q||(a.username+" "+a.game+" "+a.id).toLowerCase().includes(q))&&(game==="all"||a.game===game)&&(status==="all"||(a.stale?"STALE":a.status)===status));const grid=$("#accountsGrid");grid.classList.toggle("account-list",state.listView);grid.innerHTML=filtered.length?filtered.map(renderCard).join(""):`<div class="empty-state" style="grid-column:1/-1"><div class="state-icon">⌕</div><strong>ไม่พบรายการที่ตรงกัน</strong><span>ลองเปลี่ยนคำค้นหาหรือตัวกรอง</span><br><button class="ghost-btn" id="clearFilters">ล้างตัวกรอง</button></div>`;if(state.lang==="EN")applyLanguage();}
function fmtDuration(sec){const s=Math.max(0,Math.floor(Number(sec)||0));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),ss=s%60;return h?`${h}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;}
function runResultKind(r){const res=String(r.result||"").toLowerCase();if(res==="win"||res==="victory"||res==="done"||res==="cleared")return "win";if(res==="restart"||res==="next")return "restart";return "lose";}
function runResultBadge(r){const res=String(r.result||"").toLowerCase();if(res==="win"||res==="done")return "CLEAR";if(res==="victory")return "VICTORY";if(res==="restart"||res==="next")return "RESTARTED";if(res==="failed"||res==="lose")return "FAILED";return String(r.result||"RUN").toUpperCase();}
function renderRoundRow(r,i){const kind=runResultKind(r),cls=kind,icon=kind==="win"?"✓":kind==="restart"?"↻":"✕";const loot=(r.drops||r.loot||[]);const lootHtml=loot.slice(0,2).map(x=>typeof x==="object"?`<span class="loot-pill" title="${esc(x.name)}">${esc(x.name)} ×${fmtNumber(x.amount)}</span>`:`<span class="loot-pill">${esc(x)}</span>`).join("");const moreHtml=loot.length>2?`<span class="loot-pill">+${loot.length-2}</span>`:"";const modeBits=[r.mode==="story"?"Story":(r.mode||"Story"),r.area?`Area ${r.area}${r.areaCount?"/"+r.areaCount:""}`:null].filter(Boolean);const metaBits=[r.wave?`Wave ${r.wave}${r.waveCount?"/"+r.waveCount:""}`:null,r.duration?fmtDuration(r.duration):null,r.kills?`${fmtNumber(r.kills)} kills`:""].filter(Boolean);return `<div class="round-row"><div class="round-icon ${cls}">${icon}</div><div><div class="round-map">${esc(r.map||"Anime Zero")} — Ch.${esc(r.chapter||"?")}${r.area?` · Area ${esc(r.area)}`:""}</div><div class="round-meta">${esc(runResultBadge(r))}${r.difficulty?` · ${esc(r.difficulty)}`:""}</div><div class="round-badges">${modeBits.map(b=>`<span>${esc(b)}</span>`).join("")}</div></div><div class="loot-pills">${lootHtml}${loot.length>2?`<span class="loot-pill">+${loot.length-2}</span>`:""}</div><div class="round-meta">${metaBits.map(p=>`<span>${esc(p)}</span>`).join(" · ")||"—"}</div><div class="round-date">${esc(r.date||"")}<small>${esc(r.time||"")}</small></div></div>`;}
function normaliseRunEntry(r){const t=Number(r.time);const d=t>0?new Date(t*1000):null;return {result:r.result||"done",mode:r.mode||"story",difficulty:r.difficulty||"",chapter:r.chapter||"?",area:r.area||null,areaCount:r.areaCount||null,wave:r.wave||0,waveCount:r.waveCount||0,duration:r.duration||0,kills:r.kills||0,loot:(r.drops||[]).map(x=>`${x.name} ×${fmtNumber(x.amount)}`),drops:r.drops||[],date:d?d.toLocaleDateString("en-GB"):"",time:d?d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):"",day:d?(d.toLocaleDateString("th-TH",{day:"2-digit",month:"short",year:"numeric"})):""}}
function renderLiveRunChip(){const run=(window.livePacket&&window.livePacket.run)||null;if(!run||run.status!=="active")return "";const dn=diffName(num(run.difficulty));return `<div class="run-live-chip"><span class="dot pulse"></span> IN-RUN · Ch.${esc(run.chapter)} · Area ${esc(run.area||1)}/${esc(run.areaCount||5)} · Wave ${esc(run.wave)}/${esc(run.waveCount||3)} · ${esc(dn)}</div>`;}
function diffName(n){return ["Easy","Medium","Hard","Nightmare"][Math.max(1,Math.min(4,Math.floor(num(n))))-1]||"";}
function renderPlayerCard(){
 const lp=window.livePacket;if(!lp||!lp.player)return "";
 const p=lp.player,ch=lp.character||null,cur=lp.currencies||{};
 const lv=num(p.level||p.leaderstatsLevel||0);
 const pct=(num(p.xpCurrent)/Math.max(1,num(p.xpNeeded)))*100;
 const col=(ch&&ch.colorPrimary)||"var(--gold)";
 const rarity=(ch&&ch.rarity)||"";
 const rc=(window.RARITY_COLORS&&window.RARITY_COLORS[rarity])||"var(--gold2)";
 const sk=(ch&&ch.skillLevels)||{};
 const curDefs=[["money","\u0E40\u0E07\u0E34\u0E19 (Zeni)","gold"],["gems","\u0E2D\u0E31\u0E0D\u0E21\u0E13\u0E35 (Gems)","magenta"],["rolls","\u0E2A\u0E1B\u0E34\u0E19 Rolls","cyan"]];
 return `<div class="panel player-card" style="--pc:${col}"><div class="player-card-top"><div class="player-avatar" style="--pc:${col}">${esc((p.username||"?").slice(0,2).toUpperCase())}</div><div class="player-id"><div class="player-name">${esc(p.username||"\u2014")} <span class="player-lv">Lv.${lv}</span></div><div class="player-xpbar"><div class="player-xpfill" style="width:${Math.min(100,pct)}%"></div></div><div class="player-xptext mono">${fmtNumber(num(p.xpCurrent))} / ${fmtNumber(num(p.xpNeeded))} XP</div></div><div class="player-cur">${curDefs.map(d=>`<div class="pcur"><span>${esc(d[1])}</span><b class="${d[2]}">${fmtNumber(num(cur[d[0]]))}</b></div>`).join("")}</div></div>${ch?`<div class="player-char"><div class="pc-avatar" style="--pc:${col}">${esc((ch.displayName||"?")[0]||"?")}</div><div class="pc-main"><div class="pc-name">${esc(ch.displayName||ch.id)}<span class="pc-rarity" style="--rc:${(window.RARITY_COLORS&&window.RARITY_COLORS[rarity])||col}">${esc(rarity)}</span></div><div class="pc-sub">Lv.${num(ch.level)} \u00b7 Trait #${num(ch.trait)} \u00b7 ATK/CRIT/DEF/SPD ${num((ch.skillLevels||{}).ATK)||1}/${num((ch.skillLevels||{}).CRIT)||1}/${num((ch.skillLevels||{}).DEF)||1}/${num((ch.skillLevels||{}).SPD)||1}</div></div></div>`:""}</div>`;}
function traitCard(c){
 const info=c.traitInfo;
 if(!info)return `<div class="trait trait-none">TRAIT · ยังไม่มีทีเรท</div>`;
 const icon=String(info.icon||"").replace(/\D/g,"");
 const col=rarityColor[info.rarity]||"#D94BE0";
 return `<div class="trait trait-rich" style="--trc:${col}"><span class="trait-icon"><img src="https://thumbnails.roblox.com/v1/assets?assetIds=${icon}&size=150x150&format=Png&isCircular=false" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noicon')"></span><span class="trait-name">${esc(info.name)}</span><span class="trait-buff">${esc(info.buffType)} +${esc(String(info.buffPercent))}%</span></div>`;
}
function traitChip(c){return traitCard(c);}
function evoChip(c){
 if(c.ult)return `<div class="evo-chip evo-yes"><span class="evo-dot"></span>อีโวแล้ว · AWAKENED</div>`;
 const btn=c.locked?"":`<button class="evo-detail-btn" data-char-detail="${esc(c.rawName||c.name)}">ดูสิ่งที่ต้องใช้ →</button>`;
 return `<div class="evo-chip evo-no"><span>✕ ยังไม่อีโว</span>${btn||""}</div>`;
}
function renderCharCard(c){const rc=rarityColor[c.rarity]||"#93A1B5";return `<article class="char-card ${c.locked?'locked':''}" style="--rarity:${rc}"><div class="char-portrait" style="${c.image?`background-image:url('${c.image}');`:''}background-size:contain;background-repeat:no-repeat;background-position:center bottom;"><span class="ult ${c.ult?"":"ult-off"}">${c.ult?"ULT ✓":"ULT 🔒"}</span></div><div class="char-name" title="${esc(c.name)}">${esc(c.name)}</div><div class="char-tags"><span class="rarity-tag" style="color:${rc};border-color:${rc}55">${esc(c.rarity)}</span></div><div class="char-level"><span>Lv ${c.level}</span><span>${c.xp}% XP</span></div><div class="char-xp"><span style="width:${c.xp}%"></span></div><div class="char-level"><span>${esc(c.stage)}</span></div>${evoChip(c)}${traitChip(c)}<button class="char-action" data-char="${esc(c.name)}" data-char-raw="${esc(c.rawName||'')}">${c.locked?"ยังไม่ปลดล็อก":"ดูสกิลทรี →"}</button></article>`;}
function renderCharacters(){const allChars=(window.characters&&window.characters.length)?window.characters:characters;let arr=allChars.filter(c=>(!state.charSearch||c.name.toLowerCase().includes(state.charSearch.toLowerCase()))&&(state.charStatus==="all"||(state.charStatus==="active"&&c.active)||(state.charStatus==="locked"&&c.locked)||(state.charStatus==="unlocked"&&!c.locked)));arr.sort((a,b)=>state.charSort==="name"?a.name.localeCompare(b.name):b.level-a.level);const active=arr.filter(c=>c.active),locked=arr.filter(c=>c.locked),all=arr.filter(c=>!c.active&&!c.locked);return `<div class="toolbar compact"><div class="search-wrap"><span class="search-icon">⌕</span><input class="field" id="charSearch" placeholder="ค้นหาตัวละคร..." value="${esc(state.charSearch)}"></div><select class="field select-field" id="charStatus"><option value="all" ${state.charStatus==="all"?"selected":""}>ทุกสถานะ</option><option value="active" ${state.charStatus==="active"?"selected":""}>ใช้งานอยู่</option><option value="unlocked" ${state.charStatus==="unlocked"?"selected":""}>ปลดล็อกแล้ว</option><option value="locked" ${state.charStatus==="locked"?"selected":""}>ยังไม่ปลดล็อก</option></select><select class="field select-field" id="charSort"><option value="level" ${state.charSort==="level"?"selected":""}>เรียงตาม Level</option><option value="name" ${state.charSort==="name"?"selected":""}>เรียงตามชื่อ</option></select></div>${active.length?`<div class="subsection">ใช้งานอยู่ <span class="muted mono">${active.length}</span></div><div class="char-grid">${active.map(renderCharCard).join("")}</div>`:""}${all.length?`<div class="subsection">ทั้งหมด <span class="muted mono">${all.length}</span></div><div class="char-grid">${all.map(renderCharCard).join("")}</div>`:""}${locked.length?`<div class="subsection">ยังไม่ปลดล็อก <span class="muted mono">${locked.length}</span></div><div class="char-grid">${locked.map(renderCharCard).join("")}</div>`:""}${!arr.length?`<div class="empty-state"><strong>ไม่พบตัวละคร</strong>ลองเปลี่ยนตัวกรอง</div>`:""}`;}
/* สีระดับความหายาก — ใช้สีจริงจากเกม (live) ถ้ามี ไม่งั้น fallback เดิม */
const rarityColor={Common:"#93A1B5",Uncommon:"#7ED957",Rare:"#35C8F5",Epic:"#B18AFF",Legendary:"#FFC53D",Mythic:"#D94BE0",Arcane:"#41D0FF",Zenless:"#FF49A0"};
window.RARITY_COLORS=rarityColor; /* ให้ live.js อัปเดตสีจากเกมได้ */
const traitIconCache={};
function traitIconUrl(icon){
 if(!icon)return "";
 if(traitIconCache[icon])return traitIconCache[icon];
 const id=String(icon).replace(/\D/g,"");
 if(!id)return "";
 const url="https://thumbnails.roblox.com/v1/assets?assetIds="+id+"&size=150x150&format=Png&isCircular=false";
 traitIconCache[icon]="";
 fetch(url).then(r=>r.json()).then(j=>{const u=j&&j.data&&j.data[0]&&j.data[0].imageUrl;if(u){traitIconCache[icon]=url;const st=state.detailTab;showTab(st);}}).catch(()=>{});
 return "";
}
function getStackedDrops(){
 const map=new Map();
 drops.forEach((d,index)=>{
  const key=[d.name,d.rarity,d.map].join('|');
  if(!map.has(key))map.set(key,{...d,dropCount:1,firstIndex:index});
  else{const item=map.get(key);item.amount+=d.amount;item.dropCount+=1;if(d.time>item.time)item.time=d.time;}
 });
 return [...map.values()].sort((a,b)=>a.firstIndex-b.firstIndex);
}
function dropGlyph(name){if(name.includes('Shadow'))return '✦';if(name.includes('Trait'))return '◇';if(name==='Gold')return '◈';if(name.includes('Arcane'))return '⬡';if(name.includes('Night'))return '☾';return '✧';}
function renderDropCard(d){
 const col=rarityColor[d.rarity]||'#93A1B5';
 const key=d.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
 const art=d.image?`<img class="drop-art-img" src="${esc(d.image)}" alt="${esc(d.name)}" loading="lazy" referrerpolicy="no-referrer">`:`<span class="drop-art-mark">${dropGlyph(d.name)}</span>`;
 return `<article class="drop-card drop-${key}" style="--rarity:${col}">
  <div class="drop-art">
   <span class="drop-rarity">${esc(d.rarity.toUpperCase())}</span>
   ${art}
   <span class="drop-art-orbit orbit-one"></span><span class="drop-art-orbit orbit-two"></span>
   <span class="drop-kind">${d.dropCount>1?`${d.dropCount} DROPS`:'ITEM DROP'}</span>
  </div>
  <div class="drop-body">
   <div class="drop-name" title="${esc(d.name)}">${esc(d.name)}</div>
   <div class="drop-subline"><span class="drop-source">${esc(d.map)}</span>${d.dropCount>1?`<span class="duplicate-chip">×${d.dropCount} รวมแล้ว</span>`:''}</div>
  </div>
  <div class="drop-footer"><div class="drop-amount">×${fmtNumber(d.amount)}</div><div class="drop-time mono">${esc(d.time||'')}</div></div>
 </article>`;
}
function renderDrops(){
 const RARITY_ORDER=["Common","Epic","Legendary","Mythic","Arcane","Zenless"];
 const liveArr=(window.liveInventory&&window.liveInventory.length)?window.liveInventory:null;
 let stackedList;
 if(liveArr){
  const rmap=new Map();
  liveArr.forEach(d=>{
   const key=d.name;
   if(!rmap.has(key))rmap.set(key,{name:d.name,amount:d.amount,rarity:d.rarity,map:d.map,time:"",image:d.image||"",dropCount:1,firstIndex:0});
   else{const it=rmap.get(key);it.amount+=d.amount;it.image=it.image||d.image;}
  });
  stackedList=[...rmap.values()].sort((a,b)=>{
   const ra=RARITY_ORDER.indexOf(a.rarity),rb=RARITY_ORDER.indexOf(b.rarity);
   return (ra<0?99:ra)-(rb<0?99:rb)||b.amount-a.amount||a.name.localeCompare(b.name);
  });
 }
 else stackedList=getStackedDrops();
 const foundRarities=[...new Set(stackedList.map(d=>d.rarity))].sort((a,b)=>((RARITY_ORDER.indexOf(a)<0?99:RARITY_ORDER.indexOf(a))-(RARITY_ORDER.indexOf(b)<0?99:RARITY_ORDER.indexOf(b))));
 const rarity=liveArr?foundRarities:RARITY_ORDER;
 const summary=rarity.map(r=>`<span class="rarity-summary"><i style="--rarity:${rarityColor[r]||'#93A1B5'}"></i>${r}<b style="color:${rarityColor[r]||'#93A1B5'}">${stackedList.filter(d=>d.rarity===r).length}</b></span>`).join('');
 const rows=stackedList.filter(d=>!state.dropSearch||d.name.toLowerCase().includes(state.dropSearch.toLowerCase())||d.rarity.toLowerCase().includes(state.dropSearch.toLowerCase()));
 const total=stackedList.reduce((sum,d)=>sum+d.amount,0);
 const heading=liveArr
  ?`<h3 class="section-title">ไอเทมในกระเป๋า</h3><div class="section-sub">จากบัญชีจริง · พร้อมรูปไอเทม · รวมของซ้ำเป็นกองเดียว</div>`
  :`<h3 class="section-title">ของที่ได้รับ</h3><div class="section-sub">รวมของซ้ำเป็นกองเดียว · แยกสีตามระดับความหายาก</div>`;
 const sourceCol=liveArr?'ไอเทม':'แมพ';
 const timeCol=liveArr?'จำนวน':'ได้มาเมื่อ';
 return `<div class="section-head drop-section-head"><div>${heading}</div><div class="drop-total"><strong>${stackedList.length} STACKS</strong><span>รวม ${fmtNumber(total)} ชิ้น</span></div></div>
 <div class="drop-summary drop-summary-new">${summary}</div>
 <div class="toolbar compact drop-toolbar"><div class="search-wrap"><span class="search-icon">⌕</span><input class="field" id="dropSearch" placeholder="ค้นหาชื่อไอเทมหรือระดับ..." value="${esc(state.dropSearch)}"></div><div class="view-switch"><button id="dropCards" class="${state.dropView==='cards'?'active':''}">▦ แบบการ์ด</button><button id="dropList" class="${state.dropView==='list'?'active':''}">☷ แบบรายการ</button></div></div>
 ${state.dropView==='cards'?`<div class="drop-grid drop-grid-premium">${rows.map(renderDropCard).join('')}</div>`:`<div class="table-wrap"><table class="data-table"><thead><tr><th>ชื่อไอเทม</th><th>ระดับ</th><th>จำนวนรวม</th><th>${timeCol}</th><th>${sourceCol}</th></tr></thead><tbody>${rows.map(d=>`<tr><td>${liveArr&&d.image?`<img class="drop-table-img" src="${esc(d.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:''}<span class="drop-table-mark" style="--rarity:${rarityColor[d.rarity]}">${dropGlyph(d.name)}</span>${esc(d.name)} ${d.dropCount>1?`<span class="duplicate-chip">${d.dropCount} DROPS</span>`:''}</td><td><span class="mini-chip" style="color:${rarityColor[d.rarity]}">${esc(d.rarity.toUpperCase())}</span></td><td class="mono" style="color:${rarityColor[d.rarity]}">×${fmtNumber(d.amount)}</td><td class="mono">${liveArr?`×${fmtNumber(d.amount)}`:`${esc(d.time)}`}</td><td>${esc(d.map)}</td></tr>`).join('')}</tbody></table></div>`}
 ${!rows.length?`<div class="empty-state"><div class="state-icon">⌕</div><strong>ไม่พบไอเทมที่ค้นหา</strong><span>ลองค้นหาด้วยชื่อไอเทมหรือระดับความหายาก</span></div>`:''}`;
}
const statsRows=[["Damage","3.4","▲ 1.0",true],["Critical Chance","45%","▲ 5%",true],["Critical Damage","180%","▲ 20%",true],["Attack Speed","1.2","▲ 0.2",true],["HP","5,200","▲ 1,200",true],["Defense","310","▲ 40",true],["Drop Rate","65%","▲ 10%",true],["Coins","120","▲ 45",true],["Exp","90","▲ 15",true],["Cooldown Reduction","18%","▲ 3%",true],["Walk Speed","24","▼ 2",false]];
function renderEconomy(){const currencies=[["ZENI","1,284,000","TOTAL BALANCE","gold"],["GEMS","63","PREMIUM CURRENCY","cyan"],["XP","412.3K","TOTAL EXPERIENCE",""],["ROLLS","4","Lucky Spins 2 · Trait Rerolls 7","magenta"]];const pity=[["Arcane",34,70],["Mythic",12,80],["Zenless",5,60],["Trait Legendary",3,10]];return `<div class="currency-grid">${currencies.map(c=>`<article class="currency-card"><div class="currency-label">${c[0]}</div><div class="currency-value ${c[3]}">${c[1]}</div><div class="currency-sub">${c[2]}</div></article>`).join("")}</div><div class="section-head"><div><h3 class="section-title">Pity Progress</h3><div class="section-sub">ความคืบหน้าก่อนถึงการันตี</div></div><span class="eyebrow">4 TRACKERS</span></div><div class="pity-grid">${pity.map(p=>`<div class="pity-card"><div class="pity-head"><span>${p[0]}</span><span>${p[1]} / ${p[2]}</span></div><div class="pity-fill"><span style="width:${p[1]/p[2]*100}%"></span></div></div>`).join("")}</div><div class="section-head"><div><h3 class="section-title">Combat Stats</h3><div class="section-sub">เทียบกับค่าตอนเริ่มงาน</div></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>STAT</th><th>ปัจจุบัน</th><th>DELTA</th></tr></thead><tbody>${statsRows.map(r=>`<tr><td>${r[0]}</td><td class="mono">${r[1]}</td><td class="mono ${r[3]?'green':'red'}">${r[2]}</td></tr>`).join("")}</tbody></table></div>`;}
function renderRaid(){return `<div class="raid-grid"><article class="panel raid-card"><div class="eyebrow">RAID / ROTATION</div><h3 class="raid-title">BathTub</h3><div class="raid-stats"><div class="raid-stat"><label>TRIES LEFT</label><strong class="gold">3 / ∞ ครั้ง</strong></div><div class="raid-stat"><label>PITY</label><strong class="cyan">0 / 32</strong></div><div class="raid-stat" style="grid-column:1/-1"><label>รีไฟล์ใน</label><strong class="mono countdown" data-seconds="15153">04:12:33</strong></div></div></article><article class="panel raid-card"><div class="eyebrow">DAILY / REWARD</div><h3 class="raid-title">Daily Reward</h3><div class="muted" style="font-size:11px">รับแล้ว <span class="green mono">4/7</span></div><div class="days">${["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d,i)=>`<div class="day-box ${i<4?'claimed':''}">${d}<b>${i<4?'✓':i+1}</b></div>`).join("")}</div><div class="raid-stat"><label>รับรางวัลถัดไปใน</label><strong class="mono countdown" data-seconds="22811">06:20:11</strong></div></article></div>`;}
function detailTabs(){const tCount=(window.liveInventory&&window.liveInventory.length)||'128';const tabs=state.lang==="EN"?[["history","Run History","40"],["characters","Characters","14"],["drops","Inventory",tCount],["economy","Stats",""],["raid","Quests","2"]]:[["history","ประวัติการลง","40"],["characters","ตัวละคร","14"],["drops","กระเป๋า",tCount],["economy","สถิติ",""],["raid","เควส","2"]];return `<div class="detail-tabs">${tabs.map(t=>`<button class="detail-tab ${state.detailTab===t[0]?'active':''}" data-detail-tab="${t[0]}">${t[1]} ${t[2]?`<span>${t[2]}</span>`:""}</button>`).join("")}</div>`;}
function renderDetailContent(){switch(state.detailTab){case"history":return renderHistory();case"characters":return renderCharacters();case"drops":return renderDrops();case"economy":return renderEconomy();case"raid":return renderRaid();default:return renderHistory();}}
function renderDetail(){const a=accounts.find(x=>x.id===state.selectedId)||accounts[0];$("#detailLayout").innerHTML=`<aside class="panel detail-rail"><div class="rail-top"><button class="back-btn" data-page="dashboard">← BACK</button>${statusChip(a)}</div><div class="rail-profile"><div class="avatar large">${esc(a.username.slice(0,2).toUpperCase())}</div><div><div class="account-name">${esc(a.username)}</div><div class="rail-meta">${esc(a.slot)} <span class="gold">| ! about 13 hours ago</span></div></div></div><div class="alert-box"><strong>! ยังไม่มีความคืบหน้ามา 12 ชั่วโมง 54 นาที</strong><div class="sub">เกมอาจค้างหรือโดน kick กรุณาแจ้งแอดมินใน Ticket</div></div><div class="package-panel"><div class="label">CURRENT PACKAGE</div><div class="package-title">ฟาร์มทุกวัน 1 วัน</div><div class="package-game">Anime Zero</div></div><div><div class="time-left"><span class="muted">TIME LEFT</span><strong>0d 18h 10m (24%)</strong></div><div class="progress-track"><div class="progress-fill" style="width:24%"></div></div></div><div class="tiny-note">เวลานี้เฉพาะรอบที่หมดเท่านั้น (ยกเว้นงานใหม่)</div><div class="mini-stats"><div class="mini-stat"><label>LEVEL</label><strong class="cyan">74</strong></div><div class="mini-stat"><label>ตัวละคร</label><strong class="gold">14</strong></div><div class="mini-stat"><label>ITEMS</label><strong class="green">128</strong></div></div><div class="panel summary-box"><div class="section-title" style="font-size:13px">สรุปก่อน/หลังเริ่มงาน</div><div class="delta-grid"><div class="delta-chip">Lv 61 → <b>74</b></div><div class="delta-chip">Zeni 742K → <b>1.28M</b></div><div class="delta-chip">kills <b>12.4K</b></div><div class="delta-chip">เวลา <b>6.5 ชม.</b></div></div></div></aside><div class="detail-main">${renderPlayerCard()}<section class="panel game-header"><div class="game-header-left"><div class="ingame"><span class="dot pulse"></span> IN-GAME</div><h2 class="map-title">Anime Zero</h2><div class="map-chips"><span>Story</span><span>Nightmare</span><span>Ch.4</span></div></div><div class="game-numbers"><div class="game-number"><label>WAVE</label><strong class="cyan" id="waveValue">${a.wave}</strong></div><div class="game-number"><label>WINS</label><strong class="gold" id="winsValue">0</strong></div></div></section>${detailTabs()}<div class="tab-content" id="detailTabContent">${renderDetailContent()}</div></div>`;if(state.lang==="EN")applyLanguage();}
function renderPublic(){const a=accounts.find(x=>x.id==="AZ-118")||accounts[0];$("#publicContent").innerHTML=`<div class="public-head"><div><h2 class="public-title">งานของคุณ: <span class="gold">AZ-118</span> · Anime Zero</h2><div class="public-sub">สถานะงานและความคืบหน้าสำหรับลูกค้า</div></div>${statusChip(a)}</div><div class="public-grid"><aside class="panel public-rail"><div class="rail-profile"><div class="avatar large">${esc(a.username.slice(0,2).toUpperCase())}</div><div><div class="account-name">${esc(a.username)}</div><div class="rail-meta">อัปเดตล่าสุด <span class="gold" id="publicUpdated">18:24:31</span></div></div></div><div class="package-panel"><div class="label">PACKAGE</div><div class="package-title">ฟาร์มทุกวัน 1 วัน</div><div class="package-game">Anime Zero</div></div><div><div class="time-left"><span class="muted">TIME LEFT</span><strong>0d 18h 10m (24%)</strong></div><div class="progress-track"><div class="progress-fill" style="width:${a.progress}%"></div></div></div><div class="mini-stats"><div class="mini-stat"><label>LEVEL</label><strong class="cyan">74</strong></div><div class="mini-stat"><label>ตัวละคร</label><strong class="gold">14</strong></div><div class="mini-stat"><label>ITEMS</label><strong class="green">128</strong></div></div></aside><section class="panel public-content">${renderPlayerCard()}<div class="game-header" style="padding:8px 0 16px;border:0;background:transparent"><div><div class="ingame"><span class="dot pulse"></span> IN-GAME</div><h2 class="map-title">Anime Zero</h2><div class="map-chips"><span>Story</span><span>Nightmare</span><span>Ch.4</span></div></div><div class="game-numbers"><div class="game-number"><label>WAVE</label><strong class="cyan" id="publicWave">${a.wave}</strong></div><div class="game-number"><label>WINS</label><strong class="gold">0</strong></div></div></div><div class="section-head"><div><h3 class="section-title">ประวัติรันล่าสุด</h3><div class="section-sub">แสดงรายการตัวอย่างล่าสุด</div></div><span class="history-count">40 MATCHES</span></div><div>${rounds.slice(0,5).map(renderRoundRow).join("")}</div></section></div><div class="public-footer"><span>ข้อมูลอัปเดตอัตโนมัติทุก 5 วินาที</span><button class="primary-btn" id="publicReport">ขอรายงานเพิ่มเติม →</button></div>`;if(state.lang==="EN")applyLanguage();}
function showPage(page){state.page=page;writeHash();["dashboard","detail","public","shop","support"].forEach(p=>$("#"+p+"Page").classList.toggle("hidden",p!==page));$("#topbar").classList.toggle("hidden",page==="public");$$(".navbtn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));if(page==="detail")renderDetail();if(page==="public")renderPublic();if(page==="dashboard"){if(state.dashboardMode==="picker"){ $("#gamePicker").classList.remove("hidden");$("#dashboardWorkspace").classList.add("hidden"); }else{$("#gamePicker").classList.add("hidden");$("#dashboardWorkspace").classList.remove("hidden");renderStats();renderAccounts();}}if(state.lang==="EN")applyLanguage();window.scrollTo({top:0,behavior:"smooth"});}
function showTab(tab){state.detailTab=tab;writeHash();const el=$("#detailTabContent");if(el)el.innerHTML=renderDetailContent();$("[data-detail-tab]").forEach(b=>b.classList.toggle("active",b.dataset.detailTab===tab));if(state.lang==="EN")applyLanguage();}
function renderHistory(){const live=window.livePacket&&window.livePacket.runHistory;if(live&&live.length){const entries=live.map(normaliseRunEntry);const rows=entries.map((r,i)=>{let divider="";if(i===0||r.day!==entries[i-1].day)divider=`<div class="day-divider">${esc(r.day)}</div>`;return divider+renderRoundRow(r,i);}).join("");return `<div class="panel history-panel">${renderLiveRunChip()}<div class="history-top"><div><h3 class="section-title">ประวัติรัน</h3><div class="history-note">จากบัญชีจริง · เก็บตอนจบรันพร้อมของที่ได้</div></div><div style="text-align:right"><div class="history-count">${live.length} RUNS</div><div class="history-note">เก็บล่าสุด 20 รอบ</div></div></div>${rows}</div>`;}
 let lastDay="";const rows=rounds.map((r,i)=>{let divider=r.day!==lastDay?`<div class="day-divider">${esc(r.day)}</div>`:"";lastDay=r.day;return divider+renderRoundRow(r,i);}).join("");return `<div class="panel history-panel"><div class="history-top"><div><h3 class="section-title">ประวัติรัน</h3><div class="history-note">รายการล่าสุดจากรอบการฟาร์ม</div></div><div style="text-align:right"><div class="history-count">40 MATCHES</div><div class="history-note">เก็บ 50 รอบล่าสุด</div></div></div>${rows}</div>`;}
function openDetails(id){state.selectedId=id||"AZ-118";state.detailTab="history";showPage("detail");writeHash();}
function setupSkeleton(){const ss=$("#skeletonStats"),sc=$("#skeletonCards");ss.innerHTML=Array.from({length:5},()=>`<div class="stat-card"><div class="skeleton" style="height:10px;width:80px"></div><div class="skeleton" style="height:30px;width:65px;margin-top:12px"></div></div>`).join("");sc.innerHTML=Array.from({length:6},()=>`<div class="account-card"><div class="skeleton" style="height:18px;width:90px"></div><div class="skeleton" style="height:55px;margin:15px 0"></div><div class="skeleton" style="height:10px;width:75%"></div><div class="skeleton" style="height:8px;margin-top:15px"></div></div>`).join("");}
function tickLive(){const now=Date.now();accounts.forEach(a=>{if(now-a.lastUpdate>180000)a.stale=true;});if(state.online)accounts.filter(a=>a.status==="FARMING"&&!a.stale).forEach(a=>{a.wave=Math.min(99,a.wave+(Math.random()>.52?1:0));a.kills+=Math.floor(Math.random()*18+4);a.progress=Math.min(99,a.progress+(Math.random()>.35?1:0));a.lastUpdate=now;const el=document.querySelector(`[data-live="${a.id}"]`);if(el){el.textContent=a.progress+"%";el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash");const fill=el.closest(".progress-wrap")?.querySelector(".progress-fill");if(fill)fill.style.width=a.progress+"%";}});$("#lastUpdated").textContent=timeNow();if(state.page==="detail"){const a=accounts.find(x=>x.id===state.selectedId);if(a){const w=$("#waveValue");if(w&&w.textContent!==String(a.wave)){w.textContent=a.wave;w.classList.remove("flash");void w.offsetWidth;w.classList.add("flash");}}}if(state.page==="public"){const a=accounts[0];if($("#publicWave"))$("#publicWave").textContent=a.wave;$("#publicUpdated").textContent=timeNow();}tickCountdowns();}
function tickCountdowns(){document.querySelectorAll(".countdown").forEach(el=>{let n=Math.max(0,Number(el.dataset.seconds||0)-1);el.dataset.seconds=n;const h=String(Math.floor(n/3600)).padStart(2,"0"),m=String(Math.floor(n%3600/60)).padStart(2,"0"),s=String(n%60).padStart(2,"0");el.textContent=`${h}:${m}:${s}`;});}
function liveCharByRaw(raw){const arr=window.characters||[];return arr.find(c=>(c.rawName||"")===raw||c.name===raw)||null;}
function curAmount(key){
 const acc=(window.livePacket&&window.livePacket.account)||{};
 const cur=(acc.currencies)||{};
 return num(cur[key]);
}
function materialAmount(id){
 const inv=window.liveInventory||[];
 const it=inv.find(x=>String(x.matId||"")===String(id));
 return it?num(it.amount):0;
}
function toNum2(v){const n=Number(v);return Number.isFinite(n)?n:0;}
 function evoRequirementRows(rawName){
 const cfg=(window.EVO_CONFIG||{})[rawName];
 if(!cfg)return [];
 const rows=[];
 (cfg.currencies||[]).forEach(function(cr){
  rows.push({name:cr.currency==="gems"?"อัญมณี Gems":"เงิน Zeni",need:num(cr.amount),have:curAmount(cr.currency),kind:"cur"});
 });
 /* cfg.ultimate = "itemId,amount|itemId,amount|..." (รูปแบบเดียวกับเกม) */
 String(cfg.ultimate||"").split("|").forEach(function(part){
  const seg=part.split(",");
  const id=String(seg[0]||"").replace(/\D/g,"");
  const need=num(seg[1]);
  if(!id||need<=0)return;
  const def=(window.MATERIAL_DEFS||{})[id]||{name:"Material "+id,tier:1};
  rows.push({name:def.name,tier:def.tier,icon:def.icon,need:need,have:materialAmount(id),kind:"mat",id:id});
 });
 return rows;
}
function fmtIconAsset(icon){
 const id=String(icon||"").replace(/\D/g,"");
 if(!id)return "";
 return "https://thumbnails.roblox.com/v1/assets?assetIds="+id+"&size=150x150&format=Png&isCircular=false";
}
function openEvoModal(rawName){
 const c=liveCharByRaw(rawName);
 const rows=evoRequirementRows(rawName);
 const disp=c?c.name:rawName;
 let rowsHtml="";
 if(rows.length){
  rowsHtml=rows.map(function(r){
   const ok=toNum2(r.have)>=toNum2(r.need);
   const col=r.kind==="cur"?"#35C8F5":(rarityColor[["Common","Uncommon","Rare","Epic","Legendary","Mythic","Arcane","Zenless"][r.tier-1]]||"#93A1B5");
   const iconImg=r.icon?`<img src="https://thumbnails.roblox.com/v1/assets?assetIds=${String(r.icon).replace(/\D/g,"")}&size=150x150&format=Png&isCircular=false" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">`:"";
   return `<div class="evo-row ${ok?'evo-ok':'evo-lack'}" style="--rc:${col}">
     <span class="evo-row-icon">${r.icon?`<img src="https://thumbnails.roblox.com/v1/assets?assetIds=${String(r.icon).replace(/\\D/g,'')}&size=150x150&format=Png&isCircular=false" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">`:'◈'}</span>
     <span class="evo-row-name">${esc(r.name)}</span>
     <span class="evo-row-need mono">ต้องใช้ ${fmtNumber(toNum2(r.need))}</span>
     <span class="evo-row-have mono ${ok?'green':'red'}">มี ${fmtNumber(toNum2(r.have))}</span>
     <span class="evo-row-state">${ok?"✓ พร้อม":"✕ ขาด "+fmtNumber(Math.max(0,toNum2(r.need)-toNum2(r.have)))}</span>
    </div>`;
  }).join("");
 }else{
  rowsHtml=`<div class="evo-miss">ไม่พบข้อมูลการอีโวของตัวนี้</div>`;
 }
 $("#modalHost").innerHTML=`<div class="modal-backdrop" id="modalBackdrop"><div class="modal modal-evo">
   <div class="evo-modal-head"><div><div class="eyebrow">EVOLUTION REQUIREMENT</div><h3>ของที่ต้องใช้อีโว <span class="gold">${esc(disp)}</span></h3></div><button class="icon-btn" id="closeModal">✕</button></div>
   <div class="evo-note">เมื่อครบทุกอย่างจะสามารถ "อีโว / Awakened" ตัวละครนี้ได้</div>
   <div class="evo-rows">${rowsHtml}</div>
   <div class="modal-actions"><button class="ghost-btn" id="closeModal">ปิด</button></div>
 </div></div>`;
}
function skillTierNode(branch,tier,curLv){
 const def=(window.SKILLTREE_CONFIG&&window.SKILLTREE_CONFIG.branches&&window.SKILLTREE_CONFIG.branches[branch])||null;
 const t=def&&def.tiers?tiers?tier-1:null:null;
}
function openSkillModal(rawName){
 const c=liveCharByRaw(rawName);
 const disp=c?c.name:rawName;
 const stc=window.SKILLTREE_CONFIG;
 const branches=(stc&&stc.branches)||{};
 const order=(stc&&stc.branchOrder)||["ATK","CRIT","DEF","SPD"];
 const branchColor={ATK:"#FF5C5C",CRIT:"#FFC53D",DEF:"#35C8F5",SPD:"#2BE57B"};
 const branchNameTh={ATK:"โจมตี (ATK)",CRIT:"คริติคอล (CRIT)",DEF:"ป้องกัน (DEF)",SPD:"ความเร็ว (SPD)"};
 let branchesHtml="";
 order.forEach(function(b){
  const bdef=branches[b]||{tiers:[]};
  const cur=toNum2(c&&c.skills&&c.skills[b]||1);
  let tiersHtml="";
  for(let i=1;i<=5;i++){
   const t=bdef.tiers&&bdef.tiers[i-1]||null;
   const done=i<=cur;
   const isNext=cur+1===i;
   const cost=(t&&toNum2(t.cost))||0;
   tiersHtml+=`<div class="sk-tier ${done?"sk-done":"sk-locked"} ${isNext?"sk-next":""}">
     <span class="sk-dot">${i<=cur?"✓":i}</span>
     <span class="sk-body"><span class="sk-title">${esc(t&&t.title||("Tier "+i))}</span><span class="sk-desc">${esc(t&&t.desc||"")}</span></span>
     <span class="sk-cost mono">${i===1?"ฟรี":"⬤ "+esc(String(toNum2(t&&t.cost)))}</span>
   </div>`;
  }
  branchesHtml+=`<div class="sk-branch"><div class="sk-branch-head"><span class="sk-branch-name">${esc(branchNameTh[b]||b)}</span><span class="sk-branch-lv mono green">Lv ${Math.min(5,cur)}/5</span></div><div class="sk-tiers">${tiersHtml}</div></div>`;
 });
 $("#modalHost").innerHTML=`<div class="modal-backdrop" id="modalBackdrop"><div class="modal modal-skill">
   <div class="evo-modal-head"><div><div class="eyebrow">SKILL TREE</div><h3>สกิลทรี <span class="gold">${esc(disp)}</span></h3><div class="evo-note">แต่ละสายอัพได้สูงสุด Tier 5 · ใช้ Skill Point ตามเลเวลตัวละคร</div></div><button class="icon-btn" id="closeModal">✕</button></div>
   <div class="sk-branches">${branchesHtml}</div>
   <div class="modal-actions"><button class="ghost-btn" id="closeModal">ปิด</button></div>
 </div></div>`;
}
function setOffline(offline){state.online=!offline;$("#dashboardOffline").classList.toggle("hidden",!offline);toast(offline?"สถานะจำลอง: เครื่องฟาร์มออฟไลน์":"เชื่อมต่อเครื่องฟาร์มแล้ว (จำลอง)");}
const languagePairs = [
 ["ฟาร์มของคุณ","Your Farms"],["ติดตามสถานะบัญชี ความคืบหน้า และประวัติการฟาร์มได้จากหน้าจอเดียว","Track account status, farming progress, and history in one place."],
 ["เลือกเกมที่ต้องการ","Choose a Game"],["เลือกเกมที่ต้องการ FARM","Choose a Game to Farm"],["เลือกเกมเพื่อเปิดดูรายการฟาร์ม สถานะบัญชี และรายงานความคืบหน้าของเกมนั้น ๆ","Select a game to view farming jobs, account status, and progress reports."],
 ["เลือกเกม","Select Game"],["ไม่พบเกมที่ค้นหา","No games found"],["ลองค้นหาด้วยชื่อ Anime Zero","Try searching for Anime Zero"],
 ["PRIVATE ACCOUNT DATA · USERNAMES ARE MASKED","PRIVATE ACCOUNT DATA · USERNAMES ARE MASKED"],["เลือก Anime Zero เพื่อดูรายการที่เกี่ยวข้อง","Select Anime Zero to view related jobs"],
 ["เปลี่ยนเกม","Change Game"],["ทุกเกม","All Games"],["ทุกสถานะ","All Statuses"],["ค้นหาบัญชี / เกม...","Search accounts / games..."],["ค้นหาตัวละคร...","Search characters..."],
 ["อัปเดตล่าสุด","Last updated"],["เชื่อมต่อเครื่องฟาร์มไม่ได้ — กำลังแสดงข้อมูลล่าสุดที่บันทึกไว้","Farm machine unavailable — showing the latest saved data"],["ลองอีกครั้ง","Retry"],
 ["ฟาร์มทุกวัน 1 วัน","Daily Farming · 1 Day"],["ฟาร์มตามเป้าหมาย","Goal-based Farming"],["Details","Details"],["ประวัติรัน","Run History"],["รายการล่าสุดจากรอบการฟาร์ม","Latest farming runs"],["เก็บ 50 รอบล่าสุด","Last 50 runs"],
 ["ใช้งานอยู่","Active"],["ปลดล็อกแล้ว","Unlocked"],["ยังไม่ปลดล็อก","Locked"],["เรียงตาม Level","Sort by Level"],["เรียงตามชื่อ","Sort by Name"],["ไม่พบตัวละคร","No characters found"],["ลองเปลี่ยนตัวกรอง","Try changing the filters"],
 ["ชื่อไอเทม","Item Name"],["ระดับ","Rarity"],["จำนวนรวม","Total Amount"],["ได้มาเมื่อ","Obtained At"],["แมพ","Map"],["สถิติ & เงิน","Stats & Economy"],
 ["สรุปก่อน/หลังเริ่มงาน","Before / After Summary"],["ตัวละคร","Characters"],["ของที่ได้","Inventory"],["Raid & เดลี่","Quests"],["ต้องการความช่วยเหลือ","Need Help"],
 ["ส่งคำขอรายงาน","Request Report"],["ขอรายงานเพิ่มเติม","Request More Details"],["ข้อมูลอัปเดตอัตโนมัติทุก 5 วินาที","Data refreshes automatically every 5 seconds"],
 ["เข้าสู่ระบบ","Login"],["ยกเลิก","Cancel"],["กรอกชื่อผู้ใช้หรืออีเมล","Enter username or email"],["กรอกรหัสผ่าน","Enter password"],
 ["ตัวกรอง","Filters"],["ล้างตัวกรอง","Clear filters"],["ไม่พบรายการที่ตรงกัน","No matching records"],["ลองเปลี่ยนคำค้นหาหรือตัวกรอง","Try changing your search or filters"],
 ["สถิติ","Stats"],["เควส","Quests"],["กระเป๋า","Inventory"],["ประวัติการลง","Run History"],["เลือกเกม","Choose Game"],
 ["รายการตัวอย่างล่าสุด","Latest sample entries"],["สถานะงานและความคืบหน้าสำหรับลูกค้า","Job status and progress for customers"],["สถานะจำลอง: เครื่องฟาร์มออฟไลน์","Demo status: farm machine offline"],["เชื่อมต่อเครื่องฟาร์มแล้ว (จำลอง)","Farm machine connected (simulated)"],
 ["สรุปก่อน/หลังเริ่มงาน","Before / After Summary"],["ตัวละคร","Characters"],["รหัสงาน","Order ID"],["รายละเอียด","Description"],["อธิบายปัญหาที่พบ...","Describe the issue..."],["ส่งคำขอรายงาน →","Send Report →"],
 ["ยังไม่มีความคืบหน้ามา 12 ชั่วโมง 54 นาที","No progress reported for 12 hours 54 minutes"],["เกมอาจค้างหรือโดน kick กรุณาแจ้งแอดมินใน Ticket","The game may be stuck or disconnected. Please contact an admin via ticket."],
 ["เวลานี้เฉพาะรอบที่หมดเท่านั้น (ยกเว้นงานใหม่)","This timer applies to the current session only (excluding new jobs)"],["วันนี้","Today"],
 ["ไม่พบรายการที่ตรงกัน","No matching records"],["ข้อมูลรอบฟาร์ม สถานะในเกม ตัวละคร ไอเทม และสถิติที่เกี่ยวข้อง","Farming session, in-game status, characters, items, and related stats"],
 ["ฟาร์มตามเป้าหมาย","Goal-based Farming"],["สอบถามบริการ","Contact Us"],["ข้อมูลตัวอย่าง","Sample Data"],
 ["รายการตัวอย่างล่าสุด","Latest sample entries"],["กำลังแสดงข้อมูลล่าสุดที่บันทึกไว้","Showing latest saved data"]
];
function applyLanguage(){
 const en=state.lang==="EN";
 const pairs=en?languagePairs:[...languagePairs].map(([th,eng])=>[eng,th]);
 const sorted=[...pairs].sort((a,b)=>b[0].length-a[0].length);
 const replaceText=value=>{let out=value;for(const [from,to] of sorted){if(from)out=out.split(from).join(to);}return out;};
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{if(n.parentElement&&!['SCRIPT','STYLE'].includes(n.parentElement.tagName))n.nodeValue=replaceText(n.nodeValue);});
 document.querySelectorAll('input[placeholder],textarea[placeholder],[aria-label],[title]').forEach(el=>{
  ['placeholder','aria-label','title'].forEach(attr=>{if(el.hasAttribute(attr))el.setAttribute(attr,replaceText(el.getAttribute(attr)));});
 });
 document.documentElement.lang=en?'en':'th';
}
function rerenderLanguageView(){
 if(state.page==="detail")renderDetail();
 else if(state.page==="public")renderPublic();
 else if(state.page==="dashboard"){
  if(state.dashboardMode==="workspace"){renderStats();renderAccounts();}
  else filterGameCards();
 }
 applyLanguage();
}

document.addEventListener("click",e=>{const gameCard=e.target.closest("[data-select-game]");if(gameCard){selectGame(gameCard.dataset.selectGame);return;}if(e.target.closest("#changeGame")){showGamePicker();return;}const p=e.target.closest("[data-page]");if(p){if(p.dataset.page==="dashboard"&&p.classList.contains("navbtn")){showGamePicker();showPage("dashboard");}else showPage(p.dataset.page);return;}const d=e.target.closest("[data-detail]");if(d){openDetails(d.dataset.detail);return;}const t=e.target.closest("[data-detail-tab]");if(t){showTab(t.dataset.detailTab);return;}if(e.target.closest("#gridView")){state.listView=false;$("#gridView").classList.add("active");$("#listView").classList.remove("active");renderAccounts();return;}if(e.target.closest("#listView")){state.listView=true;$("#listView").classList.add("active");$("#gridView").classList.remove("active");renderAccounts();return;}if(e.target.closest("#clearFilters")){$("#accountSearch").value="";$("#gameFilter").value="all";$("#statusFilter").value="all";renderAccounts();return;}if(e.target.closest("#dropCards")){state.dropView="cards";showTab("drops");return;}if(e.target.closest("#dropList")){state.dropView="list";showTab("drops");return;}if(e.target.closest("#loginBtn")){showLogin();return;}if(e.target.closest("#closeModal")||e.target.id==="modalBackdrop"){$("#modalHost").innerHTML="";return;}if(e.target.closest("#submitLogin")){toast("ระบบล็อกอินยังไม่เชื่อมต่อ API");return;}if(e.target.closest("#retryConnection")){setOffline(false);return;}if(e.target.closest("#publicReport")){showPage("support");$("#ticketOrder").value="AZ-118";return;}if(e.target.closest("#sendTicket")){toast("บันทึกคำขอจำลองแล้ว — เชื่อม POST /api/tickets เมื่อต่อ backend");return;}if(e.target.closest("[data-action='shopContact']")){showPage("support");return;}const ch=e.target.closest("[data-char-detail]");if(ch){openEvoModal(ch.dataset.charDetail);return;}const sk=e.target.closest("[data-char-skill]");if(sk){openSkillModal(sk.dataset.charSkill);return;}const chBtn=e.target.closest("[data-char]");if(chBtn){const raw=chBtn.dataset.charRaw||chBtn.dataset.char;const cc=liveCharByRaw(raw);if(cc&&!cc.locked){openSkillModal(cc.rawName||cc.name);}else toast("เปิดรายละเอียดตัวละคร: "+chBtn.dataset.char);}});
$("#gameSearch").addEventListener("input",filterGameCards);$("#accountSearch").addEventListener("input",renderAccounts);$("#gameFilter").addEventListener("change",()=>{if($("#gameFilter").value!=="all")state.selectedGame=$("#gameFilter").value;renderAccounts();});$("#statusFilter").addEventListener("change",renderAccounts);
$("#langToggle").addEventListener("click",()=>{state.lang=state.lang==="TH"?"EN":"TH";$("#langToggle").textContent=state.lang==="TH"?"TH / EN":"EN / TH";$("#langToggle").classList.toggle("active",state.lang==="EN");rerenderLanguageView();toast(state.lang==="EN"?"English UI enabled":"เปลี่ยนเป็นภาษาไทยแล้ว");});
document.addEventListener("input",e=>{if(e.target.id==="charSearch"){state.charSearch=e.target.value;const pos=e.target.selectionStart;showTab("characters");const input=$("#charSearch");input?.focus();input?.setSelectionRange(pos,pos);}if(e.target.id==="dropSearch"){state.dropSearch=e.target.value;const pos=e.target.selectionStart;showTab("drops");const input=$("#dropSearch");input?.focus();input?.setSelectionRange(pos,pos);}});
document.addEventListener("change",e=>{if(e.target.id==="charStatus"){state.charStatus=e.target.value;showTab("characters");}if(e.target.id==="charSort"){state.charSort=e.target.value;showTab("characters");}});
/* เริ่มต้น: กู้สถานะเดิมจาก localStorage/hash ก่อน แล้วค่อยวาดหน้าล่าสุดที่ผู้ใช้อยู่ */
restoreState();
if(!location.hash){suppressHash=true;try{history.replaceState(null,"",hashFromState());}catch(e){}setTimeout(()=>suppressHash=false,0);}
setupSkeleton();renderStats();renderAccounts();
restoreView();
setTimeout(()=>{state.loading=false;$("#loadingState").classList.add("hidden");},1000);setInterval(tickLive,5000);setInterval(tickCountdowns,1000);
/* Demo-only switch for exercising offline/error states from the browser console:
   setOffline(true); setOffline(false); */
