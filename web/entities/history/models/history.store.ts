import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/entities/product/models/type";

interface CreateHistoryProps {

    items: Product[];
    isLoading: boolean;
    addToHistory: (product: Product) => void

}

const CreateHistoryLogic: StateCreator<CreateHistoryProps> = (set) => ({
    items: [],
    isLoading: false,

    addToHistory: (product) => {
        set((state) => {

                const filteredItems = state.items.filter((item) => item.id !== product.id).slice(0,19)
                return { items: [product, ...filteredItems] }
            })
        }
    })

export const useCreateHistory = create<CreateHistoryProps>()(
    persist(
        CreateHistoryLogic,
        {
            name: "history-storage",
            storage: (createJSONStorage(() => localStorage)),
            partialize: (state) => ({ items: state.items })
        }
    )
)