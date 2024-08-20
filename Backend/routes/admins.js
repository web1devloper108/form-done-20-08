// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Organization = require("../models/Organization");
// const ProgramManager = require("../models/ProgramManager");
// const auth = require("../middleware/auth");

// // @route   POST api/admins/login
// // @desc    Authenticate organization (admin) and get token
// router.post("/login", async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return res
//       .status(400)
//       .json({ msg: "Please provide email, password, and role." });
//   }

//   try {
//     let user;
//     if (role === "Admin" || role === "Super Admin") {
//       user = await Organization.findOne({
//         email: new RegExp(`^${email}$`, "i"),
//       });
//     } else {
//       return res.status(400).json({ msg: "Invalid Role" });
//     }

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         role: role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: "5 days" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   POST api/admins/change-password
// // @desc    Change password for organization (admin)
// router.post("/change-password", auth, async (req, res) => {
//   const { newPassword, confirmNewPassword } = req.body;
//   if (newPassword !== confirmNewPassword) {
//     return res.status(400).json({ msg: "Passwords do not match" });
//   }

//   try {
//     let user = await Organization.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     user.firstTimeLogin = false;
//     await user.save();
//     res.json({ msg: "Password changed successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me
// // @desc    Get admin (organization) profile
// router.get("/me", auth, async (req, res) => {
//   try {
//     let user = await Organization.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/:id/programmanagers
// // @desc    Get program managers associated with an admin
// router.get("/:id/programmanagers", auth, async (req, res) => {
//   try {
//     if (req.user.role !== "Admin" && req.user.role !== "Super Admin") {
//       return res.status(403).json({ msg: "Access denied" });
//     }

//     const programManagers = await ProgramManager.find({ admin: req.params.id });
//     res.json(programManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;




// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Organization = require("../models/Organization");
// const ProgramManager = require("../models/ProgramManager");
// const auth = require("../middleware/auth");

// // @route   POST api/admins/login
// // @desc    Authenticate organization (admin) and get token
// router.post("/login", async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return res
//       .status(400)
//       .json({ msg: "Please provide email, password, and role." });
//   }

//   try {
//     let user;
//     if (role === "Admin" || role === "Super Admin") {
//       user = await Organization.findOne({
//         email: new RegExp(`^${email}$`, "i"),
//       });
//     } else {
//       return res.status(400).json({ msg: "Invalid Role" });
//     }

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         role: role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: "5 days" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   POST api/admins/change-password
// // @desc    Change password for organization (admin)
// router.post("/change-password", auth, async (req, res) => {
//   const { newPassword, confirmNewPassword } = req.body;
//   if (newPassword !== confirmNewPassword) {
//     return res.status(400).json({ msg: "Passwords do not match" });
//   }

//   try {
//     let user = await Organization.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     user.firstTimeLogin = false;
//     await user.save();
//     res.json({ msg: "Password changed successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me
// // @desc    Get admin (organization) profile
// router.get("/me", auth, async (req, res) => {
//   try {
//     let user = await Organization.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me/programmanagers
// // @desc    Get program managers associated with the logged-in admin
// router.get("/me/programmanagers", auth, async (req, res) => {
//   try {
//     const programManagers = await ProgramManager.find({ admin: req.user.id });
//     res.json(programManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });



// //new 22


// router.put("/programmanagers/:id", auth, async (req, res) => {
//   const { name, adminName, adminPhone, username, email } = req.body;

//   console.log("Received update request for Program Manager ID:", req.params.id);
//   console.log("Update data:", req.body);

//   try {
//     let programManager = await ProgramManager.findById(req.params.id);

//     if (!programManager) {
//       console.log("Program Manager not found");
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.name = name;
//     programManager.adminName = adminName;
//     programManager.adminPhone = adminPhone;
//     programManager.username = username;
//     programManager.email = email;

//     await programManager.save();
//     res.json({ msg: "Program Manager updated successfully", programManager });
//   } catch (err) {
//     console.error("Error updating Program Manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });


// module.exports = router;




// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Organization = require("../models/Organization");
// const ProgramManager = require("../models/ProgramManager");
// const auth = require("../middleware/auth");

// // @route   POST api/admins/login
// // @desc    Authenticate organization (admin) and get token
// router.post("/login", async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return res
//       .status(400)
//       .json({ msg: "Please provide email, password, and role." });
//   }

//   try {
//     let user;
//     if (role === "Admin" || role === "Super Admin") {
//       user = await Organization.findOne({
//         email: new RegExp(`^${email}$`, "i"),
//       });
//     } else {
//       return res.status(400).json({ msg: "Invalid Role" });
//     }

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         role: role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: "5 days" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   POST api/admins/change-password
// // @desc    Change password for organization (admin)
// router.post("/change-password", auth, async (req, res) => {
//   const { newPassword, confirmNewPassword } = req.body;
//   if (newPassword !== confirmNewPassword) {
//     return res.status(400).json({ msg: "Passwords do not match" });
//   }

//   try {
//     let user = await Organization.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     user.firstTimeLogin = false;
//     await user.save();
//     res.json({ msg: "Password changed successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me
// // @desc    Get admin (organization) profile
// router.get("/me", auth, async (req, res) => {
//   try {
//     let user = await Organization.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me/programmanagers
// // @desc    Get program managers associated with the logged-in admin
// router.get("/me/programmanagers", auth, async (req, res) => {
//   try {
//     const programManagers = await ProgramManager.find({ admin: req.user.id });
//     res.json(programManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me/programmanagers/active
// // @desc    Get active program managers associated with the logged-in admin
// router.get("/me/programmanagers/active", auth, async (req, res) => {
//   try {
//     const activeProgramManagers = await ProgramManager.find({
//       admin: req.user.id,
//       isActive: true,
//     });
//     res.json(activeProgramManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me/programmanagers/inactive
// // @desc    Get inactive program managers associated with the logged-in admin
// router.get("/me/programmanagers/inactive", auth, async (req, res) => {
//   try {
//     const inactiveProgramManagers = await ProgramManager.find({
//       admin: req.user.id,
//       isActive: false,
//     });
//     res.json(inactiveProgramManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   PUT api/admins/programmanagers/:id
// // @desc    Update a program manager
// router.put("/programmanagers/:id", auth, async (req, res) => {
//   const { name, adminName, adminPhone, username, email } = req.body;

//   console.log("Received update request for Program Manager ID:", req.params.id);
//   console.log("Update data:", req.body);

//   try {
//     let programManager = await ProgramManager.findById(req.params.id);

//     if (!programManager) {
//       console.log("Program Manager not found");
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.name = name;
//     programManager.adminName = adminName;
//     programManager.adminPhone = adminPhone;
//     programManager.username = username;
//     programManager.email = email;

//     await programManager.save();
//     res.json({ msg: "Program Manager updated successfully", programManager });
//   } catch (err) {
//     console.error("Error updating Program Manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;






//all working 8 aug
// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Organization = require("../models/Organization");
// const ProgramManager = require("../models/ProgramManager");
// const auth = require("../middleware/auth");

// // Default email and password for testing
// const defaultEmail = "drishti@admin.com";
// const defaultPassword = "drishti";

// // @route   POST api/admins/login
// // @desc    Authenticate organization (admin) and get token
// router.post("/login", async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return res
//       .status(400)
//       .json({ msg: "Please provide email, password, and role." });
//   }

//   try {
//     let user;
//     if (
//       email === defaultEmail &&
//       password === defaultPassword &&
//       role === "Super Admin"
//     ) {
//       const payload = {
//         user: {
//           id: "default-id",
//           role: "Super Admin",
//         },
//       };

//       return jwt.sign(
//         payload,
//         process.env.JWT_SECRET,
//         { expiresIn: "5 days" },
//         (err, token) => {
//           if (err) throw err;
//           return res.json({ token });
//         }
//       );
//     }

//     if (role === "Admin" || role === "Super Admin") {
//       user = await Organization.findOne({
//         email: new RegExp(`^${email}$`, "i"),
//       });
//     } else {
//       return res.status(400).json({ msg: "Invalid Role" });
//     }

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         role: role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: "5 days" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   POST api/admins/change-password
// // @desc    Change password for organization (admin)
// router.post("/change-password", auth, async (req, res) => {
//   const { newPassword, confirmNewPassword } = req.body;
//   if (newPassword !== confirmNewPassword) {
//     return res.status(400).json({ msg: "Passwords do not match" });
//   }

//   try {
//     let user = await Organization.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     user.firstTimeLogin = false;
//     await user.save();
//     res.json({ msg: "Password changed successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me
// // @desc    Get admin (organization) profile
// router.get("/me", auth, async (req, res) => {
//   try {
//     let user;
//     if (req.user.id === "default-id") {
//       // If the default superadmin
//       user = { email: "drishti@admin.com", name: "SuperAdmin" };
//     } else {
//       user = await Organization.findById(req.user.id).select("-password");
//     }

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me/programmanagers
// // @desc    Get program managers associated with the logged-in admin
// router.get("/me/programmanagers", auth, async (req, res) => {
//   try {
//     const programManagers = await ProgramManager.find({ admin: req.user.id });
//     res.json(programManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me/programmanagers/active
// // @desc    Get active program managers associated with the logged-in admin
// router.get("/me/programmanagers/active", auth, async (req, res) => {
//   try {
//     const activeProgramManagers = await ProgramManager.find({
//       admin: req.user.id,
//       isActive: true,
//     });
//     res.json(activeProgramManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admins/me/programmanagers/inactive
// // @desc    Get inactive program managers associated with the logged-in admin
// router.get("/me/programmanagers/inactive", auth, async (req, res) => {
//   try {
//     const inactiveProgramManagers = await ProgramManager.find({
//       admin: req.user.id,
//       isActive: false,
//     });
//     res.json(inactiveProgramManagers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   PUT api/admins/programmanagers/:id
// // @desc    Update a program manager
// router.put("/programmanagers/:id", auth, async (req, res) => {
//   const { name, adminName, adminPhone, username, email } = req.body;

//   console.log("Received update request for Program Manager ID:", req.params.id);
//   console.log("Update data:", req.body);

//   try {
//     let programManager = await ProgramManager.findById(req.params.id);

//     if (!programManager) {
//       console.log("Program Manager not found");
//       return res.status(404).json({ msg: "Program Manager not found" });
//     }

//     programManager.name = name;
//     programManager.adminName = adminName;
//     programManager.adminPhone = adminPhone;
//     programManager.username = username;
//     programManager.email = email;

//     await programManager.save();
//     res.json({ msg: "Program Manager updated successfully", programManager });
//   } catch (err) {
//     console.error("Error updating Program Manager:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");
const ProgramManager = require("../models/ProgramManager");
const auth = require("../middleware/auth");

// Default email and password for testing
const defaultEmail = "drishti@admin.com";
const defaultPassword = "drishti";

// @route   POST api/admins/login
// @desc    Authenticate organization (admin) and get token
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ msg: "Please provide email, password, and role." });
  }

  try {
    let user;
    if (
      email === defaultEmail &&
      password === defaultPassword &&
      role === "Super Admin"
    ) {
      const payload = {
        user: {
          id: "default-id",
          role: "Super Admin",
        },
      };

      return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    }

    if (role === "Admin" || role === "Super Admin") {
      user = await Organization.findOne({
        email: new RegExp(`^${email}$`, "i"),
      });
    } else {
      return res.status(400).json({ msg: "Invalid Role" });
    }

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
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

// @route   POST api/admins/change-password
// @desc    Change password for organization (admin)
router.post("/change-password", auth, async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    let user = await Organization.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.firstTimeLogin = false;
    await user.save();
    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admins/me
// @desc    Get admin (organization) profile
router.get("/me", auth, async (req, res) => {
  try {
    let user;
    if (req.user.id === "default-id") {
      // If the default superadmin
      user = { email: "drishti@admin.com", name: "SuperAdmin" };
    } else {
      user = await Organization.findById(req.user.id).select("-password");
    }

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admins/me/programmanagers
// @desc    Get program managers associated with the logged-in admin
router.get("/me/programmanagers", auth, async (req, res) => {
  try {
    const programManagers = await ProgramManager.find({ admin: req.user.id });
    res.json(programManagers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admins/me/programmanagers/active
// @desc    Get active program managers associated with the logged-in admin
router.get("/me/programmanagers/active", auth, async (req, res) => {
  try {
    const activeProgramManagers = await ProgramManager.find({
      admin: req.user.id,
      isActive: true,
    });
    res.json(activeProgramManagers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admins/me/programmanagers/inactive
// @desc    Get inactive program managers associated with the logged-in admin
router.get("/me/programmanagers/inactive", auth, async (req, res) => {
  try {
    const inactiveProgramManagers = await ProgramManager.find({
      admin: req.user.id,
      isActive: false,
    });
    res.json(inactiveProgramManagers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/admins/programmanagers/:id
// @desc    Update a program manager
router.put("/programmanagers/:id", auth, async (req, res) => {
  const { name, adminName, adminPhone, username, email } = req.body;

  console.log("Received update request for Program Manager ID:", req.params.id);
  console.log("Update data:", req.body);

  try {
    let programManager = await ProgramManager.findById(req.params.id);

    if (!programManager) {
      console.log("Program Manager not found");
      return res.status(404).json({ msg: "Program Manager not found" });
    }

    programManager.name = name;
    programManager.adminName = adminName;
    programManager.adminPhone = adminPhone;
    programManager.username = username;
    programManager.email = email;

    await programManager.save();
    res.json({ msg: "Program Manager updated successfully", programManager });
  } catch (err) {
    console.error("Error updating Program Manager:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
