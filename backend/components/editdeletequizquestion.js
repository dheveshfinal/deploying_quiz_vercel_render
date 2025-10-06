const express = require("express");
const router = express.Router();
const pool = require("../pg");

// Update a question by ID
router.put("/question/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quiz_id, question_text, question_type, marks, correct_answer } = req.body;

    const result = await pool.query(
      `UPDATE question 
       SET quiz_id = $1, 
           question_text = $2, 
           question_type = $3, 
           marks = $4, 
           correct_answer = $5
       WHERE id = $6
       RETURNING *`,
      [quiz_id, question_text, question_type, marks, correct_answer, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated successfully", question: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a question by ID
router.delete("/question/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM question WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully", deletedQuestion: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
