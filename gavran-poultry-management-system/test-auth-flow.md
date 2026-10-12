# Authentication Flow Test

## Prerequisites:
1. Database setup with schema from `database/schema.sql`
2. Server running at `http://localhost:5000`
3. Environment variables set in `.env` file

## Test Steps:

### 1. Seed Database (Create default owner)
```bash
cd server/src
node seed.js
```

### 2. Login Test
- Use login credentials:
  - Phone: `9999999999`
  - Password: `owner123`

### 3. Test Protected Routes
- Access any protected route without authentication should redirect to `/login`
- Access routes after successful login should work

### 4. Token Management
- Tokens should be stored in localStorage
- Should expire after 24 hours
- Should validate token on page refresh

## Expected Results:
1. Owner user created successfully in database
2. Login with correct credentials succeeds
3. JWT token returned in response
4. Protected routes accessible after login
5. Token stored in localStorage
6. Automatic redirection to dashboard upon successful login
7. Logout functionality works correctly
8. Token validation and refresh works

## Manual Test Commands:
```bash
# Test health check
curl http://localhost:5000/health

# Test registration (owner only)  
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"John Doe", "phone":"1234567890", "password":"test123", "role":"manager"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999", "password":"owner123"}'
```