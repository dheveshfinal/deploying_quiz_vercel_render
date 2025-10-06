const express = require("express");
const router = express.Router();  // <-- Capital R
const pool = require("../pg");    // adjust path if needed

// Get all users
router.get("/userdetails", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id,username, email, role FROM users"
    );

    res.json(result.rows);  // send back array of users
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/usernames/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]); // { username: "John" }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
