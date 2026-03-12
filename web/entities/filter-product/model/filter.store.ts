import { create } from "zustand"

interface FilterState {
    sortOrder: "asc" | "desc" | "";
    minPrice: string;
    maxPrice: string;
    tag: string;
    setSortOrder: (order: "asc" | "desc" | "") => void;
    setPriceRange: (minPrice: string, maxPrice: string) => void;
    setTag: (tag: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    sortOrder: "",
    minPrice: "",
    maxPrice: "",
    tag: "",
    setSortOrder: (order) => set({ sortOrder: order }),
    setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
    setTag: (tag) => set({ tag })
}));