# ShopHub - Modern E-commerce Platform

A modern, feature-rich e-commerce prototype built with React, Express, and TailwindCSS. Browse products, manage your shopping cart, and enjoy a seamless shopping experience with a beautiful, responsive interface.

![ShopHub](https://img.shields.io/badge/Demo-Live-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![Express](https://img.shields.io/badge/Express-4.18-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan)

## 🚀 Features

- **Product Catalog**: Browse a curated selection of products across multiple categories
- **Category Filtering**: Filter products by Electronics, Clothing, Books, and Accessories
- **Shopping Cart**: Full cart management with add/remove items and quantity adjustments
- **Product Details**: View detailed information including ratings, prices, and stock levels
- **Modern UI**: Beautiful interface built with React, TailwindCSS, and Framer Motion
- **Smooth Animations**: Engaging user experience with fluid transitions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **State Management**: Efficient cart state management using Zustand

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Jira account (optional - for MCP integration)

## 🛠️ Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd /Users/muzammil/Desktop/demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** (Optional)
   ```env
   # Server Configuration
   PORT=3001
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Individual Services
```bash
# Run only frontend
npm run client

# Run only backend
npm run server
```

## 📱 Application Structure

```
demo/
├── backend/
│   ├── server.js              # Express server
│   └── routes/
│       └── products.js        # Products API
├── src/
│   ├── components/
│   │   └── Layout.jsx         # App layout with navigation
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Products.jsx       # Product catalog
│   │   └── Cart.jsx           # Shopping cart
│   ├── store/
│   │   └── cartStore.js       # Zustand state management
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Express** - Web framework
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables


## 🛍️ Using the Application

1. **Browse Products**: Navigate to the Products page to see all available items
2. **Filter by Category**: Click on category buttons to filter products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage Cart**: View your cart, adjust quantities, or remove items
5. **Checkout**: Review your order summary and proceed to checkout

## 🔧 API Endpoints

### Products API
- `GET /api/products` - Get all products (supports `?category=` query param)
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/meta/categories` - Get all available categories
- `GET /api/health` - Health check endpoint

## 🎨 Customization

### Adding Products
Edit `backend/routes/products.js` to add more products:

```javascript
const products = [
  {
    id: 1,
    name: 'Product Name',
    category: 'Category',
    price: 99.99,
    image: 'https://...',
    description: 'Description',
    rating: 4.5,
    stock: 50
  },
  // Add more...
];
```

### Styling
- Modify `tailwind.config.js` for theme customization
- Edit `src/index.css` for global styles
- Update color scheme in `tailwind.config.js` primary colors

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3002
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
- Check that backend is running on port 3001
- Verify proxy settings in `vite.config.js`
- Check browser console for CORS errors

## 🔗 MCP Integrations

This project uses **Model Context Protocol (MCP)** for all external integrations - simple, consistent, and AI-ready!

### Why MCP-Only?
- ✅ **Simple** - One integration pattern for everything
- ✅ **Consistent** - Same approach for Jira & GitHub
- ✅ **AI-Ready** - Built for Copilot workflows
- ✅ **Clean** - Fewer files, easier maintenance

### Jira MCP (✅ Working)

```bash
npm run test:jira  # Already passing!
```

**Documentation:** [JIRA-MCP-SETUP.md](JIRA-MCP-SETUP.md)

### GitHub MCP (⚠️ Setup Required)

```bash
brew install gh      # Install GitHub CLI
gh auth login        # Authenticate
npm run test:github  # Test connection
```

**Documentation:** [GITHUB-MCP-SETUP.md](GITHUB-MCP-SETUP.md)

### Complete Integration Guide

📗 [MCP-INTEGRATIONS.md](MCP-INTEGRATIONS.md) - Complete setup & usage

### Automation Workflows

- 🤖 [Copilot Automation](copilot-automation.md) - AI-powered workflows
- 🔄 **Jira → Code → GitHub PR** - Full automation
- 📝 Automated ticket management

## 🚀 Future Enhancements

- User authentication and accounts
- Product search functionality
- Product reviews and ratings
- Wishlist feature
- Order history
- Payment gateway integration
- Admin dashboard for product management
- Jira ticket-driven feature development

## 📝 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Built with ❤️ for modern e-commerce**
