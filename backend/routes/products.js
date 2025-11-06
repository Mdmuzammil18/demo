import express from 'express';

const router = express.Router();

// Mock product data
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    description: 'Premium wireless headphones with noise cancellation',
    rating: 4.5,
    stock: 50
  },
  {
    id: 2,
    name: 'Smart Watch',
    category: 'Electronics',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    description: 'Feature-rich smartwatch with health tracking',
    rating: 4.7,
    stock: 30
  },
  {
    id: 3,
    name: 'Designer T-Shirt',
    category: 'Clothing',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    description: 'Comfortable cotton t-shirt with modern design',
    rating: 4.3,
    stock: 100
  },
  {
    id: 4,
    name: 'Running Shoes',
    category: 'Clothing',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    description: 'Lightweight running shoes for optimal performance',
    rating: 4.6,
    stock: 75
  },
  {
    id: 5,
    name: 'JavaScript: The Good Parts',
    category: 'Books',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    description: 'Essential reading for JavaScript developers',
    rating: 4.8,
    stock: 45
  },
  {
    id: 6,
    name: 'Laptop Backpack',
    category: 'Accessories',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    description: 'Durable backpack with laptop compartment',
    rating: 4.4,
    stock: 60
  }
];

// Get all products
router.get('/', (req, res) => {
  const { category, search } = req.query;
  
  let filtered = products;
  
  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  // Filter by search query
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }
  
  res.json(filtered);
});

// Get single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Get categories
router.get('/meta/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

export default router;
