import { validateCatalog } from "./catalog-verify.mjs";

const address = process.argv[2] || process.env.LOCACTIF_SMOKE_BASE_URL;
if (!address) {
  console.error("Usage: node scripts/smoke.mjs https://locactif-ca.vercel.app");
  process.exit(2);
}
let base;
try {
  base = new URL(address);
  if (base.protocol !== "https:" || base.username || base.password || base.pathname !== "/" || base.search || base.hash) throw new Error("Invalid HTTPS base URL");
} catch {
  console.error("Expected a secure HTTPS site origin, no path or credentials");
  process.exit(2);
}

async function request(path) {
  const url = new URL(path, base);
  const response = await fetch(url,{redirect:"follow",headers:{"accept":"text/html,application/json,text/plain,*/*","cache-control":"no-cache"},signal:AbortSignal.timeout(15000)});
  if (response.status !== 200) throw new Error(path + " HTTP " + response.status);
  if (new URL(response.url).origin !== base.origin) throw new Error(path + " redirected outside trusted site origin");
  const body = await response.text();
  if (body.length > 1500000) throw new Error(path + " unexpectedly large response");
  return {body,headers:response.headers};
}
function verifySecurityHeaders(path, headers) {
  const expected = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "geolocation=()"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (!headers.get(key)?.includes(value)) throw new Error(path + " missing/mismatched security header: " + key);
  }
  if (!headers.get("x-robots-tag")?.includes("noindex")) throw new Error(path + " missing X-Robots-Tag noindex");
  const csp=headers.get("content-security-policy") || "";
  for(const directive of ["default-src 'self'","object-src 'none'","frame-ancestors 'none'","base-uri 'self'"]) {
    if(!csp.includes(directive)) throw new Error(path + " missing CSP directive: "+directive);
  }
}
async function smoke() {
  const homepage = await request("/");
  const securityHeaders = ["x-robots-tag","x-content-type-options","x-frame-options","referrer-policy","permissions-policy","content-security-policy"];
  const observed = Object.fromEntries(securityHeaders.map(key=>[key,homepage.headers.get(key)]));
  console.log("LIVE RESPONSE SECURITY HEADERS (public homepage): " + JSON.stringify(observed));

  if (!homepage.body.includes("LOCACTIF") || !homepage.body.includes("explore.html")) throw new Error("Homepage has missing brand or catalog link");
  const explore = await request("/explore.html");
  if (!explore.body.includes("data-search-form") || !explore.body.includes("data-results")) throw new Error("Explore page missing interactive elements");
  for (const [path, response] of [["/", homepage],["/explore.html",explore]]) {
    verifySecurityHeaders(path, response.headers);
  }
  const experience = await request("/experience.html");
  if (!experience.body.includes("data-detail") || !experience.body.includes("data-booking")) throw new Error("Experience page missing details");
  verifySecurityHeaders("/experience.html",experience.headers);
  for (const [path, page] of [["/",homepage],["/explore.html",explore],["/experience.html",experience]]) {
    if (!/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(page.body)) throw new Error(path + " missing HTML noindex policy");
  }
  const robots = await request("/robots.txt");
  if (!/Disallow:\s*\/\s*(?:\r?\n|$)/i.test(robots.body)) throw new Error("robots.txt does not block prelaunch indexing");
  const health = JSON.parse((await request("/health.json")).body);
  if (health.name !== "locactif-ca" || health.phase !== "prelaunch" || health.status !== "ok") throw new Error("Health marker mismatch");
  const catalog = JSON.parse((await request("/catalog.json")).body);
  const errors = validateCatalog(catalog);
  if (errors.length) throw new Error("Invalid public catalog: " + errors.join("; "));
  for (const [path,token] of [
    ["/app.js","setLanguage"],["/translations.mjs","export const translations"],
    ["/explore.js","filterCatalog"],["/experience.js","safeBookingUrl"],
    ["/catalog-utils.mjs","safeBookingUrl"],["/catalog-schema.mjs","validateCatalog"],
    ["/styles.css","--lime"],["/explore.css",".catalog-hero"],["/experience.css",".detail-main"],
    ["/404.css","place-items:center"],["/favicon.svg","<svg"]
  ]) {
    const asset = await request(path);
    if (!asset.body.includes(token)) throw new Error(path + " content mismatch");
  }
  console.log("LIVE HTTP smoke checks passed for " + base.origin + " (catalog items: " + catalog.items.length + ")");
}

async function diagnoseRoutes() {
  console.error("PUBLIC ROUTE DIAGNOSTICS (status, location)");
  for (const path of ["/","/explore","/explore.html","/experience","/experience.html","/site/explore.html","/site/experience.html","/catalog.json","/site/catalog.json","/robots.txt"]) {
    try {
      const response = await fetch(new URL(path,base), {method:"GET",redirect:"manual",signal:AbortSignal.timeout(7500)});
      console.error(path + " => " + response.status + " " + (response.headers.get("location") || ""));
      await response.body?.cancel();
    } catch (error) {console.error(path + " => ERROR " + error.message);}
  }
}

const retries = Number(process.env.LOCACTIF_SMOKE_ATTEMPTS || 6);
const maxAttempts = Number.isSafeInteger(retries) && retries >= 1 && retries <= 12 ? retries : 6;
for (let attempt=1; attempt<=maxAttempts; attempt++) {
  try {
    await smoke();
    process.exit(0);
  } catch (error) {
    console.error("Smoke attempt " + attempt + "/" + maxAttempts + " failed: " + error.message);
    if (attempt === maxAttempts) {
      await diagnoseRoutes();
      process.exitCode = 1;
    }
    else await new Promise((resolve)=>setTimeout(resolve,10000));
  }
}
