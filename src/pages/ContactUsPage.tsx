import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../translations';
import { ContactForm } from '../components/ContactForm';
import { Phone, Mail, MapPin, Landmark, Clock, Calendar } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { currentLanguage, settings } = useApp();
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in" id="contact-us-page-profile">
      
      {/* Page Title Headers */}
      <div className="text-center space-y-2 max-w-2xl mx-auto border-b border-stone-100 pb-6">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-none">
          {t.navContact}
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed mt-1">
          {currentLanguage === 'ar' 
            ? "نحن هنا لمساعدتكم في العثور على أنسب العقارات وتقديم المعاينات والاستشارات مجاناً" 
            : "We are at your disposal to schedule physical site inspects or provide real estate consultations."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact info details info box */}
        <div className="lg:col-span-5 space-y-6" id="contact-info-cards">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-150 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              {currentLanguage === 'ar' ? 'معلومات الاتصال المباشر' : 'Agency Directories'}
            </h3>

            <div className="space-y-6 text-sm">
              
              {/* Telephone Card */}
              <div className="flex items-start gap-4">
                <div className="bg-gold-100 text-gold-700 p-3 rounded-2xl shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-stone-400 text-xs font-bold uppercase tracking-wide leading-none">{currentLanguage === 'ar' ? 'الاتصال الهاتفي' : 'Phone Call'}</span>
                  <a href={`tel:${settings.contactNumber}`} className="block text-stone-850 font-bold hover:text-gold-600 transition-colors font-mono" dir="ltr">
                    {settings.contactNumber}
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 text-emerald-700 p-3 rounded-2xl shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0">
                    <path d="M12.012 2c-5.506 0-9.97 4.463-9.97 9.97 0 1.76.459 3.413 1.261 4.86L2 22l5.352-1.402a9.92 9.92 0 004.66 1.173c5.507 0 9.97-4.464 9.97-9.97 0-5.507-4.463-9.97-9.97-9.97zM6.837 16.711l-.271-.433a8.169 8.169 0 01-1.252-4.308c0-4.512 3.67-8.182 8.182-8.182 4.512 0 8.181 3.67 8.181 8.182 0 4.512-3.669 8.181-8.181 8.181a8.13 8.13 0 01-4.148-1.129l-.297-.175-3.083.808.823-3.003-.016.012zm7.647-4.143c-.222-.111-1.314-.648-1.517-.722-.204-.074-.352-.111-.5.111-.148.222-.573.722-.703.871-.13.148-.259.167-.481.056-.222-.11-1.02-.455-1.942-1.277-.718-.641-1.203-1.433-1.344-1.683-.14-.25-.015-.385.11-.497.112-.102.247-.288.371-.432.124-.144.165-.246.247-.412.083-.165.042-.31-.02-.422-.062-.113-.5-.123-.687-.577-.181-.44-.39-.378-.535-.385-.138-.006-.297-.008-.456-.008s-.418.06-.637.297c-.218.238-.834.815-.834 1.987s.854 2.305.973 2.463c.12.158 1.68 2.564 4.07 3.593.57.245 1.012.391 1.36.502.571.182 1.09.156 1.5.094.457-.068 1.4-.572 1.59-.126.195-.446.195-.829.138-.94a1.76 1.76 0 00-.277-.148z"/>
                  </svg>
                </div>
                <div className="space-y-1">
                  <span className="block text-stone-400 text-xs font-bold uppercase tracking-wide leading-none">{currentLanguage === 'ar' ? 'المراسلة عبر واتساب' : 'WhatsApp Chat'}</span>
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="block text-stone-850 font-bold hover:text-emerald-600 transition-colors font-mono" dir="ltr">
                    +{settings.whatsappNumber}
                  </a>
                </div>
              </div>

              {/* Physical Address Card */}
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 text-stone-800 p-3 rounded-2xl shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-stone-400 text-xs font-bold uppercase tracking-wide leading-none">{currentLanguage === 'ar' ? 'العنوان والمكتب الرئيسي' : 'Registered Office'}</span>
                  <span className="block text-stone-800 font-semibold">
                    {currentLanguage === 'ar' ? 'منطقة المنصور، شارع الرواد، بغداد، العراق' : 'Al-Rowaad Street, Al-Mansour, Baghdad, Iraq'}
                  </span>
                </div>
              </div>

              {/* Timings row */}
              <div className="flex items-start gap-4 border-t border-stone-50 pt-5">
                <div className="bg-stone-100 text-stone-800 p-3 rounded-2xl shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-stone-400 text-xs font-bold uppercase tracking-wide leading-none">{currentLanguage === 'ar' ? 'أوقات الدوام الرسمي' : 'Operating Hours'}</span>
                  <span className="block text-stone-800 text-xs font-medium">
                    {currentLanguage === 'ar' ? 'السبت - الخميس: من 9:00 صباحاً وحتى 8:00 مساءً' : 'Saturday - Thursday: 9:00 AM - 8:00 PM'}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Contact Form column */}
        <div className="lg:col-span-7" id="contact-form-column">
          <ContactForm />
        </div>

      </div>

    </div>
  );
};
