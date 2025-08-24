import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading order details: {error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/orders"
          className="text-indigo-600 hover:text-indigo-800 flex items-center mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
      </div>

      {/* Order Status and Date */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <p className={`text-lg font-semibold ${
                order.orderStatus === 'delivered' ? 'text-green-600' :
                order.orderStatus === 'processing' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                ${parseFloat(order.orderTotal).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-base text-gray-900">
                {order.Customer?.firstName} {order.Customer?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base text-gray-900">{order.Customer?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base text-gray-900">{order.Customer?.phoneNumber || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.address && (
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Street Address</p>
                <p className="text-base text-gray-900">{order.address.street}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="text-base text-gray-900">{order.address.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="text-base text-gray-900">{order.address.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Postal Code</p>
                <p className="text-base text-gray-900">{order.address.postalCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="text-base text-gray-900">{order.address.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address Type</p>
                <p className="text-base text-gray-900 capitalize">{order.address.type}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          {order.OrderItems && order.OrderItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.OrderItems.map((item) => (
                    <tr key={item.orderItemId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.Variant?.Product?.imageUrl && (
                            <img
                              src={item.Variant.Product.imageUrl}
                              alt={item.Variant.Product.name}
                              className="h-10 w-10 rounded-full object-cover mr-3"
                            />
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {item.Variant?.Product?.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${parseFloat(item.priceAtTime).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.quantity * parseFloat(item.priceAtTime)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No items in this order</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails; 