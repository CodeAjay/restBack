const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { auth, isAdmin } = require("../middleware/auth");

router.post("/", auth, orderController.placeOrder); // Only authenticated users can place orders
router.get("/", auth, orderController.getOrders); // Admin can view all orders
router.put("/:id", auth, isAdmin, orderController.updateOrderStatus); // Admin can update order status

module.exports = router;
