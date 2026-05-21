import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../translations';
import { CITY_TRANSLATIONS, TYPE_TRANSLATIONS } from '../demoData';
import { Search, MapPin, Home, Banknote } from 'lucide-react';

export const Hero: React.FC = () => {
  const { currentLanguage, navigate } = useApp();
  const t = TRANSLATIONS[currentLanguage];

  // Search Filter state values inside Hero
  const [city, setCity] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleSearchCommit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build a hash query to transmit filters onto the properties view
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    if (maxPrice) params.set('maxPrice', maxPrice);

    // Save search to sessionStorage to read on properties mount
    sessionStorage.setItem('iraq_estate_search_preset', JSON.stringify({
      city,
      type,
      maxPrice: maxPrice ? Number(maxPrice) : null
    }));

    navigate('properties');
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-stone-900 overflow-hidden py-16 px-4" id="home-hero-container">
      
      {/* Background Graphic Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
          alt="Premium real estate backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto text-center w-full space-y-10">
        
        {/* Banner Headers */}
        <div className="space-y-4 max-w-3xl mx-auto animate-fade-in" id="hero-title-group">
          <span className="inline-flex items-center gap-1.5 bg-gold-500/10 text-gold-400 py-1.5 px-4 rounded-full text-xs font-semibold tracking-wide border border-gold-500/20">
            ★ {currentLanguage === 'ar' ? 'البوابة العقارية الأرقى في العراق' : 'Al-Mansour & Erbil Signature Portal'}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Quick Search Filtering Card */}
        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto border border-white/20 text-start" id="hero-filter-box">
          <form onSubmit={handleSearchCommit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* City Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gold-600" />
                  <span>{t.cityLabel}</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-stone-100 hover:bg-stone-150 border-0 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3.5 text-sm font-medium transition-all"
                  id="hero-city-select"
                >
                  <option value="">{t.allCities}</option>
                  {Object.entries(CITY_TRANSLATIONS).map(([key, obj]) => (
                    <option key={key} value={key}>
                      {currentLanguage === 'ar' ? obj.ar : obj.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-gold-600" />
                  <span>{t.typeLabel}</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-stone-100 hover:bg-stone-150 border-0 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3.5 text-sm font-medium transition-all"
                  id="hero-type-select"
                >
                  <option value="">{t.allTypes}</option>
                  {Object.entries(TYPE_TRANSLATIONS).map(([key, obj]) => (
                    <option key={key} value={key}>
                      {currentLanguage === 'ar' ? obj.ar : obj.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Budget Input (IQD) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
                  <Banknote className="h-3.5 w-3.5 text-gold-600" />
                  <span>{t.maxPrice}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="e.g. 500000000"
                    className="w-full bg-stone-100 placeholder-stone-400 border-0 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3.5 text-sm font-medium transition-all"
                    id="hero-price-input"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    IQD
                  </div>
                </div>
              </div>

            </div>

            {/* Submit Action Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gold-600 hover:bg-gold-500 text-stone-900 font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
                id="hero-submit-btn"
              >
                <Search className="h-4.5 w-4.5" />
                <span>{t.searchBtn}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
