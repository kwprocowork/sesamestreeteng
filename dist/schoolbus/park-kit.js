// Adapted from the v223 traffic-park bench/tree/lamp and ballet-school planter builders.
import {SchoolTHREE as THREE,schoolBox as B,schoolMaterial as M} from './core.js?v=74a';
export function parkKit(P){
 const box=(w,h,d,x,y,z,c,p=P)=>{const m=new THREE.Mesh(B(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m;};
 const orb=(r,x,y,z,c,p=P)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m;};
 const tree=(x,z,s=1)=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.2*s,.3*s,3*s,8),M(0x997653));t.position.set(x,1.5*s,z);P.add(t);[0,1,2].forEach(k=>orb((1.6-k*.3)*s,x+(k-1)*.6*s,(3.4+k*.6)*s,z+(k%2)*.4*s,[0x88bf70,0x9aca7d,0x74ae72][k]));};
 const bench=(x,z,yaw=0)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=yaw;P.add(g);box(2,.08,.5,0,.42,0,0xd9b687,g);[-.9,.9].forEach(q=>box(.08,.42,.45,q,.21,0,0x9c917e,g));box(2,.4,.06,0,.75,.28,0xa5ccd0,g);g.scale.setScalar(1.7);return g;};
 const planter=(x,z,s=1)=>{box(.5*s,.5*s,.5*s,x,.25*s,z,0xf1ece4);for(let i=0;i<5;i++){const m=orb(.28*s,x+Math.cos(i*1.3)*.15*s,(.7+i*.12)*s,z+Math.sin(i*1.3)*.15*s,[0x87b96c,0x9bcb81,0x7eae74][i%3]);m.scale.set(1,1.3,1);}};
 const lamp=(x,z)=>{box(.12,4.5,.12,x,2.25,z,0x87a9af);const m=orb(.35,x,4.6,z,0xffe8b1);m.scale.y=.6;};
 const paving=(color=0xe5dfcb)=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#bfc3b5';g.fillRect(0,0,256,256);for(let y=0;y<8;y++)for(let x=0;x<8;x++){g.fillStyle=['#c7c6b7','#babdaf','#d2d1c0'][(x*2+y)%3];g.fillRect(x*32+1,y*32+1,30,30);}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(15,16);const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,86),M(new THREE.Color(color).lerp(new THREE.Color(0xaab69d),.55),{map:t,roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.set(0,-.22,-25);floor.receiveShadow=true;P.add(floor);return floor;};
 return {box,orb,tree,bench,planter,lamp,paving};
}
