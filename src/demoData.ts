import { Property, WebsiteSettings } from './types';

export const INITIAL_SETTINGS: WebsiteSettings = {
  logoTextAr: "العقاق العراقي",
  logoTextEn: "Iraqi Estate",
  contactNumber: "+964 770 123 4567",
  whatsappNumber: "+9647701234567",
  companyDescriptionAr: "نحن نقدم أفضل العقارات السكنية والتجارية في جميع أنحاء العراق. خبرتنا الممتدة لسنوات تضمن لك الحصول على عقار أحلامك بأفضل قيمة وبإجراءات قانونية موثوقة.",
  companyDescriptionEn: "We provide the best residential and commercial properties across Iraq. Our years of active expertise ensure you secure your dream property with elite value and verified legal safety.",
  defaultLanguage: "ar"
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    titleAr: "فيلا ملكية فاخرة بتصميم حديث في المنصور",
    titleEn: "Luxury Royal Villa with Modern Design in Al-Mansour",
    price: 650000000,
    city: "Baghdad",
    type: "villa",
    descriptionAr: "فيلا راقية تقع في قلب منطقة المنصور المرموقة. تتميز بمساحات واسعة، حديقة مشجرة جميلة، مسبح خاص، وتصميم معماري معاصر مطلي بالمرمر التركي الممتاز. مجهزة بالكامل بأنظمة التبريد الذكي والحماية الأمنية المتكاملة.",
    descriptionEn: "Exclusive luxury villa situated in the heart of the prestigious Al-Mansour neighborhood. Highlights include soaring ceilings, beautiful landscaped gardens, a private swimming pool, and pristine Turkish marble finishes. Fully integrated smart air conditioning and high-end security.",
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    createdAt: "2026-05-18T10:00:00Z"
  },
  {
    id: "prop-2",
    titleAr: "شقة بنتهاوس رائعة في أبراج إمباير وورلد",
    titleEn: "Stunning Penthouse Apartment in Empire World Towers",
    price: 185000000,
    city: "Erbil",
    type: "apartment",
    descriptionAr: "شقة بنتهاوس متكاملة ومؤثثة بأرقى التصاميم العالمية في مجمع إمباير السكني الشهير. إطلالات بانورامية خلابة على مدينة أربيل وجبل كورك، مع خدمة أمنية على مدار الساعة ومواقف سيارات خاصة.",
    descriptionEn: "Lavishly furnished penthouse apartment in the iconic Empire World development. Breathtaking panoramic views of Erbil city and Korek Mountain, complete with 24/7 concierge, private parking, and premium fitness center access.",
    bedrooms: 2,
    bathrooms: 2,
    area: 165,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    createdAt: "2026-05-19T14:30:00Z"
  },
  {
    id: "prop-3",
    titleAr: "منزل عائلي فسيح بتصميم تراثي أصيل في الكرادة",
    titleEn: "Spacious Multi-Story Family House in Karrada",
    price: 380000000,
    city: "Baghdad",
    type: "house",
    descriptionAr: "بيت عائلي مميز بموقع هادئ وآمن في منطقة الكرادة القريبة من نهر دجلة. يضم صالات استقبال واسعة، مطبخاً كبيراً بتصميم كلاسيكي، وغرف نوم مريحة ومقاومة للحرارة مع طاقم حدائق خلاب.",
    descriptionEn: "Distinctive multi-story family house nestled in a calm, highly secure street in Karrada, adjacent to the Tigris River. Features grand reception halls, a rustic fully insulated kitchen, thermal window glass, and scenic private courtyards.",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    createdAt: "2026-05-15T08:15:00Z"
  },
  {
    id: "prop-4",
    titleAr: "أرض سكنية نادرة في واجهة الجادرية على النهر",
    titleEn: "Prime Residential Riverfront Land Plot in Jadriya",
    price: 980000000,
    city: "Baghdad",
    type: "land",
    descriptionAr: "فرصة استثمارية ذهبية لشراء قطعة أرض سكنية بمساحة ممتازة في منطقة الجادرية الراقية. الأرض مرخصة بالكامل للبناء السكني ومطلة مباشرة على الضفة الهادئة في نهر دجلة.",
    descriptionEn: "A golden investment opportunity to secure a high-value residential plot in Jadriya’s premium riverfront zone. Clean title deeds, fully zoned for luxury residential build with direct view over the majestic Tigris River.",
    bedrooms: 0,
    bathrooms: 0,
    area: 550,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    createdAt: "2026-05-10T12:00:00Z"
  },
  {
    id: "prop-5",
    titleAr: "فيلا مودرن مع مسبح خاص في البراضعية",
    titleEn: "Contemporary Villa with Swimming Pool in Al-Buradiyah",
    price: 520000000,
    city: "Basra",
    type: "villa",
    descriptionAr: "فيلا استثنائية حديثة البناء في أكثر أحياء البصرة رقياً وهدوءاً. تتميز بالبناء المتين المقاوم للمناخات الحارة، فناء خلفي واسع مع حوض سباحة مظلل ونظام فلترة ذكي، بالإضافة إلى صالات مفتوحة واسعة.",
    descriptionEn: "Newly built exceptional contemporary villa located in Basra's premium residential area, Al-Buradiyah. Highly insulated double brick construction, gorgeous backyard with custom shaded pool, and flowing open-plan interiors.",
    bedrooms: 4,
    bathrooms: 4,
    area: 360,
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    createdAt: "2026-05-17T09:40:00Z"
  },
  {
    id: "prop-6",
    titleAr: "شقة سكنية راقية في واحة بختياري",
    titleEn: "Elegant Residential Apartment in Bakhtiary Oasis",
    price: 215000000,
    city: "Erbil",
    type: "apartment",
    descriptionAr: "شقة سكنية فاخرة تقع في موقع مميز في بختياري، أربيل. مجهزة بنوافذ مزدوجة عازلة للصوت، تدفئة وتبريد مركزي، مطبخ مجهز بأحدث الأجهزة الغربية، وتشطيبات راقية من الخشب السويدي الممتاز وبلاط الجرانيت.",
    descriptionEn: "Highly sophisticated modern apartment in the exclusive Bakhtiary area of Erbil. Equipped with double-glazed acoustic windows, central climate response, state-of-the-art Western open kitchen, and Turkish marble tile work.",
    bedrooms: 3,
    bathrooms: 3,
    area: 195,
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    createdAt: "2026-05-16T11:20:00Z"
  },
  {
    id: "prop-7",
    titleAr: "فيلا فخمة ثلاث طوابق في ديرم سيتي",
    titleEn: "Elite Triple-Storey Mansion in Dream City",
    price: 490000000,
    city: "Erbil",
    type: "villa",
    descriptionAr: "منزل فخم يمثل تعريف الرفاهية في منطقة ديرم سيتي الأمنية المغلقة. يحتوي على ثلاث طوابق بتوزيع الغرف المثالي، قاعة سينما منزلية خاصة، صالة رياضية صغيرة، وحائط زجاجي كامل يطل على الحديقة.",
    descriptionEn: "Elite three-story residence demonstrating pure architectural grandeur in Dream City, Erbil. Features private home cinema basement setup, gym room, full double-height curtain walls, and meticulous garden landscaping.",
    bedrooms: 4,
    bathrooms: 5,
    area: 320,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    createdAt: "2026-05-14T17:00:00Z"
  },
  {
    id: "prop-8",
    titleAr: "منزل مريح بتشطيبات ممتازة في حي الزهور",
    titleEn: "Cozy Family House with Premium Finishes in Al-Zuhour",
    price: 255000000,
    city: "Mosul",
    type: "house",
    descriptionAr: "بيت عائلي مريح في موقع هادئ للغاية بحي الزهور في الجانب الأيسر من مدينة الموصل. المنزل تم ترميمه بالكامل وتشطيبه باستخدام مواد عالية الجودة وبناء رصين مع كراج سيارات.",
    descriptionEn: "A cozy, freshly restored family house in a highly secure block in Al-Zuhour district, East Mosul. Clean layout featuring durable Iraqi clay brick structures, parking space, and modern plumbing setup.",
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    images: [
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    createdAt: "2026-05-13T10:15:00Z"
  },
  {
    id: "prop-9",
    titleAr: "شقة سكنية حديثة ومؤثثة بالقرب من العتبة المقدسة",
    titleEn: "Modern Fully Furnished Apartment near the Shrines",
    price: 135000000,
    city: "Karbala",
    type: "apartment",
    descriptionAr: "شقة فندقية ممتازة ومفروشة بالكامل بموقع استثنائي في كربلاء المقدسة، تبعد دقائق معدودة سيراً عن الروضة الحسينية. مثالية جداً كاستثمار سياحي أو عائلي.",
    descriptionEn: "Highly desirable hotel-standard apartment situated in the holy city of Karbala, only brief walking distance to the historic shrines. Ideal investment for families or seasonal religious tourism.",
    bedrooms: 2,
    bathrooms: 2,
    area: 115,
    images: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560185013-ae1b44d186b5?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    createdAt: "2026-05-12T08:00:00Z"
  },
  {
    id: "prop-10",
    titleAr: "فيلا واسعة بتصميم كلاسيكي في الغدير",
    titleEn: "Grand Classical Style Villa in Al-Ghadir neighborhood",
    price: 440000000,
    city: "Baghdad",
    type: "villa",
    descriptionAr: "فيلا واسعة بتصميم فخم ومهيب مستوحى من الهندسة اللندنية الكلاسيكية في منطقة الغدير. تشمل صالونات استقبال منفصلة للضيوف وغرف معيشة مريحة جداً مع باحة وقوف تسع لثلاث سيارات.",
    descriptionEn: "Grand, stately villa displaying refined architectural elegance in Baghdad's established Al-Ghadir area. Includes separate guest parlors, private family lounge, and a front garage with space for 3 vehicles.",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    createdAt: "2026-05-11T16:45:00Z"
  },
  {
    id: "prop-11",
    titleAr: "أرض تجارية استراتيجية على الشارع العام في واجهة البصرة",
    titleEn: "Strategic Retail Commercial Land on Basra Main Boulevard",
    price: 820000000,
    city: "Basra",
    type: "land",
    descriptionAr: "قطعة أرض تجارية برقم طابو ملك صرف، تقع مباشرة على الشارع التجاري الرئيسي وممتازة لبناء مجمع طبي أو تجاري متعدد الأدوار. منطقة حيوية ذات عوائد استثمارية هائلة.",
    descriptionEn: "Prime commercial land plot with absolute clear freehold deeds, located right on Basra’s bustling executive highway. Perfectly suited for high-density medical center or multi-story showroom build.",
    bedrooms: 0,
    bathrooms: 0,
    area: 450,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    createdAt: "2026-05-09T13:10:00Z"
  },
  {
    id: "prop-12",
    titleAr: "منزل عائلي هادئ ومتين البناء في كربلاء",
    titleEn: "Sturdy & Secure Family House in Calm Karbala District",
    price: 210000000,
    city: "Karbala",
    type: "house",
    descriptionAr: "بناء رصين بتصميم عراقي كلاسيكي في حي سكني منظم وهادئ جداً في كربلاء. البيت يتمتع بإمدادات مستمرة للمياه والكهرباء ومنطقة مرصوفة بالكامل بالكونكريت المتميز.",
    descriptionEn: "Highly solid, concrete slab construction layout following traditional Iraqi patterns. Situated in a well-organized family neighborhood in Karbala, benefit from reliable water/municipal electrical grid lines.",
    bedrooms: 3,
    bathrooms: 2,
    area: 175,
    images: [
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    createdAt: "2026-05-08T11:45:00Z"
  }
];

export const CITY_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  "Baghdad": { ar: "بغداد", en: "Baghdad" },
  "Basra": { ar: "البصرة", en: "Basra" },
  "Erbil": { ar: "أربيل", en: "Erbil" },
  "Mosul": { ar: "الموصل", en: "Mosul" },
  "Karbala": { ar: "كربلاء", en: "Karbala" }
};

export const TYPE_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  "apartment": { ar: "شقة", en: "Apartment" },
  "house": { ar: "منزل", en: "House" },
  "villa": { ar: "فيلا", en: "Villa" },
  "land": { ar: "أرض", en: "Land" }
};
