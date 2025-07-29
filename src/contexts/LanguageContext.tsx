import React, { createContext, useContext, useState } from 'react'

export type Language = 'en' | 'hi' | 'or'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Common
    'app.name': 'IronXpress',
    'common.continue': 'Continue',
    'common.loading': 'Loading...',
    'common.home': 'Home',
    'common.cart': 'Cart',
    'common.notifications': 'Notifications',
    'common.profile': 'Profile',
    'common.logout': 'Logout',
    'common.add_to_cart': 'Add to Cart',
    'common.quantity': 'Quantity',
    'common.total': 'Total',
    'common.apply': 'Apply',
    'common.proceed': 'Proceed',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    
    // Splash Screen
    'splash.plugging': 'Plugging in services...',
    'splash.notifications': 'Generating notifications...',
    'splash.optimization': 'Power optimization...',
    'splash.temperature': 'Reaching perfect temperature...',
    'splash.ready': 'Ready at your service...',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.name': 'Name',
    'auth.phone': 'Phone Number',
    'auth.otp': 'OTP',
    'auth.enter_phone': 'Enter your phone number',
    'auth.enter_otp': 'Enter OTP sent to your phone',
    'auth.verify': 'Verify',
    'auth.resend_otp': 'Resend OTP',
    
    // Home
    'home.welcome': 'Welcome back!',
    'home.services': 'Our Services',
    'home.select_language': 'Select Language',
    
    // Services
    'service.electric_iron': 'Electric Iron',
    'service.steam_iron': 'Steam Iron',
    'service.coal_iron': 'Coal Iron',
    
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.coupon': 'Apply Coupon',
    'cart.delivery_address': 'Proceed to Delivery Address',
    
    // Address
    'address.title': 'Delivery Address',
    'address.add_new': 'Add New Address',
    'address.select_slot': 'Select Delivery Slot',
    'address.morning': 'Morning (9 AM - 12 PM)',
    'address.afternoon': 'Afternoon (12 PM - 6 PM)',
    'address.evening': 'Evening (6 PM - 9 PM)',
    
    // Order
    'order.success': 'Order Placed Successfully!',
    'order.id': 'Order ID',
    'order.go_home': 'Go to Home',
    
    // Profile
    'profile.personal_info': 'Personal Information',
    'profile.language_preference': 'Language Preference',
    'profile.support': 'Support',
    
    // Support
    'support.title': 'Contact Support',
    'support.message': 'How can we help you?',
    'support.send': 'Send Message',
    'support.faqs': 'Frequently Asked Questions',
  },
  hi: {
    // Common
    'app.name': 'आयरनएक्सप्रेस',
    'common.continue': 'जारी रखें',
    'common.loading': 'लोड हो रहा है...',
    'common.home': 'होम',
    'common.cart': 'कार्ट',
    'common.notifications': 'सूचनाएं',
    'common.profile': 'प्रोफ़ाइल',
    'common.logout': 'लॉग आउट',
    'common.add_to_cart': 'कार्ट में जोड़ें',
    'common.quantity': 'मात्रा',
    'common.total': 'कुल',
    'common.apply': 'लागू करें',
    'common.proceed': 'आगे बढ़ें',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    
    // Splash Screen
    'splash.plugging': 'सेवाएं प्लग इन कर रहे हैं...',
    'splash.notifications': 'सूचनाएं जेनरेट कर रहे हैं...',
    'splash.optimization': 'पावर ऑप्टिमाइज़ेशन...',
    'splash.temperature': 'परफेक्ट तापमान तक पहुंच रहे हैं...',
    'splash.ready': 'आपकी सेवा में तैयार हैं...',
    
    // Auth
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.name': 'नाम',
    'auth.phone': 'फोन नंबर',
    'auth.otp': 'ओटीपी',
    'auth.enter_phone': 'अपना फोन नंबर डालें',
    'auth.enter_otp': 'फोन पर भेजा गया ओटीपी डालें',
    'auth.verify': 'सत्यापित करें',
    'auth.resend_otp': 'ओटीपी फिर से भेजें',
    
    // Home
    'home.welcome': 'वापस स्वागत है!',
    'home.services': 'हमारी सेवाएं',
    'home.select_language': 'भाषा चुनें',
    
    // Services
    'service.electric_iron': 'इलेक्ट्रिक आयरन',
    'service.steam_iron': 'स्टीम आयरन',
    'service.coal_iron': 'कोयला आयरन',
    
    // Cart
    'cart.title': 'आपका कार्ट',
    'cart.empty': 'आपका कार्ट खाली है',
    'cart.coupon': 'कूपन लगाएं',
    'cart.delivery_address': 'डिलीवरी पते पर जाएं',
    
    // Address
    'address.title': 'डिलीवरी पता',
    'address.add_new': 'नया पता जोड़ें',
    'address.select_slot': 'डिलीवरी स्लॉट चुनें',
    'address.morning': 'सुबह (9 AM - 12 PM)',
    'address.afternoon': 'दोपहर (12 PM - 6 PM)',
    'address.evening': 'शाम (6 PM - 9 PM)',
    
    // Order
    'order.success': 'ऑर्डर सफलतापूर्वक दिया गया!',
    'order.id': 'ऑर्डर आईडी',
    'order.go_home': 'होम पर जाएं',
    
    // Profile
    'profile.personal_info': 'व्यक्तिगत जानकारी',
    'profile.language_preference': 'भाषा प्राथमिकता',
    'profile.support': 'सहायता',
    
    // Support
    'support.title': 'सहायता से संपर्क करें',
    'support.message': 'हम आपकी कैसे मदद कर सकते हैं?',
    'support.send': 'संदेश भेजें',
    'support.faqs': 'अक्सर पूछे जाने वाले प्रश्न',
  },
  or: {
    // Common (Odia)
    'app.name': 'ଆଇରନଏକ୍ସପ୍ରେସ',
    'common.continue': 'ଅଗ୍ରସର ହୁଅନ୍ତୁ',
    'common.loading': 'ଲୋଡ଼ ହେଉଛି...',
    'common.home': 'ଘର',
    'common.cart': 'କାର୍ଟ',
    'common.notifications': 'ବିଜ୍ଞପ୍ତି',
    'common.profile': 'ପ୍ରୋଫାଇଲ',
    'common.logout': 'ଲଗ ଆଉଟ',
    'common.add_to_cart': 'କାର୍ଟରେ ଯୋଗ କରନ୍ତୁ',
    'common.quantity': 'ପରିମାଣ',
    'common.total': 'ମୋଟ',
    'common.apply': 'ପ୍ରୟୋଗ କରନ୍ତୁ',
    'common.proceed': 'ଆଗକୁ ଯାଆନ୍ତୁ',
    'common.cancel': 'ବାତିଲ କରନ୍ତୁ',
    'common.confirm': 'ନିଶ୍ଚିତ କରନ୍ତୁ',
    
    // Splash Screen
    'splash.plugging': 'ସେବା ପ୍ଲଗ ଇନ କରୁଛି...',
    'splash.notifications': 'ବିଜ୍ଞପ୍ତି ସୃଷ୍ଟି କରୁଛି...',
    'splash.optimization': 'ପାୱାର ଅପ୍ଟିମାଇଜେସନ...',
    'splash.temperature': 'ପରଫେକ୍ଟ ତାପମାତ୍ରାରେ ପହଞ୍ଚୁଛି...',
    'splash.ready': 'ଆପଣଙ୍କ ସେବାରେ ପ୍ରସ୍ତୁତ...',
    
    // Auth
    'auth.login': 'ଲଗଇନ',
    'auth.signup': 'ସାଇନ ଅପ',
    'auth.name': 'ନାମ',
    'auth.phone': 'ଫୋନ ନମ୍ବର',
    'auth.otp': 'ଓଟିପି',
    'auth.enter_phone': 'ଆପଣଙ୍କ ଫୋନ ନମ୍ବର ଦିଅନ୍ତୁ',
    'auth.enter_otp': 'ଫୋନରେ ପଠାଯାଇଥିବା ଓଟିପି ଦିଅନ୍ତୁ',
    'auth.verify': 'ଯାଞ୍ଚ କରନ୍ତୁ',
    'auth.resend_otp': 'ଓଟିପି ପୁନଃ ପଠାନ୍ତୁ',
    
    // Home
    'home.welcome': 'ପୁନଃ ସ୍ୱାଗତମ!',
    'home.services': 'ଆମର ସେବା',
    'home.select_language': 'ଭାଷା ବାଛନ୍ତୁ',
    
    // Services
    'service.electric_iron': 'ଇଲେକ୍ଟ୍ରିକ ଆଇରନ',
    'service.steam_iron': 'ଷ୍ଟିମ ଆଇରନ',
    'service.coal_iron': 'କୋଇଲା ଆଇରନ',
    
    // Cart
    'cart.title': 'ଆପଣଙ୍କ କାର୍ଟ',
    'cart.empty': 'ଆପଣଙ୍କ କାର୍ଟ ଖାଲି ଅଛି',
    'cart.coupon': 'କୁପନ ପ୍ରୟୋଗ କରନ୍ତୁ',
    'cart.delivery_address': 'ଡେଲିଭରି ଠିକଣାକୁ ଯାଆନ୍ତୁ',
    
    // Address
    'address.title': 'ଡେଲିଭରି ଠିକଣା',
    'address.add_new': 'ନୂତନ ଠିକଣା ଯୋଗ କରନ୍ତୁ',
    'address.select_slot': 'ଡେଲିଭରି ସ୍ଲଟ ବାଛନ୍ତୁ',
    'address.morning': 'ସକାଳ (9 AM - 12 PM)',
    'address.afternoon': 'ମଧ୍ୟାହ୍ନ (12 PM - 6 PM)',
    'address.evening': 'ସନ୍ଧ୍ୟା (6 PM - 9 PM)',
    
    // Order
    'order.success': 'ଅର୍ଡର ସଫଳତାର ସହ ଦିଆଯାଇଛି!',
    'order.id': 'ଅର୍ଡର ଆଇଡି',
    'order.go_home': 'ଘରକୁ ଯାଆନ୍ତୁ',
    
    // Profile
    'profile.personal_info': 'ବ୍ୟକ୍ତିଗତ ସୂଚନା',
    'profile.language_preference': 'ଭାଷା ପସନ୍ଦ',
    'profile.support': 'ସହାୟତା',
    
    // Support
    'support.title': 'ସହାୟତା ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ',
    'support.message': 'ଆମେ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବା?',
    'support.send': 'ସନ୍ଦେଶ ପଠାନ୍ତୁ',
    'support.faqs': 'ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const value = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
