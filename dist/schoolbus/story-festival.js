import {createActivityDistrict} from './activity-district.js?v=74a';
import {giveNeighbourJob,tickNeighbourJob,jobPose} from './neighbour-props.js?v=74a';
import {neighbourIdentity} from '../neighbour-life.js?v=74a';
import {SchoolTHREE as THREE,schoolMaterial} from './core.js?v=74a';
import {createSchoolActor} from './actor.js?v=74a';
import {STORY_STYLE,ORAL_ANIMATION_SECONDS} from '../story-pace.js?v=74a';
import {homeModel} from '../home-models.js?v=74a';
import {poseToy} from '../toy-play.js?v=74a';
import {ActivityCamera} from './activity-camera.js?v=74a';
export class StoryFestival{
 constructor(scene,kit){this.scene=scene;this.kit=kit;this.root=new THREE.Group();this.root.name='Schoolbus story district';this.root.visible=false;scene.add(this.root);this.cache=new Map();this.castFactory=createSchoolActor(scene);this.guard=new ActivityCamera();this.time=0;this.reaction=null;this.originals=[];}
 start(id,toy='toy-blocks'){
  this.stop();this.id=id;this.style=STORY_STYLE[id]||{venue:'ballet',animationShare:.5,kind:'family'};this.root.visible=true;if(this.prize)this.prize.removeFromParent();
  const kind=id;
  if(!this.cache.has(kind))this.cache.set(kind,createActivityDistrict(this.root,id,this.kit));
  for(const [key,v]of this.cache)v.root.visible=key===kind;this.venue=this.cache.get(kind);this.toyId=toy;
  if(!this.cast){this.cast=[];for(let i=0;i<20;i++){const e=this.castFactory.create({skin:[0xffd8bb,0xd6a073,0x8d5c40][i%3],hair:[0x48352b,0x886947,0x282333][i%3],top:[0xf0b2ba,0x8ccbbd,0x9eadd9,0xf2cd79][i%4],pants:i%2===0,dress:i%2===1,s:1.5});e.g.userData.neighbour=i;e.g.userData.storyNeighbour=i;this.root.add(e.g);this.cast.push(e);}}
  this.venue.cast=this.cast;this.cast.forEach((e,i)=>{e.identity=neighbourIdentity(i,this.venue.profile.roles[i%this.venue.profile.roles.length]);giveNeighbourJob(e,e.identity.job);const side=i%2?-1:1,row=Math.floor(i/2);e.origin=new THREE.Vector3(side*(18+(row%3)*6),0,12-row*6);e.pos.copy(e.origin);e.g.visible=true;});

  this.prize=new THREE.Group();this.prize.name='Story consequence animation';this.prize.visible=false;this.root.add(this.prize);this.toy=homeModel(toy,this.kit);this.prize.add(this.toy);const toySize=new THREE.Box3().setFromObject(this.toy).getSize(new THREE.Vector3());this.prize.scale.setScalar(2/Math.max(.1,toySize.x,toySize.y,toySize.z));
  this.root.updateMatrixWorld(true);this.overviewBounds=this.venue.bounds.clone();this.obstacles=this.venue.obstacles;
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
  if(!reduced){if(d.car_)d.car_.rotation.y=t*.28;if(d.cups)d.cups.rotation.y=-t*.24;if(d.fw){d.fw.rotation.z=t*.09;d.fwG?.forEach(e=>e.g.rotation.z=-t*.09);}d.horses?.forEach(e=>e.h.position.y=1.6+Math.sin(t*2+e.i)*.3);d.spinners?.forEach(m=>{if(m)m.rotation.y=t*.28;});d.wMats?.forEach(m=>{if(m.map)m.map.offset.x=t*.012;});}
  this.venue.cast.forEach((e,i)=>{const near=player&&e.pos.distanceTo(player.position)<5;e.mv=0;if(!reduced&&!this.reaction&&!near&&['deliver','walk','sweep'].includes(e.job)){const x=e.origin.x+Math.sin(t*.24+i)*2,z=e.origin.z+Math.cos(t*.2+i)*1.4;if(this.canWalk(x,z)){e.yaw=Math.atan2(x-e.pos.x,z-e.pos.z);e.pos.set(x,0,z);e.mv=1;}}e.pose=this.reaction?(i%2?'clap':'wave'):near?'wave':jobPose(e.job);this.castFactory.animate(e,reduced?0:dt,t+i);tickNeighbourJob(e,t+i,{busy:!!this.reaction||near,reduced});});
  if(!this.reaction)return false;const a=this.reaction;a.time=Math.min(ORAL_ANIMATION_SECONDS,a.time+dt);const u=a.time/ORAL_ANIMATION_SECONDS;poseToy(this.toy,this.toyId,u,reduced);
  if(!reduced){const k=this.style.kind;if(['travel','cat','sound'].includes(k)){this.toy.position.x=Math.sin(u*Math.PI*2)*.6/this.prize.scale.x;this.toy.position.y=Math.abs(Math.sin(u*Math.PI*3))*.5/this.prize.scale.y;this.toy.rotation.y=u*Math.PI*2;}else if(['dance','theatre','family'].includes(k)){this.toy.rotation.y=u*Math.PI*2;this.toy.position.y=Math.sin(u*Math.PI)*.8/this.prize.scale.y;}else if(['garden','carrot','stationery'].includes(k)){this.toy.scale.setScalar(1.3+Math.sin(u*Math.PI)*.7);this.toy.rotation.z=Math.sin(u*Math.PI*4)*.16;}else{this.toy.position.y=Math.abs(Math.sin(u*Math.PI*3))*.8/this.prize.scale.y;this.toy.rotation.y=Math.sin(u*Math.PI*2)*.7;}}
  if(a.time<ORAL_ANIMATION_SECONDS)return false;this.reaction=null;this.prize.visible=false;player.position.copy(a.start);player.rotation.copy(a.rotation);return true;
 }
 clearView(camera,player,task=null){if(!this.root.visible)return;const focus=this.reaction?[this.prize]:[];this.guard.prepare(this.venue.root.children,player,focus);if(task?.point)this.guard.targets.push({point:task.point.clone(),owner:task.subjects?.[0]||this.prize});this.guard.guard(camera);}
}
