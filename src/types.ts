export type PropertyType = 'apartment' | 'house' | 'villa' | 'land';

export type IraqiCity = 'Baghdad' | 'Basra' | 'Erbil' | 'Mosul' | 'Karbala';

export interface Property {
  id: string;
  titleAr: string;
  titleEn: string;
  price: number; // in Iraqi Dinar (IQD)
  city: IraqiCity;
  type: PropertyType;
  descriptionAr: string;
  descriptionEn: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters (م²)
  images: string[];
  isFeatured: boolean;
  createdAt: string; // ISO string
}

export interface WebsiteSettings {
  logoTextAr: string;
  logoTextEn: string;
  contactNumber: string;
  whatsappNumber: string;
  companyDescriptionAr: string;
  companyDescriptionEn: string;
  defaultLanguage: 'ar' | 'en';
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyName?: string;
  createdAt: string;
}
