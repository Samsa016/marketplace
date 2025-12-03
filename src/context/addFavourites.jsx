export const getFavourites = () => {
    try {
        const updateFavourites = localStorage.getItem("favourites") || "[]"
        return JSON.parse(updateFavourites)
    } catch (error) {
        console.log("Ошибка загрузки корзины", error)
    }
}

export const getHistory = () => {
    try {
        const updatehistory = localStorage.getItem("history") || '[]'
        return JSON.parse(updatehistory)
    } catch (error) {
        console.log("Ошибка загрузки истории просмотренных товаров", error)
    }
}