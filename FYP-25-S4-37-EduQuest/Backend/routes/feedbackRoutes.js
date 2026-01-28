const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.post("/", (req, res) => {
 
  if (!req.body.studentId || !req.body.educatorId || !req.body.message) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  
  const feedback = new Feedback({
    studentId: req.body.studentId,
    educatorId: req.body.educatorId,
    message: req.body.message,
    anonymous: req.body.anonymous,
  });

  feedback.save().then((result) => {
    res.status(201).json(result);
  });
});

module.exports = router;
