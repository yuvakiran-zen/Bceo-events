const mongoose = require('mongoose');
require('dotenv').config();

// Import the Event model
const Event = require('../models/event.model');

// Sample events data
const sampleEvents = [
  {
    title: "Mindfulness Meditation Masterclass",
    subtitle: "Transform Your Life Through Mindful Living",
    shortDescription: "Learn the fundamentals of mindfulness meditation and develop a sustainable daily practice.",
    detailedDescription: "This comprehensive masterclass will guide you through the ancient art of mindfulness meditation. You'll learn various techniques, understand the science behind meditation, and develop a personalized practice that fits your lifestyle. Perfect for beginners and those looking to deepen their practice.",
    category: "Wellness",
    categoryColor: "from-green-500 to-blue-600",
    categoryBg: "bg-green-50",
    categoryText: "text-green-700",
    startDate: new Date('2024-02-15T10:00:00Z'),
    endDate: new Date('2024-02-15T12:00:00Z'),
    duration: "2 hours",
    facilitator: {
      name: "Dr. Sarah Chen",
      title: "Mindfulness Expert & Neuroscientist",
      bio: "Dr. Sarah Chen is a renowned mindfulness expert with over 15 years of experience in meditation research and practice. She holds a PhD in Neuroscience and has published numerous papers on the effects of meditation on the brain.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      credentials: ["PhD in Neuroscience", "Certified Mindfulness Instructor", "Author of 'The Mindful Brain'"],
      experience: "15+ years",
      studentsGuided: "10,000+"
    },
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop"
    ],
    participants: 45,
    maxParticipants: 100,
    rating: 4.8,
    reviews: 127,
    price: "$89",
    originalPrice: "$129",
    location: "Online (Zoom)",
    timezone: "EST",
    language: ["English"],
    level: "Beginner to Intermediate",
    status: "published",
    featured: true,
    tags: ["mindfulness", "meditation", "wellness", "stress-relief"],
    keyBenefits: [
      "Reduce stress and anxiety",
      "Improve focus and concentration",
      "Develop emotional resilience",
      "Create a sustainable daily practice"
    ],
    curriculum: [
      {
        week: "Session 1",
        title: "Introduction to Mindfulness",
        description: "Understanding the basics of mindfulness and its benefits",
        lessons: [
          "What is mindfulness?",
          "The science behind meditation",
          "Setting up your practice space"
        ]
      },
      {
        week: "Session 2",
        title: "Breathing Techniques",
        description: "Master fundamental breathing exercises",
        lessons: [
          "Basic breath awareness",
          "4-7-8 breathing technique",
          "Box breathing method"
        ]
      }
    ],
    videoTestimonial: {
      title: "Life-Changing Experience",
      description: "Hear from Maria about how this masterclass transformed her daily routine",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoPoster: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop",
      duration: "2:30"
    },
    textTestimonials: [
      {
        text: "This masterclass completely changed my approach to stress management. Dr. Chen's teaching style is incredibly clear and practical.",
        rating: 5,
        authorName: "Michael Rodriguez",
        authorLocation: "New York, NY",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      },
      {
        text: "I've tried meditation before but never stuck with it. This program gave me the tools and motivation to make it a daily habit.",
        rating: 5,
        authorName: "Jennifer Kim",
        authorLocation: "San Francisco, CA",
        authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      }
    ],
    faq: [
      {
        question: "Do I need any prior meditation experience?",
        answer: "No prior experience is necessary. This masterclass is designed for beginners and those looking to deepen their practice."
      },
      {
        question: "What materials do I need?",
        answer: "Just a quiet space and comfortable clothing. We'll provide all digital materials and guided audio sessions."
      },
      {
        question: "Will the session be recorded?",
        answer: "Yes, all participants will receive access to the recording for 30 days after the live session."
      }
    ],
    stats: {
      totalGraduates: 5000,
      averageStressReduction: "65%",
      practiceRetention: "78%",
      recommendationRate: "94%",
      countriesRepresented: 25
    },
    upcomingSession: {
      date: new Date('2024-02-15T10:00:00Z'),
      time: "10:00 AM EST",
      title: "Live Q&A Session",
      description: "Join Dr. Chen for an exclusive Q&A session after the masterclass",
      registrationUrl: "https://example.com/register-qa"
    },
    resources: [
      {
        title: "Mindfulness Practice Guide",
        description: "Comprehensive PDF guide with exercises and techniques",
        type: "PDF",
        size: "2.5 MB",
        downloadUrl: "https://example.com/download/guide.pdf"
      },
      {
        title: "Guided Meditation Audio Pack",
        description: "Collection of 10 guided meditation sessions",
        type: "Audio",
        size: "150 MB",
        downloadUrl: "https://example.com/download/audio-pack.zip"
      }
    ],
    registrationUrl: "https://example.com/register/mindfulness-masterclass"
  },
  {
    title: "Digital Marketing Bootcamp",
    subtitle: "Master Modern Marketing Strategies",
    shortDescription: "Comprehensive training in digital marketing, SEO, social media, and analytics.",
    detailedDescription: "This intensive bootcamp covers all aspects of digital marketing from strategy to execution. Learn from industry experts and get hands-on experience with real campaigns. Perfect for entrepreneurs, marketing professionals, and business owners.",
    category: "Business",
    categoryColor: "from-blue-500 to-purple-600",
    categoryBg: "bg-blue-50",
    categoryText: "text-blue-700",
    startDate: new Date('2024-02-20T09:00:00Z'),
    endDate: new Date('2024-02-22T17:00:00Z'),
    duration: "3 days",
    facilitator: {
      name: "Alex Thompson",
      title: "Digital Marketing Director",
      bio: "Alex Thompson is a digital marketing expert with over 12 years of experience helping businesses grow online. He has worked with Fortune 500 companies and startups alike.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      credentials: ["Google Ads Certified", "Facebook Blueprint Certified", "HubSpot Certified"],
      experience: "12+ years",
      studentsGuided: "5,000+"
    },
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    participants: 78,
    maxParticipants: 150,
    rating: 4.7,
    reviews: 89,
    price: "$299",
    originalPrice: "$399",
    location: "Online (Zoom)",
    timezone: "PST",
    language: ["English"],
    level: "Intermediate",
    status: "published",
    featured: true,
    tags: ["marketing", "digital", "SEO", "social-media"],
    keyBenefits: [
      "Master SEO and content marketing",
      "Learn social media advertising",
      "Understand analytics and ROI",
      "Build effective marketing funnels"
    ],
    registrationUrl: "https://example.com/register/digital-marketing-bootcamp"
  },
  {
    title: "Creative Writing Workshop",
    subtitle: "Unleash Your Storytelling Potential",
    shortDescription: "Develop your creative writing skills with expert guidance and peer feedback.",
    detailedDescription: "Join our intensive creative writing workshop where you'll explore various forms of storytelling, develop your unique voice, and receive constructive feedback from both instructors and fellow writers.",
    category: "Arts",
    categoryColor: "from-purple-500 to-pink-600",
    categoryBg: "bg-purple-50",
    categoryText: "text-purple-700",
    startDate: new Date('2024-02-25T14:00:00Z'),
    endDate: new Date('2024-02-25T17:00:00Z'),
    duration: "3 hours",
    facilitator: {
      name: "Emma Watson",
      title: "Published Author & Writing Coach",
      bio: "Emma Watson is a bestselling author with 8 published novels and over 10 years of experience teaching creative writing. She has mentored hundreds of aspiring writers.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      credentials: ["MFA in Creative Writing", "Bestselling Author", "Writing Coach Certification"],
      experience: "10+ years",
      studentsGuided: "2,000+"
    },
    heroImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
    participants: 32,
    maxParticipants: 50,
    rating: 4.9,
    reviews: 156,
    price: "$75",
    location: "Online (Zoom)",
    timezone: "EST",
    language: ["English"],
    level: "All Levels",
    status: "published",
    featured: false,
    tags: ["writing", "creativity", "storytelling", "literature"],
    keyBenefits: [
      "Develop your unique writing voice",
      "Learn story structure and pacing",
      "Get personalized feedback",
      "Connect with fellow writers"
    ],
    registrationUrl: "https://example.com/register/creative-writing-workshop"
  },
  {
    title: "Financial Planning Fundamentals",
    subtitle: "Build Your Path to Financial Freedom",
    shortDescription: "Learn essential financial planning strategies for personal wealth building.",
    detailedDescription: "This comprehensive workshop covers budgeting, investing, retirement planning, and debt management. Get practical tools and strategies to take control of your financial future.",
    category: "Finance",
    categoryColor: "from-green-500 to-teal-600",
    categoryBg: "bg-green-50",
    categoryText: "text-green-700",
    startDate: new Date('2024-03-01T18:00:00Z'),
    endDate: new Date('2024-03-01T20:00:00Z'),
    duration: "2 hours",
    facilitator: {
      name: "Robert Johnson",
      title: "Certified Financial Planner",
      bio: "Robert Johnson is a CFP with 20 years of experience in financial planning and wealth management. He has helped thousands of individuals achieve their financial goals.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      credentials: ["CFP Certified", "CFA Charterholder", "Financial Planning Expert"],
      experience: "20+ years",
      studentsGuided: "8,000+"
    },
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    participants: 67,
    maxParticipants: 200,
    rating: 4.6,
    reviews: 203,
    price: "$49",
    originalPrice: "$79",
    location: "Online (Zoom)",
    timezone: "EST",
    language: ["English"],
    level: "Beginner",
    status: "published",
    featured: true,
    tags: ["finance", "investing", "budgeting", "retirement"],
    keyBenefits: [
      "Create a comprehensive budget",
      "Understand investment basics",
      "Plan for retirement",
      "Manage and eliminate debt"
    ],
    registrationUrl: "https://example.com/register/financial-planning"
  },
  {
    title: "Yoga for Beginners",
    subtitle: "Start Your Yoga Journey",
    shortDescription: "Gentle introduction to yoga poses, breathing, and mindfulness practices.",
    detailedDescription: "Perfect for complete beginners, this workshop introduces basic yoga poses, proper breathing techniques, and mindfulness practices. Learn in a supportive, non-judgmental environment.",
    category: "Wellness",
    categoryColor: "from-green-500 to-blue-600",
    categoryBg: "bg-green-50",
    categoryText: "text-green-700",
    startDate: new Date('2024-03-05T08:00:00Z'),
    endDate: new Date('2024-03-05T09:30:00Z'),
    duration: "1.5 hours",
    facilitator: {
      name: "Lisa Patel",
      title: "Certified Yoga Instructor",
      bio: "Lisa Patel is a RYT-500 certified yoga instructor with 8 years of teaching experience. She specializes in beginner-friendly classes and therapeutic yoga.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      credentials: ["RYT-500 Certified", "Therapeutic Yoga Specialist", "Mindfulness Teacher"],
      experience: "8+ years",
      studentsGuided: "3,000+"
    },
    heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    participants: 28,
    maxParticipants: 40,
    rating: 4.8,
    reviews: 94,
    price: "$35",
    location: "Online (Zoom)",
    timezone: "PST",
    language: ["English"],
    level: "Beginner",
    status: "published",
    featured: false,
    tags: ["yoga", "wellness", "mindfulness", "flexibility"],
    keyBenefits: [
      "Learn basic yoga poses",
      "Improve flexibility and strength",
      "Reduce stress and tension",
      "Develop mindfulness skills"
    ],
    registrationUrl: "https://example.com/register/yoga-beginners"
  }
];

// Function to seed the database
const seedEvents = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bceo-events';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing events
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing events');
    
    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`✅ Created ${createdEvents.length} sample events`);
    
    // Log created events
    createdEvents.forEach(event => {
      console.log(`   - ${event.title} (${event.category}) - ${event.status}`);
    });
    
    console.log('\n🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedEvents();