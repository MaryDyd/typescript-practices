// src/main.ts
// Імпортуємо всі необхідні модулі.
import { items, dotsContainer, menuToggle, mainMenu, header, scrollToTopBtn, coverflowContainer, fetchDataBtn, dataModal, closeModalBtn, touchStartX, touchStartY, setTouchStart, setIsSwiping } from './modules/dom.js';
import { updateCoverflow, navigate, goToIndex } from './modules/coverflow.js';
import { startAutoplay, toggleAutoplay, handleUserInteraction } from './modules/autoplay.js';
import { fetchPosts } from './modules/fetch.js';
// "Виносимо" деякі функції в глобальний об'єкт window,
// щоб до них можна було звернутися з HTML (наприклад, з onclick="...").
window.navigate = navigate;
window.toggleAutoplay = toggleAutoplay;
window.handleSubmit = (event) => {
    event.preventDefault(); // Запобігаємо стандартній відправці форми.
    alert('Thank you for your message! We\'ll get back to you soon.');
    const form = event.target;
    if (form)
        form.reset(); // Очищуємо форму.
};
// Головний слухач подій, який запускає всю логіку після завантаження DOM.
document.addEventListener('DOMContentLoaded', () => {
    // --- Ініціалізація Coverflow ---
    if (items.length > 0) {
        // Встановлюємо початкові позиції.
        updateCoverflow();
        // Генеруємо крапки пагінації.
        if (dotsContainer) {
            const container = dotsContainer;
            items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                // При кліку на крапку переходимо до відповідного індексу.
                dot.onclick = () => goToIndex(index);
                container.appendChild(dot);
            });
            // Додаємо обробник для зупинки autoplay при кліку на крапку.
            const dots = container.querySelectorAll('.dot');
            dots.forEach((dot) => {
                dot.addEventListener('click', handleUserInteraction);
            });
        }
        // Запускаємо автопрокручування.
        startAutoplay();
    }
    // --- Ініціалізація Мобільного Меню ---
    if (menuToggle && mainMenu) {
        const toggle = menuToggle;
        const menu = mainMenu;
        // Перемикаємо класи 'active' для кнопки "бургера" і самого меню.
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }
    // --- Закриття Мобільного Меню при Кліку на Пункт ---
    document.querySelectorAll('.menu-item:not(.external)').forEach((item) => {
        if (item instanceof HTMLElement) {
            item.addEventListener('click', () => {
                // Ховаємо меню при навігації по "якорях".
                if (menuToggle)
                    menuToggle.classList.remove('active');
                if (mainMenu)
                    mainMenu.classList.remove('active');
            });
        }
    });
    // --- Обробники Скролу ---
    window.addEventListener('scroll', updateScrollEffects);
    // --- Кнопка "Нагору" ---
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // --- Обробники Coverflow (Клавіатура та Свайпи) ---
    if (coverflowContainer) {
        // Навігація клавішами "вліво"/"вправо".
        coverflowContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')
                navigate(-1);
            if (e.key === 'ArrowRight')
                navigate(1);
        });
        // Обробка свайпів
        coverflowContainer.addEventListener('touchstart', (e) => {
            // Зберігаємо початкові координати.
            setTouchStart(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
            setIsSwiping(true);
        }, { passive: true }); // passive: true для кращої продуктивності
        coverflowContainer.addEventListener('touchmove', (e) => {
            if (!touchStartX)
                return; // Не робимо нічого, якщо дотик не почався
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;
            // Якщо свайп горизонтальний (більше 10px), запобігаємо скролу сторінки вгору/вниз.
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        }, { passive: false }); // passive: false, тому що ми викликаємо e.preventDefault()
        coverflowContainer.addEventListener('touchend', (e) => {
            if (!touchStartX)
                return; // Не робимо нічого, якщо дотик не почався
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const swipeThreshold = 30; // Мінімальна відстань для свайп 
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            // Перевіряємо, чи був це горизонтальний свайп (а не вертикальний)
            // і чи перевищив він поріг (swipeThreshold).
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                handleUserInteraction(); // Зупиняємо autoplay
                if (diffX > 0) {
                    navigate(1); // Свайп вліво (перехід "вперед")
                }
                else {
                    navigate(-1); // Свайп вправо (перехід "назад")
                }
            }
            // Скидаємо стан свайпу.
            setIsSwiping(false);
            setTouchStart(0, 0);
        }, { passive: true });
    }
    // --- Логіка Модального Вікна (Fetch) ---
    if (fetchDataBtn && dataModal) {
        const modal = dataModal;
        fetchDataBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Запобігаємо переходу за посиланням
            modal.style.display = 'flex'; // Показуємо модальне вікно
            fetchPosts(); // Завантажуємо дані
        });
    }
    // Закриття модального вікна по кнопці.
    if (closeModalBtn && dataModal) {
        const modal = dataModal;
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    // Закриття модального вікна по кліку на фон (оверлей).
    window.addEventListener('click', (e) => {
        if (dataModal && e.target === dataModal) {
            dataModal.style.display = 'none';
        }
    });
});
/**
 * Функція, що оновлює ефекти під час скролу сторінки.
 * (Ефект "прилипання" хедера, показ кнопки "Нагору", "scroll-spy").
 */
function updateScrollEffects() {
    const scrollPosition = window.scrollY;
    // Додаємо клас 'scrolled' до хедера, якщо прокрутили більше 50px.
    if (header) {
        header.classList.toggle('scrolled', scrollPosition > 50);
    }
    // Показуємо кнопку "Нагору", якщо прокрутили більше 500px.
    if (scrollToTopBtn) {
        const isVisible = scrollPosition > 500;
        scrollToTopBtn.classList.toggle('visible', isVisible);
    }
    // Логіка "Scroll-spy" - підсвічування активного пункту меню.
    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.menu-item');
    // Використовуємо зсув (100px), щоб секція ставала активною трохи раніше.
    const positionCheck = scrollPosition + 100;
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Перевіряємо, чи знаходимося ми в межах поточної секції.
        if (positionCheck >= sectionTop && positionCheck < sectionTop + sectionHeight) {
            // Знімаємо клас 'active' з усіх пунктів меню.
            menuItems.forEach((item) => {
                if (!item.classList.contains('external')) {
                    item.classList.remove('active');
                }
            });
            // Додаємо клас 'active' потрібному пункту.
            if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                menuItems[index].classList.add('active');
            }
        }
    });
}
//# sourceMappingURL=main.js.map