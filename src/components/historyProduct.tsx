import { getHistory } from "../context/addFavourites";
import { useState, useEffect, ReactNode } from 'react'
import { createContext } from "react";
import { Product } from "../types/product";
import { HistoryContextType } from "../types/history";


export const HistoryMassive = createContext<HistoryContextType | null>(null);

interface HistoryProviderProps {
    children: ReactNode;
}

export function HistoryProduct({ children }: HistoryProviderProps): JSX.Element {
    const [historyMassive, setHistoryMassive] = useState<Product[]>([]);

    useEffect(() => {
        try {
            const hist = getHistory();
            if (Array.isArray(hist)) {
                setHistoryMassive(hist as Product[]);
            } else {
                console.error("Неверный формат данных для истории");
                setHistoryMassive([]);
            }
        } catch (error) {
            console.error('Ошибка при загрузке истории:', error);
        }
    }, [])

    const addHistory = (product: Product) => {
        if (historyMassive.length > 0) {
            const update = [product, ...historyMassive.slice(1)];
            setHistoryMassive(update)
        } else {
            const update = [product, ...historyMassive];
            setHistoryMassive(update)
        }

        try {
            localStorage.setItem("history", JSON.stringify(historyMassive))
        } catch (error) {
            console.error("Ошибка при сохранении истории:", error);
        }
    }

    const value: HistoryContextType = {
        historyMassive,
        addHistory
    }

    return (
        <HistoryMassive.Provider value={value}>
            {children}
        </HistoryMassive.Provider>
    )
}