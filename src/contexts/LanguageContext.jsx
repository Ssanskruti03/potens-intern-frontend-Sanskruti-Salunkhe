import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

// Create the context
const LanguageContext = createContext();

// Provider component - wraps around the app
export function LanguageProvider({ children }) {
  // Get saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('preferred-language');
    return saved || 'en';
  });

  // Save language preference whenever it changes
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  // Toggle between English and Hindi
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  // Translation function
  const t = (key, params = {}) => {
    const translation = translations[key];
    if (!translation) return key;
    
    // Get text in current language, fallback to English
    let text = translation[language] || translation.en;
    
    // Replace parameters like {current} with actual values
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook for using language in components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}