require("dotenv/config");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const router = require("./routes/router");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/users", router);
app.use("/", router);

const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(process.env.DB_URI, dbOptions)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
