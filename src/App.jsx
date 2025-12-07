import React from 'react';
import { MainMenu } from './pages/MainMenu.jsx';
import { Route, Routes } from 'react-router-dom';
import { ProductInfo } from './components/productInfo.jsx';
import { CreateBasket } from './components/createBasket.jsx';
import { CreateFavorites } from './components/createFavorites.jsx';
import { CreateHistory } from './components/createHistory.jsx';
import { BuyProduct } from './components/buyProduct/createBuyProduct.jsx';
import { MyOrders } from './components/buyProduct/buyProduct.jsx';
import { Footer } from './components/Footer.jsx';
import './styles/palette.css';
import './styles/buyProduct.css';
import './styles/palette2.css'
import './styles/favorites.css'
import './styles/historyProd.css'
import './styles/myOrders.css'
import './styles/productInfo.css'
import './styles/footer.css'


function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainMenu />}></Route>
                <Route path="/product/basket" element={<CreateBasket />}></Route>
                <Route path="/product/:productId" element={<ProductInfo />}></Route>
                <Route path="/product/favourites" element={<CreateFavorites />}></Route>
                <Route path="/product/historyViews" element={<CreateHistory />}></Route>
                <Route path="/product/buy" element={<BuyProduct />}></Route>
                <Route path="/product/myorders" element={<MyOrders />}></Route>
            </Routes>
            <Footer />
        </>
    )
}

export default App