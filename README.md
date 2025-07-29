# IronXpress Web Application

A responsive, multi-page website version of the IronXpress mobile app that provides on-demand ironing services. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### 🎨 UI/UX
- **Responsive Design**: Mobile-first approach that scales to desktop/tablet
- **Modern Interface**: Clean, app-like UI with smooth animations and transitions
- **Theme Colors**: Deep Purple (#673AB7) and Electric Blue (#1565C0)
- **Multilingual Support**: English, Hindi, and Odia with real-time switching

### 📱 Pages & Functionality

#### 1. **Splash Screen**
- Animated iron icon with glowing effects and steam
- Sequential loading messages with progress indicator
- Auto-redirect based on authentication status

#### 2. **Authentication**
- Phone number + OTP authentication via Supabase
- Two-tab interface (Login/Signup)
- Real-time form validation

#### 3. **Home Page**
- Welcome banner with user greeting
- Language selector with flag icons
- Service categories (Electric Iron, Steam Iron, Coal Iron)
- Product grid with "Add to Cart" functionality
- Dynamic data loading from Supabase

#### 4. **Product Details**
- Product images and descriptions
- Service type selection
- Quantity selector with price calculation
- Detailed price breakdown

#### 5. **Cart Management**
- Interactive cart with quantity controls
- Coupon code application with validation
- Real-time price calculations (taxes, delivery fees)
- Empty state handling

#### 6. **Address & Delivery**
- Address book management (CRUD operations)
- Delivery slot selection (Morning/Afternoon/Evening)
- Address form with validation
- Map picker interface (mocked)

#### 7. **Order Success**
- Confirmation animation
- Order ID display
- Navigation back to home

#### 8. **Notifications**
- Notification list with read/unread states
- Different notification types (orders, promotions, general)
- Time formatting and interaction

#### 9. **Profile Management**
- User information display
- Language preference settings
- Account security information

#### 10. **Support**
- Contact options (phone, email, chat)
- Support form with categorization
- Expandable FAQ section
- Emergency contact information

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Heroicons
- **Build Tool**: Create React App
- **Deployment Ready**: Optimized production builds

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm start
```

The application will open at `http://localhost:3000`

### 3. Build for production
```bash
npm run build
```

## 📱 Database Integration

The application integrates with your existing Supabase database:
- **Supabase URL**: `https://qehtgclgjhzdlqcjujpp.supabase.co`
- **Authentication**: Phone + OTP via Supabase Auth
- **Real-time data**: Products, Cart, Orders, Addresses
- **File uploads**: Product images via Supabase Storage

## 🌍 Multilingual Support

- **English** (en) - Default
- **Hindi** (hi) - हिंदी
- **Odia** (or) - ଓଡ଼ିଆ

Language switching is instant and persists across sessions.

## 🎯 Key Features Implemented

✅ **Authentication Flow**: Phone/OTP with session management  
✅ **Shopping Experience**: Browse, select, cart, checkout  
✅ **Order Management**: Place orders with delivery scheduling  
✅ **User Experience**: Responsive, animated, multilingual  
✅ **Data Management**: Real-time updates with Supabase  

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🚀 Deployment

The application is ready for deployment to Vercel, Netlify, or any static hosting service.

---

**Built with ❤️ for IronXpress using React, TypeScript, Tailwind CSS, and Supabase**
