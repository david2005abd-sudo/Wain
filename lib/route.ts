import { Coord, RouteInfo } from './data';
export async function fetchRoute(from: Coord, to: Coord): Promise<RouteInfo> {
 const controller = new AbortController();
 const timer = setTimeout(() => controller.abort(), 8500);
 try {
  const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson&steps=true`, { signal: controller.signal });
  if (!response.ok) throw new Error('routing unavailable');
  const body = await response.json();
  if (body.code !== 'Ok' || !body.routes?.length) throw new Error('route missing');
  const route = body.routes[0];
  const steps = route.legs.flatMap((leg: any) => leg.steps).filter((step: any) => step.distance > 10).map((step: any) => {
   const type = step.maneuver?.type; const mod = step.maneuver?.modifier;
   const direction = type === 'depart' ? 'انطلق' : mod?.includes('right') ? 'انعطف يمينًا' : mod?.includes('left') ? 'انعطف يسارًا' : type?.includes('roundabout') ? 'ادخل الدوار' : 'استمر إلى الأمام';
   return { instruction: `${direction}${step.name ? ' باتجاه ' + step.name : ''}`, distance: step.distance };
  });
  return { distance: route.distance, duration: route.duration, coordinates: route.geometry.coordinates, steps, live: true };
 } finally { clearTimeout(timer); }
}
