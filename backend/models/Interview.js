const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Interview {
  static async create(interviewData) {
    const { interviewee_name, role, technologies, interview_time } = interviewData;
    const interview_id = `INT-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const query = `
      INSERT INTO interviews (interviewee_name, role, technologies, interview_id, interview_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const values = [interviewee_name, role, technologies || [], interview_id, interview_time];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT * FROM interviews 
      ORDER BY interview_time ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM interviews WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByInterviewId(interview_id) {
    const query = 'SELECT * FROM interviews WHERE interview_id = $1;';
    const result = await pool.query(query, [interview_id]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at timestamp
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE interviews 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM interviews WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByDateRange(startDate, endDate) {
    const query = `
      SELECT * FROM interviews 
      WHERE interview_time BETWEEN $1 AND $2
      ORDER BY interview_time ASC;
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  static async findByInterviewee(interviewee_name) {
    const query = `
      SELECT * FROM interviews 
      WHERE interviewee_name ILIKE $1
      ORDER BY interview_time ASC;
    `;
    const result = await pool.query(query, [`%${interviewee_name}%`]);
    return result.rows;
  }

  static async findByTechnology(technology) {
    const query = `
      SELECT * FROM interviews 
      WHERE $1 = ANY(technologies)
      ORDER BY interview_time ASC;
    `;
    const result = await pool.query(query, [technology]);
    return result.rows;
  }

  static async findByStatus(status) {
    const query = `
      SELECT * FROM interviews 
      WHERE status = $1
      ORDER BY interview_time ASC;
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
  }
}

module.exports = Interview;
