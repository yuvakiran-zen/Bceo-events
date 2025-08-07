const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Sample events data
const sampleEvents = [
  {
    title: "Mindful Leadership Intensive",
    subtitle: "Transform Your Leadership Through Mindfulness",
    shortDescription: "A comprehensive 8-week program designed to develop mindful leadership skills for modern executives and entrepreneurs.",
    detailedDescription: "This intensive program combines ancient mindfulness practices with modern leadership science to help you become a more effective, compassionate, and resilient leader. Through guided meditation, practical exercises, and peer learning, you'll develop the skills to lead with clarity, presence, and wisdom.",
    category: "Leadership",
    categoryColor: "from-pink-500 to-rose-600",
    categoryBg: "bg-pink-50",
    categoryText: "text-pink-700",
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-04-10'),
    duration: "8 weeks",
    facilitator: {
      name: "Dr. Sarah Chen",
      title: "Mindfulness & Leadership Expert",
      bio: "Dr. Sarah Chen is a renowned expert in mindful leadership with over 15 years of experience helping executives and entrepreneurs develop conscious leadership skills.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      credentials: ["PhD in Psychology", "Certified Mindfulness Teacher", "Executive Coach"],
      experience: "15+ years",
      studentsGuided: "2,500+"
    },
    heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    galleryImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400"
    ],
    participants: 45,
    maxParticipants: 50,
    rating: 4.9,
    reviews: 127,
    price: "$497",
    originalPrice: "$697",
    location: "Online + In-Person (San Francisco)",
    timezone: "PST",
    language: ["English"],
    level: "Intermediate",
    status: "published",
    featured: true,
    tags: ["Leadership", "Mindfulness", "Executive Development", "Stress Management"],
    keyBenefits: [
      "Develop authentic leadership presence",
      "Master stress management techniques",
      "Improve decision-making clarity",
      "Build resilient teams",
      "Enhance emotional intelligence"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Foundations of Mindful Leadership",
        description: "Introduction to mindfulness principles and their application in leadership contexts.",
        lessons: [
          "What is Mindful Leadership?",
          "The Science of Mindfulness",
          "Basic Meditation Techniques",
          "Self-Assessment and Goal Setting"
        ]
      },
      {
        week: "Week 2",
        title: "Presence and Awareness",
        description: "Developing present-moment awareness and its impact on leadership effectiveness.",
        lessons: [
          "Cultivating Present-Moment Awareness",
          "Body Scan Meditation",
          "Mindful Listening Techniques",
          "Presence in Meetings and Conversations"
        ]
      }
    ],
    videoTestimonial: {
      title: "Life-Changing Leadership Transformation",
      description: "Hear from CEO Maria Rodriguez about her journey through the Mindful Leadership program.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoPoster: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
      duration: "3:45"
    },
    textTestimonials: [
      {
        text: "This program completely transformed how I approach leadership. I'm more present, less reactive, and my team has noticed the difference.",
        rating: 5,
        authorName: "Michael Thompson",
        authorLocation: "New York, NY",
        authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
      },
      {
        text: "The combination of practical tools and deep wisdom made this program incredibly valuable for my executive role.",
        rating: 5,
        authorName: "Jennifer Liu",
        authorLocation: "Seattle, WA",
        authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
      }
    ],
    faq: [
      {
        question: "Do I need prior meditation experience?",
        answer: "No prior experience is necessary. We start with the basics and gradually build your practice."
      },
      {
        question: "How much time commitment is required?",
        answer: "Plan for 2-3 hours per week including live sessions, practice time, and assignments."
      }
    ],
    stats: {
      totalGraduates: 2500,
      averageStressReduction: "67%",
      practiceRetention: "89%",
      recommendationRate: "96%",
      countriesRepresented: 23
    },
    upcomingSession: {
      date: new Date('2024-02-15'),
      time: "7:00 PM PST",
      title: "Free Introduction to Mindful Leadership",
      description: "Join us for a complimentary session to experience the power of mindful leadership.",
      registrationUrl: "https://bceoevents.com/register/intro-session"
    },
    resources: [
      {
        title: "Mindful Leadership Workbook",
        description: "Comprehensive workbook with exercises and reflections",
        type: "PDF",
        size: "2.5 MB",
        downloadUrl: "https://bceoevents.com/resources/workbook.pdf"
      }
    ],
    registrationUrl: "https://bceoevents.com/register/mindful-leadership",
    sectionVisibility: {
      heroSection: true,
      aboutSection: true,
      benefitsSection: true,
      videoTestimonialSection: true,
      textTestimonialsSection: true,
      curriculumSection: true,
      faqSection: true,
      registrationCard: true,
      facilitatorCard: true,
      statsCard: true,
      upcomingSessionCard: true,
      relatedProgramsSection: true,
      countdownTimer: true
    }
  },
  {
    title: "Youth Mindfulness Program",
    subtitle: "Empowering Young Minds Through Mindfulness",
    shortDescription: "A 6-week program designed specifically for teenagers to develop emotional regulation and stress management skills.",
    detailedDescription: "This program is tailored for teenagers aged 13-18, focusing on practical mindfulness techniques that help with academic stress, social pressures, and emotional challenges. Through interactive sessions and peer support, young participants learn valuable life skills.",
    category: "Youth",
    categoryColor: "from-green-500 to-emerald-600",
    categoryBg: "bg-green-50",
    categoryText: "text-green-700",
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-12'),
    duration: "6 weeks",
    facilitator: {
      name: "Alex Rivera",
      title: "Youth Mindfulness Specialist",
      bio: "Alex Rivera specializes in teaching mindfulness to young people and has developed innovative approaches that resonate with teenage audiences.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      credentials: ["MA in Adolescent Psychology", "Certified Youth Mindfulness Instructor"],
      experience: "8+ years",
      studentsGuided: "1,200+"
    },
    heroImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
    galleryImages: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400"
    ],
    participants: 28,
    maxParticipants: 30,
    rating: 4.7,
    reviews: 89,
    price: "$197",
    originalPrice: "$297",
    location: "Online",
    timezone: "EST",
    language: ["English"],
    level: "Beginner",
    status: "published",
    featured: false,
    tags: ["Youth", "Mindfulness", "Stress Management", "Emotional Regulation"],
    keyBenefits: [
      "Reduce academic stress and anxiety",
      "Improve focus and concentration",
      "Develop emotional regulation skills",
      "Build self-confidence",
      "Learn healthy coping strategies"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Introduction to Mindfulness",
        description: "Understanding what mindfulness is and how it can help in daily life.",
        lessons: [
          "What is Mindfulness?",
          "Benefits for Teenagers",
          "Simple Breathing Exercises",
          "Mindful Awareness Games"
        ]
      }
    ],
    textTestimonials: [
      {
        text: "This program helped me manage my test anxiety so much better. I feel more confident and calm.",
        rating: 5,
        authorName: "Emma S.",
        authorLocation: "Boston, MA"
      }
    ],
    faq: [
      {
        question: "Is this program suitable for all teenagers?",
        answer: "Yes, the program is designed for teens aged 13-18 with no prior experience required."
      }
    ],
    registrationUrl: "https://bceoevents.com/register/youth-mindfulness",
    sectionVisibility: {
      heroSection: true,
      aboutSection: true,
      benefitsSection: true,
      videoTestimonialSection: false,
      textTestimonialsSection: true,
      curriculumSection: true,
      faqSection: true,
      registrationCard: true,
      facilitatorCard: true,
      statsCard: false,
      upcomingSessionCard: false,
      relatedProgramsSection: true,
      countdownTimer: false
    }
  },
  {
    title: "Corporate Wellness Retreat",
    subtitle: "Transform Your Workplace Culture",
    shortDescription: "A comprehensive 3-day retreat designed to introduce mindfulness and wellness practices to corporate teams.",
    detailedDescription: "This intensive retreat combines team-building activities with mindfulness training to create a more positive, productive, and harmonious workplace culture. Perfect for companies looking to invest in employee wellbeing.",
    category: "Corporate",
    categoryColor: "from-orange-500 to-amber-600",
    categoryBg: "bg-orange-50",
    categoryText: "text-orange-700",
    startDate: new Date('2024-04-15'),
    endDate: new Date('2024-04-17'),
    duration: "3 days",
    facilitator: {
      name: "Dr. James Wilson",
      title: "Corporate Wellness Expert",
      bio: "Dr. Wilson has over 20 years of experience in organizational psychology and corporate wellness program development.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      credentials: ["PhD in Organizational Psychology", "Certified Corporate Wellness Consultant"],
      experience: "20+ years",
      studentsGuided: "5,000+"
    },
    heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    galleryImages: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400"
    ],
    participants: 15,
    maxParticipants: 40,
    rating: 4.8,
    reviews: 67,
    price: "$1,497",
    originalPrice: "$1,997",
    location: "Napa Valley, CA",
    timezone: "PST",
    language: ["English"],
    level: "All Levels",
    status: "trending",
    featured: true,
    tags: ["Corporate", "Team Building", "Wellness", "Retreat"],
    keyBenefits: [
      "Improve team communication",
      "Reduce workplace stress",
      "Increase employee engagement",
      "Build stronger team bonds",
      "Develop resilience strategies"
    ],
    curriculum: [
      {
        week: "Day 1",
        title: "Foundation Building",
        description: "Establishing the groundwork for mindful workplace practices.",
        lessons: [
          "Welcome and Introductions",
          "Mindfulness in the Workplace",
          "Team Assessment Activities",
          "Evening Reflection Session"
        ]
      }
    ],
    textTestimonials: [
      {
        text: "Our team dynamics completely changed after this retreat. Communication improved dramatically.",
        rating: 5,
        authorName: "Lisa Chen",
        authorLocation: "San Francisco, CA"
      }
    ],
    faq: [
      {
        question: "What's included in the retreat package?",
        answer: "All meals, accommodation, materials, and guided activities are included in the package."
      }
    ],
    registrationUrl: "https://bceoevents.com/register/corporate-retreat",
    sectionVisibility: {
      heroSection: true,
      aboutSection: true,
      benefitsSection: true,
      videoTestimonialSection: false,
      textTestimonialsSection: true,
      curriculumSection: true,
      faqSection: true,
      registrationCard: true,
      facilitatorCard: true,
      statsCard: false,
      upcomingSessionCard: false,
      relatedProgramsSection: true,
      countdownTimer: true
    }
  },
  {
    title: "Daily Mindfulness Practice",
    subtitle: "Build a Sustainable Daily Practice",
    shortDescription: "A 30-day guided program to establish and maintain a consistent daily mindfulness practice.",
    detailedDescription: "This program provides daily guided meditations, practical exercises, and community support to help you build a sustainable mindfulness practice that fits into your busy lifestyle.",
    category: "Daily",
    categoryColor: "from-yellow-500 to-orange-500",
    categoryBg: "bg-yellow-50",
    categoryText: "text-yellow-700",
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-02'),
    duration: "30 days",
    facilitator: {
      name: "Maria Santos",
      title: "Mindfulness Coach",
      bio: "Maria is a certified mindfulness coach with a passion for helping people integrate mindfulness into their daily lives.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      credentials: ["Certified Mindfulness Coach", "200-hour Yoga Teacher Training"],
      experience: "10+ years",
      studentsGuided: "3,000+"
    },
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    galleryImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    ],
    participants: 156,
    maxParticipants: 200,
    rating: 4.6,
    reviews: 234,
    price: "Free",
    location: "Online",
    timezone: "Multiple",
    language: ["English", "Spanish"],
    level: "Beginner",
    status: "published",
    featured: false,
    tags: ["Daily Practice", "Meditation", "Habit Building", "Community"],
    keyBenefits: [
      "Establish a daily practice",
      "Reduce stress and anxiety",
      "Improve sleep quality",
      "Increase focus and clarity",
      "Join a supportive community"
    ],
    curriculum: [
      {
        week: "Week 1",
        title: "Getting Started",
        description: "Introduction to daily mindfulness practice and setting up your routine.",
        lessons: [
          "Creating Your Practice Space",
          "5-Minute Morning Meditation",
          "Mindful Breathing Basics",
          "Evening Reflection"
        ]
      }
    ],
    textTestimonials: [
      {
        text: "The daily structure really helped me stick with meditation. Now it's a natural part of my routine.",
        rating: 5,
        authorName: "David Kim",
        authorLocation: "Los Angeles, CA"
      }
    ],
    faq: [
      {
        question: "Is this program really free?",
        answer: "Yes! This is our gift to the community to help more people experience the benefits of mindfulness."
      }
    ],
    registrationUrl: "https://bceoevents.com/register/daily-practice",
    sectionVisibility: {
      heroSection: true,
      aboutSection: true,
      benefitsSection: true,
      videoTestimonialSection: false,
      textTestimonialsSection: true,
      curriculumSection: true,
      faqSection: true,
      registrationCard: true,
      facilitatorCard: true,
      statsCard: false,
      upcomingSessionCard: false,
      relatedProgramsSection: true,
      countdownTimer: false
    }
  }
];

// Connect to database
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bceo-events';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed function
const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');
    
    // Clear existing data
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`✅ Created ${createdEvents.length} sample events`);
    
    // Create some sample registrations
    const sampleRegistrations = [
      {
        eventId: createdEvents[0]._id,
        eventTitle: createdEvents[0].title,
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1-555-0123",
        country: "United States",
        state: "California",
        city: "San Francisco",
        language: "English",
        receiveInfo: true,
        agreeTerms: true,
        status: "confirmed"
      },
      {
        eventId: createdEvents[1]._id,
        eventTitle: createdEvents[1].title,
        fullName: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1-555-0124",
        country: "United States",
        state: "New York",
        city: "New York",
        language: "English",
        receiveInfo: true,
        agreeTerms: true,
        status: "pending"
      },
      {
        eventId: createdEvents[2]._id,
        eventTitle: createdEvents[2].title,
        fullName: "Mike Johnson",
        email: "mike.johnson@example.com",
        phone: "+1-555-0125",
        country: "Canada",
        state: "Ontario",
        city: "Toronto",
        language: "English",
        receiveInfo: false,
        agreeTerms: true,
        status: "confirmed"
      }
    ];
    
    const createdRegistrations = await Registration.insertMany(sampleRegistrations);
    console.log(`✅ Created ${createdRegistrations.length} sample registrations`);
    
    console.log('🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Events: ${createdEvents.length}`);
    console.log(`   Registrations: ${createdRegistrations.length}`);
    
    // Display created events
    console.log('\n📅 Created Events:');
    createdEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} (${event.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedData();
};

// Check if this script is being run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedData, sampleEvents };