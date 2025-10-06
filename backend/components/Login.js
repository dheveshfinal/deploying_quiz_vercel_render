const express = require("express");
const router=express.Router();
const pool=require("../pg");
const bcrypt=require("bcrypt");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Incoming login:", email, password);

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("No user found");
      return res.json({ message: "User not found" });
    }

    const user = result.rows[0];
    console.log("Found user:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.json({
        message: "The password does not match",
        user: { id: user.id, role: user.role }
      });
    }

    console.log("Login successful");
    return res.json({
      message: "Login successful",
      user: { id: user.id, role: user.role }  // <-- always return id + role
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;