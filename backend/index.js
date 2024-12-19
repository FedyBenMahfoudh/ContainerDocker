const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");
const auth = require("json-server-auth");

const app = express();
app.use(cors());
app.use(express.json());

const JSON_SERVER_URL = "http://localhost:3001"; // json-server is running on port 3001
const SECRET_KEY = "your_secret_key"; // Store this key securely
const DB_FILE = path.join(__dirname, "data", "db.json");

// ---------------- JSON Server Configuration ---------------- //
const jsonApp = jsonServer.create();
const jsonRouter = jsonServer.router(DB_FILE);
const jsonMiddlewares = jsonServer.defaults();

jsonApp.db = jsonRouter.db; // Bind `json-server-auth` to the router
jsonApp.use(jsonMiddlewares);
jsonApp.use(auth);
jsonApp.use(jsonRouter);

// Start `json-server` on a different port (3001)
jsonApp.listen(3001, () => {
  console.log(`JSON Server with auth is running on port 3001`);
});

// ---------------- Helper Functions ---------------- //
function getUsers() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data).users || [];
}

function saveUsers(users) {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  const db = JSON.parse(data);
  db.users = users;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
}

// ---------------- Express Server Routes ---------------- //
app.get("/products", async (req, res) => {
  const { search } = req.query;
  let url = `${JSON_SERVER_URL}/products`;

  if (search) {
    url += `?q=${encodeURIComponent(search)}`;
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/featured_products", async (req, res) => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/featured_products`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ user, accessToken });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
  };

  users.push(newUser);
  saveUsers(users);

  const accessToken = jwt.sign(
    { id: newUser.id, email: newUser.email },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ user: newUser, accessToken });
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// ---------------- Start the Express Server ---------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
});
