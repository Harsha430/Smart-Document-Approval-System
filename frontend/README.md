# Smart Document Approval System - Frontend

A beautiful and elegant React frontend for the Smart Document Approval System with excellent UI/UX, built with React + Vite, Tailwind CSS 3, and Flowbite components.

## ✨ Features

- **🎨 Beautiful UI/UX**: Modern, elegant design with smooth animations
- **📊 Excellent Progress Visualization**: Beautiful review progress bars and workflow tracking
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔐 Role-based Access**: Different interfaces for different user roles
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds
- **🎭 Smooth Animations**: Framer Motion for delightful user interactions
- **🎯 Type Safety**: Well-structured components with proper prop validation
- **🔄 Real-time Updates**: React Query for efficient data fetching and caching

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Next generation frontend tooling
- **Tailwind CSS 3** - Utility-first CSS framework
- **Flowbite React** - Beautiful React components
- **Framer Motion** - Production-ready motion library
- **React Router DOM** - Declarative routing
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant forms with easy validation
- **Lucide React** - Beautiful & consistent icons
- **React Hot Toast** - Smoking hot notifications
- **Axios** - Promise-based HTTP client
- **Date-fns** - Modern JavaScript date utility library

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Auth/         # Authentication components
│   │   ├── Dashboard/    # Dashboard components
│   │   ├── Documents/    # Document-related components
│   │   ├── Layout/       # Layout components
│   │   └── Workflows/    # Workflow components
│   ├── pages/            # Page components
│   │   ├── Auth/         # Login, Register
│   │   ├── Dashboard/    # Dashboard page
│   │   ├── Documents/    # Document pages
│   │   ├── Workflows/    # Workflow pages
│   │   ├── Users/        # User management
│   │   ├── Profile/      # User profile
│   │   └── AuditLogs/    # Audit logs
│   ├── services/         # API services
│   ├── stores/           # Zustand stores
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md
```

## 🎨 Key Features

### Beautiful Dashboard
- **Stats Cards**: Animated statistics with trend indicators
- **Recent Documents**: Card-based document display with status indicators
- **Workflow Progress**: Excellent progress visualization for document reviews
- **Quick Actions**: Easy access to common tasks

### Excellent Review Progress Bars
- **Multi-stage Progress**: Visual representation of 3-stage approval process
- **Real-time Updates**: Progress updates as documents move through workflow
- **Status Indicators**: Clear visual indicators for each review stage
- **Interactive Elements**: Hover effects and smooth animations

### Document Management
- **Grid/Table Views**: Switch between card grid and table layouts
- **Advanced Filtering**: Filter by status, search by title
- **Drag & Drop Upload**: Intuitive file upload with validation
- **File Type Support**: PDF, DOC, DOCX, TXT files up to 10MB

### Workflow Management
- **Review Cards**: Beautiful cards showing pending reviews
- **Action Buttons**: Quick approve/reject with comment modal
- **Progress Tracking**: Visual workflow progress for each document
- **Status Management**: Clear status indicators and transitions

## 🔐 Authentication & Authorization

### Login Credentials
```
Admin:   admin@documentapproval.com / admin123
Manager: manager@documentapproval.com / manager123
Officer: officer@documentapproval.com / officer123
User:    alice@documentapproval.com / user123
```

### Role-based Features
- **USER**: Upload documents, view own documents
- **OFFICER**: Review documents (Level 1)
- **MANAGER**: Review documents (Level 2), view all documents
- **ADMIN**: Full access, user management, audit logs

## 🎭 Animations & Interactions

- **Page Transitions**: Smooth fade-in animations for page loads
- **Hover Effects**: Subtle hover animations on interactive elements
- **Loading States**: Beautiful loading spinners and skeleton screens
- **Micro-interactions**: Button press animations, form validations
- **Progress Animations**: Animated progress bars and status changes

## 📱 Responsive Design

- **Mobile First**: Designed for mobile, enhanced for desktop
- **Breakpoints**: Tailored for all screen sizes
- **Touch Friendly**: Large touch targets for mobile users
- **Adaptive Layout**: Components adapt to screen size

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette
- Extended animations
- Flowbite plugin integration
- Custom component classes

## 🚀 Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized images and icons
- **Bundle Analysis**: Optimized bundle size
- **Caching**: Efficient API response caching with React Query

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Flowbite**
