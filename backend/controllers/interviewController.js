const Interview = require('../models/Interview');
const moment = require('moment');

const interviewController = {
  // Create a new interview
  async createInterview(req, res, next) {
    try {
      const interview = await Interview.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Interview scheduled successfully',
        data: interview
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all interviews
  async getAllInterviews(req, res, next) {
    try {
      const interviews = await Interview.findAll();
      res.json({
        success: true,
        message: 'Interviews retrieved successfully',
        data: interviews,
        count: interviews.length
      });
    } catch (error) {
      next(error);
    }
  },

  // Get interview by ID
  async getInterviewById(req, res, next) {
    try {
      const interview = await Interview.findById(req.params.id);
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
      }
      res.json({
        success: true,
        message: 'Interview retrieved successfully',
        data: interview
      });
    } catch (error) {
      next(error);
    }
  },

  // Get interview by interview ID
  async getInterviewByInterviewId(req, res, next) {
    try {
      const interview = await Interview.findByInterviewId(req.params.interviewId);
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
      }
      res.json({
        success: true,
        message: 'Interview retrieved successfully',
        data: interview
      });
    } catch (error) {
      next(error);
    }
  },

  // Update interview
  async updateInterview(req, res, next) {
    try {
      const interview = await Interview.update(req.params.id, req.body);
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
      }
      res.json({
        success: true,
        message: 'Interview updated successfully',
        data: interview
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete interview
  async deleteInterview(req, res, next) {
    try {
      const interview = await Interview.delete(req.params.id);
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
      }
      res.json({
        success: true,
        message: 'Interview deleted successfully',
        data: interview
      });
    } catch (error) {
      next(error);
    }
  },

  // Get interviews by date range
  async getInterviewsByDateRange(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Both startDate and endDate are required'
        });
      }

      const start = moment(startDate).startOf('day').toISOString();
      const end = moment(endDate).endOf('day').toISOString();

      const interviews = await Interview.findByDateRange(start, end);
      res.json({
        success: true,
        message: 'Interviews retrieved successfully',
        data: interviews,
        count: interviews.length
      });
    } catch (error) {
      next(error);
    }
  },

  // Get interviews by interviewee
  async getInterviewsByInterviewee(req, res, next) {
    try {
      const { interviewee } = req.params;
      const interviews = await Interview.findByInterviewee(interviewee);
      res.json({
        success: true,
        message: 'Interviews retrieved successfully',
        data: interviews,
        count: interviews.length
      });
    } catch (error) {
      next(error);
    }
  },

  // Get interviews by status
  async getInterviewsByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const validStatuses = ['scheduled', 'completed', 'cancelled', 'rescheduled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
        });
      }

      const interviews = await Interview.findByStatus(status);
      res.json({
        success: true,
        message: 'Interviews retrieved successfully',
        data: interviews,
        count: interviews.length
      });
    } catch (error) {
      next(error);
    }
  },

  // Get today's interviews
  async getTodaysInterviews(req, res, next) {
    try {
      const today = moment().format('YYYY-MM-DD');
      const startDate = moment(today).startOf('day').toISOString();
      const endDate = moment(today).endOf('day').toISOString();

      const interviews = await Interview.findByDateRange(startDate, endDate);
      res.json({
        success: true,
        message: 'Today\'s interviews retrieved successfully',
        data: interviews,
        count: interviews.length
      });
    } catch (error) {
      next(error);
    }
  },

  // Get upcoming interviews (next 7 days)
  async getUpcomingInterviews(req, res, next) {
    try {
      const startDate = moment().toISOString();
      const endDate = moment().add(7, 'days').endOf('day').toISOString();

      const interviews = await Interview.findByDateRange(startDate, endDate);
      res.json({
        success: true,
        message: 'Upcoming interviews retrieved successfully',
        data: interviews,
        count: interviews.length
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = interviewController;
