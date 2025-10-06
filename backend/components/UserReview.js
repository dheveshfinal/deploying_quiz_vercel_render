const express = require("express");
const router = express.Router();
const pool = require("../pg"); // PostgreSQL connection

router.get("/viewusers/:quizId", async (req, res) => {
  try {
    let { quizId } = req.params;
    quizId = parseInt(quizId, 10);
    if (isNaN(quizId)) return res.status(400).json({ error: "Invalid quizId" });

    // Get total possible marks for this quiz
    const totalQuery = await pool.query(
      `SELECT SUM(marks_obtained) AS total_marks
       FROM user_answer
       WHERE quiz_id = $1`,
      [quizId]
    );
    const totalMarks = totalQuery.rows[0].total_marks || 0;

    // Get all users who attempted this quiz
    const usersQuery = await pool.query(
      `SELECT u.id AS user_id,
              u.username,
              u.email,
              r.total_score
       FROM result r
       JOIN users u ON u.id = r.user_id
       WHERE r.quiz_id = $1
       ORDER BY r.total_score DESC`,
      [quizId]
    );

    if (usersQuery.rows.length === 0) {
      return res.status(404).json({ error: "No users attempted this quiz" });
    }

    // Map users with total marks info
    const users = usersQuery.rows.map((u) => ({
      ...u,
      total_marks: totalMarks,
    }));

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
