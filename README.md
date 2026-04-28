# MyDiary - A Playful Journal for Kids 🌟

MyDiary is a modern, illustrative digital journal designed specifically for children, paired with a robust premium hub for parents. It creates a playful "planner-style" experience where kids can track their habits, reflect on their moral growth, and celebrate their daily achievements, while giving parents full visibility and customization control.

## ✨ The Child Experience

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
- **Dynamic Checklists**: Two-column habit lists for prayers, manners, and health, controlled by parent configurations.

### 🗓️ Planning & Growth
- **Monthly Planning**: Interactive "Edit Mode" schedule with customizable task names and precise time-range selectors (From/To).
- **Yearly Vision**: Set annual goals and a personal "Vision for the Year" with a dedicated long-term planning interface.
- **Milestones Hub**: A dashboard section to track Monthly Analysis, Yearly Planning, and Year-End Reviews in one place.

## 👨‍👩‍👧 The Premium Parent Hub

### 📊 Multi-Child Dashboard
- **Child Selector**: Seamlessly switch between multiple linked child accounts using a global context dropdown.
- **Progress Snapshot**: View daily summary cards showing total entries, average scores, and total points accumulated.

### 📈 Detailed Reporting
- **Performance Analytics**: Track average daily scores and pinpoint trends with premium visual stat cards.
- **Read-Only Diary Access**: Click on any past entry to view the exact "Planner Sheet" the child filled out, securely locked in a read-only mode to prevent accidental edits.
- **Moral Hero Insights**: Actionable, auto-generated suggestions to help parents encourage their children based on recent activity data.

### ⚙️ Advanced Activity Management
- **Custom Categories**: Create new, personalized activity categories specific to a child.
- **Visibility Toggles**: Hide or show specific activities so children only see what is relevant to them right now.
- **Dynamic Scoring Modes**: 
  - **Group Mode**: All activities inherit the base points defined by the category.
  - **Individual Mode**: Override points on a per-activity basis for fine-grained reward tuning.

### 💌 Encouragement Reviews
- **Send Love**: Write motivational reviews that appear directly on the child's dashboard to encourage their progress.

## 🚀 Technical Features
- **Next.js 15 (App Router)**: Blazing fast performance and modern routing.
- **Vanilla CSS Architecture**: Custom token system for pastels, glassmorphism, and fully responsive layouts.
- **Session Stability**: Persistent 7-day JWT sessions.
- **Icon Engine**: Powered by `lucide-react` for scalable and consistent vector icons.

## 🗄️ Backend & ORM
### 🛠 Architecture & Structure

The project is divided into three main modules for maximum clarity and maintainability:

-   **`src/frontend`**: React components, contexts (Auth, Child), and UI logic.
-   **`src/backend`**: Prisma ORM, services (Business logic with robust null-checks), and API handlers.
-   **`src/shared`**: Shared types, constants, and utilities used by both.

### 🗄 Database Management

This project uses **Prisma ORM** with **SQLite**. The schema features a self-referencing `User` model to link parents to their children efficiently.

To view and edit your data through a beautiful web interface:

1.  Open your terminal in the project root.
2.  Run the following command:
    ```bash
    npx prisma studio
    ```
3.  Access the UI at `http://localhost:5555`.

## 👥 Multi-User Architecture
The system supports three distinct roles with specific access levels:
1. **Child**: Can manage their own diary entries and personal goals.
2. **Parent**: Linked to specific children, allowing them to view data, write reviews, and manage activity configurations.
3. **Admin**: Full read/write access to all users and global system configuration.

### 🚀 Getting Started

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
5. **Visit**: [http://localhost:3000](http://localhost:3000)
