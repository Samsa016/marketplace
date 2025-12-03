import React from "react"
import { CatalogApi } from '../pages/Catalog.jsx';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";


export function ProductInfo() {
    const { productId } = useParams();
    const [ products, setProducts] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ selectedImageIndex, setSelectedImageIndex ] = useState(0);

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

    // сбрасываем выбранную картинку при смене товара — эффект должен вызываться всегда
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
            <div>
                <img src={mainSrc} alt={product.title} style={{ width: "400px", height: "400px" }} />
                <div style={{ display: 'flex', marginTop: '10px' }}>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            style={{ width: '70px', height: '50px', marginRight: '10px', cursor: 'pointer', border: selectedImageIndex === index ? '2px solid blue' : '1px solid gray' }}
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
        <div>

            <Link to="/">На главную страницу</Link>

            <div key={product.id}>
                {renderGallery()}
                <h2>{product.title}</h2>
                <p>{product.price}</p>
                <p>{product.rating}</p>
                <p>{product.description}</p>
                <p>{product.brand}</p>
                <div>
                    {product.reviews && product.reviews.map((reviews, index) => (
                        <div key={index} style={{ border: "solid black 2px", width: "250px" }}>
                            <p>{reviews.reviewerName}</p>
                            <p>{reviews.rating}</p>
                            <p>{reviews.comment}</p>
                            <p>{reviews.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3>Другие продукты этого бренда:</h3>
                <div>
                    {productsByBrand.map((prod) => (
                        <div key={prod.id} style={{ border: "1px solid black", margin: "10px", padding: "10px", width: "200px" }}>
                            <img src={prod.images?.[0] || ''} alt={prod.title} style={{ width: '100px', height: '80px' }}></img>
                            <h4>{prod.title}</h4>
                            <p>{prod.price}</p>
                            <Link to={`/product/${prod.id}`}>Подробнее</Link>
                        </div>
                    ))}
                    {productsByBrand.length === 0 && <div>Других продуктов этого бренда нет.</div>}
                </div>
            </div>
            

        </div>
    ) 
}