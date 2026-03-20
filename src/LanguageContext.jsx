import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

const LANGUAGES = ['it', 'en', 'pl', 'de', 'es', 'fr'];

const LANGUAGE_LABELS = {
    it: 'https://flagcdn.com/w40/it.png',
    en: 'https://flagcdn.com/w40/gb.png',
    pl: 'https://flagcdn.com/w40/pl.png',
    de: 'https://flagcdn.com/w40/de.png',
    es: 'https://flagcdn.com/w40/es.png',
    fr: 'https://flagcdn.com/w40/fr.png'
};

const LANGUAGE_NAMES = {
    it: 'Italiano',
    en: 'English',
    pl: 'Polski',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français'
};

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('appLang') || 'it';
    });

    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        localStorage.setItem('appLang', lang);
    }, []);

    const t = useCallback((key) => {
        const entry = translations[key];
        if (!entry) return key;
        return entry[language] || entry['it'] || key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGES, LANGUAGE_LABELS, LANGUAGE_NAMES }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
