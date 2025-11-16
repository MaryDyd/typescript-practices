// src/modules/coverflow.ts
import { handleUserInteraction } from './autoplay.js';
import { 
    items, dotsContainer, currentTitle, currentDescription, 
    currentIndex, isAnimating, imageData,
    setCurrentIndex, setIsAnimating,
} from './dom.js';
export function updateCoverflow(): void {
    if (isAnimating) return;
    setIsAnimating(true); 
    items.forEach((item: HTMLElement, index: number) => {
        let offset: number = index - currentIndex; 
        if (offset > items.length / 2) {
            offset = offset - items.length;
        }
        else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }
        const absOffset: number = Math.abs(offset);
        const sign: number = Math.sign(offset);
        let translateX: number = offset * 220;
        let translateZ: number = -absOffset * 200;
        let rotateY: number = -sign * Math.min(absOffset * 60, 60);
        let opacity: number = 1 - (absOffset * 0.2);
        let scale: number = 1 - (absOffset * 0.1);
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
    if (dotsContainer) { 
        const dots: NodeListOf<HTMLElement> = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot: HTMLElement, index: number) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    const currentData = imageData[currentIndex];
    if (currentTitle) { 
        currentTitle.textContent = currentData.title;
    }
    if (currentDescription) { 
        currentDescription.textContent = currentData.description;
    }
    if (currentTitle && currentDescription) { 
        const titleEl = currentTitle;
        const descEl = currentDescription;
        titleEl.style.animation = 'none';
        descEl.style.animation = 'none';
        setTimeout((): void => {
            titleEl.style.animation = 'fadeIn 0.6s forwards';
            descEl.style.animation = 'fadeIn 0.6s forwards';
        }, 10);
    }
    setTimeout((): void => {
        setIsAnimating(false);
    }, 600);
}
export function navigate(direction: number): void { 
    if (isAnimating) return;
    handleUserInteraction();
    let newIndex = currentIndex + direction;
    if (newIndex < 0) {
        newIndex = items.length - 1;
    } else if (newIndex >= items.length) {
        newIndex = 0;
    }
    setCurrentIndex(newIndex);
    updateCoverflow();
}
export function goToIndex(index: number): void { 
    if (isAnimating || index === currentIndex) return;
    handleUserInteraction();
    setCurrentIndex(index);
    updateCoverflow();
}