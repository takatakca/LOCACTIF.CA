import { safeBookingUrl } from "./catalog-utils.mjs";

export function validateCatalog(catalog) {
  const errors = [];
  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) return ["Catalog must be a JSON object"];
  if (catalog.schema_version !== 1) errors.push("schema_version must be 1");
  let origin = null;
  try {
    const u = new URL(catalog.source_origin);
    if (u.protocol !== "https:" || u.username || u.password || u.pathname !== "/" || u.search || u.hash ||
        u.href !== u.origin + "/") throw new Error("invalid");
    origin = u.origin;
  } catch { errors.push("source_origin must be a secure HTTPS origin"); }
  if (catalog.imported_at !== null &&
      (typeof catalog.imported_at !== "string" ||
       !Number.isFinite(Date.parse(catalog.imported_at)) ||
       !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(catalog.imported_at))) {
    errors.push("imported_at must be null or an ISO UTC timestamp");
  }
  if (!Array.isArray(catalog.items) || catalog.items.length > 500) {
    errors.push("items must be an array of at most 500 entries");
    return errors;
  }
  const seen = new Set();
  for (const [i, item] of catalog.items.entries()) {
    const location = "items[" + i + "]";
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push(location + " must be an object");
      continue;
    }
    if (typeof item.id !== "string" || !/^[1-9][0-9]{0,15}$/.test(item.id) || seen.has(item.id)) {
      errors.push(location + " id invalid or duplicate");
    }
    seen.add(item.id);
    if (typeof item.name !== "string" || !item.name.trim() || item.name.length > 140) {
      errors.push(location + " name invalid");
    }
    if (typeof item.description !== "string" || item.description.length > 500) {
      errors.push(location + " description invalid");
    }
    if (!Array.isArray(item.categories) || item.categories.length > 8 ||
        !item.categories.every(x => typeof x === "string" && x.trim().length > 0 && x.length <= 50)) {
      errors.push(location + " categories invalid");
    }
    if (!origin || !safeBookingUrl(item.url, [origin])) errors.push(location + " unsafe URL");
    if (item.price !== null &&
        (typeof item.price !== "number" || !Number.isFinite(item.price) || item.price < 0)) {
      errors.push(location + " price invalid");
    }
    if (item.currency !== null &&
        (typeof item.currency !== "string" || !/^[A-Z]{3}$/.test(item.currency))) {
      errors.push(location + " currency invalid");
    }
    if (item.price !== null && item.currency === null) errors.push(location + " price has no currency");
  }
  if (catalog.items.length > 0 && catalog.imported_at === null) {
    errors.push("nonempty catalog requires imported_at");
  }
  return errors;
}
