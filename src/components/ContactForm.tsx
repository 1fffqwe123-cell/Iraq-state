import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../translations';
import { Mail, PhoneCall, MessageSquare, User, Smartphone, Send } from 'lucide-react';

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ propertyId, propertyTitle }) => {
  const { currentLanguage, settings, submitMessage } = useApp();
  const t = TRANSLATIONS[currentLanguage];

  // Form Fields State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    propertyTitle 
      ? (currentLanguage === 'ar' 
          ? `مرحباً، أود الاستفسار عن العقار المعروض: "${propertyTitle}"` 
          : `Hello, I'd like to inquire about the listed property: "${propertyTitle}"`)
      : ''
  );

  const [formSuccess, setFormSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError(t.nameRequired);
      return;
    }
    if (!phone.trim()) {
      setValidationError(t.phoneRequired);
      return;
    }

    submitMessage({
      name,
      phone,
      message,
      propertyId,
      propertyName: propertyTitle
    });

    setFormSuccess(true);
    setName('');
    setPhone('');
    setMessage('');

    setTimeout(() => {
      setFormSuccess(false);
    }, 6000);
  };

  // Build WhatsApp inquiry URL
  const prepareWhatsAppLink = () => {
    let text = message;
    if (!text.trim()) {
      text = propertyTitle
        ? `Inquiry about: ${propertyTitle}`
        : `Hello, I am interested in Iraqi properties listing.`;
    }
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${settings.whatsappNumber}?text=${encodedText}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-100" id="contact-component-form">
      <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-gold-600" />
        <span>{t.contactTitle}</span>
      </h3>
      <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-6">
        {t.contactSubtitle}
      </p>

      {/* Local Success Notifications */}
      {formSuccess && (
        <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200/50 mb-6 text-sm flex items-center gap-2 animate-fade-in" id="contact-form-success">
          <span className="text-lg">✓</span>
          <span className="font-medium">{t.messageSuccess}</span>
        </div>
      )}

      {/* Validation Errors */}
      {validationError && (
        <div className="bg-red-50 text-red-800 p-3.5 rounded-xl border border-red-200/50 mb-6 text-xs font-semibold animate-fade-in" id="contact-form-error">
          <span>⚠ {validationError}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmission} className="space-y-4">
        
        {/* Full Name field */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wide">
            <User className="h-4 w-4 text-stone-400" />
            <span>{t.formName} *</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={currentLanguage === 'ar' ? 'أبو سيف المحترم' : 'e.g. Abu Saif'}
            className="w-full bg-stone-50 hover:bg-stone-100 placeholder-stone-400 border border-stone-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
            id="form-input-fullname"
          />
        </div>

        {/* Telephone Number field */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wide">
            <Smartphone className="h-4 w-4 text-stone-400" />
            <span>{t.formPhone} *</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0770 123 4567"
            className="w-full bg-stone-50 hover:bg-stone-100 placeholder-stone-400 border border-stone-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
            dir="ltr"
            id="form-input-phone"
          />
        </div>

        {/* Message Content Area */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wide">
            <MessageSquare className="h-4 w-4 text-stone-400" />
            <span>{t.formMessage}</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={currentLanguage === 'ar' ? 'أود الاستفسار عن طريقة الدفع والحدود...' : 'Inquire here...'}
            className="w-full bg-stone-50 hover:bg-stone-100 placeholder-stone-400 border border-stone-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all resize-none"
            id="form-input-message"
          />
        </div>

        {/* Control actions buttons */}
        <div className="flex flex-col gap-3.5 pt-2">
          
          <button
            type="submit"
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
            id="contact-form-submit-btn"
          >
            <Send className="h-4 w-4 text-gold-400" />
            <span>{t.sendMessage}</span>
          </button>

          <a
            href={prepareWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all duration-150"
            id="contact-form-whatsapp-btn"
          >
            {/* Simple neat SVG or label */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0">
              <path d="M12.012 2c-5.506 0-9.97 4.463-9.97 9.97 0 1.76.459 3.413 1.261 4.86L2 22l5.352-1.402a9.92 9.92 0 004.66 1.173c5.507 0 9.97-4.464 9.97-9.97 0-5.507-4.463-9.97-9.97-9.97zM6.837 16.711l-.271-.433a8.169 8.169 0 01-1.252-4.308c0-4.512 3.67-8.182 8.182-8.182 4.512 0 8.181 3.67 8.181 8.182 0 4.512-3.669 8.181-8.181 8.181a8.13 8.13 0 01-4.148-1.129l-.297-.175-3.083.808.823-3.003-.016.012zm7.647-4.143c-.222-.111-1.314-.648-1.517-.722-.204-.074-.352-.111-.5.111-.148.222-.573.722-.703.871-.13.148-.259.167-.481.056-.222-.11-1.02-.455-1.942-1.277-.718-.641-1.203-1.433-1.344-1.683-.14-.25-.015-.385.11-.497.112-.102.247-.288.371-.432.124-.144.165-.246.247-.412.083-.165.042-.31-.02-.422-.062-.113-.5-.123-.687-.577-.181-.44-.39-.378-.535-.385-.138-.006-.297-.008-.456-.008s-.418.06-.637.297c-.218.238-.834.815-.834 1.987s.854 2.305.973 2.463c.12.158 1.68 2.564 4.07 3.593.57.245 1.012.391 1.36.502.571.182 1.09.156 1.5.094.457-.068 1.4-.572 1.59-.126.195-.446.195-.829.138-.94a1.76 1.76 0 00-.277-.148z"/>
            </svg>
            <span>{t.openWhatsApp}</span>
          </a>

        </div>

      </form>
    </div>
  );
};
