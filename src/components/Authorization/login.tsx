import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import '../../styles/login.css';

export function Login(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [validateUser, setValidateUser] = useState<boolean>(false);
    
    const [errors, setErrors] = useState({ username: '', password: '' });

    const basket_localstorage = localStorage.getItem('basket');
    const favorite_localstorage = localStorage.getItem('favorites');

    const navigate = useNavigate();

    const login_user = () => {
        let isValid = true;
        const newErrors = { username: '', password: '' };

        if (!username.trim()) {
            newErrors.username = 'Введите имя пользователя';
            isValid = false;
        }
        if (!password.trim()) {
            newErrors.password = 'Введите пароль';
            isValid = false;
        }

        setErrors(newErrors);
        setValidateUser(false);

        if (!isValid) return;

        const rawFavorite = favorite_localstorage ? JSON.parse(favorite_localstorage) : [];
        const preparedFavorite = rawFavorite.map((item: any) => {
            if (item.id) return { product_id: item.id };
            if (typeof item === 'number') return { product_id: item };
            return { product_id: 0 };
        });

        const rawBasket = basket_localstorage ? JSON.parse(basket_localstorage) : [];
        const preparedBasket = rawBasket.map((item: any) => {
            if (item.id) return { product_id: item.id, quantity: 1 };
            if (typeof item === 'number') return { product_id: item, quantity: 1 };
            return { product_id: 0, quantity: 0 };
        });

        const user_log = {
            username: username,
            password: password,
            localstorage_basket: preparedBasket,
            localstorage_favorites: preparedFavorite
        };

        const json_user = JSON.stringify(user_log);

        fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('basket', JSON.stringify([]));
            navigate('/');
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    };

    return (
        <>
            <Link className="title_list" to="/">PerfectShop</Link>
            <Link className="return_main_page" to="/"><FaArrowLeft /></Link>
            <div className="login_form">
                <h2>Вход</h2>
                <div className="form_group">
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={errors.username ? 'input_error' : ''}
                    />
                    {errors.username && <span className="field_error" style={{color: 'red', fontSize: '12px'}}>{errors.username}</span>}
                </div>

                <div className="form_group" style={{marginTop: '10px'}}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? 'input_error' : ''}
                    />
                    {errors.password && <span className="field_error" style={{color: 'red', fontSize: '12px'}}>{errors.password}</span>}
                </div>

                <p>
                    <button onClick={() => login_user()}>
                        Войти
                    </button>
                </p>

                {validateUser && (
                    <p className="error_message" style={{color: 'red'}}>
                        Пользователь не найден. Проверьте данные или <Link to="/register">зарегистрируйтесь</Link>.
                    </p>
                )}
            </div>
        </>
    );
}