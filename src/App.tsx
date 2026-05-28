import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { currentRoute, currentLanguage, toast, isLoading, error, properties, refreshData } = useApp();
  const isRtl = currentLanguage === 'ar';

  if (isLoading && properties.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <h2 className="text-xl font-extrabold tracking-tight">
              {isRtl ? 'جاري تحميل بوابة عقارات العراق...' : 'Loading Iraqi Estate...'}
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              {isRtl ? 'يرجى الانتظار أثناء الاتصال بقاعدة البيانات السحابية' : 'Syncing with secure server database. Please wait...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900 px-6 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-md text-center space-y-5 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-black">!</div>
          <h2 className="text-xl font-extrabold tracking-tight font-sans">
            {isRtl ? 'خطأ في الاتصال بقاعدة البيانات السحابية' : 'Cloud Database Sync Offline'}
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed font-medium">
            {isRtl 
              ? 'فشل الاتصال بـ API السيرفر السحابي المركزي لاسترداد محتوى الموقع وعروض العقارات النشطة.' 
              : 'Unable to sync with central Express server database to fetch active real estate listings.'}
          </p>
          <button
            onClick={() => refreshData()}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-3.5 rounded-xl transition-all cursor-pointer text-sm"
          >
            {isRtl ? 'إعادة محاولة الاتصال' : 'Retry Server Link'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${
        isRtl ? 'rtl-grid text-right' : 'ltr-grid text-left'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
      id="iraqi-estate-app-theme-root"
    >
      
      {/* Global Success / Alert Toast Notification */}
      {toast && (
        <div 
          className="fixed bottom-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-stone-900 text-stone-100 shadow-2xl border border-stone-800 animate-slide-up"
          style={{ [isRtl ? 'left' : 'right']: '1.5rem' }}
          id="global-system-alert-toast"
        >
          <div className="h-2 w-2 rounded-full bg-gold-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            {currentLanguage === 'ar' ? toast.messageAr : toast.messageEn}
          </span>
        </div>
      )}

      {/* Render Public Header on user-facing paths */}
      {currentRoute !== 'admin/dashboard' && <Header />}

      {/* Main Pages Router switcher */}
      <main className="flex-grow transition-opacity duration-300">
        {currentRoute === 'home' && <HomePage />}
        {currentRoute === 'properties' && <PropertiesPage />}
        {currentRoute === 'details' && <PropertyDetailsPage />}
        {currentRoute === 'contact' && <ContactUsPage />}
        {currentRoute === 'admin' && <AdminLogin />}
        {currentRoute === 'admin/dashboard' && <AdminPanel />}
      </main>

      {/* Render Public Footer on user-facing paths */}
      {currentRoute !== 'admin/dashboard' && <Footer />}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
