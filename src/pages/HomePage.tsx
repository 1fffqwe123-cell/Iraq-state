import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../translations';
import { Hero } from '../components/Hero';
import { PropertyCard } from '../components/PropertyCard';
import { ContactForm } from '../components/ContactForm';
import { 
  ShieldCheck, 
  MapPin, 
  HelpCircle, 
  Users, 
  Building2, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { currentLanguage, properties, navigate } = useApp();
  const t = TRANSLATIONS[currentLanguage];

  // Filters featured properties
  const featured = properties.filter(p => p.isFeatured).slice(0, 3);
  // If no featured exist, take first 3
  const featuredList = featured.length > 0 ? featured : properties.slice(0, 3);

  // Latest added properties (first 6)
  const latestList = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-20 pb-16 animate-fade-in" id="home-page-layout">
      
      {/* 1. Hero Cover */}
      <Hero />

      {/* 2. Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8" id="home-featured-section">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-stone-950 tracking-tight flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-gold-600" />
            <span>{t.featuredTitle}</span>
          </h2>
          <p className="text-stone-500 text-sm max-w-lg mx-auto leading-relaxed">
            {t.featuredSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredList.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="bg-stone-900 text-stone-100 py-16" id="home-why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {t.whyChooseUs}
            </h2>
            <p className="text-stone-400 text-sm max-w-lg mx-auto">
              {t.whyChooseUsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Deed validation */}
            <div className="bg-stone-850 p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-4 hover:border-gold-500/20 transition-all duration-300">
              <div className="bg-gold-500 text-stone-950 p-3.5 rounded-2xl inline-block">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t.safetyTitle}
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                {t.safetyDesc}
              </p>
            </div>

            {/* Local intelligence */}
            <div className="bg-stone-850 p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-4 hover:border-gold-500/20 transition-all duration-300">
              <div className="bg-gold-500 text-stone-950 p-3.5 rounded-2xl inline-block">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t.localExpertiseTitle}
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                {t.localExpertiseDesc}
              </p>
            </div>

            {/* Support */}
            <div className="bg-stone-850 p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-4 hover:border-gold-500/20 transition-all duration-300">
              <div className="bg-gold-500 text-stone-950 p-3.5 rounded-2xl inline-block">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t.customerFirstTitle}
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                {t.customerFirstDesc}
              </p>
            </div>

          </div>

          {/* Core numerical stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-stone-800/80 text-center" id="home-stats-panel">
            <div className="space-y-1">
              <span className="block text-3xl font-black text-gold-400">1,200+</span>
              <span className="block text-stone-500 text-[11px] font-bold uppercase tracking-wider">{t.statProperties}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl font-black text-gold-400">850+</span>
              <span className="block text-stone-500 text-[11px] font-bold uppercase tracking-wider">{t.statFamilies}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl font-black text-gold-400">5+</span>
              <span className="block text-stone-500 text-[11px] font-bold uppercase tracking-wider">{t.statCities}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl font-black text-gold-400">12+</span>
              <span className="block text-stone-500 text-[11px] font-bold uppercase tracking-wider">{t.statExpertise}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Latest Added Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="home-latest-listings">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3.5">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-stone-950 tracking-tight">
              {t.latestTitle}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm">
              {t.latestSubtitle}
            </p>
          </div>
          <button 
            onClick={() => navigate('properties')}
            className="text-stone-900 border border-stone-200 hover:border-gold-300 bg-white shadow-sm hover:shadow px-5 py-2.5 rounded-xl text-xs font-semibold hover:text-gold-600 transition-all cursor-pointer"
          >
            {currentLanguage === 'ar' ? 'تصفح كل العقارات ←' : 'Browse All Properties →'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestList.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 5. Customer Testimonials Banner */}
      <section className="bg-stone-50 py-12" id="home-testimonials-carousel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {t.testimonials}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm">
              {t.testimonialsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-stone-100 flex flex-col justify-between space-y-6">
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed italic">
                "{t.test1Content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold-100 text-gold-700 font-bold flex items-center justify-center text-sm">
                  أ
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">{t.test1Name}</h4>
                  <span className="text-[10px] text-stone-400 capitalize">{t.test1Role}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-stone-100 flex flex-col justify-between space-y-6">
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed italic">
                "{t.test2Content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold-100 text-gold-700 font-bold flex items-center justify-center text-sm">
                  س
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">{t.test2Name}</h4>
                  <span className="text-[10px] text-stone-400 capitalize">{t.test2Role}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-stone-100 flex flex-col justify-between space-y-6">
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed italic">
                "{t.test3Content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold-100 text-gold-700 font-bold flex items-center justify-center text-sm">
                  ر
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">{t.test3Name}</h4>
                  <span className="text-[10px] text-stone-400 capitalize">{t.test3Role}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Inline Contact Form Panel */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6" id="home-contact-block">
        <ContactForm />
      </section>

    </div>
  );
};
