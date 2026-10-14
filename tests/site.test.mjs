import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { translations } from "../site/translations.mjs";

const html = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../site/app.js", import.meta.url), "utf8");

test("required pages and assets", () => {
  for (const item of ["index.html","styles.css","app.js","translations.mjs","favicon.svg","404.html","robots.txt"]) {
    assert.ok(existsSync(new URL("../site/" + item, import.meta.url)), "Missing " + item);
  }
});

test("semantic document and accessibilty", () => {
  for (const text of ['lang="fr"','<main','<nav','<h1','id="main"','class="skip"','name="viewport"','aria-expanded="false"','data-lang="en"']) {
    assert.ok(html.includes(text), "Missing " + text);
  }
});

test("all localized text is present in both languages", () => {
  const keys = [...html.matchAll(/data-t="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(keys.length > 25);
  for (const key of keys) {
    for (const lang of ["fr","en"]) {
      assert.ok(typeof translations[lang][key] === "string" && translations[lang][key].trim(), "Missing " + lang + "." + key);
    }
  }
  assert.deepEqual(Object.keys(translations.fr).sort(), Object.keys(translations.en).sort());
});

test("all local navigation targets exist", () => {
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const link of [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1])) {
    assert.ok(ids.has(link), "Missing #" + link);
  }
});

test("external links are isolated and no sensitive or fake forms", () => {
  assert.ok(!/<a[^>]+target="_blank"(?![^>]*rel="noopener noreferrer")/g.test(html));
  assert.ok(!html.includes("<form"));
  assert.ok(!js.includes("innerHTML"));
  assert.ok(html.includes('name="robots" content="noindex,nofollow"'));
});
