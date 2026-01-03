import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CatalogApi } from '../pages/Catalog';
import { MassiveBasket } from '../components/basket';
import { FavouritesMassive } from '../components/favourites';
import { FaArrowLeft } from 'react-icons/fa';
import { Product, Review } from '../types/product'
import { SkeletonProductInfo } from "../components/SkeletonAdd"


export function ProductInfo(): JSX.Element {
    const { productId } = useParams<{ productId?: string }>();
    const id = productId ? Number(productId) : NaN;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    const basketCtx = useContext(MassiveBasket) as any;
    const addToBasket: (product: Product) => void = basketCtx?.addToBasket ?? (() => {});

    const favCtx = useContext(FavouritesMassive) as any;
    const addFavourites: (product: Product) => void = favCtx?.addFavourites ?? (() => {});

    const product = products.find((p) => p.id === id);
    const productsByBrand = product ? products.filter((p) => p.brand === product.brand && p.id !== product.id) : [];

    

    useEffect(() => {
        let mounted = true;

        const fetchResponse = async () => {
            try {
                const res = await CatalogApi();
                const data = typeof res === 'function' ? await res() : res;
                
                if (!mounted) return;

                if (Array.isArray(data)) {
                    setProducts(data as Product[]);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке продуктов:', error);
                if (mounted) setProducts([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchResponse();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [product?.id]);

    if (loading) return SkeletonProductInfo();
    if (!product) return <div>Продукт не найден</div>;

    function renderGallery() {
        const images = product.images ?? [];
        const mainSrc = images[selectedImageIndex] ?? images[0] ?? '';

        return (
            <div className="product_gallery">
                <img src={mainSrc} alt={product.title} className="product_main_image" />
                <div className="product_thumbnails">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            className={`product_thumb ${selectedImageIndex === index ? 'active' : ''}`}
                            src={img}
                            alt={`${product.title} ${index + 1}`}
                            onClick={() => setSelectedImageIndex(index)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="product_page">
            <div className="product_header">
                <Link to="/" className="product_header_link"><FaArrowLeft /></Link>
            </div>

            <div className="product_container">
                {renderGallery()}

                <div className="product_info">
                    <h1 className="product_title">{product.title}</h1>
                    
                    <div className="product_meta">
                        <span className="product_brand">{product.brand}</span>
                        <span className="product_category">{product.category ?? 'Товар'}</span>
                        <div className="product_rating">⭐ {product.rating ?? 'N/A'}</div>
                    </div>

                    <div className="product_price_section">
                        <span className="product_price">${product.price}</span>
                    </div>

                    <p className="product_description">{product.description}</p>

                    <div className="product_actions">
                        <button 
                            className="product_btn product_btn_primary"
                            onClick={() => addToBasket(product)}
                        >
                            🛒 В корзину
                        </button>
                        <button 
                            className="product_btn product_btn_secondary"
                            onClick={() => addFavourites(product)}
                        >
                            ❤️ В избранное
                        </button>
                    </div>
                </div>
            </div>

            {product.reviews && product.reviews.length > 0 && (
                <div className="product_reviews_section" style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
                    <h2 className="product_reviews_title">Отзывы ({product.reviews.length})</h2>
                    <div className="product_reviews_list">
                        {product.reviews.map((review, index) => (
                            <div key={index} className="product_review">
                                <div className="product_review_header">
                                    <h4 className="product_review_name">{review.reviewerName}</h4>
                                    <span className="product_review_date">{review.date}</span>
                                </div>
                                <div className="product_review_rating">{'⭐'.repeat(review.rating)}</div>
                                <p className="product_review_comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="product_related_section" style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
                <h2 className="product_related_title">Другие товары бренда {product.brand}</h2>
                {productsByBrand.length > 0 ? (
                    <div className="product_related_grid">
                        {productsByBrand.map((prod) => (
                            <div key={prod.id} className="product_related_card">
                                <img src={prod.images?.[0] ?? ''} alt={prod.title} className="product_related_img" />
                                <div className="product_related_info">
                                    <h4 className="product_related_name">{prod.title}</h4>
                                    <p className="product_related_price">${prod.price}</p>
                                    <Link to={`/product/${prod.id}`} className="product_related_link">Подробнее</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="product_related_empty">Других товаров этого бренда нет.</div>
                )}
            </div>
        </div>
    );
}
