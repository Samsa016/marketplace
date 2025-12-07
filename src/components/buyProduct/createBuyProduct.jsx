import { useState, useContext } from 'react'
import { MassiveBasket } from "../basket.jsx";
import { Link } from "react-router-dom"


export function BuyProduct() {
    
    const { basket, clearBasket } = useContext(MassiveBasket)

    const [name, setName] = useState('')
    const [ nameError, setNameError ] = useState(false)

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')


    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState('')
    
    const [address, setAddress] = useState('')
    const [ addressError, setAddressError ] = useState('')

    const [city, setCity] = useState('')
    const [ cityError, setCityError ] = useState('')

    const [index, setIndex] = useState('')

    const [numberCard, setNumberCard] = useState('')
    const [ numberCardError, setNumberCardError ] = useState('')

    const [dataCard, setDataCard] = useState('')
    const [ dataCardError, setDataCardError ] = useState('')

    const [cvv, setCvv] = useState('')
    const [ cvvError, setCvvError ] = useState('')

    const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'cash' | 'wallet'
    
    const [walletAccount, setWalletAccount] = useState('') 
    const [ walletAccountError, setWalletAccountError ] = useState('')

    const [ step, setStep ] = useState(1)
    const [ lastOrder, setLastOrder ] = useState(null)
    

    const totalSum = basket && basket.length > 0 
        ? basket.reduce((sum, product) => {
            const price = Number(product?.price) || 0;
            return sum + price;
        }, 0)
        : 0

    function formatOrderDate(d = new Date()) {
    
        const date = (d instanceof Date) ? d : new Date(d);       
           
        return {
            iso: date.toISOString(),
            pretty: date.toLocaleString('ru-RU', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })
        }
    }

    function generateOrderNumber() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        } else {
            return `${Date.now()}_${Math.random().toString(36).slice(2,9)}`; // fallback
        }
    }

    function orderConfirm() {

        const { iso, pretty } = formatOrderDate();
        const id = generateOrderNumber();

        const newOrder = {
            id,
            date: iso,
            datePretty: pretty,
            items: basket.map(prod => ({id: prod.id ?? null, title: prod.title ?? '', price: prod.price ?? 0})),
            total: totalSum,
            itemsCount: basket.length,
            customer: { name, email, phone, address, city },
            payment: { method: paymentMethod }
        };

        const existing = (() => {
            try {
                const s = localStorage.getItem('orders');
                return s ? JSON.parse(s) : [];
            } catch (e) {
                console.error("Ошибка при чтении заказов из localStorage:", e);
                return [];
            }
        })()

        const updateOrder = [...existing, newOrder];

        localStorage.setItem('orders', JSON.stringify(updateOrder));
        console.log('Order confirmed:', newOrder);
        setLastOrder(newOrder);

        clearBasket();
        setStep(4);

        }


    // ===== ВАЛИДАЦИЯ ФИО =====
    function validateName(value) {
        if (!value || value.trim() === '') {
            return 'Поле не может быть пустым';
        }

        const trimmed = value.trim();
        const words = trimmed.split(/\s+/);

        if (words.length < 2) {
            return 'Укажите имя и фамилию (минимум 2 слова)';
        }

        for (let word of words) {
            if (word.length < 2) {
                return 'Каждое слово должно содержать минимум 2 буквы';
            }

            // Только кириллица/латиница, дефисы, апострофы
            const namePattern = /^[а-яА-ЯёЁa-zA-Z\-']+$/;
            if (!namePattern.test(word)) {
                return 'Только буквы, дефисы и апострофы (нет цифр и спецсимволов)';
            }
        }

        return '';
    }

    // ===== ВАЛИДАЦИЯ EMAIL =====
    function validateEmail(value) {
        if (!value || value.trim() === '') {
            return 'Поле не может быть пустым';
        }

        // Стандартный паттерн для email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailPattern.test(value)) {
            return 'Введите корректный email (example@mail.com)';
        }

        // Дополнительная проверка на очень длинный email
        if (value.length > 254) {
            return 'Email слишком длинный (максимум 254 символа)';
        }

        return '';
    }

    function validatePhone(value) {
        if (!value || value.trim() === '') {
            return 'Поле не может быть пустым';
        }

        // Извлекаем только цифры из введенного значения
        const digitsOnly = value.replace(/\D/g, '');


        if (digitsOnly.length < 10) {
            return 'Номер телефона должен содержать минимум 10 цифр';
        }


        if (digitsOnly.length > 15) {
            return 'Номер телефона слишком длинный (максимум 15 цифр)';
        }

        // Проверяем только допустимые символы: цифры, скобки, пробелы, плюс, дефис
        const phonePattern = /^[\d\s+()\\-]+$/;
        if (!phonePattern.test(value)) {
            return 'Только цифры, скобки, пробелы, плюс и дефис';
        }

        return '';
    }

    function validateAddress(value) {
        if (!value || value.trim() === '') {
            return 'Поле не может быть пустым';
        }

        if ( value.trim().length < 10 ) {
            return 'Адрес слишком короткий (минимум 10 символов)';
        }

        const addressLen = value.trim()
        const words = addressLen.split(/\s+/)

        if (words.length < 3) {
            return 'Укажите улицу, дом и квартиру (минимум 3 слова)';
        }

        return '';
    }

    function validateCity(value) {
        if (!value || value.trim() === '') {
            return 'Поле не может быть пустым';
        }

        if ( value.trim().length < 2 ) {
            return 'Название города слишком короткое (минимум 2 символа)';
        }
        return '';
    }

    // ===== ОБРАБОТЧИКИ ИЗМЕНЕНИЯ ПОЛЕЙ =====
    function handleNameChange(e) {
        const value = e.target.value;
        setName(value);
        setNameError(validateName(value));
    }

    function handleEmailChange(e) {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
    }

    function handlePhoneChange(e) {
        const value = e.target.value;
        setPhone(value);
        setPhoneError(validatePhone(value));
    }

    function handleAddressChange(e) {
        const value = e.target.value;
        setAddress(value);
        setAddressError(validateAddress(value));
    }

    function handleCityChange(e) {
        const value = e.target.value;
        setCity(value);
        setCityError(validateCity(value));
    }

    function handleCardNumberChange(e) {
        const value = e.target.value;
        const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setNumberCard(formatted);
        setNumberCardError(validateCardNumber(formatted));
    }

    function handleCardDateChange(e) {
        const value = e.target.value;
        setDataCard(value);
        setDataCardError(validateCardDate(value));
    }

    function handleCVVChange(e) {
        const value = e.target.value;
        setCvv(value);
        setCvvError(validateCVV(value));
    }

    function handleWalletAccountChange(e) {
        const value = e.target.value;
        setWalletAccount(value);
        setWalletAccountError(validateWalletAccount(value));
    }

    // ===== ВАЛИДАЦИЯ НОМЕРА КАРТЫ =====
    function validateCardNumber(value) {
        if (!value || value.trim() === '') {
            return 'Номер карты не может быть пустым';
        }

        const digitsOnly = value.replace(/\D/g, '');

        if (digitsOnly.length < 13 || digitsOnly.length > 19) {
            return 'Номер карты должен содержать от 13 до 19 цифр';
        }

        const cardPattern = /^[\d\s]+$/;
        if (!cardPattern.test(value)) {
            return 'Только цифры и пробелы';
        }

        return '';
    }

    // ===== ВАЛИДАЦИЯ СРОКА ДЕЙСТВИЯ КАРТЫ =====
    function validateCardDate(value) {
        if (!value || value.trim() === '') {
            return 'Укажите срок действия карты';
        }

        const [year, month] = value.split('-');

        if (!year || !month) {
            return 'Некорректный формат даты';
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const cardYear = parseInt(year);
        const cardMonth = parseInt(month);

        if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
            return 'Срок действия карты истёк';
        }

        if (cardYear > currentYear + 20) {
            return 'Некорректный срок действия';
        }

        return '';
    }

    // ===== ВАЛИДАЦИЯ CVV =====
    function validateCVV(value) {
        if (!value || value.trim() === '') {
            return 'CVV не может быть пустым';
        }

        const digitsOnly = value.replace(/\D/g, '');

        if (digitsOnly.length < 3 || digitsOnly.length > 4) {
            return 'CVV должен содержать 3-4 цифры';
        }

        if (!/^\d+$/.test(value)) {
            return 'CVV может содержать только цифры';
        }

        return '';
    }

    // ===== ВАЛИДАЦИЯ КОШЕЛЬКА =====
    function validateWalletAccount(value) {
        if (!value || value.trim() === '') {
            return 'Укажите аккаунт кошелька';
        }

        const trimmed = value.trim();

        if (trimmed.length < 5) {
            return 'Аккаунт кошелька должен быть не менее 5 символов';
        }

        if (trimmed.includes('@')) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(trimmed)) {
                return 'Некорректный формат email кошелька';
            }
        }

        return '';
    }

    // ===== ВАЛИДАЦИЯ ШАГ 1 ПЕРЕД ПЕРЕХОДОМ =====
    function validateStep1() {
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

    // ===== ВАЛИДАЦИЯ ШАГ 2 ПЕРЕД ПЕРЕХОДОМ =====
    function validateStep2() {
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

    function step1() {
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
                                        onChange={(e) => setIndex(e.target.value)}
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
        )
    }

    function step2() {
        return (
            <div className="buy_product_wrapper">
                <div className="buy_product_container">
                    <div className="buy_product_header">
                        <h2>💳 Выберите способ оплаты</h2>
                        <div className="buy_product_step_indicator">
                            <div className="step_dot completed">✓</div>
                            <span>Доставка</span>
                            <div className="step_dot active">2</div>
                            <span>Оплата</span>
                            <div className="step_dot">3</div>
                            <span>Подтверждение</span>
                        </div>
                    </div>

                    <div className="buy_product_content">
                        <div className="payment_options">
                            {/* КАРТА */}
                            <div className="payment_option">
                                <input
                                    type="radio"
                                    id="payment_card"
                                    name="payment"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                />
                                <label htmlFor="payment_card">💳 Банковская карта (безопасно)</label>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="payment_details">
                                    <div className="form_group full">
                                        <label className="form_label">Номер карты <span className="form_label_required">*</span></label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={`form_input ${numberCardError ? 'error' : numberCard ? 'success' : ''}`}
                                            value={numberCard}
                                            onChange={handleCardNumberChange}
                                            placeholder="4532 1234 5678 9010"
                                            maxLength={19}
                                        />
                                        {numberCardError && <div className="form_error">❌ {numberCardError}</div>}
                                        {!numberCardError && numberCard && <div className="form_success">✅ Корректно</div>}
                                    </div>

                                    <div className="form_group">
                                        <label className="form_label">Срок действия <span className="form_label_required">*</span></label>
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
                                            type="password"
                                            inputMode="numeric"
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
                            )}

                            {/* НАЛИЧНЫЕ */}
                            <div className="payment_option">
                                <input
                                    type="radio"
                                    id="payment_cash"
                                    name="payment"
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => setPaymentMethod('cash')}
                                />
                                <label htmlFor="payment_cash">💵 Наличные при получении</label>
                            </div>

                            {paymentMethod === 'cash' && (
                                <div className="payment_details full">
                                    ℹ️ Оплата производится курьеру при доставке. Подготовьте точную сумму.
                                </div>
                            )}

                            {/* КОШЕЛЁК */}
                            <div className="payment_option">
                                <input
                                    type="radio"
                                    id="payment_wallet"
                                    name="payment"
                                    value="wallet"
                                    checked={paymentMethod === 'wallet'}
                                    onChange={() => setPaymentMethod('wallet')}
                                />
                                <label htmlFor="payment_wallet">💰 Электронный кошелёк</label>
                            </div>

                            {paymentMethod === 'wallet' && (
                                <div className="payment_details full">
                                    <div className="form_group full">
                                        <label className="form_label">Аккаунт кошелька <span className="form_label_required">*</span></label>
                                        <input
                                            type="text"
                                            className={`form_input ${walletAccountError ? 'error' : walletAccount ? 'success' : ''}`}
                                            value={walletAccount}
                                            onChange={handleWalletAccountChange}
                                            placeholder="example@yoomoney.ru или номер"
                                        />
                                        {walletAccountError && <div className="form_error">❌ {walletAccountError}</div>}
                                        {!walletAccountError && walletAccount && <div className="form_success">✅ Корректно</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="order_summary">
                            <div className="summary_title">💰 Сумма к оплате</div>
                            <div className="summary_item">
                                Товаров: <strong>{basket?.length || 0} шт.</strong>
                            </div>
                            <div className="summary_item">
                                Итого: <strong>${totalSum.toFixed(2)}</strong>
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
                                Далее → Подтвердить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function step3() {
        return (
            <div className="buy_product_wrapper">
                <div className="buy_product_container">
                    <div className="buy_product_header">
                        <h2>✅ Подтверждение заказа</h2>
                        <div className="buy_product_step_indicator">
                            <div className="step_dot completed">✓</div>
                            <span>Доставка</span>
                            <div className="step_dot completed">✓</div>
                            <span>Оплата</span>
                            <div className="step_dot active">3</div>
                            <span>Подтверждение</span>
                        </div>
                    </div>

                    <div className="buy_product_content">
                        <div className="step_confirmation">
                            <div className="confirmation_section">
                                <h3>📦 Адрес доставки</h3>
                                <div className="confirmation_item">
                                    <span>ФИО:</span>
                                    <strong>{name}</strong>
                                </div>
                                <div className="confirmation_item">
                                    <span>Email:</span>
                                    <strong>{email}</strong>
                                </div>
                                <div className="confirmation_item">
                                    <span>Телефон:</span>
                                    <strong>{phone}</strong>
                                </div>
                                <div className="confirmation_item">
                                    <span>Адрес:</span>
                                    <strong>{address}, {city}</strong>
                                </div>
                            </div>

                            <div className="confirmation_section">
                                <h3>📋 Товары в заказе</h3>
                                <div className="confirmation_items_list">
                                    {basket && basket.length > 0 ? (
                                        basket.map((prod, idx) => (
                                            <div key={idx} className="confirmation_product">
                                                <span>{prod.title}</span>
                                                <strong>${prod.price}</strong>
                                            </div>
                                        ))
                                    ) : (
                                        <div>Нет товаров</div>
                                    )}
                                </div>
                            </div>

                            <div className="confirmation_section highlight">
                                <h3>💳 Способ оплаты</h3>
                                <div className="confirmation_item">
                                    <span>Метод:</span>
                                    <strong>
                                        {paymentMethod === 'card' && '💳 Банковская карта'}
                                        {paymentMethod === 'cash' && '💵 Наличные'}
                                        {paymentMethod === 'wallet' && '💰 Электронный кошелёк'}
                                    </strong>
                                </div>
                                <div className="confirmation_item" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                                    <span>Сумма:</span>
                                    <strong style={{ fontSize: '18px', color: '#10b981' }}>${totalSum.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="order_summary">
                                <div className="summary_title">⚠️ Внимание</div>
                                <p style={{ margin: '8px 0', fontSize: '13px', color: '#4b5563' }}>
                                    Проверьте все данные перед подтверждением заказа. Вы сможете отследить заказ по номеру, который придёт на ваш email.
                                </p>
                            </div>

                            <div className="form_actions">
                                <button 
                                    type="button" 
                                    className="form_btn form_btn_secondary"
                                    onClick={() => setStep(2)}
                                >
                                    ← Изменить
                                </button>
                                <button 
                                    type="button" 
                                    className="form_btn form_btn_primary"
                                    onClick={() => orderConfirm()}
                                >
                                    ✓ Подтвердить заказ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function step4() {
        return (
            <div className="buy_product_wrapper">
                <div className="buy_product_container">
                    <div className="buy_product_header">
                        <h2>🎉 Спасибо за заказ!</h2>
                    </div>

                    <div className="buy_product_content">
                        <div className="step_success">
                            <div className="success_icon">🎊</div>
                            
                            <h2>Заказ успешно оформлен!</h2>
                            
                            <div className="order_number">
                                #{lastOrder?.id?.slice(0, 8) ?? '—'}
                            </div>

                            <p>Ваш заказ принят в обработку и уже находится в процессе подготовки.</p>
                            <p style={{ color: '#2563eb', fontWeight: '600' }}>
                                📧 Подтверждение заказа отправлено на {email}
                            </p>

                            <div className="order_summary" style={{ textAlign: 'left', marginTop: '24px' }}>
                                <div className="summary_title">📊 Статус доставки</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '18px' }}>✅</span>
                                        <span>Оформлен</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                                        <span style={{ fontSize: '18px' }}>⏳</span>
                                        <span>Подтвержден</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                                        <span style={{ fontSize: '18px' }}>📦</span>
                                        <span>Отправлен</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                                        <span style={{ fontSize: '18px' }}>🏠</span>
                                        <span>Доставлен</span>
                                    </div>
                                </div>
                            </div>

                            <div className="order_summary" style={{ marginTop: '20px', textAlign: 'left' }}>
                                <div className="summary_title">📋 Информация о заказе</div>
                                <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '12px' }}>
                                    <p style={{ margin: '8px 0' }}>
                                        <strong>Дата:</strong> {lastOrder?.datePretty ?? '—'}
                                    </p>
                                    <p style={{ margin: '8px 0' }}>
                                        <strong>Сумма:</strong> <span style={{ color: '#10b981', fontWeight: '700' }}>${lastOrder?.total?.toFixed(2) ?? '0.00'}</span>
                                    </p>
                                    <p style={{ margin: '8px 0' }}>
                                        <strong>Количество товаров:</strong> {lastOrder?.itemsCount ?? 0} шт.
                                    </p>
                                </div>
                            </div>

                            <div className="form_actions" style={{ marginTop: '32px' }}>
                                <Link 
                                    to='/' 
                                    onClick={() => clearBasket()}
                                    className="form_btn form_btn_primary"
                                >
                                    🏠 Вернуться на главную
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    if (step === 1) return step1()
    if (step === 2) return step2()
    if (step === 3) return step3()
    if (step === 4) return step4()
} 
