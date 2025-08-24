import React, { useState, useEffect } from 'react';
import {
  Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Select, MenuItem, Switch, FormControlLabel
} from '@mui/material';
import AWS from 'aws-sdk';
import axios from 'axios';

// Initialize AWS S3
AWS.config.update({
  accessKeyId: 'AKIAQE43JXTF4J6I3SOX', // Replace with your AWS access key
  secretAccessKey: 'g9QsM5f7sheMm+nlB/TxjszKULeHqEWuk/RaX3qT', // Replace with your AWS secret key
  region: 'ap-southeast-2', // Replace with your AWS region
});

const s3 = new AWS.S3();

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    outletId: '002',
    is_available: true,
    image: '',
    imageFile: null, // For storing the selected file
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu-items/001');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = () => {
    // The filtering is handled in the filteredRows variable
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setNewProduct({
        ...product,
        imageFile: null, // Reset imageFile
      });
      setCurrentProductId(product.id);
      setEditing(true);
    } else {
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: 0,
        outletId: '002',
        is_available: true,
        image: '',
        imageFile: null,
      });
      setEditing(false);
    }
    setOpen(true);
  };

  const uploadImageToS3 = async (file) => {
    const params = {
      Bucket: 'shnack', // Replace with your bucket name
      Key: `images/${Date.now()}_${file.name}`, // Unique filename
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      return uploadResult.Location; // URL of the uploaded image
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleAddOrEditProduct = async () => {
    try {
      let imageUrl = newProduct.image;

      if (newProduct.imageFile) {
        // Upload the new image to S3
        imageUrl = await uploadImageToS3(newProduct.imageFile);
      }

      const productData = {
        ...newProduct,
        image: imageUrl,
      };

      if (editing) {
        await axios.put(`http://localhost:5000/api/menu-items/${currentProductId}`, productData);
      } else {
        await axios.post('http://localhost:5000/api/menu-items', productData);
      }
      fetchProducts();
      setOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleToggleAvailability = async (product) => {
    const updatedProduct = {
      ...product,
      is_available: !product.is_available,
    };

    try {
     const response =  await axios.put(`http://localhost:5000/api/menu-items/updatestatus/${product.id}`, updatedProduct);

     console.log(response);
      
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu-items/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on category and search query
  const filteredRows = rows.filter((row) => {
    const matchesCategory = categoryFilter === 'All' || row.category === categoryFilter;
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Extract unique categories for the filter dropdown
  const categories = ['All', ...new Set(rows.map((row) => row.category))];

  return (
    <div className='p-5 h-[calc(100vh_-_11vh)]'>
      {/* Control Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className='flex gap-4'>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            displayEmpty
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </div>
        <Button variant="contained" color="secondary" onClick={() => handleOpenDialog()}>
          Add Product
        </Button>
      </div>

      {/* Display Products */}
      <div className='w-full flex flex-col gap-5 overflow-y-auto h-[calc(100vh_-_25vh)]'>
        {filteredRows.map((row) => (
          <div key={row.id} className='w-full h-auto bg-white rounded-lg border-2 py-2 flex items-center justify-between px-5'>
            <div className='flex flex-row gap-5'>
              <div className='w-[120px] h-[70px]'>
                <img src={row.image} alt={row.name} className='rounded-lg object-cover w-[120px] h-[80px]' />
              </div>
              <div>
                <h1 className='text-lg font-bold'>{row.name}</h1>
                <p>{row.description}</p>
                <p className='text-2xl font-semibold'>₹{parseFloat(row.price).toFixed(2)}</p>
              </div>
            </div>
            <div className='flex gap-4 items-center'>
              <FormControlLabel
                control={
                  <Switch
                    checked={row.is_available}
                    onChange={() => handleToggleAvailability(row)}
                  />
                }
                label="Available"
              />
              <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => handleOpenDialog(row)}>
                Edit
              </button>
              <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={() => handleDeleteProduct(row.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            type="text"
            fullWidth
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Outlet Id"
            type="text"
            fullWidth
            value={newProduct.outletId}
            onChange={(e) => setNewProduct({ ...newProduct, outletId: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={newProduct.is_available}
                onChange={() => setNewProduct({ ...newProduct, is_available: !newProduct.is_available })}
              />
            }
            label="Available"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
            style={{ marginTop: '16px' }}
          />
          {newProduct.image && (
            <img src={newProduct.image} alt="Product" style={{ width: '100px', marginTop: '10px' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrEditProduct} color="primary">
            {editing ? 'Save Changes' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
