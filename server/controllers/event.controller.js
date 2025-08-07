const Event = require('../models/event.model');
const mongoose = require('mongoose');

// @desc    Get all events (with pagination and filtering)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    console.log('Getting events with query:', req.query);
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build query
    let query = { status: 'published' }; // Only published events

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by featured
    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }

    // Search by title or description
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { shortDescription: searchRegex },
        { detailedDescription: searchRegex },
        { tags: searchRegex }
      ];
    }

    console.log('Query filter:', query);

    // Execute query with pagination
    const total = await Event.countDocuments(query);
    console.log('Total events found:', total);
    
    let events = await Event.find(query)
      .sort({ startDate: 1 }) // Sort by date ascending
      .skip(startIndex)
      .limit(limit)
      .select('title subtitle slug category startDate duration participants rating price featured status heroImage');

    console.log('Events retrieved:', events.length);

    // Pagination result
    const pagination = {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit
    };

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    // Get categories for filtering
    const categories = await Event.distinct('category', { status: 'published' });

    res.status(200).json({
      success: true,
      data: {
        events,
        pagination,
        filters: {
          categories
        }
      },
      count: events.length,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single event by slug
// @route   GET /api/events/:slug
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const { slug } = req.params;
    let event;

    console.log('Getting event with slug/id:', slug);

    // Check if it's a MongoDB ObjectId or a slug
    if (mongoose.Types.ObjectId.isValid(slug)) {
      event = await Event.findById(slug);
    } else {
      event = await Event.findOne({ slug: slug });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Only return published events (unless it's in development mode)
    if (event.status !== 'published' && process.env.NODE_ENV !== 'development') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get related events
    let relatedEvents = [];
    if (event.relatedEvents && event.relatedEvents.length > 0) {
      relatedEvents = await Event.find({ 
        _id: { $in: event.relatedEvents },
        status: 'published'
      }).select('title subtitle slug category duration participants rating price heroImage');
    } else {
      // If no related events specified, get events from same category
      relatedEvents = await Event.find({
        category: event.category,
        _id: { $ne: event._id },
        status: 'published'
      })
      .limit(3)
      .select('title subtitle slug category duration participants rating price heroImage');
    }

    res.status(200).json({
      success: true,
      data: event,
      relatedEvents
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Public (changed from Private)
exports.createEvent = async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);
    
    // Remove authentication dependency
    // Use a default system user ID for now
    const defaultUserId = '000000000000000000000000'; // ObjectId representation
    req.body.createdBy = defaultUserId;
    req.body.updatedBy = defaultUserId;

    const event = await Event.create(req.body);
    console.log('Event created:', event._id);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Public (changed from Private)
exports.updateEvent = async (req, res) => {
  try {
    console.log('Updating event:', req.params.id);
    
    // Remove authentication dependency
    const defaultUserId = '000000000000000000000000';
    req.body.updatedBy = defaultUserId;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    console.log('Event updated:', event._id);

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Public (changed from Private)
exports.deleteEvent = async (req, res) => {
  try {
    console.log('Deleting event:', req.params.id);
    
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Remove authentication check
    await event.deleteOne();
    console.log('Event deleted:', req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update section visibility
// @route   PATCH /api/events/:id/visibility
// @access  Public (changed from Private)
exports.updateSectionVisibility = async (req, res) => {
  try {
    console.log('Updating section visibility for event:', req.params.id);
    
    // Remove authentication dependency
    const defaultUserId = '000000000000000000000000';
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { 
        'sectionVisibility': req.body.sectionVisibility,
        'updatedBy': defaultUserId
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    console.log('Section visibility updated for event:', event._id);

    res.status(200).json({
      success: true,
      data: event.sectionVisibility
    });
  } catch (error) {
    console.error('Update section visibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
exports.getFeaturedEvents = async (req, res) => {
  try {
    console.log('Getting featured events');
    
    const events = await Event.find({ featured: true, status: 'published' })
      .limit(4)
      .select('title subtitle slug category startDate duration participants rating price heroImage');

    console.log('Featured events found:', events.length);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
exports.getUpcomingEvents = async (req, res) => {
  try {
    console.log('Getting upcoming events');
    
    const now = new Date();
    const events = await Event.find({ 
      startDate: { $gt: now },
      status: 'published'
    })
    .sort({ startDate: 1 })
    .limit(6)
    .select('title subtitle slug category startDate duration participants rating price heroImage');

    console.log('Upcoming events found:', events.length);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};