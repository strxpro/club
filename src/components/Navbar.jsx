import { useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';

export default function Navbar() {
    const { t, language, setLanguage, LANGUAGES, LANGUAGE_LABELS, LANGUAGE_NAMES } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Navbar becomes opaque only after scrolling past 80% of the viewport height (Hero section)
            setScrolled(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close lang dropdown on outside click
    useEffect(() => {
        const close = () => setLangOpen(false);
        if (langOpen) document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [langOpen]);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
    };

    const navLinks = [
        { key: 'nav_gigiriva', id: 'gigiriva' },
        { key: 'nav_storia', id: 'storia' },
        { key: 'nav_galleria', id: 'galleria' },
        { key: 'nav_contatti', id: 'contatti' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'nav-glass' : 'bg-transparent'}`}
            style={scrolled ? { boxShadow: '0 4px 30px rgba(255,255,255,0.04), 0 1px 0 rgba(255,255,255,0.06)' } : {}}
        >
            <div className="container-main flex items-center justify-between h-20 md:h-24 transition-all duration-300">
                {/* Logo */}
                <a
                    href="#"
                    className="flex items-center py-1 no-underline shrink-0"
                    onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                    <img src="/images/t.png" alt="CC Gigi Riva STG" className="w-40 sm:w-64 h-auto object-contain max-h-24 md:max-h-36" />
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollTo(link.id)}
                            className="text-white/75 hover:text-white text-base font-bold tracking-wider transition-all bg-transparent border-none cursor-pointer px-2 py-1 hover:scale-110 active:scale-95"
                        >
                            {t(link.key)}
                        </button>
                    ))}

                    {/* Language Switcher */}
                    <div className="relative ml-4" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 cursor-pointer active:scale-95 group focus:outline-none"
                            aria-label="Language"
                        >
                            <div className="w-8 h-5 rounded overflow-hidden flex items-center justify-center ring-1 ring-white/10">
                                <img
                                    src={LANGUAGE_LABELS[language]}
                                    alt={language}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <svg className={`w-3 h-3 opacity-50 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                        </button>

                        {/* Dropdown */}
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '12px',
                                minWidth: '200px',
                                background: 'rgba(8,11,18,0.97)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
                                padding: '6px',
                                zIndex: 110,
                                opacity: langOpen ? 1 : 0,
                                transform: langOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.96)',
                                pointerEvents: langOpen ? 'auto' : 'none',
                                transition: 'opacity 0.25s ease, transform 0.25s ease',
                            }}
                        >
                            {LANGUAGES.map((lang, i) => (
                                <button
                                    key={lang}
                                    onClick={() => { setLanguage(lang); setLangOpen(false); }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 14px',
                                        fontSize: '13px',
                                        fontWeight: language === lang ? 600 : 500,
                                        color: language === lang ? '#fff' : 'rgba(255,255,255,0.65)',
                                        background: language === lang ? '#c82423' : 'transparent',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        marginBottom: i < LANGUAGES.length - 1 ? '4px' : 0,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        boxShadow: language === lang ? '0 4px 16px rgba(200,36,35,0.3)' : 'none',
                                    }}
                                    onMouseEnter={(e) => { if (lang !== language) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}}
                                    onMouseLeave={(e) => { if (lang !== language) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}}
                                >
                                    <img
                                        src={LANGUAGE_LABELS[lang]}
                                        alt={lang}
                                        loading="lazy"
                                        decoding="async"
                                        style={{ width: '28px', height: '20px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                                    />
                                    <span>{LANGUAGE_NAMES[lang]}</span>
                                    {language === lang && (
                                        <svg style={{ width: '14px', height: '14px', marginLeft: 'auto', opacity: 0.8 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col items-center justify-center gap-1 w-10 h-10 bg-transparent border-none cursor-pointer"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Menu"
                >
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </button>
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 z-[998]" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileOpen ? 'open' : ''} md:hidden fixed top-0 right-0 h-screen w-80 bg-navy-dark/98 backdrop-blur-2xl z-[999] flex flex-col pt-24 px-8 gap-4 shadow-2xl transition-all duration-500`}>
                <button className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl bg-transparent border-none cursor-pointer p-2" onClick={() => setMobileOpen(false)}>✕</button>
                {navLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => scrollTo(link.id)}
                        className="text-white/80 hover:text-white text-xl font-heading tracking-widest py-4 text-left bg-transparent border-none cursor-pointer border-b border-white/10 transition-all hover:translate-x-2"
                    >
                        {t(link.key)}
                    </button>
                ))}
                <div className="mt-8 grid grid-cols-2 gap-3 pb-8">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => { setLanguage(lang); setMobileOpen(false); }}
                            className={`flex items-center justify-start gap-3 px-4 py-4 rounded-xl border-2 transition-all active:scale-95 ${language === lang ? 'bg-crimson/20 border-crimson text-white' : 'bg-white/5 border-white/10 text-white/70'}`}
                        >
                            <img src={LANGUAGE_LABELS[lang]} alt={lang} className="w-8 h-auto rounded shadow-sm" />
                            <span className="text-xs font-bold uppercase tracking-widest">{lang}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
