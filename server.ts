import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Increase body limit to support base64 uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure data and uploads directory exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to get filepath
const getFilepath = (filename: string) => path.join(DATA_DIR, filename);

// Read file safely, returning default if error/not legacy
const readJSONFile = <T>(filename: string, defaultVal: T): T => {
  const filepath = getFilepath(filename);
  if (!fs.existsSync(filepath)) {
    return defaultVal;
  }
  try {
    const raw = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading flat JSON file ${filename}:`, err);
    return defaultVal;
  }
};

// Write file safely
const writeJSONFile = <T>(filename: string, data: T): void => {
  const filepath = getFilepath(filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing flat JSON file ${filename}:`, err);
  }
};

// Seed Data
const SEED_SETTINGS = {
  logoTextAr: "العقار العراقي",
  logoTextEn: "Iraqi Estate",
  contactNumber: "+964 770 123 4567",
  whatsappNumber: "+9647701234567",
  companyDescriptionAr: "نحن نقدم أفضل العقارات السكنية والتجارية في جميع أنحاء العراق. خبرتنا الممتدة لسنوات تضمن لك الحصول على عقار أحلامك بأفضل قيمة وبإجراءات قانونية موثوقة.",
  companyDescriptionEn: "We provide the best residential and commercial properties across Iraq. Our years of active expertise ensure you secure your dream property with elite value and verified legal safety.",
  defaultLanguage: "ar"
};

const SEED_PROPERTIES = [
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
    createdAt: "2026-05-16T11:20:00Z"
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
    descriptionEn: "Strategic commercial land plot with absolute clear freehold deeds, located right on Basra’s bustling highway. Perfectly suited for high-density medical center or multi-story showroom build.",
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

// Initialize JSON files with seeds if they don't already exist
if (!fs.existsSync(getFilepath('settings.json'))) {
  writeJSONFile('settings.json', SEED_SETTINGS);
}
if (!fs.existsSync(getFilepath('properties.json')) || (() => {
  try {
    const data = JSON.parse(fs.readFileSync(getFilepath('properties.json'), 'utf-8'));
    return Array.isArray(data) && data.length < 12;
  } catch(e) { return true; }
})()) {
  writeJSONFile('properties.json', SEED_PROPERTIES);
}
if (!fs.existsSync(getFilepath('messages.json'))) {
  writeJSONFile('messages.json', []);
}
if (!fs.existsSync(getFilepath('media.json')) || (() => {
  try {
    const data = JSON.parse(fs.readFileSync(getFilepath('media.json'), 'utf-8'));
    return Array.isArray(data) && data.length < 10;
  } catch(e) { return true; }
})()) {
  const defaultMedia = Array.from(new Set(SEED_PROPERTIES.flatMap(p => p.images)));
  writeJSONFile('media.json', defaultMedia);
}
if (!fs.existsSync(getFilepath('activities.json'))) {
  const initialActivities = [
    {
      id: 'act-1',
      type: 'settings',
      textAr: "تم تثبيت النظام بنجاح وبدء تفعيل بوابة عقارات العراق والربط بالسيرفر السحابي",
      textEn: "System successfully installed and Iraq Real Estate connected to persistent cloud server API",
      timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },
    {
      id: 'act-2',
      type: 'add',
      textAr: "توليد العروض العقارية النموذجية من المحافظات العراقية على السيرفر المركزي تلقائياً",
      textEn: "Central cloud database populated with Iraq default properties automatically",
      timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    }
  ];
  writeJSONFile('activities.json', initialActivities);
}

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// -----------------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------------

// API: Image Base64 Upload -> Saves to physical file
app.post(['/api/upload', '/upload'], async (req, res) => {
  try {
    const { content, filename } = req.body;
    if (!content) {
      return res.status(400).json({ error: "No image content provided" });
    }

    const match = content.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: "Invalid base64 format. Expected 'data:image/...;base64,...'" });
    }

    const extension = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanName = filename ? filename.replace(/[^a-zA-Z0-9.-]/g, '_') : 'image';
    const finalFilename = `img-${Date.now()}-${Math.floor(Math.random() * 100000)}.${extension}`;
    const targetPath = path.join(UPLOADS_DIR, finalFilename);

    await fs.promises.writeFile(targetPath, buffer);
    const relativeUrl = `/uploads/${finalFilename}`;

    console.log(`[Upload API] Successfully saved uploaded file to ${targetPath}. Serving at ${relativeUrl}`);
    res.json({ url: relativeUrl });
  } catch (err: any) {
    console.error("[Upload API Error]", err);
    res.status(500).json({ error: err.message || "Failed to process image upload on the central server." });
  }
});

// PROPERTIES ENDPOINTS
app.get(['/api/properties', '/properties'], (req, res) => {
  const list = readJSONFile('properties.json', []);
  res.json(list);
});

app.post(['/api/properties', '/properties'], (req, res) => {
  try {
    const properties = readJSONFile<any[]>('properties.json', []);
    const newProperty = {
      ...req.body,
      id: req.body.id || 'prop-' + Date.now(),
      createdAt: req.body.createdAt || new Date().toISOString()
    };
    properties.unshift(newProperty);
    writeJSONFile('properties.json', properties);
    res.status(201).json(newProperty);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put(['/api/properties/:id', '/properties/:id'], (req, res) => {
  try {
    const { id } = req.params;
    const properties = readJSONFile<any[]>('properties.json', []);
    const idx = properties.findIndex(p => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Property not found" });
    }
    properties[idx] = { ...properties[idx], ...req.body };
    writeJSONFile('properties.json', properties);
    res.json(properties[idx]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(['/api/properties/:id', '/properties/:id'], (req, res) => {
  try {
    const { id } = req.params;
    const properties = readJSONFile<any[]>('properties.json', []);
    const filtered = properties.filter(p => p.id !== id);
    writeJSONFile('properties.json', filtered);
    res.json({ success: true, message: `Property ${id} deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SETTINGS ENDPOINTS
app.get(['/api/settings', '/settings'], (req, res) => {
  const currentSettings = readJSONFile('settings.json', SEED_SETTINGS);
  res.json(currentSettings);
});

app.put(['/api/settings', '/settings'], (req, res) => {
  try {
    writeJSONFile('settings.json', req.body);
    res.json(req.body);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MESSAGES ENDPOINTS
app.get(['/api/messages', '/messages'], (req, res) => {
  const msgs = readJSONFile('messages.json', []);
  res.json(msgs);
});

app.post(['/api/messages', '/messages'], (req, res) => {
  try {
    const msgs = readJSONFile<any[]>('messages.json', []);
    const newMsg = {
      ...req.body,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    msgs.unshift(newMsg);
    writeJSONFile('messages.json', msgs);
    res.status(201).json(newMsg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(['/api/messages', '/messages'], (req, res) => {
  try {
    writeJSONFile('messages.json', []);
    res.json({ success: true, message: "All messages purged safely" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ACTIVITIES ENDPOINTS
app.get(['/api/activities', '/activities'], (req, res) => {
  const acts = readJSONFile('activities.json', []);
  res.json(acts);
});

app.post(['/api/activities', '/activities'], (req, res) => {
  try {
    const acts = readJSONFile<any[]>('activities.json', []);
    const newAct = {
      ...req.body,
      id: 'act-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    acts.unshift(newAct);
    // limit of last 50
    const limitedActs = acts.slice(0, 50);
    writeJSONFile('activities.json', limitedActs);
    res.status(201).json(newAct);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MEDIA REPO ENDPOINTS
app.get(['/api/media', '/media'], (req, res) => {
  const list = readJSONFile('media.json', []);
  res.json(list);
});

app.post(['/api/media', '/media'], (req, res) => {
  try {
    const list = readJSONFile<string[]>('media.json', []);
    const { url } = req.body;
    if (url && !list.includes(url)) {
      list.unshift(url);
      writeJSONFile('media.json', list);
    }
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(['/api/media', '/media'], (req, res) => {
  try {
    const list = readJSONFile<string[]>('media.json', []);
    const { url } = req.body || req.query;
    if (url) {
      const filtered = list.filter(item => item !== url);
      writeJSONFile('media.json', filtered);
      res.json(filtered);
    } else {
      res.status(400).json({ error: "Missing url parameter" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------
// SPA Server & Vite Integration Middleware
// -----------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Iraq Estate Dev Server] running on http://localhost:${PORT} under environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
