const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  registerno: String,
  id: String,
  phone: String // safer as String
});

module.exports = mongoose.model("Student", studentSchema);
