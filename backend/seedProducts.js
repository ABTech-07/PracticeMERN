const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

// Function to create sample products with proper createdBy field
const createSampleProducts = (adminUserId) => [
  {
    name: "iPhone 15 Pro",
    description: "The latest iPhone with A17 Pro chip, advanced camera system, and titanium design. Perfect for photography enthusiasts and power users.",
    price: 999,
    originalPrice: 1099,
    category: "electronics",
    brand: "Apple",
    stock: 50,
    images: [
      {
        url: "/images/products/iphone-15-pro-1.jpg",
        altText: "iPhone 15 Pro front view",
        isPrimary: true
      },
      {
        url: "/images/products/iphone-15-pro-2.jpg",
        altText: "iPhone 15 Pro back view",
        isPrimary: false
      }
    ],
    specifications: {
      dimensions: "6.1 x 2.78 x 0.32 inches",
      weight: "187g",
      color: "Natural Titanium",
      material: "Titanium",
      warranty: "1 year limited warranty"
    },
    tags: ["smartphone", "apple", "premium", "5g", "camera"],
    isActive: true,
    isFeatured: true,
    createdBy: adminUserId
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features for productivity and creativity.",
    price: 1199,
    originalPrice: 1299,
    category: "electronics",
    brand: "Samsung",
    stock: 35,
    images: [
      {
        url: "/images/products/samsung-galaxy-s24-ultra.jpg",
        altText: "Samsung Galaxy S24 Ultra",
        isPrimary: true
      }
    ],
    specifications: {
      dimensions: "6.8 x 3.11 x 0.34 inches",
      weight: "232g", 
      color: "Titanium Black",
      material: "Aluminum and Glass",
      warranty: "1 year manufacturer warranty"
    },
    tags: ["android", "samsung", "s-pen", "camera", "premium"],
    isActive: true,
    isFeatured: true,
    createdBy: adminUserId
  },
  {
    name: "MacBook Air M3",
    description: "Ultra-thin laptop powered by Apple M3 chip. Perfect for students and professionals who need portability without compromising performance.",
    price: 1099,
    originalPrice: 1199,
    category: "electronics",
    brand: "Apple",
    stock: 25,
    images: [
      {
        url: "/images/products/macbook-air-m3.jpg",
        altText: "MacBook Air M3",
        isPrimary: true
      }
    ],
    specifications: {
      dimensions: "11.97 x 8.46 x 0.44 inches",
      weight: "2.7 lbs",
      color: "Space Gray",
      material: "Aluminum",
      warranty: "1 year limited warranty"
    },
    tags: ["laptop", "apple", "m3", "portable", "student"],
    isActive: true,
    createdBy: adminUserId
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.",
    price: 349,
    originalPrice: 399,
    category: "electronics",
    brand: "Sony",
    stock: 75,
    images: [
      {
        url: "/images/products/sony-wh1000xm5-headphones.jpg",
        altText: "Sony WH-1000XM5 Headphones",
        isPrimary: true
      }
    ],
    specifications: {
      dimensions: "7.3 x 9.9 x 1.2 inches",
      weight: "250g",
      color: "Black",
      material: "Plastic and Metal",
      warranty: "1 year manufacturer warranty"
    },
    tags: ["headphones", "sony", "noise-canceling", "wireless", "premium"],
    isActive: true,
    createdBy: adminUserId
  },
  {
    name: "Nike Air Force 1 '07",
    description: "Classic basketball shoe with timeless style. Made with premium leather and featuring the iconic Air-Sole unit for comfort.",
    price: 90,
    originalPrice: 110,
    category: "clothing",
    brand: "Nike",
    stock: 100,
    images: [
      {
        url: "/images/products/nike-air-force-1-white.jpg",
        altText: "Nike Air Force 1 White",
        isPrimary: true
      }
    ],
    specifications: {
      dimensions: "US 8-12 available",
      weight: "1.2 lbs",
      color: "White/White",
      material: "Premium leather",
      warranty: "Nike manufacturer warranty"
    },
    tags: ["shoes", "nike", "sneakers", "classic", "basketball"],
    isActive: true,
    createdBy: adminUserId
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "The original straight fit jeans that started it all. Made with premium denim and featuring the classic button fly.",
    price: 69,
    originalPrice: 89,
    category: "clothing",
    brand: "Levi's",
    stock: 80,
    images: [
      {
        url: "/images/products/levis-501-original-jeans.jpg",
        altText: "Levi's 501 Original Jeans",
        isPrimary: true
      }
    ],
    specifications: {
      dimensions: "Waist 28-42 inches",
      weight: "1.5 lbs",
      color: "Medium Blue",
      material: "100% Cotton Denim",
      warranty: "Levi's quality guarantee"
    },
    tags: ["jeans", "levis", "denim", "classic", "straight-fit"],
    isActive: true,
    createdBy: adminUserId
  },
  {
    name: "Instant Pot Duo 7-in-1",
    description: "Multi-functional electric pressure cooker that replaces 7 kitchen appliances. Perfect for quick, healthy meal preparation.",
    price: 79,
    originalPrice: 99,
    category: "home",
    brand: "Instant Pot",
    stock: 45,
    images: [
      {
        url: "/images/products/instant-pot-duo-7in1.jpg",
        altText: "Instant Pot Duo 7-in-1",
        isPrimary: true
      }
    ],
    specifications: {
      dimensions: "13.43 x 12.8 x 12.2 inches",
      weight: "11.8 lbs",
      color: "Stainless Steel",
      material: "Stainless Steel",
      warranty: "1 year limited warranty"
    },
    tags: ["kitchen", "appliance", "pressure-cooker", "multi-functional", "cooking"],
    isActive: true,
    createdBy: adminUserId
  },
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    description: "Advanced cordless vacuum with laser dust detection technology and powerful suction for deep cleaning on all floor types.",
    price: 649,
    originalPrice: 749,
    category: "home",
    brand: "Dyson",
    stock: 20,
    images: [
      {
        url: "/images/products/dyson-v15-detect-vacuum.jpg",
        altText: "Dyson V15 Detect Cordless Vacuum",
        isPrimary: true
      }
    ],
    specifications: {
      dimensions: "49.6 x 9.8 x 10.5 inches",
      weight: "2.97 kg",
      color: "Yellow/Nickel",
      material: "ABS Plastic and Metal",
      warranty: "2 year limited warranty"
    },
    tags: ["vacuum", "dyson", "cordless", "laser-detection", "cleaning"],
    isActive: true,
    createdBy: adminUserId
  }
];

// Function to seed the database
const seedProducts = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📂 Connected to MongoDB for seeding');

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`📦 ${existingProducts} products already exist in the database`);
      console.log('Skipping seed operation. To force seed, clear the products collection first.');
      process.exit(0);
    }

    // Create or find admin user for seeding
    let adminUser = await User.findOne({ email: 'admin@ecommerce.com' });
    if (!adminUser) {
      console.log('👤 Creating admin user for seeding...');
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@ecommerce.com',
        password: 'Admin123!',
        role: 'admin',
        phone: '+1234567890'
      });
      await adminUser.save();
      console.log('✅ Admin user created for seeding');
    } else {
      console.log('👤 Using existing admin user for seeding');
    }

    // Generate sample products with admin user ID
    const sampleProducts = createSampleProducts(adminUser._id);

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${createdProducts.length} products to the database`);

    // Display created products summary
    console.log('\n📋 Created Products Summary:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Function to clear products (for development)
const clearProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📂 Connected to MongoDB for clearing');

    const result = await Product.deleteMany({});
    console.log(`🗑️ Cleared ${result.deletedCount} products from the database`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error clearing products:', error);
    process.exit(1);
  }
};

// Check command line arguments
const command = process.argv[2];

if (command === 'clear') {
  console.log('🗑️ Clearing products from database...');
  clearProducts();
} else {
  console.log('🌱 Seeding products to database...');
  seedProducts();
}

// Export functions for programmatic use
module.exports = { seedProducts, clearProducts };