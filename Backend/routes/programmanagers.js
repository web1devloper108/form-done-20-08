// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const ProgramManager = require("../models/ProgramManager");
// const auth = require("../middleware/auth");

// // @route   POST api/programmanagers
// // @desc    Create a new program manager
// router.post("/", auth, async (req, res) => {
//   const { name, email, phone, username, password } = req.body;

//   try {
//     let pm = await ProgramManager.findOne({ email });
//     if (pm) {
//       return res.status(400).json({ msg: "Program Manager already exists" });
//     }

//     pm = new ProgramManager({
//       name,
//       email,
//       phone,
//       username,
//       password,
//     });

//     const salt = await bcrypt.genSalt(10);
//     pm.password = await bcrypt.hash(password, salt);

//     await pm.save();
//     res.json({
//       message: "Program Manager created successfully",
//       programManager: pm,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/programmanagers
// // @desc    Get all program managers for the logged-in admin
// router.get("/", auth, async (req, res) => {
//   try {
//     // Ensure the admin ID is pulled from the decoded token after authentication
//     const adminId = req.user.id; // This assumes your token decoding sets user id
//     const programManagers = await ProgramManager.find({ createdByAdmin: adminId });
//     res.json(programManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });



// // @route   GET api/programmanagers/:id
// // @desc    Get a program manager by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.json(programManager);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;







// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const ProgramManager = require("../models/ProgramManager");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");

// // @route   POST api/programmanagers
// // @desc    Add a new program manager
// router.post("/", auth, async (req, res) => {
//   const { name, email, adminName, adminPhone, username, password } = req.body;

//   if (!name || !email || !adminName || !adminPhone || !username || !password) {
//     return res.status(400).json({ msg: "Please provide all required fields." });
//   }

//   try {
//     let user = await ProgramManager.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "Program Manager already exists" });
//     }

//     const organization = await Organization.findById(req.user.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Admin organization not found" });
//     }

//     user = new ProgramManager({
//       name,
//       email,
//       admin: req.user.id,
//       adminName,
//       adminPhone,
//       username,
//       password,
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     res.json({ msg: "Program Manager added successfully" });
//   } catch (err) {
//     console.error("Server error:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/:id/programmanagers
// // @desc    Get program managers associated with an admin
// // @route   GET api/programmanagers/:id
// // @desc    Get program manager by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.json(programManager);
//   } catch (err) {
//     console.error("Error fetching program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;





//25 live
// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const ProgramManager = require("../models/ProgramManager");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");

// // @route   POST api/programmanagers
// // @desc    Add a new program manager
// router.post("/", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;

//   if (!email || !adminName || !adminPhone || !username || !password) {
//     return res.status(400).json({ msg: "Please provide all required fields." });
//   }

//   try {
//     let user = await ProgramManager.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "Program Manager already exists" });
//     }

//     const organization = await Organization.findById(req.user.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Admin organization not found" });
//     }

//     user = new ProgramManager({
//       email,
//       admin: req.user.id,
//       adminName,
//       adminPhone,
//       username,
//       password,
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     res.json({ msg: "Program Manager added successfully" });
//   } catch (err) {
//     console.error("Server error:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/programmanagers/:id
// // @desc    Get program manager by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.json(programManager);
//   } catch (err) {
//     console.error("Error fetching program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;





// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const ProgramManager = require("../models/ProgramManager");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");
// const nodemailer = require("nodemailer");
// const path = require("path");



// // Set up Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Route to add a new program manager and send welcome email
// router.post("/", auth, async (req, res) => {
//   // const { name, email, adminName, adminPhone, username, password } = req.body;
//   const { email, adminName, adminPhone, username, password } = req.body;
//   // if (!name || !email || !adminName || !adminPhone || !username || !password) {
//     if (!email || !adminName || !adminPhone || !username || !password) {
//     return res.status(400).json({ msg: "Please provide all required fields." });
//   }

//   try {
//     let user = await ProgramManager.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "Program Manager already exists" });
//     }

//     const organization = await Organization.findById(req.user.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Admin organization not found" });
//     }
//     user = new ProgramManager({
//              email,
//              admin: req.user.id,
//              adminName,
//              adminPhone,
//              username,
//              password,
           

//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Send welcome email to the new program manager
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'WELCOME TO IITI DRISHTI CPS FOUNDATION',
//       html: `
//         <div style="max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; font-family: 'Helvetica', 'Arial', sans-serif; color: #333;">
//           <div style="text-align: center; margin-bottom: 20px;">
//             <a href="https://drishticps.iiti.ac.in/">
//               <img src="cid:logo" alt="IITI DRISHTI CPS FOUNDATION Logo" style="width: 100px; height: auto;">
//             </a>
//           </div>
//           <h2 style="color: #005A9C; text-align: center;">WELCOME TO <strong>IITI DRISHTI CPS FOUNDATION</strong></h2>
//           <p>Hello <strong>${adminName}</strong>,</p>
//           <p>You have been added as a Program Manager. To get started, please set up your account password by clicking the button below:</p>
//           <div style="text-align: center; margin: 20px;">
//           <a href="http://localhost:5000/reset-password?token=${user._id}" style="background-color: #005A9C; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Set Up Your Password</a>          </div>
//           <p>If you have any questions, feel free to <a href="mailto:${process.env.EMAIL}" style="color: #005A9C;">contact us</a> at any time.</p>
//           <p style="border-top: 1px solid #ccc; padding-top: 10px; text-align: center;">Best regards,<br>Your <strong>IITI DRISHTI CPS FOUNDATION</strong> Team</p>
//           <footer style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
//             <p>Follow us on:
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #3b5998;">Facebook</a>,
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #1DA1F2;">Twitter</a>,
//               <a href="https://in.linkedin.com/company/iiti-drishti-cps-foundation-iit-indore/" style="text-decoration: none; color: #0077B5;">LinkedIn</a>
//             </p>
//           </footer>
//         </div>
//       `,
//       attachments: [
//         {
//           filename: 'logo.jpg',
//           path: path.join(__dirname, '../assets/logo.jpg'),
//           cid: 'logo'
//         }
//       ]
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error in sending email');
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.json({ msg: 'Program Manager added and email sent successfully' });
//       }
//     });
//   } catch (err) {
//     console.error("Server error:", err.message);
//     res.status(500).send("Server error");
//   }
// });







// // @route   GET api/programmanagers/:id
// // @desc    Get program manager by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.json(programManager);
//   } catch (err) {
//     console.error("Error fetching program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   PUT api/programmanagers/:id
// // @desc    Update program manager by ID
// router.put("/:id", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;

//   // Build program manager object
//   const programManagerFields = {};
//   if (email) programManagerFields.email = email;
//   if (adminName) programManagerFields.adminName = adminName;
//   if (adminPhone) programManagerFields.adminPhone = adminPhone;
//   if (username) programManagerFields.username = username;
//   if (password) {
//     const salt = await bcrypt.genSalt(10);
//     programManagerFields.password = await bcrypt.hash(password, salt);
//   }

//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager = await ProgramManager.findByIdAndUpdate(
//       req.params.id,
//       { $set: programManagerFields },
//       { new: true }
//     );

//     res.json(programManager);
//   } catch (err) {
//     console.error("Error updating program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;


//regular working 7 aug

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const ProgramManager = require("../models/ProgramManager");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");
// const nodemailer = require("nodemailer");
// const path = require("path");

// // Set up Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Route to add a new program manager and send welcome email
// router.post("/", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;
//   if (!email || !adminName || !adminPhone || !username || !password) {
//     return res.status(400).json({ msg: "Please provide all required fields." });
//   }

//   try {
//     let user = await ProgramManager.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "Program Manager already exists" });
//     }

//     const organization = await Organization.findById(req.user.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Admin organization not found" });
//     }
//     user = new ProgramManager({
//       email,
//       admin: req.user.id,
//       adminName,
//       adminPhone,
//       username,
//       password,
//       isActive: true  // Set isActive to true by default
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Send welcome email to the new program manager
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'WELCOME TO IITI DRISHTI CPS FOUNDATION',
//       html: `
//         <div style="max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; font-family: 'Helvetica', 'Arial', sans-serif; color: #333;">
//           <div style="text-align: center; margin-bottom: 20px;">
//             <a href="https://drishticps.iiti.ac.in/">
//               <img src="cid:logo" alt="IITI DRISHTI CPS FOUNDATION Logo" style="width: 100px; height: auto;">
//             </a>
//           </div>
//           <h2 style="color: #005A9C; text-align: center;">WELCOME TO <strong>IITI DRISHTI CPS FOUNDATION</strong></h2>
//           <p>Hello <strong>${adminName}</strong>,</p>
//           <p>You have been added as a Program Manager. To get started, please set up your account password by clicking the button below:</p>
//           <div style="text-align: center; margin: 20px;">
//           <a href="http://localhost:5000/reset-password?token=${user._id}" style="background-color: #005A9C; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Set Up Your Password</a>          </div>
//           <p>If you have any questions, feel free to <a href="mailto:${process.env.EMAIL}" style="color: #005A9C;">contact us</a> at any time.</p>
//           <p style="border-top: 1px solid #ccc; padding-top: 10px; text-align: center;">Best regards,<br>Your <strong>IITI DRISHTI CPS FOUNDATION</strong> Team</p>
//           <footer style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
//             <p>Follow us on:
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #3b5998;">Facebook</a>,
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #1DA1F2;">Twitter</a>,
//               <a href="https://in.linkedin.com/company/iiti-drishti-cps-foundation-iit-indore/" style="text-decoration: none; color: #0077B5;">LinkedIn</a>
//             </p>
//           </footer>
//         </div>
//       `,
//       attachments: [
//         {
//           filename: 'logo.jpg',
//           path: path.join(__dirname, '../assets/logo.jpg'),
//           cid: 'logo'
//         }
//       ]
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error in sending email');
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.json({ msg: 'Program Manager added and email sent successfully' });
//       }
//     });
//   } catch (err) {
//     console.error("Server error:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all program managers across all organizations
// router.get("/all", auth, async (req, res) => {
//   try {
//     const programManagers = await ProgramManager.find();
//     res.json(programManagers);
//   } catch (err) {
//     console.error("Error fetching program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all program managers for the logged-in admin
// router.get("/", auth, async (req, res) => {
//   try {
//     console.log("Fetching Program Managers for Admin:", req.user.id); // Debugging line
//     const programManagers = await ProgramManager.find({ admin: req.user.id });
//     console.log("Fetched Program Managers:", programManagers); // Debugging line
//     res.json(programManagers);
//   } catch (err) {
//     console.error("Error fetching program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get a program manager by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.json(programManager);
//   } catch (err) {
//     console.error("Error fetching program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to update a program manager by ID
// router.put("/:id", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;

//   // Build program manager object
//   const programManagerFields = {};
//   if (email) programManagerFields.email = email;
//   if (adminName) programManagerFields.adminName = adminName;
//   if (adminPhone) programManagerFields.adminPhone = adminPhone;
//   if (username) programManagerFields.username = username;
//   if (password) {
//     const salt = await bcrypt.genSalt(10);
//     programManagerFields.password = await bcrypt.hash(password, salt);
//   }

//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager = await ProgramManager.findByIdAndUpdate(
//       req.params.id,
//       { $set: programManagerFields },
//       { new: true }
//     );

//     res.json(programManager);
//   } catch (err) {
//     console.error("Error updating program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to disable a program manager by ID
// router.put("/:id/disable", auth, async (req, res) => {
//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.isActive = false;
//     await programManager.save();

//     res.json({ msg: "Program Manager disabled successfully" });
//   } catch (err) {
//     console.error("Error disabling program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to enable a program manager by ID
// router.put("/:id/enable", auth, async (req, res) => {
//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.isActive = true;
//     await programManager.save();

//     res.json({ msg: "Program Manager enabled successfully" });
//   } catch (err) {
//     console.error("Error enabling program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;







//all a to z working



// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const ProgramManager = require("../models/ProgramManager");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");
// const nodemailer = require("nodemailer");
// const path = require("path");

// // Set up Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Route to add a new program manager and send welcome email
// router.post("/", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;
//   if (!email || !adminName || !adminPhone || !username || !password) {
//     return res.status(400).json({ msg: "Please provide all required fields." });
//   }

//   try {
//     let user = await ProgramManager.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "Program Manager already exists" });
//     }

//     const organization = await Organization.findById(req.user.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Admin organization not found" });
//     }
//     user = new ProgramManager({
//       email,
//       admin: req.user.id,
//       adminName,
//       adminPhone,
//       username,
//       password,
//       isActive: true  // Set isActive to true by default
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Send welcome email to the new program manager
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'WELCOME TO IITI DRISHTI CPS FOUNDATION',
//       html: `
//         <div style="max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; font-family: 'Helvetica', 'Arial', sans-serif; color: #333;">
//           <div style="text-align: center; margin-bottom: 20px;">
//             <a href="https://drishticps.iiti.ac.in/">
//               <img src="cid:logo" alt="IITI DRISHTI CPS FOUNDATION Logo" style="width: 100px; height: auto;">
//             </a>
//           </div>
//           <h2 style="color: #005A9C; text-align: center;">WELCOME TO <strong>IITI DRISHTI CPS FOUNDATION</strong></h2>
//           <p>Hello <strong>${adminName}</strong>,</p>
//           <p>You have been added as a Program Manager. To get started, please set up your account password by clicking the button below:</p>
//           <div style="text-align: center; margin: 20px;">
//           <a href="http://localhost:5000/reset-password?token=${user._id}" style="background-color: #005A9C; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Set Up Your Password</a>          </div>
//           <p>If you have any questions, feel free to <a href="mailto:${process.env.EMAIL}" style="color: #005A9C;">contact us</a> at any time.</p>
//           <p style="border-top: 1px solid #ccc; padding-top: 10px; text-align: center;">Best regards,<br>Your <strong>IITI DRISHTI CPS FOUNDATION</strong> Team</p>
//           <footer style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
//             <p>Follow us on:
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #3b5998;">Facebook</a>,
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #1DA1F2;">Twitter</a>,
//               <a href="https://in.linkedin.com/company/iiti-drishti-cps-foundation-iit-indore/" style="text-decoration: none; color: #0077B5;">LinkedIn</a>
//             </p>
//           </footer>
//         </div>
//       `,
//       attachments: [
//         {
//           filename: 'logo.jpg',
//           path: path.join(__dirname, '../assets/logo.jpg'),
//           cid: 'logo'
//         }
//       ]
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error in sending email');
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.json({ msg: 'Program Manager added and email sent successfully' });
//       }
//     });
//   } catch (err) {
//     console.error("Server error:", err.message);
//     res.status(500).send("Server error");
//   }
// });


// // Route to get all program managers across all organizations
// router.get("/all", auth, async (req, res) => {
//   try {
//     const programManagers = await ProgramManager.find();
//     res.json(programManagers);
//   } catch (err) {
//     console.error("Error fetching program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all active program managers
// router.get("/active", auth, async (req, res) => {
//   try {
//     const activeProgramManagers = await ProgramManager.find({ isActive: true });
//     res.json(activeProgramManagers);
//   } catch (err) {
//     console.error("Error fetching active program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all inactive program managers
// router.get("/inactive", auth, async (req, res) => {
//   try {
//     const inactiveProgramManagers = await ProgramManager.find({
//       isActive: false,
//     });
//     res.json(inactiveProgramManagers);
//   } catch (err) {
//     console.error("Error fetching inactive program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all program managers for the logged-in admin
// router.get("/", auth, async (req, res) => {
//   try {
//     console.log("Fetching Program Managers for Admin:", req.user.id); // Debugging line
//     const programManagers = await ProgramManager.find({ admin: req.user.id });
//     console.log("Fetched Program Managers:", programManagers); // Debugging line
//     res.json(programManagers);
//   } catch (err) {
//     console.error("Error fetching program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get a program manager by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.json(programManager);
//   } catch (err) {
//     console.error("Error fetching program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to update a program manager by ID
// router.put("/:id", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;

//   // Build program manager object
//   const programManagerFields = {};
//   if (email) programManagerFields.email = email;
//   if (adminName) programManagerFields.adminName = adminName;
//   if (adminPhone) programManagerFields.adminPhone = adminPhone;
//   if (username) programManagerFields.username = username;
//   if (password) {
//     const salt = await bcrypt.genSalt(10);
//     programManagerFields.password = await bcrypt.hash(password, salt);
//   }

//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager = await ProgramManager.findByIdAndUpdate(
//       req.params.id,
//       { $set: programManagerFields },
//       { new: true }
//     );

//     res.json(programManager);
//   } catch (err) {
//     console.error("Error updating program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to disable a program manager by ID
// router.put("/:id/disable", auth, async (req, res) => {
//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.isActive = false;
//     await programManager.save();

//     res.json({ msg: "Program Manager disabled successfully" });
//   } catch (err) {
//     console.error("Error disabling program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to enable a program manager by ID
// router.put("/:id/enable", auth, async (req, res) => {
//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.isActive = true;
//     await programManager.save();

//     res.json({ msg: "Program Manager enabled successfully" });
//   } catch (err) {
//     console.error("Error enabling program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;





//new 12 aug

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const ProgramManager = require("../models/ProgramManager");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");
// const nodemailer = require("nodemailer");
// const path = require("path");

// // Set up Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Route to add a new program manager and send welcome email
// router.post("/", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;
//   if (!email || !adminName || !adminPhone || !username || !password) {
//     return res.status(400).json({ msg: "Please provide all required fields." });
//   }

//   try {
//     let user = await ProgramManager.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "Program Manager already exists" });
//     }

//     const organization = await Organization.findById(req.user.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Admin organization not found" });
//     }
//     user = new ProgramManager({
//       email,
//       admin: req.user.id,
//       adminName,
//       adminPhone,
//       username,
//       password,
//       isActive: true, // Set isActive to true by default
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Send welcome email to the new program manager
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "WELCOME TO IITI DRISHTI CPS FOUNDATION",
//       html: `
//         <div style="max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; font-family: 'Helvetica', 'Arial', sans-serif; color: #333;">
//           <div style="text-align: center; margin-bottom: 20px;">
//             <a href="https://drishticps.iiti.ac.in/">
//               <img src="cid:logo" alt="IITI DRISHTI CPS FOUNDATION Logo" style="width: 100px; height: auto;">
//             </a>
//           </div>
//           <h2 style="color: #005A9C; text-align: center;">WELCOME TO <strong>IITI DRISHTI CPS FOUNDATION</strong></h2>
//           <p>Hello <strong>${adminName}</strong>,</p>
//           <p>You have been added as a Program Manager. To get started, please set up your account password by clicking the button below:</p>
//           <div style="text-align: center; margin: 20px;">
//           <a href="http://localhost:5000/reset-password?token=${user._id}" style="background-color: #005A9C; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Set Up Your Password</a>          </div>
//           <p>If you have any questions, feel free to <a href="mailto:${process.env.EMAIL}" style="color: #005A9C;">contact us</a> at any time.</p>
//           <p style="border-top: 1px solid #ccc; padding-top: 10px; text-align: center;">Best regards,<br>Your <strong>IITI DRISHTI CPS FOUNDATION</strong> Team</p>
//           <footer style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
//             <p>Follow us on:
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #3b5998;">Facebook</a>,
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #1DA1F2;">Twitter</a>,
//               <a href="https://in.linkedin.com/company/iiti-drishti-cps-foundation-iit-indore/" style="text-decoration: none; color: #0077B5;">LinkedIn</a>
//             </p>
//           </footer>
//         </div>
//       `,
//       attachments: [
//         {
//           filename: "logo.jpg",
//           path: path.join(__dirname, "../assets/logo.jpg"),
//           cid: "logo",
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.error("Error sending email:", error);
//         res.status(500).send("Error in sending email");
//       } else {
//         console.log("Email sent: " + info.response);
//         res.json({ msg: "Program Manager added and email sent successfully" });
//       }
//     });
//   } catch (err) {
//     console.error("Server error:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all program managers across all organizations
// router.get("/all", auth, async (req, res) => {
//   try {
//     const programManagers = await ProgramManager.find();
//     res.json(programManagers);
//   } catch (err) {
//     console.error("Error fetching program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });



// // Route to get all active program managers
// router.get("/active", auth, async (req, res) => {
//   try {
//     const activeProgramManagers = await ProgramManager.find({ isActive: true });
//     res.json(activeProgramManagers);
//   } catch (err) {
//     console.error("Error fetching active program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });


// //Route to get all inactive program managers
// router.get("/inactive", auth, async (req, res) => {
//   try {
//     const inactiveProgramManagers = await ProgramManager.find({
//       isActive: false,
//     });
//     res.json(inactiveProgramManagers);
//   } catch (err) {
//     console.error("Error fetching inactive program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// //Route to get the count of active program managers
// router.get("/active/count", auth, async (req, res) => {
//   try {
//     const count = await ProgramManager.countDocuments({ isActive: true });
//     res.json({ count });
//   } catch (err) {
//     console.error(
//       "Error fetching count of active program managers:",
//       err.message
//     );
//     res.status(500).send("Server error");
//   }
// });


// // Route to get the count of inactive program managers
// router.get("/inactive/count", auth, async (req, res) => {
//   try {
//     const count = await ProgramManager.countDocuments({ isActive: false });
//     res.json({ count });
//   } catch (err) {
//     console.error(
//       "Error fetching count of inactive program managers:",
//       err.message
//     );
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all program managers for the logged-in admin
// router.get("/", auth, async (req, res) => {
//   try {
//     console.log("Fetching Program Managers for Admin:", req.user.id); // Debugging line
//     const programManagers = await ProgramManager.find({ admin: req.user.id });
//     console.log("Fetched Program Managers:", programManagers); // Debugging line
//     res.json(programManagers);
//   } catch (err) {
//     console.error("Error fetching program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });


// // Route to get all active program managers for the logged-in admin
// router.get("/active/by-admin", auth, async (req, res) => {
//   try {
//     const activeProgramManagers = await ProgramManager.find({
//       isActive: true,
//       admin: req.user.id,  // Filter by the logged-in admin's ID
//     });
//     res.json(activeProgramManagers);
//   } catch (err) {
//     console.error("Error fetching active program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });


// // Route to get all inactive program managers for the logged-in admin
// router.get("/inactive/by-admin", auth, async (req, res) => {
//   try {
//     const inactiveProgramManagers = await ProgramManager.find({
//       isActive: false,
//       admin: req.user.id,  // Filter by the logged-in admin's ID
//     });
//     res.json(inactiveProgramManagers);
//   } catch (err) {
//     console.error("Error fetching inactive program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get the count of active program managers for the logged-in admin
// router.get("/active/count/by-admin", auth, async (req, res) => {
//   try {
//     const count = await ProgramManager.countDocuments({
//       isActive: true,
//       admin: req.user.id,  // Filter by the logged-in admin's ID
//     });
//     res.json({ count });
//   } catch (err) {
//     console.error(
//       "Error fetching count of active program managers:",
//       err.message
//     );
//     res.status(500).send("Server error");
//   }
// });

// // Route to get the count of inactive program managers for the logged-in admin
// router.get("/inactive/count/by-admin", auth, async (req, res) => {
//   try {
//     const count = await ProgramManager.countDocuments({
//       isActive: false,
//       admin: req.user.id,  // Filter by the logged-in admin's ID
//     });
//     res.json({ count });
//   } catch (err) {
//     console.error(
//       "Error fetching count of inactive program managers:",
//       err.message
//     );
//     res.status(500).send("Server error");
//   }
// });





// // Route to get a program manager by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.json(programManager);
//   } catch (err) {
//     console.error("Error fetching program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });










// // Route to update a program manager by ID
// router.put("/:id", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;

//   // Build program manager object
//   const programManagerFields = {};
//   if (email) programManagerFields.email = email;
//   if (adminName) programManagerFields.adminName = adminName;
//   if (adminPhone) programManagerFields.adminPhone = adminPhone;
//   if (username) programManagerFields.username = username;
//   if (password) {
//     const salt = await bcrypt.genSalt(10);
//     programManagerFields.password = await bcrypt.hash(password, salt);
//   }

//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager = await ProgramManager.findByIdAndUpdate(
//       req.params.id,
//       { $set: programManagerFields },
//       { new: true }
//     );

//     res.json(programManager);
//   } catch (err) {
//     console.error("Error updating program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to disable a program manager by ID
// router.put("/:id/disable", auth, async (req, res) => {
//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.isActive = false;
//     await programManager.save();

//     res.json({ msg: "Program Manager disabled successfully" });
//   } catch (err) {
//     console.error("Error disabling program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to enable a program manager by ID
// router.put("/:id/enable", auth, async (req, res) => {
//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.isActive = true;
//     await programManager.save();

//     res.json({ msg: "Program Manager enabled successfully" });
//   } catch (err) {
//     console.error("Error enabling program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;





//working on 13 aug
// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const ProgramManager = require("../models/ProgramManager");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");
// const nodemailer = require("nodemailer");
// const path = require("path");

// // Set up Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Route to add a new program manager and send welcome email
// router.post("/", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;
//   if (!email || !adminName || !adminPhone || !username || !password) {
//     return res.status(400).json({ msg: "Please provide all required fields." });
//   }

//   try {
//     let user = await ProgramManager.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "Program Manager already exists" });
//     }

//     const organization = await Organization.findById(req.user.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Admin organization not found" });
//     }

//     user = new ProgramManager({
//       email,
//       admin: req.user.id,
//       adminName,
//       adminPhone,
//       username,
//       password,
//       isActive: true, // Set isActive to true by default
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Send welcome email to the new program manager
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "WELCOME TO IITI DRISHTI CPS FOUNDATION",
//       html: `
//         <div style="max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; font-family: 'Helvetica', 'Arial', sans-serif; color: #333;">
//           <div style="text-align: center; margin-bottom: 20px;">
//             <a href="https://drishticps.iiti.ac.in/">
//               <img src="cid:logo" alt="IITI DRISHTI CPS FOUNDATION Logo" style="width: 100px; height: auto;">
//             </a>
//           </div>
//           <h2 style="color: #005A9C; text-align: center;">WELCOME TO <strong>IITI DRISHTI CPS FOUNDATION</strong></h2>
//           <p>Hello <strong>${adminName}</strong>,</p>
//           <p>You have been added as a Program Manager. To get started, please set up your account password by clicking the button below:</p>
//           <div style="text-align: center; margin: 20px;">
//           <a href="http://localhost:5000/reset-password?token=${user._id}" style="background-color: #005A9C; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Set Up Your Password</a>
//           </div>
//           <p>If you have any questions, feel free to <a href="mailto:${process.env.EMAIL}" style="color: #005A9C;">contact us</a> at any time.</p>
//           <p style="border-top: 1px solid #ccc; padding-top: 10px; text-align: center;">Best regards,<br>Your <strong>IITI DRISHTI CPS FOUNDATION</strong> Team</p>
//           <footer style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
//             <p>Follow us on:
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #3b5998;">Facebook</a>,
//               <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #1DA1F2;">Twitter</a>,
//               <a href="https://in.linkedin.com/company/iiti-drishti-cps-foundation-iit-indore/" style="text-decoration: none; color: #0077B5;">LinkedIn</a>
//             </p>
//           </footer>
//         </div>
//       `,
//       attachments: [
//         {
//           filename: "logo.jpg",
//           path: path.join(__dirname, "../assets/logo.jpg"),
//           cid: "logo",
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.error("Error sending email:", error);
//         res.status(500).send("Error in sending email");
//       } else {
//         console.log("Email sent: " + info.response);
//         res.json({
//           msg: "Program Manager added and email sent successfully",
//           user,
//         }); // Return the created user
//       }
//     });
//   } catch (err) {
//     console.error("Server error:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all program managers across all organizations
// router.get("/all", auth, async (req, res) => {
//   try {
//     const programManagers = await ProgramManager.find();
//     res.json(programManagers);
//   } catch (err) {
//     console.error("Error fetching program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all active program managers
// router.get("/active", auth, async (req, res) => {
//   try {
//     const activeProgramManagers = await ProgramManager.find({ isActive: true });
//     res.json(activeProgramManagers);
//   } catch (err) {
//     console.error("Error fetching active program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all inactive program managers
// router.get("/inactive", auth, async (req, res) => {
//   try {
//     const inactiveProgramManagers = await ProgramManager.find({
//       isActive: false,
//     });
//     res.json(inactiveProgramManagers);
//   } catch (err) {
//     console.error("Error fetching inactive program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get the count of active program managers
// router.get("/active/count", auth, async (req, res) => {
//   try {
//     const count = await ProgramManager.countDocuments({ isActive: true });
//     res.json({ count });
//   } catch (err) {
//     console.error(
//       "Error fetching count of active program managers:",
//       err.message
//     );
//     res.status(500).send("Server error");
//   }
// });

// // Route to get the count of inactive program managers
// router.get("/inactive/count", auth, async (req, res) => {
//   try {
//     const count = await ProgramManager.countDocuments({ isActive: false });
//     res.json({ count });
//   } catch (err) {
//     console.error(
//       "Error fetching count of inactive program managers:",
//       err.message
//     );
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all program managers for the logged-in admin
// router.get("/", auth, async (req, res) => {
//   try {
//     console.log("Fetching Program Managers for Admin:", req.user.id); // Debugging line
//     const programManagers = await ProgramManager.find({ admin: req.user.id });
//     console.log("Fetched Program Managers:", programManagers); // Debugging line
//     res.json(programManagers);
//   } catch (err) {
//     console.error("Error fetching program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all active program managers for the logged-in admin
// router.get("/active/by-admin", auth, async (req, res) => {
//   try {
//     const activeProgramManagers = await ProgramManager.find({
//       isActive: true,
//       admin: req.user.id, // Filter by the logged-in admin's ID
//     });
//     res.json(activeProgramManagers);
//   } catch (err) {
//     console.error("Error fetching active program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get all inactive program managers for the logged-in admin
// router.get("/inactive/by-admin", auth, async (req, res) => {
//   try {
//     const inactiveProgramManagers = await ProgramManager.find({
//       isActive: false,
//       admin: req.user.id, // Filter by the logged-in admin's ID
//     });
//     res.json(inactiveProgramManagers);
//   } catch (err) {
//     console.error("Error fetching inactive program managers:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to get the count of active program managers for the logged-in admin
// router.get("/active/count/by-admin", auth, async (req, res) => {
//   try {
//     const count = await ProgramManager.countDocuments({
//       isActive: true,
//       admin: req.user.id, // Filter by the logged-in admin's ID
//     });
//     res.json({ count });
//   } catch (err) {
//     console.error(
//       "Error fetching count of active program managers:",
//       err.message
//     );
//     res.status(500).send("Server error");
//   }
// });

// // Route to get the count of inactive program managers for the logged-in admin
// router.get("/inactive/count/by-admin", auth, async (req, res) => {
//   try {
//     const count = await ProgramManager.countDocuments({
//       isActive: false,
//       admin: req.user.id, // Filter by the logged-in admin's ID
//     });
//     res.json({ count });
//   } catch (err) {
//     console.error(
//       "Error fetching count of inactive program managers:",
//       err.message
//     );
//     res.status(500).send("Server error");
//   }
// });

// // Route to get a program manager by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }
//     res.json(programManager);
//   } catch (err) {
//     console.error("Error fetching program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to update a program manager by ID
// router.put("/:id", auth, async (req, res) => {
//   const { email, adminName, adminPhone, username, password } = req.body;

//   // Build program manager object
//   const programManagerFields = {};
//   if (email) programManagerFields.email = email;
//   if (adminName) programManagerFields.adminName = adminName;
//   if (adminPhone) programManagerFields.adminPhone = adminPhone;
//   if (username) programManagerFields.username = username;
//   if (password) {
//     const salt = await bcrypt.genSalt(10);
//     programManagerFields.password = await bcrypt.hash(password, salt);
//   }

//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager = await ProgramManager.findByIdAndUpdate(
//       req.params.id,
//       { $set: programManagerFields },
//       { new: true }
//     );

//     res.json(programManager);
//   } catch (err) {
//     console.error("Error updating program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to disable a program manager by ID
// router.put("/:id/disable", auth, async (req, res) => {
//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.isActive = false;
//     await programManager.save();

//     res.json({ msg: "Program Manager disabled successfully" });
//   } catch (err) {
//     console.error("Error disabling program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Route to enable a program manager by ID
// router.put("/:id/enable", auth, async (req, res) => {
//   try {
//     let programManager = await ProgramManager.findById(req.params.id);
//     if (!programManager) {
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.isActive = true;
//     await programManager.save();

//     res.json({ msg: "Program Manager enabled successfully" });
//   } catch (err) {
//     console.error("Error enabling program manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;





const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ProgramManager = require("../models/ProgramManager");
const Organization = require("../models/Organization");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const path = require("path");

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Route to add a new program manager and send welcome email
router.post("/", auth, async (req, res) => {
  const { email, adminName, adminPhone, username, password } = req.body;
  if (!email || !adminName || !adminPhone || !username || !password) {
    return res.status(400).json({ msg: "Please provide all required fields." });
  }

  try {
    let user = await ProgramManager.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Program Manager already exists" });
    }

    const organization = await Organization.findById(req.user.id);
    if (!organization) {
      return res.status(404).json({ msg: "Admin organization not found" });
    }

    user = new ProgramManager({
      email,
      admin: req.user.id,
      adminName,
      adminPhone,
      username,
      password,
      isActive: true, // Set isActive to true by default
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Send welcome email to the new program manager
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "WELCOME TO IITI DRISHTI CPS FOUNDATION",
      html: `
        <div style="max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; font-family: 'Helvetica', 'Arial', sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="https://drishticps.iiti.ac.in/">
              <img src="cid:logo" alt="IITI DRISHTI CPS FOUNDATION Logo" style="width: 100px; height: auto;">
            </a>
          </div>
          <h2 style="color: #005A9C; text-align: center;">WELCOME TO <strong>IITI DRISHTI CPS FOUNDATION</strong></h2>
          <p>Hello <strong>${adminName}</strong>,</p>
          <p>You have been added as a Program Manager. To get started, please set up your account password by clicking the button below:</p>
          <div style="text-align: center; margin: 20px;">
          <a href="http://localhost:5000/reset-password?token=${user._id}" style="background-color: #005A9C; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Set Up Your Password</a>
          </div>
          <p>If you have any questions, feel free to <a href="mailto:${process.env.EMAIL}" style="color: #005A9C;">contact us</a> at any time.</p>
          <p style="border-top: 1px solid #ccc; padding-top: 10px; text-align: center;">Best regards,<br>Your <strong>IITI DRISHTI CPS FOUNDATION</strong> Team</p>
          <footer style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
            <p>Follow us on:
              <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #3b5998;">Facebook</a>,
              <a href="https://drishticps.iiti.ac.in/" style="text-decoration: none; color: #1DA1F2;">Twitter</a>,
              <a href="https://in.linkedin.com/company/iiti-drishti-cps-foundation-iit-indore/" style="text-decoration: none; color: #0077B5;">LinkedIn</a>
            </p>
          </footer>
        </div>
      `,
      attachments: [
        {
          filename: "logo.jpg",
          path: path.join(__dirname, "../assets/logo.jpg"),
          cid: "logo",
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error in sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.json({
          msg: "Program Manager added and email sent successfully",
          user,
        }); // Return the created user
      }
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to log in as a Program Manager
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await ProgramManager.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: "Program Manager",
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/programmanagers/me
// @desc    Get the logged-in program manager details
router.get("/me", auth, async (req, res) => {
  try {
    let programManager;
    if (req.user.id === "default-id") {
      // If the default program manager
      programManager = { email: "default@manager.com", name: "Program Manager" };
    } else {
      programManager = await ProgramManager.findById(req.user.id).select("-password");
    }

    if (!programManager) {
      return res.status(400).json({ msg: "Program Manager not found" });
    }

    res.json(programManager);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Route to get all program managers across all organizations
router.get("/all", auth, async (req, res) => {
  try {
    const programManagers = await ProgramManager.find();
    res.json(programManagers);
  } catch (err) {
    console.error("Error fetching program managers:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to get all active program managers
router.get("/active", auth, async (req, res) => {
  try {
    const activeProgramManagers = await ProgramManager.find({ isActive: true });
    res.json(activeProgramManagers);
  } catch (err) {
    console.error("Error fetching active program managers:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to get all inactive program managers
router.get("/inactive", auth, async (req, res) => {
  try {
    const inactiveProgramManagers = await ProgramManager.find({
      isActive: false,
    });
    res.json(inactiveProgramManagers);
  } catch (err) {
    console.error("Error fetching inactive program managers:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to get the count of active program managers
router.get("/active/count", auth, async (req, res) => {
  try {
    const count = await ProgramManager.countDocuments({ isActive: true });
    res.json({ count });
  } catch (err) {
    console.error(
      "Error fetching count of active program managers:",
      err.message
    );
    res.status(500).send("Server error");
  }
});

// Route to get the count of inactive program managers
router.get("/inactive/count", auth, async (req, res) => {
  try {
    const count = await ProgramManager.countDocuments({ isActive: false });
    res.json({ count });
  } catch (err) {
    console.error(
      "Error fetching count of inactive program managers:",
      err.message
    );
    res.status(500).send("Server error");
  }
});

// Route to get all program managers for the logged-in admin
router.get("/", auth, async (req, res) => {
  try {
    console.log("Fetching Program Managers for Admin:", req.user.id); // Debugging line
    const programManagers = await ProgramManager.find({ admin: req.user.id });
    console.log("Fetched Program Managers:", programManagers); // Debugging line
    res.json(programManagers);
  } catch (err) {
    console.error("Error fetching program managers:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to get all active program managers for the logged-in admin
router.get("/active/by-admin", auth, async (req, res) => {
  try {
    const activeProgramManagers = await ProgramManager.find({
      isActive: true,
      admin: req.user.id, // Filter by the logged-in admin's ID
    });
    res.json(activeProgramManagers);
  } catch (err) {
    console.error("Error fetching active program managers:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to get all inactive program managers for the logged-in admin
router.get("/inactive/by-admin", auth, async (req, res) => {
  try {
    const inactiveProgramManagers = await ProgramManager.find({
      isActive: false,
      admin: req.user.id, // Filter by the logged-in admin's ID
    });
    res.json(inactiveProgramManagers);
  } catch (err) {
    console.error("Error fetching inactive program managers:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to get the count of active program managers for the logged-in admin
router.get("/active/count/by-admin", auth, async (req, res) => {
  try {
    const count = await ProgramManager.countDocuments({
      isActive: true,
      admin: req.user.id, // Filter by the logged-in admin's ID
    });
    res.json({ count });
  } catch (err) {
    console.error(
      "Error fetching count of active program managers:",
      err.message
    );
    res.status(500).send("Server error");
  }
});

// Route to get the count of inactive program managers for the logged-in admin
router.get("/inactive/count/by-admin", auth, async (req, res) => {
  try {
    const count = await ProgramManager.countDocuments({
      isActive: false,
      admin: req.user.id, // Filter by the logged-in admin's ID
    });
    res.json({ count });
  } catch (err) {
    console.error(
      "Error fetching count of inactive program managers:",
      err.message
    );
    res.status(500).send("Server error");
  }
});

// Route to get a program manager by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const programManager = await ProgramManager.findById(req.params.id);
    if (!programManager) {
      return res.status(404).json({ msg: "Program Manager not found" });
    }
    res.json(programManager);
  } catch (err) {
    console.error("Error fetching program manager:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to update a program manager by ID
router.put("/:id", auth, async (req, res) => {
  const { email, adminName, adminPhone, username, password } = req.body;

  // Build program manager object
  const programManagerFields = {};
  if (email) programManagerFields.email = email;
  if (adminName) programManagerFields.adminName = adminName;
  if (adminPhone) programManagerFields.adminPhone = adminPhone;
  if (username) programManagerFields.username = username;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    programManagerFields.password = await bcrypt.hash(password, salt);
  }

  try {
    let programManager = await ProgramManager.findById(req.params.id);
    if (!programManager) {
      return res.status(404).json({ msg: "Program Manager not found" });
    }

    programManager = await ProgramManager.findByIdAndUpdate(
      req.params.id,
      { $set: programManagerFields },
      { new: true }
    );

    res.json(programManager);
  } catch (err) {
    console.error("Error updating program manager:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to disable a program manager by ID
router.put("/:id/disable", auth, async (req, res) => {
  try {
    let programManager = await ProgramManager.findById(req.params.id);
    if (!programManager) {
      return res.status(404).json({ msg: "Program Manager not found" });
    }

    programManager.isActive = false;
    await programManager.save();

    res.json({ msg: "Program Manager disabled successfully" });
  } catch (err) {
    console.error("Error disabling program manager:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to enable a program manager by ID
router.put("/:id/enable", auth, async (req, res) => {
  try {
    let programManager = await ProgramManager.findById(req.params.id);
    if (!programManager) {
      return res.status(404).json({ msg: "Program Manager not found" });
    }

    programManager.isActive = true;
    await programManager.save();

    res.json({ msg: "Program Manager enabled successfully" });
  } catch (err) {
    console.error("Error enabling program manager:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
