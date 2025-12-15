import React from 'react';
import { Instagram, Mail, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left Section: Brand Name */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-bold">Brand</h4>
          <p className="text-sm">© {new Date().getFullYear()} Brand. All rights reserved.</p>
        </div>

        {/* Middle Section: Email & Phone */}
        <div className="text-center">
          <p className="text-sm">email@example.com | +123 456 7890</p>
        </div>

        {/* Right Section: Social Links */}
        <div className="flex space-x-4 text-lg">
          <a href="#" aria-label="Instagram" className="hover:text-blue-400"><Instagram size={24} /></a>
          <a href="#" aria-label="X (Twitter)" className="hover:text-blue-400"><Twitter size={24} /></a>
          <a href="#" aria-label="Email" className="hover:text-blue-400"><Mail size={24} /></a>
        </div>
      </div>
    </footer>
  );
}
