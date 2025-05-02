export function initSkillsCarousel() {
    const container = document.querySelector('.main__skills-cards');
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');

    const cards = document.querySelectorAll(".main__skills-cards .card");
    const dots = document.querySelectorAll(".main__skills .dot");

    if (!container || !leftArrow || !rightArrow || !cards.length || !dots.length) return;

    const cardWidth = cards[0].clientWidth;
    let cardIndex = 0;

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === cardIndex);
        });
    }

    /*
    Se usa Math.round() para redondear al índice más cercano.
        Ej.: Si cada tarjeta mide 200px:
        scrollLeft = 0 :. newIndex = 0
        scrollLeft = 205 :. newIndex = 1 (cerca de la segunda tarjeta)
    */
    function updateCardIndexFromScroll() {
        const scrollLeft = container.scrollLeft;
        const newIndex = Math.round(scrollLeft / cardWidth);
        if (newIndex !== cardIndex) {
            cardIndex = newIndex;
            updateDots();
        }
    }

    // https://webdesign.tutsplus.com/how-to-build-a-simple-carousel-with-vanilla-javascript--cms-41734t
    rightArrow.addEventListener('click', () => {
        container.scrollLeft += cardWidth;
    });
    leftArrow.addEventListener('click', () => {
        container.scrollLeft -= cardWidth;
    });

    // Detectar cambio de slide al hacer scroll manual
    container.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateCardIndexFromScroll);
    });

    updateDots();
}
