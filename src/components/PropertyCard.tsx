import React from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { CITY_TRANSLATIONS, TYPE_TRANSLATIONS } from '../demoData';
import { TRANSLATIONS } from '../translations';
import { Bed, Bath, Expand, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { currentLanguage, navigate } = useApp();
  const t = TRANSLATIONS[currentLanguage];

  // Price formatting helper
  const formatPrice = (priceNum: number) => {
    const formatted = new Intl.NumberFormat('en-US').format(priceNum);
    return currentLanguage === 'ar' ? `${formatted} د.ع` : `${formatted} IQD`;
  };

  const titleText = currentLanguage === 'ar' ? property.titleAr : property.titleEn;
  const descText = currentLanguage === 'ar' ? property.descriptionAr : property.descriptionEn;
  const cityObj = CITY_TRANSLATIONS[property.city] || { ar: property.city, en: property.city };
  const cityText = currentLanguage === 'ar' ? cityObj.ar : cityObj.en;
  
  const typeObj = TYPE_TRANSLATIONS[property.type] || { ar: property.type, en: property.type };
  const typeText = currentLanguage === 'ar' ? typeObj.ar : typeObj.en;

  // Select fallback image if array is empty
  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-100 hover:border-gold-200/50 transition-all-300 flex flex-col h-full group cursor-pointer"
      onClick={() => navigate('details', property.id)}
      id={`property-card-${property.id}`}
    >
      
      {/* Property Image Cover */}
      <div className="relative aspect-video overflow-hidden bg-stone-100">
        <img 
          src={mainImage} 
          alt={titleText}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          id={`property-card-img-${property.id}`}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointers-none">
          <span className="bg-stone-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {typeText}
          </span>
          {property.isFeatured && (
            <span className="bg-gold-500 text-stone-950 text-[10px] font-bold px-3 py-1 rounded-full">
              {currentLanguage === 'ar' ? 'مميّز' : 'Featured'}
            </span>
          )}
        </div>
      </div>

      {/* Property Content Info */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          
          {/* Price Label */}
          <div className="text-xl font-extrabold text-gold-700 tracking-tight" id={`property-card-price-${property.id}`}>
            {formatPrice(property.price)}
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 line-clamp-1 group-hover:text-gold-600 transition-colors py-0.5 text-base" id={`property-card-title-${property.id}`}>
            {titleText}
          </h3>

          {/* Location City Info */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <MapPin className="h-3.5 w-3.5 text-gold-500 shrink-0" />
            <span>{cityText}</span>
          </div>

          {/* Description */}
          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed h-8">
            {descText}
          </p>
        </div>

        {/* Specs footer */}
        {property.type !== 'land' ? (
          <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-4 text-stone-600" id="property-card-specs">
            <div className="flex items-center gap-1.5 text-xs">
              <Bed className="h-4 w-4 text-stone-400" />
              <span>{property.bedrooms} <span className="text-stone-400 text-[10px]">{t.bedroomsCount}</span></span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs">
              <Bath className="h-4 w-4 text-stone-400" />
              <span>{property.bathrooms} <span className="text-stone-400 text-[10px]">{t.bathroomsLabel}</span></span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Expand className="h-4 w-4 text-stone-400" />
              <span>{property.area} <span className="text-stone-400 text-xs">م²</span></span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-4 text-stone-600" id="property-card-specs-land">
            <div className="flex items-center gap-1.5 text-xs">
              <Expand className="h-4 w-4 text-stone-400" />
              <span className="font-semibold text-stone-700">{property.area} م²</span>
            </div>
            <span className="text-[10px] bg-stone-100 text-stone-500 py-0.5 px-2.5 rounded-md font-bold uppercase tracking-wide">
              {currentLanguage === 'ar' ? 'طابو ملك صرف' : 'Freehold Plot'}
            </span>
          </div>
        )}

      </div>

    </div>
  );
};
