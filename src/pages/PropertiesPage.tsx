import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../translations';
import { CITY_TRANSLATIONS, TYPE_TRANSLATIONS } from '../demoData';
import { PropertyCard } from '../components/PropertyCard';
import { Search, SlidersHorizontal, ArrowUpDown, X, ListFilter } from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const { currentLanguage, properties } = useApp();
  const t = TRANSLATIONS[currentLanguage];

  // Search and Filter State variables
  const [keyword, setKeyword] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterBedrooms, setFilterBedrooms] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Hydrate search presets if coming from Home Hero click
  useEffect(() => {
    const presetRaw = sessionStorage.getItem('iraq_estate_search_preset');
    if (presetRaw) {
      try {
        const parsed = JSON.parse(presetRaw);
        if (parsed.city) setFilterCity(parsed.city);
        if (parsed.type) setFilterType(parsed.type);
        if (parsed.maxPrice) setFilterMaxPrice(parsed.maxPrice.toString());
        
        // Clean preset
        sessionStorage.removeItem('iraq_estate_search_preset');
      } catch (err) {}
    }
  }, []);

  const clearAllFilters = () => {
    setKeyword('');
    setFilterCity('');
    setFilterType('');
    setFilterMaxPrice('');
    setFilterBedrooms('');
    setSortBy('newest');
  };

  // Perform client-side filter evaluations over listings
  const filteredList = properties.filter((prop) => {
    // Keyword Text search match
    if (keyword.trim()) {
      const targetQuery = keyword.toLowerCase();
      const matchTitleAr = prop.titleAr.toLowerCase().includes(targetQuery);
      const matchTitleEn = prop.titleEn.toLowerCase().includes(targetQuery);
      const matchDescAr = prop.descriptionAr.toLowerCase().includes(targetQuery);
      const matchDescEn = prop.descriptionEn.toLowerCase().includes(targetQuery);
      
      if (!matchTitleAr && !matchTitleEn && !matchDescAr && !matchDescEn) {
        return false;
      }
    }

    // City constraint
    if (filterCity && prop.city !== filterCity) return false;

    // Property Type constraint
    if (filterType && prop.type !== filterType) return false;

    // Price upper budget boundary
    if (filterMaxPrice) {
      const limit = Number(filterMaxPrice);
      if (limit > 0 && prop.price > limit) return false;
    }

    // Bedrooms constraint (skip land)
    if (filterBedrooms && prop.type !== 'land') {
      if (filterBedrooms === '4+') {
        if (prop.bedrooms < 4) return false;
      } else {
        if (prop.bedrooms !== Number(filterBedrooms)) return false;
      }
    }

    return true;
  });

  // Apply sorting models
  const sortedProperties = [...filteredList].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in" id="properties-explorer-page">
      
      {/* Title Header */}
      <div className="space-y-1.5 border-b border-stone-200 pb-5">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-none">
          {t.navProperties}
        </h1>
        <p className="text-stone-500 text-sm">
          {currentLanguage === 'ar' 
            ? "استكشف قائمة العقارات والفلل الموثوقة المتاحة للبيع والشراء في العراق" 
            : "Search the verified directory of luxury developments, homes, and investment plots."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* FILTERS PANEL COLUMN */}
        <div className="lg:col-span-4 space-y-6" id="properties-filter-column">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-150 shadow-sm space-y-6 sticky top-24">
            
            {/* Filter headers */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gold-600" />
                <span>{t.filterTitle}</span>
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-stone-400 hover:text-red-500 hover:bg-red-50 py-1 px-2.5 rounded-lg border border-transparent hover:border-red-200/50 transition-all flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                <span>{currentLanguage === 'ar' ? 'إعادة تعيين' : 'Clear Filters'}</span>
              </button>
            </div>

            {/* Inputs lists */}
            <div className="space-y-5">
              
              {/* Keyword Search Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 select-none">
                  <Search className="h-3.5 w-3.5 text-stone-400" />
                  <span>{currentLanguage === 'ar' ? 'البحث عن كلمة مفتاحية' : 'Search by Keyword'}</span>
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={currentLanguage === 'ar' ? 'ابحث عن الكرادة، المنصور، فيلا...' : 'e.g. villa, Karrada, penthouse...'}
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                />
              </div>

              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block select-none">
                  {t.cityLabel}
                </label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                >
                  <option value="">{t.allCities}</option>
                  {Object.entries(CITY_TRANSLATIONS).map(([key, obj]) => (
                    <option key={key} value={key}>
                      {currentLanguage === 'ar' ? obj.ar : obj.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block select-none">
                  {t.typeLabel}
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                >
                  <option value="">{t.allTypes}</option>
                  {Object.entries(TYPE_TRANSLATIONS).map(([key, obj]) => (
                    <option key={key} value={key}>
                      {currentLanguage === 'ar' ? obj.ar : obj.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms (skip if land) */}
              {filterType !== 'land' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block select-none">
                    {t.bedroomsCount}
                  </label>
                  <select
                    value={filterBedrooms}
                    onChange={(e) => setFilterBedrooms(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                  >
                    <option value="">{currentLanguage === 'ar' ? 'أي عدد غرف' : 'Any Bedrooms'}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
              )}

              {/* Max Budget Limit */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block select-none">
                  {t.maxPrice}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                    placeholder="e.g. 500000000"
                    className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 font-bold">IQD</span>
                </div>
              </div>

              {/* Sort selector */}
              <div className="space-y-1.5 pt-1 border-t border-stone-100">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 select-none">
                  <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
                  <span>{t.sortBy}</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                >
                  <option value="newest">{t.sortNewest}</option>
                  <option value="oldest">{t.sortOldest}</option>
                  <option value="price-asc">{t.sortPriceAsc}</option>
                  <option value="price-desc">{t.sortPriceDesc}</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        {/* RESULTS GRID COLUMN */}
        <div className="lg:col-span-8 space-y-6" id="properties-results-column">
          
          {/* Header metadata stats */}
          <div className="flex justify-between items-center text-xs text-stone-500 font-semibold" id="explorer-results-count-panel">
            <span>
              {t.resultsCount} <span className="text-gold-700 font-extrabold text-sm">{sortedProperties.length}</span> {t.propertyUnit}
            </span>
            <span>
              {sortBy === 'newest' && t.sortNewest}
              {sortBy === 'oldest' && t.sortOldest}
              {sortBy === 'price-asc' && t.sortPriceAsc}
              {sortBy === 'price-desc' && t.sortPriceDesc}
            </span>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="properties-results-grid">
            {sortedProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>

          {/* Fallback empty view */}
          {sortedProperties.length === 0 && (
            <div className="bg-white rounded-3xl p-16 text-center border border-stone-150 shadow-sm flex flex-col items-center justify-center space-y-4" id="properties-empty-fallback">
              <div className="bg-stone-50 text-stone-400 p-5 rounded-full inline-block">
                <ListFilter className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">
                {currentLanguage === 'ar' ? 'لم نطابق أي نتائج عقارية' : 'No Listings Found'}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm max-w-sm">
                {t.noPropertiesFound}
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
              >
                {currentLanguage === 'ar' ? 'عرض كافة العقارات' : 'Show All Properties'}
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
