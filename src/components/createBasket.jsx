import { useContext, useState, useEffect } from "react"
import { MassiveBasket } from "./basket.jsx";
import { Link } from "react-router-dom";

export function CreateBasket() {
    const { basket, deleteFromBasket } = useContext(MassiveBasket)
    const [ totalSum, setTotalSum ] = useState(0)

    if (!basket) {
        return <div>Ошибка: контекст не инициализирован</div>
    }

    useEffect(() => {

            const toSum = basket.reduce((sum, product) => {
            const price = Number(product?.price) || 0; // берём product.price и приводим к числу
            return sum + price;
            
        }, 0);

        setTotalSum(toSum)

    }, [basket])
    
    return (
        <div>
            <h1 className='title_list'>PerfectShop</h1>
            <h1 className='basket_title'>Корзина</h1>
            <div style={{ fontSize: '14px', 
                color: '#4b5563', 
                marginLeft: '50px',
                marginTop: '10px',
                marginBottom: '10px' }}>
                    Количество товаров {basket.length} шт.
            </div>
            <Link className="return_main_page" to='/'>← Вернуться на главную страницу</Link>

            

            {basket.length > 0 ? (
                <div className="basket_wrapper">
                    <main className="basket_container">
                    {basket.map((pr, index) => {
                        if (!pr || !pr.images) return null;
                        return (
                        <div className="cards_basket" key={index}>
                            <img src={pr.images[0]} alt={pr.title}></img>
                            <p className="price_card_basket">Цена: {pr.price}$</p>
                            <h3 className="title_card_basket">{pr.title}</h3>
                            <button                               className="delete_basket_button"
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
                        )
                    })}


                    
                </main>
            <aside className="basket_sidebar">
                <div className='basket_summary'>
                    
                    <h2>Итого: {totalSum}$</h2>
                    <Link to='/product/buy' className="button_order">
                        Оформить заказ →
                    </Link>
                </div>

            </aside>

            </div>
            ) : (
                <div>
                    <h1>Ваша корзина пуста</h1>
                    <div>Пополните товарами корзину</div>
                </div>
                
            )
            }
            
            </div>
            
    )
}