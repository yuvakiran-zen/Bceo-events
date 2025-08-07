const { body, param, query } = require('express-validator');

// Validation for creating registration
const validateCreateRegistration = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isMongoId()
    .withMessage('Invalid event ID format'),
    
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
    
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s\-\(\)]{10,}$/)
    .withMessage('Please provide a valid phone number'),
    
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
    
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State/Province is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('State/Province must be between 2 and 50 characters'),
    
  body('city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City must be less than 50 characters'),
    
  body('batch')
    .optional()
    .isIn(['batch1', 'batch2', 'batch3', 'batch4'])
    .withMessage('Invalid batch selection'),
    
  body('language')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Language must be less than 30 characters'),
    
  body('receiveInfo')
    .optional()
    .isBoolean()
    .withMessage('Receive info must be a boolean value'),
    
  body('agreeTerms')
    .notEmpty()
    .withMessage('You must agree to the terms and conditions')
    .isBoolean()
    .withMessage('Agree terms must be a boolean value')
    .custom((value) => {
      if (value !== true) {
        throw new Error('You must agree to the terms and conditions');
      }
      return true;
    }),
    
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

// Validation for updating registration
const validateUpdateRegistration = [
  param('id')
    .isMongoId()
    .withMessage('Invalid registration ID format'),
    
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
    
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty')
    .matches(/^[+]?[\d\s\-\(\)]{10,}$/)
    .withMessage('Please provide a valid phone number'),
    
  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
    
  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State/Province cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('State/Province must be between 2 and 50 characters'),
    
  body('city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City must be less than 50 characters'),
    
  body('batch')
    .optional()
    .isIn(['batch1', 'batch2', 'batch3', 'batch4'])
    .withMessage('Invalid batch selection'),
    
  body('language')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Language must be less than 30 characters'),
    
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status value'),
    
  body('receiveInfo')
    .optional()
    .isBoolean()
    .withMessage('Receive info must be a boolean value'),
    
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

// Validation for getting registration by ID
const validateGetRegistration = [
  param('id')
    .isMongoId()
    .withMessage('Invalid registration ID format'),
    
  query('confirmationCode')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Invalid confirmation code format')
];

// Validation for confirmation/cancellation
const validateRegistrationAction = [
  param('id')
    .optional()
    .isMongoId()
    .withMessage('Invalid registration ID format'),
    
  body('confirmationCode')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Invalid confirmation code format')
];

// Validation for getting registrations list
const validateGetRegistrations = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('eventId')
    .optional()
    .isMongoId()
    .withMessage('Invalid event ID format'),
    
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status value'),
    
  query('sortBy')
    .optional()
    .isIn(['registeredAt', 'fullName', 'email', 'status', 'country'])
    .withMessage('Invalid sort field'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
    
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
];

// Validation for registration stats
const validateGetRegistrationStats = [
  query('eventId')
    .optional()
    .isMongoId()
    .withMessage('Invalid event ID format'),
    
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
    
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

module.exports = {
  validateCreateRegistration,
  validateUpdateRegistration,
  validateGetRegistration,
  validateRegistrationAction,
  validateGetRegistrations,
  validateGetRegistrationStats
};