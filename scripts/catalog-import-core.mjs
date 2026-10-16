import { normalizeProduct } from "../site/catalog-utils.mjs";
import { validateCatalog } from "../site/catalog-schema.mjs";

export function trustedStoreOrigin(value) {
  if (typeof value !== "string" || !value) throw new Error("LOCACTIF_WP_STORE_BASE_URL is required");
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" ||
      url.search || url.hash || url.href !== url.origin + "/") {
    throw new Error("Expected a trusted HTTPS origin only, without credentials or path");
  }
  return url.origin;
}

export function parseCategoryIds(value) {
  if (typeof value !== "string" || !/^[1-9]\d*(?:\s*,\s*[1-9]\d*)*$/.test(value.trim())) {
    throw new Error("LOCACTIF_CATEGORY_IDS must list approved numeric WooCommerce category IDs, e.g. 12,34");
  }
  const ids = [...new Set(value.split(",").map(x => Number(x.trim())))];
  if (ids.some(id => !Number.isSafeInteger(id))) throw new Error("Invalid WooCommerce category ID");
  return ids;
}

export async function getStoreInventory({origin, fetchImpl, maxPages = 5}) {
  const trustedOrigin = trustedStoreOrigin(origin);
  if (typeof fetchImpl !== "function") throw new TypeError("fetchImpl must be a function");
  if (!Number.isSafeInteger(maxPages) || maxPages < 1 || maxPages > 5) throw new Error("maxPages must be 1..5");
  const entries = [];
  const ids = new Set();
  const categoryMap = new Map();
  for (let page = 1; page <= maxPages; page++) {
    const url = new URL("/wp-json/wc/store/v1/products", trustedOrigin);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    const response = await fetchImpl(url, {
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      headers: {"accept": "application/json"}
    });
    if (!response || !response.ok) throw new Error("Store API failed on page " + page + " (HTTP " + (response?.status ?? "unknown") + ")");
    if (response.redirected || (response.url && new URL(response.url).origin !== trustedOrigin)) {
      throw new Error("Store API redirected outside the trusted source");
    }
    const mime = response.headers?.get?.("content-type");
    if (mime && !/^\s*application\/(?:json|[\w.+-]+\+json)\b/i.test(mime)) {
      throw new Error("Store API returned non-JSON content on page " + page);
    }
    const raw = await response.json();
    if (!Array.isArray(raw) || raw.length > 100) throw new Error("Invalid Store API page " + page);
    for (const product of raw) {
      if (!product || typeof product !== "object" || !Number.isSafeInteger(Number(product.id)) ||
          Number(product.id) <= 0) throw new Error("Unexpected product ID on page " + page);
      const id = Number(product.id);
      if (ids.has(id)) throw new Error("Duplicate product ID across pages: " + id);
      ids.add(id);
      entries.push(product);
      if (Array.isArray(product.categories)) {
        for (const c of product.categories) {
          const categoryId = Number(c?.id);
          if (Number.isSafeInteger(categoryId) && categoryId > 0 && typeof c.name === "string") {
            categoryMap.set(categoryId, c.name.replace(/<[^>]*>/g, "").trim().slice(0, 50));
          }
        }
      }
    }
    if (page === maxPages && raw.length === 100) throw new Error("Catalogue may exceed page limit; refusing a truncated import");
    if (raw.length < 100) break;
  }
  return {trustedOrigin, entries, categories: [...categoryMap].sort((a,b) => a[0] - b[0])};
}

export function buildCatalog(inventory, {approvedCategories, now = new Date()} = {}) {
  if (!inventory || !Array.isArray(inventory.entries)) throw new Error("Missing verified inventory");
  if (!Array.isArray(approvedCategories) || approvedCategories.length === 0) {
    throw new Error("Approved category IDs required; run --inspect before importing");
  }
  const allowed = new Set(approvedCategories);
  const items = [];
  let excludedByCategory = 0, excludedUnavailable = 0, rejected = 0;
  for (const product of inventory.entries) {
    const matchesCategory = Array.isArray(product.categories) &&
      product.categories.some(c => allowed.has(Number(c?.id)));
    if (!matchesCategory) { excludedByCategory++; continue; }
    if (product.is_in_stock === false) { excludedUnavailable++; continue; }
    const item = normalizeProduct(product, inventory.trustedOrigin);
    if (!item) { rejected++; continue; }
    items.push(item);
  }
  const catalog = {
    schema_version: 1,
    source_origin: inventory.trustedOrigin,
    imported_at: now.toISOString(),
    items
  };
  const problems = validateCatalog(catalog);
  if (problems.length) throw new Error("Catalog rejected: " + problems.join("; "));
  return {catalog, stats:{total:inventory.entries.length, imported:items.length, excludedByCategory, excludedUnavailable, rejected}};
}
