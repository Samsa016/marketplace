"use client";

import { Product } from "@/entities/product/models/type";
import { useCreateFavorite } from "@/entities/favorite/model/favorite.store";

interface AddToFavoriteButtonProps {
    product: Product
}

export const AddFavoriteButton = ({ product }: AddToFavoriteButtonProps ) => {

    const items = useCreateFavorite((state) => state.items)
    const addToFavorite = useCreateFavorite((state) => state.addToFavorite)

    const isAlreadyInFavorite = items.some((item) => item.id === product.id)

    const handleClick = () => {
        if (!isAlreadyInFavorite) {
            addToFavorite(product)
        }
    }

    return (
        <button 
            onClick={handleClick}
            disabled={isAlreadyInFavorite}
            style={{
                padding: '10px 16px',
                backgroundColor: isAlreadyInFavorite ? '#fce4ec' : '#f3f4f6', 
                color: isAlreadyInFavorite ? '#e11d48' : '#4b5563',
                border: isAlreadyInFavorite ? '1px solid #fda4af' : '1px solid transparent',
                borderRadius: '8px',
                cursor: isAlreadyInFavorite ? 'default' : 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
        >
            {isAlreadyInFavorite ? '❤️ В избранном' : '🤍 В избранное'}
        </button>
    );
}