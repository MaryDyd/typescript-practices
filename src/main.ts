// src/main.ts

import { 
    items, dotsContainer, menuToggle, mainMenu, header, 
    scrollToTopBtn, coverflowContainer, fetchDataBtn, dataModal, 
    closeModalBtn, touchStartX, touchStartY, setTouchStart, setIsSwiping
} from './modules/dom.js';
import { 
    updateCoverflow, navigate, goToIndex 
} from './modules/coverflow.js';
import { 
    startAutoplay, toggleAutoplay, handleUserInteraction 
} from './modules/autoplay.js';
import { fetchPosts } from './modules/fetch.js';


(window as any).navigate = navigate;
(window as any).toggleAutoplay = toggleAutoplay; 
(window as any).handleSubmit = (event: Event): void => { 
    event.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    const form = event.target as HTMLFormElement | null; 
    if (form) form.reset();
};

document.addEventListener('DOMContentLoaded', (): void => {
    if (items.length > 0) {
        updateCoverflow();
        if (dotsContainer) { 
            const container = dotsContainer; 
            items.forEach((_, index: number) => {
                const dot: HTMLDivElement = document.createElement('div');
                dot.className = 'dot';
                dot.onclick = () => goToIndex(index);
                container.appendChild(dot);
            });
            const dots: NodeListOf<HTMLElement> = container.querySelectorAll('.dot');
            dots.forEach((dot: HTMLElement) => {
                dot.addEventListener('click', handleUserInteraction);
            });
        }
        startAutoplay();
    }
    if (menuToggle && mainMenu) { 
        const toggle = menuToggle;
        const menu = mainMenu;
        toggle.addEventListener('click', (): void => {
            toggle.classList.toggle('active'); 
            menu.classList.toggle('active'); 
        });
    }
    document.querySelectorAll('.menu-item:not(.external)').forEach((item: Element) => {
        if (item instanceof HTMLElement) { 
            item.addEventListener('click', (): void => {
                if (menuToggle) menuToggle.classList.remove('active');
                if (mainMenu) mainMenu.classList.remove('active');
            });
        }
    });
    window.addEventListener('scroll', updateScrollEffects);
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (): void => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    if (coverflowContainer) {
         coverflowContainer.addEventListener('keydown', (e: KeyboardEvent): void => { 
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
        coverflowContainer.addEventListener('touchstart', (e: TouchEvent): void => {
            setTouchStart(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
            setIsSwiping(true);
        }, { passive: true });
        coverflowContainer.addEventListener('touchmove', (e: TouchEvent): void => {
            if (!touchStartX) return; 
            const currentX: number = e.changedTouches[0].screenX;
            const diff: number = currentX - touchStartX;
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        coverflowContainer.addEventListener('touchend', (e: TouchEvent): void => {
            if (!touchStartX) return; 
            const touchEndX: number = e.changedTouches[0].screenX;
            const touchEndY: number = e.changedTouches[0].screenY;
            const swipeThreshold: number = 30; 
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
            setIsSwiping(false);
            setTouchStart(0, 0);
        }, { passive: true });
    }
    if (fetchDataBtn && dataModal) { 
        const modal = dataModal;
        fetchDataBtn.addEventListener('click', (e: MouseEvent): void => { 
            e.preventDefault();
            modal.style.display = 'flex';
            fetchPosts();
        });
    }
    if (closeModalBtn && dataModal) { 
        const modal = dataModal;
        closeModalBtn.addEventListener('click', (): void => {
            modal.style.display = 'none';
        });
    }
    window.addEventListener('click', (e: MouseEvent): void => {
        if (dataModal && e.target === dataModal) { 
            dataModal.style.display = 'none';
        }
    });
});
function updateScrollEffects(): void {
    const scrollPosition: number = window.scrollY; 
    if (header) {
        header.classList.toggle('scrolled', scrollPosition > 50);
    }
    if (scrollToTopBtn) {
        const isVisible: boolean = scrollPosition > 500; 
        scrollToTopBtn.classList.toggle('visible', isVisible);
    }
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