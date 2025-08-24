const { up } = require('../migrations/create_wishlist_table');

async function runMigration() {
  try {
    await up();
    console.log('Wishlist migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Wishlist migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 