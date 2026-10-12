const fs=require("fs");
let d=fs.readFileSync("c:/Users/patta/Downloads/paduk-shop-vscode/server/data/latest.json","utf8");
d=d.replace(/^\uFEFF/,"").trim();
d=JSON.parse(d);
function shape(o,depth,path){
  if(depth>3||o===null||typeof o!=="object")return;
  for(const k of Object.keys(o)){
    const v=o[k];
    const t=Array.isArray(v)?("array["+v.length+"]"):typeof v;
    console.log(path+"."+k+" : "+t+(typeof v==="string"?" = "+v.slice(0,40):""));
    if(typeof v==="object"&&v!==null)shape(v,depth+1,path+"."+k);
  }
}
console.log("=== TOP LEVEL ===");
shape(d,0,"root");
const lv=d.payload.live;
console.log("=== CHARS ===");
(lv.characters||[]).forEach(c=>console.log(JSON.stringify({name:c.name,displayName:c.displayName,assetId:c.assetId,ultimate:!!c.ultimate,traitId:c.traitId,active:!!c.active,xp:c.xp,skills:c.skills?Object.keys(c.skills).length:0})));
console.log("=== EVO KEYS ===", Object.keys(lv.gameConfig.evolution||{}).join(","));
const evoKey=Object.keys(lv.gameConfig.evolution||{})[0];
console.log("=== EVO SAMPLE ===", JSON.stringify(lv.gameConfig.evolution[evoKey]).slice(0,600));
console.log("=== ITEMS ===");
(lv.items||[]).slice(0,12).forEach(i=>console.log(JSON.stringify({id:i.id,name:i.name,count:i.count,icon:String(i.icon||"").slice(0,25),image:String(i.image||"").slice(0,50),tier:i.tier})));
console.log("=== RARITY BY CHAR ===", JSON.stringify(lv.gameConfig.characterRarity||{}).slice(0,400));
