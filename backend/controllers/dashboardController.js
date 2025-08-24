const { Order, Product, User,  sequelize } = require('../models');
const { Op } = require('sequelize');
const Customer = require('../models/customer');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total sales and growth
    const currentMonthSales = await Order.sum('orderTotal', {
      where: {
        orderDate: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        },
        orderStatus: {
          [Op.notIn]: ['cancelled', 'pending']
        }
      }
    });

    const lastMonthSales = await Order.sum('orderTotal', {
      where: {
        orderDate: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          [Op.lt]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        },
        orderStatus: {
          [Op.notIn]: ['cancelled', 'pending']
        }
      }
    });

    const salesGrowth = lastMonthSales ? ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100 : 0;

    // Get total orders and growth
    const currentMonthOrders = await Order.count({
      where: {
        orderDate: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const lastMonthOrders = await Order.count({
      where: {
        orderDate: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          [Op.lt]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const ordersGrowth = lastMonthOrders ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0;

    // Get total products and growth
    const totalProducts = await Product.count();
    const lastMonthProducts = await Product.count({
      where: {
        createdAt: {
          [Op.lt]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const productsGrowth = lastMonthProducts ? ((totalProducts - lastMonthProducts) / lastMonthProducts) * 100 : 0;

    // Get total customers and growth
    const totalCustomers = await User.count({
      where: {
        role: 'customer'
      }
    });

    const lastMonthCustomers = await User.count({
      where: {
        role: 'customer',
        createdAt: {
          [Op.lt]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const customersGrowth = lastMonthCustomers ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : 0;

    // Get recent orders
    const recentOrders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['orderDate', 'DESC']],
      limit: 5
    });

    // Get low stock products
    const lowStockProducts = await Product.findAll({
      where: {
        stock: {
          [Op.lt]: 10
        }
      },
      order: [['stock', 'ASC']],
      limit: 5
    });

    // Get recent activity
    const recentActivity = await Order.findAll({
      attributes: ['orderId', 'orderStatus', 'orderDate'],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['orderDate', 'DESC']],
      limit: 10
    });

    res.json({
      totalSales: currentMonthSales || 0,
      salesGrowth: parseFloat(salesGrowth.toFixed(2)),
      totalOrders: currentMonthOrders,
      ordersGrowth: parseFloat(ordersGrowth.toFixed(2)),
      totalProducts,
      productsGrowth: parseFloat(productsGrowth.toFixed(2)),
      totalCustomers,
      customersGrowth: parseFloat(customersGrowth.toFixed(2)),
      recentOrders: recentOrders.map(order => ({
        orderId: order.orderId,
        orderTotal: order.orderTotal,
        orderStatus: order.orderStatus,
        customer: order.customer ? {
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          email: order.customer.email
        } : null,
        orderDate: order.orderDate,
        orderItems: order.orderItems ? order.orderItems.map(item => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          price: item.priceAtTime || 0
        })) : []
      })),
      lowStockProducts: lowStockProducts.map(product => ({
        productId: product.productId,
        name: product.name,
        stock: product.stock,
        price: product.price
      })),
      recentActivity: recentActivity.map(activity => ({
        id: activity.orderId,
        type: 'order',
        status: activity.orderStatus,
        customer: activity.customer ? `${activity.customer.firstName} ${activity.customer.lastName}` : 'Unknown',
        timestamp: activity.orderDate
      }))
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
}; 