import { getBasket } from "../context/addBasket";
import { useState, useEffect, ReactNode } from "react";
import { createContext } from "react";
import { BasketContextType } from "../types/basket";
import { Product } from "../types/product"; 

export const MassiveBasket = createContext<BasketContextType | null>(null);

interface ContextBasketProps {
    children: ReactNode;
}

export function ContextBasket({ children }: ContextBasketProps): JSX.Element {
    const [basket, setBasket] = useState<Product[]>([]);

    useEffect(() => {
        try {
            const loadedBasket = getBasket();
            if (Array.isArray(loadedBasket)) {
                setBasket(loadedBasket as Product[])
            } else {
                setBasket([]);
            }
        } catch (error) {
            console.error('Ошибка при загрузке корзины:', error);
            setBasket([]);
        }

    }, [])

    const addToBasket = (product: Product): void => {
        if (basket.some(p => p.id === product.id)) return;
        const updateBasket = [...basket, product]
        setBasket(updateBasket);
        try {
            localStorage.setItem('basket', JSON.stringify(updateBasket));
        } catch (error) {
            console.log('Ошибка при сохранении корзины:', error);
        }
    }

    const deleteFromBasket = (deleteToIndex: number): void => {
        const updateBasket = basket.filter((_,index) => index !== deleteToIndex)
        setBasket(updateBasket);
        try {
            localStorage.setItem('basket', JSON.stringify(updateBasket));
        } catch (error) {
            console.log('Ошибка при сохранении корзины:', error);
        }
    }

    const clearBasket = (): void => {
        setBasket([]);
        try {
            localStorage.removeItem('basket');
        } catch (error) {
            console.error('Ошибка при очистке корзины:', error);
        }
    }

    const value: BasketContextType = {
        basket,
        addToBasket,
        deleteFromBasket,
        clearBasket
    }

    return (
        <MassiveBasket.Provider value={value}>
            {children}
        </MassiveBasket.Provider>
    );
}