import { useContext } from "react"
import { FavouritesMassive } from "./favourites.jsx"
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/favorites.css"

export function CreateFavorites() {
    const { favourites, deleteFavorites } = useContext(FavouritesMassive)

    if (!favourites) {
        return <h1>Ошибка: контент для избраного не инициализирован</h1>
    }

    return (
        <div>
            <h1 className='title_list'>PerfectShop</h1>
            <Link className="return_main_page" to='/'><FaArrowLeft /></Link>
            <h1 className='favorites_title'>Избранное <FaHeart /></h1>
            <div style={{ fontSize: '14px', 
                color: '#4b5563', 
                marginLeft: '50px',
                marginTop: '10px',
                marginBottom: '10px' }}>
                    Количество товаров {favourites.length} шт.
            </div>
            
            <div>
                {favourites.length > 0 ? (
                    <div className="favorites_wrapper">
                    <main className='favorites_container'>
                        {favourites.map((fav, index) => {
                            if (!fav || !fav.images) return null
                            return (
                                <div className="card_favorite" key={index}>
                                    <div className="favorite_image_wrap">
                                        <img src={fav.images[0]} alt={fav.title}></img>
                                        <button className="favorite_remove_btn" onClick={() => deleteFavorites(index)} title="Удалить из избранного">
                                            <FaHeart />
                                        </button>
                                    </div>
                                    <p className="price_card_favorite">Цена: {fav.price}$</p>
                                    <h3 className="title_card_favorite">{fav.title}</h3>
                                </div>
                        )})}
                    </main> 
                    </div>
                ) : (
                    <div className="empty_favorites">
                        <h1>Товары отстуствуют</h1>
                    </div>
                    
                )
                }
            </div>
        </div>

    )
}