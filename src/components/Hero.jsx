import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 151;

// Build all frame URLs
const frameUrls = Array.from({ length: FRAME_COUNT }, (_, i) => {
    const num = String(i + 1).padStart(4, '0');
    return `/frames/out_${num}.png`;
});

export default function Hero() {
    const { t } = useTranslation();
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const scrollIndicatorRef = useRef(null);
    const imagesRef = useRef([]);
    const currentFrameRef = useRef(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Preload all frames
        let loadedCount = 0;
        const images = new Array(FRAME_COUNT);

        const onAllLoaded = () => {
            imagesRef.current = images;
            setLoaded(true);

            // Size canvas to first frame
            const first = images[0];
            canvas.width = first.naturalWidth;
            canvas.height = first.naturalHeight;
            drawFrame(0);

            // Critical: refresh ScrollTrigger after images load and layout is stable
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        };

        const drawFrame = (index) => {
            const img = images[index];
            if (!img || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            currentFrameRef.current = index;
        };

        frameUrls.forEach((url, i) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                images[i] = img;
                loadedCount++;
                // Draw first frame as soon as it loads
                if (i === 0 && ctx) {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    drawFrame(0);
                }
                if (loadedCount === FRAME_COUNT) {
                    onAllLoaded();
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) onAllLoaded();
            };
        });

        // Set up ScrollTrigger once loaded
        const setupScroll = () => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;

            ScrollTrigger.create({
                trigger: wrapper,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                onUpdate: (self) => {
                    const frameIndex = Math.min(
                        Math.floor(self.progress * (FRAME_COUNT - 1)),
                        FRAME_COUNT - 1
                    );
                    if (frameIndex !== currentFrameRef.current && images[frameIndex]) {
                        drawFrame(frameIndex);
                    }
                }
            });

            // Fade out scroll indicator
            if (scrollIndicatorRef.current) {
                gsap.to(scrollIndicatorRef.current, {
                    opacity: 0,
                    scrollTrigger: {
                        trigger: wrapper,
                        start: '2% top',
                        end: '8% top',
                        scrub: true
                    }
                });
            }
        };

        // Small delay then set up scroll
        const timer = setTimeout(setupScroll, 300);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <div ref={wrapperRef} style={{ height: '300vh', position: 'relative' }} id="hero">
            {/* Sticky container */}
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#001c3d'
            }}>
                {/* Canvas for image sequence */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.65,
                        mixBlendMode: 'multiply'
                    }}
                />

                {/* Dark gradient overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,28,61,0.4) 0%, rgba(0,28,61,0.15) 40%, rgba(0,28,61,0.5) 75%, rgba(0,28,61,0.9) 100%)',
                    zIndex: 5,
                    pointerEvents: 'none'
                }} />

                {/* Subtle diagonal pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.03,
                    zIndex: 1,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)'
                }} />

                {/* Loading indicator */}
                {!loaded && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 8,
                        pointerEvents: 'none'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid rgba(255,255,255,0.15)',
                            borderTopColor: '#c8102e',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                        }} />
                    </div>
                )}

                {/* Hero content */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    padding: '0 20px',
                    maxWidth: '900px',
                    width: '100%',
                    margin: '0 auto'
                }}>
                    <h1 className="hero-headline">
                        {t('hero_headline')}
                    </h1>
                    <p className="hero-subtitle">
                        {t('hero_subtitle')}
                    </p>
                </div>

                {/* Scroll indicator */}
                <div ref={scrollIndicatorRef} className="scroll-indicator">
                    <span>{t('hero_scroll')}</span>
                    <div className="scroll-mouse">
                        <div className="scroll-dot" />
                    </div>
                </div>

                {/* Decorative corners */}
                <div className="absolute top-20 left-6 w-12 h-12 border-l-2 border-t-2 border-crimson/30 z-10 hidden md:block" />
                <div className="absolute bottom-20 right-6 w-12 h-12 border-r-2 border-b-2 border-crimson/30 z-10 hidden md:block" />
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
