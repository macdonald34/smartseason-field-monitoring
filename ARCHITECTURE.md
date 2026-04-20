# SmartSeason - Architecture & Design Document

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  Login   │  │ Admin    │  │ Agent    │               │
│  │ Register │  │Dashboard │  │Dashboard │               │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘               │
│       │             │              │                    │
│       └──────┬──────┴──────┬───────┘                    │
│              │             │                            │
│         ┌────▼─────────────▼────┐                       │
│         │   Axios API Client    │                       │
│         │  (with JWT headers)   │                       │
│         └────┬──────────────────┘                       │
└──────────────┼─────────────────────────────────────────┘
               │ HTTP/HTTPS
    ┌──────────┼──────────┐
    │          │          │
┌───▼──────────▼──────────▼────┐
│   BACKEND (Express.js)        │
│  ┌──────────────────────────┐ │
│  │  API Routes              │ │
│  │  - /auth                 │ │
│  │  - /fields               │ │
│  │  - /updates              │ │
│  └────┬─────────────────────┘ │
│       │                        │
│  ┌────▼─────────────────────┐ │
│  │  Middleware              │ │
│  │  - JWT Auth              │ │
│  │  - Role Check (admin)    │ │
│  │  - CORS                  │ │
│  └────┬─────────────────────┘ │
│       │                        │
│  ┌────▼─────────────────────┐ │
│  │  Controllers             │ │
│  │  - authController        │ │
│  │  - fieldController       │ │
│  │  - updateController      │ │
│  └────┬─────────────────────┘ │
│       │                        │
└───────┼────────────────────────┘
        │
┌───────▼────────────────────┐
│  DATABASE (MongoDB)         │
│  ┌──────────────────────┐  │
│  │ Collections          │  │
│  │ - users              │  │
│  │ - fields             │  │
│  │ - updates            │  │
│  └──────────────────────┘  │
└─────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
User Registration
    │
    ├─ POST /api/auth/register
    │  └─ Save hashed password (bcryptjs)
    │  └─ Return user + JWT token
    │
    └─ Store token in localStorage

User Login
    │
    ├─ POST /api/auth/login
    │  ├─ Verify email exists
    │  ├─ Compare password (bcryptjs)
    │  └─ Return JWT token (30 day expiry)
    │
    ├─ Store token in localStorage
    ├─ Add to Authorization header
    └─ Redirect to dashboard

Protected API Call
    │
    ├─ Client sends: Authorization: Bearer {token}
    ├─ Server middleware verifies token
    │  ├─ If valid → Continue to route handler
    │  └─ If invalid → Return 401 Unauthorized
    │
    └─ Execute request

Logout
    │
    ├─ Clear token from localStorage
    ├─ Remove from Authorization header
    └─ Redirect to /login
```

---

## 📊 Data Flow - Field Management

### Admin Creates Field
```
Admin fills form
    ↓
POST /api/fields
    ↓
Validate input
    ↓
Create Field document in MongoDB
    ↓
Return field with auto-calculated status
    ↓
Update UI dashboard
```

### Admin Assigns Field to Agent
```
Admin selects field + agent
    ↓
PUT /api/fields/:id/assign
    ↓
Verify agent exists and has "agent" role
    ↓
Update Field.assignedAgentId
    ↓
Agent sees field in dashboard
```

### Agent Submits Update
```
Agent writes notes + selects stage
    ↓
POST /api/updates
    ↓
Verify agent is authenticated
    ↓
Create Update document
    ↓
Update Field.stage if provided
    ↓
Recalculate Field.status
    ↓
Return success to UI
```

---

## ⚙️ Field Status Calculation Algorithm

```javascript
calculateFieldStatus(stage, plantingDate) {
  const now = new Date();
  const days = (now - plantingDate) / (1000 * 60 * 60 * 24);

  // RULE 1: Final stage = Completed
  if (stage === "Harvested") {
    return "Completed";
  }

  // RULE 2: Overdue check
  if (days > 90 && stage !== "Ready" && stage !== "Harvested") {
    return "At Risk";
  }

  // RULE 3: Normal operation
  return "Active";
}
```

**Logic Flow:**
```
┌─ Is Harvested? ───┐
│                  YES → COMPLETED
│                   │
NO                  └─ RETURN
│
└─ Days > 90?
       │
      YES ── Is Ready/Harvested? ──┐
       │                          YES → ACTIVE
       │                           │
      NO                          NO → AT RISK
       │
       └─ RETURN ACTIVE
```

---

## 🗄️ Database Schema Details

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  role: "admin" | "agent",
  createdAt: Date,
  updatedAt: Date
}
```

### Fields Collection
```javascript
{
  _id: ObjectId,
  name: String,
  cropType: String,
  plantingDate: Date,
  stage: "Planted" | "Growing" | "Ready" | "Harvested",
  assignedAgentId: ObjectId (ref: User) | null,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
  
  // Virtuals (calculated):
  status: "Active" | "At Risk" | "Completed"
}
```

### Updates Collection
```javascript
{
  _id: ObjectId,
  fieldId: ObjectId (ref: Field),
  agentId: ObjectId (ref: User),
  notes: String,
  stage: "Planted" | "Growing" | "Ready" | "Harvested",
  imageUrl: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 API Response Examples

### POST /api/auth/login
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@smartseason.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/fields
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "North Field A",
    "cropType": "Wheat",
    "plantingDate": "2024-01-15",
    "stage": "Growing",
    "status": "Active",
    "assignedAgentId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Agent",
      "email": "john@smartseason.com"
    },
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST /api/updates
```json
{
  "message": "Update created successfully",
  "update": {
    "_id": "507f1f77bcf86cd799439013",
    "fieldId": "507f1f77bcf86cd799439011",
    "agentId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Agent"
    },
    "notes": "Plants looking healthy, about 30% growth",
    "stage": "Growing",
    "createdAt": "2024-02-15T14:30:00Z"
  }
}
```

---

## 🚦 Error Handling

### Frontend
```javascript
try {
  const response = await api.get('/fields');
  setFields(response.data);
} catch (error) {
  // Check error status
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
    navigate('/login');
  } else if (error.response?.status === 403) {
    // Forbidden - insufficient permissions
    setError('You do not have permission to perform this action');
  } else {
    // General error
    setError(error.response?.data?.message || 'An error occurred');
  }
}
```

### Backend
```javascript
// All errors return consistent format
{
  "message": "Error description"
}

// HTTP Status Codes:
// 200 - Success
// 201 - Created
// 400 - Bad Request (validation error)
// 401 - Unauthorized (no/invalid token)
// 403 - Forbidden (insufficient permissions)
// 404 - Not Found
// 500 - Server Error
```

---

## 🔒 Security Layers

1. **Password Security**
   - Hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text

2. **JWT Authentication**
   - Token in Authorization header
   - 30-day expiration
   - Verified on each protected request

3. **Role-Based Access**
   - Middleware checks `req.user.role`
   - Admin-only endpoints protected
   - Agent-only endpoints protected

4. **Input Validation**
   - Email format validation
   - Required field checks
   - Database constraints

5. **CORS Protection**
   - Frontend URL whitelisting
   - Credentials included properly

---

## 🧪 Testing Scenarios

### Scenario 1: Admin Workflow
```
1. Admin logs in
2. Sees empty dashboard
3. Creates 3 fields
4. Stats show: 3 Total, 3 Active, 0 At Risk, 0 Completed
5. Assigns 2 fields to agents
6. Sees assignment in table
```

### Scenario 2: Agent Workflow
```
1. Agent logs in
2. Sees 2 assigned fields
3. Selects a field
4. Submits update with new stage
5. Field stage changes
6. Status recalculated
7. Sees update in history
```

### Scenario 3: At Risk Status
```
1. Admin creates field with date 91+ days ago
2. Field stage is "Growing" (not Ready/Harvested)
3. Status shows "At Risk"
4. Agent updates to "Ready"
5. Status changes back to "Active"
```

### Scenario 4: Completed Status
```
1. Agent finds field with any stage
2. Submits update with stage = "Harvested"
3. Field status becomes "Completed"
4. Cannot be reassigned
```

---

## 📈 Scalability Notes

**Current Limitations:**
- Single MongoDB connection
- No database indexing strategy defined
- No pagination on field list
- No image storage for updates
- No real-time updates (WebSocket)

**Future Enhancements:**
- Add pagination for fields (GET /api/fields?page=1&limit=20)
- Image upload support for update notes
- Email notifications for agents
- Advanced filtering and search
- Analytics dashboard (charts)
- Audit logs for all changes
- Multiple admins with hierarchy

---

## 📝 Deployment Checklist

- [ ] Update all `.env` files with production values
- [ ] Enable HTTPS for all API calls
- [ ] Set up MongoDB backups
- [ ] Configure JWT_SECRET as strong random string
- [ ] Enable MongoDB authentication
- [ ] Set up error logging (Sentry)
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline
- [ ] Load testing for scalability
- [ ] Security audit
- [ ] Performance optimization

---

**Architecture complete! Ready for production.** ✅
