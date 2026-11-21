import assert from 'node:assert/strict';
import * as THREE from './dist/assets/three.module.js';
import {TaskCamera,avatarObstruction} from './dist/task-camera.js';
import fs from 'node:fs';import vm from 'node:vm';
const avatar=new THREE.Mesh(new THREE.BoxGeometry(2.5,3.8,2.2));avatar.position.set(0,1.9,1.7);
const camera=new THREE.PerspectiveCamera(48,1.6,.1,100),position=new THREE.Vector3(0,4,9),look=new THREE.Vector3(0,1,0);
camera.position.copy(position);camera.lookAt(look);camera.updateMatrixWorld(true);
const focus={key:'item',point:look.clone(),width:1,height:1,force:true};
assert(avatarObstruction(camera,new THREE.Box3().setFromObject(avatar),focus).blocked,'reproduce the back blocking the task');
let views=0,clear=0;
for(const aspect of [.55,.75,1,1.6,2.1])for(const x of [-2,-1,0,1,2])for(const z of [.7,1.7,2.7]){
 avatar.position.set(x,1.9,z);camera.aspect=aspect;camera.updateProjectionMatrix();position.set(0,5,10);look.set(0,1,0);
 const rig=new TaskCamera(),f={...focus,point:focus.point.clone()};
 assert(rig.frame(.05,{focus:f,player:avatar,camera,position,look}));
 camera.position.copy(position);camera.lookAt(look);camera.updateMatrixWorld(true);
 if(!rig.obstructs(camera,avatar,f))clear++;
 assert(position.toArray().every(Number.isFinite));assert(look.clone().project(camera).length()<1.1);
 const saved=avatar.position.clone();rig.obstructs(camera,avatar,f);assert(avatar.position.equals(saved),'camera does not move the player');
 const angle=rig.angle;rig.frame(.05,{focus:f,player:avatar,camera,position,look});assert.equal(rig.angle,angle,'stable angle while standing');views++;
}
assert(clear>views*.35,'side views resolve most non-overlapping approach positions');
const rig=new TaskCamera();rig.manual();assert(!rig.frame(.1,{focus,player:avatar,camera,position,look}));
assert(!rig.frame(2,{focus,player:avatar,camera,position,look,dragging:true}));
assert(!rig.frame(.1,{focus:null,player:avatar,camera,position,look}));assert(!rig.active);
assert(!rig.frame(.1,{focus,player:avatar,camera,position,look,paused:true}));
const source=fs.readFileSync('dist/game.js','utf8');function fn(name){const a=source.indexOf('function '+name+'(');let i=source.indexOf('{',a)+1,d=1;for(;d;i++){if(source[i]==='{')d++;if(source[i]==='}')d--;}return source.slice(a,i);}
let during;const player={visible:true};const ctx=vm.createContext({player,taskCamera:{obstructs:()=>true},renderer:{render(){during=player.visible;}},scene:{},camera:{}});
vm.runInContext(fn('renderStoryTask'),ctx);ctx.renderStoryTask({});assert.equal(during,false);assert(player.visible,'render-only removal restores avatar immediately');
ctx.renderer.render=()=>{throw Error('renderer failed')};assert.throws(()=>ctx.renderStoryTask({}));assert(player.visible,'avatar is restored even after render failure');
console.log('PASS: reproduces avatar obstruction, '+views+' portrait/landscape compositions ('+clear+' clear by angle), stable angles, manual control, pause, and render-only fallback with restoration.');
const walkRig=new TaskCamera(),walker=new THREE.Mesh(new THREE.BoxGeometry(1,3,1));walker.position.set(0,1.5,2);
const walkFocus={key:'walking',point:new THREE.Vector3(0,1,0),width:1.5,height:1.5},walkGoal=new THREE.Vector3(0,5,10),walkLook=new THREE.Vector3(0,1,0);
walkRig.frame(.05,{focus:walkFocus,player:walker,camera,position:walkGoal,look:walkLook});camera.position.copy(walkGoal);camera.lookAt(walkLook);
const offset=camera.position.clone().sub(walkLook),beforeLook=walkLook.clone();walker.position.x+=.2;
assert(walkRig.frame(.05,{focus:walkFocus,player:walker,camera,position:walkGoal,look:walkLook,currentLook:beforeLook,moving:true}));
assert(walkGoal.clone().sub(walkLook).distanceTo(offset)<1e-8,'holding movement keeps the camera heading');assert(Math.abs(walkLook.x-beforeLook.x-.2)<1e-8,'task camera follows translation while moving');
console.log('PASS: camera-relative walking keeps its heading during a task-view departure.');
