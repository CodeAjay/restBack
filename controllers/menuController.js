const MenuItem = require("../models/menu");
const cloudinary = require("../cloudnary"); // Ensure this is the correct path to cloudinary.js


exports.getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu", error });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageFile = req.file;  // Multer places the file in `req.file`

    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload the file to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },  // Automatically detect resource type (image, video, etc.)
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Pipe the file buffer to Cloudinary
      stream.end(imageFile.buffer);
    });

    const imageUrl = cloudinaryResult.secure_url;  // Get the image URL from Cloudinary

    // Create a new menu item with the uploaded image URL
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      imageUrl,  // Use the image URL from Cloudinary
    });

    await menuItem.save();
    res.status(201).json({ message: "Menu item added successfully", menuItem });
  } catch (error) {
    console.error(error);  // Log error to help debug
    res.status(500).json({ message: "Error adding menu item", error });
  }
};



exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    await MenuItem.findByIdAndUpdate(id, update);
    res.json({ message: "Menu item updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item", error });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item", error });
  }
};
