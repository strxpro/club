import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../LanguageContext';
import { gsap } from 'gsap';

export default function FinalContactCard() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const trigger = document.getElementById('history-end-trigger');
            if (!trigger) return;

            const rect = trigger.getBoundingClientRect();
            // Show when the trigger is in the viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
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
            gsap.to(cardRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'expo.out'
            });
        } else {
            gsap.to(cardRef.current, {
                y: 50,
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                ease: 'power2.inOut'
            });
        }
    }, [isVisible]);

    return (
        <div className="fixed bottom-10 left-0 right-0 z-[100] pointer-events-none flex justify-center px-6">
            <div 
                ref={cardRef}
                className="glass-premium p-10 lg:p-12 pointer-events-auto opacity-0 translate-y-12 scale-95 max-w-3xl w-full border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group"
            >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-crimson/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-crimson/10 transition-colors duration-1000" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 text-center md:text-left">
                        <span className="text-crimson font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">
                            {t('contact_title')}
                        </span>
                        <h3 className="text-3xl lg:text-4xl font-heading text-white mb-6 leading-tight">
                            Entra a far parte della <span className="text-crimson">nostra famiglia</span>
                        </h3>
                        <p className="text-white/60 font-light text-sm lg:text-base leading-relaxed max-w-md">
                            {t('contact_subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
                        <ContactButton 
                            icon={<PhoneIcon />} 
                            label={t('contact_phone_label')} 
                            value="+39 0789 75X XXX" 
                            href="tel:+39078975xxxx" 
                        />
                        <ContactButton 
                            icon={<MailIcon />} 
                            label="Email" 
                            value="info@ccgigirivastg.it" 
                            href="mailto:info@ccgigirivastg.it" 
                        />
                        <button 
                            onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
                            className="mt-4 bg-white text-navy-dark hover:bg-crimson hover:text-white text-[11px] font-bold uppercase tracking-[3px] py-4 px-8 rounded-xl transition-all duration-500 shadow-xl"
                        >
                            {t('contact_send')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactButton({ icon, label, value, href }) {
    return (
        <a 
            href={href} 
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group/btn no-underline"
        >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-crimson group-hover/btn:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div>
                <span className="block text-[9px] uppercase tracking-[2px] text-white/40 mb-0.5">{label}</span>
                <span className="block text-sm font-medium text-white/80 group-hover/btn:text-white transition-colors">{value}</span>
            </div>
        </a>
    );
}

function PhoneIcon() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
}

function MailIcon() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
}
