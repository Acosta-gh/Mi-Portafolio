export function burguerAnimation() {
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

    // Si hace click en algún item, el menú cierra automaticamente / If a nav item is clicked, the menu closes automatically
    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            toggleMenuElements();
            deactivateAllNavItems()
            item.classList.toggle("item--active")
        });
    });

    langItems.forEach((item) => {
        item.addEventListener('click', () => {
            toggleLangMenu()
        });
    });
}