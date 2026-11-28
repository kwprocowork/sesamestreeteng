// Exact Schoolbus v223 ballet scene builders, isolated from its game state/private media.
import {SchoolTHREE as THREE} from './core.js?v=74a';
export function createVenue(parent){let floor=null;const S=parent,G={},girl={body:new THREE.Group()},GY=new THREE.Group();parent.add(GY);
const $=id=>document.getElementById(id),TAU=Math.PI*2,lp=(a,b,u)=>a+(b-a)*u,V=(x,y,z)=>new THREE.Vector3(x,y,z),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let seed=11;
const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o||{}));
const satTx=(w,h,fn,rx,ry)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h,c);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rx)t.repeat.set(rx,ry||rx);t.anisotropy=4;return t};
function satPl(P,w,h,x,y,z,ry,m,rx){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.rotation.y=ry||0;if(rx)o.rotation.x=rx;if(!floor&&rx< -1.4&&w>5&&h>5){floor=o;o.userData.dyn=1;}P.add(o);return o}
function satBx(P,w,h,d,x,y,z,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=false;o.receiveShadow=true;P.add(o);return o}
const SY={liftL:[],gL:[],cL:null,cls:[],big:[],staff:[],par:[],tea:null,mama:null,rooms:[-4.1,-.9]};
(function(){const P=new THREE.Group(),H=5.2;P.scale.set(1.5,1,1.5);GY.add(P);SY.geo=P;
 const tileT=satTx(256,256,(g,w,h)=>{g.fillStyle='#cfcac2';g.fillRect(0,0,w,h);for(let y=0;y<4;y++)for(let x=0;x<4;x++){g.fillStyle=['#d4cfc7','#c9c3ba','#d8d3cc'][(x+y*3)%3];g.fillRect(x*64+1,y*64+1,62,62)}},4,2);
 const wd=satTx(256,256,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=['#e6cfae','#ddc29d','#e9d4b5','#e0c8a4'][i%4];g.fillRect(0,i*32,w,32);g.fillStyle='rgba(140,100,60,.18)';g.fillRect(0,i*32,w,1.5);g.fillRect((i*71)%w,i*32,1.5,32)}},6,4);
 const gf=satTx(256,256,(g,w,h)=>{g.fillStyle='#a9adb3';g.fillRect(0,0,w,h);for(let i=0;i<300;i++){g.fillStyle='rgba(255,255,255,'+(rnd()*.06)+')';g.fillRect(rnd()*w,rnd()*h,2,2)}g.fillStyle='rgba(0,0,0,.08)';g.fillRect(0,0,w,2)},6,3);
 const stl=M(0xc6ccd2,{metalness:.65,roughness:.28}),frm=M(0x9aa3ab,{metalness:.6,roughness:.3}),rw=M(0xfbf8f3,{roughness:.95}),lw=M(0xe9e4dc,{roughness:.9}),red=M(0xd7262f,{roughness:.5}),lamp=M(0xffffff,{emissive:0xfff4dc,emissiveIntensity:.9});
 const glass=new THREE.MeshStandardMaterial({color:0xcfe9f2,transparent:true,opacity:.28,roughness:.05,metalness:.2,depthWrite:false,side:THREE.DoubleSide});
 /* floors and ceilings */
 satPl(P,20,12,0,0,0,0,new THREE.MeshStandardMaterial({map:wd,roughness:.55}),-Math.PI/2);
 satPl(P,20,10,0,.004,-11,0,new THREE.MeshStandardMaterial({map:gf,roughness:.35}),-Math.PI/2);
 satPl(P,14,6,-5,0,9,0,new THREE.MeshStandardMaterial({map:tileT,roughness:.5}),-Math.PI/2);
 satPl(P,20,12,0,H,0,0,M(0xffffff,{roughness:1}),Math.PI/2);satPl(P,20,10,0,H,-11,0,M(0xffffff,{roughness:1}),Math.PI/2);satPl(P,14,6,-5,H,9,0,M(0xf6f4f0),Math.PI/2);
 [-6,-2,2,6].forEach(x=>[-3,2.5].forEach(z=>satBx(P,1.4,.04,.5,x,H-.03,z,lamp)));[-6,-2,2,6].forEach(x=>[-13.5,-9].forEach(z=>satBx(P,1.4,.04,.5,x,H-.03,z,lamp)));[-9,-5,-1].forEach(x=>satBx(P,1.2,.04,.4,x,H-.03,9,lamp));
 /* reception walls */
 satPl(P,12,H,-10,H/2,0,Math.PI/2,rw);satPl(P,12,H,10,H/2,0,-Math.PI/2,rw);
 satPl(P,4,H,-8,H/2,6,Math.PI,rw);satPl(P,14,H,3,H/2,6,Math.PI,rw);satPl(P,2,H-2.6,-5,(H+2.6)/2,6,Math.PI,rw);
 satBx(P,20,.14,.04,0,.07,5.97,red);satBx(P,.04,.14,12,9.97,.07,0,red);satBx(P,.04,.14,12,-9.97,.07,0,red);
 /* glass wall to the studio, red strip at the bottom, glass door in the middle (blue dot) */
 [[-10,-.7],[.7,10]].forEach(a=>{const L=a[1]-a[0],cx=(a[0]+a[1])/2;const gp=new THREE.Mesh(new THREE.BoxGeometry(L,2.7,.04),glass);gp.position.set(cx,1.65,-6);P.add(gp);satBx(P,L,.3,.06,cx,.15,-6,red);satBx(P,L,.06,.06,cx,3.03,-6,frm);satBx(P,L,.34,.05,cx,3.23,-6,M(0xf3efe9))});
 satBx(P,20,H-3.3,.06,0,(H+3.3)/2,-6,M(0xf3efe9));satBx(P,.07,3.4,.08,-.7,1.7,-6,frm);satBx(P,.07,3.4,.08,.7,1.7,-6,frm);satBx(P,1.4,.4,.06,0,3.2,-6,M(0xf3efe9));
 {const g=new THREE.Group();g.position.set(-.7,0,-6);const pane=new THREE.Mesh(new THREE.BoxGeometry(1.38,2.75,.04),glass);pane.position.set(.69,1.38,0);g.add(pane);const hd=new THREE.Mesh(new THREE.BoxGeometry(.05,.5,.07),frm);hd.position.set(1.22,1.1,0);g.add(hd);satBx(g,1.38,.25,.05,.69,.13,0,red);P.add(g);SY.cL=g}
 {const t=satTx(512,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#d7262f';g.font='700 56px Fredoka,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('Studio  舞蹈室',w/2,66)});satPl(P,1.3,.32,0,3.2,-5.96,Math.PI,new THREE.MeshBasicMaterial({map:t}))}
 /* staff reception: L-shaped counter in the south-east corner (yellow part) */
 {const wh=M(0xffffff,{roughness:.45}),top=M(0xc8a479,{roughness:.5});
  satBx(P,8.6,1.05,.8,5.7,.525,.1,wh);satBx(P,8.8,.06,.95,5.7,1.08,.1,top);satBx(P,8.6,.14,.03,5.7,.82,-.31,red);
  satBx(P,.8,1.05,5.1,1.8,.525,3.05,wh);satBx(P,.95,.06,5.2,1.8,1.08,3.05,top);satBx(P,.03,.14,5.1,1.39,.82,3.05,red);
  [[4.6,.25],[7.2,.25]].forEach(a=>{satBx(P,.5,.32,.04,a[0],1.32,a[1]+.1,M(0x23343f));satBx(P,.12,.12,.12,a[0],1.14,a[1]+.12,M(0x23343f))});satBx(P,.4,.04,.3,2.0,1.12,2.2,M(0xffffff));satBx(P,.3,.18,.2,6.0,1.2,.2,M(0xf7b6c9));
  [[4.6,1.0],[7.2,1.0],[3.2,3.4]].forEach(a=>{satBx(P,.45,.45,.45,a[0],.24,a[1]+.3,M(0x3a4660))});
  const lg=satTx(512,256,(g,w,h)=>{g.fillStyle='#f6c3d0';g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<9;i++){g.beginPath();g.arc(30+i*60,20+(i%2)*14,10,0,7);g.fill()}
   g.strokeStyle='#fff';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(150,170);g.quadraticCurveTo(170,110,215,120);g.quadraticCurveTo(250,128,235,165);g.quadraticCurveTo(205,200,150,170);g.stroke();g.beginPath();g.moveTo(215,120);g.quadraticCurveTo(205,70,232,58);g.quadraticCurveTo(250,52,252,70);g.stroke();
   g.fillStyle='#fff';g.font='700 46px Fredoka,system-ui,sans-serif';g.textAlign='left';g.textBaseline='middle';g.fillText('Little Star',280,120);g.font='600 34px Fredoka,system-ui,sans-serif';g.fillText('Ballet School',284,170)});
  satPl(P,4.2,2.0,9.96,2.1,3.2,-Math.PI/2,new THREE.MeshStandardMaterial({map:lg,roughness:.9}));
  const wl=satTx(256,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#d7262f';g.font='700 40px Fredoka,system-ui,sans-serif';g.textAlign='center';g.fillText('Reception',w/2,54);g.font='600 30px Fredoka,system-ui,sans-serif';g.fillStyle='#23343f';g.fillText('接待處',w/2,100)});
  satPl(P,1.2,.6,5.7,.55,-.32,Math.PI,new THREE.MeshBasicMaterial({map:wl}))}
 /* two changing rooms at the west end of the reception */
 {const cw=M(0xf7d5de,{roughness:.8}),cw2=M(0xfbe6ec,{roughness:.8});
  satBx(P,2.8,2.3,.1,-8.6,1.15,-5.6,cw);satBx(P,2.8,2.3,.1,-8.6,1.15,-2.5,cw);satBx(P,2.8,2.3,.1,-8.6,1.15,.6,cw);
  [[-5.1,1.0],[-3.05,1.1],[-1.95,1.1],[.1,1.0]].forEach(a=>satBx(P,.1,2.3,a[1],-7.2,1.15,a[0],cw));
  SY.rooms.forEach((z,i)=>{satBx(P,.1,.3,1.0,-7.2,2.15,z,cw);
   const cu=satBx(P,.06,2.0,.22,-7.15,1.0,z-.42,M(0xe46a8e,{roughness:.9}));
   const sg=satTx(512,160,(g,w,h)=>{g.fillStyle='#d7262f';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='700 54px Fredoka,"PingFang TC",system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('更衣室 '+(i+1),w/2,52);g.font='600 40px Fredoka,system-ui,sans-serif';g.fillText('Changing Room '+(i+1),w/2,116)});
   satPl(P,1.3,.4,-7.12,2.6,z,Math.PI/2,new THREE.MeshBasicMaterial({map:sg,side:THREE.DoubleSide}));
   satBx(P,.6,.4,1.9,-9.65,.2,z-.2+(i?0:-.2),M(0xb98a58));
   const mi=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.3),new THREE.MeshStandardMaterial({color:0xdbe9f2,metalness:.9,roughness:.08,emissive:0x34404a,emissiveIntensity:.35}));mi.position.set(-8.6,1.4,i?.53:-5.53);if(i)mi.rotation.y=Math.PI;P.add(mi);
   [0,1,2].forEach(k=>{satBx(P,.04,.04,.12,-9.9,1.7,z-.8+k*.6,M(0x9aa3ab));const d=new THREE.Mesh(new THREE.ConeGeometry(.16,.4,10),M([0xf7b6c9,0x9fd3f0,0xffd76a][k]));d.position.set(-9.85,1.4,z-.8+k*.6);P.add(d)})});
  satPl(P,2.8,.04,-8.6,2.31,-4.05,0,cw2,-Math.PI/2);satPl(P,2.8,.04,-8.6,2.31,-.95,0,cw2,-Math.PI/2)}
 /* benches, cubbies, rug, plants, pendant lights, photos */
 const pot=(x,z,s)=>{satBx(P,.5*s,.5*s,.5*s,x,.25*s,z,M(0xf1ece4));[0,1,2,3,4].forEach(i=>{const l=new THREE.Mesh(new THREE.SphereGeometry(.28*s,10,8),M([0x3f8f3a,0x4fa34a,0x2f7a33][i%3]));l.position.set(x+Math.cos(i*1.3)*.15*s,(.7+i*.12)*s,z+Math.sin(i*1.3)*.15*s);l.scale.set(1,1.3,1);P.add(l)})};
 const bn=M(0xb98a58,{roughness:.6});[[-2.2],[0.0]].forEach(a=>{satBx(P,2.0,.08,.5,a[0],.42,5.6,bn);[-.9,.9].forEach(q=>satBx(P,.08,.42,.45,a[0]+q,.21,5.6,M(0x8c6a42)));satBx(P,2.0,.4,.06,a[0],.75,5.88,red)});
 {const cb=M(0xffffff,{roughness:.6});satBx(P,.45,1.1,3.6,-9.75,.55,3.4,cb);for(let i=0;i<5;i++)for(let j=0;j<2;j++)satBx(P,.02,.44,.62,-9.52,.3+j*.5,1.95+i*.72,M([0xf6c7d6,0xfbe0e8,0xffd9c7][(i+j)%3]));
  for(let i=0;i<6;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),M([0xf7b6c9,0xf9c2a8,0xffffff][i%3]));s.scale.set(1.7,.5,1);s.position.set(-9.65,1.15,1.9+i*.6);P.add(s)}}
 {const rug=new THREE.Mesh(new THREE.CircleGeometry(1.8,40),M(0xf7c6d3,{roughness:1}));rug.rotation.x=-Math.PI/2;rug.position.set(-2.6,.012,-1.2);P.add(rug);const rg2=new THREE.Mesh(new THREE.RingGeometry(1.6,1.72,40),M(0xffffff,{roughness:1}));rg2.rotation.x=-Math.PI/2;rg2.position.set(-2.6,.014,-1.2);P.add(rg2)}
 pot(9.4,-5.4,1);pot(-9.4,5.4,.9);pot(-3.9,5.5,.7);pot(4.2,-5.5,.8);
 [-6,-2.6,1,5].forEach(x=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.5,6),M(0x333333));c.position.set(x,H-.15,-1.2);P.add(c);const sh=new THREE.Mesh(new THREE.SphereGeometry(.17,14,10,0,TAU,0,Math.PI*.55),M(0xfff4e0,{emissive:0xffe2b0,emissiveIntensity:.8,side:THREE.DoubleSide}));sh.position.set(x,H-.38,-1.2);sh.rotation.x=Math.PI;P.add(sh)});
 const balP=satTx(256,320,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#ffe1ea');gr.addColorStop(1,'#f7b6c9');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#8e2f4f';g.beginPath();g.arc(128,72,20,0,7);g.fill();g.fillRect(122,90,12,70);g.beginPath();g.moveTo(128,96);g.lineTo(62,52);g.lineTo(66,46);g.lineTo(130,90);g.fill();g.beginPath();g.moveTo(128,96);g.lineTo(194,52);g.lineTo(190,46);g.lineTo(126,90);g.fill();g.beginPath();g.ellipse(128,168,62,16,0,0,7);g.fill();g.fillRect(124,168,8,90);g.beginPath();g.moveTo(130,180);g.lineTo(196,236);g.lineTo(190,242);g.lineTo(124,186);g.fill();g.font='700 26px Fredoka,system-ui,sans-serif';g.textAlign='center';g.fillText('Dance with joy',128,300)});
 const ph=satTx(200,150,(g,w,h)=>{g.fillStyle='#fde6ec';g.fillRect(0,0,w,h);[[50,'#f7b6c9'],[100,'#9fd3f0'],[150,'#f7b6c9']].forEach(a=>{g.fillStyle='#3a2a20';g.beginPath();g.arc(a[0],46,11,0,7);g.fill();g.fillStyle=a[1];g.fillRect(a[0]-8,58,16,30);g.beginPath();g.ellipse(a[0],86,24,7,0,0,7);g.fill();g.fillStyle='#f3d6c4';g.fillRect(a[0]-6,90,4,36);g.fillRect(a[0]+2,90,4,36);g.fillRect(a[0]-26,62,18,4);g.fillRect(a[0]+8,62,18,4)})});
 [[-9.97,2.0,3.0,Math.PI/2,balP],[-1.5,2.0,5.97,Math.PI,ph],[-4.0,2.2,5.97,Math.PI,balP]].forEach(a=>satPl(P,a[4]===balP?.9:1.2,a[4]===balP?1.12:.9,a[0],a[1],a[2],a[3],new THREE.MeshStandardMaterial({map:a[4],roughness:.9})));
 /* dance studio: mirror wall with a barre, piano, windows */
 const sw2=M(0xf7f3ee,{roughness:.95});satPl(P,20,H,0,H/2,-16,0,sw2);satPl(P,10,H,-10,H/2,-11,Math.PI/2,sw2);satPl(P,10,H,10,H/2,-11,-Math.PI/2,sw2);
 const mir=new THREE.Mesh(new THREE.PlaneGeometry(19,2.4),new THREE.MeshStandardMaterial({color:0xdbe9f2,metalness:.9,roughness:.08,emissive:0x34404a,emissiveIntensity:.35}));mir.position.set(0,1.5,-15.97);P.add(mir);SY.mirM=mir;
 const barM=M(0xc49a64,{roughness:.4});{const b=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,19,10),barM);b.rotation.z=Math.PI/2;b.position.set(0,.82,-15.75);P.add(b);[-8,-3,2,7].forEach(x=>satBx(P,.04,.04,.25,x,.82,-15.87,M(0x9aa3ab,{metalness:.6})))}
 {const b=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,8,10),barM);b.rotation.x=Math.PI/2;b.position.set(-9.75,.82,-11);P.add(b)}
 const wT=satTx(256,160,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#a9d8ff');gr.addColorStop(1,'#eaf6ff');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#d8dde6';for(let i=0;i<6;i++)g.fillRect(i*44+6,70-((i*37)%40),36,120);g.fillStyle='#fff';g.globalAlpha=.8;g.beginPath();g.arc(60,30,16,0,7);g.arc(80,26,20,0,7);g.arc(100,32,14,0,7);g.fill()});
 [-13.2,-8.8].forEach(z=>{satBx(P,.06,1.72,2.72,10.04,1.85,z,M(0xffffff));satPl(P,2.6,1.6,9.96,1.85,z,-Math.PI/2,new THREE.MeshBasicMaterial({map:wT}));satBx(P,.04,.05,2.6,9.95,1.85,z,M(0xffffff))});
 {const pk=M(0x15151a,{roughness:.25,metalness:.1});satBx(P,1.5,1.25,.6,8.2,.62,-15.55,pk);satBx(P,1.42,.05,.32,8.2,.78,-15.15,M(0xffffff));for(let i=0;i<10;i++)satBx(P,.04,.03,.18,7.58+i*.135,.82,-15.12,M(0x111111));satBx(P,.6,.07,.32,8.2,.45,-14.9,pk)}
 satPl(P,.9,1.12,-9.97,1.9,-8.0,Math.PI/2,new THREE.MeshStandardMaterial({map:balP,roughness:.9}));
 /* little sitting mats in the studio */
 [-2.4,-1.2,0,1.2,2.4].forEach((x,i)=>{const m=new THREE.Mesh(new THREE.CircleGeometry(.36,24),M([0xf7c6d3,0xffe3b3,0xcfe8ff,0xf7c6d3,0xd9f2d0][i],{roughness:1}));m.rotation.x=-Math.PI/2;m.position.set(x,.012,-10.4);P.add(m)});
 /* lift lobby (outside the green-dot entrance) */
 satPl(P,6,H,-12,H/2,9,Math.PI/2,lw);satPl(P,6,H,2,H/2,9,-Math.PI/2,lw);
 satPl(P,5.7,H,-9.15,H/2,12,Math.PI,lw);satPl(P,5.7,H,-.85,H/2,12,Math.PI,lw);satPl(P,2.6,H-2.6,-5,(H+2.6)/2,12,Math.PI,lw);
 satPl(P,6,H,-9,H/2,6,0,lw);satPl(P,6,H,-1,H/2,6,0,lw);satPl(P,2,H-2.4,-5,(H+2.4)/2,6,0,lw);
 satPl(P,2.6,2,-5,0,13,0,new THREE.MeshStandardMaterial({map:tileT,roughness:.5}),-Math.PI/2);
 satPl(P,2.6,2.6,-5,1.3,14,Math.PI,stl);satPl(P,2,2.6,-6.3,1.3,13,Math.PI/2,stl);satPl(P,2,2.6,-3.7,1.3,13,-Math.PI/2,stl);satPl(P,2.6,2,-5,2.6,13,0,M(0xffffff,{emissive:0xfff2d0,emissiveIntensity:.8}),Math.PI/2);
 satBx(P,2.6,.5,.12,-5,2.75,11.95,M(0x8c939a,{metalness:.5,roughness:.35}));[-1,1].forEach(s=>satBx(P,.2,2.5,.14,-5+s*1.1,1.25,11.95,M(0x8c939a,{metalness:.5,roughness:.35})));
 [-1,1].forEach(s=>{const d=satBx(P,.9,2.45,.05,-5+s*.45,1.225,11.92,stl);d.userData.x0=-5+s*.45;d.userData.s=s;SY.liftL.push(d)});
 satBx(P,.16,.3,.04,-3.4,1.2,11.96,M(0x2b2f36));satBx(P,1.9,2.45,.05,-9.3,1.225,11.95,stl);satBx(P,.16,.3,.04,-7.8,1.2,11.96,M(0x2b2f36));
 [[-11.4,8.5],[-11.4,10.2]].forEach(a=>{satBx(P,.5,.42,1.4,a[0],.21,a[1],M(0xb98a58))});
 const fT=satTx(128,64,(g,w,h)=>{g.fillStyle='#111';g.fillRect(0,0,w,h);g.fillStyle='#ff7a3d';g.font='700 44px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('8 ▲',64,34)});satPl(P,.5,.25,-5,2.75,11.87,Math.PI,new THREE.MeshBasicMaterial({map:fT}));
 pot(-11.3,11.4,.9);pot(1.3,11.4,.9);pot(1.3,6.6,.8);
 /* entrance (green dot): glass sliding doors with the red and white sign */
 const sg=satTx(1024,256,(g,w,h)=>{g.fillStyle='#d7262f';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.fillRect(0,h*.62,w,h*.38);g.fillStyle='#fff';g.font='700 92px "PingFang TC","Noto Sans TC",system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('小天鵝芭蕾舞學校',w/2,84);g.fillStyle='#d7262f';g.font='700 66px Fredoka,system-ui,sans-serif';g.fillText('Little Star Ballet School',w/2,200);
  g.strokeStyle='#fff';g.lineWidth=6;g.beginPath();g.arc(70,84,34,Math.PI*.2,Math.PI*1.4);g.stroke();g.beginPath();g.arc(954,84,34,-Math.PI*.4,Math.PI*.8);g.stroke()});
 satPl(P,2.8,.7,-5,2.78,6.06,0,new THREE.MeshBasicMaterial({map:sg}));
 [-1,1].forEach(s=>{const g=new THREE.Group();g.position.set(-5+s*.5,0,6);const pane=new THREE.Mesh(new THREE.BoxGeometry(1.0,2.5,.04),glass);pane.position.y=1.25;g.add(pane);const fr=new THREE.Mesh(new THREE.BoxGeometry(.05,2.5,.06),frm);fr.position.set(s*.48,1.25,0);g.add(fr);const hd=new THREE.Mesh(new THREE.BoxGeometry(.04,.6,.06),frm);hd.position.set(-s*.4,1.1,.05);g.add(hd);g.userData.x0=-5+s*.5;g.userData.s=s;P.add(g);SY.gL.push(g)});
 const clk=satTx(128,128,(g,w,h)=>{g.fillStyle='#fff';g.beginPath();g.arc(64,64,60,0,7);g.fill();g.strokeStyle='#23343f';g.lineWidth=6;g.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;g.fillStyle='#23343f';g.fillRect(64+Math.cos(a)*48-2,64+Math.sin(a)*48-2,5,5)}g.lineWidth=6;g.beginPath();g.moveTo(64,64);g.lineTo(64,28);g.stroke();g.lineWidth=4;g.beginPath();g.moveTo(64,64);g.lineTo(92,70);g.stroke()});
 satPl(P,.5,.5,-7.0,2.2,6.04,0,new THREE.MeshBasicMaterial({map:clk,transparent:true}));
 const nt=satTx(256,320,(g,w,h)=>{g.fillStyle='#fffdf6';g.fillRect(0,0,w,h);g.fillStyle='#d7262f';g.fillRect(0,0,w,40);g.fillStyle='#fff';g.font='700 26px Fredoka,system-ui,sans-serif';g.textAlign='center';g.fillText('Saturday Classes',w/2,30);g.fillStyle='#23343f';g.font='600 22px Fredoka,system-ui,sans-serif';['Baby Ballet  10:00','Pre-Primary  11:00','Primary  12:00','Grade 1  2:00','Grade 2  3:00'].forEach((s,i)=>g.fillText(s,w/2,86+i*46))});
 satPl(P,.6,.75,-3.0,1.45,6.04,0,new THREE.MeshBasicMaterial({map:nt}));
 /* keep pictures, signs and small furniture their real size inside the bigger building */
 P.children.forEach(o=>{if(!o.isMesh||o.userData.x0!==undefined)return;const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();const b=g.boundingBox,sx=(b.max.x-b.min.x)*o.scale.x,sz=(b.max.z-b.min.z)*o.scale.z,flat=Math.abs(Math.abs(o.rotation.x)-Math.PI/2)<.01;
  if(g.type==='PlaneGeometry'){if(!flat&&o.material&&o.material.map&&sx<4.3)o.scale.x/=1.5}else if(g.type!=='CircleGeometry'&&g.type!=='RingGeometry'&&sx<.75&&sz<.75){o.scale.x/=1.5;o.scale.z/=1.5}});
})();
return {root:GY,data:Object.assign(SY,{floor})};}
