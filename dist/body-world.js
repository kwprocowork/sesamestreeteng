import * as THREE from './assets/three.module.js';
import {BODY_WORDS,validBodyWords} from './body.js?v=74a';
import {shuffled} from './learning.js?v=74a';
export const PAIRED_PARTS=new Set(['eye','ear','eyebrow','cheek','shoulder','arm','elbow','hand','finger','hip','leg','knee','ankle','foot','toe']);
export const FACE_PARTS=new Set(['hair','head','eye','ear','eyebrow','forehead','nose','cheek','lip','mouth','tooth','tongue','chin']);
export function missionLabel(m){return `${m.side?m.side+' ':''}${m.word}`;}
export function missionSentence(m){return `This is the ${missionLabel(m)}.`;}
export function missionQuestion(m){return `Can you show me where the ${missionLabel(m)} is?`;}
export function createBodyMissions(words,sides=true,random=Math.random){
 const first=shuffled(validBodyWords(words),random).map((word,i)=>({word,side:sides&&PAIRED_PARTS.has(word)?(random()<.5?'left':'right'):'',round:0}));
 const relay=shuffled(first,random).map(m=>({...m,side:m.side?(m.side==='left'?'right':'left'):'',round:1}));
 return first.concat(relay).map((m,i)=>({...m,actorIndex:i%2}));
}
export function matchesBodyPart(part,mission){return !!part&&part.word===mission.word&&(!mission.side||part.side===mission.side);}
const zoneGeometry=new THREE.SphereGeometry(1,18,12);
const invisible=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false});
export class BodyMissionWorld{
 constructor(scene,kit){this.kit=kit;this.root=new THREE.Group();this.root.visible=false;scene.add(this.root);this.castRoot=new THREE.Group();this.root.add(this.castRoot);this.stations=[];this.stars=[];this.castKey='';this.active=0;this.finishTarget=new THREE.Vector3(0,0,-3.35);this.buildPark();}
 buildPark(){const {orb,cube,cyl,labelBoard}=this.kit,g=this.root;
 cyl(0xa6c98c,0,-.12,0,11.5,.2,g);cube(0xe9d6a4,0,.01,2,2,.04,9,g);for(const side of[-1,1])for(let i=0;i<6;i++)cube(0xe4cda0,side*(1.25+i*.55),.02,1.8-i*.45,.55,.045,.7,g);
 for(const [x,z]of[[-8,-4],[8,-4],[-8,5],[8,5]]){cyl(0xa27a4b,x,1,z,.18,2,g);orb(0x79ad72,x,2.8,z,1.1,1.4,1.1,g);orb(0x92bc7e,x+.6,2.5,z,.85,.95,.9,g);}
 cyl(0xc79963,0,.2,-4.5,2.4,.4,g);cyl(0xe9c580,0,.43,-4.5,2.3,.08,g);labelBoard('BOOGIE!',0,3.65,-5.8,4.7,g);
 for(let i=0;i<11;i++){const o=orb([0xf2cc6f,0xdb9d9e,0x95c3bf][i%3],-5+i,3.7+Math.sin(i)*.15,-5.7,.12,.16,.12,g);this.stars.push(o);}
 for(const [x,z]of[[-5.9,-1.5],[5.9,-1.5]]){cyl(0xc69f71,x,.38,z,.15,.7,g);orb(0xf3d582,x,1,z,.23,.3,.23,g);}
 }
 setCast(specs){const key=specs.map(s=>s.name).join('|');if(key===this.castKey)return;this.castKey=key;
 while(this.castRoot.children.length)this.castRoot.remove(this.castRoot.children[0]);this.stations=[];
 specs.forEach((spec,i)=>{const actor=this.kit.puppet(spec,true);actor.position.set(i===0?-4:4,0,-1.6);actor.scale.setScalar(1.12);this.castRoot.add(actor);const station={actor,spec,zones:[],approach:new THREE.Vector3(actor.position.x+(i===0?1.55:-1.55),0,.7)};this.stations.push(station);this.addAnatomy(station);const ring=new THREE.Mesh(new THREE.TorusGeometry(.9,.035,6,48),new THREE.MeshStandardMaterial({color:0xffd465}));ring.rotation.x=-Math.PI/2;ring.position.set(actor.position.x,.035,actor.position.z);this.castRoot.add(ring);station.ring=ring;this.kit.labelBoard(spec.name,actor.position.x,3.95,-1.85,1.9,this.castRoot);});
 }
 addAnatomy(station){const {actor,spec}=station,{orb,cube}=this.kit,c=spec.color,bert=spec.name==='Bert',headWidth=bert?.43:.61;
 // Small model details make every selected poster word identifiable on the real actor.
 for(const side of[-1,1]){orb(c,side*(headWidth+.05),2.08,.05,.12,.2,.11,actor);orb(0xd69770,side*(headWidth+.085),2.08,.135,.055,.1,.022,actor);}
 cube(0xfff7dc,-.10,1.885,.627,.12,.10,.035,actor);cube(0xfff7dc,.05,1.885,.627,.12,.10,.035,actor);
 orb(0xbf7772,0,1.955,.626,.31,.025,.02,actor);
 const zone=(word,side,pos,scale,parent=actor)=>{const proxy=new THREE.Mesh(zoneGeometry,invisible);proxy.position.set(...pos);proxy.scale.set(...scale);proxy.userData.part={word,side};proxy.userData.radius=Math.max(...scale);parent.add(proxy);station.zones.push(proxy);return proxy;};
 zone('head','',[0,2.02,.02],[headWidth,bert?.72:.55,.49]);zone('hair','',[bert?0:.06,bert?2.96:2.73,0],[bert?.30:.49,bert?.25:.24,.25]);zone('forehead','',[0,2.53,.38],[.24,.10,.10]);zone('nose','',[0,2.055,.68],[.18,bert?.28:.22,.19]);zone('mouth','',[0,1.82,.61],[.34,.15,.07]);zone('lip','',[0,1.955,.63],[.31,.036,.045]);zone('tooth','',[-.1,1.885,.65],[.062,.052,.04]).userData.part.index=0;zone('tooth','',[.05,1.885,.65],[.062,.052,.04]).userData.part.index=1;zone('tongue','',[0,1.74,.63],[.15,.045,.035]);zone('chin','',[0,bert?1.38:1.53,.32],[.21,.09,.12]);zone('throat','',[0,1.49,.26],[.15,.10,.13]);zone('chest','',[0,1.23,.36],[.32,.17,.12]);zone('stomach','',[0,.94,.38],[.30,.15,.12]);zone('waist','',[0,.70,.30],[.30,.06,.13]);
 for(const side of[-1,1]){const label=side===1?'left':'right',index=side===-1?0:1,arm=actor.userData.arms[index],leg=actor.userData.legs[index];arm.rotation.z=side*.62;arm.rotation.x=-.05;
 zone('eye',label,[side*.205,2.3,.55],[.18,.21,.12]);zone('eyebrow',label,[side*.17,2.47,.46],[.17,.045,.07]);zone('ear',label,[side*(headWidth+.07),2.08,.10],[.12,.20,.12]);zone('cheek',label,[side*.32,2.02,.40],[.13,.12,.10]);zone('shoulder',label,[side*.46,1.4,0],[.17,.15,.19]);zone('arm',label,[side*.13,-.25,0],[.18,.31,.18],arm);zone('elbow',label,[side*.19,-.39,.03],[.14,.09,.15],arm);zone('hand',label,[side*.21,-.57,.07],[.23,.20,.22],arm);for(let f=0;f<4;f++)zone('finger',label,[side*.21+(f-1.5)*.075,-.67,.12],[.047,.105,.052],arm).userData.part.index=f;
 zone('hip',label,[side*.3,.59,.12],[.16,.12,.22]);zone('leg',label,[0,-.10,0],[.19,.29,.19],leg);zone('knee',label,[0,-.02,.17],[.16,.09,.10],leg);zone('ankle',label,[0,-.21,.04],[.12,.07,.13],leg);zone('foot',label,[0,-.32,.20],[.26,.15,.34],leg);for(let j=-1;j<=1;j++)zone('toe',label,[j*.12,-.33,.43],[.075,.065,.10],leg).userData.part.index=j+1;
 for(let j=-1;j<=1;j++)orb(c,j*.12,-.33,.43,.075,.065,.10,leg);
 }
 if(!bert){for(const side of[-1,1])cube(0x392b29,side*.18,2.48,.44,.25,.04,.06,actor);}
 }
 activate(index){this.active=index;this.clearHighlight();this.stations.forEach((s,i)=>s.ring.material.color.set(i===index?0xffd05c:0xaec7a0));}
 target(index=this.active){return this.stations[index].approach.clone();}
 near(position,index=this.active){return position.distanceTo(this.target(index))<1.75;}
 pick(raycaster,mission){this.root.updateMatrixWorld(true);const station=this.stations[mission.actorIndex],hits=raycaster.intersectObjects(station.zones,false);if(!hits.length)return null;const match=hits.find(h=>matchesBodyPart(h.object.userData.part,mission));return (match||hits.sort((a,b)=>a.object.userData.radius-b.object.userData.radius)[0]).object.userData.part;}
 highlight(mission,picked=null){this.clearHighlight();const station=this.stations[mission.actorIndex];for(const proxy of station.zones.filter(z=>matchesBodyPart(z.userData.part,mission)&&(picked?.index===undefined||z.userData.part.index===picked.index))){const halo=new THREE.Mesh(zoneGeometry,new THREE.MeshBasicMaterial({color:0xffdc75,wireframe:true,transparent:true,opacity:.7,depthTest:true}));halo.scale.setScalar(1.13);proxy.add(halo);this.halos??=[];this.halos.push(halo);}}
 clearHighlight(){for(const halo of this.halos||[]){halo.removeFromParent();halo.material.dispose();}this.halos=[];}
 cameraPose(mission,close=false){const station=this.stations[mission.actorIndex],a=station.actor;if(close){this.root.updateMatrixWorld(true);const zone=station.zones.find(z=>matchesBodyPart(z.userData.part,mission)),target=zone.getWorldPosition(new THREE.Vector3());target.z-=.07;return {position:new THREE.Vector3(target.x,Math.max(.75,target.y+.15),target.z+2.7),target};}return {position:new THREE.Vector3(a.position.x,2.25,a.position.z+6.1),target:new THREE.Vector3(a.position.x,1.55,a.position.z+.1)};}
 tick(time,celebrate=false){if(!this.root.visible)return;for(const [i,s]of this.stations.entries()){s.actor.position.y=celebrate?Math.abs(Math.sin(time*5+i))*.17:0;s.actor.rotation.y=celebrate?Math.sin(time*2+i)*.15:0;for(const [j,arm]of s.actor.userData.arms.entries())arm.rotation.z=celebrate?(j===0?-1.1:1.1)+Math.sin(time*7)*.2:(j===0?-.62:.62);}this.stars.forEach((o,i)=>{o.position.y=3.7+Math.sin(time*2+i)*.13;o.rotation.z=Math.sin(time+i)*.4;});}
}
