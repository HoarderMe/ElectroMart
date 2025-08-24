// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { fetchProductById, createProduct, updateProduct } from '../../store/slices/productSlice';

// const AdminProductDetails = () => {
//   const { productId } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { product, loading, error } = useSelector((state) => state.products);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     category: '',
//     images: [],
//     variants: []
//   });
//   const [newVariant, setNewVariant] = useState({
//     name: '',
//     additionalPrice: '',
//     stock: ''
//   });

//   useEffect(() => {
//     if (productId) {
//       dispatch(fetchProductById(productId));
//     }
//   }, [dispatch, productId]);

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || '',
//         stock: product.stock || '',
//         category: product.category || '',
//         images: product.images || [],
//         variants: product.variants || []
//       });
//     }
//   }, [product]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const imagePromises = files.map(file => {
//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           resolve(reader.result);
//         };
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(imagePromises).then(images => {
//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, ...images]
//       }));
//     });
//   };

//   const removeImage = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const handleVariantChange = (e) => {
//     const { name, value } = e.target;
//     setNewVariant(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const addVariant = () => {
//     if (!newVariant.name || !newVariant.additionalPrice || !newVariant.stock) {
//       toast.error('Please fill in all variant fields');
//       return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       variants: [...prev.variants, {
//         name: newVariant.name,
//         additionalPrice: parseFloat(newVariant.additionalPrice),
//         stock: parseInt(newVariant.stock)
//       }]
//     }));

//     setNewVariant({
//       name: '',
//       additionalPrice: '',
//       stock: ''
//     });
//   };

//   const removeVariant = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       variants: prev.variants.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setIsSubmitting(true);
//       const productData = {
//         ...formData,
//         price: parseFloat(formData.price),
//         stock: parseInt(formData.stock)
//       };

//       if (productId) {
//         await dispatch(updateProduct({ id: productId, data: productData })).unwrap();
//         toast.success('Product updated successfully');
//       } else {
//         await dispatch(createProduct(productData)).unwrap();
//         toast.success('Product created successfully');
//       }
//       navigate('/admin/products');
//     } catch (error) {
//       toast.error(error.message || 'Failed to save product');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-500">{error}</p>
//         <button
//           onClick={() => navigate('/admin/products')}
//           className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//         >
//           Back to Products
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">
//           {productId ? 'Edit Product' : 'Add New Product'}
//         </h1>
//         <button
//           onClick={() => navigate('/admin/products')}
//           className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//         >
//           Back to Products
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Category</label>
//               <input
//                 type="text"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Price</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 required
//                 min="0"
//                 step="0.01"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Stock</label>
//               <input
//                 type="number"
//                 name="stock"
//                 value={formData.stock}
//                 onChange={handleInputChange}
//                 required
//                 min="0"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 required
//                 rows="4"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Images */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Product Images</h2>
//           <div className="space-y-4">
//             <div className="flex items-center space-x-4">
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageChange}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//               />
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {formData.images.map((image, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={image}
//                     alt={`Product ${index + 1}`}
//                     className="w-full h-32 object-cover rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Variants */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 value={newVariant.name}
//                 onChange={handleVariantChange}
//                 placeholder="Variant Name"
//                 className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               <input
//                 type="number"
//                 name="additionalPrice"
//                 value={newVariant.additionalPrice}
//                 onChange={handleVariantChange}
//                 placeholder="Additional Price"
//                 min="0"
//                 step="0.01"
//                 className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               <input
//                 type="number"
//                 name="stock"
//                 value={newVariant.stock}
//                 onChange={handleVariantChange}
//                 placeholder="Stock"
//                 min="0"
//                 className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={addVariant}
//               className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//             >
//               Add Variant
//             </button>
//             <div className="space-y-2">
//               {formData.variants.map((variant, index) => (
//                 <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
//                   <div>
//                     <span className="font-medium">{variant.name}</span>
//                     <span className="ml-2 text-gray-600">
//                       (+${variant.additionalPrice.toFixed(2)})
//                     </span>
//                     <span className="ml-2 text-gray-600">
//                       Stock: {variant.stock}
//                     </span>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => removeVariant(index)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
//               isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {isSubmitting ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdminProductDetails; 