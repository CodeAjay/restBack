const Restaurant = require("../models/restaurant");

exports.getDetails = async (req, res) => {
  try {
    const details = await Restaurant.findOne();
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: "Error fetching details", error });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const update = req.body;
    await Restaurant.updateOne({}, update, { upsert: true });
    res.json({ message: "Details updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating details", error });
  }
};
