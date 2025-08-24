const Customer = require("../models/customer.js");

// Create a new Customer
exports.createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, address, dob, stateId, countryId, regionId, userId, email, phoneNumber } = req.body;

        const existingCustomer = await Customer.count({ where: { email } });
        if (existingCustomer > 0) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        const customer = await Customer.create({
            firstName,
            lastName,
            address,
            dob,
            stateId,
            countryId,
            regionId,
            userId,
            email,
            phoneNumber
        });

        res.status(201).json({ message: "Customer created successfully", customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Customer details
exports.updateCustomer = async (req, res) => {
    try {
        const { firstName, lastName, address, dob, email, phoneNumber } = req.body;
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Check if the email is changing and if the new email already exists
        if (email && email !== customer.email) {
            const existingCustomer = await Customer.count({ where: { email } });
            if (existingCustomer) {
                return res.status(400).json({ error: "Email is already in use" });
            }
        }

        customer.firstName = firstName || customer.firstName;
        customer.lastName = lastName || customer.lastName;
        customer.address = address || customer.address;
        customer.dob = dob || customer.dob;
        customer.email = email || customer.email;
        customer.phoneNumber = phoneNumber || customer.phoneNumber;

        await customer.save();
        res.status(200).json({ message: "Customer updated successfully", customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Customer by id
exports.deleteCustomer = async (req, res) => {
    try {
        const deleted = await Customer.destroy({ where: { customerId: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};