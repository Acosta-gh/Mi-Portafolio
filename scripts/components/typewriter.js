/**
 * Componente para crear efecto de tipeo animado
 */
export default class Typewriter {
  constructor(element, words, options = {}) {
    this.element = element;
    this.words = words;
    this.typingSpeed = options.typingSpeed || 100;
    this.deletingSpeed = options.deletingSpeed || 50;
    this.pauseAfterTyping = options.pauseAfterTyping || 1000;
    this.pauseAfterDeleting = options.pauseAfterDeleting || 500;
    
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    
    if (this.element) {
      this.type();
    } else {
      console.warn("No se proporcionó un elemento válido para el efecto de tipeo");
    }
  }

  type() {
    const currentWord = this.words[this.wordIndex];
    const isWordComplete = this.charIndex === currentWord.length;
    const isWordEmpty = this.charIndex === 0;

    if (!this.isDeleting && !isWordComplete) {
      this.charIndex++;
    } else if (this.isDeleting && !isWordEmpty) {
      this.charIndex--;
    }

    this.element.textContent = currentWord.substring(0, this.charIndex);

    let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && isWordComplete) {
      delay = this.pauseAfterTyping;
      this.isDeleting = true;
    } else if (this.isDeleting && isWordEmpty) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      delay = this.pauseAfterDeleting;
    }

    setTimeout(() => this.type(), delay);
  }
}