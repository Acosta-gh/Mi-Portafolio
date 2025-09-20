import { findElements } from "../utils/domUtils.js";

/**
 * Componente para manejar animaciones basadas en el scroll.
 * - Comentarios y nombres en español.
 * - Usa IntersectionObserver cuando está disponible (más eficiente).
 * - Fallback con scroll + requestAnimationFrame si no hay soporte.
 * - Respeta prefers-reduced-motion.
 * - Selectores y clases configurables.
 * - Expone destroy() para limpiar listeners/observers.
 */
export default class AnimacionesScroll {
  constructor({
    selector = '.js-scroll',
    claseActiva = 'scrolled',
    root = null,
    rootMargin = '0px 0px -10% 0px',
    threshold = 0,
    observarUnaVez = true,
    autoInit = true
  } = {}) {
    this.selector = selector;
    this.claseActiva = claseActiva;
    this.root = root;
    this.rootMargin = rootMargin;
    this.threshold = threshold;
    this.observarUnaVez = observarUnaVez;

    this.elementos = [];
    this.observer = null;
    this._scrollHandler = null;
    this._rafId = null;

    if (autoInit) this.init();
  }

  init() {
    // Obtener elementos mediante la utilidad (soporta carga dinámica posterior si se vuelve a llamar)
    this.elementos = findElements(this.selector);

    // Respectar preferencia de reducir movimiento
    const mediaReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaReduce && mediaReduce.matches) {
      // Si el usuario prefirió reducir movimiento, marcar todos como visibles sin animación
      this.elementos.forEach((el) => el.classList.add(this.claseActiva));
      return;
    }

    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      this.setupFallback();
    }

    // Ejecutar una comprobación inicial para los elementos ya visibles (solo para fallback)
    if (!('IntersectionObserver' in window)) {
      this.handleScroll(); // run once
    }
  }

  setupObserver() {
    // Crear IntersectionObserver con bind para poder desconectarlo luego
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add(this.claseActiva);
            if (this.observarUnaVez && this.observer) {
              this.observer.unobserve(el);
            }
          } else {
            // Si no queremos que permanezca visible, remover la clase
            if (!this.observarUnaVez) {
              el.classList.remove(this.claseActiva);
            }
          }
        });
      },
      {
        root: this.root,
        rootMargin: this.rootMargin,
        threshold: this.threshold
      }
    );

    this.elementos.forEach((el) => {
      // Mejorar rendimiento: indicar intención de animar
      el.style.willChange = 'opacity, transform';
      this.observer.observe(el);
    });
  }

  setupFallback() {
    // Fallback usando scroll + requestAnimationFrame (debounce)
    this._scrollHandler = this.handleScroll.bind(this);
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    window.addEventListener('resize', this._scrollHandler, { passive: true });
  }

  elementInView(el, offset = 1.25) {
    const elementTop = el.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return elementTop <= viewportHeight / offset;
  }

  elementOutOfView(el) {
    const elementTop = el.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return elementTop > viewportHeight;
  }

  displayScrollElement(el) {
    el.classList.add(this.claseActiva);
  }

  hideScrollElement(el) {
    el.classList.remove(this.claseActiva);
  }

  handleScroll() {
    // Debounce con requestAnimationFrame
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this.elementos.forEach((el) => {
        if (this.elementInView(el, 1.25)) {
          this.displayScrollElement(el);
        } else if (this.elementOutOfView(el)) {
          this.hideScrollElement(el);
        }
      });
      this._rafId = null;
    });
  }

  refresh() {
    // Releer elementos del DOM (útil en SPAs o cuando se inyecta contenido dinámico)
    this.destroy(); // limpiar antes
    this.elementos = findElements(this.selector);
    this.init();
  }

  destroy() {
    // Limpiar observer o listeners
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler, { passive: true });
      window.removeEventListener('resize', this._scrollHandler, { passive: true });
      this._scrollHandler = null;
    }
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }

    // Opcional: limpiar estilos will-change si lo agregamos
    this.elementos.forEach((el) => {
      if (el && el.style) {
        el.style.willChange = '';
      }
    });

    this.elementos = [];
  }
}