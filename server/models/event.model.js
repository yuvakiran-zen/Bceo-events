const mongoose = require('mongoose');
const slugify = require('slugify');

// Schema for the configurable sections
const SectionVisibilitySchema = new mongoose.Schema({
  heroSection: { type: Boolean, default: true },
  aboutSection: { type: Boolean, default: true },
  benefitsSection: { type: Boolean, default: true },
  videoTestimonialSection: { type: Boolean, default: true },
  textTestimonialsSection: { type: Boolean, default: true },
  curriculumSection: { type: Boolean, default: true },
  faqSection: { type: Boolean, default: true },
  registrationCard: { type: Boolean, default: true },
  facilitatorCard: { type: Boolean, default: true },
  statsCard: { type: Boolean, default: true },
  upcomingSessionCard: { type: Boolean, default: true },
  relatedProgramsSection: { type: Boolean, default: true },
  countdownTimer: { type: Boolean, default: true }
}, { _id: false });

// Schema for facilitator information
const FacilitatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  credentials: [{ type: String }],
  experience: { type: String },
  studentsGuided: { type: String }
}, { _id: false });

// Schema for video testimonial
const VideoTestimonialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  videoPoster: { type: String, required: true },
  duration: { type: String }
}, { _id: false });

// Schema for text testimonials
const TextTestimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  authorName: { type: String },
  authorLocation: { type: String },
  authorImage: { type: String }
});

// Schema for curriculum weeks
const CurriculumWeekSchema = new mongoose.Schema({
  week: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  lessons: [{ type: String, required: true }]
});

// Schema for FAQ items
const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

// Schema for stats
const StatsSchema = new mongoose.Schema({
  totalGraduates: { type: Number },
  averageStressReduction: { type: String },
  practiceRetention: { type: String },
  recommendationRate: { type: String },
  countriesRepresented: { type: Number }
}, { _id: false });

// Schema for upcoming session
const UpcomingSessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  registrationUrl: { type: String, required: true }
}, { _id: false });

// Schema for resources
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String },
  downloadUrl: { type: String, required: true }
});

// Main Event Schema
const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Event subtitle is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  categoryColor: { type: String, default: 'from-blue-500 to-purple-600' },
  categoryBg: { type: String, default: 'bg-blue-50' },
  categoryText: { type: String, default: 'text-blue-700' },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  facilitator: {
    type: FacilitatorSchema,
    required: [true, 'Facilitator information is required']
  },
  heroImage: {
    type: String,
    required: [true, 'Hero image is required']
  },
  galleryImages: [{
    type: String
  }],
  participants: {
    type: Number,
    default: 0
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Maximum participants is required']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  originalPrice: {
    type: String
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  timezone: {
    type: String
  },
  language: [{
    type: String,
    required: [true, 'Language is required']
  }],
  level: {
    type: String,
    required: [true, 'Level is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'trending'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: [{
    type: String
  }],
  keyBenefits: [{
    type: String,
    required: [true, 'At least one key benefit is required']
  }],
  curriculum: [CurriculumWeekSchema],
  videoTestimonial: VideoTestimonialSchema,
  textTestimonials: [TextTestimonialSchema],
  faq: [FAQSchema],
  stats: StatsSchema,
  upcomingSession: UpcomingSessionSchema,
  resources: [ResourceSchema],
  registrationUrl: {
    type: String,
    required: [true, 'Registration URL is required']
  },
  sectionVisibility: {
    type: SectionVisibilitySchema,
    default: () => ({})
  },
  relatedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  createdBy: {
    type: String,
    default: '000000000000000000000000' // Default value instead of requiring a user reference
  },
  updatedBy: {
    type: String,
    default: '000000000000000000000000' // Default value instead of requiring a user reference
  }
}, { timestamps: true });

// Create slug from title before saving
EventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Calculate progress based on participants and maxParticipants
EventSchema.pre('save', function(next) {
  if (this.isModified('participants') || this.isModified('maxParticipants')) {
    this.progress = Math.min(Math.floor((this.participants / this.maxParticipants) * 100), 100);
  }
  next();
});

// Check if model already exists to prevent OverwriteModelError

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);