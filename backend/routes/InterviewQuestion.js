const express = require('express');
const router = express.Router();
const interviewQuestionController = require('../controllers/interviewQuestionController');
const { 
  validateGenerateQuestions, 
  validateSubmitAnswer, 
  validateQuestionId 
} = require('../middleware/questionValidation');

// Generate questions for an interview
router.get('/generate', validateGenerateQuestions, interviewQuestionController.generateQuestions);

// Get questions by interview ID
router.get('/interview/:interview_id', interviewQuestionController.getQuestionsByInterview);

// Get specific question by ID
router.get('/:questionId', validateQuestionId, interviewQuestionController.getQuestionById);

// Submit answer for a question
router.post('/answer/:questionId', validateQuestionId, validateSubmitAnswer, interviewQuestionController.submitAnswer);

// Get interview statistics
router.get('/stats/:interview_id', interviewQuestionController.getInterviewStats);

module.exports = router;
