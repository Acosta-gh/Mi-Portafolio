import { translations } from "../data/locales.js";

let currentLang =
  localStorage.getItem("site-lang") || navigator.language.split("-")[0] || "es";

if (!translations[currentLang]) currentLang = "es";

export function setLanguage(lang) {
  if (!translations[lang]) return;

  console.log(`Setting language to: ${lang}`);

  currentLang = lang;
  localStorage.setItem("site-lang", lang);

  updateDOM();
  updateAttributes();

  document.dispatchEvent(
    new CustomEvent("language-changed", {
      detail: { lang: currentLang },
    })
  );
}

function updateDOM() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = getNestedTranslation(translations[currentLang], key);
    if (text) {
      if (el.hasAttribute("data-html")) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  });
}
function updateAttributes() {
  document.documentElement.lang = currentLang;

  const inputs = document.querySelectorAll("[data-i18n-placeholder]");
  inputs.forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const text = getNestedTranslation(translations[currentLang], key);
    if (text) el.placeholder = text;
  });

  const images = document.querySelectorAll("[data-i18n-alt]");
  images.forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    const text = getNestedTranslation(translations[currentLang], key);
    if (text) el.alt = text;
  });

  const cvBtn = document.getElementById("cv-download-btn");
  if (cvBtn) {
    const cvFile = currentLang === "en" ? "cvEN.pdf" : "cvES.pdf";
    cvBtn.href = `assets/docs/${cvFile}`;
  }
}

function getNestedTranslation(obj, path) {
  return path
    .split(".")
    .reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

export function initI18n() {
  setLanguage(currentLang);
}

export function getCurrentTranslation() {
  return translations[currentLang];
}
