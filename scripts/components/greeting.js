/**
 * Componente que genera un saludo basado en la hora actual
 */
export default class Greeting {
  constructor() {
    this.introSalutations = document.querySelector(".main__intro-salutations");
    
    if (this.introSalutations) {
      this.introSalutations.innerHTML = this.getGreetingBasedOnTime();
    } else {
      console.warn("No se encontró el elemento .main__intro-salutations");
    }
  }

  getGreetingBasedOnTime() {
    const hour = new Date().getHours();
    const lang = document.documentElement.lang || "es";
    let greeting = "";

    if (lang === "en") {
      if (hour < 12) {
        greeting = "Good morning";
      } else if (hour < 18) {
        greeting = "Good afternoon";
      } else {
        greeting = "Good evening";
      }
    } else {
      if (hour < 12) {
        greeting = "Buenos días";
      } else if (hour < 18) {
        greeting = "Buenas tardes";
      } else {
        greeting = "Buenas noches";
      }
    }

    return greeting;
  }
}