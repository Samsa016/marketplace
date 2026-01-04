import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'

export function PaymentSuccess(): JSX.Element {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            textAlign: 'center',
            fontFamily: 'Montserrat, sans-serif'
        }}>
            <FaCheckCircle style={{ fontSize: '80px', color: '#10b981', marginBottom: '20px' }} />
            
            <h1 style={{ fontSize: '32px', color: '#111827' }}>Оплата прошла успешно!</h1>
            
            <p style={{ fontSize: '18px', color: '#4b5563', maxWidth: '500px', marginBottom: '40px' }}>
                Спасибо за ваш заказ. Мы уже начали его собирать. 
                Вся информация отправлена вам на почту.
            </p>

            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                }}>
                    На главную
                </Link>
                
                <Link to="/product/myorders" style={{
                    padding: '12px 24px',
                    backgroundColor: '#e5e7eb',
                    color: '#111827',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                }}>
                    Мои заказы
                </Link>
            </div>
        </div>
    );
}