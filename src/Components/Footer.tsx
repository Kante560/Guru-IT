// src/components/Footer.tsx

import { Mail, Github, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-blue-900 font-inter text-white py-6 ">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-3">
        <div className="flex space-x-6">
          <a href="mailto:info@guru.com" aria-label="Email" className="hover:text-blue-300">
            <Mail size={24} />
          </a>
          <a href="https://github.com/guruhub" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-blue-300">
            <Github size={24} />
          </a>
          <a href="https://linkedin.com/company/guruhub" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-300">
            <Linkedin size={24} />
          </a>
        </div>
        <p className="text-sm text-center">
          © 2025 Guru Innovation Hub. All rights reserved.
        </p>
        <p className="text-xs text-gray-300">Powered by Guru Innovation Hub Devs</p>
      </div>
    </footer>
  );
};

 
