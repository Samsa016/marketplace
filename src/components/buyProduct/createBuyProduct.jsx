import { useState, useContext } from 'react'
import { MassiveBasket } from "../basket.jsx";
import { Link } from "react-router-dom"


export function BuyProduct() {
    
    const { basket, clearBasket } = useContext(MassiveBasket)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [index, setIndex] = useState('')

    const [numberCard, setNumberCard] = useState('')
    const [dataCard, setDataCard] = useState('')
    const [cvv, setCvv] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'cash' | 'wallet'
    const [walletAccount, setWalletAccount] = useState('') 
    
    const [ step, setStep ] = useState(1)
    const [ lastOrder, setLastOrder ] = useState(null)
    const [ orderInfo, setOrderInfo ] = useState(() => {
        try {
            const s = localStorage.getItem('orders');
            return s ? JSON.parse(s) : [];
        } catch (e) {
            console.error("Ошибка при чтении заказов из localStorage:", e);
            return [];
        }
    })
    

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

        setOrderInfo(updateOrder);
        localStorage.setItem('orders', JSON.stringify(updateOrder));
        console.log('Order confirmed:', newOrder);
        setLastOrder(newOrder);

        clearBasket();
        setStep(4);

        }

    function step1() {
        return (
            <div>
                <h2>Данные доставки</h2>

                <p>
                    <div>ФИО</div>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </p>

                <p>
                    <div>Email</div>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                    />
                </p>

                <p>
                    <div>Телефон</div>
                    <input
                        type='tel'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 (9xx) xxx-xx-xx"
                    />
                </p>

                <p>
                    <div>Адрес</div>
                    <input
                        type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Улица, дом, квартира"
                    />
                </p>

                <p>
                    <div>Город</div>
                    <input
                        type='text'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </p>

                <p>
                    <div>Индекс</div>
                    <input
                        type='text'
                        value={index}
                        onChange={(e) => setIndex(e.target.value)}
                        placeholder="Postal code"
                    />
                </p>

                <div style={{ marginTop: 12 }}>
                    <Link to="/product/basket">Отменить заказ и вернуться в корзину</Link>
                    <button type="button" style={{ marginLeft: 8 }} onClick={() => setStep(2)}>Далее →</button>
                </div>
            </div>
        )
    }

    function step2() {
        return (
            <div>
                <h2>Способ оплаты</h2>

                <div>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                        /> Банковская карта
                    </label>
                </div>

                <div style={{ marginLeft: 16, marginTop: 8 }}>
                    {paymentMethod === 'card' && (
                        <>
                            <p>
                                <div>Номер карты</div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={numberCard}
                                    onChange={(e) => setNumberCard(e.target.value)}
                                    placeholder="xxxx xxxx xxxx xxxx"
                                    maxLength={19}
                                />
                            </p>

                            <p>
                                <div>Срок действия</div>
                                <input
                                    type="month"
                                    value={dataCard}
                                    onChange={(e) => setDataCard(e.target.value)}
                                />
                            </p>

                            <p>
                                <div>CVV</div>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="123"
                                    maxLength={4}
                                />
                            </p>
                        </>
                    )}
                </div>

                <div style={{ marginTop: 8 }}>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                        /> Наличные при получении
                    </label>
                    {paymentMethod === 'cash' && (
                        <div style={{ marginLeft: 16, marginTop: 6 }}>
                            <small>Оплата курьеру при доставке. Подготовьте точную сумму.</small>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 8 }}>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="wallet"
                            checked={paymentMethod === 'wallet'}
                            onChange={() => setPaymentMethod('wallet')}
                        /> Электронный кошелёк
                    </label>

                    {paymentMethod === 'wallet' && (
                        <div style={{ marginLeft: 16, marginTop: 6 }}>
                            <p>
                                <div>Аккаунт кошелька (номер или email)</div>
                                <input
                                    type="text"
                                    value={walletAccount}
                                    onChange={(e) => setWalletAccount(e.target.value)}
                                    placeholder="Номер или email кошелька"
                                />
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 12 }}>
                    <button type="button" onClick={() => setStep(1)}>← Назад</button>
                    <button type="button" style={{ marginLeft: 8 }} onClick={() => setStep(3)}>Далее →</button>
                </div>
            </div>
        )
    }

    function step3() {
        return (
            <div>
                <h2>Подтверждение заказа</h2>
                <p>
                    <div>
                        <p>Доставка</p>
                        <p>{name}</p>
                        <p>{email}</p>
                        <p>{phone}</p>
                        <p>{address}</p>
                    </div>
                </p>
                <p>
                    <div>
                        <div>Товары</div>
                        {basket && basket.length > 0 ? (
                            basket.map((prod, idx) => (
                                <div key={idx}>{prod.title} 1 × {`${prod.price}$`} = {`${prod.price}$`} </div>
                            ))
                        ) : (
                            <div>Нет товаров</div>
                        )}
                        <p>Доставка 0$</p>
                        <p>ИТОГО: {totalSum}</p>
                    </div>
                </p>
                <button onClick={() => setStep(2)}>Назад</button>
                <button onClick={() => orderConfirm()}>Подтвердить заказ</button>
            </div>
        )
    }

    function step4() {
        return (
            <div>
                <p>
                    <h3>Заказ успешно оформлен</h3>
                </p>
                <p>
                    <div>УСПЕХ!</div>
                    <p>Ваш заказ {lastOrder?.id ?? '—'} принят в обработку</p>
                    <p>Дата заказа: {lastOrder?.datePretty ?? '—'}</p>
                    <p>
                        <p>Статус заказа</p>
                        <p>Оформлен</p>
                        <p>Подтвержден</p>
                        <p>Отправлен</p>
                        <p>Доставлен</p>
                        <p>На email отправленно подтверждение</p>
                    </p>
                    <Link to='/' onClick={() => clearBasket()}>На главную</Link>
                </p>
            </div>
        )
    }

    // Условное отображение шагов
    if (step === 1) return step1()
    if (step === 2) return step2()
    if (step === 3) return step3()
    if (step === 4) return step4()
} 
// ┌─────────────────────────────────────┐
// │           ДАННЫЕ ДОСТАВКИ           │
// ├─────────────────────────────────────┤
// │ [ФИО*]           [_______________]  │
// │ [Email*]          [_______________] │
// │ [Телефон*]        [_______________] │
// │ [Адрес*]          [_______________] │
// │ [Город*]          [_______________] │
// │ [Индекс]          [_______________] │
// │                                     │
// │ [◄ Назад в корзину] [Далее ►]       │
// └─────────────────────────────────────┘



// [Прогресс-бар: ●●○○] 
// ┌─────────────────────────────────────┐
// │           СПОСОБ ОПЛАТЫ            │
// ├─────────────────────────────────────┤
// │ (○) 💳 Банковская карта             │
// │     [Номер карты] [_______________] │
// │     [Срок действия] [____________]  │
// │     [CVV]           [___]           │
// │                                     │
// │ ( ) 💵 Наличные при получении       │
// │     "Оплата курьеру при доставке"   │
// │                                     │
// │ ( ) 🌐 Электронный кошелек          │
// │     "Qiwi, YooMoney, WebMoney"      │
// │                                     │
// │ [◄ Назад]          [Далее ►]        │
// └─────────────────────────────────────┘

// [Прогресс-бар: ●●●○] 
// ┌─────────────────────────────────────┐
// │         ПОДТВЕРЖДЕНИЕ ЗАКАЗА       │
// ├─────────────────────────────────────┤
// │ ┌─ ДОСТАВКА ──────────────────────┐ │
// │ │ Иван Иванов                     │ │
// │ │ example@mail.com                │ │
// │ │ +7 (999) 123-45-67              │ │
// │ │ г. Москва, ул. Примерная, д. 1  │ │
// │ └─────────────────────────────────┘ │
// │                                     │
// │ ┌─ ТОВАРЫ ────────────────────────┐ │
// │ │ 📱 iPhone 13   1 × 999$ = 999$  │ │
// │ │ 💻 MacBook Pro 1 × 1999$ = 1999$│ │
// │ │                                 │ │
// │ │ Доставка: 0$                    │ │
// │ │ ИТОГО: 2998$                    │ │
// │ └─────────────────────────────────┘ │
// │                                     │
// │ [◄ Назад]  [✅ Подтвердить заказ]   │
// └─────────────────────────────────────┘
// [Прогресс-бар: ●●●●] 
// ┌─────────────────────────────────────┐
// │        ЗАКАЗ УСПЕШНО ОФОРМЛЕН!     │
// ├─────────────────────────────────────┤
// │            🎉 УСПЕХ!               │
// │                                     │
// │ Ваш заказ #123456 принят в обработку│
// │                                     │
// │ ┌─ СТАТУС ЗАКАЗА ─────────────────┐ │
// │ │ 📝 Оформлен       ●──○──○──○    │ │
// │ │ ✅ Подтвержден                  │ │
// │ │ 🚚 Отправлен                    │ │
// │ │ 🏠 Доставлен                    │ │
// │ └─────────────────────────────────┘ │
// │                                     │
// │ На email отправлено подтверждение   │
// │                                     │
// │ [📦 Посмотреть заказ] [🏠 На главную]│
// └─────────────────────────────────────┘