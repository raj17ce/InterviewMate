const pool = require('../config/database');
const { getQuestionPrompt } = require('../utils/prompts');

// Import fetch for Node.js compatibility
let fetch;
(async () => {
  if (typeof globalThis.fetch === 'undefined') {
    try {
      const { default: nodeFetch } = await import('node-fetch');
      fetch = nodeFetch;
    } catch (error) {
      console.warn('node-fetch not available, using global fetch');
      fetch = globalThis.fetch;
    }
  } else {
    fetch = globalThis.fetch;
  }
})();

class InterviewQuestion {
  // Generate and store a single question for an interview
  static async generateQuestions(interviewId, role, technologies = []) {
    try {
      // Determine the primary technology to focus on
      const primaryTech = technologies.length > 0 ? technologies[0] : role;
      
      // Get the last question from database for this interview
      const existingQuestions = await this.getByInterviewId(interviewId);
      const lastQuestion = existingQuestions.length > 0 ? existingQuestions[existingQuestions.length - 1] : null;
      const lastQuestionText = lastQuestion ? lastQuestion.question_text : "";
      const currentQuestionNumber = existingQuestions.length + 1;
      
      // Generate prompt using utility function with context
      const prompt = getQuestionPrompt(currentQuestionNumber, 5, lastQuestionText, primaryTech);

      try {
        // Call LLM API
        const response = await fetch("http://10.40.1.148:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama3.1:latest",
            prompt: prompt,
            stream: false
          })
        });

        if (!response.ok) {
          throw new Error(`LLM API error: ${response.status}`);
        }

        const data = await response.json();
        let questionText = data.response.trim();
        
        // Clean up the response - remove any extra formatting
        questionText = questionText.replace(/^(Question:|Q:|Answer:|A:|\d+\.|\-)/i, '').trim();
        
        // Ensure it ends with a question mark
        if (!questionText.endsWith('?')) {
          questionText += '?';
        }

        // Insert only interview_id and question_text into database
        const query = `
          INSERT INTO interview_questions (interview_id, question_text)
          VALUES ($1, $2)
          RETURNING id, interview_id, question_text, created_at
        `;
        
        const values = [interviewId, questionText];
        const result = await pool.query(query, values);
        return result.rows[0];

      } catch (error) {
        console.error(`Error generating question with LLM:`, error);
        
        // Fallback question if LLM fails
        const questionNumber = existingQuestions.length + 1;
        const fallbackQuestion = `Tell me about your experience with ${primaryTech} and how you approach solving problems with it (Question ${questionNumber})?`;
        
        const query = `
          INSERT INTO interview_questions (interview_id, question_text)
          VALUES ($1, $2)
          RETURNING id, interview_id, question_text, created_at
        `;
        
        const values = [interviewId, fallbackQuestion];
        const result = await pool.query(query, values);
        return result.rows[0];
      }
    } catch (error) {
      throw error;
    }
  }

  // Get questions by interview ID
  static async getByInterviewId(interviewId) {
    try {
      const query = `
        SELECT * FROM interview_questions 
        WHERE interview_id = $1 
        ORDER BY created_at ASC
      `;
      const result = await pool.query(query, [interviewId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a specific question by ID
  static async getById(questionId) {
    try {
      const query = 'SELECT * FROM interview_questions WHERE id = $1';
      const result = await pool.query(query, [questionId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Submit answer for a question
  static async submitAnswer(questionId, answerText) {
    try {
      // Get the question first
      const question = await this.getById(questionId);
      if (!question) {
        throw new Error('Question not found');
      }

      // Generate score based on answer
      const score = this.calculateScore(question.question_text, question.expected_answer, answerText);
      const feedback = this.generateFeedback(score, question.expected_answer, answerText);

      const query = `
        UPDATE interview_questions 
        SET answer_text = $1, score = $2, feedback = $3, answered_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
      `;

      const values = [answerText, score, feedback, questionId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get interview statistics
  static async getInterviewStats(interviewId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_questions,
          COUNT(answer_text) as answered_questions,
          ROUND(AVG(score), 2) as average_score,
          MAX(score) as highest_score,
          MIN(score) as lowest_score
        FROM interview_questions 
        WHERE interview_id = $1
      `;
      const result = await pool.query(query, [interviewId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Simple scoring algorithm
  static calculateScore(question, expectedAnswer, userAnswer) {
    if (!userAnswer || userAnswer.trim().length === 0) {
      return 0;
    }

    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const expectedWords = expectedAnswer.toLowerCase().split(/\s+/);
    
    // Calculate keyword overlap
    const commonWords = userWords.filter(word => 
      expectedWords.some(expectedWord => 
        expectedWord.includes(word) || word.includes(expectedWord)
      )
    );

    // Basic scoring: length + keyword overlap
    const lengthScore = Math.min(userAnswer.length / 100, 3); // Max 3 points for length
    const keywordScore = (commonWords.length / expectedWords.length) * 7; // Max 7 points for keywords
    
    return Math.min(Math.round(lengthScore + keywordScore), 10);
  }

  // Generate feedback based on score
  static generateFeedback(score, expectedAnswer, userAnswer) {
    if (score >= 8) {
      return 'Excellent answer! You demonstrated strong understanding of the concept.';
    } else if (score >= 6) {
      return 'Good answer! You covered most key points. Consider elaborating on some aspects.';
    } else if (score >= 4) {
      return 'Fair answer. You touched on some important points but missed several key concepts.';
    } else if (score >= 2) {
      return 'Basic answer. Consider reviewing the topic and providing more detailed explanations.';
    } else {
      return 'Incomplete answer. Please provide more comprehensive response covering the key concepts.';
    }
  }
}

module.exports = InterviewQuestion;
