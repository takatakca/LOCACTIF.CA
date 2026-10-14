import { translations } from "./translations.mjs";

const nav = document.querySelector("[data-nav]");
const menu = document.querySelector("[data-menu]");
const buttons = document.querySelectorAll("[data-lang]");
const key = "locactif.language";
let locale = "fr";

function persist(value) {
  try { localStorage.setItem(key, value); } catch { /* Storage may be disabled. */ }
}

function menuLabel() {
  const open = nav.dataset.open === "true";
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", translations[locale][open ? "menuClose" : "menuOpen"]);
}

function setLanguage(value) {
  if (!Object.hasOwn(translations, value)) return;
  locale = value;
  const words = translations[locale];
  document.documentElement.lang = locale;
  document.title = words.title;
  document.querySelector('meta[name="description"]').content = words.description;
  document.querySelectorAll("[data-t]").forEach((node) => {
    const translated = words[node.dataset.t];
    if (typeof translated === "string") node.textContent = translated;
  });
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === locale)));
  document.querySelector("[data-lang-group]").setAttribute("aria-label", words.languageLabel);
  nav.setAttribute("aria-label", words.navigationLabel);
  document.querySelector(".logo").setAttribute("aria-label", words.brandLabel);
  menuLabel();
  persist(locale);
}

function closeMenu() {
  nav.dataset.open = "false";
  menuLabel();
}

menu.addEventListener("click", () => {
  nav.dataset.open = nav.dataset.open === "true" ? "false" : "true";
  menuLabel();
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
buttons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
document.querySelector("[data-year]").textContent = String(new Date().getFullYear());

let saved = null;
try { saved = localStorage.getItem(key); } catch { /* Storage may be disabled. */ }
setLanguage(Object.hasOwn(translations, saved) ? saved : (navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr"));
