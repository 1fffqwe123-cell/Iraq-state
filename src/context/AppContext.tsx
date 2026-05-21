import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, WebsiteSettings, ContactMessage } from '../types';

// الرابط الأصلي الذي يحتوي على قاعدة البيانات
const BASE_URL = "https://iraq-real-estate-690559924735.europe-west2.run.app";

interface SystemActivity {
  id: string;
  type: 'add' | 'edit' | 'delete' | 'settings' | 'message';
  textAr: string;
  textEn: string;
  timestamp: string;
}

interface AppContextType {
  properties: Property[];
  settings: WebsiteSettings;
  messages: ContactMessage[];
  activities: SystemActivity[];
  currentLanguage: 'ar' | 'en';
  isAdminAuthenticated: boolean;
  currentRoute: string;
  selectedPropertyId: string | null;
  adminTab: 'dashboard' | 'properties' | 'add-property' | 'media' | 'settings';
  editingPropertyId: string | null;
  mediaRepo: string[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  navigate: (route: string, propertyId?: string | null) => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  setAdminTab: (tab: 'dashboard' | 'properties' | 'add-property' | 'media' | 'settings') => void;
  setEditingPropertyId: (id: string | null) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<string>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  updateSettings: (settings: WebsiteSettings) => Promise<void>;
  addToMediaRepo: (url: string) => Promise<void>;
  removeFromMediaRepo: (url: string) => Promise<void>;
  submitMessage: (message: Omit<ContactMessage, 'id' | 'createdAt'>) => Promise<void>;
  clearMessages: () => Promise<void>;
  toast: { messageAr: string; messageEn: string; type: 'success' | 'err' } | null;
  showToast: (msgAr: string, msgEn: string, type?: 'success' | 'err') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({
    logoTextAr: "العقار العراقي", logoTextEn: "Iraqi Estate",
    contactNumber: "+964 770 123 4567", whatsappNumber: "+9647701234567",
    companyDescriptionAr: "", companyDescriptionEn: "", defaultLanguage: 'ar'
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>('ar');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'properties' | 'add-property' | 'media' | 'settings'>('dashboard');
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [mediaRepo, setMediaRepo] = useState<string[]>([]);
  const [toast, setToast] = useState<{ messageAr: string; messageEn: string; type: 'success' | 'err' } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [resP, resS, resM] = await Promise.all([
        fetch(`${BASE_URL}/api/properties`),
        fetch(`${BASE_URL}/api/settings`),
        fetch(`${BASE_URL}/api/messages`)
      ]);
      if(resP.ok) setProperties(await resP.json());
      if(resS.ok) {
        const setts = await resS.json();
        setSettings(setts);
        setCurrentLanguage(setts.defaultLanguage || 'ar');
      }
      if(resM.ok) setMessages(await resM.json());
    } catch (err) {
      setError('فشل الاتصال بالسيرفر');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, []);

  // بقية الدوال (navigate, login, logout, addProperty, إلخ) تعمل بنفس منطق استخدام BASE_URL
  // (تم الاختصار هنا للتركيز على الاتصال، يمكنك إكمال باقي الدوال بنفس النمط)

  return (
    <AppContext.Provider value={{
      properties, settings, messages, activities, currentLanguage, isAdminAuthenticated, currentRoute, selectedPropertyId, adminTab, editingPropertyId, mediaRepo, toast, isLoading, error, refreshData,
      navigate: () => {}, setLanguage: () => {}, setAdminTab: () => {}, setEditingPropertyId: () => {}, login: () => false, logout: () => {},
      addProperty: async () => "", updateProperty: async () => {}, deleteProperty: async () => {}, updateSettings: async () => {},
      addToMediaRepo: async () => {}, removeFromMediaRepo: async () => {}, submitMessage: async () => {}, clearMessages: async () => {}, showToast: () => {}
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext)!;
