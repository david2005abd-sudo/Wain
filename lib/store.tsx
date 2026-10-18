import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CITIES, Coord, Place, PLACES, Report, SEED_REPORTS, START } from './data';
const light = { bg: '#F5F7F8', surface: '#FFFFFF', ink: '#263844', muted: '#8D989F', line: '#EDF0F2', soft: '#F6F8F9', accent: '#27B9CE', accentSoft: '#E9F8FA', green: '#67AD91' };
const dark = { bg: '#15222B', surface: '#1E2D37', ink: '#ECF4F5', muted: '#93A5AF', line: '#30414C', soft: '#253641', accent: '#39C4D7', accentSoft: '#21444C', green: '#80C7A8' };
type AppContextValue = {
 colors: typeof light; dark: boolean; theme: string; setTheme: (v: string) => void;
 saved: Place[]; toggleSave: (p: Place) => void; addSaved: (p: Place) => void;
 reports: Report[]; addReport: (r: Report) => void; vote: (id: string) => void; voted: string[];
 recent: Place[]; remember: (p: Place) => void; location: Coord; setLocation: (c: Coord) => void;
 city: typeof CITIES[number]; setCity: (c: typeof CITIES[number]) => void;
 sound: boolean; setSound: (v: boolean) => void; traffic: boolean; setTraffic: (v: boolean) => void;
 notify: (message: string) => void; toast: string; ready: boolean;
 trips: { id: string; name: string; distance: string; date: string }[]; addTrip: (name: string, distance: string) => void;
};
const Context = createContext<AppContextValue>(null as any);
export function AppProvider({ children }: { children: ReactNode }) {
 const system = useColorScheme();
 const [theme, setTheme] = useState('light');
 const [saved, setSaved] = useState<Place[]>([PLACES[1], PLACES[2]]);
 const [reports, setReports] = useState<Report[]>(SEED_REPORTS);
 const [voted, setVoted] = useState<string[]>([]);
 const [recent, setRecent] = useState<Place[]>([PLACES[0], PLACES[1]]);
 const [location, setLocation] = useState<Coord>(START);
 const [city, setCity] = useState(CITIES[0]);
 const [sound, setSound] = useState(true);
 const [traffic, setTraffic] = useState(true);
 const [toast, setToast] = useState('');
 const [ready, setReady] = useState(false);
 const [trips, setTrips] = useState<AppContextValue['trips']>([]);
 useEffect(() => { AsyncStorage.getItem('wein-v1').then(raw => {
  if (raw) { const d = JSON.parse(raw); setSaved(d.saved || []); setReports(Array.isArray(d.reports) && d.reports.length ? d.reports : SEED_REPORTS); setRecent(d.recent || []); setTheme(d.theme || 'light'); setSound(d.sound ?? true); setTraffic(d.traffic ?? true); setTrips(d.trips || []); setVoted(d.voted || []); }
 }).catch(() => setToast('تعذر استعادة البيانات المحفوظة')).finally(() => setReady(true)); }, []);
 useEffect(() => { if (ready) AsyncStorage.setItem('wein-v1', JSON.stringify({ saved, reports, recent, theme, sound, traffic, trips, voted })).catch(() => setToast('تعذر حفظ التغييرات على الجهاز')); }, [saved, reports, recent, theme, sound, traffic, trips, voted, ready]);
 useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 4500); return () => clearTimeout(t); }, [toast]);
 const isDark = theme === 'dark' || (theme === 'system' && system === 'dark');
 const toggleSave = (p: Place) => setSaved(s => s.some(v => v.id === p.id) ? s.filter(v => v.id !== p.id) : [...s, p]);
 return <Context.Provider value={{ colors: isDark ? dark : light, dark: isDark, theme, setTheme, saved, toggleSave,
  addSaved: p => setSaved(s => [...s.filter(v => v.id !== p.id), p]), reports,
  addReport: r => { setReports(s => [r, ...s]); setToast('شكرًا إلك! تم حفظ بلاغك على هذا الجهاز'); }, voted,
  vote: id => { if (voted.includes(id)) return; setVoted(v => [...v, id]); setReports(rs => rs.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r)); setToast('تم تأكيد البلاغ، شكرًا لمساهمتك'); },
  recent, remember: p => setRecent(s => [p, ...s.filter(v => v.id !== p.id)].slice(0, 5)), location, setLocation, city, setCity,
  sound, setSound, traffic, setTraffic, notify: setToast, toast, ready, trips,
  addTrip: (name, distance) => setTrips(t => [{ id: Date.now().toString(), name, distance, date: new Date().toLocaleDateString('ar-IQ') }, ...t]),
 }}>{children}</Context.Provider>;
}
export const useApp = () => useContext(Context);
