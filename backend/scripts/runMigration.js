const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');

async function runMigration() {
  try {
    // Create the Payments table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Payments (
        paymentId INT AUTO_INCREMENT PRIMARY KEY,
        orderId INT NOT NULL,
        razorpayOrderId VARCHAR(255) NOT NULL,
        razorpayPaymentId VARCHAR(255),
        razorpaySignature VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'INR',
        status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
        paymentMethod VARCHAR(50) NOT NULL DEFAULT 'razorpay',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES Orders(orderId) ON DELETE CASCADE,
        INDEX idx_orderId (orderId),
        INDEX idx_razorpayOrderId (razorpayOrderId),
        INDEX idx_status (status)
      )
    `);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

runMigration(); 