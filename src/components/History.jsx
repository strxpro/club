import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import React from 'react';
import { useTranslation } from '../LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function History() {
    const { t } = useTranslation();
    const anchorRef = useRef(null);
    const sectionRef = useRef(null);
    const founderImgRef = useRef(null);
    const founderTxtRef = useRef(null);

    const [activeStop, setActiveStop] = useState(0);
    const [isSnapping, setIsSnapping] = useState(false);
    const [expandedEntries, setExpandedEntries] = useState({});

    const [isMobile, setIsMobile] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleReadMore = (index) => {
        setExpandedEntries(prev => ({...prev, [index]: !prev[index]}));
    };

    const entries = useMemo(() => [
        { year: '1920', subtitle: t('timeline_1920_subtitle'), text: t('timeline_1920_text'), img: '/images/hisotria/1920.jpg' },
        { year: '1964', subtitle: t('timeline_1964_subtitle'), text: t('timeline_1964_text'), img: '/images/hisotria/1964.jpg' },
        { year: '1970', subtitle: t('timeline_1970_subtitle'), text: t('timeline_1970_text'), img: '/images/hisotria/1970.jpeg' },
        { year: '1981', subtitle: t('timeline_1981_subtitle'), text: t('timeline_1981_text'), img: '/images/hisotria/1980.jpg' },
        { year: t('timeline_1980s_title'), subtitle: t('timeline_1980s_subtitle'), text: t('timeline_1980s_text'), img: "/images/hisotria/80'.jpg" },
        { year: '1989', subtitle: t('timeline_1989_subtitle'), text: t('timeline_1989_text'), img: '/images/hisotria/1989.webp' },
        { year: '2020', subtitle: t('timeline_2020_subtitle'), text: t('timeline_2020_text'), img: '/images/hisotria/2020.jpeg' },
    ], [t]);

    const N = entries.length;
    const N_STOPS = (N - 1) * 4 + 1;

    useEffect(() => {
        let scrollTimeout;
        const handleScroll = () => {
            if (isMobile) return; // Disable scroll-lock driven navigation on mobile
            if (!anchorRef.current) return;
            const rect = anchorRef.current.getBoundingClientRect();
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                const scrollableDistance = rect.height - window.innerHeight;
                const progress = Math.abs(rect.top) / scrollableDistance;
                const stop = Math.min(N_STOPS - 1, Math.max(0, progress * (N_STOPS - 1)));
                setActiveStop(stop);
                
                // Magnetyczne przyciąganie do najbliższej daty (co 4 stopy)
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const nearestMainStop = Math.round(stop / 4) * 4;
                    if (Math.abs(stop - nearestMainStop) > 0.1 && Math.abs(stop - nearestMainStop) < 2) {
                        navigateToStop(nearestMainStop);
                    }
                }, 150);
            } else if (rect.top > 0) {
                setActiveStop(0);
            } else if (rect.bottom < window.innerHeight) {
                setActiveStop(N_STOPS - 1);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [N_STOPS, isMobile]);

    const activeSlideInt = Math.floor(activeStop / 4);
    const activeSlideFloat = activeStop / 4;

    const navigateToStop = useCallback((stopIdx) => {
        if (isMobile) {
            setActiveStop(stopIdx); // Direct slide switch on mobile, no native scroll required
            return;
        }
        if (!anchorRef.current) return;
        const rect = anchorRef.current.getBoundingClientRect();
        const scrollableDistance = rect.height - window.innerHeight;
        const targetProgress = stopIdx / (N_STOPS - 1);
        const targetScrollY = (window.scrollY + rect.top) + (targetProgress * scrollableDistance);
        
        setIsSnapping(true);
        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });
        setTimeout(() => setIsSnapping(false), 600);
    }, [N_STOPS, isMobile]);

    const handleNextSlide = useCallback(() => {
        const currentMain = Math.round(activeStop / 4);
        const nextMain = (currentMain + 1) * 4;
        if (nextMain <= N_STOPS - 1) navigateToStop(nextMain);
    }, [activeStop, navigateToStop, N_STOPS]);

    const handlePrevSlide = useCallback(() => {
        const prevMain = Math.ceil(activeStop / 4) * 4 - 4;
        if (prevMain >= 0) navigateToStop(prevMain);
    }, [activeStop, navigateToStop]);

    // Touch Swipe logic for mobile
    const handleTouchStart = (e) => {
        if (!isMobile) return;
        setTouchStartX(e.changedTouches[0].screenX);
    };

    const handleTouchEnd = (e) => {
        if (!isMobile) return;
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        if (diffX > 50) handleNextSlide();
        else if (diffX < -50) handlePrevSlide();
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const trivias = sectionRef.current?.querySelectorAll('.trivia-card');
            if (trivias?.length) gsap.fromTo(trivias, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.trivia-container', start: 'top 85%' } });
            if (founderImgRef.current) gsap.fromTo(founderImgRef.current, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: founderImgRef.current, start: 'top 80%' } });
            if (founderTxtRef.current) gsap.fromTo(founderTxtRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.1, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: founderTxtRef.current, start: 'top 80%' } });
            const outro = sectionRef.current?.querySelector('.outro-section');
            if (outro) {
                const lines = outro.querySelectorAll('.highlight-text');
                gsap.to(lines, {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    stagger: 0.3,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: outro,
                        start: 'top 70%',
                        toggleActions: 'play none none none'
                    }
                });
            }
        }, sectionRef);
        const t2 = setTimeout(() => ScrollTrigger.refresh(), 400);
        return () => { clearTimeout(t2); ctx.revert(); };
    }, []);

    return (
        <React.Fragment>
            <section ref={anchorRef} id="storia" className={`relative w-full ${isMobile ? 'h-auto py-12 md:py-20' : 'h-[480vh]'} bg-navy-dark mt-16 md:mt-20`} style={{ fontFamily: "'Inter', sans-serif", zIndex: 10 }}>
                <div 
                    className={`${isMobile ? 'relative w-full' : 'sticky top-0 h-screen w-full'} flex flex-col items-center justify-center overflow-hidden`}
                >
                    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', paddingTop: isMobile ? '0px' : '60px', paddingBottom: isMobile ? '0px' : '40px' }}>
                    
                    {/* TITLE & DATE */}
                    <div style={{ marginTop: isMobile ? '40px' : '0px', marginBottom: '28px', textAlign: 'center', width: '100%', flexShrink: 0 }}>
                        <h2 style={{ fontSize: 'clamp(26px, 2.8vw, 38px)', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2, marginBottom: '10px' }}>
                            {t('history_title')}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6a7a8a', letterSpacing: '0.12em', fontWeight: 600 }}>
                            1920 &mdash; {entries[N - 1].year}
                        </p>
                    </div>

                    <div className="bg-navy" style={{
                        flex: 1,
                        display: 'flex',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                        position: 'relative',
                        userSelect: 'none',
                        minHeight: isMobile ? '75vh' : 0
                    }}>
                        {/* ══ LEFT RULER PANEL ══ */}
                        <div className="hidden md:flex" style={{
                            width: '150px',
                            flexShrink: 0,
                            borderRight: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(0,0,0,0.3)',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            padding: '40px 0',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <div style={{ position: 'relative', height: `${(N - 1) * 60 + 20}px`, width: '100%' }}>
                                {/* ACTIVE RED PILL */}
                                <div style={{
                                    position: 'absolute', 
                                    right: '16px', 
                                    top: `${Math.floor(activeStop / 4) * 60 + (activeStop % 4) * 15 + 9}px`, 
                                    width: '16px', 
                                    height: '2px', 
                                    background: '#e63329',
                                    transition: 'top 400ms cubic-bezier(0.25, 1, 0.5, 1)',
                                    boxShadow: '0 0 10px rgba(230,51,41,1)',
                                    zIndex: 5
                                }} />

                                {entries.map((e, i) => (
                                    <React.Fragment key={i}>
                                        <div 
                                            onClick={() => navigateToStop(i * 4)} 
                                            style={{ 
                                                position: 'absolute', 
                                                top: `${i * 60}px`, 
                                                right: 0, 
                                                height: '20px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'flex-end',
                                                cursor: 'pointer',
                                                width: '100%',
                                                paddingRight: '16px'
                                            }}
                                        >
                                            <span style={{ 
                                                fontSize: '10px', 
                                                color: activeSlideInt === i ? '#ffffff' : '#4a5a6a', 
                                                marginRight: '8px', 
                                                fontWeight: activeSlideInt === i ? 700 : 500, 
                                                letterSpacing: '0.06em', 
                                                transition: 'color 800ms ease' 
                                            }}>
                                                {e.year}
                                            </span>
                                            <div style={{ width: '16px', height: '1.5px', background: '#222' }} />
                                        </div>
                                        
                                        {/* 3 smaller ticks in between */}
                                        {i < N - 1 && [25, 40, 55].map((offset, tickIdx) => (
                                            <div key={`tick-${i}-${tickIdx}`} style={{
                                                position: 'absolute',
                                                top: `${i * 60 + offset}px`,
                                                right: '16px',
                                                width: '6px',
                                                height: '1px',
                                                background: 'rgba(255,255,255,0.1)',
                                                pointerEvents: 'none'
                                            }} />
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* ══ RIGHT PEEKING CAROUSEL ══ */}
                        <div 
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            position: 'relative',
                            background: 'radial-gradient(circle at center, rgba(30,40,55,0.4) 0%, transparent 70%)',
                            minHeight: 0
                        }}>
                            <div style={{ width: '82%', margin: '0 auto', position: 'relative', flex: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
                                <div style={{
                                    display: 'flex',
                                    width: '100%',
                                    transform: `translateX(-${activeSlideFloat * 100}%)`,
                                    transition: `transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                                }}>
                                    {entries.map((entry, i) => {
                                        const dist = Math.abs(i - activeSlideFloat);
                                        const isActive = dist < 0.5; // active zone
                                        const scale = Math.max(0.6, 1 - dist * 0.15);
                                        const opacity = Math.max(0, 1 - dist * 1.5);
                                        const filter = `brightness(${1 - dist * 0.6}) grayscale(${dist * 100}%)`;

                                        return (
                                            <div
                                                key={i}
                                                style={{
                                                    flex: '0 0 100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: `opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                                                    transform: `scale(${scale})`,
                                                    opacity,
                                                    filter,
                                                    pointerEvents: isActive ? 'auto' : 'none',
                                                }}
                                            >
                                                    <div className="flex flex-col md:flex-row w-full gap-4 md:gap-[4%] max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible pb-[80px] md:pb-0" style={{ width: '100%', alignItems: 'center', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                                        <style>{`::-webkit-scrollbar { display: none; }`}</style>
                                                        <div className={`w-full md:w-[48%] ${expandedEntries[i] ? 'min-h-[15vh]' : 'min-h-[25vh]'} md:!h-[50vh] shrink-0 rounded-[8px] overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.5)] transition-all duration-700 ease-in-out`}>
                                                            <img src={entry.img} alt={entry.subtitle} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(60%) contrast(1.08)' }} />
                                                        </div>
                                                    <div className="flex-1 flex flex-col justify-center text-center md:text-left items-center md:items-start mt-2 md:mt-0 px-2 md:px-0">
                                                        <div style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1, marginBottom: '12px', letterSpacing: '-0.03em', fontFamily: "'Inter', sans-serif" }}>
                                                            {entry.year}
                                                        </div>
                                                        <div style={{ width: '46px', height: '4px', background: '#e63329', borderRadius: '2px', marginBottom: '16px', boxShadow: '0 0 16px rgba(230,51,41,0.7)' }} />
                                                        <div style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', fontWeight: 600, color: '#8899aa', marginBottom: '12px', letterSpacing: '0.03em' }}>
                                                            {entry.subtitle}
                                                        </div>
                                                        <div style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', lineHeight: 1.8, color: '#6a7a8a', maxWidth: '440px' }}>
                                                            {expandedEntries[i] ? entry.text : (entry.text.length > 150 ? entry.text.substring(0, 150) + '...' : entry.text)}
                                                            {entry.text.length > 150 && (
                                                                <span 
                                                                    onClick={() => toggleReadMore(i)} 
                                                                    className="ml-2 font-semibold text-crimson cursor-pointer hover:underline pointer-events-auto"
                                                                >
                                                                    {expandedEntries[i] ? t('history_read_less') : t('history_read_more')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ══ BOTTOM BAR ══ */}
                        <div className="absolute bottom-0 left-0 md:left-[150px] right-0 h-[60px] border-t border-white/5 flex items-center px-4 md:px-8" style={{ background: 'rgba(0,0,0,0.25)' }}>
                            <div className="flex items-center gap-2 text-[12px] tracking-[0.12em] text-[#4a5a6a] w-1/3 ml-4">
                                <span className="text-white font-bold text-[14px]">{String(activeSlideInt + 1).padStart(2, '0')}</span>
                                <span className="mx-[2px]">/</span>
                                <span className="text-[14px]">{String(N).padStart(2, '0')}</span>
                            </div>
                            <div className="flex justify-center gap-5 w-1/3">
                                <button onClick={handlePrevSlide} className="w-11 h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer z-50 pointer-events-auto">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <button onClick={handleNextSlide} className="w-11 h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer z-50 pointer-events-auto">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                            <div className="hidden md:flex items-center justify-end gap-[8px] text-[#4a5a6a] text-[11px] tracking-[0.18em] uppercase w-1/3 mr-4">
                                <span>{t('history_scroll_hint') || 'scorri per esplorare'} </span>
                                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 2v10M7 12l-2.5-2.5M7 12l2.5-2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </section>

            {/* BELOW FOLD - NEXT SECTION (TRIVIA & FOUNDER) */}
            <div ref={sectionRef} className="relative z-20 mt-16 md:mt-24 bg-navy-dark text-white pb-32" style={{ position: 'relative' }}>
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, rgba(185,20,30,1) 0%, transparent 70%)' }} />
                </div>
                
                {/* TRIVIA REDESIGN */}
                <div className="container-main pt-48 lg:pt-56 relative z-10">
                    <div className="trivia-section mb-32 w-full mx-auto relative z-20">
                        <div className="section-header mb-24 lg:mb-40 flex flex-col items-center text-center mt-20 lg:mt-32">
                            
                            <span  style={{ marginTop: '5%', marginBottom: '2%' }} className="section-badge !bg-crimson/10 !text-crimson border border-crimson/20 px-6 py-2 mt-12 block text-center">
    {t('trivia_badge')}
</span>

                            <h3 className="section-title mt-4 !tracking-[0.2em] text-4xl lg:text-7xl">
                                {t('trivia_section_title')}
                            </h3>
                        </div>
                        
                        <div className="flex flex-col gap-24 lg:gap-40">
                            {/* Row 1 */}
                            <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16 group">
                                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
                                    <img src="/images/1.jpeg" alt="Maratona di passione" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-700" />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col items-start text-left px-4 md:px-0">
                                    <div className="text-white font-heading text-7xl font-black opacity-20 mb-[-25px] select-none">01</div>
                                    <h4 className="text-3xl lg:text-4xl font-heading text-white mb-5 tracking-tight">{t('trivia_1_title')}</h4>
                                    <div className="w-16 h-[3px] bg-crimson mb-6 rounded-full" />
                                    <p className="text-white/70 text-lg lg:text-xl font-light leading-relaxed">
                                        {t('trivia_1_text')}
                                    </p>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16 group">
                                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
                                    <img src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop" loading="lazy" decoding="async" alt="Eravamo testimoni" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-700" />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col items-start md:items-end text-left md:text-right px-4 md:px-0">
                                    <div className="text-white font-heading text-7xl font-black opacity-20 mb-[-25px] select-none">02</div>
                                    <h4 className="text-3xl lg:text-4xl font-heading text-white mb-5 tracking-tight">{t('trivia_2_title')}</h4>
                                    <div className="w-16 h-[3px] bg-crimson mb-6 rounded-full" />
                                    <p className="text-white/70 text-lg lg:text-xl font-light leading-relaxed">
                                        {t('trivia_2_text')}
                                    </p>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16 group">
                                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
                                    <img src="/images/campo.png" alt="Il club come famiglia" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-700" />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col items-start text-left px-4 md:px-0">
                                    <div className="text-white font-heading text-7xl font-black opacity-20 mb-[-25px] select-none">03</div>
                                    <h4 className="text-3xl lg:text-4xl font-heading text-white mb-5 tracking-tight">{t('trivia_3_title')}</h4>
                                    <div className="w-16 h-[3px] bg-crimson mb-6 rounded-full" />
                                    <p className="text-white/70 text-lg lg:text-xl font-light leading-relaxed">
                                        {t('trivia_3_text')}
                                    </p>
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-20 group mb-20 lg:mb-40">
                                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
                                    <img src="/images/4.jpeg" alt="Ospiti illustri" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-700" />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col items-start md:items-end text-left md:text-right px-4 md:px-0">
                                    <div className="text-white font-heading text-7xl font-black opacity-20 mb-[-25px] select-none">04</div>
                                    <h4 className="text-3xl lg:text-4xl font-heading text-white mb-5 tracking-tight">{t('trivia_4_title')}</h4>
                                    <div className="w-16 h-[3px] bg-crimson mb-6 rounded-full" />
                                    <p className="text-white/70 text-lg lg:text-xl font-light leading-relaxed">
                                        {t('trivia_4_text')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOUNDER (GIGI RIVA STYLE) */}
                <div className="founder-section mt-32 lg:mt-56 mb-40 relative z-20">
                    <div className="container-main relative">
                            {/* Section header — closer to card */}
                            <div className="w-full flex flex-col items-center mb-10 mt-24 lg:mt-32">
                                <span  style={{ marginTop: '8%' }} className="section-badge !bg-crimson !text-white shadow-sm text-[11px] tracking-wider uppercase mt-12 lg:mt-16">
                                    {t('founder_subtitle')}
                                </span>
                                <h2 className="section-title !text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight text-center font-medium mt-12 lg:mt-16">
                                    {t('founder_title')}
                                </h2>
                                <div className="mx-auto h-[2px] w-12 bg-crimson/80" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
                            </div>

                            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-20 overflow-hidden min-h-[460px] mx-auto">
                                <div className="flex flex-col-reverse lg:flex-row items-stretch relative z-40 h-full">

                                    {/* ── Text Column ── */}
                                    <div className="w-full lg:w-[48%] flex flex-col justify-end text-left" style={{ padding: '28px 36px 48px 36px' }}>
                                        <div className="w-full flex flex-col items-start gap-3 lg:gap-4">
                                            {/* Label */}
                                            <p className="font-heading uppercase" style={{ fontSize: '11px', letterSpacing: '0.38em', color: 'rgba(210, 30, 45, 1)', fontWeight: 700, textShadow: '0 0 18px rgba(210,30,45,0.45)' }}>
                                                {t('founder_subtitle')}
                                            </p>

                                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white tracking-normal leading-[1.1] mb-2 px-1">
                                                {t('founder_title')}
                                            </h2>

                                            <h3 className="text-lg sm:text-xl lg:text-2xl text-crimson font-heading italic opacity-95 font-light tracking-wide">
                                                "{t('founder_quote')}"
                                            </h3>

                                            {/* Divider */}
                                            <div className="w-14 h-1 bg-crimson opacity-80 rounded-full my-5" />

                                            {/* Body text */}
                                            <div className="space-y-4 text-white/90 font-light leading-[1.6] text-sm lg:text-base text-left max-w-2xl mt-2">
                                                <p>{t('founder_desc_1')}</p>
                                                <p className="hidden sm:block opacity-90">{t('founder_desc_2')}</p>
                                                <p>{t('founder_desc_3')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Image Column ── */}
                                    <div className="w-full lg:w-[52%] relative isolate" style={{ padding: '1rem 1rem 1rem 0' }}>
                                        <div className="relative w-full h-full overflow-hidden rounded-2xl min-h-[220px] md:min-h-[300px] lg:min-h-[380px]">
                                            <img 
                                                src="/images/g.jpg" 
                                                alt="Giuseppe Papandrea" 
                                                className="absolute inset-0 w-full h-full" 
                                                style={{ 
                                                    objectFit: 'cover', 
                                                    objectPosition: 'center 20%',
                                                    transform: 'scale(1.15)', 
                                                    transformOrigin: 'center 20%' 
                                                }} 
                                            />
                                            {/* Gradient overlay for text contrast blending */}
                                            <div className="absolute inset-y-0 left-0 z-20 pointer-events-none" style={{ width: '180px', background: `linear-gradient(to right, rgba(11,16,30,1) 0%, rgba(11,16,30,0.97) 10%, rgba(11,16,30,0.88) 25%, rgba(11,16,30,0.70) 42%, rgba(11,16,30,0.45) 58%, rgba(11,16,30,0.20) 75%, rgba(11,16,30,0.06) 88%, transparent 100%)` }} />
                                            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none rounded-b-2xl" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OUTRO REDESIGN - CENTERED TEXT */}
                    <div className="outro-section relative mt-24 lg:mt-40 mb-32 pb-32 z-20">
                        <div className="container-main flex flex-col items-center justify-center text-center">
                            
                            <div  style={{ marginTop: '8%' }} className="flex flex-col items-center text-center mx-auto w-full max-w-5xl px-4 py-16">
                                <div className="flex flex-col items-center justify-center mb-12 sm:mb-16 mt-20 lg:mt-24">
                                    <h2 className="text-5xl lg:text-7xl font-heading text-white leading-[1.1] tracking-tight text-center mb-8 lg:mb-12">
                                        {t('outro_title')}
                                    </h2>
                                    {/* Przedziałka z większym odstępem na mobile */}
                                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent rounded-full opacity-80" />
                                </div>

                                <div className="space-y-8 text-xl lg:text-3xl font-light leading-relaxed max-w-4xl px-2">
                                    <p className="text-crimson font-bold text-2xl sm:text-3xl lg:text-4xl text-center italic" style={{ textShadow: '0 0 30px rgba(230, 51, 41, 0.3)' }}>{t('outro_text_1')}</p>
                                    <p className="text-white/90 text-lg sm:text-xl lg:text-2xl text-center leading-relaxed">{t('outro_text_2')}</p>
                                </div>
                            </div>
                            
                            {/* Logo z.png dodane na środku z oddechem */}
                            <div className="mt-8 mb-12 lg:mt-20 lg:mb-16 flex justify-center items-center">
                                <img 
                                    src="/images/z.png" 
                                    alt="Club Logo" 
                                    loading="lazy" 
                                    decoding="async" 
                                    className="w-40 sm:w-56 lg:w-72 h-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            <div className="mt-12 lg:mt-20 w-full flex justify-center items-center overflow-visible pb-40 lg:pb-56">
                                <h1 className='text-[10vw] font-heading leading-[110%] uppercase font-semibold text-center bg-[linear-gradient(135deg,#e63329_0%,#a00d24_100%)] bg-clip-text text-transparent w-full px-2'>
                                    Forza Cagliari
                                </h1>
                            </div>

                        </div>
                    </div>

                    <div id="history-end-trigger" className="h-20" />

                </div>
        </React.Fragment>
    );
}
