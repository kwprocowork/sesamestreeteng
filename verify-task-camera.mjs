import assert from 'node:assert/strict';
import * as THREE from './dist/assets/three.module.js';
import {TaskCamera} from './dist/task-camera.js';
import fs from 'node:fs';
let count=0;
for(const aspect of [.55,.75,1,1.6,2.1])for(const x of [-2,0,2])for(const z of [1,2,3]){
 const player=new THREE.Mesh(new THREE.BoxGeometry(2.5,3.8,2.2));player.position.set(x,1.9,z);
 const npc=new THREE.Mesh(new THREE.BoxGeometry(1.5,3,1.5));npc.position.set(0,1.5,-1);
 const camera=new THREE.PerspectiveCamera(48,aspect,.1,100),position=new THREE.Vector3(0,5,10),look=new THREE.Vector3(0,1,0),rig=new TaskCamera();
 const focus={key:'npc',point:new THREE.Vector3(0,1.5,-1),approach:new THREE.Vector3(0,0,1),width:2,height:3,subjects:[npc]};
 const args={focus,player,camera,position,look,phase:'explore'};
 assert(!rig.frame(.1,args),'approaching a task never changes camera');rig.select(focus);assert(rig.frame(.1,args));
 camera.position.copy(position);camera.lookAt(look);camera.updateMatrixWorld(true);
 for(const actor of [player,npc]){
  assert(actor.visible);const box=new THREE.Box3().setFromObject(actor);
  for(const a of [box.min.x,box.max.x])for(const b of [box.min.y,box.max.y])for(const c of [box.min.z,box.max.z]){
   const p=new THREE.Vector3(a,b,c).project(camera);assert(Math.abs(p.x)<.99&&Math.abs(p.y)<.99,'both complete silhouettes fit');
  }
 }
 const pp=player.position.clone().project(camera),np=npc.position.clone().project(camera);
 assert(Math.abs(pp.x-np.x)>.05,'player and NPC separated left/right');assert(Math.abs(position.y-look.y)<.7,'nearly horizontal');
 assert(!rig.obstructs(camera,player,focus));assert(!rig.frame(.1,{...args,moving:true}));assert(!rig.active);
 rig.select(focus);rig.frame(.1,{...args,phase:'body-say',focus:{...focus,force:true}});assert(rig.active);rig.frame(15,{...args,phase:'body-say',focus:{...focus,force:true}});assert(rig.active,'no speaking timeout');
 assert(!rig.frame(.1,args));assert(!rig.active,'normal view resumes on task completion');
 rig.select(focus);assert(!rig.frame(2,args),'short exploration animation returns to normal');
 count++;
}
const source=fs.readFileSync('dist/game.js','utf8');
assert(!source.includes('playerWasVisible'));assert(!source.includes('for(const actor of hidden)actor.visible=false'));
assert(source.includes('tapTaskMarker'));assert(source.includes('selectTaskView();'));
console.log(`PASS: ${count} selected horizontal two-shots; full silhouettes, left/right separation, walking, timeout-free speech, restoration, and no render-time avatar omission.`);
