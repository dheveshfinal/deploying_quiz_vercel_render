const express = require("express");
const router = express.Router();
const pool = require("../pg");

// Get options for a question
router.get("/adminoptions/:id", async (req, res) => {
  try {
    const { id } = req.params; // extract id
    const result = await pool.query(
      "SELECT * FROM option WHERE question_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No options found for this question." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/adminoptions/:optionId", async (req, res) => {
  try {
    const { optionId } = req.params;
    const { option_text } = req.body;

    const result = await pool.query(
      "UPDATE option SET option_text = $1 WHERE id = $2 RETURNING *",
      [option_text, optionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Option not found" });
    }

    res.json(result.rows[0]); // return updated option
  } catch (error) {
    console.error("Error updating option:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/adminoptions/:optionId", async (req, res) => {
  try {
    const { optionId } = req.params;

    const result = await pool.query(
      "DELETE FROM option WHERE id = $1 RETURNING *",
      [optionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Option not found" });
    }

    res.json({ message: "Option deleted successfully", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting option:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/adminoptions", async (req, res) => {
  try {
    const { option_text, question_id } = req.body;

    const result = await pool.query(
      "INSERT INTO option (option_text, question_id) VALUES ($1, $2) RETURNING *",
      [option_text, question_id]
    );

    res.status(201).json(result.rows[0]); // return the inserted option
  } catch (error) {
    console.error("Error inserting option:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
