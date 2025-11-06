# 🚀 MERN Stack Learning Project

A comprehensive MERN (MongoDB, Express.js, React, Node.js) stack application built for learning full-stack web development fundamentals.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Learning Objectives](#learning-objectives)
- [Contributing](#contributing)

## 🎯 Project Overview

This project demonstrates the integration of:
- **Backend**: RESTful API with Node.js and Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React with modern hooks and components
- **Authentication**: JWT-based user authentication
- **Full CRUD Operations**: Create, Read, Update, Delete functionality

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling and responsive design

### Development Tools
- **Nodemon** - Development server auto-restart
- **Concurrently** - Run multiple commands simultaneously
- **Git** - Version control

## 📁 Project Structure

```
mern-project/
├── backend/                 # Express.js API server
│   ├── models/             # Database schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── config/            # Configuration files
│   └── server.js          # Entry point
├── frontend/              # React application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service functions
│   │   └── App.js        # Main app component
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mern-learning-project.git
   cd mern-learning-project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env file with your MongoDB connection string
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🎓 Learning Objectives

This project covers:

### Backend Development
- ✅ Setting up Express.js server
- ✅ Creating RESTful API endpoints
- ✅ MongoDB integration with Mongoose
- ✅ User authentication with JWT
- ✅ Input validation and error handling
- ✅ Middleware implementation

### Frontend Development
- ✅ React component creation
- ✅ State management with hooks
- ✅ React Router for navigation
- ✅ API integration with Axios
- ✅ Form handling and validation
- ✅ Responsive design

### Full-Stack Integration
- ✅ Frontend-backend communication
- ✅ Authentication flow
- ✅ CRUD operations
- ✅ Error handling across the stack

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/mern-learning-project](https://github.com/yourusername/mern-learning-project)

---

⭐ **Star this repository if it helped you learn MERN stack!**