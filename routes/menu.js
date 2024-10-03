const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { auth, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/multer"); // Make sure this is where you configured multer

// Get all menu items - No file upload, so no middleware needed here
router.get("/", menuController.getMenu);

// Add a menu item with image upload - using Multer middleware to handle file upload
router.post("/", auth, isAdmin, upload.single('image'), menuController.addMenuItem);

// Update a menu item (No file upload here, so Multer is not needed)
router.put("/:id", auth, isAdmin, menuController.updateMenuItem);

// Delete a menu item (No file upload here, so Multer is not needed)
router.delete("/:id", auth, isAdmin, menuController.deleteMenuItem);

module.exports = router;
