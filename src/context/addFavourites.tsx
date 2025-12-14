import { Product } from "../types/product";



export const getFavourites = (): Product[] => {
    try {
        const updateFavourites = localStorage.getItem("favourites") ?? "[]"
        return JSON.parse(updateFavourites) as Product[];
    } catch (error) {
        console.error("Ошибка загрузки избраного", error)
        return [];
    }
}

export const getHistory = (): Product[] => {
    try {
        const updatehistory = localStorage.getItem("history") ?? '[]'
        return JSON.parse(updatehistory) as Product[];
    } catch (error) {
        console.error("Ошибка загрузки истории просмотренных товаров", error)
        return [];
    }
}