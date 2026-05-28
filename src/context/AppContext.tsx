import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, WebsiteSettings, ContactMessage } from '../types';
import { INITIAL_PROPERTIES, INITIAL_SETTINGS } from '../demoData';

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
  currentRoute: string; // 'home' | 'properties' | 'details' | 'contact' | 'admin' | 'admin/dashboard'
  selectedPropertyId: string | null;
  adminTab: 'dashboard' | 'properties' | 'add-property' | 'media' | 'settings';
  editingPropertyId: string | null; // for CRUD edit modal/flow
  mediaRepo: string[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  
  // Navigation
  navigate: (route: string, propertyId?: string | null) => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  setAdminTab: (tab: 'dashboard' | 'properties' | 'add-property' | 'media' | 'settings') => void;
  setEditingPropertyId: (id: string | null) => void;
  
  // Auth
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Property CRUD
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<string>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  
  // Settings
  updateSettings: (settings: WebsiteSettings) => Promise<void>;
  
  // Media Manager
  addToMediaRepo: (url: string) => Promise<void>;
  removeFromMediaRepo: (url: string) => Promise<void>;
  
  // Messages
  submitMessage: (message: Omit<ContactMessage, 'id' | 'createdAt'>) => Promise<void>;
  clearMessages: () => Promise<void>;
  
  // Feedback Toasts
  toast: { messageAr: string; messageEn: string; type: 'success' | 'err' } | null;
  showToast: (msgAr: string, msgEn: string, type?: 'success' | 'err') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Core Reactive States
  const [properties, setProperties] = useState<Property[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({
    logoTextAr: "العقار العراقي",
    logoTextEn: "Iraqi Estate",
    contactNumber: "+964 770 123 4567",
    whatsappNumber: "+9647701234567",
    companyDescriptionAr: "",
    companyDescriptionEn: "",
    defaultLanguage: 'ar'
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
  
  // Global loading & error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1.2 Central Refresh Method from database (with intelligent client-side fallback for static compilation on Cloudflare Pages)
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Try properties
      let propsList: Property[] = [];
      try {
        const respProp = await fetch('/api/properties');
        if (respProp.ok) {
          propsList = await respProp.json();
          // Keep our local backup in sync
          localStorage.setItem('iraq_estate_static_properties', JSON.stringify(propsList));
        } else {
          throw new Error('Fallback to local container files');
        }
      } catch (e) {
        // Express server is offline (e.g. running on static Cloudflare Pages host). Load from localStorage or bundled backup
        console.warn("[Cloudflare Static Fallback] Using client-bound local storage for properties");
        const stored = localStorage.getItem('iraq_estate_static_properties');
        if (stored) {
          propsList = JSON.parse(stored);
        } else {
          propsList = INITIAL_PROPERTIES;
          localStorage.setItem('iraq_estate_static_properties', JSON.stringify(INITIAL_PROPERTIES));
        }
      }
      setProperties(propsList);

      // 2. Try settings
      let activeSettings = INITIAL_SETTINGS;
      try {
        const respSettings = await fetch('/api/settings');
        if (respSettings.ok) {
          activeSettings = await respSettings.json();
          localStorage.setItem('iraq_estate_static_settings', JSON.stringify(activeSettings));
        } else {
          throw new Error('Fallback to local settings file');
        }
      } catch (e) {
        console.warn("[Cloudflare Static Fallback] Using client-bound local storage for website branding info");
        const stored = localStorage.getItem('iraq_estate_static_settings');
        if (stored) {
          activeSettings = JSON.parse(stored);
        } else {
          activeSettings = INITIAL_SETTINGS;
          localStorage.setItem('iraq_estate_static_settings', JSON.stringify(INITIAL_SETTINGS));
        }
      }
      setSettings(activeSettings);
      setCurrentLanguage(activeSettings.defaultLanguage || 'ar');

      // 3. Try messages
      let msgsList: ContactMessage[] = [];
      try {
        const respMsgs = await fetch('/api/messages');
        if (respMsgs.ok) {
          msgsList = await respMsgs.json();
          localStorage.setItem('iraq_estate_static_messages', JSON.stringify(msgsList));
        }
      } catch (e) {
        const stored = localStorage.getItem('iraq_estate_static_messages');
        if (stored) msgsList = JSON.parse(stored);
      }
      setMessages(msgsList);

      // 4. Try media
      let mediaList: string[] = [];
      try {
        const respMedia = await fetch('/api/media');
        if (respMedia.ok) {
          mediaList = await respMedia.json();
          localStorage.setItem('iraq_estate_static_media', JSON.stringify(mediaList));
        }
      } catch (e) {
        const stored = localStorage.getItem('iraq_estate_static_media');
        if (stored) {
          mediaList = JSON.parse(stored);
        } else {
          mediaList = Array.from(new Set(propsList.flatMap(p => p.images)));
          localStorage.setItem('iraq_estate_static_media', JSON.stringify(mediaList));
        }
      }
      setMediaRepo(mediaList);

      // 5. Try activities
      try {
        const respActs = await fetch('/api/activities');
        if (respActs.ok) {
          const acts = await respActs.json();
          setActivities(acts);
        }
      } catch (e) {
        // Static background silently ignores server activities list
      }
    } catch (err: any) {
      console.error("[Database Connection Failure]", err);
      // Ensure we don't block access on Cloudflare
      setProperties(INITIAL_PROPERTIES);
      setSettings(INITIAL_SETTINGS);
      setCurrentLanguage(INITIAL_SETTINGS.defaultLanguage || 'ar');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Initial state hydration triggering fetch from server API
  useEffect(() => {
    refreshData();

    // Verify session persistence in memory
    const storedSession = sessionStorage.getItem('iraq_estate_admin_session');
    if (storedSession === 'active') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  // Sync route from URL path or Hash
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const propId = searchParams.get('id');
      const sessionActive = sessionStorage.getItem('iraq_estate_admin_session') === 'active';

      // 1. Try Hash router fallback first (most robust in iframe dev env)
      if (hash) {
        if (hash.startsWith('#/details/')) {
          const id = hash.replace('#/details/', '');
          setCurrentRoute('details');
          setSelectedPropertyId(id);
          return;
        } else if (hash === '#/properties') {
          setCurrentRoute('properties');
          setSelectedPropertyId(null);
          return;
        } else if (hash === '#/contact') {
          setCurrentRoute('contact');
          setSelectedPropertyId(null);
          return;
        } else if (hash === '#/admin') {
          setCurrentRoute('admin');
          setSelectedPropertyId(null);
          return;
        } else if (hash === '#/admin/dashboard') {
          if (sessionActive || isAdminAuthenticated) {
            setCurrentRoute('admin/dashboard');
          } else {
            setCurrentRoute('admin');
            window.location.hash = '#/admin';
          }
          setSelectedPropertyId(null);
          return;
        }
      }

      // 2. Try HTML5 Pathname
      if (path === '/admin') {
        setCurrentRoute('admin');
        setSelectedPropertyId(null);
      } else if (path === '/admin/dashboard') {
        if (sessionActive || isAdminAuthenticated) {
          setCurrentRoute('admin/dashboard');
        } else {
          setCurrentRoute('admin');
          window.history.replaceState({}, '', '/admin');
        }
        setSelectedPropertyId(null);
      } else if (path === '/properties') {
        setCurrentRoute('properties');
        setSelectedPropertyId(null);
      } else if (path === '/contact') {
        setCurrentRoute('contact');
        setSelectedPropertyId(null);
      } else if (path === '/details' && propId) {
        setCurrentRoute('details');
        setSelectedPropertyId(propId);
      } else {
        // default to home
        setCurrentRoute('home');
        setSelectedPropertyId(null);
      }
    };

    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    
    // Periodically inspect in case address bar changed
    const timer = setInterval(syncRouteFromLocation, 1000);

    // Run initially
    syncRouteFromLocation();

    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
      clearInterval(timer);
    };
  }, [isAdminAuthenticated]);

  // 3. Helper Functions
  const showToast = (messageAr: string, messageEn: string, type: 'success' | 'err' = 'success') => {
    setToast({ messageAr, messageEn, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const navigate = (route: string, propertyId: string | null = null) => {
    // Protection guard
    if ((route === 'admin/dashboard' || route.startsWith('admin/')) && !isAdminAuthenticated) {
      const sessionActive = sessionStorage.getItem('iraq_estate_admin_session') === 'active';
      if (!sessionActive) {
        window.history.pushState({}, '', '/admin');
        window.location.hash = '#/admin';
        setCurrentRoute('admin');
        return;
      }
    }
    
    let url = '/';
    if (route === 'admin') {
      url = '/admin';
    } else if (route === 'admin/dashboard') {
      url = '/admin/dashboard';
    } else if (route === 'properties') {
      url = '/properties';
    } else if (route === 'contact') {
      url = '/contact';
    } else if (route === 'details' && propertyId) {
      url = `/details?id=${propertyId}`;
    }

    // Set history and hash states
    window.history.pushState({}, '', url);
    if (route === 'details' && propertyId) {
      window.location.hash = `#/details/${propertyId}`;
    } else {
      window.location.hash = `#/${route}`;
    }

    setCurrentRoute(route);
    if (propertyId) {
      setSelectedPropertyId(propertyId);
    } else {
      setSelectedPropertyId(null);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: 'ar' | 'en') => {
    setCurrentLanguage(lang);
  };

  // 4. Activity logger helper to central server
  const logActivity = async (type: SystemActivity['type'], textAr: string, textEn: string) => {
    try {
      const resp = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, textAr, textEn })
      });
      if (resp.ok) {
        const created = await resp.json();
        setActivities(prev => {
          const updated = [created, ...prev];
          return updated.slice(0, 50);
        });
      }
    } catch (err) {
      console.error("[Logged Activity API Failure]", err);
    }
  };

  // 5. Auth Logic
  const login = (username: string, password: string): boolean => {
    if (username === 'lloydlloyd' && password === '00885522') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('iraq_estate_admin_session', 'active');
      logActivity('settings', "قام المسؤول بتسجيل الدخول بأمان لوحة التحكم", "Administrator authorized access safely to dashboard");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('iraq_estate_admin_session');
    logActivity('settings', "تم الخروج بأمان من الحساب الإداري", "Logged out safely from administrative dashboard session");
    navigate('home');
  };

  // 6. Property CRUDS connected to backend Express database (with client-side fallback)
  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<string> => {
    setIsLoading(true);
    const newId = 'prop-' + Date.now();
    const newProperty: Property = {
      ...propertyData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    try {
      const resp = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty)
      });
      if (!resp.ok) throw new Error('API server online but rejected listing creation');

      const saved = await resp.json();
      setProperties(prev => {
        const next = [saved, ...prev];
        localStorage.setItem('iraq_estate_static_properties', JSON.stringify(next));
        return next;
      });
      
      // Add images to media repository if they aren't already there
      for (const img of propertyData.images) {
        if (img.trim()) {
          await addToMediaRepo(img);
        }
      }

      await logActivity('add', `تم نشر عقار كود جديد: ${propertyData.titleAr}`, `Published listing coordinates: ${propertyData.titleEn}`);
      showToast("تمت إضافة ونشر العقار على السيرفر المركزي بنجاح", "Property listing published to central system successfully");
      return saved.id;
    } catch (err: any) {
      console.warn("[Cloudflare Static Fallback] Saving added property directly inside client device browser");
      // Local backup execution
      setProperties(prev => {
        const next = [newProperty, ...prev];
        localStorage.setItem('iraq_estate_static_properties', JSON.stringify(next));
        return next;
      });

      // Local media backup
      const currentMedia = JSON.parse(localStorage.getItem('iraq_estate_static_media') || '[]');
      const addedMedia = [...currentMedia];
      for (const img of propertyData.images) {
        if (img.trim() && !addedMedia.includes(img)) addedMedia.push(img);
      }
      localStorage.setItem('iraq_estate_static_media', JSON.stringify(addedMedia));
      setMediaRepo(addedMedia);

      showToast("تمت إضافة العقار بنجاح (محفوظ في المتصفح)", "Property listed successfully (saved locally in browser)");
      return newId;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProperty = async (id: string, updatedFields: Partial<Property>): Promise<void> => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!resp.ok) throw new Error('Failed to update property listing on server');

      const updatedItem = await resp.json();
      setProperties(prev => {
        const next = prev.map(p => p.id === id ? updatedItem : p);
        localStorage.setItem('iraq_estate_static_properties', JSON.stringify(next));
        return next;
      });

      // Handle media updates
      if (updatedFields.images) {
        for (const img of updatedFields.images) {
          if (img.trim()) {
            await addToMediaRepo(img);
          }
        }
      }

      const title = updatedItem.titleAr || `رقم ${id}`;
      await logActivity('edit', `تمت مراجعة وتحديث العقار: ${title}`, `Modified property coordinates: ${updatedItem.titleEn || id}`);
      showToast("تم تعديل ونشر تحديثات العقار بنجاح", "Property listing updated on central system successfully");
    } catch (err: any) {
      console.warn("[Cloudflare Static Fallback] Applying property updates locally in static hosting index");
      setProperties(prev => {
        const next = prev.map(p => {
          if (p.id === id) {
            return { ...p, ...updatedFields };
          }
          return p;
        });
        localStorage.setItem('iraq_estate_static_properties', JSON.stringify(next));
        return next;
      });

      if (updatedFields.images) {
        const currentMedia = JSON.parse(localStorage.getItem('iraq_estate_static_media') || '[]');
        const addedMedia = [...currentMedia];
        for (const img of updatedFields.images) {
          if (img.trim() && !addedMedia.includes(img)) addedMedia.push(img);
        }
        localStorage.setItem('iraq_estate_static_media', JSON.stringify(addedMedia));
        setMediaRepo(addedMedia);
      }

      showToast("تم تحديث العقار بنجاح (محفوظ في المتصفح)", "Property updated successfully (saved locally in browser)");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProperty = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/properties/${id}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error('Failed to purge property from database');

      const item = properties.find(p => p.id === id);
      setProperties(prev => {
        const next = prev.filter(p => p.id !== id);
        localStorage.setItem('iraq_estate_static_properties', JSON.stringify(next));
        return next;
      });

      const title = item ? item.titleAr : `رقم ${id}`;
      await logActivity('delete', `تم حذف العقار نهائياً: ${title}`, `Permanently purged listing from central index: ${item?.titleEn || id}`);
      showToast("تم حذف وإزالة العقار نهائياً من النظام", "Property listing permanently removed from central database");
      
      if (selectedPropertyId === id) {
        setSelectedPropertyId(null);
        if (currentRoute === 'details') {
          setCurrentRoute('properties');
        }
      }
    } catch (err: any) {
      console.warn("[Cloudflare Static Fallback] Purging property item locally in static mode");
      setProperties(prev => {
        const next = prev.filter(p => p.id !== id);
        localStorage.setItem('iraq_estate_static_properties', JSON.stringify(next));
        return next;
      });

      showToast("تم إزالة وحذف العقار بنجاح", "Successfully removed listing from display");

      if (selectedPropertyId === id) {
        setSelectedPropertyId(null);
        if (currentRoute === 'details') {
          setCurrentRoute('properties');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Settings
  const updateSettings = async (updatedSettings: WebsiteSettings): Promise<void> => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (!resp.ok) throw new Error('Failed to push settings to central cloud database');

      const saved = await resp.json();
      setSettings(saved);
      setCurrentLanguage(saved.defaultLanguage || 'ar');
      localStorage.setItem('iraq_estate_static_settings', JSON.stringify(saved));
      
      await logActivity('settings', "تم تعديل تفاصيل اتصال ومعلومات الشركة بنجاح", "Global agency settings saved and propagated immediately");
      showToast("تمت معالجة وحفظ إعدادات الهوية بنجاح", "Global agency settings saved and propagated immediately");
    } catch (err: any) {
      console.warn("[Cloudflare Static Fallback] Updating website settings locally in static mode");
      setSettings(updatedSettings);
      setCurrentLanguage(updatedSettings.defaultLanguage || 'ar');
      localStorage.setItem('iraq_estate_static_settings', JSON.stringify(updatedSettings));
      showToast("تم حفظ التعديلات بنجاح (محفوظ في المتصفح)", "Branding updated successfully (saved locally in browser)");
    } finally {
      setIsLoading(false);
    }
  };

  // 8. Media Manager central repo
  const addToMediaRepo = async (url: string): Promise<void> => {
    if (!url.trim() || mediaRepo.includes(url)) return;
    try {
      const resp = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (resp.ok) {
        const list = await resp.json();
        setMediaRepo(list);
        localStorage.setItem('iraq_estate_static_media', JSON.stringify(list));
      } else {
        throw new Error('Fallback media');
      }
    } catch (err) {
      setMediaRepo(prev => {
        const next = [...prev, url];
        localStorage.setItem('iraq_estate_static_media', JSON.stringify(next));
        return next;
      });
    }
  };

  const removeFromMediaRepo = async (url: string): Promise<void> => {
    try {
      const resp = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (resp.ok) {
        const list = await resp.json();
        setMediaRepo(list);
        localStorage.setItem('iraq_estate_static_media', JSON.stringify(list));
        showToast("تم إزالة رابط الصورة من المستودع بنجاح", "Successfully purged URL from media list");
      } else {
        throw new Error('Fallback media remove');
      }
    } catch (err) {
      setMediaRepo(prev => {
        const next = prev.filter(item => item !== url);
        localStorage.setItem('iraq_estate_static_media', JSON.stringify(next));
        return next;
      });
      showToast("تم إزالة رابط الصورة بنجاح", "Successfully removed URL");
    }
  };

  // 9. Contact Submission
  const submitMessage = async (msgData: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> => {
    setIsLoading(true);
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    try {
      const resp = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      if (!resp.ok) throw new Error('Failed to push communication message to backend');

      const savedMsg = await resp.json();
      setMessages(prev => {
        const next = [savedMsg, ...prev];
        localStorage.setItem('iraq_estate_static_messages', JSON.stringify(next));
        return next;
      });

      await logActivity('message', `استلام استفسار تواصل جديد من العميل: ${msgData.name}`, `Received target property physical inspection request from: ${msgData.name}`);
      showToast("تم إرسال استفسارك بنجاح وسيتواصل معك العميل المختص قريباً!", "Your communication has been processed safely! Representative will call back");
    } catch (err: any) {
      console.warn("[Cloudflare Static Fallback] Saving submitted customer request ticket locally");
      setMessages(prev => {
        const next = [newMsg, ...prev];
        localStorage.setItem('iraq_estate_static_messages', JSON.stringify(next));
        return next;
      });
      showToast("تم إرسال استفسارك بنجاح (سيتم الرد عليك قريباً)", "Message submitted successfully (saved locally in browser)");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/messages', {
        method: 'DELETE'
      });
      if (resp.ok) {
        setMessages([]);
        localStorage.setItem('iraq_estate_static_messages', JSON.stringify([]));
        showToast("تم تفريغ وحذف كافة الاستفسارات من الخادم السحابي", "Successfully cleared all messages from administrative indices");
      }
    } catch (err) {
      setMessages([]);
      localStorage.setItem('iraq_estate_static_messages', JSON.stringify([]));
      showToast("تم تفريغ كافة الاستفسارات بنجاح", "Successfully cleared all messages");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      properties,
      settings,
      messages,
      activities,
      currentLanguage,
      isAdminAuthenticated,
      currentRoute,
      selectedPropertyId,
      adminTab,
      editingPropertyId,
      mediaRepo,
      toast,
      isLoading,
      error,
      refreshData,
      
      navigate,
      setLanguage,
      setAdminTab,
      setEditingPropertyId,
      
      login,
      logout,
      
      addProperty,
      updateProperty,
      deleteProperty,
      
      updateSettings,
      
      addToMediaRepo,
      removeFromMediaRepo,
      
      submitMessage,
      clearMessages,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider context hierarchy.');
  }
  return context;
};
