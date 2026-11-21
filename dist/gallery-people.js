import * as THREE from './assets/three.module.js';
import {faceSurfaceZ} from './playhouse-design.js';

const skin=0xd49c71, darkHair=0x352728, grayHair=0xb4babf;
const glassesGeometry=new THREE.TorusGeometry(.108,.019,8,24);
const glassesMaterial=new THREE.MeshStandardMaterial({color:0x785396,roughness:.7});

export const GALLERY_PEOPLE={
 milo:{height:1.72,shirt:0xe87850,skin,hair:darkHair,style:'sweep',feature:'pocket'},
 pippa:{height:1.68,shirt:0x8467bd,skin:0x99613f,hair:0x30232a,style:'puffs',feature:'collar'},
 olderSister:{height:1.96,shirt:0x8966c5,skin,hair:darkHair,style:'braids',feature:'collar'},
 youngerSister:{height:1.36,shirt:0xf2b746,skin:0xe0a97a,hair:darkHair,style:'pigtails',feature:'bow'},
 olderBrother:{height:2.01,shirt:0xd75b4e,skin,hair:darkHair,style:'quiff',feature:'stripes'},
 youngerBrother:{height:1.42,shirt:0x63a478,skin:0xe0a97a,hair:darkHair,style:'sweep',feature:'cap'},
 mom:{height:2.22,shirt:0x459b9c,skin,hair:darkHair,style:'bob',feature:'scarf'},
 dad:{height:2.32,shirt:0x3977b8,skin,hair:darkHair,style:'sweep',feature:'beard'},
 grandma:{height:2.08,shirt:0x996ca9,skin:0xc99068,hair:grayHair,style:'bun',feature:'glasses'},
 grandpa:{height:2.18,shirt:0x8b654e,skin:0xc99068,hair:grayHair,style:'receding',feature:'mustache'}
};

function joint(parent,x,y,z){
 const group=new THREE.Group();
 group.position.set(x,y,z);
 parent.add(group);
 return group;
}

export function createGalleryPerson(kit,parent,id){
 const spec=GALLERY_PEOPLE[id];
 const {height,shirt,skin,hair,style,feature}=spec;
 const {orb,rod,cube}=kit;
 const person=joint(parent,0,0,0);
 person.name=id;
 const small=height<1.5;
 const headRadii=[small?.31:.32,small?.33:.355,.28];
 const [rx,ry]=headRadii;
 const head=joint(person,0,height-ry-.04,0);
 const shoulder=head.position.y-ry-.14;
 const waist=shoulder*.48;
 const width=small?.235:.29;
 const trousers=0x4b5873;
 orb(trousers,0,waist,0,width*.82,.14,.18,person);
 orb(shirt,0,(shoulder+waist)/2,0,width,(shoulder-waist)/2+.10,.21,person);
 orb(skin,0,shoulder+.14,0,.105,.13,.10,person);
 const arms=[];
 for(const side of [-1,1]){
  orb(trousers,side*width*.49,(waist+.12)/2,0,.099,(waist-.09)/2,.113,person);
  orb(0x483d43,side*width*.51,.085,.058,.118,.082,.173,person);
  const arm=joint(person,side*width*.87,shoulder,-.01);
  arm.rotation.z=side*.19;
  orb(shirt,0,-.125,0,.103,.187,.115,arm);
  orb(skin,0,-.305,.025,.073,.128,.076,arm);
  orb(skin,0,-.399,.045,.079,.088,.076,arm);
  arms.push(arm);
 }
 person.userData.arms=arms;

 orb(hair,0,.02,-.104,rx*1.08,ry*1.04,.243,head);
 for(const side of [-1,1])orb(skin,side*rx,-.031,.007,.052,.082,.052,head);
 orb(skin,0,0,0,...headRadii,head);
 const surface=(x,y,padding)=>faceSurfaceZ(x,y,headRadii,padding);
 for(const side of [-1,1]){
  const x=side*.122,y=.049,z=surface(x,y,.012);
  orb(0xfffcf3,x,y,z,.067,.077,.030,head);
  orb(0x57392d,x,y-.004,z+.028,.036,.049,.015,head);
  orb(0x292126,x+.004,y-.004,z+.040,.021,.033,.009,head);
  orb(0xffffff,x-.012,y+.014,z+.049,.012,.014,.006,head);
  orb(hair,x,.154,surface(x,.154,.003),.066,.014,.018,head).rotation.z=-side*.14;
  orb(0xdd8878,x*1.66,-.075,surface(x*1.66,-.075,.005),.059,.024,.012,head);
 }
 orb(skin,0,-.042,surface(0,-.042,.014),.05,.057,.052,head);
 if(style==='receding'){
  for(const side of [-1,1])orb(hair,side*.265,.143,-.029,.093,.168,.183,head);
 }else{
  orb(hair,-.041,ry*.78,-.015,rx*1.01,.143,.26,head).rotation.z=-.18;
  const fringe=orb(hair,-.10,.213,.163,.211,.101,.116,head);
  fringe.rotation.z=.33;
 }
 if(style==='quiff'){
  orb(hair,-.09,ry*.98,.07,.202,.14,.149,head).rotation.z=.38;
 }else if(style==='bob'){
  for(const side of [-1,1])orb(hair,side*.268,-.09,-.096,.118,.245,.174,head);
 }else if(style==='bun'){
  orb(hair,0,ry+.06,-.14,.178,.15,.16,head);
 }else if(style==='pigtails'||style==='puffs'){
  for(const side of [-1,1]){
   const puff=style==='puffs';
   orb(hair,side*.31,puff?.215:.093,-.033,puff?.144:.108,puff?.151:.204,.125,head).rotation.z=-side*.30;
   if(puff)orb(0xf1c764,side*.265,.219,.053,.049,.041,.052,head);
  }
 }else if(style==='braids'){
  for(const side of [-1,1]){
   for(let i=0;i<6;i++)orb(hair,side*(.274+i*.012),-.14-i*.074,-.028+i*.03,.086-i*.004,.063,.075,head);
   orb(0xdcab48,side*.335,-.515,.143,.052,.041,.058,head);
  }
 }

 const detail=joint(person,0,0,0);
 detail.name=feature;
 if(feature==='bow'){
  for(const side of [-1,1])orb(0xd95380,-.23+side*.095,head.position.y+.24,.236,.113,.056,.049,detail).rotation.z=side*.34;
  orb(0xf1a5b8,-.23,head.position.y+.24,.272,.046,.043,.032,detail);
 }else if(feature==='cap'){
  orb(0x357552,0,head.position.y+.24,.037,.334,.16,.27,detail);
  orb(0x569f73,.055,head.position.y+.204,.236,.296,.043,.166,detail);
 }else if(feature==='stripes'){
  for(const y of [waist+.14,waist+.25])orb(0xffe8c7,0,y,.181,.236,.033,.042,detail);
 }else if(feature==='scarf'){
  orb(0xe284a5,0,shoulder+.15,.024,.217,.077,.181,detail);
  const scarf=orb(0xe284a5,.099,shoulder-.029,.186,.081,.232,.053,detail);
  scarf.rotation.z=.22;
 }else if(feature==='beard'){
  orb(0x553b34,0,head.position.y-.208,.131,.263,.146,.143,detail);
 }else if(feature==='mustache'){
  for(const side of [-1,1])orb(0xe3e3de,side*.067,head.position.y-.125,.259,.097,.049,.055,detail).rotation.z=side*.18;
 }else if(feature==='glasses'){
  for(const side of [-1,1]){
   const ring=new THREE.Mesh(glassesGeometry,glassesMaterial);
   ring.position.set(side*.125,head.position.y+.047,.317);
   detail.add(ring);
  }
  rod(0x785396,[-.035,head.position.y+.055,.321],[.035,head.position.y+.055,.321],.016,detail);
 }else if(feature==='collar'){
  for(const side of [-1,1])orb(0xffedda,side*.073,shoulder+.032,.156,.09,.046,.038,detail).rotation.z=side*.34;
 }else{
  cube(0xfac956,.104,shoulder-.135,.202,.10,.12,.037,detail);
 }

 const smileFace=joint(head,0,0,0),restFace=joint(head,0,0,0);
 person.userData.smileFace=smileFace;
 person.userData.restFace=restFace;
 restFace.visible=false;
 const mouthColor=feature==='beard'?0xf2b39d:0x995f57;
 const smile=Array.from({length:7},(_,i)=>{
  const u=i/6,x=(u-.5)*.178,y=-.154-Math.sin(u*Math.PI)*.028;
  return [x,y,surface(x,y,feature==='beard'?.042:.014)];
 });
 for(let i=1;i<smile.length;i++)rod(mouthColor,smile[i-1],smile[i],.009,smileFace);
 const y=-.166,z=surface(.045,y,feature==='beard'?.044:.017);
 rod(mouthColor,[-.047,y,z],[.047,y,z],.007,restFace);
 return person;
}

export function smileForPhoto(person,smiling){
 person.userData.smileFace.visible=smiling;
 person.userData.restFace.visible=!smiling;
}
