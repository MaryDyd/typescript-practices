// src/modules/coverflow.ts

// Імпортуємо функцію для зупинки autoplay та змінні/функції стану з dom.
import { handleUserInteraction } from './autoplay.js';
import { 
    items, dotsContainer, currentTitle, currentDescription, 
    currentIndex, isAnimating, imageData,
    setCurrentIndex, setIsAnimating,
} from './dom.js';


// Основна функція, яка оновлює 3D-трансформації для всіх елементів coverflow.
export function updateCoverflow(): void {
    // Блокування: якщо анімація вже триває, виходимо, щоб уникнути конфліктів.
    if (isAnimating) return;
    // Встановлюємо прапорець, що анімація почалася.
    setIsAnimating(true); 

    // Проходимо по кожному елементу каруселі.
    items.forEach((item: HTMLElement, index: number) => {
        // Розраховуємо "зсув" (offset) елемента відносно поточного активного індексу.
        let offset: number = index - currentIndex; 
    
        // Логіка для "зациклення" каруселі.
        // Якщо елемент "занадто" праворуч, вважаємо, що він ліворуч (і навпаки).
        if (offset > items.length / 2) {
            offset = offset - items.length;
        }
        else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }
    
        // Абсолютний зсув (для розрахунку z-index, opacity, scale).
        const absOffset: number = Math.abs(offset);
        // Знак зсуву (напрямок: -1, 0, 1).
        const sign: number = Math.sign(offset);
    
        // Розрахунок CSS-властивостей для 3D-ефекту.
        let translateX: number = offset * 220; // Позиція по X
        let translateZ: number = -absOffset * 200; // Позиція по Z (глибина)
        let rotateY: number = -sign * Math.min(absOffset * 60, 60); // Кут повороту
        let opacity: number = 1 - (absOffset * 0.2); // Прозорість
        let scale: number = 1 - (absOffset * 0.1); // Масштаб
    
        // Елементи, що знаходяться "занадто далеко", робимо повністю прозорими
        // і відсуваємо ще далі, щоб вони не заважали.
        if (absOffset > 3) {
            opacity = 0;
            translateX = sign * 800;
        }
    
        // Застосовуємо розраховані стилі до елемента.
        item.style.transform = `
            translateX(${translateX}px) 
            translateZ(${translateZ}px) 
            rotateY(${rotateY}deg)
            scale(${scale})
        `;
        item.style.opacity = opacity.toString();
        // Чим ближче елемент до центру, тим вищий його z-index.
        item.style.zIndex = (100 - absOffset).toString();
    
        // Додаємо/видаляємо клас 'active' для поточного елемента.
        item.classList.toggle('active', index === currentIndex);
    });

    // Оновлюємо активну крапку (dot) в пагінації.
    if (dotsContainer) { 
        const dots: NodeListOf<HTMLElement> = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot: HTMLElement, index: number) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Оновлюємо текстовий контент (заголовок та опис).
    const currentData = imageData[currentIndex];
    if (currentTitle) { 
        currentTitle.textContent = currentData.title;
    }
    if (currentDescription) { 
        currentDescription.textContent = currentData.description;
    }

    // Перезапускаємо анімацію появи (fadeIn) для тексту.
    if (currentTitle && currentDescription) { 
        const titleEl = currentTitle;
        const descEl = currentDescription;
    
        // Скидаємо анімацію
        titleEl.style.animation = 'none';
        descEl.style.animation = 'none';
    
        // Використовуємо setTimeout(..., 10), щоб браузер встиг "побачити"
        // скидання анімації перед її повторним запуском.
        setTimeout((): void => {
            titleEl.style.animation = 'fadeIn 0.6s forwards';
            descEl.style.animation = 'fadeIn 0.6s forwards';
        }, 10);
    }

    // Знімаємо блокування анімації через 600мс (має відповідати часу CSS transition).
    setTimeout((): void => {
        setIsAnimating(false);
    }, 600);
}

/**
 * Функція для навігації (вперед/назад).
 * @param direction - Напрямок (-1 для "назад", 1 для "вперед").
 */
export function navigate(direction: number): void { 
    // Блокуємо, якщо анімація ще триває.
    if (isAnimating) return;
    // Зупиняємо автопрокручування при ручній навігації.
    handleUserInteraction();

    // Розраховуємо новий індекс з урахуванням зациклення.
    let newIndex = currentIndex + direction;
    if (newIndex < 0) {
        newIndex = items.length - 1; // Перехід до останнього
    } else if (newIndex >= items.length) {
        newIndex = 0; // Перехід до першого
    }

    // Встановлюємо новий індекс і оновлюємо вигляд.
    setCurrentIndex(newIndex);
    updateCoverflow();
}

/**
 * Перехід до конкретного індексу (використовується для крапок пагінації).
 * @param index - Цільовий індекс.
 */
export function goToIndex(index: number): void { 
    // Блокуємо, якщо анімація триває, або якщо ми вже на цьому слайді.
    if (isAnimating || index === currentIndex) return;
    // Зупиняємо автопрокручування.
    handleUserInteraction();
    // Встановлюємо індекс і оновлюємо вигляд.
    setCurrentIndex(index);
    updateCoverflow();
}