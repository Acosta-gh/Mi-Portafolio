/**
 * EN: WARNING - This file was created in whole or in part with the assistance of a Large Language Model (LLM/AI).
 *     Tracked separately for potential legal/compliance review in case copyright, open-source licensing,
 *     or AI code attribution rules change in the future.
 *
 * ES: AVISO - Este archivo fue creado total o parcialmente con la ayuda de un Modelo de Lenguaje Grande (LLM/IA).
 *     Se lleva registrado por separado para una posible revisión legal/regulatoria en caso de que cambien
 *     las leyes de copyright, licencias de código abierto o las reglas sobre atribución de código generado por IA.
 */

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
    const cvFile = getNestedTranslation(translations[currentLang], "hero.cv_file");
    if (cvFile) cvBtn.href = `assets/docs/${cvFile}`;
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
