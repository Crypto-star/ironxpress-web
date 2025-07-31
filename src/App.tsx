import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import SplashScreen from './pages/SplashScreen';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import AddressPickerPage from './pages/AddressPickerPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/about" element={<AboutUs />} />
              
              {/* Protected Routes */}
              <Route path="/splash" element={<ProtectedRoute><SplashScreen /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/address" element={<ProtectedRoute><AddressPickerPage /></ProtectedRoute>} />
              <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
