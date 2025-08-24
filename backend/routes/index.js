const express = require('express');
const router = express.Router();


const authRoutes = require('./auth');
const userRoutes = require('./userRoutes');

const orderRoutes = require('./orderRoutes');
const customerRoutes = require('./customerRoutes');

const productRoutes = require('./productRoutes');
const addressRoutes = require('./addressRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const uploadRoutes = require('./uploadRoutes');
const oauthRoutes = require('./authRoutes');



router.use('/auth', authRoutes);
router.use('/oauth', oauthRoutes);


router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/upload', uploadRoutes);
router.use('/addresses', addressRoutes);


module.exports = router;
