import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

// دالة الذكاء الاصطناعي - جاهزة للاستخدام
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
    return data.choices?.[0]?.message?.content || "لا يوجد رد";
  } catch (error) {
    return "خطأ في الاتصال بالذكاء الاصطناعي";
  }
}

function AppContent() {
  const { currentRoute, currentLanguage, toast, isLoading, properties } = useApp();
  const isRtl = currentLanguage === 'ar';

  // حذفنا شرط الـ error لكي لا يغلق الموقع في وجهك
  if (isLoading && properties.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans ${isRtl ? 'rtl-grid text-right' : 'ltr-grid text-left'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {toast && (
        <div className="fixed bottom-6 z-50 px-5 py-3.5 rounded-2xl bg-stone-900 text-stone-100">
          {currentLanguage === 'ar' ? toast.messageAr : toast.messageEn}
        </div>
      )}

      {currentRoute !== 'admin/dashboard' && <Header />}

      <main className="flex-grow">
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
