const express = require("express");
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const {auth} = require("../middleware/auth");

router.post("/", auth, reservationController.createReservation);
router.get("/", auth, reservationController.getReservations);
router.delete("/:id", auth, reservationController.cancelReservation);

module.exports = router;
