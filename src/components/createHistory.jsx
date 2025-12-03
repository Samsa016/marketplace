import { useContext } from 'react'
import { HistoryMassive } from './historyProduct.jsx'
import { Link } from 'react-router-dom'

export function CreateHistory() {
    const { historyMassive } = useContext(HistoryMassive)

    return (
        <div>
            <h1>Ваша история просмотренных заказов</h1>
            <Link to='/'>Вернуться на главную страницу</Link>
            {historyMassive.length > 0 ?
                (
                    <div>
                        {historyMassive.map((prod, index) => {
                            if (!prod || !prod.images) return null
                            
                            return (
                                <div key={index}>
                                    <img src={prod.images[0]} style={{ height: "200px", width: "200px" }}></img>
                                    <div>{prod.title}</div>
                                    <div>{prod.price}</div>
                                    <div>{prod.brand}</div>
                                    <div>{prod.tags}</div>
                                </div>
                            )

})}
                        
                    </div>
                ) : (
                    <h1>Ваша история просмотренных заказов пуста</h1>
                )
            }
        </div>
    )
}