import { safeBookingUrl, explorerReturnHref } from "./catalog-utils.mjs";
import { validateCatalog } from "./catalog-schema.mjs";

const find = (selector) => document.querySelector(selector);
const copy = {
  fr: {
    skip:"Aller au contenu",home:"Accueil",catalog:"Explorer",back:"Retour aux expériences",
    eyebrow:"Expérience locale",priceLabel:"Tarif publié",booking:"Consulter l'offre originale",
    notice:"Les prix et les disponibilités peuvent changer. Vérifiez les horaires, les conditions et la réservation sur le site de l'organisateur. Aucun paiement n'est traité ici.",
    footer:"Des expériences près de vous.",loadingTitle:"Chargement de l'expérience…",loadingMessage:"Consultation du catalogue.",
    missingTitle:"Cette expérience est introuvable.",missingMessage:"Ce lien est peut-être ancien. Consultez le catalogue pour découvrir les offres actuellement publiées.",
    errorTitle:"Catalogue indisponible.",errorMessage:"Impossible de charger les informations de cette expérience. Réessayez plus tard.",
    save:"Ajouter aux favoris",remove:"Retirer des favoris",priceUnknown:"Vérifier le tarif sur le site source",
    descriptionUnknown:"Description à consulter sur le site source.",categoryUnknown:"Activité",title:"Expérience"
  },
  en: {
    skip:"Skip to content",home:"Home",catalog:"Explore",back:"Back to experiences",
    eyebrow:"Local experience",priceLabel:"Published price",booking:"View original listing",
    notice:"Prices and availability can change. Confirm schedules, terms and bookings on the organizer's site. No payment is processed here.",
    footer:"Experiences near you.",loadingTitle:"Loading experience…",loadingMessage:"Checking the catalog.",
    missingTitle:"Experience not found.",missingMessage:"This link may be outdated. Visit the catalog to see currently published offers.",
    errorTitle:"Catalog unavailable.",errorMessage:"This experience cannot be loaded right now. Please try again later.",
    save:"Save to favorites",remove:"Remove from favorites",priceUnknown:"Check price on the original site",
    descriptionUnknown:"See the original site for a description.",categoryUnknown:"Activity",title:"Experience"
  }
};

const storageKey = "locactif.favorites";
let locale = "fr";
let item = null;
let status = "loading";
let favorites = [];
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(stored)) favorites = stored.filter((value) => typeof value === "string").slice(0,500);
} catch { /* Favorites are optional. */ }
const currentParams = new URLSearchParams(location.search);
const desiredId = currentParams.get("id");
find("[data-back-link]").href = explorerReturnHref(currentParams);

function setState(kind) {
  status = kind;
  const w = copy[locale];
  find("[data-detail]").hidden = kind !== "ready";
  find("[data-state]").hidden = kind === "ready";
  if (kind !== "ready") {
    find("[data-state-title]").textContent = w[kind + "Title"];
    find("[data-state-message]").textContent = w[kind + "Message"];
  }
}

function saveFavorites() {
  try { localStorage.setItem(storageKey,JSON.stringify(favorites)); } catch { /* In-session only. */ }
}
function updateFavorite() {
  if (!item) return;
  const saved = favorites.includes(item.id);
  find("[data-favorite]").setAttribute("aria-pressed",String(saved));
  find("[data-heart]").textContent = saved ? "♥" : "♡";
  find("[data-favorite-label]").textContent = saved ? copy[locale].remove : copy[locale].save;
}
function renderItem() {
  if (!item) return;
  const w = copy[locale];
  find("[data-title]").textContent = item.name;
  find("[data-categories]").textContent = item.categories.join(" · ") || w.categoryUnknown;
  find("[data-description]").textContent = item.description || w.descriptionUnknown;
  let price = w.priceUnknown;
  if (typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0 && typeof item.currency === "string") {
    try { price = new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA",{style:"currency",currency:item.currency}).format(item.price); } catch {}
  }
  find("[data-price]").textContent = price;
  updateFavorite();
  document.title = item.name + " — LOCACTIF";
}
function setLocale(lang) {
  if (!Object.hasOwn(copy,lang)) return;
  locale = lang;
  const w = copy[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const next = w[element.dataset.i18n];
    if (typeof next === "string") element.textContent = next;
  });
  document.querySelectorAll("[data-lang]").forEach((button) => button.setAttribute("aria-pressed",String(button.dataset.lang === lang)));
  find("[data-language-group]").setAttribute("aria-label",lang === "fr" ? "Choix de langue" : "Language selection");
  document.title = w.title + " — LOCACTIF";
  if (item) renderItem();
  else setState(status);
  try { localStorage.setItem("locactif.language",lang); } catch {}
}

find("[data-favorite]").addEventListener("click",() => {
  if (!item) return;
  favorites = favorites.includes(item.id) ? favorites.filter((id) => id !== item.id) : [...favorites,item.id].slice(-500);
  saveFavorites();
  updateFavorite();
});
document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click",() => setLocale(button.dataset.lang)));
find("[data-year]").textContent = String(new Date().getFullYear());
let preferred = null;
try { preferred = localStorage.getItem("locactif.language"); } catch {}
setLocale(preferred === "en" || preferred === "fr" ? preferred : navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr");

if (!desiredId || !/^[1-9][0-9]{0,15}$/.test(desiredId)) {
  setState("missing");
} else {
  try {
    const response = await fetch("./catalog.json",{cache:"no-store"});
    if (!response.ok) throw new Error("HTTP " + response.status);
    const catalog = await response.json();
    if (validateCatalog(catalog).length) throw new Error("Invalid catalog");
    const origin = new URL(catalog.source_origin);
    const match = catalog.items.find((product) => product && product.id === desiredId);
    if (!match) {
      setState("missing");
    } else if (typeof match.name !== "string" || !match.name.trim() || !Array.isArray(match.categories) ||
      typeof match.description !== "string" || !safeBookingUrl(match.url,[origin.origin])) {
      throw new Error("Invalid product");
    } else {
      item = match;
      find("[data-booking]").href = safeBookingUrl(item.url,[origin.origin]);
      setState("ready");
      renderItem();
    }
  } catch {
    setState("error");
  }
}
