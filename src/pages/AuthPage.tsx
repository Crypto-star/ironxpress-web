import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'
import { PhoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    otp: ''
  })
  const [loading, setLoading] = useState(false)

  const { signInWithPhone, signInWithEmail, signUpWithEmail, verifyOTP } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setLoading(true)
    try {
      await signInWithPhone(formData.phone)
      setStep('otp')
      toast.success('OTP sent to your phone!')
    } catch (error: any) {
      if (error.message.includes('SMS') || error.message.includes('sms')) {
        toast.error('SMS service not configured. Contact support or use email login.')
      } else {
        toast.error(error.message || 'Failed to send OTP')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      if (activeTab === 'login') {
        await signInWithEmail(formData.email, formData.password)
        toast.success('Login successful!')
      } else {
        await signUpWithEmail(formData.email, formData.password, formData.name)
        toast.success('Account created successfully!')
      }
      navigate('/home')
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password')
      } else if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists')
      } else {
        toast.error(error.message || `Failed to ${activeTab}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      await verifyOTP(formData.phone, formData.otp)
      toast.success('Login successful!')
      navigate('/home')
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      await signInWithPhone(formData.phone)
      toast.success('OTP resent!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP')
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('app.name')}</h1>
          <p className="text-white/80">Your trusted ironing service</p>
        </div>

        {/* Auth Card */}
        <div className="card">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('login')}
            >
              {t('auth.login')}
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              {t('auth.signup')}
            </button>
          </div>

          {/* Authentication Method Selector */}
          <div className="flex mb-4 bg-gray-50 rounded-lg p-1">
            <button
              type="button"
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                authMethod === 'phone'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setAuthMethod('phone')}
            >
              📱 Phone + OTP
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                authMethod === 'email'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setAuthMethod('email')}
            >
              ✉️ Email + Password
            </button>
          </div>

          {/* SMS Service Notice */}
          {authMethod === 'phone' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-800">
                <strong>Note:</strong> Phone authentication requires SMS service configuration. If OTP fails, please use email authentication.
              </p>
            </div>
          )}

          {/* Form */}
          {authMethod === 'phone' && step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your full name"
                    required={activeTab === 'signup'}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder={t('auth.enter_phone')}
                    required
                  />
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? t('common.loading') : t('common.continue')}
              </button>
            </form>
          ) : authMethod === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your full name"
                    required={activeTab === 'signup'}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your password (min 6 characters)"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? t('common.loading') : (activeTab === 'login' ? t('auth.login') : t('auth.signup'))}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <ShieldCheckIcon className="h-12 w-12 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {t('auth.enter_otp')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Sent to: {formData.phone}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.otp')}
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="••••••"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? t('common.loading') : t('auth.verify')}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                className="btn-secondary w-full"
              >
                {t('auth.resend_otp')}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-gray-600 text-sm hover:text-gray-800"
              >
                ← Change phone number
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/70 text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
