"use client";

import { useFilterStore } from "@/entities/filter-product/model/filter.store";

export const FilterBar = () => {
    const { sortOrder, minPrice, maxPrice, tag, setSortOrder, setPriceRange, setTag } = useFilterStore();

    const fieldStyle = {
        padding: '8px 12px',
        borderRadius: '8px',
        backgroundColor: '#374151',
        color: '#ffffff',
        border: '1px solid #4b5563',
        outline: 'none',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'border-color 0.2s'
    };

    return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
                style={fieldStyle}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#4b5563'}
            >
                <option value="">Сортировка</option>
                <option value="asc">Сначала дешевле</option>
                <option value="desc">Сначала дороже</option>
            </select>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                    type="number" 
                    placeholder="От $" 
                    value={minPrice} 
                    onChange={(e) => setPriceRange(e.target.value, maxPrice)}
                    style={{ ...fieldStyle, width: '80px', cursor: 'text' }} 
                />
                <span style={{ color: '#9ca3af', fontWeight: 'bold' }}>—</span>
                <input 
                    type="number" 
                    placeholder="До $" 
                    value={maxPrice} 
                    onChange={(e) => setPriceRange(minPrice, e.target.value)}
                    style={{ ...fieldStyle, width: '80px', cursor: 'text' }} 
                />
            </div>

            <select 
                value={tag} 
                onChange={(e) => setTag(e.target.value)}
                style={fieldStyle}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#4b5563'}
            >
                <option value="">Все категории</option>
                <option value="beauty">Красота</option>
                <option value="fragrances">Духи</option>
                <option value="furniture">Мебель</option>
                <option value="groceries">Продукты</option>
            </select>
        </div>
    );
};