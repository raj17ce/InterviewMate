const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'InterviewMate API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to InterviewMate API',
    version: '1.0.0',
    endpoints: {
      interviews: '/api/interviews',
      health: '/api/health'
    },
    documentation: {
      'Create Interview': 'POST /api/interviews',
      'Get All Interviews': 'GET /api/interviews',
      'Get Interview by ID': 'GET /api/interviews/:id',
      'Get Interview by Interview ID': 'GET /api/interviews/interview-id/:interviewId',
      'Update Interview': 'PUT /api/interviews/:id',
      'Delete Interview': 'DELETE /api/interviews/:id',
      'Get Today\'s Interviews': 'GET /api/interviews/today',
      'Get Upcoming Interviews': 'GET /api/interviews/upcoming',
      'Get Interviews by Date Range': 'GET /api/interviews/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD',
      'Get Interviews by Status': 'GET /api/interviews/status/:status',
      'Get Interviews by Interviewee': 'GET /api/interviews/interviewee/:interviewee'
    }
  });
});

module.exports = router;
