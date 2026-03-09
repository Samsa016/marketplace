import { Product } from "@/entities/product/models/type";
import { create, StateCreator } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware";

export interface FavoriteCreate {

    items: Product[];
    isLoading: boolean;

    addToFavorite: (product: Product) => void;
    removeItemFavorite: (productId: number) => void;
    setServerFavorite: (products: Product[]) => void;

}

const createFavoriteLogic: StateCreator<FavoriteCreate> = (set) => ({
    items: [],
    isLoading: false,

    addToFavorite: (product) => {
        set((state) => {
            const ofExist = state.items.some((item) => item.id == product.id)

            if (ofExist) return state

            return { items: [...state.items, product] }
        })
    },

    removeItemFavorite: (productId) => {
        set((state) => {
            return {items: state.items.filter((item) => item.id !== productId)}
        })
    },

    setServerFavorite: (products) => {
        set({items: products})
    }

}) 

export const useCreateFavorite = create<FavoriteCreate>()(
    persist(
        createFavoriteLogic,
        {
            name: "favorite-storage",
            storage: (createJSONStorage(() => localStorage)),
            partialize: (state) => ({ items: state.items })
        }
    )
)