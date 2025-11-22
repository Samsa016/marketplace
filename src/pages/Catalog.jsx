

export function CatalogApi() {
    const fetchResponse = async () => {
        try {

            const response = await fetch("https://dummyjson.com/products")
            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

            const data = await response.json();
            if (!data) throw new Error(`Данные не получены`);

            return data.products;

        } catch (error) {
            console.error(`Ошибка при получении данных: ${error.message}`);
            throw error;
        } 
    } 
    return fetchResponse

}