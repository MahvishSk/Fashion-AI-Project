// translations.js — Add all your page text here
// Usage: const { t } = useApp();  then use t.home.title etc.

const translations = {
  English: {
    // ── Common / Nav
    nav: {
      home: 'Home',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
    },

    // ── Welcome Page
    welcome: {
      tagline: 'Your Beauty, Your Way',
      login: 'Login',
      signup: 'Sign Up',
    },

    // ── Home Page
    home: {
      heroTitle: 'Welcome to GlowUp',
      heroSubtitle: 'Discover Your Beauty',
      heroText: 'Explore tips, products & more',
      suggestionsBtn: 'Get Suggestions',
      featuresTitle: 'What We Offer',
      tipsTitle: 'Tip of the Day',
      categoriesTitle: 'Shop by Category',
    },

    // ── Profile Page
    profile: {
      title: 'My Profile',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      dob: 'Date of Birth',
      gender: 'Gender',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      changePassword: 'Change Password',
      logout: 'Logout',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      submit: 'Submit',
      close: 'Close',
    },

    // ── Settings Page
    settings: {
      title: 'Settings',
      general: 'General',
      personalDetails: 'Personal Details',
      preferences: 'Preferences',
      language: 'Language',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      notifications: 'Notifications',
      ratings: 'Ratings',
      feedback: 'Feedback',
      support: 'Support',
      helpCenter: 'Help Center',
      contactUs: 'Contact Us',
      account: 'Account',
      deleteAccount: 'Delete Account',
      logout: 'Logout',
      editProfile: 'Edit Profile',
      // Modal text
      feedbackTitle: 'Feedback',
      feedbackRate: 'Rate your experience:',
      feedbackMessage: 'Your message:',
      feedbackPlaceholder: 'Tell us about your experience...',
      deleteTitle: 'Delete Account',
      deleteConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
      logoutTitle: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?',
      yes: 'Yes',
      no: 'No',
      cancel: 'Cancel',
      submit: 'Submit',
    },

    // ── Login / Signup
    auth: {
      loginTitle: 'Login',
      signupTitle: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      username: 'Username',
      loginBtn: 'Login',
      signupBtn: 'Sign Up',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
    },
  },

  // ─────────────── HINDI ───────────────
  Hindi: {
    nav: {
      home: 'होम',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      logout: 'लॉग आउट',
    },

    welcome: {
      tagline: 'आपकी सुंदरता, आपके तरीके से',
      login: 'लॉगिन',
      signup: 'साइन अप',
    },

    home: {
      heroTitle: 'GlowUp में आपका स्वागत है',
      heroSubtitle: 'अपनी सुंदरता खोजें',
      heroText: 'टिप्स, प्रोडक्ट्स और बहुत कुछ देखें',
      suggestionsBtn: 'सुझाव पाएं',
      featuresTitle: 'हम क्या प्रदान करते हैं',
      tipsTitle: 'आज की टिप',
      categoriesTitle: 'श्रेणी के अनुसार खरीदें',
    },

    profile: {
      title: 'मेरी प्रोफ़ाइल',
      firstName: 'पहला नाम',
      lastName: 'अंतिम नाम',
      email: 'ईमेल',
      phone: 'फ़ोन',
      dob: 'जन्म तिथि',
      gender: 'लिंग',
      edit: 'संपादित करें',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      changePassword: 'पासवर्ड बदलें',
      logout: 'लॉग आउट',
      oldPassword: 'पुराना पासवर्ड',
      newPassword: 'नया पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      submit: 'जमा करें',
      close: 'बंद करें',
    },

    settings: {
      title: 'सेटिंग्स',
      general: 'सामान्य',
      personalDetails: 'व्यक्तिगत विवरण',
      preferences: 'प्राथमिकताएं',
      language: 'भाषा',
      theme: 'थीम',
      themeLight: 'हल्की',
      themeDark: 'गहरी',
      notifications: 'सूचनाएं',
      ratings: 'रेटिंग',
      feedback: 'प्रतिक्रिया',
      support: 'सहायता',
      helpCenter: 'सहायता केंद्र',
      contactUs: 'संपर्क करें',
      account: 'खाता',
      deleteAccount: 'खाता हटाएं',
      logout: 'लॉग आउट',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      feedbackTitle: 'प्रतिक्रिया',
      feedbackRate: 'अपना अनुभव रेट करें:',
      feedbackMessage: 'आपका संदेश:',
      feedbackPlaceholder: 'अपना अनुभव बताएं...',
      deleteTitle: 'खाता हटाएं',
      deleteConfirm: 'क्या आप वाकई अपना खाता हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
      logoutTitle: 'लॉग आउट',
      logoutConfirm: 'क्या आप वाकई लॉग आउट करना चाहते हैं?',
      yes: 'हाँ',
      no: 'नहीं',
      cancel: 'रद्द करें',
      submit: 'जमा करें',
    },

    auth: {
      loginTitle: 'लॉगिन',
      signupTitle: 'साइन अप',
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      username: 'उपयोगकर्ता नाम',
      loginBtn: 'लॉगिन',
      signupBtn: 'साइन अप',
      forgotPassword: 'पासवर्ड भूल गए?',
      noAccount: 'खाता नहीं है?',
      hasAccount: 'पहले से खाता है?',
    },
  },
};

export default translations;