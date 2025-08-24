const sequelize = require('../config/database');
const { 
  User, 
  Product, 
  Variant, 
  Cart, 
  CartItem,
  Order,
  OrderItem,
  Customer,
  Country,
  State,
  Region,
  Region_Country,
  Country_State,
  Department,
  Designation,
  Department_Designation,
  Employee
} = require('../models');

async function syncDatabase() {
  try {
    console.log('Starting database synchronization...');
    
    // Force sync will drop all tables and recreate them
    // Use with caution in production!
    const forceSync = process.argv.includes('--force');
    
    if (forceSync) {
      console.log('WARNING: Force sync enabled. This will drop all existing tables!');
      console.log('Waiting 5 seconds before proceeding...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Sync all models
    await sequelize.sync({ force: forceSync });
    
    console.log('Database synchronized successfully!');
    
    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      await User.create({
        email: 'admin@example.com',
        password: 'admin123', // In production, use a hashed password
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true
      });
      console.log('Admin user created');
    }
    
    // Create sample product if none exist
    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.create({
        name: 'Sample Product',
        slug: 'sample-product',
        description: 'This is a sample product',
        shortDescription: 'Sample product description',
        price: 99.99,
        stock: 100,
        category: 'Electronics',
        brand: 'Sample Brand',
        isActive: true,
        isFeatured: true
      });
      console.log('Sample product created');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
}

syncDatabase(); 