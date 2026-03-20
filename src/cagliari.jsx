import React from 'react';
import ReactDOM from 'react-dom/client';
import { LanguageProvider, useTranslation } from './LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

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
const CAGLIARI_TRANSLATIONS = {
    cagliari_stats_title: {
        it: 'Statistiche', en: 'Statistics', pl: 'Statystyki', de: 'Statistiken', es: 'Estadísticas', fr: 'Statistiques'
    },
    cagliari_latest_match: {
        it: 'Ultima Partita', en: 'Latest Match', pl: 'Ostatni Mecz', de: 'Letztes Spiel', es: 'Último Partido', fr: 'Dernier Match'
    },
    cagliari_live_match: {
        it: 'Partita in Diretta', en: 'Live Match', pl: 'Mecz Na Żywo', de: 'Live-Spiel', es: 'Partido en Vivo', fr: 'Match en Direct'
    },
    cagliari_no_live_match: {
        it: 'Nessuna partita in corso', en: 'No match currently playing', pl: 'Aktualnie brak meczu', de: 'Derzeit kein Spiel', es: 'No hay partido en vivo', fr: 'Aucun match en cours'
    },
    cagliari_squad: {
        it: 'Rosa della Squadra', en: 'Squad', pl: 'Kadra Zespołu', de: 'Kader', es: 'Plantilla', fr: 'Équipe'
    },
    cagliari_standings: {
        it: 'Classifica', en: 'Standings', pl: 'Tabela Ligi', de: 'Tabelle', es: 'Clasificación', fr: 'Classement'
    },
    cagliari_no_upcoming: {
        it: 'Nessun match imminente', en: 'No upcoming matches', pl: 'Brak najbliższego meczu', de: 'Keine anstehenden Spiele', es: 'No hay próximos partidos', fr: 'Aucun match à venir'
    },
    cagliari_goalkeepers: {
        it: 'Portieri', en: 'Goalkeepers', pl: 'Bramkarze', de: 'Torhüter', es: 'Porteros', fr: 'Gardiens'
    },
    cagliari_defenders: {
        it: 'Difensori', en: 'Defenders', pl: 'Obrońcy', de: 'Verteidiger', es: 'Defensas', fr: 'Défenseurs'
    },
    cagliari_midfielders: {
        it: 'Centrocampisti', en: 'Midfielders', pl: 'Pomocnicy', de: 'Mittelfeldspieler', es: 'Centrocampistas', fr: 'Milieux'
    },
    cagliari_attackers: {
        it: 'Attaccanti', en: 'Attackers', pl: 'Napastnicy', de: 'Stürmer', es: 'Delanteros', fr: 'Attaquants'
    }
};

const applyCagliariTranslations = () => {
    const lang = localStorage.getItem('appLang') || 'it';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (CAGLIARI_TRANSLATIONS[key] && CAGLIARI_TRANSLATIONS[key][lang]) {
            el.innerHTML = CAGLIARI_TRANSLATIONS[key][lang];
        }
    });
};

// Listen for custom 'languageChanged' event from the Navbar
window.addEventListener('storage', (e) => {
    if (e.key === 'appLang') {
        applyCagliariTranslations();
    }
});

// For same tab LanguageContext update, we can poll or use a custom event dispatched by LanguageContext.
// Let's attach an interval just to ensure it catches up if changed in React 
setInterval(() => {
    const currentLang = localStorage.getItem('appLang') || 'it';
    if (window._currentCagliariLang !== currentLang) {
        window._currentCagliariLang = currentLang;
        applyCagliariTranslations();
    }
}, 500);

// Initial apply
applyCagliariTranslations();
