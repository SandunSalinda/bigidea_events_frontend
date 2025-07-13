// Product Service - Ready for backend integration
import { categoryService } from './categoryService.js';

const API_BASE_URL = import.meta.env.VITE_ECOM_API_URL || 'http://localhost:3000/api/ecom';

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('ecom_token');
};

// Create headers with authentication (for JSON requests)
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Create headers for FormData requests (no Content-Type)
const createFormDataHeaders = () => {
  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
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
      // Real API implementation:
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: createHeaders()
      });

      if (!response.ok) {
        // If unauthorized, might need to re-authenticate
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.data || [] };
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // If there's a network error, provide fallback
      if (error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Unable to connect to server. Please check if backend is running.' 
        };
      }
      
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
      console.log('🚀 Starting product creation process...');
      
      // Step 1: Ensure we have a category for T-shirts
      console.log('📁 Checking/creating category...');
      const categoryResult = await categoryService.ensureDefaultCategory();
      if (!categoryResult.success) {
        throw new Error('Failed to get category: ' + categoryResult.error);
      }
      
      const category = categoryResult.data;
      console.log('✅ Using category:', category.name, '(ID:', category._id, ')');

      // Step 2: Validate required fields
      if (!productData.name || !productData.description) {
        throw new Error('Product name and description are required');
      }

      // Step 3: Prepare FormData (backend expects FormData, not JSON)
      const formData = new FormData();
      
      // Add required text fields
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', category._id); // Use category ObjectId
      
      // Add optional fields if provided
      if (productData.productCode) {
        formData.append('productCode', productData.productCode);
      }
      
      // Handle images if provided
      if (productData.images && productData.images.length > 0) {
        console.log(`📷 Adding ${productData.images.length} images...`);
        for (let i = 0; i < productData.images.length; i++) {
          const image = productData.images[i];
          if (image instanceof File) {
            formData.append('images', image);
            console.log(`   - Image ${i + 1}: ${image.name} (${(image.size / 1024).toFixed(1)}KB)`);
          }
        }
      }

      // Log FormData contents for debugging
      console.log('📤 FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`   ${key}: [File] ${value.name}`);
        } else {
          console.log(`   ${key}: ${value}`);
        }
      }

      // Step 4: Send request using FormData
      console.log('🌐 Sending request to backend...');
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: createFormDataHeaders(), // Don't set Content-Type for FormData
        body: formData
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        
        let errorMessage = `Failed to create product (HTTP ${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('❌ Backend error:', errorData);
        } catch (e) {
          console.error('❌ Could not parse error response');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Product created successfully:', data);
      
      return { 
        success: true, 
        data: data.data || data,
        message: `Product "${productData.name}" created successfully!`
      };
    } catch (error) {
      console.error('❌ Error creating product:', error);
      
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Unable to connect to server. Please check if the backend is running at http://localhost:3000'
        };
      }
      
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
        `/uploads/ecom/uploaded_${Date.now()}_${index}.jpg`
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
