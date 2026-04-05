import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { useAuth } from './AuthContext'
import { translations } from '../i18n'

const I18nContext = createContext()

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const { user } = useAuth()

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage')
    if (savedLang) setLanguage(savedLang)
    else if (user?.preferred_language) setLanguage(user.preferred_language)
  }, [user])

  const changeLanguage = async (lang) => {
    setLanguage(lang)
    localStorage.setItem('preferredLanguage', lang)
    if (user) {
      try {
        await authAPI.updatePreferences(lang)
      } catch (error) {
        console.error('Failed to update language preference:', error)
      }
    }
  }

  const t = (key) => translations[language]?.[key] || translations.en[key] || key
  const value = { language, changeLanguage, t }
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}