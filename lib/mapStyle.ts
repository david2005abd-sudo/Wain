export function mapStyle(dark = false): any {
 const bg = dark ? '#203239' : '#F0F1EB';
 return {
  version: 8,
  sources: { openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: '© OpenStreetMap contributors · OpenFreeMap' } },
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  layers: [
   { id: 'background', type: 'background', paint: { 'background-color': bg } },
   { id: 'landuse', type: 'fill', source: 'openmaptiles', 'source-layer': 'landuse', filter: ['in', 'class', 'residential', 'commercial', 'industrial'], paint: { 'fill-color': dark ? '#293C42' : '#E9ECE5', 'fill-opacity': .52 } },
   { id: 'green', type: 'fill', source: 'openmaptiles', 'source-layer': 'landcover', filter: ['in', 'class', 'wood', 'grass'], paint: { 'fill-color': dark ? '#30493D' : '#E0E8D8', 'fill-opacity': .7 } },
   { id: 'park', type: 'fill', source: 'openmaptiles', 'source-layer': 'park', paint: { 'fill-color': dark ? '#30493D' : '#DCE7D3', 'fill-opacity': .8 } },
   { id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water', paint: { 'fill-color': dark ? '#285763' : '#B8DFE3' } },
   { id: 'waterway', type: 'line', source: 'openmaptiles', 'source-layer': 'waterway', paint: { 'line-color': dark ? '#285763' : '#B8DFE3', 'line-width': 2 } },
   { id: 'building', type: 'fill', source: 'openmaptiles', 'source-layer': 'building', minzoom: 14.3, paint: { 'fill-color': dark ? '#35474B' : '#E3E6DD', 'fill-opacity': .65 } },
   { id: 'roads-case', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['!in', 'class', 'rail', 'transit', 'path'], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': dark ? '#233139' : '#DFE2DA', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 14, ['match', ['get', 'class'], ['motorway','trunk'], 9, ['primary','secondary'], 7, ['tertiary'], 5.5, 3.2], 17, 18] } },
   { id: 'roads', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['!in', 'class', 'rail', 'transit', 'path'], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': dark ? '#526165' : '#FFFFFF', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, .6, 14, ['match', ['get', 'class'], ['motorway','trunk'], 6.5, ['primary','secondary'], 4.8, ['tertiary'], 3.5, 1.9], 17, 14] } },
   { id: 'bridge-case', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['==', 'brunnel', 'bridge'], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': dark ? '#233139' : '#DFE2DA', 'line-width': 8 } },
   { id: 'bridge', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['==', 'brunnel', 'bridge'], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': dark ? '#526165' : '#FFFFFF', 'line-width': 5 } },
   { id: 'road-label', type: 'symbol', source: 'openmaptiles', 'source-layer': 'transportation_name', minzoom: 14.2, layout: { 'symbol-placement': 'line', 'text-field': ['coalesce', ['get','name:ar'], ['get','name']], 'text-font': ['Noto Sans Regular'], 'text-size': 11, 'text-max-angle': 30, 'symbol-spacing': 350 }, paint: { 'text-color': dark ? '#9AAEB0' : '#9AA296', 'text-halo-color': bg, 'text-halo-width': 2 } },
   { id: 'city-label', type: 'symbol', source: 'openmaptiles', 'source-layer': 'place', maxzoom: 12.5, layout: { 'text-field': ['coalesce', ['get','name:ar'],['get','name']], 'text-font': ['Noto Sans Regular'], 'text-size': ['interpolate',['linear'],['zoom'],5,12,12,17] }, paint: { 'text-color': dark ? '#CDDADF' : '#7A857D', 'text-halo-color': bg, 'text-halo-width': 2 } },
  ],
 };
}
