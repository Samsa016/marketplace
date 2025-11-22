import { getFavourites } from "../context/addFavourites";
import { createContext } from "react";
import { useState, useEffect } from "react"

export const FavouritesMassive = createContext()

export function FavouritesProvider() {
    const [ favourites, setFavorites ] = useState([])
}