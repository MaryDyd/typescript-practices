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
export function fetchPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!postsContainer)
            return;
        postsContainer.innerHTML = '<p style="color: #667eea; text-align: center;">Fetching data...</p>';
        try {
            const response = yield fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status.toString()}`);
            }
            const posts = yield response.json();
            let htmlContent = posts.map((post) => {
                return `
                <div class="post-item">
                    <h4>${post.id.toString()}. ${post.title} (User: ${post.userId.toString()})</h4> 
                    <p>${post.body}</p>
                </div>
            `;
            }).join('');
            postsContainer.innerHTML = htmlContent;
        }
        catch (error) {
            let errorMessage = 'An unknown error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else if (typeof error === 'string') {
                errorMessage = error;
            }
            postsContainer.innerHTML = `<p style="color: red; text-align: center;">Error loading data: ${errorMessage}</p>`;
        }
    });
}
//# sourceMappingURL=fetch.js.map