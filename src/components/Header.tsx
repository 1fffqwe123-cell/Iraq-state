import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../translations';
import { Menu, X, Landmark, Globe, PhoneCall } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentLanguage, settings, currentRoute, navigate, setLanguage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[currentLanguage];
  const isRtl = currentLanguage === 'ar';

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'properties', label: t.navProperties },
    { id: 'contact', label: t.navContact },
  ];

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'ar' ? 'en' : 'ar');
  };

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100 transition-all duration-300" id="app-header-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
            id="header-brand-logo"
          >
            <div className="bg-gold-600 text-white p-2.5 rounded-xl shadow-md group-hover:bg-gold-500 transition-colors duration-200">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-stone-900 tracking-tight block">
                {currentLanguage === 'ar' ? settings.logoTextAr : settings.logoTextEn}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold-600 block leading-none">
                {currentLanguage === 'ar' ? "بوابة عقارات العراق" : "Iraq Real Estate"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" id="desktop-nav-menu">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors relative py-2 ${
                    isActive 
                      ? 'text-gold-600 font-semibold' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Call-to-actions, Language Switcher & Quick Number */}
          <div className="hidden md:flex items-center gap-4" id="header-desktop-actions">
            {/* Direct Phone Shortcut */}
            <a 
              href={`tel:${settings.contactNumber}`} 
              className="flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-gold-600 border border-stone-200 bg-stone-50 py-2 px-3.5 rounded-lg transition-all"
              id="header-phone-btn"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span dir="ltr">{settings.contactNumber}</span>
            </a>

            {/* Language switch button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-xs font-semibold text-stone-800 hover:text-gold-600 border border-stone-200 hover:border-gold-300 hover:bg-gold-50/50 py-2 px-3.5 rounded-lg transition-all"
              id="language-switcher-btn"
            >
              <Globe className="h-4 w-4 text-gold-600" />
              <span>{currentLanguage === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center gap-2.5" id="header-mobile-actions">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center p-2 rounded-lg text-stone-600 hover:bg-stone-50 border border-stone-100"
              title="Toggle Language"
            >
              <Globe className="h-5 w-5 text-gold-600" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center p-2 rounded-lg text-stone-700 bg-stone-50 hover:bg-stone-100 transition-colors"
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 shadow-lg animate-fade-in" id="mobile-drawer-container">
          <div className="px-4 pt-3 pb-6 space-y-3">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-inner text-sm font-medium py-3 px-4 rounded-xl text-start transition-all ${
                    isActive
                      ? 'bg-gold-50 text-gold-700 font-semibold border-s-4 border-gold-600'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                  id={`mobile-nav-item-${item.id}`}
                >
                  {item.label}
                </button>
              );
            })}
            
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-3.5 px-3">
              <a 
                href={`tel:${settings.contactNumber}`} 
                className="flex items-center justify-center gap-2.5 text-center text-sm font-semibold text-stone-900 border border-stone-200 bg-stone-50 py-3 rounded-xl hover:bg-stone-100 transition-all"
              >
                <PhoneCall className="h-4 w-4 text-gold-600" />
                <span dir="ltr">{settings.contactNumber}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
