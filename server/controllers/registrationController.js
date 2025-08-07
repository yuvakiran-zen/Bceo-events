const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Create a new registration
const createRegistration = async (req, res) => {
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

    const {
      eventId,
      fullName,
      email,
      phone,
      country,
      state,
      city,
      batch,
      language,
      receiveInfo,
      agreeTerms,
      notes
    } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is already registered for this event
    const existingRegistration = await Registration.findOne({
      eventId,
      email: email.toLowerCase()
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event',
        data: {
          confirmationCode: existingRegistration.confirmationCode,
          status: existingRegistration.status
        }
      });
    }

    // Check if event has reached maximum capacity
    if (event.participants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event has reached maximum capacity'
      });
    }

    // Create new registration
    const registration = new Registration({
      eventId,
      eventTitle: event.title,
      fullName,
      email: email.toLowerCase(),
      phone,
      country,
      state,
      city,
      batch,
      language: language || 'English',
      receiveInfo: receiveInfo !== undefined ? receiveInfo : true,
      agreeTerms,
      notes
    });

    await registration.save();

    // Update event participant count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { participants: 1 }
    });

    // Return success response with limited data
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for confirmation details.',
      data: {
        registration: {
          id: registration._id,
          confirmationCode: registration.confirmationCode,
          status: registration.status,
          eventTitle: registration.eventTitle,
          fullName: registration.fullName,
          email: registration.email,
          registeredAt: registration.registeredAt
        }
      }
    });

  } catch (error) {
    console.error('Registration creation error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all registrations (Admin only)
const getRegistrations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      eventId,
      status,
      search,
      sortBy = 'registeredAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (eventId) filter.eventId = eventId;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get registrations with pagination
    const registrations = await Registration.find(filter)
      .populate('eventId', 'title startDate endDate location')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Registration.countDocuments(filter);

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a single registration
const getRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.query;

    let registration;

    if (confirmationCode) {
      // Public access with confirmation code
      registration = await Registration.findByConfirmationCode(confirmationCode)
        .populate('eventId', 'title startDate endDate location duration facilitator');
    } else {
      // Admin access with ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid registration ID'
        });
      }

      registration = await Registration.findById(id)
        .populate('eventId', 'title startDate endDate location duration facilitator');
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: { registration }
    });

  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a registration (Admin only)
const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID'
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('eventId', 'title startDate endDate location');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: { registration }
    });

  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Confirm a registration
const confirmRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    let registration;

    if (confirmationCode) {
      // Public confirmation with code
      registration = await Registration.findByConfirmationCode(confirmationCode);
    } else {
      // Admin confirmation with ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid registration ID'
        });
      }
      registration = await Registration.findById(id);
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already confirmed'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot confirm a cancelled registration'
      });
    }

    await registration.confirm();

    res.json({
      success: true,
      message: 'Registration confirmed successfully',
      data: {
        registration: {
          id: registration._id,
          confirmationCode: registration.confirmationCode,
          status: registration.status,
          confirmedAt: registration.confirmedAt
        }
      }
    });

  } catch (error) {
    console.error('Confirm registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel a registration
const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    let registration;

    if (confirmationCode) {
      // Public cancellation with code
      registration = await Registration.findByConfirmationCode(confirmationCode);
    } else {
      // Admin cancellation with ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid registration ID'
        });
      }
      registration = await Registration.findById(id);
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already cancelled'
      });
    }

    // Update event participant count if registration was confirmed
    if (registration.status === 'confirmed') {
      await Event.findByIdAndUpdate(registration.eventId, {
        $inc: { participants: -1 }
      });
    }

    await registration.cancel();

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      data: {
        registration: {
          id: registration._id,
          confirmationCode: registration.confirmationCode,
          status: registration.status,
          cancelledAt: registration.cancelledAt
        }
      }
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a registration (Admin only)
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID'
      });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Update event participant count if registration was confirmed
    if (registration.status === 'confirmed') {
      await Event.findByIdAndUpdate(registration.eventId, {
        $inc: { participants: -1 }
      });
    }

    await Registration.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });

  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get registration statistics
const getRegistrationStats = async (req, res) => {
  try {
    const { eventId, startDate, endDate } = req.query;

    // Build match filter
    const matchFilter = {};
    if (eventId) matchFilter.eventId = new mongoose.Types.ObjectId(eventId);
    if (startDate || endDate) {
      matchFilter.registeredAt = {};
      if (startDate) matchFilter.registeredAt.$gte = new Date(startDate);
      if (endDate) matchFilter.registeredAt.$lte = new Date(endDate);
    }

    // Aggregate statistics
    const stats = await Registration.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: 1 },
          confirmedRegistrations: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          pendingRegistrations: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          cancelledRegistrations: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          uniqueCountries: { $addToSet: '$country' },
          uniqueStates: { $addToSet: '$state' }
        }
      },
      {
        $project: {
          _id: 0,
          totalRegistrations: 1,
          confirmedRegistrations: 1,
          pendingRegistrations: 1,
          cancelledRegistrations: 1,
          confirmationRate: {
            $cond: [
              { $eq: ['$totalRegistrations', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$confirmedRegistrations', '$totalRegistrations'] },
                  100
                ]
              }
            ]
          },
          uniqueCountries: { $size: '$uniqueCountries' },
          uniqueStates: { $size: '$uniqueStates' }
        }
      }
    ]);

    // Get registrations by status for chart data
    const statusStats = await Registration.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get registrations by country (top 10)
    const countryStats = await Registration.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get daily registration trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const trendFilter = { ...matchFilter };
    if (!trendFilter.registeredAt) trendFilter.registeredAt = {};
    trendFilter.registeredAt.$gte = thirtyDaysAgo;

    const dailyTrends = await Registration.aggregate([
      { $match: trendFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$registeredAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalRegistrations: 0,
          confirmedRegistrations: 0,
          pendingRegistrations: 0,
          cancelledRegistrations: 0,
          confirmationRate: 0,
          uniqueCountries: 0,
          uniqueStates: 0
        },
        statusBreakdown: statusStats,
        topCountries: countryStats,
        dailyTrends
      }
    });

  } catch (error) {
    console.error('Get registration stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
  getRegistration,
  updateRegistration,
  confirmRegistration,
  cancelRegistration,
  deleteRegistration,
  getRegistrationStats
};