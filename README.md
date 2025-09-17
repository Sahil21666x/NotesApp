# SaaS Notes MERN Application

A full-stack notes application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to create, manage, and organize their notes with advanced features like pinning, archiving, categorization, and search.

## 🚀 Features

### Backend Features
- **User Authentication**: JWT-based authentication with registration and login
- **Notes Management**: Full CRUD operations for notes
- **Advanced Features**: 
  - Note pinning and archiving
  - Category management
  - Search functionality
  - Pagination
  - Color coding
  - Tags support
- **Security**: Password hashing, input validation, and protected routes
- **Database**: MongoDB with Mongoose ODM

### Frontend Features
- **Modern UI**: Built with React 19 and Tailwind CSS
- **Authentication**: Secure login and registration forms
- **Dashboard**: Overview with statistics and recent notes
- **Notes Management**: Intuitive interface for creating and managing notes
- **Responsive Design**: Mobile-first approach with tablet and desktop support
- **Real-time Updates**: Instant feedback with toast notifications

## 📁 Project Structure

```
saas-notes-mern/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd saas-notes-mern
```

2. **Set up the Backend**
```bash
cd backend
npm install
```

3. **Create environment file**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saas-notes
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. **Start the Backend Server**
```bash
npm run dev
```
The backend will run on `http://localhost:5000`

5. **Set up the Frontend**
```bash
cd ../frontend
npm install
```

6. **Start the Frontend Development Server**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Notes Endpoints
- `GET /api/notes` - Get all notes (with pagination, search, filtering)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/pin` - Toggle pin status
- `PATCH /api/notes/:id/archive` - Toggle archive status
- `GET /api/notes/categories/list` - Get all categories

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your notes overview and statistics
3. **Create Notes**: Click "New Note" to create a new note
4. **Manage Notes**: Edit, delete, pin, or archive your notes
5. **Organize**: Use categories, tags, and colors to organize your notes
6. **Search**: Use the search functionality to find specific notes

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Update environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Note Taking! 📝**