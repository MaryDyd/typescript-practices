// src/modules/autoplay.ts
import { 
    AUTO_PLAY_INTERVAL, items, currentIndex, 
    isPlaying, setCurrentIndex, setIsPlaying,
} from './dom.js';
import { updateCoverflow } from './coverflow.js';
let autoplayInterval: number | null = null; 
export function startAutoplay(): void {
    if (!isPlaying) {
        autoplayInterval = window.setInterval((): void => {
            const newIndex: number = (currentIndex + 1) % items.length;
            setCurrentIndex(newIndex);
            updateCoverflow();
        }, AUTO_PLAY_INTERVAL);
        setIsPlaying(true);
        const playIcon = document.querySelector('.play-icon') as HTMLElement | null;
        const pauseIcon = document.querySelector('.pause-icon') as HTMLElement | null;
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
    }
}
export function stopAutoplay(): void {
    if (autoplayInterval !== null) { 
        window.clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    setIsPlaying(false);
    const playIcon = document.querySelector('.play-icon') as HTMLElement | null;
    const pauseIcon = document.querySelector('.pause-icon') as HTMLElement | null;
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
}
export function toggleAutoplay(): void {
    if (isPlaying) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}
export function handleUserInteraction(): void {
    stopAutoplay();
}