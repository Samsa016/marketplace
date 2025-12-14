import { useState, useContext } from 'react';
import { MassiveBasket } from "../basket";
import { Link } from "react-router-dom";
import { BasketContextType } from '../../types/basket';
import { Product } from '../../types/product';

export interface NewOrder {
    id: string;
    date: string;
    datePretty: string;
    items: OrderItem[];
    total: number;
    itemsCount: number;
    customer: Customer;
    payment: { method: string };
}

interface OrderItem {
    id: number | null;
    title: string;
    price: number;
}

interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
}

export function BuyProduct(): JSX.Element {
    const masBasket = useContext<BasketContextType | null>(MassiveBasket);
    if (!masBasket) {
        return <div>Ошибка: контекст корзины не инициализирован</div>;
    }
    const { basket, clearBasket } = masBasket;

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

    const [numberCard, setNumberCard] = useState<string>('');
    const [numberCardError, setNumberCardError] = useState<string>('');

    const [dataCard, setDataCard] = useState<string>('');
    const [dataCardError, setDataCardError] = useState<string>('');

    const [cvv, setCvv] = useState<string>('');
    const [cvvError, setCvvError] = useState<string>('');

    const [paymentMethod, setPaymentMethod] = useState<string>('card');

    const [walletAccount, setWalletAccount] = useState<string>('');
    const [walletAccountError, setWalletAccountError] = useState<string>('');

    const [step, setStep] = useState<number>(1);
    const [lastOrder, setLastOrder] = useState<NewOrder | null>(null);

    const totalSum: number = basket && basket.length > 0
        ? basket.reduce((sum: number, product: Product) => {
            const price = Number(product?.price) ?? 0;
            return sum + price;
        }, 0)
        : 0;

    function formatOrderDate(d: Date = new Date()): { iso: string; pretty: string } {
        const date = (d instanceof Date) ? d : new Date(d);
        return {
            iso: date.toISOString(),
            pretty: date.toLocaleString('ru-RU', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })
        };
    }

    function generateOrderNumber(): string {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        } else {
            return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        }
    }

    function orderConfirm(): void {
        const { iso, pretty } = formatOrderDate();
        const id = generateOrderNumber();

        const newOrder: NewOrder = {
            id,
            date: iso,
            datePretty: pretty,
            items: basket.map((prod: Product) => ({ id: prod.id ?? null, title: prod.title ?? '', price: prod.price ?? 0 })),
            total: totalSum,
            itemsCount: basket.length,
            customer: { name, email, phone, address, city },
            payment: { method: paymentMethod }
        };

        const existing: NewOrder[] = (() => {
            try {
                const s = localStorage.getItem('orders');
                return s ? JSON.parse(s) as NewOrder[] : [];
            } catch (e) {
                console.error("Ошибка при чтении заказов из localStorage:", e);
                return [];
            }
        })();

        const updateOrder: NewOrder[] = [...existing, newOrder];

        try {
            localStorage.setItem('orders', JSON.stringify(updateOrder));
        } catch (error) {
            console.error('Ошибка сохранения заказов в LocalStorage:', error);
        }

        console.log('Заказ оформлен:', newOrder);
        setLastOrder(newOrder);
        clearBasket();
        setStep(4);
    }


    function validateName(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле ФИО обязательно для заполнения';
        }

        const trimmed = value.trim();
        const words = trimmed.split(/\s+/);

        if (words.length < 2) {
            return 'ФИО должно содержать минимум 2 слова';
        }

        for (let word of words) {
            if (word.length < 2) {
                return 'Каждое слово в ФИО должно содержать минимум 2 символа';
            }
            if (!/^[а-яА-ЯёЁa-zA-Z]+$/.test(word)) {
                return 'ФИО может содержать только буквы';
            }
        }

        return '';
    }

    function validateEmail(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле Email обязательно для заполнения';
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            return 'Введите корректный email адрес';
        }

        if (value.length > 254) {
            return 'Email адрес слишком длинный';
        }

        return '';
    }

    function validatePhone(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле Телефон обязательно для заполнения';
        }

        const digitsOnly = value.replace(/\D/g, '');

        if (digitsOnly.length < 10) {
            return 'Номер телефона должен содержать минимум 10 цифр';
        }

        if (digitsOnly.length > 15) {
            return 'Номер телефона слишком длинный';
        }

        const phonePattern = /^[\d\s+()\\-]+$/;
        if (!phonePattern.test(value)) {
            return 'Номер телефона содержит недопустимые символы';
        }

        return '';
    }

    function validateAddress(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле Адрес обязательно для заполнения';
        }

        if (value.trim().length < 10) {
            return 'Адрес должен содержать минимум 10 символов';
        }

        const addressLen = value.trim();
        const words = addressLen.split(/\s+/);

        if (words.length < 3) {
            return 'Адрес должен содержать минимум 3 слова';
        }

        return '';
    }

    function validateCity(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле Город обязательно для заполнения';
        }

        if (value.trim().length < 2) {
            return 'Название города должно содержать минимум 2 символа';
        }

        return '';
    }

    function validateCardNumber(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле Номер карты обязательно для заполнения';
        }

        const digitsOnly = value.replace(/\D/g, '');

        if (digitsOnly.length < 13 || digitsOnly.length > 19) {
            return 'Номер карты должен содержать от 13 до 19 цифр';
        }

        const cardPattern = /^[\d\s]+$/;
        if (!cardPattern.test(value)) {
            return 'Номер карты может содержать только цифры и пробелы';
        }

        return '';
    }

    function validateCardDate(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле Дата окончания обязательно для заполнения';
        }

        const [year, month] = value.split('-');

        if (!year || !month) {
            return 'Введите дату в формате ММ/ГГ';
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const cardYear = parseInt(year);
        const cardMonth = parseInt(month);

        if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
            return 'Карта просрочена';
        }

        if (cardYear > currentYear + 20) {
            return 'Дата окончания слишком далёкая';
        }

        return '';
    }

    function validateCVV(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле CVV обязательно для заполнения';
        }

        const digitsOnly = value.replace(/\D/g, '');

        if (digitsOnly.length < 3 || digitsOnly.length > 4) {
            return 'CVV должен содержать 3 или 4 цифры';
        }

        if (!/^\d+$/.test(value)) {
            return 'CVV может содержать только цифры';
        }

        return '';
    }

    function validateWalletAccount(value: string): string {
        if (!value || value.trim() === '') {
            return 'Поле Счёт кошелька обязательно для заполнения';
        }

        const trimmed = value.trim();

        if (trimmed.length < 5) {
            return 'Счёт кошелька должен содержать минимум 5 символов';
        }

        if (trimmed.includes('@')) {
            return 'Счёт кошелька не должен содержать символ @';
        }

        return '';
    }


    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        setName(value);
        setNameError(validateName(value));
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
    }

    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        setPhone(value);
        setPhoneError(validatePhone(value));
    }

    function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        setAddress(value);
        setAddressError(validateAddress(value));
    }

    function handleCityChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        setCity(value);
        setCityError(validateCity(value));
    }

    function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setNumberCard(formatted);
        setNumberCardError(validateCardNumber(formatted));
    }

    function handleCardDateChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        setDataCard(value);
        setDataCardError(validateCardDate(value));
    }

    function handleCVVChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        setCvv(value);
        setCvvError(validateCVV(value));
    }

    function handleWalletAccountChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;
        setWalletAccount(value);
        setWalletAccountError(validateWalletAccount(value));
    }

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

        return nameErr === '' && emailErr === '' && phoneErr === '' && addressErr === '' && cityErr === '';
    }

    function validateStep2(): boolean {
        if (paymentMethod === 'card') {
            const cardErr = validateCardNumber(numberCard);
            const dateErr = validateCardDate(dataCard);
            const cvvErr = validateCVV(cvv);

            setNumberCardError(cardErr);
            setDataCardError(dateErr);
            setCvvError(cvvErr);

            return cardErr === '' && dateErr === '' && cvvErr === '';
        }

        if (paymentMethod === 'wallet') {
            const walletErr = validateWalletAccount(walletAccount);
            setWalletAccountError(walletErr);
            return walletErr === '';
        }

        return true;
    }

    function step1(): JSX.Element {
        return (
            <div className="buy_product_wrapper">
                <div className="buy_product_container">
                    <div className="buy_product_header">
                        <h2>📦 Оформление заказа</h2>
                        <div className="buy_product_step_indicator">
                            <div className="step_dot active">1</div>
                            <span>Доставка</span>
                            <div className="step_dot">2</div>
                            <span>Оплата</span>
                            <div className="step_dot">3</div>
                            <span>Подтверждение</span>
                        </div>
                    </div>

                    <div className="buy_product_content">
                        <div className="step_delivery">
                            <div className="form_group">
                                <label className="form_label">ФИО <span className="form_label_required">*</span></label>
                                <input
                                    type='text'
                                    className={`form_input ${nameError ? 'error' : name ? 'success' : ''}`}
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="Иван Иванов"
                                />
                                {nameError && <div className="form_error">❌ {nameError}</div>}
                                {!nameError && name && <div className="form_success">✅ Корректно</div>}
                            </div>

                            <div className="form_group">
                                <label className="form_label">Email <span className="form_label_required">*</span></label>
                                <input
                                    type='email'
                                    className={`form_input ${emailError ? 'error' : email ? 'success' : ''}`}
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="example@mail.com"
                                />
                                {emailError && <div className="form_error">❌ {emailError}</div>}
                                {!emailError && email && <div className="form_success">✅ Корректно</div>}
                            </div>

                            <div className="form_group">
                                <label className="form_label">Телефон <span className="form_label_required">*</span></label>
                                <input
                                    type='tel'
                                    className={`form_input ${phoneError ? 'error' : phone ? 'success' : ''}`}
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+7 (999) 123-45-67"
                                />
                                {phoneError && <div className="form_error">❌ {phoneError}</div>}
                                {!phoneError && phone && <div className="form_success">✅ Корректно</div>}
                            </div>

                            <div className="form_group">
                                <label className="form_label">Адрес <span className="form_label_required">*</span></label>
                                <input
                                    type='text'
                                    className={`form_input ${addressError ? 'error' : address ? 'success' : ''}`}
                                    value={address}
                                    onChange={handleAddressChange}
                                    placeholder="Улица, дом, квартира"
                                />
                                {addressError && <div className="form_error">❌ {addressError}</div>}
                                {!addressError && address && <div className="form_success">✅ Корректно</div>}
                            </div>

                            <div className="form_row">
                                <div className="form_group">
                                    <label className="form_label">Город <span className="form_label_required">*</span></label>
                                    <input
                                        type='text'
                                        className={`form_input ${cityError ? 'error' : city ? 'success' : ''}`}
                                        value={city}
                                        onChange={handleCityChange}
                                        placeholder="Москва"
                                    />
                                    {cityError && <div className="form_error">❌ {cityError}</div>}
                                    {!cityError && city && <div className="form_success">✅ Корректно</div>}
                                </div>

                                <div className="form_group">
                                    <label className="form_label">Почтовый индекс</label>
                                    <input
                                        type='text'
                                        className="form_input"
                                        value={index}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndex(e.target.value)}
                                        placeholder="123456"
                                    />
                                </div>
                            </div>

                            <div className="order_summary">
                                <div className="summary_title">📋 Итого в корзине</div>
                                <div className="summary_item">
                                    Товаров: <strong>{basket?.length || 0} шт.</strong>
                                </div>
                                <div className="summary_item">
                                    Сумма: <strong>${totalSum.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="form_actions">
                                <Link to="/product/basket" className="form_btn form_btn_secondary">
                                    ← Вернуться
                                </Link>
                                <button
                                    type="button"
                                    className="form_btn form_btn_primary"
                                    onClick={() => validateStep1() && setStep(2)}
                                >
                                    Далее → Оплата
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
                        <h2>💳 Выбор оплаты</h2>
                        <div className="buy_product_step_indicator">
                            <div className="step_dot">1</div>
                            <span>Доставка</span>
                            <div className="step_dot active">2</div>
                            <span>Оплата</span>
                            <div className="step_dot">3</div>
                            <span>Подтверждение</span>
                        </div>
                    </div>

                    <div className="buy_product_content">
                        <div className="step_payment">
                            <div className="payment_methods">
                                <div className="payment_method">
                                    <input
                                        type="radio"
                                        id="card"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor="card">💳 Банковская карта</label>
                                </div>
                                <div className="payment_method">
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="payment"
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor="cash">💵 Наличными при получении</label>
                                </div>
                                <div className="payment_method">
                                    <input
                                        type="radio"
                                        id="wallet"
                                        name="payment"
                                        value="wallet"
                                        checked={paymentMethod === 'wallet'}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor="wallet">📱 Электронный кошелёк</label>
                                </div>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="payment_form">
                                    <div className="form_group">
                                        <label className="form_label">Номер карты <span className="form_label_required">*</span></label>
                                        <input
                                            type="text"
                                            className={`form_input ${numberCardError ? 'error' : numberCard ? 'success' : ''}`}
                                            value={numberCard}
                                            onChange={handleCardNumberChange}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                        />
                                        {numberCardError && <div className="form_error">❌ {numberCardError}</div>}
                                        {!numberCardError && numberCard && <div className="form_success">✅ Корректно</div>}
                                    </div>

                                    <div className="form_row">
                                        <div className="form_group">
                                            <label className="form_label">Дата окончания <span className="form_label_required">*</span></label>
                                            <input
                                                type="month"
                                                className={`form_input ${dataCardError ? 'error' : dataCard ? 'success' : ''}`}
                                                value={dataCard}
                                                onChange={handleCardDateChange}
                                            />
                                            {dataCardError && <div className="form_error">❌ {dataCardError}</div>}
                                            {!dataCardError && dataCard && <div className="form_success">✅ Корректно</div>}
                                        </div>

                                        <div className="form_group">
                                            <label className="form_label">CVV <span className="form_label_required">*</span></label>
                                            <input
                                                type="text"
                                                className={`form_input ${cvvError ? 'error' : cvv ? 'success' : ''}`}
                                                value={cvv}
                                                onChange={handleCVVChange}
                                                placeholder="123"
                                                maxLength={4}
                                            />
                                            {cvvError && <div className="form_error">❌ {cvvError}</div>}
                                            {!cvvError && cvv && <div className="form_success">✅ Корректно</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'wallet' && (
                                <div className="payment_form">
                                    <div className="form_group">
                                        <label className="form_label">Счёт кошелька <span className="form_label_required">*</span></label>
                                        <input
                                            type="text"
                                            className={`form_input ${walletAccountError ? 'error' : walletAccount ? 'success' : ''}`}
                                            value={walletAccount}
                                            onChange={handleWalletAccountChange}
                                            placeholder="Введите счёт кошелька"
                                        />
                                        {walletAccountError && <div className="form_error">❌ {walletAccountError}</div>}
                                        {!walletAccountError && walletAccount && <div className="form_success">✅ Корректно</div>}
                                    </div>
                                </div>
                            )}

                            <div className="order_summary">
                                <div className="summary_title">📋 Итого к оплате</div>
                                <div className="summary_item">
                                    Товаров: <strong>{basket?.length || 0} шт.</strong>
                                </div>
                                <div className="summary_item">
                                    Сумма: <strong>${totalSum.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="form_actions">
                                <button
                                    type="button"
                                    className="form_btn form_btn_secondary"
                                    onClick={() => setStep(1)}
                                >
                                    ← Назад
                                </button>
                                <button
                                    type="button"
                                    className="form_btn form_btn_primary"
                                    onClick={() => validateStep2() && setStep(3)}
                                >
                                    Далее → Подтверждение
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function step3(): JSX.Element {
        return (
            <div className="buy_product_wrapper">
                <div className="buy_product_container">
                    <div className="buy_product_header">
                        <h2>✅ Подтверждение заказа</h2>
                        <div className="buy_product_step_indicator">
                            <div className="step_dot">1</div>
                            <span>Доставка</span>
                            <div className="step_dot">2</div>
                            <span>Оплата</span>
                            <div className="step_dot active">3</div>
                            <span>Подтверждение</span>
                        </div>
                    </div>

                    <div className="buy_product_content">
                        <div className="step_confirmation">
                            <div className="confirmation_section">
                                <h3>📦 Данные доставки</h3>
                                <div className="confirmation_item">
                                    <strong>ФИО:</strong> {name}
                                </div>
                                <div className="confirmation_item">
                                    <strong>Email:</strong> {email}
                                </div>
                                <div className="confirmation_item">
                                    <strong>Телефон:</strong> {phone}
                                </div>
                                <div className="confirmation_item">
                                    <strong>Адрес:</strong> {address}, {city}
                                </div>
                                {index && (
                                    <div className="confirmation_item">
                                        <strong>Почтовый индекс:</strong> {index}
                                    </div>
                                )}
                            </div>

                            <div className="confirmation_section">
                                <h3>💳 Способ оплаты</h3>
                                <div className="confirmation_item">
                                    <strong>Метод:</strong> {
                                        paymentMethod === 'card' ? 'Банковская карта' :
                                        paymentMethod === 'cash' ? 'Наличными при получении' :
                                        'Электронный кошелёк'
                                    }
                                </div>
                                {paymentMethod === 'card' && (
                                    <>
                                        <div className="confirmation_item">
                                            <strong>Карта:</strong> **** **** **** {numberCard.slice(-4)}
                                        </div>
                                        <div className="confirmation_item">
                                            <strong>Срок действия:</strong> {dataCard}
                                        </div>
                                    </>
                                )}
                                {paymentMethod === 'wallet' && (
                                    <div className="confirmation_item">
                                        <strong>Кошелёк:</strong> {walletAccount}
                                    </div>
                                )}
                            </div>

                            <div className="confirmation_section">
                                <h3>🛒 Товары в заказе</h3>
                                <div className="order_items">
                                    {basket?.map((product: Product, index: number) => (
                                        <div key={index} className="order_item">
                                            <div className="order_item_info">
                                                <div className="order_item_title">{product.title}</div>
                                                <div className="order_item_price">${product.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="order_total">
                                    <strong>Итого: ${totalSum.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="form_actions">
                                <button
                                    type="button"
                                    className="form_btn form_btn_secondary"
                                    onClick={() => setStep(2)}
                                >
                                    ← Назад
                                </button>
                                <button
                                    type="button"
                                    className="form_btn form_btn_primary"
                                    onClick={orderConfirm}
                                >
                                    ✅ Оформить заказ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function step4(): JSX.Element {
        if (!lastOrder) {
            return <div>Ошибка: заказ не найден</div>;
        }

        return (
            <div className="buy_product_wrapper">
                <div className="buy_product_container">
                    <div className="buy_product_header">
                        <h2>🎉 Заказ оформлен!</h2>
                        <div className="buy_product_step_indicator">
                            <div className="step_dot">1</div>
                            <span>Доставка</span>
                            <div className="step_dot">2</div>
                            <span>Оплата</span>
                            <div className="step_dot">3</div>
                            <span>Подтверждение</span>
                            <div className="step_dot active">4</div>
                            <span>Готово</span>
                        </div>
                    </div>

                    <div className="buy_product_content">
                        <div className="step_success">
                            <div className="success_icon">✅</div>
                            <h3>Спасибо за заказ!</h3>
                            <p>Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время.</p>

                            <div className="order_details">
                                <div className="order_detail">
                                    <strong>Номер заказа:</strong> {lastOrder.id}
                                </div>
                                <div className="order_detail">
                                    <strong>Дата:</strong> {lastOrder.datePretty}
                                </div>
                                <div className="order_detail">
                                    <strong>Сумма:</strong> ${lastOrder.total.toFixed(2)}
                                </div>
                            </div>

                            <div className="form_actions">
                                <Link to="/" className="form_btn form_btn_primary">
                                    Вернуться на главную
                                </Link>
                                <Link to="/product/myorders" className="form_btn form_btn_secondary">
                                    Посмотреть мои заказы
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 1) return step1();
    if (step === 2) return step2();
    if (step === 3) return step3();
    if (step === 4) return step4();
    return <div>Неизвестный шаг</div>;
}