const express = require("express");
const cors = require("cors");
const PORT = 8080 || process.env.PORT;
require("dotenv").config();
const router = require("./routes/routes");
const app = express();
require("./connection/connetion")
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use("/api", router);
app.listen(PORT, console.log(`server started at ${PORT}`));
