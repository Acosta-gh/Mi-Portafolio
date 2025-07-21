/**
 * Componente para gestionar la animación y comportamiento del navbar
 */
export default class Navbar {
  constructor() {
    this.header = document.querySelector(".header");
    this.burger = document.querySelector(".header__nav-burguer");
    this.navItems = document.querySelectorAll(".header__nav-item");
    this.nav = document.querySelector(".header__nav-list");
    this.langMenu = document.querySelector(".header__nav-langmenu");
    this.langItems = document.querySelectorAll(".header__nav-langitem");
    this.langList = document.querySelector(".header__nav-langlist");

    this.butIJustClicked = false;
    this.clickTimeout = null;

    this.init();
  }

  init() {
    if (!this.burger || !this.nav || !this.header || this.navItems.length === 0) {
      console.error("No se encontraron los elementos necesarios para la navegación.");
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Al hacer clic en el ícono burger, abre/cierra menú y cierra menú de idiomas
    this.burger.addEventListener("click", () => {
      this.toggleMenuElements();
      this.closeLangMenu();
    });

    // Al hacer clic en el menú de idiomas, lo abre o cierra
    if (this.langMenu) {
      this.langMenu.addEventListener("click", (e) => {
        this.toggleLangMenu();
        e.stopPropagation();
      });
    }

    // Cierra el menú de idiomas al hacer clic fuera de él
    document.addEventListener("click", (e) => {
      if (this.langList && 
          this.langMenu && 
          this.langList.classList.contains("header__nav-langlist--active")) {
        if (!this.langList.contains(e.target) && 
            e.target !== this.langMenu && 
            !this.langMenu.contains(e.target)) {
          this.closeLangMenu();
        }
      }
    });

    // Al hacer clic en un ítem del menú de navegación
    this.navItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.butIJustClicked = true;

        if (this.clickTimeout) clearTimeout(this.clickTimeout);

        this.toggleMenuElements();
        this.deactivateAllNavItems();
        item.classList.toggle("item--active");

        this.clickTimeout = setTimeout(() => {
          this.butIJustClicked = false;
        }, 800);
      });
    });

    // Al hacer clic en un ítem del menú de idiomas
    this.langItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        this.toggleLangMenu();
        e.stopPropagation();
      });
    });

    // Al hacer scroll, desactiva todos los ítems de navegación
    window.addEventListener("scroll", () => {
      if (!this.butIJustClicked) {
        this.deactivateAllNavItems();
      }
    });
  }

  deactivateAllNavItems() {
    this.navItems.forEach((item) => {
      item.classList.remove("item--active");
    });
  }

  toggleLangMenu() {
    if (this.langList && this.langMenu) {
      this.langList.classList.toggle("header__nav-langlist--active");
    }
    this.langMenu.classList.toggle("header__nav-langmenu--active");
  }

  closeLangMenu() {
    if (this.langList && this.langMenu) {
      this.langList.classList.remove("header__nav-langlist--active");
      this.langMenu.classList.remove("header__nav-langmenu--active");
    }
  }

  toggleMenuElements() {
    this.burger.classList.toggle("header__nav-burguer--active");
    this.nav.classList.toggle("header__nav--active");
    this.header.classList.toggle("header--active");
  }
}