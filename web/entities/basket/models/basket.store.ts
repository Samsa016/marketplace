import { create, StateCreator } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { Product } from "@/entities/product/models/type"

export interface BasketCreate {
    
    items: Product[];
    isLoading: boolean;

    totalSum: number;
    totalCount: number;

    addToBasket: (product: Product) => void;
    removeItemBasket: (productId: number) => void;
    clearBasket: () => void;
    setServerBasket: (products: Product[]) => void;

}

const basketStoreLogic: StateCreator<BasketCreate> = (set, get) => ({
    items: [],
    isLoading: false,

    get totalSum() {
        return get().items.reduce((sum, item) => sum + (item.price || 0), 0)
    },

    get totalCount() {
        return get().items.length
    },

    addToBasket: (product) => {
        set((state) => {
            const ofExist = state.items.some((item) => item.id === product.id)
            if (ofExist) return state

            return {items: [...state.items, product]}
        
        })
    },

    removeItemBasket: (productId) => {
        set((state) => {
            return { items: state.items.filter((item) => item.id !== productId) }
        })
    },

    clearBasket: () => {
        set({items: []})
    },

    setServerBasket: (products) => {
        set({items: products})
    },
})

export const useCreateBasket = create<BasketCreate>()(
    persist(
        basketStoreLogic,
        {
            name: "basket-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state: BasketCreate) => ({ items: state.items })
        }
    )
)
