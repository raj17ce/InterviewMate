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
            questions: '/api/questions',
            health: '/api/health'
        },
        documentation: {
            // Interview endpoints
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
            'Get Interviews by Interviewee': 'GET /api/interviews/interviewee/:interviewee',
            'Get Interviews by Technology': 'GET /api/interviews/technology/:technology',
            
            // Question endpoints
            'Generate Questions': 'GET /api/questions/generate?interview_id=INT-XXXXX&question_count=5',
            'Get Questions by Interview': 'GET /api/questions/interview/:interview_id',
            'Get Question by ID': 'GET /api/questions/:questionId',
            'Submit Answer': 'POST /api/questions/answer/:questionId',
            'Get Interview Stats': 'GET /api/questions/stats/:interview_id'
        },
        examples: {
            'Create Interview': {
                method: 'POST',
                url: '/api/interviews',
                body: {
                    interviewee_name: 'John Doe',
                    role: 'Full Stack Developer',
                    technologies: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
                    interview_time: '2025-08-25T14:30:00.000Z'
                }
            },
            'Generate Questions': {
                method: 'GET',
                url: '/api/questions/generate?interview_id=INT-A1B2C3D4&question_count=5'
            },
            'Submit Answer': {
                method: 'POST',
                url: '/api/questions/answer/1',
                body: {
                    answer_text: 'REST uses multiple endpoints with HTTP methods, while GraphQL uses a single endpoint...'
                }
            }
        }
    });
});

module.exports = router;
