"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/entities/product/api/products";
import { Product } from "@/entities/product/models/type";
import { useCreateHistory } from "@/entities/history/models/history.store";
import { AddBasketButton } from "@/features/add-to-basket/ui/AddToBasketButton";
import { AddFavoriteButton } from "@/features/add-to-favorite/ui/AddToFavoriteButton";

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const addToHistory = useCreateHistory((state) => state.addToHistory);

    useEffect(() => {
        if (id) {
            getProductById(Number(id)).then((data) => {
                setProduct(data);
                addToHistory(data);
            });
        }
    }, [id, addToHistory]);

    if (!product) return <div style={{ padding: '40px' }}>Загрузка товара...</div>;

    return (
        <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '60px', alignItems: 'start' }}>
                <div style={{ position: 'relative', flex: '0 0 500px', height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
                    <Image 
                        src={product.images?.[0] || 'https://via.placeholder.com/500'} 
                        alt={product.title} 
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#111827' }}>{product.title}</h1>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981' }}>${product.price}</div>
                    
                    <p style={{ color: '#4b5563', fontSize: '18px', lineHeight: '1.6' }}>{product.description}</p>
                    
                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                        <div style={{ width: '220px' }}>
                            <AddBasketButton product={product} />
                        </div>
                        <div style={{ width: '220px' }}>
                            <AddFavoriteButton product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}