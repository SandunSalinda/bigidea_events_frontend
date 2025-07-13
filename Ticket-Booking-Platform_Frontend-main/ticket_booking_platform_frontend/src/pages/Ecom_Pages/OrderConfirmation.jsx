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
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully processed.
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
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">📧</span>
              <span>You'll receive an order confirmation email shortly</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">📦</span>
              <span>Your order will be processed and shipped within 1-2 business days</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">🚚</span>
              <span>You'll receive tracking information once your order ships</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">📞</span>
              <span>Contact support if you have any questions about your order</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Back to Home
          </Link>
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
