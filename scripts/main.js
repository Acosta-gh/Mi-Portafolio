console.log("Script principal cargado");

import { navbarAnimations, typeEffect,jsScroll } from "./modules/animations.js";
import { getGreetingBasedOnTime } from "./modules/timeUtils.js";
import {initSkillsCarousel} from "./modules/skillsCarousel.js";

document.addEventListener('DOMContentLoaded', () => {
    navbarAnimations();

    // Saluda al usuario dependiendo la hora del día
    const introSalutations = document.querySelector(".main__intro-salutations");
    const introJobPositions = document.querySelector(".main__intro-position--type");
    if (introSalutations) {
        introSalutations.innerHTML = getGreetingBasedOnTime() + ", mi nombre es:";
        typeEffect(introJobPositions, ["frontend", "backend", "full-stack"]);
    } else {
        console.warn("No se encontró el elemento .main__intro-salutations");
    }
    
    initSkillsCarousel();
    jsScroll();
});
