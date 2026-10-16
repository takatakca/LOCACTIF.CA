import { filterCatalog, safeBookingUrl, experienceHref } from "./catalog-utils.mjs";
import { validateCatalog } from "./catalog-schema.mjs";

const $ = (selector) => document.querySelector(selector);
const words = {
  fr: {
    title:"Découvrez ce qui vous fait vibrer.",description:"Activités, expériences, ateliers et découvertes locales. Les offres apparaissent uniquement lorsqu'elles sont publiées par une source vérifiée.",
    skip:"Aller au contenu",home:"Accueil",explore:"Explorer",eyebrow:"La découverte commence ici",
    searchLabel:"Rechercher une expérience",searchButton:"Rechercher ↗",searchPlaceholder:"Activité, mot-clé, lieu...",
    catalogKicker:"La sélection",results:"Toutes les expériences",all:"Tout voir",favorites:"Mes favoris",
    categoryLabel:"Catégorie",allCategories:"Toutes les catégories",clear:"Effacer les filtres",disclaimer:"Les réservations et les paiements ne sont pas effectués sur cette page. Les offres publiées renvoient vers leur système de réservation officiel. Les favoris sont conservés uniquement sur cet appareil.",
    footer:"Découvrir, à son rythme.",count:(n)=>`${n} expérience${n === 1 ? "" : "s"}`,
    emptyTitle:"Le catalogue se prépare.",emptyDescription:"Aucune expérience vérifiée n'a encore été importée. Revenez consulter cette page après la publication des offres.",
    noMatchTitle:"Aucun résultat",noMatchDescription:"Essayez d'autres mots-clés ou effacez vos filtres.",
    noFavoriteTitle:"Aucun favori",noFavoriteDescription:"Enregistrez des expériences sur cet appareil pour les retrouver ici.",
    errorTitle:"Catalogue indisponible",errorDescription:"Nous ne pouvons pas charger les expériences actuellement. Veuillez réessayer plus tard.",
    priceUnknown:"Voir le tarif",reserve:"Voir l'offre ↗",save:"Ajouter aux favoris",unsave:"Retirer des favoris",categoryFallback:"Expérience"
  },
  en: {
    title:"Discover what moves you.",description:"Activities, experiences, workshops and local discoveries. Offers appear only when published by a verified source.",
    skip:"Skip to content",home:"Home",explore:"Explore",eyebrow:"Discovery starts here",
    searchLabel:"Search for an experience",searchButton:"Search ↗",searchPlaceholder:"Activity, keyword, location...",
    catalogKicker:"The selection",results:"All experiences",all:"Browse all",favorites:"My favorites",
    categoryLabel:"Category",allCategories:"All categories",clear:"Clear filters",disclaimer:"Bookings and payments are not made on this page. Published offers link to their official booking system. Favorites are stored only on this device.",
    footer:"Discover at your own pace.",count:(n)=>`${n} experience${n === 1 ? "" : "s"}`,
    emptyTitle:"The catalog is being prepared.",emptyDescription:"No verified experiences have been imported yet. Please check back once offers are published.",
    noMatchTitle:"No results",noMatchDescription:"Try other search terms or clear your filters.",
    noFavoriteTitle:"No favorites yet",noFavoriteDescription:"Save experiences on this device to find them here.",
    errorTitle:"Catalog unavailable",errorDescription:"We cannot load experiences right now. Please try again later.",
    priceUnknown:"See pricing",reserve:"View offer ↗",save:"Save to favorites",unsave:"Remove from favorites",categoryFallback:"Experience"
  }
};

const params = new URLSearchParams(window.location.search);
const searchInput = $("[data-search]");
let locale = "fr";
let items = [];
let sourceOrigin = null;
let error = false;
let view = "all";
let category = params.get("category") || "";
let favorites = [];
try {
  const saved = JSON.parse(localStorage.getItem("locactif.favorites") || "[]");
  if (Array.isArray(saved)) favorites = saved.filter((v) => typeof v === "string").slice(0, 500);
} catch { /* Storage may be unavailable. */ }
searchInput.value = (params.get("q") || "").slice(0, 120);
function saveFavorites() {
  try { localStorage.setItem("locactif.favorites", JSON.stringify(favorites)); } catch { /* No storage: in-session only. */ }
}
function setLocale(next) {
  if (!(next in words)) return;
  locale = next;
  document.documentElement.lang = locale;
  document.title = (locale === "fr" ? "Explorer" : "Explore") + " — LOCACTIF";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    if (typeof words[locale][node.dataset.i18n] === "string") node.textContent = words[locale][node.dataset.i18n];
  });
  document.querySelectorAll("[data-lang]").forEach((node) => node.setAttribute("aria-pressed", String(node.dataset.lang === locale)));
  searchInput.placeholder = words[locale].searchPlaceholder;
  $("[data-lang-group]").setAttribute("aria-label", locale === "fr" ? "Choix de langue" : "Language selection");
  render();
  try { localStorage.setItem("locactif.language", locale); } catch {}
}
function refreshUrl() {
  const next = new URL(window.location.href);
  if (searchInput.value.trim()) next.searchParams.set("q", searchInput.value.trim());
  else next.searchParams.delete("q");
  if (category) next.searchParams.set("category", category);
  else next.searchParams.delete("category");
  window.history.replaceState(null, "", next);
}
function textEl(tag, cls, content) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  node.textContent = content;
  return node;
}
function card(item) {
  const w = words[locale];
  const article = textEl("article", "experience", "");
  const icon = textEl("div", "experience-image", "✳");
  icon.setAttribute("aria-hidden", "true");
  article.append(icon);
  const body = textEl("div", "experience-content", "");
  body.append(textEl("span", "experience-type", item.categories[0] || w.categoryFallback));
  const heading = textEl("h3", "", "");
  const detailLink = textEl("a", "", item.name);
  detailLink.href = experienceHref(item.id, searchInput.value, category);
  heading.append(detailLink);
  body.append(heading);
  body.append(textEl("p", "", item.description || ""));
  const bottom = textEl("div", "experience-bottom", "");
  let price = w.priceUnknown;
  if (typeof item.price === "number" && item.currency) {
    try { price = new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {style:"currency",currency:item.currency}).format(item.price); } catch {}
  }
  bottom.append(textEl("span", "experience-price", price));
  const actions = textEl("div", "experience-actions", "");
  const fav = textEl("button", "favorite-button", favorites.includes(item.id) ? "♥" : "♡");
  fav.type = "button";
  fav.setAttribute("aria-label", favorites.includes(item.id) ? w.unsave : w.save);
  fav.setAttribute("aria-pressed", String(favorites.includes(item.id)));
  fav.addEventListener("click", () => {
    favorites = favorites.includes(item.id) ? favorites.filter((id) => id !== item.id) : [...favorites, item.id].slice(-500);
    saveFavorites();
    render();
  });
  actions.append(fav);
  const link = textEl("a", "experience-link", w.reserve);
  link.href = item.url;
  link.rel = "noopener noreferrer";
  link.target = "_blank";
  actions.append(link);
  bottom.append(actions);
  body.append(bottom);
  article.append(body);
  return article;
}
function render() {
  const w = words[locale];
  const valid = items.filter((item) => item && typeof item.id === "string" && typeof item.name === "string" && Array.isArray(item.categories) && safeBookingUrl(item.url, sourceOrigin ? [sourceOrigin] : []));
  const categories = [...new Set(valid.flatMap((item) => item.categories))].sort((a,b) => a.localeCompare(b,locale));
  if (category && valid.length && !categories.includes(category)) category = "";
  const select = $("[data-category]");
  select.replaceChildren(textEl("option", "", w.allCategories));
  select.firstChild.value = "";
  for (const value of categories) {
    const option = textEl("option", "", value); option.value = value; select.append(option);
  }
  select.value = category;
  document.querySelectorAll("[data-view]").forEach((node) => node.setAttribute("aria-pressed", String(node.dataset.view === view)));
  const matches = filterCatalog(valid,{search:searchInput.value,category,favorites,onlyFavorites:view === "favorites"});
  const results = $("[data-results]");
  results.replaceChildren(...matches.map(card));
  $("[data-count]").textContent = w.count(matches.length);
  const state = $("[data-state]");
  state.hidden = matches.length > 0;
  if (!matches.length) {
    const kind = error ? "error" : valid.length === 0 ? "empty" : view === "favorites" && !favorites.length ? "noFavorite" : "noMatch";
    $("[data-state-title]").textContent = w[kind + "Title"];
    $("[data-state-description]").textContent = w[kind + "Description"];
  }
}
$("[data-search-form]").addEventListener("submit",(event) => {event.preventDefault();refreshUrl();render();});
$("[data-category]").addEventListener("change",(event) => {category=event.target.value;refreshUrl();render();});
$("[data-clear]").addEventListener("click",()=> {searchInput.value="";category="";view="all";refreshUrl();render();});
document.querySelectorAll("[data-view]").forEach((node) => node.addEventListener("click",()=>{view=node.dataset.view;render();}));
document.querySelectorAll("[data-lang]").forEach((node) => node.addEventListener("click",()=>setLocale(node.dataset.lang)));
$("[data-year]").textContent = String(new Date().getFullYear());
let previous = null;
try { previous = localStorage.getItem("locactif.language"); } catch {}
setLocale(previous === "en" || previous === "fr" ? previous : navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr");
try {
  const response = await fetch("./catalog.json", {cache:"no-store"});
  if (!response.ok) throw new Error("Catalog fetch failed");
  const catalog = await response.json();
  const errors = validateCatalog(catalog);
  if (errors.length) throw new Error("Invalid catalog");
  sourceOrigin = new URL(catalog.source_origin).origin;
  items = catalog.items;
} catch {
  error = true;
}
render();
