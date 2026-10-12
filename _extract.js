const fs = require("fs");
let raw = fs.readFileSync("c:/Users/patta/Downloads/paduk-shop-vscode/_skilltree_tmp.json", "utf8");
raw = raw.replace(/^\uFEFF/, "").trim();
if (raw.endsWith("}")) raw = raw.slice(0, -1);
const wrapped = "{\n" + raw;
const o = JSON.parse(wrapped);
const st = o.configs.skillTree;
const chars = Object.keys(st);
const ref = JSON.stringify(st.goku.branches);
console.log("same as goku:", chars.filter(c => JSON.stringify(st[c].branches) === ref).length + "/" + chars.length);
const diffChars = chars.filter(c => JSON.stringify(st[c].branches) !== ref);
console.log("different:", diffChars.join(","));
for (const dc of diffChars.slice(0, 3)) {
  const b = st[dc].branches, g = st.goku.branches;
  for (const br of Object.keys(b)) {
    (b[br].tiers || []).forEach((t, i) => {
      const gt = g[br] && g[br].tiers[i];
      if (!gt || gt.title !== t.title || gt.cost !== t.cost || JSON.stringify(gt.buffs || []) !== JSON.stringify(t.buffs || []))
        console.log(dc, br, "T" + (i + 1), "game:", JSON.stringify(t), "| goku:", JSON.stringify(gt));
    });
  }
}