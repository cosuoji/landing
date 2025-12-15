import React, { useState, useEffect, useRef } from "react";
import ScrollSnapStackCarousel from "./HeroSection";

export default function LandingPage({slides}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [animate, setAnimate] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const sections = ["home", "what-we-do", "about", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (open) {
          setAnimate(false);
          setTimeout(() => setOpen(false), 300);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleMenu = () => {
    if (open) {
      setAnimate(false);
      setTimeout(() => setOpen(false), 300);
    } else {
      setOpen(true);
      setAnimate(true);
    }
  };

  const handleAnchorClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (open) toggleMenu();
  };

  return (
    <div className="scroll-smooth">
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Brand</h1>

          <ul className="hidden md:flex space-x-6 text-sm font-medium">
            {["home", "what-we-do", "about", "contact"].map((section) => (
              <li key={section}>
                <button
                  onClick={() => handleAnchorClick(section)}
                  className={`hover:text-blue-600 ${
                    active === section ? "text-blue-600 font-semibold" : ""
                  }`}
                >
                  {section.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              </li>
            ))}
          </ul>

          <button className="md:hidden p-2" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>

        {open && (
          <div
            ref={menuRef}
            className={`md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-11/12 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 z-50 ${
              animate ? "animate-slide-up" : "animate-slide-down"
            }`}
          >
            {["home", "what-we-do", "about", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => handleAnchorClick(section)}
                className={`text-xl font-semibold ${
                  active === section ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {section.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="scroll-smooth pt-20">
        <ScrollSnapStackCarousel slides={slides} />
       </section>
   

      {/* WHAT WE DO */}
      <section id="what-we-do" className="bg-white px-4 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="relative">
            <div className="sticky top-32 pr-8 border-r border-gray-200 transition-opacity duration-300">
              <h3 className="text-4xl font-bold text-gray-900">WHAT WE DO</h3>
            </div>
          </div>

          <div className="space-y-10">
            {["We design, build, and grow digital products that focus on clarity, performance, and user experience.",
              "From launches to long-term growth systems, we help brands stand out with thoughtful execution.",
              "Everything we build is scalable, maintainable, and crafted with intent."]
              .map((text, i) => (
                <p
                  key={i}
                  className="text-lg text-gray-700 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {text}
                </p>
              ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-gray-50 px-4 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="relative">
            <div className="sticky top-32 pr-8 border-r border-gray-300 transition-opacity duration-300">
              <h3 className="text-4xl font-bold text-gray-900">ABOUT US</h3>
            </div>
          </div>

          <div className="space-y-10">
            {["We are a focused team passionate about building meaningful digital experiences.",
              "Our work lives at the intersection of design, technology, and empathy.",
              "Every project is treated as a long-term partnership, not a one-off delivery."]
              .map((text, i) => (
                <p
                  key={i}
                  className="text-lg text-gray-700 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {text}
                </p>
              ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white px-4 py-24">
        <div className="max-w-xl mx-auto w-full">
          <h3 className="text-4xl font-bold text-center mb-10">CONTACT US</h3>
          <div className="p-6 rounded-2xl shadow bg-gray-100">
            <input type="text" placeholder="Your email" className="w-full p-3 rounded mb-4" />
            <textarea placeholder="Message" className="w-full p-3 rounded h-32 mb-4" />
            <button className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Send Message
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-down {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .animate-fade-up { animation: fade-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}
