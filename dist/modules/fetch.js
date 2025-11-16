// src/modules/fetch.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { postsContainer } from './dom.js';
// Асинхронна функція для завантаження постів з JSONPlaceholder API.
export function fetchPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        // Перевіряємо, чи існує контейнер для постів.
        if (!postsContainer)
            return;
        // Поки дані завантажуються, показуємо повідомлення.
        postsContainer.innerHTML = '<p style="color: #667eea; text-align: center;">Fetching data...</p>';
        try {
            // Робимо запит до API.
            const response = yield fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
            // Перевіряємо, чи успішний запит (статус 200-299).
            if (!response.ok) {
                // Якщо ні, кидаємо помилку.
                throw new Error(`HTTP error! status: ${response.status.toString()}`);
            }
            // Парсимо JSON-відповідь у масив типу Post.
            const posts = yield response.json();
            // Перетворюємо масив постів у HTML-розмітку.
            let htmlContent = posts.map((post) => {
                return `
                <div class="post-item">
                    <h4>${post.id.toString()}. ${post.title} (User: ${post.userId.toString()})</h4> 
                    <p>${post.body}</p>
                </div>
            `;
            }).join('');
            // Вставляємо згенерований HTML у контейнер.
            postsContainer.innerHTML = htmlContent;
        }
        catch (error) {
            // Блок обробки помилок (мережевих або парсингу).
            let errorMessage = 'An unknown error occurred';
            // Намагаємося отримати більш конкретне повідомлення про помилку.
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else if (typeof error === 'string') {
                errorMessage = error;
            }
            // Показуємо повідомлення про помилку користувачу.
            postsContainer.innerHTML = `<p style="color: red; text-align: center;">Error loading data: ${errorMessage}</p>`;
        }
    });
}
//# sourceMappingURL=fetch.js.map