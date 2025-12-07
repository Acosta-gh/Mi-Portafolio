import { findElement } from "../utils/domUtils.js";

export function saludo({
  selector = ".main__intro-salutations",
  autoInit = true,
} = {}) {
  let elementoIntro = null;

  function obtenerSaludoSegunHora() {
    const hora = new Date().getHours();
    const lang = document.documentElement.lang || navigator.language || "es";
    const esIngles = String(lang).toLowerCase().startsWith("en");
    if (esIngles) {
      if (hora < 12) return "Good morning";
      if (hora < 18) return "Good afternoon";
      return "Good evening";
    } else {
      if (hora < 12) return "Buenos días";
      if (hora < 18) return "Buenas tardes";
      return "Buenas noches";
    }
  }

  function mostrarSaludo() {
    elementoIntro = findElement(selector);
    if (!elementoIntro) {
      console.warn(`No se encontró el elemento ${selector}`);
      return;
    }

    elementoIntro.textContent = obtenerSaludoSegunHora();
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mostrarSaludo, {
        once: true,
      });
    } else {
      mostrarSaludo();
    }
  }

  if (autoInit) init();

  return { init, mostrarSaludo };
}
