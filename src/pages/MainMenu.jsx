import { useState, useEffect } from 'react';
import { CatalogApi } from './Catalog.jsx';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { MassiveBasket } from '../components/basket.jsx';

export function MainMenu() {
    const [products, setProducts] = useState([]);
    const [ searchProduct, setSearchProduct ] = useState('')
    const { basket, addToBasket } = useContext(MassiveBasket)
    const [ categories, setCategories ] = useState('all')
    const [ minSum, setMinSum ] = useState(0)
    const [ maxSum, setMaxSum ] = useState(0)

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

    const finalProduct = numFinalSort()

    return (
        <div>
            <h1>Добро пожаловать в PerfectShop!</h1>
            <Link to='/product/basket'>Корзина {basket.length-1}</Link>

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

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
                {finalProduct.length > 0 ?
                (finalProduct.map((product) => (
                    <div key={product.id} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
                        <img style={{width: "150px", height: "150px"}} src={product.images[0]} alt={product.title}></img>
                        <h2>{product.title}</h2>
                        <p>{product.price}</p>
                        <p>⭐ {product.rating}</p>
                        <button onClick={() => addToBasket(product)}>Добавить в корзину</button>
                        <Link to={`/product/${product.id}`}>Подробнее</Link>
                        
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