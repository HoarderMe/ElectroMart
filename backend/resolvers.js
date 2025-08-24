// graphql/resolvers.js
const { 
    Customer, Order,  Employee, User, 
    Product, Variant, OrderItem, Wishlist
  } = require('./models');
  
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  
  const resolvers = {
    Query: {
      customers: async () => await Customer.findAll({ 
        include: [{ model: Order, as: 'orders' }] 
      }),
      customer: async (_, { id }) => await Customer.findByPk(id, { 
        include: [{ model: Order, as: 'orders' }] 
      }),
      orders: async () => await Order.findAll({ 
        include: [
          { model: Customer, as: 'customer' },
          { model: User, as: 'user' },
          { 
            model: OrderItem, 
            as: 'items',
            include: [{ 
              model: Variant, 
              as: 'variant',
              include: [{ 
                model: Product, 
                as: 'product' 
              }] 
            }] 
          }
        ]
      }),
      order: async (_, { id }) => await Order.findByPk(id, { 
        include: [
          { model: Customer, as: 'customer' },
          { model: User, as: 'user' },
          { 
            model: OrderItem, 
            as: 'items',
            include: [{ 
              model: Variant, 
              as: 'variant',
              include: [{ 
                model: Product, 
                as: 'product' 
              }] 
            }] 
          }
        ]
      }),
   
      users: async () => await User.findAll(),
      user: async (_, { id }) => await User.findByPk(id),
      products: async () => await Product.findAll({ 
        include: [{ model: Variant, as: 'variants' }] 
      }),
      product: async (_, { id }) => await Product.findByPk(id, { 
        include: [{ model: Variant, as: 'variants' }] 
      }),
      wishlist: async () => {
        try {
          const wishlistItems = await Wishlist.findAll({
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['productId', 'name', 'imageUrl']
              }
            ]
          });
          return wishlistItems;
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          throw new Error('Failed to fetch wishlist items');
        }
      },
      wishlistItem: async (_, { id }) => {
        try {
          const wishlistItem = await Wishlist.findByPk(id, {
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['productId', 'name', 'imageUrl']
              }
            ]
          });
          return wishlistItem;
        } catch (error) {
          console.error('Error fetching wishlist item:', error);
          throw new Error('Failed to fetch wishlist item');
        }
      }
    },
    Mutation: {
      createCustomer: async (_, { firstName, lastName, address, dob, userId, email, phoneNumber }) => {
        return await Customer.create({ firstName, lastName, address, dob, userId, email, phoneNumber });
      },
      createOrder: async (_, { orderDate, customerId, orderStatus, orderTotal }) => {
        return await Order.create({ orderDate, customerId, orderStatus, orderTotal });
      },
      
      createUser: async (_, { password, username, email, phoneNumber, dob, role }) => {
        return await User.create({ password, username, email, phoneNumber, dob, role });
      },
      updateProfile: async (_, { firstName, lastName, email, phoneNumber }, { user }) => {
        if (!user) {
          throw new Error('Not authenticated');
        }

        try {
          const [updatedRows, [updatedUser]] = await User.update(
            {
              firstName,
              lastName,
              email,
              phoneNumber,
            },
            {
              where: { userId: user.userId },
              returning: true
            }
          );

          if (!updatedUser) {
            throw new Error('User not found');
          }

          return updatedUser;
        } catch (error) {
          throw new Error('Failed to update profile: ' + error.message);
        }
      },
      updatePassword: async (_, { currentPassword, newPassword }, { user }) => {
        if (!user) {
          throw new Error('Not authenticated');
        }

        try {
          const userDoc = await User.findById(user.userId);
          if (!userDoc) {
            throw new Error('User not found');
          }

          // Verify current password
          const isValid = await userDoc.comparePassword(currentPassword);
          if (!isValid) {
            throw new Error('Current password is incorrect');
          }

          // Update password
          userDoc.password = newPassword;
          await userDoc.save();

          return userDoc;
        } catch (error) {
          throw new Error('Failed to update password: ' + error.message);
        }
      },
      login: async (_, { email, password }) => {
        try {
          const user = await User.findOne({ where: { email } });
          if (!user) {
            throw new Error('No user found with this email');
          }

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            throw new Error('Invalid password');
          }

          const token = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          );

          return {
            token,
            user
          };
        } catch (error) {
          throw new Error('Login failed: ' + error.message);
        }
      },
    },
    Customer: {
      orders: async (customer) => await customer.getOrders(),
    },
    Order: {
      customer: async (order) => await Customer.findByPk(order.customerId),
      user: async (order) => await User.findByPk(order.userId),
      orderItems: async (order) => await order.getOrderItems(),
    },
    OrderItem: {
      order: async (orderItem) => await Order.findByPk(orderItem.orderId),
      variant: async (orderItem) => await Variant.findByPk(orderItem.variantId),
      price: (orderItem) => orderItem.priceAtTime || 0
    },
    Product: {
      variants: async (product) => await product.getVariants()
    },
    User: {
      wishlist: async (user) => {
        try {
          const wishlistItems = await Wishlist.findAll({
            where: { userId: user.userId },
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['productId', 'name', 'imageUrl']
              }
            ]
          });
          return wishlistItems;
        } catch (error) {
          console.error('Error fetching user wishlist:', error);
          throw new Error('Failed to fetch user wishlist');
        }
      }
    },
  };
  
  module.exports = resolvers;