import { findElement, findElements } from "../utils/domUtils.js";

/**
 * Componente para gestionar la animación y comportamiento del navbar.
 * Mejoras incluidas:
 * - Nombres en español, comentarios en español.
 * - Usa findElement/findElements (utilidades compartidas).
 * - Soporte accesible (aria-expanded, keyboard: Enter/Space).
 * - Mejor manejo de eventos con referencias para poder limpiar (destroy).
 * - Debounce de scroll con requestAnimationFrame para rendimiento.
 * - Respeta clicks rápidos (butIJustClicked) para evitar desactivaciones no deseadas.
 */
export default class BarraNavegacion {
  constructor({
    selectorHeader = ".header",
    selectorBurger = ".header__nav-burguer",
    selectorNavItems = ".header__nav-item",
    selectorNav = ".header__nav-list",
    selectorLangMenu = ".header__nav-langmenu",
    selectorLangItems = ".header__nav-langitem",
    selectorLangList = ".header__nav-langlist",
    autoInit = true,
  } = {}) {
    // selectores configurables
    this.selectorHeader = selectorHeader;
    this.selectorBurger = selectorBurger;
    this.selectorNavItems = selectorNavItems;
    this.selectorNav = selectorNav;
    this.selectorLangMenu = selectorLangMenu;
    this.selectorLangItems = selectorLangItems;
    this.selectorLangList = selectorLangList;

    // elementos (se obtienen en init para soportar carga dinámica)
    this.header = null;
    this.burger = null;
    this.navItems = null;
    this.nav = null;
    this.langMenu = null;
    this.langItems = null;
    this.langList = null;

    // estado interno
    this.permiteClickReciente = false;
    this.clickTimeout = null;
    this.rafScroll = null;

    // referencias a handlers para remover luego
    this._handlers = {
      onBurgerClick: null,
      onBurgerKeyDown: null,
      onDocClick: null,
      onNavItemClick: null, // funcion factory se guarda por item
      onLangMenuClick: null,
      onLangMenuKeyDown: null,
      onLangItemClick: null,
      onWindowScroll: null,
    };

    if (autoInit) this.init();
  }

  init() {
    // obtener elementos usando utilidades
    this.header = findElement(this.selectorHeader);
    this.burger = findElement(this.selectorBurger);
    this.navItems = findElements(this.selectorNavItems);
    this.nav = findElement(this.selectorNav);
    this.langMenu = findElement(this.selectorLangMenu);
    this.langItems = findElements(this.selectorLangItems);
    this.langList = findElement(this.selectorLangList);

    if (
      !this.burger ||
      !this.nav ||
      !this.header ||
      this.navItems.length === 0
    ) {
      console.error(
        "No se encontraron los elementos necesarios para la navegación."
      );
      return;
    }

    // Asegurar atributos ARIA iniciales
    this.burger.setAttribute("aria-expanded", "false");
    if (this.langMenu) this.langMenu.setAttribute("aria-expanded", "false");

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Bind de handlers para poder removerlos después
    this._handlers.onBurgerClick = this.onBurgerClick.bind(this);
    this._handlers.onBurgerKeyDown = this.onBurgerKeyDown.bind(this);
    this._handlers.onDocClick = this.onDocumentClick.bind(this);
    this._handlers.onWindowScroll = this.onWindowScroll.bind(this);
    this._handlers.onLangMenuClick = this.onLangMenuClick.bind(this);
    this._handlers.onLangMenuKeyDown = this.onLangMenuKeyDown.bind(this);

    this.burger.addEventListener("click", this._handlers.onBurgerClick);
    this.burger.addEventListener("keydown", this._handlers.onBurgerKeyDown);

    if (this.langMenu) {
      this.langMenu.addEventListener("click", this._handlers.onLangMenuClick);
      this.langMenu.addEventListener(
        "keydown",
        this._handlers.onLangMenuKeyDown
      );
    }

    // document click para cerrar menú de idioma si se hace click afuera
    document.addEventListener("click", this._handlers.onDocClick);

    // nav items: cada item tiene su propio handler (guardado como propiedad del item)
    this.navItems.forEach((item) => {
      const handler = (e) => this.onNavItemClick(e, item);
      item.addEventListener("click", handler);
      item.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          handler(ev);
        }
      });
      // guardar referencia para remover si se destruye
      item._navClickHandler = handler;
    });

    // lang items
    this.langItems.forEach((item) => {
      const handler = (e) => this.onLangItemClick(e, item);
      item.addEventListener("click", handler);
      item.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          handler(ev);
        }
      });
      item._langClickHandler = handler;
    });

    // scroll: debounce con rAF
    window.addEventListener("scroll", this._handlers.onWindowScroll, {
      passive: true,
    });
  }

  onBurgerClick() {
    this.toggleMenuElements();
    this.closeLangMenu();
  }

  onBurgerKeyDown(e) {
    // accesible: Enter / Space togglean el menú
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.onBurgerClick();
    }
  }

  onLangMenuClick(e) {
    this.toggleLangMenu();
    e.stopPropagation();
  }

  onLangMenuKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.onLangMenuClick(e);
    }
  }

  onDocumentClick(e) {
    // si lista de idioma está activa y se hace click fuera, cerrarla
    if (
      this.langList &&
      this.langMenu &&
      this.langList.classList.contains("header__nav-langlist--active")
    ) {
      if (
        !this.langList.contains(e.target) &&
        e.target !== this.langMenu &&
        !this.langMenu.contains(e.target)
      ) {
        this.closeLangMenu();
      }
    }
  }

  onNavItemClick(e, item) {
    this.permiteClickReciente = true;
    if (this.clickTimeout) clearTimeout(this.clickTimeout);

    this.toggleMenuElements();
    this.deactivateAllNavItems();
    item.classList.toggle("item--active");

    this.clickTimeout = setTimeout(() => {
      this.permiteClickReciente = false;
    }, 800);
  }

  onLangItemClick(e, item) {
    // cerrar menú de idioma al seleccionar una opción
    this.toggleLangMenu();
    e.stopPropagation();
  }

  onWindowScroll() {
    // Debounce con rAF: evitar múltiples ejecuciones costosas
    if (this.rafScroll) return;
    this.rafScroll = requestAnimationFrame(() => {
      if (!this.permiteClickReciente) {
        this.deactivateAllNavItems();
      }
      this.rafScroll = null;
    });
  }

  deactivateAllNavItems() {
    this.navItems.forEach((item) => {
      item.classList.remove("item--active");
    });
  }

  toggleLangMenu() {
    if (!this.langMenu) return;
    if (this.langList)
      this.langList.classList.toggle("header__nav-langlist--active");

    const expanded = this.langMenu.classList.toggle(
      "header__nav-langmenu--active"
    );
    // actualizar aria
    this.langMenu.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  closeLangMenu() {
    if (!this.langMenu) return;
    if (this.langList)
      this.langList.classList.remove("header__nav-langlist--active");
    this.langMenu.classList.remove("header__nav-langmenu--active");
    this.langMenu.setAttribute("aria-expanded", "false");
  }

  toggleMenuElements() {
    const burgerActive = this.burger.classList.toggle(
      "header__nav-burguer--active"
    );
    this.nav.classList.toggle("header__nav--active");
    this.header.classList.toggle("header--active");
    // aria para el burger
    this.burger.setAttribute("aria-expanded", burgerActive ? "true" : "false");
  }

  destroy() {
    // Remover todos los event listeners y limpiar timers/raf
    if (this.burger) {
      this.burger.removeEventListener("click", this._handlers.onBurgerClick);
      this.burger.removeEventListener(
        "keydown",
        this._handlers.onBurgerKeyDown
      );
    }
    if (this.langMenu) {
      this.langMenu.removeEventListener(
        "click",
        this._handlers.onLangMenuClick
      );
      this.langMenu.removeEventListener(
        "keydown",
        this._handlers.onLangMenuKeyDown
      );
    }
    document.removeEventListener("click", this._handlers.onDocClick);
    window.removeEventListener("scroll", this._handlers.onWindowScroll);

    this.navItems.forEach((item) => {
      if (item._navClickHandler) {
        item.removeEventListener("click", item._navClickHandler);
        delete item._navClickHandler;
      }
    });

    this.langItems.forEach((item) => {
      if (item._langClickHandler) {
        item.removeEventListener("click", item._langClickHandler);
        delete item._langClickHandler;
      }
    });

    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    if (this.rafScroll) {
      cancelAnimationFrame(this.rafScroll);
      this.rafScroll = null;
    }

    // limpiar referencias
    this.header = null;
    this.burger = null;
    this.navItems = [];
    this.nav = null;
    this.langMenu = null;
    this.langItems = [];
    this.langList = null;
    this._handlers = {};
  }
}
