export const loginUser = async (email, password) => {
    try {
      // Use real API integration
      const response = await fetch(`${import.meta.env.VITE_ECOM_API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      if (data.status === 'SUCCESS') {
        return data.data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

export const verifyToken = async (token) => {
  try {
    // Use real API integration
    const response = await fetch(`${import.meta.env.VITE_ECOM_API_URL}/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    if (data.status === 'SUCCESS') {
      return data.data;
    } else {
      throw new Error(data.message || 'Token verification failed');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};
