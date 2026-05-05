# Survey Builder Application

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows admins to create dynamic surveys and users to submit responses with analytics.

## Features

### Admin Panel
- ✅ Create, edit, and delete surveys
- ✅ Support for 4 question types:
  - Text Input
  - Multiple Choice (single select)
  - Checkbox (multi-select)
  - Rating (1-5 stars)
- ✅ Mark questions as required
- ✅ Reorder questions (drag via up/down buttons)
- ✅ Conditional logic (show/hide questions based on previous answers)

### Survey Form
- ✅ Public survey access (no login required)
- ✅ Dynamic rendering based on survey schema
- ✅ Form validation (required fields, correct input types)
- ✅ Conditional logic support

### Analytics Dashboard
- ✅ Total response count
- ✅ Per-question insights:
  - Multiple choice/checkbox → response counts with bar charts
  - Rating → average score + distribution
  - Text → paginated list view
- ✅ Rate limiting (5 submissions per IP per 15 minutes)

## Tech Stack

### Backend
- **Node.js** with **Express.js** - REST API server
- **MongoDB** with **Mongoose** - Document database
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin requests

### Frontend
- **React 18** with **Vite** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization (bar charts)
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

## Project Structure

```
survey-builder-app/
├── server/
│   ├── models/
│   │   ├── Survey.js       # Survey schema
│   │   └── Response.js     # Response schema
│   ├── routes/
│   │   ├── surveys.js      # Survey CRUD
│   │   ├── responses.js    # Response submission
│   │   └── analytics.js    # Analytics aggregation
│   ├── server.js           # Express app setup
│   ├── .env                # Environment variables
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── SurveyBuilder.jsx
    │   │   │   ├── QuestionBuilder.jsx
    │   │   │   └── SurveyList.jsx
    │   │   ├── survey/
    │   │   │   ├── SurveyForm.jsx
    │   │   │   └── QuestionRenderer.jsx
    │   │   └── analytics/
    │   │       ├── Dashboard.jsx
    │   │       └── QuestionStats.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── AdminPage.jsx
    │   │   ├── SurveyPage.jsx
    │   │   └── AnalyticsPage.jsx
    │   ├── services/api.js  # API client
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/survey-builder
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/survey-builder
```

4. Start the server:
```bash
npm start        # Production
npm run dev      # Development with nodemon
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Surveys
- `GET /api/surveys` - List all surveys
- `POST /api/surveys` - Create a new survey
- `GET /api/surveys/:id` - Get survey details
- `PUT /api/surveys/:id` - Update survey
- `DELETE /api/surveys/:id` - Delete survey

### Responses
- `POST /api/surveys/:surveyId/responses` - Submit survey response
- `GET /api/surveys/:surveyId/responses` - Get all responses (admin)

### Analytics
- `GET /api/surveys/:surveyId/analytics` - Get survey analytics

## Frontend Routes

- `/` - Home page with available surveys
- `/admin` - Admin panel (survey list)
- `/admin/create` - Create new survey
- `/admin/edit/:id` - Edit survey
- `/survey/:id` - Fill out survey
- `/analytics/:id` - View survey analytics

## Database Schema

### Survey
```javascript
{
  title: String,
  description: String,
  isActive: Boolean,
  questions: [{
    id: String (UUID),
    type: String (text|multiple_choice|checkbox|rating),
    text: String,
    required: Boolean,
    options: [String],
    conditionalLogic: {
      dependsOn: String,     // question id
      showWhen: String       // value to match
    }
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Response
```javascript
{
  surveyId: ObjectId,
  answers: [{
    questionId: String,
    value: Mixed (String | Array | Number)
  }],
  ipHash: String,
  createdAt: Date
}
```

## Architecture Decisions

### 1. **No Authentication (Core)**
- Decided against mandatory login for users to maximize accessibility
- Bonus: JWT auth structure included for future implementation
- Admin endpoints can be secured with middleware in production

### 2. **Conditional Logic**
- Implemented as client-side rendering based on answer values
- Each question stores `dependsOn` (question ID) and `showWhen` (value to match)
- Simple and efficient; validation happens on backend on submission

### 3. **Rate Limiting**
- Applied at the response submission endpoint (5 per IP per 15 min)
- Uses IP hashing for privacy (SHA-256)
- Prevents spam without requiring authentication

### 4. **Analytics Aggregation**
- Real-time calculation on-demand from stored responses
- No pre-computed cache; scales well for typical survey sizes
- Text responses paginated (10 per page) for readability

### 5. **UUID for Questions**
- Used crypto.randomUUID() for question IDs
- Allows survey structure to be modified without breaking references
- More robust than array indices

### 6. **Mixed Type for Answers**
- MongoDB Mixed type for `answer.value` to support:
  - Strings (text, multiple_choice)
  - Arrays (checkbox multi-select)
  - Numbers (rating)
- Flexible without schema constraints

## Assumptions & Trade-offs

| Feature | Decision | Rationale |
|---------|----------|-----------|
| Authentication | Not required for users | Maximizes accessibility; can add JWT auth as bonus |
| Question Reordering | Manual up/down buttons | Simpler than drag-and-drop; no external library dependency |
| Analytics Caching | None (real-time) | Typical survey sizes (<1000 responses) don't need caching |
| Question Dependencies | Single level | Avoids complex multi-level dependency chains |
| Survey Deletion | Hard delete | Cascades to responses; can add soft delete in v2 |
| Form Validation | Client + server | Prevents user errors and ensures data integrity |

## Bonus Features

1. **JWT Authentication Structure** - Middleware ready in `server/middleware/auth.js`
2. **Survey Activation Toggle** - `isActive` field controls public visibility
3. **IP-based Rate Limiting** - Prevents spam without login
4. **Conditional Logic** - Show/hide questions based on answers
5. **Paginated Text Responses** - Handles large text answer volumes

## Future Enhancements

- [ ] User authentication with JWT
- [ ] Survey versioning (track question changes)
- [ ] Partial response saving (draft mode)
- [ ] Advanced analytics (response trends, export to CSV)
- [ ] Survey templates and duplication
- [ ] Survey expiration dates
- [ ] Custom branding
- [ ] Email notifications on submission
- [ ] Webhook integrations

## Testing

1. **Create a survey** - Go to `/admin/create`
   - Add title and description
   - Add 4 questions (one of each type)
   - Set up conditional logic (e.g., text question "Yes" → show rating)
   - Save

2. **Fill out survey** - Go to `/` and take the survey
   - Verify conditional questions appear/disappear
   - Test required field validation
   - Submit

3. **View analytics** - Go to `/analytics/{surveyId}`
   - Check response count
   - Verify charts display correctly
   - Paginate through text responses

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `MONGODB_URI` | mongodb://localhost:27017/survey-builder | Database URI |
| `NODE_ENV` | development | Environment mode |

## Deployment

### Deploy Backend to Heroku
```bash
cd server
heroku create your-app-name
git push heroku main
heroku config:set MONGODB_URI=your-atlas-uri
```

### Deploy Frontend to Vercel
```bash
cd client
npm install -g vercel
vercel
```

Update API base URL in `client/src/services/api.js` to your deployed backend.

## Troubleshooting

**Server won't connect to MongoDB**
- Check MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env`

**Rate limit errors**
- Wait 15 minutes or restart server to reset

**Conditional logic not working**
- Ensure dependent question ID matches exactly
- Check that "Show when" value matches an actual answer

## License

MIT
