import * as THREE from './assets/three.module.js';
import {shuffled} from './learning.js';
import {createFamilyCharacter,setFamilyHappy,createHouseLabel,faceHouseLabels} from './playhouse-design.js?v=75a';
export const WANT_ITEMS=['cookies','bread','rice','ice cream','juice','milk'];
export const wantQuestion=word=>`Do you want ${word}?`;
export function wantOptions(word,random=Math.random){if(!WANT_ITEMS.includes(word))throw Error('Unknown food');return shuffled([word,...shuffled(WANT_ITEMS.filter(w=>w!==word),random).slice(0,3)],random);}
export function createWantRound(random=Math.random){const slots=shuffled([{x:2.7,y:.14,z:-4.6,location:'fridge'},{x:2.7,y:1.08,z:-4.6,location:'fridge'},{x:2.7,y:2.03,z:-4.6,location:'fridge'},{x:-5,y:1.15,z:.2,location:'table'},{x:-3.6,y:1.15,z:.2,location:'table'},{x:-2.2,y:1.15,z:.2,location:'table'}],random);return WANT_ITEMS.map((word,i)=>({word,...slots[i]}));}
export const wantAnswer=word=>word==='milk'?'Yes, please!':'No, thank you.';
export class WantWorld{
 constructor(scene,kit){this.kit=kit;this.root=new THREE.Group();this.root.visible=false;scene.add(this.root);this.stations=new Map();this.labels=[];this.delivered=null;this.happy=false;const {orb,cube,cyl,rod}=kit,p=this.root;
  cube(0xe8d7b4,0,-.18,1,20,.3,16,p);for(let x=-9;x<=9;x++)cube(x%2?0xecdcbf:0xe4d1ad,x,-.005,1,.98,.03,15.8,p);
  cube(0xf4e4c6,0,3.5,-6,20,7,.2,p);cube(0x9bbeb2,0,1,-5.85,20,2,.12,p);cube(0xfaf1d6,0,2.04,-5.7,20,.1,.17,p);
  for(const x of[-6,5]){cube(0xfcf0d5,x,4.3,-5.8,3.4,2.9,.15,p);cube(0xb5dfdf,x,4.3,-5.68,3.05,2.5,.07,p);cube(0xfff6de,x,4.3,-5.6,.1,2.5,.1,p);cube(0xfff6de,x,4.3,-5.59,3.1,.1,.1,p);for(const side of[-1,1])cube(0xeab494,x+side*1.9,4.2,-5.53,.5,3.2,.15,p);}
  // A friendly, accessible pretend kitchen: every food is on a low play stand.
  cube(0x83ada7,-1.2,1,-5,5.8,2,.9,p);cube(0xf7e7ba,-1.2,2.06,-4.95,6,.16,1.1,p);for(const x of[-3.1,-1.2,.7]){cube(0xb4cec0,x,1,-4.51,1.5,1.7,.08,p);orb(0xe9ca78,x+.47,1.1,-4.43,.06,.06,.04,p)}
  // Real hollow fridge, shelves and a hinged door. Food is inside, never on a quiz panel.
  cube(0x91b7b9,3.1,1.8,-5.38,2.4,3.6,.12,p);
  for(const x of[1.9,4.3])cube(0x91b7b9,x,1.8,-4.9,.12,3.6,1.1,p);
  for(const y of[.08,1.02,1.97,3.6])cube(0xe8f1da,3.1,y,-4.9,2.4,.1,1.1,p);
  this.door=new THREE.Group();this.door.position.set(1.85,0,-4.28);p.add(this.door);
  cube(0xc6dbc9,1.25,1.8,0,2.5,3.6,.14,this.door);cube(0xe7d194,2.1,1.8,.14,.08,.8,.1,this.door);
  this.fridgeOpen=false;this.door.name='Open or close fridge';
  cube(0xe2b779,-3.6,1.05,.2,4.5,.2,1.5,p);for(const x of[-5.5,-1.7])for(const z of[-.3,.7])cube(0xb98b5d,x,.5,z,.13,1,.13,p);

  const welcomeLabel=this.label('Pretend & Play',2.5);welcomeLabel.position.set(-1,3.8,-5.5);p.add(welcomeLabel);
  const nursery=cyl(0xe9c37d,4.8,.035,1.3,2.35,.04,p);nursery.scale.z=.8;const inner=cyl(0xf0dba5,4.8,.06,1.3,1.95,.02,p);inner.scale.z=.8;
  const chair=new THREE.Group();chair.position.set(4.7,0,.7);p.add(chair);for(const x of[-.55,.55])for(const z of[-.4,.4])cube(0x84aaa0,x,.7,z,.1,1.4,.1,chair);cube(0x9bbdb0,0,1.1,0,1.3,.17,1,chair);cube(0x9bbdb0,0,1.5,-.42,1.12,.75,.14,chair);cube(0xe6bb72,0,1.52,.5,1.5,.12,.6,chair);
  this.baby=createFamilyCharacter('baby');this.baby.position.set(4.7,1.15,.6);p.add(this.baby);
  this.caregiver=createFamilyCharacter('mama');this.caregiver.position.set(6.1,0,2.3);this.caregiver.rotation.y=-.35;p.add(this.caregiver);
  const babyLabel=this.label('Baby',.72);babyLabel.position.set(4.7,2.98,.6);p.add(babyLabel);
  const mamaLabel=this.label('Mama',.82);mamaLabel.position.set(6.1,3.5,2.3);p.add(mamaLabel);
  this.milkBottle=new THREE.Group();this.milkBottle.position.set(4.83,1.66,1.02);p.add(this.milkBottle);cyl(0xfff9e6,0,0,0,.11,.38,this.milkBottle);cyl(0xe8b8aa,0,.22,0,.12,.08,this.milkBottle);orb(0xe7c89b,0,.3,0,.06,.08,.06,this.milkBottle);this.milkBottle.visible=false;
  this.delivery=new THREE.Group();p.add(this.delivery);this.delivery.position.set(3.55,1.5,1.25);
  for(const word of WANT_ITEMS){const station=new THREE.Group();p.add(station);const label=this.label(word,word==='ice cream'?1.15:word==='cookies'?1.05:word==='bread'?.85:.75,100);label.position.set(0,-.08,.58);station.add(label);label.traverse(o=>o.userData.foodWord=word);const food=this.makeFood(word);food.scale.setScalar(.65);station.add(food);food.traverse(o=>o.userData.foodWord=word);this.stations.set(word,{root:station,food,label});}
  this.carried=new THREE.Group();p.add(this.carried);

  this.reset(createWantRound());
 }
 label(text,width,priority=0){const label=createHouseLabel(text,width,{height:.28,compact:true,pixelHeight:25,priority});this.labels.push(label);return label;}
 makeFood(word){const {orb,cube,cyl,rod}=this.kit,g=new THREE.Group();
  if(word==='cookies'){cyl(0xd5e0d0,0,.03,0,.49,.06,g);for(let i=0;i<3;i++){const x=(i-1)*.23,z=i%2?.1:-.1;cyl(0xd7ae6c,x,.12,z,.2,.08,g);for(let j=0;j<5;j++){const a=j*2.4;orb(0x786044,x+Math.cos(a)*.12,.165,z+Math.sin(a)*.1,.025,.014,.025,g)}}}
  if(word==='bread'){orb(0xce9b54,0,.25,0,.48,.25,.32,g);for(let i=0;i<3;i++)cube(0xefce8e,(i-1)*.2,.46,0,.045,.04,.36,g);}
  if(word==='rice'){const bowl=orb(0x9fbdb7,0,.2,0,.42,.24,.42,g);orb(0xfff3d6,0,.33,0,.37,.1,.37,g);for(let i=0;i<38;i++){const a=i*2.4,r=.3*Math.sqrt((i+.5)/38);const grain=orb(0xfdf7e4,Math.cos(a)*r,.41-(r*.13),Math.sin(a)*r,.025,.018,.046,g);grain.rotation.y=a}}
  if(word==='ice cream'){const cone=new THREE.Mesh(new THREE.ConeGeometry(.24,.6,24),new THREE.MeshStandardMaterial({color:0xd4aa6c}));cone.rotation.z=Math.PI;cone.position.y=.3;g.add(cone);orb(0xf0bfd0,0,.7,0,.3,.29,.3,g);orb(0xf8d78f,0,1.06,0,.22,.22,.22,g);}
  if(word==='juice'){cyl(0xdac89c,0,.3,0,.23,.6,g);cyl(0xefb75f,0,.59,0,.21,.04,g);rod(0x84b7b2,[.08,.55,0],[.16,1,0],.025,g);orb(0xf7d688,-.05,.6,0,.16,.02,.16,g);}
  if(word==='milk'){cube(0xf4f1df,0,.35,0,.43,.7,.4,g);cube(0x90b9c0,0,.63,0,.45,.14,.42,g);const roof=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.18,3),new THREE.MeshStandardMaterial({color:0xa8cbd0}));roof.position.y=.79;roof.rotation.z=Math.PI/2;g.add(roof);orb(0xa1c6cc,0,.34,.211,.12,.16,.01,g);}
  return g;
 }
 reset(round){this.happy=false;this.fridgeOpen=false;this.door.rotation.y=0;setFamilyHappy(this.baby,false);this.delivered=null;this.milkBottle.visible=false;this.delivery.clear();this.carried.clear();this.round=round;for(const item of round){const station=this.stations.get(item.word);station.root.position.set(item.x,item.y,item.z);station.label.position.set(item.location==='fridge'?3.65-item.x:0,item.location==='table'?(item.x===-3.6?-.82:-.12):.31,item.location==='fridge'?.88:.95);station.food.scale.setScalar(item.location==='fridge'?.55:.65);station.food.visible=true;station.label.userData.requestedVisible=item.location==='table';station.label.visible=item.location==='table';}}
 toggleFridge(){this.fridgeOpen=!this.fridgeOpen;}
 pickup(word){this.carried.clear();const prop=this.stations.get(word).food.clone(true);prop.position.set(0,0,0);this.carried.add(prop);this.stations.get(word).food.visible=false;}
 pick(raycaster){this.root.updateMatrixWorld(true);const targets=[...this.stations.entries()].filter(([word,s])=>s.food.visible&&(this.round.find(item=>item.word===word)?.location!=='fridge'||this.fridgeOpen)).flatMap(([,s])=>[s.food,...(s.label.visible?[s.label]:[])]);const hit=raycaster.intersectObjects(targets,true).find(h=>h.object.userData.foodWord);return hit?.object.userData.foodWord;}

 offer(word){this.carried.clear();this.delivered=word;this.offerTime=0;while(this.delivery.children.length)this.delivery.remove(this.delivery.children[0]);const prop=this.stations.get(word).food.clone(true);prop.position.set(0,0,0);prop.visible=true;this.delivery.add(prop);if(word==='milk'){this.happy=true;setFamilyHappy(this.baby,true);this.milkBottle.visible=true;}}
 tick(time,camera,viewportHeight=600,player=null,paused=false,reduced=false,viewportWidth=0){if(paused){faceHouseLabels(this.labels,camera,viewportHeight,viewportWidth);return;}if(!paused){this.door.rotation.y+=((this.fridgeOpen?-2.65:0)-this.door.rotation.y)*(reduced?1:.13);for(const item of this.round){const station=this.stations.get(item.word);station.label.userData.requestedVisible=station.food.visible&&(item.location==='table'||this.fridgeOpen);}if(player)this.carried.position.copy(player.position).add(new THREE.Vector3(.5,1.1,.3));this.offerTime=(this.offerTime||0)+.016;this.delivery.position.x=3.55+Math.min(1,this.offerTime)*.65;this.delivery.position.y=1.5+(reduced?0:Math.sin(Math.min(1,this.offerTime)*Math.PI)*.3);}this.baby.rotation.z=paused||reduced?0:Math.sin(time*1.4)*(this.happy?.018:.028);this.baby.rotation.y=this.delivered&&!this.happy&&!paused&&!reduced?Math.sin(time*7)*.18:0;this.caregiver.rotation.y=-.35+Math.sin(time*.7)*.02;this.caregiver.userData.arms.forEach((arm,i)=>{arm.rotation.x=this.happy&&i===0?-.22:Math.sin(time*.9+i)*.025});this.milkBottle.rotation.z=.35;faceHouseLabels(this.labels,camera,viewportHeight,viewportWidth);}
}
