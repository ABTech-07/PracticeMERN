const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Pricing & Inventory
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  
  // Product Classification
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'automotive', 'other'],
      message: 'Please select a valid category'
    }
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  
  // Inventory Management
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  
  // Media & Assets
  images: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(url) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        },
        message: 'Please provide a valid image URL'
      }
    },
    altText: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Product Features & Specifications
  features: [String],
  specifications: {
    weight: String,
    dimensions: String,
    color: String,
    material: String,
    warranty: String
  },
  
  // Ratings & Reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // SEO & Marketing
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  
  // Product Status
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // Relationships
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product creator is required']
  },
  
  // Timestamps for product lifecycle
  publishedAt: {
    type: Date
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdBy: 1 });
productSchema.index({ isActive: 1, isDeleted: 1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : '');
});

// Virtual for savings amount
productSchema.virtual('savings').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Middleware to set publishedAt when product becomes active
productSchema.pre('save', function(next) {
  if (this.isActive && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id;
    return ret;
  }
});

productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);