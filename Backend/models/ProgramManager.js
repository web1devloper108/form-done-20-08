// const mongoose = require('mongoose');

// const ProgramManagerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   phone: {
//     type: String,
//     required: true
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   }
// });

// module.exports = mongoose.model('programmanager', ProgramManagerSchema);




// const mongoose = require("mongoose");

// const ProgramManagerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   admin: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Organization",
//     required: true,
//   },
//   adminName: {
//     type: String,
//     required: true,
//   },
//   adminPhone: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = mongoose.model("ProgramManager", ProgramManagerSchema);





// const mongoose = require("mongoose");

// const ProgramManagerSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   admin: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Organization",
//     required: true,
//   },
//   adminName: {
//     type: String,
//     required: true,
//   },
//   adminPhone: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = mongoose.model("ProgramManager", ProgramManagerSchema);




const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProgramManagerSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: "admins",
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
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

module.exports = ProgramManager = mongoose.model(
  "programmanagers",
  ProgramManagerSchema
);
