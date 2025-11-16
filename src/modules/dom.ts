// src/modules/dom.ts
import { ImageData } from '../types/data.js';
export const AUTO_PLAY_INTERVAL: number = 4000;
export const items: NodeListOf<HTMLElement> = document.querySelectorAll('.coverflow-item');
export const dotsContainer: HTMLElement | null = document.getElementById('dots');
export const currentTitle: HTMLElement | null = document.getElementById('current-title');
export const currentDescription: HTMLElement | null = document.getElementById('current-description');
export const coverflowContainer: HTMLElement | null = document.querySelector('.coverflow-container');
export const menuToggle: HTMLElement | null = document.getElementById('menuToggle');
export const mainMenu: HTMLElement | null = document.getElementById('mainMenu');
export const header: HTMLElement | null = document.getElementById('header');
export const scrollToTopBtn: HTMLElement | null = document.getElementById('scrollToTop');
export const dataModal: HTMLElement | null = document.getElementById('dataModal');
export const closeModalBtn: HTMLElement | null = document.getElementById('closeModalBtn');
export const fetchDataBtn: HTMLElement | null = document.getElementById('fetchDataBtn');
export const postsContainer: HTMLElement | null = document.getElementById('postsContainer');
export const imageData: ImageData[] = [
    { title: "Mountain Landscape", description: "Majestic peaks covered in snow during golden hour" },
    { title: "Forest Path", description: "A winding trail through ancient woodland" },
    { title: "Lake Reflection", description: "Serene waters mirroring the surrounding landscape" },
    { title: "Ocean Sunset", description: "Golden hour over endless ocean waves" },
    { title: "Desert Dunes", description: "Rolling sand dunes under vast blue skies" },
    { title: "Starry Night", description: "Countless stars illuminating the dark sky" },
    { title: "Waterfall", description: "Cascading water through lush green forest" }
];
export let currentIndex: number = 3; 
export let isAnimating: boolean = false; 
export let isPlaying: boolean = true; 
export let touchStartX: number = 0;
export let touchStartY: number = 0;
export let isSwiping: boolean = false;
export function setCurrentIndex(newIndex: number): void {
    currentIndex = newIndex;
}
export function setIsAnimating(value: boolean): void {
    isAnimating = value;
}
export function setIsPlaying(value: boolean): void {
    isPlaying = value;
}
export function setTouchStart(x: number, y: number): void {
    touchStartX = x;
    touchStartY = y;
}
export function setIsSwiping(value: boolean): void {
    isSwiping = value;
}