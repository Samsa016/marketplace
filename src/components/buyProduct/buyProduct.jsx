import React from 'react';
import { Link } from 'react-router-dom';

export function MyOrders() {
    const orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];

    function formatOrderDate(d = new Date()) {
    
        const date = (d instanceof Date) ? d : new Date(d);       
           
        return  date.toLocaleString('ru-RU', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })
    }


    return (
        <div>
            <header className='title_list'>
                <h1>PerfectShop</h1>
            </header>
            <div className='order_list'>
                <h2>Мои заказы</h2>
                <Link to='/'>Вернуться на главную страницу</Link>
                {orders.length === 0 ? (
                    <p>У вас нет заказов.</p>
                ) : (
                    <div>
                    {orders.map((order, index) => (
                        <div className='order_cards' key={index}>
                            <h3 className='id_order'>Заказ ID: {order.id}</h3>
                            <p>Дата заказа: {formatOrderDate(order.date)}</p>
                            <p>Сумма заказа: {order.total} ₽</p>
                            <h4>Товары в заказе:</h4>
                            <ul>
                                {order.items.map((product, idx) => (
                                    <li key={idx}>
                                        {product.title} - {product.price} ₽
                                    </li>
                                ))}
                            </ul>
                        </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
                
    )
}