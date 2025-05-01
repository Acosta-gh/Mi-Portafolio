export function initSkillsCarousel() {
    const container = document.querySelector('.main__skills-cards');
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');
    
    const cards = document.querySelectorAll(".main__skills-cards .card");
    const dots = document.querySelectorAll(".main__skills .dot");

    const cardsNo = cards.length;
    let cardIndex = 0;
    let isScrolling = false;

    if (!container || !leftArrow || !rightArrow || !cards || !dots) return;

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === cardIndex);
        });
    }

    function debounceScroll(callback) {
        if (isScrolling) return;
        isScrolling = true;
        callback();
        setTimeout(() => {
            isScrolling = false;
        }, 350);
    }

    rightArrow.addEventListener('click', () => {
        debounceScroll(() => {
            const card = container.querySelector('.card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 32;
            container.scrollBy({ left: cardWidth, behavior: 'smooth' });
            if (cardIndex < cardsNo - 1) {
                cardIndex++;
                updateDots();
            }
        });
    });

    leftArrow.addEventListener('click', () => {
        debounceScroll(() => {
            const card = container.querySelector('.card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 32;
            container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            if (cardIndex > 0) {
                cardIndex--;
                updateDots();
            }
        });
    });

    updateDots();
}
