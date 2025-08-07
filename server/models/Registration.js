const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the registration schema
const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  eventTitle: {
    type: String,
    required: [true, 'Event title is required']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State/Province is required'],
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  batch: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  receiveInfo: {
    type: Boolean,
    default: true
  },
  agreeTerms: {
    type: Boolean,
    required: [true, 'You must agree to the terms and conditions'],
    validate: {
      validator: function(v) {
        return v === true;
      },
      message: 'You must agree to the terms and conditions'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  confirmationCode: {
    type: String,
    unique: true,
    default: function() {
      return uuidv4().substring(0, 8).toUpperCase();
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Index for faster queries
registrationSchema.index({ confirmationCode: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ registeredAt: -1 });

// Static method to find by confirmation code
registrationSchema.statics.findByConfirmationCode = function(code) {
  return this.findOne({ confirmationCode: code.toUpperCase() });
};

// Instance method to confirm registration
registrationSchema.methods.confirm = function() {
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  return this.save();
};

// Instance method to cancel registration
registrationSchema.methods.cancel = function() {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  return this.save();
};

// Virtual for formatted registration date
registrationSchema.virtual('formattedRegisteredAt').get(function() {
  return this.registeredAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Pre-save middleware to ensure confirmation code is uppercase
registrationSchema.pre('save', function(next) {
  if (this.confirmationCode) {
    this.confirmationCode = this.confirmationCode.toUpperCase();
  }
  next();
});

// Check if model already exists to prevent OverwriteModelError
module.exports = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);