# ShopHub - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm run dev
```

### 3. Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📱 What You'll See

### Home Page
- Welcome banner with ShopHub branding
- Feature highlights (Secure Shopping, Fast Delivery, etc.)
- Shop by Category section
- Call-to-action buttons

### Products Page
- Product catalog with images, prices, and ratings
- Category filtering (Electronics, Clothing, Books, Accessories)
- Add to cart functionality
- Product details including stock levels

### Shopping Cart
- View all cart items
- Adjust quantities with +/- buttons
- Remove items
- Order summary with totals
- Proceed to checkout button

## 🎨 Key Features

✅ **6 Sample Products** across 4 categories
✅ **Responsive Design** - works on all devices
✅ **Smooth Animations** - powered by Framer Motion
✅ **State Management** - Zustand for cart
✅ **Modern UI** - TailwindCSS styling
✅ **Fast Development** - Hot module replacement with Vite

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State**: Zustand
- **Icons**: Lucide React
- **Backend**: Express.js
- **Routing**: React Router

## 📝 Project Structure

```
src/
├── pages/
│   ├── Home.jsx       # Landing page
│   ├── Products.jsx   # Product catalog
│   └── Cart.jsx       # Shopping cart
├── components/
│   └── Layout.jsx     # Header, footer, navigation
├── store/
│   └── cartStore.js   # Cart state management
└── App.jsx            # Main app with routes

backend/
├── server.js          # Express server
└── routes/
    └── products.js    # Products API
```

## 🎯 Next Steps

1. **Customize Products**: Edit `backend/routes/products.js`
2. **Add More Categories**: Update product data
3. **Style Changes**: Modify `tailwind.config.js`
4. **Add Features**: Implement search, filters, etc.

## 💡 Tips

- The cart state persists during your session
- All product images are from Unsplash
- The app uses mock data (no database required)
- Perfect for demos and prototyping

---

**Happy Shopping! 🛍️**
