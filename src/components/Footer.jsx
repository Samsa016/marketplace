import { Link } from 'react-router-dom';
import '../styles/footer.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer_wrapper">
            <div className="footer_container">
                
                {/* Основная информация */}
                <div className="footer_section">
                    <h3 className="footer_section_title">📦 О компании</h3>
                    <div className="footer_content">
                        <p className="footer_text">
                            <strong>PerfectShop</strong> — ваш надежный партнер в мире онлайн-покупок. 
                            Мы предлагаем широкий ассортимент товаров высокого качества по доступным ценам.
                        </p>
                        <p className="footer_text">
                            Быстрая доставка, безопасные платежи и отличное обслуживание — все это для вас!
                        </p>
                    </div>
                </div>

                {/* Быстрые ссылки */}
                <div className="footer_section">
                    <h3 className="footer_section_title">🔗 Навигация</h3>
                    <ul className="footer_links">
                        <li><Link to="/">🏠 Главная</Link></li>
                        <li><a href="#catalog">📚 Каталог</a></li>
                        <li><a href="#about">ℹ️ О нас</a></li>
                        <li><a href="#contact">📞 Контакты</a></li>
                        <li><a href="#faq">❓ FAQ</a></li>
                    </ul>
                </div>


                <div className="footer_section">
                    <h3 className="footer_section_title">💬 Поддержка</h3>
                    <ul className="footer_links">
                        <li><a href="mailto:support@perfectshop.com">📧 Email поддержка</a></li>
                        <li><a href="tel:+7-999-123-45-67">☎️ Телефон</a></li>
                        <li><a href="#chat">💬 Живой чат</a></li>
                        <li><a href="#returns">🔄 Возвраты и обмены</a></li>
                        <li><a href="#shipping">📦 Доставка</a></li>
                    </ul>
                </div>


                <div className="footer_section">
                    <h3 className="footer_section_title">🌐 Следите за нами</h3>
                    <div className="social_links">
                        <a 
                            href="https://t.me/Samsa0160" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social_link telegram"
                            title="Telegram"
                        >
                            <span>📱</span> Telegram
                        </a>
                        <a 
                            href="https://vk.com/id566935190" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social_link vk"
                            title="VK"
                        >
                            <span>👥</span> VK
                        </a>

                        <a 
                            href="https://github.com/Samsa016" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social_link github"
                            title="GitHub"
                        >
                            <span>💻</span> GitHub
                        </a>
                    </div>
                </div>
            </div>


            <div className="footer_bottom">
                <div className="footer_bottom_container">
                    <p className="footer_copyright">
                        © {currentYear} <strong>PerfectShop</strong>. Все права защищены.
                    </p>
                    <div className="footer_legal">
                        <a href="#privacy">Политика конфиденциальности</a>
                        <span className="divider">•</span>
                        <a href="#terms">Условия использования</a>
                        <span className="divider">•</span>
                        <a href="#cookies">Cookies</a>
                    </div>
                </div>
                <div className="footer_developer">
                    <p>Разработано с ❤️ <strong>Samsa016</strong></p>
                </div>
            </div>
        </footer>
    );
}
