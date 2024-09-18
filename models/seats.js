const mongoose = require("mongoose");
const seatSchema = new mongoose.Schema({
    row: {
        type: Number,
        require: true
    },
    seats: {
        type: [Number],
        require: true
    }
})
module.exports = mongoose.model("Seats", seatSchema);