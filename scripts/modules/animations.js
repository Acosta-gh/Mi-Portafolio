export function burguerAnimation() {
    const burguer = document.querySelector('.header__nav-burguer');
    const nav = document.querySelector('.header__nav-list');
    const header = document.querySelector('.header');
    const navItems = document.querySelectorAll('.header__nav-item');
    if (!burguer || !nav || !header || navItems.length === 0) {
        console.error("No se encontraron los elementos necesarios");
        return;
    }

    burguer.addEventListener('click', () => {
        burguer.classList.toggle('header__nav-burguer--active');
        nav.classList.toggle('header__nav--active');
        header.classList.toggle('header--active');
    });
    
    function removeOtherItemsClasses(navItems){
        navItems.forEach(item => {
            item.classList.remove("item--active");
        });
    }

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
}