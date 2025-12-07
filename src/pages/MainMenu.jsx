import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [ selectedProduct, setSelectedProduct ] = useState(null)
    const cartRef = useRef(null)
    const favoriteRef = useRef(null)

    const [flyItem, setFlyItem] = useState(null)
    const [flyFavorite, setFlyFavorite] = useState(null)

    const handleAddToBasket = (product, e) => {
        try {

            addToBasket(product)


            const card = e.currentTarget.closest('.cards')
            if (!card) return
            const img = card.querySelector('img')
            if (!img || !cartRef.current) return

            const imgRect = img.getBoundingClientRect()
            const cartRect = cartRef.current.getBoundingClientRect()

            const start = {
                left: imgRect.left + window.scrollX,
                top: imgRect.top + window.scrollY,
                width: imgRect.width,
                height: imgRect.height,
                src: img.src
            }

            const target = {
                left: cartRect.left + window.scrollX + cartRect.width / 2,
                top: cartRect.top + window.scrollY + cartRect.height / 2
            }

            setFlyItem({ start, target })

            setTimeout(() => setFlyItem(null), 700)
        } catch (err) {
            console.error('fly animation error', err)
        }
    }

    const handleAddToFavourites = (product, e) => {
        try {
            addFavourites(product)

            const card = e.currentTarget.closest('.cards')
            if (!card) return
            const img = card.querySelector('img')
            if (!img || !favoriteRef.current) return

            const imgRect = img.getBoundingClientRect()
            const favRect = favoriteRef.current.getBoundingClientRect()

            const start = {
                left: imgRect.left + window.scrollX,
                top: imgRect.top + window.scrollY,
                width: imgRect.width,
                height: imgRect.height,
                src: img.src
            }

            const target = {
                left: favRect.left + window.scrollX + favRect.width / 2,
                top: favRect.top + window.scrollY + favRect.height / 2
            }

            setFlyFavorite({ start, target })

            setTimeout(() => setFlyFavorite(null), 700)
        } catch (err) {
            console.error('fly favorite animation error', err)
        }
    }

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

    const openModal = (product) => {
        setSelectedProduct(product)
    }

    const closeModal = () => {
        setSelectedProduct(null)
    }

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
                                ref={cartRef}
                                src="https://www.pngplay.com/wp-content/uploads/1/Online-Shopping-Cart-PNG-Background-Image.png"
                                alt="Корзина"
                            />
                            <span className="cart_label">Корзина</span>
                            <span className="cart_count">{basket.length}</span>
                        </Link>

                        <Link to='/product/favourites' className="cart_widget">
                        <img 
                            ref={favoriteRef}
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
                        <div className="image_wrap">
                            <Link to={`/product/${product.id}`} onClick={() => addHistory(product)} aria-label={`Открыть товар ${product.title}`}>
                                <img src={product.images[0]} alt={product.title} />
                            </Link>

                            <button
                                className="modal_button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(product);
                                }}
                                type="button"
                            >
                                Быстрый просмотр
                            </button>
                        </div>
                        
                        <Link to={`/product/${product.id}`} onClick={() => addHistory(product)} aria-label={`Открыть товар ${product.title}`}>
                            <p className='price_card'>{product.price}$</p>
                            <p className='title_card'>{product.title}</p>
                            <p className='rating_card'>⭐ {product.rating}</p>
                        </Link>


                        <div className="card_actions">
                            <button className='basket_button' onClick={(e) => handleAddToBasket(product, e)}>
                                <img src="https://www.pngplay.com/wp-content/uploads/1/Online-Shopping-Cart-PNG-Background-Image.png" alt="Добавить в корзину" />
                            </button>
                            <button className='favor_button' onClick={(e) => handleAddToFavourites(product, e)}>
                                <img className='favor_like' src="https://i2.wp.com/getdrawings.com/vectors/vector-heart-png-15.png" alt="В избранное" />
                            </button>
                        </div>
                    </div> 
                    )
                )
            ) : (
                 <h1>Товары не найдены</h1>
            )
            }
            </div>

            <AnimatePresence>
                {flyItem && (
                    <motion.img
                        src={flyItem.start.src}
                        initial={{ left: flyItem.start.left, top: flyItem.start.top, width: flyItem.start.width, height: flyItem.start.height, opacity: 1 }}
                        animate={{ left: flyItem.target.left - flyItem.start.width / 2, top: flyItem.target.top - flyItem.start.height / 2, scale: 0.22, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ position: 'fixed', zIndex: 3000, pointerEvents: 'none' }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {flyFavorite && (
                    <motion.img
                        src={flyFavorite.start.src}
                        initial={{ left: flyFavorite.start.left, top: flyFavorite.start.top, width: flyFavorite.start.width, height: flyFavorite.start.height, opacity: 1 }}
                        animate={{ left: flyFavorite.target.left - flyFavorite.start.width / 2, top: flyFavorite.target.top - flyFavorite.start.height / 2, scale: 0.22, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ position: 'fixed', zIndex: 3000, pointerEvents: 'none' }}
                    />
                )}
            </AnimatePresence>

            {selectedProduct && (
                <div className='modal_overlay' onClick={closeModal}>
                    <div className='modal_content' onClick={(e) => e.stopPropagation()}>
                        <button className="modal_close" onClick={closeModal}>✕</button>

                        <div className="modal_body">

                            <div className='modal_image_section'>
                                <img src={selectedProduct?.images[0] || ''} alt={selectedProduct.title} className='modal_image'></img>
                            </div>

                            <div className='modal_info_section'>
                                <h2 className='modal_title'>{selectedProduct.title}</h2>
                                <p className="modal_brand"> <strong>Бренд:</strong> {selectedProduct.brand}</p>
                                <p className="modal_category"> <strong>Категория:</strong> {selectedProduct.category}</p>
                                <p className="modal_rating"> <strong>⭐ Рейтинг:</strong> {selectedProduct.rating}</p>

                                <p className='modal_description'> <strong>Описание: </strong>{selectedProduct.description || 'описание не доступно'}</p>
                                
                                <div className="modal_price_section">
                                    <span className="modal_price">{selectedProduct.price}$</span>
                                </div>

                                <div className="modal_actions">
                                    
                                    <button
                                    className="modal_btn modal_btn_primary"
                                    onClick={() => {
                                        addToBasket(selectedProduct)
                                        closeModal()
                                    }}>
                                        🛒 Добавить в корзину
                                    </button>
                                    
                                    <button
                                    className='modal_btn modal_btn_secondary'
                                    onClick={() => {
                                        addFavourites(selectedProduct)
                                        closeModal()
                                    }}>
                                        ❤️ В избранное
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}