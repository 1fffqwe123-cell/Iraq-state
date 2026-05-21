import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, WebsiteSettings, ContactMessage } from '../types';

// الرابط الأصلي الذي يحتوي على قاعدة البيانات الخاصة بك
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
    setError(null);
    try {
      const [resP, resS, resM, resMe, resA] = await Promise.all([
        fetch(`${BASE_URL}/api/properties`),
        fetch(`${BASE_URL}/api/settings`),
        fetch(`${BASE_URL}/api/messages`),
        fetch(`${BASE_URL}/api/media`),
        fetch(`${BASE_URL}/api/activities`)
      ]);
      if (resP.ok) setProperties(await resP.json());
      if (resS.ok) {
        const setts = await resS.json();
        setSettings(setts);
        setCurrentLanguage(setts.defaultLanguage || 'ar');
      }
      if (resM.ok) setMessages(await resM.json());
      if (resMe.ok) setMediaRepo(await resMe.json());
      if (resA.ok) setActivities(await resA.json());
    } catch (err: any) {
      setError(err.message);
      showToast("خطأ في الاتصال بالسيرفر", "Connection error", "err");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    if (sessionStorage.getItem('iraq_estate_admin_session') === 'active') setIsAdminAuthenticated(true);
  }, []);

  const showToast = (messageAr: string, messageEn: string, type: 'success' | 'err' = 'success') => {
    setToast({ messageAr, messageEn, type });
    setTimeout(() => setToast(null), 4500);
  };

  const login = (u: string, p: string) => {
    if (u === 'lloydlloyd' && p === '00885522') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('iraq_estate_admin_session', 'active');
      return true;
    }
    return false;
  };

  const logout = () => { setIsAdminAuthenticated(false); sessionStorage.removeItem('iraq_estate_admin_session'); navigate('home'); };

  const addProperty = async (data: any) => {
    const res = await fetch(`${BASE_URL}/api/properties`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    const saved = await res.json();
    setProperties(prev => [saved, ...prev]);
    return saved.id;
  };

  const updateProperty = async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    const updated = await res.json();
    setProperties(prev => prev.map(p => p.id === id ? updated : p));
  };

  const deleteProperty = async (id: string) => {
    await fetch(`${BASE_URL}/api/properties/${id}`, { method: 'DELETE' });
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = async (s: any) => {
    const res = await fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s)
    });
    setSettings(await res.json());
  };

  const addToMediaRepo = async (url: string) => {
    const res = await fetch(`${BASE_URL}/api/media`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url })
    });
    setMediaRepo(await res.json());
  };

  const removeFromMediaRepo = async (url: string) => {
    const res = await fetch(`${BASE_URL}/api/media`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url })
    });
    setMediaRepo(await res.json());
  };

  const submitMessage = async (msg: any) => {
    await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg)
    });
  };

  const clearMessages = async () => {
    await fetch(`${BASE_URL}/api/messages`, { method: 'DELETE' });
    setMessages([]);
  };

  const navigate = (route: string, propertyId?: string | null) => {
    setCurrentRoute(route);
    if (propertyId) setSelectedPropertyId(propertyId);
    window.location.hash = `#/${route}`;
  };

  return (
    <AppContext.Provider value={{
      properties, settings, messages, activities, currentLanguage, isAdminAuthenticated, currentRoute, selectedPropertyId, adminTab, editingPropertyId, mediaRepo, toast, isLoading, error, refreshData,
      navigate, setLanguage: setCurrentLanguage, setAdminTab, setEditingPropertyId, login, logout, addProperty, updateProperty, deleteProperty, updateSettings, addToMediaRepo, removeFromMediaRepo, submitMessage, clearMessages, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext)!;
    
