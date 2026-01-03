import { getFavourites } from "../context/addFavourites";
import { createContext } from "react";
import { useState, useEffect, ReactNode } from "react"
import { FavorContextType } from "../types/favorites";
import { Product } from "../types/product";


export const FavouritesMassive = createContext<FavorContextType | null>(null);

interface FavouritesProviderProps {
    children: ReactNode
}

export function FavouritesProvider({ children }: FavouritesProviderProps): JSX.Element{
    const [ favourites, setFavourites ] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true)

useEffect(() => {
        const token = localStorage.getItem('token');
        let mounted = true;

        if (token) {
            fetch("http://localhost:8000/favorites", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    return [];
                }
                
                if (res.ok) return res.json();
                throw new Error('Ошибка при загрузке избранного с сервера');
            })
            .then(serverBasket => {
                if (mounted) {
                    setFavourites(serverBasket);
                    console.log("Избранное загружено с сервера");
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                if (mounted) {
                    setFavourites([]);
                    setLoading(false);
                }
            })

        } else {

            try {
                const up = localStorage.getItem('favourites'); 
                if (up) {
                    const parsed = JSON.parse(up);
                    if (Array.isArray(parsed)) {
                        setFavourites(parsed as Product[])
                    } else {
                        setFavourites([]);
                    }
                }
            } catch (error) {
                console.error('Ошибка при загрузке избранного:', error)
                setFavourites([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        
        return () => { mounted = false; };
    }, [])

        const addFavourites = (product: Product): void => {
            if (favourites.some(p => p.id === product.id)) return;

            const update = [...favourites, {...product}];
            setFavourites(update);            
            
            const token = localStorage.getItem('token');

            if (token) {
                fetch("http://localhost:8000/favorites/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({ product_id: Number(product.id) })
                })
                .then(async response => {
                    if (!response.ok) {

                        const errData = await response.json();
                        console.error("Детали ошибки сервера:", errData);
                        throw new Error('Ошибка на сервере');
                    }
                    console.log("Товар успешно сохранен в БД");
                })
                .catch (error => {
                    console.error('Ошибка:', error);
                })
                
            }

            
            try {
                localStorage.setItem("favourites", JSON.stringify(update));
            } catch (error) {
                console.error("Ошибка при сохранении избранного:", error);
            }
        }

        const deleteFavorites = (deleteIndex: number): void => {
            const token = localStorage.getItem('token');

            const favoriteToDelete = favourites[deleteIndex];

            const updateDel = favourites.filter((_, index) => index !== deleteIndex)
            setFavourites(updateDel)

            if (token && favoriteToDelete) {

                fetch("http://localhost:8000/favorites/remove", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({ product_id: Number(favoriteToDelete.id) })
                })
                .then(async response => {
                    if (!response.ok) {
                        const errData = await response.json();
                        console.error("Детали ошибки сервера:", errData);
                        throw new Error('Ошибка на сервере');
                    }
                    console.log("Товар успешно удалён из БД");
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                })
            } else {
                try {
                    localStorage.setItem("favourites", JSON.stringify(updateDel))
                } catch (error) {
                    console.error("Ошибка при сохранении избранного:", error);
                }
            }
            
        }

        const value: FavorContextType = {
            favourites,
            addFavourites,
            deleteFavorites,
            loading
        } 

        return (
            <FavouritesMassive.Provider value={value}>
                {children}
            </FavouritesMassive.Provider>
        )
    }