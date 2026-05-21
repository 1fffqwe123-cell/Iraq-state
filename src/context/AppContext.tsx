import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, WebsiteSettings, ContactMessage } from '../types';

// هذا هو التعديل الأساسي: الرابط الذي ستتصل به جميع دوال الـ fetch
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
      const respProp = await fetch(`${BASE_URL}/api/properties`);
      if (!respProp.ok) throw new Error('Failed to retrieve properties');
      setProperties(await respProp.json());

      const respSettings = await fetch(`${BASE_URL}/api/settings`);
      if (!respSettings.ok) throw new Error('Failed to retrieve settings');
      const setts = await respSettings.json();
      setSettings(setts);
      setCurrentLanguage(setts.defaultLanguage || 'ar');

      const respMsgs = await fetch(`${BASE_URL}/api/messages`);
      if (respMsgs.ok) setMessages(await respMsgs.json());

      const respMedia = await fetch(`${BASE_URL}/api/media`);
      if (respMedia.ok) setMediaRepo(await respMedia.json());

      const respActs = await fetch(`${BASE_URL}/api/activities`);
      if (respActs.ok) setActivities(await respActs.json());
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

  useEffect(() => {
    const syncRouteFromLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const propId = searchParams.get('id');
      const sessionActive = sessionStorage.getItem('iraq_estate_admin_session') === 'active';

      if (hash) {
        if (hash.startsWith('#/details/')) {
          setCurrentRoute('details'); setSelectedPropertyId(hash.replace('#/details/', '')); return;
        } else if (hash === '#/properties') { setCurrentRoute('properties'); return; }
        else if (hash === '#/contact') { setCurrentRoute('contact'); return; }
        else if (hash === '#/admin') { setCurrentRoute('admin'); return; }
        else if (hash === '#/admin/dashboard') {
          if (sessionActive || isAdminAuthenticated) setCurrentRoute('admin/dashboard');
          else { setCurrentRoute('admin'); window.location.hash = '#/admin'; }
          return;
        }
      }
      if (path === '/admin') setCurrentRoute('admin');
      else if (path === '/admin/dashboard' && (sessionActive || isAdminAuthenticated)) setCurrentRoute('admin/dashboard');
      else if (path === '/properties') setCurrentRoute('properties');
      else if (path === '/contact') setCurrentRoute('contact');
      else if (path === '/details' && propId) { setCurrentRoute('details'); setSelectedPropertyId(propId); }
      else setCurrentRoute('home');
    };
    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    const timer = setInterval(syncRouteFromLocation, 1000);
    syncRouteFromLocation();
    return () => { window.removeEventListener('popstate', syncRouteFromLocation); window.removeEventListener('hashchange', syncRouteFromLocation); clearInterval(timer); };
  }, [isAdminAuthenticated]);

  const showToast = (messageAr: string, messageEn: string, type: 'success' | 'err' = 'success') => {
    setToast({ messageAr, messageEn, type });
    setTimeout(() => setToast(null), 4500);
  };

  const navigate = (route: string, propertyId: string | null = null) => {
    if ((route === 'admin/dashboard' || route.startsWith('admin/')) && !isAdminAuthenticated) {
      setCurrentRoute('admin'); return;
    }
    window.history.pushState({}, '', route === 'details' ? `/details?id=${propertyId}` : `/${route}`);
    window.location.hash = route === 'details' ? `#/details/${propertyId}` : `#/${route}`;
    setCurrentRoute(route);
    setSelectedPropertyId(propertyId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logActivity = async (type: SystemActivity['type'], textAr: string, textEn: string) => {
    try {
      const resp = await fetch(`${BASE_URL}/api/activities`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, textAr, textEn })
      });
      if (resp.ok) setActivities(prev => [await resp.json(), ...prev].slice(0, 50));
    } catch (err) { console.error(err); }
  };

  const login = (u: string, p: string) => {
    if (u === 'lloydlloyd' && p === '00885522') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('iraq_estate_admin_session', 'active');
      logActivity('settings', "تسجيل دخول", "Login");
      return true;
    }
    return false;
  };

  const logout = () => { setIsAdminAuthenticated(false); sessionStorage.removeItem('iraq_estate_admin_session'); navigate('home'); };

  const addProperty = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/properties`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      const saved = await res.json();
      setProperties(prev => [saved, ...prev]);
      showToast("تمت الإضافة", "Added", "success");
      return saved.id;
    } finally { setIsLoading(false); }
  };

  const updateProperty = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      const updated = await res.json();
      setProperties(prev => prev.map(p => p.id === id ? updated : p));
      showToast("تم التحديث", "Updated", "success");
    } finally { setIsLoading(false); }
  };

  const deleteProperty = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch(`${BASE_URL}/api/properties/${id}`, { method: 'DELETE' });
      setProperties(prev => prev.filter(p => p.id !== id));
      showToast("تم الحذف", "Deleted", "success");
    } finally { setIsLoading(false); }
  };

  const updateSettings = async (s: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/settings`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s)
      });
      setSettings(await res.json());
      showToast("تم حفظ الإعدادات", "Settings saved", "success");
    } finally { setIsLoading(false); }
  };

  const addToMediaRepo = async (url: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/media`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url })
      });
      setMediaRepo(await res.json());
    } catch (err) { console.error(err); }
  };

  const removeFromMediaRepo = async (url: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/media`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url })
      });
      setMediaRepo(await res.json());
    } catch (err) { console.error(err); }
  };

  const submitMessage = async (msg: any) => {
    setIsLoading(true);
    try {
      await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg)
      });
      showToast("تم الإرسال", "Sent", "success");
    } finally { setIsLoading(false); }
  };

  const clearMessages = async () => {
    setIsLoading(true);
    try {
      await fetch(`${BASE_URL}/api/messages`, { method: 'DELETE' });
      setMessages([]);
    } finally { setIsLoading(false); }
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
            
