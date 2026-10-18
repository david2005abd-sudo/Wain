import sys, urllib.request, concurrent.futures, os, json
sys.path.insert(0,'/tmp/wein-python')
import mapbox_vector_tile
from PIL import Image,ImageDraw
X0,Y0,N,Z=10209,6579,6,14
S=512
os.makedirs('assets/maps/tiles',exist_ok=True)
def fetch(p):
 x,y=p; file=f'assets/maps/tiles/{x}-{y}.pbf'
 if os.path.exists(file): data=open(file,'rb').read()
 else:
  url=f'https://tiles.openfreemap.org/planet/20261011_080001_pt/{Z}/{X0+x}/{Y0+y}.pbf'
  import subprocess
  data=subprocess.check_output(['curl','-L','--fail','--silent','--max-time','40',url]);open(file,'wb').write(data)
 return x,y,mapbox_vector_tile.decode(data)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 tiles=list(pool.map(fetch,[(x,y) for x in range(N) for y in range(N)]))
image=Image.new('RGB',(N*S,N*S),'#F0F1EB');draw=ImageDraw.Draw(image)
def points(coords,x,y,extent):return [(x*S+p[0]/extent*S,y*S+(1-p[1]/extent)*S) for p in coords]
def polys(geom):
 if geom['type']=='Polygon':return geom['coordinates']
 if geom['type']=='MultiPolygon':return [ring for poly in geom['coordinates'] for ring in poly]
 return []
for layer,color in [('landuse','#EAEEE5'),('landcover','#E2E9D9'),('park','#DEE8D6'),('water','#B8DFE3')]:
 for x,y,t in tiles:
  if layer not in t:continue
  l=t[layer]
  for f in l['features']:
   for ring in polys(f['geometry']):
    if len(ring)>2:draw.polygon(points(ring,x,y,l['extent']),fill=color)
for casing in [True,False]:
 for x,y,t in tiles:
  l=t.get('transportation',{'features':[],'extent':4096})
  for f in l['features']:
   cls=f['properties'].get('class')
   if cls in ['path','rail','transit']:continue
   width=6.5 if cls in ['motorway','trunk'] else 4.8 if cls in ['primary','secondary'] else 3.5 if cls=='tertiary' else 1.9
   if casing:width+=1.8
   geom=f['geometry'];lines=[geom['coordinates']] if geom['type']=='LineString' else geom['coordinates'] if geom['type']=='MultiLineString' else []
   for line in lines:
    if len(line)>1:draw.line(points(line,x,y,l['extent']),fill='#DFE2DA' if casing else '#FFFFFF',width=max(1,round(width*2)),joint='curve')
image.resize((1536,1536),Image.Resampling.LANCZOS).save('assets/maps/baghdad.png')
image.resize((768,768),Image.Resampling.LANCZOS).save('assets/maps/preview.png')
print('Rendered Baghdad from OpenFreeMap / OpenStreetMap vector tiles')
