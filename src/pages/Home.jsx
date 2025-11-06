import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, CreditCard, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Shopping',
      description: 'Your data is protected with industry-standard encryption'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50 with quick delivery'
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'Multiple payment options for your convenience'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our customer service team is always here to help'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to
          <span className="text-primary-600"> ShopHub</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover amazing products at unbeatable prices. Shop the latest trends in electronics,
          fashion, books, and more with fast, free shipping.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/products" className="btn-primary flex items-center gap-2 text-lg px-8 py-3">
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/cart" className="btn-secondary text-lg px-8 py-3">
            View Cart
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card bg-gradient-to-br from-primary-50 to-blue-50"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Electronics', emoji: '📱' },
            { name: 'Clothing', emoji: '👕' },
            { name: 'Books', emoji: '📚' },
            { name: 'Accessories', emoji: '🎒' }
          ].map((category, index) => (
            <Link
              key={index}
              to="/products"
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-2">{category.emoji}</div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-16 card bg-gray-900 text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-gray-300 mb-6">
          Explore our curated collection of premium products with exclusive deals.
        </p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Browse Products
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
}
