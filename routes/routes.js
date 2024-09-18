const express = require("express");
const seatReservation = require("../controllers/seatreservation");
const seatsDisplay = require("../controllers/seatdisplay");
const router = express.Router();
router.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
})
router.get("/remainingseats", seatsDisplay);
router.post("/seatreservation", seatReservation);


module.exports = router