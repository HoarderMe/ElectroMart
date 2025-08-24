const Address = require("../models/Address");

// GET /addresses
exports.getAll = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { customerId: req.user.userId }
    });
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /addresses/:id
exports.getOne = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address || address.customerId !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /addresses
exports.create = async (req, res) => {
  try {
    const {
      street,
      city,
      state,
      country,
      region,
      postalCode,
      type
    } = req.body;

    const newAddress = await Address.create({
      street,
      city,
      state,
      country,
      region,
      postalCode,
      type,
      customerId: req.user.userId
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /addresses/:id
exports.update = async (req, res) => {
  try {
    const {
      street,
      city,
      state,
      country,
      region,
      postalCode,
      type
    } = req.body;

    const address = await Address.findByPk(req.params.id);
    if (!address || address.customerId !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Only overwrite provided fields
    address.street     = street     ?? address.street;
    address.city       = city       ?? address.city;
    address.state      = state      ?? address.state;
    address.country    = country    ?? address.country;
    address.region     = region     ?? address.region;
    address.postalCode = postalCode ?? address.postalCode;
    address.type       = type       ?? address.type;

    await address.save();
    res.json(address);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /addresses/:id
exports.remove = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address || address.customerId !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }
    await address.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Server error" });
  }
};
