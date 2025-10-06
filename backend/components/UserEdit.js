const express = require("express");
const router = express.Router();
const pool = require("../pg"); // adjust path to your pg connection

// Update user
router.put("/userdetails/:id", async (req, res) => {
  try {
    const { id } = req.params; // get id from URL
    const { username, email, role } = req.body; // destructure body

    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING *",
      [username, email, role, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
