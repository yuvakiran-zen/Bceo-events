const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents,
  getUpcomingEvents,
  updateSectionVisibility
} = require('../controllers/event.controller');

const router = express.Router();

// Validation middleware for event creation/update
const validateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('subtitle')
    .trim()
    .notEmpty()
    .withMessage('Subtitle is required'),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 200 })
    .withMessage('Short description cannot be more than 200 characters'),
  body('detailedDescription')
    .trim()
    .notEmpty()
    .withMessage('Detailed description is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required'),
  body('facilitator.name')
    .trim()
    .notEmpty()
    .withMessage('Facilitator name is required'),
  body('facilitator.title')
    .trim()
    .notEmpty()
    .withMessage('Facilitator title is required'),
  body('facilitator.bio')
    .trim()
    .notEmpty()
    .withMessage('Facilitator bio is required'),
  body('facilitator.image')
    .trim()
    .notEmpty()
    .withMessage('Facilitator image is required'),
  body('heroImage')
    .trim()
    .notEmpty()
    .withMessage('Hero image is required'),
  body('maxParticipants')
    .isInt({ min: 1 })
    .withMessage('Maximum participants must be at least 1'),
  body('price')
    .trim()
    .notEmpty()
    .withMessage('Price is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('level')
    .trim()
    .notEmpty()
    .withMessage('Level is required'),
  body('keyBenefits')
    .isArray({ min: 1 })
    .withMessage('At least one key benefit is required'),
  body('registrationUrl')
    .trim()
    .notEmpty()
    .withMessage('Registration URL is required')
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - subtitle
 *         - shortDescription
 *         - detailedDescription
 *         - category
 *         - startDate
 *         - endDate
 *         - duration
 *         - facilitator
 *         - heroImage
 *         - maxParticipants
 *         - price
 *         - location
 *         - level
 *         - keyBenefits
 *         - registrationUrl
 *       properties:
 *         title:
 *           type: string
 *           description: Event title
 *         subtitle:
 *           type: string
 *           description: Event subtitle
 *         shortDescription:
 *           type: string
 *           description: Brief description of the event
 *         detailedDescription:
 *           type: string
 *           description: Detailed description of the event
 *         category:
 *           type: string
 *           description: Event category
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Event start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Event end date
 *         duration:
 *           type: string
 *           description: Event duration
 *         facilitator:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             title:
 *               type: string
 *             bio:
 *               type: string
 *             image:
 *               type: string
 *         heroImage:
 *           type: string
 *           description: Main event image URL
 *         maxParticipants:
 *           type: integer
 *           description: Maximum number of participants
 *         price:
 *           type: string
 *           description: Event price
 *         location:
 *           type: string
 *           description: Event location
 *         level:
 *           type: string
 *           description: Event difficulty level
 *         keyBenefits:
 *           type: array
 *           items:
 *             type: string
 *           description: List of key benefits
 *         registrationUrl:
 *           type: string
 *           description: Registration URL
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events with filtering and pagination
 *     tags: [Events]
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
 *           default: 12
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured events
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, and tags
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     events:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *       500:
 *         description: Server error
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/events/featured:
 *   get:
 *     summary: Get featured events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Number of featured events to return
 *     responses:
 *       200:
 *         description: List of featured events
 *       500:
 *         description: Server error
 */
router.get('/featured', getFeaturedEvents);

/**
 * @swagger
 * /api/events/upcoming:
 *   get:
 *     summary: Get upcoming events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of upcoming events to return
 *     responses:
 *       200:
 *         description: List of upcoming events
 *       500:
 *         description: Server error
 */
router.get('/upcoming', getUpcomingEvents);

/**
 * @swagger
 * /api/events/{slug}:
 *   get:
 *     summary: Get a single event by slug
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Event slug or ID
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.get('/:slug', getEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteEvent);

/**
 * @swagger
 * /api/events/{id}/visibility:
 *   patch:
 *     summary: Update section visibility settings for an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sectionVisibility:
 *                 type: object
 *     responses:
 *       200:
 *         description: Section visibility updated successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server Error
 */
router.patch('/:id/visibility', updateSectionVisibility);

module.exports = router;