import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ContextBasket } from './components/basket.jsx';
import { FavouritesProvider } from './components/favourites.jsx'
import { HistoryProduct } from './components/historyProduct.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <HistoryProduct>
      <FavouritesProvider>
        <ContextBasket>
          <App />
        </ContextBasket>
      </FavouritesProvider>
    </HistoryProduct>
  </BrowserRouter>
)