const seats = require("../models/seats");
const seatReservation = async (req, res) => {
    const { reqseats } = req.body;
    if (reqseats > 7 || reqseats < 1) {//if users enter 
        return res.status(400).json({ message: "At max 7 seats reservation allowed at a time" });//cant select more than 7
    }
    else {
        const seatsData = await seats.find({}, { seats: 1, _id: 0 }).exec();//get all seats data
        const seatmap = [];
        seatsData.map(item => {
            seatmap.push(item.seats);
        });
        //seat booking function
        const bookMyseats = async (rem_seats, maxseats, row) => {
            let cnt = 0;
            for (let i = 0; i < rem_seats.length; i++) {
                if (rem_seats[i] === 0) {
                    rem_seats[i] = 1;
                    cnt++;
                }
                if (cnt == maxseats) {
                    break;
                }
            }
            await seats.updateOne({ row: row + 1 }, { $set: { seats: rem_seats } });
            return res.status(200).json({ message: "Seats booked ✅", seats: seatmap })

        }
        //check fully booked
        const checkfullyBooked = (seatmap) => {
            if (seatmap.findIndex(arr => arr.filter(num => num === 0).length) === -1) {
                res.status(409).json({ message: "Sorry! All seats are booked" });
                return true;
            }
            return false;
        }
        //check if requested number of seats are available
        const lowRemainingSeats = (seatmap) => {
            const check_full = seatmap.flatMap(arr => arr).filter(seat => seat === 0).length;
            if (check_full < reqseats) {
                res.status(409).json({ message: `Only ${check_full} seats remaining.` });
                return true;
            }
            return false;
        }
        //book near by seats
        const bookAcrossRows = async (seatmap, totalSeats) => {
            let bookedSeats = 0;
            let bulkUpdatesList = [];//for storing all updates
            for (let row = 0; row < seatmap.length && bookedSeats < totalSeats; row++) {
                let checkupdate = false;
                for (let col = 0; col < seatmap[row].length && bookedSeats < totalSeats; col++) {
                    if (seatmap[row][col] === 0) {
                        seatmap[row][col] = 1;
                        bookedSeats++;
                        checkupdate = true;
                    }
                }
                if (checkupdate) {//if row is updated mark it 
                    bulkUpdatesList.push({ row: row + 1, seats: seatmap[row] });
                }

            }
            const bulkupdate = bulkUpdatesList.map(updates => {/*Update all seats at once using bulkWrite to prevent multiple database querying*/
                return {
                    updateOne: {
                        filter: { row: updates.row },
                        update: { $set: { seats: updates.seats } }
                    }
                };
            });
            if (bulkUpdatesList.length > 0) {
                await seats.bulkWrite(bulkupdate);
            }
            return true;
        };

        //check if all seats are booked
        if (checkfullyBooked(seatmap)) return;
        //check if requested seats are more than seats remaining
        if (lowRemainingSeats(seatmap)) return;
        const row = seatmap.findIndex(arr => arr.filter(num => num === 0).length >= reqseats);
        const rem_seats = seatmap[row];
        if (row === -1) {
            if (bookAcrossRows(seatmap, reqseats)) res.status(200).json({ message: "Closest seats are booked.", seats: seatmap });
            return;
        }
        if (rem_seats != undefined && rem_seats.length > 0) {
            bookMyseats(rem_seats, reqseats, row);
            return;
        }
        else {
            return res.status(404).json({ message: "Cannot find seats" });
        }

    }

}
module.exports = seatReservation;