export const loginUser = async (email, password) => {
    try {
      // Mock authentication - replace this with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // For demo purposes, accept any email/password combination
      if (email && password) {
        const mockUserData = {
          user: {
            id: '1',
            name: 'E-commerce Admin',
            email: email
          },
          token: 'mock-jwt-token-' + Date.now()
        };
        return mockUserData;
      } else {
        throw new Error('Email and password are required');
      }
      
      // Uncomment below for real API integration:
      /*
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
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
      */
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

export const verifyToken = async (token) => {
  try {
    // Mock token verification - replace this with real API call when backend is ready
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // For demo purposes, accept any token that starts with 'mock-jwt-token'
    if (token && token.startsWith('mock-jwt-token')) {
      const mockUserData = {
        user: {
          id: '1',
          name: 'E-commerce Admin',
          email: 'admin@bigidea.com'
        }
      };
      return mockUserData;
    } else {
      throw new Error('Invalid token');
    }
    
    // Uncomment below for real API integration:
    /*
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
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
    */
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};
