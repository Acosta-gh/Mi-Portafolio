import { findElement } from '../utils/domUtils.js';

/**
 * Componente que genera un saludo basado en la hora actual.
 * - Comentarios y nombres de variables en español.
 * - Usa textContent en lugar de innerHTML para evitar posibles XSS.
 * - Permite pasar selector y autoInit opcionales.
 */
export default class Saludo {
  constructor({ selector = '.main__intro-salutations', autoInit = true } = {}) {
    this.selector = selector;
    this.elementoIntro = null;
    if (autoInit) this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.mostrarSaludo(), { once: true });
    } else {
      this.mostrarSaludo();
    }
  }

  mostrarSaludo() {
    this.elementoIntro = findElement(this.selector);
    if (!this.elementoIntro) {
      console.warn(`No se encontró el elemento ${this.selector}`);
      return;
    }

    this.elementoIntro.textContent = this.obtenerSaludoSegunHora();
  }

  obtenerSaludoSegunHora() {
    const hora = new Date().getHours();
    const lang = document.documentElement.lang || (navigator.language || 'es');
    const esIngles = String(lang).toLowerCase().startsWith('en');

    if (esIngles) {
      if (hora < 12) return 'Good morning';
      if (hora < 18) return 'Good afternoon';
      return 'Good evening';
    } else {
      if (hora < 12) return 'Buenos días';
      if (hora < 18) return 'Buenas tardes';
      return 'Buenas noches';
    }
  }
}