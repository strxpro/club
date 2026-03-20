import React, { useRef, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GigiRivaMemorial() {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (cardRef.current) {
                gsap.fromTo(cardRef.current,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                        scrollTrigger: { trigger: cardRef.current, start: 'top 85%' }
                    }
                );
            }

            const elements = contentRef.current?.children;
            if (elements) {
                gsap.fromTo(elements,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
                        scrollTrigger: { trigger: contentRef.current, start: 'top 80%' }
                    }
                );
            }

            if (imageRef.current) {
                gsap.fromTo(imageRef.current,
                    { opacity: 0, scale: 1.05 },
                    {
                        opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out',
                        scrollTrigger: { trigger: cardRef.current, start: 'top 80%' }
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="gigiriva"
            className="bg-navy text-white overflow-hidden relative"
            style={{ paddingTop: '6rem', paddingBottom: '5rem' }}
        >
            {/* Background texture */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 80px)' }}
            />

            <div className="container-main relative z-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

                {/* Section header — closer to card (mb-4 instead of mb-10) */}
                <div className="w-full flex flex-col items-center mb-4">
                    <span className="section-badge !bg-crimson !text-white shadow-sm text-[10px] tracking-wider">
                        Leggenda Eterna
                    </span>
                    <h2 className="section-title !text-white text-3xl sm:text-4xl lg:text-5xl tracking-normal text-center font-medium mt-4 lg:mt-5">
                        {t('gigi_riva_title')}
                    </h2>
                    <div className="mx-auto h-[2px] w-12 bg-crimson/80" style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }} />
                </div>

                {/* ── Card ── */}
                <div ref={cardRef} className="relative w-full max-w-6xl mx-auto">
                    <div
                        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-20 overflow-hidden"
                        style={{ minHeight: '460px' }}
                    >
                        {/* Content: Text Left | Image Right */}
                        <div className="flex flex-col-reverse lg:flex-row items-stretch relative z-40 h-full">

                            {/* ── Text Column ── */}
                            <div
                                className="w-full lg:w-[48%] flex flex-col justify-end text-left"
                                style={{ padding: '28px 36px 48px 36px' }}
                            >
                                <div ref={contentRef} className="w-full flex flex-col items-start gap-3 lg:gap-4">

                                    {/* Label */}
                                    <p
                                        className="font-heading uppercase"
                                        style={{
                                            fontSize: '11px',
                                            letterSpacing: '0.38em',
                                            color: 'rgba(210, 30, 45, 1)',
                                            fontWeight: 700,
                                            textShadow: '0 0 18px rgba(210,30,45,0.45)',
                                        }}
                                    >
                                        Il Più Grande &mdash; Numero 11
                                    </p>

                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white tracking-tight leading-[1.1]">
                                        {t('gigi_riva_title')}
                                    </h2>

                                    {/* Subtitle with single quotes */}
                                    <h3 className="text-lg sm:text-xl lg:text-2xl text-crimson font-heading italic opacity-95 font-light tracking-wide">
                                        "{t('gigi_riva_subtitle')}" (1944 – 2024)
                                    </h3>

                                    {/* Divider with breathing room */}
                                    <div
                                        className="w-14 h-1 bg-crimson opacity-80 rounded-full"
                                        style={{ margin: '1.25rem 0' }}
                                    />

                                    {/* Body text */}
                                    <div className="space-y-4 text-white/90 font-light leading-[1.6] text-sm lg:text-base text-left max-w-2xl">
                                        <p>{t('gigi_riva_bio_1')}</p>
                                        <p className="hidden sm:block opacity-90">{t('gigi_riva_bio_2')}</p>
                                        <p>{t('gigi_riva_bio_3')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Image Column ── */}
                            {/* p-4 gives breathing room so image is not glued to card border */}
                            <div
                                className="w-full lg:w-[52%] relative isolate"
                                style={{ padding: '1rem 1rem 1rem 0' }}
                            >
                                {/* Inner wrapper clips image with rounded corners */}
                                <div className="relative w-full h-full overflow-hidden rounded-2xl" style={{ minHeight: '380px' }}>

                                    <img
                                        ref={imageRef}
                                        src="/images/licensed-image.jpg"
                                        alt="Gigi Riva Portrait"
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                    />

                                    {/* ── Smooth torn-paper / deckled edge transition ──
                                        Pure gradient fade — wide and soft, no hard clipPath edge.          
                                        The SVG feTurbulence filter on the img tag creates the organic      
                                        irregular boundary without any visible seam.                        */}
                                    <div
                                        className="absolute inset-y-0 left-0 z-20 pointer-events-none"
                                        style={{
                                            width: '180px',
                                            background: `linear-gradient(
                                                to right,
                                                rgba(11,16,30,1)    0%,
                                                rgba(11,16,30,0.97) 10%,
                                                rgba(11,16,30,0.88) 25%,
                                                rgba(11,16,30,0.70) 42%,
                                                rgba(11,16,30,0.45) 58%,
                                                rgba(11,16,30,0.20) 75%,
                                                rgba(11,16,30,0.06) 88%,
                                                transparent         100%
                                            )`,
                                        }}
                                    />

                                    {/* Bottom gradient for label contrast */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent z-10 pointer-events-none rounded-b-2xl" />

                                    {/* "11" watermark */}
                                    <div className="absolute bottom-5 right-6 z-20 pointer-events-none">
                                        <span
                                            className="font-heading font-black select-none leading-none tracking-tighter"
                                            style={{
                                                fontSize: 'clamp(4rem, 9vw, 7.5rem)',
                                                color: 'rgba(255,255,255,0.95)',
                                                textShadow: '0 0 20px rgba(185,20,30,0.9), 0 2px 10px rgba(0,0,0,1), 0 0 50px rgba(185,20,30,0.5)',
                                            }}
                                        >
                                            11
                                        </span>
                                    </div>

                                    {/* "Rombo di Tuono" label */}
                                    <div className="absolute bottom-5 left-5 z-30">
                                        <p
                                            className="font-heading uppercase"
                                            style={{
                                                fontSize: 'clamp(9px, 1vw, 13px)',
                                                letterSpacing: '0.28em',
                                                color: '#fff',
                                                textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                                                background: 'linear-gradient(90deg, rgba(175,15,30,0.82) 0%, rgba(120,8,20,0.60) 100%)',
                                                padding: '5px 12px 5px 10px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            Rombo di Tuono
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
