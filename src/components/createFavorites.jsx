import { useContext } from "react"
import { FavouritesMassive } from "./favourites.jsx"
import { Link } from "react-router-dom";

export function CreateFavorites() {
    const { favourites, deleteFavorites } = useContext(FavouritesMassive)

    if (!favourites) {
        return <h1>Ошибка: контент для избраного не инициализирован</h1>
    }

    return (
        <div>
            <h1 className='title_list'>PerfectShop</h1>
            <h1>Ваши избранные товары</h1>
            <Link to="/">Вернуться в главное меню</Link>
            <div>
                {favourites.length > 0 ? (
                    <div>
                        {favourites.map((fav, index) => {
                            if (!fav || !fav.images) return null
                            return (
                                <div key={index} className='cards' style={{ width: "210px", margin: "10px", padding: "10px" }}>
                                    <img src={fav.images[0]} alt={fav.title} style={{width: "200px", height: "250px"}}></img>
                                    <p className="price_card">Цена: {fav.price}$</p>
                                    <h3 className="title_card">{fav.title}</h3>
                                    <button onClick={() => deleteFavorites(index)}>Удалить товар из избранного</button>`
                                </div>
                        )})}
                    </div> 
                ) : (
                    <h1>Товары отстуствуют</h1>
                )
                }
            </div>
        </div>
        
    )
}