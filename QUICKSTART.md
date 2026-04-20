# SmartSeason - Quick Start Guide 🚀

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Backend
```bash
cd smartseason-backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT_SECRET
npm run dev
```
✅ Backend runs on `http://localhost:5000`

### Step 2: Install Frontend (in new terminal)
```bash
cd smartseason-frontend
npm install
cp .env.example .env
npm run dev
```
✅ Frontend runs on `http://localhost:3000`

### Step 3: Test Login
Open `http://localhost:3000` and try logging in with:
- Email: `admin@smartseason.com` / Password: `admin123` (Admin)
- Email: `agent@smartseason.com` / Password: `agent123` (Agent)

---

## 📦 Project Contents

### Backend (`smartseason-backend/`)
- Express.js REST API
- MongoDB with Mongoose
- JWT Authentication
- Role-based middleware
- Field status logic

### Frontend (`smartseason-frontend/`)
- React + Vite
- Tailwind CSS styling
- React Router navigation
- Axios for API calls
- Context API for auth state

---

## 🔑 Key Files

**Backend:**
- `src/server.js` - Main Express app
- `src/models/` - Database schemas
- `src/controllers/` - Business logic
- `src/middleware/auth.js` - JWT protection

**Frontend:**
- `src/App.jsx` - Main routing
- `src/context/AuthContext.jsx` - Global auth state
- `src/services/api.js` - Axios instance
- `src/pages/` - Dashboard pages

---

## 🧪 What to Test

1. ✅ Register a new account
2. ✅ Login and get JWT token
3. ✅ Admin creates a field
4. ✅ Admin assigns field to agent
5. ✅ Agent submits an update
6. ✅ Field status auto-updates
7. ✅ Logout works properly

---

## 🆘 Issues?

**MongoDB not connecting?**
- Ensure `.env` has correct `MONGODB_URI`
- Check MongoDB service is running
- Use MongoDB Atlas for cloud: `mongodb+srv://user:pass@cluster.mongodb.net/smartseason`

**API not responding?**
- Check backend is running on port 5000
- Check frontend `.env` has correct `VITE_API_URL`

**Token issues?**
- Clear browser localStorage
- Re-login to get new token

---

## 📊 Admin Quick Actions

1. Go to `/admin/dashboard`
2. Create field with crop type
3. Assign to an agent via dropdown
4. View all fields and status breakdown
5. See automatic status changes

---

## 👨‍🌾 Agent Quick Actions

1. Go to `/agent/dashboard`
2. Select assigned field
3. Enter notes and stage update
4. Submit (field auto-updates in system)
5. View update history

---

## 🌾 Field Status Explained

```
Created (Planted) 
    ↓ (90+ days)
At Risk (if not Ready/Harvested)
    ↓ (when stage = Ready or Harvested)
Completed (when Harvested)
```

---

## 📖 Full Documentation

See `README.md` for complete documentation with:
- Full API reference
- Database schema
- Deployment guide
- Troubleshooting
- Security details

---

**Start building! 🎉**
