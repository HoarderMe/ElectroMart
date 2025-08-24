import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { ArrowLeft, Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProductById = async (id) => {
    try {
      const query = `
        query GetProduct($id: ID!) {
          product(id: $id) {
            productId
            name
            category
            price
            stock
            description
            imageUrl
            variants {
              variantId
              name
              additionalPrice
              stock
            }
          }
        }
      `;

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { id } }),
      });

      const { data } = await response.json();
      return data?.product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const fetchedProduct = await fetchProductById(id);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setSelectedVariant(fetchedProduct.variants?.[0] || {
          id: 'default',
          name: 'Default',
          additionalPrice: 0
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: Number(product.productId),
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      variant: selectedVariant,
      quantity,
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const totalPrice = (product?.price + (selectedVariant?.additionalPrice || 0)) * quantity;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to {product.category}
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold text-indigo-600">₹{totalPrice.toFixed(2)}</span>
                  {selectedVariant?.additionalPrice > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      (includes variant price)
                    </span>
                  )}
                </div>

                <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>

                {/* Variant Selection */}
                {product.variants?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Select Variant</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.variantId}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedVariant?.variantId === variant.variantId
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                              : 'border-gray-200 hover:border-indigo-200'
                          }`}
                        >
                          {variant.name}
                          {variant.additionalPrice > 0 && (
                            <span className="ml-1 text-sm">
                              (+₹{variant.additionalPrice})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 h-10 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {product.stock} units available
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
