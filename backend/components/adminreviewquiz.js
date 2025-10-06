const express = require("express");
const router = express.Router();
const pool = require("../pg");

router.get("/reviewquiz", async (req, res) => {
  try {
    const result = await pool.query("SELECT id,title, description FROM quiz");
    const review = result.rows; // this is already an array of rows

    res.json(review); // send rows as JSON array
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
