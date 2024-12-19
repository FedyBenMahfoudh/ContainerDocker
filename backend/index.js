const express = require("express");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
app.use(bodyParser.json());
app.use(cors());

// OR restrict to your frontend's origin
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB error connection :" + error);
  }
};

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Secret key for JWT
const secretKey = "security_key";

// Function to generate JWT
const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || secretKey, {
    expiresIn: "7d",
  });
  return token;
};
// Register route
app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email Already Exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt
      const token = generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        token,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup controller Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("login controller Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    sessionStorage.setItem("token", "");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("logout controller Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ---------------- Express Server Routes ---------------- //
const JSON_SERVER_URL = "https://dummyjson.com"; // Or the URL of your JSON server

app.get("/products", async (req, res) => {
  const { search } = req.query;
  let url = `${JSON_SERVER_URL}/products`;

  if (search) {
    url += `/search?q=${decodeURIComponent(search)}`; // Fix query parameter
  }

  try {
    const response = await axios.get(url);
    console.log(response.data);
    res.json(response.data); // Directly send the data
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/featured_products", async (req, res) => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/products?limit=3`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const url = `${JSON_SERVER_URL}/products/${id}`;

  try {
    const response = await axios.get(url); // Get the product by ID
    res.json(response.data); // Send back the product data
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ---------------- Start the Express Server ---------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
  connectDB();
});
