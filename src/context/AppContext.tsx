import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, WebsiteSettings, ContactMessage } from '../types';

// الرابط المعتمد للسيرفر الخاص بك
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
      const respProp = await fetch(`${BASE_URL}/api/properties`);
      const props = await respProp.json();
      setProperties(props);

      const respSettings = await fetch(`${BASE_URL}/api/settings`);
      const setts = await respSettings.json();
      setSettings(setts);
      
      const respMsgs = await fetch(`${BASE_URL}/api/messages`);
      if (respMsgs.ok) setMessages(await respMsgs.json());

      const respMedia = await fetch(`${BASE_URL}/api/media`);
      if (respMedia.ok) setMediaRepo(await respMedia.json());

      const respActs = await fetch(`${BASE_URL}/api/activities`);
      if (respActs.ok) setActivities(await respActs.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    if (sessionStorage.getItem('iraq_estate_admin_session') === 'active') setIsAdminAuthenticated(true);
  }, []);

  // إضافة منطق الـ Routing كما كان في ملفك الأصلي
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (hash.startsWith('#/details/')) {
        setCurrentRoute('details');
        setSelectedPropertyId(hash.replace('#/details/', ''));
      } else if (hash === '#/admin/dashboard') {
        setCurrentRoute('admin/dashboard');
      } else if (path === '/admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('hashchange', syncRouteFromLocation);
    syncRouteFromLocation();
    return () => window.removeEventListener('hashchange', syncRouteFromLocation);
  }, []);

  const showToast = (messageAr: string, messageEn: string, type: 'success' | 'err' = 'success') => {
    setToast({ messageAr, messageEn, type });
    setTimeout(() => setToast(null), 4500);
  };

  const navigate = (route: string, propertyId: string | null = null) => {
    window.location.hash = propertyId ? `#/details/${propertyId}` : `#/${route}`;
    setCurrentRoute(route);
    setSelectedPropertyId(propertyId);
  };

  const logActivity = async (type: SystemActivity['type'], textAr: string, textEn: string) => {
    try {
      const resp = await fetch(`${BASE_URL}/api/activities`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, textAr, textEn })
      });
      if (resp.ok) {
        const newData = await resp.json();
        setActivities(prev => [newData, ...prev].slice(0, 50));
      }
    } catch (err) { console.error(err); }
  };

  const login = (username: string, password: string): boolean => {
    if (username === 'lloydlloyd' && password === '00885522') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('iraq_estate_admin_session', 'active');
      logActivity('settings', "تسجيل دخول", "Login");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('iraq_estate_admin_session');
    navigate('home');
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<string> => {
    const resp = await fetch(`${BASE_URL}/api/properties`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(propertyData)
    });
    const saved = await resp.json();
    setProperties(prev => [saved, ...prev]);
    return saved.id;
  };

  const updateProperty = async (id: string, updatedFields: Partial<Property>): Promise<void> => {
    const resp = await fetch(`${BASE_URL}/api/properties/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedFields)
    });
    const updatedItem = await resp.json();
    setProperties(prev => prev.map(p => p.id === id ? updatedItem : p));
  };

  const deleteProperty = async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/api/properties/${id}`, { method: 'DELETE' });
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = async (updatedSettings: WebsiteSettings): Promise<void> => {
    const resp = await fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedSettings)
    });
    setSettings(await resp.json());
  };

  const addToMediaRepo = async (url: string): Promise<void> => {
    const resp = await fetch(`${BASE_URL}/api/media`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url })
    });
    setMediaRepo(await resp.json());
  };

  const removeFromMediaRepo = async (url: string): Promise<void> => {
    const resp = await fetch(`${BASE_URL}/api/media`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url })
    });
    setMediaRepo(await resp.json());
  };

  const submitMessage = async (msgData: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> => {
    await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msgData)
    });
  };

  const clearMessages = async (): Promise<void> => {
    await fetch(`${BASE_URL}/api/messages`, { method: 'DELETE' });
    setMessages([]);
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
    
