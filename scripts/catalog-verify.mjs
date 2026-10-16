import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export { validateCatalog } from "../site/catalog-schema.mjs";
import { validateCatalog } from "../site/catalog-schema.mjs";

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const path = resolve(process.argv[2] || "site/catalog.json");
    const catalog = JSON.parse(readFileSync(path, "utf8"));
    const errors = validateCatalog(catalog);
    if (errors.length) {
      console.error("Catalog validation failed:\n" + errors.join("\n"));
      process.exitCode = 1;
    } else {
      console.log("Catalog valid: " + catalog.items.length + " items; source: " + catalog.source_origin);
    }
  } catch (error) {
    console.error("Could not verify catalog:", error.message);
    process.exitCode = 1;
  }
}
