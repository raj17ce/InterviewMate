const Joi = require('joi');

const interviewSchema = Joi.object({
  interviewee_name: Joi.string().min(2).max(255).required(),
  role: Joi.string().min(2).max(255).required(),
  interview_time: Joi.date().iso().greater('now').required()
});

const updateInterviewSchema = Joi.object({
  interviewee_name: Joi.string().min(2).max(255),
  role: Joi.string().min(2).max(255),
  interview_time: Joi.date().iso(),
  status: Joi.string().valid('scheduled', 'completed', 'cancelled', 'rescheduled')
}).min(1);

const validateInterview = (req, res, next) => {
  const { error } = interviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateUpdateInterview = (req, res, next) => {
  const { error } = updateInterviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID parameter'
    });
  }
  req.params.id = id;
  next();
};

module.exports = {
  validateInterview,
  validateUpdateInterview,
  validateId
};
