const allowedProtocol = "https:";

export function safeBookingUrl(input, trustedOrigins = []) {
  if (typeof input !== "string" || !input) return null;
  try {
    const url = new URL(input);
    if (url.protocol !== allowedProtocol || url.username || url.password) return null;
    if (!trustedOrigins.includes(url.origin)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function normalizeProduct(product, trustedOrigin) {
  if (!product || typeof product !== "object") return null;
  const id = Number(product.id);
  const link = safeBookingUrl(product.permalink, [trustedOrigin]);
  const name = typeof product.name === "string" ? product.name.replace(/<[^>]*>/g, "").trim().slice(0, 140) : "";
  if (!Number.isSafeInteger(id) || id <= 0 || !link || !name) return null;
  const shortDescription = typeof product.short_description === "string"
    ? product.short_description.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim().slice(0, 300)
    : "";
  const price = product.prices;
  const amount = price && typeof price.price === "string" && /^\d+$/.test(price.price)
    ? Number(price.price) / 10 ** Number(price.currency_minor_unit ?? 2)
    : null;
  const currency = price && typeof price.currency_code === "string" && /^[A-Z]{3}$/.test(price.currency_code)
    ? price.currency_code : null;
  const categories = Array.isArray(product.categories)
    ? [...new Set(product.categories.filter((c) => c && typeof c.name === "string").map((c) => c.name.replace(/<[^>]*>/g, "").trim().slice(0, 50)).filter(Boolean))].slice(0, 8)
    : [];
  return {
    id: String(id),
    name, description: shortDescription, categories, url: link,
    price: amount !== null && Number.isFinite(amount) && amount >= 0 && currency ? amount : null,
    currency
  };
}

export function filterCatalog(items, {search = "", category = "", favorites = [], onlyFavorites = false} = {}) {
  const q = String(search).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim().slice(0, 120);
  const normalize = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  const saved = new Set(favorites);
  return items.filter((item) =>
    (!onlyFavorites || saved.has(item.id)) &&
    (!category || item.categories.includes(category)) &&
    (!q || normalize([item.name, item.description, ...item.categories].join(" ")).includes(q))
  );
}
