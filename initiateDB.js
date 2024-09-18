
//THIS SCRIPT IS FOR INITIALIZING Seats COLLECTION in MY DATABASE AND IT IS GOING TO FILL DOCUMENTS WITH DEFAULT VALUE 0

//⚠️ NO NEED TO RUN THIS AGAIN ⚠️
const seats = require("./models/seats");
require("dotenv").config();
require("./connection/connetion");
const initiateDB = async () => {
    try {
        const check = await seats.find();//IF SOMEONE AGAIN RUNS THIS SCRIPT IGNORE===>TO PREVENT DUPLICATION
        if (check.length > 0) {
            console.log("DATABASE ALREADY INITIATED!!!");
            process.exit();

        }
        for (let i = 0; i < 11; i++) {
            //filling first 77 seats i.e. 11 rows each with 7 seats
            const row = new seats({
                row: i + 1,
                seats: Array(7).fill(0)
            })
            await row.save();
        }

        const last = new seats({
            row: 12,//the last row with only three seats
            seats: Array(3).fill(0)
        })
        await last.save();
        console.log("done'✅");
    } catch (error) {
        console.log(error);
    }
    process.exit();

}
initiateDB();
