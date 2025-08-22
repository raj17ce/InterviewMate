const { Pool } = require('pg');
require('dotenv').config();

// Create a connection to the specific database
const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function resetDatabase() {
  try {
    console.log('Dropping existing tables...');
    
    // Drop tables in correct order (questions first due to foreign key)
    await dbPool.query('DROP TABLE IF EXISTS interview_questions CASCADE;');
    console.log('Dropped interview_questions table');
    
    await dbPool.query('DROP TABLE IF EXISTS interviews CASCADE;');
    console.log('Dropped interviews table');

    // Recreate interviews table with technologies column
    console.log('Creating interviews table with technologies...');
    const createInterviewsTableQuery = `
      CREATE TABLE interviews (
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

    // Recreate interview_questions table
    console.log('Creating interview_questions table...');
    const createQuestionsTableQuery = `
      CREATE TABLE interview_questions (
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

    // Create indexes
    await dbPool.query('CREATE INDEX idx_interview_id ON interviews(interview_id);');
    await dbPool.query('CREATE INDEX idx_interview_time ON interviews(interview_time);');
    await dbPool.query('CREATE INDEX idx_questions_interview_id ON interview_questions(interview_id);');
    await dbPool.query('CREATE INDEX idx_questions_answered_at ON interview_questions(answered_at);');
    
    console.log('All indexes created successfully');
    console.log('Database reset completed successfully!');
    
  } catch (error) {
    console.error('Error resetting database:', error.message);
  } finally {
    await dbPool.end();
  }
}

resetDatabase();
