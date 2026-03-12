"use client";

import { useFilterStore } from "@/entities/filter-product/model/filter.store";
import { Product } from "@/entities/product/models/type";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";

interface FilteredProductListProps {
    initialProducts: Product[];
}

export const FilteredProductList = ({ initialProducts }: FilteredProductListProps) => {
    const { sortOrder, minPrice, maxPrice, tag } = useFilterStore();

    let displayProducts = [...initialProducts];

    if (tag) {
        displayProducts = displayProducts.filter(p => p.category === tag);
    }

    if (minPrice) {
        displayProducts = displayProducts.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
        displayProducts = displayProducts.filter(p => p.price <= Number(maxPrice));
    }

    if (sortOrder === "asc") {
        displayProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
        displayProducts.sort((a, b) => b.price - a.price);
    }

    return (
        <div>
            {displayProducts.length === 0 && (
                <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '20px', color: '#6b7280' }}>
                    По вашим фильтрам ничего не найдено 😔
                </div>
            )}

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '24px',
                marginBottom: '60px' 
            }}>
                {displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};