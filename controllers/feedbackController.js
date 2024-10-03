const Feedback = require("../models/feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    const newFeedback = new Feedback({
      userId: req.user.id,
      feedback,
      rating,
    });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting feedback", error });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId", "username");
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};
