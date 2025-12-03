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
        <div>
            <h1>Добро пожаловать в PerfectShop!</h1>
            <Link to='/product/basket'>Корзина {basket.length}</Link>
            <Link to='/product/favourites'>Избранное {favourites.length}</Link>
            <Link to='/product/historyViews'>История просмотра товаров</Link>
            <Link to='/product/myorders'>Мои заказы</Link>

            <input 
                type="text" onChange={(name) =>  setSearchProduct(name.target.value)} 
                value={searchProduct}
                placeholder='Поиск Товара'>
            </input>

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

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
                {sortFullProduct.length > 0 ?
                (sortFullProduct.map((product) => (
                    <div key={product.id} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
                        <img style={{width: "150px", height: "150px"}} src={product.images[0]} alt={product.title}></img>
                        <h2>{product.title}</h2>
                        <p>{product.price}</p>
                        <p>⭐ {product.rating}</p>
                        <button onClick={() => addToBasket(product)}>Добавить в корзину</button>
                        <button onClick={() => addFavourites(product)}>Добавить в избранное</button>
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