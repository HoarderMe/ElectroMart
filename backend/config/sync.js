const sequelize = require('./database');
const app = require('../app');
const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    console.log('Database connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
