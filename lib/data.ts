import trafficGeometry from '../assets/maps/traffic-geometry.json';
export type Coord = { latitude: number; longitude: number };
export type Place = Coord & { id: string; name: string; subtitle: string; category: string; icon: string; distance?: string };
export type Report = Coord & { id: string; type: string; title: string; road: string; time: string; votes: number; note?: string; own?: boolean; verified?: boolean };
export type RouteInfo = { distance: number; duration: number; coordinates: number[][]; steps: { instruction: string; distance: number }[]; live: boolean };
export const START: Coord = { latitude: 33.3156, longitude: 44.4008 };
export const CITIES = [
  { name: 'بغداد', latitude: 33.3215, longitude: 44.3880 },
  { name: 'البصرة', latitude: 30.5085, longitude: 47.7835 },
  { name: 'أربيل', latitude: 36.1911, longitude: 44.0092 },
  { name: 'الموصل', latitude: 36.3458, longitude: 43.1377 },
  { name: 'النجف', latitude: 32.0259, longitude: 44.3463 },
  { name: 'كربلاء', latitude: 32.6160, longitude: 44.0249 },
  { name: 'السليمانية', latitude: 35.5570, longitude: 45.4355 },
];
export const PLACES: Place[] = [
  { id: 'mall', name: 'بغداد مول', subtitle: 'الحارثية، شارع الكندي', category: 'shopping', icon: 'bag-handle-outline', latitude: 33.3129, longitude: 44.3492, distance: '٤.٨ كم' },
  { id: 'zawraa', name: 'متنزه الزوراء', subtitle: 'الكرخ، شارع الزيتون', category: 'park', icon: 'leaf-outline', latitude: 33.3137, longitude: 44.3763, distance: '٢.٤ كم' },
  { id: 'mutanabi', name: 'شارع المتنبي', subtitle: 'الرصافة، قرب جسر الشهداء', category: 'culture', icon: 'book-outline', latitude: 33.3424, longitude: 44.3894, distance: '٤.١ كم' },
  { id: 'fuel', name: 'محطة وقود الكرادة', subtitle: 'الكرادة، شارع أبو نؤاس', category: 'fuel', icon: 'car-sport-outline', latitude: 33.3058, longitude: 44.4190, distance: '٢.١ كم' },
  { id: 'restaurant', name: 'مطاعم شارع الرواد', subtitle: 'المنصور، شارع الرواد', category: 'food', icon: 'restaurant-outline', latitude: 33.3139, longitude: 44.3375, distance: '٥.٩ كم' },
  { id: 'parking', name: 'موقف ساحة التحرير', subtitle: 'الباب الشرقي، ساحة التحرير', category: 'parking', icon: 'car-outline', latitude: 33.3251, longitude: 44.4063, distance: '١.٣ كم' },
  { id: 'hospital', name: 'مستشفى مدينة الطب', subtitle: 'باب المعظم، شارع وزارة الصحة', category: 'hospital', icon: 'medkit-outline', latitude: 33.3534, longitude: 44.3834, distance: '٥.٢ كم' },
  { id: 'university', name: 'جامعة بغداد', subtitle: 'الجادرية، الحرم الجامعي', category: 'education', icon: 'school-outline', latitude: 33.2738, longitude: 44.3779, distance: '٦.٣ كم' },
  { id: 'shaheed', name: 'نصب الشهيد', subtitle: 'الرصافة، شارع فلسطين', category: 'culture', icon: 'camera-outline', latitude: 33.3437, longitude: 44.4451, distance: '٦.٢ كم' },
  { id: 'basra', name: 'كورنيش البصرة', subtitle: 'البصرة، شط العرب', category: 'park', icon: 'water-outline', latitude: 30.5103, longitude: 47.8507 },
  { id: 'erbil', name: 'قلعة أربيل', subtitle: 'أربيل، مركز المدينة', category: 'culture', icon: 'flag-outline', latitude: 36.1911, longitude: 44.0092 },
  { id: 'mosul', name: 'جامع النوري', subtitle: 'الموصل، المدينة القديمة', category: 'culture', icon: 'location-outline', latitude: 36.3430, longitude: 43.1261 },
];
export const CATEGORIES = [
  { id: 'fuel', name: 'وقود', icon: 'car-sport-outline', color: '#D59B37', background: '#FFF4DF' },
  { id: 'food', name: 'مطاعم', icon: 'restaurant-outline', color: '#E4856C', background: '#FEF0E9' },
  { id: 'parking', name: 'مواقف', icon: 'car-outline', color: '#5A89C5', background: '#EAF1FC' },
  { id: 'hospital', name: 'مستشفيات', icon: 'medkit-outline', color: '#A087C0', background: '#F2ECFA' },
];
export const REPORT_TYPES = [
  { id: 'traffic', name: 'ازدحام', icon: 'car-sport', color: '#DBA333', bg: '#FFF5DC' },
  { id: 'accident', name: 'حادث', icon: 'warning', color: '#E37C63', bg: '#FDF0E9' },
  { id: 'roadwork', name: 'أعمال طريق', icon: 'construct', color: '#9580B7', bg: '#F0ECF8' },
  { id: 'closure', name: 'طريق مغلق', icon: 'remove-circle', color: '#D86770', bg: '#FDECEE' },
  { id: 'hazard', name: 'خطر بالطريق', icon: 'alert-circle', color: '#CB984D', bg: '#FFF3DF' },
];
export const SEED_REPORTS: Report[] = [
  { id: 'r1', type: 'traffic', title: 'ازدحام متوسط', road: 'جسر الجمهورية', time: 'قبل ٣ دقائق', votes: 8, latitude: 33.3223, longitude: 44.4023, verified: true },
  { id: 'r2', type: 'roadwork', title: 'أعمال صيانة', road: 'شارع دمشق، العلاوي', time: 'قبل ٨ دقائق', votes: 5, latitude: 33.3335, longitude: 44.3722 },
  { id: 'r3', type: 'accident', title: 'حادث على جانب الطريق', road: 'شارع السعدون', time: 'قبل ١٢ دقيقة', votes: 12, latitude: 33.3168, longitude: 44.4153, verified: true },
  { id: 'r4', type: 'traffic', title: 'حركة بطيئة', road: 'شارع المنصور', time: 'قبل ١٥ دقيقة', votes: 3, latitude: 33.3202, longitude: 44.3470 },
];
export const TRAFFIC_LINES: { color: string; points: number[][] }[] = trafficGeometry;
export const MAP_LABELS = [
 { text: 'المنصور', latitude: 33.3221, longitude: 44.3370, major: true },
 { text: 'الحارثية', latitude: 33.3075, longitude: 44.3515, major: true },
 { text: 'العلاوي', latitude: 33.3348, longitude: 44.3774, major: true },
 { text: 'الكرادة', latitude: 33.3040, longitude: 44.4300, major: true },
 { text: 'الباب الشرقي', latitude: 33.3267, longitude: 44.4115, major: true },
 { text: 'الكرخ', latitude: 33.3408, longitude: 44.3685, major: true },
 { text: 'الرصافة', latitude: 33.3490, longitude: 44.4130, major: true },
 { text: 'المنطقة الخضراء', latitude: 33.3059, longitude: 44.3880, major: true },
 { text: 'متنزه الزوراء', latitude: 33.3173, longitude: 44.3694, green: true },
 { text: 'نهر دجلة', latitude: 33.3090, longitude: 44.4100, water: true },
 { text: 'نهر دجلة', latitude: 33.3390, longitude: 44.3891, water: true },
 { text: 'شارع دمشق', latitude: 33.3299, longitude: 44.3692 },
 { text: 'شارع أبو نؤاس', latitude: 33.3070, longitude: 44.4188 },
 { text: 'ساحة التحرير', latitude: 33.3248, longitude: 44.4070 },
];
export function project(c: Coord) {
 const x = (c.longitude + 180) / 360 * 16384;
 const y = (1 - Math.asinh(Math.tan(c.latitude * Math.PI / 180)) / Math.PI) / 2 * 16384;
 return { x: (x - 10209) * 256, y: (y - 6579) * 256 };
}
export function arabic(value: number | string) { return String(value).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]); }
export function normalize(s: string) { return s.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/[\u064B-\u065F]/g, '').toLowerCase(); }
