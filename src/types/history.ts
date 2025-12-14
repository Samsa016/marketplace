import { Product } from "./product";

export interface HistoryContextType {
    historyMassive: Product[];
    addHistory: (product: Product) => void;
} 