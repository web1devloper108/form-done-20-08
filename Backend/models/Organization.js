// const mongoose = require('mongoose');

// const OrganizationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   adminName: { type: String, required: true },
//   adminPhone: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// module.exports = mongoose.model('organization', OrganizationSchema);





const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  adminPhone: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("organization", OrganizationSchema);
