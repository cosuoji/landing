import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

/* ---------------------------------- DATA --------------------------------- */

const slides = [
  {
    caption: 'Mountain Pack',
    link: '/packs/mountain',
    left: 'https://picsum.photos/600/400?seed=mleft',
    center: 'https://picsum.photos/800/600?seed=mcenter',
    right: 'https://picsum.photos/600/400?seed=mright',
    description: 'Explore the rugged mountain landscapes, perfect for adventure lovers.',
    features: ['High-resolution textures', 'Customizable layers', 'Optimized for web & mobile'],
    extraImage: 'https://picsum.photos/400/300?seed=extra1',
  },
  {
    caption: 'City Pack',
    link: '/packs/city',
    left: 'https://picsum.photos/600/400?seed=cleft',
    center: 'https://picsum.photos/800/600?seed=ccenter',
    right: 'https://picsum.photos/600/400?seed=cright',
    description: 'Modern urban cityscapes with vibrant colors.',
    features: ['Night & day scenes', 'Editable files', 'Vector ready'],
    extraImage: 'https://picsum.photos/400/300?seed=extra2',
  },
  {
    caption: 'Ocean Pack',
    link: '/packs/ocean',
    left: 'https://picsum.photos/600/400?seed=oleft',
    center: 'https://picsum.photos/800/600?seed=ocenter',
    right: 'https://picsum.photos/600/400?seed=oright',
    description: 'Peaceful ocean views for calm and creativity.',
    features: ['Waves & horizon', 'High-quality textures', 'Customizable layers'],
    extraImage: 'https://picsum.photos/400/300?seed=extra3',
  },
];

const isMobile =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/* --------------------------------- UI ---------------------------------- */

const RulerStrip = () => (
  <div className="w-full flex justify-between items-end h-6">
    {Array.from({ length: 60 }).map((_, i) => (
      <div key={i} className={`w-px bg-gray-800 ${i % 5 === 0 ? 'h-6' : 'h-4'}`} />
    ))}
  </div>
);

const TapIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
    <path d="M8 13v-2a2 2 0 1 1 4 0v1" />
    <path d="M12 12v-3a2 2 0 1 1 4 0v3" />
    <path d="M16 12v-1a2 2 0 1 1 4 0v6a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-4a2 2 0 1 1 4 0" />
  </svg>
);

/* ------------------------------ SLIDE STACK ------------------------------ */

const SlideStack = ({ slide, onClick }) => {
  const localRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastScrollX = useRef(0);
  const lastTime = useRef(Date.now());

  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [showTapHint, setShowTapHint] = useState(false);
  const [hintOpacity, setHintOpacity] = useState(1);

  const isTouch = isMobile;
  const dragThreshold = 10;

  /* Mobile hint on mount */
  useEffect(() => {
    if (!isTouch) return;
    setShowTapHint(true);
    const t = setTimeout(() => setShowTapHint(false), 2200);
    return () => clearTimeout(t);
  }, [isTouch]);

  /* Desktop hover tracking */
  useEffect(() => {
    if (!localRef.current || isTouch) return;
    const el = localRef.current;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseenter', () => setHovered(true));
    el.addEventListener('mouseleave', () => setHovered(false));

    return () => {
      el.removeEventListener('mousemove', move);
    };
  }, [isTouch]);

  /* Fade hint based on scroll velocity */
  useEffect(() => {
    if (!isTouch) return;

    const onScroll = () => {
      const now = Date.now();
      const dx = Math.abs(window.scrollX - lastScrollX.current);
      const dt = now - lastTime.current;
      const velocity = dx / Math.max(dt, 1);

      setHintOpacity(Math.max(0, 1 - velocity * 8));
      lastScrollX.current = window.scrollX;
      lastTime.current = now;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isTouch]);

  const handleMouseDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY };

    if (isTouch && navigator.vibrate) {
      navigator.vibrate(10);
    }

    setShowTapHint(false);
  };

  const handleMouseUp = (e) => {
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    if (dx < dragThreshold && dy < dragThreshold) onClick();
  };

  const imgPop = {
    left: { scale: hovered ? 1.03 : 1, x: hovered ? -4 : 0 },
    center: { scale: hovered ? 1.05 : 1 },
    right: { scale: hovered ? 1.03 : 1, x: hovered ? 4 : 0 },
  };

  return (
    <div
      className="relative w-[80%] h-5/6 cursor-pointer"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <motion.img src={slide.left} className="absolute left-0 top-1/2 -translate-y-1/2 w-[38%] h-4/5 rounded-lg shadow-lg object-cover" animate={imgPop.left} />

      <div ref={localRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46%] h-full z-10">
        <motion.img src={slide.center} className="w-full h-full rounded-xl shadow-2xl object-cover" animate={imgPop.center} />

        {!isTouch && hovered && (
          <motion.div
            className="absolute w-28 h-28 rounded-full bg-white flex items-center justify-center text-xs uppercase"
            style={{ left: pos.x - 56, top: pos.y - 56 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            View
          </motion.div>
        )}

        <AnimatePresence>
          {isTouch && showTapHint && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: hintOpacity }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-14 h-14 rounded-full bg-black/70 flex items-center justify-center shadow-lg"
                animate={{ scale: [0.95, 1, 0.95] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/30"
                  animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <TapIcon />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.img src={slide.right} className="absolute right-0 top-1/2 -translate-y-1/2 w-[38%] h-4/5 rounded-lg shadow-lg object-cover" animate={imgPop.right} />
    </div>
  );
};

/* ----------------------------- MAIN EXPORT ----------------------------- */

export default function ScrollSnapStackCarousel() {
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.find((e) => e.isIntersecting);
        if (v) setActive(Number(v.target.dataset.idx));
      },
      { root: slider, threshold: 0.6 }
    );

    slider.querySelectorAll('[data-idx]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="w-full">
      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory h-[60vh]">
        {slides.map((s, i) => (
          <div key={i} data-idx={i} className="snap-center shrink-0 w-full flex justify-center items-center">
            <SlideStack slide={s} onClick={() => navigate(s.link)} />
          </div>
        ))}
      </div>
      <RulerStrip />
    </div>
  );
}
