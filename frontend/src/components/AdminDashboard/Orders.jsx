// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { fetchOrders, updateOrderStatus } from '../../store/slices/orderSlice';
// import { toast } from 'react-hot-toast';

// const AdminOrders = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { orders, loading, error } = useSelector((state) => state.orders);
//   const [filters, setFilters] = useState({
//     status: '',
//     search: '',
//     dateRange: 'all'
//   });
//   const [sortConfig, setSortConfig] = useState({
//     key: 'createdAt',
//     direction: 'desc'
//   });

//   useEffect(() => {
//     dispatch(fetchOrders());
//   }, [dispatch]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSort = (key) => {
//     setSortConfig(prev => ({
//       key,
//       direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
//       toast.success('Order status updated successfully');
//     } catch (error) {
//       toast.error(error.message || 'Failed to update order status');
//     }
//   };

//   const filteredOrders = orders?.filter(order => {
//     const matchesStatus = !filters.status || order.status === filters.status;
//     const matchesSearch = !filters.search || 
//       order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
//       order.user?.name.toLowerCase().includes(filters.search.toLowerCase());
    
//     let matchesDate = true;
//     if (filters.dateRange !== 'all') {
//       const orderDate = new Date(order.createdAt);
//       const today = new Date();
//       const lastWeek = new Date(today.setDate(today.getDate() - 7));
//       const lastMonth = new Date(today.setDate(today.getDate() - 30));

//       switch (filters.dateRange) {
//         case 'today':
//           matchesDate = orderDate.toDateString() === new Date().toDateString();
//           break;
//         case 'week':
//           matchesDate = orderDate >= lastWeek;
//           break;
//         case 'month':
//           matchesDate = orderDate >= lastMonth;
//           break;
//         default:
//           matchesDate = true;
//       }
//     }

//     return matchesStatus && matchesSearch && matchesDate;
//   });

//   const sortedOrders = [...filteredOrders].sort((a, b) => {
//     if (sortConfig.key === 'createdAt') {
//       return sortConfig.direction === 'asc' 
//         ? new Date(a.createdAt) - new Date(b.createdAt)
//         : new Date(b.createdAt) - new Date(a.createdAt);
//     }
//     return sortConfig.direction === 'asc'
//       ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
//       : a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
//   });

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
//           onClick={() => dispatch(fetchOrders())}
//           className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Orders</h1>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               name="status"
//               value={filters.status}
//               onChange={handleFilterChange}
//               className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//             <select
//               name="dateRange"
//               value={filters.dateRange}
//               onChange={handleFilterChange}
//               className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Time</option>
//               <option value="today">Today</option>
//               <option value="week">Last 7 Days</option>
//               <option value="month">Last 30 Days</option>
//             </select>
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//             <input
//               type="text"
//               name="search"
//               value={filters.search}
//               onChange={handleFilterChange}
//               placeholder="Search by order number or customer name"
//               className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('orderNumber')}
//                 >
//                   Order ID
//                 </th>
//                 <th
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('user.name')}
//                 >
//                   Customer
//                 </th>
//                 <th
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('totalAmount')}
//                 >
//                   Amount
//                 </th>
//                 <th
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('status')}
//                 >
//                   Status
//                 </th>
//                 <th
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('createdAt')}
//                 >
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {sortedOrders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     #{order.orderNumber}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {order.user?.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ${order.totalAmount.toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <select
//                       value={order.status}
//                       onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                       className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                         order.status === 'delivered'
//                           ? 'bg-green-100 text-green-800'
//                           : order.status === 'cancelled'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="processing">Processing</option>
//                       <option value="shipped">Shipped</option>
//                       <option value="delivered">Delivered</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <button
//                       onClick={() => navigate(`/admin/orders/${order._id}`)}
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Empty State */}
//       {sortedOrders.length === 0 && (
//         <div className="text-center py-10">
//           <p className="text-gray-500">No orders found matching your criteria</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders; 