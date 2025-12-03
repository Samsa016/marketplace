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
            <h1>Ваши избранные товары</h1>
            <Link to="/">Вернуться в главное меню</Link>
            <div>
                {favourites.length > 0 ? (
                    <div>
                        {favourites.map((fav, index) => {
                            if (!fav || !fav.images) return null
                            return (
                                <div key={index}>
                                    <img src={fav.images[0]} alt={fav.title} style={{ width: "150px", height: "150px" }}></img>
                                    <h3>{fav.title}</h3>
                                    <p>Цена: {fav.price}₽</p>
                                    <button onClick={() => deleteFavorites(index)}>Удалить товар из корзины</button>`
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