# MyDiary - Kids' Moral & Spiritual Journal

A modern, vibrant digital diary designed for children to track their daily activities, moral growth, and spiritual goals. Built with **Next.js** and **Vanilla CSS** for a premium, lightweight experience.

## ✨ Key Features

- **Premium Dashboard**: welcoming home screen with custom-generated illustrations and progress tracking.
- **Weekly Habit Tracker**: Digital grid for tracking 30+ activities (Prayers, Manners, Health, etc.).
- **Interactive Onboarding**: Personalized profile setup including the "Bio Page" and Annual Focuses/Resolutions.
- **Monthly Analysis & Planning**: Reflection tools for previous months and scheduling tools for the next.
- **Year-End Review**: A celebratory section to evaluate annual progress.

## 🚀 Getting Started

To run the application locally:

1. **Navigate to the project**:
   ```bash
   cd /Users/mac/Documents/Projects/personal-projects/MyDiary
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**: [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS (Custom design system, Glassmorphism)
- **Typography**: Outfit (Google Fonts)
- **Icons**: Custom 2D Illustrations

---

## 🕒 Recent Changes

### 2026-04-14
- **Documentation**: Created project README based on initial implementations.
- **Technical Fixes**: Added `'use client'` directives to `WeeklyDiary`, `MonthlyAnalysis`, and `MonthlyPlanning` pages to comply with Next.js App Router requirements for client-side state.
- **Compatibility**: Fixed dynamic routing issues in Next.js 15+ by properly unwrapping `params` in core pages.

### 2026-04-13
- **Initial Build**: Completed core application structure including Dashboard, Onboarding, and Weekly Grid.
- **Design System**: Established a global Vanilla CSS design system with HSL-based colors and animation tokens.
- **Illustration**: Generated a custom cover illustration for the landing page.
