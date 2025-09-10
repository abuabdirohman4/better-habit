# 🚀 Better Habit App - Complete Development TODO

Berdasarkan mockup yang diberikan, berikut adalah TODO list lengkap untuk membangun aplikasi habit tracker "Better Habit".

## LIST IDEA

- [ ] Setting that have list of habit to archive
- [ ] Take note time for pray, time actually did (like 3 km from 5 km target)

## ISSUE TRACKER

- [ ] isActive is false / 0 not hidden
- [ ] Move from home to create so slow and no loading (all move pages)

## REFACTORING

- [ ] Change type "isActive" to 0 or 1
- [ ] Remove Mock Data

## 📱 **1. Dashboard Page ("My Habits")**

### 1.1 Layout & Structure

- [x] ✅ Create `/dashboard` route dan `page.tsx`
- [x] ✅ Setup main layout dengan `min-h-screen bg-gray-50`
- [x] ✅ Integrate `SWRProvider` untuk data fetching
- [x] ✅ Disable authentication sementara untuk akses langsung

### 1.2 Header Section (Gradient Background)

- [x] ✅ Implement gradient background (blue to purple)
- [x] ✅ Display "Good Morning!" greeting
- [x] ✅ Display "Let's build great habits today" subtitle
- [x] ✅ Add user avatar/profile icon (top right)
- [x] ✅ Create "Current Streak" card dengan star icon

### 1.3 Weekly Progress Section

- [x] ✅ Create `WeeklyProgress` component
- [x] ✅ Implement bar chart dengan static data
- [x] ✅ Add day labels (M, T, W, T, F, S, S)
- [x] ✅ Style bars dengan gradient colors
- [ ] 🔄 **TODO**: Integrate dengan real data dari `useHabitLogs`

### 1.4 Today's Habits Section

- [x] ✅ Display "Today's Habits" title
- [x] ✅ Add circular "+" button (top right)
- [x] ✅ Create `HabitCard` component
- [x] ✅ Implement habit list dengan mock data
- [x] ✅ Add completion toggle buttons
- [ ] 🔄 **TODO**: Implement actual toggle functionality dengan `useHabitLogs`

### 1.5 Today's Progress Section

- [x] ✅ Display "Today's Progress" title
- [x] ✅ Show completion count ("1 of 3 completed")
- [x] ✅ Display percentage ("33%")
- [ ] 🔄 **TODO**: Calculate real completion percentage

### 1.6 Floating Add Button

- [x] ✅ Create `FloatingAddButton` component
- [x] ✅ Style sebagai circular blue button
- [x] ✅ Position di bottom center
- [x] ✅ Add navigation ke "Add New Habit" page

### 1.7 Bottom Navigation Bar

- [x] ✅ Create `BottomNavigationBar` component
- [x] ✅ Add Home icon dengan house icon
- [x] ✅ Add Stats icon dengan bar chart icon
- [x] ✅ Add Settings icon dengan gear icon
- [x] ✅ Highlight current page (Home untuk dashboard)
- [x] ✅ Style dengan proper spacing dan colors
- [x] ✅ Implement navigation logic untuk setiap tab
- [x] ✅ Add hover dan active states
- [x] ✅ Position fixed di bottom screen

---

## 🧭 **2. Bottom Navigation Bar (Priority)**

### 2.1 Component Creation

- [x] ✅ Create `components/BottomNavigationBar/index.tsx`
- [x] ✅ Design dengan 3 main tabs sesuai mockup
- [x] ✅ Add proper TypeScript interfaces
- [x] ✅ Implement responsive design

### 2.2 Navigation Tabs

- [x] ✅ **Home Tab**
    - [x] Add house icon (SVG)
    - [x] Label "Home"
    - [x] Link ke `/dashboard`
    - [x] Active state styling

- [x] ✅ **Stats Tab**
    - [x] Add bar chart icon (SVG)
    - [x] Label "Stats"
    - [x] Link ke `/statistics`
    - [x] Active state styling

- [x] ✅ **Settings Tab**
    - [x] Add gear icon (SVG)
    - [x] Label "Settings"
    - [x] Link ke `/settings`
    - [x] Active state styling

### 2.3 Styling & Behavior

- [x] ✅ Position fixed di bottom screen
- [x] ✅ Background white dengan subtle shadow
- [x] ✅ Proper spacing dan padding
- [x] ✅ Active tab highlighting dengan habit-blue color
- [x] ✅ Smooth transitions dan hover effects
- [x] ✅ Mobile-friendly touch targets (min 44px)

### 2.4 Integration

- [x] ✅ Add ke `app/layout.tsx` untuk global access
- [x] ✅ Implement Next.js router navigation
- [x] ✅ Add active state detection berdasarkan current route
- [x] ✅ Test navigation di semua pages

---

## 📊 **3. Statistics Page**

### 3.1 Header Section

- [x] ✅ Create statistics header dengan gradient background
- [x] ✅ Display "Statistics" title
- [x] ✅ Add bar chart icon (top right)

### 3.2 Stats Cards

- [x] ✅ Create "Day Streak" card dengan yellow star
- [x] ✅ Create "Success Rate" card dengan green checkmark
- [x] ✅ Display "7" dan "85%" dengan proper styling

### 3.3 Monthly Calendar Section

- [x] ✅ Create "This Month" section
- [x] ✅ Add month navigation (December 2024)
- [x] ✅ Implement calendar grid dengan day headers
- [x] ✅ Style calendar cells berdasarkan status:
    - Green circle untuk "Completed" days
    - Pink circle untuk "Missed" days
    - Blue circle untuk "Today"
    - Gray untuk future days
- [x] ✅ Add calendar legend (Completed, Missed, Today)

### 3.4 Habit Performance Section

- [x] ✅ Create "Habit Performance" section
- [x] ✅ Display habit cards dengan performance metrics
- [x] ✅ Show streak count dan success rate per habit
- [x] ✅ Style dengan appropriate colors

### 3.5 Bottom Navigation

- [x] ✅ Use existing `BottomNavigationBar` component
- [x] ✅ Highlight Stats tab sebagai active
- [x] ✅ Ensure proper navigation state

---

## ➕ **4. Add New Habit Page**

### 4.1 Header & Navigation

- [x] ✅ Create header dengan back arrow
- [x] ✅ Display "Add New Habit" title
- [x] ✅ Implement back navigation

### 4.2 Form Sections

- [x] ✅ Create "Habit Name" input field
- [x] ✅ Add placeholder "e.g. Morning Run"

### 4.3 Icon Selection

- [x] ✅ Create "Choose Icon" section
- [x] ✅ Implement icon grid dengan circular buttons
- [x] ✅ Add icons: run, meditation, water, book, sleep, exercise
- [x] ✅ Implement selection state (blue border untuk selected)

### 4.4 Frequency Selection

- [x] ✅ Create "Frequency" section
- [x] ✅ Add pill buttons: Daily, Weekly, Custom
- [x] ✅ Implement selection state (blue untuk selected)

### 4.5 Days of Week Selection

- [x] ✅ Create "Days of Week" section
- [x] ✅ Add circular day buttons (M, T, W, T, F, S, S)
- [x] ✅ Implement multi-selection state
- [x] ✅ Style selected days dengan blue background

### 4.6 Reminder Settings

- [x] ✅ Create "Reminder" section
- [x] ✅ Add toggle switch untuk enable/disable
- [x] ✅ Create time picker dropdown ("7:00 AM")
- [x] ✅ Style dengan chevron icon

### 4.7 Goal Settings (Optional)

- [x] ✅ Create "Goal (optional)" section
- [x] ✅ Add number input field ("e.g. 5")
- [x] ✅ Add unit dropdown ("km")
- [x] ✅ Style dengan proper spacing

### 4.8 Form Submission

- [x] ✅ Create "Save Habit" button
- [x] ✅ Implement form validation
- [x] ✅ Connect dengan `useHabits.createHabit`
- [x] ✅ Add success/error handling
- [x] ✅ Navigate back ke dashboard setelah save

### 4.9 Bottom Navigation

- [x] ✅ Use existing `BottomNavigationBar` component
- [x] ✅ Ensure proper back navigation

---

## 🔧 **5. Component Refinements**

### 5.1 HabitCard Component

- [x] ✅ Fix duplicate icon map entries
- [x] ✅ Implement basic card layout
- [x] ✅ Refine icon styling dengan proper colors
- [x] ✅ Improve completion button styling
- [x] ✅ Add proper hover states
- [ ] **TODO**: Implement actual toggle functionality

### 5.2 WeeklyProgress Component

- [x] ✅ Create basic bar chart
- [x] ✅ Refine bar colors dan styling
- [x] ✅ Add smooth animations
- [ ] **TODO**: Integrate dengan real data

### 5.3 BottomNavigationBar Component

- [x] ✅ Create `BottomNavigationBar` component
- [x] ✅ Design dengan 3 tabs: Home, Stats, Settings
- [x] ✅ Add proper icons untuk setiap tab
- [x] ✅ Implement active state styling
- [x] ✅ Add navigation logic dengan Next.js router
- [x] ✅ Style dengan mockup colors dan spacing
- [x] ✅ Add smooth transitions dan hover effects
- [x] ✅ Ensure mobile-friendly touch targets

---

## 🗄️ **6. Data Management & API Integration**

### 6.1 Google Sheets Integration

- [x] ✅ Install dependencies (SWR, Papa Parse, Google APIs)
- [x] ✅ Create Google Sheets client
- [x] ✅ Setup CSV parsing dengan Papa Parse
- [x] ✅ Create API routes untuk habits
- [ ] **TODO**: Create API routes untuk habit logs
- [ ] **TODO**: Implement authentication untuk private sheets

### 6.2 Custom Hooks

- [x] ✅ Create `useHabits` hook dengan mock data
- [ ] **TODO**: Implement `useHabitLogs` hook
- [ ] **TODO**: Add `toggleCompletion` functionality
- [ ] **TODO**: Add `addLog`, `updateLog` methods
- [ ] **TODO**: Replace mock data dengan real API calls

### 6.3 Data Types

- [x] ✅ Define `Habit` interface
- [x] ✅ Define `HabitLog` interface
- [x] ✅ Define `CreateHabitData` interface
- [ ] **TODO**: Add validation schemas
- [ ] **TODO**: Add error handling types

---

## 🎨 **7. UI/UX Improvements**

### 7.1 Design System

- [x] ✅ Setup Tailwind CSS dengan DaisyUI
- [x] ✅ Define color palette (Primary #1496F6, Success #10b981)
- [x] ✅ Setup Inter font family
- [ ] **TODO**: Create consistent spacing system
- [ ] **TODO**: Add animation utilities
- [ ] **TODO**: Create responsive breakpoints

### 7.2 Component Library

- [x] ✅ Create `Button` component
- [x] ✅ Create `Spinner` component
- [ ] **TODO**: Create `Modal` component
- [ ] **TODO**: Create `Input` component
- [ ] **TODO**: Create `Toggle` component
- [ ] **TODO**: Create `Calendar` component

### 7.3 Responsive Design

- [ ] **TODO**: Ensure mobile-first design
- [ ] **TODO**: Test pada berbagai screen sizes
- [ ] **TODO**: Optimize touch interactions
- [ ] **TODO**: Add proper loading states

---

## 🚀 **8. Advanced Features**

### 8.1 Habit Tracking

- [ ] **TODO**: Implement streak calculation
- [ ] **TODO**: Add habit completion history
- [ ] **TODO**: Create habit analytics
- [ ] **TODO**: Add habit reminders

### 8.2 Data Visualization

- [ ] **TODO**: Create progress charts
- [ ] **TODO**: Add habit performance graphs
- [ ] **TODO**: Implement calendar heatmap
- [ ] **TODO**: Add achievement badges

### 8.3 User Experience

- [ ] **TODO**: Add haptic feedback
- [ ] **TODO**: Implement pull-to-refresh
- [ ] **TODO**: Add offline support
- [ ] **TODO**: Create onboarding flow

---

## 🧪 **9. Testing & Quality Assurance**

### 9.1 Unit Testing

- [ ] **TODO**: Test custom hooks
- [ ] **TODO**: Test component rendering
- [ ] **TODO**: Test form validation
- [ ] **TODO**: Test API integration

### 9.2 Integration Testing

- [ ] **TODO**: Test complete user flows
- [ ] **TODO**: Test data persistence
- [ ] **TODO**: Test error handling
- [ ] **TODO**: Test responsive behavior

### 9.3 Performance Testing

- [ ] **TODO**: Optimize bundle size
- [ ] **TODO**: Test loading performance
- [ ] **TODO**: Optimize images
- [ ] **TODO**: Add performance monitoring

---

## 📦 **10. Deployment & Production**

### 10.1 Environment Setup

- [ ] **TODO**: Setup environment variables
- [ ] **TODO**: Configure Google Sheets credentials
- [ ] **TODO**: Setup production database
- [ ] **TODO**: Configure domain dan SSL

### 10.2 Build Optimization

- [ ] **TODO**: Optimize Next.js build
- [ ] **TODO**: Setup code splitting
- [ ] **TODO**: Configure caching
- [ ] **TODO**: Setup CDN

### 10.3 Monitoring & Analytics

- [ ] **TODO**: Setup error tracking
- [ ] **TODO**: Add user analytics
- [ ] **TODO**: Monitor performance
- [ ] **TODO**: Setup alerts

---

## 📋 **11. Documentation & Maintenance**

### 11.1 Code Documentation

- [ ] **TODO**: Add JSDoc comments
- [ ] **TODO**: Create component documentation
- [ ] **TODO**: Document API endpoints
- [ ] **TODO**: Create setup guide

### 11.2 User Documentation

- [ ] **TODO**: Create user manual
- [ ] **TODO**: Add FAQ section
- [ ] **TODO**: Create video tutorials
- [ ] **TODO**: Setup help center

---

## 🎯 **Priority Levels**

- **🔴 High Priority**: Core functionality (Dashboard, Bottom Navigation, Add Habit, Data Management)
- **🟡 Medium Priority**: Statistics page, Advanced features
- **🟢 Low Priority**: Testing, Documentation, Advanced UI

---

## 📅 **Estimated Timeline**

- **Week 1**: Complete Dashboard page, Bottom Navigation, dan basic components
- **Week 2**: Implement Add New Habit page dan form handling
- **Week 3**: Create Statistics page dan data visualization
- **Week 4**: API integration, testing, dan deployment

---

_Last Updated: $(date)_
_Status: In Progress_ 🚀
