import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

// point axios at your backend
axios.defaults.baseURL = 'http://localhost:4000/api';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);

  const [formData, setFormData] = useState({
    street:     '',
    city:       '',
    state:      '',
    country:    '',
    region:     '',
    postalCode: '',
    type:       'home',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        '/addresses',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const url    = editing ? `/addresses/${editing.id}` : '/addresses';
    const method = editing ? 'put' : 'post';

    try {
      await axios[method](
        url,
        formData,
        { headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success(editing ? 'Address updated' : 'Address added');
      setShowForm(false);
      setEditing(null);
      setFormData({
        street:'', city:'', state:'',
        country:'', region:'',
        postalCode:'', type:'home'
      });
      fetchAddresses();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(msg);
    }
  };

  const handleEdit = addr => {
    setEditing(addr);
    setFormData({
      street:     addr.street,
      city:       addr.city,
      state:      addr.state,
      country:    addr.country,
      region:     addr.region || '',
      postalCode: addr.postalCode,
      type:       addr.type || 'home',
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await axios.delete(
        `/addresses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Address deleted');
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setFormData({
              street:'', city:'', state:'',
              country:'', region:'',
              postalCode:'', type:'home'
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Address
        </button>
      </div>

      {/* error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* form */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl mb-4">
            {editing ? 'Edit Address' : 'Add Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* street */}
            <div>
              <label className="block">Street</label>
              <input
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
            {/* city/state */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label>State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            {/* country/region */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Country</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label>Region</label>
                <input
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  placeholder="Optional"
                />
              </div>
            </div>
            {/* postalCode/type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Postal Code</label>
                <input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label>Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            {/* buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editing ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className="bg-white p-4 rounded shadow relative"
          >
            <div className="space-y-1">
              <p className="font-medium">{addr.street}</p>
              <p>{addr.city}, {addr.state}</p>
              <p>
                {addr.country}
                {addr.region && `, ${addr.region}`}, {addr.postalCode}
              </p>
              <p className="text-sm text-gray-500 capitalize">{addr.type}</p>
            </div>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!addresses.length && !showForm && (
        <div className="text-center py-8 text-gray-600">
          <p>No addresses yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-blue-600 hover:underline"
          >
            Add your first address
          </button>
        </div>
      )}
    </div>
  );
};

export default Addresses;
