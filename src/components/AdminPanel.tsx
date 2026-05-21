import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useApp } from '../context/AppContext';
import { Property, IraqiCity, PropertyType } from '../types';
import { TRANSLATIONS } from '../translations';
import { CITY_TRANSLATIONS, TYPE_TRANSLATIONS } from '../demoData';
import { 
  BarChart3, 
  Home, 
  PlusCircle, 
  Image, 
  Settings as SettingsIcon, 
  LogOut, 
  Trash2, 
  Edit3, 
  Inbox, 
  Eye, 
  Grid,
  CheckCircle, 
  AlertTriangle,
  FileText,
  Clock,
  LayoutDashboard,
  Calendar,
  Layers,
  Upload,
  Search,
  X,
  Sparkles,
  Plus,
  Check,
  FileUp
} from 'lucide-react';

const splitImagesText = (text: string): string[] => {
  if (!text) return [];
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  const result: string[] = [];
  
  for (const line of lines) {
    if (line.startsWith('data:image')) {
      result.push(line);
    } else {
      const parts = line.split(',').map(p => p.trim()).filter(p => p.length > 0);
      result.push(...parts);
    }
  }
  return result;
};

const compressImage = (file: File, maxWidth = 1200, maxHeight = 900, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string || '');
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn("Canvas compression failed, falling back:", err);
          resolve(e.target?.result as string || '');
        }
      };
      img.onerror = () => {
        resolve(e.target?.result as string || '');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      resolve('');
    };
    reader.readAsDataURL(file);
  });
};

const CURATED_UNSPLASH = {
  exteriors: [
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', ar: 'فيلا مودرن بمسبح', en: 'Modern Villa with Pool' },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', ar: 'قصر ملكي فاخر', en: 'Luxury Mansion' },
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', ar: 'بناء معاصر خارق', en: 'Contemporary Estate' },
    { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', ar: 'منزل عائلي راقي', en: 'Family Estate' },
    { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', ar: 'منتجع سكني فخم', en: 'Elite Sanctuary' },
    { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', ar: 'فيلا فخمة هادئة', en: 'Scenic Oasis' }
  ],
  living: [
    { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', ar: 'صالة معيشة مودرن', en: 'Modern Living Space' },
    { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', ar: 'صالة ضيوف مريحة', en: 'Premium Guest Lounge' },
    { url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80', ar: 'صالون كلاسيكي راقي', en: 'Elite Salon' },
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', ar: 'صالة عائلية مفتوحة', en: 'Bespoke Family Lounge' }
  ],
  kitchens: [
    { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', ar: 'مطبخ مجهز مريح', en: 'Bespoke Kitchen Island' },
    { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', ar: 'مطبخ ألماني ديلوكس', en: 'Deluxe German Kitchen' },
    { url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', ar: 'مطبخ كلاسيكي مشرق', en: 'Bright Marble Kitchen' }
  ],
  bedrooms: [
    { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', ar: 'غرفة نوم رئيسية كبيرة', en: 'Master Bedroom suite' },
    { url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', ar: 'غرفة نوم عائلية مشمسة', en: 'Warm Bed Design' },
    { url: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80', ar: 'غرفة نوم هادئة وبسيطة', en: 'Cozy Minimal Bedroom' }
  ],
  bathrooms: [
    { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', ar: 'حمام إسباني فاخر', en: 'Luxury Ceramic Bath' },
    { url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80', ar: 'مغاسل رخام عصرية', en: 'Modern Marble Vanity' }
  ],
  lands: [
    { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', ar: 'أرض زراعية خصبة', en: 'Strategic Arable Land' },
    { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', ar: 'قطعة أرض سكنية مفرزة', en: 'Flat Residential Plot' },
    { url: 'https://images.unsplash.com/photo-1444653389962-8149286c578a?auto=format&fit=crop&w=800&q=80', ar: 'أرض فضاء تجارية', en: 'Strategic Commercial Site' }
  ]
};

export const AdminPanel: React.FC = () => {
  const { 
    properties, 
    settings, 
    messages, 
    activities, 
    currentLanguage, 
    adminTab,
    editingPropertyId,
    mediaRepo,
    setAdminTab,
    setEditingPropertyId,
    logout,
    addProperty,
    updateProperty,
    deleteProperty,
    updateSettings,
    addToMediaRepo,
    removeFromMediaRepo,
    clearMessages,
    showToast
  } = useApp();

  const t = TRANSLATIONS[currentLanguage];
  const isRtl = currentLanguage === 'ar';

  // State for property creation/edit form
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCity, setFormCity] = useState<IraqiCity>('Baghdad');
  const [formType, setFormType] = useState<PropertyType>('apartment');
  const [formDescAr, setFormDescAr] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formBedrooms, setFormBedrooms] = useState('2');
  const [formBathrooms, setFormBathrooms] = useState('2');
  const [formArea, setFormArea] = useState('150');
  const [formImagesText, setFormImagesText] = useState('');
  const [imageTab, setImageTab] = useState<'device' | 'unsplash' | 'manual'>('device');
  const [unsplashCategory, setUnsplashCategory] = useState<'exteriors' | 'living' | 'kitchens' | 'bedrooms' | 'bathrooms' | 'lands'>('exteriors');
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSavingProperty, setIsSavingProperty] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // States for deleting verification modal
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // States for media inputs
  const [newMediaUrl, setNewMediaUrl] = useState('');

  // States for company settings form
  const [setLogoArText, setSetLogoArText] = useState(settings.logoTextAr);
  const [setLogoEnText, setSetLogoEnText] = useState(settings.logoTextEn);
  const [setPhoneVal, setSetPhoneVal] = useState(settings.contactNumber);
  const [setWhatsAppVal, setSetWhatsAppVal] = useState(settings.whatsappNumber);
  const [setDescArText, setSetDescArText] = useState(settings.companyDescriptionAr);
  const [setDescEnText, setSetDescEnText] = useState(settings.companyDescriptionEn);
  const [setDefaultLangVal, setSetDefaultLangVal] = useState<'ar' | 'en'>(settings.defaultLanguage);

  // Hydrate form with property data when Editing mode transitions
  const initializePropertyEdit = (prop: Property) => {
    setFormTitleAr(prop.titleAr);
    setFormTitleEn(prop.titleEn);
    setFormPrice(prop.price.toString());
    setFormCity(prop.city);
    setFormType(prop.type);
    setFormDescAr(prop.descriptionAr);
    setFormDescEn(prop.descriptionEn);
    setFormBedrooms(prop.bedrooms.toString());
    setFormBathrooms(prop.bathrooms.toString());
    setFormArea(prop.area.toString());
    setFormImagesText(prop.images.join('\n'));
    setEditingPropertyId(prop.id);
    setAdminTab('add-property');
  };

  const clearPropertyForm = () => {
    setFormTitleAr('');
    setFormTitleEn('');
    setFormPrice('');
    setFormCity('Baghdad');
    setFormType('apartment');
    setFormDescAr('');
    setFormDescEn('');
    setFormBedrooms('2');
    setFormBathrooms('2');
    setFormArea('150');
    setFormImagesText('');
    setEditingPropertyId(null);
    setImageSearchQuery('');
    setSearchedImages([]);
  };

  const getFormImages = (): string[] => {
    return splitImagesText(formImagesText);
  };

  const addImageUrl = (url: string) => {
    const current = getFormImages();
    if (!current.includes(url)) {
      current.push(url);
      setFormImagesText(current.join('\n'));
    }
  };

  const removeImageUrl = (url: string) => {
    const current = getFormImages();
    const updated = current.filter(u => u !== url);
    setFormImagesText(updated.join('\n'));
  };

  const handleUnsplashSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageSearchQuery.trim()) return;
    setIsSearchingUnsplash(true);
    setTimeout(() => {
      const signatures = [1, 2, 3, 4, 5, 6, 7, 8];
      const resultUrls = signatures.map(sig => 
        `https://images.unsplash.com/featured/800x600/?${encodeURIComponent(imageSearchQuery.trim())},realestate&sig=${sig}`
      );
      setSearchedImages(resultUrls);
      setIsSearchingUnsplash(false);
    }, 600);
  };

  const processUploadedFiles = async (files: FileList) => {
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (fileArray.length === 0) {
      showToast(
        "يرجى تحديد ملفات صور صالحة (مثل PNG أو JPG).",
        "Please select valid image files (like PNG or JPG)."
      );
      return;
    }

    // Defensive handling for excessively large mobile files
    const oversizedFiles = fileArray.filter(f => f.size > 25 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showToast(
        "بعض الصور حجمها كبير جداً (أكثر من 25 ميجابايت). يرجى تقليل مساحتها قبل الرفع لضمان الأمان.",
        "Some selected images are exceptionally large (over 25MB). Please resize them to prevent out-of-memory errors."
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const base64Strings: string[] = [];
    const uploadErrors: string[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Requirement 1: File selected
        console.log(`[Image Upload] Stage 1 - File selected: Name="${file.name}", Size=${(file.size / 1024).toFixed(2)}KB, Type="${file.type}"`);

        // Update progress indicating current file being uploaded
        setUploadProgress(Math.min(95, Math.round((i / fileArray.length) * 100) + 10));

        let finalFile: File | Blob = file;

        // Requirement 2 & 3: Compression and safe browser-image-compression with separate try-catch blocks
        try {
          console.log(`[Image Upload] Stage 2 - Compression started for: "${file.name}"`);
          
          const compressionOptions = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
            useWebWorker: false,
            onProgress: (progressVal: number) => {
              // Requirement 1: Compression progress logging
              console.log(`[Image Upload] Stage 3 - Compression progress for "${file.name}": ${Math.round(progressVal)}%`);
              // Let progress UI smoothly guide the user
              const partial = (progressVal / 100) * (60 / fileArray.length);
              const overall = Math.min(95, Math.round((i / fileArray.length) * 100) + 10 + partial);
              setUploadProgress(overall);
            }
          };

          // Safe execution with 30-seconds timeout protection
          finalFile = await Promise.race([
            imageCompression(file, compressionOptions),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error("Image compression timed out (30s limit exceeded)")), 30000)
            )
          ]);

          // Requirement 1: Compression completed
          console.log(`[Image Upload] Stage 4 - Compression completed for "${file.name}". Compressed Size: ${(finalFile.size / 1024).toFixed(2)}KB`);
        } catch (compressErr: any) {
          // Requirement 4: If compression fails, automatically use original file
          console.error(`[Image Upload] Stage 8 - Compression failed or timed out for "${file.name}". Falling back to original image:`, compressErr);
          finalFile = file;
          // Set progress slightly to keep visual feedback moving
          setUploadProgress(Math.min(95, Math.round(((i + 0.5) / fileArray.length) * 100) + 10));
        }

        // Requirement 5: Create and Validate FormData
        try {
          console.log(`[Image Upload] Stage 5 - FormData created for "${file.name}"`);
          const formData = new FormData();
          formData.append('image', finalFile, file.name);

          // Validation
          const attachedFile = formData.get('image');
          if (!attachedFile || !(attachedFile instanceof Blob)) {
            throw new Error("FormData validation failed: Attached file is invalid or empty");
          }
          if (attachedFile.size === 0) {
            throw new Error("FormData validation failed: Attached file size is zero bytes");
          }
          console.log(`[Image Upload] Stage 6 - FormData validated successfully. Key="image", Name="${file.name}", Size=${(attachedFile.size / 1024).toFixed(2)}KB`);
        } catch (formDataErr: any) {
          console.error(`[Image Upload] Stage 8 (Error) - FormData validation caught error for "${file.name}":`, formDataErr);
          throw formDataErr; // Propagate critical structure errors
        }

        // Upload Request to the real backend API (converting to base64 and uploading to save physically in database)
        try {
          // Requirement 1: Upload request started
          console.log(`[Image Upload] Stage 7 - Sending image payload to central cloud server for: "${file.name}"`);
          
          const base64Str = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (loadEvent) => resolve(loadEvent.target?.result as string || '');
            reader.onerror = () => reject(new Error("FileReader failed to convert image to data URL"));
            reader.readAsDataURL(finalFile);
          });

          if (!base64Str || !base64Str.startsWith('data:image/')) {
            throw new Error("Invalid base64 payload output from modern reader");
          }

          // Real fetch upload call
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content: base64Str,
              filename: file.name
            })
          });

          if (!uploadResponse.ok) {
            const errResponse = await uploadResponse.json();
            throw new Error(errResponse.error || "Server database rejected the uploaded file");
          }

          const uploadData = await uploadResponse.json();
          if (!uploadData || !uploadData.url) {
            throw new Error("Invalid response schema returned from cloud database upload route");
          }

          // Requirement 1: Response received
          console.log(`[Image Upload] Stage 7 - Response received. Saved permanently at cloud server under path: "${uploadData.url}"`);
          base64Strings.push(uploadData.url);
        } catch (uploadErr: any) {
          // Requirement 2: Separate try-catch blocks
          console.error(`[Image Upload] Stage 8 (Error) - Upload request failed for "${file.name}":`, uploadErr);
          uploadErrors.push(`${file.name}: ${uploadErr.message || 'Error occurred'}`);
        }
      }

      // Check process results
      if (base64Strings.length === 0) {
        throw new Error(uploadErrors.length > 0 ? uploadErrors.join('; ') : "No selected files could be processed.");
      }

      // Append values to current ones
      setFormImagesText((prevText) => {
        const currentUrls = splitImagesText(prevText);
        base64Strings.forEach((b64) => {
          if (!currentUrls.includes(b64)) {
            currentUrls.push(b64);
          }
        });
        return currentUrls.join('\n');
      });

      // Show completion toast
      setUploadProgress(100);
      showToast(
        `تم ضغط ومعالجة ${base64Strings.length} صورة من جهازك بنجاح! ستظهر فوراً في معرض الصور.`,
        `Successfully processed and formatted ${base64Strings.length} custom image(s)!`
      );

      if (uploadErrors.length > 0) {
        console.warn("[Image Upload] Completed with partial errors:", uploadErrors);
      }
    } catch (err: any) {
      // Requirement 1 & 7: Error caught and visible UI errors instead of silent failures
      console.error("[Image Upload] Critical error during processUploadedFiles:", err);
      showToast(
        `خطأ في تحميل الصور: ${err.message || "يرجى تجربة صور أخرى."}`,
        `Image Upload Failure: ${err.message || "Please pick other valid image files."}`
      );
    } finally {
      // Requirement 6 & 8: Ensure loading state always resets in finally to prevent infinite loading state
      setIsUploading(false);
      setUploadProgress(0);
      console.log("[Image Upload] Upload job ended, state variables reset to defaults.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
      // Reset input value to allow selecting same file again and avoid duplicate browser event cycles
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!isUploading && e.dataTransfer.files) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const persistPropertySubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProperty) return;

    setIsSavingProperty(true);
    try {
      // Parse images array
      const parsedImages = splitImagesText(formImagesText);

      const listingPayload = {
        titleAr: formTitleAr || "عقار عراقي مميز",
        titleEn: formTitleEn || "Premium Iraqi Property",
        price: Number(formPrice) || 120000000,
        city: formCity,
        type: formType,
        descriptionAr: formDescAr || "لا يوجد وصف تفصيلي متوفر حالياً باللغة العربية.",
        descriptionEn: formDescEn || "No English description provided yet.",
        bedrooms: formType === 'land' ? 0 : Number(formBedrooms),
        bathrooms: formType === 'land' ? 0 : Number(formBathrooms),
        area: Number(formArea) || 100,
        images: parsedImages.length > 0 ? parsedImages : [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
        ],
        isFeatured: false
      };

      if (editingPropertyId) {
        await updateProperty(editingPropertyId, listingPayload);
      } else {
        await addProperty(listingPayload);
      }

      clearPropertyForm();
      setAdminTab('properties');
    } catch (err: any) {
      console.error("[Property Submission Error]", err);
    } finally {
      setIsSavingProperty(false);
    }
  };

  const handleMediaUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl.trim()) return;
    addToMediaRepo(newMediaUrl.trim());
    setNewMediaUrl('');
  };

  const handleSettingsCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingSettings) return;

    setIsSavingSettings(true);
    try {
      await updateSettings({
        logoTextAr: setLogoArText,
        logoTextEn: setLogoEnText,
        contactNumber: setPhoneVal,
        whatsappNumber: setWhatsAppVal,
        companyDescriptionAr: setDescArText,
        companyDescriptionEn: setDescEnText,
        defaultLanguage: setDefaultLangVal
      });
    } catch (err: any) {
      console.error("[Settings Commit Error]", err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const formatPrice = (priceNum: number) => {
    const formatted = new Intl.NumberFormat('en-US').format(priceNum);
    return currentLanguage === 'ar' ? `${formatted} د.ع` : `${formatted} IQD`;
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row" id="admin-panel-viewport-container">
      
      {/* 1. Sidebar Nav */}
      <aside 
        className="w-full md:w-64 bg-stone-900 text-stone-300 flex flex-col justify-between p-6 shrink-0 border-b md:border-b-0 border-stone-800"
        id="admin-sidebar"
      >
        <div className="space-y-8">
          {/* Admin Header */}
          <div className="flex items-center gap-3 border-b border-stone-800 pb-5">
            <div className="bg-gold-500 text-stone-900 p-2 rounded-xl">
              <SettingsIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-tight leading-none button-text">
                {t.adminSidebarTitle}
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 leading-tight">
                lloydlloyd
              </span>
            </div>
          </div>

          {/* Nav Tabs list */}
          <nav className="space-y-1.5" id="admin-tabs-nav-list">
            
            {/* Dashboard tab */}
            <button
              onClick={() => { setAdminTab('dashboard'); clearPropertyForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                adminTab === 'dashboard' 
                  ? 'bg-gold-500 text-stone-950 shadow-md font-bold' 
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
              id="admin-tab-btn-dashboard"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>{t.menuDashboard}</span>
            </button>

            {/* Properties List tab */}
            <button
              onClick={() => { setAdminTab('properties'); clearPropertyForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                adminTab === 'properties' 
                  ? 'bg-gold-500 text-stone-950 shadow-md font-bold' 
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
              id="admin-tab-btn-properties"
            >
              <Home className="h-4 w-4 shrink-0" />
              <span>{t.menuProperties}</span>
            </button>

            {/* Add Property tab */}
            <button
              onClick={() => { setAdminTab('add-property'); clearPropertyForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                adminTab === 'add-property' && !editingPropertyId
                  ? 'bg-gold-500 text-stone-950 shadow-md font-bold' 
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
              id="admin-tab-btn-add-property"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>{t.menuAddProperty}</span>
            </button>

            {/* Media tab */}
            <button
              onClick={() => { setAdminTab('media'); clearPropertyForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                adminTab === 'media' 
                  ? 'bg-gold-500 text-stone-950 shadow-md font-bold' 
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
              id="admin-tab-btn-media"
            >
              <Image className="h-4 w-4 shrink-0" />
              <span>{t.menuMedia}</span>
            </button>

            {/* Settings tab */}
            <button
              onClick={() => { setAdminTab('settings'); clearPropertyForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                adminTab === 'settings' 
                  ? 'bg-gold-500 text-stone-950 shadow-md font-bold' 
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
              id="admin-tab-btn-settings"
            >
              <SettingsIcon className="h-4 w-4 shrink-0" />
              <span>{t.menuSettings}</span>
            </button>

          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="pt-8 border-t border-stone-800" id="admin-sidebar-footer">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-red-950 hover:text-red-400 transition-colors cursor-pointer"
            id="admin-logout-btn"
          >
            <LogOut className="h-4 w-4 shrink-0 text-red-500" />
            <span>{t.navLogout}</span>
          </button>
        </div>

      </aside>

      {/* 2. Workspace Content Container */}
      <main className="flex-grow p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-8" id="admin-workspace-pane">
        
        {/* TAB 1: DASHBOARD HOME */}
        {adminTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in" id="admin-view-dashboard">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
              <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-tight">
                  {t.menuDashboard}
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                  {t.dashWelcome}
                </p>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Active Listings metric */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-150 flex items-center gap-4">
                <div className="bg-gold-500/10 text-gold-600 p-4 rounded-2xl">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-stone-400 text-xs font-bold uppercase tracking-wider">{t.totalProperties}</span>
                  <span className="text-2xl font-black text-stone-900 leading-none">{properties.length}</span>
                </div>
              </div>

              {/* Messages metric */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-150 flex items-center gap-4">
                <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
                  <Inbox className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-stone-400 text-xs font-bold uppercase tracking-wider">
                    {currentLanguage === 'ar' ? 'رسائل واستفسارات الدليل' : 'Contact Inquiries'}
                  </span>
                  <span className="text-2xl font-black text-stone-900 leading-none">{messages.length}</span>
                </div>
              </div>

              {/* Media Repository metric */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-150 flex items-center gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl">
                  <Image className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-stone-400 text-xs font-bold uppercase tracking-wider">{t.menuMedia}</span>
                  <span className="text-2xl font-black text-stone-900 leading-none">{mediaRepo.length}</span>
                </div>
              </div>

            </div>

            {/* Dashboard Sub-lists */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Activities Log Timeline */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-150 shadow-sm lg:col-span-12 space-y-6">
                <h3 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-gold-600" />
                  <span>{t.recentActivity}</span>
                </h3>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                  {activities.map((act) => (
                    <div key={act.id} className="flex gap-4 border-b border-stone-50 pb-3 items-start last:border-0 last:pb-0 text-sm">
                      <div className="text-stone-400 font-mono text-xs w-28 shrink-0 py-0.5" dir="ltr">
                        {new Date(act.timestamp).toLocaleString(currentLanguage === 'ar' ? 'ar-IQ' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-semibold text-stone-900 block leading-tight">
                          {currentLanguage === 'ar' ? act.textAr : act.textEn}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase font-mono tracking-wider block leading-none">
                          {act.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PROPERTIES CRUD TABLE */}
        {adminTab === 'properties' && (
          <div className="space-y-8 animate-fade-in" id="admin-view-properties">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
              <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-tight">
                  {t.menuProperties}
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                  {currentLanguage === 'ar' ? 'مراجعة وتعديل ومسح الإعلانات الفعالة حالياً على الموقع' : 'Review, modify and erase active published listings.'}
                </p>
              </div>
              <button
                onClick={() => setAdminTab('add-property')}
                className="bg-gold-600 hover:bg-gold-500 text-stone-950 font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>{t.menuAddProperty}</span>
              </button>
            </div>

            {/* Properties List Table */}
            <div className="bg-white rounded-3xl border border-stone-150 overflow-hidden shadow-sm" id="admin-properties-crud-grid">
              
              <div className="overflow-x-auto">
                <table className="w-full text-start text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-xs font-bold uppercase tracking-wide text-start">
                      <th className="px-6 py-4 text-start">{currentLanguage === 'ar' ? 'الغلاف' : 'Cover'}</th>
                      <th className="px-6 py-4 text-start">{currentLanguage === 'ar' ? 'العنوان' : 'Title'}</th>
                      <th className="px-6 py-4 text-start">{currentLanguage === 'ar' ? 'المحافظة' : 'City'}</th>
                      <th className="px-6 py-4 text-start">{currentLanguage === 'ar' ? 'النوع' : 'Type'}</th>
                      <th className="px-6 py-4 text-start">{currentLanguage === 'ar' ? 'السعر' : 'Price'}</th>
                      <th className="px-6 py-4 text-center">{currentLanguage === 'ar' ? 'خيارات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {properties.map((prop) => {
                      const cityObj = CITY_TRANSLATIONS[prop.city] || { ar: prop.city, en: prop.city };
                      const typeObj = TYPE_TRANSLATIONS[prop.type] || { ar: prop.type, en: prop.type };

                      return (
                        <tr key={prop.id} className="hover:bg-stone-50/50 transition-colors">
                          
                          {/* Photo */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-12 w-20 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                              <img 
                                src={prop.images[0]} 
                                alt="Prop Cover"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>

                          {/* Title */}
                          <td className="px-6 py-4">
                            <div className="font-bold text-stone-900 line-clamp-1 max-w-xs sm:max-w-md">
                              {currentLanguage === 'ar' ? prop.titleAr : prop.titleEn}
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono tracking-wide uppercase">
                              ID: {prop.id}
                            </span>
                          </td>

                          {/* City */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-700">
                            {currentLanguage === 'ar' ? cityObj.ar : cityObj.en}
                          </td>

                          {/* Type */}
                          <td className="px-6 py-4 whitespace-nowrap text-stone-500 font-semibold uppercase text-xs">
                            {currentLanguage === 'ar' ? typeObj.ar : typeObj.en}
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4 whitespace-nowrap font-extrabold text-gold-700">
                            {formatPrice(prop.price)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              {/* Edit btn */}
                              <button
                                onClick={() => initializePropertyEdit(prop)}
                                className="p-2 border border-stone-200 text-stone-600 hover:text-gold-600 hover:border-gold-300 rounded-lg hover:bg-gold-50/50 transition-colors duration-150"
                                title="Edit Listing"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              {/* Delete btn */}
                              <button
                                onClick={() => setDeleteCandidateId(prop.id)}
                                className="p-2 border border-stone-200 text-red-500 hover:text-red-700 hover:border-red-300 hover:bg-red-50/50 rounded-lg transition-colors duration-150"
                                title="Delete Listing"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {properties.length === 0 && (
                <div className="p-12 text-center text-stone-400 text-sm">
                  {t.noPropertiesFound}
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: ADD / EDIT PROPERTY FORM */}
        {adminTab === 'add-property' && (
          <div className="space-y-8 animate-fade-in" id="admin-view-publish">
            <div className="flex justify-between items-center border-b border-stone-200 pb-6">
              <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-tight">
                  {editingPropertyId ? (currentLanguage === 'ar' ? 'تعديل العقار الحالي' : 'Edit Selected Listing') : t.menuAddProperty}
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                  {editingPropertyId ? `ID: ${editingPropertyId}` : (currentLanguage === 'ar' ? 'إدخال حقول ومواصفات العقار لنشره فوراً في الموقع' : 'Populate parameters to publish asset live on indices.')}
                </p>
              </div>
              {editingPropertyId && (
                <button
                  onClick={clearPropertyForm}
                  className="text-stone-600 hover:text-stone-900 text-sm font-semibold border border-stone-300 rounded-xl px-4 py-2.5 transition-all"
                >
                  {t.crudCancelBtn}
                </button>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-150 shadow-sm">
              <form onSubmit={persistPropertySubmission} className="space-y-6">
                
                {/* 1. English/Arabic Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                      {t.crudTitleAr} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitleAr}
                      onChange={(e) => setFormTitleAr(e.target.value)}
                      placeholder="مثال: شقة ديلوكس ثلاث غرف للبيع في الكرادة"
                      className="w-full bg-stone-50 hover:bg-stone-100 placeholder-stone-400 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                      {t.crudTitleEn} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitleEn}
                      onChange={(e) => setFormTitleEn(e.target.value)}
                      placeholder="e.g. Deluxe Three Bedroom Penthouse for sale in Karrada"
                      className="w-full bg-stone-50 hover:bg-stone-100 placeholder-stone-400 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* 2. Price, City, Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Price IQD */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                      {t.crudPrice} *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="e.g. 240000000"
                        className="w-full bg-stone-50 hover:bg-stone-100 placeholder-stone-400 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">IQD</span>
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                      {t.crudCity} *
                    </label>
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value as IraqiCity)}
                      className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                    >
                      {Object.entries(CITY_TRANSLATIONS).map(([key, obj]) => (
                        <option key={key} value={key}>
                          {currentLanguage === 'ar' ? obj.ar : obj.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                      {t.crudType} *
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as PropertyType)}
                      className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                    >
                      {Object.entries(TYPE_TRANSLATIONS).map(([key, obj]) => (
                        <option key={key} value={key}>
                          {currentLanguage === 'ar' ? obj.ar : obj.en}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* 3. Specs: Bedrooms, Bathrooms, Area size */}
                {formType !== 'land' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    {/* Bedrooms */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                        {t.crudBedrooms}
                      </label>
                      <input
                        type="number"
                        value={formBedrooms}
                        onChange={(e) => setFormBedrooms(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      />
                    </div>

                    {/* Bathrooms */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                        {t.crudBathrooms}
                      </label>
                      <input
                        type="number"
                        value={formBathrooms}
                        onChange={(e) => setFormBathrooms(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      />
                    </div>

                    {/* Area Size */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                        {t.crudArea} *
                      </label>
                      <input
                        type="number"
                        required
                        value={formArea}
                        onChange={(e) => setFormArea(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      />
                    </div>

                  </div>
                )} {formType === 'land' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                        {t.crudArea} (متر مربع) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formArea}
                        onChange={(e) => setFormArea(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* 4. English/Arabic Detailed Description Text Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                      {t.crudDescriptionAr}
                    </label>
                    <textarea
                      rows={6}
                      value={formDescAr}
                      onChange={(e) => setFormDescAr(e.target.value)}
                      placeholder="أدخل الوصف الكامل لعمر البناء، ميزات المنطقة، والضمانات القانونية بالتفصيل..."
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium resize-none"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                      {t.crudDescriptionEn}
                    </label>
                    <textarea
                      rows={6}
                      value={formDescEn}
                      onChange={(e) => setFormDescEn(e.target.value)}
                      placeholder="Add absolute property structural features, concrete depth, climate insulation, and title specifications..."
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium resize-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                 {/* 5. Interactive Premium Pictures Media Input & Device Uploader */}
                 <div className="space-y-4 border border-stone-100 bg-stone-50/50 p-5 sm:p-6 rounded-3xl">
                   <div>
                     <label className="text-sm font-extrabold text-stone-900 block tracking-tight">
                       {currentLanguage === 'ar' ? 'معرض صور العقار والوسائط المرفوعة' : 'Property Gallery & Asset Builder'} *
                     </label>
                     <p className="text-stone-500 text-xs mt-1">
                       {currentLanguage === 'ar'
                         ? 'قم ببناء معرض صور مذهل لعقارك. يمكنك رفع صور من جهازك مباشرة، أو اختيار لقطات احترافية بنقرة واحدة من مكتبة Unsplash، أو كتابة روابط يدوية.'
                         : 'Construct an immersive listing gallery. Direct upload from your device, choose ready premium-quality Unsplash photos, or supply manual links.'}
                     </p>
                   </div>

                   {/* A. ACTIVE PROPERTY GALLERY IMAGES GRID PREVIEW */}
                   <div className="space-y-2.5">
                     <span className="text-xs font-black uppercase tracking-wider text-stone-500 block">
                       {currentLanguage === 'ar' ? `الصور المضافة حالياً (${getFormImages().length})` : `Currently Selected Images (${getFormImages().length})`}
                     </span>

                     {getFormImages().length > 0 ? (
                       <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
                         {getFormImages().map((imgUrl, idx) => (
                           <div 
                             key={idx} 
                             className="group relative aspect-video rounded-xl bg-stone-200 border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-gold-500 transition-all duration-200"
                           >
                             <img 
                               src={imgUrl} 
                               alt="Listing Asset Preview" 
                               className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                               referrerPolicy="no-referrer"
                               onError={(e) => {
                                 // fallback icon or clean design on error
                                 (e.target as HTMLElement).style.display = 'none';
                               }}
                             />
                             {/* Delete button indicator overlay */}
                             <button
                               type="button"
                               onClick={() => removeImageUrl(imgUrl)}
                               className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md hover:scale-110 active:scale-90 transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                               title={currentLanguage === 'ar' ? 'حذف الصورة' : 'Remove Image'}
                             >
                               <X className="h-3.5 w-3.5" />
                             </button>
                             {/* Label index counter badge */}
                             <span className="absolute bottom-1.5 left-1.5 bg-stone-900/70 backdrop-blur-xs text-[9px] font-mono text-white px-1.5 py-0.5 rounded-md font-bold">
                               #{idx + 1}
                             </span>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="border-dashed border-2 border-stone-200 rounded-2xl p-6 text-center text-stone-400 bg-white/70">
                         <Image className="h-8 w-8 mx-auto text-stone-300 mb-2 stroke-[1.5]" />
                         <p className="text-xs font-semibold">
                           {currentLanguage === 'ar' 
                             ? 'لا توجد صور مضافة بعد. يرجى توفير صورة واحدة على الأقل بالأسفل لتفعيل الإدراج.' 
                             : 'No images added yet. Please choose or upload at least one image below.'}
                         </p>
                       </div>
                     )}
                   </div>

                   {/* B. CREATIVE SWITCHER TAB HEADER BAR */}
                   <div className="flex border-b border-stone-200 gap-1.5 pt-2">
                     <button
                       type="button"
                       onClick={() => setImageTab('device')}
                       className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                         imageTab === 'device'
                           ? 'border-stone-900 text-stone-900'
                           : 'border-transparent text-stone-400 hover:text-stone-600'
                       }`}
                     >
                       <FileUp className="h-3.5 w-3.5" />
                       {currentLanguage === 'ar' ? 'رفع من جهازك' : 'Upload from Device'}
                     </button>
                     <button
                       type="button"
                       onClick={() => setImageTab('unsplash')}
                       className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                         imageTab === 'unsplash'
                           ? 'border-stone-900 text-stone-900'
                           : 'border-transparent text-stone-400 hover:text-stone-600'
                       }`}
                     >
                       <Sparkles className="h-3.5 w-3.5 text-gold-600" />
                       {currentLanguage === 'ar' ? 'معرض صور Unsplash' : 'Unsplash Catalog'}
                     </button>
                     <button
                       type="button"
                       onClick={() => setImageTab('manual')}
                       className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                         imageTab === 'manual'
                           ? 'border-stone-900 text-stone-900'
                           : 'border-transparent text-stone-400 hover:text-stone-600'
                       }`}
                     >
                       <FileText className="h-3.5 w-3.5" />
                       {currentLanguage === 'ar' ? 'إدخال روابط يدوية' : 'Manual Links'}
                     </button>
                   </div>

                   {/* C. MULTI-TAB DISPLAY INTERFACES */}
                   <div className="pt-2">
                     
                     {/* TAB C1: LOCAL FILE UPLOADER */}
                     {imageTab === 'device' && (
                       <div 
                         onDragOver={isUploading ? undefined : handleDragOver}
                         onDragLeave={isUploading ? undefined : handleDragLeave}
                         onDrop={isUploading ? undefined : handleDrop}
                         onClick={isUploading ? undefined : () => document.getElementById('device-image-uploader')?.click()}
                         className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-150 relative bg-white ${
                           isUploading ? 'border-gold-300 bg-stone-50/55 cursor-not-allowed' : dragOver ? 'border-gold-500 bg-gold-50/20 scale-[0.99]' : 'border-stone-200 hover:border-stone-300'
                         }`}
                       >
                         <input 
                           type="file" 
                           disabled={isUploading} id="device-image-uploader" onClick={(e) => { e.stopPropagation(); }} 
                           multiple 
                           accept="image/*" 
                           onChange={handleFileChange}
                           className="hidden" 
                         />
                         
                         <Upload className={isUploading ? "hidden" : "h-10 w-10 text-stone-400 mx-auto mb-3 stroke-[1.5] animate-bounce"} />
                          {isUploading && (
                            <div className="space-y-4 py-3" id="upload-progress-overlay">
                              <div className="relative h-12 w-12 mx-auto flex items-center justify-center">
                                <span className="absolute animate-spin rounded-full h-10 w-10 border-4 border-stone-200 border-t-gold-600"></span>
                                <FileUp className="h-5 w-5 text-gold-600 animate-pulse" />
                              </div>
                              <div className="space-y-2 max-w-sm mx-auto">
                                <h4 className="text-xs font-black uppercase text-stone-800 tracking-wide">
                                  {currentLanguage === 'ar' ? 'جاري ضغط ومعالجة الصور المحددة...' : 'Analyzing and Compressing Selected Photos...'}
                                </h4>
                                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden border border-stone-100">
                                  <div 
                                    className="bg-gold-650 h-1.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                                <p className="text-[10px] text-stone-500 font-mono">
                                  {uploadProgress}% ({currentLanguage === 'ar' ? 'تجهيز ترميز الدقة الفائقة بالخلفية' : 'Baking high-resolution responsive elements'})
                                </p>
                              </div>
                            </div>
                          )}
                         
                         <div className={`space-y-1 ${isUploading ? 'hidden' : ''}`}>
                           <p className="text-sm font-black text-stone-800">
                             {currentLanguage === 'ar' ? 'اضغط هنا لاختيار صور عقارك من جهازك، أو اسحب الصور وأفلتها هاهنا مباشرة' : 'Click here to choose your property photos from your device, or drag & drop files directly here'}
                           </p>
                           <p className="text-[11px] text-stone-450">
                             {currentLanguage === 'ar' ? 'تذكير: ستظهر صورك المرفوعة فوراً لتُعرض بشكل مذهل مع سعر العقار ومساحة البناء بالمتر المربع ومواصفاته عند الحفظ.' : 'Memo: Your uploaded custom photos will immediately bind with the listing price, square meters range, and description on save.'}
                           </p>
                         </div>
                       </div>
                     )}

                     {/* TAB C2: UNSPLASH GALLERY BUILDER */}
                     {imageTab === 'unsplash' && (
                       <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-100">
                         
                         {/* Category Pills Selector */}
                         <div className="flex flex-wrap gap-1.5">
                           {(['exteriors', 'living', 'kitchens', 'bedrooms', 'bathrooms', 'lands'] as const).map((cat) => {
                             const lblAr = 
                               cat === 'exteriors' ? 'واجهات وفلل' : 
                               cat === 'living' ? 'صالات معيشية' : 
                               cat === 'kitchens' ? 'مطابخ' : 
                               cat === 'bedrooms' ? 'غرف نوم' : 
                               cat === 'bathrooms' ? 'حمامات ديلوكس' : 'أراضي وحدائق';
                             const lblEn = 
                               cat === 'exteriors' ? 'Exteriors' : 
                               cat === 'living' ? 'Living Rooms' : 
                               cat === 'kitchens' ? 'Kitchens' : 
                               cat === 'bedrooms' ? 'Bedrooms' : 
                               cat === 'bathrooms' ? 'Bathrooms' : 'Lands & Plots';

                             return (
                               <button
                                 key={cat}
                                 type="button"
                                 onClick={() => {
                                   setUnsplashCategory(cat);
                                   setSearchedImages([]);
                                 }}
                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                   unsplashCategory === cat && searchedImages.length === 0
                                     ? 'bg-stone-900 text-white'
                                     : 'bg-stone-100 text-stone-650 hover:bg-stone-200'
                                 }`}
                               >
                                 {currentLanguage === 'ar' ? lblAr : lblEn}
                               </button>
                             );
                           })}
                         </div>

                         {/* Dedicated Keyword Input Search Field */}
                         <form onSubmit={handleUnsplashSearch} className="flex gap-2">
                           <div className="relative flex-1">
                             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
                             <input
                               type="text"
                               placeholder={
                                 currentLanguage === 'ar' 
                                   ? 'مثلاً: مسبح خلفي، شقة بغداد، حديقة، مكتب...' 
                                   : 'Search Unsplash real estate context, e.g. luxury pool, penthouse...'
                               }
                               value={imageSearchQuery}
                               onChange={(e) => setImageSearchQuery(e.target.value)}
                               className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium"
                             />
                           </div>
                           <button
                             type="submit"
                             disabled={isSearchingUnsplash || !imageSearchQuery.trim()}
                             className="bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-black px-4 py-2.5 rounded-xl text-xs transition-colors transition-transform active:scale-95 cursor-pointer max-w-xs"
                           >
                             {isSearchingUnsplash 
                               ? (currentLanguage === 'ar' ? 'جاري البحث...' : 'Searching...') 
                               : (currentLanguage === 'ar' ? 'بحث مخصص' : 'Custom Search')}
                           </button>
                         </form>

                         {/* Core Picker Images Grid */}
                         <div>
                           <span className="text-[10px] font-bold text-stone-400 block pb-2 tracking-wide uppercase">
                             {searchedImages.length > 0
                               ? (currentLanguage === 'ar' ? 'نتائج البحث المخصصة (اضغط للإضافة أو الحذف)' : 'Unsplash Custom Search Results (Click to toggle)')
                               : (currentLanguage === 'ar' ? 'صور عقارية احترافية وعالية الوضوح (اضغط للإضافة)' : 'Professional Royalty-Free Standard Assortment (Click to add)')}
                           </span>

                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                             {(searchedImages.length > 0 ? searchedImages : CURATED_UNSPLASH[unsplashCategory].map(item => item.url)).map((url, i) => {
                               const isAdded = getFormImages().includes(url);
                               return (
                                 <div
                                   key={url + '-' + i}
                                   onClick={() => {
                                     if (isAdded) {
                                       removeImageUrl(url);
                                     } else {
                                       addImageUrl(url);
                                     }
                                   }}
                                   className={`relative aspect-video rounded-xl overflow-hidden border cursor-pointer group shadow-xs transition-all duration-250 ${
                                     isAdded 
                                       ? 'border-gold-500 ring-2 ring-gold-500/50 scale-[0.98]' 
                                       : 'border-stone-100 hover:border-stone-300 hover:scale-[1.01]'
                                   }`}
                                 >
                                   <img
                                     src={url}
                                     alt="Curated Choice"
                                     className="h-full w-full object-cover"
                                     referrerPolicy="no-referrer"
                                     loading="lazy"
                                   />
                                   
                                   {/* Status Overlay Hover effect */}
                                   <div className={`absolute inset-0 flex items-center justify-center transition-all ${
                                     isAdded 
                                       ? 'bg-gold-500/15' 
                                       : 'bg-stone-950/0 group-hover:bg-stone-950/20'
                                   }`}>
                                     {isAdded ? (
                                       <div className="bg-gold-500 text-white p-1 rounded-full shadow-lg">
                                         <Check className="h-4 w-4" />
                                       </div>
                                     ) : (
                                       <div className="bg-white/90 text-stone-800 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-150">
                                         <Plus className="h-3.5 w-3.5 text-stone-900" />
                                       </div>
                                     )}
                                   </div>

                                   {/* Curated title snippet label - only for statically curated default images */}
                                   {searchedImages.length === 0 && (
                                     <div className="absolute bottom-0 inset-x-0 bg-stone-950/50 backdrop-blur-[1px] p-1 text-center text-[9px] text-white overflow-hidden text-ellipsis whitespace-nowrap">
                                        {currentLanguage === 'ar' ? CURATED_UNSPLASH[unsplashCategory][i]?.ar : CURATED_UNSPLASH[unsplashCategory][i]?.en}
                                     </div>
                                   )}
                                 </div>
                               );
                             })}
                           </div>
                         </div>

                       </div>
                     )}

                     {/* TAB C3: CLASSIC RELIABLE MANUAL LINKS */}
                     {imageTab === 'manual' && (
                       <div className="space-y-1.5">
                         <textarea
                           rows={4}
                           value={formImagesText}
                           onChange={(e) => setFormImagesText(e.target.value)}
                           placeholder="https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-..."
                           className="w-full bg-white border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-2xl px-4 py-3 text-xs font-mono resize-none leading-relaxed"
                           dir="ltr"
                         />
                         <span className="text-[10px] text-stone-400 block leading-relaxed px-1">
                           {currentLanguage === 'ar'
                             ? 'أدرج رابطًا لكل صورة في سطر منفصل. الروابط المفرزة بالأسطر ستقرأ وتظهر مباشرة كألبوم متكامل.'
                             : 'Supply one valid property photo URL per text line. System handles sequence order matching coordinates automatically.'}
                         </span>
                       </div>
                     )}

                   </div>

                   {/* D. NATIVE FORM INVISIBLE REQUIREMENT ENFORCER */}
                   <input 
                     type="text" 
                     required 
                     className="sr-only" 
                     value={formImagesText} 
                     onChange={(e) => setFormImagesText(e.target.value)}
                     tabIndex={-1} 
                     aria-hidden="true" 
                     placeholder="Requirement Validator Trigger Line"
                   />
                 </div>

                {/* Submit button layout */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProperty}
                    className="bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-extrabold px-10 py-3.5 rounded-xl shadow-md transition-all duration-150 cursor-pointer flex items-center gap-2"
                  >
                    {isSavingProperty ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {currentLanguage === 'ar' ? 'جاري النشر والحفظ...' : 'Publishing...'}
                      </>
                    ) : (
                      editingPropertyId ? t.crudSaveBtn : t.crudAddBtn
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* TAB 4: MEDIA MANAGER */}
        {adminTab === 'media' && (
          <div className="space-y-8 animate-fade-in" id="admin-view-media">
            <div className="border-b border-stone-200 pb-6">
              <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-tight">
                {t.mediaTitle}
              </h1>
              <p className="text-stone-500 text-sm mt-1">
                {currentLanguage === 'ar' ? 'سجل واحفظ روابط الصور لنسخها واستخدامها بسهولة في نماذج العقارات' : 'Store images URLs keys for immediate copying over listing assets forms.'}
              </p>
            </div>

            {/* Quick URL upload tool */}
            <div className="bg-white p-6 rounded-3xl border border-stone-150 shadow-sm">
              <form onSubmit={handleMediaUpload} className="flex flex-col sm:flex-row gap-3.5 items-end">
                <div className="space-y-1.5 flex-grow">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                    {currentLanguage === 'ar' ? 'رابط ويب لصورة جديدة' : 'New Image Web URL Link'}
                  </label>
                  <input
                    type="url"
                    required
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder={t.mediaUploadPlaceholder}
                    className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-xs font-mono"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all text-xs shrink-0 cursor-pointer h-[46px]"
                >
                  {t.mediaAddBtn}
                </button>
              </form>
            </div>

            {/* Media previews library list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6" id="admin-media-repo-grid">
              {mediaRepo.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden border border-stone-150 shadow-sm hover:shadow group relative flex flex-col h-full">
                  <div className="aspect-video bg-stone-100 overflow-hidden relative">
                    <img 
                      src={item} 
                      alt="repo preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  
                  {/* copy and actions */}
                  <div className="p-3 bg-stone-50/50 flex-grow flex flex-col justify-between gap-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item);
                        alert(currentLanguage === 'ar' ? "تم نسخ الرابط الحافظة!" : "Copied URL to Clipboard!");
                      }}
                      className="w-full bg-white hover:bg-stone-100 border border-stone-200 hover:border-stone-300 font-semibold py-1.5 rounded-lg text-center text-[10px] text-stone-600 truncate px-2.5 shadow-xs"
                      title="Click to copy full absolute URL link"
                    >
                      {currentLanguage === 'ar' ? 'نسخ الرابط' : 'Copy Absolute URL'}
                    </button>

                    <button
                      onClick={() => removeFromMediaRepo(item)}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg text-center text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{currentLanguage === 'ar' ? 'حذف الرابط' : 'Purge'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {mediaRepo.length === 0 && (
              <div className="p-12 text-center text-stone-400 bg-white rounded-3xl border border-stone-150 shadow-sm text-sm">
                {t.mediaNoImages}
              </div>
            )}

          </div>
        )}

        {/* TAB 5: PORTAL SETTINGS */}
        {adminTab === 'settings' && (
          <div className="space-y-8 animate-fade-in" id="admin-view-settings">
            <div className="border-b border-stone-200 pb-6">
              <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-tight">
                {t.settingsTitle}
              </h1>
              <p className="text-stone-500 text-sm mt-1">
                {currentLanguage === 'ar' ? 'تعديل هوية المنصة، شعار الهيدر والفوتر، وأرقام تواصل واتساب' : 'Repaint platform brands, header logo markers, and target WhatsApp endpoints'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-150 shadow-sm">
              <form onSubmit={handleSettingsCommit} className="space-y-6">
                
                {/* Logo Text configurators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                      {t.setLogoAr} *
                    </label>
                    <input
                      type="text"
                      required
                      value={setLogoArText}
                      onChange={(e) => setSetLogoArText(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                      {t.setLogoEn} *
                    </label>
                    <input
                      type="text"
                      required
                      value={setLogoEnText}
                      onChange={(e) => setSetLogoEnText(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Direct line + WhatsApp configs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Phone Line */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                      {t.setPhone} *
                    </label>
                    <input
                      type="text"
                      required
                      value={setPhoneVal}
                      onChange={(e) => setSetPhoneVal(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      dir="ltr"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                      {t.setWhatsApp} *
                    </label>
                    <input
                      type="text"
                      required
                      value={setWhatsAppVal}
                      onChange={(e) => setSetWhatsAppVal(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                      dir="ltr"
                    />
                  </div>

                  {/* Initial guest language */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                      {t.setDefaultLang} *
                    </label>
                    <select
                      value={setDefaultLangVal}
                      onChange={(e) => setSetDefaultLangVal(e.target.value as 'ar' | 'en')}
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium"
                    >
                      <option value="ar">العربية (RTL)</option>
                      <option value="en">English (LTR)</option>
                    </select>
                  </div>

                </div>

                {/* Company Pitch in footers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Pitch AR */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                      {t.setDescAr}
                    </label>
                    <textarea
                      rows={4}
                      value={setDescArText}
                      onChange={(e) => setSetDescArText(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium resize-none"
                    />
                  </div>

                  {/* Pitch EN */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                      {t.setDescEn}
                    </label>
                    <textarea
                      rows={4}
                      value={setDescEnText}
                      onChange={(e) => setSetDescEnText(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-gold-500 rounded-xl px-4 py-3 text-sm font-medium resize-none"
                      dir="ltr"
                    />
                  </div>

                </div>

                {/* Save action bar */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-black px-10 py-3.5 rounded-xl shadow transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSavingSettings ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {currentLanguage === 'ar' ? 'جاري الحفظ والنشْر...' : 'Publishing...'}
                      </>
                    ) : (
                      currentLanguage === 'ar' ? 'حفظ التغييرات كلها' : 'Save All Branding'
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </main>

      {/* 3. STRICT CRUD CONFIRMATION MODAL TO PURGE LISTING */}
      {deleteCandidateId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-fade-in"
          id="crud-delete-confirmation-overlay"
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-100 flex flex-col items-center text-center space-y-5"
            id="crud-delete-confirmation-dialog"
          >
            {/* Warning yellow badge */}
            <div className="bg-red-50 text-red-600 p-4 rounded-full">
              <AlertTriangle className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight leading-snug">
                {t.crudDeleteConfirmTitle}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                {t.crudDeleteConfirmDesc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              
              {/* Confirm permanently delete */}
              <button
                onClick={() => {
                  deleteProperty(deleteCandidateId);
                  setDeleteCandidateId(null);
                }}
                className="w-full sm:order-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-5 rounded-xl transition-colors text-sm cursor-pointer"
              >
                {t.crudConfirmDeleteBtn}
              </button>

              {/* Dismiss candidate */}
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="w-full sm:order-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
              >
                {t.crudCancelBtn}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
