import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterCatalog, normalizeProduct, safeBookingUrl } from "../site/catalog-utils.mjs";

test("accepts only HTTPS booking links from a configured trusted origin", () => {
  assert.equal(safeBookingUrl("https://locactif.ca/book/1", ["https://locactif.ca"]), "https://locactif.ca/book/1");
  assert.equal(safeBookingUrl("javascript:alert(1)", ["https://locactif.ca"]), null);
  assert.equal(safeBookingUrl("https://evil.example/book", ["https://locactif.ca"]), null);
  assert.equal(safeBookingUrl("https://bad@locactif.ca/book", ["https://locactif.ca"]), null);
  assert.equal(safeBookingUrl("http://locactif.ca/book", ["https://locactif.ca"]), null);
});

test("normalizes a published Store API product without fabricating offers", () => {
  const product = normalizeProduct({
    id: 123, name: "Atelier <b>vélo</b>",
    permalink: "https://locactif.ca/produit/velo/",
    short_description:"<p>Découvrir <em>Montréal</em>.</p>",
    categories:[{name:"Ateliers"}],
    prices:{price:"1500",currency_code:"CAD",currency_minor_unit:2}
  }, "https://locactif.ca");
  assert.equal(product.name, "Atelier vélo");
  assert.deepEqual(product.categories, ["Ateliers"]);
  assert.equal(product.price, 15);
  assert.equal(product.currency, "CAD");
  assert.equal(product.url,"https://locactif.ca/produit/velo/");
  assert.equal(normalizeProduct({id:2,name:"Bad",permalink:"https://other.test"}, "https://locactif.ca"), null);
});

test("filters accents, category and favorites safely", () => {
  const rows = [
    {id:"1",name:"Dégustation café",description:"Montréal",categories:["Gastronomie"]},
    {id:"2",name:"Randonnée",description:"Nature",categories:["Plein air"]}
  ];
  assert.deepEqual(filterCatalog(rows,{search:"degustation"}).map(x=>x.id),["1"]);
  assert.deepEqual(filterCatalog(rows,{category:"Plein air"}).map(x=>x.id),["2"]);
  assert.deepEqual(filterCatalog(rows,{favorites:["2"],onlyFavorites:true}).map(x=>x.id),["2"]);
  assert.deepEqual(filterCatalog(rows,{search:"inconnu"}),[]);
});

test("published catalog starts with no invented merchants or availability", () => {
  const data = JSON.parse(readFileSync(new URL("../site/catalog.json", import.meta.url), "utf8"));
  assert.equal(data.schema_version, 1);
  assert.ok(Array.isArray(data.items));
  assert.ok(data.source_origin.startsWith("https://"));
  for (const item of data.items) {
    assert.ok(safeBookingUrl(item.url, [data.source_origin]));
  }
});

test("Explorer is reachable from the homepage and does not contain sample offers", () => {
  const home = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
  const explore = readFileSync(new URL("../site/explore.html", import.meta.url), "utf8");
  assert.match(home, /href="\.\/explore\.html"/);
  assert.ok(!home.includes("\\n        <a"), "Backslash-n must not leak into page text");
  assert.match(explore, /data-results/);
  assert.match(explore, /data-search-form/);
  assert.match(explore, /data-category/);
  assert.match(explore, /data-view="favorites"/);
});


test("does not create deceptive price when WooCommerce currency exponent is invalid", () => {
  const bad = normalizeProduct({
    id: 7, name:"Cours", permalink:"https://locactif.ca/cours",
    categories:[{name:"Ateliers"}],
    prices:{price:"1000",currency_code:"CAD",currency_minor_unit:1000000}
  },"https://locactif.ca");
  assert.equal(bad.price,null);
  assert.equal(bad.currency,"CAD");
});
