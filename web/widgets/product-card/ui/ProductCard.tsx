import { Product } from "@/entities/product/models/type";
import { AddBasketButton } from "@/features/add-to-basket/ui/AddToBasketButton";
import { AddFavoriteButton } from "@/features/add-to-favorite/ui/AddToFavoriteButton";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
    actionSlot?: React.ReactNode;
}

export const ProductCard = ({ product, actionSlot }: ProductCardProps) => {
    
    return (
        <article style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '16px',
            gap: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            height: '100%'
        }}>
            <Link 
                href={`/product/${product.id}`}
                style={{ 
                    textDecoration: 'none', 
                    color: 'inherit', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    flexGrow: 1
                }}
            >
                <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
                    <Image 
                        src={product.images?.[0] || 'https://via.placeholder.com/200'} 
                        alt={product.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>
                        {product.title}
                    </h3>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                        ${product.price}
                    </span>
                    {product.brand && (
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            Бренд: {product.brand}
                        </span>
                    )}
                </div>
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                {actionSlot !== undefined ? (
                    actionSlot
                ) : (
                    <>
                        <AddBasketButton product={product} />
                        <AddFavoriteButton product={product} />
                    </>
                )}
            </div>
        </article>
    );
};