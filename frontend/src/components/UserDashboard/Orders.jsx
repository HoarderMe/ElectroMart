import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { gql, useQuery } from '@apollo/client';

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      orderId
      orderDate
      orderStatus
      orderTotal
      customer {
        firstName
        lastName
        email
      }
      orderItems {
        orderItemId
        quantity
        price
        variant {
          name
          product {
            name
            imageUrl
          }
        }
      }
    }
  }
`;

const Orders = () => {
  const { loading, error, data } = useQuery(GET_ORDERS);
  const user = useSelector((state) => state.auth.user);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <p className="text-red-500">Error loading orders: {error.message}</p>
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Order History
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your recent orders and their status
        </p>
      </div>
      <div className="border-t border-gray-200">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => {
              // parse the millisecond timestamp string
              const orderDate = new Date(parseInt(order.orderDate, 10));
              return (
                <li key={order.orderId} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        Order #{order.orderId}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {orderDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-900">
                      Total: ${Number(order.orderTotal).toFixed(2)}
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Customer Details:
                      </h4>
                      <p className="text-sm text-gray-500">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer.email}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Order Items:
                      </h4>
                      {order.orderItems.length === 0 ? (
                        <p className="text-sm text-gray-500 mt-2">
                          No items in this order.
                        </p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {order.orderItems.map((item) => {
                            const product = item.variant.product;
                            const unitPrice = Number(item.price);
                            const lineTotal = unitPrice * item.quantity;
                            return (
                              <li
                                key={item.orderItemId}
                                className="flex items-center space-x-4"
                              >
                                {product?.imageUrl && (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-12 w-12 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {product?.name || 'Unknown Product'} –{' '}
                                    {item.variant.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item.quantity} × $
                                    {unitPrice.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  ${lineTotal.toFixed(2)}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/dashboard/orders/${order.orderId}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Details
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Orders;
