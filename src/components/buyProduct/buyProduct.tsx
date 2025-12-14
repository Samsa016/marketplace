import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { Product } from '../../types/product';

export interface Order {
    id: string;
    date: string;
    total: number;
    items: Product[];
}

export function MyOrders(): JSX.Element {

    const orders: Order[] = (() => {
        try {
            const stored = localStorage.getItem('orders');
            return stored ? JSON.parse(stored) as Order[] : [];
        } catch (error) {
            console.error('Ошибка при чтении заказов из localStorage:', error);
            return [];
        }
    

    })();

    function formatOrderDate(d: string | Date = new Date()): string {
    
        const date = new Date(d);       

        if (isNaN(date.getTime())) {
            return 'Некорректная дата';
        }
           
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
                            <p>Сумма заказа: {order.total.toFixed(2)} $</p>
                            <h4>Товары в заказе:</h4>
                            <ul>
                                {order.items.map((product, idx) => (
                                    <li key={idx}>
                                        {product.title} - {product.price} $
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