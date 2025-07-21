/**
 * Componente para manejar animaciones basadas en el scroll
 */
export default class ScrollAnimations {
  constructor() {
    this.scrollElements = document.querySelectorAll(".js-scroll");
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => {
      this.handleScrollAnimation();
    });
    
    // Ejecutar una vez al inicio para animar los elementos que ya están en vista
    this.handleScrollAnimation();
  }

  elementInView(el, dividend = 1) {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  }

  elementOutofView(el) {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop >
      (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  displayScrollElement(element) {
    element.classList.add("scrolled");
  }

  hideScrollElement(element) {
    element.classList.remove("scrolled");
  }

  handleScrollAnimation() {
    this.scrollElements.forEach((el) => {
      if (this.elementInView(el, 1.25)) {
        this.displayScrollElement(el);
      } else if (this.elementOutofView(el)) {
        this.hideScrollElement(el);
      }
    });
  }
}   