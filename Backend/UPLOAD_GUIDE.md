# File Upload Guide

## Product Image Upload

The backend now supports file uploads for product images instead of base64 encoding.

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Directory Structure**
   ```
   Backend/
   └── public/
       └── uploads/
           └── products/
   ```
   The upload directory is automatically created when the server starts.

### API Usage

#### Create Product with Image Upload

**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (string, required): Product title
- `description` (string, required): Product description
- `image` (file, required): Image file (jpeg, jpg, png, gif, webp)
- `price` (number, required): Product price
- `stock` (number, optional): Stock quantity
- `category` (string, optional): Product category

**Example using FormData (JavaScript):**
```javascript
const formData = new FormData();
formData.append('title', 'Product Name');
formData.append('description', 'Product Description');
formData.append('image', fileInput.files[0]); // File input element
formData.append('price', '500');
formData.append('stock', '10');
formData.append('category', 'general');

fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

**Example using axios:**
```javascript
const formData = new FormData();
formData.append('title', 'Product Name');
formData.append('description', 'Product Description');
formData.append('image', fileInput.files[0]);
formData.append('price', '500');

axios.post('http://localhost:5000/api/products', formData, {
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'multipart/form-data'
  }
})
.then(res => console.log(res.data));
```

#### Update Product with Image Upload

**Endpoint:** `PUT /api/products/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (string, optional): Product title
- `description` (string, optional): Product description
- `image` (file, optional): New image file
- `price` (number, optional): Product price
- `stock` (number, optional): Stock quantity
- `category` (string, optional): Product category
- `isActive` (boolean, optional): Product active status

**Note:** If you don't provide an image file, the existing image will be kept. If you want to update the image URL without uploading a file, you can send `image` as a string in the form data.

### Image Access

Uploaded images are accessible via:
```
http://localhost:5000/uploads/products/<filename>
```

The API returns the image path in the response:
```json
{
  "success": true,
  "product": {
    "image": "/uploads/products/product-1234567890-123456789.jpg"
  }
}
```

### File Restrictions

- **Allowed formats:** JPEG, JPG, PNG, GIF, WEBP
- **Maximum file size:** 5MB
- **Storage location:** `Backend/public/uploads/products/`

### Error Handling

If file upload fails, you'll receive an error response:

```json
{
  "success": false,
  "message": "Only image files are allowed (jpeg, jpg, png, gif, webp)"
}
```

or

```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB"
}
```

### Frontend Integration Example

```javascript
// React example
const handleImageUpload = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', productData.title);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  
  if (selectedFile) {
    formData.append('image', selectedFile);
  }

  try {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: formData
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Product created:', result.product);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Notes

- The image field name in FormData must be `image`
- Images are stored with unique filenames to prevent conflicts
- Old images are not automatically deleted when updating products (you may want to implement cleanup)
- The upload directory is created automatically if it doesn't exist

