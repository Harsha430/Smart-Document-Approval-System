# Smart Document Approval System

A comprehensive document approval system with role-based workflow management built with Spring Boot.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Document Management**: Upload, view, download, and delete documents
- **Workflow Management**: Automated approval workflow with multiple reviewer levels
- **Email Notifications**: Automatic email notifications for document uploads and reviews
- **Audit Logging**: Complete audit trail of all system activities
- **API Documentation**: Comprehensive OpenAPI/Swagger documentation
- **File Storage**: Secure file storage with validation
- **Role-based Security**: Four user roles (USER, OFFICER, MANAGER, ADMIN)

## Technology Stack

### Backend
- **Spring Boot 3.5.4** - Application framework
- **PostgreSQL** - Production database
- **H2** - Testing database
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **OpenAPI 3 (Swagger)** - API documentation
- **Spring Mail** - Email notifications
- **JUnit 5** - Testing framework
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Zustand** - State management
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## User Roles

1. **USER**: Can upload documents and view their own documents
2. **OFFICER**: Can review documents (first level approval)
3. **MANAGER**: Can review documents (second level approval)
4. **ADMIN**: Full system access, can manage users and view all audit logs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/my` - Get user's documents
- `GET /api/documents/all` - Get all documents (Manager/Admin)
- `GET /api/documents/{id}` - Get document by ID
- `GET /api/documents/{id}/download` - Download document
- `DELETE /api/documents/{id}` - Delete document

### Workflows
- `GET /api/workflows/pending` - Get pending workflows for reviewer
- `GET /api/workflows/document/{documentId}` - Get document workflow history
- `POST /api/workflows/action` - Approve/reject document

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/all` - Get all users (Admin)
- `GET /api/users/role/{role}` - Get users by role (Admin/Manager)
- `PUT /api/users/{userId}/role` - Update user role (Admin)

### Audit Logs
- `GET /api/audit/all` - Get all audit logs (Admin)
- `GET /api/audit/my` - Get current user's audit logs
- `GET /api/audit/user/{userEmail}` - Get user's audit logs (Admin/Manager)
- `GET /api/audit/document/{documentId}` - Get document audit logs (Admin/Manager)

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Node.js 16+ (for frontend)
- npm or yarn (for frontend)

### Database Setup
1. Create PostgreSQL database:
```sql
CREATE DATABASE document_approval_db;
```

2. Update `application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/document_approval_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Email Configuration
Update email settings in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### Running the Application

#### Backend Setup
1. Clone the repository
```bash
git clone https://github.com/Harsha430/Document-Processing-Approval-Engine.git
cd Document-Processing-Approval-Engine
```

2. Copy and configure application properties
```bash
cp src/main/resources/application-example.properties src/main/resources/application.properties
# Edit application.properties with your database and email credentials
```

3. Run the backend
```bash
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`

#### Frontend Setup
1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```
Frontend will start on `http://localhost:3000`

### API Documentation
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`

## Default Users

The system creates default users on startup:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@documentapproval.com | admin123 |
| Manager | manager@documentapproval.com | manager123 |
| Officer | officer@documentapproval.com | officer123 |
| User | alice@documentapproval.com | user123 |
| User | bob@documentapproval.com | user123 |

## Testing

Run tests with: `mvn test`

The test suite includes:
- Unit tests for services
- Integration tests for controllers
- Security tests
- Database tests with H2

## Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## File Upload

- Supported formats: PDF, DOC, DOCX, TXT
- Maximum file size: 10MB
- Files stored in configurable directory
- File validation and security checks

## Workflow Process

1. User uploads document
2. System creates workflow with three approval levels
3. Officer receives notification and reviews (Level 1)
4. If approved, Manager receives notification and reviews (Level 2)
5. If approved, Admin receives notification and reviews (Level 3)
6. Document uploader receives final status notification
7. All actions are logged in audit trail

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.
