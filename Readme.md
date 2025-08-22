# InterviewMate

A complete interview scheduling system with Node.js backend and PostgreSQL database.

## Project Structure

```
InterviewMate/
├── backend/          # Node.js API server
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── scripts/      # Database setup scripts
│   └── server.js     # Main server file
└── README.md         # This file
```

## Features

- ✅ RESTful API for AI-powered interview management
- ✅ PostgreSQL database with proper indexing
- ✅ Auto-generated unique interview IDs
- ✅ Comprehensive search and filtering
- ✅ Input validation and error handling
- ✅ Security middleware (CORS, Helmet, Rate limiting)
- ✅ Date range queries and status management
- ✅ AI interviewer system (no human interviewer required)

## Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm

### Setup Instructions

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

4. **Setup database:**
   ```bash
   npm run setup-db
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

6. **Test the API:**
   - API Documentation: http://localhost:3000/api
   - Health Check: http://localhost:3000/api/health

## API Overview

### Interview Schema
- **id**: Auto-increment primary key
- **interviewee_name**: Name of the interviewee  
- **role**: Position being interviewed for
- **technologies**: Array of technologies/skills to focus on
- **interview_id**: Auto-generated unique ID (e.g., INT-A1B2C3D4)
- **interview_time**: Scheduled date and time
- **status**: scheduled | completed | cancelled | rescheduled

*Note: Uses AI as interviewer - no human interviewer field needed.*

### Key Endpoints
- `POST /api/interviews` - Schedule new interview
- `GET /api/interviews` - Get all interviews
- `GET /api/interviews/today` - Get today's interviews
- `GET /api/interviews/upcoming` - Get next 7 days interviews
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Cancel interview

## Example Usage

### Create Interview
```bash
curl -X POST http://localhost:3000/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "interviewee_name": "Jane Smith", 
    "role": "Software Engineer",
    "technologies": ["JavaScript", "React", "Node.js", "PostgreSQL"],
    "interview_time": "2025-08-25T10:00:00.000Z"
  }'
```

### Get All Interviews
```bash
curl http://localhost:3000/api/interviews
```

For detailed API documentation, visit: http://localhost:3000/api

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv
- **Development**: Nodemon

## License

MIT
