const mongoose = require('mongoose');

// EvaluationForm Schema
const EvaluationFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  lastModified: {
    type: String,
    default: new Date().toLocaleDateString() 
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

EvaluationFormSchema.pre('save', function(next) {
  this.lastModified = new Date().toLocaleDateString();
  this.updatedAt = Date.now();
  next();
});

EvaluationFormSchema.pre('findOneAndUpdate', function(next) {
  this._update.lastModified = new Date().toLocaleDateString();
  this._update.updatedAt = Date.now();
  next();
});

const EvaluationForm = mongoose.model('EvaluationForm', EvaluationFormSchema);

// FormStructure Schema
const formStructureSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    fields: Array,
    lastModified: { type: Date, default: Date.now }
});

const FormStructure = mongoose.model('FormStructure', formStructureSchema);

// SaveSharedEvaluatorForm Schema
const SaveSharedEvaluatorFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  fields: [
    {
      label: { 
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
      },
      required: {
        type: Boolean,
        default: false,
      },
      value: {
        type: String,
      },
      rating: {
        type: Number, // Ensure this is a number
        required: false,
      },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const SaveSharedEvaluatorForm = mongoose.model('SaveSharedEvaluatorForm', SaveSharedEvaluatorFormSchema);

module.exports = {
  EvaluationForm,
  FormStructure,
  SaveSharedEvaluatorForm
};






 






// before  3 in 1 , all work but not post after shear 

// const mongoose = require('mongoose');

// const EvaluationFormSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   lastModified: {
//     type: String,
//     default: new Date().toLocaleDateString() 
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// EvaluationFormSchema.pre('save', function(next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// EvaluationFormSchema.pre('findOneAndUpdate', function(next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('EvaluationForm', EvaluationFormSchema);
