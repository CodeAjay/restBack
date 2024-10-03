const express = require("express");
const router = express.Router();
const generalController = require("../controllers/generalController");
const {auth} = require("../middleware/auth");

router.get("/details", generalController.getDetails);
router.put("/details", auth, generalController.updateDetails);

module.exports = router;
