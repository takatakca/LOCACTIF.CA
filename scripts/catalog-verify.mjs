import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { safeBookingUrl } from "../site/catalog-utils.mjs";

export function validateCatalog(catalog) {
  const errors = [];
  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) return ["Catalog must be a JSON object"];
  if (catalog.schema_version !== 1) errors.push("schema_version must be 1");
  let origin = null;
  try {
    const u = new URL(catalog.source_origin);
    if (u.protocol !== "https:" || u.username || u.password || u.pathname !== "/" || u.search || u.hash) throw new Error("bad origin");
    origin = u.origin;
  } catch { errors.push("source_origin must be a secure HTTPS origin"); }
  if (catalog.imported_at !== null && (typeof catalog.imported_at !== "string" || !Number.isFinite(Date.parse(catalog.imported_at)) || !/Z$/.test(catalog.imported_at))) {
    errors.push("imported_at must be null or an ISO UTC timestamp");
  }
  if (!Array.isArray(catalog.items) || catalog.items.length > 500) {
    errors.push("items must be an array of at most 500 entries");
    return errors;
  }
  const seen = new Set();
  for (const [i,item] of catalog.items.entries()) {
    const location = "items[" + i + "]";
    if (!item || typeof item !== "object" || Array.isArray(item)) { errors.push(location + " must be an object"); continue; }
    if (typeof item.id !== "string" || !/^[1-9][0-9]{0,15}$/.test(item.id) || seen.has(item.id)) errors.push(location + " id invalid or duplicate");
    seen.add(item.id);
    if (typeof item.name !== "string" || !item.name.trim() || item.name.length > 140) errors.push(location + " name invalid");
    if (typeof item.description !== "string" || item.description.length > 500) errors.push(location + " description invalid");
    if (!Array.isArray(item.categories) || item.categories.length > 8 ||
      !item.categories.every((x) => typeof x === "string" && x.length > 0 && x.length <= 50)) errors.push(location + " categories invalid");
    if (!origin || !safeBookingUrl(item.url,[origin])) errors.push(location + " unsafe URL");
    if (item.price !== null && (typeof item.price !== "number" || !Number.isFinite(item.price) || item.price < 0)) errors.push(location + " price invalid");
    if (item.currency !== null && (typeof item.currency !== "string" || !/^[A-Z]{3}$/.test(item.currency))) errors.push(location + " currency invalid");
    if (item.price !== null && item.currency === null) errors.push(location + " price has no currency");
  }
  if (catalog.items.length > 0 && catalog.imported_at === null) errors.push("nonempty catalog requires imported_at");
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  try {
    const path = resolve(process.argv[2] || "site/catalog.json");
    const catalog = JSON.parse(readFileSync(path,"utf8"));
    const errors = validateCatalog(catalog);
    if (errors.length) {
      console.error("Catalog validation failed:\n" + errors.join("\n"));
      process.exitCode = 1;
    } else {
      console.log("Catalog valid: " + catalog.items.length + " items; source: " + catalog.source_origin);
    }
  } catch (error) {
    console.error("Could not verify catalog:",error.message);
    process.exitCode = 1;
  }
}
