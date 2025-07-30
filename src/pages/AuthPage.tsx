import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'
import { Phone, Shield, Mail, ArrowLeft } from 'lucide-react'

const AuthPage: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  })
  const [loading, setLoading] = useState(false)

  const { signInWithPhone, signInWithGoogle, verifyOTP } = useAuth()
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

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Login successful!')
      navigate('/home')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google')
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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: 'url(https://qehtgclgjhzdlqcjujpp.supabase.co/storage/v1/object/public/public-assets/backgrounds/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 relative z-10">
        <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <ArrowLeft size={24} />
        </Link>

        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-[#2196F3] mb-2">ironXpress</div>
          <h2 className="text-2xl font-bold text-[#333333]">Welcome Back</h2>
          <p className="text-[#607D8B] mt-2">Please sign in to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-[#E0E0E0] rounded-xl hover:bg-[#F5F5F5] hover:border-[#2196F3] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700">{loading ? 'Redirecting...' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-sm font-medium text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="input-field w-full pl-12"
                    required
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div className="text-center">
                <Shield size={48} className="mx-auto text-[#2196F3] mb-3" />
                <p className="text-[#607D8B]">Enter the OTP sent to <strong className="text-[#333333]">{formData.phone}</strong></p>
              </div>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-[#333333] mb-1">OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="••••••"
                  className="input-field text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button type="button" onClick={() => setStep('phone')} className="w-full text-center text-sm text-[#607D8B] hover:text-[#2196F3] mt-2">
                Go back
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our <Link to="/terms" className="underline hover:text-blue-600">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-blue-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage
