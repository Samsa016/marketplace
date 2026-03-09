"use client";

import { Product } from "@/entities/product/models/type";
import { useCreateBasket } from "@/entities/basket/models/basket.store";

interface AddToBasketButtonProps {
    product: Product
}

export const AddBasketButton = ({ product }: AddToBasketButtonProps) => {
    
    const items = useCreateBasket((state) => state.items)
    const addToBasket = useCreateBasket((state) => state.addToBasket)

    const isAlreadyInBasket = items.some((item) => item.id == product.id)

    const handleClick = () => {
        if (!isAlreadyInBasket) {
            addToBasket(product)
        }
    }
    
    return (
        <button 
            onClick={handleClick}
            disabled={isAlreadyInBasket}
            style={{
                padding: '10px 16px',
                backgroundColor: isAlreadyInBasket ? '#10b981' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isAlreadyInBasket ? 'default' : 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
            }}
        >
            {isAlreadyInBasket ? '✓ В корзине' : '🛒 Добавить в корзину'}
        </button>
    );
};