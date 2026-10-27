import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language } from '../data/places'
import { en, si } from '../data/translations'

const LanguageContext = createContext<{
  language: Language
  toggleLanguage: () => void
  t: Record<keyof typeof en, string>
} | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage: () => setLanguage((value) => (value === 'en' ? 'si' : 'en')),
        t: language === 'en' ? en : si,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// Shared with every component so switching language preserves quiz and tour state.
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('LanguageProvider is required')
  return context
}
