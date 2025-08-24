// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemCount } from '../store/slices/cartSlice';
import { selectIsAuthenticated, selectUser, logout } from '../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const cartItemCount      = useSelector(selectCartItemCount);
  const isAuthenticated    = useSelector(selectIsAuthenticated);
  const user               = useSelector(selectUser);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navigation = [
    { name: 'Phone',    to: '/category/Phone'    },
    { name: 'TV',        to: '/category/TV'        },
    // { name: 'Laptops',   to: '/category/Laptops'   },
    // { name: 'Accessories', to: '/category/Accessories' },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            }
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
          Electromart
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8">
          {navigation.map(item => (
            <Link
              key={item.name}
              to={item.to}
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 
                   2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 
                   100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 transition">
                Dashboard
              </Link>
              <span className="text-gray-600 text-sm">Hi, {user?.firstName || user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-indigo-600 transition py-1"
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-indigo-600 transition py-1"
            >
              Cart ({cartItemCount})
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-indigo-600 transition py-1"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-left text-red-600 hover:text-red-800 transition py-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
