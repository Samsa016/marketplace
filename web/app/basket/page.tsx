"use client";

import Link from "next/link";
import { useCreateBasket } from "@/entities/basket/models/basket.store";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";
import { RemoveBasketButton } from "@/features/remove-from-basket/ui/RemoveBasketButton";

export default function BasketPage() {
    const basketItems = useCreateBasket((state) => state.items);
    const totalSum = useCreateBasket((state) => state.totalSum);
    const clearBasket = useCreateBasket((state) => state.clearBasket);

    if (basketItems.length === 0) {
        return (
            <main style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Корзина пуста 🛒</h2>
                <Link href="/" style={{ 
                    display: 'inline-block', padding: '12px 24px', backgroundColor: '#3b82f6', 
                    color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold'
                }}>
                    За покупками
                </Link>
            </main>
        );
    }

    return (
        <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', margin: 0 }}>Моя корзина</h1>
                
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                        Итого: ${totalSum.toFixed(2)}
                    </div>
                    <button 
                        onClick={clearBasket} 
                        style={{ 
                            padding: '8px 16px', cursor: 'pointer', backgroundColor: '#f3f4f6', 
                            border: '1px solid #d1d5db', borderRadius: '6px', color: '#4b5563', fontWeight: 'bold'
                        }}
                    >
                        Очистить корзину
                    </button>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {basketItems.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        actionSlot={<RemoveBasketButton product={product} />} 
                    />
                ))}
            </div>
        </main>
    );
}