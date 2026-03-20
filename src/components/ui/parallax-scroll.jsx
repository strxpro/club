import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "../../lib/utils";

/* ── Lightbox Modal ── */
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext, getSrc, getAlt }) => {
  const [zoomed, setZoomed] = useState(false);

  // Close on Escape, navigate with arrows
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose(); }
      if (e.key === 'ArrowLeft' && !zoomed) onPrev();
      if (e.key === 'ArrowRight' && !zoomed) onNext();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, zoomed]);

  // Reset zoom when switching images
  useEffect(() => { setZoomed(false); }, [currentIndex]);

  const src = getSrc(images[currentIndex]);
  const alt = getAlt(images[currentIndex], `Foto ${currentIndex + 1}`);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => { if (zoomed) setZoomed(false); else onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        cursor: 'default',
      }}
    >
      {/* Counter */}
      <div style={{
        position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em',
        zIndex: 2,
      }}>
        {currentIndex + 1} / {images.length}
      </div>

      {/* Close button relocated to individual image containers for better visibility */}

      {/* Zoomed view */}
      {zoomed ? (
        <div
          onClick={() => setZoomed(false)}
          className="flex items-center justify-center w-full h-full p-4 overflow-auto cursor-zoom-out"
        >
          <div className="relative inline-block isolate">
            <motion.img
              key={currentIndex + '-zoomed'}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="rounded-[12px] shadow-2xl cursor-zoom-out"
              style={{
                maxWidth: 'none',
                maxHeight: 'none',
                objectFit: 'none' // Ensures intrinsic image size without artificial stretching
              }}
            />
            {/* Close button strictly on the photo */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-[999] flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/90 rounded-full border border-white/20 text-white transition-all shadow-xl backdrop-blur-md"
              title="Close (Esc)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      ) : (
        /* Normal view with arrows */
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full px-4"
          style={{ cursor: 'default' }}
        >
          {/* Prev button (Desktop) */}
          {images.length > 1 && (
            <button
              onClick={onPrev}
              className="hidden md:flex shrink-0 items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/[0.08] hover:bg-white/[0.15] transition-all text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}

          {/* Image */}
          <div className="relative inline-block isolate" onClick={(e) => { e.stopPropagation(); setZoomed(true); }}>
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              src={src}
              alt={alt}
              className="w-auto h-auto max-w-[90vw] md:max-w-[65vw] lg:max-w-[55vw] max-h-[65vh] md:max-h-[70vh] object-contain rounded-[12px] shadow-[0_30px_100px_rgba(0,0,0,0.6)] cursor-zoom-in"
            />
            {/* Close button strictly on the photo */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-[999] flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/90 rounded-full border border-white/20 text-white transition-all shadow-xl backdrop-blur-md"
              title="Close (Esc)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Next button (Desktop) */}
          {images.length > 1 && (
            <button
              onClick={onNext}
              className="hidden md:flex shrink-0 items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/[0.08] hover:bg-white/[0.15] transition-all text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}

          {/* Mobile Navigation Controls (Bottom) */}
          {images.length > 1 && (
            <div className="flex justify-center gap-6 md:hidden mt-2">
              <button
                onClick={onPrev}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/[0.08] text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={onNext}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/[0.08] text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

/* ── Skeleton image with click ── */
const SkeletonImage = ({ src, alt, className, motionProps, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = useCallback(() => setLoaded(true), []);

  const Wrapper = motionProps ? motion.div : 'div';
  const wrapperProps = motionProps || {};

  return (
    <Wrapper {...wrapperProps} className="group relative" onClick={onClick} style={{ cursor: 'zoom-in' }}>
      {!loaded && (
        <div className={cn("absolute inset-0 rounded-2xl overflow-hidden", className)} style={{ zIndex: 1 }}>
          <div className="w-full h-full bg-white/5 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        loading="lazy"
        decoding="async"
        className={cn(
          className,
          "transition-all duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </Wrapper>
  );
};

/* ── Main Gallery Grid ── */
export const ParallaxScrollSecond = ({
  images,
  className,
}) => {
  const containerRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const getSrc = (el) => (typeof el === 'string' ? el : el.src);
  const getAlt = (el, fallback) => (typeof el === 'string' ? fallback : (el.alt || fallback));

  const openLightbox = (globalIndex) => setLightboxIndex(globalIndex);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setLightboxIndex((i) => (i + 1) % images.length);

  const total = images.length;
  const sideCount = Math.min(3, Math.floor(total / 3));
  const leftPart = images.slice(0, sideCount);
  const middlePart = images.slice(sideCount, total - sideCount);
  const rightPart = images.slice(total - sideCount);

  return (
    <div
      className={cn("w-full relative", className)}
      ref={containerRef}
    >
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            getSrc={getSrc}
            getAlt={getAlt}
          />
        )}
      </AnimatePresence>

      {/* MOBILE: single column stack */}
      <div className="flex flex-col gap-4 px-[5%] py-8 lg:hidden">
        {images.map((el, idx) => (
          <SkeletonImage
            key={"mobile-" + idx}
            src={getSrc(el)}
            alt={getAlt(el, "Galleria foto " + (idx + 1))}
            className="w-full h-auto rounded-xl shadow-lg"
            onClick={() => openLightbox(idx)}
            motionProps={{
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: 0.05 },
              viewport: { once: true, margin: "-50px" },
            }}
          />
        ))}
      </div>

      {/* DESKTOP: 3-column layout with sticky sides */}
      <div className="hidden lg:flex" style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: '1300px', marginLeft: 'auto', marginRight: 'auto', gap: '24px', paddingTop: '64px', paddingBottom: '64px', paddingLeft: '24px', paddingRight: '24px' }}>
        
        {/* LEFT COLUMN - STICKY */}
        <div className="w-1/3 sticky top-[15vh] self-start">
          <div className="grid gap-6">
            {leftPart.map((el, idx) => (
              <SkeletonImage
                key={"grid-1-" + idx}
                src={getSrc(el)}
                alt={getAlt(el, "Foto " + (idx + 1))}
                className="w-full h-auto rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.03]"
                onClick={() => openLightbox(idx)}
              />
            ))}
          </div>
        </div>

        {/* MIDDLE COLUMN - SCROLLS NORMALLY */}
        <div className="w-1/3">
          <div className="grid gap-6">
            {middlePart.map((el, idx) => (
              <SkeletonImage
                key={"grid-2-" + idx}
                src={getSrc(el)}
                alt={getAlt(el, "Foto " + (idx + 1))}
                className="w-full h-auto rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.03]"
                onClick={() => openLightbox(sideCount + idx)}
                motionProps={{
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, ease: "easeOut" },
                  viewport: { once: true, margin: "-80px" },
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - STICKY */}
        <div className="w-1/3 sticky top-[15vh] self-start">
          <div className="grid gap-6">
            {rightPart.map((el, idx) => (
              <SkeletonImage
                key={"grid-3-" + idx}
                src={getSrc(el)}
                alt={getAlt(el, "Foto " + (idx + 1))}
                className="w-full h-auto rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.03]"
                onClick={() => openLightbox(total - sideCount + idx)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
