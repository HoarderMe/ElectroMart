const { Sequelize } = require('sequelize');
const { Variant, Product, Customer, Address, sequelize } = require('../models');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem')
const { Op } = require('sequelize');

const createOrderWithItems = async (req, res) => {
  const { items, total, customer } = req.body;
  const { userId } = req.user;
  let transaction;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }

  try {
    // Start transaction
    transaction = await sequelize.transaction();

    // Find or create customer
    let customerRecord;
    if (customer) {
      [customerRecord] = await Customer.findOrCreate({
        where: { userId },
        defaults: {
          firstName: customer.firstName || '',
          lastName: customer.lastName || '',
          email: customer.email || '',
          phoneNumber: customer.phoneNumber || '',
          address: customer.address || '',
          dob: customer.dob || Date.now(),
          userId: userId
        },
        transaction
      });
    } else {
      customerRecord = await Customer.findOne({
        where: { userId },
        transaction
      });

      if (!customerRecord) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Customer profile not found' });
      }
    }

    // Create the order
    const newOrder = await Order.create({
      customerId: customerRecord.customerId,
      userId,
      orderStatus: 'pending',
      orderTotal: total
    }, { transaction });

    // Process each item
    const orderItemData = [];
    const stockUpdates = [];

    for (const item of items) {
      // Find the variant
      const variant = await Variant.findOne({
        where: { variantId: item.id },
        include: [{ model: Product, as: 'product' }],
        transaction
      });

      if (!variant) {
        // If variant not found, try to find the product
        const product = await Product.findOne({
          where: { productId: item.id },
          transaction
        });

        if (!product) {
          await transaction.rollback();
          return res.status(400).json({ 
            message: `Product or variant with ID ${item.id} not found`,
            itemId: item.id
          });
        }

        // If product found but no variant, create a default variant
        const defaultVariant = await Variant.create({
          productId: product.productId,
          name: 'Default',
          additionalPrice: 0,
          stock: product.stock
        }, { transaction });

        if (defaultVariant.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Insufficient stock. Available: ${defaultVariant.stock}`,
            itemId: item.id
          });
        }

        stockUpdates.push({
          variantId: defaultVariant.variantId,
          stock: defaultVariant.stock - item.quantity
        });

        orderItemData.push({
          orderId: newOrder.orderId,
          variantId: defaultVariant.variantId,
          quantity: item.quantity,
          priceAtTime: item.price
        });
      } else {
        // Handle existing variant
        if (variant.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Insufficient stock for variant ${variant.name}. Available: ${variant.stock}`,
            itemId: item.id
          });
        }

        stockUpdates.push({
          variantId: variant.variantId,
          stock: variant.stock - item.quantity
        });

        orderItemData.push({
          orderId: newOrder.orderId,
          variantId: variant.variantId,
          quantity: item.quantity,
          priceAtTime: item.price
        });
      }
    }

    // Update stock
    await Promise.all(
      stockUpdates.map(update =>
        Variant.update(
          { stock: update.stock },
          { 
            where: { variantId: update.variantId },
            transaction
          }
        )
      )
    );

    // Create order items
    await OrderItem.bulkCreate(orderItemData, { transaction });

    // Commit the transaction
    await transaction.commit();

    // Fetch the complete order with items
    const fullOrder = await Order.findOne({
      where: { orderId: newOrder.orderId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Variant, include: [{ model: Product, as: 'product' }] }]
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
        }
      ]
    });

    return res.status(201).json(fullOrder);
  } catch (error) {
    // Only rollback if transaction exists and hasn't been committed
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    
    console.error('Error creating order:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['orderDate', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
        },
        {
          model: OrderItem,
          include: [
            {
              model: Variant,
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: ['productId', 'name', 'imageUrl']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const address = await Address.findOne({
      where: { customerId: order.customerId }
    });

    const formattedOrder = {
      ...order.toJSON(),
      address: address ? address.toJSON() : null
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate order status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    await order.update({ orderStatus });
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.findAll({
      where: { orderStatus: status },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['orderDate', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

const getOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const orders = await Order.findAll({
      where: {
        orderDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['orderDate', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by date range:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

module.exports = {
  createOrderWithItems,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByStatus,
  getOrdersByDateRange
};
