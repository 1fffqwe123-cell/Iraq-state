import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

// --- هذه الدالة هي الجسر للذكاء الاصطناعي ---
export async function askAI(myQuestion: string) {
  try {
    const response = await fetch("https://gateway.ai.cloudflare.com/v1/aa5e5dce2c68ac5c4f0dddd9326a170a/default/compat/chat/completions", {
      method: "POST",
      headers: {
        "cf-aig-authorization": `Bearer ${import.meta.env.VITE_CF_AIG_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "workers-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        messages: [{ role: "user", content: myQuestion }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("خطأ في الاتصال بالذكاء الاصطناعي:", error);
    return "عذراً، لا يمكنني المساعدة الآن.";
  }
}

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
            {isRtl ? 'خطأ في الاتصال بقاعدة البيانات' : 'Database Sync Offline'}
          </h2>
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
      className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${isRtl ? 'rtl-grid text-right' : 'ltr-grid text-left'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
      id="iraqi-estate-app-theme-root"
    >
      {toast && (
        <div 
          className="fixed bottom-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-stone-900 text-stone-100 shadow-2xl border border-stone-800 animate-slide-up"
          style={{ [isRtl ? 'left' : 'right']: '1.5rem' }}
        >
          <div className="h-2 w-2 rounded-full bg-gold-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            {isRtl ? toast.messageAr : toast.messageEn}
          </span>
        </div>
      )}

      {currentRoute !== 'admin/dashboard' && <Header />}

      <main className="flex-grow transition-opacity duration-300">
        {currentRoute === 'home' && <HomePage />}
        {currentRoute === 'properties' && <PropertiesPage />}
        {currentRoute === 'details' && <PropertyDetailsPage />}
        {currentRoute === 'contact' && <ContactUsPage />}
        {currentRoute === 'admin' && <AdminLogin />}
        {currentRoute === 'admin/dashboard' && <AdminPanel />}
      </main>

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
