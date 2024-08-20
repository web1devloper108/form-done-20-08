const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Form Schema
const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  label: { type: String, required: true },
  status: { type: String, required: true },
  // HIGHLIGHT START: Change lastModified to Date type
  lastModified: {
    type: Date, // Use Date type for sorting
    default: Date.now
  },
  // HIGHLIGHT END
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update timestamps
formSchema.pre('save', function (next) {
  // HIGHLIGHT START: Ensure lastModified is a Date
  this.lastModified = Date.now();
  this.updatedAt = Date.now();
  // HIGHLIGHT END
  next();
});

formSchema.pre('findOneAndUpdate', function (next) {
  // HIGHLIGHT START: Ensure lastModified is a Date
  this._update.lastModified = Date.now();
  this._update.updatedAt = Date.now();
  // HIGHLIGHT END
  next();
});

const Form = mongoose.model('Form', formSchema);

// General Form Structure Schema
const generalFormStructureSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title: String,
  fields: Array,
  lastModified: { type: Date, default: Date.now }
});

const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// Shareable Link Schema
const shareableLinkSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  link: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// Form Submission Schema
const formSubmissionSchema = new mongoose.Schema({
  formTitle: {
    type: String,
    required: true,
  },
  formData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  files: [
    {
      originalName: { type: String, required: true },
      path: { type: String, required: true },
      mimeType: { type: String, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { minimize: false });

formSubmissionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = {
  Form,
  GeneralFormStructure,
  ShareableLink,
  FormSubmission
};






//all working a to z on aug 7
// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };

























/////////before 3/8
// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };









///////not already submit 



// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };






////////////before email must 29/7

/////////name came in frintend

// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   userName: {
//     type: String,
//     required: true,
//   },
  
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// }); 

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };












































































// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };









//////////already submit ok 2 name 2 email 

// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   userName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true, 
//   },
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.index({ email: 1, formTitle: 1 }, { unique: true }); // Unique index to prevent duplicate submissions

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };













/////////already submitted work email came backend but not name came 




// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema


// const formSubmissionSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.index({ email: 1, formTitle: 1 }, { unique: true }); // Unique index to prevent duplicate submissions

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);


// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };



















////////////before email must 29/7



// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   userName: {
//     type: String,
//     required: true,
//   },
  
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// }); 

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };

















































//24-07
// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// }); 

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };


























/////// till multiple select  ok all crud ok  24/07







// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// }); 

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };





















// ragular 15/7  ///first inte abhi




// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// }); 

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };





































//live 11
// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4,
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// // Form Submission Schema
// const formSubmissionSchema = new mongoose.Schema({
//   formTitle: {
//     type: String,
//     required: true,
//   },
//   formData: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   files: [
//     {
//       originalName: { type: String, required: true },
//       path: { type: String, required: true },
//       mimeType: { type: String, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { minimize: false });

// formSubmissionSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// }); 

// const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission
// };










//////////ok bef general shear and save 



// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4, // Generate a unique ID using uuid
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// // Shareable Link Schema
// const shareableLinkSchema = new mongoose.Schema({
//   formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
//   link: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure,
//   ShareableLink
// };


















// /////////////b shear general

// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
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

// formSchema.pre('save', function (next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// formSchema.pre('findOneAndUpdate', function (next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// const Form = mongoose.model('Form', formSchema);

// // General Form Structure Schema
// const generalFormStructureSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     default: uuidv4, // Generate a unique ID using uuid
//     unique: true
//   },
//   title: String,
//   fields: Array,
//   lastModified: { type: Date, default: Date.now }
// });

// const GeneralFormStructure = mongoose.model('GeneralFormStructure', generalFormStructureSchema);

// module.exports = {
//   Form,
//   GeneralFormStructure
// };















///regular all working 
// const mongoose = require('mongoose');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Form', formSchema);




// regular wworking 10-7
// const mongoose = require('mongoose');

// const FormSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   label: {
//     type: String,
//     required: true
//   },
//   status: {
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

// FormSchema.pre('save', function(next) {
//   this.lastModified = new Date().toLocaleDateString();
//   this.updatedAt = Date.now();
//   next();
// });

// FormSchema.pre('findOneAndUpdate', function(next) {
//   this._update.lastModified = new Date().toLocaleDateString();
//   this._update.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('Form', FormSchema); 
 







// // models/Form.js
// const mongoose = require('mongoose');

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   label: { type: String, required: true },
//   status: { type: String, required: true },
//   lastModified: { type: String, required: true },
//   createdAt: { type: String, required: true },
// });

// module.exports = mongoose.model('Form', formSchema);


