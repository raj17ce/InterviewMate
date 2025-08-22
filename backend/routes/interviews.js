const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { validateInterview, validateUpdateInterview, validateId } = require('../middleware/validation');

// Create a new interview
router.post('/', validateInterview, interviewController.createInterview);

// Get all interviews
router.get('/', interviewController.getAllInterviews);

// Get today's interviews
router.get('/today', interviewController.getTodaysInterviews);

// Get upcoming interviews (next 7 days)
router.get('/upcoming', interviewController.getUpcomingInterviews);

// Get interviews by date range
router.get('/date-range', interviewController.getInterviewsByDateRange);

// Get interviews by status
router.get('/status/:status', interviewController.getInterviewsByStatus);

// Get interviews by interviewee
router.get('/interviewee/:interviewee', interviewController.getInterviewsByInterviewee);

// Get interviews by technology
router.get('/technology/:technology', interviewController.getInterviewsByTechnology);

// Get interview by interview ID (custom ID)
router.get('/interview-id/:interviewId', interviewController.getInterviewByInterviewId);

// Get interview by ID
router.get('/:id', validateId, interviewController.getInterviewById);

// Update interview
router.put('/:id', validateId, validateUpdateInterview, interviewController.updateInterview);

// Delete interview
router.delete('/:id', validateId, interviewController.deleteInterview);

module.exports = router;
