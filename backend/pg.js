// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",     // your DB username
//   host: "localhost",
//   database: "quize",    // your database name
//   password: "12345",    // your DB password
//   port: 5432,           // default postgres port
// });

// module.exports = pool;
// model.js
const { Pool } = require("pg");

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render provides this automatically
  ssl: { rejectUnauthorized: false },
});

// Create tables and triggers
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log("📦 Initializing database...");

    // Run SQL schema setup
    await client.query(`
      -- USERS TABLE
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE,
          role VARCHAR(50) DEFAULT 'user'
      );

      -- QUIZ TABLE
      CREATE TABLE IF NOT EXISTS quiz (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- QUESTION TABLE
      CREATE TABLE IF NOT EXISTS question (
          id SERIAL PRIMARY KEY,
          quiz_id INT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
          question_text TEXT NOT NULL,
          question_type VARCHAR(50),
          marks INT,
          correct_answer TEXT
      );

      -- QUIZ_OPTION TABLE
      CREATE TABLE IF NOT EXISTS quiz_option (
          id SERIAL PRIMARY KEY,
          question_id INT REFERENCES question(id) ON DELETE CASCADE,
          option_text TEXT NOT NULL
      );

      -- RESULT TABLE
      CREATE TABLE IF NOT EXISTS result (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          quiz_id INT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
          total_score INT DEFAULT 0,
          submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, quiz_id)
      );

      -- USER_ANSWER TABLE
      CREATE TABLE IF NOT EXISTS user_answer (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          quiz_id INT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
          question_id INT NOT NULL REFERENCES question(id) ON DELETE CASCADE,
          selected_option TEXT,
          is_correct BOOLEAN NOT NULL,
          marks_obtained INT DEFAULT 0,
          UNIQUE(user_id, quiz_id, question_id)
      );

      -- FUNCTION: CALCULATE MARKS
      CREATE OR REPLACE FUNCTION calculate_marks()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        correct_answer_var TEXT;
        marks_var INT;
      BEGIN
        SELECT correct_answer, marks
        INTO correct_answer_var, marks_var
        FROM question
        WHERE id = NEW.question_id;

        IF NEW.selected_option = correct_answer_var THEN
          NEW.is_correct := TRUE;
          NEW.marks_obtained := marks_var;
        ELSE
          NEW.is_correct := FALSE;
          NEW.marks_obtained := 0;
        END IF;

        RETURN NEW;
      END;
      $$;

      DROP TRIGGER IF EXISTS trg_calculate_marks ON user_answer;
      CREATE TRIGGER trg_calculate_marks
      BEFORE INSERT ON user_answer
      FOR EACH ROW
      EXECUTE FUNCTION calculate_marks();

      -- FUNCTION: UPDATE TOTAL SCORE
      CREATE OR REPLACE FUNCTION update_total_score()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      BEGIN
          IF EXISTS (
              SELECT 1 FROM result
              WHERE user_id = NEW.user_id AND quiz_id = NEW.quiz_id
          ) THEN
              UPDATE result
              SET total_score = (
                  SELECT SUM(marks_obtained)
                  FROM user_answer
                  WHERE user_id = NEW.user_id AND quiz_id = NEW.quiz_id
              ),
              submitted_at = NOW()
              WHERE user_id = NEW.user_id AND quiz_id = NEW.quiz_id;
          ELSE
              INSERT INTO result (user_id, quiz_id, total_score, submitted_at)
              VALUES (
                  NEW.user_id,
                  NEW.quiz_id,
                  (SELECT SUM(marks_obtained)
                   FROM user_answer
                   WHERE user_id = NEW.user_id AND quiz_id = NEW.quiz_id),
                  NOW()
              );
          END IF;
          RETURN NEW;
      END;
      $$;

      DROP TRIGGER IF EXISTS trg_update_total_score ON user_answer;
      CREATE TRIGGER trg_update_total_score
      AFTER INSERT ON user_answer
      FOR EACH ROW
      EXECUTE FUNCTION update_total_score();
    `);

    // ✅ Ensure an admin user exists
    const adminUsername = "don";
    const adminPassword = "12"; // You can hash this in production
    const adminEmail = "don@gmail.com";

    await client.query(
      `INSERT INTO users (username, password, email, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (username) DO NOTHING;`,
      [adminUsername, adminPassword, adminEmail]
    );

    console.log("✅ Database initialized and admin user ensured.");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };