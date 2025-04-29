export function burguerAnimation() {
    const header = document.querySelector('.header');
    const burguer = document.querySelector('.header__nav-burguer');
    const navItems = document.querySelectorAll('.header__nav-item');
    const nav = document.querySelector('.header__nav-list');
    const langMenu = document.querySelector(".header__nav-langmenu")
    const langItems = document.querySelectorAll('.header__nav-langitem');
    const langlist = document.querySelector(".header__nav-langlist")
    
    if (!burguer || !nav || !header || navItems.length === 0) {
        console.error("No se encontraron los elementos necesarios");
        return;
    }

    function removeOtherItemsClasses(navItems){
        navItems.forEach(item => {
            item.classList.remove("item--active");
        });
    }

    burguer.addEventListener('click', () => {
        burguer.classList.toggle('header__nav-burguer--active');
        nav.classList.toggle('header__nav--active');
        header.classList.toggle('header--active');

        // Cerrar el menú de idiomas antes de cerrar el menú burguer
        langlist.classList.remove("header__nav-langlist--active")
        langMenu.classList.remove("header__nav-langmenu--active")
    });
    
    langMenu.addEventListener("click", () => {
        console.log("langmenu clicked")
        langlist.classList.toggle("header__nav-langlist--active")
        langMenu.classList.toggle("header__nav-langmenu--active")

    });

    // Si hace click en algún item, el menú cierra automaticamente / If a nav item is clicked, the menu closes automatically
    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            burguer.classList.toggle('header__nav-burguer--active');
            nav.classList.toggle('header__nav--active');
            header.classList.toggle('header--active');
            
            removeOtherItemsClasses(navItems)
            item.classList.toggle("item--active")
        });
    });

    langItems.forEach((item) => {
        item.addEventListener('click', () => {
            console.log("lang item clicked")
            langMenu.classList.toggle("header__nav-langmenu--active")
            langlist.classList.toggle("header__nav-langlist--active")
        });
    });

    
}