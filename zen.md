# Zen Brain - Project Knowledge

> Generated: 2025-08-07T13:38:58.081Z
> Session: ac0c2a99-6a08-41b4-9a2a-488db74e7e2b

## Key Findings

### Technology Stack & Architecture
- **Framework**: Next.js with App Router and TypeScript with strict type checking
- **Frontend**: React with hooks-based architecture pattern
- **Styling**: Tailwind CSS (evidenced by className patterns like "text-xs text-gray-500")
- **Icons**: Heroicons React v2.0.18 for UI components
- **Architecture**: Component-based with organized folder structure and custom hooks pattern

### Core Application Purpose
- **Primary Function**: Admin management system with draft management capabilities
- **Key Features**: 
  - Multi-step admin workflows (wizard pattern)
  - Draft creation and editing capabilities
  - Timestamp tracking for last updated times
  - User-friendly relative time display ("2 hours ago", etc.)
  - Basic details collection in stepped processes
  - Add/create functionality throughout admin interface

## Architecture Patterns

### Component Organization
- **Admin Interface**: Structured step-based components in `./components/admin/steps/`
- **Multi-step Workflows**: Wizard pattern implementation for admin processes
- **Client-side Rendering**: Next.js App Router with `'use client'` directive for interactive components
- **Hooks-based Architecture**: Custom hooks centralized in `src/hooks/` directory
- **Utility Separation**: Dedicated utility files for common functions (e.g., `src/utils/dateUtils.ts`)

### Code Structure Patterns
- **Modular Organization**: Components separated by feature/role (admin components isolated)
- **TypeScript Patterns**: 
  - Optional properties with `?:` syntax
  - Strict typing for all data models and interfaces
  - Defensive programming with null/undefined checks
- **Icon Usage**: Consistent Heroicons import pattern using outline (`@heroicons/react/24/outline`) and solid (`@heroicons/react/24/solid`) variants

### Error Handling & Resilience
- **Graceful Degradation**: Functions return fallback values (e.g., 'Unknown') when data is missing
- **Defensive Coding**: Consistent null/undefined checks throughout utility functions
- **Type Safety**: Strict TypeScript enforcement prevents runtime errors

## Critical Components

### Core System Components
- **`src/hooks/useDrafts.ts`**: Central hook managing draft data, types, and state
- **`src/utils/dateUtils.ts`**: Contains `getTimeAgo()` utility for relative time formatting
- **`BasicDetailsStep.tsx`**: Admin interface component for multi-step workflow basic details collection

### Admin Interface Components
- **Step-based Components**: Located in `./components/admin/steps/` directory
- **Interactive Elements**: Client-side components with add/create functionality (PlusIcon usage)
- **Workflow Management**: Multi-step processes for admin operations

## Data Models & Business Logic

### Draft Management System
- **Draft Data Model**: Includes `updatedAt` timestamps for modification tracking
- **State Management**: Centralized draft state through custom hooks pattern
- **Time Management**: Sophisticated date/time handling with user-friendly formatting

### Admin Workflow System
- **Multi-step Processes**: Structured admin workflows requiring step-by-step completion
- **Basic Details Collection**: Systematic approach to gathering required information
- **Create/Add Operations**: Consistent patterns for adding new items across admin interface

## Development Approach

### Technical Implementation
- **Separation of Concerns**: Business logic separated from presentation components
- **Type Safety First**: Strict TypeScript enforcement ensures data integrity
- **User Experience Focus**: 
  - Relative time display enhances usability
  - Step-based workflows improve admin task completion
  - Intuitive icon usage for common actions

### Code Quality Patterns
- **Import Organization**: Consistent patterns for external dependencies
- **Component Reusability**: Modular design enables component reuse across admin interface
- **Error Prevention**: TypeScript strict mode catches import path errors and type mismatches

---
*This file is automatically updated by Zen Agent to maintain project knowledge.*