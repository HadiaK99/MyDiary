# MyDiary - A Playful Journal for Kids 🌟

MyDiary is a modern, illustrative digital journal designed specifically for children. It moves away from rigid forms to create a playful "planner-style" experience where kids can track their habits, reflect on their moral growth, and celebrate their daily achievements.

## ✨ The Journal Experience

### 📅 Playful Dashboard
- **Daily Greeting**: Personalized "Hello" with an illustrative featured card.
- **Visual Day Selector**: Easily navigate through the week with a colorful horizontal calendar.
- **Quick Journal Cards**: Colorful shortcuts for gratitude, intentions, and emotion tracking.

### 📔 Daily Planner Entries
- **Hand-drawn Aesthetic**: A "Planner Sheet" layout with decorative borders and dashed lines.
- **Visual Trackers**:
  - **Hydration**: Clickable water cup icons to track glass intake.
  - **Rest**: Moon icons to log hours of sleep.
  - **Mood**: One-click emotion selector (Happy, Fun, Tired, etc.).
- **Dynamic Checklists**: Two-column habit lists for prayers, manners, and health.

### 🗓️ Planning & Growth
- **Monthly Planning**: Interactive "Edit Mode" schedule with customizable task names and precise time-range selectors (From/To).
- **Yearly Vision**: Set annual goals and a personal "Vision for the Year" with a dedicated long-term planning interface.
- **Milestones Hub**: A dashboard section to track Monthly Analysis, Yearly Planning, and Year-End Reviews in one place.

### 🏆 Points & Performance
- **Encouraging Feedback**: Performance ratings use positive, growth-oriented labels:
  - **Superstar! 🌟** (85%+)
  - **Doing Great! ✨** (65%+)
  - **Solid Progress 💪** (40%+)
  - **Needs Focus ❤️** (<40%)
- **Automatic Scoring**: A background engine tracks progress across habit categories with weighted points.
- **Data Aggregation**: Monthly and Annual reports synchronize with daily entries to provide a cohesive view of progress.

### 🛠 Visual Design & Navigation
- **Kid-Friendly Typography**: Using **Fredoka** and **Quicksand** fonts for a soft, rounded feel.
- **Lucide React Icons**: Replaced decorative emojis with a sleek, consistent set of professional icons for actions, tracking, and navigation.
- **Clean Navigation**: Circular chevron back buttons and pill-shaped interactive elements.
- **Dashboard Hub**: A persistent header allows easy access to the Home screen from any page except the dashboard itself.

## 🚀 Technical Features
- **Next.js 15 (App Router)**: Blazing fast performance and modern routing.
- **Vanilla CSS Architecture**: Custom token system for pastels and glassmorphism.
- **Icon Engine**: Powered by `lucide-react` for scalable and consistent vector icons.
- **Client-Side Persistence**: Data is saved to `localStorage` for privacy and instant responsiveness.

## 🗄️ Backend & ORM
### 🛠 Architecture & Structure

The project is divided into three main modules for maximum clarity and maintainability:

-   **`src/frontend`**: React components, contexts (Auth), and UI logic.
-   **`src/backend`**: Prisma ORM, services (Business logic), and API handlers.
-   **`src/shared`**: Shared types, constants, and utilities used by both.

### 🗄 Database Management

This project uses **Prisma ORM** with **SQLite**. To view and edit your data through a beautiful web interface:

1.  Open your terminal in the project root.
2.  Run the following command:
    ```bash
    npx prisma studio
    ```
3.  Access the UI at `http://localhost:5555`.

## 👥 Multi-User Architecture
The system supports three distinct roles with specific access levels:
1. **Child**: Can manage their own diary entries and personal goals.
2. **Parent**: Linked to a specific child, allowing them to view that child's data and write reviews.
3. **Admin**: Full read/write access to all users and global system configuration (tasks/categories).

### 🚀 Getting Started (Backend)

1.  **Install dependencies**: `npm install`
2.  **Initialize Database**: 
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```
3.  **Seed Default Data**:
    ```bash
    node prisma/seed.js
    ```
4.  **Run Development Server**: `npm run dev`
4. **Visit**: [http://localhost:3000](http://localhost:3000)
