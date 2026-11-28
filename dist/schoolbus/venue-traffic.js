// Exact Schoolbus v223 traffic scene builders, isolated from its game state/private media.
import {SchoolTHREE as THREE} from './core.js?v=74a';
export function createVenue(parent){let floor=null;const S=parent,G={},girl={body:new THREE.Group()},GN=new THREE.Group();parent.add(GN);
const $=id=>document.getElementById(id),TAU=Math.PI*2,lp=(a,b,u)=>a+(b-a)*u,V=(x,y,z)=>new THREE.Vector3(x,y,z),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let seed=11;
const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o||{}));
const satTx=(w,h,fn,rx,ry)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h,c);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rx)t.repeat.set(rx,ry||rx);t.anisotropy=4;return t};
function satPl(P,w,h,x,y,z,ry,m,rx){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.rotation.y=ry||0;if(rx)o.rotation.x=rx;if(!floor&&rx< -1.4&&w>5&&h>5){floor=o;o.userData.dyn=1;}P.add(o);return o}
function satBx(P,w,h,d,x,y,z,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=false;o.receiveShadow=true;P.add(o);return o}
const SPK={curve:null,P:[],T:[],N:600,W:2.4,lights:[],zebras:[],riders:[],ped:[],scoot:null,helm:null,RC:V(28,0,-18)};
(function(){const P=GN,K=SPK;
 /* lap route (clockwise, keep left like our town), with a roundabout on the east side */
 const pts=[[-32,22],[-32.5,8],[-32.5,-6],[-31.5,-20],[-26,-29],[-14,-32.5],[0,-33],[12,-31.5]];
 for(let a=-55;a<=180;a+=15){const t=a*Math.PI/180;pts.push([K.RC.x+7*Math.sin(t),K.RC.z-7*Math.cos(t)])}
 pts.push([22.5,-6.5],[21.5,2],[22.5,12],[18,22],[8,27.5],[-6,28.5],[-20,28.5],[-29,26.5]);
 K.curve=new THREE.CatmullRomCurve3(pts.map(p=>V(p[0],0,p[1])),true,'centripetal');
 const N=K.N,sp=K.curve.getSpacedPoints(N);sp.pop();K.P=sp;K.L=K.curve.getLength();
 K.T=sp.map((p,i)=>{const a=sp[(i+N-1)%N],b=sp[(i+1)%N];return V(b.x-a.x,0,b.z-a.z).normalize()});
 const ribbon=(w0,w1,y,mat)=>{const pos=[],idx=[];sp.forEach((p,i)=>{const t=K.T[i],nx=t.z,nz=-t.x;pos.push(p.x+nx*w0,y,p.z+nz*w0,p.x+nx*w1,y,p.z+nz*w1)});for(let i=0;i<N;i++){const j=(i+1)%N,a=i*2,b=j*2;idx.push(a,b,a+1,a+1,b,b+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;P.add(m);return m};
 /* ground: grey paving, grass islands, the towers all around */
 const pave=satTx(256,256,(g,w,h)=>{g.fillStyle='#8f8b84';g.fillRect(0,0,w,h);for(let y=0;y<8;y++)for(let x=0;x<8;x++){g.fillStyle=['#a29e96','#9a968e','#aaa69e'][(x*3+y)%3];g.fillRect(x*32+1,y*32+1,30,30)}},40,34);
 satPl(P,130,110,0,0,0,0,new THREE.MeshStandardMaterial({map:pave,roughness:.9}),-Math.PI/2);
 const grass=M(0x0a3d10,{roughness:1}),grass2=M(0x0f5017,{roughness:1});
 [[-6,-6,12,9,grass],[6,10,10,7,grass2],[-14,12,7,6,grass],[10,-16,7,5,grass2],[-20,-14,5,6,grass2]].forEach(a=>{const c=new THREE.Mesh(new THREE.CircleGeometry(1,40),a[4]);c.rotation.x=-Math.PI/2;c.scale.set(a[2],a[3],1);c.position.set(a[0],.012,a[1]);P.add(c)});
 /* the outer green band of the park (like the plan) */
 {const c=new THREE.Mesh(new THREE.RingGeometry(46,52,64),grass);c.rotation.x=-Math.PI/2;c.scale.set(1.05,.82,1);c.position.set(-2,.011,-2);P.add(c)}
 /* road: green surface, white edge lines, pink kerbs */
 ribbon(-K.W,K.W,.03,M(0x064818,{roughness:.85}));ribbon(K.W-.32,K.W-.2,.035,M(0xffffff));ribbon(-K.W+.2,-K.W+.32,.035,M(0xffffff));
 ribbon(K.W,K.W+.35,.1,M(0xc04a72,{roughness:.7}));ribbon(-K.W-.35,-K.W,.1,M(0xc04a72,{roughness:.7}));
 /* dashed centre line and arrows that show the way to go */
 const dm=M(0xffffff);for(let i=0;i<N;i+=6){const p=sp[i],t=K.T[i];const d=new THREE.Mesh(new THREE.PlaneGeometry(.12,1.1),dm);d.rotation.order='YXZ';d.rotation.set(-Math.PI/2,Math.atan2(t.x,t.z),0);d.position.set(p.x,.04,p.z);P.add(d)}
 const arT=satTx(64,128,(g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle='#fff';g.beginPath();g.moveTo(32,4);g.lineTo(58,44);g.lineTo(40,44);g.lineTo(40,124);g.lineTo(24,124);g.lineTo(24,44);g.lineTo(6,44);g.closePath();g.fill()});
 for(let i=20;i<N;i+=55){const p=sp[i],t=K.T[i],nx=t.z,nz=-t.x;[-1,1].forEach(s=>{const a=new THREE.Mesh(new THREE.PlaneGeometry(.7,1.4),new THREE.MeshBasicMaterial({map:arT,transparent:true}));a.rotation.order='YXZ';a.rotation.set(-Math.PI/2,Math.atan2(t.x,t.z)+Math.PI,0);a.position.set(p.x+nx*s*1.2,.045,p.z+nz*s*1.2);P.add(a)})}
 /* roundabout island with flowers and a little clock tower */
 {const c=new THREE.Mesh(new THREE.CircleGeometry(4.55,40),grass2);c.rotation.x=-Math.PI/2;c.position.set(K.RC.x,.12,K.RC.z);P.add(c);const kb=new THREE.Mesh(new THREE.CylinderGeometry(4.6,4.6,.12,40,1,true),M(0xe8b4c4));kb.position.set(K.RC.x,.06,K.RC.z);P.add(kb);
  for(let i=0;i<26;i++){const a=i/26*TAU,r=3.6+(i%2)*.4,f=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),M([0xff6b9d,0xffd23d,0xffffff,0xff8a3d][i%4]));f.position.set(K.RC.x+Math.cos(a)*r,.3,K.RC.z+Math.sin(a)*r);P.add(f)}
  satBx(P,.8,3.2,.8,K.RC.x,1.7,K.RC.z,M(0xf3efe9));const ck=satTx(128,128,(g)=>{g.fillStyle='#fff';g.beginPath();g.arc(64,64,58,0,7);g.fill();g.strokeStyle='#23343f';g.lineWidth=6;g.stroke();g.beginPath();g.moveTo(64,64);g.lineTo(64,24);g.moveTo(64,64);g.lineTo(92,70);g.stroke()});
  [0,1,2,3].forEach(k=>{const pl=new THREE.Mesh(new THREE.PlaneGeometry(.7,.7),new THREE.MeshBasicMaterial({map:ck,transparent:true}));pl.rotation.y=k*Math.PI/2;pl.position.set(K.RC.x+Math.sin(k*Math.PI/2)*.41,2.8,K.RC.z+Math.cos(k*Math.PI/2)*.41);P.add(pl)});const rf=new THREE.Mesh(new THREE.ConeGeometry(.75,.8,4),M(0xf2c14e));rf.rotation.y=Math.PI/4;rf.position.set(K.RC.x,3.7,K.RC.z);P.add(rf)}
 /* helpers to find the nearest point on the route */
 K.near=(x,z,hint)=>{let bi=0,bd=1e9;const N=K.N;if(hint!==undefined){for(let k=-25;k<=25;k++){const i=(hint+k+N)%N,p=K.P[i],d=(p.x-x)**2+(p.z-z)**2;if(d<bd){bd=d;bi=i}}if(bd<16)return[bi,Math.sqrt(bd)]}for(let i=0;i<N;i++){const p=K.P[i],d=(p.x-x)**2+(p.z-z)**2;if(d<bd){bd=d;bi=i}}return[bi,Math.sqrt(bd)]};
 /* traffic lights with stop lines and a cross road */
 const side=(i,o)=>{const p=sp[i],t=K.T[i];return V(p.x+t.z*o,0,p.z-t.x*o)};
 const mkLight=(i,off)=>{const p=sp[i],t=K.T[i],yw=Math.atan2(-t.x,-t.z),q=side(i,K.W+.8);const g=new THREE.Group();g.position.copy(q);P.add(g);
  satBx(g,.12,2.9,.12,0,1.45,0,M(0x8c9096,{metalness:.5}));const bx=satBx(g,.42,1.05,.32,0,2.85,0,M(0x1c1e22));bx.rotation.y=yw;
  const L=[0xff2a2a,0xffb000,0x22dd55].map((c,k)=>{const m=new THREE.MeshStandardMaterial({color:0x222222,emissive:c,emissiveIntensity:0});const s=new THREE.Mesh(new THREE.SphereGeometry(.11,12,10),m);s.position.set(-Math.sin(yw)*.17*-1*0+Math.sin(yw)*.17,3.18-k*.32,Math.cos(yw)*.17);g.add(s);return{m,c}});
  /* stop line 3.5 m before the junction */const si=(i-12+K.N)%K.N,sp2=sp[si],st=K.T[si];const sl=new THREE.Mesh(new THREE.PlaneGeometry(K.W*2,.35),M(0xffffff));sl.rotation.order='YXZ';sl.rotation.set(-Math.PI/2,Math.atan2(st.x,st.z),0);sl.position.set(sp2.x,.05,sp2.z);P.add(sl);
  /* the cross road */const cr=new THREE.Mesh(new THREE.PlaneGeometry(4.6,22),M(0x064818,{roughness:.85}));cr.rotation.order='YXZ';cr.rotation.set(-Math.PI/2,Math.atan2(t.x,t.z)+Math.PI/2,0);cr.position.set(p.x,.025,p.z);P.add(cr);
  K.lights.push({i,si,L,off,st:'g',waited:0,done:0,warn:0})};
 /* zebra crossings with people walking across */
 const zt=satTx(128,128,(g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle='#f3d24a';for(let x=0;x<w;x+=32)g.fillRect(x+3,0,22,h)});
 const mkZebra=i=>{const p=sp[i],t=K.T[i];const z=new THREE.Mesh(new THREE.PlaneGeometry(K.W*2+.6,2.4),new THREE.MeshBasicMaterial({map:zt,transparent:true}));z.rotation.order='YXZ';z.rotation.set(-Math.PI/2,Math.atan2(t.x,t.z),0);z.position.set(p.x,.05,p.z);P.add(z);
  [-1,1].forEach(s=>{const q=side(i,s*(K.W+1.0));const pl=satBx(P,.1,2.0,.1,q.x,1.0,q.z,M(0x222222));const bl=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),M(0xffb000,{emissive:0xff9000,emissiveIntensity:.6}));bl.position.set(q.x,2.15,q.z);P.add(bl)});K.zebras.push({i,t:rnd()*6,cross:0,warn:0,waited:0})};
 const ix=(x,z)=>K.near(x,z)[0];
 mkLight(ix(0,-33),0);mkLight(ix(-6,28.5),6.5);mkZebra(ix(-32.5,-8));mkZebra(ix(12,26.5));
 /* signs: no bicycles on the pavement, speed 5, keep left */
 const sgn=(x,z,draw)=>{const t=satTx(128,128,draw);satBx(P,.08,1.8,.08,x,.9,z,M(0x8c9096));const s=new THREE.Mesh(new THREE.CircleGeometry(.38,24),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));s.position.set(x,2.0,z);s.rotation.y=Math.PI/2;P.add(s)};
 sgn(-35.6,14,(g)=>{g.fillStyle='#fff';g.beginPath();g.arc(64,64,62,0,7);g.fill();g.strokeStyle='#d7262f';g.lineWidth=12;g.stroke();g.fillStyle='#111';g.font='700 70px Fredoka,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('5',64,68)});
 sgn(-35.6,-14,(g)=>{g.fillStyle='#2f5fa8';g.beginPath();g.arc(64,64,62,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.moveTo(40,96);g.lineTo(40,56);g.lineTo(26,56);g.lineTo(52,26);g.lineTo(78,56);g.lineTo(64,56);g.lineTo(64,96);g.closePath();g.fill()});
 /* the blue park office with the yellow triangle roof (entrance) */
 {const bl=M(0x8fcfd0,{roughness:.8});satBx(P,9,3.6,6,-48,1.8,18,bl);const rf=new THREE.Mesh(new THREE.ConeGeometry(2.6,2.2,3),M(0xf2c14e));rf.rotation.y=Math.PI/2;rf.rotation.z=0;rf.scale.set(1,1,.5);rf.position.set(-43.7,4.4,18);P.add(rf);
  const t=satTx(512,160,(g,w,h)=>{g.fillStyle='#8fcfd0';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='700 56px "PingFang TC",system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('交通安全公園',w/2,56);g.font='700 40px Fredoka,system-ui,sans-serif';g.fillText('Road Safety Park',w/2,122)});
  satPl(P,5,1.6,-43.48,2.6,18,Math.PI/2,new THREE.MeshBasicMaterial({map:t}));satBx(P,.06,2.2,1.4,-43.48,1.1,15.2,M(0x5a6a74))}
 /* the entrance plaza (Park1.jpg): stone paving, yellow tactile strips, steel railings, a map board, lamp post, traffic light and a zebra crossing into the park */
 {const st=satTx(256,256,(g,w,h)=>{g.fillStyle='#b9b4ab';g.fillRect(0,0,w,h);for(let y=0;y<4;y++)for(let x=0;x<8;x++){g.fillStyle=['#c4bfb6','#b2ada4','#bdb8af'][(x+y*2)%3];g.fillRect(x*32+(y%2)*16+1,y*64+1,30,62)}},4,4);
  satPl(P,11,11,-44,.015,35.5,0,new THREE.MeshStandardMaterial({map:st,roughness:.9}),-Math.PI/2);
  const tac=satTx(64,64,(g,w,h)=>{g.fillStyle='#e8b52a';g.fillRect(0,0,w,h);g.fillStyle='#c99a18';for(let y=6;y<h;y+=16)for(let x=6;x<w;x+=16){g.beginPath();g.arc(x+2,y+2,4,0,7);g.fill()}},2,8);
  satPl(P,1.2,10,-44,.02,35.5,0,new THREE.MeshStandardMaterial({map:tac,roughness:.8}),-Math.PI/2);satPl(P,10,1.2,-44,.021,30.8,0,new THREE.MeshStandardMaterial({map:tac.clone(),roughness:.8}),-Math.PI/2);
  const ss=M(0xd9dde2,{metalness:.7,roughness:.25});[-49.3,-38.7].forEach(x=>{for(let i=0;i<6;i++)satBx(P,.06,1.05,.06,x,.52,31+i*1.8,ss);[.5,1.0].forEach(y=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,9.2,8),ss);r.rotation.x=Math.PI/2;r.position.set(x,y,35.5);P.add(r)})});
  /* the map board with the layout plan */
  const mp=satTx(256,192,(g,w,h)=>{g.fillStyle='#e9e4da';g.fillRect(0,0,w,h);g.fillStyle='#d7262f';g.fillRect(0,0,w,22);g.fillStyle='#fff';g.font='700 15px "PingFang TC",system-ui,sans-serif';g.textAlign='center';g.fillText('交通安全公園 Road Safety Park',w/2,16);
   g.fillStyle='#8fd3e8';g.beginPath();g.roundRect?g.roundRect(20,32,216,148,22):g.rect(20,32,216,148);g.fill();g.strokeStyle='#2a8a4a';g.lineWidth=9;g.beginPath();g.roundRect?g.roundRect(30,42,196,128,18):g.rect(30,42,196,128);g.stroke();
   g.fillStyle='#2a8a4a';g.beginPath();g.ellipse(170,80,40,22,-.4,0,7);g.fill();g.beginPath();g.ellipse(180,140,30,22,.3,0,7);g.fill();g.fillStyle='#c9a24a';[[60,70,26,60],[110,90,30,30],[150,62,40,16],[190,126,20,12]].forEach(r=>g.fillRect(r[0],r[1],r[2],r[3]));g.beginPath();g.arc(118,105,18,0,7);g.fill();
   g.fillStyle='#d7262f';g.beginPath();g.arc(46,160,6,0,7);g.fill();g.fillStyle='#23343f';g.font='600 11px system-ui';g.fillText('You are here',60,176)});
  {const g=new THREE.Group();g.position.set(-41.2,0,33.2);g.rotation.y=-Math.PI*.15;P.add(g);[-.75,.75].forEach(x=>satBx(g,.06,1.5,.06,x,.75,0,M(0x6b6f74)));satBx(g,1.7,1.25,.06,0,1.55,0,M(0xffffff));const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.15),new THREE.MeshBasicMaterial({map:mp}));pl.position.set(0,1.55,.035);g.add(pl);const pb=pl.clone();pb.rotation.y=Math.PI;pb.position.z=-.035;g.add(pb)}
  /* yellow "caution, wet floor" sign */
  {const cs=satTx(64,96,(g,w,h)=>{g.fillStyle='#ffd23d';g.fillRect(0,0,w,h);g.fillStyle='#111';g.beginPath();g.moveTo(32,10);g.lineTo(54,46);g.lineTo(10,46);g.closePath();g.fill();g.fillStyle='#ffd23d';g.font='700 26px system-ui';g.textAlign='center';g.fillText('!',32,42);g.fillStyle='#111';g.font='700 11px system-ui';g.fillText('小心地滑',32,66);g.fillText('CAUTION',32,82)});
   [-1,1].forEach(sd=>{const pl=new THREE.Mesh(new THREE.PlaneGeometry(.45,.75),new THREE.MeshStandardMaterial({map:cs,side:THREE.DoubleSide}));pl.position.set(-39.6+sd*.12,.37,32.2);pl.rotation.set(sd*.2,Math.PI/2,0);pl.rotation.order='YXZ';pl.rotation.set(-sd*.18,Math.PI/2,0);P.add(pl)})}
  /* lamp post with a round lamp, and a pedestrian traffic light */
  satBx(P,.16,5,.16,-46.6,2.5,31.4,M(0x3b4a48));{const l=new THREE.Mesh(new THREE.CylinderGeometry(.45,.38,.32,18),M(0x23292a));l.position.set(-46.6,5.1,31.4);P.add(l);const lg=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.06,18),M(0xfff6dc,{emissive:0xffeec0,emissiveIntensity:.8}));lg.position.set(-46.6,4.93,31.4);P.add(lg)}
  satBx(P,.12,3.0,.12,-40.2,1.5,30.0,M(0x8c9096,{metalness:.5}));satBx(P,.36,.7,.3,-40.2,2.85,30.0,M(0x1c1e22));[[0xff2a2a,3.0],[0x22dd55,2.7]].forEach(a=>{const b=new THREE.Mesh(new THREE.CircleGeometry(.11,16),M(0x222222,{emissive:a[0],emissiveIntensity:1.2}));b.position.set(-40.2,a[1],29.84);b.rotation.y=Math.PI;P.add(b)});
  /* a short green road with a yellow zebra crossing right inside the entrance */
  const rd=new THREE.Mesh(new THREE.PlaneGeometry(14,4.6),M(0x064818,{roughness:.9}));rd.rotation.x=-Math.PI/2;rd.position.set(-44,.025,28.0);P.add(rd);[25.6,30.4].forEach(z=>{const k=satBx(P,14,.12,.3,-44,.06,z,M(0xc04a72,{roughness:.7}))});
  const zt2=satTx(128,128,(g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle='#f3d24a';for(let x=0;x<w;x+=32)g.fillRect(x+3,0,22,h)});const zb=new THREE.Mesh(new THREE.PlaneGeometry(3,4.4),new THREE.MeshBasicMaterial({map:zt2,transparent:true}));zb.rotation.x=-Math.PI/2;zb.rotation.z=Math.PI/2;zb.position.set(-44,.04,28);zb.rotation.set(-Math.PI/2,0,0);P.add(zb);
  /* colourful mural on the park office */
  const mu=satTx(256,96,(g,w,h)=>{g.fillStyle='#fdf6e4';g.fillRect(0,0,w,h);['#e5483a','#ffd23d','#3aa655','#3d8bfd','#a46ad8'].forEach((c,i)=>{g.fillStyle=c;g.beginPath();g.arc(30+i*48,60,18,0,7);g.fill()});g.fillStyle='#23343f';g.fillRect(0,78,w,4);g.fillStyle='#fff';for(let x=6;x<w;x+=24)g.fillRect(x,79,12,2)});
  satPl(P,5.5,2,-48,1.6,21.03,0,new THREE.MeshBasicMaterial({map:mu}));
  const vt=satTx(64,320,(g,w,h)=>{g.fillStyle='#8fcfd0';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='700 46px "PingFang TC",system-ui,sans-serif';g.textAlign='center';'沙田交通安全公園'.split('').forEach((c,i)=>g.fillText(c,32,48+i*36))});
  satPl(P,.7,3.2,-43.47,1.8,20.4,Math.PI/2,new THREE.MeshBasicMaterial({map:vt}))}
 /* benches, cones, lamp posts, trees and the scooter parking */
 [[-37,18],[-37,24]].forEach(a=>{satBx(P,.6,.08,2.2,a[0],.45,a[1],M(0x8c6a42));[-.95,.95].forEach(q=>satBx(P,.5,.45,.08,a[0],.22,a[1]+q,M(0x2b2b2b)))});
 for(let i=0;i<8;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.22,.6,12),M(i%2?0xffffff:0xff5a2a));c.position.set(-8+i*.9,.3,-4.5);P.add(c)}
 const tree=(x,z,s)=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.2*s,.3*s,3*s,8),M(0x6b4a2a));t.position.set(x,1.5*s,z);P.add(t);[0,1,2].forEach(k=>{const c=new THREE.Mesh(new THREE.SphereGeometry((1.6-k*.3)*s,10,8),M([0x3f8f3a,0x4fa34a,0x2f7a33][k]));c.position.set(x+(k-1)*.6*s,(3.4+k*.6)*s,z+(k%2)*.4*s);P.add(c)})};
 [[-6,-6],[-2,-9],[-10,-3],[6,10],[9,12],[-14,12],[10,-16],[-20,-14],[-44,-20],[-44,30],[40,30],[44,-30],[-20,40],[20,-44],[0,40],[40,0]].forEach((a,i)=>tree(a[0],a[1],.9+(i%3)*.2));
 for(let i=0;i<10;i++){const a=i/10*TAU,x=Math.cos(a)*41,z=Math.sin(a)*36;satBx(P,.12,4.5,.12,x,2.25,z,M(0x2b3a3a));const l=new THREE.Mesh(new THREE.SphereGeometry(.35,10,8),M(0x2b2b2b));l.scale.set(1,.6,1);l.position.set(x,4.6,z);P.add(l)}
 /* tall residential towers all around (like the photos) */
 const twT=satTx(128,256,(g,w,h)=>{g.fillStyle='#ece6da';g.fillRect(0,0,w,h);for(let y=4;y<h;y+=10)for(let x=4;x<w;x+=14){g.fillStyle=(x+y)%3?'#8fa9bd':'#6f8597';g.fillRect(x,y,9,6)}g.fillStyle='rgba(0,0,0,.08)';g.fillRect(w/2-3,0,6,h)});
 for(let i=0;i<16;i++){const a=i/16*TAU+.2,R=74+(i%3)*8,h=55+((i*13)%4)*14,c=[0xece6da,0xe3d7c6,0xdfe3e6,0xe9d9c9][i%4];const m=new THREE.MeshStandardMaterial({color:c,map:twT.clone(),roughness:.9});m.map.needsUpdate=true;m.map.repeat.set(1,h/40);m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;
  const b=new THREE.Mesh(new THREE.BoxGeometry(14,h,14),m);b.position.set(Math.cos(a)*R,h/2,Math.sin(a)*R);b.rotation.y=-a;P.add(b)}
 /* our friend's pink kick scooter and helmet */
 const mkScoot=col=>{const g=new THREE.Group(),pk=M(col,{roughness:.4}),bk=M(0x2b2b2b,{roughness:.6});satBx(g,.22,.05,.72,0,.12,0,pk);const wh=(x,z)=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.05,14),M(0xfafafa));w.rotation.z=Math.PI/2;w.position.set(x,.075,z);g.add(w)};wh(0,-.32);wh(-.09,.33);wh(.09,.33);
  const st=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.85,8),pk);st.position.set(0,.55,.36);st.rotation.x=-.08;g.add(st);const hb=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.46,8),bk);hb.rotation.z=Math.PI/2;hb.position.set(0,.97,.39);g.add(hb);[-1,1].forEach(s=>{const gr=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.1,8),M(0xffd23d));gr.rotation.z=Math.PI/2;gr.position.set(s*.2,.97,.39);g.add(gr)});return g};
 K.mkScoot=mkScoot;K.scoot=mkScoot(0x2f6fd6);P.add(K.scoot);
 /* our friend's pink bicycle with training wheels (from Bicycle.jpg) */
 const mkBike=()=>{const g=new THREE.Group(),pk=M(0xf3b9b4,{roughness:.45}),bk=M(0x1e1e20,{roughness:.7}),gy=M(0x9aa0a6,{roughness:.4,metalness:.5}),ye=M(0xffc21a,{roughness:.5}),or=M(0xff9a1a,{roughness:.6});
  const tube=(a,b,r,m)=>{const A=V(a[0],a[1],a[2]),Bv=V(b[0],b[1],b[2]),d=Bv.clone().sub(A),L=d.length(),t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,10),m);t.position.copy(A).add(Bv).multiplyScalar(.5);t.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());g.add(t);return t};
  const wheel=(z,r)=>{const w=new THREE.Group();w.position.set(0,r,z);g.add(w);const ty=new THREE.Mesh(new THREE.TorusGeometry(r-.03,.032,8,28),bk);ty.rotation.y=Math.PI/2;w.add(ty);const rim=new THREE.Mesh(new THREE.TorusGeometry(r-.065,.008,5,24),gy);rim.rotation.y=Math.PI/2;w.add(rim);
   for(let i=0;i<8;i++){const sp=new THREE.Mesh(new THREE.BoxGeometry(.004,(r-.07)*2,.004),gy);sp.rotation.x=i*Math.PI/8;w.add(sp)}const hb=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.06,10),gy);hb.rotation.z=Math.PI/2;w.add(hb);return w};
  const wr=wheel(-.31,.21),wf=wheel(.33,.21);
  tube([0,.5,.25],[0,.66,.29],.03,pk);tube([0,.5,.25],[0,.21,.33],.02,pk);tube([0,.5,.25],[0,.24,.0],.03,pk);tube([0,.24,.0],[0,.2,-.04],.03,pk);tube([0,.2,-.04],[0,.5,-.15],.028,pk);tube([0,.2,-.04],[0,.21,-.31],.018,pk);tube([0,.45,-.13],[0,.21,-.31],.016,pk);
  tube([0,.66,.29],[0,.76,.25],.016,bk);tube([-.2,.76,.25],[.2,.76,.25],.014,bk);[-1,1].forEach(sd=>{tube([sd*.15,.76,.25],[sd*.22,.76,.25],.024,bk);tube([sd*.12,.765,.27],[sd*.17,.74,.33],.009,ye)});
  const bell=new THREE.Mesh(new THREE.SphereGeometry(.03,10,8,0,TAU,0,Math.PI/2),bk);bell.position.set(.08,.785,.25);g.add(bell);
  tube([0,.5,-.15],[0,.56,-.17],.014,bk);const sd=new THREE.Mesh(new THREE.SphereGeometry(.1,14,8),bk);sd.scale.set(.75,.22,1.15);sd.position.set(0,.585,-.18);g.add(sd);
  const gd=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.02,18),bk);gd.rotation.z=Math.PI/2;gd.position.set(.04,.2,-.04);g.add(gd);tube([.04,.2,-.04],[.04,.21,-.31],.012,bk);
  const cr=new THREE.Group();cr.position.set(0,.2,-.04);g.add(cr);[-1,1].forEach(s_=>{const arm=new THREE.Mesh(new THREE.BoxGeometry(.015,.02,.1),gy);arm.position.set(s_*.07,0,s_*.05);cr.add(arm);const pd=new THREE.Mesh(new THREE.BoxGeometry(.07,.02,.045),or);pd.position.set(s_*.1,0,s_*.1);cr.add(pd)});
  [-1,1].forEach(s_=>{const tw=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,.03,14),bk);tw.rotation.z=Math.PI/2;tw.position.set(s_*.2,.065,-.36);g.add(tw);tube([s_*.2,.065,-.36],[s_*.05,.24,-.3],.009,bk)});
  g.scale.setScalar(1.45);g.userData={wr,wf,cr};return g};
 K.mkBike=mkBike;K.bike=mkBike();P.add(K.bike);
 K.helm=new THREE.Group();{const h=new THREE.Mesh(new THREE.SphereGeometry(.37,20,14,0,TAU,0,Math.PI*.55),M(0xff7fb0,{roughness:.35}));h.position.set(0,1.56,-.02);K.helm.add(h);const vz=new THREE.Mesh(new THREE.BoxGeometry(.3,.04,.12),M(0xff7fb0));vz.position.set(0,1.66,.32);K.helm.add(vz);[-1,1].forEach(s=>{const st=new THREE.Mesh(new THREE.BoxGeometry(.02,.28,.02),M(0x222222));st.position.set(s*.27,1.38,.1);K.helm.add(st)})}
 girl.body.add(K.helm);K.helm.visible=false;
 /* keep the park's painted surfaces matte (no glossy toy shine) */
 P.traverse(o=>{if(o.isMesh&&o.material&&!Array.isArray(o.material)){if(o.material.isMeshStandardMaterial)o.material.envMapIntensity=.6;if(o.position.y<.2&&!o.material.map){o.material.userData.det=0;o.material.roughness=Math.max(o.material.roughness,.9)}}});
})();
return {root:GN,data:Object.assign(SPK,{floor})};}
