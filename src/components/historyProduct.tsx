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
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const localstorage_history = localStorage.getItem('history');
        const mounted = true

        if (token) {
            fetch("http://localhost:8000/history", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    return [];
                }
                if (res.ok) return res.json();
                throw new Error('Ошибка...');
            })
            .then(serverHistory => {
                if (mounted) {
                    setHistoryMassive(serverHistory);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                if (mounted) setLoading(false);
            });
        } else {
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
            } finally { 
                if(mounted) setLoading(false)
            }
        }
        

    }, [])

    const addHistory = (product: Product) => {
        const token = localStorage.getItem('token');
        const localstorage_history = localStorage.getItem('history');
        const filtered = historyMassive.filter(item => item.id !== product.id);
        const newHistory = [product, ...filtered].slice(0,20);
        setHistoryMassive(newHistory)
        if (token) {
        fetch("http://localhost:8000/history/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ product_id: product.id })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ошибка при добавлении в историю');
            }
        })
        .then(data => {
            console.log("История успешно обновлена на сервере");
            setLoading(false)
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
        } else {
        


        try {
            localStorage.setItem("history", JSON.stringify(newHistory))
        } catch (error) {
            console.error("Ошибка при сохранении истории:", error);
        }

    }
    }

    const value: HistoryContextType = {
        historyMassive,
        addHistory,
        loading
    }

    return (
        <HistoryMassive.Provider value={value}>
            {children}
        </HistoryMassive.Provider>
    )
}