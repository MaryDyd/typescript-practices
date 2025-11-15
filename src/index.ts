// src/main.ts

// =======================================================
// 1. TYPED INTERFACES & UNION TYPES (для Fetch та типізації даних)
// =======================================================

// Інтерфейс для даних, які ми отримуємо з JSONPlaceholder
interface Post {
    userId: number; // Примітивний тип number
    id: number;     // Примітивний тип number
    title: string;  // Примітивний тип string
    body: string;   // Примітивний тип string
}

// Union Type для періоду автоплей (string | number) - не використовується прямо тут, але як приклад
type AutoplaySpeed = number | "fast" | "slow"; 
const AUTO_PLAY_INTERVAL: number = 4000; // Примітивний тип number

// =======================================================
// 2. DOM ЕЛЕМЕНТИ (типізація та перевірка на null)
// =======================================================

// Використовуємо явне приведення типів та оператор ! для впевненості, що елементи існують (або додаємо перевірку if)
const items: NodeListOf<HTMLElement> = document.querySelectorAll('.coverflow-item');
const dotsContainer: HTMLElement | null = document.getElementById('dots');
const currentTitle: HTMLElement | null = document.getElementById('current-title');
const currentDescription: HTMLElement | null = document.getElementById('current-description');
const coverflowContainer: HTMLElement | null = document.querySelector('.coverflow-container');
const menuToggle: HTMLElement | null = document.getElementById('menuToggle');
const mainMenu: HTMLElement | null = document.getElementById('mainMenu');
const header: HTMLElement | null = document.getElementById('header');
const scrollToTopBtn: HTMLElement | null = document.getElementById('scrollToTop');

// Нові елементи для Fetch/Modal
const dataModal: HTMLElement | null = document.getElementById('dataModal');
const closeModalBtn: HTMLElement | null = document.getElementById('closeModalBtn');
const fetchDataBtn: HTMLElement | null = document.getElementById('fetchDataBtn');
const postsContainer: HTMLElement | null = document.getElementById('postsContainer');


// =======================================================
// 3. ЗМІННІ (типізація примітивними та Union типами)
// =======================================================
let currentIndex: number = 3; // Примітивний тип number
let isAnimating: boolean = false; // Примітивний тип boolean
let autoplayInterval: number | null = null; // Union Type (number | null)
let isPlaying: boolean = true; // Примітивний тип boolean
let touchStartX: number = 0;
let touchStartY: number = 0;
let isSwiping: boolean = false;

// =======================================================
// 4. ДАНІ
// =======================================================
const imageData: { title: string; description: string }[] = [
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

function updateCoverflow(): void {
    if (isAnimating) return;
    isAnimating = true;

    items.forEach((item: HTMLElement, index: number) => {
        let offset: number = index - currentIndex; // number
        
        if (offset > items.length / 2) {
            offset = offset - items.length;
        }
        else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }
        
        const absOffset: number = Math.abs(offset); // number
        const sign: number = Math.sign(offset); // number
        
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

    // Оновлення крапок
    if (dotsContainer) {
        const dots: NodeListOf<HTMLElement> = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot: HTMLElement, index: number) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    const currentData = imageData[currentIndex];
    if (currentTitle) currentTitle.textContent = currentData.title;
    if (currentDescription) currentDescription.textContent = currentData.description;
    
    // Resetting and setting animation (if elements exist)
    if (currentTitle && currentDescription) {
        currentTitle.style.animation = 'none';
        currentDescription.style.animation = 'none';
        setTimeout((): void => {
            currentTitle.style.animation = 'fadeIn 0.6s forwards';
            currentDescription.style.animation = 'fadeIn 0.6s forwards';
        }, 10);
    }
    

    setTimeout((): void => {
        isAnimating = false;
    }, 600);
}

function navigate(direction: number): void { // Типізація параметра
    if (isAnimating) return;
    handleUserInteraction();
    
    currentIndex = currentIndex + direction;
    
    if (currentIndex < 0) {
        currentIndex = items.length - 1;
    } else if (currentIndex >= items.length) {
        currentIndex = 0;
    }
    
    updateCoverflow();
}

(window as any).navigate = navigate; // Для роботи onclick в HTML

function goToIndex(index: number): void { // Типізація параметра
    if (isAnimating || index === currentIndex) return;
    handleUserInteraction();
    currentIndex = index;
    updateCoverflow();
}

// =======================================================
// 6. АВТОПЛЕЙ
// =======================================================

function startAutoplay(): void {
    if (!isPlaying) {
        autoplayInterval = setInterval((): void => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCoverflow();
        }, AUTO_PLAY_INTERVAL);
        isPlaying = true;
        // Оновлення іконок (якщо елементи знайдено)
        const playIcon = document.querySelector('.play-icon') as HTMLElement | null;
        const pauseIcon = document.querySelector('.pause-icon') as HTMLElement | null;
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
    }
}

function stopAutoplay(): void {
    if (autoplayInterval !== null) { // Type narrowing (перевірка на null)
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    isPlaying = false;
    // Оновлення іконок
    const playIcon = document.querySelector('.play-icon') as HTMLElement | null;
    const pauseIcon = document.querySelector('.pause-icon') as HTMLElement | null;
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
}

function toggleAutoplay(): void {
    if (isPlaying) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}

(window as any).toggleAutoplay = toggleAutoplay; // Для роботи onclick в HTML

function handleUserInteraction(): void {
    stopAutoplay();
}


// =======================================================
// 7. FETCH DATA & DISPLAY (Крок 4 Завдання)
// =======================================================

async function fetchPosts(): Promise<void> {
    if (!postsContainer) return;
    postsContainer.innerHTML = '<p style="color: #667eea; text-align: center;">Fetching data...</p>';

    try {
        const response: Response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status.toString()}`); // Type string
        }
        
        const posts: Post[] = await response.json(); // Типізація масиву Post[]
        
        let htmlContent: string = posts.map((post: Post): string => {
            return `
                <div class="post-item">
                    <h4>${post.id.toString()}. ${post.title} (User: ${post.userId.toString()})</h4> 
                    <p>${post.body}</p>
                </div>
            `;
        }).join('');

        postsContainer.innerHTML = htmlContent;

    } catch (error: unknown) { // Типізація помилки як unknown
        let errorMessage: string = 'An unknown error occurred'; // Примітивний тип string
        if (error instanceof Error) { // Type narrowing (звуження типу)
            errorMessage = error.message;
        } else if (typeof error === 'string') { // Type narrowing (звуження типу)
            errorMessage = error;
        }

        postsContainer.innerHTML = `<p style="color: red; text-align: center;">Error loading data: ${errorMessage}</p>`;
    }
}


// =======================================================
// 8. EVENT LISTENERS & DOM LOGIC (Крок 4 Завдання)
// =======================================================

document.addEventListener('DOMContentLoaded', (): void => {
    // 1. Ініціалізація Coverflow
    if (items.length > 0) {
        updateCoverflow();
        // Створення крапок
        if (dotsContainer) {
            items.forEach((_, index: number) => {
                const dot: HTMLDivElement = document.createElement('div');
                dot.className = 'dot'; // Примітивний тип string
                dot.onclick = () => goToIndex(index);
                dotsContainer.appendChild(dot);
            });
            // Повторний запит точок після їх створення
            const dots: NodeListOf<HTMLElement> = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot: HTMLElement) => {
                dot.addEventListener('click', handleUserInteraction);
            });
        }
        startAutoplay();
    }

    // 2. Mobile menu toggle (click listener)
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', (): void => {
            menuToggle.classList.toggle('active');
            mainMenu.classList.toggle('active');
        });
    }

    // 3. Close menu on item click 
    document.querySelectorAll('.menu-item:not(.external)').forEach((item: Element) => {
        if (item instanceof HTMLElement) { // Type narrowing
            item.addEventListener('click', (): void => {
                if (menuToggle) menuToggle.classList.remove('active');
                if (mainMenu) mainMenu.classList.remove('active');
            });
        }
    });

    // 4. Scroll listener (animation/header change)
    window.addEventListener('scroll', updateScrollEffects);
    
    // 5. Scroll to top button (click listener)
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (): void => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. Coverflow interaction listeners (для зупинки автоплею)
    items.forEach((item: HTMLElement, index: number) => {
        item.addEventListener('click', () => goToIndex(index));
    });
    // Тут додамо інші існуючі Coverflow listeners (keydown, swipe logic, reflection logic...)
    
    if (coverflowContainer) {
        // Keyboard navigation (keydown listener)
        coverflowContainer.addEventListener('keydown', (e: KeyboardEvent): void => { // Типізація події
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });

        // Touch/Swipe logic
        coverflowContainer.addEventListener('touchstart', (e: TouchEvent): void => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });

        coverflowContainer.addEventListener('touchmove', (e: TouchEvent): void => {
            if (!isSwiping) return;
            const currentX: number = e.changedTouches[0].screenX;
            const diff: number = currentX - touchStartX;
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        coverflowContainer.addEventListener('touchend', (e: TouchEvent): void => {
            if (!isSwiping) return;
            const touchEndX: number = e.changedTouches[0].screenX;
            const touchEndY: number = e.changedTouches[0].screenY;
            const swipeThreshold: number = 30; // number
            const diffX: number = touchStartX - touchEndX;
            const diffY: number = touchStartY - touchEndY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                handleUserInteraction();
                if (diffX > 0) {
                    navigate(1);
                } else {
                    navigate(-1);
                }
            }
            isSwiping = false;
        }, { passive: true });
    }

    // 7. Modal open/close listeners (click listener)
    if (fetchDataBtn && dataModal) {
        fetchDataBtn.addEventListener('click', (e: MouseEvent): void => { // Типізація події
            e.preventDefault();
            dataModal.style.display = 'flex'; // Примітивний тип string
            fetchPosts();
        });
    }

    if (closeModalBtn && dataModal) {
        closeModalBtn.addEventListener('click', (): void => {
            if (dataModal) dataModal.style.display = 'none';
        });
    }
    
    // Close modal on outside click
    window.addEventListener('click', (e: MouseEvent): void => {
        if (dataModal && e.target === dataModal) { // Type narrowing (перевірка на співпадіння цілі)
            dataModal.style.display = 'none';
        }
    });

    // 8. Form Submission ( handleSubmit )
    (window as any).handleSubmit = (event: Event): void => { // Типізація події
        event.preventDefault();
        alert('Thank you for your message! We\'ll get back to you soon.');
        const form = event.target as HTMLFormElement | null; // Type narrowing
        if (form) form.reset();
    };
});


// Анімації на скрол (Header background, ScrollToTop button)
function updateScrollEffects(): void {
    const scrollPosition: number = window.scrollY; // number

    // Header background on scroll
    if (header) {
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Show/hide scroll to top button
    if (scrollToTopBtn) {
        const isVisible: boolean = scrollPosition > 500; // boolean
        scrollToTopBtn.classList.toggle('visible', isVisible);
    }
    
    // Оновлення активного елемента меню (залишене від старого JS)
    const sections: NodeListOf<HTMLElement> = document.querySelectorAll('.section');
    const menuItems: NodeListOf<HTMLElement> = document.querySelectorAll('.menu-item');
    const positionCheck: number = scrollPosition + 100;

    sections.forEach((section: HTMLElement, index: number) => {
        const sectionTop: number = section.offsetTop;
        const sectionHeight: number = section.clientHeight;

        if (positionCheck >= sectionTop && positionCheck < sectionTop + sectionHeight) {
            menuItems.forEach((item: HTMLElement) => {
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