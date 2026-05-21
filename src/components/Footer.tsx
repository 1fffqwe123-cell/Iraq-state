import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../translations';
import { Landmark, Phone, Mail, MapPin, Lock, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentLanguage, settings, navigate } = useApp();
  const t = TRANSLATIONS[currentLanguage];

  const year = 2026; // Match system date (2026-05-20)
  
  const handleAdminGateway = () => {
    navigate('admin');
  };

  return (
    <footer className="bg-stone-900 text-stone-200 border-t border-stone-800" id="app-footer-container">
      
      {/* Upper Footer Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-4" id="footer-pitch">
            <div className="flex items-center gap-3">
              <div className="bg-gold-500 text-stone-900 p-2 rounded-lg">
                <Landmark className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {currentLanguage === 'ar' ? settings.logoTextAr : settings.logoTextEn}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              {currentLanguage === 'ar' ? settings.companyDescriptionAr : settings.companyDescriptionEn}
            </p>
          </div>

          {/* Quick Links Nav */}
          <div className="md:col-span-3 space-y-4" id="footer-navigation">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button 
                  onClick={() => navigate('home')} 
                  className="hover:text-gold-400 transition-colors duration-150 flex items-center gap-1.5"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{t.navHome}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('properties')} 
                  className="hover:text-gold-400 transition-colors duration-150 flex items-center gap-1.5"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{t.navProperties}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('contact')} 
                  className="hover:text-gold-400 transition-colors duration-150 flex items-center gap-1.5 font-medium"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{t.navContact}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="md:col-span-4 space-y-4" id="footer-contact-details">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.contactInfo}
            </h4>
            <div className="space-y-3.5 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <Phone className="h-4.5 w-4.5 text-gold-500 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs uppercase text-stone-500 leading-tight">الهاتف / Phone</span>
                  <a href={`tel:${settings.contactNumber}`} className="text-stone-300 hover:text-gold-400 font-mono transition-colors block" dir="ltr">
                    {settings.contactNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-gold-500 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs uppercase text-stone-500 leading-tight">المقر الرئيسي / Head Office</span>
                  <span className="text-stone-300">
                    {currentLanguage === 'ar' ? "المنصور، بغداد، العراق" : "Al-Mansour, Baghdad, Iraq"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-stone-950 border-t border-stone-850 py-5 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Copyright notes */}
            <div className="text-center sm:text-start" id="footer-legal-copyright">
              <span>© {year} {t.allRightsReserved}.</span>
            </div>

            {/* Hidden admin trigger lock icon */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-stone-600 font-sans" dir="ltr">V1.2 Premium</span>
              <button
                onClick={handleAdminGateway}
                className="opacity-20 hover:opacity-100 text-stone-500 hover:text-gold-400 p-2 rounded-full transition-all duration-200"
                title="Admin Gateway (Hidden Route)"
                id="hidden-admin-lock-btn"
              >
                <Lock className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
};
