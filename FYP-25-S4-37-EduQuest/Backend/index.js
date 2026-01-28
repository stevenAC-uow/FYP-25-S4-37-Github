require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const educatorRoutes = require("./routes/educatorRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();


app.use(express.json());
app.use(cors());

app.use("/api/educators", educatorRoutes);
app.use("/api/feedbacks", feedbackRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((err) => console.error(err));