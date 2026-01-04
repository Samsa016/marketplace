import { useState, useContext } from 'react';
import { MassiveBasket } from "../basket"; // Проверь путь
import { Link } from "react-router-dom";
import { BasketContextType } from '../../types/basket';
import { Product } from '../../types/product';

export function BuyProduct(): JSX.Element {
    const masBasket = useContext<BasketContextType | null>(MassiveBasket);
    
    if (!masBasket) return <div>Ошибка: контекст корзины не инициализирован</div>;
    const { basket } = masBasket;

    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');

    const [phone, setPhone] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');

    const [address, setAddress] = useState<string>('');
    const [addressError, setAddressError] = useState<string>('');

    const [city, setCity] = useState<string>('');
    const [cityError, setCityError] = useState<string>('');

    const [index, setIndex] = useState<string>('');

    const [step, setStep] = useState<number>(1);

    const totalSum: number = basket && basket.length > 0
        ? basket.reduce((sum: number, product: Product) => {
            const price = Number(product?.price) ?? 0;
            return sum + price;
        }, 0)
        : 0;

    function orderConfirm(): void {
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Ошибка авторизации. Пожалуйста, войдите в аккаунт.");
            return;
        }

        fetch("http://localhost:8000/product/buy", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Ошибка при создании заказа");
            return res.json();
        })
        .then(serverData => {
            console.log('Ответ сервера:', serverData);

            if (serverData.payment_url) {

                window.location.href = serverData.payment_url;
            } else {
                alert("Ошибка: сервер не вернул ссылку на оплату.");
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert("Не удалось оформить заказ. Возможно, проблема с сетью.");
        });
    }

    function validateName(value: string): string {
        if (!value.trim()) return 'ФИО обязательно';
        if (value.trim().split(/\s+/).length < 2) return 'Введите Имя и Фамилию';
        return '';
    }

    function validateEmail(value: string): string {
        if (!value.trim()) return 'Email обязателен';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Некорректный email';
        return '';
    }

    function validatePhone(value: string): string {
        if (!value.trim()) return 'Телефон обязателен';
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) return 'Минимум 10 цифр';
        return '';
    }

    function validateAddress(value: string): string {
        if (!value.trim()) return 'Адрес обязателен';
        if (value.trim().length < 10) return 'Слишком короткий адрес';
        return '';
    }

    function validateCity(value: string): string {
        if (!value.trim()) return 'Город обязателен';
        return '';
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setNameError(validateName(e.target.value));
    };
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError(validateEmail(e.target.value));
    };
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
        setPhoneError(validatePhone(e.target.value));
    };
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
        setAddressError(validateAddress(e.target.value));
    };
    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        setCityError(validateCity(e.target.value));
    };

    function validateStep1(): boolean {
        const nameErr = validateName(name);
        const emailErr = validateEmail(email);
        const phoneErr = validatePhone(phone);
        const addressErr = validateAddress(address);
        const cityErr = validateCity(city);

        setNameError(nameErr);
        setEmailError(emailErr);
        setPhoneError(phoneErr);
        setAddressError(addressErr);
        setCityError(cityErr);

        return !nameErr && !emailErr && !phoneErr && !addressErr && !cityErr;
    }

    function step1(): JSX.Element {
        return (
            <div className="buy_product_wrapper">
                <div className="buy_product_container">
                    <div className="buy_product_header">
                        <h2>📦 Доставка</h2>
                        <div className="buy_product_step_indicator">
                            <div className="step_dot active">1</div>
                            <span>Данные</span>
                            <div className="step_dot">2</div>
                            <span>Оплата</span>
                        </div>
                    </div>

                    <div className="buy_product_content">
                        <div className="step_delivery">
                            <div className="form_group">
                                <label className="form_label">ФИО *</label>
                                <input type='text' className={`form_input ${nameError ? 'error' : ''}`} value={name} onChange={handleNameChange} placeholder="Иван Иванов" />
                                {nameError && <div className="form_error">{nameError}</div>}
                            </div>

                            <div className="form_group">
                                <label className="form_label">Email *</label>
                                <input type='email' className={`form_input ${emailError ? 'error' : ''}`} value={email} onChange={handleEmailChange} placeholder="mail@example.com" />
                                {emailError && <div className="form_error">{emailError}</div>}
                            </div>

                            <div className="form_group">
                                <label className="form_label">Телефон *</label>
                                <input type='tel' className={`form_input ${phoneError ? 'error' : ''}`} value={phone} onChange={handlePhoneChange} placeholder="+7 (999) 000-00-00" />
                                {phoneError && <div className="form_error">{phoneError}</div>}
                            </div>

                            <div className="form_group">
                                <label className="form_label">Адрес *</label>
                                <input type='text' className={`form_input ${addressError ? 'error' : ''}`} value={address} onChange={handleAddressChange} placeholder="Улица, дом, кв." />
                                {addressError && <div className="form_error">{addressError}</div>}
                            </div>

                            <div className="form_row">
                                <div className="form_group">
                                    <label className="form_label">Город *</label>
                                    <input type='text' className={`form_input ${cityError ? 'error' : ''}`} value={city} onChange={handleCityChange} placeholder="Москва" />
                                    {cityError && <div className="form_error">{cityError}</div>}
                                </div>
                                <div className="form_group">
                                    <label className="form_label">Индекс</label>
                                    <input type='text' className="form_input" value={index} onChange={(e) => setIndex(e.target.value)} placeholder="123456" />
                                </div>
                            </div>

                            <div className="order_summary">
                                <div className="summary_item">Итого: <strong>${totalSum.toFixed(2)}</strong></div>
                            </div>

                            <div className="form_actions">
                                <Link to="/product/basket" className="form_btn form_btn_secondary">← В корзину</Link>
                                <button type="button" className="form_btn form_btn_primary" onClick={() => validateStep1() && setStep(2)}>
                                    К оплате →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function step2(): JSX.Element {
        return (
            <div className="buy_product_wrapper">
                <div className="buy_product_container">
                    <div className="buy_product_header">
                        <h2>✅ Проверка заказа</h2>
                        <div className="buy_product_step_indicator">
                            <div className="step_dot">1</div>
                            <span>Данные</span>
                            <div className="step_dot active">2</div>
                            <span>Оплата</span>
                        </div>
                    </div>

                    <div className="buy_product_content">
                        <div className="step_confirmation">
                            <div className="confirmation_section">
                                <h3>📦 Куда доставляем:</h3>
                                <p><strong>{name}</strong></p>
                                <p>{city}, {address} {index && `(${index})`}</p>
                                <p>{phone}, {email}</p>
                            </div>

                            <div className="confirmation_section">
                                <h3>🛒 Ваш заказ:</h3>
                                <div className="order_items">
                                    {basket?.map((product: Product, i: number) => (
                                        <div key={i} className="order_item">
                                            <div className="order_item_info">
                                                <span>{product.title}</span>
                                                <strong>${product.price}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="order_total" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                    К оплате: <strong style={{ fontSize: '1.2em', color: '#10b981' }}>${totalSum.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="form_actions">
                                <button type="button" className="form_btn form_btn_secondary" onClick={() => setStep(1)}>
                                    ← Изменить данные
                                </button>
                                <button type="button" className="form_btn form_btn_primary" onClick={orderConfirm}>
                                    💳 Оплатить через ЮKassa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 1) return step1();
    if (step === 2) return step2();
    return <div>Что-то пошло не так</div>;
}