# Job Success Agency Portal

A modern full-stack Employment Portal built with **Vue 3**, **Node.js/Express**, and **MongoDB**.

## Features

### Student Portal
- Browse and search job listings with filters
- Apply to jobs with cover letter and resume
- Track application status (pending, reviewed, shortlisted, interview, accepted, rejected)
- Manage profile with skills, education, and resume

### Employer Portal
- Post and manage job listings
- Review student applications
- Update application statuses (shortlist, interview, accept, reject)
- Manage company profile

### Admin Portal
- Platform-wide dashboard with statistics
- Manage all users (activate/deactivate/delete)
- Approve employer registrations
- View and manage all jobs and applications

## Tech Stack
- **Frontend:** Vue 3, Vue Router, Vite, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (JSON Web Tokens) + bcrypt

## Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (or MongoDB Atlas connection string)

### 1. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `/server` (already created with defaults):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sjp2_employment
JWT_SECRET=change_this_to_a_long_random_secret_string
```

Seed the admin account:
```bash
node seed.js
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Default Admin Login
- **Email:** admin@sjp2.com
- **Password:** admin123

> **Important:** Change the admin password and JWT_SECRET in production!

## Project Structure
```
SJP2/
├── client/                 # Vue 3 Frontend
│   ├── src/
│   │   ├── views/
│   │   │   ├── student/    # Student dashboard, applications, profile
│   │   │   ├── employer/   # Employer dashboard, post jobs, manage applicants
│   │   │   ├── admin/      # Admin dashboard, user management
│   │   │   ├── Home.vue    # Landing page
│   │   │   ├── Jobs.vue    # Public job listings
│   │   │   ├── JobDetail.vue
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── App.vue
│   │   ├── router.js
│   │   ├── store.js
│   │   ├── api.js
│   │   └── style.css
│   └── package.json
├── server/                 # Node.js/Express Backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── README.md
```
