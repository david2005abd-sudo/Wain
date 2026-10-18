import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as maplibregl from 'maplibre-gl';
import { Map as LibreMap } from 'maplibre-gl';
import { mapStyle } from '../lib/mapStyle';
import { CATEGORIES, Coord, MAP_LABELS, PLACES, Place, Report, REPORT_TYPES, RouteInfo, TRAFFIC_LINES, project } from '../lib/data';
import { useApp } from '../lib/store';
import { Icon, T, ui } from './ui';
export type MapProps = { center: Coord; zoom: number; category: string; filter: string; route?: RouteInfo | null; onPlace: (p: Place) => void; onReport: (r: Report) => void; onMove?: (c: Coord, zoom: number) => void; onReady?: () => void };
export default function MapSurface({ center, zoom, category, filter, route, onPlace, onReport, onMove, onReady }: MapProps) {
 const { dark, reports, traffic, location, colors } = useApp();
 const host = useRef<HTMLDivElement>(null); const map = useRef<LibreMap | null>(null);
 const [loaded, setLoaded] = useState(false);
 const [size, setSize] = useState({ width: 800, height: 800 });
 const [initial] = useState(() => ({ center, zoom, dark }));
 const [viewport, setViewport] = useState(() => ({ ...center, zoom }));
 const lastDark = useRef(dark);
 const callbacks = useRef({ onMove, onReady });
 useEffect(() => { callbacks.current = { onMove, onReady }; }, [onMove, onReady]);
 useEffect(() => {
  if (!host.current) return;
  const style = document.createElement('style'); style.innerHTML = '.maplibregl-map{position:relative;overflow:hidden;font:12px sans-serif}.maplibregl-canvas{position:absolute;left:0;top:0;outline:none}.maplibregl-canvas-container.maplibregl-interactive{cursor:grab;touch-action:none}.maplibregl-canvas-container.maplibregl-interactive:active{cursor:grabbing}.maplibregl-control-container{display:none}'; document.head.appendChild(style);
  try {
   if (maplibregl.getRTLTextPluginStatus() === 'unavailable') maplibregl.setRTLTextPlugin('https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js', true).catch(() => {});
   const m = new maplibregl.Map({ container: host.current, style: mapStyle(initial.dark), center: [initial.center.longitude, initial.center.latitude], zoom: initial.zoom, attributionControl: false, minZoom: 5, maxZoom: 18, maxBounds: [[38.6,28.3],[49.6,38.0]], pitchWithRotate: false, dragRotate: false });
   map.current = m;
   m.touchZoomRotate.disableRotation();
   m.touchPitch.disable();
   const syncViewport = () => { const c = m.getCenter(); setViewport({ longitude: c.lng, latitude: c.lat, zoom: m.getZoom() }); };
   m.on('load', () => { setLoaded(true); syncViewport(); callbacks.current.onReady?.(); });
   m.on('move', syncViewport);
   m.on('moveend', () => { const c = m.getCenter(); callbacks.current.onMove?.({ latitude: c.lat, longitude: c.lng }, m.getZoom()); });
   const observer = new ResizeObserver(() => m.resize()); observer.observe(host.current);
   return () => { observer.disconnect(); m.remove(); map.current = null; style.remove(); };
  } catch { return () => style.remove(); }
 }, [initial]);
 useEffect(() => { map.current?.flyTo({ center: [center.longitude, center.latitude], zoom, duration: 800, essential: true }); }, [center.latitude, center.longitude, zoom]);
 useEffect(() => { if (map.current && loaded && lastDark.current !== dark) { lastDark.current = dark; map.current.setStyle(mapStyle(dark)); } }, [dark, loaded]);
 useEffect(() => {
  const m = map.current; if (!m || !loaded) return;
  const apply = () => {
   const features: any[] = traffic ? TRAFFIC_LINES.map(t => ({ type: 'Feature', properties: { color: t.color, width: 4 }, geometry: { type: 'LineString', coordinates: t.points } })) : [];
   if (route) features.push({ type: 'Feature', properties: { color: '#17B6D0', width: 7 }, geometry: { type: 'LineString', coordinates: route.coordinates } });
   const data: any = { type: 'FeatureCollection', features };
   const source = m.getSource('wein-lines') as any;
   if (source) source.setData(data); else { m.addSource('wein-lines', { type: 'geojson', data }); m.addLayer({ id: 'wein-lines-layer', type: 'line', source: 'wein-lines', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get','color'], 'line-width': ['get','width'], 'line-opacity': .9 } }); }
  };
  if (m.isStyleLoaded()) apply(); else m.once('style.load', apply);
 }, [loaded, traffic, route, dark]);
 useEffect(() => { if (route && map.current) { const bounds = new maplibregl.LngLatBounds(); route.coordinates.forEach(p => bounds.extend([p[0], p[1]])); map.current.fitBounds(bounds, { padding: { top: 130, bottom: 170, left: 80, right: 80 }, maxZoom: 15, duration: 800 }); } }, [route]);
 const pos = (c: Coord) => {
  if (loaded) { const p = maplibregl.MercatorCoordinate.fromLngLat([c.longitude, c.latitude]); const origin = maplibregl.MercatorCoordinate.fromLngLat([viewport.longitude, viewport.latitude]); const scale = 512 * Math.pow(2, viewport.zoom); return { left: size.width / 2 + (p.x - origin.x) * scale, top: size.height / 2 + (p.y - origin.y) * scale }; }
  const p = project(c); const scale = Math.max(size.width / 1536, size.height / 1536);
  return { left: size.width / 2 + (p.x - 768) * scale, top: size.height / 2 + (p.y - 768) * scale };
 };
 const inView = (c: Coord) => { const p = pos(c); return p.left > -50 && p.left < size.width + 50 && p.top > -50 && p.top < size.height + 50; };
 const visiblePlaces = PLACES.filter(p => category ? p.category === category : ['zawraa','mall','mutanabi','parking','hospital'].includes(p.id));
 return <View style={StyleSheet.absoluteFill} onLayout={e => setSize(e.nativeEvent.layout)}>
  <Image source={require('../assets/maps/baghdad.webp')} style={StyleSheet.absoluteFill} contentFit="cover" />
  {React.createElement('div', { ref: host, style: { position: 'absolute', inset: 0, opacity: loaded ? 1 : 0 } })}
  <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
   {MAP_LABELS.filter(inView).map((l,i) => <View key={'l'+i} pointerEvents="none" style={[styles.label, pos(l)]}><T style={{ fontSize: l.major ? 14 : 11, fontFamily: l.major ? 'ArabicMedium' : 'Arabic', color: l.green ? '#819573' : l.water ? '#6CA8B0' : dark ? '#ABBBB7' : '#8C9488', textAlign: 'center', transform: l.water ? [{ rotate: '-28deg' }] : [] }}>{l.text}</T></View>)}
   {visiblePlaces.filter(inView).map(p => { const c = CATEGORIES.find(v => v.id === p.category); return <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={p.name} onPress={() => onPlace(p)} style={[styles.place, pos(p)]}><View style={[styles.placeIcon, { backgroundColor: c?.background || '#F7FBF3', borderColor: c?.background || '#DDE7D1' }]}><Icon name={p.icon} color={c?.color || '#91A077'} size={15} /></View><T style={styles.placeText}>{p.name}</T></Pressable>; })}
   {reports.filter(r => filter === 'all' || r.type === filter).filter(inView).map(r => { const rt = REPORT_TYPES.find(v => v.id === r.type)!; return <Pressable key={r.id} accessibilityRole="button" accessibilityLabel={r.title+'، '+r.road} onPress={() => onReport(r)} style={[styles.report, ui.shadow, pos(r), { backgroundColor: rt.bg }]}><Icon name={rt.icon} size={21} color={rt.color} /><View style={[styles.pinTail, { backgroundColor: rt.bg }]} /></Pressable>; })}
   {inView(location) && <View pointerEvents="none" style={[styles.current, pos(location)]}><View style={styles.currentAura} /><View style={styles.currentDot}><Icon name="navigate" color="#FFFFFF" size={25} /></View><View style={[styles.you, { backgroundColor: colors.surface }]}><T weight="bold" style={{ fontSize: 10, textAlign: 'center' }}>نقطة الانطلاق</T></View></View>}
   {!loaded && <View style={{ position: 'absolute', top: 90, left: 20, backgroundColor: colors.surface, padding: 7, borderRadius: 8 }}><T style={{ fontSize: 10, color: colors.muted }}>خريطة محفوظة · جاري الاتصال</T></View>}
  </View>
 </View>;
}
const styles = StyleSheet.create({
 label: { position: 'absolute', width: 150, marginLeft: -75, marginTop: -10 },
 place: { position: 'absolute', alignItems: 'center', gap: 4, marginLeft: -36, marginTop: -12, width: 72 },
 placeIcon: { width: 29, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
 placeText: { fontSize: 10, color: '#8A937D', textAlign: 'center', backgroundColor: '#F0F1EBB5', paddingHorizontal: 3, borderRadius: 4 },
 report: { position: 'absolute', width: 43, height: 43, marginLeft: -21, marginTop: -43, borderRadius: 15, borderWidth: 3, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
 pinTail: { position: 'absolute', width: 9, height: 9, bottom: -6, transform: [{ rotate: '45deg' }], borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FFFFFF', zIndex: -1 },
 current: { position: 'absolute', width: 52, height: 52, marginLeft: -26, marginTop: -26, alignItems: 'center', justifyContent: 'center' },
 currentAura: { position: 'absolute', width: 96, height: 96, borderRadius: 50, backgroundColor: '#2FBBD522', borderWidth: 1, borderColor: '#2FBBD530' },
 currentDot: { width: 45, height: 45, borderRadius: 24, backgroundColor: '#24B9D0', borderWidth: 4, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#269BAD', shadowOffset: { width: 0, height: 3 }, shadowOpacity: .3, shadowRadius: 8 },
 you: { position: 'absolute', top: 60, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, width: 91 },
});
