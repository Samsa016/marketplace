"use client";

import Link from "next/link";
import { useCreateFavorite } from "@/entities/favorite/model/favorite.store";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";
import { RemoveFavoriteButton } from "@/features/remove-from-favorite/ui/RemoveFavoriteButton";

export default function FavoritesPage() {
    const favoriteItems = useCreateFavorite((state) => state.items);

    if (favoriteItems.length === 0) {
        return (
            <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <h2>Пусто</h2>
                <Link href="/">Вернуться к покупкам</Link>
            </main>
        );
    }

    return (
        <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Мое избранное</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {favoriteItems.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        actionSlot={<RemoveFavoriteButton productId={product.id} />} 
                    />
                ))}
            </div>
        </main>
    );
}