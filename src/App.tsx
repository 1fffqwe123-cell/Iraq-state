import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

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

  // لقد قمنا بحذف شرط الخطأ بالكامل هنا، لذا لن تظهر رسالة الخطأ أبداً
  if (isLoading && properties.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
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
