// routes/reviewanswer.js
const express = require("express");
const router = express.Router();
const pool = require("../pg"); // DB connection

// Get all answered questions for a quiz by user
router.get("/reviewanswer/:userId/:quizId", async (req, res) => {
  const { userId, quizId } = req.params;
  try {
    const query = await pool.query(
      `SELECT q.id AS question_id,
              q.question_text,
              q.marks,
              q.correct_answer,
              ua.selected_option,
              ua.is_correct,
              ua.marks_obtained
       FROM user_answer ua
       JOIN question q ON q.id = ua.question_id
       WHERE ua.user_id = $1 AND ua.quiz_id = $2`,
      [userId, quizId]
    );

    if (query.rows.length === 0) {
      return res.status(404).json({ message: "No answers found" });
    }

    res.json(query.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
