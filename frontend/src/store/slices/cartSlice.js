import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely parse localStorage
const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    return [];
  }
};

const initialState = {
  items: getInitialCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, productId, variantId, name, price, image, quantity = 1 } = action.payload;
      
      // Use variantId if available, otherwise use id or productId
      const itemId = variantId || id || productId;
      
      // Validate required fields
      if (!itemId || !name || price === undefined) {
        console.error('Invalid product data:', action.payload);
        return;
      }
      
      const existingItem = state.items.find(item => item.id === itemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ 
          id: itemId,
          variantId: variantId || itemId, // Store variantId separately
          name, 
          price, 
          image, 
          quantity 
        });
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      
      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      
      // Validate quantity
      if (quantity < 0) {
        console.error('Invalid quantity:', quantity);
        return;
      }
      
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (quantity === 0) {
          // Remove item if quantity is 0
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    },
    clearCart: (state) => {
      state.items = [];
      
      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartItemById = (id) => (state) =>
  state.cart.items.find(item => item.id === id);

export default cartSlice.reducer; 