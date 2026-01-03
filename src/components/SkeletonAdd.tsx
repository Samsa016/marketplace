import React from 'react';
import { Link } from "react-router-dom"
import { CgProfile } from "react-icons/cg";
import { FaArrowLeft, FaBasketShopping, FaHeart } from "react-icons/fa6";

export function SkeletonProductInfo() {
    return (
        <div className="product_page">
            <div className="product_header">
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
            </div>

            <div className="product_container">
                <div className="product_gallery">
                    <div className="product_main_image skeleton"></div>
                    
                    <div className="product_thumbnails">
                        <div className="product_thumb skeleton"></div>
                        <div className="product_thumb skeleton"></div>
                        <div className="product_thumb skeleton"></div>
                        <div className="product_thumb skeleton"></div>
                    </div>
                </div>

                <div className="product_info">
                    <div className="skeleton" style={{ width: '80%', height: 40, marginBottom: 10 }}></div>
                    
                    <div className="skeleton" style={{ width: '40%', height: 20, marginBottom: 20 }}></div>

                    <div className="skeleton" style={{ width: '30%', height: 50, marginBottom: 20 }}></div>

                    <div className="skeleton" style={{ width: '100%', height: 15, marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ width: '90%', height: 15, marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ width: '95%', height: 15, marginBottom: 30 }}></div>

                    <div className="product_actions">
                        <div className="skeleton" style={{ flex: 1, height: 50, borderRadius: 8 }}></div>
                        <div className="skeleton" style={{ flex: 1, height: 50, borderRadius: 8 }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export function SkeletonMainMenu() {
const skeletonCards = Array(12).fill(0);

return (
        <div style={{ padding: "0px" }}>
            <div style={{ marginBottom: "140px" }}> 
                <header className='title_list'>
                    <div style={{ color: 'white', textDecoration: 'none' }}>PerfectShop</div>
                    
                    <div className="search_bar"> 
                        <div className="skeleton" style={{ width: '100%', maxWidth: 400, height: 40, borderRadius: 15, background: 'rgba(255,255,255,0.3)' }}></div>
                    </div>

                    <nav className="header-actions">
                        <div className="skeleton" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></div>
                        <div className="skeleton" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></div>
                        <div className="skeleton" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></div>
                        <div className="skeleton" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></div>
                    </nav>
                </header>
                

                <div className="filters_menu">
                     <div className="skeleton" style={{ width: 100, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.3)', margin: '0 10px' }}></div>
                     <div className="skeleton" style={{ width: 80, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.3)', margin: '0 10px' }}></div>
                     <div className="skeleton" style={{ width: 80, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.3)', margin: '0 10px' }}></div>
                </div>
            </div>

            <div className="container_cards">
                {skeletonCards.map((_, index) => (
                    <div key={index} className='cards'>
                        
                        <div className="skeleton skeleton-img"></div>
                        
                        <div style={{ width: '100%' }}>
                            <div className='skeleton' style={{ width: '40%', height: 14, marginBottom: 6 }}></div>
                            <div className='skeleton' style={{ width: '90%', height: 10, marginBottom: 4 }}></div>
                            <div className='skeleton' style={{ width: '60%', height: 10, marginBottom: 8 }}></div>
                            <div className='skeleton' style={{ width: '30%', height: 10 }}></div>
                        </div>

                        <div className="card_actions">
                            <div className='skeleton' style={{ width: 36, height: 24, borderRadius: '50%' }}></div>
                            <div className='skeleton' style={{ width: 36, height: 24, borderRadius: '50%' }}></div>
                        </div>
                    </div> 
                ))}
            </div>
        </div>
    )
}

export function SkeletonBasket() {

    const skeletonItems = Array(4).fill(0);

    return (
        <div>

            <Link className="title_list" to="/">PerfectShop</Link>
            <Link className="return_main_page" to="/"><FaArrowLeft /></Link>
            <h1 className="basket_title">Корзина <FaBasketShopping /></h1>
            
            <div style={{ 
                marginLeft: '50px',
                marginTop: '10px',
                marginBottom: '10px' 
            }}>
                <div className="skeleton" style={{ width: 150, height: 14, borderRadius: 4 }}></div>
            </div>

            <div className="basket_wrapper">
                <main className="basket_container">
                    {skeletonItems.map((_, index) => (
                        <div className="cards_basket" key={index} style={{ cursor: 'default' }}>
                            
                            <div className="skeleton skeleton-basket-img"></div>
                            <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 6 }}></div>
                            <div className="skeleton" style={{ width: '80%', height: 12, marginBottom: 12 }}></div>
                            <div className="skeleton" style={{ width: 130, height: 30, borderRadius: 15 }}></div>
                        
                        </div>
                    ))}
                </main>

                <aside className="basket_sidebar">
                    <div className="basket_summary">
                        <div className="skeleton" style={{ width: '70%', height: 24, marginBottom: 12, borderRadius: 4 }}></div>
                        
                        <div className="skeleton" style={{ width: '100%', height: 45, borderRadius: 15 }}></div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export function SkeletonFavorites() {

    const skeletonItems = Array(8).fill(0);

    return (
        <div>

            <Link className='title_list' to="/">PerfectShop</Link>
            <Link className="return_main_page" to='/'><FaArrowLeft /></Link>
            <h1 className='favorites_title'>Избранное <FaHeart /></h1>
            
            <div style={{ 
                marginLeft: '50px',
                marginTop: '10px',
                marginBottom: '10px' 
            }}>
                <div className="skeleton" style={{ width: 140, height: 14, borderRadius: 4 }}></div>
            </div>
            
            <div className="favorites_wrapper">
                <main className='favorites_container'>
                    {skeletonItems.map((_, index) => (

                        <div className="card_favorite" key={index} style={{ cursor: 'default' }}>
                            
                            <div className="skeleton skeleton-fav-img-wrap"></div>

                            <div style={{ padding: 0 }}>
                                
                                <div className="skeleton" style={{width: '50%',height: 16,margin: '12px 12px 0 12px'}}></div>
                                
                                <div className="skeleton" style={{width: '85%', height: 12,  margin: '8px 12px 4px 12px'}}></div>

                                <div className="skeleton" style={{width: '60%', height: 12, margin: '0 12px 12px 12px' }}></div>
                            </div>
                        </div>
                    ))}
                </main> 
            </div>
        </div>
    );
}

export function SkeletonOrders() {
    const skeletonOrders = Array(3).fill(0);

    return (
        <div>
            <header className='title_list'>
                <Link to="/">PerfectShop</Link>
            </header>

            <div className='order_list'>
                <Link style={{ color: 'black', marginBottom: '20px', fontSize: '20px' }} to='/'>
                    <FaArrowLeft />
                </Link>
                
                <h2 style={{ marginTop: "30px" }}>Мои заказы</h2>

                <div style={{ display: 'flex', flexWrap: 'wrap',alignItems: 'flex-start'}}>

                    {skeletonOrders.map((_, index) => (
                        <div className='order_cards' key={index}>

                            <div className="skeleton" style={{ width: '40%', height: 24, marginBottom: 12 }}></div>
            
                            <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
                            
                            <div className="skeleton" style={{ width: '50%', height: 16, marginBottom: 20 }}></div>
                            
                            <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '10px' }}>Товары в заказе:</div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="skeleton" style={{ width: '90%', height: 14 }}></div>
                                <div className="skeleton" style={{ width: '85%', height: 14 }}></div>
                                <div className="skeleton" style={{ width: '40%', height: 14 }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SkeletonHistory() {
    const skeletonItems = Array(8).fill(0);

    return (
        <div>
            <header className='title_list'>
                <Link to="/">PerfectShop</Link>
            </header>
            <Link className="return_main_page" to='/'><FaArrowLeft /></Link>
            
            <h1 className='history_title' style={{ marginTop: '100px' }}>Ваша история просмотренных товаров</h1>
            
            <div className="history_wrapper">
                <main className="history_container">
                    {skeletonItems.map((_, index) => (
                        <div className="history_card" key={index} style={{ cursor: 'default' }}>

                            <div className="skeleton skeleton-history-img"></div>

                            <div className="history_info">

                                <div className="skeleton" style={{ width: '90%', height: 14, marginBottom: 8 }}></div>
                                <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 10 }}></div>
                                
                                <div className="skeleton" style={{ width: '40%', height: 16, marginBottom: 12 }}></div>
                                
                                <div className="skeleton" style={{ width: '70%', height: 10, marginBottom: 6 }}></div>
                                <div className="skeleton" style={{ width: '80%', height: 10 }}></div>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}