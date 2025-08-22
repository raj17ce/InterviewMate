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
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        interviewee_name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        interview_id VARCHAR(50) UNIQUE NOT NULL,
        interview_time TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await dbPool.query(createTableQuery);
    console.log('Interviews table created successfully');

    // Create index on interview_id for faster lookups
    await dbPool.query('CREATE INDEX IF NOT EXISTS idx_interview_id ON interviews(interview_id);');
    console.log('Index created on interview_id');

    // Create index on interview_time for faster date queries
    await dbPool.query('CREATE INDEX IF NOT EXISTS idx_interview_time ON interviews(interview_time);');
    console.log('Index created on interview_time');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error.message);
  } finally {
    await adminPool.end();
    await dbPool.end();
  }
}

setupDatabase();
