// src/types/data.ts

// Інтерфейс для опису структури поста, що приходить з API.
export interface Post {
    userId: number; 
    id: number;     
    title: string;  
    body: string;   
}

// Інтерфейс для опису структури даних нашого слайда.
export interface ImageData {
    title: string;
    description: string;
}

// Приклад кастомного типу (хоча він тут і не використовується).
export type AutoplaySpeed = number | "fast" | "slow";