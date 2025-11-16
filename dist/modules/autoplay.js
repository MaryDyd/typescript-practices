// src/modules/autoplay.ts
import { AUTO_PLAY_INTERVAL, items, currentIndex, isPlaying, setCurrentIndex, setIsPlaying, } from './dom.js';
import { updateCoverflow } from './coverflow.js';
let autoplayInterval = null;
export function startAutoplay() {
    if (!isPlaying) {
        autoplayInterval = window.setInterval(() => {
            const newIndex = (currentIndex + 1) % items.length;
            setCurrentIndex(newIndex);
            updateCoverflow();
        }, AUTO_PLAY_INTERVAL);
        setIsPlaying(true);
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        if (playIcon)
            playIcon.style.display = 'none';
        if (pauseIcon)
            pauseIcon.style.display = 'block';
    }
}
export function stopAutoplay() {
    if (autoplayInterval !== null) {
        window.clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    setIsPlaying(false);
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    if (playIcon)
        playIcon.style.display = 'block';
    if (pauseIcon)
        pauseIcon.style.display = 'none';
}
export function toggleAutoplay() {
    if (isPlaying) {
        stopAutoplay();
    }
    else {
        startAutoplay();
    }
}
export function handleUserInteraction() {
    stopAutoplay();
}
//# sourceMappingURL=autoplay.js.map