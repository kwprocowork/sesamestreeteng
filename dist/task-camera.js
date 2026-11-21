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

export class TaskCamera {
 constructor(){this.probe=new THREE.PerspectiveCamera();this.box=new THREE.Box3();this.active=false;this.key='';this.angle=0;this.grace=0;this.envelopes=new Map();this.lastPlayer=new THREE.Vector3();this.composed=false;}
 manual(){this.grace=1.5;}
 frame(dt,{focus,player,camera,position,look,moving=false,dragging=false,paused=false,occluders=[player],currentLook=look}){
  this.walking=false;this.grace=Math.max(0,this.grace-dt);
  if(!focus||!player?.visible||paused){this.active=false;this.key='';this.envelopes.clear();this.composed=false;return false;}
  const delta=player.position.clone().sub(this.lastPlayer);this.lastPlayer.copy(player.position);
  // Preserve heading for camera-relative controls until movement is released.
  if(moving&&!focus.force&&this.composed&&!dragging&&this.grace===0){
   this.walking=true;this.active=true;position.copy(camera.position).add(delta);look.copy(currentLook).add(delta);return true;
  }
  const approach=focus.approach||focus.point,distance=Math.hypot(player.position.x-approach.x,player.position.z-approach.z);
  const same=this.key===focus.key;
  this.active=!!focus.force||distance<(same?4.5:3.5);
  if(!this.active){this.key='';this.composed=false;return false;}
  // Keep camera-relative walking predictable; compose the view when the child stops.
  if(dragging||this.grace>0||moving&&!focus.force)return false;
  const target=focus.authored&&!focus.exactFocus?look.clone():focus.point.clone();
  focus.point.copy(target);
  for(const actor of this.envelopes.keys())if(!occluders.includes(actor))this.envelopes.delete(actor);
  const boxes=occluders.map(actor=>{if(!this.envelopes.has(actor))this.envelopes.set(actor,new THREE.Box3());return this.envelopes.get(actor).setFromObject(actor);});
  const offset=position.clone().sub(look),distanceToTarget=offset.length();
  const width=focus.width??2.6,height=focus.height??2.6,tan=Math.tan(THREE.MathUtils.degToRad(camera.fov)/2);
  const distanceGoal=focus.authored?distanceToTarget:Math.max(6.4,width*.72/(tan*camera.aspect),height*.75/tan);
  const elevation=focus.elevation??(focus.authored?offset.y:Math.max(2.8,Math.min(4.3,distanceGoal*.4)));
  const radius=focus.authored?Math.max(1,Math.hypot(offset.x,offset.z)):distanceGoal;
  const base=focus.authored?Math.atan2(offset.x,offset.z):0,maxAngle=focus.maxAngle??1.12;
  const angles=[0,-.55,.55,-.86,.86,-maxAngle,maxAngle].filter(a=>Math.abs(a)<=maxAngle+.001);
  if(same)angles.unshift(this.angle);
  this.probe.zoom=camera.zoom;this.probe.fov=camera.fov;this.probe.aspect=camera.aspect;this.probe.near=camera.near;this.probe.far=camera.far;this.probe.updateProjectionMatrix();
  let best=null;
  for(const angle of angles){
   const at=new THREE.Vector3(target.x+Math.sin(base+angle)*radius,target.y+elevation,target.z+Math.cos(base+angle)*radius);
   if(focus.indoor){at.x=THREE.MathUtils.clamp(at.x,-10.5,10.5);at.y=Math.min(at.y,6.6);at.z=Math.max(at.z,-3.3);}
   this.probe.position.copy(at);this.probe.lookAt(target);this.probe.updateMatrixWorld(true);
   const obstructionScore=boxes.reduce((total,box)=>{const hit=avatarObstruction(this.probe,box,focus);return total+(box.containsPoint(at)?5000:0)+(hit.blocked?100+hit.overlap*100:0);},0);
   const score=obstructionScore+Math.abs(angle)*.5+(same?Math.abs(angle-this.angle)*.8:0);
   if(!best||score<best.score)best={at,score,angle};
  }
  this.composed=true;this.key=focus.key;this.angle=best.angle;position.copy(best.at);look.copy(target);return true;
 }
 obstructs(camera,player,focus){
  if(!this.active||!focus||!player.visible)return false;
  this.box.setFromObject(player);
  return avatarObstruction(camera,this.box,focus).blocked;
 }
}
