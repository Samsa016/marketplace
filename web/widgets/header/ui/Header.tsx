"use client";

import Link from "next/link";
import { useCreateBasket } from "@/entities/basket/models/basket.store";
import { useCreateFavorite } from "@/entities/favorite/model/favorite.store";
import { useCreateHistory } from "@/entities/history/models/history.store";
import { FilterBar } from "@/features/filter-products/ui/FilterBar";

export const Header = () => {

    const basketCount = useCreateBasket((state) => state.totalCount);
    const favoriteCount = useCreateFavorite((state) => state.items.length);
    const historyCount = useCreateHistory((state) => state.items.length);

    return (
        <header style={{ 
            backgroundColor: '#111827', 
            color: 'white', 
            padding: '16px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    🛍️ Perfect Shop
                </h2>
            </Link>

            <FilterBar />

            <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                
                <Link href="/history" style={{ textDecoration: 'none', color: 'white', position: 'relative' }}>
                    <span style={{ fontSize: '18px' }}>🕒 История</span>
                    {historyCount > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-16px', backgroundColor: '#f59e0b', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>
                            {historyCount}
                        </span>
                    )}
                </Link>

                <Link href="/favourites" style={{ textDecoration: 'none', color: 'white', position: 'relative' }}>
                    <span style={{ fontSize: '18px' }}>❤️ Избранное</span>
                    {favoriteCount > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-16px', backgroundColor: '#e11d48', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>
                            {favoriteCount}
                        </span>
                    )}
                </Link>

                <Link href="/basket" style={{ textDecoration: 'none', color: 'white', position: 'relative' }}>
                    <span style={{ fontSize: '18px' }}>🛒 Корзина</span>
                    {basketCount > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-16px', backgroundColor: '#10b981', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>
                            {basketCount}
                        </span>
                    )}
                </Link>
                
            </nav>
        </header>
    );
};