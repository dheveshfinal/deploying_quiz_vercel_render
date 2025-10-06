const express = require("express");
const router = express.Router();
const pool = require("../pg");

// Insert quiz data
router.get("/Quizdetails", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM quiz ORDER BY id ASC");
    res.json({ quizdetails: result.rows });
  } catch (e) {
    console.error("Error fetching quizzes:", e.message);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

module.exports = router;


