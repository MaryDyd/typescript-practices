// src/types/data.ts

export interface Post {
    userId: number; 
    id: number;     
    title: string;  
    body: string;   
}

export interface ImageData {
    title: string;
    description: string;
}

export type AutoplaySpeed = number | "fast" | "slow";