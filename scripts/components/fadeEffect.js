// fade-effect.js
import { findElement } from '../utils/domUtils.js';

/**
 * Componente para aplicar un efecto de fade-in al cargar o al invocar.
 * - Usa requestAnimationFrame
 * - Respeta prefers-reduced-motion
 * - Permite selector, duración (ms) y autoInit (boolean)
 * - Expone destroy() para cleanup
 */
export default class FadeEffect {
  constructor({ selector = 'body', duration = 500, autoInit = true } = {}) {
    this.selector = selector;
    this.duration = Math.max(0, duration);
    this.rafId = null;
    this.startTime = null;
    this.element = null;
    if (autoInit) this.init();
  }

  init() {
    // Si el usuario prefiere reducir movimiento, no animamos
    const media = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media && media.matches) {
      const el = findElement(this.selector);
      if (el) el.style.opacity = 1;
      return;
    }

    // Esperar DOMContentLoaded para SPAs o scripts tardíos
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start(), { once: true });
    } else {
      this.start();
    }
  }

  start() {
    this.element = findElement(this.selector);
    if (!this.element) return;

    this.element.style.opacity = '0';
    this.element.style.willChange = 'opacity';
    this.startTime = null;

    const step = (timestamp) => {
      if (!this.startTime) this.startTime = timestamp;
      const elapsed = timestamp - this.startTime;
      const progress = Math.min(1, elapsed / Math.max(1, this.duration));
      this.element.style.opacity = String(progress);
      if (progress < 1) {
        this.rafId = window.requestAnimationFrame(step);
      } else {
        this.cleanupStyle();
      }
    };

    this.rafId = window.requestAnimationFrame(step);
  }

  cleanupStyle() {
    if (!this.element) return;
    this.element.style.willChange = '';
    // dejar opacity en 1 explícitamente y eliminar inline si prefieres
    this.element.style.opacity = '1';
  }

  destroy() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.startTime = null;
    this.element = null;
  }
}