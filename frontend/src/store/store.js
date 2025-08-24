import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import wishlistReducer from './slices/wishlistSlice';
import ordersReducer from './slices/orderSlice';
import dashboardReducer from './slices/dashboardSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'auth', 'wishlist', 'products'], 
};

// Combine reducers with persist
const rootReducer = {
  products: productsReducer,
  cart: cartReducer,
  auth: authReducer,
  wishlist: wishlistReducer,
  order: ordersReducer,
  dashboard: dashboardReducer,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Persistor
export const persistor = persistStore(store);