# SmartSeason - API Testing Guide

Test all endpoints using curl or Postman

---

## 🔐 Authentication Endpoints

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@smartseason.com",
    "password": "password123",
    "role": "agent"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@smartseason.com",
    "role": "agent"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@smartseason.com",
    "password": "admin123"
  }'
```

**Response:** Same as register (includes token)

---

## 🌾 Field Endpoints

**Note:** Replace `TOKEN` with actual JWT token from login

### Get All Fields
```bash
curl -X GET http://localhost:5000/api/fields \
  -H "Authorization: Bearer TOKEN"
```

### Create Field (Admin Only)
```bash
curl -X POST http://localhost:5000/api/fields \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Test Field",
    "cropType": "Wheat",
    "plantingDate": "2024-01-15"
  }'
```

### Update Field Stage
```bash
curl -X PUT http://localhost:5000/api/fields/FIELD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "stage": "Growing"
  }'
```

### Assign Field to Agent (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/fields/FIELD_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "agentId": "AGENT_USER_ID"
  }'
```

### Delete Field (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/fields/FIELD_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📝 Update Endpoints

### Create Update (Agent Only)
```bash
curl -X POST http://localhost:5000/api/updates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer AGENT_TOKEN" \
  -d '{
    "fieldId": "FIELD_ID",
    "notes": "Plants looking healthy, 30% growth",
    "stage": "Growing"
  }'
```

### Get Field Updates
```bash
curl -X GET http://localhost:5000/api/updates/field/FIELD_ID \
  -H "Authorization: Bearer TOKEN"
```

### Get Agent's Updates
```bash
curl -X GET http://localhost:5000/api/updates/agent/my-updates \
  -H "Authorization: Bearer AGENT_TOKEN"
```

---

## 🧪 Test Workflow (Step by Step)

### 1. Register Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }'
```
Save the returned TOKEN as ADMIN_TOKEN

### 2. Register Agent
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agent",
    "email": "agent@test.com",
    "password": "agent123",
    "role": "agent"
  }'
```
Save the returned user ID as AGENT_ID

### 3. Admin Creates Field
```bash
curl -X POST http://localhost:5000/api/fields \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Field 1",
    "cropType": "Wheat",
    "plantingDate": "2024-01-15"
  }'
```
Save the returned field ID as FIELD_ID

### 4. Admin Assigns Field to Agent
```bash
curl -X PUT http://localhost:5000/api/fields/FIELD_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "agentId": "AGENT_ID"
  }'
```

### 5. Agent Views Assigned Fields
```bash
curl -X GET http://localhost:5000/api/fields \
  -H "Authorization: Bearer AGENT_TOKEN"
```
Should show FIELD_ID with agent assignment

### 6. Agent Submits Update
```bash
curl -X POST http://localhost:5000/api/updates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer AGENT_TOKEN" \
  -d '{
    "fieldId": "FIELD_ID",
    "notes": "Field looking good",
    "stage": "Growing"
  }'
```

### 7. View Field Updates
```bash
curl -X GET http://localhost:5000/api/updates/field/FIELD_ID \
  -H "Authorization: Bearer AGENT_TOKEN"
```

---

## ❌ Error Cases to Test

### 1. Invalid Email Format
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "pass123",
    "role": "agent"
  }'
# Expected: 400 Bad Request
```

### 2. Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test"
  }'
# Expected: 400 Bad Request
```

### 3. Duplicate Email
```bash
# Register once, then register again with same email
# Expected: 400 Email already exists
```

### 4. Invalid Token
```bash
curl -X GET http://localhost:5000/api/fields \
  -H "Authorization: Bearer invalid_token_here"
# Expected: 401 Unauthorized
```

### 5. No Token
```bash
curl -X GET http://localhost:5000/api/fields
# Expected: 401 No token provided
```

### 6. Agent Trying Admin Route
```bash
curl -X POST http://localhost:5000/api/fields \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer AGENT_TOKEN" \
  -d '{
    "name": "Field",
    "cropType": "Wheat",
    "plantingDate": "2024-01-15"
  }'
# Expected: 403 Admin access required
```

### 7. Field Not Found
```bash
curl -X GET http://localhost:5000/api/fields/invalid_id \
  -H "Authorization: Bearer TOKEN"
# Expected: 404 Not Found
```

---

## 📊 Using Postman

1. **Create New Collection**: SmartSeason API
2. **Create Environment Variables:**
   - `base_url`: http://localhost:5000/api
   - `token`: (updated after login)
   - `admin_token`: (for admin operations)
   - `agent_token`: (for agent operations)

3. **Sample Request Structure:**
   - Method: POST
   - URL: `{{base_url}}/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@smartseason.com",
       "password": "admin123"
     }
     ```

4. **Tests Tab** (to auto-set token):
   ```javascript
   if (pm.response.code === 200) {
     pm.environment.set("token", pm.response.json().token);
   }
   ```

---

## 🔍 Response Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Field fetched successfully |
| 201 | Created | New field created |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Field ID doesn't exist |
| 500 | Server Error | Database connection issue |

---

## 💡 Tips

- Always include `Content-Type: application/json` header for POST/PUT
- Always include `Authorization: Bearer TOKEN` for protected routes
- Save important IDs (user, field) for subsequent requests
- Use environment variables in Postman to avoid repeating URLs/tokens
- Test both success and error cases

---

**Happy Testing! 🚀**
