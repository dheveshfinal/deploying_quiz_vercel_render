const express = require("express");
const router = express.Router();
const pool = require("../pg");

router.get("/userquiz", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, "Status", description FROM quiz'
    );
    res.json(result.rows);  // send rows directly
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
