const mongoose = require("mongoose");
mongoose.connect(process.env.DB).then(() => console.log("Mongo connected")).catch((err) => console.log(err));
