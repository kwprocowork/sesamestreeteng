// Ported from Schoolbus v223. See docs/SCHOOLBUS_ASSET_MAP.json.
import * as Engine from '../assets/three.module.js';
export const SchoolTHREE={...Engine};
const THREE=SchoolTHREE;
(function(){const S0=THREE.SphereGeometry,C0=THREE.CylinderGeometry,K0=THREE.ConeGeometry,T0=THREE.TorusGeometry,Ci=THREE.CircleGeometry,up=(n,d,mx)=>{n=n===undefined?d:n;return n<=14?Math.min(mx,Math.round(n*1.5)):n};
 THREE._S0=S0;THREE._C0=C0;THREE._T0=T0;THREE.SphereGeometry=class extends S0{constructor(r,w,h,...a){super(r,up(w,32,24),up(h,16,18),...a)}};
 THREE.CylinderGeometry=class extends C0{constructor(t,b,h,rs,...a){super(t,b,h,up(rs,8,24),...a)}};
 THREE.ConeGeometry=class extends K0{constructor(r,h,rs,...a){super(r,h,up(rs,8,20),...a)}};
 THREE.TorusGeometry=class extends T0{constructor(r,t,rs,ts,...a){super(r,t,up(rs,8,12),up(ts,6,24),...a)}};
 THREE.CircleGeometry=class extends Ci{constructor(r,sg,...a){super(r,up(sg,8,32),...a)}}})();
let S;const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75},o||{}));
function add(g,m,x,y,z,p){const o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=o.receiveShadow=true;(p||S).add(o);return o}
function rod(a,b,r,mat,p){const d=b.clone().sub(a),L=d.length(),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,12),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());m.castShadow=true;(p||S).add(m);return m}
const BXC=new Map(),B=(w,h,d)=>{const key=w.toFixed(3)+','+h.toFixed(3)+','+d.toFixed(3);let g=BXC.get(key);if(g)return g;
 const r=Math.min(.07,Math.min(w,h,d)*.22);if(r<.006||Math.max(w,h,d)>60){g=new THREE.BoxGeometry(w,h,d);BXC.set(key,g);return g}
 g=new THREE.BoxGeometry(w,h,d,3,3,3);const P=g.attributes.position,N=g.attributes.normal,Hh=[w/2,h/2,d/2],v=[0,0,0],c=[0,0,0];
 for(let i=0;i<P.count;i++){v[0]=P.getX(i);v[1]=P.getY(i);v[2]=P.getZ(i);for(let a=0;a<3;a++){const t=v[a]/Hh[a];if(Math.abs(Math.abs(t)-1/3)<.01)v[a]=Math.sign(t)*(Hh[a]-r);c[a]=Math.max(-(Hh[a]-r),Math.min(Hh[a]-r,v[a]))}
  const dx=v[0]-c[0],dy=v[1]-c[1],dz=v[2]-c[2],l=Math.hypot(dx,dy,dz);if(l>1e-6){P.setXYZ(i,c[0]+dx/l*r,c[1]+dy/l*r,c[2]+dz/l*r);N.setXYZ(i,dx/l,dy/l,dz/l)}else P.setXYZ(i,v[0],v[1],v[2])}
 P.needsUpdate=true;N.needsUpdate=true;BXC.set(key,g);return g};
export {B as schoolBox,M as schoolMaterial,rod as schoolRod};
export const SCHOOL_RENDER={fov:55,near:.1,far:600,exposureOutdoor:.97,exposureIndoor:.94,pixelRatioCap:2,fogNear:120,fogFar:340,zoomFactor:1.18,pitchReduction:7*Math.PI/180,followDamping:6};
