const User = require('../models/user.js');

// Create and save a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, phoneNumber, dob, roleId } = req.body;

        const existingUser = await User.count({ where: { email } });
        if (existingUser > 0) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        const user = await User.create({
            userId:1,
            username,
            email,
            password,  
            phoneNumber,
            dob,
            roleId
        });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } }); // Exclude password for security
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user details
exports.updateUser = async (req, res) => {
    try {
        const { username, phoneNumber, email } = req.body;
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the email is changing and if the new email already exists
        if (email && email !== user.email) {
            const existingUser = await User.count({ where: { email } });
            if (existingUser > 0) {
                return res.status(400).json({ error: "Email is already in use" });
            }
        }

        user.username = username || user.username;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({ where: { userId: req.params.id } });
        
        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};