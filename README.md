# Task Manager

A responsive task management application built with Vue 3 and Supabase. Create, organize, and track tasks with a clean, modern interface that works seamlessly across desktop, and mobile devices.

## Demo
[Live Demo](https://taskmanger-osolutions.netlify.app/)

## Project Overview

This is a responsive full-stack task management system that allows users to create, edit, and organize tasks with categories, priorities, and due dates.

## Setup & Run Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/ammar-nasser1/task-manager
   cd task_manage
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment setup:
   The app uses Supabase for backend services. The API configuration is already set up in `src/api/config.js` with the necessary endpoints and authentication.

4. Start development server:

   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

The application will be available at `http://localhost:5173` in development mode.

## Framework Choice Justification

**Vue 3 over React**: 
- Vue was selected for this project due to my experience in vue in more production projects, built-in reactivity system, and component composition API.Vue's template syntax also makes it easier to build complex UI components with less boilerplate code.
- Documentation explains everything

## State Management Approach

The application uses Vue 3's Composition API with reactive references (`ref`) and computed properties for local component state. No external state management library is used - the app relies on:

- **Local component state**: `ref()` and `computed()` for component-level data
- **Direct API calls**: Axios for HTTP requests to Supabase
- **Reactive updates**: Vue's reactivity system handles UI updates automatically
- **Event-driven communication**: Props and events for parent-child component communication

## Component Architecture Overview

```
src/
├── api/
│   └── config.js          # Axios configuration and API endpoints
├── components/
│   ├── DashHeader.vue     # Top navigation header
│   ├── DashSideBar.vue    # Sidebar navigation
│   ├── GenericModal.vue   # Reusable modal component
│   ├── TaskCard.vue       # Individual task display card
│   ├── TaskDetail.vue     # Task detail view modal
│   └── TaskForm.vue       # Task creation/editing form
├── layout/
│   └── TaskDashLayout.vue # Main layout wrapper
├── views/
│   └── TaskList.vue       # Main task list page
├── router/
│   └── index.js           # Vue Router configuration
└── assets/                # Static assets
```

## Features Implemented

### Core Features

- **Task CRUD operations**: Create, read, update, and delete tasks
- **Category management**: Organize tasks by categories with custom colors and icons
- **Priority levels**: Set task priorities (low, medium, high)
- **Due date tracking**: Set and view task deadlines
- **Status management**: Mark tasks as completed/incomplete
- **Image attachments**: Add images to tasks with fallback handling
- **Responsive design**: Mobile-first approach with breakpoint optimization

### Additional Improvements

- **Pagination**: Efficient task loading with page-based navigation
- **Filtering**: Filter tasks by category, status, and priority
- **Modal system**: Reusable modal component for forms and details
- **Loading states**: Visual feedback during API operations
- **Error handling**: Graceful error handling with user feedback
- **Image optimization**: Lazy loading and error fallbacks for task images


## Screenshots



### Mobile View

![Mobile Interface](screenshots/mobile-interface.png)
_Mobile-optimized layout with collapsible sidebar_

### Task List View
![Desktop Dashboard](screenshots/desktop-dashboard.png)
_Main task list view with sidebar navigation and task cards_


### Task Detail View

![Task Detail](screenshots/task-detail.png)
_Task detail view with edit and delete options_

### Add Task Form

![Task Form](screenshots/task-form.png)
_Task creation/editing form with validation_


## Technologies Used

- **Vue 3** - Frontend framework with Composition API
- **Vite** - Build tool and development server
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Supabase** - Backend-as-a-Service for database and API
