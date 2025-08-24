// src/components/AdminProductPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// point axios at your backend
axios.defaults.baseURL = 'http://localhost:4000/api';

const AdminProductPage = () => {
  const token = localStorage.getItem('token');

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState(null);

  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [variantList, setVariantList]             = useState([]);

  const [search, setSearch]         = useState('');

  // Image upload state
  const [selectedFile, setSelectedFile]           = useState(null);
  const [uploadingImage, setUploadingImage]       = useState(false);
  const [previewUrl, setPreviewUrl]               = useState('');

  const generateId = () =>
    Math.random().toString(36).substr(2, 9) + Date.now();

  const emptyProduct = {
    name:        '',
    category:    '',
    brand:       '',
    sku:         '',
    imageUrl:    '',
    description: '',
    price:       '',
    stock:       '',
    variants:    []
  };
  const [formData, setFormData] = useState(emptyProduct);

  // fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // generic form field change
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // variant field change
  const handleVariantChange = (idx, e) => {
    const { name, value } = e.target;
    const variants = [...formData.variants];
    variants[idx] = { ...variants[idx], [name]: value };
    setFormData(fd => ({ ...fd, variants }));
  };

  const addVariant = () => {
    setFormData(fd => ({
      ...fd,
      variants: [
        ...fd.variants,
        { id: generateId(), name: '', additionalPrice: '', stock: '' }
      ]
    }));
  };

  const removeVariant = idx => {
    setFormData(fd => ({
      ...fd,
      variants: fd.variants.filter((_, i) => i !== idx)
    }));
  };

  // populate form for editing
  const startEdit = product => {
    setEditing(product.productId);
    setFormData({
      name:        product.name,
      category:    product.category,
      brand:       product.brand,
      sku:         product.sku,
      imageUrl:    product.imageUrl || '',
      description: product.description || '',
      price:       parseFloat(product.price),
      stock:       parseInt(product.stock, 10),
      variants:    (product.variants || []).map(v => ({
        id:              generateId(),
        name:            v.name,
        additionalPrice: parseFloat(v.additionalPrice),
        stock:           parseInt(v.stock, 10)
      }))
    });
    setPreviewUrl(product.imageUrl || '');
    setSelectedFile(null);
    setShowForm(true);
  };

  // delete a product
  const deleteProduct = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  // handle form submit (create/update)
  const handleSubmit = async e => {
    e.preventDefault();
    const {
      name, category, brand, sku,
      imageUrl, description, variants: rawVariants
    } = formData;

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock, 10) || 0;

    if (!name || !category || !brand || !sku || isNaN(price)) {
      return toast.error('Please fill in all required fields with valid values');
    }

    const variants = rawVariants.map(v => ({
      name:            v.name,
      additionalPrice: parseFloat(v.additionalPrice) || 0,
      stock:           parseInt(v.stock, 10) || 0
    }));

    const payload = {
      name, category, brand, sku,
      imageUrl, description, price, stock, variants
    };

    try {
      if (editing) {
        await axios.put(
          `/products/${editing}`, payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Product updated');
      } else {
        await axios.post(
          '/products', payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Product created');
      }
      setShowForm(false);
      setEditing(null);
      setFormData(emptyProduct);
      setPreviewUrl('');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  // open variants modal
  const viewVariants = variants => {
    setVariantList(variants);
    setShowVariantsModal(true);
  };

  // Handle file selection
  const handleFileSelect = e => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to S3
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image to upload');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const { data } = await axios.post(
        '/upload/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update form data with the new image URL
      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin: Products</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by name or SKU"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setFormData(emptyProduct);
              setSelectedFile(null);
              setPreviewUrl('');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Product
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editing ? 'Edit Product' : 'Create Product'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Name', name: 'name', type: 'text' },
              { label: 'Category', name: 'category', type: 'text' },
              { label: 'Brand', name: 'brand', type: 'text' },
              { label: 'SKU', name: 'sku', type: 'text' }
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  required
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}

            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!selectedFile || uploadingImage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              {/* Image Preview */}
              {(previewUrl || formData.imageUrl) && (
                <div className="mt-2">
                  <img
                    src={previewUrl || formData.imageUrl}
                    alt="Product preview"
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            {[
              { label: 'Price', name: 'price', type: 'number' },
              { label: 'Stock', name: 'stock', type: 'number' }
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  required
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Variants Section */}
          <div className="mt-6">
            <h3 className="font-medium">Variants</h3>
            {formData.variants.map((v, idx) => (
              <div key={v.id} className="grid grid-cols-4 gap-4 items-end mb-2">
                <div>
                  <label className="block text-sm">Name</label>
                  <input
                    name="name"
                    value={v.name}
                    onChange={e => handleVariantChange(idx, e)}
                    className="w-full border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Add'l Price</label>
                  <input
                    name="additionalPrice"
                    type="number"
                    value={v.additionalPrice}
                    onChange={e => handleVariantChange(idx, e)}
                    className="w-full border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={v.stock}
                    onChange={e => handleVariantChange(idx, e)}
                    className="w-full border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              + Add Variant
            </button>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setPreviewUrl('');
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <table className="w-full table-auto bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">SKU</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Variants</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p, i) => (
            <tr key={p.productId} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                )}
              </td>
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.sku}</td>
              <td className="px-4 py-2">${parseFloat(p.price).toFixed(2)}</td>
              <td className="px-4 py-2">{p.stock}</td>
              <td className="px-4 py-2">
                {p.variants.length}
                {p.variants.length > 0 && (
                  <button
                    onClick={() => viewVariants(p.variants)}
                    className="ml-2 text-indigo-600 hover:underline text-sm"
                  >
                    View
                  </button>
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => startEdit(p)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p.productId)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Variants Modal */}
      {showVariantsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Variants
            </h3>
            <ul className="divide-y divide-gray-200">
              {variantList.map(v => (
                <li key={v.id || v.variantId} className="py-2">
                  <div className="flex justify-between text-sm">
                    <span>{v.name}</span>
                    <span>
                      ${parseFloat(v.additionalPrice).toFixed(2)} &middot; Stock: {v.stock}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowVariantsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductPage;
