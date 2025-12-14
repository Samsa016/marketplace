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

        useEffect(() => {
            try {
                const up = getFavourites();
                if (Array.isArray(up)) {
                    setFavourites(up as Product[])
                } else {
                    console.error("Неверный формат данных для избранного");
                    setFavourites([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке избранного:', error)
            } finally {
                console.log("Загрузка избранного завершена")
            }
        }, [])

        const addFavourites = (product: Product): void => {
            if (favourites.some(p => p.id === product.id)) return;
            
            const update = [...favourites, product]
            
            setFavourites(update);
            
            try {
                localStorage.setItem("favourites", JSON.stringify(update));
            } catch (error) {
                console.error("Ошибка при сохранении избранного:", error);
            }
        }

        const deleteFavorites = (deleteIndex: number): void => {
            const updateDel = favourites.filter((_, index) => index !== deleteIndex)
            setFavourites(updateDel)

            try {
                localStorage.setItem("favourites", JSON.stringify(updateDel))
            } catch (error) {
                console.error("Ошибка при сохранении избранного:", error);
            }
            
        }

        const value: FavorContextType = {
            favourites,
            addFavourites,
            deleteFavorites
        } 

        return (
            <FavouritesMassive.Provider value={value}>
                {children}
            </FavouritesMassive.Provider>
        )
    }