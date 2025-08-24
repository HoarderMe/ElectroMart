import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PaymentForm = ({ onPaymentSuccess }) => {
  const { items: cartItems, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      const res = await initializeRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      // Create order on the server
      const response = await fetch('http://localhost:4000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: total * 100, // Convert to paise
          currency: 'INR',
          items: cartItems
        })
      });

      const orderData = await response.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Store Name',
        description: 'Payment for your order',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify payment on the server
            const verifyResponse = await fetch('http://localhost:4000/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful!');
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id
              });
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone
        },
        theme: {
          color: '#4F46E5' // Indigo color matching your theme
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
      
      <div className="space-y-6">
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex justify-between items-center text-gray-600 mb-4">
            <span>Total Amount:</span>
            <span className="font-semibold">₹{total.toFixed(2)}</span>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            <p>You will be redirected to Razorpay's secure payment gateway</p>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full py-3 px-4 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Pay ₹{total.toFixed(2)}
        </button>

        <div className="text-sm text-gray-500 mt-4">
          <p>Your payment is secured by Razorpay</p>
          <p className="mt-1">Test card: 4111 1111 1111 1111</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 