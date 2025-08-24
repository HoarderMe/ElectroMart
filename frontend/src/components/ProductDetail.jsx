import { useState, useEffect } from 'react';
import axios from 'axios';
// import { useCart } from '../context/CartContext';

function ProductDetail({ productId }) {
  // const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  // const { addToCart } = useCart();

  // useEffect(() => {
  //   axios.get(`http://localhost:3000/products/${productId}`).then((res) => {
  //     setProduct(res.data);
  //     setSelectedVariant(res.data.Variants[0]);
  //   });
  // }, [productId]);

  // const handleAddToCart = () => {
  //   if (product && selectedVariant) {
  //     addToCart({ ...product, variant: selectedVariant });
  //   }
  // };

  if (!product) return <div className="text-center text-gray-600 text-xl py-16">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-16 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
        <img
          src={product.image || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full md:w-1/2 h-96 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-2xl font-semibold text-indigo-600 mb-6">
            ${(product.price + (selectedVariant?.additionalPrice || 0)).toFixed(2)}
          </p>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Select Variant:</label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSelectedVariant(product.Variants.find((v) => v.variantId === parseInt(e.target.value)))}
            >
              {product.Variants.map((variant) => (
                <option key={variant.variantId} value={variant.variantId}>
                  {variant.name} (+${variant.additionalPrice.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;