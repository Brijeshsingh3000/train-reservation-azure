const seats = require("../models/seats");
const seatsDisplay = async (req, res) => {
    try {
        const seatsData = await seats.find({}, { seats: 1, _id: 0 }).exec();//get all seats data
        const seatmap = [];
        seatsData.map(item => {
            seatmap.push(item.seats);
        });
        res.status(200).json({ message: "Seats Available", seatmap });
    } catch (error) {
        console.log(error);
    }
}
module.exports = seatsDisplay;