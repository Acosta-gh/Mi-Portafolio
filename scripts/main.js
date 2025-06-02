/*
 * @licstart  The following is the license notice for this file
 *
 * SPDX-License-Identifier: Apache-2.0
 * Copyright (C) 2025 Cristian Darío Acosta
 *
 * This file is licensed under the Apache License 2.0.
 * See the full license at <https://www.apache.org/licenses/LICENSE-2.0>
 *
 * @licend  The above is the license notice for this file
 */


document.addEventListener('DOMContentLoaded', () => {
    /**
     * Función para aplicar un efecto de fade-in (aparecer lentamente)
     * al cargar la ventana, modificando la opacidad del <body>.
     */
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
                    opacity += 0.02; // Incrementa la opacidad gradualmente
                    fade.style.opacity = opacity;
                } else {
                    clearInterval(intervalID); // Detiene el intervalo cuando opacidad llega a 1
                }
            }, 16); // Aproximadamente 60fps
        };
    }

    /**
     * Función que gestiona la animación y comportamiento
     * del navbar (barra de navegación), incluyendo menú hamburguesa,
     * menú de idiomas y la activación/desactivación de ítems.
     */
    function navbarAnimations() {
        const header = document.querySelector('.header');
        const burger = document.querySelector('.header__nav-burguer');
        const navItems = document.querySelectorAll('.header__nav-item');
        const nav = document.querySelector('.header__nav-list');
        const langMenu = document.querySelector(".header__nav-langmenu");
        const langItems = document.querySelectorAll('.header__nav-langitem');
        const langList = document.querySelector(".header__nav-langlist");

        let butIJustClicked = false;  // Indica si se acaba de hacer clic para evitar conflictos con scroll
        let clickTimeout;

        if (!burger || !nav || !header || navItems.length === 0) {
            console.error("No se encontraron los elementos necesarios para la navegación.");
            return;
        }

        /**
         * Elimina la clase "item--active" de todos los ítems del menú de navegación
         */
        function deactivateAllNavItems() {
            navItems.forEach(item => {
                item.classList.remove("item--active");
            });
        }

        /**
         * Alterna la visibilidad del menú de idiomas y la rotación del ícono correspondiente
         */
        function toggleLangMenu() {
            if (langList && langMenu) {
                langList.classList.toggle("header__nav-langlist--active");
            }
            langMenu.classList.toggle("header__nav-langmenu--active");
        }

        /**
         * Cierra el menú de idiomas si está abierto
         */
        function closeLangMenu() {
            if (langList && langMenu) {
                langList.classList.remove("header__nav-langlist--active");
                langMenu.classList.remove("header__nav-langmenu--active");
            }
        }

        /**
         * Alterna la visibilidad del menú principal (menu burger)
         */
        function toggleMenuElements() {
            burger.classList.toggle('header__nav-burguer--active');
            nav.classList.toggle('header__nav--active');
            header.classList.toggle('header--active');
        }

        // Al hacer clic en el ícono burger, abre/cierra menú y cierra menú de idiomas
        burger.addEventListener('click', () => {
            toggleMenuElements();
            closeLangMenu();
        });

        // Al hacer clic en el menú de idiomas, lo abre o cierra
        if (langMenu) {
            langMenu.addEventListener("click", () => {
                toggleLangMenu();
            });
        }

        // Al hacer clic en un ítem del menú de navegación:
        // - cierra el menú
        // - marca el ítem como activo y desactiva los demás
        navItems.forEach((item) => {
            item.addEventListener('click', () => {
                butIJustClicked = true;

                if (clickTimeout) clearTimeout(clickTimeout);

                toggleMenuElements();
                deactivateAllNavItems();
                item.classList.toggle("item--active");

                // Evita que el scroll desactive el ítem activo durante un tiempo
                clickTimeout = setTimeout(() => {
                    butIJustClicked = false;
                }, 800);
            });
        });

        // Al hacer clic en un ítem del menú de idiomas, cierra/abre el menú
        langItems.forEach((item) => {
            item.addEventListener('click', () => {
                console.log(item); // Debug: muestra el ítem seleccionado
                toggleLangMenu();
            });
        });

        // Al hacer scroll, desactiva todos los ítems de navegación
        // salvo que se haya hecho clic recientemente
        window.addEventListener('scroll', () => {
            if (!butIJustClicked) {
                deactivateAllNavItems();
            }
        });
    }

    /**
     * Función para manejar animaciones basadas en el scroll.
     * Los elementos con la clase ".js-scroll" reciben la clase "scrolled"
     * cuando están visibles en pantalla, para activar animaciones CSS.
     */
    function jsScroll() {
        console.log("Scroll js");
        const scrollElements = document.querySelectorAll(".js-scroll");

        // Verifica si el elemento está dentro del área visible de la ventana
        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <=
                (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };

        // Verifica si el elemento está fuera del área visible (por arriba)
        const elementOutofView = (el) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop > (window.innerHeight || document.documentElement.clientHeight)
            );
        };

        // Añade clase para activar animación
        const displayScrollElement = (element) => {
            element.classList.add("scrolled");
        };

        // Remueve clase para desactivar animación
        const hideScrollElement = (element) => {
            element.classList.remove("scrolled");
        };

        // Maneja la animación para cada elemento en scroll
        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                } else if (elementOutofView(el)) {
                    hideScrollElement(el);
                }
            });
        };

        // Escucha el evento scroll y ejecuta la animación
        window.addEventListener("scroll", () => {
            handleScrollAnimation();
        });
    }
    
    /**
     * Retorna un saludo basado en la hora actual y el idioma del documento.
     * @returns {string} Saludo adecuado para la hora y el idioma.
     */
    function getGreetingBasedOnTime() {
        const hour = new Date().getHours();
        const lang = document.documentElement.lang || 'es';
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

    /**
     * Efecto de tipeo animado que va mostrando y borrando palabras en un elemento.
     * @param {HTMLElement} element - Elemento donde se escribe el texto.
     * @param {string[]} words - Array de palabras a mostrar en secuencia.
     */
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
                wordIndex = (wordIndex + 1) % words.length; // Loop infinito
                delay = pauseAfterDeleting;
            }

            setTimeout(type, delay);
        }

        type();
    }

    // Inicializa efectos y animaciones al cargar el DOM
    fadeIn();
    navbarAnimations();

    // Muestra saludo dinámico basado en hora y hace efecto de tipeo en el puesto
    const introSalutations = document.querySelector(".main__intro-salutations");
    const introJobPositions = document.querySelector(".main__intro-position--type");
    if (introSalutations) {
        introSalutations.innerHTML = getGreetingBasedOnTime();
        typeEffect(introJobPositions, ["frontend", "backend", "full-stack"]);
    } else {
        console.warn("No se encontró el elemento .main__intro-salutations");
    }

    // Inicializa animación al hacer scroll
    jsScroll();
});
