# SaaS Notes Backend

A robust backend API for a SaaS notes application built with Node.js, Express, and MongoDB.

## Multi-tenancy Approach

We use a shared-schema multi-tenancy model with a `tenant` ObjectId on all tenant-scoped documents (`User`, `Note`). All queries are filtered by `tenant`, and the authenticated `req.user.tenant` is the authoritative context. This provides strict data isolation while keeping operational complexity low for the challenge scope.

### Seeded Tenants and Users

Run `npm run seed` to create:

- Tenants: `Acme (slug: acme, plan: free)`, `Globex (slug: globex, plan: free)`
- Users (password for all: `password`):
  - `admin@acme.test` (Admin, tenant: Acme)
  - `user@acme.test` (Member, tenant: Acme)
  - `admin@globex.test` (Admin, tenant: Globex)
  - `user@globex.test` (Member, tenant: Globex)

## Plans & Feature Gating

- Free plan: max 3 active notes per tenant (creation blocked with HTTP 402 and message to upgrade).
- Pro plan: unlimited notes. Upgrade via `POST /api/tenants/:slug/upgrade` (Admin only, same-tenant enforced).

## Features

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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Notes
- `GET /api/notes` - Get all notes (with pagination, search, filtering)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/pin` - Toggle pin status
- `PATCH /api/notes/:id/archive` - Toggle archive status
- `GET /api/notes/categories/list` - Get all categories
### Tenants
- `POST /api/tenants/:slug/upgrade` - Upgrade tenant to Pro (Admin only)

### Health
- `GET /health` → `{ "status": "ok" }`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saas-notes
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

4. The server will run on `http://localhost:5000`

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment (development/production)

## Database Models

### User
- name, email, password
- avatar, isVerified
- timestamps

### Note
- title, content, category
- tags, isPinned, isArchived
- color, author, sharedWith
- isPublic, timestamps

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Protected routes middleware
