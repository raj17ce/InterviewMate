# InterviewMate Backend API

A Node.js backend API for interview scheduling system with PostgreSQL database.

## Features

- ✅ Create, read, update, and delete interviews
- ✅ Auto-generated unique interview IDs
- ✅ Search interviews by various criteria
- ✅ Date range filtering
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ CORS support
- ✅ Security headers

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`

3. **Setup database:**
   ```bash
   npm run setup-db
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api`

## Database Schema

### Interviews Table
```sql
CREATE TABLE interviews (
  id SERIAL PRIMARY KEY,
  interviewee_name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  technologies TEXT[],
  interview_id VARCHAR(50) UNIQUE NOT NULL,
  interview_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Interview Schema
- **id**: Auto-increment primary key
- **interviewee_name**: Name of the interviewee  
- **role**: Position being interviewed for
- **technologies**: Array of technologies/skills to focus on
- **interview_id**: Auto-generated unique ID (e.g., INT-A1B2C3D4)
- **interview_time**: Scheduled date and time
- **status**: scheduled | completed | cancelled | rescheduled

*Note: This system uses AI as the interviewer, so no interviewer name is required.*

## API Endpoints

### Base URL: `/api`

#### Interview Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/interviews` | Create new interview |
| GET | `/interviews` | Get all interviews |
| GET | `/interviews/:id` | Get interview by ID |
| PUT | `/interviews/:id` | Update interview |
| DELETE | `/interviews/:id` | Delete interview |

#### Search & Filter

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/interviews/interview-id/:interviewId` | Get by interview ID |
| GET | `/interviews/today` | Get today's interviews |
| GET | `/interviews/upcoming` | Get upcoming interviews (7 days) |
| GET | `/interviews/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Get by date range |
| GET | `/interviews/status/:status` | Get by status |
| GET | `/interviews/interviewee/:interviewee` | Get by interviewee |

#### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API documentation |

## Request/Response Examples

### Create Interview
```bash
POST /api/interviews
Content-Type: application/json

{
  "interviewee_name": "Jane Smith",
  "role": "Software Engineer",
  "technologies": ["JavaScript", "React", "Node.js", "PostgreSQL"],
  "interview_time": "2025-08-25T10:00:00.000Z"
}
```

### Response
```json
{
  "success": true,
  "message": "Interview scheduled successfully",
  "data": {
    "id": 1,
    "interviewee_name": "Jane Smith",
    "role": "Software Engineer",
    "technologies": ["JavaScript", "React", "Node.js", "PostgreSQL"],
    "interview_id": "INT-A1B2C3D4",
    "interview_time": "2025-08-25T10:00:00.000Z",
    "status": "scheduled",
    "created_at": "2025-08-22T12:00:00.000Z",
    "updated_at": "2025-08-22T12:00:00.000Z"
  }
}
```

### Update Interview
```bash
PUT /api/interviews/1
Content-Type: application/json

{
  "status": "completed",
  "interview_time": "2025-08-25T11:00:00.000Z"
}
```

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=interviewmate
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_key_here
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup-db` - Setup database and tables

## Status Values

- `scheduled` - Interview is scheduled (default)
- `completed` - Interview has been completed
- `cancelled` - Interview has been cancelled
- `rescheduled` - Interview has been rescheduled

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation with Joi
- SQL injection prevention with parameterized queries

## Development

1. Install dependencies: `npm install`
2. Setup database: `npm run setup-db`
3. Start development server: `npm run dev`
4. Test endpoints using Postman or curl

## Production Deployment

1. Set `NODE_ENV=production`
2. Update CORS origins in `server.js`
3. Use environment variables for sensitive data
4. Setup SSL/TLS certificates
5. Use process manager like PM2

## License

MIT
