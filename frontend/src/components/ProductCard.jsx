// src/components/ProductCard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch }       from 'react-redux';
import { addToCart }         from '../store/slices/cartSlice';
import { toast }             from 'react-toastify';
import axios                 from 'axios';
import { Heart }             from 'lucide-react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(product);

  const handleWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const firstVariant = product.variants?.[0]?.variantId || null;
      await axios.post(
        'http://localhost:4000/api/wishlist',
        { productId: product.productId, variantId: firstVariant },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Added to wishlist');
    } catch {
      toast.error('Could not add to wishlist');
    }
  };

  const payload = {
    productId: Number(product.productId),
    name:      product.name,
    price:     product.price,
    image:     product.imageUrl,
    variant:   { id: 'default', name: 'Default', additionalPrice: 0 }
  };

  const handleAdd = () => {
    dispatch(addToCart(payload));
    toast.success('Added to cart');
  };

  const handleBuy = () => {
    dispatch(addToCart(payload));
    navigate('/checkout');
  };

 

  return (
    <div
      className="
        flex flex-col
        w-[300px] h-[450px]
        bg-white rounded-2xl shadow-lg
        overflow-hidden hover:shadow-xl
        transition-shadow duration-300
      "
    >
      {/* Image */}
      <Link to={`/product/${product.productId}`}>
        <div className="flex-shrink-0 h-48 bg-gray-50 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4"
          />
        </div>
      </Link>

      {/* Main content */}
      <div className="flex flex-col flex-1 px-6 py-4">
        {/* Title */}
        <Link to={`/product/${product.productId}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Description (fixed clamp area) */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-3 flex-1">
          {product.description || ' '}
        </p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">
            {product?.price?.toLocaleString('en-US', {
              style:  'currency',
              currency: 'INR'
            })}
          </span>
          <span
            className={`text-xs font-medium ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="py-2 px-4 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuy}
            disabled={product.stock === 0}
            className="py-2 px-4 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Buy Now
          </button>
        </div>

        {/* Footer row */}
        <div className="mt-4 border-t pt-4 flex items-center justify-between">
          <Link
            to={`/product/${product.productId}`}
            className="text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            View Details
          </Link>
          <button
            onClick={handleWishlist}
            className="p-1 rounded-full text-gray-400 hover:text-red-500 transition"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
