/**
 * EN: WARNING - This file was created in whole or in part with the assistance of a Large Language Model (LLM/AI).
 *     Tracked separately for potential legal/compliance review in case copyright, open-source licensing,
 *     or AI code attribution rules change in the future.
 *
 * ES: AVISO - Este archivo fue creado total o parcialmente con la ayuda de un Modelo de Lenguaje Grande (LLM/IA).
 *     Se lleva registrado por separado para una posible revisión legal/regulatoria en caso de que cambien
 *     las leyes de copyright, licencias de código abierto o las reglas sobre atribución de código generado por IA.
 */

import ScrollAnimations from "./components/scrollAnimations.js";
import { actualizarSaludo } from "./components/greeting.js"; 
import { initI18n, setLanguage, getCurrentTranslation } from "./utils/i18n.js";
import { fadeEffect } from "./components/fadeEffect.js";
import { barraNavegacion } from "./components/navbar.js";
import { typewriter } from "./components/typewriter.js";

document.addEventListener("DOMContentLoaded", () => {
  new ScrollAnimations();
  fadeEffect();
  barraNavegacion();
  
  initI18n(); 

  actualizarSaludo();

  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const btnEs = document.querySelector("#btn-es");
  const btnEn = document.querySelector("#btn-en");
  if (btnEs) btnEs.addEventListener("click", () => setLanguage("es"));
  if (btnEn) btnEn.addEventListener("click", () => setLanguage("en"));

  const introJobPositions = document.querySelector(".main__intro-position--type");
  let typewriterInstance = null;

  function startTypewriter() {
    if (!introJobPositions) return;
    if (typewriterInstance) typewriterInstance.stop();

    const currentData = getCurrentTranslation();
    const words = currentData.hero.jobs;

    typewriterInstance = typewriter(introJobPositions, words);
  }

  startTypewriter();

  document.addEventListener("language-changed", () => {
    startTypewriter();
    actualizarSaludo();
  });
});