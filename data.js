/* ================================================================
   PRINTHUB — data.js  ·  All catalogue, config & static data
   ================================================================ */

const CONFIG = {
  siteName: 'PrintHub',
  tagline: 'by C-Chu Media Ltd',
  phone1: '+234 901 559 9370',
  phone2: '+234 806 375 3209',
  whatsapp: '2348052929523',
  email: 'info@cchumedia.com',
  address: 'Suite 38, Mazfallah Shopping Complex, Karu, Abuja FCT',
  hours: 'Mon – Sat: 8:00 AM – 7:00 PM',
  wa: (msg) => `https://wa.me/2348052929523?text=${encodeURIComponent(msg)}`,
  currency: '₦',
  loyaltyRate: 0.02, // 2% of order value = points
};

const CATEGORIES = [
  { id:'all',       label:'All Products',          icon:'🛒',  count:65 },
  { id:'banners',   label:'Banners & Large Format', icon:'🏷️', count:8  },
  { id:'cards',     label:'Business Cards',         icon:'💼',  count:6  },
  { id:'flyers',    label:'Flyers & Leaflets',      icon:'📄',  count:5  },
  { id:'apparel',   label:'Branded Apparel',        icon:'👕',  count:7  },
  { id:'books',     label:'Book Publishing',        icon:'📚',  count:4  },
  { id:'signage',   label:'Signage & Installation', icon:'🪧', count:5  },
  { id:'souvenirs', label:'Souvenirs & Gifts',      icon:'🎁',  count:6  },
  { id:'stickers',  label:'Stickers & Labels',      icon:'🏷️', count:4  },
  { id:'events',    label:'Event Materials',        icon:'🎪',  count:5  },
  { id:'campaign',  label:'Campaign Materials',     icon:'🗳️', count:5  },
  { id:'nylon',     label:'Custom Nylon Bags',      icon:'🛍️', count:3  },
  { id:'packaging', label:'Packaging & Boxes',      icon:'📦',  count:4  },
  { id:'stationery',label:'Office Stationery',      icon:'📋',  count:3  },
];

const PRODUCTS = [
  // BANNERS
  { id:'p001', name:'Standard Roll-up Banner', cat:'banners', icon:'🏷️', basePrice:8000, origPrice:10000, rating:4.9, reviews:234, badge:'Bestseller', desc:'85×200cm · Single or double-sided · Includes aluminium stand. UV-resistant print, durable for indoor and outdoor events.', featured:true },
  { id:'p002', name:'Pull-up X Banner', cat:'banners', icon:'📢', basePrice:6000, origPrice:null, rating:4.8, reviews:156, badge:'Popular', desc:'60×160cm · Lightweight and portable · Ideal for exhibitions. Comes with carry bag.', featured:true },
  { id:'p003', name:'Flex Banner Print (per sqm)', cat:'banners', icon:'🎌', basePrice:5000, origPrice:null, rating:4.7, reviews:312, badge:'Sale', desc:'Any custom size · Outdoor-grade flex material · UV & weather resistant ink.', featured:false },
  { id:'p004', name:'Step & Repeat Backdrop', cat:'banners', icon:'🎭', basePrice:35000, origPrice:42000, rating:5.0, reviews:89, badge:'Premium', desc:'2×2m standard size · High resolution print · Red carpet event ready. Includes stand.', featured:true },
  { id:'p005', name:'Mesh/Perforated Banner', cat:'banners', icon:'🌬️', basePrice:12000, origPrice:null, rating:4.6, reviews:67, badge:null, desc:'Fence or window display · Wind resistant perforated mesh.', featured:false },
  { id:'p006', name:'Teardrop Feather Flag', cat:'banners', icon:'🎏', basePrice:18000, origPrice:22000, rating:4.8, reviews:43, badge:'New', desc:'4.5m outdoor wind flag · With ground spike · Full colour sublimation.', featured:false },
  { id:'p007', name:'Cloth Backdrop (Event)', cat:'banners', icon:'🎬', basePrice:22000, origPrice:28000, rating:4.9, reviews:55, badge:'Popular', desc:'3×2m fabric banner · Wrinkle-resistant · Luxury feel for events.', featured:false },
  { id:'p008', name:'Billboard Print (Flex)', cat:'banners', icon:'🏗️', basePrice:45000, origPrice:null, rating:4.7, reviews:34, badge:null, desc:'Large format billboard · Any size · Delivered rolled, ready for mounting.', featured:false },
  // CARDS
  { id:'p009', name:'Premium Business Cards (100pcs)', cat:'cards', icon:'💼', basePrice:3500, origPrice:5000, rating:4.9, reviews:567, badge:'Bestseller', desc:'100 pcs · 400gsm thick card · Glossy or matte finish · Double-sided full colour.', featured:true },
  { id:'p010', name:'Matte Laminated Cards (100pcs)', cat:'cards', icon:'🃏', basePrice:4500, origPrice:null, rating:4.8, reviews:234, badge:'Popular', desc:'100 pcs · Soft-touch matte lamination · Premium feel.', featured:false },
  { id:'p011', name:'Spot UV Business Cards (100pcs)', cat:'cards', icon:'✨', basePrice:7500, origPrice:10000, rating:4.9, reviews:123, badge:'Premium', desc:'100 pcs · Selective UV coating on design elements · Luxury texture.', featured:true },
  { id:'p012', name:'Folded Business Cards (100pcs)', cat:'cards', icon:'📎', basePrice:5000, origPrice:null, rating:4.7, reviews:89, badge:null, desc:'100 pcs · Folds to credit card size · Extra space for services.', featured:false },
  { id:'p013', name:'Rounded Corner Cards (100pcs)', cat:'cards', icon:'🪪', basePrice:4200, origPrice:null, rating:4.8, reviews:145, badge:null, desc:'100 pcs · 350gsm · Rounded corners for a modern look.', featured:false },
  { id:'p014', name:'Mini Business Cards (100pcs)', cat:'cards', icon:'🔖', basePrice:3000, origPrice:null, rating:4.6, reviews:78, badge:null, desc:'100 pcs · 55×35mm · Great for creatives and personal brands.', featured:false },
  // FLYERS
  { id:'p015', name:'A5 Flyers Full Colour (250pcs)', cat:'flyers', icon:'📄', basePrice:3000, origPrice:4000, rating:4.8, reviews:445, badge:'Bestseller', desc:'250 pcs · 130gsm coated · Double-sided full colour. Perfect for events.', featured:true },
  { id:'p016', name:'A4 Poster / Flyer (100pcs)', cat:'flyers', icon:'📋', basePrice:4500, origPrice:null, rating:4.7, reviews:234, badge:'Popular', desc:'100 pcs · 170gsm gloss · Vivid full colour · Single or double-sided.', featured:false },
  { id:'p017', name:'DL Leaflet / Trifold (250pcs)', cat:'flyers', icon:'📰', basePrice:5500, origPrice:7000, rating:4.8, reviews:156, badge:'Sale', desc:'250 pcs · Tri-fold or Z-fold · 150gsm coated.', featured:false },
  { id:'p018', name:'A6 Postcard Flyers (500pcs)', cat:'flyers', icon:'📬', basePrice:2500, origPrice:null, rating:4.7, reviews:189, badge:null, desc:'500 pcs · 350gsm postcard weight · Compact marketing.', featured:false },
  { id:'p019', name:'A3 Poster (50pcs)', cat:'flyers', icon:'🖼️', basePrice:6000, origPrice:null, rating:4.6, reviews:98, badge:null, desc:'50 pcs · 170gsm · Large and attention-grabbing.', featured:false },
  // APPAREL
  { id:'p020', name:'Branded Cotton T-Shirt', cat:'apparel', icon:'👕', basePrice:2500, origPrice:3500, rating:4.9, reviews:789, badge:'Bestseller', desc:'Per piece · 180gsm ringspun cotton · Screen print or heat transfer.', featured:true },
  { id:'p021', name:'Polo Shirt (Embroidery)', cat:'apparel', icon:'👔', basePrice:4500, origPrice:null, rating:4.8, reviews:234, badge:'Popular', desc:'Per piece · Pique cotton polo · Embroidered logo · Corporate uniforms.', featured:true },
  { id:'p022', name:'Baseball Cap (Print)', cat:'apparel', icon:'🧢', basePrice:2800, origPrice:4000, rating:4.7, reviews:167, badge:'Sale', desc:'Per piece · 6-panel structured cap · Front print or embroidery.', featured:false },
  { id:'p023', name:'Branded Hoodie', cat:'apparel', icon:'🧥', basePrice:6500, origPrice:null, rating:4.8, reviews:89, badge:'Premium', desc:'Per piece · Heavyweight fleece · Screen print or embroidery.', featured:false },
  { id:'p024', name:'Corporate Jacket', cat:'apparel', icon:'🥼', basePrice:9000, origPrice:12000, rating:4.8, reviews:56, badge:null, desc:'Per piece · Branded windbreaker or softshell jacket.', featured:false },
  { id:'p025', name:'Branded Vest / Bib', cat:'apparel', icon:'🦺', basePrice:3500, origPrice:null, rating:4.7, reviews:78, badge:null, desc:'Per piece · Reflective or plain · Screen print.', featured:false },
  { id:'p026', name:'Branded Apron', cat:'apparel', icon:'👨‍🍳', basePrice:4000, origPrice:null, rating:4.6, reviews:45, badge:null, desc:'Per piece · Canvas or poly cotton · Embroidered or printed logo.', featured:false },
  // BOOKS
  { id:'p027', name:'Perfect Bound Book', cat:'books', icon:'📚', basePrice:80000, origPrice:100000, rating:5.0, reviews:45, badge:'Premium', desc:'Full design + typesetting + print. 100–300 pages. Soft cover perfect binding.', featured:true },
  { id:'p028', name:'Spiral Bound Notebook', cat:'books', icon:'📓', basePrice:15000, origPrice:null, rating:4.8, reviews:123, badge:'Popular', desc:'50 pcs minimum · Custom cover design · A4 or A5.', featured:false },
  { id:'p029', name:'Saddle-Stitched Booklet', cat:'books', icon:'📒', basePrice:8000, origPrice:null, rating:4.7, reviews:89, badge:null, desc:'Any size · 8–48 pages · Full colour cover and interior.', featured:false },
  { id:'p030', name:'Hard Cover Book', cat:'books', icon:'📗', basePrice:150000, origPrice:null, rating:5.0, reviews:23, badge:'Luxury', desc:'Hardcover casebound · Premium finish · Full design + print.', featured:false },
  // SIGNAGE
  { id:'p031', name:'Acrylic Signage Board', cat:'signage', icon:'🪧', basePrice:45000, origPrice:60000, rating:4.9, reviews:67, badge:'Premium', desc:'Custom size · Wall or freestanding · Backlit or non-lit.', featured:true },
  { id:'p032', name:'Aluminium Composite Sign', cat:'signage', icon:'🔲', basePrice:25000, origPrice:null, rating:4.8, reviews:89, badge:'Popular', desc:'Outdoor durable ACP board · Any size · UV print · Mounted.', featured:false },
  { id:'p033', name:'3D Channel Lettering', cat:'signage', icon:'🔤', basePrice:80000, origPrice:null, rating:5.0, reviews:34, badge:'Premium', desc:'Illuminated or non-lit · Any font and colour · Fabricated metal letters.', featured:false },
  { id:'p034', name:'Foamboard / Foam Sign', cat:'signage', icon:'📌', basePrice:8000, origPrice:null, rating:4.6, reviews:112, badge:null, desc:'Lightweight foam board · Any size · Full colour print.', featured:false },
  { id:'p035', name:'Office Door Signs', cat:'signage', icon:'🚪', basePrice:5000, origPrice:null, rating:4.7, reviews:78, badge:null, desc:'Acrylic or metal plate · Custom text/logo · Multiple finish options.', featured:false },
  // SOUVENIRS
  { id:'p036', name:'Branded Ceramic Mug', cat:'souvenirs', icon:'☕', basePrice:2000, origPrice:2800, rating:4.8, reviews:345, badge:'Bestseller', desc:'Per piece · 11oz ceramic · Full colour sublimation print.', featured:true },
  { id:'p037', name:'Custom Tote Bag', cat:'souvenirs', icon:'👜', basePrice:1800, origPrice:null, rating:4.7, reviews:234, badge:'Popular', desc:'Per piece · Natural cotton canvas · Screen print one or both sides.', featured:false },
  { id:'p038', name:'Branded Pen', cat:'souvenirs', icon:'🖊️', basePrice:500, origPrice:700, rating:4.6, reviews:567, badge:'Sale', desc:'Per piece · Metal or plastic body · Laser engraved or pad printed logo.', featured:false },
  { id:'p039', name:'Branded Umbrella', cat:'souvenirs', icon:'☂️', basePrice:5000, origPrice:7000, rating:4.8, reviews:89, badge:null, desc:'Per piece · Full size with sleeve · Custom printed canopy.', featured:false },
  { id:'p040', name:'Branded Keyring', cat:'souvenirs', icon:'🔑', basePrice:800, origPrice:null, rating:4.5, reviews:234, badge:null, desc:'Per piece · Metal or acrylic · Laser engraved or printed logo.', featured:false },
  { id:'p041', name:'Executive Notebook Set', cat:'souvenirs', icon:'📝', basePrice:3500, origPrice:5000, rating:4.8, reviews:89, badge:'Premium', desc:'Per set · A5 notebook + pen · Branded box packaging.', featured:false },
  // STICKERS
  { id:'p042', name:'SAV Cut Stickers', cat:'stickers', icon:'🏷️', basePrice:4000, origPrice:null, rating:4.8, reviews:234, badge:'Popular', desc:'Any shape · Outdoor vinyl · Waterproof and UV resistant.', featured:false },
  { id:'p043', name:'Product Labels (Roll 500pcs)', cat:'stickers', icon:'🔖', basePrice:6000, origPrice:8000, rating:4.9, reviews:156, badge:'Bestseller', desc:'500 pcs per roll · Custom size · Gloss or matte lamination.', featured:true },
  { id:'p044', name:'Bumper / Car Stickers', cat:'stickers', icon:'🚗', basePrice:3000, origPrice:null, rating:4.6, reviews:89, badge:null, desc:'Custom size · Heavy duty vinyl · Weatherproof.', featured:false },
  { id:'p045', name:'Wall / Window Sticker', cat:'stickers', icon:'🪟', basePrice:5000, origPrice:null, rating:4.7, reviews:67, badge:null, desc:'Clear or white vinyl · Any size · Full colour.', featured:false },
  // EVENTS
  { id:'p046', name:'Conference ID Tags (50pcs)', cat:'events', icon:'🪪', basePrice:1500, origPrice:null, rating:4.7, reviews:234, badge:'Popular', desc:'50 pcs · Full colour PVC card · With printed lanyard.', featured:false },
  { id:'p047', name:'Event Programme Booklet (100pcs)', cat:'events', icon:'📋', basePrice:12000, origPrice:15000, rating:4.8, reviews:89, badge:null, desc:'100 pcs · A5 · Full colour cover + text pages · Saddle stitched.', featured:false },
  { id:'p048', name:'Backdrop + Red Carpet', cat:'events', icon:'🎬', basePrice:55000, origPrice:70000, rating:5.0, reviews:34, badge:'Premium', desc:'3×2m printed backdrop + 5m red carpet. Complete event entrance setup.', featured:true },
  { id:'p049', name:'Table Numbers & Placards', cat:'events', icon:'🍽️', basePrice:3000, origPrice:null, rating:4.6, reviews:78, badge:null, desc:'20 pcs · Acrylic or card base · Printed numbers or names.', featured:false },
  { id:'p050', name:'Waist Sash / Ribbon', cat:'events', icon:'🎗️', basePrice:2000, origPrice:null, rating:4.5, reviews:55, badge:null, desc:'Per piece · Satin or silk · Full colour print.', featured:false },
  // CAMPAIGN
  { id:'p051', name:'Campaign T-Shirts (Bulk)', cat:'campaign', icon:'🗳️', basePrice:2000, origPrice:2800, rating:4.8, reviews:234, badge:'Popular', desc:'Per piece · Bulk order pricing · 3-colour print available · Rush turnaround.', featured:true },
  { id:'p052', name:'Campaign Flyers (1000pcs)', cat:'campaign', icon:'📢', basePrice:15000, origPrice:20000, rating:4.9, reviews:156, badge:'Sale', desc:'1000 pcs A5 · Full colour · Fast 48hr turnaround available.', featured:false },
  { id:'p053', name:'Campaign Banners (Bulk)', cat:'campaign', icon:'📣', basePrice:6000, origPrice:null, rating:4.8, reviews:89, badge:null, desc:'Per banner · Any size · Full colour · Rush production available.', featured:false },
  { id:'p054', name:'Vehicle Branding / Decal', cat:'campaign', icon:'🚐', basePrice:25000, origPrice:null, rating:4.9, reviews:45, badge:'Premium', desc:'Full or partial vehicle wrap · Cars, buses and vans.', featured:false },
  { id:'p055', name:'Campaign Caps (Bulk)', cat:'campaign', icon:'🧢', basePrice:1800, origPrice:2500, rating:4.7, reviews:123, badge:null, desc:'Per piece · Front print · Multiple colours · Rush available.', featured:false },
  // NYLON
  { id:'p056', name:'Custom Nylon Bag', cat:'nylon', icon:'🛍️', basePrice:3500, origPrice:null, rating:4.7, reviews:123, badge:null, desc:'Per piece · Woven nylon · Any colour · Logo print.', featured:false },
  { id:'p057', name:'PP Woven Bag', cat:'nylon', icon:'🧺', basePrice:2800, origPrice:null, rating:4.6, reviews:89, badge:null, desc:'Per piece · Polypropylene woven material · Reusable · Full colour print.', featured:false },
  { id:'p058', name:'Jute/Raffia Gift Bag', cat:'nylon', icon:'🎁', basePrice:2200, origPrice:null, rating:4.6, reviews:67, badge:null, desc:'Per piece · Natural jute or raffia · Branded ribbon and tag.', featured:false },
  // PACKAGING
  { id:'p059', name:'Custom Gift Box', cat:'packaging', icon:'📦', basePrice:5000, origPrice:7000, rating:4.8, reviews:89, badge:'Popular', desc:'Custom size · Full colour print · Rigid or folding box.', featured:false },
  { id:'p060', name:'Product Packaging Box', cat:'packaging', icon:'🗃️', basePrice:8000, origPrice:null, rating:4.7, reviews:67, badge:null, desc:'Custom size · Corrugated or rigid board · Full colour print.', featured:false },
  { id:'p061', name:'Branded Envelope (100pcs)', cat:'packaging', icon:'✉️', basePrice:4000, origPrice:null, rating:4.6, reviews:78, badge:null, desc:'100 pcs · DL or A4 size · Printed with company logo.', featured:false },
  { id:'p062', name:'Mailer / Delivery Box', cat:'packaging', icon:'📮', basePrice:6000, origPrice:null, rating:4.7, reviews:45, badge:null, desc:'Custom size · E-commerce optimised · Full colour print.', featured:false },
  // STATIONERY
  { id:'p063', name:'Letterhead Printed (100pcs)', cat:'stationery', icon:'📋', basePrice:8000, origPrice:null, rating:4.8, reviews:234, badge:'Popular', desc:'100 sheets · A4 · Full colour · 90gsm quality paper.', featured:false },
  { id:'p064', name:'Company Stamp', cat:'stationery', icon:'🔏', basePrice:5000, origPrice:null, rating:4.7, reviews:156, badge:null, desc:'Self-inking rubber stamp · Custom text and logo · Includes ink.', featured:false },
  { id:'p065', name:'Company Profile Design & Print', cat:'stationery', icon:'📑', basePrice:25000, origPrice:null, rating:4.9, reviews:78, badge:'Premium', desc:'4–8 page company profile · Design + print · 10 copies.', featured:true },
];

const SIZES = { 'A6':0.55,'A5':0.7,'A4':1.0,'A3':1.4,'A2':2.0,'A1':2.8,'A0':4.0,'Custom':1.3 };
const MATERIALS = { 'Glossy':1.0,'Matte':1.1,'Silk':1.15,'Uncoated':0.92,'Kraft':1.05,'Canvas':1.3,'Vinyl':1.25 };
const FINISHING = { 'None':1.0,'Lamination':1.2,'UV Spot':1.35,'Foiling':1.6,'Embossing':1.5,'Die-Cut':1.4 };
const TURNAROUND = { 'Standard (5–7 days)':1.0,'Express (3 days)':1.2,'Rush (24 hours)':1.5 };

const BULK_DISCOUNTS = [
  { min:1000, rate:0.20 },{ min:500, rate:0.15 },
  { min:200,  rate:0.10 },{ min:100, rate:0.05 },
  { min:0,    rate:0    },
];

const PARTNERS = ['EFCC','FRSC','NAMA','Living Faith Church','Labour Party','ADC Party','Hallmark Insurance','CIRA Juice','Fairplay Hotel','Whiteball Lounge','Glory Intl School','Highgrade School'];

const TESTIMONIALS = [
  { initials:'MT', name:'Mama Tiara', role:'Event Organiser, Abuja', text:'"C-Chu Media delivered our event banners and branded shirts with incredible quality. Everything was ready ahead of schedule."', rating:5 },
  { initials:'LL', name:'Lawrence Luke', role:'Business Owner, Abuja', text:'"From business cards to our office signage — C-Chu Media handled everything professionally. Outstanding quality."', rating:5 },
  { initials:'AO', name:'Adeola Okafor', role:'Author, Lagos', text:'"I published my first book with C-Chu Media and the result was stunning. The team are true professionals."', rating:5 },
  { initials:'BK', name:'Barrister Kalu', role:'Legal Practitioner, Abuja', text:'"Ordered 500 business cards and 100 letterheads. The quality was exceptional — you can feel the weight and finish."', rating:5 },
  { initials:'SA', name:'Sister Amaka', role:'Parish Secretary, FCT', text:'"We print our weekly bulletins here. Consistent quality every time, and they always meet our tight deadlines."', rating:5 },
  { initials:'DE', name:'Daniel Emeka', role:'Campaign Manager, Abuja', text:'"Produced 10,000 flyers in 48 hours and the quality was immaculate. Real professionals under pressure."', rating:5 },
];

const ORDER_STATUSES = ['Pending Payment','Confirmed','Design Review','In Production','Ready for Pickup','Shipped','Delivered','Cancelled'];

const FAQ_DATA = [
  { cat:'Ordering', q:'How do I place an order?', a:'Browse our products, configure your specifications (size, material, quantity, finishing), upload your artwork or request design, add to cart and checkout via WhatsApp or account.' },
  { cat:'Ordering', q:'What is the minimum order quantity?', a:'Most products start from 50 units. Some items like signage can be ordered from 1 unit. The configurator shows the minimum for each product.' },
  { cat:'Files', q:'What file formats do you accept?', a:'We accept PDF, AI, PSD, PNG, and JPG. PDF is our preferred format. Maximum file size is 50MB. Ensure 300 DPI at final print size and 3mm bleed on all sides.' },
  { cat:'Files', q:'What colour mode should I use?', a:'Use CMYK colour mode for all print files. RGB colours will be converted to CMYK during production, which can cause colour shifts. For exact Pantone matching, contact us.' },
  { cat:'Turnaround', q:'What are your standard turnaround times?', a:'Standard: 5–7 business days. Express: 3 business days. Rush: 24 hours from proof approval. Orders after 3PM are processed the next business day.' },
  { cat:'Payment', q:'What payment methods do you accept?', a:'We accept bank transfers (all Nigerian banks), Paystack (cards, USSD, bank transfer), and cash at our Karu office. B2B clients can apply for credit terms.' },
  { cat:'Delivery', q:'What are your delivery options?', a:'Free pickup at our Karu, Abuja office. Abuja delivery ₦2,000 flat. Nationwide courier via GIG Logistics or DHL — rates vary by weight and destination.' },
  { cat:'Quality', q:'What is your quality guarantee?', a:'If your print doesn\'t match the approved proof, we reprint free of charge. Our quality team inspects every job before dispatch. 99.2% satisfaction rate since 2011.' },
  { cat:'B2B', q:'Do you offer bulk / corporate pricing?', a:'Yes. Discounts: 5% off 100+ units, 10% off 200+, 15% off 500+, 20% off 1,000+. For recurring corporate accounts we offer custom pricing. Contact us to set up a B2B account.' },
  { cat:'Returns', q:'What is your reprint policy?', a:'We reprint free if the print doesn\'t match the approved proof, there is a printing defect, or the wrong product was produced. We do not reprint for errors in customer-approved artwork.' },
];

// Helper functions
function formatNaira(n) { return '₦' + Math.round(n).toLocaleString('en-NG'); }
function getBulkDiscount(qty) {
  for (const d of BULK_DISCOUNTS) if (qty >= d.min) return d.rate;
  return 0;
}
function calcProductPrice(basePrice, sizeKey, materialKey, finishingKey, turnaroundKey, qty) {
  const s = SIZES[sizeKey] || 1;
  const m = MATERIALS[materialKey] || 1;
  const f = FINISHING[finishingKey] || 1;
  const t = TURNAROUND[turnaroundKey] || 1;
  const unit = basePrice * s * m * f * t;
  const disc = getBulkDiscount(qty);
  const discUnit = unit * (1 - disc);
  return { unit: discUnit, total: Math.round(discUnit * qty), discount: disc };
}
