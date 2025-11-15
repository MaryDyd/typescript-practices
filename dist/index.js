"use strict";
// src/main.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AUTO_PLAY_INTERVAL = 4000; // Примітивний тип number
// =======================================================
// 2. DOM ЕЛЕМЕНТИ (типізація та перевірка на null)
// =======================================================
// Використовуємо явне приведення типів та оператор ! для впевненості, що елементи існують (або додаємо перевірку if)
const items = document.querySelectorAll('.coverflow-item');
const dotsContainer = document.getElementById('dots');
const currentTitle = document.getElementById('current-title');
const currentDescription = document.getElementById('current-description');
const coverflowContainer = document.querySelector('.coverflow-container');
const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');
const header = document.getElementById('header');
const scrollToTopBtn = document.getElementById('scrollToTop');
// Нові елементи для Fetch/Modal
const dataModal = document.getElementById('dataModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const fetchDataBtn = document.getElementById('fetchDataBtn');
const postsContainer = document.getElementById('postsContainer');
// =======================================================
// 3. ЗМІННІ (типізація примітивними та Union типами)
// =======================================================
let currentIndex = 3; // Примітивний тип number
let isAnimating = false; // Примітивний тип boolean
let autoplayInterval = null; // Union Type (number | null)
let isPlaying = true; // Примітивний тип boolean
let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;
// =======================================================
// 4. ДАНІ
// =======================================================
const imageData = [
    { title: "Mountain Landscape", description: "Majestic peaks covered in snow during golden hour" },
    { title: "Forest Path", description: "A winding trail through ancient woodland" },
    { title: "Lake Reflection", description: "Serene waters mirroring the surrounding landscape" },
    { title: "Ocean Sunset", description: "Golden hour over endless ocean waves" },
    { title: "Desert Dunes", description: "Rolling sand dunes under vast blue skies" },
    { title: "Starry Night", description: "Countless stars illuminating the dark sky" },
    { title: "Waterfall", description: "Cascading water through lush green forest" }
];
// =======================================================
// 5. ФУНКЦІЇ CORE COVERFLOW
// =======================================================
function updateCoverflow() {
    if (isAnimating)
        return;
    isAnimating = true;
    items.forEach((item, index) => {
        let offset = index - currentIndex; // number
        if (offset > items.length / 2) {
            offset = offset - items.length;
        }
        else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }
        const absOffset = Math.abs(offset); // number
        const sign = Math.sign(offset); // number
        let translateX = offset * 220;
        let translateZ = -absOffset * 200;
        let rotateY = -sign * Math.min(absOffset * 60, 60);
        let opacity = 1 - (absOffset * 0.2);
        let scale = 1 - (absOffset * 0.1);
        if (absOffset > 3) {
            opacity = 0;
            translateX = sign * 800;
        }
        item.style.transform = `
            translateX(${translateX}px) 
            translateZ(${translateZ}px) 
            rotateY(${rotateY}deg)
            scale(${scale})
        `;
        item.style.opacity = opacity.toString();
        item.style.zIndex = (100 - absOffset).toString();
        item.classList.toggle('active', index === currentIndex);
    });
    // Оновлення крапок
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    const currentData = imageData[currentIndex];
    if (currentTitle)
        currentTitle.textContent = currentData.title;
    if (currentDescription)
        currentDescription.textContent = currentData.description;
    // Resetting and setting animation (if elements exist)
    if (currentTitle && currentDescription) {
        currentTitle.style.animation = 'none';
        currentDescription.style.animation = 'none';
        setTimeout(() => {
            currentTitle.style.animation = 'fadeIn 0.6s forwards';
            currentDescription.style.animation = 'fadeIn 0.6s forwards';
        }, 10);
    }
    setTimeout(() => {
        isAnimating = false;
    }, 600);
}
function navigate(direction) {
    if (isAnimating)
        return;
    handleUserInteraction();
    currentIndex = currentIndex + direction;
    if (currentIndex < 0) {
        currentIndex = items.length - 1;
    }
    else if (currentIndex >= items.length) {
        currentIndex = 0;
    }
    updateCoverflow();
}
window.navigate = navigate; // Для роботи onclick в HTML
function goToIndex(index) {
    if (isAnimating || index === currentIndex)
        return;
    handleUserInteraction();
    currentIndex = index;
    updateCoverflow();
}
// =======================================================
// 6. АВТОПЛЕЙ
// =======================================================
function startAutoplay() {
    if (!isPlaying) {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCoverflow();
        }, AUTO_PLAY_INTERVAL);
        isPlaying = true;
        // Оновлення іконок (якщо елементи знайдено)
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        if (playIcon)
            playIcon.style.display = 'none';
        if (pauseIcon)
            pauseIcon.style.display = 'block';
    }
}
function stopAutoplay() {
    if (autoplayInterval !== null) { // Type narrowing (перевірка на null)
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    isPlaying = false;
    // Оновлення іконок
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    if (playIcon)
        playIcon.style.display = 'block';
    if (pauseIcon)
        pauseIcon.style.display = 'none';
}
function toggleAutoplay() {
    if (isPlaying) {
        stopAutoplay();
    }
    else {
        startAutoplay();
    }
}
window.toggleAutoplay = toggleAutoplay; // Для роботи onclick в HTML
function handleUserInteraction() {
    stopAutoplay();
}
// =======================================================
// 7. FETCH DATA & DISPLAY (Крок 4 Завдання)
// =======================================================
function fetchPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!postsContainer)
            return;
        postsContainer.innerHTML = '<p style="color: #667eea; text-align: center;">Fetching data...</p>';
        try {
            const response = yield fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status.toString()}`); // Type string
            }
            const posts = yield response.json(); // Типізація масиву Post[]
            let htmlContent = posts.map((post) => {
                return `
                <div class="post-item">
                    <h4>${post.id.toString()}. ${post.title} (User: ${post.userId.toString()})</h4> 
                    <p>${post.body}</p>
                </div>
            `;
            }).join('');
            postsContainer.innerHTML = htmlContent;
        }
        catch (error) { // Типізація помилки як unknown
            let errorMessage = 'An unknown error occurred'; // Примітивний тип string
            if (error instanceof Error) { // Type narrowing (звуження типу)
                errorMessage = error.message;
            }
            else if (typeof error === 'string') { // Type narrowing (звуження типу)
                errorMessage = error;
            }
            postsContainer.innerHTML = `<p style="color: red; text-align: center;">Error loading data: ${errorMessage}</p>`;
        }
    });
}
// =======================================================
// 8. EVENT LISTENERS & DOM LOGIC (Крок 4 Завдання)
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Ініціалізація Coverflow
    if (items.length > 0) {
        updateCoverflow();
        // Створення крапок
        if (dotsContainer) {
            items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot'; // Примітивний тип string
                dot.onclick = () => goToIndex(index);
                dotsContainer.appendChild(dot);
            });
            // Повторний запит точок після їх створення
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot) => {
                dot.addEventListener('click', handleUserInteraction);
            });
        }
        startAutoplay();
    }
    // 2. Mobile menu toggle (click listener)
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainMenu.classList.toggle('active');
        });
    }
    // 3. Close menu on item click 
    document.querySelectorAll('.menu-item:not(.external)').forEach((item) => {
        if (item instanceof HTMLElement) { // Type narrowing
            item.addEventListener('click', () => {
                if (menuToggle)
                    menuToggle.classList.remove('active');
                if (mainMenu)
                    mainMenu.classList.remove('active');
            });
        }
    });
    // 4. Scroll listener (animation/header change)
    window.addEventListener('scroll', updateScrollEffects);
    // 5. Scroll to top button (click listener)
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // 6. Coverflow interaction listeners (для зупинки автоплею)
    items.forEach((item, index) => {
        item.addEventListener('click', () => goToIndex(index));
    });
    // Тут додамо інші існуючі Coverflow listeners (keydown, swipe logic, reflection logic...)
    if (coverflowContainer) {
        // Keyboard navigation (keydown listener)
        coverflowContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')
                navigate(-1);
            if (e.key === 'ArrowRight')
                navigate(1);
        });
        // Touch/Swipe logic
        coverflowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });
        coverflowContainer.addEventListener('touchmove', (e) => {
            if (!isSwiping)
                return;
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        coverflowContainer.addEventListener('touchend', (e) => {
            if (!isSwiping)
                return;
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const swipeThreshold = 30; // number
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                handleUserInteraction();
                if (diffX > 0) {
                    navigate(1);
                }
                else {
                    navigate(-1);
                }
            }
            isSwiping = false;
        }, { passive: true });
    }
    // 7. Modal open/close listeners (click listener)
    if (fetchDataBtn && dataModal) {
        fetchDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dataModal.style.display = 'flex'; // Примітивний тип string
            fetchPosts();
        });
    }
    if (closeModalBtn && dataModal) {
        closeModalBtn.addEventListener('click', () => {
            if (dataModal)
                dataModal.style.display = 'none';
        });
    }
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (dataModal && e.target === dataModal) { // Type narrowing (перевірка на співпадіння цілі)
            dataModal.style.display = 'none';
        }
    });
    // 8. Form Submission ( handleSubmit )
    window.handleSubmit = (event) => {
        event.preventDefault();
        alert('Thank you for your message! We\'ll get back to you soon.');
        const form = event.target; // Type narrowing
        if (form)
            form.reset();
    };
});
// Анімації на скрол (Header background, ScrollToTop button)
function updateScrollEffects() {
    const scrollPosition = window.scrollY; // number
    // Header background on scroll
    if (header) {
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        }
        else {
            header.classList.remove('scrolled');
        }
    }
    // Show/hide scroll to top button
    if (scrollToTopBtn) {
        const isVisible = scrollPosition > 500; // boolean
        scrollToTopBtn.classList.toggle('visible', isVisible);
    }
    // Оновлення активного елемента меню (залишене від старого JS)
    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.menu-item');
    const positionCheck = scrollPosition + 100;
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (positionCheck >= sectionTop && positionCheck < sectionTop + sectionHeight) {
            menuItems.forEach((item) => {
                if (!item.classList.contains('external')) {
                    item.classList.remove('active');
                }
            });
            if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                menuItems[index].classList.add('active');
            }
        }
    });
}
//# sourceMappingURL=index.js.map