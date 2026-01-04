# 🛍️ PerfectShop - Modern E-Commerce Marketplace

![PerfectShop Logo](https://img.shields.io/badge/PerfectShop-E--Commerce-blue?style=for-the-badge&logo=shopping-cart)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite)
![YooKassa](https://img.shields.io/badge/YooKassa-Payment%20Gateway-orange?style=flat-square)

A full-featured, modern e-commerce marketplace built with React, TypeScript, and FastAPI. Experience seamless shopping with advanced features like user authentication, shopping cart, favorites, order history, secure payments via YooKassa, and responsive design.

## ✨ Features

### 🛒 Core Shopping Experience
- **Product Catalog**: Browse through a diverse collection of products with detailed information
- **Advanced Search & Filters**: Find products by name, category, and price range
- **Product Details**: Comprehensive product pages with images, reviews, and specifications
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👤 User Management
- **User Registration & Authentication**: Secure JWT-based authentication system with form validation
- **User Profiles**: Personalized shopping experience with account management
- **Order History**: Track all your purchases and order details
- **Local Storage Migration**: Seamless transfer of cart and favorites from local storage to account upon login

### 🛍️ Shopping Features
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Favorites/Wishlist**: Save products for later with a dedicated favorites section
- **View History**: Track recently viewed products
- **Order Management**: Create orders, process payments, and view order status
- **Smooth Animations**: Beautiful micro-interactions powered by Framer Motion

### 💳 Payment & Orders
- **Secure Payments**: Integrated YooKassa payment gateway for safe transactions
- **Webhook Integration**: Asynchronous payment status updates via webhooks
- **Order Processing**: Automated order creation and status tracking
- **Payment Success Page**: Confirmation page after successful payment

### 🎨 Design & UX
- **Modern UI**: Clean, professional design with consistent branding
- **Intuitive Navigation**: Easy-to-use interface with clear visual hierarchy
- **Loading States**: Smooth loading experiences and error handling
- **Toast Notifications**: User-friendly feedback for all actions
- **Form Validation**: Client-side validation for login, registration, and order forms

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern React with latest features
- **TypeScript 5.9.3** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - Beautiful icon library
- **React Toastify** - Toast notifications

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **JWT** - JSON Web Token authentication
- **Passlib** - Password hashing
- **Pydantic** - Data validation
- **YooKassa** - Payment gateway integration
- **httpx** - Asynchronous HTTP client for external API calls

### Styling
- **Custom CSS** - Modular, maintainable stylesheets
- **CSS Variables** - Consistent color palette and theming
- **Responsive Design** - Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketplace
   ```

2. **Backend Setup**
   ```bash
   cd src/backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   pip install fastapi uvicorn sqlalchemy pydantic passlib[bcrypt] python-jose[cryptography] yookassa httpx
   ```

3. **Payment Gateway Configuration**
   - Sign up for a YooKassa account at [yookassa.ru](https://yookassa.ru)
   - Get your `account_id` and `secret_key`
   - Update the credentials in `src/backend/main.py`:
     ```python
     Configuration.account_id = 'your_account_id'
     Configuration.secret_key = 'your_secret_key'
     ```
   - Configure webhook URL in YooKassa dashboard: `http://your-domain.com/webhook`

4. **Frontend Setup**
   ```bash
   # From the root directory
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd src/backend
   # Activate virtual environment if not already
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

2. **Start the Frontend Development Server**
   ```bash
   # From the root directory
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` to access the application.

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
marketplace/
├── src/
│   ├── backend/              # Python FastAPI backend
│   │   ├── auth.py          # Authentication & authorization with local storage migration
│   │   ├── database.py      # Database configuration
│   │   ├── main.py          # Main API endpoints, orders, payments, webhooks
│   │   └── models.py        # SQLAlchemy models (User, Basket, Favorites, History, Orders)
│   ├── components/          # React components
│   │   ├── Authorization/   # Login/Register components with validation
│   │   ├── basket.tsx       # Cart context
│   │   ├── buyProduct/      # Order and payment components
│   │   │   ├── buyProduct.tsx    # Order history page
│   │   │   └── createBuyProduct.tsx # Order creation and payment flow
│   │   ├── createBasket.tsx # Cart page
│   │   ├── createFavorites.tsx # Favorites page
│   │   ├── createHistory.tsx # History page
│   │   ├── Footer.tsx       # Site footer
│   │   ├── PaymentSuccess.tsx # Payment confirmation page
│   │   ├── productInfo.tsx  # Product detail page
│   │   └── SkeletonAdd.tsx  # Loading skeletons
│   ├── context/             # React contexts
│   ├── pages/               # Main pages
│   │   ├── Catalog.tsx      # Product catalog logic
│   │   ├── MainMenu.tsx     # Homepage
│   │   └── mM.txt
│   ├── styles/              # CSS stylesheets
│   │   ├── palette.css      # Color palette & global styles
│   │   ├── registration.css # Registration page styles
│   │   ├── login.css        # Login page styles
│   │   ├── buyProduct.css   # Order and payment styles
│   │   └── ...              # Other component styles
│   ├── types/               # TypeScript type definitions
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Node.js dependencies (React, TypeScript, Framer Motion, etc.)
├── vite.config.js           # Vite configuration
└── README.md               # Project documentation
```

## 🔗 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login with local storage migration
- `GET /auth/me` - Get current user info

### Products
- `GET /products` - Get all products (from DummyJSON API)
- `GET /products/{id}` - Get product by ID
- `GET /categories/{categoryid}` - Get products by category

### User Data
- `GET /basket` - Get user's cart
- `POST /basket/add` - Add item to cart
- `POST /basket/remove` - Remove item from cart
- `GET /favorites` - Get user's favorites
- `POST /favorites/add` - Add item to favorites
- `POST /favorites/remove` - Remove item from favorites
- `GET /history` - Get user's view history
- `POST /history/add` - Add item to history

### Orders & Payments
- `POST /product/buy` - Create order and initiate payment via YooKassa
- `GET /product/myorders` - Get user's order history
- `POST /webhook` - YooKassa webhook for payment status updates

## 🎨 Design System

### Color Palette
- **Primary**: `#3b82f6` (Blue)
- **Primary Dark**: `#2563eb`
- **Gray 50**: `#f9fafb` (Background)
- **Gray 100**: `#f3f4f6` (Light backgrounds)
- **Gray 200**: `#e5e7eb` (Borders)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)
- **Warning**: `#f59e0b` (Orange)

### Typography
- **Primary Font**: Montserrat (Headings)
- **Secondary Font**: Arial (Body text)
- **Font Sizes**: Responsive scaling from 14px to 32px

### Components
- **Cards**: White backgrounds with subtle shadows
- **Buttons**: Blue primary buttons with hover effects
- **Forms**: Clean input fields with focus states
- **Navigation**: Fixed header with smooth transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Maintain consistent code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DummyJSON API** for providing sample product data
- **YooKassa** for secure payment processing
- **React Community** for excellent documentation and tools
- **FastAPI** for the amazing Python web framework
- **Open source contributors** for the libraries used


**Happy Shopping with PerfectShop! 🛍️✨**
