import React, { useState, useRef, useEffect } from "react";
import ProductCard from "../components/ecom_Components/cards/ProductCard";
import ShopNav from "../components/ecom_Components/navigation/ShopNav";
import Footer from "../components/Footer";
import CartSlider from "../components/ecom_Components/cart/CartSlider";
import { getProductImage } from "../utils/images";
import { heroBg, defaultImage } from "../utils/images";
import { ToastContainer } from "react-toastify";
import { productService } from "../services/ecom_admin/productService";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsSectionRef = useRef(null);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await productService.getAllProducts();
        if (result.success) {
          // Transform data to match the expected format for ProductCard
          const transformedProducts = result.data.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '/images/products/default.jpg',
            category: 'tshirt', // Since you mentioned it's t-shirts only
            rating: 4.5, // Default rating
            sizes: product.sizes || ['S', 'M', 'L', 'XL'],
            colors: product.colors || [],
            description: product.description,
            sku: product.sku,
            isActive: product.isActive
          }));
          setProducts(transformedProducts);
        } else {
          setError(result.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!product || !product.name) return false;
    // Only show active products
    if (product.isActive === false) return false;
    const query = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';
    const productName = product.name.toLowerCase();
    return productName.includes(query);
  });

  const handleShopCollectionClick = () => {
    productsSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNav onSearch={setSearchQuery} />
      <CartSlider />
      <ToastContainer/>

      <div className="relative h-[80vh] overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={heroBg}
            alt="Music event background"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-8">
            CURATED SOUNDSCAPES
          </h1>
          <button 
            onClick={handleShopCollectionClick}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 mt-4"
          >
            Shop Collection
          </button>
        </div>
      </div>

      <main ref={productsSectionRef} className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
          <p className="text-gray-600 mt-2">
            {loading ? 'Loading...' : `${filteredProducts.length} products available`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-red-500">
              Error loading products
            </h3>
            <p className="text-gray-400 mt-2">
              {error}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="transform hover:-translate-y-1 transition-all duration-200"
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-500">
              No products found
            </h3>
            <p className="text-gray-400 mt-2">
              Try searching for something else
            </p>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
};

export default Shop;