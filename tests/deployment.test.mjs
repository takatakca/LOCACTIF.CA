import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));

test("Vercel publishes the site directory instead of repository files", () => {
  assert.equal(config.outputDirectory, "site");
  assert.equal(config.framework, null);
  assert.equal(config.version, 2);
  assert.equal(config.cleanUrls, false, "Linked .html routes must remain publicly accessible");
  assert.ok(existsSync(resolve(root, config.outputDirectory, "index.html")));
  assert.ok(!existsSync(resolve(root, "index.html")), "Root index.html would hide a mistaken build root");
});

test("prelaunch routes are explicitly not indexable and have response safety headers", () => {
  const common = config.headers.find((item) => item.source === "/(.*)");
  assert.ok(common, "Missing header policy for all routes");
  const headers = Object.fromEntries(common.headers.map(({key, value}) => [key.toLowerCase(), value]));
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["x-frame-options"], "DENY");
  assert.match(headers["x-robots-tag"], /noindex/);
  assert.match(headers["permissions-policy"], /geolocation=\(\)/);
});

test("health endpoint is an honest static liveness marker", () => {
  const marker = JSON.parse(readFileSync(resolve(root, "site/health.json"), "utf8"));
  assert.deepEqual(marker, {
    name: "locactif-ca",
    component: "public-static-site",
    phase: "prelaunch",
    status: "ok"
  });
});

test("deployment and handoff documentation exists", () => {
  for (const path of [
    "AGENTS.md",
    "docs/AGENT_HANDOFF.md",
    "docs/TASK_QUEUE.md",
    "docs/DEPLOYMENT.md",
    "docs/DECISIONS.md",
    "docs/PROJECT_STATUS.md"
  ]) {
    assert.ok(existsSync(resolve(root, path)), path + " must exist");
  }
});


test("explicit Vercel response-header rules for the three public HTML entrypoints", () => {
  for(const source of ["/","/explore.html","/experience.html"]) {
    const rule=config.headers.find(x=>x.source===source);
    assert.ok(rule,"Missing explicit header rule for "+source);
    const map=Object.fromEntries(rule.headers.map(({key,value})=>[key.toLowerCase(),value]));
    assert.equal(map["x-content-type-options"],"nosniff");
    assert.equal(map["x-frame-options"],"DENY");
    assert.match(map["x-robots-tag"],/noindex/);
  }
});
