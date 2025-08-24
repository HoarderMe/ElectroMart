import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // products: [
  //   { id: 1, name: 'Samsung Galaxy S23', category: 'Phones', price: 799, image: 'https://m.media-amazon.com/images/I/61w7JQ+BFOL._AC_UY327_FMwebp_QL65_.jpg', description: 'Flagship smartphone with stunning display.', stock: 15, variants: [
  //     { id: 's23-black', name: 'Black', additionalPrice: 0 },
  //     { id: 's23-white', name: 'White', additionalPrice: 0 },
  //     { id: 's23-purple', name: 'Purple', additionalPrice: 50 }
  //   ] },
  //   { id: 2, name: 'MacBook Pro 14"', category: 'Laptops', price: 1999, image: 'https://m.media-amazon.com/images/I/71CjP9jmqZL._AC_UY327_FMwebp_QL65_.jpg', description: 'Apple\'s premium 14-inch laptop for professionals.', stock: 8, variants: [
  //     { id: 'mbp-gray', name: 'Space Gray', additionalPrice: 0 },
  //     { id: 'mbp-silver', name: 'Silver', additionalPrice: 0 }
  //   ] },
  //   { id: 3, name: 'Sony WH-1000XM5', category: 'Accessories', price: 349, image: 'https://m.media-amazon.com/images/I/610NdWdTLiL._AC_UY327_FMwebp_QL65_.jpg', description: 'Industry-leading noise cancellation headphones.', stock: 20, variants: [
  //     { id: 'wh-black', name: 'Black', additionalPrice: 0 },
  //     { id: 'wh-silver', name: 'Silver', additionalPrice: 0 }
  //   ] },
  //   { id: 4, name: 'iPhone 14 Pro', category: 'Phones', price: 999, image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202209?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663792790574', description: 'Apple\'s latest pro model iPhone.', stock: 12, variants: [
  //     { id: 'iphone-black', name: 'Space Black', additionalPrice: 0 },
  //     { id: 'iphone-silver', name: 'Silver', additionalPrice: 0 },
  //     { id: 'iphone-gold', name: 'Gold', additionalPrice: 50 },
  //     { id: 'iphone-purple', name: 'Deep Purple', additionalPrice: 50 }
  //   ] },
  //   { id: 5, name: 'Dell XPS 13', category: 'Laptops', price: 1299, image: 'https://m.media-amazon.com/images/I/61MplWm+QpL._AC_UY327_FMwebp_QL65_.jpg', description: 'Compact and powerful Windows laptop.', stock: 10, variants: [
  //     { id: 'xps-silver', name: 'Silver', additionalPrice: 0 },
  //     { id: 'xps-white', name: 'White', additionalPrice: 0 }
  //   ] },
  //   { id: 6, name: 'AirPods Pro 2', category: 'Accessories', price: 249, image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361', description: 'Apple\'s best wireless earbuds.', stock: 25, variants: [
  //     { id: 'airpods-white', name: 'White', additionalPrice: 0 }
  //   ] },
  //   { id: 7, name: 'Google Pixel 8', category: 'Phones', price: 699, image: 'https://images-eu.ssl-images-amazon.com/images/I/61h5jbbjXIL._AC_UL232_SR232,232_.jpg', description: 'Google\'s clean, powerful Android phone.', stock: 18, variants: [
  //     { id: 'pixel-black', name: 'Obsidian', additionalPrice: 0 },
  //     { id: 'pixel-white', name: 'Porcelain', additionalPrice: 0 },
  //     { id: 'pixel-blue', name: 'Bay', additionalPrice: 0 }
  //   ] },
  //   { id: 8, name: 'Logitech MX Master 3S', category: 'Accessories', price: 99, image: 'https://m.media-amazon.com/images/I/61M2dtkgEYL._AC_UY327_FMwebp_QL65_.jpg', description: 'Top-tier productivity mouse for creators.', stock: 30, variants: [
  //     { id: 'mx-black', name: 'Graphite', additionalPrice: 0 },
  //     { id: 'mx-white', name: 'Pale Grey', additionalPrice: 0 }
  //   ] },
  // ],
  products: [],
  categories: ['Phones', 'Laptops', 'Accessories'],
  loading: false,
  error: null
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateProductStock: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stock -= quantity;
      }
    }
  }
});

export const { setProducts, setLoading, setError, updateProductStock } = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectProductsByCategory = (state, category) => 
  state.products.products.filter(product => product.category === category);
export const selectProductById = (state, productId) => 
  state.products.products.find(product => product.id === productId);
export const selectCategories = (state) => state.products.categories;

export default productsSlice.reducer; 