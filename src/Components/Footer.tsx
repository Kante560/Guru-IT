// src/components/Footer.tsx

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="bg-gradient-to-t from-[#131A29] to-[#214cc3] rounded-t-[35px] md:rounded-t-[65px] lg:rounded-t-[95px] ">
      <footer className="text-[#F3F4F6] pt-10 pb-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-8">
          {/* Brand & Social */}
          <div>
            <img src="/guruinnovationhub.png" alt="Guru Innovation Hub" className="w-36 mb-4" />
            <p className="mb-6 text-[#D1D5DB] text-sm">
              Guru Innovation Hub Interns: A platform for aspiring tech professionals to learn, collaborate, and gain real-world experience. Empowering interns to grow, connect, and launch their careers in technology.
            </p>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-[#1D3A8A]" aria-label="Facebook"><Facebook size={22} /></a>
              <a href="#" className="hover:text-[#1D3A8A]" aria-label="Twitter"><Twitter size={22} /></a>
              <a href="#" className="hover:text-[#1D3A8A]" aria-label="Instagram"><Instagram size={22} /></a>
              <a href="#" className="hover:text-[#1D3A8A]" aria-label="LinkedIn"><Linkedin size={22} /></a>
              <a href="#" className="hover:text-[#1D3A8A]" aria-label="YouTube"><Youtube size={22} /></a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#1D3A8A]">Home</Link></li>

              <li><Link to="/checkinout" className="hover:text-[#1D3A8A]">Check-In/Out</Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2 text-[#D1D5DB] text-sm">
              <li className="flex items-center"><Mail size={18} className="mr-2" /> guruIhub@gmail.com</li>
              <li className="flex items-center"><Phone size={18} className="mr-2" /> +234 (810) 525-25866</li>
              <li className="flex items-center"><MapPin size={18} className="mr-2" /> Calabar, Nigeria</li>
            </ul>
          </div>
          {/* Powered By */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-4 text-white">Powered By</h3>
            <img src="/gurudevs.png" alt="Guru Devs" className="w-32 mb-2" />
            <span className="text-xs text-[#D1D5DB]">Guru Innovation Hub Devs</span>
          </div>
        </div>
      </footer>
      <div className="border-t border-gray-400 py-4 px-4 flex flex-col md:flex-row justify-center items-center text-white/80 text-xs sm:text-sm gap-2">
        <div>© {new Date().getFullYear()} Guru Innovation Hub. All rights reserved.</div>
        <div className="flex items-center gap-2">
          <span>|</span>
          <span>Built with ❤️ by Guru Devs</span>
        </div>
      </div>
    </div>
  );
};


