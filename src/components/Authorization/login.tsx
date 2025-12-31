import React from "react";
import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import '../../styles/login.css';
import { pre } from "framer-motion/client";

export function Login(): JSX.Element {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [validateUser, setValidateUser] = useState<boolean>(false);
    const basket_localstorage = localStorage.getItem('basket');
    const favorite_localstorage = localStorage.getItem('favorites') 

    const navigate = useNavigate();

    const login_user = () => {
    
    
    const rawFavorite = favorite_localstorage ? JSON.parse(favorite_localstorage) : [];
            
            console.log("Данные из localStorage:", rawFavorite);

            const preparedFavorite = rawFavorite.map((item: any) => {
                if (item.id) {
                    return {product_id: item.id}
                }

                if (typeof item === 'number') {
                    return { product_id: item };
                }

                return { product_id: 0 };
            })

    const rawBasket = basket_localstorage ? JSON.parse(basket_localstorage) : [];
            
            console.log("Данные из localStorage:", rawBasket);

            const preparedBasket = rawBasket.map((item: any) => {
                if (item.id) {
                    return { product_id: item.id, quantity: 1 };
                }

                if (typeof item === 'number') {
                    return { product_id: item, quantity: 1 };
                }

                return { product_id: 0, quantity: 0 }; 
            });

            const user_log = {
                username: username,
                password: password,
                localstorage_basket: preparedBasket,
                localstorage_favorites: preparedFavorite

            }
            
            console.log("Отправляем на сервер:", user_log)
            
            const json_user = JSON.stringify(user_log);

            fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem('token')
                },
                body: json_user
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    setValidateUser(true);
                    throw new Error('Ошибка при входе пользователя');
                    
                }
            })
            .then(data => {
                console.log("Ура, сервер ответил");
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('basket', JSON.stringify([]));
                navigate('/');

            })
            .catch(error => {
                console.error('Ошибка:', error);
            })
            }

    return (
        <>
            <Link className="title_list" to="/">PerfectShop</Link>
            <Link className="return_main_page" to="/"><FaArrowLeft /></Link>
            <div className="login_form">
                <h2>Вход</h2>
                <p>
                    <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    ></input>
                </p>

                <p>
                    <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </p>

                <p>
                    <button
                    onClick={() => login_user()}>
                        Войти
                    </button>
                    
                   
                </p>

                 {validateUser && (
                    <p className="error_message">
                        Пользователь не найден. Проверьте правильность введённых данных или <Link to="/register">зарегистрируйтесь</Link>.
                    </p>
                )}

            </div>
        </>
    )
}