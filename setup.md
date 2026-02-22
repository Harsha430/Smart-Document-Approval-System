# Setup Guide for Smart Document Approval System

## Quick Start

### 1. Environment Variables Setup

Create a `.env` file in the root directory (optional, you can also use application.properties):

```bash
# Database Configuration
DB_USERNAME=postgres
DB_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 2. Database Setup

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE document_approval_db;

-- Create user (optional)
CREATE USER doc_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE document_approval_db TO doc_user;

-- Exit
\q
```

### 3. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > App passwords
4. Generate an app password for "Mail"
5. Use this app password in your configuration

### 4. Running the Application

#### Option 1: Using Maven (Development)
```bash
# Backend
mvn spring-boot:run

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

#### Option 2: Using JAR (Production)
```bash
# Build
mvn clean package

# Run
java -jar target/smart-document-approval-system-1.0.0.jar
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### 6. Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@documentapproval.com | admin123 |
| Manager | manager@documentapproval.com | manager123 |
| Officer | officer@documentapproval.com | officer123 |
| User | alice@documentapproval.com | user123 |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in application.properties
   - Verify database exists

2. **Email Not Sending**
   - Check Gmail app password
   - Ensure 2FA is enabled on Gmail
   - Verify SMTP settings

3. **Frontend Not Loading**
   - Ensure Node.js is installed
   - Run `npm install` in frontend directory
   - Check if port 3000 is available

4. **JWT Token Issues**
   - Ensure JWT secret is at least 32 characters
   - Check token expiration settings

### Port Configuration

If you need to change default ports:

**Backend (application.properties):**
```properties
server.port=8081
```

**Frontend (vite.config.js):**
```javascript
export default defineConfig({
  server: {
    port: 3001
  }
})
```

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use Swagger UI for testing API endpoints
3. **Database**: Use H2 console for quick testing (add H2 dependency)
4. **Logging**: Check application logs for debugging information

## Production Deployment

### Backend
```bash
# Build optimized JAR
mvn clean package -Pprod

# Run with production profile
java -jar -Dspring.profiles.active=prod target/app.jar
```

### Frontend
```bash
cd frontend
npm run build
# Deploy 'dist' folder to web server
```
