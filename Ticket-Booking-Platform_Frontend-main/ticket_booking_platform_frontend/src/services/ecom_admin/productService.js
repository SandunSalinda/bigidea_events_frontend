// Product Service - Ready for backend integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

// Mock data for demonstration (remove when connecting to real backend)
const mockProducts = [
  {
    _id: '1',
    name: 'Classic Cotton T-Shirt',
    sku: 'TS001',
    description: 'A comfortable cotton t-shirt perfect for everyday wear',
    images: ['/images/products/tshirt1.jpg'],
    price: 29.99,
    quantity: 100,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray'],
    material: '100% Cotton',
    isActive: true,
    createdAt: '2024-07-01T00:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Premium Organic T-Shirt',
    sku: 'TS002',
    description: 'Eco-friendly organic cotton t-shirt with superior comfort',
    images: ['/images/products/tshirt2.jpg'],
    price: 39.99,
    quantity: 75,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Green', 'White'],
    material: '100% Organic Cotton',
    isActive: true,
    createdAt: '2024-07-02T00:00:00.000Z'
  }
];

export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      // Mock implementation - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return { success: true, data: mockProducts };

      // Real API implementation (uncomment when backend is ready):
      /*
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: createHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.products || data };
      */
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, error: error.message };
    }
  },

  // Get single product by ID
  async getProductById(id) {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      const product = mockProducts.find(p => p._id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return { success: true, data: product };

      // Real API implementation:
      /*
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: createHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.product || data };
      */
    } catch (error) {
      console.error('Error fetching product:', error);
      return { success: false, error: error.message };
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newProduct = {
        _id: Date.now().toString(),
        ...productData,
        createdAt: new Date().toISOString()
      };
      mockProducts.unshift(newProduct);
      return { success: true, data: newProduct };

      // Real API implementation:
      /*
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const data = await response.json();
      return { success: true, data: data.product || data };
      */
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, error: error.message };
    }
  },

  // Update product
  async updateProduct(id, productData) {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockProducts.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      mockProducts[index] = { ...mockProducts[index], ...productData };
      return { success: true, data: mockProducts[index] };

      // Real API implementation:
      /*
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const data = await response.json();
      return { success: true, data: data.product || data };
      */
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockProducts.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      mockProducts.splice(index, 1);
      return { success: true };

      // Real API implementation:
      /*
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: createHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      return { success: true };
      */
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  },

  // Upload product images
  async uploadImages(files) {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const uploadedUrls = files.map((file, index) => 
        `/images/products/uploaded_${Date.now()}_${index}.jpg`
      );
      return { success: true, data: uploadedUrls };

      // Real API implementation:
      /*
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await fetch(`${API_BASE_URL}/products/upload-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
          // Don't set Content-Type for FormData
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload images');
      }

      const data = await response.json();
      return { success: true, data: data.imageUrls || data };
      */
    } catch (error) {
      console.error('Error uploading images:', error);
      return { success: false, error: error.message };
    }
  },

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      const filtered = mockProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      return { success: true, data: filtered };

      // Real API implementation:
      /*
      const searchParams = new URLSearchParams({
        q: query,
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/products/search?${searchParams}`, {
        method: 'GET',
        headers: createHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.products || data };
      */
    } catch (error) {
      console.error('Error searching products:', error);
      return { success: false, error: error.message };
    }
  }
};

export default productService;
