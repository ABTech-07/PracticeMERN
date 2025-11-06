const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  
  // Customer Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required for order']
  },
  
  // Order Items - Embedded subdocuments
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true // Store product name at time of order
    },
    price: {
      type: Number,
      required: true // Store price at time of order
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    total: {
      type: Number,
      required: true
    },
    // Store product details at time of purchase
    productSnapshot: {
      image: String,
      brand: String,
      category: String
    }
  }],
  
  // Order Totals
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Order Status Management
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      message: 'Please select a valid order status'
    },
    default: 'pending'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
      message: 'Please select a valid payment status'
    },
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery', 'bank_transfer'],
    required: true
  },
  paymentId: {
    type: String, // Stripe payment intent ID or other payment gateway ID
    trim: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  
  // Shipping Information
  shippingAddress: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  
  // Billing Address (optional - defaults to shipping)
  billingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  
  // Shipping & Tracking
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'pickup'],
    default: 'standard'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  carrier: {
    type: String,
    trim: true
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  
  // Order Timeline
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Additional Information
  notes: {
    type: String,
    maxlength: 500
  },
  customerNotes: {
    type: String,
    maxlength: 500
  },
  
  // Coupon/Promo Code
  couponCode: {
    type: String,
    uppercase: true,
    trim: true
  },
  
  // Refund Information
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String,
    trim: true
  },
  refundDate: {
    type: Date
  }
  
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'items.product': 1 });
orderSchema.index({ createdAt: -1 });

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Find the last order of today
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^ORD-${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD-${year}${month}${day}${String(sequence).padStart(3, '0')}`;
  }
  next();
});

// Update status history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Order status updated to ${this.status}`
    });
  }
  next();
});

// Virtual for full shipping address
orderSchema.virtual('fullShippingAddress').get(function() {
  if (!this.shippingAddress) return '';
  const addr = this.shippingAddress;
  return `${addr.firstName} ${addr.lastName}, ${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Calculate totals method
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.totalAmount = this.subtotal + this.tax + this.shippingCost - this.discount;
  return this.totalAmount;
};

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id;
    return ret;
  }
});

module.exports = mongoose.model('Order', orderSchema);