// src/components/Landing.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import NewsLetterFooter from './NewsLetterFooter';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { setProducts } from '../store/slices/productsSlice';

const Landing = () => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  const [featured, setFeatured]       = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [fashion, setFashion]         = useState([]);
  const [home, setHome]               = useState([]);

  useEffect(() => {
    setLoaded(true);
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query Products {
                products {
                  productId
                  name
                  category
                  price
                  stock
                  imageUrl
                  variants {
                    variantId
                    name
                    additionalPrice
                    stock
                  }
                }
                  
              }
            `,
          }),
        });
        const { data } = await res.json();
        const prods = data.products;
        dispatch(setProducts(prods));

        setFeatured(prods.slice(0, 8));
        setElectronics(
          prods.filter(p => p.category.toLowerCase() === 'phone').slice(0, 8)
        );
        setFashion(
          prods.filter(p => p.category.toLowerCase() === 'fashion').slice(0, 8)
        );
        setHome(
          prods.filter(p => p.category.toLowerCase() === 'home').slice(0, 8)
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, [dispatch]);

  const handleAddToCart = product =>
    dispatch(
      addToCart({
        id:       product.productId,
        name:     product.name,
        price:    product.price,
        image:    product.imageUrl,
        quantity: 1,
      })
    );

  const Section = ({ title, items, link }) => (
    <section className="py-16 w-full">
      <div className="container mx-auto w-[90%] px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <Link to={link} className="text-indigo-600 hover:text-indigo-800 transition">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:grid-cols-4 lg:grid-cols-4 ">
          {items.map(p => (
            <div
              key={p.productId}
              className="
         
              "
            >
              <ProductCard product={p} onAddToCart={() => handleAddToCart(p)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>


      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-400 text-white">
        <img
          src="https://framerusercontent.com/images/rZ7ujBaa5BAzdp5fwhNvyZFLAnc.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative flex flex-col items-center justify-center h-screen text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Electromart
          </h1>
          <p className="text-xl mb-8">
            Discover amazing products at unbeatable prices
          </p>
          <Link
            to="/products"
            className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow hover:shadow-lg transition"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Brand Logos */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between overflow-x-auto space-x-8">
          {[
            'https://framerusercontent.com/images/u8WevV7mCKQBN8jeLHALsSQQs34.svg',
            'https://framerusercontent.com/images/StsYHkCZHpy4eY8jsBCQEWc.svg',
            'https://framerusercontent.com/images/jOc8ocv3NkFD0PkOQbamqxXhuE.svg',
            'https://framerusercontent.com/images/z336n0D2YdMY9XgDiBAU7XSW6s.svg',
            'https://framerusercontent.com/images/WdroEkOLMZk4iQzRgxNWMhLTlY.svg',
          ].map((src, i) => (
            <img key={i} src={src} alt={`Brand ${i}`} className="h-12 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <div className="bg-white w-full">
        <Section title="Featured Products" items={featured} link="/products" />
      </div>

      {/* <div className="bg-white w-full">
        <Section title="Phone" items={electronics} link="/products" />
      </div> */}
     

      {/* Newsletter */}
      <div className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto max-w-xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="mb-6">
            Stay updated with exclusive offers and the latest products.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-full focus:outline-none text-gray-800"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <NewsLetterFooter />
    </div>
  );
};

export default Landing;
