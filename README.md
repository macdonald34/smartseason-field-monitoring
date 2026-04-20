# 🌾 SmartSeason Field Monitoring System

A full-stack web application for monitoring agricultural fields in real-time. Designed for Admins to manage fields and Field Agents to submit updates and monitor crop stages.

## 📋 Project Overview

**Roles:**
- **Admin**: Create fields, assign to agents, view all field statuses and analytics
- **Field Agent**: View assigned fields, submit crop updates, track field progress

**Key Features:**
✅ User authentication (JWT-based)  
✅ Role-based access control (Admin & Agent)  
✅ Field management (Create, Update, Assign, Delete)  
✅ Field status calculation (Active, At Risk, Completed)  
✅ Update tracking with timestamps  
✅ Responsive dashboard with statistics  

---

## 🔐 Authentication & Authorization

### JWT Implementation
- **Token Storage**: localStorage
- **Token Expiry**: 30 days
- **Routes Protected**: All API endpoints require valid JWT token

### Role-Based Routes
```
/login                    → Public
/register                 → Public
/admin/dashboard          → Admin only
/agent/dashboard          → Agent only
```

---

## ⚙️ Field Status Logic (Business Logic)

**This is the core algorithm for field status determination:**

```javascript
function calculateFieldStatus(stage, plantingDate) {
  // Rule 1: Harvested = Completed
  if (stage === "Harvested") return "Completed";

  // Rule 2: Check if at risk (overdue)
  const daysSincePlanting = calculateDays(currentDate - plantingDate);
  if (daysSincePlanting > 90 && stage !== "Ready" && stage !== "Harvested") {
    return "At Risk";
  }

  // Rule 3: Normal operation
  return "Active";
}
```

**Status Explanation:**
- **Active**: Field is being actively monitored and managed (normal operations)
- **At Risk**: Crop has been in the field for >90 days but hasn't reached "Ready" stage (potential overdue)
- **Completed**: Crop has been harvested

**Crop Stages:**
1. **Planted** - Initial planting complete
2. **Growing** - Active growth phase
3. **Ready** - Crop ready for harvest
4. **Harvested** - Harvest completed

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcryptjs
- **CORS**: Enabled for frontend communication

### Database Schema
```
Users
├── id (ObjectId)
├── name (String)
├── email (String, unique)
├── password (String, hashed)
├── role (enum: admin, agent)
└── timestamps

Fields
├── id (ObjectId)
├── name (String)
├── cropType (enum: Wheat, Rice, Corn, Sugarcane, Cotton, Other)
├── plantingDate (Date)
├── stage (enum: Planted, Growing, Ready, Harvested)
├── status (calculated: Active, At Risk, Completed)
├── assignedAgentId (ref to User)
├── createdBy (ref to User)
└── timestamps

Updates
├── id (ObjectId)
├── fieldId (ref to Field)
├── agentId (ref to User)
├── notes (String)
├── stage (enum: Planted, Growing, Ready, Harvested)
└── timestamps
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+ and npm
- MongoDB (local or cloud - MongoDB Atlas)
- Git

### 1️⃣ Backend Setup

```bash
cd smartseason-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartseason
# JWT_SECRET=your_secret_key_here

# Start server
npm run dev
```

Server runs on: `http://localhost:5000`

### 2️⃣ Frontend Setup

```bash
cd smartseason-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 📡 API Endpoints

### Auth Endpoints
```
POST   /api/auth/register      → Register new user
POST   /api/auth/login         → Login user (returns JWT)
```

### Field Endpoints (All require authentication)
```
GET    /api/fields             → Get all fields (admin sees all, agent sees assigned)
POST   /api/fields             → Create field (admin only)
PUT    /api/fields/:id         → Update field stage
PUT    /api/fields/:id/assign  → Assign field to agent (admin only)
DELETE /api/fields/:id         → Delete field (admin only)
```

### Update Endpoints (All require authentication)
```
POST   /api/updates                    → Create update (agent only)
GET    /api/updates/field/:fieldId    → Get updates for a field
GET    /api/updates/agent/my-updates  → Get agent's all updates
```

---

## 🧪 Testing the Application

### Demo Accounts (Pre-seed these in MongoDB)

**Admin Account:**
```
Email: admin@smartseason.com
Password: admin123
Role: admin
```

**Agent Account:**
```
Email: agent@smartseason.com
Password: agent123
Role: agent
```

### Testing Flow

1. **Register/Login**: Start at `/login` or `/register`
2. **Admin Dashboard**: 
   - View total fields
   - See status breakdown (Active, At Risk, Completed)
   - Create new fields
   - Assign fields to agents
3. **Agent Dashboard**:
   - View assigned fields
   - Select a field and submit updates
   - Change crop stage and add notes
   - Track field history

### Key Test Cases
- ✅ Can register with email validation
- ✅ Can login with JWT token
- ✅ Admin can create fields
- ✅ Admin can assign fields to agents
- ✅ Agent can view assigned fields only
- ✅ Agent can submit updates
- ✅ Field status updates automatically based on stage and days since planting
- ✅ Status changes: Active → At Risk (after 90 days) → Completed (when harvested)
- ✅ Logout clears token and redirects to login

---

## 📁 Project Structure

```
smartseason-field-monitoring/
├── smartseason-backend/
│   ├── src/
│   │   ├── controllers/        # Business logic (auth, fields, updates)
│   │   ├── models/             # Mongoose schemas (User, Field, Update)
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Authentication middleware
│   │   ├── utils/              # Utility functions (fieldStatusLogic)
│   │   └── server.js           # Express app entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── smartseason-frontend/
    ├── src/
    │   ├── pages/              # React pages (Login, Dashboard, etc)
    │   ├── components/         # Reusable components
    │   ├── context/            # AuthContext for global state
    │   ├── services/           # API calls (axios)
    │   ├── utils/              # Utilities (ProtectedRoute)
    │   ├── App.jsx             # Main app routing
    │   ├── main.jsx            # Entry point
    │   └── index.css           # Tailwind CSS
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    ├── .env.example
    └── .gitignore
```

---

## 🎨 UI/UX Features

### Design Highlights
- **Responsive Design**: Works on desktop, tablet, mobile
- **Clean UI**: Modern gradient backgrounds, card-based layouts
- **Tailwind CSS**: Professional styling with consistent color scheme
- **Loading States**: User feedback during API calls
- **Error Handling**: Clear error messages for user actions
- **Color Coding**: 
  - 🟢 Active (Green)
  - 🔴 At Risk (Red)
  - 🔵 Completed (Blue)

### Pages
1. **Home** (`/`) - Landing page with feature overview
2. **Login** (`/login`) - User authentication
3. **Register** (`/register`) - New user account creation
4. **Admin Dashboard** (`/admin/dashboard`) - Field management & analytics
5. **Agent Dashboard** (`/agent/dashboard`) - Field updates & tracking

---

## 🔒 Security Measures

✅ **Password Hashing**: bcryptjs with 10-round salt  
✅ **JWT Authentication**: Secure token-based auth  
✅ **Role-Based Access**: Route protection by user role  
✅ **Input Validation**: Server-side validation on all endpoints  
✅ **CORS Enabled**: Allow frontend-backend communication  
✅ **Environment Variables**: Sensitive data in .env  

---

## 📊 Database Queries

### Sample Queries

**Get all active fields by agent:**
```javascript
Field.find({ assignedAgentId: agentId, status: "Active" })
```

**Get fields at risk (overdue):**
```javascript
Field.find({ status: "At Risk" }).sort({ plantingDate: 1 })
```

**Get recent updates for a field:**
```javascript
Update.find({ fieldId }).sort({ createdAt: -1 }).limit(10)
```

---

## 🚢 Deployment (Optional)

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder to Vercel/Netlify
```

### Backend Deployment (Render/Railway)
```bash
# Set environment variables in platform
# Push to GitHub and connect repo
```

### Database Deployment (MongoDB Atlas)
```
# Use MongoDB Atlas free tier
# Get connection string and set in .env
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check MONGODB_URI in .env, ensure MongoDB service is running |
| CORS error | Verify backend CORS config, check API URL in frontend .env |
| "Invalid token" on login | Clear localStorage, re-login, check JWT_SECRET matches |
| Fields not showing | Ensure admin created fields first, agent needs assignment |
| Update not saving | Check field ID is correct, agent must be authenticated |

---

## ✨ Bonus Features Implemented

✅ **Responsive Design** with Tailwind CSS  
✅ **Loading States** for better UX  
✅ **Error Handling** with user-friendly messages  
✅ **Field History** - Track all updates per field  
✅ **Real-time Status** - Automatic calculation  
✅ **Dashboard Analytics** - Stats with visual cards  

---

## 📝 Assumptions

1. **MongoDB**: Using MongoDB for NoSQL flexibility
2. **JWT Expiry**: 30-day token expiration (refresh tokens not implemented)
3. **Field Status**: Status calculated on-the-fly, not stored in DB
4. **Planting Duration**: Assumed 90 days is normal growth cycle
5. **Single Admin**: No admin hierarchy implemented
6. **Local Dates**: Using server time for timestamp calculations
7. **No Email Verification**: Registration creates account immediately

---

## 📚 Tech Documentation

- [Express.js Docs](https://expressjs.com/)
- [MongoDB/Mongoose](https://mongoosejs.com/)
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT.io](https://jwt.io/)

---

## 👨‍💻 Author Notes

This application demonstrates:
- Clean architecture with separation of concerns
- Proper authentication & authorization
- RESTful API design
- React best practices (Context API, hooks)
- Database design with relationships
- Business logic implementation
- Responsive UI with Tailwind CSS

**Focus**: Simple, functional, and production-ready code without over-engineering.

---

## 📄 License

MIT License - Free to use and modify

---

**Happy Farming! 🌾**