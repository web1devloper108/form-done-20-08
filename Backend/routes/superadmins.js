// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Superadmin = require("../models/Superadmin");

// // Default email and password for testing
// const defaultEmail = "drishti@admin.com";
// const defaultPassword = "dcpsf@!123";

// // @route   POST api/superadmins/login
// // @desc    Authenticate superadmin and get token
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if the provided credentials match the default ones
//     if (email === defaultEmail && password === defaultPassword) {
//       const payload = {
//         superadmin: {
//           id: "default-id", // You can set a specific id or any identifier
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

//     let superadmin = await Superadmin.findOne({ email });
//     if (!superadmin) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, superadmin.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const payload = {
//       superadmin: {
//         id: superadmin.id,
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

// module.exports = router;







//regular

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Superadmin = require("../models/Superadmin");
// const auth = require("../middleware/auth"); // Import the auth middleware

// // Default email and password for testing
// const defaultEmail = "drishti@admin.com";
// const defaultPassword = "drishti";

// // @route   POST api/superadmins/login
// // @desc    Authenticate superadmin and get token
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if the provided credentials match the default ones
//     if (email === defaultEmail && password === defaultPassword) {
//       const payload = {
//         user: {
//           id: "default-id", // You can set a specific id or any identifier
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

//     let superadmin = await Superadmin.findOne({ email });
//     if (!superadmin) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, superadmin.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const payload = {
//       user: {
//         id: superadmin.id,
//         role: "Super Admin",
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





// // @route   GET api/superadmins/me
// // @desc    Get the logged-in superadmin details
// router.get("/me", auth, async (req, res) => {
//   try {
//     let superadmin;
//     if (req.user.id === "default-id") {
//       // If the default superadmin
//       superadmin = { email: "drishti@admin.com", name: "SuperAdmin" };
//     } else {
//       superadmin = await Superadmin.findById(req.user.id).select("-password");
//     }

//     if (!superadmin) {
//       return res.status(400).json({ msg: "Superadmin not found" });
//     }

//     res.json(superadmin);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });




// module.exports = router;












const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Superadmin = require("../models/Superadmin");
const auth = require("../middleware/auth"); // Import the auth middleware

// Default email and password for testing
const defaultEmail = "drishti@admin.com";
const defaultPassword = "drishti";

// @route   POST api/superadmins/login
// @desc    Authenticate superadmin and get token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the provided credentials match the default ones
    if (email === defaultEmail && password === defaultPassword) {
      const payload = {
        user: {
          id: "default-id", // You can set a specific id or any identifier
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

    let superadmin = await Superadmin.findOne({ email });
    if (!superadmin) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, superadmin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: superadmin.id,
        role: "Super Admin",
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

// @route   GET api/superadmins/me
// @desc    Get the logged-in superadmin details
router.get("/me", auth, async (req, res) => {
  try {
    let superadmin;
    if (req.user.id === "default-id") {
      // If the default superadmin
      superadmin = { email: "drishti@admin.com", name: "SuperAdmin" };
    } else {
      superadmin = await Superadmin.findById(req.user.id).select("-password");
    }

    if (!superadmin) {
      return res.status(400).json({ msg: "Superadmin not found" });
    }

    res.json(superadmin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
