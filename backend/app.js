const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');
const typeDefs = require('./typeDefs.js');
const resolvers = require('./resolvers.js');
const { ApolloServer } = require('apollo-server-express');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 4000;


const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// REST API routes
app.use('/api', require('./routes'));
app.use('/api/payments', paymentRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

async function startServer() {
  try {
    // Force sync database to recreate tables
    await sequelize.sync(
      // { force: true }
    );
    console.log('Database connected and tables recreated successfully.');

    // Create Apollo Server
    const server = new ApolloServer({ 
      typeDefs, 
      resolvers,
      context: ({ req }) => ({
        // Add any context you need here
      })
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();