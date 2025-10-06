// components/Userresult.js (backend)
const express = require("express");
const router = express.Router();
const pool = require("../pg"); // your DB connection

// Get user result with total possible marks
router.get("/userresult/:userId/:quizId", async (req, res) => {
  const { userId, quizId } = req.params;
  try {
    const resultQuery = await pool.query(
      `SELECT u.username AS user_name, 
       q.title AS quiz_title, 
       q.description AS quiz_description,
       r.total_score, 
       r.submitted_at,
       (SELECT SUM(marks) 
        FROM question 
        WHERE quiz_id = $2) AS total_marks,
       (SELECT ARRAY_AGG(id) 
        FROM question 
        WHERE quiz_id = $2) AS question_ids
       FROM result r
       JOIN users u ON u.id = r.user_id
       JOIN quiz q ON q.id = r.quiz_id
       WHERE r.user_id = $1 AND r.quiz_id = $2`,
      [userId, quizId]
    );

    if (resultQuery.rows.length === 0) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(resultQuery.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.delete("/userresult/:userId/:quizId", async (req, res) => {
  const { userId, quizId } = req.params;

  try {
    // Begin transaction
    await pool.query("BEGIN");

    // Delete from user_answer
    await pool.query(
      "DELETE FROM user_answer WHERE user_id = $1 AND quiz_id = $2",
      [userId, quizId]
    );

    // Delete from result and return the deleted row
    const deleteResult = await pool.query(
      "DELETE FROM result WHERE user_id = $1 AND quiz_id = $2 RETURNING *",
      [userId, quizId]
    );

    if (deleteResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Result not found" });
    }

    // Commit transaction
    await pool.query("COMMIT");

    res.json({ message: "Previous result and answers deleted successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
