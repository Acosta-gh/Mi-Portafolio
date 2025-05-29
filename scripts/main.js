/*
console.log("Script principal cargado");

import { navbarAnimations, typeEffect, jsScroll, fadeIn } from "./modules/animations.js";
import { getGreetingBasedOnTime } from "./modules/timeUtils.js";
//import { initSkillsCarousel } from "./modules/skillsCarousel.js";

document.addEventListener('DOMContentLoaded', () => {
    // "Carga" las animaciones
    fadeIn();
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

    // "Carga" las animaciones
    //initSkillsCarousel();
    jsScroll();

});
*/

// Todo en el mismo main.js para poder ser usado en githubpages
document.addEventListener('DOMContentLoaded', () => {
    function fadeIn() {
        window.onload = function () {
            const fade = document.querySelector("body");
            if (!fade) {
                console.error("No se encontró el elemento 'body'");
                return;
            }

            let opacity = 0;
            const intervalID = setInterval(function () {
                if (opacity < 1) {
                    opacity += 0.02;
                    fade.style.opacity = opacity;
                } else {
                    clearInterval(intervalID);
                }
            }, 16);
        };
    }
    function navbarAnimations() {
        const header = document.querySelector('.header');
        const burger = document.querySelector('.header__nav-burguer');
        const navItems = document.querySelectorAll('.header__nav-item');
        const nav = document.querySelector('.header__nav-list');
        const langMenu = document.querySelector(".header__nav-langmenu");
        const langItems = document.querySelectorAll('.header__nav-langitem');
        const langList = document.querySelector(".header__nav-langlist");

        let butIJustClicked = false;

        if (!burger || !nav || !header || navItems.length === 0) {
            console.error("No se encontraron los elementos necesarios para la navegación.");
            return;
        }

        // Elimina la clase "item--active" de todos los elementos de navegación
        function deactivateAllNavItems() {
            navItems.forEach(item => {
                item.classList.remove("item--active");
            });
        }

        // Alterna la visibilidad del menú de idiomas y "rotando" el svg de la flecha
        function toggleLangMenu() {
            if (langList && langMenu) {
                langList.classList.toggle("header__nav-langlist--active");
            }
            langMenu.classList.toggle("header__nav-langmenu--active");
        }

        // Cierra el menú de idiomas si está abierto
        function closeLangMenu() {
            if (langList && langMenu) {
                langList.classList.remove("header__nav-langlist--active");
                langMenu.classList.remove("header__nav-langmenu--active");
            }
        }

        // Alterna la visibilidad del menú principal (burger menu)
        function toggleMenuElements() {
            burger.classList.toggle('header__nav-burguer--active');
            nav.classList.toggle('header__nav--active');
            header.classList.toggle('header--active');
        }

        // Al hacer clic en el ícono burger:
        // - alterna el menú principal
        // - cierra el menú de idiomas si está abierto
        burger.addEventListener('click', () => {
            toggleMenuElements();
            closeLangMenu();
        });

        // Al hacer clic en el botón del menú de idiomas, lo abre o lo cierra
        if (langMenu) {
            langMenu.addEventListener("click", () => {
                toggleLangMenu();
            });
        }


        // Al hacer clic en un ítem del nav:
        // - cierra el menú
        // - marca el ítem como activo
        // - desactiva cualquier otro ítem activo
        navItems.forEach((item) => {
            item.addEventListener('click', () => {
                butIJustClicked = true;
                toggleMenuElements();
                deactivateAllNavItems();
                item.classList.toggle("item--active");

                setTimeout(() => { // Para que el smooth scroll no desactive el item--active 
                    butIJustClicked = false;
                }, 800);

            });
        });

        // Al hacer clic en un ítem del menú de idiomas, alterna el menú
        langItems.forEach((item) => {
            item.addEventListener('click', () => {
                console.log(item); // Debugging: muestra el ítem en la consola
                toggleLangMenu();
            });
        });

        // Desactiva todos los ítems del menú al hacer scroll
        window.addEventListener('scroll', () => {
            if (!butIJustClicked) {
                deactivateAllNavItems();
            }
        });
    }
    function jsScroll() {
        console.log("Scroll js")
        const scrollElements = document.querySelectorAll(".js-scroll");

        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;

            return (
                elementTop <=
                (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };

        const elementOutofView = (el) => {
            const elementTop = el.getBoundingClientRect().top;

            return (
                elementTop > (window.innerHeight || document.documentElement.clientHeight)
            );
        };

        const displayScrollElement = (element) => {
            element.classList.add("scrolled");
        };

        const hideScrollElement = (element) => {
            element.classList.remove("scrolled");
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                } else if (elementOutofView(el)) {
                    hideScrollElement(el)
                }
            })
        }

        window.addEventListener("scroll", () => {
            handleScrollAnimation();
        });
    }
    function getGreetingBasedOnTime() {
        const hour = new Date().getHours();
        if (hour < 12) {
            return "Buenos días";
        } else if (hour < 18) {
            return "Buenas tardes";
        } else {
            return "Buenas noches";
        }
    }
    function typeEffect(element, words) {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseAfterTyping = 1000;
    const pauseAfterDeleting = 500;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const isWordComplete = charIndex === currentWord.length;
        const isWordEmpty = charIndex === 0;

        if (!isDeleting && !isWordComplete) {
            charIndex++;
        } else if (isDeleting && !isWordEmpty) {
            charIndex--;
        }

        element.textContent = currentWord.substring(0, charIndex);

        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && isWordComplete) {
            delay = pauseAfterTyping;
            isDeleting = true;
        } else if (isDeleting && isWordEmpty) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = pauseAfterDeleting;
        }

        setTimeout(type, delay);
    }

    type();
    }

    fadeIn();
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
    jsScroll();
});
