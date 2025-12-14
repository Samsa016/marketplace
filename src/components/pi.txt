import React from "react"
import { CatalogApi } from '../pages/Catalog.jsx';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { MassiveBasket } from './basket.jsx';
import { FavouritesMassive } from './favourites.jsx';
import { FaArrowLeft } from "react-icons/fa";


export function ProductInfo() {
    const { productId } = useParams();
    const [ products, setProducts] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ selectedImageIndex, setSelectedImageIndex ] = useState(0);
    
    const { addToBasket } = useContext(MassiveBasket);
    const { addFavourites } = useContext(FavouritesMassive);

    const product = products.find((product) => product.id === parseInt(productId));
    const productsByBrand = product ? products.filter((p) => p.brand == product.brand && p.id !== product.id) : [];


    useEffect(() => {
        const fetchResponse = async () => {
            try {
                const data = await CatalogApi()();
                if (data.length > 0) {
                    setProducts(data);
                } else {
                    throw new Error("Нет продуктов для отображения");
                }
                } catch (error) {
                    console.error("Ошибка при загрузке продуктов:", error);
                } finally {
                    setLoading(false);
                }

            }

        fetchResponse();

    }, [])


    useEffect(() => {
        setSelectedImageIndex(0);
    }, [product?.id]);

    
    
    
    if (loading) return <div>Загрузка...</div>

    if (!product) {
        return <div>Продукт не найден</div>
    }

    function renderGallery() {
        const images = product?.images || [];
        const mainSrc = images[selectedImageIndex] || images[0] || '';

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
        )
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
                        <span className="product_category">{product.category || 'Товар'}</span>
                        <div className="product_rating">⭐ {product.rating || 'N/A'}</div>
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
                <div className="product_reviews_section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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


            <div className="product_related_section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <h2 className="product_related_title">Другие товары бренда {product.brand}</h2>
                {productsByBrand.length > 0 ? (
                    <div className="product_related_grid">
                        {productsByBrand.map((prod) => (
                            <div key={prod.id} className="product_related_card">
                                <img src={prod.images?.[0] || ''} alt={prod.title} className="product_related_img" />
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
    ) 
}