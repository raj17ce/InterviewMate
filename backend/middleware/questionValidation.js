const Joi = require('joi');

// Validation for generating questions
const validateGenerateQuestions = (req, res, next) => {
  const schema = Joi.object({
    interview_id: Joi.string().required().messages({
      'string.empty': 'Interview ID is required',
      'any.required': 'Interview ID is required'
    }),
    question_count: Joi.number().integer().min(1).max(20).optional().default(5).messages({
      'number.base': 'Question count must be a number',
      'number.integer': 'Question count must be an integer',
      'number.min': 'Question count must be at least 1',
      'number.max': 'Question count cannot exceed 20'
    })
  });

  const { error } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

// Validation for submitting answers
const validateSubmitAnswer = (req, res, next) => {
  const schema = Joi.object({
    answer_text: Joi.string().min(10).max(2000).required().messages({
      'string.empty': 'Answer text is required',
      'string.min': 'Answer must be at least 10 characters long',
      'string.max': 'Answer cannot exceed 2000 characters',
      'any.required': 'Answer text is required'
    })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

// Validation for question ID parameter
const validateQuestionId = (req, res, next) => {
  const schema = Joi.object({
    questionId: Joi.number().integer().positive().required().messages({
      'number.base': 'Question ID must be a number',
      'number.integer': 'Question ID must be an integer',
      'number.positive': 'Question ID must be positive',
      'any.required': 'Question ID is required'
    })
  });

  const { error } = schema.validate(req.params);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

module.exports = {
  validateGenerateQuestions,
  validateSubmitAnswer,
  validateQuestionId
};
