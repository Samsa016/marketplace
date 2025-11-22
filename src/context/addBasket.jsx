

export const getBasket = () => {
    try {
        const loadBacket = localStorage.getItem("basket") || "[]"
        return JSON.parse(loadBacket)
    } catch (error) {
        console.error("Ошибка при получении корзины:", error);
        return [];
    }
}