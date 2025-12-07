import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

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
                <Link style={{ color: 'black', marginBottom: '20px', fontSize: '20px' }} to='/'><FaArrowLeft /></Link>
                
                <h2 style={{ marginTop: "30px" }}>Мои заказы</h2>
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