import * as THREE from './assets/three.module.js';

// Project the actual animated avatar envelope, including its outfit, against the task.
export function avatarObstruction(camera,box,focus){
 if(box.isEmpty())return {blocked:false,overlap:0};
 camera.updateMatrixWorld(true);
 const point=focus.point.clone().project(camera);
 if(Math.abs(point.x)>1.1||Math.abs(point.y)>1.1||point.z<-1||point.z>1)return {blocked:false,overlap:0};
 const bounds={left:Infinity,right:-Infinity,top:-Infinity,bottom:Infinity};let nearest=Infinity;
 for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
  const p=new THREE.Vector3(x,y,z),local=p.clone().applyMatrix4(camera.matrixWorldInverse);nearest=Math.min(nearest,-local.z);
  p.project(camera);bounds.left=Math.min(bounds.left,p.x);bounds.right=Math.max(bounds.right,p.x);bounds.bottom=Math.min(bounds.bottom,p.y);bounds.top=Math.max(bounds.top,p.y);
 }
 const depth=-focus.point.clone().applyMatrix4(camera.matrixWorldInverse).z;
 if(nearest>=depth-.06)return {blocked:false,overlap:0};
 const scale=1/(Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*Math.max(1,depth)),rx=(focus.width??1)*.5*scale/camera.aspect,ry=(focus.height??1)*.5*scale;
 const w=Math.min(bounds.right,point.x+rx+.035)-Math.max(bounds.left,point.x-rx-.035);
 const h=Math.min(bounds.top,point.y+ry+.035)-Math.max(bounds.bottom,point.y-ry-.035);
 return {blocked:w>0&&h>0,overlap:Math.max(0,w)*Math.max(0,h)};
}

// A selected interaction uses a horizontal two-shot. Characters are never removed.
export class TaskCamera {
 constructor(){this.active=false;this.selected=null;this.elapsed=0;this.lastPhase='explore';this.participants=[];}
 select(focus){if(!focus)return;this.selected=focus;this.elapsed=0;this.active=true;}
 clear(){this.selected=null;this.active=false;this.participants=[];}
 manual(){this.clear();}
 frame(dt,{focus,player,camera,position,look,moving=false,dragging=false,paused=false,phase='explore'}){
  if(paused)return false;
  const changed=phase!==this.lastPhase,previous=this.lastPhase;this.lastPhase=phase;
  if(phase==='explore'&&changed&&previous!=='explore')this.clear();
  // Direct item taps and speaking buttons also enter a selected task phase.
  if(changed&&phase!=='explore'&&focus?.force)this.select(focus);
  if(!player?.visible||dragging||moving){this.clear();return false;}
  if(!this.selected)return false;
  if(!focus&&!['searching','parade-watch','parade-finale','family-end','body-show','family-action','want-response'].includes(phase)){this.clear();return false;}
  this.elapsed+=dt;
  if(phase==='explore'&&!focus?.hold&&this.elapsed>1.6){this.clear();return false;}
  if(!focus&&phase==='explore'){this.clear();return false;}
  const task=focus||this.selected;
  if(focus)this.selected=focus;
  const playerBox=new THREE.Box3().setFromObject(player);
  const bounds=playerBox.clone();
  bounds.expandByPoint(task.point.clone().add(new THREE.Vector3(-(task.width??2)/2,-(task.height??2)/2,0)));
  bounds.expandByPoint(task.point.clone().add(new THREE.Vector3((task.width??2)/2,(task.height??2)/2,0)));
  this.participants=[player,...(task.subjects||[]).filter(actor=>{if(!actor)return false;for(let node=actor;node;node=node.parent)if(!node.visible)return false;return true;})];
  for(const actor of this.participants.slice(1))if(actor.visible)bounds.union(new THREE.Box3().setFromObject(actor));
  const target=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
  const axis=task.point.clone().sub(playerBox.getCenter(new THREE.Vector3()));axis.y=0;
  if(axis.lengthSq()<.04)axis.set(1,0,0);axis.normalize();
  // Use the front-facing side of the pair, so fridge shelves and labels stay readable.
  const side=new THREE.Vector3(-axis.z,0,axis.x);if(side.z<0)side.negate();
  if(Math.abs(side.z)<.4)side.z=.4;side.normalize();
  if(task.frontView)side.set(1.25,0,1).normalize();
  const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)/camera.zoom;
  const horizontal=Math.abs(side.z)*size.x+Math.abs(side.x)*size.z;
  const depth=Math.abs(side.x)*size.x+Math.abs(side.z)*size.z;
  const distance=Math.max(6.8,horizontal/(2*tan*camera.aspect*.78),size.y/(2*tan*.78))+depth*.5;
  look.copy(target);position.copy(target).addScaledVector(side,distance);
  position.y=target.y+.65; // nearly horizontal, with both characters at eye level
  this.active=true;return true;
 }
 obstructs(){return false;}
}
