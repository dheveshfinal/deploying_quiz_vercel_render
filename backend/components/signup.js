const express = require("express");
const router = express.Router(); // <-- create router
const pool = require("../pg");   // correct path to pg.js
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    const { Name, email, password,role } = req.body;

    // Check if username/email exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [Name, email]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Username or email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (username, password, email,role) VALUES ($1, $2, $3,$4) RETURNING *",
      [Name, hashedPassword, email,role]
    );

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
