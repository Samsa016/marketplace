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
            <h1 style={{ marginTop: '100px' }}>Корзина</h1>
            <h2>Сумма товаров: {totalSum}$</h2>
            <Link to='/'>← Вернуться на главную страницу</Link>
            <Link to='/product/buy'>Оформить заказ</Link>
            {basket.length > 0 ? (
                <div>
                    {basket.map((pr, index) => {
                        if (!pr || !pr.images) return null;
                        return (
                        <div className="cards" key={index} style={{border: "1px solid black", margin: "10px", padding: "10px", width: "200px"}}>
                            <img src={pr.images[0]} alt={pr.title} style={{width: "200px", height: "250px"}}></img>
                            <p className="price_card">Цена: {pr.price}$</p>
                            <h3 className="title_card">{pr.title}</h3>
                            <button className="delete_basket_button" onClick={() => deleteFromBasket(index)}><img src="https://w7.pngwing.com/pngs/298/507/png-transparent-rubbish-bins-waste-paper-baskets-computer-icons-recycling-bin-waste-rectangle-recycling-logo.png" style={{ width: '30px', height: '20px', borderRadius: '50%'}}></img></button>
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