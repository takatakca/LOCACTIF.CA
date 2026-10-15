import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { normalizeProduct } from "../site/catalog-utils.mjs";

const providedOrigin = process.env.LOCACTIF_WP_STORE_BASE_URL;
if (!providedOrigin) {
  console.error("LOCACTIF_WP_STORE_BASE_URL is required (the verified HTTPS WordPress Store API origin).");
  process.exitCode = 1;
} else {
  try {
    const parsed = new URL(providedOrigin);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== "/") {
      throw new Error("Expected an HTTPS origin, e.g. https://example.com");
    }
    const origin = parsed.origin;
    const records = new Map();
    for (let page = 1; page <= 5; page++) {
      const url = new URL("/wp-json/wc/store/v1/products", origin);
      url.searchParams.set("per_page","100");
      url.searchParams.set("page",String(page));
      const response = await fetch(url, {signal: AbortSignal.timeout(15000),headers:{"accept":"application/json"}});
      if (!response.ok) throw new Error("Store API returned HTTP " + response.status + " on page " + page);
      const raw = await response.json();
      if (!Array.isArray(raw)) throw new Error("Unexpected Store API response; catalogue left unchanged");
      for (const item of raw) {
        const normalized = normalizeProduct(item, origin);
        if (normalized) records.set(normalized.id, normalized);
      }
      if (raw.length < 100) break;
    }
    const output = {
      schema_version: 1,
      source_origin: origin,
      imported_at: new Date().toISOString(),
      items: [...records.values()]
    };
    if (output.items.length === 0 && process.env.ALLOW_EMPTY_CATALOG !== "true") {
      throw new Error("No valid published bookable products found; refusing to overwrite catalogue with an empty import. Set ALLOW_EMPTY_CATALOG=true only after confirming intended empty inventory.");
    }
    const file = resolve("site/catalog.json");
    await writeFile(file, JSON.stringify(output, null, 2) + "\n");
    console.log("Imported " + output.items.length + " published WooCommerce items from " + origin);
  } catch (error) {
    console.error("Import failed; catalog.json left unchanged:", error.message);
    process.exitCode = 1;
  }
}
