import {SchoolTHREE as THREE} from './core.js?v=75a';
import {parkKit} from './park-kit.js?v=75a';
import {createVenue as school} from './venue-ballet.js?v=75a';
import {createVenue as fair} from './venue-amusement.js?v=75a';
import {createVenue as traffic} from './venue-traffic.js?v=75a';
import {buildTownFacade} from '../town-architecture.js?v=75a';
import {DISTRICTS,DEFAULT_DISTRICT} from '../activity-districts.js?v=75a';
import {addLivingFacilities} from './living-facilities.js?v=75a';
const library={};
export function createActivityDistrict(parent,id,kit){
 const profile=DISTRICTS[id]||DEFAULT_DISTRICT,root=new THREE.Group();root.name=profile.title;parent.add(root);const grass=new THREE.Mesh(new THREE.PlaneGeometry(700,700),new THREE.MeshStandardMaterial({color:0xb8d69c,roughness:1}));grass.rotation.x=-Math.PI/2;grass.position.set(0,-.3,-25);grass.receiveShadow=true;root.add(grass);const k=parkKit(root),floor=k.paving(profile.tint),data={floor,seats:[],spinners:[]};
 const details=addLivingFacilities(root,kit,{accent:profile.accent});data.living=details.motions;
 // Each chapter gets its own connected, open courtyard with a clear central learning plaza.
 for(const x of [-48,48])for(const z of [-68,-48,-28,-8,12,32])k.tree(x,z,1.45);for(const x of [-26,26])for(const z of [-46,-26,-6,15])k.tree(x,z,1.2+(z%3)*.05);
 for(const [x,z,yaw]of [[-16,-13,0],[16,-13,0],[-21,7,Math.PI/2],[21,7,-Math.PI/2],[-16,-33,0],[16,-33,0]]){data.seats.push(k.bench(x,z,yaw));k.planter(x+3,z,1.8);k.lamp(x-3,z);}
 k.box(5,.08,72,0,-.14,-21,0xfaf2dd);k.box(50,.07,4,0,-.13,-19,0xfaf2dd);
 if(profile.school){
  if(!library.school){library.school=school(new THREE.Group()).root;library.school.traverse(m=>{if(m.isMesh&&m.geometry.type==='PlaneGeometry'&&m.rotation.x>1.4&&m.position.y>4)m.visible=false;});}
  const wing=library.school.clone(true);wing.name='Open classrooms and reception';wing.position.set(0,0,-40);wing.scale.setScalar(1.05);root.add(wing);data.school=wing;kit.labelBoard?.(profile.title,0,6.8,-24,13,root);
 }
 if(profile.cottages){for(const [i,x]of [-17,17].entries())buildTownFacade({id:'story-wing-'+i,name:profile.setting==='farm'?'Orchard cottage':'Garden cottage',x,z:-34,width:11,depth:9.4,color:profile.accent,style:profile.setting==='farm'?'barn':'rowhouse'},root,kit.cube);}
 if(profile.ride){if(!library.carousel){const d=fair(new THREE.Group()).data;d.car_.name='Story ride spinner';library.carousel=d.car_.parent;}const carousel=library.carousel.clone(true);carousel.name='Discovery carousel';carousel.position.set(24,0,-35);root.add(carousel);data.spinners.push(carousel.getObjectByName('Story ride spinner'));}
 if(profile.traffic){const lane=traffic(new THREE.Group());lane.root.traverse(m=>{if(m.isMesh){m.geometry.computeBoundingBox();const s=m.geometry.boundingBox?.getSize(new THREE.Vector3());if(s?.y>25)m.visible=false;}});lane.root.position.set(0,0,-52);lane.root.scale.setScalar(.7);root.add(lane.root);data.traffic=lane;}
 if(profile.pond){const pond=new THREE.Mesh(new THREE.CircleGeometry(6,48),new THREE.MeshStandardMaterial({color:0x8dd7e2,roughness:.22,metalness:.05}));pond.rotation.x=-Math.PI/2;pond.position.set(20,-.06,-31);root.add(pond);data.pond=pond;for(let i=0;i<12;i++)k.planter(20+Math.sin(i*.524)*7,-31+Math.cos(i*.524)*7,1.4);}
 if(['garden','farm','nature'].includes(profile.setting)){for(const x of [-19,19])for(let z=-27;z>=-42;z-=3){k.box(4,.38,1.8,x,.05,z,0xcab794);for(let i=0;i<4;i++)k.planter(x-1.3+i*.85,z,.8);}}
 if(profile.setting==='picnic'){for(const x of [-15,15]){k.box(4,.14,2.2,x,1.4,-27,0xf2c5a5);for(const s of [-1,1])k.box(.14,1.4,.14,x+s*1.5,.7,-27,0xc7b291);k.planter(x,-28.1,1.1);}}
 root.updateMatrixWorld(true);const obstacles=[];root.traverse(m=>{if(!m.isMesh||!m.visible)return;const b=new THREE.Box3().setFromObject(m),s=b.getSize(new THREE.Vector3());if(b.min.y<1.5&&b.max.y>.6&&s.y>.6&&Math.max(s.x,s.z)<22)obstacles.push(b);});
 return {root,data,profile,obstacles,plaza:floor,cast:[],bounds:new THREE.Box3(new THREE.Vector3(-35,-.3,-64),new THREE.Vector3(35,9,20))};
}
