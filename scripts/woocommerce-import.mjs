import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getStoreInventory, parseCategoryIds, buildCatalog } from "./catalog-import-core.mjs";
import { reviewCatalogUpdate, publishCatalogAtomically } from "./catalog-publish.mjs";

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
      const file = resolve("site/catalog.json");
      // A tracked, valid catalogue must exist: do not silently reset one if deleted.
      const existing = JSON.parse(await readFile(file,"utf8"));
      const review = reviewCatalogUpdate(existing,catalog,{
        allowEmpty: process.env.ALLOW_EMPTY_CATALOG === "true",
        confirmShrink: process.env.CONFIRM_CATALOG_SHRINK === "true"
      });
      console.log("Catalog change preview:",JSON.stringify(review));
      await publishCatalogAtomically(file,catalog);
      console.log("Catalog updated:", JSON.stringify(stats));
      console.log("Review the offers, links and booking rules before committing site/catalog.json.");
    }
  } catch (error) {
    console.error("Import failed. Catalog on disk remains unchanged:", error.message);
    process.exitCode = 1;
  }
}
