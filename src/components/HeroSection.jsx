// ScrollSnapStackCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

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

const RulerStrip = () => (
  <div className="w-full flex justify-between items-end h-6">
    {Array.from({ length: 60 }).map((_, i) => (
      <div key={i} className={`w-px bg-gray-800 ${i % 5 === 0 ? 'h-6' : 'h-4'}`} />
    ))}
  </div>
);

const SlideStack = ({ slide, onClick }) => {
  const localRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  const dragThreshold = 10;
  const dragStart = useRef({ x: 0, y: 0 });
  const dragMoved = useRef(false);

  useEffect(() => {
    const el = localRef.current;
    if (!el || isTouch) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
    };
  }, [isTouch]);

  const handleMouseDown = (e) => {
    dragMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = (e) => {
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    if (dx < dragThreshold && dy < dragThreshold) onClick();
  };

  const imgPop = {
    left:  { scale: hovered ? 1.03 : 1, x: hovered ? -4 : 0 },
    center:{ scale: hovered ? 1.05 : 1 },
    right: { scale: hovered ? 1.03 : 1, x: hovered ? 4 : 0 },
  };

  return (
    <div
      className="relative w-[80%] h-5/6 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <motion.img
        src={slide.left}
        alt="left"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[38%] h-4/5 object-cover rounded-lg shadow-lg"
        animate={imgPop.left}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      />
      <div
        ref={localRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46%] h-full"
        style={{ zIndex: 2 }}
      >
        <motion.img
          src={slide.center}
          alt="center"
          className="w-full h-full object-cover rounded-xl shadow-2xl"
          animate={imgPop.center}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        />
        {hovered && (
          <motion.div
            className="absolute pointer-events-none flex items-center justify-center
                       w-28 h-28 rounded-full bg-white text-black text-xs uppercase tracking-widest z-20"
            style={{ left: pos.x - 56, top: pos.y - 56 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            View {slide.caption.split(' ')[0]}
          </motion.div>
        )}
      </div>
      <motion.img
        src={slide.right}
        alt="right"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[38%] h-4/5 object-cover rounded-lg shadow-lg"
        animate={imgPop.right}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      />
    </div>
  );
};

export function PackModal({ slide, index }) {
  const navigate = useNavigate();
  const closeModal = () => navigate(-1);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
        <motion.div
          layoutId={`slide-${index}`}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-[90%] h-[90vh] p-6 relative overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
       {/* Close Button Icon */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>


          <motion.div
            className="flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Center Image */}
            <motion.img
              src={slide.center}
              className="rounded-xl mb-4 w-full object-cover h-64 md:h-80"
              variants={itemVariants}
            />

            {/* Title */}
            <motion.h2 className="text-2xl font-bold" variants={itemVariants}>
              {slide.caption}
            </motion.h2>

            {/* Description */}
            <motion.p className="text-gray-600" variants={itemVariants}>
              {slide.description}
            </motion.p>

            {/* Features */}
            <motion.ul className="list-disc ml-5 text-gray-700 space-y-1" variants={itemVariants}>
              {slide.features?.map((feature, i) => (
                <motion.li key={i} variants={itemVariants}>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            {/* Extra Image */}
            {slide.extraImage && (
              <motion.img
                src={slide.extraImage}
                className="rounded-lg w-full h-60 object-cover"
                variants={itemVariants}
              />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ScrollSnapStackCarousel() {
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(Number(visible.target.dataset.idx));
      },
      { root: slider, threshold: 0.6 }
    );
    slider.querySelectorAll('[data-idx]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const prev = (i) => (i - 1 + slides.length) % slides.length;
  const next = (i) => (i + 1) % slides.length;

  return (
    <div className="w-full select-none">
      <div className="px-4 md:px-8 pt-3 md:pt-5 flex justify-between">
        <span className="text-sm md:text-xl font-semibold text-gray-800">Project 2025</span>
        <span className="text-sm md:text-xl font-semibold text-gray-800">Edition 01</span>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory w-full h-[45vh] md:h-[65vh] px-4 scrollbar-hide"
      >
        {slides.map((s, i) => (
          <div key={s.center} data-idx={i} className="snap-center shrink-0 w-full flex items-center justify-center">
            <SlideStack slide={s} onClick={() => navigate(s.link)} />
          </div>
        ))}
      </div>

      <RulerStrip />
      <div className="h-16 bg-white flex items-center justify-between px-6">
        <span
          className="text-gray-400 cursor-pointer hover:text-gray-600 uppercase"
          onClick={() => scrollRef.current?.scrollTo({ left: prev(active) * scrollRef.current.clientWidth, behavior: 'smooth' })}
        >
          {slides[prev(active)].caption}
        </span>
        <span className="text-3xl font-bold tracking-wide uppercase">{slides[active].caption}</span>
        <span
          className="text-gray-400 cursor-pointer hover:text-gray-600 uppercase"
          onClick={() => scrollRef.current?.scrollTo({ left: next(active) * scrollRef.current.clientWidth, behavior: 'smooth' })}
        >
          {slides[next(active)].caption}
        </span>
      </div>
      <RulerStrip />

      {/* Route-based modals */}
      {slides.map((slide, i) =>
        location.pathname === slide.link ? <PackModal key={i} slide={slide} index={i} /> : null
      )}
    </div>
  );
}
