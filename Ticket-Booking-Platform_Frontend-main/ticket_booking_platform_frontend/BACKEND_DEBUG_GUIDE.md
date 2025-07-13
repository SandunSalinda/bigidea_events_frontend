# 🔍 Backend Integration Debug Guide

## 🚨 **ISSUE**: Products disappear after refresh & Shop shows "No products found"

**Root Cause**: Frontend-Backend data format mismatch or API response structure issues.

---

## 📋 **STEP-BY-STEP DEBUG CHECKLIST**

### **Step 1: Verify Backend API Responses**

#### **1.1 Test Products API Manually:**
```bash
# Test if products endpoint returns data
curl -X GET "http://localhost:3000/api/ecom/products"

# Expected Response:
{
  "status": "SUCCESS",
  "data": [
    {
      "_id": "product_id_here",
      "name": "Product Name",
      "description": "Product Description",
      "category": "category_id_or_object",
      "images": ["http://localhost:3000/uploads/ecom/image.jpg"],
      "productCode": "TS001",
      "createdAt": "2025-07-13T...",
      "deletedAt": 0  // ⚠️ IMPORTANT: Must be 0 for active products
    }
  ]
}
```

#### **1.2 Check Database Directly:**
```javascript
// In your backend, add temporary debug route:
app.get('/api/ecom/debug/products', async (req, res) => {
  try {
    const products = await Product.find(); // Get ALL products (no filters)
    console.log('📊 ALL PRODUCTS IN DATABASE:');
    console.log('Total count:', products.length);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - deletedAt: ${product.deletedAt}`);
    });
    res.json({ 
      total: products.length, 
      products: products 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### **Step 2: Check Product Creation Process**

#### **2.1 Add Detailed Logging in Backend:**
```javascript
// In your POST /api/ecom/products endpoint:
app.post('/api/ecom/products', upload.array('images'), async (req, res) => {
  try {
    console.log('🔧 === PRODUCT CREATION DEBUG ===');
    console.log('📝 Request body:', req.body);
    console.log('🖼️ Files:', req.files?.map(f => f.filename));
    console.log('🔑 Headers:', req.headers.authorization ? 'Token present' : 'No token');
    
    // Check required fields
    const { name, description, category } = req.body;
    console.log('✅ Required fields check:');
    console.log('- Name:', name ? '✅' : '❌');
    console.log('- Description:', description ? '✅' : '❌');
    console.log('- Category:', category ? '✅' : '❌');
    
    // Your existing product creation logic...
    const newProduct = await Product.create({
      name,
      description, 
      category,
      // ... other fields
    });
    
    console.log('💾 Product saved to database:');
    console.log('- ID:', newProduct._id);
    console.log('- Name:', newProduct.name);
    console.log('- deletedAt:', newProduct.deletedAt);
    
    res.json({
      status: 'SUCCESS',
      message: 'Product added successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('❌ Product creation error:', error);
    res.status(400).json({ status: 'FAILED', message: error.message });
  }
});
```

#### **2.2 Test Product Creation Manually:**
```bash
# First, get a valid token
TOKEN=$(curl -s -X POST "http://localhost:3000/api/ecom/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Create a category first
curl -X POST "http://localhost:3000/api/ecom/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"T-Shirts","description":"T-shirt collection"}'

# Get the category ID
curl -X GET "http://localhost:3000/api/ecom/categories" | jq '.'

# Create a test product (replace CATEGORY_ID with actual ID)
curl -X POST "http://localhost:3000/api/ecom/products" \
  -H "Authorization: Bearer $TOKEN" \
  -F 'name=Test Product' \
  -F 'description=Test Description' \
  -F 'category=CATEGORY_ID_HERE'
```

### **Step 3: Frontend Request Analysis**

#### **3.1 Check What Frontend Sends:**
Add this to your backend temporarily:
```javascript
// Middleware to log all requests to products endpoint
app.use('/api/ecom/products', (req, res, next) => {
  console.log('🔍 === FRONTEND REQUEST DEBUG ===');
  console.log('Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Authorization:', req.headers.authorization ? 'Present' : 'Missing');
  
  if (req.method === 'POST') {
    console.log('Body keys:', Object.keys(req.body || {}));
    console.log('Files:', req.files?.length || 0);
    
    // Log FormData contents
    for (const [key, value] of Object.entries(req.body || {})) {
      console.log(`- ${key}:`, value);
    }
  }
  next();
});
```

### **Step 4: Database Schema Validation**

#### **4.1 Verify Product Model:**
```javascript
// Check your Product schema has these fields:
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true 
  },
  productCode: { type: String },
  images: [{ type: String }], // Array of image URLs
  deletedAt: { type: Number, default: 0 }, // ⚠️ CRITICAL FOR FRONTEND
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

#### **4.2 Check Product Filtering:**
```javascript
// In your GET /products endpoint, ensure you filter by deletedAt:
app.get('/api/ecom/products', async (req, res) => {
  try {
    // ⚠️ IMPORTANT: Only return non-deleted products
    const products = await Product.find({ deletedAt: 0 })
      .populate('category')
      .sort({ createdAt: -1 });
    
    console.log(`📊 Found ${products.length} active products`);
    
    res.json({
      status: 'SUCCESS',
      data: products
    });
  } catch (error) {
    res.status(500).json({ status: 'FAILED', message: error.message });
  }
});
```

### **Step 5: Category Management**

#### **5.1 Check Categories Exist:**
```bash
# Test categories endpoint
curl -X GET "http://localhost:3000/api/ecom/categories"

# Should return:
{
  "status": "SUCCESS", 
  "data": [
    {
      "_id": "category_id_here",
      "name": "T-Shirts",
      "description": "T-shirt collection",
      "deletedAt": 0
    }
  ]
}
```

#### **5.2 Auto-create Category if Missing:**
```javascript
// Add this to your POST /products endpoint:
app.post('/api/ecom/products', upload.array('images'), async (req, res) => {
  try {
    let { category } = req.body;
    
    // If no category provided, create default
    if (!category) {
      let defaultCategory = await Category.findOne({ name: 'T-Shirts', deletedAt: 0 });
      
      if (!defaultCategory) {
        defaultCategory = await Category.create({
          name: 'T-Shirts',
          description: 'T-shirt collection',
          deletedAt: 0
        });
        console.log('✅ Created default T-Shirts category:', defaultCategory._id);
      }
      
      category = defaultCategory._id;
    }
    
    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Invalid category ID'
      });
    }
    
    // Continue with product creation...
  } catch (error) {
    console.error('Category error:', error);
    res.status(400).json({ status: 'FAILED', message: error.message });
  }
});
```

### **Step 6: Image Handling**

#### **6.1 Check Image URLs:**
```javascript
// In your product creation, ensure image URLs are full paths:
const product = new Product({
  name,
  description,
  category,
  images: req.files?.map(file => 
    `http://localhost:3000/uploads/ecom/${file.filename}`
  ) || [],
  deletedAt: 0 // ⚠️ IMPORTANT
});
```

#### **6.2 Test Image Upload:**
```bash
# Test with actual image file
curl -X POST "http://localhost:3000/api/ecom/products" \
  -H "Authorization: Bearer $TOKEN" \
  -F 'name=Image Test Product' \
  -F 'description=Testing image upload' \
  -F 'category=CATEGORY_ID' \
  -F 'images=@/path/to/test-image.jpg'
```

---

## 🔧 **CRITICAL CHECKS**

### **Check 1: Response Format**
Your GET /products must return exactly this structure:
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name", 
      "description": "Description",
      "category": "category_id_or_object",
      "images": ["http://localhost:3000/uploads/ecom/image.jpg"],
      "deletedAt": 0
    }
  ]
}
```

### **Check 2: Database Persistence**
```javascript
// After creating product, verify it's in database:
const savedProduct = await Product.findById(newProduct._id);
console.log('🔍 Product in database:', savedProduct ? 'YES' : 'NO');
```

### **Check 3: CORS & Headers**
```javascript
// Ensure CORS allows frontend domain:
app.use(cors({
  origin: 'http://localhost:5174', // Frontend URL
  credentials: true
}));
```

---

## 🧪 **DEBUGGING TESTS**

### **Test 1: Manual Database Check**
```javascript
// Add temporary route to see all products:
app.get('/api/ecom/debug/all-products', async (req, res) => {
  const products = await Product.find({}); // No filters
  res.json({ 
    total: products.length,
    active: products.filter(p => p.deletedAt === 0).length,
    deleted: products.filter(p => p.deletedAt !== 0).length,
    products: products
  });
});
```

### **Test 2: Frontend Network Check**
Tell me what you see in browser Network tab when:
1. Login to admin
2. Go to products page  
3. Add a product
4. Refresh page

### **Test 3: Console Logs**
Add these console logs and share the output:
```javascript
// In GET /products:
console.log('📊 Products query result:', products.length);
console.log('📊 First product:', products[0]);

// In POST /products:
console.log('💾 Saving product:', productData);
console.log('✅ Product saved:', savedProduct._id);
```

---

## 🎯 **EXPECTED BEHAVIOR**

### **Correct Flow:**
1. Frontend sends FormData to POST /products
2. Backend creates product with `deletedAt: 0`
3. Product saves to database
4. GET /products returns product in array
5. Frontend displays product
6. Product persists after refresh

### **Common Issues:**
- ❌ Product saved with `deletedAt: 1` (soft deleted)
- ❌ Category validation fails
- ❌ Response format doesn't match frontend expectations
- ❌ Images not saved with full URLs
- ❌ GET endpoint filters out the new product

---

## 🔧 **QUICK FIX CHECKLIST**

Run these backend fixes:

1. **Set deletedAt correctly:**
```javascript
deletedAt: 0  // Not 1, not null, exactly 0
```

2. **Return full image URLs:**
```javascript
images: files.map(f => `http://localhost:3000/uploads/ecom/${f.filename}`)
```

3. **Filter products correctly:**
```javascript
Product.find({ deletedAt: 0 })  // Only active products
```

4. **Auto-create categories:**
```javascript
// Create default category if none exists
```

5. **Log everything:**
```javascript
console.log('Product saved:', product);
console.log('Products found:', products.length);
```

---

## 📞 **WHAT TO SHARE WITH ME**

Please run these and share the output:

1. `curl -X GET "http://localhost:3000/api/ecom/products"`
2. Backend console logs when creating a product
3. Database query result: `db.products.find({})`
4. Browser Network tab screenshot
5. Backend Product model schema

This will help identify the exact mismatch! 🔍
