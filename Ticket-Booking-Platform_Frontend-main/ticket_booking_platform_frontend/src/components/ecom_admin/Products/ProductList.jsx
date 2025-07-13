import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import AddProductForm from './AddProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Simulate loading products
    const loadProducts = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setProducts([
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
            isActive: true
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
            isActive: true
          },
          { 
            _id: '3', 
            name: 'Vintage Style T-Shirt', 
            sku: 'TS003', 
            description: 'Retro-inspired t-shirt with a vintage washed finish',
            images: ['/images/products/tshirt3.png'],
            price: 34.99,
            quantity: 50,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Gray', 'Blue', 'Red'],
            material: '80% Cotton, 20% Polyester',
            isActive: true
          },
        ]);
        setIsLoading(false);
      }, 1000);
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = (productData) => {
    // Here you would typically make an API call to save the product
    console.log('Adding product:', productData);
    
    // For demo, add to the local state
    const newProduct = {
      _id: Date.now().toString(),
      ...productData
    };
    
    setProducts(prev => [newProduct, ...prev]);
    setShowAddForm(false);
    
    // You can show a success toast here
    alert('Product added successfully!');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Product
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package size={48} className="text-gray-400" />
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">SKU: {product.sku}</p>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="mb-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-xs text-gray-600">Sizes:</span>
                  {product.sizes?.map(size => (
                    <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {size}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-gray-600">Colors:</span>
                  {product.colors?.map(color => (
                    <span key={color} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                <span className="text-sm text-gray-600">Stock: {product.quantity}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center justify-center gap-1">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 flex items-center justify-center gap-1">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddProduct}
        />
      )}
    </div>
  );
};

export default ProductList;
