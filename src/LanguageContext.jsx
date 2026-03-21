import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();
const LANGUAGE_STORAGE_KEY = 'appLanguage';

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

const getInitialLanguage = () => {
    if (typeof window === 'undefined') {
        return 'it';
    }

    let storedLang = '';

    try {
        storedLang = window.localStorage?.getItem(LANGUAGE_STORAGE_KEY) || '';
    } catch (error) {
        storedLang = '';
    }

    const lang = (storedLang || window.__appLanguage || document.documentElement.lang || navigator.language || 'it').slice(0, 2).toLowerCase();
    return LANGUAGES.includes(lang) ? lang : 'it';
};

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(getInitialLanguage);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const handleLanguageChange = (event) => {
            const nextLang = event.detail?.lang;

            if (!nextLang || !LANGUAGES.includes(nextLang)) {
                return;
            }

            setLanguageState((currentLang) => currentLang === nextLang ? currentLang : nextLang);
        };

        const handleStorage = (event) => {
            if (event.key !== LANGUAGE_STORAGE_KEY || !event.newValue || !LANGUAGES.includes(event.newValue)) {
                return;
            }

            setLanguageState((currentLang) => currentLang === event.newValue ? currentLang : event.newValue);
        };

        window.addEventListener('appLanguageChanged', handleLanguageChange);
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('appLanguageChanged', handleLanguageChange);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.__appLanguage = language;
        document.documentElement.lang = language;

        try {
            window.localStorage?.setItem(LANGUAGE_STORAGE_KEY, language);
        } catch (error) {
        }
    }, [language]);

    const setLanguage = useCallback((lang) => {
        if (!LANGUAGES.includes(lang)) {
            return;
        }

        setLanguageState(lang);

        if (typeof window !== 'undefined') {
            window.__appLanguage = lang;
            document.documentElement.lang = lang;

            try {
                window.localStorage?.setItem(LANGUAGE_STORAGE_KEY, lang);
            } catch (error) {
            }

            window.dispatchEvent(new CustomEvent('appLanguageChanged', { detail: { lang } }));
        }
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
