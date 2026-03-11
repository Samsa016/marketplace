"use client";

import { useCreateFavorite } from "@/entities/favorite/model/favorite.store";

interface RemoveFavoriteButtonProps {
    productId: number;
}

export const RemoveFavoriteButton = ({ productId }: RemoveFavoriteButtonProps) => {
    const removeItemFavorite = useCreateFavorite((state) => state.removeItemFavorite);

    return (
        <button 
            onClick={() => removeItemFavorite(productId)}
            style={{
                padding: '10px 16px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
        >
            ❌ Удалить из избранного
        </button>
    );
};