require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

//Routes
const authRouter = require("./routes/auth");

//Auth Routes
app.use(authRouter);

//DB config
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.amei0km.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port);
  })
  .catch((e) => {
    console.log(e);
  });
