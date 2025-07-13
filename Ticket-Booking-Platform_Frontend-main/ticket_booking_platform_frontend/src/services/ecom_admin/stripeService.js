// Stripe Payment Service - E-commerce Integration
const API_BASE_URL = import.meta.env.VITE_ECOM_API_URL || 'http://localhost:3000/api/ecom';

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('ecom_token');
};

// Create headers with authentication
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const stripeService = {
  // Get Stripe configuration (publishable key)
  async getStripeConfig() {
    try {
      console.log('🔑 Getting Stripe configuration...');
      
      const response = await fetch(`${API_BASE_URL}/payments/config`, {
        method: 'GET',
        headers: createHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Stripe config received');
      
      return { 
        success: true, 
        publishableKey: result.data.publishableKey 
      };
    } catch (error) {
      console.error('❌ Error getting Stripe config:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Check stock before payment
  async checkStock(productId, quantity) {
    try {
      console.log(`📦 Checking stock for product ${productId}, quantity: ${quantity}`);
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}/check-stock`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Stock check completed:', result);
      
      return { 
        success: true, 
        data: result.data 
      };
    } catch (error) {
      console.error('❌ Error checking stock:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Create payment intent (Step 1)
  async createPaymentIntent(paymentData) {
    try {
      console.log('💳 Creating payment intent...');
      console.log('Payment data:', paymentData);
      
      const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Payment intent created:', result);
      
      return { 
        success: true, 
        data: result.data 
      };
    } catch (error) {
      console.error('❌ Error creating payment intent:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Confirm payment (Step 3)
  async confirmPayment(paymentIntentId) {
    try {
      console.log('✅ Confirming payment with backend...');
      
      const response = await fetch(`${API_BASE_URL}/payments/confirm-payment`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ paymentIntentId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🎉 Payment confirmed successfully:', result);
      
      return { 
        success: true, 
        data: result.data 
      };
    } catch (error) {
      console.error('❌ Error confirming payment:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Get order details
  async getOrderDetails(orderId) {
    try {
      console.log('📋 Fetching order details for:', orderId);
      
      const response = await fetch(`${API_BASE_URL}/payments/order/${orderId}`, {
        method: 'GET',
        headers: createHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to fetch order details:', data);
        return { success: false, error: data.message || 'Failed to fetch order details' };
      }

      console.log('✅ Order details fetched successfully:', data);
      return { success: true, data: data.order };
    } catch (error) {
      console.error('Error fetching order details:', error);
      return { success: false, error: error.message };
    }
  }
};
