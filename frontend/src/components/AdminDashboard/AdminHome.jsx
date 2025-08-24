import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button onClick={fetchDashboardStats} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Sales */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.totalSales.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              {/* Icon omitted for brevity */}
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+{stats.salesGrowth}% from last month</span>
          </div>
        </div>
        {/* Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              {/* Icon omitted for brevity */}
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600">{stats.ordersGrowth}% change</span>
          </div>
        </div>
        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              {/* Icon omitted for brevity */}
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600">{stats.productsGrowth}% change</span>
          </div>
        </div>
        {/* Customers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              {/* Icon omitted for brevity */}
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600">{stats.customersGrowth}% change</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <button onClick={() => navigate('/admin/orders')} className="text-indigo-600 hover:text-indigo-900">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID','Customer','Amount','Status','Date'].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer.firstName} {order.customer.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{parseFloat(order.orderTotal).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${order.orderStatus==='delivered'?'bg-green-100 text-green-800':order.orderStatus==='cancelled'?'bg-red-100 text-red-800':'bg-yellow-100 text-yellow-800'}`}> {order.orderStatus} </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alert</h3>
        <div className="space-y-4">
          {stats.lowStockProducts.map((product) => (
            <div key={product.productId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-red-600">Stock: {product.stock}</p>
              </div>
              <button onClick={() => navigate(`/admin/products/`)} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700">
                Restock
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity.map((act, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full \${act.type==='order'?'bg-green-100':'bg-yellow-100'}`}>
                {/* Icon omitted */}
              </div>
              <div>
                <p className="text-sm">{act.type.charAt(0).toUpperCase() + act.type.slice(1)} {act.status} for {act.customer}</p>
                <p className="text-xs text-gray-500">{new Date(act.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;