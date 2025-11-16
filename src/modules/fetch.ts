// src/modules/fetch.ts
import { Post } from '../types/data.js';
import { postsContainer } from './dom.js';
export async function fetchPosts(): Promise<void> {
    if (!postsContainer) return;
    postsContainer.innerHTML = '<p style="color: #667eea; text-align: center;">Fetching data...</p>';
    try {
        const response: Response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status.toString()}`); 
        }
        const posts: Post[] = await response.json(); 
        let htmlContent: string = posts.map((post: Post): string => {
            return `
                <div class="post-item">
                    <h4>${post.id.toString()}. ${post.title} (User: ${post.userId.toString()})</h4> 
                    <p>${post.body}</p>
                </div>
            `;
        }).join('');
        postsContainer.innerHTML = htmlContent;
    } catch (error: unknown) { 
        let errorMessage: string = 'An unknown error occurred'; 
        if (error instanceof Error) { 
            errorMessage = error.message;
        } else if (typeof error === 'string') { 
            errorMessage = error;
        }
        postsContainer.innerHTML = `<p style="color: red; text-align: center;">Error loading data: ${errorMessage}</p>`;
    }
}