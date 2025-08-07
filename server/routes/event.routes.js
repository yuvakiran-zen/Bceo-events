const express = require('express');
const { 
  getEvents, 
  getEvent, 
  createEvent,
  updateEvent,
  deleteEvent,
  updateSectionVisibility,
  getFeaturedEvents, 
  getUpcomingEvents 
} = require('../controllers/event.controller');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management API
 */

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all published events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
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
 *         description: Filter by featured status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title, subtitle, or description
 *     responses:
 *       200:
 *         description: A list of events
 *       500:
 *         description: Server Error
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/events/featured:
 *   get:
 *     summary: Get featured events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of featured events
 *       500:
 *         description: Server Error
 */
router.get('/featured', getFeaturedEvents);

/**
 * @swagger
 * /api/events/upcoming:
 *   get:
 *     summary: Get upcoming events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of upcoming events
 *       500:
 *         description: Server Error
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
 *         description: The event slug
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server Error
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
 *             type: object
 *             required:
 *               - title
 *               - subtitle
 *               - shortDescription
 *               - detailedDescription
 *               - category
 *               - startDate
 *               - endDate
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               detailedDescription:
 *                 type: string
 *               category:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               duration:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Server Error
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
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation Error
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server Error
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
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server Error
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
