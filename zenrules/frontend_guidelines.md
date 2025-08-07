# Frontend Guidelines - Buddha CEO Dynamic Website

## Overview
This document establishes design and development standards for the Buddha CEO dynamic website, inspired by the District by Zomato interface aesthetic - clean, modern, and engaging.

## Tech Stack

### Core Technologies
- **Frontend Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS 3.4+
- **Component Library**: Headless UI + Custom Components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Image Optimization**: Next.js Image component
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React State + Context API

### Development Tools
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js config + custom rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality control

## Design System

### Color Palette

#### Primary Colors (Buddha CEO Brand)
```css
/* Primary Buddha CEO Colors */
--buddha-primary: #7C3AED;     /* Deep purple */
--buddha-secondary: #A855F7;   /* Medium purple */
--buddha-accent: #C084FC;      /* Light purple */

/* Supporting Colors */
--buddha-orange: #FB923C;      /* Warm orange accent */
--buddha-coral: #F97316;       /* Coral highlight */
--buddha-gold: #FCD34D;        /* Golden accent */
```

#### Neutral Colors
```css
/* Background & Text */
--bg-primary: #FFFFFF;         /* Pure white */
--bg-secondary: #F8FAFC;       /* Light gray */
--bg-tertiary: #F1F5F9;        /* Subtle gray */

--text-primary: #0F172A;       /* Dark slate */
--text-secondary: #475569;     /* Medium gray */
--text-muted: #94A3B8;         /* Light gray */
```

#### Status Colors
```css
--success: #10B981;            /* Green */
--warning: #F59E0B;            /* Amber */
--error: #EF4444;              /* Red */
--info: #3B82F6;               /* Blue */
```

### Typography

#### Font Stack
```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Headings */
font-family: 'Poppins', 'Inter', sans-serif;
```

#### Font Scale
```css
/* Headings */
.text-hero: 3.75rem;    /* 60px - Hero titles */
.text-4xl: 2.25rem;     /* 36px - Page titles */
.text-3xl: 1.875rem;    /* 30px - Section titles */
.text-2xl: 1.5rem;      /* 24px - Card titles */
.text-xl: 1.25rem;      /* 20px - Subheadings */

/* Body Text */
.text-lg: 1.125rem;     /* 18px - Large body */
.text-base: 1rem;       /* 16px - Regular body */
.text-sm: 0.875rem;     /* 14px - Small text */
.text-xs: 0.75rem;      /* 12px - Captions */
```

#### Font Weights
```css
.font-light: 300;
.font-normal: 400;
.font-medium: 500;
.font-semibold: 600;
.font-bold: 700;
.font-extrabold: 800;
```

## Layout System

### Grid & Spacing
```css
/* Container Widths */
.container-sm: max-width: 640px;
.container-md: max-width: 768px;
.container-lg: max-width: 1024px;
.container-xl: max-width: 1280px;
.container-2xl: max-width: 1536px;

/* Standard Spacing Scale */
.space-xs: 0.5rem;      /* 8px */
.space-sm: 1rem;        /* 16px */
.space-md: 1.5rem;      /* 24px */
.space-lg: 2rem;        /* 32px */
.space-xl: 3rem;        /* 48px */
.space-2xl: 4rem;       /* 64px */
.space-3xl: 6rem;       /* 96px */
```

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px;     /* Small tablets */
md: 768px;     /* Tablets */
lg: 1024px;    /* Small laptops */
xl: 1280px;    /* Laptops */
2xl: 1536px;   /* Large screens */
```

## Component Standards

### Card Components
```tsx
// Standard card styling pattern
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
  <div className="aspect-video relative overflow-hidden">
    {/* Image content */}
  </div>
  <div className="p-6">
    {/* Card content */}
  </div>
</div>
```

### Button Variants
```tsx
// Primary Button
<button className="bg-gradient-to-r from-buddha-primary to-buddha-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">

// Secondary Button  
<button className="bg-white border-2 border-buddha-primary text-buddha-primary px-6 py-3 rounded-xl font-semibold hover:bg-buddha-primary hover:text-white transition-all duration-200">

// Ghost Button
<button className="text-buddha-primary hover:text-buddha-secondary px-6 py-3 rounded-xl font-semibold hover:bg-buddha-accent/10 transition-all duration-200">
```

### Navigation Pattern
```tsx
// Header Navigation
<nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4">
    {/* Logo, navigation items, search, user menu */}
  </div>
</nav>
```

## Page Layout Patterns

### Hero Sections
```tsx
// Program Hero Layout
<section className="relative bg-gradient-to-br from-buddha-primary via-buddha-secondary to-buddha-accent min-h-[70vh] flex items-center">
  <div className="absolute inset-0 bg-black/20"></div>
  <div className="container mx-auto px-4 relative z-10 text-white">
    {/* Hero content */}
  </div>
</section>
```

### Content Sections
```tsx
// Standard content section
<section className="py-16 lg:py-24">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        Section Title
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Section description
      </p>
    </div>
    {/* Section content */}
  </div>
</section>
```

### Card Grids
```tsx
// Responsive card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
  {/* Card components */}
</div>
```

## Interactive Elements

### Hover Effects
```css
/* Card hover effects */
.card-hover {
  @apply transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300;
}

/* Button hover effects */
.btn-hover {
  @apply transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200;
}

/* Image hover effects */
.img-hover {
  @apply transform hover:scale-105 transition-transform duration-500;
}
```

### Loading States
```tsx
// Skeleton loading pattern
<div className="animate-pulse">
  <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
  <div className="bg-gray-200 rounded h-4 mb-2"></div>
  <div className="bg-gray-200 rounded h-4 w-3/4"></div>
</div>
```

## Form Design Standards

### Input Styling
```tsx
// Standard input field
<input className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-buddha-primary focus:ring-4 focus:ring-buddha-primary/10 outline-none transition-all duration-200" />

// Textarea
<textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-buddha-primary focus:ring-4 focus:ring-buddha-primary/10 outline-none transition-all duration-200 resize-vertical min-h-[120px]" />

// Select dropdown
<select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-buddha-primary focus:ring-4 focus:ring-buddha-primary/10 outline-none transition-all duration-200 bg-white" />
```

### Form Sections
```tsx
// Form section wrapper
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
  <h3 className="text-xl font-semibold text-gray-900 mb-6">Section Title</h3>
  {/* Form fields */}
</div>
```

## Image & Media Guidelines

### Image Optimization
- Use Next.js Image component for all images
- Provide proper alt text for accessibility
- Use appropriate aspect ratios (16:9 for hero, 4:3 for cards)
- Implement lazy loading for performance

### Video Integration
```tsx
// Video container with aspect ratio
<div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
  <iframe 
    className="w-full h-full"
    src="video-url"
    loading="lazy"
  />
</div>
```

## Animation Guidelines

### Micro-interactions
```tsx
// Framer Motion variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Page Transitions
- Use smooth fade-in animations for page loads
- Implement staggered animations for lists and grids
- Keep animation durations between 200-500ms for responsiveness

## Accessibility Standards

### Color Contrast
- Maintain WCAG AA compliance (4.5:1 ratio minimum)
- Test with color blindness simulators
- Provide text alternatives for color-coded information

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Implement proper focus indicators
- Use semantic HTML elements

### Screen Readers
- Use proper heading hierarchy (h1 → h2 → h3)
- Provide descriptive link text
- Implement ARIA labels where necessary

## Performance Guidelines

### Code Splitting
- Implement route-based code splitting
- Lazy load non-critical components
- Use dynamic imports for heavy libraries

### Image Optimization
- Use WebP format with fallbacks
- Implement responsive images with srcset
- Compress images without quality loss

### Bundle Size
- Monitor bundle size with webpack-bundle-analyzer
- Tree-shake unused code
- Use production builds for deployment

## File Organization

```
src/
├── app/                    # Next.js app directory
├── components/            
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── program/           # Program-specific components
├── lib/                   # Utilities and configurations
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── styles/                # Global styles and Tailwind config
└── public/                # Static assets
```

## Component Naming Conventions

### React Components
- Use PascalCase for component names
- Use descriptive, semantic names
- Include component type in name when helpful

```tsx
// Good examples
ProgramCard.tsx
NavigationMenu.tsx
TestimonialSlider.tsx
ContactForm.tsx

// File structure
ProgramCard/
├── index.ts              # Export
├── ProgramCard.tsx       # Main component
├── ProgramCard.test.tsx  # Tests
└── ProgramCard.stories.tsx # Storybook
```

### CSS Classes
- Use Tailwind utility classes primarily
- Create custom classes only when necessary
- Follow BEM methodology for custom CSS

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Ensure core functionality works without JavaScript
- Implement graceful degradation for advanced features
- Test on mobile devices regularly

## Testing Standards

### Component Testing
- Use React Testing Library for component tests
- Test user interactions, not implementation details
- Maintain minimum 80% test coverage

### Visual Testing
- Use Storybook for component documentation
- Implement visual regression testing
- Test responsive designs across breakpoints

## Deployment Checklist

### Pre-deployment
- [ ] Run type checking
- [ ] Run linting
- [ ] Run all tests
- [ ] Check bundle size
- [ ] Test on multiple devices
- [ ] Verify accessibility compliance

### Post-deployment
- [ ] Test all critical user flows
- [ ] Monitor performance metrics
- [ ] Check for console errors
- [ ] Verify SEO meta tags

---

## Quick Reference

### Common Tailwind Patterns
```css
/* Card shadow */
.card-shadow { @apply shadow-sm hover:shadow-lg; }

/* Gradient backgrounds */
.gradient-primary { @apply bg-gradient-to-r from-buddha-primary to-buddha-secondary; }

/* Focus states */
.focus-primary { @apply focus:border-buddha-primary focus:ring-4 focus:ring-buddha-primary/10; }

/* Transition effects */
.transition-all { @apply transition-all duration-300 ease-in-out; }
```

### Component Props Patterns
```tsx
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}
```