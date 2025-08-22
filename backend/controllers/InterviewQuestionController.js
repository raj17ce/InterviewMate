const InterviewQuestion = require('../models/InterviewQuestion');
const Interview = require('../models/Interview');

// Generate questions for an interview
const generateQuestions = async (req, res, next) => {
  try {
    const { interview_id, question_count = 5 } = req.query;

    if (!interview_id) {
      return res.status(400).json({
        success: false,
        message: 'Interview ID is required'
      });
    }

    // Check if interview exists
    const interview = await Interview.findByInterviewId(interview_id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check if questions already exist for this interview
    const existingQuestions = await InterviewQuestion.getByInterviewId(interview_id);
    if (existingQuestions.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Questions already generated for this interview',
        data: existingQuestions
      });
    }

    // Generate new questions based on role and technologies
    const questions = await InterviewQuestion.generateQuestions(
      interview_id, 
      interview.role, 
      interview.technologies || [],
      parseInt(question_count)
    );

    res.status(201).json({
      success: true,
      message: 'Questions generated successfully',
      data: questions
    });
  } catch (error) {
    next(error);
  }
};

// Get questions for an interview
const getQuestionsByInterview = async (req, res, next) => {
  try {
    const { interview_id } = req.params;

    const questions = await InterviewQuestion.getByInterviewId(interview_id);

    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    next(error);
  }
};

// Submit answer for a question
const submitAnswer = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { answer_text } = req.body;

    if (!answer_text || answer_text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answer text is required'
      });
    }

    const updatedQuestion = await InterviewQuestion.submitAnswer(questionId, answer_text);

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      data: updatedQuestion
    });
  } catch (error) {
    if (error.message === 'Question not found') {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    next(error);
  }
};

// Get interview statistics
const getInterviewStats = async (req, res, next) => {
  try {
    const { interview_id } = req.params;

    const stats = await InterviewQuestion.getInterviewStats(interview_id);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get specific question by ID
const getQuestionById = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const question = await InterviewQuestion.getById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQuestions,
  getQuestionsByInterview,
  submitAnswer,
  getInterviewStats,
  getQuestionById
};
