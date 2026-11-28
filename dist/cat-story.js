import * as THREE from './assets/three.module.js';
import {PhonicsWorld} from './phonics-world.js?v=74a';
export const CAT_TURNS=[
 {place:null,prompt:'Can you see the cat?',sentence:'I can not see Cat.',short:'Not yet.'},
 {place:'bed',prompt:'Look under the bed. What should you ask?',sentence:'Is Cat under the bed?',short:'Under the bed?'},
 {place:null,prompt:'Is Cat under the bed?',sentence:'No, Cat is not under the bed.',short:'No!'},
 {place:'chair',prompt:'Check on the chair. What should you ask?',sentence:'Is Cat on the chair?',short:'On the chair?'},
 {place:null,prompt:'Is Cat on the chair?',sentence:'No, Cat is not on the chair.',short:'No!'},
 {place:'curtain',prompt:'Look behind the curtain. Can you see Cat?',sentence:'I can not see Cat.',short:'Not yet.'},
 {place:'basket',prompt:'The basket is rustling. What should you ask?',sentence:'Is Cat in the basket?',short:'In the basket?'},
 {place:null,prompt:'You found Cat! Tell your friend where Cat is.',sentence:'Cat is in the basket!',short:'In the basket!'},
 {place:'cat',prompt:'Walk over and say hello to the playful cat.',sentence:'Silly Cat!',short:'Silly Cat!'}
];
export class CatStoryWorld{
 constructor(scene,kit){
  this.kit=kit;this.root=new THREE.Group();scene.add(this.root);
  const {cube,cyl,orb,rod}=kit,g=this.root;
  this.targets={bed:new THREE.Vector3(-4,0,4.6),chair:new THREE.Vector3(4,0,.35),curtain:new THREE.Vector3(.2,0,-3.5),basket:new THREE.Vector3(4,0,4.9),cat:new THREE.Vector3(4,0,4.9)};
  // A raised bed leaves a clear space for the child's search.
  for(const x of[-5.2,-2.8])for(const z of[1.9,3.8])cyl(0xa27b56,x,.48,z,.09,.96,g);
  cube(0xb99168,-4,.83,2.85,2.7,.2,2.3,g);cube(0xefe9d5,-4,1.02,2.85,2.65,.2,2.2,g);
  cube(0xb5c9c6,-4,1.18,3.1,2.6,.15,1.6,g);orb(0xf5efda,-4,1.2,2.1,.9,.16,.3,g);
  for(let i=0;i<5;i++)cube(0x93b4af,-5.1+i*.54,1.27,3.1,.08,.025,1.6,g);
  this.basket=new THREE.Group();this.basket.position.set(4,0,3.7);g.add(this.basket);
  cyl(0xc99e62,0,.4,0,.67,.8,this.basket);
  for(let j=0;j<6;j++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.68,.018,5,40),new THREE.MeshStandardMaterial({color:0xa57b4b}));ring.position.y=.08+j*.135;ring.rotation.x=Math.PI/2;this.basket.add(ring);}
  for(const side of[-1,1]){const handle=new THREE.Mesh(new THREE.TorusGeometry(.18,.025,6,20),new THREE.MeshStandardMaterial({color:0xa57b4b}));handle.position.set(side*.69,.66,0);handle.rotation.y=Math.PI/2;this.basket.add(handle);}
  this.cat=PhonicsWorld.prototype.model.call({kit},'cat');this.cat.scale.setScalar(.7);this.cat.position.set(4,.4,3.7);g.add(this.cat);
  this.blanket=cube(0x536fb0,4,.86,3.7,1.45,.10,1.3,g);
  this.dog=PhonicsWorld.prototype.model.call({kit},'dog');this.dog.scale.setScalar(.65);this.dog.position.set(1,0,3);g.add(this.dog);
  this.curtain=new THREE.Group();this.curtain.position.set(.2,0,-4.7);g.add(this.curtain);
  cube(0xab795e,0,1.7,0,1.55,3.4,.12,this.curtain);
  for(let i=0;i<5;i++)cyl(0xd4a178,-.65+i*.3,1.7,.1,.14,3.4,this.curtain);

  // Recreate the book's orange tabby, black-and-white dog, red bed drape and blue basket cloth.
  this.cat.traverse(o=>{if(o.isMesh&&o.material.color.getHex()===0xd3a37e)o.material.color.set(0xe8a442);});
  for(let i=0;i<4;i++)cube(0xb7762d,0,.78,-.35+i*.20,.53,.035,.065,this.cat);
  this.dog.traverse(o=>{if(o.isMesh&&o.material.color.getHex()===0xb68157)o.material.color.set(0xfff6e5);if(o.isMesh&&o.material.color.getHex()===0x795840)o.material.color.set(0x303334);});
  orb(0x303334,.23,.60,-.18,.27,.23,.30,this.dog);
  this.bedFlap=new THREE.Group();this.bedFlap.position.set(-4,.95,4);g.add(this.bedFlap);
  cube(0xb8544f,0,-.36,0,2.75,.72,.06,this.bedFlap);
  this.slippers=new THREE.Group();this.slippers.position.set(-4,.09,3.2);g.add(this.slippers);
  for(const x of[-.3,.3])orb(0xa7544f,x,0,0,.20,.08,.32,this.slippers);
  this.cushion=new THREE.Group();this.cushion.position.set(4,1.55,-1.2);g.add(this.cushion);
  orb(0x83acae,0,0,0,.48,.26,.33,this.cushion);
  this.yarn=orb(0xe5b554,4,1.4,-1.2,.12,.12,.12,g);this.yarn.visible=false;
  this.paw=new THREE.Group();this.paw.position.set(3,.06,2.6);g.add(this.paw);
  for(let i=0;i<3;i++)orb(0xb1794c,(i-1)*.075,0,0,.028,.01,.035,this.paw);
  orb(0xb1794c,0,0,.08,.07,.01,.055,this.paw);
  this.inspectPlace=null;this.actionTime=0;this.opening=false;
  this.reset();
 }
 reset(){this.root.visible=true;this.revealed=false;this.cat.visible=false;this.blanket.visible=true;this.curtain.rotation.y=0;this.dog.position.set(1,0,3);this.inspectPlace=null;this.actionTime=0;this.bedFlap.rotation.x=0;this.cushion.rotation.z=0;this.yarn.visible=false;this.opening=false;this.blanket.position.set(4,.86,3.7);this.blanket.rotation.z=0;this.searchGoal=null;this.onInspectDone=null;}
 startOpening(){this.opening=true;this.openingTime=0;this.cat.visible=true;this.cat.position.set(-1,0,1.2);}
 inspect(place){this.inspectPlace=place;this.actionTime=0;}
 finishInspect(place){
  if(place==='curtain')this.curtain.rotation.y=-1;
  if(place==='bed')this.bedFlap.rotation.x=-1.4;
  if(place==='chair'){this.cushion.rotation.z=-.8;this.yarn.visible=true;}
  if(place==='basket'){this.revealed=true;this.cat.visible=true;this.cat.position.set(4,.4,3.7);this.blanket.visible=false;}if(place==='cat'){this.cat.position.set(4.2,0,4.5);}
 }
 tick(time,dt,player){
  if(!this.root.visible)return;
  if(this.opening){
   this.openingTime+=dt;const u=Math.min(1,this.openingTime/5);
   this.cat.position.set(-1+5*u,Math.abs(Math.sin(u*20))*.08,1.2+2.5*u);
   this.cat.rotation.y=1;
   if(u===1){this.opening=false;this.cat.visible=false;this.cat.position.set(4,.4,3.7);}
  }
  if(this.inspectPlace){
   this.actionTime+=dt;const u=Math.min(1,this.actionTime/1.6),ease=u*u*(3-2*u),place=this.inspectPlace;
   if(place==='bed')this.bedFlap.rotation.x=-ease*1.4;
   if(place==='chair')this.cushion.rotation.z=-ease*.8;
   if(place==='curtain')this.curtain.rotation.y=-ease;
   if(place==='basket'){this.blanket.position.y=.86+ease*.65;this.blanket.rotation.z=ease*.7;}
   if(u===1){this.finishInspect(place);this.inspectPlace=null;this.onInspectDone?.();}
  }
  const goal=this.searchGoal?this.searchGoal.clone():this.revealed?new THREE.Vector3(2.3,0,3.7):player.position.clone().add(new THREE.Vector3(-1.3,0,.7));
  const delta=goal.sub(this.dog.position).setY(0),distance=delta.length();
  if(distance>.7){delta.normalize();this.dog.position.addScaledVector(delta,Math.min(distance-.7,dt*.7));const turn=Math.atan2(delta.x,delta.z)-this.dog.rotation.y;this.dog.rotation.y+=Math.atan2(Math.sin(turn),Math.cos(turn))*Math.min(1,dt*3);}
  if(!this.opening)this.cat.rotation.y=.2+Math.sin(time*.8)*.06;
 }
}
