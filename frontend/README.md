# SaaS Notes Frontend

A modern, responsive frontend for the SaaS Notes application built with React, Vite, and Tailwind CSS.

## Features

- **Authentication**: Login and registration with JWT tokens
- **Dashboard**: Overview of notes with statistics
- **Notes Management**: Create, read, update, delete notes
- **Advanced Features**:
  - Note pinning and archiving
  - Category management
  - Search functionality
  - Color coding
  - Tags support
  - Responsive design
- **Modern UI**: Built with Tailwind CSS and Lucide React icons

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Date-fns** - Date formatting

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Dashboard.jsx
│   └── notes/
│       ├── NoteCard.jsx
│       ├── NoteForm.jsx
│       └── NotesList.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. The app will be available at `http://localhost:5173`

## Environment Variables

The frontend connects to the backend API at `http://localhost:5000/api` by default. Make sure your backend server is running on that port.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- Secure login and registration
- JWT token management
- Protected routes
- Automatic token refresh

### Dashboard
- Statistics overview
- Recent notes display
- Pinned notes section
- Quick actions

### Notes Management
- Create, edit, and delete notes
- Rich text editing
- Category organization
- Tag system
- Color coding
- Pin and archive functionality
- Search and filter
- Pagination

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Modern UI components

## API Integration

The frontend communicates with the backend through the `api.js` service file, which includes:
- Axios configuration with interceptors
- Automatic token attachment
- Error handling
- Request/response transformation

## Styling

The application uses Tailwind CSS for styling with:
- Custom color palette
- Responsive utilities
- Component-based design
- Dark mode support (ready for implementation)
- Custom animations and transitions
