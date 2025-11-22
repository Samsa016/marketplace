import React from 'react';
import { MainMenu } from './pages/MainMenu.jsx';
import { Route, Routes } from 'react-router-dom';
import { ProductInfo } from './components/productInfo.jsx';
import { CreateBasket } from './components/createBasket.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainMenu />}></Route>
            <Route path="/product/basket" element={<CreateBasket />}></Route>
            <Route path="/product/:productId" element={<ProductInfo/>}></Route>
        </Routes>
    )
}

export default App