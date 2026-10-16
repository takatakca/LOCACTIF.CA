import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getStoreInventory, parseCategoryIds, buildCatalog } from "./catalog-import-core.mjs";
import { validateCatalog } from "../site/catalog-schema.mjs";

const inspect = process.argv.includes("--inspect");
const allowedFlags = new Set(["--inspect"]);
const unexpectedFlags = process.argv.slice(2).filter(flag => !allowedFlags.has(flag));
if (unexpectedFlags.length) {
  console.error("Unknown arguments:", unexpectedFlags.join(" "));
  process.exitCode = 1;
} else {
  try {
    const origin = process.env.LOCACTIF_WP_STORE_BASE_URL;
    const inventory = await getStoreInventory({origin, fetchImpl: fetch});
    console.log("WooCommerce source:", inventory.trustedOrigin);
    console.log("Published public products available in Store API:", inventory.entries.length);
    console.log("Reported categories (ID/name):");
    for (const [id, name] of inventory.categories) console.log(" ", id, JSON.stringify(name));
    if (inspect) {
      console.log("READ-ONLY inspection complete. No catalogue file changed.");
    } else {
      const approvedCategories = parseCategoryIds(process.env.LOCACTIF_CATEGORY_IDS);
      const {catalog, stats} = buildCatalog(inventory, {approvedCategories});
      if (catalog.items.length === 0 && process.env.ALLOW_EMPTY_CATALOG !== "true") {
        throw new Error("No matching in-stock valid offers; refusing to erase a catalog. Review category IDs and source.");
      }
      const file = resolve("site/catalog.json");
      try {
        const existing = JSON.parse(await readFile(file, "utf8"));
        const issues = validateCatalog(existing);
        if (issues.length) throw new Error("Existing catalog invalid: " + issues.join("; "));
        if (existing.items.length > 0 && existing.source_origin !== catalog.source_origin) {
          throw new Error("Source origin changed. Review migration manually; existing catalog preserved.");
        }
        if (existing.items.length > 0 && catalog.items.length < existing.items.length / 2 &&
            process.env.CONFIRM_CATALOG_SHRINK !== "true") {
          throw new Error("New import removes more than half the catalog; set CONFIRM_CATALOG_SHRINK=true only after review.");
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
      await writeFile(file, JSON.stringify(catalog, null, 2) + "\n");
      console.log("Catalog updated:", JSON.stringify(stats));
      console.log("Review the offers, links and booking rules before committing site/catalog.json.");
    }
  } catch (error) {
    console.error("Import failed. Catalog on disk remains unchanged:", error.message);
    process.exitCode = 1;
  }
}
