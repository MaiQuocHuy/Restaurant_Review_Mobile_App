# Restaurant Review App

A comprehensive mobile application and backend system for discovering, reviewing, and managing restaurants. This full-stack solution includes a React Native mobile app with Node.js backend API.

## 🏗️ Project Architecture

```
Restaurant_Review_App/
├── 📱 Frontend (React Native)
│   ├── src/
│   │   ├── screens/          # App screens/pages
│   │   ├── components/       # Reusable UI components
│   │   ├── navigators/       # Navigation configuration
│   │   ├── contexts/         # React Context providers
│   │   ├── utils/           # Utility functions
│   │   ├── helpers/         # Helper functions
│   │   ├── constants/       # App constants
│   │   └── assets/          # Images, fonts, etc.
│   └── ...

Restaurant_Review_App_BE/
├── 🚀 Backend (Node.js/Express)
│   ├── routes/              # API route definitions
│   ├── models/              # MongoDB data models
│   ├── controllers/         # Business logic
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── utils/               # Backend utilities
│   ├── helpers/             # Helper functions
│   ├── admin/               # Admin functionality
│   └── server.js            # Main server file
```

## ✨ Features

### 🍽️ Core Features
- **Restaurant Discovery**: Browse and search restaurants with location-based services
- **Reviews & Ratings**: Read and write detailed restaurant reviews
- **Real-time Updates**: Live notifications and real-time commenting system
- **Menu Management**: View detailed restaurant menus and pricing
- **Voucher System**: Access and redeem restaurant vouchers and promotions
- **User Profiles**: Manage personal profiles and review history
- **Admin Dashboard**: Complete administrative control panel

### 📱 Mobile App Features
- **Interactive Maps**: Find restaurants using integrated mapping
- **Photo Upload**: Share food and restaurant photos with reviews
- **Location Services**: GPS-based restaurant recommendations


### 🔐 Security Features
- **JWT Authentication**: Secure user authentication system
- **Password Encryption**: bcrypt-secured password storage

## 🛠️ Technology Stack

### Frontend (React Native)
- **Framework**: React Native 0.73.6
- **Navigation**: React Navigation (Stack, Tab, Drawer)
- **Styling**: TailwindCSS (NativeWind), React Native Linear Gradient
- **Maps**: Mapbox, React Native Maps, Google Places Autocomplete
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Custom components with gesture handling
- **Image Handling**: React Native Image Picker

### Backend (Node.js/Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer, Cloudinary integration
- **Image Processing**: Sharp
- **Email**: Nodemailer
- **Security**: Helmet, CORS
- **Logging**: Morgan

## 🚀 Getting Started

### Prerequisites
- Node.js (>=18)
- npm or yarn
- MongoDB instance
- React Native development environment
- Android Studio/Xcode for mobile development

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Restaurant_Review_App_BE
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://localhost:27017/restaurant_review
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. **Start the development server**
```bash
npm run server
```

The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd Restaurant_Review_App
```

2. **Install dependencies**
```bash
npm install
```

3. **Configuration**
Update the backend API URL in `package.json`:
```json
{
  "projectConfig": {
    "backendApiBaseUrl": "http://localhost:8080"
  }
}
```

4. **Platform-specific setup**

For iOS:
```bash
cd ios && pod install && cd ..
npm run ios
```

For Android:
```bash
npm run android
```

5. **Start Metro bundler**
```bash
npm start
```

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/forgot-password` - Password reset request
- `POST /api/reset-password` - Password reset confirmation

### Restaurant Endpoints
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create new restaurant (Owner/Admin)
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Review/Post Endpoints
- `GET /api/posts` - Get all reviews
- `GET /api/posts/:id` - Get specific review
- `POST /api/posts` - Create new review
- `PUT /api/posts/:id` - Update review
- `DELETE /api/posts/:id` - Delete review

### Menu Endpoints
- `GET /api/menus` - Get restaurant menus
- `POST /api/menus` - Add menu item
- `PUT /api/menus/:id` - Update menu item
- `DELETE /api/menus/:id` - Delete menu item

### Voucher Endpoints
- `GET /api/vouchers` - Get available vouchers
- `POST /api/vouchers` - Create voucher (Admin)
- `PUT /api/vouchers/:id` - Update voucher
- `DELETE /api/vouchers/:id` - Delete voucher

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/dashboard` - Admin dashboard data
- `POST /api/admin/restaurants/approve` - Approve restaurant
- `DELETE /api/admin/users/:id` - Delete user

## 🎯 User Roles

### Regular Users
- Browse and search restaurants
- Write and read reviews
- Upload photos
- Redeem vouchers
- Receive notifications

### Restaurant Owners
- Manage restaurant profiles
- Update menu items
- Respond to reviews
- Create promotional vouchers
- View analytics

### Administrators
- Manage all users and restaurants
- Moderate content


## 📱 Mobile App Features

### Core Screens
- **Home**: Restaurant discovery and featured content
- **Search**: Advanced restaurant search with filters
- **Map View**: Location-based restaurant finder
- **Restaurant Details**: Complete restaurant information
- **Review System**: Read and write reviews
- **Profile**: User account management
- **Settings**: App customization options

### Navigation Structure
- **Tab Navigation**: Primary app sections
- **Stack Navigation**: Screen transitions
- **Drawer Navigation**: Side menu access

## 🧪 Testing

### Backend Testing
```bash
cd Restaurant_Review_App_BE
npm test
```

### Frontend Testing
```bash
cd Restaurant_Review_App
npm test
```

## 📦 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Configure production MongoDB URI
3. Set up SSL certificates
4. Deploy to preferred hosting service (Heroku, AWS, DigitalOcean)

### Frontend Deployment
1. Build the production app:
```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
```

2. Generate signed APK/IPA files
3. Deploy to app stores (Google Play Store, Apple App Store)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Guidelines

- Follow ESLint configuration for code style
- Use meaningful commit messages
- Add tests for new features
- Update documentation for API changes
- Ensure cross-platform compatibility

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

**Android build issues:**
```bash
cd android && ./gradlew clean && cd ..
```

**iOS build issues:**
```bash
cd ios && rm -rf Pods && pod install && cd ..
```

**Database connection issues:**
- Check MongoDB connection string
- Ensure MongoDB service is running
- Verify network connectivity

## 👨‍💻 Author

**qugnart** - Initial work and development

## 🙏 Acknowledgments

- React Native community for excellent documentation
- MongoDB team for robust database solutions
- Cloudinary for image management services
- Mapbox for mapping services

---
**Note**: This is a comprehensive restaurant review application designed for both end users and restaurant owners, location services, and a robust administrative system.