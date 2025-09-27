// src/components/Footer.tsx
import { Facebook, Twitter, Instagram, Linkedin,  Mail, Phone, MapPin } from 'lucide-react';
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="bg-gradient-to-t from-[#131A29] to-[#214cc3] rounded-t-[28px] md:rounded-t-[65px] lg:rounded-t-[95px] ">
      <footer className="text-[#F3F4F6] pt-8 sm:pt-10 pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 pb-8">
          {/* Brand & Social */}
          <div className="text-center md:text-left">
            <img src="/gurudevs.png" alt="Guru Innovation Hub" className="w-28 sm:w-36 md:w-40 mx-auto md:mx-0 mb-4 rounded-md " />
            <p className="mb-6 text-[#D1D5DB] text-sm leading-relaxed">
              Guru Innovation Hub Interns: A platform for aspiring tech professionals to learn, collaborate, and gain real-world experience. Empowering interns to grow, connect, and launch their careers in technology.
            </p>
            <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4 text-2xl">
              <a href="https://www.facebook.com/profile.php?id=61579837100361" className="hover:text-gray-400 p-2 rounded-md focus-visible:ring-2 focus-visible:ring-white/50" aria-label="Facebook"><Facebook size={22} /></a>
              <a href="https://x.com/GuruAcademy40?t=0-mNnjpZjbBdHQPmoJtQDA&s=08" className="hover:text-gray-400 p-2 rounded-md focus-visible:ring-2 focus-visible:ring-white/50" aria-label="Twitter"><Twitter size={22} /></a>
              <a href="https://www.instagram.com/gurulearn_?utm_source=qr&igsh=ZXY3MDhhNnplMjV3" className="hover:text-gray-400 p-2 rounded-md focus-visible:ring-2 focus-visible:ring-white/50" aria-label="Instagram"><Instagram size={22} /></a>
              <a href="https://www.linkedin.com/company/guru-academy2/" className="hover:text-gray-400 p-2 rounded-md focus-visible:ring-2 focus-visible:ring-white/50" aria-label="LinkedIn"><Linkedin size={22} /></a>
              {/* <a href="#" className="hover:text-[#1D3A8A] p-2 rounded-md focus-visible:ring-2 focus-visible:ring-white/50" aria-label="YouTube"><Youtube size={22} /></a> */}
            </div>
          </div>
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm md:text-[15px]">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/checkinout" className="hover:underline">Check-In/Out</Link></li>
            </ul>
          </div>
          {/* Contact Info */}  
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2 text-[#D1D5DB] text-sm md:text-[15px]">
              <li className="flex items-center justify-center md:justify-start"><Mail size={18} className="mr-2" /> guruacademy40@gmail.com</li>
              <li className="flex items-center justify-center md:justify-start"><Phone size={18} className="mr-2" /> +234 (810) 525-25866</li>
              <li className="flex items-center justify-center md:justify-start"><MapPin size={18} className="mr-2" /> Calabar, Nigeria</li>
            </ul>
          </div>
          {/* Powered By */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">Powered By</h3>
            <img src="/gurudev.jpg" alt="Guru Devs" className="w-28 sm:w-32 md:w-36 mb-2 rounded-md" />
            <span className="text-xs text-[#D1D5DB]">Guru Innovation Hub Devs</span>
          </div>
        </div>
      </footer>
      <div className="border-t border-gray-400 py-4 px-4 flex flex-col md:flex-row justify-center items-center text-white/80 text-[11px] sm:text-sm gap-2 text-center">
        <div>© {new Date().getFullYear()} Guru Innovation Hub. All rights reserved.</div>
        <div className="flex items-center gap-2">
          <span>|</span>
          <span>Built with ❤️ by Guru Devs</span>
        </div>
      </div>
    </div>
  );
};


