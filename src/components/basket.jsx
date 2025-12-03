import { getBasket } from "../context/addBasket";
import { useState, useEffect } from "react";
import { createContext } from "react";

export const MassiveBasket = createContext();

export function ContextBasket({ children }) {
    const [basket, setBasket] = useState([])


    useEffect(() => {
        const loadedBasket = getBasket();
        setBasket(loadedBasket);

    }, [])

    const addToBasket = (product) => {
        const updatedBasket = [...basket, product];
        setBasket(updatedBasket);
        localStorage.setItem("basket", JSON.stringify(updatedBasket));
    }

    const deleteFromBasket = (deleteToIndex) => {
        const updateBasket = basket.filter((_, index) => index !== deleteToIndex);
        setBasket(updateBasket);
        localStorage.setItem("basket", JSON.stringify(updateBasket))
    }

    const clearBasket = () => {
        setBasket([]);
        localStorage.setItem("basket", JSON.stringify([]));
    }

    
    return (
        <MassiveBasket.Provider value={{ basket, addToBasket, deleteFromBasket, clearBasket }}>
            {children}
        </MassiveBasket.Provider>
    )
}
