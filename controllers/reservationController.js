const Reservation = require("../models/reservation");

exports.createReservation = async (req, res) => {
  try {
    const { date, time, guests } = req.body;
    const reservation = new Reservation({
      userId: req.user.id,
      date,
      time,
      guests,
    });
    await reservation.save();
    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    await Reservation.findByIdAndDelete(id);
    res.json({ message: "Reservation canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling reservation", error });
  }
};
