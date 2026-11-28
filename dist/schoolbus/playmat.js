// Selected Schoolbus v223 PLAYMAT builders and animations. No house/room layout is imported.
import {SchoolTHREE as THREE,schoolBox as B,schoolMaterial as M} from './core.js?v=76a';
export const PLAYMAT_IDS=["piano", "kitchen", "teach", "lego", "fruit", "cars", "zoo"];
import {PLAYMAT_REFERENCE} from './layout.js';
import {HOME_ACTIVITIES} from './activity-catalog.js?v=76a';
export function createSchoolPlaymat(S,{onSound=()=>{}}={}){
const G={E:new THREE.Group()};S.add(G.E);const P=G.E,TAU=Math.PI*2,V=(x,y,z)=>new THREE.Vector3(x,y,z),lp=(a,b,u)=>a+(b-a)*u,cl=(x,a,b)=>Math.max(a,Math.min(b,x));
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
function add(g,m,x,y,z,p=P){const o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
 const cvt=(w,h,fn,rx,ry)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rx)t.repeat.set(rx,ry||rx);t.anisotropy=4;return t};
 const mt=(t,o)=>new THREE.MeshStandardMaterial(Object.assign({map:t,roughness:.85},o||{}));
 const pl=(w,h,x,y,z,ry,mat,rx)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.y=ry||0;if(rx)m.rotation.x=rx;m.receiveShadow=true;P.add(m);return m};
 const bx=(w,h,d,x,y,z,col,par,o)=>add(B(w,h,d),typeof col==='number'?M(col,o||{roughness:.7}):col,x,y,z,par||P);
 const cyl=(r1,r2,h,x,y,z,col,par)=>add(new THREE.CylinderGeometry(r1,r2,h,12),M(col,{roughness:.7}),x,y,z,par||P);
 const sph=(r,x,y,z,col,par,sx,sy,sz)=>{const q=add(new THREE.SphereGeometry(r,10,8),M(col,{roughness:.7}),x,y,z,par||P);q.scale.set(sx||1,sy||1,sz||1);return q};
 const matT=cvt(256,256,(g,w,h)=>{g.fillStyle='#d3d4d6';g.fillRect(0,0,w,h);g.strokeStyle='#aeb0b3';g.lineWidth=4;g.strokeRect(0,0,w,h);g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.stroke()},3,2);
 pl(6.1,7.5,0,.012,-.95,0,mt(cvt(256,256,matT.image?((g,w,h)=>{g.drawImage(matT.image,0,0)}):()=>{},3,3.6),{roughness:.9}),-Math.PI/2);
 /* white fence panels (front, left and right) with a gate */
 const fw=M(0xf4f1ea,{roughness:.55}),fb=M(0xe5dfd2,{roughness:.55});
 const panel=(x,z,ry,gate)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;P.add(g);g.name='Schoolbus playmat fence';g.userData.playmatFence=true;if(gate)P.userData.gate=g;const m=gate?fb:fw;bx(.98,.1,.1,0,1.05,0,m,g);bx(.98,.1,.1,0,.18,0,m,g);for(let i=-2;i<=2;i++)bx(.1,.9,.08,i*.19,.62,0,m,g);bx(.06,1.0,.1,-.5,.6,0,m,g)};
 for(let i=0;i<6;i++)panel(-2.5+i,2.95,0,i===1);
 for(let i=0;i<5;i++){if(i!==2)panel(-3.05,2.45-i,Math.PI/2);panel(3.05,2.45-i,Math.PI/2)}
 panel(-3.05,-2.55,Math.PI/2);
 /* back-left: white toy kitchen with sink, hob, oven and shelves */
 {const k=new THREE.Group();k.position.set(-1.7,0,-3.8);P.add(k);const W=0xf3f1ec;
  bx(2.3,1.0,.9,0,.5,0,W,k);bx(2.34,.07,.94,0,1.03,0,0xc9a46a,k);bx(.8,.05,.55,-.55,1.075,.03,0x25262a,k);cyl(.03,.03,.4,-.55,1.28,-.28,0x333333,k);
  bx(.8,.6,.05,-.6,.5,.46,0xe8e6e0,k);bx(.64,.38,.02,.7,.55,.465,0x3a3d44,k);[-.3,.3].forEach(o=>cyl(.05,.05,.04,.7+o*.9-.0,.88,.462,0xb8bcc2,k).rotation.x=Math.PI/2);
  [0.5,0.9].forEach(o=>{cyl(.14,.14,.02,o+.1,1.075,.1,0x222222,k)});
  bx(2.3,1.1,.4,0,1.65,-.25,W,k);[1.35,1.7,2.05].forEach(y=>bx(2.2,.04,.34,0,y,-.2,0xcaa77a,k));
  [[-.8,1.45,0xd9534f],[-.4,1.45,0x4aa05a],[0,1.45,0xe8c04a],[.4,1.45,0x3d8bd8],[.8,1.45,0xf08ac0],[-.7,1.8,0xe8c04a],[-.2,1.8,0xd9534f],[.5,1.8,0x4aa05a]].forEach(a=>bx(.2,.2,.2,a[0],a[1]+.12,-.15,a[2],k));
  bx(.55,.5,.4,.75,1.33,-.1,0x2b2d31,k);bx(.4,.7,.35,.8,1.9,-.15,0x8d9298,k);k.scale.y=.55;}
 /* back-right: striped canopy toy shop with animals on top and a building-plate table */
 {const s=new THREE.Group();s.position.set(1.65,0,-3.35);P.add(s);const cream=0xf3ead6;
  bx(.1,2.5,.1,-1.25,1.25,.7,cream,s);bx(.1,2.5,.1,1.25,1.25,.7,cream,s);bx(.1,2.5,.1,-1.25,1.25,-.8,cream,s);bx(.1,2.5,.1,1.25,1.25,-.8,cream,s);bx(2.6,1.9,.06,0,1.3,-.85,0xf6f1e4,s);
  const aw=cvt(256,64,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#fbf7ee':'#e9c48b';g.fillRect(i*32,0,32,h)}},1,1);
  const roof=add(B(2.8,.08,1.9),mt(aw),0,2.55,-.05,s);roof.rotation.x=.12;
  const sc=cvt(256,48,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#fbf7ee':'#e9c48b';g.beginPath();g.moveTo(i*32,0);g.lineTo(i*32+32,0);g.arc(i*32+16,0,16,0,Math.PI);g.fill()}},1,1);
  const scm=new THREE.Mesh(new THREE.PlaneGeometry(2.8,.4),new THREE.MeshStandardMaterial({map:sc,transparent:true,alphaTest:.4,side:THREE.DoubleSide}));scm.position.set(0,2.33,.93);scm.rotation.x=.12;s.add(scm);
  sph(.14,-1.0,2.75,-.1,0xf2d23a,s);sph(.04,-1.0,2.73,.05,0xf08a2a,s);sph(.14,-.5,2.75,-.1,0xfafafa,s);sph(.05,-.5,2.88,-.1,0xd8302a,s,1,.7,.7);
  sph(.14,0,2.75,-.1,0x8b5a2b,s);sph(.06,-.1,2.9,-.1,0x8b5a2b,s);sph(.06,.1,2.9,-.1,0x8b5a2b,s);
  sph(.14,.5,2.75,-.1,0xfafafa,s);sph(.05,.42,2.9,-.1,0x222222,s);sph(.05,.58,2.9,-.1,0x222222,s);sph(.14,1.0,2.75,-.1,0xf6a0b8,s);sph(.06,1.0,2.74,.07,0xf08aa8,s,1.2,.8,.7);
  bx(2.4,.1,1.0,0,.95,.1,0xf4efe2,s);bx(2.2,.04,.8,0,1.02,.1,0x7d8186,s);bx(.1,.95,.8,-1.15,.48,.1,0xf4efe2,s);bx(.1,.95,.8,1.15,.48,.1,0xf4efe2,s);
  [[-.7,1.05,0xe8c04a],[-.3,1.05,0xd9534f],[.2,1.05,0x4aa05a],[.7,1.05,0x3d8bd8],[.45,1.05,0xe8c04a]].forEach(a=>bx(.22,.12,.22,a[0],a[1]+.08,.1,a[2],s));
  bx(.7,.35,.4,.2,.35,.2,0xf2a0b8,s);bx(.5,.3,.3,-.6,.3,.2,0xe8c04a,s);sph(.2,-.5,.55,.2,0x4aa05a,s,1.4,.7,.8);s.scale.y=.47;s.traverse(o=>{if(o.geometry&&o.geometry.type==='SphereGeometry')o.scale.y/=.47})}
 /* left: pink cooking toy tower */
 {const t=new THREE.Group();t.position.set(-2.7,0,-1.2);P.add(t);bx(.9,.8,.9,0,.4,0,0xf4a0b5,t);bx(.7,.1,.7,0,.85,0,0xf6c6d2,t);bx(.4,2.0,.4,-.2,1.0,-.35,0xd9404c,t);bx(.6,.5,.12,-.1,1.4,-.06,0xf6c6d2,t);
  cyl(.2,.2,.14,.1,.98,.1,0x3dc2d2,t);cyl(.16,.16,.1,-.15,.95,.2,0xf0a030,t);bx(.04,.5,.04,.32,1.4,.2,0x3d8bd8,t);sph(.18,0,2.15,-.35,0xf2d23a,t);bx(.5,.25,.4,.2,.1,.5,0xf6c6d2,t)}
 /* right: treehouse with the green marble run and blue slide, scattered toys */
 {const t=new THREE.Group();t.position.set(2.25,0,-.35);P.add(t);cyl(.34,.42,1.5,0,.75,0,0x7a4a2a,t);cyl(.28,.36,.9,-.55,.45,.55,0x8a5430,t);bx(1.0,.1,.8,0,1.55,0,0x5a3a20,t);
  sph(.5,0,1.85,0,0x3a8a40,t,1.3,.7,1.1);const sl=bx(.5,.06,1.9,.35,.8,.75,0x3da5e0,t);sl.rotation.x=.6;const tr=bx(.35,.06,1.8,-.3,.95,-.6,0x2f9a45,t);tr.rotation.x=-.5;tr.rotation.z=.2;
  [[.6,.1,-.6,0xd9534f],[.9,.1,.2,0xe8c04a],[-.5,.1,.9,0x3d8bd8],[.2,.1,1.0,0xf08ac0],[-.9,.1,.4,0x4aa05a],[.8,.1,.9,0xe8c04a]].forEach(a=>bx(.22,.2,.22,a[0],a[1],a[2],a[3],t))}
 /* right: wooden piano keyboard with black keys and toys on top, plus a stool */
 {const p=new THREE.Group();p.position.set(2.55,0,1.55);P.add(p);bx(.95,.85,2.2,0,.43,0,0x5a3a24,p);bx(.5,.06,2.0,-.3,.88,0,0xfafafa,p);
  for(let i=0;i<12;i++)if(![2,6,9].includes(i))bx(.28,.06,.1,-.42,.93,-.9+i*.16,0x151515,p);
  [[.2,.95,-.8,0x7a3aa0],[.1,.95,-.2,0xf2d23a],[.25,.95,.5,0xd9404c],[.1,.95,.9,0xe96aa0]].forEach(a=>sph(.12,a[0],a[1],a[2],a[3],p));
  bx(.5,.5,.6,-1.3,.25,.7,0x5a3a24,p)}
const EP={keys:[],plush:[],fish:[],bub:[],fx:[],tx:{},pot:null,spoon:null};
 /* glowing piano keys (shown while a note plays) */
 for(let k=0;k<8;k++){const m=add(B(.3,.02,.17),new THREE.MeshBasicMaterial({color:0xffe14a,transparent:true,opacity:.8}),2.27,.93,.66+k*.2,P);m.visible=false;EP.keys.push(m)}
 /* toy pot on the hob and a wooden spoon */
 {const g=new THREE.Group();g.position.set(-2.25,.6,-3.77);P.add(g);cyl(.13,.12,.13,0,.07,0,0xd9404c,g);cyl(.135,.135,.02,0,.14,0,0xb3303a,g);bx(.12,.03,.03,.19,.1,0,0x2b2d31,g);EP.pot=g;
  const sp=new THREE.Group();sp.position.set(-2.25,.6,-3.77);P.add(sp);bx(.025,.34,.025,0,.2,0,0xb5834a,sp);sph(.035,0,.04,0,0xb5834a,sp,1,.6,1);sp.visible=false;EP.spoon=sp}
 /* plush toys: hidden until Little Friend brings them out in the pretend-teacher activity */
 const plush=(kind,c1,c2,x,z)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=-Math.PI/2;g.visible=false;g.scale.setScalar(.001);P.add(g);
  sph(.2,0,.22,0,c1,g,1,1.05,.95);sph(.15,0,.5,.03,c1,g);[-.05,.05].forEach(o=>sph(.022,o,.53,.165,0x111111,g));sph(.03,0,.48,.175,c2,g);[-.2,.2].forEach(o=>sph(.06,o,.26,.09,c1,g));
  if(kind==='bear'){[-.11,.11].forEach(o=>sph(.055,o,.63,0,c1,g))}
  else if(kind==='bunny'){[-.07,.07].forEach(o=>sph(.045,o,.76,0,c1,g,1,3,.8))}
  else if(kind==='panda'){[-.11,.11].forEach(o=>sph(.055,o,.63,0,0x1a1a1a,g));[-.06,.06].forEach(o=>sph(.035,o,.53,.15,0x1a1a1a,g,1,1.3,.6))}
  else {bx(.1,.03,.07,0,.47,.2,0xf08a2a,g);sph(.05,0,.66,0,c1,g)}
  EP.plush.push({g,y:0})};
 plush('bear',0xb07a46,0x4a3020,-0.95,-.5);plush('bunny',0xfafafa,0xf6a0b4,-0.95,.2);plush('panda',0xf4f4f0,0x1a1a1a,-0.95,.9);plush('duck',0xf6d34c,0xf08a2a,-0.95,1.6);
/* toy-car playmat next to the piano (cars like Little Friend's real ones) */
 {const g=new THREE.Group();g.position.set(.74,.012,.12);P.add(g);EP.carG=g;
  const c=document.createElement('canvas');c.width=360;c.height=480;const x=c.getContext('2d');
  x.fillStyle='#8cc66a';x.fillRect(0,0,360,480);for(let i=0;i<60;i++){x.fillStyle=i%2?'#7ab85a':'#9fd27a';x.beginPath();x.ellipse((i*97)%360,(i*53)%480,14+(i%5)*4,8,0,0,7);x.fill()}
  x.fillStyle='#5ab0e0';x.beginPath();x.moveTo(250,0);x.bezierCurveTo(300,120,200,200,280,300);x.bezierCurveTo(330,380,260,440,300,480);x.lineTo(360,480);x.lineTo(360,0);x.fill();x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=3;for(let i=0;i<6;i++){x.beginPath();x.moveTo(300+(i%2)*20,40+i*75);x.quadraticCurveTo(310+(i%2)*20,50+i*75,325+(i%2)*20,40+i*75);x.stroke()}
  x.strokeStyle='#d9c08a';x.lineWidth=46;x.lineCap='round';x.beginPath();x.moveTo(-10,420);x.bezierCurveTo(120,380,110,120,230,60);x.stroke();x.strokeStyle='#fff';x.lineWidth=3;x.setLineDash([14,12]);x.beginPath();x.moveTo(-10,420);x.bezierCurveTo(120,380,110,120,230,60);x.stroke();x.setLineDash([]);
  const tree=(tx,ty,r)=>{x.fillStyle='#8a5a32';x.fillRect(tx-5,ty,10,r*.9);x.fillStyle='#2f8a3c';x.beginPath();x.arc(tx,ty,r,0,7);x.fill();x.fillStyle='#46a64f';x.beginPath();x.arc(tx-r*.3,ty-r*.3,r*.55,0,7);x.fill();x.fillStyle='#f27a9a';[[.4,.1],[-.2,.4],[.1,-.5]].forEach(q=>{x.beginPath();x.arc(tx+q[0]*r,ty+q[1]*r,4,0,7);x.fill()})};
  tree(50,60,30);tree(190,250,26);tree(40,250,22);tree(210,420,28);
  x.fillStyle='#9aa0a6';[[120,40],[150,70],[70,360]].forEach(q=>{x.beginPath();x.ellipse(q[0],q[1],16,11,.3,0,7);x.fill()});
  x.fillStyle='#fff';[[110,170],[150,330]].forEach(q=>{x.beginPath();x.ellipse(q[0],q[1],9,7,0,0,7);x.fill();x.beginPath();x.ellipse(q[0]-3,q[1]-11,3,8,0,0,7);x.ellipse(q[0]+3,q[1]-11,3,8,0,0,7);x.fill()});
  x.fillStyle='rgba(255,255,255,.85)';x.fillRect(0,0,360,6);x.fillRect(0,474,360,6);x.fillRect(0,0,6,480);x.fillRect(354,0,6,480);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const mat=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.75),new THREE.MeshStandardMaterial({map:t,roughness:.95,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));mat.rotation.x=-Math.PI/2;mat.receiveShadow=true;g.add(mat);
  const W=(car,wx,wz)=>{const w=add(new THREE.CylinderGeometry(.026,.026,.02,12),M(0x1b1b1e),wx,.026,wz,car);w.rotation.x=Math.PI/2;add(new THREE.CylinderGeometry(.012,.012,.022,8),M(0xcfd3d8),wx,.026,wz,car).rotation.x=Math.PI/2};
  const wheels=(car,L,Wd)=>[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(q=>W(car,q[0]*L*.32,q[1]*Wd*.5));
  const mk=kind=>{const car=new THREE.Group();const b=(w,h,d,x0,y0,z0,col,o)=>add(B(w,h,d),M(col,o||{roughness:.35,metalness:.25}),x0,y0,z0,car);
   if(kind==='fire'){b(.22,.07,.11,0,.055,0,0xd8262e);b(.08,.06,.105,.06,.115,0,0xd8262e);b(.012,.04,.09,.1,.115,0,0x9fd3ff,{roughness:.1});b(.12,.02,.1,-.04,.1,0,0xf2f2f2);b(.03,.012,.02,.06,.15,0,0x3d8bfd,{emissive:0x1d4fbf});wheels(car,.22,.11)}
   else if(kind==='race'){b(.24,.03,.08,0,.04,0,0xf4f1e8);b(.12,.035,.06,.02,.07,0,0xf4f1e8);b(.02,.04,.1,-.11,.07,0,0xd8262e);add(new THREE.SphereGeometry(.022,10,8),M(0xffd34a),-.01,.105,0,car);b(.03,.012,.081,.06,.056,0,0xd8262e);wheels(car,.24,.12)}
   else if(kind==='suv'){b(.22,.06,.11,0,.055,0,0x9e1b2a);b(.15,.05,.1,-.015,.105,0,0x9e1b2a);b(.152,.032,.102,-.015,.105,0,0x26303a,{roughness:.1,metalness:.6});wheels(car,.22,.11)}
   else if(kind==='sport'){b(.22,.045,.115,0,.045,0,0x1c2a7a);b(.1,.03,.09,-.01,.08,0,0x0d0f18,{roughness:.1,metalness:.6});b(.2,.01,.03,0,.07,0,0xffffff);b(.03,.035,.12,-.1,.08,0,0x0d0f18);wheels(car,.22,.12)}
   else if(kind==='van'){b(.24,.12,.12,0,.09,0,0xf7d77a);b(.242,.03,.122,0,.12,0,0xe8b04a);b(.012,.04,.1,.12,.11,0,0x9fd3ff,{roughness:.1});wheels(car,.24,.12)}
   else if(kind==='beetle'){const sh=add(new THREE.SphereGeometry(.07,14,10),M(0xd12a2a,{roughness:.3,metalness:.25}),0,.06,0,car);sh.scale.set(1.45,.95,1);b(.06,.03,.09,.02,.1,0,0x26303a,{roughness:.1,metalness:.6});add(new THREE.SphereGeometry(.014,8,6),M(0xffffff),.095,.06,.035,car);add(new THREE.SphereGeometry(.014,8,6),M(0xffffff),.095,.06,-.035,car);wheels(car,.2,.11)}
   else{b(.22,.05,.11,0,.05,0,0xc21f24);b(.12,.04,.095,-.01,.095,0,0xc21f24);b(.122,.022,.097,-.01,.095,0,0x26303a,{roughness:.1,metalness:.6});b(.025,.016,.03,-.01,.125,.025,0xff2a2a,{emissive:0xaa0000});b(.025,.016,.03,-.01,.125,-.025,0x2a5aff,{emissive:0x0022aa});b(.22,.012,.02,0,.077,0,0xffffff);wheels(car,.22,.11)}
   car.traverse(m=>{if(m.isMesh)m.castShadow=true});return car};
  EP.cars=['fire','race','suv','sport','van','beetle','police'].map((k,i)=>{const car=mk(k);g.add(car);car.scale.setScalar(.95);return car});
  EP.carHome=[[-.32,-.62,.6],[.33,-.5,2.4],[-.3,.55,-1.1],[.34,.72,2.9],[-.36,.05,1.9],[.36,.1,-.4],[-.3,-.25,.3]];
  EP.carSlot=i=>[0,-.72+i*.24,Math.PI/2];EP.carReset=()=>EP.cars.forEach((car,i)=>{const h=EP.carHome[i];car.position.set(h[0],0,h[1]);car.rotation.set(0,h[2],0)});EP.carReset()}
 /* lego corner on the playmat near the canopy shop */
 {const g=new THREE.Group();g.position.set(1.25,.012,-1.95);P.add(g);EP.lego=g;EP.legoT=[];
  const cols=[0xd9534f,0xe8c04a,0x3d8bd8,0x4aa05a,0xf08ac0,0xff8a1f],brick=(x,y,z,c,par,ry)=>{const b=new THREE.Group();b.position.set(x,y,z);b.rotation.y=ry||0;(par||g).add(b);bx(.2,.09,.12,0,.045,0,c,b);[-.05,.05].forEach(sx=>cyl(.022,.022,.03,sx,.105,0,c,b));return b};
  [[-.25,0,-.15,.3],[.3,0,.2,-.5],[-.1,0,.3,1.1],[.15,0,-.3,.2],[-.35,0,.15,-.9],[.45,0,-.1,.7]].forEach((a,i)=>brick(a[0],a[1],a[2],cols[i%6],g,a[3]));
  const tw=new THREE.Group();tw.position.set(.0,0,0);g.add(tw);EP.legoTw=tw;for(let i=0;i<8;i++){const b=brick(0,.09*i,0,cols[i%6],tw,(i%2)*.4);b.visible=false;EP.legoT.push(b)}
  bx(.7,.02,.55,0,.01,0,0x3fae5a,g)}
 /* toy-fruit cutting table next to the toy kitchen, close to the sofa */
 {const g=new THREE.Group();g.position.set(-2.0,0,-2.8);P.add(g);EP.cut={g,fr:[],kn:null};
  bx(.5,.025,.8,0,.0325,0,0xc99a62,g);
  const half=(col,fl,x,y,z,par,r)=>{const h=sph(r,x,y,z,col,par,1,1,.55);bx(r*1.3,r*1.3,.012,x,y,z+r*.32,fl,par);return h};
  /* apple: two halves that part when cut */
  const ap=new THREE.Group();ap.position.set(0,.12,-.26);g.add(ap);const aL=new THREE.Group(),aR=new THREE.Group();ap.add(aL);ap.add(aR);
  [aL,aR].forEach((q,i)=>{const sd=i?-1:1;const m=sph(.08,0,0,0,0xd9304a,q,.55,1,1);m.position.x=sd*.04;const f=bx(.012,.13,.12,sd*.0,0,0,0xfff3c8,q);f.position.x=sd*.002});
  const st=bx(.01,.03,.01,0,.085,0,0x5a3a20,ap);bx(.05,.012,.03,.03,.1,0,0x3fae5a,ap);
  /* banana: slices appear */
  const ba=new THREE.Group();ba.position.set(0,.08,.02);g.add(ba);const bs=[];for(let i=0;i<6;i++){const c=cyl(.045,.045,.025,(i-2.5)*.055,0,0,0xf6dc4a,ba);c.rotation.z=Math.PI/2;c.rotation.x=0;c.rotation.set(0,0,Math.PI/2);c.visible=false;c.scale.set(1,1,1);const ct=cyl(.032,.032,.027,(i-2.5)*.055,0,0,0xfff0a8,ba);ct.rotation.z=Math.PI/2;ct.visible=false;bs.push([c,ct])}
  const bw=new THREE.Group();bw.position.set(0,.075,.02);g.add(bw);const bm=sph(.045,0,0,0,0xf6dc4a,bw,3.2,.9,.9);bm.rotation.z=.05;
  /* strawberry */
  const sb=new THREE.Group();sb.position.set(0,.1,.3);g.add(sb);const sL=new THREE.Group(),sR=new THREE.Group();sb.add(sL);sb.add(sR);
  [sL,sR].forEach((q,i)=>{const sd=i?-1:1;const m=sph(.065,sd*.03,0,0,0xe8344c,q,.6,1,.9);bx(.01,.1,.09,sd*.002,0,0,0xffc2c8,q);bx(.05,.015,.05,sd*.025,.07,0,0x3fae5a,q)});
  /* blue toy knife */
  const kn=new THREE.Group();kn.position.set(.0,.2,-.26);g.add(kn);bx(.02,.02,.12,0,0,0,0xe6edf2,kn);bx(.03,.03,.08,0,0,-.09,0x2f7fd0,kn);EP.cut.kn=kn;
  g.visible=false;ap.rotation.y=Math.PI/2;sb.rotation.y=Math.PI/2;ba.rotation.y=Math.PI/2;bw.rotation.y=Math.PI/2;EP.cut.ap=ap;EP.cut.aL=aL;EP.cut.aR=aR;EP.cut.ba=ba;EP.cut.bw=bw;EP.cut.bs=bs;EP.cut.sb=sb;EP.cut.sL=sL;EP.cut.sR=sR;kn.visible=false}
 /* second small toy kitchen (red canopy, pink pots, yellow shop shelf) for the fruit-cutting game, in front of the first kitchen's left end */
 {const K=new THREE.Group();K.position.set(-2.75,0,-2.8);K.rotation.y=Math.PI/2;P.add(K);EP.kit2=K;
  const W=0xf4f2ee,R=0xd6262c,Bl=0x2f7fd0,Pk=0xf49ac1,Pu=0xb7a2e0,Y=0xf6c928;
  bx(1.1,.46,.5,0,.23,0,W,K);bx(.62,.04,.52,-.24,.48,0,W,K);bx(.46,.04,.52,.32,.48,0,R,K);bx(.34,.02,.4,.32,.5,0,0xb21d23,K);
  [-.38,-.14].forEach(x=>cyl(.08,.08,.015,x,.505,0,Bl,K));
  for(let i=0;i<4;i++){const kb=cyl(.03,.03,.03,-.45+i*.1,.38,.265,Bl,K);kb.rotation.x=Math.PI/2}
  [-1,1].forEach(sd=>bx(.07,.66,.07,sd*.52,.8,-.2,W,K));
  const rf=bx(1.16,.07,.5,0,1.15,-.05,R,K);rf.rotation.x=.1;bx(.96,.035,.035,0,.98,-.2,Bl,K);
  [[-.38,.86],[-.28,.87],[.02,.86]].forEach((a,i)=>{bx(.04,.2,.02,a[0],a[1],-.19,i===1?0xffffff:Pu,K)});
  bx(.3,.36,.03,.3,.74,-.2,Y,K);[.58,.74,.9].forEach(y=>bx(.3,.03,.14,.3,y,-.12,Y,K));
  bx(.07,.08,.05,.37,.95,-.12,R,K);[-1,0,1].forEach(i=>bx(.012,.07,.012,.37+i*.015,1.02,-.12,0xf6dc4a,K));
  [[.25,.79],[.3,.8],[.35,.79]].forEach(a=>sph(.03,a[0],a[1],-.12,0x7a3fa0,K));
  cyl(.06,.06,.03,.26,.62,-.12,0xd9a05b,K);cyl(.06,.06,.015,.26,.64,-.12,0x7a4a2a,K);cyl(.06,.06,.02,.26,.66,-.12,0x5aa84a,K);
  bx(.18,.08,.12,-.02,.54,-.12,R,K);bx(.1,.06,.02,-.02,.62,-.17,0xeeeeee,K);
  const pot=(x,z,r,h,lid)=>{cyl(r,r*.9,h,x,.5+h/2,z,Pk,K);if(lid){cyl(r*1.05,r*1.05,.02,x,.5+h+.01,z,Pk,K);sph(.025,x,.5+h+.04,z,Pu,K)}};
  pot(-.38,.02,.1,.14,true);pot(-.14,.06,.085,.06,false);bx(.14,.02,.03,-.14,.545,.19,Pu,K);
  const kt=cyl(.07,.1,.1,.33,.56,.06,Pu,K);cyl(.03,.03,.015,.33,.62,.06,0xe6dcff,K);
  /* basket of toy fruit at the front-left foot of the kitchen */
  bx(.3,.12,.25,-.4,.06,.38,0xf08a3d,K);[[0xd9304a,-.46],[0xf6dc4a,-.4],[0x6ab04c,-.34],[0xff8a3d,-.43],[0x7a3fa0,-.37]].forEach((a,i)=>sph(.05,a[1],.14,.36+(i%2)*.06,a[0],K))}
 /* sprite particles: notes, hearts, steam, bubbles */
 const mk=fn=>{const c=document.createElement('canvas');c.width=c.height=64;fn(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t};
 EP.tx.note=mk(g=>{g.fillStyle='#ff7a3d';g.beginPath();g.ellipse(24,48,12,9,-.4,0,7);g.fill();g.fillRect(32,10,5,38);g.beginPath();g.moveTo(37,10);g.quadraticCurveTo(54,18,46,34);g.lineTo(42,30);g.quadraticCurveTo(48,20,37,16);g.fill()});
 EP.tx.heart=mk(g=>{g.fillStyle='#ff4f7a';g.beginPath();g.moveTo(32,56);g.bezierCurveTo(4,36,8,8,32,22);g.bezierCurveTo(56,8,60,36,32,56);g.fill()});
 EP.tx.steam=mk(g=>{const r=g.createRadialGradient(32,32,2,32,32,30);r.addColorStop(0,'rgba(255,255,255,.9)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64)});
 EP.tx.bubble=mk(g=>{g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=5;g.fillStyle='rgba(200,235,255,.35)';g.beginPath();g.arc(32,32,24,0,7);g.fill();g.stroke()});
 for(let i=0;i<30;i++){const sm=new THREE.SpriteMaterial({map:EP.tx.note,transparent:true,fog:false,depthWrite:false}),s=new THREE.Sprite(sm);s.visible=false;P.add(s);EP.fx.push({s,sm,on:false,t:0,life:1.4,vx:0,vy:0,vz:0,sz:.3,kind:'note'})}
const ZTX={};
function zTex(k){if(ZTX[k])return ZTX[k];let R=7;const r=()=>{R=(R*9301+49297)%233280;return R/233280};
 const t=satTx(256,256,(g,w,h)=>{
  if(k==='giraffe'){g.fillStyle='#f1d9a6';g.fillRect(0,0,w,h);g.fillStyle='#b8692b';for(let y=0;y<6;y++)for(let x=0;x<6;x++){const cx=x*44+(y%2)*22+r()*8,cy=y*44+r()*8;g.beginPath();for(let i=0;i<7;i++){const a=i/7*6.283,rr=15+r()*6;g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}g.closePath();g.fill()}}
  else if(k==='tiger'){g.fillStyle='#e0862e';g.fillRect(0,0,w,h);const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.85,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(255,245,225,.9)');g.fillStyle='#1b140f';for(let i=0;i<14;i++){const x=i*19+r()*6;g.beginPath();g.moveTo(x,0);g.quadraticCurveTo(x+10+r()*8,h*.35,x+3,h*.7);g.lineTo(x+7,h*.68);g.quadraticCurveTo(x+16,h*.35,x+8,0);g.fill()}g.fillStyle=gr;g.fillRect(0,0,w,h)}
  else if(k==='cheetah'){g.fillStyle='#e6c385';g.fillRect(0,0,w,h);g.fillStyle='#2a1d12';for(let i=0;i<150;i++){g.beginPath();g.arc(r()*w,r()*h,2.5+r()*2.5,0,7);g.fill()}}
  else if(k==='croc'){g.fillStyle='#6f7a3e';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=14)for(let x=0;x<w;x+=14){g.fillStyle=r()<.5?'#5b6633':'#848f4e';g.fillRect(x+1+(y/14%2)*7,y+1,12,12)}}
  else if(k==='elephant'||k==='rhino'||k==='hippo'){g.fillStyle=k==='hippo'?'#5a4a4a':k==='rhino'?'#7b7d7c':'#6f7275';g.fillRect(0,0,w,h);g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1.5;for(let i=0;i<60;i++){g.beginPath();const x=r()*w,y=r()*h;g.moveTo(x,y);g.quadraticCurveTo(x+10,y+r()*8,x+24,y+r()*4);g.stroke()}}
  else if(k==='fur'){g.fillStyle='#fff';g.fillRect(0,0,w,h);g.strokeStyle='rgba(0,0,0,.08)';g.lineWidth=1.2;for(let i=0;i<500;i++){const x=r()*w,y=r()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+2,y+6);g.stroke()}}
 });ZTX[k]=new THREE.MeshStandardMaterial({map:t,roughness:.75});return ZTX[k]}
function zooAnimal(k){const g=new THREE.Group(),mm=(c,o)=>{if(c&&c.isMaterial)return c;const q=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.72,map:zTex('fur').map},o||{}));q.color.convertSRGBToLinear();return q},
 E=(m,x,y,z,sx,sy,sz,rx,ry,rz)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),mm(m));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx||0,ry||0,rz||0);g.add(o);return o},
 L=(m,x,y0,z,h,r1,r2,rx,rz)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,12),mm(m));o.position.set(x,y0+h/2,z);if(rx||rz){o.rotation.x=rx||0;o.rotation.z=rz||0}g.add(o);return o},
 Seg=(m,a,b,r1,r2)=>{const d=b.clone().sub(a),len=d.length(),o=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,len,12),mm(m));o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());g.add(o);return o},
 eyes=(x,y,z,r)=>[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(r||.025,10,8),new THREE.MeshStandardMaterial({color:0x140c08,roughness:.2}));e.position.set(s*x,y,z);g.add(e)}),
 leg4=(m,h,w,f,b,r1,r2,hoof)=>[[-w,f],[w,f],[-w,b],[w,b]].forEach(q=>{L(m,q[0],0,q[1],h,r1,r2||r1*.75);if(hoof)L(hoof,q[0],0,q[1],h*.12,(r2||r1*.75)*1.05,(r2||r1*.75)*1.1)});
 let fit=1;
 if(k==='giraffe'){const s=zTex('giraffe'),cr=0xf1d9a6;leg4(s,.95,.15,.32,-.32,.055,.04,0x4a3a2a);E(s,0,1.08,0,.24,.28,.55,-.12);Seg(s,V(0,1.12,.3),V(0,1.95,.62),.12,.07);E(s,0,2.0,.74,.08,.09,.2,.25);E(cr,0,1.96,.9,.06,.055,.08);[-1,1].forEach(q=>{L(0x5a3a1e,q*.04,2.05,.66,.12,.016,.02);E(0x3a2412,q*.04,2.18,.66,.025,.025,.025);E(cr,q*.08,2.06,.68,.07,.025,.03,0,0,q*.5)});eyes(.075,2.05,.8,.018);Seg(0x8a5a2a,V(0,1.1,.4),V(0,1.9,.66),.025,.02).position.z-=.08;Seg(s,V(0,1.15,-.52),V(0,.75,-.66),.02,.015);E(0x2a1a0e,0,.72,-.67,.03,.06,.03);fit=.27/2.2}
 else if(k==='tiger'||k==='cheetah'||k==='lion'){const s=k==='lion'?mm(0xc49a5c):zTex(k),bl=k==='lion'?.95:1,c0=k==='lion'?0xc49a5c:k==='tiger'?0xe0862e:0xe6c385;leg4(s,.42,.15,.33,-.34,.06,.045);E(s,0,.55,0,.2,.2,.5*bl);E(s,0,.62,.5,.15,.14,.16);E(k==='tiger'?0xf5ecd8:c0,0,.57,.64,.08,.07,.09);E(0x2a1a14,0,.6,.72,.03,.025,.02);[-1,1].forEach(q=>E(c0,q*.09,.75,.48,.04,.045,.02));eyes(.055,.66,.63,.016);
  if(k==='lion')E(0x5a3518,0,.62,.44,.25,.26,.17);Seg(s,V(0,.6,-.48),V(0,.3,-.9),.03,.025);if(k==='lion')E(0x3a2412,0,.29,-.92,.05,.06,.05);if(k==='cheetah')[-1,1].forEach(q=>Seg(0x1a120c,V(q*.05,.64,.66),V(q*.06,.55,.66),.008,.008));fit=.29/1.3}
 else if(k==='elephant'){const s=zTex('elephant');leg4(s,.55,.2,.3,-.3,.11,.1,0x9a9590);E(s,0,.85,0,.33,.36,.55);E(s,0,1.02,.5,.24,.25,.22);[-1,1].forEach(q=>{const ear=E(s,q*.24,1.0,.45,.03,.26,.2,0,q*.35);Seg(0xf2ecd8,V(q*.1,.85,.62),V(q*.12,.72,.82),.035,.02)});Seg(s,V(0,.95,.66),V(0,.55,.78),.08,.05);Seg(s,V(0,.55,.78),V(0,.25,.85),.05,.035);eyes(.15,1.06,.65,.02);Seg(s,V(0,.9,-.54),V(0,.5,-.62),.02,.015);fit=.27/1.25}
 else if(k==='hippo'){const s=zTex('hippo');leg4(s,.28,.2,.3,-.3,.09,.085);E(s,0,.5,0,.32,.28,.55);E(s,0,.55,.5,.24,.2,.22);E(s,0,.47,.72,.2,.17,.15);[-1,1].forEach(q=>{E(s,q*.1,.73,.5,.045,.04,.04);E(0x2a1e1e,q*.07,.55,.84,.02,.02,.012);E(s,q*.12,.7,.42,.03,.04,.02)});eyes(.12,.7,.58,.018);E(0xc7a49a,0,.36,.78,.14,.03,.08);fit=.26/1.3}
 else if(k==='rhino'){const s=zTex('rhino');leg4(s,.3,.19,.3,-.3,.09,.08);E(s,0,.55,0,.3,.3,.58);E(s,0,.52,.55,.19,.18,.25,-.2);const h=new THREE.Mesh(new THREE.ConeGeometry(.06,.24,10),mm(0xb8b0a0));h.position.set(0,.7,.74);h.rotation.x=.45;g.add(h);const h2=new THREE.Mesh(new THREE.ConeGeometry(.04,.12,10),mm(0xb8b0a0));h2.position.set(0,.68,.6);h2.rotation.x=.3;g.add(h2);[-1,1].forEach(q=>E(s,q*.1,.75,.42,.03,.06,.025));eyes(.12,.58,.62,.016);fit=.27/1.35}
 else if(k==='panda'||k==='polar'){const w=k==='panda'?0xf2eee4:0xefe8d6,b=k==='panda'?0x1a1a1a:0xefe8d6;leg4(b,.3,.17,.24,-.24,.09,.08);if(k==='panda'){E(b,0,.6,.16,.27,.27,.12);}E(w,0,.55,-.1,.27,.27,.36);E(w,0,.72,.42,.17,.16,.18);E(w,0,.66,.6,.08,.065,.08);E(0x111111,0,.68,.67,.03,.022,.02);[-1,1].forEach(q=>{E(b,q*.11,.86,.38,.05,.05,.03);if(k==='panda')E(0x1a1a1a,q*.07,.75,.55,.04,.05,.02,0,0,q*.6)});eyes(.06,.76,.57,.014);fit=.25/1.1}
 else if(k==='redpanda'){const s=mm(0xb04a1c),dk=mm(0x2a1610);leg4(dk,.22,.13,.22,-.22,.05,.045);E(s,0,.38,0,.17,.17,.38);E(s,0,.47,.38,.13,.12,.12);E(0xfaf2e6,0,.42,.48,.06,.05,.06);E(0x111111,0,.43,.53,.02,.015,.015);[-1,1].forEach(q=>{E(0xfaf2e6,q*.08,.6,.34,.04,.045,.02);E(0xfaf2e6,q*.06,.5,.47,.025,.02,.01)});eyes(.045,.5,.47,.012);for(let i=0;i<5;i++)E(i%2?0x7a2c10:0xc0582a,0,.3-i*.04,-.4-i*.08,.07,.06,.06);fit=.24/1.0}
 else if(k==='rabbit'){const s=mm(0xc4a888);E(s,0,.3,-.05,.24,.25,.3);E(0xf5ecdc,0,.3,.12,.16,.17,.15);E(s,0,.5,.18,.15,.14,.15);[-1,1].forEach(q=>{E(s,q*.06,.78,.12,.04,.17,.035,-.2,0,q*.12);E(0xe8c4b8,q*.06,.78,.14,.022,.13,.01,-.2,0,q*.12);E(s,q*.13,.08,.15,.05,.05,.09)});E(0xffffff,0,.3,-.36,.07,.07,.06);eyes(.08,.55,.27,.015);E(0x8a5a5a,0,.48,.33,.015,.012,.01);fit=.26/.95}
 else if(k==='shoebill'){const s=mm(0x7f8a94);[-1,1].forEach(q=>L(0x3a3a3a,q*.07,0,0,.45,.02,.018));E(s,0,.65,0,.17,.27,.2,-.25);E(0x6a747e,0,.6,-.15,.12,.2,.14,.4);E(s,0,.98,.06,.13,.12,.13);const bk=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,.24),mm(0xd8c27a));bk.position.set(0,.93,.25);g.add(bk);E(0xd8c27a,0,.9,.38,.05,.04,.05);eyes(.07,1.0,.11,.018);fit=.28/1.15}
 else if(k==='croc'){const s=zTex('croc');E(s,0,.12,0,.2,.1,.5);E(s,0,.12,.55,.12,.07,.22);E(s,0,.1,.82,.08,.045,.2);const t=new THREE.Mesh(new THREE.ConeGeometry(.12,.7,10),s);t.rotation.x=-Math.PI/2;t.position.set(0,.1,-.8);g.add(t);[-1,1].forEach(sx=>[-1,1].forEach(sz=>Seg(s,V(sx*.17,.1,sz*.28),V(sx*.27,0,sz*.33),.035,.03)));eyes(.06,.2,.55,.015);for(let i=0;i<8;i++)E(0x4a5428,0,.21,.4-i*.12,.02,.02,.03);fit=.29/1.7}
 else if(k==='seal'){const s=mm(0xb9bcc0);E(s,0,.22,0,.22,.2,.5);E(s,0,.42,.42,.15,.14,.15);E(0xd8dade,0,.38,.55,.07,.06,.06);E(0x222222,0,.4,.6,.02,.015,.015);[-1,1].forEach(q=>{E(s,q*.22,.08,.25,.12,.03,.07,0,q*.4);E(s,q*.08,.06,-.52,.1,.03,.07)});eyes(.06,.46,.54,.016);fit=.26/1.1}
 else if(k==='dino'){const s=mm(0x6c8b44),bel=mm(0xb7b77a);[-1,1].forEach(q=>{Seg(s,V(q*.1,.55,-.05),V(q*.12,.28,.05),.07,.05);Seg(s,V(q*.12,.28,.05),V(q*.12,0,-.05),.045,.03);E(0x3a4a22,q*.12,.02,.05,.05,.02,.09)});E(s,0,.65,0,.17,.18,.34,-.2);E(bel,0,.6,.1,.12,.13,.2);Seg(s,V(0,.75,.25),V(0,.95,.4),.09,.07);E(s,0,1.0,.48,.08,.08,.17);[-1,1].forEach(q=>Seg(s,V(q*.1,.7,.25),V(q*.13,.55,.37),.025,.02));const t=new THREE.Mesh(new THREE.ConeGeometry(.12,.7,10),s);t.rotation.x=-1.35;t.position.set(0,.6,-.6);g.add(t);eyes(.06,1.04,.55,.015);fit=.28/1.15}
 else if(k==='beetle'){const s=new THREE.MeshStandardMaterial({color:0x1a1410,roughness:.25,metalness:.2});E(s,0,.12,-.1,.2,.1,.33);E(s,0,.13,.25,.14,.08,.1);[-1,1].forEach(q=>{Seg(0x3a2410,V(q*.07,.15,.32),V(q*.18,.17,.62),.028,.018);Seg(0x3a2410,V(q*.18,.17,.62),V(q*.08,.15,.78),.018,.012);[-.15,0,.15].forEach(z=>{Seg(s,V(q*.15,.1,z),V(q*.3,.02,z+.05),.012,.01)})});fit=.25/.9}
 else if(k==='dog'){const s=mm(0x1c1a1a),cr=mm(0xf2ead8),tn=mm(0xb07a4a);leg4(cr,.28,.13,.26,-.26,.045,.04);E(s,0,.42,0,.17,.17,.35);E(cr,0,.38,.15,.13,.13,.18);E(s,0,.62,.35,.13,.12,.13);E(cr,0,.56,.47,.07,.05,.08);E(0x111111,0,.57,.54,.02,.015,.015);[-1,1].forEach(q=>{const e=new THREE.Mesh(new THREE.ConeGeometry(.045,.1,4),s);e.position.set(q*.07,.76,.32);g.add(e);E(tn,q*.05,.67,.44,.02,.012,.01)});eyes(.05,.65,.45,.013);E(s,0,.58,-.28,.07,.07,.07);fit=.25/1.0}
 else if(k==='hamster'){const s=mm(0xe1a15a),cr=mm(0xfaf0dc);E(s,0,.22,0,.26,.22,.3);E(cr,0,.18,.08,.2,.16,.24);E(s,0,.35,.22,.16,.14,.15);E(cr,0,.3,.33,.08,.06,.06);[-1,1].forEach(q=>{E(0xe8b8a0,q*.11,.48,.18,.04,.045,.02);E(cr,q*.08,.06,.25,.04,.03,.05)});eyes(.08,.38,.33,.016);E(0xd88a8a,0,.32,.38,.015,.012,.01);fit=.2/.7}
 else if(k==='shark'){const b=new THREE.MeshStandardMaterial({color:0x4b86c8,roughness:.45}),w=new THREE.MeshStandardMaterial({color:0xf2f2f0,roughness:.5});E(b,0,.3,0,.26,.24,.55);E(w,0,.22,.12,.2,.15,.42);const f=new THREE.Mesh(new THREE.ConeGeometry(.1,.25,10),b);f.position.set(0,.55,-.05);f.rotation.x=-.3;f.scale.z=.35;g.add(f);const t=new THREE.Mesh(new THREE.ConeGeometry(.16,.3,10),b);t.rotation.x=-Math.PI/2;t.position.set(0,.32,-.62);t.scale.x=.3;g.add(t);[-1,1].forEach(q=>{const p=new THREE.Mesh(new THREE.ConeGeometry(.07,.2,8),b);p.rotation.z=q*1.9;p.position.set(q*.24,.18,.08);p.scale.z=.35;g.add(p)});eyes(.13,.38,.4,.02);for(let i=0;i<7;i++){const th=new THREE.Mesh(new THREE.ConeGeometry(.015,.04,4),w);th.position.set((i-3)*.035,.27,.5-Math.abs(i-3)*.015);th.rotation.x=Math.PI;g.add(th)}E(0xd84a4a,0,.24,.49,.12,.03,.02);fit=.28/1.2}
 g.traverse(o=>{if(o.isMesh)o.castShadow=true});g.scale.setScalar(fit);return g}
function zooInit(){if(EP.zoo)return EP.zoo;const P=G.E,g=new THREE.Group();g.position.set(1.62,.012,-2.55);P.add(g);
 const tint=[0x2e3d14,0xa84a0c,0x2c3238,0x2e3d14],cell=.31,cells=[],COLS=3,ROWS=4;
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const x=(c-1)*cell,y=r*cell,col=tint[(r+c*2)%4],pm=new THREE.MeshStandardMaterial({color:col,transparent:true,opacity:.55,roughness:.15,metalness:.1,side:THREE.DoubleSide,depthWrite:false}),fm=new THREE.MeshStandardMaterial({color:col,roughness:.3,transparent:true,opacity:.92});
  const box=new THREE.Group();box.position.set(x,y,0);g.add(box);
  /* window panel: frame with an octagon hole, like the real tiles */
  const sh=new THREE.Shape();const h=cell/2-.006;sh.moveTo(-h,-h);sh.lineTo(h,-h);sh.lineTo(h,h);sh.lineTo(-h,h);sh.closePath();const ho=new THREE.Path(),q=h*.62,c2=h*.3;ho.moveTo(-q+c2,-q);ho.lineTo(q-c2,-q);ho.lineTo(q,-q+c2);ho.lineTo(q,q-c2);ho.lineTo(q-c2,q);ho.lineTo(-q+c2,q);ho.lineTo(-q,q-c2);ho.lineTo(-q,-q+c2);ho.closePath();sh.holes.push(ho);const pg=new THREE.ShapeGeometry(sh);
  [[0,-cell/2,0],[-cell/2,0,Math.PI/2],[cell/2,0,Math.PI/2]].forEach(o=>{if(o[0]===cell/2&&c<COLS-1)return;const p=new THREE.Mesh(pg,pm);p.position.set(o[0],cell/2,o[1]);p.rotation.y=o[2];p.renderOrder=3;box.add(p)});
  const fl=new THREE.Mesh(new THREE.BoxGeometry(cell,.012,cell),new THREE.MeshStandardMaterial({color:0x3e444a,transparent:true,opacity:.6,roughness:.15}));fl.position.y=.006;box.add(fl);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(qq=>{const b=new THREE.Mesh(new THREE.BoxGeometry(.016,cell,.016),fm);b.position.set(qq[0]*cell/2,cell/2,qq[1]*cell/2);box.add(b)});
  [.006,cell].forEach(yy=>{[[-1],[1]].forEach(qq=>{const b=new THREE.Mesh(new THREE.BoxGeometry(.016,.016,cell),fm);b.position.set(qq[0]*cell/2,yy,0);box.add(b)});const b2=new THREE.Mesh(new THREE.BoxGeometry(cell,.016,.016),fm);b2.position.set(0,yy,-cell/2);box.add(b2);const b3=b2.clone();b3.position.z=cell/2;box.add(b3)});
  cells.push(V(x,y+.014,.02))}
 const tray=new THREE.Mesh(new THREE.CylinderGeometry(.2,.17,.05,20),M(0xe8c04a,{roughness:.6}));tray.position.set(.78,.025,.32);g.add(tray);
 const lab=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false}));lab.scale.set(.34,.085,1);lab.renderOrder=9;lab.visible=false;g.add(lab);const lc=document.createElement('canvas');lc.width=512;lc.height=128;lab.material.map=new THREE.CanvasTexture(lc);
 EP.zoo={g,cells,tray,an:[],lab,lc};return EP.zoo}
const satTx=(w,h,fn,rx,ry)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h,c);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rx)t.repeat.set(rx,ry||rx);t.anisotropy=4;return t};
let girl=null,sayE=null,sayT=0,caption='',done=false;const off=new THREE.Vector3(),AU={ctx:{currentTime:0},mus:true},OUT={cur:'clothes'},EZ=1;
const HCAM={pos:new THREE.Vector3(),base:new THREE.Vector3(),tgt:new THREE.Vector3()};

const tone=(midi,at,duration,volume,type)=>onSound({midi,duration,volume,type}),wcSnd=()=>{},setTimeout=fn=>fn();
const $=()=>({set innerHTML(v){caption=String(v).replace(/<[^>]+>/g,' ').trim().replace(/^your friend\s*/, '').replace(/^[^A-Za-z0-9]+/,'').trim();}});
function faceTo(e,x,z){e.yaw=Math.atan2(x-e.pos.x,z-e.pos.z);}
function eaEnd(){EA.on=false;done=true;girl.g.visible=true;girl.sit=false;girl.pose=null;girl.lean=0;girl.waveT=0;girl.mv=0;girl.body.rotation.set(0,0,0);girl.pos.y=0;EP.spoon.visible=false;EP.cut.kn.visible=false;EP.cut.g.visible=false;EP.legoT.forEach(b=>b.visible=false);EP.keys.forEach(m=>m.visible=false);EP.plush.forEach(p=>{p.g.position.y=0;p.g.visible=false;p.g.scale.setScalar(.001);p.pop=0;});EP.zoo.lab.visible=false;}

const EA={on:false,id:null,cfg:null,t:0,sb:0,ni:-1,kt:[0,0,0,0,0,0,0,0],ht:0,pt:0};
const EMEL=[0,0,4,4,5,5,4,3,3,2,2,1,1,0],ESCL=[60,62,64,65,67,69,71,72];
const ZOO_AN={hippo:['Hippopotamus','🦛'],tiger:['Tiger','🐯'],shark:['Baby shark','🦈'],lion:['Lion','🦁'],elephant:['Elephant','🐘'],giraffe:['Giraffe','🦒'],panda:['Panda','🐼'],polar:['Polar bear','🐻‍❄️'],redpanda:['Red panda','🦊'],rabbit:['Rabbit','🐰'],shoebill:['Shoebill bird','🐦'],croc:['Crocodile','🐊'],seal:['Seal','🦭'],cheetah:['Cheetah','🐆'],rhino:['Rhinoceros','🦏'],dino:['Dinosaur','🦖'],beetle:['Stag beetle','🪲'],dog:['Shiba dog','🐕'],hamster:['Hamster','🐹']};
function zooLabel(t){const Z=EP.zoo,x=Z.lc.getContext('2d');x.clearRect(0,0,512,128);x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.roundRect?x.roundRect(8,14,496,100,46):x.rect(8,14,496,100);x.fill();x.lineWidth=6;x.strokeStyle='#ff8a3d';x.stroke();x.fillStyle='#23343f';x.font='700 54px Fredoka,"Apple Color Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,256,66);Z.lab.material.map.needsUpdate=true}
function zooStart(){const Z=zooInit();Z.an.forEach(a=>{if(a.g.parent)a.g.parent.remove(a.g)});const ks=Object.keys(ZOO_AN).sort(()=>Math.random()-.5);const n=3+((Math.random()*2)|0),slots=[0,1,2,3,4,5,6,7,8,9,10,11].sort(()=>Math.random()-.5);
 Z.an=ks.slice(0,n).map((k,i)=>{const g=zooAnimal(k);Z.g.add(g);const home=V(.72+(i%2)*.12,.05,.26+(i>>1)*.12);g.position.copy(home);g.rotation.y=Math.PI*.6;return{k,g,home,to:Z.cells[slots[i]].clone(),st:0}});Z.n=n;Z.lab.visible=false;Z.g.visible=true;Z.cp=null;Z.ot=null}
function zooTick(t,dt,say){const Z=EP.zoo;if(!Z)return;const per=3.6,t0=1.6;girl.pose='give';girl.wph=t;
 Z.an.forEach((a,i)=>{const s=t0+i*per,u=(t-s)/1.1;if(u<0){a.g.position.copy(a.home);return}const v=Math.min(1,u),e=v*v*(3-2*v);a.g.position.set(lp(a.home.x,a.to.x,e),lp(a.home.y,a.to.y,e)+Math.sin(e*Math.PI)*.25,lp(a.home.z,a.to.z,e));a.g.rotation.y=lp(Math.PI*.6,.15,e);
  if(v>=1&&!a.st){a.st=1;const nm=ZOO_AN[a.k];say(nm[1]+' '+nm[0]+'! '+['This is the '+nm[0].toLowerCase()+'.','Hello, '+nm[0].toLowerCase()+'!','You live here, '+nm[0].toLowerCase()+'!'][i%3],3);zooLabel(nm[1]+' '+nm[0]);Z.lab.position.set(a.to.x-.05,a.to.y+.36,a.to.z+.2);Z.lab.visible=true;Z.labT=2.6;efx('heart',1.62+a.to.x,a.to.y+.35,-2.55+a.to.z+.1);try{if(AU.ctx&&AU.mus)tone(72+i*4,AU.ctx.currentTime+.01,.35,.12,'bell')}catch(e){}}});
 if(Z.labT>0){Z.labT-=dt;if(Z.labT<=0)Z.lab.visible=false}
 /* camera: overview first, then a close look at each animal as it goes in, then the whole castle again */
 const ci=Math.floor((t-t0+.6)/per),cur=ci>=0&&ci<Z.an.length?Z.an[ci]:null,O=Z.g.position;let lk,cp;
 if(cur){const c=cur.to;lk=V(O.x+c.x+off.x,O.y+c.y+.12+off.y,O.z+c.z+off.z);cp=V(lk.x-.38,lk.y+.22,lk.z+.78)}else{if(!Z.ot)Z.ot=HCAM.tgt.clone();lk=Z.ot.clone();cp=HCAM.base.clone()}
 if(!Z.cp){Z.cp=cp.clone();Z.cl=lk.clone()}const kk=Math.min(1,dt*2.2);Z.cp.lerp(cp,kk);Z.cl.lerp(lk,kk);HCAM.pos.copy(Z.cp);HCAM.tgt.copy(Z.cl)}
function efx(kind,x,y,z){const p=EP.fx.find(q=>!q.on);if(!p)return;p.on=true;p.t=0;p.kind=kind;p.s.material.map=EP.tx[kind]||EP.tx.heart;p.s.material.needsUpdate=true;p.s.position.set(x,y,z);p.s.scale.setScalar(.24);p.s.visible=true;}
function tickFX(dt){for(const p of EP.fx)if(p.on){p.t+=dt;p.s.position.y+=dt*.4;p.sm.opacity=Math.max(0,1-p.t/1.4);if(p.t>1.4){p.on=false;p.s.visible=false;}}}
function satHearts(e,n,y){for(let i=0;i<(n||5);i++)efx('heart',e.pos.x+(rnd()-.5)*.5,y||1,e.pos.z+(rnd()-.5)*.5);}
function eaTick(dt){const A=EA,c=A.cfg,k=A.id,t=A.t+=dt*(c.k||1);girl.mv=0;{const dx=HCAM.tgt.x-HCAM.base.x,dz=HCAM.tgt.z-HCAM.base.z,dl=Math.hypot(dx,dz)||1,u=Math.min(1,t/c.dur),sw=Math.sin(t*.9)*.25;HCAM.pos.copy(HCAM.base).lerp(HCAM.tgt,u*.12);HCAM.pos.x+=-dz/dl*sw;HCAM.pos.z+=dx/dl*sw;HCAM.pos.y+=Math.sin(t*1.3)*.05}const say=(s,d)=>{sayE=girl;sayT=d||3.4;$('say').innerHTML='<b>your friend</b><br>'+s};
if(k==='piano'){girl.pose='recv';girl.body.rotation.z=Math.sin(t*3)*.05;const i=Math.floor((t-1)/.62);
  if(t>=1&&i>=0&&i<EMEL.length&&i!==A.ni){A.ni=i;const n=EMEL[i];EP.keys[n].visible=true;A.kt[n]=.32;try{if(AU.ctx&&AU.mus)tone(ESCL[n],AU.ctx.currentTime+.01,.5,.14,'pluck')}catch(e){}efx('note',2.1,1.15,.66+n*.2)}
  EP.keys.forEach((m,j)=>{if(A.kt[j]>0){A.kt[j]-=dt;if(A.kt[j]<=0)m.visible=false}});
  if(A.sb===0&&t>5){A.sb=1;say('Twinkle, twinkle, little star!',3.4)}if(A.sb===1&&t>9.6){A.sb=2;say('Ta-da!',2.2)}}else if(k==='kitchen'){girl.pose='recv';const a=t*5;EP.spoon.position.set(-2.25+Math.cos(a)*.05,.59+.1,-3.77+Math.sin(a)*.05);EP.spoon.rotation.set(Math.sin(a)*.18,0,-Math.cos(a)*.18);girl.body.rotation.z=Math.sin(t*2.5)*.04;
  A.pt-=dt;if(A.pt<=0){A.pt=.28;efx('steam',-2.25,.85,-3.77)}
  if(A.sb===0&&t>4.6){A.sb=1;say('Yum yum!',3)}if(A.sb===1&&t>7.4){A.sb=2;say('Ding! Soup is ready!',2.6);for(let i=0;i<3;i++)setTimeout(()=>efx('heart',-2.25,1.05+i*.1,-3.4),i*150)}}else if(k==='fruit'){const Q=EP.cut,ch=(t0,n)=>{const u=t-t0;return u>=0&&u<n*.5?Math.abs(Math.sin(u*Math.PI/.5)):0};
  girl.pose='type';girl.wph=t*5;girl.yaw=Math.atan2(c.face[0]-girl.pos.x,c.face[1]-girl.pos.z)+Math.sin(t*.9)*.08;
  const seg=t<3?0:t<6?1:2,tz=[-.26,.02,.3][seg],chop=seg===0?ch(.5,4):seg===1?ch(3.2,5):ch(6.2,3);
  Q.kn.position.set(0,.09+chop*.12+(seg===0?.08:0),tz);Q.kn.rotation.x=-.3+chop*.25;
  const ap=Math.min(1,Math.max(0,(t-2.4)/.5));Q.aL.position.x=.03*ap;Q.aR.position.x=-.03*ap;Q.aL.rotation.z=-.15*ap;Q.aR.rotation.z=.15*ap;
  if(t>3.1){Q.bw.visible=false;const n=Math.min(6,Math.floor((t-3.1)/.4));Q.bs.forEach((q,i)=>{q[0].visible=q[1].visible=i<n})}
  const sp=Math.min(1,Math.max(0,(t-8.1)/.5));Q.sL.position.x=.028*sp;Q.sR.position.x=-.028*sp;
  if(A.sb===0&&t>.3){A.sb=1;say('Cut, cut, cut the apple!',2.6)}
  if(A.sb===1&&t>2.9){A.sb=2;say('Now the banana! Chop, chop!',2.6);for(let i=0;i<3;i++)efx('heart',-2.0,.4+i*.1,-2.8+(i-1)*.15)}
  if(A.sb===2&&t>5.9){A.sb=3;say('And a strawberry!',2.2)}
  if(A.sb===3&&t>8.2){A.sb=4;say('Yummy fruit salad!',1.2);girl.pose='clap';for(let i=0;i<4;i++)setTimeout(()=>efx('heart',-2.0,.5+i*.1,-2.8+(i-1.5)*.2),i*130)}}else if(k==='teach'){girl.pose='give';faceTo(girl,-0.95,.9);
  EP.plush.forEach((p,i)=>{const u=Math.max(0,Math.min(1,(t-.8-i*.4)/.4));p.g.visible=u>0;const sc=u<=0?.001:u<1?(1+Math.sin(u*Math.PI)*.25)*u:1;p.g.scale.setScalar(Math.max(.001,sc));if(u>0&&!p.pop){p.pop=1;efx('heart',-.95,.75,-.5+i*.7)}});
  const bounce=(t>5.6&&t<7.8)||t>9.4;EP.plush.forEach((p,i)=>{p.g.position.y=bounce?Math.max(0,Math.sin(t*9+i*1.3))*.12:0});
  if(A.sb===0&&t>2.8){A.sb=1;say('Good afternoon, class!',2.6)}
  if(A.sb===1&&t>5.4){A.sb=2;say('A for apple! Can you say A?',3.4)}
  if(A.sb===2&&t>8.4){A.sb=3;say('Very good, class!',2.6)}
  if(A.sb===3&&t>10.8){A.sb=4;say('See you tomorrow!',1.8);for(let i=0;i<4;i++)setTimeout(()=>efx('heart',-.95,.9+i*.1,.2+i*.4),i*140)}}else if(k==='zoo'){zooTick(t,dt,say);girl.yaw=Math.atan2(c.face[0]-girl.pos.x,c.face[1]-girl.pos.z)+Math.sin(t*.8)*.12;const Z=EP.zoo,te=1.6+Z.n*3.6+.4;if(A.sb===0&&t>te){A.sb=1;girl.pose='wave2';girl.waveT=2;girl.w2=1;say('My animal castle is full of friends! Hooray!',3);if(Z)Z.lab.visible=false}}else if(k==='lego'){girl.pose='type';girl.wph=t*2;girl.yaw=Math.atan2(c.face[0]-girl.pos.x,c.face[1]-girl.pos.z)+Math.sin(t*.7)*.15;const n=Math.min(8,Math.floor(t/1.2));EP.legoT.forEach((b,i)=>{if(i<n&&!b.visible){b.visible=true;efx('heart',1.25,.5+i*.09,-1.95)}});
  if(A.sb===0&&t>2.5){A.sb=1;say('Click, click! One more brick!',2.6)}
  if(A.sb===1&&t>7){A.sb=2;say('A tall lego tower!',2.6)}
  if(A.sb===2&&t>10.2){A.sb=3;say('Hooray! I did it!',1.6)}}else if(k==='cars'){const per=1.55,i=Math.floor((t-1)/per),u=(t-1)/per-i;girl.yaw=Math.atan2(c.face[0]-girl.pos.x,c.face[1]-girl.pos.z)+Math.sin(t*.8)*.12;
  EP.cars.forEach((car,j)=>{const h=EP.carHome[j],sl=EP.carSlot(j);if(j<i||(j===i&&u>=.75)){car.position.set(sl[0],0,sl[1]);car.rotation.set(0,sl[2],0)}else if(j===i&&t>=1){const v=cl(u/.75,0,1),e=v*v*(3-2*v);car.position.set(lp(h[0],sl[0],e),Math.sin(e*Math.PI)*.18,lp(h[1],sl[1],e));car.rotation.set(Math.sin(e*Math.PI)*.25,lp(h[2],sl[2],e),0)}});
  girl.pose=(t>=1&&i<7&&u<.8)?'give':null;girl.lean=.28+((t>=1&&i<7&&u<.8)?Math.sin(u/.8*Math.PI)*.12:0);
  if(t>=1&&i<7&&i!==A.cn&&u>.72){A.cn=i;say(['One car!','Two cars!','Three cars!','Four cars!','Five cars!','Six cars!','Seven cars!'][i],1.3);try{if(AU.ctx&&AU.mus)tone([60,62,64,65,67,69,72][i],AU.ctx.currentTime+.01,.25,.12,'pluck')}catch(e){}const sl=EP.carSlot(i);efx('heart',.74+sl[0],.35,.12+sl[1])}
  if(A.sb===0&&t>12.2){A.sb=1;say('All my cars in a long line, one behind the other! Brum brum!',2.4);for(let n=0;n<5;n++)efx('heart',.74,.4+n*.08,.12+(n-2)*.3)}}
if(t>=c.dur)eaEnd();}

zooInit();
const referenceItems={};for(const [id,v]of Object.entries(PLAYMAT_REFERENCE)){const object=id==='castle'?EP.zoo.g:id==='cars'?EP.carG:id==='lego'?EP.lego:id==='fruit'?EP.cut.g:P.children.find(o=>o.position.distanceTo(V(...v))<.00001);if(!object)throw Error('Missing Schoolbus reference prop: '+id);object.name='Schoolbus '+id;object.userData.referenceProp=id;referenceItems[id]=object;}
const focusObjects=id=>id==='kitchen'?[referenceItems.kitchen,EP.spoon]:id==='teach'?EP.plush.map(p=>p.g):id==='cars'?EP.cars:id==='lego'?[EP.legoTw]:id==='fruit'?[EP.cut.g]:id==='zoo'?[EP.zoo.g]:[referenceItems.piano];
const EACT=Object.fromEntries(Object.entries(HOME_ACTIVITIES).filter(([id])=>PLAYMAT_IDS.includes(id)));return {root:G.E,extras:EP,animal:zooAnimal,activities:EACT,camera:HCAM,referenceItems,focusObjects,
start(id,actor){const cfg=EACT[id];if(!cfg||EA.on)return false;girl=actor;Object.assign(EA,{on:true,id,cfg,t:0,sb:0,ni:-1,ht:0,pt:0,kt:[0,0,0,0,0,0,0,0],cn:-1});done=false;caption=cfg.txt;Object.assign(girl,{mv:0,pose:null,waveT:0,lean:0,sit:false});girl.pos.set(...cfg.sp);girl.yaw=Math.atan2(cfg.face[0]-cfg.sp[0],cfg.face[1]-cfg.sp[2]);HCAM.base.set(...cfg.cam);HCAM.pos.copy(HCAM.base);HCAM.tgt.set(...cfg.look);
if(['lego','cars','fruit'].includes(id)){girl.sit=true;girl.pos.y=.012+.12-.5*girl.g.scale.x;girl.lean=id==='cars'?.28:.3;}
EP.spoon.visible=id==='kitchen';EP.cut.g.visible=id==='fruit';EP.cut.kn.visible=id==='fruit';EP.cut.ap.visible=true;EP.cut.sb.visible=true;EP.cut.aL.position.x=EP.cut.aR.position.x=0;EP.cut.sL.position.x=EP.cut.sR.position.x=0;EP.cut.aL.rotation.z=EP.cut.aR.rotation.z=0;EP.cut.ba.position.y=.08;EP.cut.bw.visible=true;EP.cut.bs.forEach(q=>q.forEach(o=>o.visible=false));EP.plush.forEach(p=>{p.pop=0;p.g.visible=false;p.g.scale.setScalar(.001);});EP.legoT.forEach(b=>b.visible=false);EP.carReset();if(id==='zoo')zooStart();return true;},
tick(dt,seconds,{reduced=false}={}){AU.ctx.currentTime=seconds;if(!girl)return {done:false,caption:''};if(EA.on){eaTick(dt);girl.g.visible=true;}tickFX(reduced?1:dt);return {done,caption,pose:girl.pose,active:EA.on};},
get active(){return EA.on;},stop(){if(girl)eaEnd();}};}
