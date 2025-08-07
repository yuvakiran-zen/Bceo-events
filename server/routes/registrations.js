const express = require('express');
const { body } = require('express-validator');
const {
  createRegistration,
  getRegistrations,
  getRegistration,
  updateRegistration,
  confirmRegistration,
  cancelRegistration,
  deleteRegistration,
  getRegistrationStats
} = require('../controllers/registrationController');

const router = express.Router();

// Validation middleware for registration creation
const validateRegistration = [
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
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please enter a valid phone number'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State/Province is required'),
  body('city')
    .optional()
    .trim(),
  body('batch')
    .optional()
    .trim(),
  body('language')
    .optional()
    .trim()
    .default('English'),
  body('receiveInfo')
    .optional()
    .isBoolean()
    .withMessage('Receive info must be a boolean'),
  body('agreeTerms')
    .notEmpty()
    .withMessage('You must agree to the terms and conditions')
    .isBoolean()
    .withMessage('Agree terms must be a boolean')
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
    .withMessage('Notes cannot be more than 500 characters')
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       required:
 *         - eventId
 *         - fullName
 *         - email
 *         - phone
 *         - country
 *         - state
 *         - agreeTerms
 *       properties:
 *         eventId:
 *           type: string
 *           description: MongoDB ObjectId of the event
 *         eventTitle:
 *           type: string
 *           description: Title of the event
 *         fullName:
 *           type: string
 *           description: Full name of the registrant
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the registrant
 *         phone:
 *           type: string
 *           description: Phone number of the registrant
 *         country:
 *           type: string
 *           description: Country of the registrant
 *         state:
 *           type: string
 *           description: State or province of the registrant
 *         city:
 *           type: string
 *           description: City of the registrant
 *         batch:
 *           type: string
 *           description: Preferred batch for the event
 *         language:
 *           type: string
 *           description: Preferred language
 *           default: English
 *         receiveInfo:
 *           type: boolean
 *           description: Whether to receive information about future events
 *           default: true
 *         agreeTerms:
 *           type: boolean
 *           description: Agreement to terms and conditions
 *         notes:
 *           type: string
 *           description: Additional notes from the registrant
 */

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Create a new registration
 *     tags: [Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       201:
 *         description: Registration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     registration:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         confirmationCode:
 *                           type: string
 *                         status:
 *                           type: string
 *                         eventTitle:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         registeredAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error
 *       409:
 *         description: Already registered for this event
 *       500:
 *         description: Server error
 */
router.post('/', validateRegistration, createRegistration);

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: Get all registrations (Admin only)
 *     tags: [Registrations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filter by event ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: registeredAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of registrations
 *       500:
 *         description: Server error
 */
router.get('/', getRegistrations);

/**
 * @swagger
 * /api/registrations/stats:
 *   get:
 *     summary: Get registration statistics (Admin only)
 *     tags: [Registrations]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filter by event ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for date range filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for date range filter
 *     responses:
 *       200:
 *         description: Registration statistics
 *       500:
 *         description: Server error
 */
router.get('/stats', getRegistrationStats);

/**
 * @swagger
 * /api/registrations/{id}:
 *   get:
 *     summary: Get a single registration
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *       - in: query
 *         name: confirmationCode
 *         schema:
 *           type: string
 *         description: Confirmation code for public access
 *     responses:
 *       200:
 *         description: Registration details
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getRegistration);

/**
 * @swagger
 * /api/registrations/{id}:
 *   put:
 *     summary: Update a registration (Admin only)
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       200:
 *         description: Registration updated successfully
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateRegistration);

/**
 * @swagger
 * /api/registrations/{id}/confirm:
 *   patch:
 *     summary: Confirm a registration
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmationCode:
 *                 type: string
 *                 description: Confirmation code for public access
 *     responses:
 *       200:
 *         description: Registration confirmed successfully
 *       400:
 *         description: Registration already confirmed
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/confirm', confirmRegistration);

/**
 * @swagger
 * /api/registrations/{id}/cancel:
 *   patch:
 *     summary: Cancel a registration
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmationCode:
 *                 type: string
 *                 description: Confirmation code for public access
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *       400:
 *         description: Registration already cancelled
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/cancel', cancelRegistration);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: Delete a registration (Admin only)
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: Registration deleted successfully
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteRegistration);

module.exports = router;