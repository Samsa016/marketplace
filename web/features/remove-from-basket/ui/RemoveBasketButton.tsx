"use client";

import { Product } from "@/entities/product/models/type";
import { useCreateBasket } from "@/entities/basket/models/basket.store";

interface RemoveBasketButtonProps {
    product: Product;
}

export const RemoveBasketButton = ({ product }: RemoveBasketButtonProps) => {
    const removeItemBasket = useCreateBasket((state) => state.removeItemBasket);

    return (
        <button 
            onClick={() => removeItemBasket(product.id)}
            style={{ 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                border: 'none', 
                padding: '10px 16px', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%',
                transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
        >
            🗑️ Удалить из корзины
        </button>
    );
};