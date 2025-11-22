export const getFavourites = () => {
    try {
        const updateFavourites = localStorage.getItem("favourites") || "[]"
        return JSON.parse(updateFavourites)
    } catch (error) {
        console.log("Ошибка загрузки корзины", error)
    }
}