const express = require("express");
const router = express.Router();
const pool = require("../pg"); // PostgreSQL connection

// Get all questions for a specific quiz
router.get("/questions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM question WHERE quiz_id = $1 ORDER BY id ASC",
      [id] // use the id from URL
    );
    res.json(result.rows); // send only questions for this quiz
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
