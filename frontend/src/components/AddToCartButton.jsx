import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItemById } from '../store/slices/cartSlice';

const AddToCartButton = ({ product, quantity = 1 }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItemById(product.id));

  const handleAddToCart = () => {
    // Validate product data
    if (!product || !product.id || !product.name || product.price === undefined) {
      console.error('Invalid product data:', product);
      return;
    }

    // Add to cart
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    }));
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      aria-label={`Add ${product.name} to cart`}
    >
      {cartItem ? `Add Another (${cartItem.quantity} in cart)` : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton; 