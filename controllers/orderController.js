const Order = require("../models/order");
const MenuItem = require("../models/menu");
const mongoose = require("mongoose");

// Function to generate a random 6-8 digit order ID
const generateOrderId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random number
};

// Function to check the uniqueness of the order ID
const generateUniqueOrderId = async () => {
  let orderId;
  let isUnique = false;
  
  while (!isUnique) {
    orderId = generateOrderId(); // Generate a new order ID
    const existingOrder = await mongoose.model('Order').findOne({ orderId });
    if (!existingOrder) {
      isUnique = true; // If no order with this ID exists, we can use it
    }
  }
  
  return orderId;
};

exports.placeOrder = async (req, res) => {
  try {
    const { items, name, address, email } = req.body;
    let totalAmount = 0;

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Calculate totalAmount from items
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem); // Use item.menuItem instead of item._id
      if (!menuItem) {
        return res.status(400).json({ message: "Invalid menu item" });
      }
      totalAmount += menuItem.price * item.quantity;
    }

    // Generate a unique orderId
    const orderId = await generateUniqueOrderId();

    // Create a new order
    const order = new Order({
      userId: req.user.id,
      orderId, // Set the generated unique orderId
      items,
      totalAmount,
      name,
      address,
      email,
    });

    // Save the order
    await order.save();

    // Return a success response
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error('Error placing order:', error); // Log error
    res.status(500).json({ message: "Error placing order", error });
  }
};




exports.getOrders = async (req, res) => {
  try {
    // Check if the user is an admin
    const isAdmin = req.user && req.user.role === 'admin'; // Assuming 'role' is a field on the user object

    let orders;
    if (isAdmin) {
      // If the user is an admin, fetch all orders
      orders = await Order.find().populate("items.menuItem");
    } else {
      // If the user is not an admin, fetch only the orders for that user
      orders = await Order.find({ userId: req.user.id }).populate("items.menuItem");
    }

    res.status(200).json(orders); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};




exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.findByIdAndUpdate(id, { status });
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

