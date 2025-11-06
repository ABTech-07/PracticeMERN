const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price originalPrice images category brand stock isActive'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out inactive products and calculate totals
    const activeCartItems = user.cart.filter(item => 
      item.product && item.product.isActive
    );

    // Calculate cart summary
    let subtotal = 0;
    let totalItems = 0;

    const cartItemsWithCalculations = activeCartItems.map(item => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;

      return {
        _id: item._id,
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          primaryImage: item.product.images.find(img => img.isPrimary)?.url || 
                       (item.product.images[0]?.url || ''),
          category: item.product.category,
          brand: item.product.brand,
          stock: item.product.stock,
          isActive: item.product.isActive
        },
        quantity: item.quantity,
        itemTotal,
        addedAt: item.addedAt
      };
    });

    res.json({
      success: true,
      cart: {
        items: cartItemsWithCalculations,
        summary: {
          totalItems,
          subtotal,
          itemCount: activeCartItems.length
        }
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be between 1 and 10'
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not available'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    const user = await User.findById(req.user._id);

    // Check if item already exists in cart
    const existingCartItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity if item already exists
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (newQuantity > 10) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more than 10 of the same item'
        });
      }

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      existingCartItem.quantity = newQuantity;
      existingCartItem.addedAt = new Date();
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity,
        addedAt: new Date()
      });
    }

    await user.save();

    // Return updated cart item
    const updatedUser = await User.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price originalPrice images category brand stock'
    });

    const addedItem = updatedUser.cart.find(item => 
      item.product._id.toString() === productId
    );

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      cartItem: {
        _id: addedItem._id,
        product: {
          _id: addedItem.product._id,
          name: addedItem.product.name,
          price: addedItem.product.price,
          primaryImage: addedItem.product.images.find(img => img.isPrimary)?.url || 
                       (addedItem.product.images[0]?.url || '')
        },
        quantity: addedItem.quantity,
        addedAt: addedItem.addedAt
      },
      cartItemsCount: updatedUser.cartItemsCount
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!quantity || quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be between 1 and 10'
      });
    }

    const user = await User.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price stock isActive'
    });

    // Find cart item
    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check if product is still active and in stock
    if (!cartItem.product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is no longer available'
      });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.product.stock} items available in stock`
      });
    }

    // Update quantity
    cartItem.quantity = quantity;
    cartItem.addedAt = new Date();
    
    await user.save();

    res.json({
      success: true,
      message: 'Cart updated successfully',
      cartItem: {
        _id: cartItem._id,
        quantity: cartItem.quantity,
        itemTotal: cartItem.product.price * cartItem.quantity
      },
      cartItemsCount: user.cartItemsCount
    });

  } catch (error) {
    console.error('Update cart error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart item ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user._id);

    // Find and remove cart item
    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Remove item using pull method
    user.cart.pull(itemId);
    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      cartItemsCount: user.cartItemsCount
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart item ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear all items from cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cartItemsCount: 0
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
});

module.exports = router;