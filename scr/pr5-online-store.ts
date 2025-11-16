// Практична робота №5: Розробка базових компонентів інтернет-магазину з використанням Generic типів у TypeScript 

// КРОК 1: Створення типів товарів

/**
 * @type {BaseProduct} Базовий тип для будь-якого товару в магазині.
 */
type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description: string;
    inStock: boolean;
};

/**
 * @type {Electronics} Тип для товарів категорії "Електроніка".
 */
type Electronics = BaseProduct & {
    category: 'electronics';
    brand: string;
    warrantyMonths: number;
};

/**
 * @type {Clothing} Тип для товарів категорії "Одяг".
 */
type Clothing = BaseProduct & {
    category: 'clothing';
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    color: string;
    material: string;
};

// КРОК 2: Створення функцій для пошуку товарів (Generic)

/**
 * Шукає товар у масиві за його унікальним ідентифікатором (id).
 *
 * @template T Тип товару, який обов'язково розширює BaseProduct.
 * @param {T[]} products Масив товарів для пошуку.
 * @param {number} id Ідентифікатор товару, який потрібно знайти.
 * @returns {T | undefined} Знайдений товар або undefined, якщо товар не знайдено.
 */
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    // Перевірка на коректність id
    if (id <= 0) {
        console.warn("ID товару має бути позитивним.");
        return undefined;
    }
    return products.find(product => product.id === id);
};

/**
 * Фільтрує масив товарів, залишаючи лише ті, ціна яких не перевищує вказану максимальну ціну.
 *
 * @template T Тип товару, який обов'язково розширює BaseProduct.
 * @param {T[]} products Масив товарів для фільтрації.
 * @param {number} maxPrice Максимальна допустима ціна.
 * @returns {T[]} Масив товарів, ціна яких менше або дорівнює maxPrice.
 */
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    // Перевірка на коректність вхідних даних
    if (maxPrice < 0) {
        console.error("Максимальна ціна не може бути від'ємною.");
        return [];
    }
    // Використання .filter()
    return products.filter(product => product.price <= maxPrice);
};

// КРОК 3: Створення кошика

/**
 * @template T Тип товару, який міститься в елементі кошика.
 * @type {CartItem<T>} Тип для одного елемента в кошику.
 */
type CartItem<T extends BaseProduct> = {
    product: T;
    quantity: number;
};

/**
 * Додає або оновлює кількість товару в кошику.
 *
 * @template T Тип товару, який обов'язково розширює BaseProduct.
 * @param {CartItem<T>[]} cart Поточний масив елементів кошика.
 * @param {T} product Товар, який потрібно додати.
 * @param {number} quantity Кількість товару для додавання.
 * @returns {CartItem<T>[]} Оновлений масив елементів кошика.
 */
const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    // 1. Перевірка на коректність кількості
    if (quantity <= 0) {
        console.error(`Помилка: Кількість товару "${product.name}" повинна бути позитивним числом. (Отримано: ${quantity})`);
        return cart;
    }

    // 2. Пошук існуючого елемента
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
        // Оновлення існуючого елемента
        // Створюємо копію масиву (щоб не мутувати оригінал)
        const updatedCart = [...cart];
        
        // Перевіряємо, що елемент існує (хоча індекс був знайдений)
        const itemToUpdate = updatedCart[existingItemIndex];

        if (itemToUpdate) {
            // Оновлюємо quantity в елементі за індексом
            itemToUpdate.quantity += quantity;
        } 
        
        return updatedCart;
    } else {
        // Додавання нового елемента
        return [...cart, { product, quantity }];
    }
};

/**
 * Підраховує загальну вартість всіх товарів у кошику.
 *
 * @template T Тип товару, який обов'язково розширює BaseProduct.
 * @param {CartItem<T>[]} cart Масив елементів кошика.
 * @returns {number} Загальна вартість кошика.
 */
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    // Використання .reduce()
    return cart.reduce((total, item) => {
        // Враховуємо тільки товари, які в наявності (inStock: true)
        if (item.product.inStock) {
            return total + (item.product.price * item.quantity);
        }
        return total;
    }, 0);
};

// КРОК 4: Використання функцій

// Створення тестових даних (Electronics)
const electronicsProducts: Electronics[] = [
    {
        id: 101,
        name: "Смартфон 'Alpha'",
        price: 15000,
        description: "Флагманський смартфон.",
        inStock: true,
        category: 'electronics',
        brand: 'TechCorp',
        warrantyMonths: 24,
    },
    {
        id: 102,
        name: "Ноутбук 'Gamer X'",
        price: 35000,
        description: "Потужний ігровий ноутбук.",
        inStock: true,
        category: 'electronics',
        brand: 'GameStar',
        warrantyMonths: 12,
    },
    {
        id: 103,
        name: "Кабель HDMI",
        price: 350,
        description: "Високошвидкісний кабель.",
        inStock: true,
        category: 'electronics',
        brand: 'ConnectPro',
        warrantyMonths: 6,
    },
];

// Створення тестових даних (Clothing)
const clothingProducts: Clothing[] = [
    {
        id: 201,
        name: "Футболка 'Casual'",
        price: 800,
        description: "Базова бавовняна футболка.",
        inStock: true,
        category: 'clothing',
        size: 'L',
        color: 'Синій',
        material: 'Бавовна',
    },
    {
        id: 202,
        name: "Джинси 'Slim'",
        price: 2500,
        description: "Модель джинсів вузького крою.",
        inStock: false, // Не в наявності - не має бути враховано в сумі
        category: 'clothing',
        size: 'M',
        color: 'Чорний',
        material: 'Денім',
    },
];

console.log(" ТЕСТУВАННЯ GENERIC ФУНКЦІЙ");

// ТЕСТ 1: Електроніка
console.log("\n ТЕСТ 1: Електроніка (Electronics)");
const phone = findProduct(electronicsProducts, 101);
// Тип phone автоматично виводиться як Electronics
console.log(`1. Знайдений товар (101): ${phone ? phone.name : 'Не знайдено'}`); 

// Фільтрація: повертає масив Electronics[]
const cheapElectronics = filterByPrice(electronicsProducts, 1000);
console.log(`2. Товари до 1000 грн: ${cheapElectronics.map(p => p.name).join(', ')}`);

// ТЕСТ 2: Кошик та Сума (Electronics)
console.log("\n ТЕСТ 2: Кошик та Сума (Electronics)");

let cartElectronics: CartItem<Electronics>[] = [];

// Перевірка на undefined перед додаванням (для findProduct)
if (phone) { 
    cartElectronics = addToCart(cartElectronics, phone, 1);
    console.log("   -> Додано 1 Смартфон.");
}

const cable = findProduct(electronicsProducts, 103);
if (cable) {
    cartElectronics = addToCart(cartElectronics, cable, 2);
    console.log("   -> Додано 2 Кабелі.");
}

const totalElectronics = calculateTotal(cartElectronics);
// Очікуваний результат: 1 * 15000 + 2 * 350 = 15700
console.log(`3. ЗАГАЛЬНА ВАРТІСТЬ (Electronics): ${totalElectronics} грн.`);


// ТЕСТ 3: Одяг (Clothing)
console.log("\n ТЕСТ 3: Одяг (Clothing)");
const tShirt = findProduct(clothingProducts, 201);
const jeans = findProduct(clothingProducts, 202);

let cartClothing: CartItem<Clothing>[] = [];

if (tShirt) {
    cartClothing = addToCart(cartClothing, tShirt, 3); // 3 * 800 = 2400
}
if (jeans) {
    // Джинси не в наявності (inStock: false)
    cartClothing = addToCart(cartClothing, jeans, 1); 
}

const totalClothing = calculateTotal(cartClothing);
// Очікуваний результат: 2400 (футболки) + 0 (джинси, бо inStock: false) = 2400
console.log(`1. Джинси в наявності: ${jeans?.inStock}`);
console.log(`2. ЗАГАЛЬНА ВАРТІСТЬ (Clothing): ${totalClothing} грн.`);
