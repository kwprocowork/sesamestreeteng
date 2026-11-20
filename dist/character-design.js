import * as THREE from './assets/three.module.js';
export const GUIDE_NAMES=['Grover','Rosita','Zoe','Julia'];
export function chooseGuideName(playerName,previousName='',random=Math.random){const candidates=GUIDE_NAMES.filter(name=>name!==playerName&&name!==previousName);return candidates[Math.floor(random()*candidates.length)];}
export function replaceGuideText(text,guideName){return String(text??'').replace(/\bRosita\b/g,guideName).replace(/\bROSITA\b/g,guideName.toUpperCase());}
// Shared by playable actors, mission NPCs, and the park trailer.
export function addSignatureHair(actor,name,arms,orb,rod){
 if(name==='Baby Bear'&&orb){babyBear(actor,orb);return actor;}
 if(name==='Abby Cadabby'&&orb){fairy(actor,arms,orb,rod);return actor;}
 if(['Julia','Tamir','Ji-Young'].includes(name)&&orb){dressFriends(actor,name,arms,orb);return actor;}if(!['Bert','Ernie'].includes(name))return null;const group=new THREE.Group();group.name='signature-hair';group.userData.character=name;const material=new THREE.MeshStandardMaterial({color:0x242424,roughness:1});
 const bert=name==='Bert',cap=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),material);cap.position.set(0,bert?2.71:2.53,-.015);cap.scale.set(bert?.19:.43,bert?.065:.10,bert?.15:.25);cap.castShadow=true;group.add(cap);
 const count=bert?13:15;
 for(let i=0;i<count;i++){const u=i/(count-1),x=(u-.5)*(bert?.27:.66),z=Math.sin(i*2.4)*.09,tipX=bert?x*1.7+Math.sin(i*1.7)*.04:x+.12+Math.sin(i*2.2)*.14,tipY=bert?3.04+Math.sin(u*Math.PI)*.17+Math.sin(i*2)*.025:2.73+Math.sin(u*Math.PI)*.18+Math.sin(i*2.7)*.04;
 const start=new THREE.Vector3(x,bert?2.68:2.49,z),end=new THREE.Vector3(tipX,tipY,z-.03),curve=new THREE.CubicBezierCurve3(start,new THREE.Vector3(x*.8,start.y+.16,z+.03),new THREE.Vector3(tipX-.045,tipY-.09,z+.01),end),geo=new THREE.TubeGeometry(curve,12,bert?.044:.050,7,false),positions=geo.getAttribute('position');
 for(let row=0;row<=12;row++){const t=row/12,center=curve.getPoint(t),taper=1-.94*Math.pow(t,1.4);for(let j=0;j<=7;j++){const index=row*8+j,p=new THREE.Vector3().fromBufferAttribute(positions,index);p.sub(center).multiplyScalar(taper).add(center);positions.setXYZ(index,p.x,p.y,p.z);}}
 geo.computeVertexNormals();const lock=new THREE.Mesh(geo,material);lock.castShadow=true;group.add(lock);
 }
 actor.add(group);return group;
}

// A fitted hair shell keeps the face open while carrying the bob around the back.
function bob(actor, julia, orb) {
 const vertices=[], indices=[], rows=16, columns=56;
 const palette=julia?[0xd75017,0xee6522,0xf37c2a]:[0x221c20,0x302729,0x382d30];
 for(let j=0;j<=rows;j++)for(let i=0;i<=columns;i++){
  const a=i/columns*Math.PI*2, front=Math.cos(a), side=Math.sin(a);
  const hairline=THREE.MathUtils.smoothstep(front,.37,.83);
  const edge=1.75+hairline*(julia?.74:.77)+side*(julia?.025:.12)*hairline;
  const t=j/rows, phi=t*Math.PI/2, radius=Math.sin(phi)*(1-.055*Math.pow(t,6));
  vertices.push(.664*side*radius,edge+(2.72-edge)*Math.cos(phi),-.035+.558*front*radius);
  if(j&&i){const v=j*(columns+1)+i;indices.push(v-columns-2,v-1,v,v-columns-2,v,v-columns-1);}
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();
 const shell=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:palette[0],side:THREE.DoubleSide,roughness:.88}));
 shell.castShadow=true;actor.add(shell);
 for(let i=0;i<9;i++){
  const u=(i-4)/4;
  const lock=orb(palette[1+i%2],u*.43,2.55+(julia?0:.075*u),.392-.17*u*u,.095,julia?.14:.13,.075,actor);
  lock.rotation.z=julia?.10+.21*u:-.65;
 }
 if(!julia){
  const pony=orb(palette[0],-.28,2.73,-.14,.145,.205,.125,actor);
  pony.rotation.z=-.55;orb(0x9162a8,-.20,2.68,-.10,.107,.045,.10,actor);
 }
}

function dressFriends(actor,name,arms,orb) {
 const julia=name==='Julia', tamir=name==='Tamir';
 if(tamir){
  orb(0x2d231f,0,2.47,-.035,.60,.31,.46,actor);
  for(let i=0;i<80;i++){
   const y=(i+.5)/80,a=i*2.399963,r=Math.sqrt(1-y*y),size=.085+.018*Math.sin(i*1.7);
   orb([0x30231e,0x382a25,0x291f1c][i%3],.55*r*Math.cos(a),2.43+.30*y,.42*r*Math.sin(a)-.032,size,.093,size,actor);
  }
 }else bob(actor,julia,orb);
 const tee=julia?0xf2a3b6:tamir?0xd8d7d3:0xf08329;
 orb(tee,0,1.06,.012,.508,.62,.411,actor);
 const outer=julia?0xb92778:tamir?0x333330:0x55514f;
 for(const [i,side] of [-1,1].entries()){
  orb(tamir?outer:tee,side*.09,-.12,0,.195,tamir?.32:.21,.197,arms[i]);
  const panel=orb(outer,side*.305,1.09,.208,.205,.50,.235,actor);
  if(tamir){
   // Wrap the check around the fabric so the shirt reads from every camera angle.
   panel.material=plaidMaterial();
   arms[i].children.at(-1).material=panel.material;
  }
  if(julia)orb(outer,side*.27,1.41,.29,.08,.23,.11,actor);
  if(name==='Ji-Young')for(let p=0;p<2;p++)orb([0xf3cc58,0x66b3b9,0xdb89a7,0xe5e1c9][i*2+p],side*(.28+p*.045),1.26-p*.20,.439,.044,.052,.019,actor);
  if(julia){
   orb(0x498449,side*.155,2.285,.629,.10,.115,.023,actor);
   orb(0x211e20,side*.155,2.285,.649,.055,.074,.017,actor);
   orb(0xfffdf4,side*.155-.022,2.318,.665,.019,.023,.007,actor);
  }
 }
 if(julia)orb(outer,0,.99,.051,.52,.50,.412,actor);
}
let plaid;
function plaidMaterial(){
 if(plaid)return plaid;
 const n=32,pixels=new Uint8Array(n*n*4);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const gold=x===4||y===4, check=(x<16)!==(y<16);
  const rgb=gold?[218,183,64]:x===8||y===8?[219,216,199]:check?[83,81,73]:x<16?[56,55,51]:[36,36,35];
  pixels.set([...rgb,255],4*(y*n+x));
 }
 const texture=new THREE.DataTexture(pixels,n,n);
 texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(5,3);
 texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.LinearFilter;
 texture.generateMipmaps=true;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.needsUpdate=true;
 plaid=new THREE.MeshStandardMaterial({map:texture,roughness:.96});return plaid;
}

function babyBear(actor,orb){
 for(const side of [-1,1]){
  orb(0x874522,side*.49,2.45,-.04,.24,.25,.13,actor);
  orb(0xd99482,side*.50,2.46,.067,.152,.159,.05,actor);
  orb(0xa96333,side*.13,2.04,.466,.21,.16,.156,actor);
 }
 orb(0x352820,0,2.11,.614,.113,.089,.064,actor);
 for(let i=0;i<6;i++){
  const tuft=orb(0x995529+(i%2)*0x0b0703,(i-2.5)*.048,2.56,.035,.046,.117,.075,actor);
  tuft.rotation.z=-.47+i*.07;
 }
}

function fairy(actor,arms,orb,rod){
 // The broad pink muzzle sits above the smile, with the small nose tucked between the eyes.
 orb(0xf29bc1,0,1.977,.409,.461,.154,.165,actor);
 orb(0xe96398,0,2.087,.568,.124,.088,.083,actor);
 orb(0x98378d,0,2.49,-.074,.548,.27,.411,actor);
 for(const side of [-1,1]){
  fairyPigtail(actor,side,orb);
  const eyeX=side*.185,eyeY=2.258;
  orb(0xfffdf3,eyeX,eyeY,.431,.173,.207,.139,actor);
  orb(0x3188af,eyeX-side*.009,eyeY-.016,.555,.093,.104,.028,actor);
  orb(0x231b28,eyeX-side*.011,eyeY-.017,.578,.066,.078,.017,actor);
  orb(0xfffcf9,eyeX-.019,eyeY+.015,.593,.017,.018,.007,actor);
  // A curved turquoise lid with a fine dark rim follows the eye surface.
  for(const [radius,color,dy] of [[.019,0x3e96ab,.011],[.010,0x48313c,0]]){
   const points=[];
   for(let j=0;j<=8;j++){
    const a=.10+j*Math.PI*.91/8;
    points.push(new THREE.Vector3(eyeX+side*.168*Math.cos(a),eyeY+.184*Math.sin(a)+dy,.485+.029*Math.sin(a)));
   }
   const lid=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),14,radius,6,false),new THREE.MeshStandardMaterial({color,roughness:.93}));actor.add(lid);
  }
  for(let j=0;j<4;j++){
   const a=.14+j*.21,x=eyeX+side*.166*Math.cos(a),y=eyeY+.181*Math.sin(a);
   rod(0x493143,[x,y,.493],[x+side*(.039-.006*j),y+.027+.008*j,.50],.008,actor);
  }
  for(const [x,y] of [[.253,2.002],[.32,2.030],[.359,1.976],[.285,1.953]]){
   const z=.409+.165*Math.sqrt(1-(x/.461)**2-((y-1.977)/.154)**2);
   orb(0xc8759f,side*x,y,z,.014,.018,.010,actor);
  }
  // Sideswept purple bangs frame the temples, leaving the blue eyes visible.
  for(let i=0;i<11;i++){
   const u=i/10,x=side*(.075+.416*u);
   const curve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(side*(.015+u*.18),2.723-.015*u,.055+.045*u),
    new THREE.Vector3(side*(.065+u*.24),2.675-.048*u,.22+.037*u),
    new THREE.Vector3(x,2.55-.04*u,.36-.16*u*u),
    new THREE.Vector3(side*(.058+.45*u),2.47-.20*u*u,.35-.14*u*u)
   ]);
   const geom=new THREE.TubeGeometry(curve,12,.018+.006*(i%2),5,false);
   const hair=new THREE.Mesh(geom,new THREE.MeshStandardMaterial({color:[0xab438f,0x973e91,0xc05b9d][i%3],roughness:.99}));
   actor.add(hair);
  }
  for(let j=0;j<2;j++){
   const wing=orb(0xf7dfef,side*(j?.56:.69),j?1.29:1.57,-.32,j?.30:.45,j?.112:.16,.039,actor);
   wing.rotation.z=side*(j?-.28:.54);
   wing.material=new THREE.MeshStandardMaterial({color:0xfbe5f2,transparent:true,opacity:.57,depthWrite:false,roughness:.45});
  }
 }
 fairyDress(actor,orb);
 const hand=arms[1],tip=[.46,.18,.22];
 rod(0xa98aba,[.19,-.58,.12],tip,.023,hand);
 orb(0xf4c84e,...tip,.049,.051,.05,hand);
 for(let i=0;i<9;i++){
  const a=i*Math.PI*2/9;
  rod(i%2?0xdba1d4:0xaa80bd,tip,[tip[0]+.13*Math.cos(a),tip[1]+.12*Math.sin(a),.24],.011,hand);
 }
}

function fairyPigtail(actor,side,orb){
 const center=new THREE.Vector3(side*.567,2.704,-.095);
 orb(0xac3b90,center.x,center.y,center.z,.202,.203,.17,actor);
 const positions=[],colors=[],indices=[];
 const shades=[0xa73d95,0xc549a0,0xe462aa,0x9650a7,0xd4569d].map(c=>new THREE.Color(c));
 // Tapered, arching wisps share one mesh per bunch, including the fine flyaways.
 for(let i=0;i<150;i++){
  const a=i*2.399963, h=1-2*(i+.5)/150, r=Math.sqrt(1-h*h);
  const start=new THREE.Vector3(side*.435,2.64,-.055);
  const end=center.clone().add(new THREE.Vector3(side*(.056+.294*r*Math.cos(a)),.321*h-.061+.045*Math.sin(i*4),.254*r*Math.sin(a)));
  const bend=center.clone().add(new THREE.Vector3(side*(.075+.12*r*Math.cos(a)),.23+.16*h,.13*r*Math.sin(a)));
  const sweep=end.clone().lerp(bend,.46);sweep.x+=side*.048*Math.sin(i*2.1);sweep.y+=.084+.04*Math.cos(i);
   const curve=new THREE.CubicBezierCurve3(start,bend,sweep,end);
  const base=positions.length/3;
  for(let j=0;j<=6;j++){
   const t=j/6,point=curve.getPoint(t),tangent=curve.getTangent(t);
   const normal=new THREE.Vector3().crossVectors(tangent,new THREE.Vector3(0,0,1)).normalize();
   const binormal=new THREE.Vector3().crossVectors(tangent,normal);
   const width=(i%4===0?.013:.023)*(1-.98*t);
   for(let k=0;k<3;k++){
    const angle=k*2*Math.PI/3;
    positions.push(...point.clone().addScaledVector(normal,Math.cos(angle)*width).addScaledVector(binormal,Math.sin(angle)*width).toArray());
    colors.push(...shades[i%shades.length].toArray());
    if(j<6){const n=base+j*3+k,m=base+j*3+(k+1)%3;indices.push(n,m,n+3,m,m+3,n+3);}
   }
  }
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();
 actor.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96,side:THREE.DoubleSide})));
 for(let j=0;j<5;j++){const a=j*Math.PI*2/5;orb(0xe9b7d7,side*.425+.031*Math.cos(a),2.626+.033*Math.sin(a),.128,.027,.028,.022,actor);}
 orb(0xf4c664,side*.425,2.626,.15,.021,.022,.015,actor);
}

function fairyDress(actor,orb){
 orb(0x55c0d7,0,1.16,.015,.512,.51,.414,actor);
 const shades=[0x5dbddf,0x89d7e8,0x76cce5,0xa3e1ee];
 // Each skirt panel fans out from the gathered waist to a separate pointed hem.
 for(let layer=0;layer<2;layer++)for(let i=0;i<10;i++){
  const a=(i+layer*.5)*Math.PI/5,positions=[],indices=[];
  for(let row=0;row<=8;row++)for(let col=0;col<=6;col++){
   const t=row/8,u=(col-3)/3;
   const halfWidth=.29+.075*Math.sin(t*Math.PI)-.095*t;
   const angle=a+u*halfWidth;
   const radius=.49+.20*t+.025*layer+.022*(1-u*u)*Math.sin(Math.PI*t);
   const y=1.12-(layer?.63:.74)*t-.15*(1-u*u)*t**3+.022*t*Math.sin(i);
   positions.push(Math.sin(angle)*radius,y,.015+Math.cos(angle)*radius*.84);
   if(row&&col){const n=row*7+col;indices.push(n-8,n-1,n,n-8,n,n-7);}
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();
  actor.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:shades[(i+layer)%4],roughness:.72,side:THREE.DoubleSide})));
 }
 for(const [height,radius] of [[1.56,.33],[1.13,.49]]){
  for(let i=0;i<16;i++){
   const a=i*Math.PI/8;
   const ruffle=orb(i%2?0x90daea:0x67c7dc,Math.sin(a)*radius,height,Math.cos(a)*radius*.82+.015,.082,.060,.055,actor);
   ruffle.rotation.y=a;ruffle.rotation.z=.38*Math.cos(a);
  }
 }
}
