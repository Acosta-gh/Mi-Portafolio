export function navbarAnimations() {
    const header = document.querySelector('.header');
    const burguer = document.querySelector('.header__nav-burguer');
    const navItems = document.querySelectorAll('.header__nav-item');
    const nav = document.querySelector('.header__nav-list');
    const langMenu = document.querySelector(".header__nav-langmenu")
    const langItems = document.querySelectorAll('.header__nav-langitem');
    const langList = document.querySelector(".header__nav-langlist")

    if (!burguer || !nav || !header || navItems.length === 0) {
        console.error("No se encontraron los elementos necesarios");
        return;
    }

    function deactivateAllNavItems() {
        navItems.forEach(item => {
            item.classList.remove("item--active");
        });
    }

    function toggleLangMenu() {
        langMenu.classList.toggle("header__nav-langmenu--active")
        langList.classList.toggle("header__nav-langlist--active")
    }

    function closeLangMenu() {
        langList.classList.remove("header__nav-langlist--active")
        langMenu.classList.remove("header__nav-langmenu--active")
    }

    function toggleMenuElements() {
        burguer.classList.toggle('header__nav-burguer--active');
        nav.classList.toggle('header__nav--active');
        header.classList.toggle('header--active');
    }

    burguer.addEventListener('click', () => {
        toggleMenuElements()
        closeLangMenu()
    });

    langMenu.addEventListener("click", () => {
        toggleLangMenu()
    });

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            toggleMenuElements();
            deactivateAllNavItems()
            item.classList.toggle("item--active")
        });
    });

    langItems.forEach((item) => {
        item.addEventListener('click', () => {
            console.log(item)
            toggleLangMenu()
        });
    });
}

export function typeEffect(element, words) {
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

