/**
 * EN: WARNING - This file was created in whole or in part with the assistance of a Large Language Model (LLM/AI).
 *     Tracked separately for potential legal/compliance review in case copyright, open-source licensing,
 *     or AI code attribution rules change in the future.
 *
 * ES: AVISO - Este archivo fue creado total o parcialmente con la ayuda de un Modelo de Lenguaje Grande (LLM/IA).
 *     Se lleva registrado por separado para una posible revisión legal/regulatoria en caso de que cambien
 *     las leyes de copyright, licencias de código abierto o las reglas sobre atribución de código generado por IA.
 */

export function typewriter(
  element,
  words,
  {
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseAfterTyping = 1000,
    pauseAfterDeleting = 500,
  } = {}
) {
  if (!element) {
    console.warn(
      "No se proporcionó un elemento válido para el efecto de tipeo"
    );
    return { start() {}, stop() {} };
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;
  let isRunning = false;

  function type() {
    if (!isRunning) return;
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

    timeoutId = setTimeout(type, delay);
  }

  function start() {
    if (!isRunning) {
      isRunning = true;
      type();
    }
  }

  function stop() {
    isRunning = false;
    if (timeoutId) clearTimeout(timeoutId);
  }

  start();

  return { start, stop };
}
