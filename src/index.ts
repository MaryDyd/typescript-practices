// src/index.ts

// 1. Тип string (рядок)
let userName: string = "TypeScript Dev";
// userName = 123; // <-- Спричинить помилку TS!

// 2. Тип number (число)
let projectCount: number = 1;
let piValue: number = 3.14159;

// 3. Тип boolean (логічний)
let isReady: boolean = true;

// Приклад функції з явно вказаними типами аргументів та повернення
function greetUser(name: string, projects: number): string {
    return `Привіт, ${name}! Ти вже завершив ${projects} практичну роботу.`;
}

console.log(greetUser(userName, projectCount));
console.log(`Статус готовності: ${isReady}`);

// Приклад використання типів у блоці
if (isReady && piValue > 3) {
    console.log("Всі умови виконано.");
}