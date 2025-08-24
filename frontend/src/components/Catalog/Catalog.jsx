import React, { useState, useEffect } from 'react';
import { useParams }                from 'react-router-dom';
import axios                        from 'axios';
import { ChevronDown, Filter }      from 'lucide-react';
import ProductCard                  from '../ProductCard';
import Header                       from '../Header';
import NewsLetterFooter             from '../NewsLetterFooter';
import { useDispatch }              from 'react-redux';
import { addToCart }                from '../../store/slices/cartSlice';

const Catalog = () => {
  const { category } = useParams();
  const dispatch      = useDispatch();
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filters, setFilters]       = useState({
    priceRange: [0, 100000],
    brands:     [],
    ratings:    [],
    availability: 'all'
  });
  const [expanded, setExpanded] = useState({
    price: true,
    brands: true,
    ratings: true,
    availability: true
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Only add filters to params if they have values
      if (filters.priceRange[1] < 100000) {
        params.priceRange = JSON.stringify(filters.priceRange);
      }
      
      if (filters.brands.length > 0) {
        params.brands = JSON.stringify(filters.brands);
      }
      
      if (filters.ratings.length > 0) {
        params.ratings = JSON.stringify(filters.ratings);
      }
      
      if (filters.availability !== 'all') {
        params.availability = filters.availability;
      }

      const { data } = await axios.get(
        `http://localhost:4000/api/products/category/${category}`,
        { params }
      );
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type, value) =>
    setFilters(f => ({ ...f, [type]: value }));

  const toggle = key =>
    setExpanded(e => ({ ...e, [key]: !e[key] }));

  const handleAddToCart = product =>
    dispatch(addToCart({
      id:       product.productId,
      name:     product.name,
      price:    product.price,
      image:    product.imageUrl,
      quantity: 1
    }));

  return (
    <>
      {/* <Header /> */}

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4 flex justify-end">
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          {(mobileOpen || true) && (
            <aside className={`bg-white rounded-lg shadow p-4 space-y-6 ${mobileOpen ? '' : 'hidden'} md:block md:w-64`}
            >
              <h2 className="text-lg font-semibold">Filters</h2>

              {/* Price */}
              <div>
                <button
                  className="flex w-full justify-between items-center font-medium"
                  onClick={() => toggle('price')}
                >
                  <span>Price Range</span>
                  <ChevronDown
                    className={`h-5 w-5 transform transition ${expanded.price ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded.price && (
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={filters.priceRange[1]}
                      onChange={e => handleFilterChange('priceRange', [0, +e.target.value])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Brands */}
              <div>
                <button
                  className="flex w-full justify-between items-center font-medium"
                  onClick={() => toggle('brands')}
                >
                  <span>Brands</span>
                  <ChevronDown
                    className={`h-5 w-5 transform transition ${expanded.brands ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded.brands && (
                  <div className="mt-2 space-y-2">
                    {['Apple','Samsung','Sony','LG','Bose'].map(brand => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={e => {
                            const next = e.target.checked
                              ? [...filters.brands, brand]
                              : filters.brands.filter(b => b !== brand);
                            handleFilterChange('brands', next);
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">{brand}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Ratings */}
              {/* <div>
                <button
                  className="flex w-full justify-between items-center font-medium"
                  onClick={() => toggle('ratings')}
                >
                  <span>Ratings</span>
                  <ChevronDown
                    className={`h-5 w-5 transform transition ${expanded.ratings ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded.ratings && (
                  <div className="mt-2 space-y-2">
                    {[4,3,2,1].map(r => (
                      <label key={r} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.ratings.includes(r)}
                          onChange={e => {
                            const next = e.target.checked
                              ? [...filters.ratings, r]
                              : filters.ratings.filter(x => x !== r);
                            handleFilterChange('ratings', next);
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">{r}★ & Up</span>
                      </label>
                    ))}
                  </div>
                )}
              </div> */}

              {/* Availability */}
              <div>
                <button
                  className="flex w-full justify-between items-center font-medium"
                  onClick={() => toggle('availability')}
                >
                  <span>Availability</span>
                  <ChevronDown
                    className={`h-5 w-5 transform transition ${expanded.availability ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded.availability && (
                  <div className="mt-2 space-y-2">
                    {['all','inStock','outOfStock'].map(opt => (
                      <label key={opt} className="flex items-center">
                        <input
                          type="radio"
                          name="avail"
                          checked={filters.availability===opt}
                          onChange={() => handleFilterChange('availability', opt)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {opt==='all'? 'All': opt==='inStock'?'In Stock':'Out of Stock'}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Products */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {products.map(prod => (
                <ProductCard
                  key={prod.productId}
                  product={prod}
                  onAddToCart={() => handleAddToCart(prod)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      <NewsLetterFooter />
    </>
  );
};

export default Catalog;