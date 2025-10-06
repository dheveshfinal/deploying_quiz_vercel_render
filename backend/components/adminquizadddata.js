const express = require("express");
const router = express.Router();
const pool = require("../pg");

// Add a new quiz
router.post("/AddData", async (req, res) => {
  const { title, description, Status } = req.body;

  try {
    // Correct SQL syntax: use $1, $2, $3 for parameterized query
    const result = await pool.query(
      'INSERT INTO quiz(title, description, "Status") VALUES ($1, $2, $3) RETURNING *',
      [title, description, Status]
    );

    // Send JSON response with inserted quiz
    res.json({ message: "Quiz added successfully", quiz: result.rows[0] });
  } catch (error) {
    console.error("Error adding quiz:", error.message);
    res.status(500).json({ error: "Failed to add quiz" });
  }
});

module.exports = router;
