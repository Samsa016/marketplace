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
            <h1>Корзина</h1>
            <h2>Сумма товаров: {totalSum}</h2>
            <Link to='/'>← Вернуться на главную страницу</Link>
            <Link to='/product/buy'>Оформить заказ</Link>
            {basket.length > 0 ? (
                <div>
                    {basket.map((pr, index) => {
                        if (!pr || !pr.images) return null;
                        return (
                        <div key={index} style={{border: "1px solid black", margin: "10px", padding: "10px", width: "200px"}}>
                            <img src={pr.images[0]} alt={pr.title} style={{width: "100px", height: "100px"}}></img>
                            <h3>{pr.title}</h3>
                            <p>Цена: {pr.price}₽</p>
                            <button onClick={() => deleteFromBasket(index)}>Удалить товар из корзины</button>
                        </div>
                        )
                    })}
                    
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