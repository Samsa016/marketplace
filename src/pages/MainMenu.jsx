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

                        <Link to='/product/favourites' className="cart_widget">
                        <img 
                            src="https://i2.wp.com/getdrawings.com/vectors/vector-heart-png-15.png"
                            alt="Избранное"
                        />
                        <span className="cart_label">Избранное</span>
                        <span className="cart_count">{favourites.length}</span>   
                        </Link>

                        <Link to='/product/historyViews' className="cart_widget">
                        <img 
                            src="https://www.svgrepo.com/show/65655/clock-of-circular-shape-at-two-o-clock.svg"
                            alt="История просмотров"
                        />
                        <span className="cart_label">Недавно смотрели</span> 
                        </Link>

                        <Link to='/product/myorders' className="cart_widget">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Icons8_flat_paid.svg/1200px-Icons8_flat_paid.svg.png"
                            alt="Мои заказы"
                        />
                        <span className="cart_label">Мои заказы</span> 
                        </Link>
                    </nav>
                </header>
            </div>




            <div class="filters_menu">
                <select className='select_menu' onChange={(pr) => setCategories(pr.target.value)} value={categories}>
                    <option className="option_menu" value="all">Все категории</option>
                    <option className="option_menu" value="beauty">Красота</option>
                    <option className="option_menu" value="fragrances">Духи</option>
                    <option className="option_menu" value="furniture">Мебель</option>
                    <option className="option_menu" value="groceries">Бакалея</option>
                </select>
                
                <input 
                    className='select_menu'
                    placeholder='Мин Цена'
                    onChange={(num) => setMinSum(parseInt(num.target.value))}
                    value={minSum}
                    type='number'
                ></input>

                <input 
                    className='select_menu'
                    placeholder='Макс Цена'
                    onChange={(num) => setMaxSum(parseInt(num.target.value))}
                    value={maxSum}
                    type='number'
                ></input>

                <select className='select_menu' onChange={(sortPr) => setSortPrice(sortPr.target.value)} value={sortPrice}>
                    <option className="option_menu" value='all'>Сортировать по цене</option>
                    <option className="option_menu" value='max'>Сортировать по возврастанию</option>
                    <option className="option_menu" value='min'>Сортировать по убыванию</option>
                </select>
            </div>


            <div className="container_cards" >
                {sortFullProduct.length > 0 ?
                (sortFullProduct.map((product) => (
                    
                    <div key={product.id} style={{margin: "10px", padding: "10px" }} className='cards'>
                        <Link to={`/product/${product.id}`} onClick={() => addHistory(product)}>
                            <img src={product.images[0]} alt={product.title}></img>
                            <p className='price_card'>{product.price}$</p>
                            <p className='title_card'>{product.title}</p>
                            <p className='rating_card'>⭐ {product.rating}</p>
                        </Link>

                        <button className='basket_button' onClick={() => addToBasket(product)}><img src="https://www.pngplay.com/wp-content/uploads/1/Online-Shopping-Cart-PNG-Background-Image.png"></img></button>
                        <button className='favor_button' onClick={() => addFavourites(product)}><img className='favor_like' src="https://i2.wp.com/getdrawings.com/vectors/vector-heart-png-15.png"></img></button>
                        
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