// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");

// // @route   POST api/organizations
// // @desc    Create a new organization
// router.post("/", auth, async (req, res) => {
//   const {
//     organizationName,
//     adminName,
//     phoneNumber,
//     username,
//     email,
//     password,
//   } = req.body;

//   try {
//     let org = await Organization.findOne({ email });
//     if (org) {
//       return res.status(400).json({ msg: "Organization already exists" });
//     }

//     org = new Organization({
//       name: organizationName,
//       adminName,
//       adminPhone: phoneNumber,
//       username,
//       email,
//       password,
//     });

//     const salt = await bcrypt.genSalt(10);
//     org.password = await bcrypt.hash(password, salt);

//     await org.save();
//     res.json({
//       message: "Organization created successfully",
//       organization: org,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/organizations
// // @desc    Get all organizations
// router.get("/", auth, async (req, res) => {
//   try {
//     const organizations = await Organization.find();
//     res.json(organizations);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/organizations/:id
// // @desc    Get organization by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const organization = await Organization.findById(req.params.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Organization not found" });
//     }
//     res.json(organization);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Organization not found" });
//     }
//     res.status(500).send("Server error");
//   }
// });

// //@route   DELETE api/organizations/:id
// // @desc    Delete an organization
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const result = await Organization.findByIdAndDelete(req.params.id);
//     if (!result) {
//       return res.status(404).json({ msg: "Organization not found" });
//     }
//     res.json({ msg: "Organization removed" });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Invalid organization ID" }); // More specific message for invalid ID
//     }
//     res.status(500).send("Server error");
//   }
// });

// // @route   PUT api/organizations/:id
// // @desc    Update an organization
// router.put("/:id", auth, async (req, res) => {
//   const {
//     organizationName,
//     adminName,
//     phoneNumber,
//     username,
//     email,
//     password,
//   } = req.body;

//   // Build organization object
//   const organizationFields = {};
//   if (organizationName) organizationFields.name = organizationName;
//   if (adminName) organizationFields.adminName = adminName;
//   if (phoneNumber) organizationFields.adminPhone = phoneNumber;
//   if (username) organizationFields.username = username;
//   if (email) organizationFields.email = email;
//   if (password) {
//     const salt = await bcrypt.genSalt(10);
//     organizationFields.password = await bcrypt.hash(password, salt);
//   }

//   try {
//     let organization = await Organization.findById(req.params.id);

//     if (!organization)
//       return res.status(404).json({ msg: "Organization not found" });

//     organization = await Organization.findByIdAndUpdate(
//       req.params.id,
//       { $set: organizationFields },
//       { new: true }
//     );

//     res.json(organization);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Organization not found" });
//     }
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;







//regular 7 aug

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const Organization = require("../models/Organization");
// const auth = require("../middleware/auth");

// // @route   POST api/organizations
// // @desc    Create a new organization
// router.post("/", auth, async (req, res) => {
//   const {
//     organizationName,
//     adminName,
//     phoneNumber,
//     username,
//     email,
//     password,
//   } = req.body;

//   try {
//     let org = await Organization.findOne({ email });
//     if (org) {
//       return res.status(400).json({ msg: "Organization already exists" });
//     }

//     org = new Organization({
//       name: organizationName,
//       adminName,
//       adminPhone: phoneNumber,
//       username,
//       email,
//       password,
//       isActive: true, // New field to track active status
//     });

//     const salt = await bcrypt.genSalt(10);
//     org.password = await bcrypt.hash(password, salt);

//     await org.save();
//     res.json({
//       message: "Organization created successfully",
//       organization: org,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/organizations
// // @desc    Get all organizations
// router.get("/", auth, async (req, res) => {
//   try {
//     const organizations = await Organization.find();
//     res.json(organizations);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });






// // @route   GET api/organizations/:id
// // @desc    Get organization by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const organization = await Organization.findById(req.params.id);
//     if (!organization) {
//       return res.status(404).json({ msg: "Organization not found" });
//     }
//     res.json(organization);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Organization not found" });
//     }
//     res.status(500).send("Server error");
//   }
// });







// // @route   PUT api/organizations/:id
// // @desc    Update an organization
// router.put("/:id", auth, async (req, res) => {
//   const {
//     organizationName,
//     adminName,
//     phoneNumber,
//     username,
//     email,
//     password,
//   } = req.body;

//   // Build organization object
//   const organizationFields = {};
//   if (organizationName) organizationFields.name = organizationName;
//   if (adminName) organizationFields.adminName = adminName;
//   if (phoneNumber) organizationFields.adminPhone = phoneNumber;
//   if (username) organizationFields.username = username;
//   if (email) organizationFields.email = email;
//   if (password) {
//     const salt = await bcrypt.genSalt(10);
//     organizationFields.password = await bcrypt.hash(password, salt);
//   }

//   try {
//     let organization = await Organization.findById(req.params.id);

//     if (!organization)
//       return res.status(404).json({ msg: "Organization not found" });

//     organization = await Organization.findByIdAndUpdate(
//       req.params.id,
//       { $set: organizationFields },
//       { new: true }
//     );

//     res.json(organization);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Organization not found" });
//     }
//     res.status(500).send("Server error");
//   }
// });


// module.exports = router;




//aug 8



const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Organization = require("../models/Organization");
const auth = require("../middleware/auth");

// @route   POST api/organizations
// @desc    Create a new organization
router.post("/", auth, async (req, res) => {
  const {
    organizationName,
    adminName,
    phoneNumber,
    username,
    email,
    password,
  } = req.body;

  try {
    let org = await Organization.findOne({ email });
    if (org) {
      return res.status(400).json({ msg: "Organization already exists" });
    }

    org = new Organization({
      name: organizationName,
      adminName,
      adminPhone: phoneNumber,
      username,
      email,
      password,
      isActive: true, // New field to track active status
    });

    const salt = await bcrypt.genSalt(10);
    org.password = await bcrypt.hash(password, salt);

    await org.save();
    res.json({
      message: "Organization created successfully",
      organization: org,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/organizations
// @desc    Get all organizations
router.get("/", auth, async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/organizations/active
// @desc    Get all active organizations
router.get("/active", auth, async (req, res) => {
  try {
    const organizations = await Organization.find({ isActive: true });
    res.json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/organizations/inactive
// @desc    Get all inactive organizations
router.get("/inactive", auth, async (req, res) => {
  try {
    const organizations = await Organization.find({ isActive: false });
    res.json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/organizations/:id
// @desc    Get organization by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Organization not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   PUT api/organizations/:id
// @desc    Update an organization
router.put("/:id", auth, async (req, res) => {
  const {
    organizationName,
    adminName,
    phoneNumber,
    username,
    email,
    password,
  } = req.body;

  // Build organization object
  const organizationFields = {};
  if (organizationName) organizationFields.name = organizationName;
  if (adminName) organizationFields.adminName = adminName;
  if (phoneNumber) organizationFields.adminPhone = phoneNumber;
  if (username) organizationFields.username = username;
  if (email) organizationFields.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    organizationFields.password = await bcrypt.hash(password, salt);
  }

  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization)
      return res.status(404).json({ msg: "Organization not found" });

    organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { $set: organizationFields },
      { new: true }
    );

    res.json(organization);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Organization not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
