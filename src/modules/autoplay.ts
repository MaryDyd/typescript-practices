// src/modules/autoplay.ts

// Імпортуємо необхідні змінні та функції з інших модулів.
import { 
    AUTO_PLAY_INTERVAL, items, currentIndex, 
    isPlaying, setCurrentIndex, setIsPlaying,
} from './dom.js';
import { updateCoverflow } from './coverflow.js';

// Змінна для зберігання ID інтервалу, щоб ми могли його зупинити.
let autoplayInterval: number | null = null; 


// Запускає автоматичне прокручування (autoplay) каруселі.
export function startAutoplay(): void {
    // Запускаємо тільки якщо автопрокручування ще не ввімкнене.
    if (!isPlaying) {
        // Встановлюємо інтервал, який буде спрацьовувати кожні AUTO_PLAY_INTERVAL мілісекунд.
        autoplayInterval = window.setInterval((): void => {
            // Розраховуємо новий індекс. Використовуємо оператор % для зациклення.
            const newIndex: number = (currentIndex + 1) % items.length;
            // Встановлюємо новий індекс у глобальному стані.
            setCurrentIndex(newIndex);
            // Оновлюємо візуальне відображення coverflow.
            updateCoverflow();
        }, AUTO_PLAY_INTERVAL);

        // Оновлюємо стан на "відтворюється".
        setIsPlaying(true);

        // Знаходимо іконки play/pause.
        const playIcon = document.querySelector('.play-icon') as HTMLElement | null;
        const pauseIcon = document.querySelector('.pause-icon') as HTMLElement | null;

        // Оновлюємо їх видимість: ховаємо play, показуємо pause.
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
    }
}

// Зупиняє автоматичне прокручування (autoplay).
export function stopAutoplay(): void {
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
     const playIcon = document.querySelector('.play-icon') as HTMLElement | null;
     const pauseIcon = document.querySelector('.pause-icon') as HTMLElement | null;

     // Оновлюємо їх видимість: показуємо play, ховаємо pause.
     if (playIcon) playIcon.style.display = 'block';
     if (pauseIcon) pauseIcon.style.display = 'none';
}

//Перемикає стан автопрокручування (play/pause).
export function toggleAutoplay(): void {
    if (isPlaying) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}

// Обробник, який викликається при будь-якій взаємодії користувача (клік по стрілці, крапці, свайп). Зупиняє автопрокручування.
export function handleUserInteraction(): void {
    stopAutoplay();
}