import React from 'react'
import Header from './Header'
import { useDispatch, useSelector } from 'react-redux'

const CategoryPage = () => {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [selectedCategory, setSelectedCategory] = React.useState('All')
    const [priceRange, setPriceRange] = React.useState(1000)

  const dispatch = useDispatch()
        // const products = [
        //   { id: 1, name: 'Samsung Galaxy S23', category: 'Phones', price: 799, image: 'https://images.samsung.com/is/image/samsung/assets/in/home/250123/twh/New-In_RT51DG682BB1TL_Small_Tile_330x330.jpg?$330_330_JPG$' },
        //   { id: 2, name: 'MacBook Pro 14"', category: 'Laptops', price: 1999, image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202011?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1603406905000' },
        //   { id: 3, name: 'Sony WH-1000XM5', category: 'Accessories', price: 349, image: 'https://www.sony.com/image/5d53e687b48e8f9e60b3f166e02f8c0b?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF' },
        //   { id: 4, name: 'iPhone 14 Pro', category: 'Phones', price: 999, image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202209?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663792790574' },
        //   { id: 5, name: 'Dell XPS 13', category: 'Laptops', price: 1299, image: 'https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9310/media-gallery/xps-13-9310-tmlp-gallery-1.psd?fmt=png&wid=330&hei=330' },
        //   { id: 6, name: 'AirPods Pro 2', category: 'Accessories', price: 249, image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361' },
        //   { id: 7, name: 'Google Pixel 8', category: 'Phones', price: 699, image: 'https://store.google.com/product/images/pixel_8_pro_hero_image.jpg?width=330' },
        //   { id: 8, name: 'Logitech MX Master 3S', category: 'Accessories', price: 99, image: 'https://resource.logitech.com/w_330,c_limit,q_auto,f_auto,dpr_1.0/content/dam/logitech/en/products/mice/mx-master-3s/mx-master-3s-gallery/graphite/mx-master-3s-mouse-top-view-graphite.png?v=1' },
        // ];
  
        const products = useSelector((state) => state.products.products);
        const filteredProducts = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          product.price <= priceRange &&
          (selectedCategory === 'All' || product.category === selectedCategory)
        );

        const handleAddToCart = (product) => {
            dispatch(addToCart({
              productId: Number(product.productId),
              name: product.name,
              price: product.price,
              image: product.imageUrl,
              variant: { id: 'default', name: 'Default', additionalPrice: 0 }
            }));
          };

  return (
    <div className="min-h-screen bg-gray-100">
 
          <div className="w-full flex flex-col items-center justify-center pt-24 pb-10 bg-gradient-to-b from-blue-50 to-white">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 text-center">Best Sellers</h1>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-600 text-center mt-2">Electronics</h2>
          </div>

          <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-white shadow-lg rounded-lg p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Filters</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All</option>
                    <option>Phones</option>
                    <option>Laptops</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Range: ${priceRange}</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full mt-2 accent-blue-500"
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-8">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative w-full h-48">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-xl font-bold text-blue-600 mt-2">${product.price}</p>
                      <button onClick={
                        () => handleAddToCart(product)
                      }  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No products found matching your criteria.</p>
              )}
            </div>
          </div>
        </div>
  )
}

export default CategoryPage
