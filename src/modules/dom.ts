// src/modules/dom.ts

import { ImageData } from '../types/data.js';

// --- КОНСТАНТИ ---
// Інтервал автопрокручування в мілісекундах.
export const AUTO_PLAY_INTERVAL: number = 4000;

// --- ВИБІРКА DOM-ЕЛЕМЕНТІВ ---
// Усі елементи каруселі.
export const items: NodeListOf<HTMLElement> = document.querySelectorAll('.coverflow-item');
// Контейнер для крапок пагінації.
export const dotsContainer: HTMLElement | null = document.getElementById('dots');
// Елемент для відображення поточного заголовка.
export const currentTitle: HTMLElement | null = document.getElementById('current-title');
// Елемент для відображення поточного опису.
export const currentDescription: HTMLElement | null = document.getElementById('current-description');
// Головний контейнер coverflow (для обробки свайпів).
export const coverflowContainer: HTMLElement | null = document.querySelector('.coverflow-container');
// Кнопка мобільного меню (бургер).
export const menuToggle: HTMLElement | null = document.getElementById('menuToggle');
// Головне меню.
export const mainMenu: HTMLElement | null = document.getElementById('mainMenu');
// Хедер сайту.
export const header: HTMLElement | null = document.getElementById('header');
// Кнопка "Нагору" (Scroll to Top).
export const scrollToTopBtn: HTMLElement | null = document.getElementById('scrollToTop');
// Модальне вікно.
export const dataModal: HTMLElement | null = document.getElementById('dataModal');
// Кнопка закриття модального вікна.
export const closeModalBtn: HTMLElement | null = document.getElementById('closeModalBtn');
// Кнопка для завантаження даних.
export const fetchDataBtn: HTMLElement | null = document.getElementById('fetchDataBtn');
// Контейнер для завантажених постів.
export const postsContainer: HTMLElement | null = document.getElementById('postsContainer');

// --- ДАНІ ---
// Статичні дані для слайдів каруселі.
export const imageData: ImageData[] = [
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
export let currentIndex: number = 3; 
// Прапорець, що вказує, чи триває зараз анімація.
export let isAnimating: boolean = false; 
// Прапорець, що вказує, чи ввімкнене автопрокручування.
export let isPlaying: boolean = true; 
// Початкові координати дотику (для свайпів).
export let touchStartX: number = 0;
export let touchStartY: number = 0;
// Прапорець, що вказує, чи відбувається свайп.
export let isSwiping: boolean = false;

// --- ФУНКЦІЇ-СЕТТЕРИ ДЛЯ ОНОВЛЕННЯ СТАНУ ---
// (Використовуються, щоб тримати логіку оновлення стану в одному файлі).

export function setCurrentIndex(newIndex: number): void {
    currentIndex = newIndex;
}

export function setIsAnimating(value: boolean): void {
    isAnimating = value;
}

export function setIsPlaying(value: boolean): void {
    isPlaying = value;
}

export function setTouchStart(x: number, y: number): void {
    touchStartX = x;
    touchStartY = y;
}

export function setIsSwiping(value: boolean): void {
    isSwiping = value;
}