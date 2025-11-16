// src/main.ts
import { items, dotsContainer, menuToggle, mainMenu, header, scrollToTopBtn, coverflowContainer, fetchDataBtn, dataModal, closeModalBtn, touchStartX, touchStartY, setTouchStart, setIsSwiping } from './modules/dom.js';
import { updateCoverflow, navigate, goToIndex } from './modules/coverflow.js';
import { startAutoplay, toggleAutoplay, handleUserInteraction } from './modules/autoplay.js';
import { fetchPosts } from './modules/fetch.js';
window.navigate = navigate;
window.toggleAutoplay = toggleAutoplay;
window.handleSubmit = (event) => {
    event.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    const form = event.target;
    if (form)
        form.reset();
};
document.addEventListener('DOMContentLoaded', () => {
    if (items.length > 0) {
        updateCoverflow();
        if (dotsContainer) {
            const container = dotsContainer;
            items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.onclick = () => goToIndex(index);
                container.appendChild(dot);
            });
            const dots = container.querySelectorAll('.dot');
            dots.forEach((dot) => {
                dot.addEventListener('click', handleUserInteraction);
            });
        }
        startAutoplay();
    }
    if (menuToggle && mainMenu) {
        const toggle = menuToggle;
        const menu = mainMenu;
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }
    document.querySelectorAll('.menu-item:not(.external)').forEach((item) => {
        if (item instanceof HTMLElement) {
            item.addEventListener('click', () => {
                if (menuToggle)
                    menuToggle.classList.remove('active');
                if (mainMenu)
                    mainMenu.classList.remove('active');
            });
        }
    });
    window.addEventListener('scroll', updateScrollEffects);
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    if (coverflowContainer) {
        coverflowContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')
                navigate(-1);
            if (e.key === 'ArrowRight')
                navigate(1);
        });
        coverflowContainer.addEventListener('touchstart', (e) => {
            setTouchStart(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
            setIsSwiping(true);
        }, { passive: true });
        coverflowContainer.addEventListener('touchmove', (e) => {
            if (!touchStartX)
                return;
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        coverflowContainer.addEventListener('touchend', (e) => {
            if (!touchStartX)
                return;
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const swipeThreshold = 30;
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
            setIsSwiping(false);
            setTouchStart(0, 0);
        }, { passive: true });
    }
    if (fetchDataBtn && dataModal) {
        const modal = dataModal;
        fetchDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            fetchPosts();
        });
    }
    if (closeModalBtn && dataModal) {
        const modal = dataModal;
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    window.addEventListener('click', (e) => {
        if (dataModal && e.target === dataModal) {
            dataModal.style.display = 'none';
        }
    });
});
function updateScrollEffects() {
    const scrollPosition = window.scrollY;
    if (header) {
        header.classList.toggle('scrolled', scrollPosition > 50);
    }
    if (scrollToTopBtn) {
        const isVisible = scrollPosition > 500;
        scrollToTopBtn.classList.toggle('visible', isVisible);
    }
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
//# sourceMappingURL=main.js.map