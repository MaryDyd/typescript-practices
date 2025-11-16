// src/modules/dom.ts
// --- КОНСТАНТИ ---
// Інтервал автопрокручування в мілісекундах.
export const AUTO_PLAY_INTERVAL = 4000;
// --- ВИБІРКА DOM-ЕЛЕМЕНТІВ ---
// Усі елементи каруселі.
export const items = document.querySelectorAll('.coverflow-item');
// Контейнер для крапок пагінації.
export const dotsContainer = document.getElementById('dots');
// Елемент для відображення поточного заголовка.
export const currentTitle = document.getElementById('current-title');
// Елемент для відображення поточного опису.
export const currentDescription = document.getElementById('current-description');
// Головний контейнер coverflow (для обробки свайпів).
export const coverflowContainer = document.querySelector('.coverflow-container');
// Кнопка мобільного меню (бургер).
export const menuToggle = document.getElementById('menuToggle');
// Головне меню.
export const mainMenu = document.getElementById('mainMenu');
// Хедер сайту.
export const header = document.getElementById('header');
// Кнопка "Нагору" (Scroll to Top).
export const scrollToTopBtn = document.getElementById('scrollToTop');
// Модальне вікно.
export const dataModal = document.getElementById('dataModal');
// Кнопка закриття модального вікна.
export const closeModalBtn = document.getElementById('closeModalBtn');
// Кнопка для завантаження даних.
export const fetchDataBtn = document.getElementById('fetchDataBtn');
// Контейнер для завантажених постів.
export const postsContainer = document.getElementById('postsContainer');
// --- ДАНІ ---
// Статичні дані для слайдів каруселі.
export const imageData = [
    { title: "Mountain Landscape", description: "Majestic peaks covered in snow during golden hour" },
    { title: "Forest Path", description: "A winding trail through ancient woodland" },
    { title: "Lake Reflection", description: "Serene waters mirroring the surrounding landscape" },
    { title: "Ocean Sunset", description: "Golden hour over endless ocean waves" },
    { title: "Desert Dunes", description: "Rolling sand dunes under vast blue skies" },
    { title: "Starry Night", description: "Countless stars illuminating the dark sky" },
    { title: "Waterfall", description: "Cascading water through lush green forest" }
];
// --- ГЛОБАЛЬНИЙ СТАН ---
// Поточний активний індекс (починаємо з 3-го елемента).
export let currentIndex = 3;
// Прапорець, що вказує, чи триває зараз анімація.
export let isAnimating = false;
// Прапорець, що вказує, чи ввімкнене автопрокручування.
export let isPlaying = true;
// Початкові координати дотику (для свайпів).
export let touchStartX = 0;
export let touchStartY = 0;
// Прапорець, що вказує, чи відбувається свайп.
export let isSwiping = false;
// --- ФУНКЦІЇ-СЕТТЕРИ ДЛЯ ОНОВЛЕННЯ СТАНУ ---
// (Використовуються, щоб тримати логіку оновлення стану в одному файлі).
export function setCurrentIndex(newIndex) {
    currentIndex = newIndex;
}
export function setIsAnimating(value) {
    isAnimating = value;
}
export function setIsPlaying(value) {
    isPlaying = value;
}
export function setTouchStart(x, y) {
    touchStartX = x;
    touchStartY = y;
}
export function setIsSwiping(value) {
    isSwiping = value;
}
//# sourceMappingURL=dom.js.map