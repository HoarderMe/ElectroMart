const express = require('express');
const router = express.Router();

const addressController = require('../controllers/addressController');
const { auth } = require('../middleware/auth');



// Route to get all addresses for a user
router.get('/', auth, addressController.getAll);

// Route to get a single address by ID
router.get('/:id',auth, addressController.getOne);

// Route to create a new address
router.post('/',auth,  addressController.create);

// Route to update an address by ID
router.put('/:id',auth,  addressController.update);

// Route to delete an address by ID

router.delete('/:id',auth,  addressController.remove);


module.exports = router;



// controllers/addressController.js

