// Source-built models ported from Schoolbus v223; no private photos/audio.
import {SchoolTHREE as THREE} from './core.js?v=76a';
export function createSchoolActor(S){
 const G={},R=null,innerWidth=globalThis.innerWidth||1280,innerHeight=globalThis.innerHeight||720;const localStorage={getItem:()=>null};
const $=id=>document.getElementById(id),TAU=Math.PI*2,lp=(a,b,u)=>a+(b-a)*u,V=(x,y,z)=>new THREE.Vector3(x,y,z),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cam=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,600);
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o||{}));
function add(g,m,x,y,z,p){const o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=o.receiveShadow=true;(p||S).add(o);return o}
function rod(a,b,r,mat,p){const d=b.clone().sub(a),L=d.length(),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,12),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());m.castShadow=true;(p||S).add(m);return m}
const BXC=new Map(),B=(w,h,d)=>{const key=w.toFixed(3)+','+h.toFixed(3)+','+d.toFixed(3);let g=BXC.get(key);if(g)return g;
 const r=Math.min(.07,Math.min(w,h,d)*.22);if(r<.006||Math.max(w,h,d)>60){g=new THREE.BoxGeometry(w,h,d);BXC.set(key,g);return g}
 g=new THREE.BoxGeometry(w,h,d,3,3,3);const P=g.attributes.position,N=g.attributes.normal,Hh=[w/2,h/2,d/2],v=[0,0,0],c=[0,0,0];
 for(let i=0;i<P.count;i++){v[0]=P.getX(i);v[1]=P.getY(i);v[2]=P.getZ(i);for(let a=0;a<3;a++){const t=v[a]/Hh[a];if(Math.abs(Math.abs(t)-1/3)<.01)v[a]=Math.sign(t)*(Hh[a]-r);c[a]=Math.max(-(Hh[a]-r),Math.min(Hh[a]-r,v[a]))}
  const dx=v[0]-c[0],dy=v[1]-c[1],dz=v[2]-c[2],l=Math.hypot(dx,dy,dz);if(l>1e-6){P.setXYZ(i,c[0]+dx/l*r,c[1]+dy/l*r,c[2]+dz/l*r);N.setXYZ(i,dx/l,dy/l,dz/l)}else P.setXYZ(i,v[0],v[1],v[2])}
 P.needsUpdate=true;N.needsUpdate=true;BXC.set(key,g);return g};
const KTX=(function(){const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t};
 const fab=mk(128,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=4){const v=232+((x*7+y*13)%17);g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(x,y,2,4);g.fillStyle=`rgb(${v+6},${v+6},${v+6})`;g.fillRect(x+2,y,2,4)}g.fillStyle='rgba(0,0,0,.035)';for(let y=0;y<h;y+=8)g.fillRect(0,y,w,1)});fab.repeat.set(5,5);
 const hair=mk(256,64,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);for(let i=0;i<420;i++){const x=Math.random()*w,a=.05+Math.random()*.16;g.strokeStyle=Math.random()<.5?`rgba(0,0,0,${a})`:`rgba(255,255,255,${a*1.4})`;g.lineWidth=.6+Math.random()*1.2;g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+3,h*.3,x-3,h*.7,x+(Math.random()-.5)*4,h);g.stroke()}});hair.repeat.set(3,1);
 const sh=document.createElement('canvas');sh.width=sh.height=64;{const g=sh.getContext('2d'),gr=g.createRadialGradient(32,32,2,32,32,31);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(.55,'rgba(0,0,0,.22)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)}
 const blobM=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sh),transparent:true,depthWrite:false,opacity:.5}),blobG=new THREE.PlaneGeometry(1.15,1.15);blobG.rotateX(-Math.PI/2);
 return{fab,hair,blobM,blobG}})();
const KSH=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,2,32,32,31);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(.55,'rgba(0,0,0,.25)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);const g=new THREE.CircleGeometry(.5,24);g.rotateX(-Math.PI/2);return{g,m:new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,opacity:.75,polygonOffset:true,polygonOffsetFactor:-2})}})();
const KBD=(()=>{
 /* bone ids */
 const BT=0,UAL=1,FAL=2,HL=3,UAR=4,FAR=5,HR=6,THL=7,SHL=8,FTL=9,THR=10,SHR=11,FTR=12,NB=13;
 /* rest joint positions in character space (feet at y=0, facing +z) */
 const J={sh:[.42,1.13,0],el:[.43,.875,0],wr:[.43,.655,0],hip:[.14,.5,0],kn:[.135,.27,0],an:[.135,.07,0]};
 const R_SKIN=0,R_TOP=1,R_TRIM=2,R_BOT=3,R_SOCK=4,R_SHOE=5,NR=6;
 const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],len=a=>Math.hypot(a[0],a[1],a[2]);
 function capsule(a,b,ra,rb){const ba=sub(b,a),bb=dot(ba,ba);return p=>{const pa=sub(p,a);let t=dot(pa,ba)/bb;t=t<0?0:t>1?1:t;const q=[pa[0]-ba[0]*t,pa[1]-ba[1]*t,pa[2]-ba[2]*t];return[len(q)-(ra+(rb-ra)*t),t]}}
 function ellip(c,r){return p=>{const q=[(p[0]-c[0])/r[0],(p[1]-c[1])/r[1],(p[2]-c[2])/r[2]];const k0=len(q),k1=Math.hypot(q[0]/r[0],q[1]/r[1],q[2]/r[2]);return[k1<1e-6?-Math.min(...r):k0*(k0-1)/k1,0]}}
 /* solid cone along y (ellipse section with z squash) */
 function cone(y0,y1,r0,r1,zs,cz){return p=>{const t=(p[1]-y0)/(y1-y0),tc=t<0?0:t>1?1:t,r=r0+(r1-r0)*tc,dxz=Math.hypot(p[0],(p[2]-(cz||0))/zs)-r,dy=Math.max(y0-p[1],p[1]-y1);const o=Math.hypot(Math.max(dxz,0),Math.max(dy,0))+Math.min(Math.max(dxz,dy),0);return[o,tc]}}
 const smin=(a,b,k)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25};
 /* body spec -> list of primitives {f,bone,chain,reg(p,t)} */
 function prims(o){const P=[],dress=!!o.dress,pants=o.pants!==undefined&&!dress,shorts=!!o.shorts,sleeve=o.longSleeve?.98:.42;
  const add=(f,bone,chain,reg,k)=>P.push({f,bone,chain,reg,k:k||.045});
  /* torso */
  add(cone(.7,1.17,.205,.165,.8,0),BT,[BT],(p,t)=>p[1]>1.125?(Math.abs(p[2])>.0||1?R_TRIM:R_TOP):R_TOP,.06);
  add(ellip([0,1.06,0],[.235,.13,.17]),BT,[BT],p=>p[1]>1.125?R_TRIM:R_TOP,.06);
  add(capsule([0,1.12,0],[0,1.3,0],.078,.07),BT,[BT],()=>R_SKIN,.03);
  if(dress){add(cone(.5,.88,.43,.2,.82,0),BT,[BT],p=>p[1]<.565?R_TRIM:R_TOP,.05)}
  else{add(cone(.48,.78,.22,.2,.8,0),BT,[BT],()=>pants?R_BOT:R_TOP,.06)}
  [-1,1].forEach(s=>{const L=s<0,ua=L?UAL:UAR,fa=L?FAL:FAR,hd=L?HL:HR,th=L?THL:THR,sh=L?SHL:SHR,ft=L?FTL:FTR,ch=[BT,ua,fa,hd],lc=[BT,th,sh,ft];
   const S=[s*.37,1.12,0],E=[s*J.el[0],J.el[1],0],W=[s*J.wr[0],J.wr[1],0];
   add(capsule(S,E,.08,.062),ua,ch,(p,t)=>t<sleeve/ .98*.98&&t<sleeve?R_TOP:R_SKIN,.05);
   add(capsule(E,W,.059,.047),fa,ch,(p,t)=>o.longSleeve&&t<.85?R_TOP:R_SKIN,.03);
   /* hand: palm + thumb + finger mitt */
   add(ellip([s*.432,.6,.008],[.042,.062,.056]),hd,ch,()=>R_SKIN,.025);
   add(capsule([s*.425,.625,.045],[s*.41,.585,.075],.02,.018),hd,ch,()=>R_SKIN,.015);
   add(ellip([s*.434,.545,.006],[.036,.035,.05]),hd,ch,()=>R_SKIN,.03);
   const H=[s*.13,.53,0],K=[s*J.kn[0],J.kn[1],.005],A=[s*J.an[0],J.an[1],0];
   const legReg=(p)=>{if(p[1]<.115)return R_SHOE;if(pants)return(shorts?(p[1]>.36?R_BOT:(p[1]<.24?R_SOCK:R_SKIN)):R_BOT);return p[1]<.25?R_SOCK:R_SKIN};
   add(capsule(H,K,.092,.07),th,lc,legReg,.05);
   add(capsule(K,A,.066,.056),sh,lc,legReg,.03);
   /* shoe */
   add(capsule([s*.135,.058,-.03],[s*.137,.052,.115],.062,.056),ft,lc,()=>R_SHOE,.035);
   add(ellip([s*.136,.03,.04],[.075,.03,.13]),ft,lc,()=>R_SHOE,.02)});
  return P}
 /* naive surface nets */
 function build(o,cell){cell=cell||.0135;const P=prims(o),X0=-.62,X1=.62,Y0=-.01,Y1=1.36,Z0=-.32,Z1=.34;
  const nx=Math.ceil((X1-X0)/cell)+1,ny=Math.ceil((Y1-Y0)/cell)+1,nz=Math.ceil((Z1-Z0)/cell)+1;
  const sdf=p=>{let d=1e9;for(const q of P){const v=q.f(p)[0];d=d===1e9?v:smin(d,v,q.k)}return d};
  const F=new Float32Array(nx*ny*nz),id=(i,j,k)=>i+nx*(j+ny*k);
  const C=4,cc=cell*C,cx=Math.ceil(nx/C)+1,cy=Math.ceil(ny/C)+1,cz=Math.ceil(nz/C)+1,CF=new Float32Array(cx*cy*cz),cid=(i,j,k)=>i+cx*(j+cy*k);
  for(let k=0;k<cz;k++)for(let j=0;j<cy;j++)for(let i=0;i<cx;i++)CF[cid(i,j,k)]=sdf([X0+i*cc,Y0+j*cc,Z0+k*cc]);
  const band=cc*1.9;
  for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const c=CF[cid(Math.round(i/C),Math.round(j/C),Math.round(k/C))];F[id(i,j,k)]=Math.abs(c)>band?c:sdf([X0+i*cell,Y0+j*cell,Z0+k*cell])}
  const vix=new Int32Array(nx*ny*nz).fill(-1),pos=[];
  const corner=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]],edges=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
  for(let k=0;k<nz-1;k++)for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const v=corner.map(c=>F[id(i+c[0],j+c[1],k+c[2])]);let m=0;for(let c=0;c<8;c++)if(v[c]<0)m|=1<<c;if(m===0||m===255)continue;
   let sx=0,sy=0,sz=0,n=0;for(const[a,b]of edges){if((v[a]<0)!==(v[b]<0)){const t=v[a]/(v[a]-v[b]),A=corner[a],B=corner[b];sx+=A[0]+(B[0]-A[0])*t;sy+=A[1]+(B[1]-A[1])*t;sz+=A[2]+(B[2]-A[2])*t;n++}}
   vix[id(i,j,k)]=pos.length/3;pos.push(X0+(i+sx/n)*cell,Y0+(j+sy/n)*cell,Z0+(k+sz/n)*cell)}
  const tris=[];
  for(let k=1;k<nz-1;k++)for(let j=1;j<ny-1;j++)for(let i=1;i<nx-1;i++){const a=F[id(i,j,k)]<0;
   /* x edge */ if(a!==(F[id(i+1,j,k)]<0)){const q=[vix[id(i,j-1,k-1)],vix[id(i,j,k-1)],vix[id(i,j,k)],vix[id(i,j-1,k)]];if(q.every(x=>x>=0))a?tris.push(q[0],q[1],q[2],q[0],q[2],q[3]):tris.push(q[0],q[2],q[1],q[0],q[3],q[2])}
   /* y edge */ if(a!==(F[id(i,j+1,k)]<0)){const q=[vix[id(i-1,j,k-1)],vix[id(i-1,j,k)],vix[id(i,j,k)],vix[id(i,j,k-1)]];if(q.every(x=>x>=0))a?tris.push(q[0],q[1],q[2],q[0],q[2],q[3]):tris.push(q[0],q[2],q[1],q[0],q[3],q[2])}
   /* z edge */ if(a!==(F[id(i,j,k+1)]<0)){const q=[vix[id(i-1,j-1,k)],vix[id(i,j-1,k)],vix[id(i,j,k)],vix[id(i-1,j,k)]];if(q.every(x=>x>=0))a?tris.push(q[0],q[1],q[2],q[0],q[2],q[3]):tris.push(q[0],q[2],q[1],q[0],q[3],q[2])}}
  /* one smoothing pass toward the true surface + normals from the field */
  const nv=pos.length/3,nor=new Float32Array(nv*3),reg=new Uint8Array(nv),sI=new Uint16Array(nv*4),sW=new Float32Array(nv*4),e=cell*.5;
  for(let v=0;v<nv;v++){let p=[pos[v*3],pos[v*3+1],pos[v*3+2]];{const d=sdf(p),a1=sdf([p[0]+e,p[1]-e,p[2]-e]),a2=sdf([p[0]-e,p[1]-e,p[2]+e]),a3=sdf([p[0]-e,p[1]+e,p[2]-e]),a4=sdf([p[0]+e,p[1]+e,p[2]+e]),g=[a1-a2-a3+a4,-a1-a2+a3+a4,-a1+a2-a3+a4],gl=len(g)||1;p=[p[0]-g[0]/gl*d,p[1]-g[1]/gl*d,p[2]-g[2]/gl*d];nor[v*3]=g[0]/gl;nor[v*3+1]=g[1]/gl;nor[v*3+2]=g[2]/gl}
   pos[v*3]=p[0];pos[v*3+1]=p[1];pos[v*3+2]=p[2];
   let best=null,bd=1e9,bt=0;for(const q of P){const r=q.f(p);if(r[0]<bd){bd=r[0];best=q;bt=r[1]}}reg[v]=best.reg(p,bt);
   /* skin weights: blend along the chain by closeness to each bone's primitives */
   const w=new Float32Array(NB);for(const q of P){if(!best.chain.includes(q.bone))continue;const d=Math.max(0,q.f(p)[0]-bd);w[q.bone]=Math.max(w[q.bone],Math.exp(-((d/.022)**2)))}
   if(best.bone===BT){w.fill(0);w[BT]=1}
   const ord=[...w.keys()].sort((a,b)=>w[b]-w[a]).slice(0,4);let ws=0;ord.forEach(b=>ws+=w[b]);ord.forEach((b,c)=>{sI[v*4+c]=b;sW[v*4+c]=ws>0?w[b]/ws:(c?0:1)})}
  /* cut triangles exactly along colour boundaries */
  const regAt=p=>{let best=null,bd=1e9,bt=0;for(const q of P){const r=q.f(p);if(r[0]<bd){bd=r[0];best=q;bt=r[1]}}return best.reg(p,bt)};
  const NP=[...pos],NN=[...nor],NI=[...sI],NW=[...sW],NRg=[...reg],ec=new Map();
  const mid=(a,b)=>{const key=a<b?a+'_'+b:b+'_'+a;if(ec.has(key))return ec.get(key);const ra=NRg[a];let lo=0,hi=1;const P0=[NP[a*3],NP[a*3+1],NP[a*3+2]],P1=[NP[b*3],NP[b*3+1],NP[b*3+2]];
   for(let it=0;it<7;it++){const m=(lo+hi)/2,q=[P0[0]+(P1[0]-P0[0])*m,P0[1]+(P1[1]-P0[1])*m,P0[2]+(P1[2]-P0[2])*m];if(regAt(q)===ra)lo=m;else hi=m}const u=(lo+hi)/2,v=NP.length/3;
   for(let c=0;c<3;c++){NP.push(P0[c]+(P1[c]-P0[c])*u);NN.push(NN[a*3+c]*(1-u)+NN[b*3+c]*u)}NRg.push(255);
   const wm=new Map();for(let c=0;c<4;c++){wm.set(NI[a*4+c],(wm.get(NI[a*4+c])||0)+NW[a*4+c]*(1-u));wm.set(NI[b*4+c],(wm.get(NI[b*4+c])||0)+NW[b*4+c]*u)}
   const ws=[...wm.entries()].sort((x,y)=>y[1]-x[1]).slice(0,4);let tt=0;ws.forEach(x=>tt+=x[1]);for(let c=0;c<4;c++){NI.push(ws[c]?ws[c][0]:0);NW.push(ws[c]?ws[c][1]/tt:0)}ec.set(key,v);return v};
  const byR=[...Array(NR)].map(()=>[]);for(let t=0;t<tris.length;t+=3){const v=[tris[t],tris[t+1],tris[t+2]],r=v.map(x=>reg[x]);
   if(r[0]===r[1]&&r[1]===r[2]){byR[r[0]].push(...v);continue}
   if(r[0]!==r[1]&&r[1]!==r[2]&&r[0]!==r[2]){const rr=Math.min(...r);byR[rr].push(...v);continue}
   const k=r[0]!==r[1]&&r[0]!==r[2]?0:r[1]!==r[0]&&r[1]!==r[2]?1:2,K=v[k],I=v[(k+1)%3],Jv=v[(k+2)%3],m1=mid(K,I),m2=mid(K,Jv);
   byR[reg[K]].push(K,m1,m2);byR[reg[I]].push(m1,I,Jv,m1,Jv,m2)}
  for(let q=0;q<NN.length;q+=3){const l=Math.hypot(NN[q],NN[q+1],NN[q+2])||1;NN[q]/=l;NN[q+1]/=l;NN[q+2]/=l}
  const idx=[],groups=[];byR.forEach((a,r)=>{if(a.length){groups.push([idx.length,a.length,r]);idx.push(...a)}});
  const nv2=NP.length/3;return{pos:new Float32Array(NP),nor:new Float32Array(NN),sI:new Uint16Array(NI),sW:new Float32Array(NW),idx:nv2>65535?new Uint32Array(idx):new Uint16Array(idx),groups}}
 return{build,J,BT,UAL,FAL,HL,UAR,FAR,HR,THL,SHL,FTL,THR,SHR,FTR,NB,R_SKIN,R_TOP,R_TRIM,R_BOT,R_SOCK,R_SHOE}})();
const KBON=(()=>{try{return localStorage.getItem('kbOff')!=='1'}catch(e){return true}})(),KBG={},KB_EMPTY=new THREE.BufferGeometry();
function kbGeo(v,lo){const key=v+(lo?'_lo':'');if(KBG[key])return KBG[key];const o=v==='dress'?{dress:1}:v==='pants'?{pants:1}:{};const m=KBD.build(o,lo?.027:.017),g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.BufferAttribute(m.pos,3));g.setAttribute('normal',new THREE.BufferAttribute(m.nor,3));g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(m.sI,4));g.setAttribute('skinWeight',new THREE.BufferAttribute(m.sW,4));g.setIndex(new THREE.BufferAttribute(m.idx,1));m.groups.forEach(q=>g.addGroup(q[0],q[1],q[2]));g.computeBoundingSphere();return KBG[key]=g}
function kbMake(o,e,GH,mats){const add0=(p,c)=>THREE.Object3D.prototype.add.call(p,c);const J=KBD.J,Bn=()=>new THREE.Bone();
 GH.forEach(m=>{if(m&&m.isMesh)m.geometry=KB_EMPTY});e.body.children.forEach(c=>{const g=c.geometry;if(!g||!g.parameters)return;if(g.type==='TorusGeometry'&&Math.abs(g.parameters.radius-.16)<.001&&Math.abs(c.position.y-1.21)<.01)c.geometry=KB_EMPTY;if(g.type==='BoxGeometry'&&Math.abs(c.position.z-.29)<.001&&Math.abs(g.parameters.height-.24)<.001)c.position.z=.178});
 const tb=Bn();add0(e.body,tb);const bones=[tb];
 [[e.armL,-1],[e.armR,1]].forEach(([a,s])=>{const ua=Bn(),fa=Bn(),hb=Bn();add0(a,ua);fa.position.set(s*(J.el[0]-J.sh[0]),J.el[1]-J.sh[1],0);ua.add(fa);hb.position.set(s*(J.wr[0]-J.el[0]),J.wr[1]-J.el[1],0);fa.add(hb);bones.push(ua,fa,hb)});
 [[e.legL,-1],[e.legR,1]].forEach(([l,s])=>{const th=Bn(),sh=Bn(),ft=Bn();add0(l,th);sh.position.set(s*(J.kn[0]-J.hip[0]),J.kn[1]-J.hip[1],0);th.add(sh);ft.position.set(s*(J.an[0]-J.kn[0]),J.an[1]-J.kn[1],0);sh.add(ft);bones.push(th,sh,ft)});
 const skel=new THREE.Skeleton(bones),vars=o.dress?['dress','plain']:o.pants?['pants']:['plain'],K={bones,el:[-.12,-.12],kn:[0,0],m:{}};
 mats.forEach(m=>{if(m&&!m.skinning){m.skinning=true;m.needsUpdate=true}});
 e.g.updateMatrixWorld(true);
 vars.forEach(v=>{const sm=new THREE.SkinnedMesh(kbGeo(v,1),mats);sm.userData.kv=v;sm.userData.lo=1;sm.castShadow=false;sm.receiveShadow=true;sm.frustumCulled=false;e.g.add(sm);sm.updateMatrixWorld(true);sm.bind(skel);K.m[v]=sm});
 if(o.dress){K.dress=K.m.dress;K.plain=K.m.plain;K.skirt=GH[0];K.plain.visible=false}
 /* wrappers so items held in the hand follow the forearm, and socks/shoes items follow the shin */
 const wa=[[e.armL,bones[3],-1],[e.armR,bones[6],1]].map(([a,hb,s])=>{const w=new THREE.Group();w.position.set(-s*(J.wr[0]-J.sh[0]),-(J.wr[1]-J.sh[1]),0);hb.add(w);return{a,w,n:a.children.length}});
 const wl=[[e.legL,bones[8],-1],[e.legR,bones[11],1]].map(([l,sb,s])=>{const w=new THREE.Group();w.position.set(-s*(J.kn[0]-J.hip[0]),-(J.kn[1]-J.hip[1]),0);sb.add(w);return{a:l,w,n:l.children.length}});
 K.wa=wa;K.wl=wl;e.kb=K}
const _kbv=new THREE.Vector3();
const KBE={tbr:[-.1,-.1],bridge:[-.15,-.15],hold:[-1.25,-1.25],swim:[-.45,-.45],paddle:[-.6,-.6],ride:[-.7,-.7],gun:[-.25,-.5],squirt:[-.25,-.3],recv:[-.5,-.5],give:[-.12,-.45],sing:[-.35,-1.15],clap:[-1.0,-1.0],hug:[-.95,-.95],arms:[-.35,-.35],hand:[-.12,-.05],wave:[-.15,-.55],wave2:[-.35,-.35],type:[-1.0,-1.0],pray:[-1.25,-1.25],sip:[-.15,-1.6],press:[-.12,-.35],holdL:[-.12,-.2],holdR:[-.2,-.12],lift:[-.3,-.3],head:[-1.5,-1.5],shoulders:[-1.7,-1.7],face:[-1.4,-1.4],knees:[-.25,-.25],toes:[-.05,-.05],hands:[-.05,-.05],jump:[-.1,-.1],squat:[-.6,-.6],turn:[-.05,-.05],plane:[-.05,-.05],kick:[-.4,-.4],b5:[-.7,-.7],b2:[-.15,-.15],b1:[-.9,-.9],bplie:[-.9,-.9],barab:[-.15,-.15],curtsy:[-.3,-.3],carry:[-1.5,-.9],khug:[-.95,-.95],punch:[-.5,-.5],guard:[-1.7,-1.7],fkick:[-1.7,-1.7]};
function kbPose(e,dt){const K=e.kb,b=K.bones,k=Math.min(1,dt*10);
 if(K.dress){const dv=K.skirt.visible;K.dress.visible=dv;K.plain.visible=!dv}
 {const wp=e.g.getWorldPosition(_kbv),d=wp.distanceTo(cam.position)/(e.g.scale.x||1),lo=d>(e===girl?11:7)?1:0;for(const v in K.m){const sm=K.m[v];if(sm.userData.lo!==lo){sm.userData.lo=lo;sm.geometry=kbGeo(v,lo)}sm.castShadow=!lo&&e===girl}}
 K.wa.forEach(r=>{const c=r.a.children;for(let i=c.length-1;i>=r.n;i--){const o=c[i];if(!o.isBone&&o.position.y<-.33)r.w.add(o)}});
 K.wl.forEach(r=>{const c=r.a.children;for(let i=c.length-1;i>=r.n;i--){const o=c[i];if(!o.isBone&&o.position.y<-.24)r.w.add(o)}});
 let t=(e.pose&&KBE[e.pose])||(e.sit?[-.4,-.4]:e.mv?[-.28-.14*Math.sin(e.walkT),-.28+.14*Math.sin(e.walkT)]:[-.12,-.12]);if(e.xOn)t=[0,0];if(e.mic&&!e.xOn)t=[0,t[1]];
 K.el[0]+=(t[0]-K.el[0])*k;K.el[1]+=(t[1]-K.el[1])*k;b[2].rotation.x=K.el[0];b[5].rotation.x=K.el[1];b[3].rotation.x=K.el[0]*.25;b[6].rotation.x=K.el[1]*.25;
 const pal=!!(e.xPal&&e.xPal.visible);b[3].scale.setScalar(pal?.01:1);b[6].scale.setScalar(pal?.01:1);
 const wk=e.mv&&!e.sit?1:0;let kl=e.sit?.95:wk*Math.max(0,Math.sin(e.walkT+1.4))*.6,kr=e.sit?.95:wk*Math.max(0,Math.sin(e.walkT+1.4+Math.PI))*.6;
 if(e.pose==='squat'||e.pose==='khug'){kl=kr=2.0}else if(e.pose==='bplie'){kl=kr=1.0}else if(e.pose==='curtsy'){kl=.7;kr=.9}else if(e.pose==='barab'){kl=kr=0}else if(e.pose==='jump'){kl=kr=.6}else if(e.pose==='lknee')kl=1.4;else if(e.pose==='rknee')kr=1.4;else if(e.pose==='kick'){kl=Math.max(0,Math.sin(time*20))*.8;kr=Math.max(0,-Math.sin(time*20))*.8}
 if(e.lift){const a=e.lift.a*1.4;if(e.lift.leg==='L')kl=a;else kr=a}
 K.kn[0]+=(kl-K.kn[0])*k;K.kn[1]+=(kr-K.kn[1])*k;b[8].rotation.x=K.kn[0];b[11].rotation.x=K.kn[1];b[9].rotation.x=-K.kn[0]*.45;b[12].rotation.x=-K.kn[1]*.45}
function kid(o){
 const s=o.s||1,g=new THREE.Group(),body=new THREE.Group();g.add(body);
 const sk=M(o.skin||0xffd9bf,{roughness:.5}),hm=M(o.hair||0x222222,{roughness:.42,map:KTX.hair,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),tm=M(o.top||0xffffff,{roughness:.9,map:KTX.fab}),tr=M(o.trim||0x2e9b4f),wh=M(0xffffff,{roughness:.3}),dk=M(0x140e0a,{roughness:.25}),cy=(a,b,l)=>new THREE._C0(a,b,l,16),
 sp=(r,m,x,y,z,p,a,b,c)=>{const q=add(r>=.2?new THREE._S0(r,24,16):r>=.08?new THREE._S0(r,14,10):new THREE._S0(r,8,6),m,x,y,z,p||body);q.scale.set(a||1,b||1,c||1);return q};
 const GH=[];if(o.dress){GH.push(add(cy(.2,.46,.66),tm,0,.86,0,body),add(cy(.47,.47,.05),tr,0,.55,0,body))}else GH.push(add(cy(.27,.32,.7),tm,0,.9,0,body));
 GH.push(add(cy(.1,.11,.14),sk,0,1.24,0,body));add(new THREE.TorusGeometry(.16,.04,8,16),tr,0,1.21,0,body).rotation.x=Math.PI/2;add(B(.07,.24,.03),tr,0,1.03,.29,body);
 const h0=body.children.length;sp(.31,sk,0,1.5,0,body,1,1.03,.98);sp(.028,sk,0,1.44,.31);
 add(new THREE.TorusGeometry(.055,.011,6,10,Math.PI),M(0xc0504d),0,1.385,.295,body).rotation.z=Math.PI;
 [-1,1].forEach(x=>{sp(.06,sk,x*.3,1.48,0);sp(.062,wh,x*.115,1.5,.27,body,1,1.15,.5);sp(.044,M(o.eye||0x5b3a24,{roughness:.3}),x*.115,1.495,.297,body,1,1.1,.45);sp(.026,dk,x*.115,1.495,.318,body,1,1.1,.4);sp(.012,wh,x*.105,1.52,.335);sp(.006,wh,x*.125,1.48,.334);if(o.dress||o.girl||o.bun)[0,1].forEach(j=>add(B(.034,.011,.01),dk,x*(.158+j*.02),1.548-j*.022,.288,body).rotation.z=x*(.5+j*.45));add(B(.09,.018,.02),hm,x*.115,1.61,.29,body).rotation.z=-x*.15;sp(.05,M(0xff9b9b),x*.19,1.41,.24,body,1,.7,.4)});
 add(new THREE.SphereGeometry(o.short?.325:.335,20,14,0,TAU,0,Math.PI*(o.short?.5:.58)),hm,0,1.52,-.02,body);if(!o.short)sp(.3,hm,0,1.4,-.14,body,1,1,.8);else{sp(.312,hm,0,1.47,-.07,body,1.0,.92,.92);sp(.2,hm,0,1.33,-.17,body,1.25,.6,.8)}
 for(let i=-2;i<=2;i++)sp(.085,hm,i*.1,1.7-Math.abs(i)*.025,.25);
 if(o.girl)[-1,1].forEach(x=>{sp(.12,hm,x*.36,1.4,-.02);add(new THREE.ConeGeometry(.09,.32,8),hm,x*.4,1.16,-.02,body).rotation.z=x*.12;sp(.085,(o._bw=o._bw||M(o.bow||0xff4d88)),x*.36,1.6,-.02,body,1,.8,.7)});else if(!o.bun&&!o.short&&!o.pony&&!o.long)sp(.13,hm,0,1.82,.04);
 if(o.long){sp(.3,hm,0,1.3,-.13,body,1.06,1.7,.72);add(B(.56,.8,.14),hm,0,.98,-.2,body);[-1,1].forEach(x=>{add(B(.12,.62,.12),hm,x*.27,1.15,.08,body)});if(o.clips)add(B(.12,.04,.04),M(o.clips),.22,1.72,.16,body)}
 if(o.pony){sp(.13,hm,0,1.6,-.31);add(new THREE.ConeGeometry(.1,.42,8),hm,0,1.34,-.37,body).rotation.x=Math.PI-.25;add(new THREE.TorusGeometry(.07,.025,6,12),M(o.bow||0xff4d88),0,1.6,-.33,body).rotation.x=.3}
 if(o.band)add(new THREE.TorusGeometry(.345,.028,6,18,Math.PI),M(o.band),0,1.53,-.02,body).rotation.x=-.3;
 if(o.clips)[-1,1].forEach(x=>add(B(.1,.035,.04),M(o.clips),x*.2,1.73,.17,body).rotation.z=x*.5);
 if(o.bunbow)sp(.07,M(o.bunbow),0,1.86,-.12,body,1.6,.7,.6);
 if(o.bun)sp(.14,hm,0,1.8,-.2);
 if(o.glasses){const gl=M(0x333333);[-1,1].forEach(x=>add(new THREE.TorusGeometry(.075,.012,6,14),gl,x*.115,1.5,.3,body));add(B(.07,.012,.012),gl,0,1.51,.31,body)}
 if(o.age>1){const dsk=M(0xc79d82,{roughness:.8});[-1,1].forEach(x=>{sp(.045,dsk,x*.115,1.435,.29,body,1.4,.4,.5);sp(.075,sk,x*.2,1.34,.22,body,1,1.1,.8);add(B(.012,.14,.01),dsk,x*.12,1.36,.31,body).rotation.z=x*.4;add(B(.07,.008,.01),dsk,x*.21,1.5,.27,body).rotation.z=x*.35;add(B(.06,.008,.01),dsk,x*.21,1.47,.28,body).rotation.z=-x*.3;sp(.012,M(0xa77c5f),x*.22,1.4,.25,body)});[1.62,1.65,1.68].forEach((y,i)=>add(B(.2-i*.03,.007,.01),dsk,0,y,.285-i*.012,body));add(B(.1,.008,.01),dsk,0,1.31,.3,body)}
 if(o.age)[-1,1].forEach(x=>{add(B(.012,.1,.01),M(0xc59b84),x*.085,1.4,.305,body).rotation.z=x*.35;add(B(.05,.01,.01),M(0xc59b84),x*.2,1.52,.27,body).rotation.z=x*.3});
 if(o.cap){const cm=M(o.cap);add(new THREE.CylinderGeometry(.33,.33,.16,14),cm,0,1.76,0,body);add(B(.4,.04,.3),cm,0,1.7,.3,body)}
 const mk=(x,y,par)=>{const p=new THREE.Group();p.position.set(x,y,0);par.add(p);return p};
 const arm=x=>{const a=mk(x*.42,1.13,body);add(cy(.078,.072,.22),tm,0,-.11,0,a);add(cy(.055,.05,.28),sk,0,-.36,0,a);sp(.065,sk,0,-.52,0,a);return a};
 GH.push(sp(.085,tm,-.41,1.14),sp(.085,tm,.41,1.14));
 const armL=arm(-1),armR=arm(1);GH.push(...armL.children,...armR.children);
 if(o.cane){const cm=M(0x6b4a2a,{roughness:.6});add(cy(.022,.022,.68),cm,0,-.86,.07,armR);sp(.04,cm,0,-.52,.07,armR);add(cy(.03,.03,.02),M(0x222222),0,-1.2,.07,armR)}
 const leg=x=>{const l=mk(x*.14,.5,g);if(o.pants)add(cy(.085,.08,.44),M(o.pants),0,-.22,0,l);else{add(cy(.07,.065,.3),sk,0,-.15,0,l);add(cy(.078,.078,.2),wh,0,-.36,0,l)}add(new THREE.SphereGeometry(.1,18,12),M(o.shoe||0x26303f,{roughness:.45}),0,-.5,.05,l).scale.set(.95,.55,1.6);add(new THREE.SphereGeometry(.1,18,8,0,TAU,Math.PI*.5,Math.PI*.5),M(0xf4f1ea,{roughness:.8}),0,-.5,.05,l).scale.set(1.0,.32,1.66);return l};
 const legL=leg(-1),legR=leg(1);GH.push(...legL.children,...legR.children);
 let bagParts=[];if(o.bag){const _n0=body.children.length,bm=M(o.bag,{roughness:.6}),pk=M((o.bag>>1)&0x7f7f7f,{roughness:.6});add(B(.46,.6,.24),bm,0,1.02,-.36,body);sp(.23,bm,0,1.32,-.36,body,1,.35,.55);add(B(.34,.26,.07),pk,0,.86,-.5,body);add(B(.3,.012,.01),wh,0,1.25,-.49,body);add(B(.14,.08,.02),wh,0,.86,-.54,body);[-1,1].forEach(x=>add(B(.06,.44,.03),bm,x*.14,1.05,.3,body));add(cy(.055,.055,.28),M(0x3d8bfd),.28,.8,-.36,body);sp(.035,M(0xffc93c),-.26,.75,-.42);bagParts=body.children.slice(_n0)}
 {const bs=new THREE.Mesh(KSH.g,KSH.m);bs.position.y=.015;bs.renderOrder=-1;g.add(bs)}
 g.scale.setScalar(s);{const bl=new THREE.Mesh(KTX.blobG,KTX.blobM);bl.position.y=.02;bl.renderOrder=-1;bl.castShadow=bl.receiveShadow=false;g.add(bl);o._bl=bl}
 const E_={bowM:o._bw||null,blob:o._bl,bagParts,g,body,armL,armR,legL,legR,pos:g.position,yaw:0,mv:0,walkT:0,lean:0,sit:false,pose:null,waveT:0,wp:null,h0};
 if(KBON)try{kbMake(o,E_,GH,[sk,tm,tr,o.pants?M(o.pants,{roughness:.85}):tm,M(0xffffff,{roughness:.8}),legL.children[o.pants?1:2].material])}catch(err){console.log('KB',err)}
 if(!o.noHQ)try{kidHQ(E_,o);kidMerge(E_)}catch(err){console.log('HQ',err)}
 kidUnskin(E_);
 return E_;
}
function hqRim(m,col,str){if(!m||!m.isMeshStandardMaterial||m.userData.rim)return;m.userData.rim=1;m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <output_fragment>','{float rimF=1.0-clamp(dot(normalize(normal),normalize(vViewPosition)),0.0,1.0);outgoingLight+=vec3('+col.map(v=>v.toFixed(3)).join(',')+')*pow(rimF,2.6)*'+str.toFixed(2)+';}\n#include <output_fragment>')};m.needsUpdate=true}
function kidHQ(e,o){const kidC=(o.s||1)<1.25,fem=o.dress||o.girl||o.bun||o.long||o.pony;const b=e.body,ps=(r,m,x,y,z,a,bb,c,par)=>{const q=add(new THREE.SphereGeometry(r,16,12),m,x,y,z,par||b);q.scale.set(a||1,bb||1,c||1);q.castShadow=false;return q};
 const skin=M(o.skin||0xffd9bf,{roughness:.5}),hairM=M(o.hair||0x222222,{roughness:.38,map:KTX.hair,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),dk=M(0x2a1a12,{roughness:.4}),wh=M(0xffffff,{roughness:.35}),gr=M(o.trim||0x2e9b4f,{roughness:.6});
 /* eyelids for blinking + upper lash line */
 e.lids=[-1,1].map(x=>{const l=ps(.068,skin,x*.115,1.5,.272,1,1.2,.58);l.visible=false;return l});
 [-1,1].forEach(x=>{const t=add(new THREE.TorusGeometry(.064,.0085,6,14,Math.PI),dk,x*.115,1.5,.302,b);t.scale.set(1,1.12,1);t.rotation.x=-.12;t.castShadow=false;
  if(fem)[0,1,2].forEach(j=>{const l=add(B(.03,.008,.006),dk,x*(.15+j*.016),1.565-j*.018,.296,b);l.rotation.z=x*(.35+j*.4);l.castShadow=false})});
 /* talking mouth */
 e.mo=ps(.04,M(0xb8394a,{roughness:.5}),0,1.387,.3,1,.15,.35);e.mo.visible=false;{const tg=ps(.022,M(0xff8fa3,{roughness:.6}),0,-.25,.35,1,1,1,e.mo);tg.scale.set(1,1,1)}
 /* finer fringe locks and a soft hair shine */
if(kidC&&!o.short||o.girl)for(let i=0;i<9;i++){const x=-.24+i*.06,lk=add(new THREE.ConeGeometry(.042,.17,8),hairM,x,1.63-Math.abs(x)*.25,.275-Math.abs(x)*.18,b);lk.rotation.set(Math.PI-.25,0,x*1.6);lk.castShadow=false}
if(kidC&&!o.short)[-1,1].forEach(x=>{const lk=add(new THREE.ConeGeometry(.05,.3,8),hairM,x*.3,1.4,.13,b);lk.rotation.set(Math.PI-.12,0,x*-.18);lk.castShadow=false});
 
 if(o.girl)[-1,1].forEach(x=>{const t=add(new THREE.TorusGeometry(.06,.022,6,12),gr,x*.37,1.36,-.02,b);t.rotation.z=x*.15;t.castShadow=false});
 /* uniform: peter-pan collar, buttons, school badge, skirt pleats, socks frill */
 if(o.dress&&kidC){const U=new THREE.Group();b.add(U);e.uniG=U;const col=M(0xffffff,{roughness:.6});[-1,1].forEach(x=>{const c=ps(.085,col,x*.075,1.165,.13,1.05,.32,.75,U);c.rotation.z=x*.35;const e2=add(new THREE.TorusGeometry(.083,.008,6,16),gr,x*.075,1.165,.13,U);e2.scale.set(1.05,.32,.75);e2.rotation.set(Math.PI/2,0,x*.35);e2.castShadow=false});
  [.98,.88,.78].forEach(y=>ps(.014,M(0xf2f2ee,{roughness:.3}),0,y,.185-(1-y)*.05,1,1,1,U));
  {const tx=window.BADGE_TX||(window.BADGE_TX=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#2e9b4f';g.beginPath();g.moveTo(32,4);g.lineTo(58,14);g.lineTo(54,40);g.quadraticCurveTo(32,62,10,40);g.lineTo(6,14);g.closePath();g.fill();g.fillStyle='#ffd23f';g.font='bold 22px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('GH',32,30);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})());const bd=new THREE.Mesh(new THREE.PlaneGeometry(.075,.075),new THREE.MeshStandardMaterial({map:tx,transparent:true,roughness:.6}));bd.position.set(-.1,1.03,.19);bd.rotation.y=-.3;U.add(bd)}
  const pm=M(0xdfe6e0,{roughness:.8});for(let i=0;i<16;i++){const a=i/16*TAU,y0=.56,y1=.84,r0=.432,r1=.235,p0=V(Math.sin(a)*r0,y0,Math.cos(a)*r0*.82+.0),p1=V(Math.sin(a)*r1,y1,Math.cos(a)*r1*.82);const ln=rod(p0,p1,.006,pm,U);ln.castShadow=false}}
 if(kidC&&!o.pants)[e.legL,e.legR].forEach(l=>{const f=add(new THREE.TorusGeometry(.085,.016,6,14),M(0xffffff,{roughness:.6}),0,-.27,0,l);f.rotation.x=Math.PI/2;f.castShadow=false});
 /* soft rim light on every material of this character */
 e.g.traverse(m=>{if(m.isMesh||m.isSkinnedMesh){const ms=Array.isArray(m.material)?m.material:[m.material];ms.forEach(x=>hqRim(x,[1.0,.95,.88],.32))}});
 e.hq=1;e.bk=2+Math.random()*3}
function kmKey(m){return [m.type,m.color&&m.color.getHex(),m.roughness,m.metalness,m.map&&m.map.uuid,m.transparent,m.opacity,m.emissive&&m.emissive.getHex(),m.side].join('|')}
function kidMerge(e,b0,i0){const b=b0||e.body,keep=new Set([...(e.lids||[]),e.mo,...(e.bagParts||[])]),grp=new Map(),rm=[];b.updateMatrix();
 for(let i=(i0===undefined?e.h0:i0);i<b.children.length;i++){const c=b.children[i];if(!c.isMesh||c.isSkinnedMesh||keep.has(c)||c.children.length||Array.isArray(c.material)||!c.geometry.attributes||!c.geometry.attributes.position||c.geometry===KB_EMPTY)continue;
  const k=kmKey(c.material);if(!grp.has(k))grp.set(k,{m:c.material,a:[],cs:false});const G=grp.get(k);c.updateMatrix();let gg=c.geometry.index?c.geometry.toNonIndexed():c.geometry.clone();gg.applyMatrix4(c.matrix);G.a.push(gg);G.cs=G.cs||(c.castShadow&&c.geometry.type==='SphereGeometry'&&c.geometry.parameters.radius>.25);rm.push(c)}
 rm.forEach(c=>b.remove(c));
 grp.forEach((G,k)=>{let n=0;G.a.forEach(g=>n+=g.attributes.position.count);const P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2);let o=0;
  G.a.forEach(g=>{const p=g.attributes.position,nm=g.attributes.normal,uv=g.attributes.uv;P.set(p.array,o*3);if(nm)N.set(nm.array,o*3);if(uv)U.set(uv.array,o*2);o+=p.count;g.dispose()});
  const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(P,3));bg.setAttribute('normal',new THREE.BufferAttribute(N,3));bg.setAttribute('uv',new THREE.BufferAttribute(U,2));bg.computeBoundingSphere();
  let mm=G.m;if(mm.skinning){mm=mm.clone();mm.skinning=false;mm.color=G.m.color;if(G.m.emissive)mm.emissive=G.m.emissive;if(G.m.onBeforeCompile)mm.onBeforeCompile=G.m.onBeforeCompile;mm.userData=Object.assign({},G.m.userData)}const ms=new THREE.Mesh(bg,mm);ms.castShadow=G.cs;ms.receiveShadow=true;ms.userData.hd=1;b.add(ms)});if(!b0&&e.uniG)kidMerge(e,e.uniG,0)}
function kidUnskin(e){const cache=new Map();const fix=m=>{if(!m||!m.skinning)return m;let c=cache.get(m);if(!c){c=m.clone();c.skinning=false;c.color=m.color;if(m.emissive)c.emissive=m.emissive;c.userData.src=m;if(m.onBeforeCompile)c.onBeforeCompile=m.onBeforeCompile;c.userData=Object.assign({},m.userData);cache.set(m,c)}return c};
 e.g.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh)return;o.material=Array.isArray(o.material)?o.material.map(fix):fix(o.material)});e.unskin=fix}
function hqTick(e,dt){e.bk-=dt;const on=e.sleep||(e.bk<0&&e.bk>-.14);e.lids.forEach(l=>{l.visible=on;l.scale.z=e.sleep?1.2:.58});if(e.bk<-.14)e.bk=2.2+Math.random()*3.5;
 const talk=typeof sayE!=='undefined'&&sayE===e&&sayT>0&&!e.sit===!e.sit;e.mph=(e.mph||0)+dt*14;const tgt=talk?.35+Math.abs(Math.sin(e.mph))*.75:0;e.mo.userData.k=(e.mo.userData.k||0)+(tgt-(e.mo.userData.k||0))*Math.min(1,dt*18);const k=e.mo.userData.k;e.mo.visible=k>.05;e.mo.scale.set(1,.15+k*.75,.35)}
function anim(e,dt,t){
 if(e.blob)e.blob.visible=!e.sit&&!e.noBlob;
 if(e.waveT>0){e.waveT-=dt;e.pose=e.waveT>0?(e.w2?'wave2':'wave'):null;if(e.waveT<=0)e.w2=0}
 const d=((e.yaw-e.g.rotation.y+Math.PI)%TAU+TAU)%TAU-Math.PI;e.g.rotation.y+=d*Math.min(1,dt*10);
 e.walkT+=dt*(e.mv?9*(e.ws||1):0);const sw=e.mv?Math.sin(e.walkT)*.7:0;
 let lx=sw,ax=-sw*.8,axR=sw*.8,azL=.12,azR=-.12;
 if(e.sit){lx=-1.25;ax=axR=-.3}
 if(e.pose==='wave'){azR=-(2.5+Math.sin(t*10)*.35);axR=0}
 if(e.pose==='wave2'){const w=Math.sin(t*8+(e.wph||0));azR=-(2.7+w*.55);axR=0;azL=2.7-w*.55;ax=0;e.body.rotation.z=w*.06}
 if(e.pose==='press'){axR=-1.45;azR=-.12}if(e.pose==='pray'){ax=axR=-1.3;azL=.6;azR=-.6}if(e.pose==='clap'){const w=Math.abs(Math.sin(t*9+(e.wph||0)));ax=axR=-1.35;azL=.1+w*.5;azR=-azL}if(e.pose==='sip'){axR=-2.1;azR=-.25}
 if(e.pose==='give'){axR=-1.35;azR=-.1}
 if(e.pose==='head'){ax=axR=-.25;azL=2.45;azR=-2.45}if(e.pose==='shoulders'){ax=axR=-2.55;azL=.4;azR=-.4}if(e.pose==='knees'){ax=axR=-.85;azL=.15;azR=-.15}if(e.pose==='toes'){ax=axR=-1.25;azL=.1;azR=-.1}if(e.pose==='face'){ax=axR=-2.15;azL=.55;azR=-.55}
 if(e.pose==='hands'){ax=axR=0;azL=-2.85;azR=2.85}if(e.pose==='lknee'||e.pose==='rknee'){azL=-.85;azR=.85;ax=axR=0}if(e.pose==='jump'){azL=-2.4;azR=2.4;ax=axR=0}if(e.pose==='squat'){ax=axR=-1.5;azL=.1;azR=-.1}
 if(e.pose==='turn'){ax=axR=0;azL=-1.25;azR=1.25}if(e.pose==='plane'){const w=Math.sin(t*4)*.18;ax=axR=-.15;azL=-1.5+w;azR=1.5+w}if(e.pose==='lift'){const u=e.liftU||0;ax=axR=lp(-1.85,-2.75,u);azL=.18;azR=-.18}if(e.pose==='hand'){e.hr=Math.min(1,(e.hr||0)+dt*2.2);const u=e.hr*e.hr*(3-2*e.hr);azR=lp(-.12,2.75,u)+Math.sin(t*3+(e.wph||0))*.06*u;axR=-.1*u}else e.hr=0;e.armR.scale.y+=((e.pose==='hand'?1.15:1)-e.armR.scale.y)*Math.min(1,dt*8);
 if(e.pose==='recv'){ax=axR=-1.0}if(e.pose==='arms'){ax=axR=-1.05;azL=-.75;azR=.75}if(e.pose==='hug'){ax=axR=-1.25;azL=.45;azR=-.45}
 if(e.pose==='type'){const w=Math.sin(t*13+(e.wph||0));ax=-1.25+w*.08;axR=-1.25-w*.08;e.body.rotation.z=0}
 if(e.pose==='sing'){axR=-2.2;azR=-.55;ax=-.3+Math.sin(t*3)*.25;azL=.3}
 if(e.mic&&(!e.pose||e.pose==='wave'||e.pose==='hand'||e.pose==='give'||e.pose==='press'||e.pose==='sip'||e.pose==='holdR')){ax=-1.85+(e.mv?Math.sin(e.walkT)*.06:0);azL=.58}
 if(e.pose==='b5'){ax=axR=-.35;azL=-2.55;azR=2.55}if(e.pose==='b2'||e.pose==='barab'){ax=axR=-.25;azL=-1.35;azR=1.35}if(e.pose==='b1'||e.pose==='bplie'){ax=axR=-.55;azL=.3;azR=-.3}if(e.pose==='curtsy'){ax=axR=-.25;azL=-.55;azR=.55}if(e.pose==='carry'){ax=-1.2;azL=.55;axR=-.95;azR=-.6}if(e.pose==='khug'){ax=axR=-1.3;azL=.5;azR=-.5}if(e.pose==='punch'){const w=Math.sin(t*6+(e.wph||0))>0;ax=w?-1.55:-1.15;axR=w?-1.15:-1.55;azL=w?.05:.45;azR=w?-.45:-.05}if(e.pose==='guard'||e.pose==='fkick'){ax=axR=-1.25;azL=.45;azR=-.45}
 if(e.pose==='kick'){const w=Math.sin(t*20);lx=w;ax=-1.7+Math.sin(t*17)*.9;axR=-1.7-Math.sin(t*17)*.9;azL=.5;azR=-.5}if(e.pose==='holdL'){axR=0;azR=-.3}if(e.pose==='holdR'){ax=0;azL=.3}if(e.pose==='hold'){ax=axR=-1.2;azL=.78;azR=-.78}if(e.pose==='bridge'){ax=axR=-2.55;azL=.05;azR=-.05}if(e.pose==='tbr'){ax=axR=1.75;azL=.15;azR=-.15}if(e.pose==='block'){const w=Math.sin(t*3+(e.wph||0))>0;ax=w?-2.7:-.9;axR=w?-.9:-2.7;azL=w?-.35:.4;azR=w?-.4:.35}if(e.pose==='swim'){const w=Math.sin(t*5+(e.wph||0));ax=-2.0+w*.5;axR=-2.0-w*.5;azL=.35;azR=-.35}if(e.pose==='paddle'){const w=Math.sin(t*4+(e.wph||0));ax=-.9+w*.35;axR=-.9-w*.35;azL=.55;azR=-.55}if(e.pose==='ride'){ax=axR=-1.05;azL=.28;azR=-.28}if(e.pose==='gun'){axR=-1.3;azR=-.05;ax=-.6;azL=.3}if(e.pose==='squirt'){axR=-1.5;azR=0;ax=-1.35;azL=.45}
 e.legL.rotation.x=lx;e.legR.rotation.x=e.sit?lx:-lx;if(e.kick&&!e.sit){const k_=Math.sin(t*9+(e.wph||0))*.42;e.legL.rotation.x=k_+.2;e.legR.rotation.x=-k_+.2}if(e.pose==='lknee')e.legL.rotation.x=-1.45;if(e.pose==='rknee')e.legR.rotation.x=-1.45;if(e.pose==='squat'||e.pose==='khug'){e.legL.rotation.x=e.legR.rotation.x=-1.3}if(e.pose==='tbr'){e.legL.rotation.x=e.legR.rotation.x=1.45}if(e.pose==='barab'){e.legR.rotation.x=.95;e.legL.rotation.x=0}if(e.pose==='curtsy'){e.legR.rotation.x=.4;e.legL.rotation.x=-.3}if(e.pose==='bplie'){e.legL.rotation.x=e.legR.rotation.x=-.5}if(e.scoot){e.legL.rotation.x=0;e.legR.rotation.x=e.kickA||0}if(e.bike){const pa=e.pedA||0;e.legL.rotation.x=-1.05+Math.sin(pa)*.42;e.legR.rotation.x=-1.05-Math.sin(pa)*.42}if(e.pose==='fkick'){const k=Math.max(0,Math.sin(t*4.5+(e.wph||0)));e.legR.rotation.x=-1.55*k;e.legL.rotation.x=.12*k}if(e.pose==='punch'||e.pose==='guard'){e.legL.rotation.x=-.35;e.legR.rotation.x=.3}if(e.pose==='jump'){e.legL.rotation.x=-.35;e.legR.rotation.x=-.35}{const jy=e.pose==='jump'?Math.abs(Math.sin(t*5.5+(e.wph||0)))*.55:(e.pose==='squat'||e.pose==='khug')?-.33:e.pose==='curtsy'?-.1:e.pose==='bplie'?-.15:0;e.legL.position.y=e.legR.position.y=.5+jy;e.jy=jy}e.armL.rotation.x=ax;e.armR.rotation.x=axR;e.armL.rotation.z=azL;e.armR.rotation.z=azR;
 if(e.pose!=='wave2')e.body.rotation.z*=.8;e.body.position.y=(e.pose==='jump'||e.pose==='squat')?e.jy:e.pose==='wave2'?Math.abs(Math.sin(t*8))*.05:e.pose==='clap'?Math.abs(Math.sin(t*7+(e.wph||0)))*.07:(e.mv&&!e.sit?Math.abs(Math.sin(e.walkT))*.06:0);e.body.rotation.x+=(e.lean-e.body.rotation.x)*Math.min(1,dt*10);e.body.scale.y+=((e.sq||1)-e.body.scale.y)*Math.min(1,dt*8);
}
const girl=kid({dress:1,top:0xffffff,hair:0x3b2416,girl:1,bow:0x2e9b4f,bag:0x2e9b4f,trim:0x2e9b4f});
let girlGo=false,warnCd=0,ret=false,thanked={t:0,h:0},gWait=false,walkSt=0,giftDone=false,giftS=0,giftT=0,phase='title',T=0,wt=0,busState=0,byeDone=false,byeT=0,boardE=null,bt=0,bw=0,toastT=0,toastTxt='',near=null,started=false,time=0,yaw=-Math.PI/2,pitch=.16,dist=2.1,driveT=0,vel=0,rs=0,atA=0,exitList=[],hi=0,hw=0,schoolPlaced=false,cInit=false;
let tk=null,lastTalk='',sayE=null,sayT=0;
return {create:kid,animate(e,dt,t){anim(e,dt,t);if(e.kb)kbPose(e,dt);if(e.hq)hqTick(e,dt);}};
}