import { Product } from "./product";

export interface BasketContextType {
    basket: Product[];
    addToBasket: (prodduct: Product) => void;
    deleteFromBasket: (productId: number) => void;
    clearBasket: () => void 
}