const Event = require('../models/Event');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all events with filtering, sorting, and pagination
const getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      status = 'published',
      featured,
      search,
      sortBy = 'startDate',
      sortOrder = 'asc',
      startDate,
      endDate,
      level,
      language
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (level) filter.level = level;
    if (language) filter.language = { $in: [language] };
    
    // Date range filter
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get events with pagination
    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-detailedDescription -curriculum -textTestimonials -faq -resources');

    // Get total count for pagination
    const total = await Event.countDocuments(filter);

    // Get categories for filtering
    const categories = await Event.distinct('category', { status: 'published' });

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        },
        filters: {
          categories
        }
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a single event by ID or slug
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let event;

    // Check if it's a MongoDB ObjectId or a slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findById(id).populate('relatedEvents', 'title slug heroImage category startDate price rating');
    } else {
      event = await Event.findOne({ slug: id }).populate('relatedEvents', 'title slug heroImage category startDate price rating');
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: { event }
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = new Event({
      ...req.body,
      createdBy: req.user?.id || '000000000000000000000000'
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });

  } catch (error) {
    console.error('Create event error:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: 'An event with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedBy: req.user?.id || '000000000000000000000000'
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });

  } catch (error) {
    console.error('Update event error:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: 'An event with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get featured events
const getFeaturedEvents = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const events = await Event.find({
      status: 'published',
      featured: true
    })
      .sort({ startDate: 1 })
      .limit(parseInt(limit))
      .select('-detailedDescription -curriculum -textTestimonials -faq -resources');

    res.json({
      success: true,
      data: { events }
    });

  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get trending events
const getTrendingEvents = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const events = await Event.find({
      status: 'trending'
    })
      .sort({ participants: -1, rating: -1 })
      .limit(parseInt(limit))
      .select('-detailedDescription -curriculum -textTestimonials -faq -resources');

    res.json({
      success: true,
      data: { events }
    });

  } catch (error) {
    console.error('Get trending events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get events by category
const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12, page = 1 } = req.query;

    const filter = {
      category: { $regex: new RegExp(category, 'i') },
      status: 'published'
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-detailedDescription -curriculum -textTestimonials -faq -resources');

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get events by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get event statistics
const getEventStats = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          publishedEvents: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftEvents: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          featuredEvents: {
            $sum: { $cond: ['$featured', 1, 0] }
          },
          totalParticipants: { $sum: '$participants' },
          averageRating: { $avg: '$rating' },
          categories: { $addToSet: '$category' }
        }
      },
      {
        $project: {
          _id: 0,
          totalEvents: 1,
          publishedEvents: 1,
          draftEvents: 1,
          featuredEvents: 1,
          totalParticipants: 1,
          averageRating: { $round: ['$averageRating', 2] },
          totalCategories: { $size: '$categories' }
        }
      }
    ]);

    // Get events by category
    const categoryStats = await Event.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalParticipants: { $sum: '$participants' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get monthly event creation trends
    const monthlyTrends = await Event.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalEvents: 0,
          publishedEvents: 0,
          draftEvents: 0,
          featuredEvents: 0,
          totalParticipants: 0,
          averageRating: 0,
          totalCategories: 0
        },
        categoryBreakdown: categoryStats,
        monthlyTrends
      }
    });

  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents,
  getTrendingEvents,
  getEventsByCategory,
  getEventStats
};