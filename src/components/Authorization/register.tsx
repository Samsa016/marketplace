import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../../styles/registration.css';

export function Registration(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    
    const [errors, setErrors] = useState({ username: '', email: '', password: '', confirm: '' });

    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const register_user = () => {
        let isValid = true;
        const newErrors = { username: '', email: '', password: '', confirm: '' };

        if (!username.trim()) {
            newErrors.username = 'Введите имя пользователя';
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = 'Введите email';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Некорректный формат email';
            isValid = false;
        }

        if (password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirm = 'Пароли не совпадают';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) return;
        
        const user_reg = {
            username: username,
            email: email,
            password: password
        };

        const json_user = JSON.stringify(user_reg);

        fetch("http://localhost:8000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: json_user
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ошибка при регистрации пользователя');
            }
        })
        .then(data => {
            console.log("Ура, сервер ответил");
            navigate('/');
        })
        .catch (error => {
            console.error('Ошибка:', error);
            alert("Ошибка регистрации. Возможно, такое имя уже занято.");
        });
    };

    return (
        <>
            <Link className="title_list" to="/">PerfectShop</Link>
            <Link className="return_main_page" to="/"><FaArrowLeft /></Link>
            <div className="registration_form">
                <h2>Регистрация</h2>

                <div className="form_group">
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={errors.username ? 'input_error' : ''}
                    />
                    {errors.username && <div style={{color: 'red', fontSize: '12px', textAlign: 'left'}}>{errors.username}</div>}
                </div>

                <div className="form_group" style={{marginTop: '10px'}}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? 'input_error' : ''}
                    />
                    {errors.email && <div style={{color: 'red', fontSize: '12px', textAlign: 'left'}}>{errors.email}</div>}
                </div>

                <div className="form_group" style={{marginTop: '10px'}}>
                    <input
                        type="password"
                        placeholder="Пароль (мин. 6 символов)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? 'input_error' : ''}
                    />
                    {errors.password && <div style={{color: 'red', fontSize: '12px', textAlign: 'left'}}>{errors.password}</div>}
                </div>

                <div className="form_group" style={{marginTop: '10px'}}>
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={errors.confirm ? 'input_error' : ''}
                    />
                    {errors.confirm && <div style={{color: 'red', fontSize: '12px', textAlign: 'left'}}>{errors.confirm}</div>}
                </div>

                <p>
                    <button onClick={() => register_user()}>
                        Зарегистрироваться
                    </button>
                </p>
            </div>
        </>
    );
}