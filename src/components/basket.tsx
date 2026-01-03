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
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const token = localStorage.getItem('token');
        const mounted = true

        if (token) {
            fetch("http://localhost:8000/basket", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Ошибка при загрузке корзины с сервера');
            })
            .then(serverBasket => {
                setBasket(serverBasket);
                console.log("Корзина загружена с сервера");
                if (mounted) setLoading(false)
            })
            .catch(error => {
                console.error('Ошибка:', error);
                if (mounted) setBasket([])
            })
            

        } else {
            try {
                const loadedBasket = getBasket();
                if (!mounted) return;
                if (Array.isArray(loadedBasket)) {
                    setBasket(loadedBasket as Product[])
                } else {
                    setBasket([]);
                    setLoading(false)
                }
            } catch (error) {
                console.error('Ошибка при загрузке корзины:', error);
                if (mounted) setBasket([]);
            } finally {
                if (mounted) setLoading(false)
            }
        }


    }, [])

    const addToBasket = (product: Product): void => {

        if (basket.some(p => p.id === product.id)) return;

        const updateBasket = [...basket, { ...product, quantity: 1 }];
        setBasket(updateBasket);

        const token = localStorage.getItem('token');

        if (token) {

            console.log("Отправляем на сервер ID:", Number(product.id)); // Лог для проверки

            fetch("http://localhost:8000/basket/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({ 
                    product_id: Number(product.id), 
                    quantity: 1 
                })
            })
            .then(async response => {
                if (!response.ok) {

                    const errData = await response.json();
                    console.error("Детали ошибки сервера:", errData);
                    throw new Error('Ошибка на сервере');
                }
                console.log("Товар успешно сохранен в БД");
            })
            .catch(error => console.error(error));
        } else {

            try {
                localStorage.setItem('basket', JSON.stringify(updateBasket));
            } catch (error) {
                console.log('Ошибка при сохранении в localStorage:', error);
            }
        }
    }

const deleteFromBasket = (deleteToIndex: number): void => {

        const productToDelete = basket[deleteToIndex];
        
        const updateBasket = basket.filter((_,index) => index !== deleteToIndex)
        setBasket(updateBasket);

        const token = localStorage.getItem('token');


        if (token && productToDelete) {
            fetch("http://localhost:8000/basket/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({ product_id: productToDelete.id, quantity: 1 })
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка на сервере');
                console.log("Товар удален из БД");
            })
            .catch(error => console.error(error));
        } else {

            try {
                localStorage.setItem('basket', JSON.stringify(updateBasket));
            } catch (error) {
                console.log('Ошибка при сохранении корзины:', error);
            }
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
        clearBasket,
        loading
    }

    return (
        <MassiveBasket.Provider value={value}>
            {children}
        </MassiveBasket.Provider>
    );
}