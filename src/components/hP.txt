import { getHistory } from "../context/addFavourites";
import { useState, useEffect } from 'react'
import { createContext } from "react";

export const HistoryMassive = createContext()

export function HistoryProduct({ children }) {
    const [ historyMassive, setHistoryMassive ] = useState([])
    

    useEffect(() => {

        const hist = getHistory()
        setHistoryMassive(hist)

    }, [])


    const addHistory = (product) => {


        if (historyMassive.length > 20) {
            const update = ([product, ...historyMassive.slice(1)])
            setHistoryMassive(update)
        } else {
            const update = ([product, ...historyMassive])
            setHistoryMassive(update)
        }

        localStorage.setItem("history", JSON.stringify(historyMassive))

    }

    return (

        <HistoryMassive.Provider value={{ historyMassive, addHistory }}>
            {children}
        </HistoryMassive.Provider>

    )

    
} 