import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../../styles/registration.css';


export function Registration(): JSX.Element {

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const navigate = useNavigate();

    const register_user = () => {
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        const user_reg = {
            username: username,
            email: email,
            password: password
        }

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
            console.log("Ура, сервер ответил:");
            navigate('/')
        })
        .catch (error => {
            console.error('Ошибка:', error);
        })
    }

    return (
        <>
            <Link className="title_list" to="/">PerfectShop</Link>
            <Link className="return_main_page" to="/"><FaArrowLeft /></Link>
            <div className="registration_form">
            <h2>Регистрация</h2>

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
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    <input
                    type="password"
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    ></input>
                </p>

                <p>
                    <button
                    onClick={() => register_user()}
                    >Зарегистрироваться</button>
                </p>



        </div>
        </>
    )
}