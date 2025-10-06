const express = require("express");
const router = express.Router();
const pool = require("../pg");

// Update quiz by ID
router.put("/Quizdetails/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, Status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE quiz SET title = $1, description = $2, "Status" = $3 WHERE id = $4 RETURNING *',
      [title, description, Status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz updated successfully", quiz: result.rows[0] });
  } catch (error) {
    console.error("Error updating quiz:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});


module.exports = router;
