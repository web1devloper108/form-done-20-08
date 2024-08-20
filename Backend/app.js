// const express = require("express");
// const connectDB = require("./config/db");
// const dotenv = require("dotenv");
// const cors = require("cors");

// // Load environment variables
// dotenv.config();

// // Connect to the database
// connectDB();

// const app = express();

// const corsOptions = {
//   origin: "http://localhost:3000", // Allow requests from this origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
// };

// app.use(cors(corsOptions));

// app.use(express.json());

// app.get("/", (req, res) => res.send("API Running"));

// // Define Routes
// app.use("/api/superadmins", require("./routes/superadmins"));

// app.use("/api/organizations", require("./routes/organizations"));
// app.use("/api/admins", require("./routes/admins"));
// app.use("/api/programmanagers", require("./routes/programmanagers"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// const cors = require("cors");
// app.use(
//   cors({
//     origin: "http://localhost:3000/Rolebasedlogin", // or your frontend URL
//   })
// );








// const express = require("express");
// const connectDB = require("./config/db");
// const dotenv = require("dotenv");
// const cors = require("cors");
// require("dotenv").config();


// // Load environment variables
// dotenv.config();

// // Connect to the database
// connectDB();

// const app = express();

// // CORS configuration
// const corsOptions = {
//   origin: "http://localhost:3000", // Allow requests from this origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
// };

// app.use(
//   cors({
//     origin: "http://localhost:3000", // or use '*' to allow all origins
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// app.use(cors(corsOptions));

// app.use(express.json());

// app.get("/", (req, res) => res.send("API Running"));

// // Define Routes
// app.use("/api/superadmins", require("./routes/superadmins"));
// app.use("/api/organizations", require("./routes/organizations"));
// app.use("/api/admins", require("./routes/admins"));
// app.use("/api/programmanagers", require("./routes/programmanagers"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));





// const express = require("express");
// const connectDB = require("./config/db");
// const cors = require("cors");
// require("dotenv").config(); // Load environment variables


// // Connect to the database
// connectDB();

// const app = express();

// // CORS configuration
// const corsOptions = {
//   origin: "http://localhost:3000", // Allow requests from this origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
//   credentials: true, // Enable this if your frontend needs to send cookies with requests
// };

// app.use(cors(corsOptions)); // Apply CORS with the defined options
// app.use(express.json()); // Middleware to parse JSON bodies

// app.get("/", (req, res) => res.send("API Running"));

// // Define Routes
// app.use("/api/superadmins", require("./routes/superadmins"));
// app.use("/api/organizations", require("./routes/organizations"));
// app.use("/api/admins", require("./routes/admins"));
// app.use("/api/programmanagers", require("./routes/programmanagers"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config();

// Load environment variables
dotenv.config(); 

// Connect to the database
connectDB();
  ``
const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
};

app.use(cors(corsOptions));

app.use(express.json());

// Serve static files from the uploads directory add for showing pdf,  png
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/superadmins", require("./routes/superadmins"));
app.use("/api/organizations", require("./routes/organizations"));
app.use("/api/admins", require("./routes/admins"));
app.use("/api/programmanagers", require("./routes/programmanagers"));
app.use('/api/forms', require('./routes/forms')); // Include the forms route
app.use('/api/evaluationForms', require('./routes/evaluationForms'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
             