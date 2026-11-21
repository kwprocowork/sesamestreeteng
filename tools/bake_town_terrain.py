"""Bake the fantasy town island locally. Deterministic, no API/model calls."""
from pathlib import Path
import math,json,hashlib
out=Path(__file__).resolve().parent.parent/'dist/town-terrain.js'
vertices=[];colors=[];indices=[]
# A continuous stylized coast around a broad, flat and accessible play area.
cols,rows=72,92
for j in range(rows+1):
 z=-365+j*540/rows
 for i in range(cols+1):
  x=-230+i*460/cols
  r=((abs(x)/177)**6+(abs(z+95)/254)**6)**(1/6)
  if r<.84:y=-.19
  elif r<1:y=-.19-((r-.84)/.16)**2*9
  else:y=-12
  n=math.sin(x*.13+math.cos(z*.1))*math.cos(z*.11)*.018
  green=(.43+n,.65+n,.43+n) if r<.84 else (.59+n,.65+n,.50+n)
  vertices.extend(round(v,3) for v in (x,y,z));colors.extend(round(v,3) for v in green)
for j in range(rows):
 for i in range(cols):
  a=j*(cols+1)+i;b=a+1;c=a+cols+1;d=c+1
  indices.extend([a,c,b,b,c,d])
body='// Baked by Mac-local Python; no remote assets.\nexport const TERRAIN='+json.dumps({'vertices':vertices,'colors':colors,'indices':indices},separators=(',',':'))+';\n'
if not out.exists() or out.read_text()!=body:out.write_text(body)
print(json.dumps({'vertices':len(vertices)//3,'triangles':len(indices)//3,'bytes':len(body),'sha256':hashlib.sha256(body.encode()).hexdigest()}))
