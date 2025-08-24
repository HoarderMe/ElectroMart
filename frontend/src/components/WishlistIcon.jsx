import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HeartIcon } from '@heroicons/react/24/outline';

const WishlistIcon = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const itemCount = wishlistItems?.length || 0;

  return (
    <Link to="/dashboard/wishlist" className="relative group">
      <div className="flex items-center">
        <HeartIcon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default WishlistIcon; 