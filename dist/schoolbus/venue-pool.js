// Exact Schoolbus v223 pool scene builders, isolated from its game state/private media.
import {SchoolTHREE as THREE} from './core.js?v=75a';
export function createVenue(parent){let floor=null;const S=parent,G={},girl={body:new THREE.Group()},GO=new THREE.Group();parent.add(GO);
const $=id=>document.getElementById(id),TAU=Math.PI*2,lp=(a,b,u)=>a+(b-a)*u,V=(x,y,z)=>new THREE.Vector3(x,y,z),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o||{}));
const satTx=(w,h,fn,rx,ry)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h,c);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rx)t.repeat.set(rx,ry||rx);t.anisotropy=4;return t};
function satPl(P,w,h,x,y,z,ry,m,rx){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.rotation.y=ry||0;if(rx)o.rotation.x=rx;if(!floor&&rx< -1.4&&w>5&&h>5){floor=o;o.userData.dyn=1;}P.add(o);return o}
function satBx(P,w,h,d,x,y,z,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=false;o.receiveShadow=true;P.add(o);return o}
function sunMatte(P,k){const seen=new Set();P.traverse(o=>{if(o.isMesh&&o.material&&!Array.isArray(o.material)&&o.material.isMeshStandardMaterial){const m=o.material;if(seen.has(m)||m.userData.sunM)return;seen.add(m);m.userData.sunM=1;m.envMapIntensity=.35;if(m.map)m.color.multiplyScalar(k||.72);else m.color.convertSRGBToLinear().multiplyScalar(1.15);if(!m.map&&o.position.y<.15)m.userData.det=0}})}
function sunSignTx(txt,fill,stroke,w,h,fs){return satTx(w||1024,h||256,(g,W,H)=>{g.clearRect(0,0,W,H);g.font='900 '+(fs||128)+'px Fredoka,"Arial Black",system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.fillStyle='rgba(0,0,0,.3)';g.fillText(txt,W/2+6,H/2+10);g.strokeStyle=stroke;g.lineWidth=(fs||128)*.22;g.strokeText(txt,W/2,H/2);g.fillStyle=fill;g.fillText(txt,W/2,H/2);g.fillStyle='rgba(255,255,255,.35)';g.fillText(txt,W/2,H/2-6)})}
function sunMergeStatic(P){P.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(P.matrixWorld).invert(),groups=new Map(),rm=[];const ok=o=>{for(let q=o.parent;q&&q!==P;q=q.parent)if(!q.userData.static)return false;return true};
 P.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.userData.dyn||!o.geometry||Array.isArray(o.material)||!ok(o))return;const m=o.material;if(!(m.isMeshStandardMaterial||m.isMeshBasicMaterial))return;
  const k=[m.type,m.color.getHexString(),m.roughness,m.metalness,m.emissive?m.emissive.getHexString():'',m.emissiveIntensity,m.map?m.map.uuid:'',m.transparent,m.opacity,m.side,m.depthWrite,m.blending,m.envMapIntensity,m.wireframe,m.userData.det,o.castShadow,o.receiveShadow].join('|');
  let g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();if(!g.attributes.normal)g.computeVertexNormals();if(!g.attributes.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld));if(!groups.has(k))groups.set(k,{m,o,gs:[]});groups.get(k).gs.push(g);rm.push(o)});
 rm.forEach(o=>o.parent&&o.parent.remove(o));
 groups.forEach(G=>{let n=0;G.gs.forEach(g=>n+=g.attributes.position.count);const pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2);let q=0;G.gs.forEach(g=>{pos.set(g.attributes.position.array,q*3);nor.set(g.attributes.normal.array,q*3);uv.set(g.attributes.uv.array,q*2);q+=g.attributes.position.count;g.dispose()});const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(pos,3));bg.setAttribute('normal',new THREE.BufferAttribute(nor,3));bg.setAttribute('uv',new THREE.BufferAttribute(uv,2));bg.computeBoundingSphere();const me=new THREE.Mesh(bg,G.m);me.castShadow=G.o.castShadow;me.receiveShadow=G.o.receiveShadow;me.renderOrder=G.o.renderOrder;P.add(me)})}
const PL={WY:-.25,FY:-1.6,PY:-1.85,P:[{x0:-11,x1:11,z0:-28,z1:-10,ind:1},{x0:-20,x1:20,z0:8,z1:30,ind:0}],toys:[],guns:[],npc:[],drops:[],rings:[],obs:[],wMats:[],left:180,mode:'deck',rode:[]};
function plTex(t,rx,ry){const q=t.clone();q.needsUpdate=true;q.repeat.set(rx,ry);return q}
(function(){const P=GO,tx=satTx,T=PL;
 const SG=new THREE.Group();SG.userData.static=1;P.add(SG);
 const st=(x,z,ry)=>{const g=new THREE.Group();g.userData.static=1;g.position.set(x||0,0,z||0);g.rotation.y=ry||0;P.add(g);return g};
 const sph=(p,r,m,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,18,12),m);o.position.set(x,y,z);o.scale.set(sx||1,sy||1,sz||1);p.add(o);return o};
 const cyl=(p,r1,r2,h,m,x,y,z,seg)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg||14),m);o.position.set(x,y,z);p.add(o);return o};
 /* ---- textures ---- */
 const tileT=tx(256,256,(g,w,h)=>{g.fillStyle='#eaf8fb';g.fillRect(0,0,w,h);const c=['#76cde6','#88d8ee','#68c2df','#9be0f2'];for(let y=0;y<16;y++)for(let x=0;x<16;x++){g.fillStyle=c[(x*7+y*3+((x*y)%5))%4];g.fillRect(x*16+1,y*16+1,14,14)}});
 const woodT=tx(256,256,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=['#a8764c','#b5825a','#9c6c45','#b07c52'][i%4];g.fillRect(0,i*32,w,31);g.fillStyle='rgba(60,35,20,.45)';g.fillRect(0,i*32+31,w,1);g.fillRect((i*83)%w,i*32,2,32);g.fillStyle='rgba(255,230,200,.08)';for(let k=0;k<6;k++)g.fillRect(0,i*32+4+k*4,w,1)}});
 const stoneT=tx(256,256,(g,w,h)=>{g.fillStyle='#d9d2c4';g.fillRect(0,0,w,h);for(let y=0;y<4;y++)for(let x=0;x<4;x++){g.fillStyle=['#e6dfd1','#ddd5c6','#e9e3d6','#d6cebe'][(x+y*3)%4];g.fillRect(x*64+2,y*64+2,60,60);for(let k=0;k<14;k++){g.fillStyle='rgba(150,130,110,.12)';g.fillRect(x*64+4+((k*37)%56),y*64+4+((k*23)%56),3,2)}}});
 const slatT=tx(256,256,(g,w,h)=>{g.fillStyle='#f4f3ef';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=16){g.fillStyle='#dedcd6';g.fillRect(x+13,0,3,h);g.fillStyle='#ffffff';g.fillRect(x+1,0,3,h)}});
 const marbT=tx(128,256,(g,w,h)=>{g.fillStyle='#e7dbc5';g.fillRect(0,0,w,h);g.strokeStyle='rgba(160,135,100,.35)';for(let i=0;i<9;i++){g.lineWidth=1+(i%3);g.beginPath();g.moveTo((i*29)%w,0);for(let y=0;y<=h;y+=32)g.lineTo(((i*29)+Math.sin(y*.05+i)*22)%w,y);g.stroke()}});
 const wTex=tx(512,512,(g,w,h)=>{g.fillStyle='#3fb7de';g.fillRect(0,0,w,h);let s=7;const r=()=>{s=(s*9301+49297)%233280;return s/233280};g.lineCap='round';for(let i=0;i<220;i++){const x=r()*w,y=r()*h,L=18+r()*40,a=r()*6.28;g.strokeStyle='rgba(225,250,255,'+(.18+r()*.3)+')';g.lineWidth=1.5+r()*2.5;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+Math.cos(a+1)*L*.6,y+Math.sin(a+1)*L*.6,x+Math.cos(a)*L,y+Math.sin(a)*L);g.stroke()}});
 const grassT=tx(256,256,(g,w,h)=>{g.fillStyle='#4f8f3a';g.fillRect(0,0,w,h);for(let i=0;i<900;i++){g.fillStyle=['#5ea044','#447f33','#6aab4c'][i%3];g.fillRect((i*53)%w,(i*97)%h,2,4)}},30,30);
 /* ---- ground, decks with pool holes ---- */
 {const s_=new THREE.Shape();s_.moveTo(-130,126);s_.lineTo(130,126);s_.lineTo(130,-134);s_.lineTo(-130,-134);s_.closePath();T.P.forEach(p=>{const h=new THREE.Path();h.moveTo(p.x0,-p.z0);h.lineTo(p.x0,-p.z1);h.lineTo(p.x1,-p.z1);h.lineTo(p.x1,-p.z0);h.closePath();s_.holes.push(h)});const gm_=new THREE.Mesh(new THREE.ShapeGeometry(s_),new THREE.MeshStandardMaterial({map:plTex(grassT,1/8.6,1/8.6),roughness:1}));gm_.rotation.x=-Math.PI/2;gm_.position.y=-.04;gm_.receiveShadow=true;SG.add(gm_)}
 const deck=(x0,x1,z0,z1,p,t,rep)=>{const s=new THREE.Shape();s.moveTo(x0,-z0);s.lineTo(x1,-z0);s.lineTo(x1,-z1);s.lineTo(x0,-z1);s.closePath();const hl=new THREE.Path();hl.moveTo(p.x0,-p.z0);hl.lineTo(p.x0,-p.z1);hl.lineTo(p.x1,-p.z1);hl.lineTo(p.x1,-p.z0);hl.closePath();s.holes.push(hl);
  const m=new THREE.MeshStandardMaterial({map:plTex(t,1/rep,1/rep),roughness:.75});const o=new THREE.Mesh(new THREE.ShapeGeometry(s),m);o.rotation.x=-Math.PI/2;o.receiveShadow=true;SG.add(o);return o};
 deck(-19.4,19.4,-34.4,-4,T.P[0],woodT,4);deck(-32,32,-4,43.4,T.P[1],stoneT,3.2);
 T.P.forEach((p,pi)=>{const W=p.x1-p.x0,D=p.z1-p.z0,cx=(p.x0+p.x1)/2,cz=(p.z0+p.z1)/2,H=-T.FY;
  satPl(SG,W,D,cx,T.FY,cz,0,new THREE.MeshStandardMaterial({map:plTex(tileT,W/2.5,D/2.5),roughness:.45}),-Math.PI/2);
  const wm=L=>new THREE.MeshStandardMaterial({map:plTex(tileT,L/2.5,H/2.5),roughness:.45});
  satPl(SG,W,H,cx,T.FY/2,p.z0,0,wm(W));satPl(SG,W,H,cx,T.FY/2,p.z1,Math.PI,wm(W));satPl(SG,D,H,p.x0,T.FY/2,cz,Math.PI/2,wm(D));satPl(SG,D,H,p.x1,T.FY/2,cz,-Math.PI/2,wm(D));
  const ln=M(0x2b6fa8,{roughness:.5});for(let k=1;k<4;k++)satPl(SG,W-3,.22,cx,T.FY+.01,p.z0+D*k/4,0,ln,-Math.PI/2);
  const cp=M(0xf6f4ee,{roughness:.55});satBx(SG,W+.9,.1,.45,cx,.04,p.z0-.22,cp);satBx(SG,W+.9,.1,.45,cx,.04,p.z1+.22,cp);satBx(SG,.45,.1,D,p.x0-.22,.04,cz,cp);satBx(SG,.45,.1,D,p.x1+.22,.04,cz,cp);
  const wm2=new THREE.MeshStandardMaterial({map:plTex(wTex,W/7,D/7),color:0xffffff,transparent:true,opacity:.74,roughness:.08,metalness:.15,depthWrite:false});const w=satPl(P,W,D,cx,T.WY,cz,0,wm2,-Math.PI/2);w.userData.dyn=1;w.renderOrder=2;T.wMats.push(wm2);
  /* steel ladder + steps */
  const lx=p.x1-1.2,lz=p.z0,stl=M(0xd8dde2,{metalness:.8,roughness:.25});[-.35,.35].forEach(dx=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.45,.045,8,16,Math.PI),stl);r.position.set(lx+dx,.45,lz+.0);r.rotation.y=Math.PI/2;SG.add(r);cyl(SG,.045,.045,1.6,stl,lx+dx,-.35,lz+.45)});
  for(let k=0;k<3;k++)satBx(SG,.7,.05,.12,lx,-.4-k*.38,lz+.42,stl);
  for(let k=0;k<3;k++)satBx(SG,3,.4,.6,p.x0+1.8,T.FY+.2+k*.4,p.z1-.3-(2-k)*.6,M(0xf6f4ee,{roughness:.6}))});
 /* ================= INDOOR hall (Swim2/3): slatted walls, wavy slat ceiling with spotlights, marble pillars, wood deck ================= */
 const IG=st();const slM=w=>new THREE.MeshStandardMaterial({map:plTex(slatT,w/2.2,3.6),roughness:.8});
 satPl(IG,38.8,8.4,0,4.2,-34.4,0,slM(38.8));satPl(IG,30.4,8.4,-19.4,4.2,-19.2,Math.PI/2,slM(30.4));satPl(IG,30.4,8.4,19.4,4.2,-19.2,-Math.PI/2,slM(30.4));
 satPl(IG,38.8,30.4,0,8.4,-19.2,0,M(0xf2f1ed,{roughness:.9}),Math.PI/2);
 const slW=M(0xfbfaf6,{roughness:.6}),spM=M(0xfff4d8,{emissive:0xfff0c8,emissiveIntensity:1.2});
 for(let i=0;i<39;i++){const z=-34+i*.78,y=7.15+.5*Math.sin(i*.42),b=satBx(IG,38.6,.07,.5,0,y,z,slW);b.rotation.x=Math.atan(.5*.42/.78*Math.cos(i*.42))}
 [-14,-7,0,7,14].forEach(x=>[-31,-25,-19,-13,-7].forEach(z=>{const i=(z+34)/.78,y=7.15+.5*Math.sin(i*.42)-.08;cyl(IG,.17,.17,.06,spM,x,y,z,12)}));
 const mm=new THREE.MeshStandardMaterial({map:marbT,roughness:.35});[-16,16].forEach(x=>[-30,-22,-14].forEach(z=>{satBx(IG,1,8.4,1,x,4.2,z,mm);T.obs.push([x,z,.9])}));
 [-8,8].forEach(x=>{satBx(IG,1,8.4,1,x,4.2,-34,mm)});
 /* glass front wall with the open sliding doors to the garden pool (Swim5) */
 const frM=M(0x4a5560,{roughness:.4,metalness:.5}),glM=new THREE.MeshStandardMaterial({color:0xcfe8f2,transparent:true,opacity:.22,roughness:.05,metalness:.3,depthWrite:false,side:THREE.DoubleSide});
 [[-12.2,14.4],[12.2,14.4]].forEach(q=>{const g_=satPl(P,q[1],8.2,q[0],4.1,-4,0,glM);g_.userData.dyn=1;g_.renderOrder=3});
 for(let x=-19;x<=19.01;x+=2.4){if(Math.abs(x)<5)continue;satBx(IG,.12,8.4,.14,x,4.2,-4,frM)}[-5,5].forEach(x=>satBx(IG,.22,8.4,.2,x,4.2,-4,frM));satBx(IG,38.8,.14,.16,0,2.9,-4,frM);satBx(IG,38.8,.3,.2,0,8.3,-4,frM);satBx(IG,10,5.5,.2,0,5.65,-4,M(0xf2f1ed,{roughness:.9}));
 [-6.2,6.2].forEach(x=>{const d=satPl(P,2.4,2.8,x,1.4,-4.12,0,glM);d.userData.dyn=1;d.renderOrder=3;satBx(IG,2.4,.08,.1,x,2.82,-4.12,frM);satBx(IG,.08,2.8,.1,x-1.2,1.4,-4.12,frM);satBx(IG,.08,2.8,.1,x+1.2,1.4,-4.12,frM)});
 /* sign + changing room door + furniture inside */
 const sg=sunSignTx('SPLASH POOL','#ffffff','#1f7fb8',1024,200,120);satPl(IG,9,1.7,0,6.2,-34.3,0,new THREE.MeshBasicMaterial({map:sg,transparent:true}));
 satBx(IG,2.2,3.2,.12,-12,1.6,-34.3,M(0x8fc9e6,{roughness:.6}));const crT=sunSignTx('Changing Room','#23343f','#ffffff',1024,180,96);satPl(IG,3.2,.55,-12,3.6,-34.2,0,new THREE.MeshBasicMaterial({map:crT,transparent:true}));
 const lounger=(p,x,z,ry,c)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;p.add(g);const wm_=M(0xffffff,{roughness:.5});satBx(g,.8,.12,1.6,0,.38,-.1,wm_);const bk=satBx(g,.8,.1,.9,0,.68,.85,wm_);bk.rotation.x=-.75;[-.34,.34].forEach(xx=>[-.75,.55].forEach(zz=>satBx(g,.07,.38,.07,xx,.19,zz,wm_)));if(c){satBx(g,.62,.03,1.4,0,.46,-.1,M(c,{roughness:.9}));const tb=satBx(g,.62,.03,.8,0,.75,.82,M(c,{roughness:.9}));tb.rotation.x=-.75}T.obs.push([x,z,1.0]);return g};
 [[-17.6,-26,0xff8fb8],[-17.6,-18,0x7fd3ff],[17.6,-26,0xffd23d],[17.6,-18,0]].forEach(q=>lounger(IG,q[0],q[1],q[0]<0?-Math.PI/2:Math.PI/2,q[2]));
 /* tall white lifeguard chair inside */
 const lgChair=(p,x,z,ry)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;p.add(g);const wm_=M(0xffffff,{roughness:.45});[-.45,.45].forEach(xx=>[-.4,.4].forEach(zz=>{const l=satBx(g,.1,2.4,.1,xx,1.2,zz,wm_)}));for(let k=0;k<4;k++)satBx(g,.9,.06,.12,0,.4+k*.5,.42,wm_);satBx(g,1.05,.1,.95,0,2.4,0,wm_);satBx(g,1.05,.8,.1,0,2.85,-.45,wm_);satBx(g,.08,.5,.8,-.5,2.7,0,wm_);satBx(g,.08,.5,.8,.5,2.7,0,wm_);const rb=new THREE.Mesh(new THREE.TorusGeometry(.32,.09,8,18),M(0xe8343a,{roughness:.5}));rb.position.set(.62,1.5,0);rb.rotation.y=Math.PI/2;g.add(rb);T.obs.push([x,z,1.0]);return g};
 lgChair(IG,13.6,-19,-Math.PI/2);
 /* foam-noodle rack (Swimsuit.jpg) + water-gun bins + kickboards */
 const nr=st(-14.2,-11.4,0);satBx(nr,1.6,.08,.6,0,.05,0,M(0x9aa3ab,{metalness:.5,roughness:.4}));satBx(nr,1.6,.06,.06,0,1.1,-.25,M(0x9aa3ab,{metalness:.5}));
 [0xff5c8a,0x3d8bfd,0xffd23d,0x3ecf6e,0xff8a3d,0xa46ad8,0x2ec4c4,0xff5c8a,0xffd23d,0x3d8bfd].forEach((c,i)=>{const n=cyl(nr,.075,.075,1.7,M(c,{roughness:.8}),-.68+i*.15,.88,-.08+(i%2)*.12,10);n.rotation.z=(i%3-1)*.04});T.obs.push([-14.2,-11.4,1.1]);
 T.bins=[];const bin=(x,z)=>{const g=st(x,z,0);const bm=M(0x2f86c9,{roughness:.6});satBx(g,1.4,.5,.8,0,.25,0,bm);satBx(g,1.44,.06,.84,0,.52,0,M(0xffffff));const lb=sunSignTx('WATER GUNS','#ffffff','#e8343a',1024,200,110);satPl(g,1.3,.26,0,.3,.41,0,new THREE.MeshBasicMaterial({map:lb,transparent:true}));T.bins.push(V(x,0,z));T.obs.push([x,z,.95]);return g};
 bin(14.2,-11.4);
 const kb_=st(-14.6,-28.6,0);[0xff5c8a,0x3d8bfd,0xffd23d,0x3ecf6e,0xff8a3d].forEach((c,i)=>{const b=satBx(kb_,.7,.06,1,0,.05+i*.07,0,M(c,{roughness:.7}));b.rotation.y=i*.08});
 /* party balloons + bunting inside */
 const balloon=(p,x,y,z,c)=>{sph(p,.32,M(c,{roughness:.35}),x,y,z,1,1.18,1);const s_=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,y-.4,4),M(0xffffff));s_.position.set(x,(y-.4)/2+.2,z);p.add(s_)};
 const bal3=(p,x,z)=>{[[0,2.6,0,0xff7fb8],[.35,2.9,.1,0x7fd3ff],[-.3,3.0,-.1,0xffffff],[.1,3.3,.2,0xffd23d]].forEach(q=>balloon(p,x+q[0],q[1],z+q[2],q[3]));satBx(p,.25,.2,.25,x,.1,z,M(0x9aa3ab))};
 bal3(IG,-18.4,-33.4);bal3(IG,18.4,-33.4);bal3(IG,-5.6,-4.6);bal3(IG,5.6,-4.6);
 /* ================= OUTDOOR garden pool (Swim1/4/5): tropical trees, pink & blue party tents, loungers, red scalloped canopy ================= */
 const OG=st();
 /* red canopy with a scalloped edge over the sliding doors */
 const scT=c=>tx(256,64,(g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle=c;g.fillRect(0,0,w,26);for(let x=0;x<w;x+=32){g.beginPath();g.arc(x+16,26,16,0,Math.PI);g.fill()}g.fillStyle='#ffffff';g.fillRect(0,22,w,4)});
 const scal=(p,w,x,y,z,ry,c)=>{const m=new THREE.MeshStandardMaterial({map:plTex(scT(c),w/1.6,1),transparent:true,alphaTest:.4,side:THREE.DoubleSide,roughness:.8});const o=satPl(p,w,.42,x,y,z,ry,m);return o};
 const rdM=M(0xd8262e,{roughness:.7,side:THREE.DoubleSide});const cr=satPl(OG,12.6,3.8,0,3.5,-2.1,0,rdM,-Math.PI/2);cr.material.side=THREE.DoubleSide;scal(OG,12.6,0,3.3,-.2,0,'#d8262e');scal(OG,3.8,-6.3,3.3,-2.1,Math.PI/2,'#d8262e');scal(OG,3.8,6.3,3.3,-2.1,Math.PI/2,'#d8262e');[-6.2,6.2].forEach(x=>{satBx(OG,.12,3.5,.12,x,1.75,-.3,M(0xffffff));T.obs.push([x,-.3,.4])});
 const pk=sunSignTx('POOL PARTY','#ffffff','#ff5c9a',1024,200,120);satPl(OG,5.2,1,0,4.25,-.18,0,new THREE.MeshBasicMaterial({map:pk,transparent:true}));
 /* party tents */
 const tent=(x,z,c,c2)=>{const g=st(x,z,0);const pm=M(0xffffff,{roughness:.5});[-2.5,2.5].forEach(xx=>[-2.5,2.5].forEach(zz=>{satBx(g,.12,3,.12,xx,1.5,zz,pm);T.obs.push([x+xx,z+zz,.35])}));
  const rf=new THREE.Mesh(new THREE.ConeGeometry(3.85,1.5,4,1,true),M(c,{roughness:.7,side:THREE.DoubleSide}));rf.rotation.y=Math.PI/4;rf.position.y=3.75;g.add(rf);
  [[0,2.75,0],[0,-2.75,0],[2.75,0,Math.PI/2],[-2.75,0,Math.PI/2]].forEach(q=>scal(g,5.5,q[0],2.85,q[1],q[2],c2));
  /* party table with cake, fruit and cups */
  cyl(g,1.1,1.1,.08,M(0xffffff,{roughness:.5}),0,.86,0,20);cyl(g,.08,.08,.86,pm,0,.43,0,8);cyl(g,.38,.38,.22,M(0xfff1f6),0,1.01,0,18);cyl(g,.28,.28,.2,M(0xff9ac1),0,1.22,0,18);sph(g,.06,M(0xe5483a),0,1.36,0);
  [[.7,0xffd23d],[-.7,0x3ecf6e],[.3,0x7fd3ff],[-.4,0xff8a3d]].forEach((q,i)=>{cyl(g,.06,.05,.14,M(q[1]),q[0],.97,.55-(i%2)*1.1,8)});const wl=new THREE.Mesh(new THREE.SphereGeometry(.22,12,8,0,Math.PI),M(0x3a9a3a));wl.position.set(-.5,.95,-.3);wl.rotation.x=-Math.PI/2;g.add(wl);
  T.obs.push([x,z,1.4]);bal3(g,2.3,2.3);bal3(g,-2.3,2.3);return g};
 tent(-26,13,0xff8fb8,'#ff8fb8');tent(-26,25,0xff6fa8,'#ff6fa8');tent(26,27,0x6fb8ff,'#6fb8ff');
 /* striped umbrellas + loungers on the far deck */
 const umT=tx(256,256,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#ffffff':'#ff6f91';g.beginPath();g.moveTo(w/2,h/2);g.arc(w/2,h/2,w,i*Math.PI/4,(i+1)*Math.PI/4);g.closePath();g.fill()}});
 const umb=(x,z,c)=>{const g=st(x,z,0);cyl(g,.05,.05,2.6,M(0xffffff),0,1.3,0,8);const u=new THREE.Mesh(new THREE.ConeGeometry(1.6,.6,16,1,true),new THREE.MeshStandardMaterial({map:umT,side:THREE.DoubleSide,roughness:.7}));u.position.y=2.6;g.add(u);T.obs.push([x,z,.35])};
 [-16,-8,0,8,16].forEach((x,i)=>{lounger(OG,x-1.1,39,Math.PI,[0xff8fb8,0x7fd3ff,0xffd23d,0x3ecf6e,0xff8a3d][i]);lounger(OG,x+1.1,39,Math.PI,0);umb(x,39.6)});
 lgChair(OG,22.4,19,-Math.PI/2);T.bins.length;bin(-21.6,4.4);bin(21.6,33.2);
 /* pool-side bunting between four poles */
 const poles=[[-21,6.8],[21,6.8],[21,31.2],[-21,31.2]];poles.forEach(q=>{cyl(OG,.07,.07,4.6,M(0xffffff),q[0],2.3,q[1],8);T.obs.push([q[0],q[1],.3])});
 const flagC=[0xff5c8a,0xffd23d,0x3d8bfd,0x3ecf6e,0xff8a3d,0xffffff];for(let k=0;k<4;k++){const a=poles[k],b=poles[(k+1)%4],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.floor(L/1.1);for(let i=0;i<n;i++){const u=(i+.5)/n,x=a[0]+(b[0]-a[0])*u,z=a[1]+(b[1]-a[1])*u,y=4.4-Math.sin(u*Math.PI)*1.1;const f=new THREE.Mesh(new THREE.ConeGeometry(.22,.5,3),M(flagC[i%6],{roughness:.7}));f.rotation.x=Math.PI;f.position.set(x,y-.25,z);f.rotation.y=Math.atan2(b[0]-a[0],b[1]-a[1]);f.scale.z=.15;OG.add(f)}}
 /* low wall, hedges, tropical palms and big leafy trees (Swim1) */
 const wlM=M(0xf2efe6,{roughness:.8}),hdM=M(0x2f7a32,{roughness:.95});satBx(OG,64.6,.6,.4,0,.3,43.6,wlM);satBx(OG,.4,.6,47.6,-32.2,.3,19.8,wlM);satBx(OG,.4,.6,47.6,32.2,.3,19.8,wlM);
 for(let i=0;i<22;i++){sph(OG,.9,hdM,-31+i*2.95,.8,44.6,1,.8,1);}for(let i=0;i<15;i++){sph(OG,.9,hdM,-33.4,.8,-3+i*3.2,1,.8,1);sph(OG,.9,hdM,33.4,.8,-3+i*3.2,1,.8,1)}
 const frT=tx(64,256,(g,w,h)=>{g.clearRect(0,0,w,h);g.strokeStyle='#3e8a2c';g.lineWidth=4;g.beginPath();g.moveTo(32,0);g.lineTo(32,h);g.stroke();for(let y=8;y<h-6;y+=7){const L=26*Math.sin((y/h)*Math.PI)+4;g.strokeStyle=y%14?'#4ea33a':'#3d8f2e';g.lineWidth=4;g.beginPath();g.moveTo(32,y);g.lineTo(32-L,y+10);g.stroke();g.beginPath();g.moveTo(32,y);g.lineTo(32+L,y+10);g.stroke()}});
 const fdM=new THREE.MeshStandardMaterial({map:frT,transparent:true,alphaTest:.45,side:THREE.DoubleSide,roughness:.85}),trM=M(0x8a6a48,{roughness:.95});
 const palm=(x,z,h,bend)=>{const g=st(x,z,bend);let px=0,py=0;for(let i=0;i<7;i++){const r=.24-i*.015,s=cyl(g,r-.02,r,h/7+.05,trM,px,py+h/14,0,8);s.rotation.z=-i*.03;px+=Math.sin(i*.03)*h/7*.9;py+=h/7}
  for(let k=0;k<9;k++){const a=k/9*TAU,f=new THREE.Mesh(new THREE.PlaneGeometry(.95,3.4),fdM);f.position.set(px+Math.cos(a)*1.4,py-.35,Math.sin(a)*1.4);f.rotation.order='YXZ';f.rotation.y=-a+Math.PI/2;f.rotation.x=-1.05;g.add(f)}
  [0,1,2].forEach(k=>sph(g,.16,M(0x6b4a26),px+Math.cos(k*2)*.22,py-.15,Math.sin(k*2)*.22));T.obs.push([x,z,.5])};
 [[-29.5,1],[-29.5,19],[-29.5,32],[-29.5,41],[29.5,3],[29.5,12],[29.5,19.5],[29.5,36],[29.5,41.5],[-22,42],[-4,42],[4,42],[22,42]].forEach((q,i)=>palm(q[0],q[1],6+((i*7)%5)*.6,i*.9));
 const tree=(x,z,s,c)=>{const g=st(x,z,0);cyl(g,.3*s,.4*s,3*s,trM,0,1.5*s,0,8);const lm=M(c,{roughness:.95});[[0,4.2,0,2.2],[1.4,3.6,.4,1.6],[-1.3,3.7,-.3,1.7],[.3,3.4,1.3,1.5],[-.2,3.5,-1.3,1.5]].forEach(q=>sph(g,q[3]*s,lm,q[0]*s,q[1]*s,q[2]*s))};
 for(let i=0;i<11;i++)tree(-42+i*8.4,50+(i%3)*3,1.2+(i%2)*.35,[0x2f6b2a,0x3c8a34,0x2a5e26][i%3]);for(let i=0;i<7;i++){tree(-40-(i%2)*4,-2+i*7,1.2,[0x2f6b2a,0x3c8a34][i%2]);tree(40+(i%2)*4,-2+i*7,1.2,[0x3c8a34,0x2a5e26][i%2])}
 [[-40,-12],[40,-12],[-24,-42],[24,-42],[0,-44]].forEach((q,i)=>tree(q[0],q[1],1.5,[0x2f6b2a,0x3c8a34][i%2]));
 /* building outside walls */
 satBx(SG,39.2,8.8,.4,0,4.4,-34.8,M(0xf2efe6,{roughness:.9}));satBx(SG,.4,8.8,31,-19.8,4.4,-19.2,M(0xf2efe6,{roughness:.9}));satBx(SG,.4,8.8,31,19.8,4.4,-19.2,M(0xf2efe6,{roughness:.9}));satBx(SG,40,.4,31.2,0,8.8,-19.2,M(0xe6e2d8,{roughness:.9}));
 sunMatte(P);sunMergeStatic(P);
 /* water droplets + splash rings (dynamic) */
 const dT=tx(64,64,(g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle='rgba(120,205,255,.95)';g.beginPath();g.arc(32,32,22,0,7);g.fill();g.lineWidth=4;g.strokeStyle='rgba(30,140,220,.95)';g.stroke();g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.arc(25,24,7,0,7);g.fill()});
 const dM=new THREE.SpriteMaterial({map:dT,transparent:true,depthWrite:false});for(let i=0;i<340;i++){const s=new THREE.Sprite(dM);s.visible=false;s.scale.setScalar(.16);P.add(s);T.drops.push({s,on:false,v:V(0,0,0),t:0})}
 for(let i=0;i<26;i++){const m=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false});const r=new THREE.Mesh(new THREE.RingGeometry(.55,.68,28),m);r.rotation.x=-Math.PI/2;r.visible=false;r.renderOrder=3;P.add(r);T.rings.push({r,m,on:false,t:0})}
})();
return {root:GO,data:Object.assign(PL,{floor})};}
