# 🛍️ PerfectShop - Modern E-Commerce Marketplace

![PerfectShop Logo](https://img.shields.io/badge/PerfectShop-E--Commerce-blue?style=for-the-badge&logo=shopping-cart)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite)

A full-featured, modern e-commerce marketplace built with React, TypeScript, and FastAPI. Experience seamless shopping with advanced features like user authentication, shopping cart, favorites, order history, and responsive design.

## ✨ Features

### 🛒 Core Shopping Experience
- **Product Catalog**: Browse through a diverse collection of products with detailed information
- **Advanced Search & Filters**: Find products by name, category, and price range
- **Product Details**: Comprehensive product pages with images, reviews, and specifications
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👤 User Management
- **User Registration & Authentication**: Secure JWT-based authentication system
- **User Profiles**: Personalized shopping experience with account management
- **Order History**: Track all your purchases and order details

### 🛍️ Shopping Features
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Favorites/Wishlist**: Save products for later with a dedicated favorites section
- **View History**: Track recently viewed products
- **Smooth Animations**: Beautiful micro-interactions powered by Framer Motion

### 🎨 Design & UX
- **Modern UI**: Clean, professional design with consistent branding
- **Intuitive Navigation**: Easy-to-use interface with clear visual hierarchy
- **Loading States**: Smooth loading experiences and error handling
- **Toast Notifications**: User-friendly feedback for all actions

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
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
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
│   │   ├── auth.py          # Authentication & authorization
│   │   ├── database.py      # Database configuration
│   │   ├── main.py          # Main API endpoints
│   │   ├── models.py        # SQLAlchemy models
│   │   └── requirements.txt # Python dependencies
│   ├── components/          # React components
│   │   ├── Authorization/   # Login/Register components
│   │   ├── basket.tsx       # Cart context
│   │   ├── buyProduct/      # Order components
│   │   ├── createBasket.tsx # Cart page
│   │   ├── createFavorites.tsx # Favorites page
│   │   ├── createHistory.tsx # History page
│   │   ├── Footer.tsx       # Site footer
│   │   └── productInfo.tsx  # Product detail page
│   ├── context/             # React contexts
│   ├── pages/               # Main pages
│   │   ├── Catalog.tsx      # Product catalog logic
│   │   ├── MainMenu.tsx     # Homepage
│   │   └── mM.txt
│   ├── styles/              # CSS stylesheets
│   │   ├── palette.css      # Color palette & global styles
│   │   ├── registration.css # Registration page styles
│   │   ├── login.css        # Login page styles
│   │   └── ...              # Other component styles
│   ├── types/               # TypeScript type definitions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Node.js dependencies
├── vite.config.js           # Vite configuration
└── README.md               # Project documentation
```

## 🔗 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID

### User Data
- `GET /basket` - Get user's cart
- `POST /basket` - Add item to cart
- `DELETE /basket/{item_id}` - Remove item from cart
- `GET /favorites` - Get user's favorites
- `POST /favorites` - Add item to favorites
- `DELETE /favorites/{item_id}` - Remove item from favorites

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
- **React Community** for excellent documentation and tools
- **FastAPI** for the amazing Python web framework
- **Open source contributors** for the libraries used


**Happy Shopping with PerfectShop! 🛍️✨**
