const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  Form,
  GeneralFormStructure,
  ShareableLink,
  FormSubmission,
} = require("../models/Form");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const ExcelJS = require("exceljs"); // Added for Excel generation
const nodemailer = require("nodemailer");
// Ensure the uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// ===================== START: Custom Multer Storage =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Parse form responses to check for existing submissions
    const formData = JSON.parse(req.body.responses);
    const email = formData["Email"];
    // Check for existing submission
    FormSubmission.findOne({
      formTitle: req.body.formId,
      "formData.Email": email,
    })
      .then((existingSubmission) => {
        if (existingSubmission) {
          // If there's an existing submission, cancel the upload
          cb(new Error("Form is already submitted for this email."), uploadDir);
        } else {
          // Otherwise, proceed to save the file
          cb(null, uploadDir);
        }
      })
      .catch((error) => {
        // Handle any database errors here
        console.error("Error checking existing submission:", error);
        cb(new Error("Database error while checking submission"), uploadDir);
      });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer with custom storage engine
const upload = multer({ storage });

// ===================== END: Custom Multer Storage =====================

// Middleware to handle JSON data
router.use(express.json());

// Create a new form
router.post("/", async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).send(form);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find();
    res.send(forms);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a form
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { ...req.body, lastModified: new Date().toLocaleDateString() },
      { new: true }
    );
    if (!updatedForm) {
      return res.status(404).send({ message: "Form not found" });
    }
    res.send(updatedForm);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a form
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedForm = await Form.findByIdAndDelete(id);
    if (!deletedForm) {
      return res.status(404).send({ message: "Form not found" });
    }
    res.send({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// General Form Structure Routes

// Save general form structure
router.post("/general", async (req, res) => {
  const { title, fields } = req.body;
  try {
    const newFormStructure = new GeneralFormStructure({
      id: uuidv4(),
      title,
      fields,
    });
    await newFormStructure.save();
    res.status(201).send(newFormStructure);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Retrieve general form structure by id
router.get("/general/:id", async (req, res) => {
  try {
    const formStructure = await GeneralFormStructure.findById(req.params.id);
    if (formStructure) {
      res.status(200).json(formStructure);
    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve all general form structures
router.get("/general", async (req, res) => {
  try {
    const formStructures = await GeneralFormStructure.find();
    res.status(200).send(formStructures);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update general form structure
router.put("/general/:id", async (req, res) => {
  try {
    const { title, fields } = req.body;
    const formStructure = await GeneralFormStructure.findByIdAndUpdate(
      req.params.id,
      { title, fields, lastModified: Date.now() },
      { new: true, upsert: true }
    );
    res.status(200).json(formStructure);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Generate Shareable Link
router.post("/generate-link/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const link = `${req.protocol}://${req.get(
      "host"
    )}/shared-form-preview/${uuidv4()}`;
    const newLink = new ShareableLink({ formId, link });
    await newLink.save();
    res.status(201).send(newLink);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Retrieve Form via Shareable Link
router.get("/shared-form/:link", async (req, res) => {
  try {
    const { link } = req.params;
    const shareableLink = await ShareableLink.findOne({ link });
    if (!shareableLink) {
      return res.status(404).send({ message: "Link not found" });
    }
    const formStructure = await GeneralFormStructure.findById(
      shareableLink.formId
    );
    if (!formStructure) {
      return res.status(404).send({ message: "Form not found" });
    }
    res.status(200).send(formStructure);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Form Submission Route
router.post("/public-form-submission", upload.any(), async (req, res) => {
  try {
    console.log("Files:", req.files);
    console.log("Body:", req.body);

    const { formId, responses } = req.body;
    const formData = JSON.parse(responses);
    const email = formData["Email"];

    // Fetch the form title using formId
    const form = await Form.findById(formId);
    const formTitle = form ? form.title : "Untitled Form"; // HIGHLIGHT: Get the form title

    // Check for existing submission
    const existingSubmission = await FormSubmission.findOne({
      formTitle: formId,
      "formData.Email": email,
    });

    if (existingSubmission) {
      return res
        .status(400)
        .send({ error: "Form is already submitted for this email." });
    }

    // Handle files
    const files = req.files
      ? req.files.map((file) => ({
          originalName: file.originalname,
          path: file.path,
          mimeType: file.mimetype,
        }))
      : [];

    const formSubmission = new FormSubmission({
      formTitle: formId, // Still storing the formId for reference
      formData,
      files,
    });

    await formSubmission.save();

    // HIGHLIGHT START: Send email to program manager after form submission
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const formEntries = Object.entries(formData)
      .map(
        ([key, value]) => `
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: #555;">
            <strong>${key}:</strong> ${value}
          </td>
        </tr>
      `
      )
      .join("");

    // HIGHLIGHT START: Updated email template with real icons and no underline

    // const emailTemplate = (title, buttonText, formTitle, includeSocialIcons = false) => `
    //   <div style="background-color: #f9f9f9; padding: 20px;">
    //     <table style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #fff; border-radius: 8px; overflow: hidden;">
    //       <thead style="background-color: #4285f4; color: #fff;">
    //         <tr>
    //           <th style="padding: 20px; font-size: 20px; text-align: left;">${title}</th>
    //         </tr>
    //       </thead>
    //       <tbody style="padding: 20px;">
    //         <tr>
    //           <td style="padding: 8px 0; font-size: 14px; color: #555;">
    //             <strong>Form Title:</strong> ${formTitle} <!-- Adding form title in the email -->
    //           </td>
    //         </tr>
    //         ${formEntries}
    //         <tr>
    //           <td style="padding: 20px 0; text-align: center;">
    //             <a href="${req.protocol}://${req.get("host")}/form-submissions/${formSubmission._id}/view-summary" style="padding: 10px 20px; background-color: #4285f4; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">${buttonText}</a>
    //           </td>
    //         </tr>
    //       </tbody>
    //     </table>

    //     ${includeSocialIcons ? `
    //     <!-- Adding social media icons without text -->
    //     <div style="text-align: center; margin-top: 20px;">
    //       <p style="color: #555; font-size: 14px;">Follow us for more insights</p>
    //       <div>
    //         <a href="https://www.facebook.com/DrishtiCPS/" style="margin: 0 10px; text-decoration: none;">
    //           <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 18px; vertical-align: middle;">
    //         </a>
    //         <a href="https://www.linkedin.com" style="margin: 0 10px; text-decoration: none;">
    //           <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" style="width: 18px; vertical-align: middle;">
    //         </a>
    //         <a href="https://x.com/i/flow/login?redirect_after_login=%2FDRISHTICPS" style="margin: 0 10px; text-decoration: none;">
    //           <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 18px; vertical-align: middle;">
    //         </a>
    //       </div>
    //     </div>` : ''}
    //   </div>
    // `;

    // // Email to Program Manager - WITHOUT social media icons
    // const mailOptionsPM = {
    //   from: process.env.EMAIL,
    //   to: process.env.PROGRAM_MANAGER_EMAIL,
    //   subject: `New Form Submission: ${formTitle}`, // HIGHLIGHT: Using form title in the subject
    //   html: emailTemplate(
    //     "You have a new form submission",
    //     "VIEW SUMMARY",
    //     formTitle,
    //     false // Don't include social icons in program manager email
    //   ),
    // };

    // await transporter.sendMail(mailOptionsPM);
    // console.log("Email sent to program manager");

    // // HIGHLIGHT START: Send email to user after form submission with footer section and social icons
    // const mailOptionsUser = {
    //   from: process.env.EMAIL,
    //   to: email,
    //   subject: `Thank you for your submission: ${formTitle}`, // HIGHLIGHT: Use form title in subject
    //   html: emailTemplate(
    //     "Thank you for your submission!",
    //     "VIEW SUMMARY",
    //     formTitle,
    //     true // Include social icons in user email
    //   ),
    // };

    // await transporter.sendMail(mailOptionsUser);
    // console.log("Email sent to the user");
    // HIGHLIGHT START: Updated email template without "VIEW SUMMARY" button

    const emailTemplate = (title, formTitle, includeSocialIcons = false) => `
  <div style="background-color: #f9f9f9; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #fff; border-radius: 8px; overflow: hidden;">
      <thead style="background-color: #4285f4; color: #fff;">
        <tr>
          <th style="padding: 20px; font-size: 20px; text-align: left;">${title}</th>
        </tr>
      </thead>
      <tbody style="padding: 20px;">
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: #555;">
            <strong>Form Title:</strong> ${formTitle} <!-- Adding form title in the email -->
          </td>
        </tr>
        ${formEntries}
      </tbody>
    </table>
    
    ${
      includeSocialIcons
        ? `
    <!-- Adding social media icons without text -->
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #555; font-size: 14px;">Follow us for more insights</p>  
      <div>
        <a href="https://www.facebook.com/DrishtiCPS/" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 18px; vertical-align: middle;">
        </a>
        <a href="https://www.linkedin.com" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" style="width: 18px; vertical-align: middle;">
        </a>
        <a href="https://x.com/i/flow/login?redirect_after_login=%2FDRISHTICPS" style="margin: 0 10px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 18px; vertical-align: middle;">
        </a>
      </div>
    </div>`
        : ""
    }
  </div>
`;
    // HIGHLIGHT END

    // Email to Program Manager - WITHOUT social media icons
    const mailOptionsPM = {
      from: process.env.EMAIL,
      to: process.env.PROGRAM_MANAGER_EMAIL,
      subject: `New Form Submission: ${formTitle}`, // HIGHLIGHT: Using form title in the subject
      html: emailTemplate(
        "You have a new form submission",
        formTitle,
        false // Don't include social icons in program manager email
      ),
    };

    await transporter.sendMail(mailOptionsPM);
    console.log("Email sent to program manager");

    // Email to User - WITH social media icons
    const mailOptionsUser = {
      from: process.env.EMAIL,
      to: email,
      subject: `Thank you for your submission: ${formTitle}`, // HIGHLIGHT: Use form title in subject
      html: emailTemplate(
        "Thank you for your submission!",
        formTitle,
        true // Include social icons in user email
      ),
    };

    await transporter.sendMail(mailOptionsUser);
    console.log("Email sent to the user");

    res.status(201).send(formSubmission);
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(400).send(error);
  }
});



router.get("/form-submissions/:id/view-summary", async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await FormSubmission.findById(id);

    if (!submission) {
      return res.status(404).send({ message: "Submission not found" });
    }

    // Render a page displaying form submission details
    const formData = submission.formData;
    const formTitle = submission.formTitle;
    const email = formData["Email"];

    // Construct the HTML response to show submission details
    let submissionDetails = `
      <h2>Form Title: ${formTitle}</h2>
      <p>Email: ${email}</p>
      <ul>
    `;

    Object.entries(formData).forEach(([key, value]) => {
      submissionDetails += `<li><strong>${key}</strong>: ${value}</li>`;
    });

    submissionDetails += `</ul>`;

    // Send HTML response showing submission details
    res.send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #4285f4; }
            ul { list-style: none; padding: 0; }
            li { padding: 10px 0; font-size: 16px; }
            li strong { color: #555; }
          </style>
        </head>
        <body>
          ${submissionDetails}
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).send(error);
  }
});
// HIGHLIGHT END

// Get all form submissions
router.get("/form-submissions", async (req, res) => {
  try {
    const submissions = await FormSubmission.find();
    res.send(submissions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all form submissions for a specific form title
router.get("/form-submissions/:formTitle", async (req, res) => {
  try {
    const { formTitle } = req.params;
    const submissions = await FormSubmission.find({ formTitle });

    if (!submissions.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for this form." });
    }

    res.send(submissions);
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    res.status(500).send(error);
  }
});

// Delete all form submissions for a specific form title
router.delete("/form-submissions/:formTitle", async (req, res) => {
  try {
    const { formTitle } = req.params;
    const result = await FormSubmission.deleteMany({ formTitle });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No submissions found for this form." });
    }
    res.send({ message: "All form submissions deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a specific form submission by ID
router.delete("/form-submission/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FormSubmission.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Form submission not found" });
    }
    res.send({ message: "Form submission deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Excel download route
router.get("/form-submissions/:formId/download-excel", async (req, res) => {
  try {
    const { formId } = req.params;
    const submissions = await FormSubmission.find({ formTitle: formId });

    if (!submissions.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for this form." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Form Submissions");

    // Define the columns in the Excel sheet
    const columns = [
      { header: "Timestamp", key: "createdAt", width: 25 },
      { header: "Email", key: "email", width: 25 },
    ];

    // Dynamically add form data keys as columns
    let formDataKeys = new Set();
    submissions.forEach((submission) => {
      Object.keys(submission.formData).forEach((key) => {
        formDataKeys.add(key);
      });
    });

    formDataKeys.forEach((key) => {
      columns.push({ header: key, key });
    });

    worksheet.columns = columns;

    // Add rows to the Excel sheet
    submissions.forEach((submission) => {
      const rowData = {
        createdAt: new Date(submission.createdAt).toLocaleString(),
      };

      // Add form data to row in a readable format
      Object.keys(submission.formData).forEach((key) => { 
        rowData[key] = submission.formData[key];
      });

      // Add file data to row
      submission.files.forEach((file, index) => {
        rowData[`File ${index + 1}`] = file.originalName;
      });

      worksheet.addRow(rowData);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=form_submissions.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send(error);
  }
});

module.exports = router;










// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const {
//   Form,
//   GeneralFormStructure,
//   ShareableLink,
//   FormSubmission,
// } = require("../models/Form");
// const router = express.Router();
// const { v4: uuidv4 } = require("uuid");
// const ExcelJS = require("exceljs"); // Added for Excel generation 
// const nodemailer = require("nodemailer");
// // Ensure the uploads directory exists
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
// // ===================== START: Custom Multer Storage =====================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Parse form responses to check for existing submissions
//     const formData = JSON.parse(req.body.responses);
//     const email = formData["Email"];
//     // Check for existing submission
//     FormSubmission.findOne({
//       formTitle: req.body.formId,
//       "formData.Email": email,
//     })
//       .then((existingSubmission) => {
//         if (existingSubmission) {
//           // If there's an existing submission, cancel the upload
//           cb(new Error("Form is already submitted for this email."), uploadDir);
//         } else {
//           // Otherwise, proceed to save the file
//           cb(null, uploadDir);
//         }
//       })
//       .catch((error) => {
//         // Handle any database errors here
//         console.error("Error checking existing submission:", error);
//         cb(new Error("Database error while checking submission"), uploadDir);
//       });
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // Initialize Multer with custom storage engine
// const upload = multer({ storage });

// // ===================== END: Custom Multer Storage =====================

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post("/", async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get("/", async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(
//       id,
//       { ...req.body, lastModified: new Date().toLocaleDateString() },
//       { new: true }
//     );
//     if (!updatedForm) {
//       return res.status(404).send({ message: "Form not found" });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: "Form not found" });
//     }
//     res.send({ message: "Form deleted successfully" });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post("/general", async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({
//       id: uuidv4(),
//       title,
//       fields,
//     });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get("/general/:id", async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: "Form not found" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get("/general", async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put("/general/:id", async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post("/generate-link/:formId", async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get(
//       "host"
//     )}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get("/shared-form/:link", async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: "Link not found" });
//     }
//     const formStructure = await GeneralFormStructure.findById(
//       shareableLink.formId
//     );
//     if (!formStructure) {
//       return res.status(404).send({ message: "Form not found" });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Route
// router.post("/public-form-submission", upload.any(), async (req, res) => {
//   try {
//     console.log("Files:", req.files);
//     console.log("Body:", req.body);

//     const { formId, responses } = req.body;
//     const formData = JSON.parse(responses);
//     const email = formData["Email"];

//     // Fetch the form title using formId
//     const form = await Form.findById(formId);
//     const formTitle = form ? form.title : "Untitled Form"; // HIGHLIGHT: Get the form title

//     // Check for existing submission
//     const existingSubmission = await FormSubmission.findOne({
//       formTitle: formId,
//       "formData.Email": email,
//     });

//     if (existingSubmission) {
//       return res
//         .status(400)
//         .send({ error: "Form is already submitted for this email." });
//     }

//     // Handle files
//     const files = req.files
//       ? req.files.map((file) => ({
//           originalName: file.originalname,
//           path: file.path,
//           mimeType: file.mimetype,
//         }))
//       : [];

//     const formSubmission = new FormSubmission({
//       formTitle: formId, // Still storing the formId for reference
//       formData,
//       files,
//     });

//     await formSubmission.save();

//     // HIGHLIGHT START: Send email to program manager after form submission
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const formEntries = Object.entries(formData)
//       .map(
//         ([key, value]) => `
//         <tr>
//           <td style="padding: 8px 0; font-size: 14px; color: #555;">
//             <strong>${key}:</strong> ${value}
//           </td>
//         </tr>
//       `
//       )
//       .join("");

//     // HIGHLIGHT START: Updated email template with real icons and no underline

//     const emailTemplate = (title, formTitle, includeSocialIcons = false) => `
//   <div style="background-color: #f9f9f9; padding: 20px;">
//     <table style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #fff; border-radius: 8px; overflow: hidden;">
//       <thead style="background-color: #4285f4; color: #fff;">
//         <tr>
//           <th style="padding: 20px; font-size: 20px; text-align: left;">${title}</th>
//         </tr>
//       </thead>
//       <tbody style="padding: 20px;">
//         <tr>
//           <td style="padding: 8px 0; font-size: 14px; color: #555;">
//             <strong>Form Title:</strong> ${formTitle} <!-- Adding form title in the email -->
//           </td>
//         </tr>
//         ${formEntries}
//       </tbody>
//     </table>
    
//     ${
//       includeSocialIcons
//         ? `
//     <!-- Adding social media icons without text -->
//     <div style="text-align: center; margin-top: 20px;">
//       <p style="color: #555; font-size: 14px;">Follow us for more insights</p>  
//       <div>
//         <a href="https://www.facebook.com/DrishtiCPS/" style="margin: 0 10px; text-decoration: none;">
//           <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 18px; vertical-align: middle;">
//         </a>
//         <a href="https://www.linkedin.com" style="margin: 0 10px; text-decoration: none;">
//           <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" style="width: 18px; vertical-align: middle;">
//         </a>
//         <a href="https://x.com/i/flow/login?redirect_after_login=%2FDRISHTICPS" style="margin: 0 10px; text-decoration: none;">
//           <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 18px; vertical-align: middle;">
//         </a>
//       </div>
//     </div>`
//         : ""
//     }
//   </div>
// `;
//     // HIGHLIGHT END

//     // Email to Program Manager - WITHOUT social media icons
//     const mailOptionsPM = {
//       from: process.env.EMAIL,
//       to: process.env.PROGRAM_MANAGER_EMAIL,
//       subject: `New Form Submission: ${formTitle}`, // HIGHLIGHT: Using form title in the subject
//       html: emailTemplate(
//         "You have a new form submission",
//         formTitle,
//         false // Don't include social icons in program manager email
//       ),
//     };

//     await transporter.sendMail(mailOptionsPM);
//     console.log("Email sent to program manager");

//     // Email to User - WITH social media icons
//     const mailOptionsUser = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: `Thank you for your submission: ${formTitle}`, // HIGHLIGHT: Use form title in subject
//       html: emailTemplate(
//         "Thank you for your submission!",
//         formTitle,
//         true // Include social icons in user email
//       ),
//     };

//     await transporter.sendMail(mailOptionsUser);
//     console.log("Email sent to the user");

//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     res.status(400).send(error);
//   }
// });



// router.get("/form-submissions/:id/view-summary", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const submission = await FormSubmission.findById(id);

//     if (!submission) {
//       return res.status(404).send({ message: "Submission not found" });
//     }

//     // Render a page displaying form submission details
//     const formData = submission.formData;
//     const formTitle = submission.formTitle;
//     const email = formData["Email"];

//     // Construct the HTML response to show submission details
//     let submissionDetails = `
//       <h2>Form Title: ${formTitle}</h2>
//       <p>Email: ${email}</p>
//       <ul>
//     `;

//     Object.entries(formData).forEach(([key, value]) => {
//       submissionDetails += `<li><strong>${key}</strong>: ${value}</li>`;
//     });

//     submissionDetails += `</ul>`;

//     // Send HTML response showing submission details
//     res.send(`
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             h2 { color: #4285f4; }
//             ul { list-style: none; padding: 0; }
//             li { padding: 10px 0; font-size: 16px; }
//             li strong { color: #555; }
//           </style>
//         </head>
//         <body>
//           ${submissionDetails}
//         </body>
//       </html>
//     `);
//   } catch (error) {
//     console.error("Error fetching submission:", error);
//     res.status(500).send(error);
//   }
// });
// // HIGHLIGHT END

// // Get all form submissions
// router.get("/form-submissions", async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get("/form-submissions/:formTitle", async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res
//         .status(404)
//         .json({ message: "No submissions found for this form." });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error("Error fetching form submissions:", error);
//     res.status(500).send(error);
//   }
// });
// // HIGHLIGHT START: Ensure createdAt is included in form submissions
// router.get("/form-submissions/:formId", async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });
//     if (!submissions.length) {
//       return res.status(404).json({ message: "No submissions found for this form." });
//     }
//     res.send(submissions);
//   } catch (error) {
//     console.error("Error fetching form submissions:", error);
//     res.status(500).send(error);
//   }
// });
// // HIGHLIGHT END: Ensure createdAt is included in form submissions

// // Delete all form submissions for a specific form title
// router.delete("/form-submissions/:formTitle", async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const result = await FormSubmission.deleteMany({ formTitle });
//     if (result.deletedCount === 0) {
//       return res
//         .status(404)
//         .json({ message: "No submissions found for this form." });
//     }
//     res.send({ message: "All form submissions deleted successfully" });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Delete a specific form submission by ID
// router.delete("/form-submission/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await FormSubmission.findByIdAndDelete(id);
//     if (!result) {
//       return res.status(404).json({ message: "Form submission not found" });
//     }
//     res.send({ message: "Form submission deleted successfully" });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Excel download route
// router.get("/form-submissions/:formId/download-excel", async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res
//         .status(404)
//         .json({ message: "No submissions found for this form." });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Form Submissions");

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: "Timestamp", key: "createdAt", width: 25 },
//       { header: "Email", key: "email", width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach((submission) => {
//       Object.keys(submission.formData).forEach((key) => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=form_submissions.xlsx"
//     );

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error("Error generating Excel file:", error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;














/////Tested before response on gmail
/////Tested ok for reSubmit
///////b 5/ 8/ 24    back work and frontend both work on resubmit same  email se not entry different email se entry yet
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation
// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
// // ===================== START: Custom Multer Storage =====================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Parse form responses to check for existing submissions
//     const formData = JSON.parse(req.body.responses);
//     const email = formData['Email'];
//     // Check for existing submission
//     FormSubmission.findOne({
//       formTitle: req.body.formId,
//       'formData.Email': email,
//     }).then(existingSubmission => {
//       if (existingSubmission) {
//         // If there's an existing submission, cancel the upload
//         cb(new Error('Form is already submitted for this email.'), uploadDir);
//       } else {
//         // Otherwise, proceed to save the file
//         cb(null, uploadDir);
//       }
//     }).catch(error => {
//       // Handle any database errors here
//       console.error('Error checking existing submission:', error);
//       cb(new Error('Database error while checking submission'), uploadDir);
//     });
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // Initialize Multer with custom storage engine
// const upload = multer({ storage });

// // ===================== END: Custom Multer Storage =====================

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Route
// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     console.log('Files:', req.files);
//     console.log('Body:', req.body);

//     const { formId, responses } = req.body;
//     const formData = JSON.parse(responses);
//     const email = formData['Email'];

//     // Check for existing submission
//     const existingSubmission = await FormSubmission.findOne({
//       formTitle: formId,
//       'formData.Email': email,
//     });

//     if (existingSubmission) {
//       // No need to delete files as they aren't saved
//       return res.status(400).send({ error: 'Form is already submitted for this email.' });
//     }

//     // Handle files
//     const files = req.files ? req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     })) : [];

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData,
//       files,
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// // Delete all form submissions for a specific form title
// router.delete('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const result = await FormSubmission.deleteMany({ formTitle });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }
//     res.send({ message: 'All form submissions deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Delete a specific form submission by ID
// router.delete('/form-submission/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await FormSubmission.findByIdAndDelete(id);
//     if (!result) {
//       return res.status(404).json({ message: 'Form submission not found' });
//     }
//     res.send({ message: 'Form submission deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

//////////all work re submit (alternate )
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation
// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // ===================== START: Custom Multer Storage =====================

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Parse form responses to check for existing submissions
//     const formData = JSON.parse(req.body.responses);
//     const email = formData['Email'];

//     // Check for existing submission
//     FormSubmission.findOne({
//       formTitle: req.body.formId,
//       'formData.Email': email,
//     }).then(existingSubmission => {
//       if (existingSubmission) {
//         // If there's an existing submission, cancel the upload
//         cb(new Error('Form is already submitted for this email.'), uploadDir);
//       } else {
//         // Otherwise, proceed to save the file
//         cb(null, uploadDir);
//       }
//     }).catch(error => {
//       // Handle any database errors here
//       console.error('Error checking existing submission:', error);
//       cb(new Error('Database error while checking submission'), uploadDir);
//     });
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // Initialize Multer with custom storage engine
// const upload = multer({ storage });

// // ===================== END: Custom Multer Storage =====================

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // In routes/form.js
// // Form Submission Route
// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     console.log('Files:', req.files);
//     console.log('Body:', req.body);

//     const { formId, responses } = req.body;
//     const formData = JSON.parse(responses);
//     const email = formData['Email'];

//     // Check for existing submission with the same formId and email
//     const existingSubmission = await FormSubmission.findOne({
//       formTitle: formId,
//       'formData.Email': email, // Ensure we're checking both formId and email
//     });

//     if (existingSubmission) {
//       // No need to delete files as they aren't saved
//       return res.status(400).send({ error: 'Form is already submitted for this email.' });
//     }

//     // Handle files
//     const files = req.files ? req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     })) : [];

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData,
//       files,
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// // Delete all form submissions for a specific form title
// router.delete('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const result = await FormSubmission.deleteMany({ formTitle });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }
//     res.send({ message: 'All form submissions deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Delete a specific form submission by ID
// router.delete('/form-submission/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await FormSubmission.findByIdAndDelete(id);
//     if (!result) {
//       return res.status(404).json({ message: 'Form submission not found' });
//     }
//     res.send({ message: 'Form submission deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

///////b 3/8
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// // Backend Route: form.js
// // Existing code ...

// // Form Submission Routes

// // // Form Submission Routes
// // router.post('/public-form-submission', upload.any(), async (req, res) => {
// //   try {
// //     const { formId, responses } = req.body;
// //     const formData = JSON.parse(responses);
// //     const email = formData['Email']; // Assuming 'Email' is the correct label

// //     // HIGHLIGHT START: Check for unique email submissions per form
// //     const existingSubmission = await FormSubmission.findOne({
// //       formTitle: formId, // Ensure uniqueness per form
// //       'formData.Email': email // Check for the email in the specific form
// //     });

// //     if (existingSubmission) {
// //       return res.status(400).send({ error: 'Form is already submitted for this email.' });
// //     }
// //     // HIGHLIGHT END

// //     const files = req.files.map(file => ({
// //       originalName: file.originalname,
// //       path: file.path,
// //       mimeType: file.mimetype,
// //     }));

// //     const formSubmission = new FormSubmission({
// //       formTitle: formId,
// //       formData,
// //       files
// //     });

// //     await formSubmission.save();
// //     res.status(201).send(formSubmission);
// //   } catch (error) {
// //     console.error('Error submitting form:', error);
// //     res.status(400).send(error);
// //   }
// // });
// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     console.log('Files:', req.files);
//     console.log('Body:', req.body);
//         // Parse the JSON string safely
//     const { formId, responses } = req.body;
//     const formData = JSON.parse(responses);
//     const email = formData['Email'];
//         // Check for existing submission
//     const existingSubmission = await FormSubmission.findOne({
//       formTitle: formId,
//       'formData.Email': email,
//     });

//     if (existingSubmission) {
//       return res.status(400).send({ error: 'Form is already submitted for this email.' });
//     }
//     // Handle files
//     const files = req.files ? req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     })) : [];

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData,
//       files,
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// // Delete all form submissions for a specific form title
// router.delete('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const result = await FormSubmission.deleteMany({ formTitle });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }
//     res.send({ message: 'All form submissions deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Delete a specific form submission by ID
// router.delete('/form-submission/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await FormSubmission.findByIdAndDelete(id);
//     if (!result) {
//       return res.status(404).json({ message: 'Form submission not found' });
//     }
//     res.send({ message: 'Form submission deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

// /////////////ragular 2/8/24

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// // Backend Route: form.js
// // Existing code ...

// // Form Submission Routes
// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, responses } = req.body;
//     const formData = JSON.parse(responses);
//     const email = formData.email; // Assuming 'email' is a field in the form

//     // Check if the email has already submitted the form
//     const existingSubmission = await FormSubmission.findOne({
//       formTitle: formId,
//       'formData.email': email
//     });

//     if (existingSubmission) {
//       return res.status(400).send({ error: 'Form is already submitted for this email.' });
//     }

//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData,
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// // Delete all form submissions for a specific form title
// router.delete('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const result = await FormSubmission.deleteMany({ formTitle });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }
//     res.send({ message: 'All form submissions deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Delete a specific form submission by ID
// router.delete('/form-submission/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await FormSubmission.findByIdAndDelete(id);
//     if (!result) {
//       return res.status(404).json({ message: 'Form submission not found' });
//     }
//     res.send({ message: 'Form submission deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

//

///////not already submit

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, responses } = req.body;
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

// ////////////before email must 29/7

/////////name came in frintend

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, userName, responses } = req.body; // Include userName in the request body
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     const formSubmission = new FormSubmission({
//       userName, // Save the user's name
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// //////// Excel download route

// // //// b27/7
// // // Excel download route
// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Name', key: 'userName', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, responses } = req.body; // Removed userName and email from request body
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     // Extract email from formData
//     const formData = JSON.parse(responses);
//     const email = formData['Email'];

//     // Check if a submission already exists for the email and form
//     const existingSubmission = await FormSubmission.findOne({ 'formData.Email': email, formTitle: formId });
//     if (existingSubmission) {
//       return res.status(400).send({ message: 'You have already submitted this form.' });
//     }

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData,
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Name', key: 'userName', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

//////////already submit ok 2 name 2 email

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, userName, email, responses } = req.body; // Include email in the request body
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     // Check if a submission already exists for the email and form
//     const existingSubmission = await FormSubmission.findOne({ email, formTitle: formId });
//     if (existingSubmission) {
//       return res.status(400).send({ message: 'You have already submitted this form.' });
//     }

//     const formSubmission = new FormSubmission({
//       userName, // Save the user's name
//       email, // Save the user's email
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// // //////// Excel download route

// ///////////29/7  all formdata is come in normal form in "csv "  file   but email and name backend wala se validation ho raha hai
// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Name', key: 'userName', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//         userName: submission.userName,
//         email: submission.email,
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

/////////already submitted work email came backend but not name came

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, email, responses } = req.body;
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     // Check if a submission already exists for the email and form
//     const existingSubmission = await FormSubmission.findOne({ email, formTitle: formId });
//     if (existingSubmission) {
//       return res.status(400).send({ message: 'You have already submitted this form.' });
//     }

//     const formSubmission = new FormSubmission({
//       email,
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// //////// Excel download route

// // //// b27/7
// // // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Name', key: 'userName', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//         userName: submission.userName,
//       };

//       // Add form data to row
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

////////////before email must 29/7

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const ExcelJS = require('exceljs'); // Added for Excel generation

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, userName, responses } = req.body; // Include userName in the request body
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     const formSubmission = new FormSubmission({
//       userName, // Save the user's name
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// //////// Excel download route

// // //// b27/7
// // // Excel download route
// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns in the Excel sheet
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Name', key: 'userName', width: 25 },
//       { header: 'Email', key: 'email', width: 25 },
//     ];

//     // Dynamically add form data keys as columns
//     let formDataKeys = new Set();
//     submissions.forEach(submission => {
//       Object.keys(submission.formData).forEach(key => {
//         formDataKeys.add(key);
//       });
//     });

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//       };

//       // Add form data to row in a readable format
//       Object.keys(submission.formData).forEach((key) => {
//         rowData[key] = submission.formData[key];
//       });

//       // Add file data to row
//       submission.files.forEach((file, index) => {
//         rowData[`File ${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

//////////////// time user name email  come

// // Excel download route
// router.get('/form-submissions/:formId/download-excel', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const submissions = await FormSubmission.find({ formTitle: formId });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Form Submissions');

//     // Define the columns, including Email and Single Select Label
//     const columns = [
//       { header: 'Timestamp', key: 'createdAt', width: 25 },
//       { header: 'Name', key: 'userName', width: 25 },
//       { header: 'Email', key: 'Email', width: 25 },
//       { header: 'Single Select Label', key: 'SingleSelectLabel', width: 25 }
//     ];

//     // Add formData fields dynamically
//     const exampleSubmission = submissions[0];
//     const formDataKeys = Object.keys(exampleSubmission.formData);

//     formDataKeys.forEach((key) => {
//       columns.push({ header: key, key });
//     });

//     // Add columns for files
//     const fileColumns = exampleSubmission.files.map((file, index) => ({ header: `File ${index + 1}`, key: `file${index + 1}` }));
//     columns.push(...fileColumns);

//     worksheet.columns = columns;

//     // Add rows to the Excel sheet
//     submissions.forEach((submission) => {
//       const rowData = {
//         createdAt: new Date(submission.createdAt).toLocaleString(),
//         userName: submission.userName,
//         Email: submission.formData.get('Email') || '',  // Ensure email is extracted correctly
//         SingleSelectLabel: submission.formData.get('Single Select Label') || ''  // Ensure singleSelectLabel is extracted correctly
//       };

//       // Add formData fields to the row
//       formDataKeys.forEach((key) => {
//         rowData[key] = submission.formData.get(key);
//       });

//       // Add file data to the row
//       submission.files.forEach((file, index) => {
//         rowData[`file${index + 1}`] = file.originalName;
//       });

//       worksheet.addRow(rowData);
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=form_submissions.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     res.status(500).send(error);
//   }
// });

////bef excel

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, userName, responses } = req.body; // Include userName in the request body
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     const formSubmission = new FormSubmission({
//       userName, // Save the user's name
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

//24-07
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// // Submit a form
// // router.post('/public-form-submission', upload.any(), async (req, res) => {
// //   try {
// //     const { formId, responses } = req.body;
// //     const files = req.files.map(file => ({
// //       originalName: file.originalname,
// //       path: file.path,
// //       mimeType: file.mimetype,
// //     }));

// //     const formSubmission = new FormSubmission({
// //       formTitle: formId,
// //       formData: JSON.parse(responses),
// //       files
// //     });

// //     await formSubmission.save();
// //     res.status(201).send(formSubmission);
// //   } catch (error) {
// //     console.error('Error submitting form:', error);
// //     res.status(400).send(error);
// //   }
// // });

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     console.log('Received form submission');
//     console.log('Request body:', req.body);
//     console.log('Request files:', req.files);

//     const { formId, responses } = req.body;
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     console.log('Processed files:', files);

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // // Submit a form
// // router.post('/public-form-submission', upload.any(), async (req, res) => {
// //   console.log('Received form submission'); // Debugging statement

// //   try {
// //     const { formId, responses } = req.body;
// //     const files = req.files.map(file => ({
// //       originalName: file.originalname,
// //       path: file.path,
// //       mimeType: file.mimetype,
// //     }));

// //     console.log('Files:', files); // Debugging statement
// //     console.log('Responses:', responses); // Debugging statement

// //     const formSubmission = new FormSubmission({
// //       formTitle: formId,
// //       formData: JSON.parse(responses),
// //       files
// //     });

// //     await formSubmission.save();
// //     res.status(201).send(formSubmission);
// //   } catch (error) {
// //     console.error('Error submitting form:', error);
// //     res.status(400).send(error);
// //   }
// // });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

/////// till multiple select  ok all crud ok  24/07

// // ragular 23 07

// ////////ok before nested dnd prob on uplode

// //regular 16
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// // Submit a form
// // router.post('/public-form-submission', upload.any(), async (req, res) => {
// //   try {
// //     const { formId, responses } = req.body;
// //     const files = req.files.map(file => ({
// //       originalName: file.originalname,
// //       path: file.path,
// //       mimeType: file.mimetype,
// //     }));

// //     const formSubmission = new FormSubmission({
// //       formTitle: formId,
// //       formData: JSON.parse(responses),
// //       files
// //     });

// //     await formSubmission.save();
// //     res.status(201).send(formSubmission);
// //   } catch (error) {
// //     console.error('Error submitting form:', error);
// //     res.status(400).send(error);
// //   }
// // });

// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     console.log('Received form submission');
//     console.log('Request body:', req.body);
//     console.log('Request files:', req.files);

//     const { formId, responses } = req.body;
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     console.log('Processed files:', files);

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // // Submit a form
// // router.post('/public-form-submission', upload.any(), async (req, res) => {
// //   console.log('Received form submission'); // Debugging statement

// //   try {
// //     const { formId, responses } = req.body;
// //     const files = req.files.map(file => ({
// //       originalName: file.originalname,
// //       path: file.path,
// //       mimeType: file.mimetype,
// //     }));

// //     console.log('Files:', files); // Debugging statement
// //     console.log('Responses:', responses); // Debugging statement

// //     const formSubmission = new FormSubmission({
// //       formTitle: formId,
// //       formData: JSON.parse(responses),
// //       files
// //     });

// //     await formSubmission.save();
// //     res.status(201).send(formSubmission);
// //   } catch (error) {
// //     console.error('Error submitting form:', error);
// //     res.status(400).send(error);
// //   }
// // });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all form submissions for a specific form title
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submissions = await FormSubmission.find({ formTitle });

//     if (!submissions.length) {
//       return res.status(404).json({ message: 'No submissions found for this form.' });
//     }

//     res.send(submissions);
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

// ragular 15/7  ///first inte abhi

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// // Submit a form
// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, responses } = req.body;
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get a specific form submission by ID
// // router.get('/form-submissions/:id', async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const submission = await FormSubmission.findById(id);

// //     if (!submission) {
// //       return res.status(404).json({ message: 'Form submission not found.' });
// //     }

// //     res.send(submission);
// //   } catch (error) {
// //     console.error('Error fetching form submission:', error);
// //     res.status(500).send(error);
// //   }
// // });

// // Get a specific form submission by formTitle
// // // good work but title name not show
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submission = await FormSubmission.findOne({ formTitle });

//     if (!submission) {
//       return res.status(404).json({ message: 'Form submission not found.' });
//     }

//     res.send(submission);
//   } catch (error) {
//     console.error('Error fetching form submission:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

//live 11
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Form Submission Routes

// // Submit a form
// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     const { formId, responses } = req.body;
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData: responses,
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });

// // Get all form submissions
// router.get('/form-submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find();
//     res.send(submissions);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get a specific form submission by formTitle
// router.get('/form-submissions/:formTitle', async (req, res) => {
//   try {
//     const { formTitle } = req.params;
//     const submission = await FormSubmission.findOne({ formTitle });

//     if (!submission) {
//       return res.status(404).json({ message: 'Form submission not found.' });
//     }

//     res.send(submission);
//   } catch (error) {
//     console.error('Error fetching form submission:', error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

//////////ok bef general shear and save

// const express = require('express');
// const { Form, GeneralFormStructure, ShareableLink } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

///b shear general fr

// const express = require('express');
// const { Form, GeneralFormStructure } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' }); // Ensure error is in JSON format
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message }); // Ensure error is in JSON format
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// module.exports = router;

///////////////b 8api
// const express = require('express');
// const { Form, GeneralFormStructure } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).send(formStructure);
//     } else {
//       res.status(404).send('Form not found');
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// module.exports = router;

// regular 10-7n
// const express = require('express');
// const Form = require('../models/Form');
// const router = express.Router();

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

// // routes/forms.js
// const express = require('express');
// const Form = require('../models/Form');
// const router = express.Router();

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// module.exports = router;

// //regular code with alll working
// const express = require('express');
// const Form = require('../models/Form');
// const router = express.Router();

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     console.log('Request body:', req.body); // Log the request body
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     console.error('Error creating form:', error); // Log the error
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       const deletedForm = await Form.findByIdAndDelete(id);
//       if (!deletedForm) {
//         return res.status(404).send({ message: 'Form not found' });
//       }
//       res.send({ message: 'Form deleted successfully' });
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });

// module.exports = router;

//////////////thank you but not working

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const { Form, GeneralFormStructure, ShareableLink, FormSubmission } = require('../models/Form');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// // Ensure the uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware to handle JSON data
// router.use(express.json());

// // Create a new form
// router.post('/', async (req, res) => {
//   try {
//     const form = new Form(req.body);
//     await form.save();
//     res.status(201).send(form);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Get all forms
// router.get('/', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.send(forms);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a form
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedForm = await Form.findByIdAndUpdate(id, { ...req.body, lastModified: new Date().toLocaleDateString() }, { new: true });
//     if (!updatedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send(updatedForm);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a form
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedForm = await Form.findByIdAndDelete(id);
//     if (!deletedForm) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.send({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // General Form Structure Routes

// // Save general form structure
// router.post('/general', async (req, res) => {
//   const { title, fields } = req.body;
//   try {
//     const newFormStructure = new GeneralFormStructure({ id: uuidv4(), title, fields });
//     await newFormStructure.save();
//     res.status(201).send(newFormStructure);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Retrieve general form structure by id
// router.get('/general/:id', async (req, res) => {
//   try {
//     const formStructure = await GeneralFormStructure.findById(req.params.id);
//     if (formStructure) {
//       res.status(200).json(formStructure);
//     } else {
//       res.status(404).json({ error: 'Form not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Retrieve all general form structures
// router.get('/general', async (req, res) => {
//   try {
//     const formStructures = await GeneralFormStructure.find();
//     res.status(200).send(formStructures);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Update general form structure
// router.put('/general/:id', async (req, res) => {
//   try {
//     const { title, fields } = req.body;
//     const formStructure = await GeneralFormStructure.findByIdAndUpdate(
//       req.params.id,
//       { title, fields, lastModified: Date.now() },
//       { new: true, upsert: true }
//     );
//     res.status(200).json(formStructure);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Generate Shareable Link
// router.post('/generate-link/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/shared-form-preview/${uuidv4()}`;
//     const newLink = new ShareableLink({ formId, link });
//     await newLink.save();
//     res.status(201).send(newLink);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Retrieve Form via Shareable Link
// router.get('/shared-form/:link', async (req, res) => {
//   try {
//     const { link } = req.params;
//     const shareableLink = await ShareableLink.findOne({ link });
//     if (!shareableLink) {
//       return res.status(404).send({ message: 'Link not found' });
//     }
//     const formStructure = await GeneralFormStructure.findById(shareableLink.formId);
//     if (!formStructure) {
//       return res.status(404).send({ message: 'Form not found' });
//     }
//     res.status(200).send(formStructure);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // **New Code Start: Check if user already submitted the form**
// router.get('/check-submission/:formId', async (req, res) => {
//   try {
//     const { formId } = req.params;
//     const userId = req.user.id; // Assuming user ID is available in the session

//     // Check if the user has already submitted the form
//     const submission = await FormSubmission.findOne({ formTitle: formId, userId });
//     if (submission) {
//       return res.json({ submitted: true });
//     }
//     return res.json({ submitted: false });
//   } catch (error) {
//     console.error('Error checking form submission:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// // **New Code End: Check if user already submitted the form**

// // **Existing Code Updated**
// router.post('/public-form-submission', upload.any(), async (req, res) => {
//   try {
//     console.log('Received form submission');
//     console.log('Request body:', req.body);
//     console.log('Request files:', req.files);

//     const { formId, responses } = req.body;
//     const userId = req.user.id; // Assuming user ID is available in the session
//     const files = req.files.map(file => ({
//       originalName: file.originalname,
//       path: file.path,
//       mimeType: file.mimetype,
//     }));

//     console.log('Processed files:', files);

//     // Check if the user has already submitted the form
//     const existingSubmission = await FormSubmission.findOne({ formTitle: formId, userId });
//     if (existingSubmission) {
//       return res.status(400).json({ message: 'You have already submitted this form.' });
//     }

//     const formSubmission = new FormSubmission({
//       formTitle: formId,
//       formData: JSON.parse(responses),
//       userId,
//       files
//     });

//     await formSubmission.save();
//     res.status(201).send(formSubmission);
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(400).send(error);
//   }
// });
// // **Existing Code Updated**

// module.exports = router;
