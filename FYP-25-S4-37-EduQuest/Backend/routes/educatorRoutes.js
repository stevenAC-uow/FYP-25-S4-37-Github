const express = require("express");
const router = express.Router();
const Educator = require("../models/Educator");

router.get("/", (req, res) => {
  Educator.find().then((educators) => {
    res.json(educators);
  });
});

module.exports = router;




