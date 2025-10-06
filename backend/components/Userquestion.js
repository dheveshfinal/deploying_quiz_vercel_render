const express = require("express");
const router = express.Router();
const pool = require("../pg"); // adjust path to your pg connection

// Get questions for a quiz
router.get("/userquestion/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    const result = await pool.query(
      "SELECT id, question_text, marks FROM question WHERE quiz_id = $1",
      [quizId]
    );

    res.json(result.rows); // send rows as JSON
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
