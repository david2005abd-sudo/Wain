import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Image } from 'expo-image';
import { mapStyle } from '../lib/mapStyle';
import { Coord, MAP_LABELS, PLACES, Place, Report, RouteInfo, TRAFFIC_LINES } from '../lib/data';
import { useApp } from '../lib/store';
import { Button, T } from './ui';
export type MapProps = { center: Coord; zoom: number; category: string; filter: string; route?: RouteInfo | null; onPlace: (p: Place) => void; onReport: (r: Report) => void; onMove?: (c: Coord, zoom: number) => void; onReady?: () => void };
export default function MapSurface(props: MapProps) {
 const { dark, reports, traffic, location, colors } = useApp();
 const ref = useRef<WebView<object>>(null);
 const [failed, setFailed] = useState(false);
 const [loaded, setLoaded] = useState(false);
 const [generation, setGeneration] = useState(0);
 const payload = { center: props.center, zoom: props.zoom, traffic, route: props.route, location, dark, style: mapStyle(dark), reports: reports.filter(r => props.filter === 'all' || r.type === props.filter), places: PLACES.filter(p => props.category ? p.category === props.category : ['zawraa','mall','mutanabi','parking'].includes(p.id)) };
 const [initial] = useState(() => ({ dark, center: props.center, zoom: props.zoom }));
 const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><link href="https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.css" rel="stylesheet"><style>body{margin:0;background:#edf0e8}#map{position:absolute;inset:0}.p{font:12px Arial;color:#71817a;text-align:center}.r{width:34px;height:34px;background:#fff4df;border:3px solid white;border-radius:14px;display:grid;place-items:center;font-size:20px;color:#d7a13d;box-shadow:0 3px 10px #24394420}.me{background:#23b9cf;color:white;border:4px solid white;border-radius:50%;height:35px;width:35px;display:grid;place-items:center;font-size:24px;box-shadow:0 0 0 14px #23b9cf25}</style></head><body><div id="map"></div><script>function send(data){window.ReactNativeWebView.postMessage(JSON.stringify(data));}var ready=false;setTimeout(()=>{if(!ready)send({failed:true})},18000);</script><script src="https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.js" onerror="send({failed:true})"></script><script>
 try {
  maplibregl.setRTLTextPlugin('https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',true);
  const map = new maplibregl.Map({container:'map',style:${JSON.stringify(mapStyle(initial.dark))},center:[${initial.center.longitude},${initial.center.latitude}],zoom:${initial.zoom},attributionControl:false,minZoom:5,maxZoom:18});
  let marks=[], currentDark=${initial.dark}, lastCenter='', lastRoute='';
  function update(d){
   if(!map.isStyleLoaded()){map.once('idle',()=>update(d));return;}
   if(currentDark!==d.dark){currentDark=d.dark;map.setStyle(d.style);map.once('style.load',()=>update(d));return;}
   const centerKey=JSON.stringify([d.center,d.zoom]);
   if(centerKey!==lastCenter){lastCenter=centerKey;map.flyTo({center:[d.center.longitude,d.center.latitude],zoom:d.zoom});}
   marks.forEach(m=>m.remove());marks=[];
   function marker(c,content,cls,click){const e=document.createElement('div');e.className=cls;e.textContent=content;if(click)e.onclick=click;marks.push(new maplibregl.Marker({element:e}).setLngLat([c.longitude,c.latitude]).addTo(map));}
   d.reports.forEach(r=>marker(r,r.type==='traffic'?'▰':r.type==='roadwork'?'⚒':'!','r',()=>send({report:r.id})));
   d.places.forEach(p=>marker(p,'● '+p.name,'p',()=>send({place:p.id})));
   ${JSON.stringify(MAP_LABELS)}.forEach(l=>marker(l,l.text,'p'));
   marker(d.location,'➤','me');
   const features=d.traffic?${JSON.stringify(TRAFFIC_LINES)}.map(t=>({type:'Feature',properties:{color:t.color},geometry:{type:'LineString',coordinates:t.points}})):[];
   if(d.route){features.push({type:'Feature',properties:{color:'#17b6d0'},geometry:{type:'LineString',coordinates:d.route.coordinates}});const key=JSON.stringify(d.route.coordinates);if(key!==lastRoute){lastRoute=key;const bounds=new maplibregl.LngLatBounds();d.route.coordinates.forEach(p=>bounds.extend(p));map.fitBounds(bounds,{padding:70,maxZoom:15});}}
   const data={type:'FeatureCollection',features};
   if(map.getSource('lines'))map.getSource('lines').setData(data);else{map.addSource('lines',{type:'geojson',data});map.addLayer({id:'lines',type:'line',source:'lines',paint:{'line-color':['get','color'],'line-width':5},layout:{'line-cap':'round','line-join':'round'}});}
  }
  map.on('load',()=>{ready=true;send({ready:true});});
  map.on('moveend',()=>{const c=map.getCenter();send({moved:true,latitude:c.lat,longitude:c.lng,zoom:map.getZoom()});});window.update=update;
 }catch(e){send({failed:true});}
 </script></body></html>`;
 const [source] = useState(() => ({ html }));
 const serialized = JSON.stringify(payload);
 useEffect(() => { if (loaded) ref.current?.injectJavaScript(`if(window.update)window.update(${serialized});true;`); }, [serialized, loaded]);
 return <View style={StyleSheet.absoluteFill}>
  <Image source={require('../assets/maps/baghdad.webp')} style={StyleSheet.absoluteFill} contentFit="cover" />
  <WebView<object> key={generation} ref={ref} originWhitelist={['*']} source={source} style={{ flex: 1, backgroundColor: 'transparent', opacity: loaded ? 1 : 0 }} javaScriptEnabled onError={() => setFailed(true)} onMessage={e => {
   try { const d = JSON.parse(e.nativeEvent.data); if(d.moved){props.onMove?.({latitude:d.latitude,longitude:d.longitude},d.zoom);return;} if(d.failed){setFailed(true);return;} if(d.ready){setLoaded(true);setFailed(false);props.onReady?.();ref.current?.injectJavaScript(`window.update(${JSON.stringify(payload)});true;`);} if(d.report){const r=reports.find(r=>r.id===d.report);if(r)props.onReport(r);} if(d.place){const p=PLACES.find(p=>p.id===d.place);if(p)props.onPlace(p);} } catch { setFailed(true); }
  }} />
  {!loaded&&!failed&&<ActivityIndicator color={colors.accent} style={{position:'absolute',left:25,top:95}} />}
  {failed&&<View style={{position:'absolute',left:22,right:80,bottom:110,padding:18,borderRadius:16,backgroundColor:colors.surface,gap:12}}><T style={{fontSize:13,lineHeight:21}}>تعذر الاتصال بالخريطة التفاعلية. نعرض خريطة بغداد المحفوظة.</T><Button title="إعادة الاتصال" secondary icon="refresh" onPress={()=>{setFailed(false);setLoaded(false);setGeneration(n=>n+1);}}/></View>}
 </View>;
}
