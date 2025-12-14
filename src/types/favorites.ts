import { Product } from "./product";

export interface FavorContextType {
    favourites: Product[];
    addFavourites: (product: Product) => void;
    deleteFavorites: (productId: number) => void;
}