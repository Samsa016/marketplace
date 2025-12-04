import { useState, useEffect } from 'react';
import { CatalogApi } from './Catalog.jsx';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { MassiveBasket } from '../components/basket.jsx';
import { FavouritesMassive } from '../components/favourites.jsx';
import { HistoryMassive } from '../components/historyProduct.jsx';


    export function SortPrice(massive, value) {
        if (value == 'all') return massive
        if (value == 'max') return [...massive].sort((number1, number2) => number2.price - number1.price)
        if (value == 'min') return [...massive].sort((number1, number2) => number1.price - number2.price)
    }

export function MainMenu() {
    const [products, setProducts] = useState([]);
    const [ searchProduct, setSearchProduct ] = useState('')
    const { basket, addToBasket } = useContext(MassiveBasket)
    const [ categories, setCategories ] = useState('all')
    const [ minSum, setMinSum ] = useState(0)
    const [ maxSum, setMaxSum ] = useState(0)
    const { favourites, addFavourites } = useContext(FavouritesMassive)
    const { addHistory } = useContext(HistoryMassive)
    const [ sortPrice, setSortPrice ] = useState('all')

    useEffect(() => {
        const fetchResponse = async () => {
            try {
                const data = await CatalogApi()();
                if (data.length > 0) {
                    setProducts(data);
                } else {
                    throw new Error("Нет продуктов для отображения");
                }
            } catch (error) {
                console.error("Ошибка при загрузке продуктов:", error);
            }
        }
        fetchResponse();
    }, [])


    const catFinalSort = () => {
        let result = products;

        if (searchProduct !== '') {
            result = result.filter((pr) => 
                pr.title.toLowerCase().includes(searchProduct.toLowerCase())
            );
        }

        if (categories !== 'all') {
            result = result.filter((cat) => 
                cat.category.toLowerCase() === categories.toLowerCase()  
            );
        }

        return result;
    }

    const filteredProduct = catFinalSort()
    
    const numFinalSort = () => {
        
        if (minSum > 0 && maxSum > 0) {
            return filteredProduct.filter((pr) => 
                pr.price >= minSum && pr.price <= maxSum
            );
        }
      
        else if (minSum > 0 && maxSum === 0) {
            return filteredProduct.filter((pr) => pr.price >= minSum);
        }
        
        else if (minSum === 0 && maxSum > 0) {
            return filteredProduct.filter((pr) => pr.price <= maxSum);
        }

        else {
            return filteredProduct;
        }
    }

    const predFinalProduct = numFinalSort()

    const sortFullProduct =  SortPrice(predFinalProduct, sortPrice)


    return (
        <div style={{padding: "0px" }}>
            <div>
                <header className='title_list'>
                    <h1>PerfectShop</h1>
                    
                    <div className="search_bar"> 
                        <input
                            type="text"
                            onChange={(e) => setSearchProduct(e.target.value)}
                            value={searchProduct}
                            placeholder='Найти на PerfectShop'
                            className='search_input'
                        />
                    </div>

                    <nav className="header-actions" aria-label="header actions">
                        <Link to="/product/basket" className="cart_widget">
                            <img
                                src="https://www.pngplay.com/wp-content/uploads/1/Online-Shopping-Cart-PNG-Background-Image.png"
                                alt="Корзина"
                            />
                            <span className="cart_label">Корзина</span>
                            <span className="cart_count">{basket.length}</span>
                        </Link>
                    </nav>
                </header>

                <div className='main_content'>
                    <Link to='/product/basket'>Корзина {basket.length}</Link>
                    <Link to='/product/favourites'>Избранное {favourites.length}</Link>
                    <Link to='/product/historyViews'>История просмотра товаров</Link>
                    <Link to='/product/myorders'>Мои заказы</Link>
                </div>
            </div>





            <select onChange={(pr) => setCategories(pr.target.value)} value={categories}>
                <option value="all">Все категории</option>
                <option value="beauty">Красота</option>
                <option value="fragrances">Духи</option>
                <option value="furniture">Мебель</option>
                <option value="groceries">Бакалея</option>
            </select>
            
            <input 
                placeholder='Мин Цена'
                onChange={(num) => setMinSum(parseInt(num.target.value))}
                value={minSum}
                type='number'
            ></input>

            <input 
                placeholder='Макс Цена'
                onChange={(num) => setMaxSum(parseInt(num.target.value))}
                value={maxSum}
                type='number'
            ></input>

            <select onChange={(sortPr) => setSortPrice(sortPr.target.value)} value={sortPrice}>
                <option value='all'>Сортировать по цене</option>
                <option value='max'>Сортировать по возврастанию</option>
                <option value='min'>Сортировать по убыванию</option>
            </select>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: "10px", marginTop: "20px" }}>
                {sortFullProduct.length > 0 ?
                (sortFullProduct.map((product) => (
                    <div key={product.id} style={{margin: "10px", padding: "10px" }} className='cards'>
                        <img style={{width: "200px", height: "250px"}} src={product.images[0]} alt={product.title}></img>
                        <p className='price_card'>{product.price}$</p>
                        <p className='title_card'>{product.title}</p>
                        <p>⭐ {product.rating}</p>
                        <button className='basket_button' onClick={() => addToBasket(product)}><img src="https://www.pngplay.com/wp-content/uploads/1/Online-Shopping-Cart-PNG-Background-Image.png" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}></img></button>
                        <button className='favor_button' onClick={() => addFavourites(product)}><img className='favor_like' src="https://w7.pngwing.com/pngs/714/146/png-transparent-heart-favorite-shopping-icon.png" style={{ width: '30px', height: '30px', borderRadius: '50%'}}></img></button>
                        <Link to={`/product/${product.id}`} onClick={() => addHistory(product)}>Подробнее</Link>
                        
                    </div>    
                    )
                )
            ) : (
                 <h1>Товары не найдены</h1>
            )
            }
            </div>
        </div>
    )
}