import { Product } from "../types/product";



export function CatalogApi(): () => Promise<Product[]>  {
    const fetchResponse = async (): Promise<Product[]> => {
        try {

            const response = await fetch("https://dummyjson.com/products")
            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

            const data = await response.json();
            if (!data) throw new Error(`Данные не получены`);

            return data.products;

        } catch (error) {
            if (error instanceof Error) {
                console.error(`Ошибка при получении данных: ${error.message}`);
            } else {
                console.error(`Неизвестная ошибка ${String(error)}`);
            }
            return [];
        } 
    } 
    return fetchResponse

}
