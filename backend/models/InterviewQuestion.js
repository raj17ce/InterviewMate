const pool = require('../config/database');

class InterviewQuestion {
  // Generate and store questions for an interview
  static async generateQuestions(interviewId, role, technologies = [], questionCount = 5) {
    try {
      const questions = this.getQuestionsByRoleAndTech(role, technologies, questionCount);
      const createdQuestions = [];

      for (const question of questions) {
        const query = `
          INSERT INTO interview_questions (interview_id, question_text, question_type, difficulty_level, expected_answer)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        
        const values = [
          interviewId,
          question.text,
          question.type,
          question.difficulty,
          question.expectedAnswer
        ];

        const result = await pool.query(query, values);
        createdQuestions.push(result.rows[0]);
      }

      return createdQuestions;
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

  // Generate questions based on role and technologies
  static getQuestionsByRoleAndTech(role, technologies = [], count = 5) {
    const questionBank = {
      'Full Stack Developer': [
        {
          text: 'Explain the difference between REST and GraphQL APIs.',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'REST uses multiple endpoints with HTTP methods, while GraphQL uses a single endpoint with flexible queries. GraphQL allows clients to request specific data, reducing over-fetching.',
          technologies: ['API', 'REST', 'GraphQL']
        },
        {
          text: 'What is the difference between SQL and NoSQL databases?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'SQL databases are relational with structured schemas, ACID compliance. NoSQL databases are non-relational, flexible schemas, better for horizontal scaling.',
          technologies: ['Database', 'SQL', 'NoSQL', 'PostgreSQL', 'MongoDB']
        },
        {
          text: 'Explain the concept of closures in JavaScript.',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'A closure is a function that has access to variables in its outer scope even after the outer function has returned. It creates a persistent scope.',
          technologies: ['JavaScript']
        },
        {
          text: 'How would you optimize a slow-loading web application?',
          type: 'problem-solving',
          difficulty: 'medium',
          expectedAnswer: 'Code splitting, lazy loading, image optimization, caching, CDN usage, minification, database query optimization, and performance monitoring.',
          technologies: ['Performance', 'React', 'JavaScript', 'CSS']
        },
        {
          text: 'Describe your experience with version control systems.',
          type: 'experience',
          difficulty: 'easy',
          expectedAnswer: 'Experience with Git, branching strategies, merge conflicts resolution, pull requests, and collaborative development workflows.',
          technologies: ['Git', 'GitHub']
        },
        {
          text: 'Explain React component lifecycle methods.',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Lifecycle methods like componentDidMount, componentDidUpdate, componentWillUnmount control component behavior during mounting, updating, and unmounting phases.',
          technologies: ['React', 'JavaScript']
        },
        {
          text: 'What is Node.js and how does it work?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Node.js is a JavaScript runtime built on Chrome V8 engine. It uses event-driven, non-blocking I/O model making it efficient for scalable network applications.',
          technologies: ['Node.js', 'JavaScript']
        },
        {
          text: 'Explain database indexing and its importance.',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Database indexing creates data structures to speed up query performance by avoiding full table scans, but increases storage and write overhead.',
          technologies: ['Database', 'PostgreSQL', 'SQL']
        }
      ],
      'Frontend Developer': [
        {
          text: 'What are React Hooks and why are they useful?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Hooks allow functional components to use state and lifecycle methods. They promote code reuse and make components more readable.',
          technologies: ['React', 'JavaScript']
        },
        {
          text: 'Explain the CSS Box Model.',
          type: 'technical',
          difficulty: 'easy',
          expectedAnswer: 'The box model consists of content, padding, border, and margin. It determines how elements are sized and spaced.',
          technologies: ['CSS', 'HTML']
        },
        {
          text: 'How do you ensure cross-browser compatibility?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Use CSS prefixes, polyfills, feature detection, testing across browsers, and following web standards.',
          technologies: ['CSS', 'JavaScript', 'HTML']
        },
        {
          text: 'What is the Virtual DOM in React?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Virtual DOM is a JavaScript representation of the real DOM. React uses it to efficiently update the UI by comparing changes.',
          technologies: ['React', 'JavaScript']
        },
        {
          text: 'How do you optimize website performance?',
          type: 'problem-solving',
          difficulty: 'medium',
          expectedAnswer: 'Image optimization, code splitting, lazy loading, caching, minification, CDN usage, and reducing HTTP requests.',
          technologies: ['Performance', 'JavaScript', 'CSS']
        },
        {
          text: 'Explain CSS Flexbox and Grid.',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Flexbox is for one-dimensional layouts, Grid is for two-dimensional layouts. Both provide powerful layout capabilities.',
          technologies: ['CSS', 'HTML']
        },
        {
          text: 'What is TypeScript and its benefits?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'TypeScript adds static typing to JavaScript, providing better IDE support, early error detection, and improved code maintainability.',
          technologies: ['TypeScript', 'JavaScript']
        }
      ],
      'Backend Developer': [
        {
          text: 'Explain the difference between authentication and authorization.',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Authentication verifies who you are (login), authorization determines what you can access (permissions).',
          technologies: ['Security', 'API']
        },
        {
          text: 'What is database indexing and why is it important?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Indexing creates data structures to speed up query performance by avoiding full table scans, but increases storage and write overhead.',
          technologies: ['Database', 'PostgreSQL', 'SQL']
        },
        {
          text: 'How do you handle errors in a REST API?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Use appropriate HTTP status codes, consistent error response format, logging, and graceful error handling with try-catch blocks.',
          technologies: ['API', 'REST', 'Node.js']
        },
        {
          text: 'Explain microservices architecture.',
          type: 'technical',
          difficulty: 'hard',
          expectedAnswer: 'Microservices break applications into small, independent services that communicate via APIs, enabling scalability and technology diversity.',
          technologies: ['Architecture', 'API']
        },
        {
          text: 'How do you ensure API security?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Use HTTPS, authentication tokens, input validation, rate limiting, CORS configuration, and security headers.',
          technologies: ['Security', 'API', 'Node.js']
        },
        {
          text: 'What is Docker and containerization?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Docker packages applications with dependencies into containers, ensuring consistent environments across development and production.',
          technologies: ['Docker', 'DevOps']
        }
      ],
      'Data Scientist': [
        {
          text: 'Explain the difference between supervised and unsupervised learning.',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Supervised learning uses labeled data to predict outcomes, unsupervised learning finds patterns in unlabeled data.',
          technologies: ['Machine Learning', 'Python']
        },
        {
          text: 'What is overfitting and how do you prevent it?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Overfitting occurs when a model learns training data too well. Prevent with cross-validation, regularization, and more training data.',
          technologies: ['Machine Learning', 'Python']
        },
        {
          text: 'Explain the concept of feature engineering.',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Feature engineering involves creating, selecting, and transforming variables to improve model performance and interpretability.',
          technologies: ['Machine Learning', 'Python', 'Data Analysis']
        },
        {
          text: 'How do you handle missing data in datasets?',
          type: 'problem-solving',
          difficulty: 'medium',
          expectedAnswer: 'Methods include deletion, imputation (mean, median, mode), interpolation, or using algorithms that handle missing values.',
          technologies: ['Data Analysis', 'Python', 'Pandas']
        },
        {
          text: 'What metrics do you use to evaluate classification models?',
          type: 'technical',
          difficulty: 'medium',
          expectedAnswer: 'Accuracy, precision, recall, F1-score, ROC-AUC, confusion matrix, depending on the problem and class distribution.',
          technologies: ['Machine Learning', 'Python']
        }
      ]
    };

    let roleQuestions = questionBank[role] || questionBank['Full Stack Developer'];
    
    // Filter questions based on technologies if provided
    if (technologies && technologies.length > 0) {
      const techLower = technologies.map(tech => tech.toLowerCase());
      roleQuestions = roleQuestions.filter(question => 
        question.technologies.some(qTech => 
          techLower.some(tech => qTech.toLowerCase().includes(tech) || tech.includes(qTech.toLowerCase()))
        )
      );
      
      // If no tech-specific questions found, fall back to general questions
      if (roleQuestions.length === 0) {
        roleQuestions = questionBank[role] || questionBank['Full Stack Developer'];
      }
    }

    return roleQuestions.slice(0, count);
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
