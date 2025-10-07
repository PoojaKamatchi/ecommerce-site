const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// Get all users
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Add a user
router.post("/", async (req, res) => {
  const { registerno, id, phone } = req.body;
  const newStudent = new Student({ registerno, id, phone });
  await newStudent.save();
  res.json({ message: "Students added sucessfully" });
  
});

module.exports = router;