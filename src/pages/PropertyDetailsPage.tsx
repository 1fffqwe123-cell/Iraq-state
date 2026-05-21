import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../translations';
import { CITY_TRANSLATIONS, TYPE_TRANSLATIONS } from '../demoData';
import { PropertyCard } from '../components/PropertyCard';
import { ContactForm } from '../components/ContactForm';
import { 
  Bed, 
  Bath, 
  Expand, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Layers, 
  Calendar,
  PhoneCall,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const { currentLanguage, properties, selectedPropertyId, navigate, settings } = useApp();
  const t = TRANSLATIONS[currentLanguage];

  // Selected property parsing
  const property = properties.find(p => p.id === selectedPropertyId);

  // Gallery slider state index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-2xl font-black text-stone-900">
          {currentLanguage === 'ar' ? 'العقار غير متوفر أو تم حذفه' : 'Property Listing Not Found'}
        </h2>
        <p className="text-stone-500 text-sm max-w-sm mx-auto">
          {currentLanguage === 'ar' ? 'ربما قام المشرف على النظام بمسح هذا العقار مؤخراً.' : 'This listing may have been cleared by system operators.'}
        </p>
        <button
          onClick={() => navigate('properties')}
          className="bg-gold-600 hover:bg-gold-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
        >
          {t.backToProperties}
        </button>
      </div>
    );
  }

  // Derived properties info
  const titleText = currentLanguage === 'ar' ? property.titleAr : property.titleEn;
  const descText = currentLanguage === 'ar' ? property.descriptionAr : property.descriptionEn;
  const cityObj = CITY_TRANSLATIONS[property.city] || { ar: property.city, en: property.city };
  const cityText = currentLanguage === 'ar' ? cityObj.ar : cityObj.en;
  const typeObj = TYPE_TRANSLATIONS[property.type] || { ar: property.type, en: property.type };
  const typeText = currentLanguage === 'ar' ? typeObj.ar : typeObj.en;

  // Format price
  const formatPrice = (priceNum: number) => {
    const formatted = new Intl.NumberFormat('en-US').format(priceNum);
    return currentLanguage === 'ar' ? `${formatted} د.ع` : `${formatted} IQD`;
  };

  // Gallery Navigation
  const prevImage = () => {
    setActiveImageIndex(current => 
      current === 0 ? property.images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveImageIndex(current => 
      current === property.images.length - 1 ? 0 : current + 1
    );
  };

  // Find Similar Properties (same city or same classification type, exclude self, limit to 3)
  const similarProperties = properties
    .filter(p => p.id !== property.id && (p.city === property.city || p.type === property.type))
    .slice(0, 3);

  // Fallback similar list if empty
  const alternateSimilar = similarProperties.length > 0
    ? similarProperties
    : properties.filter(p => p.id !== property.id).slice(0, 3);

  // Core specs details list
  const generalSpecs = [
    { label: t.cityLabel, val: cityText },
    { label: t.typeLabel, val: typeText },
    { label: t.areaLabel, val: `${property.area} م²` },
    property.type !== 'land' ? { label: t.bedroomsLabel, val: property.bedrooms } : null,
    property.type !== 'land' ? { label: t.bathroomsLabel, val: property.bathrooms } : null,
    { 
      label: t.postedDate, 
      val: new Date(property.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-IQ' : 'en-US') 
    }
  ].filter(item => item !== null);

  // Premium Features placeholder
  const standardFeatures = currentLanguage === 'ar' ? [
    "موقع جغرافي مميز وهادئ",
    "سند طابو ملك صرف جاهز للتحويل الفوري",
    "أنظمة تصريف وعزل حراري بالكامل",
    "سهولة الوصول لكافة شبكات البنية التحتية والمياه والصرف",
    "مبني بمقاومة عالية بأسقف سلاب خرسانية متينة",
    "موقف سيارات مستقل وواسع"
  ] : [
    "Prestigious quiet residential block",
    "Absolute freehold title deeds (Tabu) ready for instant handover",
    "Integrated climate and soundproof thermal insulation",
    "Direct utility hookups (continuous water supply & electrical line)",
    "Concrete slab solid foundation standard specs",
    "Grand private garage space included"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in" id="property-details-profile">
      
      {/* Back button link */}
      <button
        onClick={() => navigate('properties')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-600 hover:text-gold-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <span>{t.backToProperties}</span>
      </button>

      {/* Main Core Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Gallery & Details Description */}
        <div className="lg:col-span-8 space-y-8" id="profile-left-column">
          
          {/* Gallery Widget */}
          <div className="bg-stone-900 rounded-3xl overflow-hidden aspect-video relative group shadow-lg">
            <img 
              src={property.images[activeImageIndex]} 
              alt={`Gallery Image ${activeImageIndex}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              id="details-gallery-active-image"
            />

            {/* Slider triggers */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-xs transition-colors"
                  title="Previous Photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-xs transition-colors"
                  title="Next Photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Slide Index overlay counter */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 select-none">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">
                {activeImageIndex + 1} / {property.images.length}
              </span>
            </div>
          </div>

          {/* Album thumbnails grid */}
          {property.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3" id="profile-gallery-thumbnails">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-video rounded-xl overflow-hidden border-2 bg-stone-100 transition-all ${
                    activeImageIndex === i ? 'border-gold-500 scale-95 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${i}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Titles & Pricing row */}
          <div className="space-y-4" id="details-header-card">
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-2">
                
                {/* badges type */}
                <div className="flex gap-2.5 items-center select-none">
                  <span className="bg-stone-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {typeText}
                  </span>
                  <span className="bg-stone-100 text-stone-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {cityText}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight" id="details-profile-title">
                  {titleText}
                </h1>
              </div>

              {/* Price Tag */}
              <div className="text-2xl sm:text-3xl font-extrabold text-gold-700 tracking-tight whitespace-nowrap" id="details-profile-price">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Quick specs horizontal pill bar */}
            {property.type !== 'land' ? (
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-stone-50 border border-stone-100 font-medium text-stone-600 text-sm">
                <div className="flex items-center gap-2">
                  <Bed className="h-4.5 w-4.5 text-stone-400" />
                  <span>{property.bedrooms} <span className="text-stone-400 text-xs font-normal">{t.bedroomsCount}</span></span>
                </div>
                <div className="h-4 w-[1px] bg-stone-200" />
                <div className="flex items-center gap-2">
                  <Bath className="h-4.5 w-4.5 text-stone-400" />
                  <span>{property.bathrooms} <span className="text-stone-400 text-xs font-normal">{t.bathroomsLabel}</span></span>
                </div>
                <div className="h-4 w-[1px] bg-stone-200" />
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Expand className="h-4.5 w-4.5 text-gold-600" />
                  <span>{property.area} م²</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-stone-50 border border-stone-100 font-bold text-stone-900 text-sm inline-flex">
                <Expand className="h-4.5 w-4.5 text-gold-600" />
                <span>{property.area} م²</span>
                <span className="text-stone-400 font-normal text-xs uppercase px-2">| Plot Size</span>
              </div>
            )}

          </div>

          {/* Description Text block */}
          <div className="space-y-4 border-t border-stone-100 pt-8" id="profile-details-description">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              {currentLanguage === 'ar' ? 'الوصف ومواصفات البناء' : 'Listing Specification Description'}
            </h3>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {descText}
            </p>
          </div>

          {/* Spec details grid checklist table */}
          <div className="space-y-4 border-t border-stone-100 pt-8" id="profile-specifications-table">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              {t.detailsHeroTitle}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {generalSpecs.map((spec, index) => (
                <div key={index} className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/40 space-y-0.5 text-center">
                  <span className="block text-stone-400 text-[10px] font-bold uppercase tracking-wider">{spec.label}</span>
                  <span className="block text-stone-800 text-sm font-semibold">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features checkmarks grid */}
          <div className="space-y-4 border-t border-stone-100 pt-8" id="profile-features-checklist">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              {t.featuresTitle}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {standardFeatures.map((feat, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600 font-medium">
                  <CheckCircle2 className="h-4.5 w-4.5 text-gold-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Contact Panel */}
        <div className="lg:col-span-4 space-y-6" id="profile-right-column">
          
          {/* Quick Direct Agent Call Block Card */}
          <div className="bg-stone-900 text-stone-200 p-6 sm:p-7 rounded-3xl border border-stone-850 shadow-md space-y-5">
            <div className="flex gap-3.5 items-center">
              <div className="bg-gold-500 text-stone-950 p-2.5 rounded-xl">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-stone-500 text-[10px] font-bold uppercase tracking-wide leading-none">{t.contactAgent}</span>
                <span className="block text-white text-base font-extrabold mt-0.5">{currentLanguage === 'ar' ? 'قسم المبيعات المباشر' : 'Direct Listings Officer'}</span>
              </div>
            </div>

            <a 
              href={`tel:${settings.contactNumber}`} 
              className="block w-full text-center bg-gold-600 hover:bg-gold-500 text-stone-950 font-extrabold py-3 rounded-xl transition-all font-mono"
              dir="ltr"
            >
              {settings.contactNumber}
            </a>
          </div>

          {/* Integrated Inquiry Email Form */}
          <ContactForm propertyId={property.id} propertyTitle={titleText} />

        </div>

      </div>

      {/* Similar Listings Showcase */}
      <section className="border-t border-stone-200 pt-12 space-y-8" id="profile-similar-listings">
        <div className="text-center sm:text-start space-y-1">
          <h2 className="text-2xl font-black text-stone-950 tracking-tight">
            {t.similarProperties}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            {currentLanguage === 'ar' ? 'قد ترغب بتفحص هذه الخيارات المتوفرة لدينا حالياً أيضاً' : 'Excellent luxury selections picked according to your profile location.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {alternateSimilar.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

    </div>
  );
};
