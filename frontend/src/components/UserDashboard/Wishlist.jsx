import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:4000/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWishlistItems(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/wishlist/${wishlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Remove item from state
      setWishlistItems(wishlistItems.filter(item => item.wishlistId !== wishlistId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading wishlist: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Your wishlist is empty</p>
          <Link
            to="/products"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.wishlistId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                {item.Product.imageUrl && (
                  <img
                    src={item.Product.imageUrl}
                    alt={item.Product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <button
                  onClick={() => handleRemoveFromWishlist(item.wishlistId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.Product.name}
                </h3>
                {item.Variant && (
                  <p className="text-sm text-gray-500 mb-2">
                    Variant: {item.Variant.name}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-900">
                    ${(
                      parseFloat(item.Product.price) +
                      (item.Variant ? parseFloat(item.Variant.additionalPrice) : 0)
                    ).toFixed(2)}
                  </p>
                  <Link
                    to={`/products/${item.Product.productId}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 