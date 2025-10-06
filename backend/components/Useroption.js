const express = require("express");
const router = express.Router();
const pool = require("../pg");

// ✅ Get all options for all questions
router.get("/optionquestion", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, question_id, option_text FROM option"
    );
    res.json(result.rows);  // ✅ send options back as JSON
  } catch (err) {
    console.error("Error fetching options:", err.message);
    res.status(500).json({ error: "Failed to fetch options" });
  }
});
router.post("/submitanswers", async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body; // answers is an object { questionId: selectedOption }

    if (!userId || !quizId || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Loop through each answer and insert into user_answer
    for (const [questionId, selectedOption] of Object.entries(answers)) {
      await pool.query(
        `INSERT INTO user_answer (user_id, quiz_id, question_id, selected_option)
         VALUES ($1, $2, $3, $4)`,
        [userId, quizId, questionId, selectedOption]
      );
      // No need to provide is_correct or marks_obtained — trigger will handle it
    }

    res.json({ message: "Answers submitted successfully ✅" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
