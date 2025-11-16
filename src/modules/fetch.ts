// src/modules/fetch.ts

import { Post } from '../types/data.js';
import { postsContainer } from './dom.js';

// Асинхронна функція для завантаження постів з JSONPlaceholder API.
export async function fetchPosts(): Promise<void> {
    // Перевіряємо, чи існує контейнер для постів.
    if (!postsContainer) return;

    // Поки дані завантажуються, показуємо повідомлення.
    postsContainer.innerHTML = '<p style="color: #667eea; text-align: center;">Fetching data...</p>';

    try {
        // Робимо запит до API.
        const response: Response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    
        // Перевіряємо, чи успішний запит (статус 200-299).
        if (!response.ok) {
            // Якщо ні, кидаємо помилку.
            throw new Error(`HTTP error! status: ${response.status.toString()}`); 
        }
    
        // Парсимо JSON-відповідь у масив типу Post.
        const posts: Post[] = await response.json(); 
    
        // Перетворюємо масив постів у HTML-розмітку.
        let htmlContent: string = posts.map((post: Post): string => {
            return `
                <div class="post-item">
                    <h4>${post.id.toString()}. ${post.title} (User: ${post.userId.toString()})</h4> 
                    <p>${post.body}</p>
                </div>
            `;
        }).join('');
    
        // Вставляємо згенерований HTML у контейнер.
        postsContainer.innerHTML = htmlContent;

    } catch (error: unknown) { 
        // Блок обробки помилок (мережевих або парсингу).
        let errorMessage: string = 'An unknown error occurred'; 
    
        // Намагаємося отримати більш конкретне повідомлення про помилку.
        if (error instanceof Error) { 
            errorMessage = error.message;
        } else if (typeof error === 'string') { 
            errorMessage = error;
        }
    
        // Показуємо повідомлення про помилку користувачу.
        postsContainer.innerHTML = `<p style="color: red; text-align: center;">Error loading data: ${errorMessage}</p>`;
    }
}