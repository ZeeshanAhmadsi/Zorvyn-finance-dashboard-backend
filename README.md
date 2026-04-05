# Finance Data Processing and Access Control Backend

## 1. Project Overview
This project is a Finance Dashboard Backend API built with Node.js, Express, and MongoDB. It features proper Role-Based Access Control (RBAC), data modeling for financial records, robust input validation, and intelligent aggregation pipelines for dashboard analytics.

## 2. Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose)
- **Security & Validation:** JSON Web Tokens (JWT), bcryptjs, Joi

## 3. Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   //For Local System
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/finance_dashboard
   JWT_SECRET=supersecret_finance_jwt_token_key_change_me
   NODE_ENV=development
   ```
   Ensure you have a MongoDB instance running locally.

3. **Start the server:**
   ```bash
   node server.js
   ```

## 4. API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login

### Users (Admin Only)
- `GET /api/users` - List out all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update a user (manage roles/status)
- `DELETE /api/users/:id` - Remove a user

### Records 
- `GET /api/records` - List records (Analyst/Admin). Query parameters: `type`, `category`, `startDate`, `endDate`, `page`, `limit`.
- `POST /api/records` - Create a record (Admin only)
- `PUT /api/records/:id` - Update a record (Admin only)
- `DELETE /api/records/:id` - Delete a record (Admin only)

### Dashboard (Viewer/Analyst/Admin)
- `GET /api/dashboard/summary` - Total income, total expense, and net balance aggregation
- `GET /api/dashboard/categories` - Aggregate spending/income by category
- `GET /api/dashboard/trends` - Monthly trend aggregation (income vs expense)
- `GET /api/dashboard/recent` - Top 5 most recent activities

## 5. Role Permissions Table

| Role      | Functionality                            |
| --------- | ---------------------------------------- |
| **Viewer**  | Can only view dashboard analytics. Cannot view individual records or manage data. |
| **Analyst** | Can view records and dashboard analytics. Cannot create, modify or delete. |
| **Admin**   | Full access. Can create/modify records, manage user roles, and view analytics. |

## 6. Assumptions & Design Decisions
- **Record Ownership:** Records can be mapped to an individual user via `userId`. Admin specifies the `userId` during record creation, defaulting to themselves if unspecified.
- **Viewers:** By definition "Can only view dashboard data". Hence, access to `/api/records` list is restricted to Analyst and Admin.
- **Aggregation:** Heavy use of MongoDB Aggregation Pipeline (`$group`, `$sum`, `$sort`) in the Dashboard APIs to reduce memory footprint and leverage the database natively.
- **Validation:** Utilized `Joi` extensively for input and query validation to prevent erroneous data entry early in the pipeline.
- **Central Error Handling:** Errors are propagated via `next(error)` to a central Express error handler to guarantee uniform JSON responses (`{ error: "message" }`) across the platform.
