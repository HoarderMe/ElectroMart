// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Landing from './components/Landing';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import CartPage from './pages/CartPage';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import CategoryPage from './components/CategoryPage';

import UserDashboard from './pages/UserDashboard';
import DashboardHome  from './components/UserDashboard/DashboardHome';
import Orders        from './components/UserDashboard/Orders';
import OrderDetails  from './components/UserDashboard/OrderDetails';
import Profile       from './components/UserDashboard/Profile';
import Addresses     from './components/UserDashboard/Addresses';
import Wishlist      from './components/UserDashboard/Wishlist';

import AdminDashboard      from './pages/AdminDashboard';
import AdminHome           from './components/AdminDashboard/AdminHome';
import AdminProductList    from './components/AdminDashboard/ProductList';
import AdminOrders         from './components/AdminDashboard/AdminOrders';
import AdminOrderDetails   from './components/AdminDashboard/AdminOrderDetails';
import Customers           from './components/AdminDashboard/Customers';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './pages/auth/Login';
import Transactions from './components/AdminDashboard/Transactions';
import Catalog from './components/Catalog/Catalog';

// Make sure this matches your Google Cloud Console client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div className="min-h-screen bg-gray-100">
            <Header />

            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/products" element={<Catalog />} />
              <Route path="/category/:category" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<SignInForm />} />
              <Route path="/register" element={<SignUpForm />} />
              <Route path="/electronics" element={<CategoryPage />} />
              <Route path="/electronics/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* User Dashboard (customers only) */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute roles={['customer','admin']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:orderId" element={<OrderDetails />} />
                <Route path="profile" element={<Profile />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="wishlist" element={<Wishlist />} />
              </Route>

              {/* Admin Dashboard (admins only) */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminHome />} />
                <Route path="products" element={<AdminProductList />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:orderId" element={<AdminOrderDetails />} />
                <Route path="customers" element={<Customers />} />
                <Route path="transactions" element={<Transactions />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
