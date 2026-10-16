import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildCatalog, getStoreInventory, parseCategoryIds, trustedStoreOrigin } from "../scripts/catalog-import-core.mjs";
import { validateCatalog } from "../site/catalog-schema.mjs";

const origin = "https://locactif.ca";
function product(id, options = {}) {
  return {
    id, name: "Atelier test " + id, permalink: origin + "/product/" + id,
    short_description: "<p>Atelier indépendant en français</p>",
    categories: [{id:12,name:"Ateliers"}],
    prices: {price:"2500",currency_code:"CAD",currency_minor_unit:2},
    ...options
  };
}
function response(items, props = {}) {
  return {
    ok:true, status:200, redirected:false, url:origin+"/wp-json/wc/store/v1/products",
    headers:new Headers({"content-type":"application/json; charset=utf-8"}),
    json:async()=>items,
    ...props
  };
}
function fixture(items, spy = null) {
  return async (url,options) => {
    spy?.({url, options});
    assert.equal(url.origin, origin);
    assert.equal(url.pathname, "/wp-json/wc/store/v1/products");
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.accept,"application/json");
    return response(items);
  };
}

test("WooCommerce origin is explicit HTTPS origin without path, credentials or query", () => {
  assert.equal(trustedStoreOrigin(origin),origin);
  for (const input of ["http://locactif.ca",origin+"/admin",origin+"?p=1","https://user:pass@locactif.ca","https://locactif.ca.evil.test"]) {
    if(input.endsWith(".evil.test")) assert.equal(trustedStoreOrigin(input),"https://locactif.ca.evil.test");
    else assert.throws(() => trustedStoreOrigin(input));
  }
});

test("requires explicit category approval and validates syntax", () => {
  assert.deepEqual(parseCategoryIds("12, 34,12"),[12,34]);
  for (const input of ["",undefined,"0","12,", "abc","12,0","12,Infinity"]) {
    assert.throws(()=>parseCategoryIds(input));
  }
});

test("inspects published Store API data without changing catalog", async () => {
  let calls=0;
  const entries=[product(10),product(11,{categories:[{id:40,name:"Courses"}]})];
  const inventory=await getStoreInventory({origin,fetchImpl:fixture(entries,()=>calls++)});
  assert.equal(calls,1);
  assert.equal(inventory.entries.length,2);
  assert.deepEqual(inventory.categories,[[12,"Ateliers"],[40,"Courses"]]);
});

test("publish only approved in-stock WooCommerce categories with HTTPS links", async () => {
  const list=[
    product(1),
    product(2,{categories:[{id:40,name:"Livres"}]}),
    product(3,{is_in_stock:false}),
    product(4,{permalink:"https://evil.example/book"}),
    product(5,{name:""})
  ];
  const inventory=await getStoreInventory({origin,fetchImpl:fixture(list)});
  const result=buildCatalog(inventory,{approvedCategories:[12],now:new Date("2026-10-15T12:00:00Z")});
  assert.deepEqual(result.catalog.items.map(x=>x.id),["1"]);
  assert.deepEqual(result.stats,{total:5,imported:1,excludedByCategory:1,excludedUnavailable:1,rejected:2});
  assert.deepEqual(validateCatalog(result.catalog),[]);
  assert.equal(result.catalog.source_origin,origin);
  assert.equal(result.catalog.items[0].price,25);
  assert.throws(()=>buildCatalog(inventory,{approvedCategories:[]}),/Approved category/);
});

test("Store API fails closed on error, wrong mime type, redirects and invalid JSON shape", async () => {
  for(const bad of [
    {ok:false,status:403},
    {redirected:true,url:"https://evil.example/moved"},
    {headers:new Headers({"content-type":"text/html"})},
    {json:async()=>({products:[]})}
  ]){
    await assert.rejects(getStoreInventory({origin,fetchImpl:async()=>response([] ,bad)}));
  }
});

test("rejects duplicates between pages instead of silently overriding products", async () => {
  let count=0;
  const hundred=Array.from({length:100},(_,i)=>product(i+1));
  await assert.rejects(
    getStoreInventory({origin,fetchImpl:async()=>response(++count === 1 ? hundred : [product(1)])}),
    /Duplicate product/
  );
});

test("refuses partial import when WooCommerce has more pages than configured", async () => {
  const hundred=Array.from({length:100},(_,i)=>product(i+1));
  await assert.rejects(
    getStoreInventory({origin,maxPages:1,fetchImpl:async()=>response(hundred)}),
    /truncated import/
  );
});

test("malformed catalog fails validation before the browser may render it", () => {
  const base=JSON.parse(readFileSync(new URL("../site/catalog.json",import.meta.url),"utf8"));
  assert.deepEqual(validateCatalog(base),[]);
  assert.ok(validateCatalog({...base,source_origin:"https://admin@locactif.ca"}).length);
  assert.ok(validateCatalog({...base,items:[{id:"01",name:"Invalid"}]}).length);
  const explorer=readFileSync(new URL("../site/explore.js",import.meta.url),"utf8");
  const detail=readFileSync(new URL("../site/experience.js",import.meta.url),"utf8");
  assert.match(explorer,/validateCatalog\(catalog\)/);
  assert.match(detail,/validateCatalog\(catalog\)/);
});
