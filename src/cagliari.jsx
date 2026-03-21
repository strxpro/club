import React from 'react';
import ReactDOM from 'react-dom/client';
import { LanguageProvider } from './LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

import { translations } from './translations';

const SUPPORTED_LANGUAGES = ['it', 'en', 'pl', 'de', 'es', 'fr'];
const LANGUAGE_STORAGE_KEY = 'appLanguage';

const CagliariNav = () => (
    <LanguageProvider>
        <Navbar />
    </LanguageProvider>
);

const CagliariFooter = () => (
    <LanguageProvider>
        <Footer />
    </LanguageProvider>
);

// Mount Navbar
const navRoot = document.getElementById('cagliari-navbar-root');
if (navRoot) {
    ReactDOM.createRoot(navRoot).render(<CagliariNav />);
}

// Mount Footer
const footerRoot = document.getElementById('cagliari-footer-root');
if (footerRoot) {
    ReactDOM.createRoot(footerRoot).render(<CagliariFooter />);
}

// Simple translation logic for statically rendered static HTML in cagliari.html
const getCurrentCagliariLang = () => {
    let storedLang = '';

    try {
        storedLang = window.localStorage?.getItem(LANGUAGE_STORAGE_KEY) || '';
    } catch (error) {
        storedLang = '';
    }

    const lang = (storedLang || window.__appLanguage || document.documentElement.lang || navigator.language || 'it').slice(0, 2).toLowerCase();
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : 'it';
};

const getCagliariTranslation = (key, fallback = key) => {
    const lang = getCurrentCagliariLang();
    return translations[key]?.[lang] ?? fallback;
};

const applyCagliariTranslations = () => {
    const lang = getCurrentCagliariLang();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        // Check global translations first
        if (translations[key] && translations[key][lang]) {
            el.innerHTML = translations[key][lang];
        }
    });

    // Custom Month translation for Fixtures (if elements exist)
    document.querySelectorAll('[data-i18n-month]').forEach(el => {
        const monthIndex = el.getAttribute('data-i18n-month');
        const isShort = el.hasAttribute('data-i18n-short');
        const key = `month_${monthIndex}${isShort ? '_short' : ''}`;
        if (translations[key] && translations[key][lang]) {
            el.innerText = translations[key][lang];
        }
    });
};

const syncCagliariLanguage = (notify = true) => {
    const currentLang = getCurrentCagliariLang();

    if (window._currentCagliariLang === currentLang) {
        return;
    }

    window._currentCagliariLang = currentLang;
    window.__appLanguage = currentLang;
    document.documentElement.lang = currentLang;

    try {
        window.localStorage?.setItem(LANGUAGE_STORAGE_KEY, currentLang);
    } catch (error) {
    }

    applyCagliariTranslations();

    if (notify) {
        window.dispatchEvent(new CustomEvent('appLanguageChanged', { detail: { lang: currentLang } }));
    }
};

window.applyCagliariTranslations = applyCagliariTranslations;
window.getCagliariTranslation = getCagliariTranslation;

window.addEventListener('appLanguageChanged', (event) => {
    const nextLang = event.detail?.lang;

    if (nextLang) {
        window.__appLanguage = nextLang;
        document.documentElement.lang = nextLang;

        try {
            window.localStorage?.setItem(LANGUAGE_STORAGE_KEY, nextLang);
        } catch (error) {
        }
    }

    syncCagliariLanguage(false);
});

window.addEventListener('storage', (event) => {
    if (event.key !== LANGUAGE_STORAGE_KEY || !event.newValue || !SUPPORTED_LANGUAGES.includes(event.newValue)) {
        return;
    }

    window.__appLanguage = event.newValue;
    document.documentElement.lang = event.newValue;
    syncCagliariLanguage(false);
});

// Initial apply
syncCagliariLanguage(false);
