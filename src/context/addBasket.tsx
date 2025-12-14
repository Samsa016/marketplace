import { Product } from "../types/product";

export const getBasket = (): Product[] => {
    try {
        const loadBacket = localStorage.getItem("basket") ?? "[]"
        return JSON.parse(loadBacket) as Product[];
    } catch (error) {
        console.error("Ошибка при получении корзины:", error);
        return [];
    }
}