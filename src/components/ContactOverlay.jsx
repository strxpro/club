import { useEffect, useState } from 'react';
import { useTranslation } from '../LanguageContext';
import { gsap } from 'gsap';

export default function ContactOverlay() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const storiaSection = document.getElementById('storia');
            if (!storiaSection) return;

            const rect = storiaSection.getBoundingClientRect();
            // Show overlay when history section is active (approximate logic)
            // Can be refined with a more specific trigger from History.jsx
            if (rect.top < 100 && rect.bottom > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isVisible) {
            gsap.to('.contact-overlay-card', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power4.out'
            });
        } else {
            gsap.to('.contact-overlay-card', {
                y: -100,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            });
        }
    }, [isVisible]);

    return (
        <div 
            className="contact-overlay-container fixed top-6 left-0 right-0 z-[100] pointer-events-none flex justify-center px-6"
        >
            <div className="contact-overlay-card glass-premium flex items-center gap-6 px-8 py-4 pointer-events-auto opacity-0 translate-y-[-100px] max-w-2xl w-full border-white/10 shadow-2xl">
                <div className="flex-1">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[4px] mb-1">{t('contact_info_title')}</h4>
                    <div className="flex items-center gap-6">
                        <ContactLink icon={<PhoneIcon />} text="+39 0789 75X XXX" href="tel:+39078975xxxx" />
                        <div className="w-[1px] h-4 bg-white/10" />
                        <ContactLink icon={<MailIcon />} text="info@ccgigirivastg.it" href="mailto:info@ccgigirivastg.it" />
                    </div>
                </div>
                <button 
                    onClick={() => {
                        const contactSection = document.getElementById('contatti');
                        contactSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-crimson hover:bg-crimson-light text-white text-[11px] font-bold uppercase tracking-[2px] px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-crimson/20"
                >
                    {t('contact_send')}
                </button>
            </div>
        </div>
    );
}

function ContactLink({ icon, text, href }) {
    return (
        <a href={href} className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors no-underline group">
            <span className="text-crimson group-hover:scale-110 transition-transform duration-300">{icon}</span>
            <span className="text-sm font-medium tracking-wide">{text}</span>
        </a>
    );
}

function PhoneIcon() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
}

function MailIcon() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
}
