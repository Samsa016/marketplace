import { useContext } from "react"
import { MassiveBasket } from "./basket.jsx";
import { Link } from "react-router-dom";

export function CreateBasket() {
    const { basket, deleteFromBasket } = useContext(MassiveBasket)

    if (!basket) {
        return <div>Ошибка: контекст не инициализирован</div>
    }

    
    return (
        <div>
            <h1>Корзина</h1>
             <Link to='/'>← Вернуться на главную страницу</Link>
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