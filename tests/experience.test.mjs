import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateCatalog } from "../scripts/catalog-verify.mjs";

const fromSite = (file) => readFileSync(new URL("../site/" + file,import.meta.url),"utf8");

test("experience page has real data placeholders and a secure source-only outbound action", () => {
  const html=fromSite("experience.html");
  const js=fromSite("experience.js");
  assert.match(html,/data-detail/);
  assert.match(html,/data-state/);
  assert.match(html,/data-booking/);
  assert.match(html,/rel="noopener noreferrer"/);
  assert.match(html,/data-favorite/);
  assert.match(js,/safeBookingUrl/);
  assert.ok(!js.includes("innerHTML"));
  const explore=fromSite("explore.js");
  assert.match(explore,/experienceHref\(item\.id, searchInput\.value, category\)/);
});

test("catalog rejects malicious, invalid or incomplete records", () => {
  const good={schema_version:1,source_origin:"https://locactif.ca",imported_at:"2026-10-15T12:00:00.000Z",items:[{
    id:"123",name:"Activité réelle",description:"Publié",categories:["Visites"],url:"https://locactif.ca/produit/test",price:20,currency:"CAD"
  }]};
  assert.deepEqual(validateCatalog(good),[]);
  assert.ok(validateCatalog({...good,items:[...good.items,good.items[0]]}).some(x=>x.includes("duplicate")));
  assert.ok(validateCatalog({...good,items:[{...good.items[0],url:"javascript:alert(1)"}]}).some(x=>x.includes("unsafe URL")));
  assert.ok(validateCatalog({...good,items:[{...good.items[0],price:Number.NaN}]}).some(x=>x.includes("price")));
  assert.ok(validateCatalog({...good,imported_at:null}).some(x=>x.includes("imported_at")));
  assert.ok(validateCatalog({...good,source_origin:"http://127.0.0.1"}).some(x=>x.includes("HTTPS")));
});


test("published offers display truthful import time in both languages", () => {
  for (const p of ["explore","experience"]) {
    assert.match(fromSite(p+".html"),/data-provenance/);
    const script=fromSite(p+".js");
    assert.match(script,/importedAt = catalog\.imported_at/);
    assert.match(script,/lastSync/);
    assert.ok(!script.includes("innerHTML"));
  }
});
