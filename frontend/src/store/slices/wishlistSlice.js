import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    addToCart: (state, action) => {
      // This action will be handled by the cart slice
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setWishlistItems: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const {
  addToWishlist,
  removeFromWishlist,
  addToCart,
  clearWishlist,
  setWishlistItems
} = wishlistSlice.actions;

export default wishlistSlice.reducer; 