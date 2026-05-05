# Survey Builder Application

A full-stack MERN (MongoDB, Express, React, Node.js) application built with **TypeScript** that allows admins to create dynamic surveys, users to submit responses, and provides comprehensive analytics. Includes JWT authentication, draft saving, survey versioning, and rate limiting.

## ✨ Features

### Core Features
- ✅ **Create, Edit, Delete Surveys** - Full survey management with real-time preview
- ✅ **4 Question Types**:
  - Text Input (open-ended responses)
  - Multiple Choice (single select with radio buttons)
  - Checkbox (multi-select with checkboxes)
  - Rating (1-5 star scale)
- ✅ **Mark Questions as Required** - Validation on submission
- ✅ **Reorder Questions** - Up/down buttons for manual question organization
- ✅ **Conditional Logic** - Show/hide questions based on previous answers
- ✅ **Public Survey Access** - No login required for respondents
- ✅ **Form Validation** - Required field validation, correct input types
- ✅ **Dynamic Form Rendering** - Real-time question display based on logic

### Analytics Dashboard
- ✅ **Total Response Count** - Overview card with response metrics
- ✅ **Per-Question Insights**:
  - Multiple Choice/Checkbox → Bar charts with color-coded options
  - Rating → Average score with distribution breakdown
  - Text → Paginated list view (10 responses per page)
- ✅ **Response Aggregation** - Real-time calculations from stored responses
- ✅ **Completion Rate Tracking** - Visual metrics on dashboard

### Bonus Features (All Implemented ✅)
- ✅ **JWT Authentication** - Secure admin accounts with token-based auth
- ✅ **User Registration & Login** - Create admin accounts, persist auth state
- ✅ **Survey Versioning** - Track all changes, restore previous versions
- ✅ **Draft Response Saving** - Auto-save partial responses with timestamps
- ✅ **Rate Limiting** - 5 submissions per IP per 15 minutes (IP hashing for privacy)
- ✅ **Modern UI Design** - Slate, indigo, and emerald color scheme with Tailwind CSS
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Loading States** - Animated spinners and skeleton screens
- ✅ **Toast Notifications** - Real-time feedback on actions

## 🏗️ Tech Stack

### Backend
- **Node.js** with **Express.js** - REST API server
- **TypeScript** - Type-safe JavaScript with strict mode
- **MongoDB** with **Mongoose** - Document database with schema validation
- **JSONWebToken (JWT)** - Secure authentication
- **bcryptjs** - Password hashing and comparison
- **express-validator** - Input validation middleware
- **express-rate-limit** - IP-based rate limiting
- **CORS** - Cross-origin requests
- **uuid** - UUID generation for question IDs

### Frontend
- **React 18** with **Vite** - Modern UI framework with fast dev server
- **TypeScript** - Type-safe React components
- **React Router v6** - Client-side routing with protected routes
- **Axios** - HTTP client with interceptors for auth tokens
- **Recharts** - Data visualization (bar charts, responsive containers)
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Non-blocking toast notifications
- **React Context API** - State management for authentication

## 📁 Project Structure

```
survey-builder-app/
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Survey.ts           # Survey schema with questions
│   │   │   ├── Response.ts         # User responses to surveys
│   │   │   ├── User.ts             # Admin users with bcrypt hashing
│   │   │   ├── SurveyVersion.ts    # Version tracking for changes
│   │   │   └── DraftResponse.ts    # Auto-expiring draft saves
│   │   ├── controllers/
│   │   │   ├── surveyController.ts # Survey CRUD & versioning
│   │   │   ├── authController.ts   # Registration, login, profile
│   │   │   └── draftController.ts  # Draft save/load/delete
│   │   ├── routes/
│   │   │   ├── surveys.ts          # Survey endpoints
│   │   │   ├── responses.ts        # Response submission
│   │   │   ├── analytics.ts        # Analytics aggregation
│   │   │   ├── auth.ts             # Authentication endpoints
│   │   │   └── drafts.ts           # Draft endpoints
│   │   ├── middlewares/
│   │   │   ├── auth.ts             # JWT verification middleware
│   │   │   └── validation.ts       # Error handling for validators
│   │   ├── server.ts               # Express app & MongoDB setup
│   │   └── tsconfig.json           # TypeScript config
│   ├── .env                        # Environment variables
│   ├── .env.example                # Example env template
│   └── package.json
│
└── client/
    ├── src/
    │   ├── types/
    │   │   └── index.ts            # TypeScript interfaces & types
    │   ├── context/
    │   │   └── AuthContext.tsx      # Auth state management
    │   ├── services/
    │   │   └── api.ts              # Axios instance with interceptors
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── SurveyList.tsx   # Survey table with actions
    │   │   │   ├── SurveyBuilder.tsx # Survey create/edit form
    │   │   │   └── QuestionBuilder.tsx # Individual question editor
    │   │   ├── survey/
    │   │   │   ├── SurveyForm.tsx   # Dynamic form with conditional logic
    │   │   │   └── QuestionRenderer.tsx # Question type renderer
    │   │   └── analytics/
    │   │       ├── Dashboard.tsx    # Overview stats & charts
    │   │       └── QuestionStats.tsx # Per-question analytics
    │   ├── pages/
    │   │   ├── Home.tsx             # Survey listing page
    │   │   ├── AdminPage.tsx        # Admin panel (list/create/edit)
    │   │   ├── SurveyPage.tsx       # Public survey form
    │   │   ├── AnalyticsPage.tsx    # Analytics dashboard
    │   │   ├── LoginPage.tsx        # Admin login
    │   │   └── RegisterPage.tsx     # Admin registration
    │   ├── App.tsx                  # Router setup with auth
    │   ├── main.tsx                 # React entry point
    │   ├── index.css                # Tailwind directives
    │   └── tsconfig.json            # TypeScript config
    ├── vite.config.ts               # Vite configuration
    ├── tailwind.config.js           # Tailwind theming
    ├── postcss.config.js            # PostCSS setup
    ├── index.html                   # HTML template
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 16+ and npm
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git**

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5005
MONGODB_URI=mongodb://localhost:27017/survey-builder
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d
```

**MongoDB Atlas Setup:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/survey-builder?retryWrites=true&w=majority
```

4. Build TypeScript:
```bash
npm run build
```

5. Start the server:
```bash
npm start           # Production
npm run dev         # Development with auto-reload
```

Server runs on `http://localhost:5005`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

App available at `http://localhost:5173` (or next available port)

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new admin user
POST   /api/auth/login             # Login & get JWT token
GET    /api/auth/profile           # Get current user (requires auth)
```

### Surveys
```
GET    /api/surveys                # List all surveys (admin only)
POST   /api/surveys                # Create survey (requires auth)
GET    /api/surveys/:id            # Get survey by ID (public)
PUT    /api/surveys/:id            # Update survey (requires auth)
DELETE /api/surveys/:id            # Delete survey (requires auth)
```

### Responses & Submissions
```
POST   /api/surveys/:surveyId/responses    # Submit response (rate limited)
GET    /api/surveys/:surveyId/responses    # Get all responses (admin only)
```

### Analytics
```
GET    /api/surveys/:surveyId/analytics    # Get aggregated analytics
```

### Drafts (Bonus Feature)
```
POST   /api/surveys/:surveyId/drafts       # Save draft response
GET    /api/surveys/:surveyId/drafts       # Load draft response
DELETE /api/surveys/:surveyId/drafts       # Delete draft
```

### Versions (Bonus Feature)
```
GET    /api/surveys/:surveyId/versions     # Get version history
POST   /api/surveys/:surveyId/versions/:version/restore  # Restore version
```

## 🎨 Frontend Routes

```
/                          # Home page - browse active surveys
/login                     # Admin login
/register                  # Admin registration
/admin                     # Admin panel - survey list
/admin/create              # Create new survey
/admin/edit/:id            # Edit existing survey
/survey/:id                # Take survey (public)
/analytics/:id             # View survey analytics
```

## 💾 Database Schemas

### User (Admin Accounts)
```typescript
interface IUser {
  email: string (unique)
  password: string (bcrypt hashed)
  name: string
  createdAt: Date
  updatedAt: Date
}
```

### Survey
```typescript
interface Survey {
  _id: ObjectId
  title: string
  description: string (optional)
  isActive: boolean
  questions: Question[]
  createdAt: Date
  updatedAt: Date
}

interface Question {
  id: string (UUID)
  type: 'text' | 'multiple_choice' | 'checkbox' | 'rating'
  text: string
  required: boolean
  options: string[] (for choice types)
  conditionalLogic?: {
    dependsOn: string (question ID)
    showWhen: string (value to match)
  }
  order?: number
}
```

### Response
```typescript
interface Response {
  _id: ObjectId
  surveyId: ObjectId
  answers: Answer[]
  ipHash: string (SHA-256 hash)
  createdAt: Date
}

interface Answer {
  questionId: string
  value: string | string[] | number
}
```

### SurveyVersion (Bonus Feature)
```typescript
interface SurveyVersion {
  _id: ObjectId
  surveyId: ObjectId
  version: number (incremented)
  questions: Question[]
  changedBy: string (user ID)
  changeDescription: string
  createdAt: Date
}
```

### DraftResponse (Bonus Feature)
```typescript
interface DraftResponse {
  _id: ObjectId
  surveyId: ObjectId
  userId?: string (for authenticated users)
  ipHash?: string (for anonymous users)
  answers: Answer[]
  lastSavedAt: Date
  expiresAt: Date (auto-delete after 30 days)
}
```

## 🔐 Authentication Flow

### Registration
1. User enters email, password, name on `/register`
2. Backend validates input and hashes password with bcryptjs
3. Creates User document in MongoDB
4. Returns JWT token valid for 7 days
5. Frontend stores token in localStorage and authContext

### Login
1. User enters email, password on `/login`
2. Backend finds user by email, compares password hash
3. Returns JWT token on successful match
4. Frontend stores token for subsequent requests

### Protected Requests
1. Axios interceptor automatically adds `Authorization: Bearer <token>` header
2. Backend `authenticate` middleware verifies token signature
3. Extracts user ID and attaches to request object
4. Route handlers access req.userId for user-specific operations

### Token Storage
- Token persists in localStorage
- AuthContext restores session on app load
- Automatic logout on token expiry (7 days)

## 📊 Analytics Architecture

### Real-Time Calculation
- Aggregates responses on-demand from MongoDB
- No pre-computed cache layer
- Suitable for surveys with typical response volumes

### Calculation Logic
**Text Questions:**
- Returns list of all text responses
- Paginated (10 per page) for UI rendering

**Multiple Choice/Checkbox:**
- Groups answers by option
- Counts occurrences per option
- Returns as { option, count } tuples

**Rating:**
- Calculates average score (1-5)
- Builds distribution histogram
- Returns average + per-rating counts

## 🎯 Key Features Explained

### Conditional Logic
- Questions can depend on answers to previous questions
- Each question stores `dependsOn` (question ID) and `showWhen` (value)
- Evaluated client-side for instant UI response
- Validated on backend during submission

Example:
```
Q1: "Do you have experience?" (Multiple choice: Yes/No)
  └─> Q2: "How many years?" (Rating) - shown only if Q1 == "Yes"
```

### Draft Saving
- Auto-saves partial responses with timestamps
- Persists across page refreshes
- Anonymous access via IP hash (SHA-256)
- Auto-expires after 30 days via MongoDB TTL index
- Shows "💾 Auto-saved at HH:MM:SS"

### Survey Versioning
- Every update creates a new SurveyVersion record
- Tracks version number, user who changed it, timestamp
- Allows restoring previous question structures
- Useful for A/B testing and audit trails

### Rate Limiting
- Limits submissions to 5 per IP per 15 minutes
- Uses SHA-256 hash of IP for privacy
- Applied only to response submission endpoint
- Error message: "Too many submissions. Try again in 15 minutes."

## 🎨 UI/UX Design

### Design System
- **Color Palette:**
  - Slate: Neutral backgrounds and borders
  - Indigo: Primary actions and interactive elements
  - Emerald: Success states (submit buttons, confirmation)
  - Red: Destructive actions (delete, remove)

### Components
- Smooth transitions and hover effects
- Animated loading spinners with SVG
- Toast notifications for user feedback
- Responsive grid layouts (mobile-first)
- Accessible form labels and ARIA attributes

### Design Consistency
- Modern card design with subtle borders
- Consistent button styles across pages
- Standardized spacing and typography
- Dark mode friendly colors

## 🧪 Testing Workflow

### 1. Create a Survey
```
1. Go to /admin/create
2. Enter title: "Customer Feedback Q2 2026"
3. Enter description: "Help us improve our products"
4. Add Questions:
   - Q1 (Text): "What's your name?"
   - Q2 (Multiple Choice): "How satisfied?" → [Very, Somewhat, Not]
   - Q3 (Rating): "Rate your experience" (show if Q2 == "Somewhat" or "Not")
   - Q4 (Checkbox): "What did you like?" → [Design, UX, Speed, Support]
5. Mark Q1, Q2 as required
6. Set conditional logic: Q3 depends on Q2
7. Click "Create survey"
```

### 2. Fill Out Survey
```
1. Go to / (home page)
2. Click "Take survey"
3. Answer Q1 (name)
4. Answer Q2 (satisfaction)
5. Q3 appears conditionally
6. Answer Q3 (rating)
7. Answer Q4 (multi-select)
8. Click "Submit" or "Save Draft"
9. See success message
```

### 3. View Analytics
```
1. Go to /analytics/{surveyId}
2. Verify response count, question count
3. Check Q2 bar chart (3 options)
4. Check Q3 rating (average + distribution)
5. Paginate through Q1 text responses
```

### 4. Test Draft Saving
```
1. Fill out survey partially
2. Click "Save Draft"
3. Refresh page
4. Verify responses auto-loaded
5. See "💾 Auto-saved at HH:MM:SS"
```

### 5. Admin Features
```
1. Go to /register → Create account
2. Go to /admin → View surveys
3. Click "Edit" on a survey
4. Modify question text
5. Click "Save changes"
6. Check /analytics → See version updated
7. Click survey → View version history
8. Restore previous version
```

## 🚀 Deployment


### Deploy Frontend to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd client
vercel

# 3. Update API base URL
# Edit client/src/services/api.ts:
# const BASE_URL = 'https://your-heroku-app.herokuapp.com/api'
```

### Update Vite Config for Production
```javascript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:5005'
    }
  }
})
```

## 📋 Environment Variables

### Backend (.env)
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5005 | Server port |
| `MONGODB_URI` | mongodb://localhost | Database connection |
| `NODE_ENV` | development | Environment mode |
| `JWT_SECRET` | your-secret | Secret for signing tokens |
| `JWT_EXPIRY` | 7d | Token expiration time |

### Frontend (in vite.config.ts)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:5005 | Backend API base URL |

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB is running
mongod --version

# Or use Atlas URI with correct credentials
# mongodb+srv://user:password@cluster.mongodb.net/dbname
```

**Port Already in Use**
```bash
# Change PORT in .env
PORT=5006
```

**JWT Errors**
```bash
# Ensure JWT_SECRET is set in .env
JWT_SECRET=your-secret-key-here
```

### Frontend Issues

**Axios 404 on API Calls**
```
Check vite.config.ts proxy configuration
Ensure backend server is running on correct port
```

**Auth Token Not Persisting**
```
Check browser localStorage is enabled
Verify axios interceptor in client/src/services/api.ts
```

**Form Not Submitting**
```
Check browser console for validation errors
Ensure all required fields are filled
Verify network request in DevTools
```

### Rate Limiting

**"Too many submissions" Error**
```
- Wait 15 minutes for rate limit to reset
- Or change IP address
- Limit applies per IP, not per browser
```

## 📝 Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **No user auth for surveys** | Maximize accessibility; add JWT as bonus |
| **Client-side conditional logic** | Instant feedback without server round-trips |
| **UUID for questions** | Allows structure changes without breaking refs |
| **Real-time analytics** | No caching needed for typical survey sizes |
| **IP-based rate limiting** | Prevents spam without requiring authentication |
| **MongoDB Mixed type** | Support strings, arrays, numbers for answers |
| **TypeScript strict mode** | Catch bugs at compile time, improve DX |

## 📚 Future Enhancements

- [ ] Advanced analytics (response trends, export to CSV/PDF)
- [ ] Survey templates and duplication
- [ ] Multi-language support (i18n)
- [ ] Custom branding per survey
- [ ] Email notifications on submission
- [ ] Webhook integrations
- [ ] Survey scheduling and expiration
- [ ] Collaborative editing with real-time updates
- [ ] Response filtering and export
- [ ] Survey pre-fills from URL parameters

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

Built as a full-stack MERN survey application with TypeScript, modern UI design, and production-ready features.

---

**Need Help?**
- Check the `/server` directory for backend code
- Check the `/client` directory for frontend code
- Refer to environment variable examples in `.env.example`
- Test workflow includes create → fill → analyze → draft save flow
