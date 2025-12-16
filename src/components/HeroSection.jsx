import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

/* ----------------------------------
   DATA
---------------------------------- */

const slides = [
  {
    caption: 'Mountain Pack',
    link: '/packs/mountain',
    left: 'https://picsum.photos/600/400?seed=mleft',
    center: 'https://picsum.photos/800/600?seed=mcenter',
    right: 'https://picsum.photos/600/400?seed=mright',
    description: 'Explore the rugged mountain landscapes, perfect for adventure lovers.',
    features: ['High-resolution textures', 'Customizable layers', 'Optimized for web & mobile'],
    extraImage: 'https://picsum.photos/400/300?seed=extra1'
  },
  {
    caption: 'City Pack',
    link: '/packs/city',
    left: 'https://picsum.photos/600/400?seed=cleft',
    center: 'https://picsum.photos/800/600?seed=ccenter',
    right: 'https://picsum.photos/600/400?seed=cright',
    description: 'Modern urban cityscapes with vibrant colors.',
    features: ['Night & day scenes', 'Editable files', 'Vector ready'],
    extraImage: 'https://picsum.photos/400/300?seed=extra2'
  },
  {
    caption: 'Ocean Pack',
    link: '/packs/ocean',
    left: 'https://picsum.photos/600/400?seed=oleft',
    center: 'https://picsum.photos/800/600?seed=ocenter',
    right: 'https://picsum.photos/600/400?seed=oright',
    description: 'Peaceful ocean views for calm and creativity.',
    features: ['Waves & horizon', 'High-quality textures', 'Customizable layers'],
    extraImage: 'https://picsum.photos/400/300?seed=extra3'
  },
];

/* ----------------------------------
   DEVICE DETECTION (CORRECT WAY)
---------------------------------- */

const isMobile =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/* ----------------------------------
   UI BITS
---------------------------------- */

const RulerStrip = () => (
  <div className="w-full flex justify-between items-end h-6">
    {Array.from({ length: 60 }).map((_, i) => (
      <div
        key={i}
        className={`w-px bg-gray-800 ${i % 5 === 0 ? 'h-6' : 'h-4'}`}
      />
    ))}
  </div>
);

/* ----------------------------------
   SLIDE STACK
---------------------------------- */

const SlideStack = ({ slide, onClick }) => {
  const localRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  /* 🔹 Mobile pulse hint */
  const [pulse, setPulse] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const dragThreshold = 10;

  /* Play pulse once on mobile */
  useEffect(() => {
    if (!isMobile) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 1600);
    return () => clearTimeout(t);
  }, []);

  /* Desktop hover tracking */
  useEffect(() => {
    if (!localRef.current || isMobile) return;

    const el = localRef.current;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      setCursorPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };

    el.addEventListener('mouseenter', () => setHovered(true));
    el.addEventListener('mouseleave', () => setHovered(false));
    el.addEventListener('mousemove', move);

    return () => el.removeEventListener('mousemove', move);
  }, []);

  const handleDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
    setPulse(false);
  };

  const handleUp = (e) => {
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    if (dx < dragThreshold && dy < dragThreshold) onClick();
  };

  return (
    <div
      className="relative w-[80%] h-5/6 cursor-pointer"
      onMouseDown={handleDown}
      onMouseUp={handleUp}
    >
      {/* LEFT IMAGE */}
      <motion.img
        src={slide.left}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[38%] h-4/5 object-cover rounded-lg shadow-lg"
        animate={{ scale: hovered ? 1.03 : 1, x: hovered ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      />

      {/* CENTER IMAGE */}
      <div
        ref={localRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46%] h-full z-10"
      >
        <motion.img
          src={slide.center}
          className="w-full h-full object-cover rounded-xl shadow-2xl"
          animate={
            isMobile && pulse
              ? { scale: [1, 1.03, 1], y: [0, -6, 0] }
              : { scale: hovered ? 1.05 : 1 }
          }
          transition={
            isMobile
              ? { duration: 1.4, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 320, damping: 20 }
          }
        />

        {/* DESKTOP VIEW BUBBLE */}
        {!isMobile && hovered && (
          <motion.div
            className="absolute pointer-events-none flex items-center justify-center
                       w-28 h-28 rounded-full bg-white text-black text-xs uppercase tracking-widest"
            style={{ left: cursorPos.x - 56, top: cursorPos.y - 56 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            View {slide.caption.split(' ')[0]}
          </motion.div>
        )}
      </div>

      {/* RIGHT IMAGE */}
      <motion.img
        src={slide.right}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[38%] h-4/5 object-cover rounded-lg shadow-lg"
        animate={{ scale: hovered ? 1.03 : 1, x: hovered ? 4 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      />
    </div>
  );
};

/* ----------------------------------
   MODAL
---------------------------------- */

export function PackModal({ slide, index }) {
  const navigate = useNavigate();
  const close = () => navigate(-1);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      >
        <motion.div
          layoutId={`slide-${index}`}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-[90%] h-[90vh] p-6 relative overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg"
          >
            ←
          </button>

          <img src={slide.center} className="rounded-xl mb-4 w-full h-72 object-cover" />
          <h2 className="text-2xl font-bold">{slide.caption}</h2>
          <p className="text-gray-600 mt-2">{slide.description}</p>

          <ul className="list-disc ml-5 mt-4 space-y-1">
            {slide.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          {slide.extraImage && (
            <img
              src={slide.extraImage}
              className="rounded-lg w-full h-60 object-cover mt-4"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ----------------------------------
   MAIN CAROUSEL
---------------------------------- */

export default function ScrollSnapStackCarousel() {
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.find((e) => e.isIntersecting);
        if (v) setActive(Number(v.target.dataset.idx));
      },
      { root: el, threshold: 0.6 }
    );

    el.querySelectorAll('[data-idx]').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const prev = (i) => (i - 1 + slides.length) % slides.length;
  const next = (i) => (i + 1) % slides.length;

  return (
    <div className="w-full select-none">
      <div className="flex justify-between px-6 pt-4">
        <span className="font-semibold">PROJECT 2025</span>
        <span className="font-semibold">EDITION 01</span>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory h-[65vh] px-4"
      >
        {slides.map((s, i) => (
          <div
            key={s.center}
            data-idx={i}
            className="snap-center shrink-0 w-full flex justify-center items-center"
          >
            <SlideStack slide={s} onClick={() => navigate(s.link)} />
          </div>
        ))}
      </div>

      <RulerStrip />

      <div className="h-16 flex items-center justify-between px-6">
        <span onClick={() => scrollRef.current.scrollTo({ left: prev(active) * scrollRef.current.clientWidth, behavior: 'smooth' })}>
          {slides[prev(active)].caption}
        </span>
        <span className="text-3xl font-bold">{slides[active].caption}</span>
        <span onClick={() => scrollRef.current.scrollTo({ left: next(active) * scrollRef.current.clientWidth, behavior: 'smooth' })}>
          {slides[next(active)].caption}
        </span>
      </div>

      <RulerStrip />

      {slides.map((s, i) =>
        location.pathname === s.link ? <PackModal key={i} slide={s} index={i} /> : null
      )}
    </div>
  );
}
