import { useContext, useState, useEffect } from "react";
import { MassiveBasket} from "./basket";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { Product } from "../types/product";
import { BasketContextType } from "../types/basket";

export function CreateBasket(): JSX.Element {
    const basketContext = useContext<BasketContextType | null>(MassiveBasket)

    if (!basketContext) {
        return <div>Ошибка: контекст не инициализирован</div>;
    }
    
    const { basket, deleteFromBasket } = basketContext;
    const [totalSum, setTotalSum] = useState<number>(0);

    useEffect(() => {
        const toSum = basket.reduce((sum: number, product: Product) => {
            const price = Number(product.price) ?? 0;
            return sum + price;
        }, 0) 

        setTotalSum(toSum);
    }, [basket]);

    return (
        <div>
            <h1 className="title_list">PerfectShop</h1>
            <Link className="return_main_page" to="/"><FaArrowLeft /></Link>
            <h1 className="basket_title">Корзина <FaBasketShopping /></h1>
            
            <div style={{ 
                fontSize: '14px', 
                color: '#4b5563', 
                marginLeft: '50px',
                marginTop: '10px',
                marginBottom: '10px' 
            }}>
                Количество товаров {basket.length} шт.
            </div>

            {basket.length > 0 ? (
                <div className="basket_wrapper">
                    <main className="basket_container">
                        {basket.map((product: Product, index: number) => {
                            if (!product?.images || product.images.length === 0) {
                                return null;
                            }

                            return (
                                <div className="cards_basket" key={index}>
                                    <img src={product.images[0]} alt={product.title} />
                                    <p className="price_card_basket">Цена: {product.price}$</p>
                                    <h3 className="title_card_basket">{product.title}</h3>
                                    <button
                                        className="delete_basket_button"
                                        onClick={() => deleteFromBasket(index)}
                                        title="Удалить из корзины"
                                    >
                                        <span>Удалить из корзины</span>
                                        <img
                                            src="https://www.svgrepo.com/show/485930/trashcan.svg"
                                            alt="Удалить"
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </main>

                    <aside className="basket_sidebar">
                        <div className="basket_summary">
                            <h2>Итого: {totalSum.toFixed(2)}$</h2>
                            <Link to="/product/buy" className="button_order">
                                Оформить заказ →
                            </Link>
                        </div>
                    </aside>
                </div>
            ) : (
                <div className="empty_basket">
                    <h1>Ваша корзина пуста</h1>
                    <div>Пополните товарами корзину</div>
                </div>
            )}
        </div>
    );


}