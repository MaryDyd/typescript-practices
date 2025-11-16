export const AUTO_PLAY_INTERVAL = 4000;
export const items = document.querySelectorAll('.coverflow-item');
export const dotsContainer = document.getElementById('dots');
export const currentTitle = document.getElementById('current-title');
export const currentDescription = document.getElementById('current-description');
export const coverflowContainer = document.querySelector('.coverflow-container');
export const menuToggle = document.getElementById('menuToggle');
export const mainMenu = document.getElementById('mainMenu');
export const header = document.getElementById('header');
export const scrollToTopBtn = document.getElementById('scrollToTop');
export const dataModal = document.getElementById('dataModal');
export const closeModalBtn = document.getElementById('closeModalBtn');
export const fetchDataBtn = document.getElementById('fetchDataBtn');
export const postsContainer = document.getElementById('postsContainer');
export const imageData = [
    { title: "Mountain Landscape", description: "Majestic peaks covered in snow during golden hour" },
    { title: "Forest Path", description: "A winding trail through ancient woodland" },
    { title: "Lake Reflection", description: "Serene waters mirroring the surrounding landscape" },
    { title: "Ocean Sunset", description: "Golden hour over endless ocean waves" },
    { title: "Desert Dunes", description: "Rolling sand dunes under vast blue skies" },
    { title: "Starry Night", description: "Countless stars illuminating the dark sky" },
    { title: "Waterfall", description: "Cascading water through lush green forest" }
];
export let currentIndex = 3;
export let isAnimating = false;
export let isPlaying = true;
export let touchStartX = 0;
export let touchStartY = 0;
export let isSwiping = false;
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