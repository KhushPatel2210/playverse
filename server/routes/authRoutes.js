const express = require("express");
const User = require("../models/User");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    // Gmail only check on backend too
    const gmailRegex = /^[a-zA-Z0-9_.+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({ message: "Email must be a valid @gmail.com address" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "User with same email or username already exists" });
    }

    const user = new User({ username, email, password, role: "partner" });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Partner login
router.post("/partner/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({ message: "Login successful", username: user.username });
  } catch (err) {
    console.error("Partner login error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// List partners (admin only)
router.get("/partners", verifyAdmin, async (req, res) => {
  try {
    const partners = await User.find({ role: "partner" });
    res.json({ total: partners.length, partners });
  } catch (err) {
    console.error("List partners error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update partner (admin only)
router.put("/partners/:id", verifyAdmin, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const update = {};
    if (username) update.username = username;
    if (email) update.email = email;
    if (password) update.password = password;

    const updated = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Updated", user: { id: updated.id, username: updated.username, email: updated.email } });
  } catch (err) {
    console.error("Update partner error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete partner (admin only)
router.delete("/partners/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete partner error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


