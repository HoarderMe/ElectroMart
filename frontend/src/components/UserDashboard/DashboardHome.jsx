import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    orders {
      orderId
      orderDate
      orderStatus
      orderTotal
      orderItems {
        quantity
        price
      }
    }
  }
`;

const DashboardHome = () => {
  const user = useSelector((state) => state.auth.user);
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );
  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500">Error loading dashboard data: {error.message}</p>
    </div>
  );

  // Convert raw data into usable form
  const orders = (data.orders || []).map(o => ({
    ...o,
    // orderDate comes back as a string of ms since epoch
    orderDate: new Date(parseInt(o.orderDate, 10))
  }));

  // Totals
  const totalOrders = orders.length;
  const totalSpent  = orders.reduce((sum, o) => sum + o.orderTotal, 0);

  // Most recent 5 orders by date
  const recentOrders = [...orders]
    .sort((a, b) => b.orderDate - a.orderDate)
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Welcome */}
      <div className="bg-indigo-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-indigo-800 mb-2">
          Welcome back, {user?.firstName || 'User'}!
        </h2>
        <p className="text-indigo-600">Here's an overview of your account activity.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              {/* icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" 
                   viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              {/* icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" 
                   viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 
                         3 .895 3 2-1.343 2-3 2m0-8c1.11 0 
                         2.08.402 2.599 1M12 8V7m0 1v8m0 0v1
                         m0-1c-1.11 0-2.08-.402-2.599-1
                         M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-800">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID','Date','Status','Items','Total','Action'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((o) => (
                <tr key={o.orderId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{o.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {o.orderDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        o.orderStatus === 'delivered'   ? 'bg-green-100 text-green-800' :
                        o.orderStatus === 'processing'  ? 'bg-yellow-100 text-yellow-800' :
                                                           'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {o.orderItems.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${o.orderTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/dashboard/orders/${o.orderId}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
          <div className="space-y-3">
            <Link to="/dashboard/profile" className="flex items-center text-gray-700 hover:text-indigo-600">
              {/* icon + text */}
              Update Profile
            </Link>
            <Link to="/dashboard/addresses" className="flex items-center text-gray-700 hover:text-indigo-600">
              Manage Addresses
            </Link>
            <Link to="/dashboard/settings" className="flex items-center text-gray-700 hover:text-indigo-600">
              Account Settings
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shopping</h3>
          <div className="space-y-3">
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-indigo-600">
              View Cart
            </Link>
            <Link to="/products" className="flex items-center text-gray-700 hover:text-indigo-600">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
