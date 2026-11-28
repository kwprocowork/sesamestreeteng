import {SchoolTHREE as THREE,schoolMaterial} from './core.js?v=73a';
import {createVenue as ballet} from './venue-ballet.js?v=73a';
import {createVenue as amusement} from './venue-amusement.js?v=73a';
import {createVenue as traffic} from './venue-traffic.js?v=73a';
import {createVenue as pool} from './venue-pool.js?v=73a';
import {createSchoolActor} from './actor.js?v=71f';
import {STORY_STYLE,ORAL_ANIMATION_SECONDS} from '../story-pace.js?v=73a';
import {homeModel} from '../home-models.js?v=44';
import {poseToy} from '../toy-play.js?v=72a';
import {ActivityCamera} from './activity-camera.js?v=72a';
const factories={ballet,amusement,traffic,pool};
export class StoryFestival{
 constructor(scene,kit){this.scene=scene;this.kit=kit;this.root=new THREE.Group();this.root.name='Schoolbus story district';this.root.visible=false;scene.add(this.root);this.cache=new Map();this.castFactory=createSchoolActor(scene);this.guard=new ActivityCamera();this.time=0;this.reaction=null;this.originals=[];}
 start(id,toy='toy-blocks'){
  this.stop();this.id=id;this.style=STORY_STYLE[id]||{venue:'ballet',animationShare:.5,kind:'family'};this.root.visible=true;if(this.prize)this.prize.removeFromParent();
  const kind=this.style.venue;if(!this.cache.has(kind)){
   const venue=factories[kind](this.root);venue.root.name='Schoolbus '+kind+' district';
   // The intact source district sits beyond the existing learning plaza; no house rooms are copied.
   venue.root.position.set(kind==='ballet'?-24:0,-.08,kind==='ballet'?-30:-45);venue.root.scale.setScalar(kind==='ballet'?.85:.8);
   let surface=venue.data.floor;venue.root.traverse(m=>{if(!surface&&m.isMesh&&m.geometry.type==='PlaneGeometry'&&m.geometry.parameters.width>5&&m.geometry.parameters.height>5&&Math.abs(m.rotation.x)>1.4)surface=m;});if(surface){const paving=surface.material.clone();if(paving.map){paving.map=paving.map.clone();paving.map.repeat.set(paving.map.repeat.x*130/surface.geometry.parameters.width,paving.map.repeat.y*130/surface.geometry.parameters.height);paving.map.needsUpdate=true;}venue.plaza=new THREE.Mesh(surface.geometry,paving);venue.plaza.rotation.x=-Math.PI/2;venue.plaza.scale.set(130/surface.geometry.parameters.width,130/surface.geometry.parameters.height,1);venue.plaza.position.set(0,-.24,-28);venue.plaza.receiveShadow=true;this.root.add(venue.plaza);}
   if(kind==='ballet')venue.root.traverse(m=>{if(m.isMesh&&m.geometry.type==='PlaneGeometry'&&m.rotation.x>1.4&&m.position.y>4)m.visible=false;});venue.root.updateWorldMatrix(true,true);
   venue.cast=[];for(let i=0;i<8;i++){const e=this.castFactory.create({skin:[0xffd8bb,0xd6a073,0x8d5c40][i%3],hair:[0x48352b,0x886947,0x282333][i%3],top:[0xf0b2ba,0x8ccbbd,0x9eadd9,0xf2cd79][i%4],pants:i%2===0,dress:i%2===1,s:1.5});e.g.userData.neighbour=i;e.origin=i<4?new THREE.Vector3((i-1.5)*7,0,-14):venue.root.localToWorld(new THREE.Vector3(kind==='pool'?(i%2?24:-24):(i%2?4:-4),0,i<6?-10:2));e.pos.copy(e.origin);this.root.add(e.g);venue.cast.push(e);}this.cache.set(kind,venue);
  }
  for(const [key,v]of this.cache){v.root.visible=key===kind;if(v.plaza)v.plaza.visible=key===kind;v.cast.forEach(e=>e.g.visible=key===kind);}this.venue=this.cache.get(kind);this.toyId=toy;
  this.prize=new THREE.Group();this.prize.name='Story consequence animation';this.prize.visible=false;this.root.add(this.prize);this.toy=homeModel(toy,this.kit);this.prize.add(this.toy);const toySize=new THREE.Box3().setFromObject(this.toy).getSize(new THREE.Vector3());this.prize.scale.setScalar(2/Math.max(.1,toySize.x,toySize.y,toySize.z));
  this.root.updateMatrixWorld(true);const extent=kind==='ballet'?[[-17,-.3,-18],[17,7,12]]:kind==='pool'?[[-32,-.3,-36],[32,12,36]]:kind==='traffic'?[[-48,-.3,-40],[48,18,38]]:[[-65,-.3,-45],[65,29,60]];this.overviewBounds=new THREE.Box3(new THREE.Vector3(...extent[0]),new THREE.Vector3(...extent[1])).applyMatrix4(this.venue.root.matrixWorld);this.overviewBounds.union(new THREE.Box3(new THREE.Vector3(-12,-.3,-11),new THREE.Vector3(12,6,14)));this.obstacles=[];this.venue.root.traverse(m=>{if(!m.isMesh)return;const b=new THREE.Box3().setFromObject(m),size=b.getSize(new THREE.Vector3());if(b.min.y<1.5&&b.max.y>.65&&size.y>.65&&Math.max(size.x,size.z)<24)this.obstacles.push(b);});
  this.scene.fog=new THREE.Fog(0xcde7e9,75,210);this.scene.background=new THREE.Color(0xcde7e9);
 }
 open(roots){for(const root of roots.filter(Boolean))root.traverse(m=>{if(!m.isMesh||!m.visible)return;const b=new THREE.Box3().setFromObject(m),s=b.getSize(new THREE.Vector3());if((s.y<.4&&s.x>14&&s.z>14&&['CircleGeometry','CylinderGeometry'].includes(m.geometry.type))||(b.min.y>3.2&&s.x>7&&s.z>7)||(s.y>3.3&&Math.min(s.x,s.z)<.6&&Math.max(s.x,s.z)>9)){this.originals.push(m);m.visible=false;}});}
 stop(){this.guard.reset();for(const m of this.originals)m.visible=true;this.originals=[];this.reaction=null;this.root.visible=false;if(this.prize)this.prize.visible=false;}
 canWalk(x,z){if(!this.root.visible)return true;if(Math.abs(x)>65||z< -88||z>24)return false;if(Math.abs(x)<12&&z> -11)return true;return !this.obstacles.some(b=>x>b.min.x-.25&&x<b.max.x+.25&&z>b.min.z-.25&&z<b.max.z+.25);}
 overview(u,aspect,position,look,reduced=false){this.scene.fog.near=160;this.scene.fog.far=580;const v=reduced?1:THREE.MathUtils.smoothstep(u,.12,1),core=new THREE.Box3(new THREE.Vector3(-12,-.3,-11),new THREE.Vector3(12,6,14)),box=this.overviewBounds.clone();box.min.lerp(core.min,v);box.max.lerp(core.max,v);look.copy(box.getCenter(new THREE.Vector3()));const angle=reduced?.2:-.7+u*1.15,size=box.getSize(new THREE.Vector3()),side=new THREE.Vector3(Math.sin(angle)*.84,.54,Math.cos(angle)*.84),probe=this.overviewProbe??=new THREE.PerspectiveCamera(55,aspect,.1,600);probe.aspect=aspect;probe.updateProjectionMatrix();let radius=Math.max(22,size.length()*.65);for(let pass=0;pass<18;pass++){position.copy(look).addScaledVector(side,radius);probe.position.copy(position);probe.lookAt(look);probe.updateMatrixWorld(true);let fits=true;for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new THREE.Vector3(x,y,z).project(probe);if(Math.abs(p.x)>.87||Math.abs(p.y)>.87||p.z>1)fits=false;}if(fits)break;radius*=1.12;}}

 endOverview(){this.scene.fog.near=75;this.scene.fog.far=210;}
 celebrate(player){this.reaction={time:0,start:player.position.clone(),rotation:player.rotation.clone()};this.prize.visible=true;this.prize.position.copy(player.position).add(new THREE.Vector3(3.8,0,0));this.toy.position.set(0,0,0);this.toy.rotation.set(0,0,0);this.toy.scale.setScalar(1.6);}
 reactionCamera(player,aspect,position,look){look.copy(player.position).add(new THREE.Vector3(1.85,1.45,0));position.copy(look).add(new THREE.Vector3(0,2.2,Math.max(9,7.5/aspect)));}
 tick(dt,{paused=false,reduced=false,player}={}){if(!this.root.visible||paused)return false;this.guard.restore();this.time+=dt;const t=this.time,d=this.venue.data;
  if(!reduced){if(d.car_)d.car_.rotation.y=t*.28;if(d.cups)d.cups.rotation.y=-t*.24;if(d.fw){d.fw.rotation.z=t*.09;d.fwG?.forEach(e=>e.g.rotation.z=-t*.09);}d.horses?.forEach(e=>e.h.position.y=1.6+Math.sin(t*2+e.i)*.3);d.wMats?.forEach(m=>{if(m.map)m.map.offset.x=t*.012;});}
  this.venue.cast.forEach((e,i)=>{e.mv=0;if(!reduced&&!this.reaction){const x=e.origin.x+Math.sin(t*.18+i)*2.3,z=e.origin.z+Math.cos(t*.2+i)*1.3;e.yaw=Math.atan2(x-e.pos.x,z-e.pos.z);e.pos.set(x,0,z);e.mv=1;}e.pose=this.reaction?(i%2?'clap':'wave'):i%3===0?'wave':null;this.castFactory.animate(e,reduced?0:dt,t+i);});
  if(!this.reaction)return false;const a=this.reaction;a.time=Math.min(ORAL_ANIMATION_SECONDS,a.time+dt);const u=a.time/ORAL_ANIMATION_SECONDS;poseToy(this.toy,this.toyId,u,reduced);
  if(!reduced){const k=this.style.kind;if(['travel','cat','sound'].includes(k)){this.toy.position.x=Math.sin(u*Math.PI*2)*.6/this.prize.scale.x;this.toy.position.y=Math.abs(Math.sin(u*Math.PI*3))*.5/this.prize.scale.y;this.toy.rotation.y=u*Math.PI*2;}else if(['dance','theatre','family'].includes(k)){this.toy.rotation.y=u*Math.PI*2;this.toy.position.y=Math.sin(u*Math.PI)*.8/this.prize.scale.y;}else if(['garden','carrot','stationery'].includes(k)){this.toy.scale.setScalar(1.3+Math.sin(u*Math.PI)*.7);this.toy.rotation.z=Math.sin(u*Math.PI*4)*.16;}else{this.toy.position.y=Math.abs(Math.sin(u*Math.PI*3))*.8/this.prize.scale.y;this.toy.rotation.y=Math.sin(u*Math.PI*2)*.7;}}
  if(a.time<ORAL_ANIMATION_SECONDS)return false;this.reaction=null;this.prize.visible=false;player.position.copy(a.start);player.rotation.copy(a.rotation);return true;
 }
 clearView(camera,player,task=null){if(!this.root.visible)return;const focus=this.reaction?[this.prize]:[];this.guard.prepare(this.venue.root.children,player,focus);if(task?.point)this.guard.targets.push({point:task.point.clone(),owner:task.subjects?.[0]||this.prize});this.guard.guard(camera);}
}
