// src/modules/autoplay.ts
// Імпортуємо необхідні змінні та функції з інших модулів.
import { AUTO_PLAY_INTERVAL, items, currentIndex, isPlaying, setCurrentIndex, setIsPlaying, } from './dom.js';
import { updateCoverflow } from './coverflow.js';
// Змінна для зберігання ID інтервалу, щоб ми могли його зупинити.
let autoplayInterval = null;
// Запускає автоматичне прокручування (autoplay) каруселі.
export function startAutoplay() {
    // Запускаємо тільки якщо автопрокручування ще не ввімкнене.
    if (!isPlaying) {
        // Встановлюємо інтервал, який буде спрацьовувати кожні AUTO_PLAY_INTERVAL мілісекунд.
        autoplayInterval = window.setInterval(() => {
            // Розраховуємо новий індекс. Використовуємо оператор % для зациклення.
            const newIndex = (currentIndex + 1) % items.length;
            // Встановлюємо новий індекс у глобальному стані.
            setCurrentIndex(newIndex);
            // Оновлюємо візуальне відображення coverflow.
            updateCoverflow();
        }, AUTO_PLAY_INTERVAL);
        // Оновлюємо стан на "відтворюється".
        setIsPlaying(true);
        // Знаходимо іконки play/pause.
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        // Оновлюємо їх видимість: ховаємо play, показуємо pause.
        if (playIcon)
            playIcon.style.display = 'none';
        if (pauseIcon)
            pauseIcon.style.display = 'block';
    }
}
// Зупиняє автоматичне прокручування (autoplay).
export function stopAutoplay() {
    // Перевіряємо, чи є активний інтервал.
    if (autoplayInterval !== null) {
        // Очищуємо інтервал, щоб зупинити автопрокручування.
        window.clearInterval(autoplayInterval);
        // Скидаємо ID інтервалу.
        autoplayInterval = null;
    }
    // Оновлюємо стан на "не відтворюється".
    setIsPlaying(false);
    // Знаходимо іконки play/pause.
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    // Оновлюємо їх видимість: показуємо play, ховаємо pause.
    if (playIcon)
        playIcon.style.display = 'block';
    if (pauseIcon)
        pauseIcon.style.display = 'none';
}
//Перемикає стан автопрокручування (play/pause).
export function toggleAutoplay() {
    if (isPlaying) {
        stopAutoplay();
    }
    else {
        startAutoplay();
    }
}
// Обробник, який викликається при будь-якій взаємодії користувача (клік по стрілці, крапці, свайп). Зупиняє автопрокручування.
export function handleUserInteraction() {
    stopAutoplay();
}
//# sourceMappingURL=autoplay.js.map