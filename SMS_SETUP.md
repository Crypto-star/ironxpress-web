# SMS OTP Setup for Phone Authentication

## Overview
The IronXpress app now supports both email+password and phone+OTP authentication methods. Phone authentication requires SMS service configuration in Supabase.

## SMS Provider Setup Required

### For Production Use
To enable phone authentication with OTP, you need to configure an SMS provider in your Supabase project:

1. **Go to Supabase Dashboard** → Authentication → Settings
2. **Add SMS Provider**: Choose from supported providers like:
   - Twilio
   - MessageBird
   - Textlocal
   - Vonage

3. **Configure Provider**: Add your API credentials
4. **Set Phone Auth Settings**: Enable phone signup/signin

### Current Implementation
- **Phone + OTP**: Uses `supabase.auth.signInWithOtp()` for sending SMS
- **Email + Password**: Uses `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`
- **Graceful Fallback**: Users can switch between methods if SMS fails

### Error Handling
- Shows specific error message if SMS service is not configured
- Suggests using email authentication as alternative
- Provides clear feedback for authentication failures

### Testing Without SMS
For development/testing without SMS setup:
1. Use email authentication method
2. The app will work fully with email+password
3. Phone authentication will show error but won't break the app

## Next Steps
1. Choose and configure SMS provider in Supabase
2. Test phone authentication in production
3. Consider adding phone number verification step for security
