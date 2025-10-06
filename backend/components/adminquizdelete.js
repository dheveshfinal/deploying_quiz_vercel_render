const express = require("express");
const router = express.Router();
const pool = require("../pg");

// Delete quiz by ID
router.delete("/Quizdetails/:id", async (req, res) => {
  const { id } = req.params; // get id from params
  try {
    await pool.query("DELETE FROM quiz WHERE id = $1", [id]); // delete from quiz table
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error.message);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

module.exports = router;
