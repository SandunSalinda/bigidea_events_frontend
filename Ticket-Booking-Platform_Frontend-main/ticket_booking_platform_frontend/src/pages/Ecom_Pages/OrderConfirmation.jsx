import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ShopNav from '../../components/ecom_Components/navigation/ShopNav';
import Footer from '../../components/Footer';
import { stripeService } from '../../services/ecom_admin/stripeService';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Try to get order details from location state first
        if (location.state?.orderDetails) {
          setOrderDetails(location.state.orderDetails);
          setLoading(false);
          return;
        }

        // If not available, fetch from backend
        if (orderId) {
          console.log('📋 Fetching order details for:', orderId);
          const result = await stripeService.getOrderDetails(orderId);
          
          if (result.success) {
            setOrderDetails(result.data);
          } else {
            console.error('Failed to fetch order details:', result.error);
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNav />
      
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase! Your order has been successfully processed.
          </p>
          <p className="text-lg text-green-600 font-medium">
            ✅ Payment completed • 📦 Order confirmed • 🚚 Processing started
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderId || 'ORD-' + Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Confirmed</span>
                </div>
              </div>
            </div>

            {orderDetails && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">${orderDetails.total?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="text-green-600 font-medium">Paid</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-6 border border-blue-100">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">📋 What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <span className="text-3xl">📧</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Email Confirmation</h4>
                <p className="text-gray-600 text-sm">You'll receive an order confirmation email shortly with all the details</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <span className="text-3xl">📦</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Order Processing</h4>
                <p className="text-gray-600 text-sm">Your order will be processed and packaged within 1-2 business days</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <span className="text-3xl">🚚</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Shipping Updates</h4>
                <p className="text-gray-600 text-sm">You'll receive tracking information once your order ships</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <span className="text-3xl">💬</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Customer Support</h4>
                <p className="text-gray-600 text-sm">Contact us anytime if you have questions about your order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">What would you like to do next?</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/shop"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>🛍️</span>
              <span>Continue Shopping</span>
            </Link>
            <Link
              to="/"
              className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-10 py-4 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>🏠</span>
              <span>Back to Home</span>
            </Link>
          </div>
          <p className="text-center text-gray-600 mt-4 text-sm">
            Take your time to review your order details above. No rush! 😊
          </p>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
              support@example.com
            </a>
            {' '}or call{' '}
            <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-800">
              +1 (234) 567-8900
            </a>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
