# وين — Iraq navigation prototype

## Delivered
- Expo / React Native / TypeScript app for Android, iOS, and web.
- Independent Arabic RTL UI, adaptive desktop map workspace, mobile tabs, modal workflows, and light/dark/system appearance.
- Interactive OpenFreeMap / OpenStreetMap vector map covering Iraq. A bundled Baghdad map is shown while the web map connects.
- Curated local search across Iraqi points of interest; seven city shortcuts.
- OSRM public routing service, route geometry, distance, estimated duration, manual step preview, and optional Arabic text-to-speech.
- Device location requested only when the location button is pressed. No background tracking.
- Saved home/work/custom places, recent destinations, local reports and report confirmations, and completed route previews stored in AsyncStorage.

## Deliberate boundaries
- This is an independent implementation of familiar navigation workflows. No Waze private APIs, proprietary code, accounts, or traffic data are used.
- Initial traffic lines and community reports are demonstrative, NOT live road information. The UI explicitly marks them as such.
- User reports and confirmations stay on the user's device. There is no public backend or multi-user synchronization.
- Route time estimates do not include live traffic. Route preview is not turn-by-turn GPS navigation and must not be used while driving.
- Search is a curated offline catalog, not comprehensive address geocoding.
- Map and routing providers are public services without an app-specific SLA; failures have fallback/error messaging. Native map rendering uses a WebView with MapLibre GL.
- Native binaries require a development or production build including the declared native packages. Expo export bundles are not signed app-store builds.

## Services required for a production launch
1. A PostgreSQL/PostGIS backend with authentication, report geolocation validation, expiry, deduplication, abuse prevention, rate limiting, moderation, and realtime updates.
2. A licensed live-traffic feed with coverage validated for Iraq. Never infer actual traffic from demo data.
3. Production geocoding and routing (hosted or self-hosted OSRM/Valhalla), address normalization in Arabic and Kurdish, caching, and provider redundancy.
4. Foreground GPS navigation, map matching, rerouting, spoken guidance tests, and explicit background-location consent if background navigation is added.
5. Consent-aware telemetry, privacy policy, retention/deletion controls, permission review, accessibility testing, and security review.
6. Offline map distribution compliant with tile-provider terms; a bundled preview is not full offline navigation.
7. Signed Android/iOS builds and real-device tests, crash reporting, monitoring, backups, and deployment infrastructure.

## Development
- `npx tsc --noEmit`
- `npx expo export --platform all`
- `node scripts/test-app.cjs` runs a bounded static server, performs browser interaction checks, and exits.
- OpenStreetMap attribution is shown in the map. Bundled fallback map geometry is derived from OpenFreeMap / OpenStreetMap vector tiles and is subject to OpenStreetMap ODbL attribution.
