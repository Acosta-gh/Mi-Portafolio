/**
 * Componente para aplicar un efecto de fade-in al cargar la ventana
 */
export default class FadeEffect {
  constructor() {
    this.init();
  }

  init() {
    window.onload = () => {
      const fade = document.querySelector("body");
      if (!fade) {
        console.error("No se encontró el elemento 'body'");
        return;
      }

      let opacity = 0;
      const intervalID = setInterval(() => {
        if (opacity < 1) {
          opacity += 0.02;
          fade.style.opacity = opacity;
        } else {
          clearInterval(intervalID);
        }
      }, 16);
    };
  }
}