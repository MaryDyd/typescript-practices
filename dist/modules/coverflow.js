// src/modules/coverflow.ts
import { handleUserInteraction } from './autoplay.js';
import { items, dotsContainer, currentTitle, currentDescription, currentIndex, isAnimating, imageData, setCurrentIndex, setIsAnimating, } from './dom.js';
export function updateCoverflow() {
    if (isAnimating)
        return;
    setIsAnimating(true);
    items.forEach((item, index) => {
        let offset = index - currentIndex;
        if (offset > items.length / 2) {
            offset = offset - items.length;
        }
        else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }
        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);
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
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
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
        setTimeout(() => {
            titleEl.style.animation = 'fadeIn 0.6s forwards';
            descEl.style.animation = 'fadeIn 0.6s forwards';
        }, 10);
    }
    setTimeout(() => {
        setIsAnimating(false);
    }, 600);
}
export function navigate(direction) {
    if (isAnimating)
        return;
    handleUserInteraction();
    let newIndex = currentIndex + direction;
    if (newIndex < 0) {
        newIndex = items.length - 1;
    }
    else if (newIndex >= items.length) {
        newIndex = 0;
    }
    setCurrentIndex(newIndex);
    updateCoverflow();
}
export function goToIndex(index) {
    if (isAnimating || index === currentIndex)
        return;
    handleUserInteraction();
    setCurrentIndex(index);
    updateCoverflow();
}
//# sourceMappingURL=coverflow.js.map