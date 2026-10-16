import { randomUUID } from "node:crypto";
import { dirname, basename, join } from "node:path";
import { writeFile, rename, rm } from "node:fs/promises";
import { validateCatalog } from "../site/catalog-schema.mjs";

export function reviewCatalogUpdate(existing, incoming, {allowEmpty = false, confirmShrink = false} = {}) {
  const incomingIssues = validateCatalog(incoming);
  if (incomingIssues.length) throw new Error("New catalog invalid: " + incomingIssues.join("; "));
  if (!existing) throw new Error("Existing catalog is required; preserve historical published inventory");
  const existingIssues = validateCatalog(existing);
  if (existingIssues.length) throw new Error("Existing catalog invalid: " + existingIssues.join("; "));
  if (incoming.items.length === 0 && !allowEmpty) {
    throw new Error("Empty catalogue refused. ALLOW_EMPTY_CATALOG=true requires explicit inventory review");
  }
  if (existing.items.length && existing.source_origin !== incoming.source_origin) {
    throw new Error("Catalog origin changed; migration requires separate review");
  }
  if (existing.items.length && incoming.items.length * 2 < existing.items.length && !confirmShrink) {
    throw new Error("Catalog reduced by more than 50%; CONFIRM_CATALOG_SHRINK=true requires explicit review");
  }
  const previous = new Set(existing.items.map(p => p.id));
  const next = new Set(incoming.items.map(p => p.id));
  return {
    retained: [...previous].filter(id => next.has(id)).length,
    added: [...next].filter(id => !previous.has(id)).length,
    removed: [...previous].filter(id => !next.has(id)).length
  };
}

// Ensure a failed or interrupted write does not truncate site/catalog.json.
// Keep the temporary file in the same directory for atomic rename on one filesystem.
export async function publishCatalogAtomically(file, catalog, io = {writeFile, rename, rm}) {
  const issues = validateCatalog(catalog);
  if (issues.length) throw new Error("Refusing invalid catalog: " + issues.join("; "));
  const temp = join(dirname(file), "." + basename(file) + "." + randomUUID() + ".tmp");
  try {
    await io.writeFile(temp, JSON.stringify(catalog, null, 2) + "\n", {encoding:"utf8",flag:"wx",mode:0o600});
    await io.rename(temp, file);
  } finally {
    try { await io.rm(temp, {force:true}); } catch { /* Best-effort cleanup after failed rename. */ }
  }
}
