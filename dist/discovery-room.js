import * as THREE from './assets/three.module.js';
export const EXTRA_PLACES={basket:{name:'basket',prep:'in',target:new THREE.Vector3(8,0,5.2),ball:new THREE.Vector3(8,.55,3.8)},tent:{name:'tent',prep:'in',target:new THREE.Vector3(-4,0,8),ball:new THREE.Vector3(-4,.6,6.5)},stool:{name:'stool',prep:'under',target:new THREE.Vector3(2,0,9.2),ball:new THREE.Vector3(2,.36,7.8)}};
export class DiscoveryRoom{
 constructor(scene,{cube,cyl,orb,rod}){this.root=new THREE.Group();scene.add(this.root);this.flaps={};this.open=new Set();const g=this.root;
 cube(0xe9d8b3,0,-.21,3,24,.3,24,g);cube(0xf0e7c9,11.8,3,3,.16,6,24,g);
 // Woven basket, with a lid that lifts when searched.
 cyl(0xb88d5a,8,.08,3.8,.85,.12,g);for(let i=0;i<24;i++){const a=i*Math.PI/12;rod(0xc59c69,[8+Math.cos(a)*.84,.1,3.8+Math.sin(a)*.84],[8+Math.cos(a)*.9,1,3.8+Math.sin(a)*.9],.045,g);}for(let i=0;i<5;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.84+i*.012,.028,5,36),new THREE.MeshStandardMaterial({color:0xd5ad76}));ring.rotation.x=Math.PI/2;ring.position.set(8,.13+i*.2,3.8);g.add(ring);}const lid=new THREE.Group();lid.position.set(8,1,3.15);g.add(lid);const top=cyl(0xdfba85,0,.06,.65,.92,.12,lid);this.flaps.basket=lid;
 // Play tent and opening curtain; the ball is behind its fabric.
 cube(0x92b8bc,-4,1.4,5.8,3,2.8,.12,g);for(const s of[-1,1])rod(0xd2ac79,[-4+s*1.5,0,6.5],[-4,3.2,6.5],.08,g);const curtain=new THREE.Group();curtain.position.set(-5.5,0,7);g.add(curtain);cube(0xe9b8a3,1.5,1.35,0,3,2.7,.08,curtain);this.flaps.tent=curtain;
 cube(0xd8b972,2,1.1,7.8,1.8,.18,1.3,g);for(const x of[1.3,2.7])for(const z of[7.35,8.25])cube(0xc59960,x,.5,z,.12,1,.12,g);
 this.surprise=Array.from({length:9},(_,i)=>{const o=orb(i%2?0xf5cd69:0x83c4ba,0,0,0,.07,.07,.07,g);o.visible=false;return o;});this.effect=0;
 }
 reset(){this.open.clear();this.effect=0;for(const f of Object.values(this.flaps)){f.rotation.x=0;f.scale.x=1;}this.surprise.forEach(o=>o.visible=false);}
 search(key,position){this.open.add(key);this.effect=1.2;this.at=position.clone();}
 tick(dt,{paused=false,reduced=false}={}){if(paused||!this.root.visible)return;for(const [key,f]of Object.entries(this.flaps)){if(key==='tent')f.scale.x+=( (this.open.has(key)?.12:1)-f.scale.x)*(reduced?1:.15);else f.rotation.x+=((this.open.has(key)?-1.65:0)-f.rotation.x)*(reduced?1:.15);}this.effect=Math.max(0,this.effect-dt);this.surprise.forEach((o,i)=>{o.visible=this.effect>0&&!reduced;if(o.visible)o.position.set(this.at.x+Math.cos(i*2.4)*(1.2-this.effect),.8+(1.2-this.effect)*1.5,this.at.z+Math.sin(i*2.4)*(1.2-this.effect));});}
}
