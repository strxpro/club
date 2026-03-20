"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export function ZoomParallax({ images, children }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Different scale speeds for variety
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // Cards visible from start, fade out as they zoom
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.02, 0.6, 0.75], [0, 1, 1, 0]);

  // Center box appears after cards start disappearing
  const centerScale = useTransform(scrollYProgress, [0.5, 0.75], [0.92, 1]);
  const centerOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  // Card positions - absolute positioning with fixed px sizes
  const positions = [
    { top: '15%', left: '8%', w: 240, h: 180 },      // 0: top-left
    { top: '12%', right: '10%', w: 220, h: 160 },    // 1: top-right
    { top: '42%', left: '5%', w: 200, h: 200 },      // 2: mid-left
    { top: '38%', right: '6%', w: 210, h: 170 },     // 3: mid-right
    { top: '68%', left: '12%', w: 190, h: 180 },     // 4: bottom-left
    { top: '70%', right: '14%', w: 200, h: 160 },    // 5: bottom-right
    { top: '5%', left: '45%', w: 160, h: 140 },      // 6: top-center
  ];

  return (
    <div ref={container} className="relative h-[300vh] bg-navy-dark">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          {images.map((item, index) => {
            const scale = scales[index % scales.length];
            const pos = positions[index % positions.length];

            return (
              <motion.div
                key={index}
                style={{ 
                  scale, 
                  opacity: cardsOpacity,
                  position: 'absolute',
                  ...pos,
                  width: `${pos.w}px`,
                  height: `${pos.h}px`,
                }}
                className="origin-center"
              >
                <div className="w-full h-full rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/10">
                  {item.content ? (
                    <div className="w-full h-full bg-[#0a0e1a]/95 backdrop-blur-xl p-3 flex flex-col justify-center items-center text-center">
                      {item.content}
                    </div>
                  ) : (
                    <img
                      src={item.src || "/placeholder.svg"}
                      alt={item.alt || `Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Center contact box */}
        <motion.div 
          style={{ scale: centerScale, opacity: centerOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div className="pointer-events-auto w-full max-w-[1200px] mx-auto px-4">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
