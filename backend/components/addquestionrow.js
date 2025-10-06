const express = require("express");
const router = express.Router();
const pool = require("../pg"); // your PG pool

// Add question row with options, quiz_id from path
router.post("/addquestionrow/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params; // matches :quizId in path
    const quizIdInt = parseInt(quizId, 10); // convert to integer

    if (isNaN(quizIdInt)) {
      return res.status(400).json({ error: "Invalid quizId" });
    }

    const { question_text, question_type, marks, correct_answer, options } = req.body;

    // 1️⃣ Insert into question table with quiz_idInt
    const questionResult = await pool.query(
      `INSERT INTO question (quiz_id, question_text, question_type, marks, correct_answer)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [quizIdInt, question_text, question_type, marks, correct_answer]
    );

    const questionId = questionResult.rows[0].id;

    // 2️⃣ Insert options if MCQ or MSQ
    if ((question_type === "MCQ" || question_type === "MSQ") && options) {
      const optionQueries = options.map((opt) =>
        pool.query(
          `INSERT INTO option (question_id, option_text) VALUES ($1, $2)`,
          [questionId, opt]
        )
      );
      await Promise.all(optionQueries);
    }

    res.json({ message: "Question added successfully", question_id: questionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
