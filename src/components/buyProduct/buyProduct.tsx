import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { SkeletonOrders } from '../SkeletonAdd';
import { useEffect, useState } from 'react'

interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
    title: string;
}
export interface Order {
    id: string;
    date: string;
    total: number;
    items: OrderItem[];

}

export function MyOrders(): JSX.Element {
    const [orders, setOrders] = useState<Order[] | []>([])
    const [loading, setLoading] = useState<boolean>(true)

useEffect(() => {
            const token = localStorage.getItem('token')
            
            fetch("http://localhost:8000/product/myorders", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    return [];
                }
                
                if (!res.ok) throw new Error("Ошибка при обработке моих заказов");
                return res.json();
            })
            .then(data => {
                setOrders(data);
                console.log("Мои заказы загружены с сервера");
                setLoading(false);
            })
            .catch(error => {
                console.error("Ошибка catch:", error);
                setLoading(false);
            });
        
    }, []);

    if (loading) {
        return <SkeletonOrders />;
    }

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
                <Link to="/">PerfectShop</Link>
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