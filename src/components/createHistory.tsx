import { useContext } from 'react'
import { HistoryMassive } from './historyProduct'
import { Link } from 'react-router-dom'
import '../styles/historyProd.css'
import { FaArrowLeft } from "react-icons/fa";
import { Product } from '../types/product'
import { HistoryContextType } from '../types/history';

export function CreateHistory(): JSX.Element {
    const hisContext = useContext<HistoryContextType | null>(HistoryMassive)

    if (!hisContext) {
        return <div>Ошибка: контекст не инициализирован</div>;
    }

    const historyMassive = hisContext.historyMassive;

    return (
        <div>
            <h1 className='title_list'>PerfectShop</h1>
            <Link className="return_main_page" to='/'><FaArrowLeft /></Link>
            <h1 className='history_title' style={{ marginTop: '100px' }}>Ваша история просмотренных товаров</h1>
            

            {historyMassive && historyMassive.length > 0 ? (
                <div className="history_wrapper">
                    <main className="history_container">
                        {historyMassive.map((prod, index) => {
                            if (!prod || !prod.images) return null
                            return (
                                <article key={index} className="history_card">
                                    <img src={prod.images[0]} alt={prod.title} className="history_image" />
                                    <div className="history_info">
                                        <div className="history_title_card">{prod.title}</div>
                                        <div className="history_price">{prod.price}$</div>
                                        {prod.brand && <div className="history_meta">Бренд: {prod.brand}</div>}
                                        {prod.tags && <div className="history_meta">Тэги: {Array.isArray(prod.tags) ? prod.tags.join(', ') : prod.tags}</div>}
                                    </div>
                                </article>
                            )
                        })}
                    </main>
                </div>
            ) : (
                <h1 className="empty_history">Ваша история просмотренных товаров пуста</h1>
            )}
        </div>
    )
}