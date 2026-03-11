"use client";

import { useCreateHistory } from "@/entities/history/models/history.store";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";

export const RecentlyViewed = () => {
    const items = useCreateHistory((state) => state.items);

    if (items.length === 0) return null;

    return (
        <section style={{ padding: '60px 0', borderTop: '1px solid #e5e7eb', marginTop: '80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>Вы недавно смотрели</h2>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '24px' 
            }}>
                {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};