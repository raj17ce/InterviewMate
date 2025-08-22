const { Pool } = require('pg');
require('dotenv').config();

// Create a connection to PostgreSQL without specifying database
const adminPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Create a connection to the specific database
const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupDatabase() {
  try {
    // Create database if it doesn't exist
    console.log('Creating database if it doesn\'t exist...');
    await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Database '${process.env.DB_NAME}' created successfully`);
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`Database '${process.env.DB_NAME}' already exists`);
    } else {
      console.error('Error creating database:', error.message);
    }
  }

  try {
    // Create interviews table
    console.log('Creating interviews table...');
    const createInterviewsTableQuery = `
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        interviewee_name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        technologies TEXT[], 
        interview_id VARCHAR(50) UNIQUE NOT NULL,
        interview_time TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await dbPool.query(createInterviewsTableQuery);
    console.log('Interviews table created successfully');

    // Create interview_questions table
    console.log('Creating interview_questions table...');
    const createQuestionsTableQuery = `
      CREATE TABLE IF NOT EXISTS interview_questions (
        id SERIAL PRIMARY KEY,
        interview_id VARCHAR(50) NOT NULL,
        question_text TEXT NOT NULL,
        question_type VARCHAR(100) DEFAULT 'technical',
        difficulty_level VARCHAR(50) DEFAULT 'medium',
        expected_answer TEXT,
        answer_text TEXT,
        score INTEGER CHECK (score >= 0 AND score <= 10),
        feedback TEXT,
        answered_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (interview_id) REFERENCES interviews(interview_id) ON DELETE CASCADE
      );
    `;
    
    await dbPool.query(createQuestionsTableQuery);
    console.log('Interview questions table created successfully');

    // Create indexes for interviews table
    await dbPool.query('CREATE INDEX IF NOT EXISTS idx_interview_id ON interviews(interview_id);');
    console.log('Index created on interviews.interview_id');

    await dbPool.query('CREATE INDEX IF NOT EXISTS idx_interview_time ON interviews(interview_time);');
    console.log('Index created on interviews.interview_time');

    // Create indexes for interview_questions table
    await dbPool.query('CREATE INDEX IF NOT EXISTS idx_questions_interview_id ON interview_questions(interview_id);');
    console.log('Index created on interview_questions.interview_id');

    await dbPool.query('CREATE INDEX IF NOT EXISTS idx_questions_answered_at ON interview_questions(answered_at);');
    console.log('Index created on interview_questions.answered_at');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error.message);
  } finally {
    await adminPool.end();
    await dbPool.end();
  }
}

setupDatabase();
