import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:4000/api';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PaymentForm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const loadRazorpay = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Create payment order
        const response = await axios.post(
          `${API_URL}/payments/create/${orderId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setPaymentDetails(response.data);
        setLoading(false);

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          initializeRazorpay(response.data);
        };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error('Failed to initialize payment');
      }
    };

    loadRazorpay();
  }, [orderId]);

  const initializeRazorpay = (data) => {
    if (!RAZORPAY_KEY) {
      toast.error('Razorpay key is not configured');
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: 'Your Store Name',
      description: 'Payment for your order',
      order_id: data.orderId,
      handler: async (response) => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            `${API_URL}/payments/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: data.paymentId
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          toast.success('Payment successful!');
          navigate(`/orders/${orderId}`);
        } catch (err) {
          toast.error('Payment verification failed');
          console.error('Payment verification error:', err);
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-medium">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">₹{paymentDetails?.amount / 100}</span>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">
            Click the button below to proceed with payment
          </p>
          <button
            onClick={() => initializeRazorpay(paymentDetails)}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 