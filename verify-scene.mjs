import {STATIONERY} from './dist/stationery.js';
import {HOUSE_DOOR} from './dist/town-house.js';
import {createHouseLabel} from './dist/playhouse-design.js';
import {DiscoveryRoom} from './dist/discovery-room.js';
import {RABBIT_STORY} from './dist/rabbit-delivery.js';
import {LivingEnvironment} from './dist/environment.js';
import {PhonicsWorld} from './dist/phonics-world.js';
import {choosePhonicsPair} from './dist/phonics.js';
import {addSignatureHair} from './dist/character-design.js';
import {BodyMissionWorld} from './dist/body-world.js';
import {WantWorld,createWantRound} from './dist/wants.js';
import * as THREE from './dist/assets/three.module.js';
import fs from 'node:fs';
import vm from 'node:vm';
import {LESSONS,ALPHABET_STEPS,createVocabularyRound} from './dist/learning.js';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/game.js','utf8');
function fn(name){const start=source.indexOf('function '+name+'(');let i=source.indexOf('{',start)+1,depth=1;for(;depth;i++){if(source[i]==='{')depth++;if(source[i]==='}')depth--}return (source.slice(Math.max(0,start-6),start)==='async '?'async ':'')+source.slice(start,i)}
const sourceCharacters=source.slice(source.indexOf('const CHARACTERS='),source.indexOf('const DEFAULT='));
let renderCount=0;class RendererStub{constructor(){this.shadowMap={};this.domElement={toDataURL:()=> 'portrait'};}setPixelRatio(){}setSize(){}setClearColor(){}getClearColor(c){return c.set(0xffffff)}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld();scene.traverse(o=>{assert(o.matrixWorld.elements.every(Number.isFinite),'finite scene transform');});renderCount++;}}
const elements=new Map();const $=id=>{if(!elements.has(id))elements.set(id,{hidden:false,textContent:'',appendChild(){},style:{},getBoundingClientRect:()=>({width:1200,height:700}),querySelector:()=>({textContent:''})});return elements.get(id)};
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){},measureText:text=>({width:text.length*80})})})};
const ctx=vm.createContext({STATIONERY,stationeryWorld:null,createHouseLabel,SceneGraphics:class{update(){}},DiscoveryRoom,RABBIT_STORY,rabbitWorld:null,LivingEnvironment,environment:null,PhonicsWorld,choosePhonicsPair,phonicsPair:['A','F'],phonicsPool:['A','F'],addSignatureHair,BodyMissionWorld,bodyWorld:null,phonicsWorld:null,selected:null,THREE:{...THREE,WebGLRenderer:RendererStub},$: $,devicePixelRatio:1,window:{addEventListener(){}},document:{createElement:()=>({width:512,height:128,getContext:()=>({beginPath(){},roundRect(){},fill(){},fillRect(){},fillText(){}})})},resize(){},animate(){},setupCameraDrag(){},phase:'test',WantWorld,LESSONS,ALPHABET_STEPS,createVocabularyRound,renderChoices(){},toast(){},console,loadArt:async()=>({texture:new THREE.Texture(),aspect:.74,portrait:'portrait'})});
vm.runInContext(sourceCharacters+`let discoveryRoom=null;let scene,camera,renderer,player,rosita,ball,beacon,boxLid,portraits={};let wantWorld=null;let garden,roomNodes=[],gardenItems=[],butterflyWings=[],lesson='ball',alphaSteps=ALPHABET_STEPS.map(item=>({...item,z:-1.35})),helperCast,guideSpot,ambientHelpers=[];const sphereGeo=new THREE.SphereGeometry(1,40,28),mats=new Map(),furCache=new Map(),boxCache=new Map();const lookCurrent=new THREE.Vector3();const INTRO_SECONDS=10;`,ctx);
for(const name of ['mat','mesh','cube','orb','cyl','rod','fur','puppet','snuffyModel','rod','labelBoard','buildGarden','randomizeVocabularyGarden','setLessonLabels','setLessonWorld','setCharacterPose','toyboxStar','decorateRoom','introPose','initWorld','applyCameraOrbit','buildSupportCast','prepareNPCMaterials','parkGuide','npcObstructs','updateSupportCast'])vm.runInContext(fn(name),ctx);
vm.runInContext('initWorld()',ctx);await new Promise(resolve=>setImmediate(resolve));
ctx.assertFinite=geo=>{const p=geo.getAttribute('position');if(p)for(const v of p.array)assert(Number.isFinite(v));};
const info=vm.runInContext(`(()=>{let meshes=0;scene.traverse(o=>{if(o.isMesh){meshes++;assertFinite(o.geometry)}});return {meshes,characters:player.children.length,headHeight:new THREE.Box3().setFromObject(player).max.y,roomWidth:new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3()).x}})()`,ctx);
assert(info.meshes>300);assert(info.headHeight>2.5);assert.equal(vm.runInContext("player.userData.arms.length===2 && player.userData.legs.length===2",ctx),true);assert(info.roomWidth>=21);
for(const destination of [new THREE.Vector3(-4,.7,-1),new THREE.Vector3(0,2.05,-1.2),new THREE.Vector3(4,.36,-1.2)]){ctx.destination=destination;const pose=vm.runInContext('introPose(10,destination)',ctx);assert(Math.abs(pose.x-destination.x)<1e-9);assert(Math.abs(pose.y-destination.y)<1e-9);assert(Math.abs(pose.z-destination.z)<1e-9);assert.equal(pose.playing,false);for(let t=0;t<=10;t+=.1){ctx.t=t;const p=vm.runInContext('introPose(t,destination)',ctx);assert(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z));assert(p.y>=.35)}}
const html=fs.readFileSync('dist/index.html','utf8');assert(html.indexOf('id="dialogueDock"')>html.indexOf('</main>'),'dialogue outside playfield');assert.equal((html.match(/data-direction=/g)||[]).length,4);assert(source.includes("Little child, seems that you could not find your ball. What should you ask?"));
console.log('PASS: actual 3D scene builds, sculpted 3D actors and letter garden, finite geometry, enlarged room, 10-second intro paths for all hiding places, docked dialogue, four movement keys.',info);

const orbitResult=vm.runInContext(`(()=>{const target=new THREE.Vector3(1,1,1),pos=new THREE.Vector3(1,5,11),before=pos.distanceTo(target);applyCameraOrbit(pos,target,{yaw:Math.PI/2,pitch:0});return {before,after:pos.distanceTo(target),x:pos.x,z:pos.z}})()`,ctx);assert(Math.abs(orbitResult.before-orbitResult.after)<1e-9);assert(orbitResult.x>10);assert(Math.abs(orbitResult.z-1)<1e-8);assert(!source.includes('depthTest:false'));assert(!source.includes('labelSprite'));console.log('PASS: camera orbit preserves distance; no depth-ignoring decoration sprites.');

vm.runInContext("lesson='letters';setLessonWorld()",ctx);assert.equal(vm.runInContext('garden.visible && roomNodes.every(o=>!o.visible) && gardenItems.length===4',ctx),true);vm.runInContext("lesson='ball';setLessonWorld()",ctx);assert.equal(vm.runInContext('!garden.visible && roomNodes.every(o=>o.visible)',ctx),true);for(const name of ['Elmo','Cookie Monster','Grover','Rosita','Zoe','Bert','Ernie','Julia','Oscar','Snuffleupagus','Tamir','Ji-Young']){ctx.name=name;vm.runInContext(`(()=>{const actor=puppet(CHARACTERS.find(c=>c.name===name));actor.updateMatrixWorld(true);actor.traverse(o=>{if(o.isMesh)assertFinite(o.geometry)})})()`,ctx)}console.log('PASS: both 3D worlds switch cleanly, all four garden items, all twelve 3D character meshes have finite geometry.');

assert.equal(vm.runInContext("npcObstructs(new THREE.Vector3(0,0,5),new THREE.Vector3(0,0,10),new THREE.Vector3(0,0,0))",ctx),true);assert.equal(vm.runInContext("npcObstructs(new THREE.Vector3(4,0,5),new THREE.Vector3(0,0,10),new THREE.Vector3(0,0,0))",ctx),false);assert.equal(vm.runInContext("npcObstructs(new THREE.Vector3(0,0,-5),new THREE.Vector3(0,0,10),new THREE.Vector3(0,0,0))",ctx),false);assert.equal(vm.runInContext('ambientHelpers.length===2 && rosita.position.x>6 && !!guideSpot',ctx),true);assert.equal(vm.runInContext('rosita.children[0].material!==mat(CHARACTERS[3].color)',ctx),true);console.log('PASS: two supporting NPCs, fixed yellow guide station, isolated NPC materials, and camera-to-target occlusion detection.');

vm.runInContext('randomizeVocabularyGarden()',ctx);assert.equal(vm.runInContext('alphaSteps.every(item=>{const object=gardenItems.find(entry=>entry.word===item.word);return object.root.position.x===item.x&&object.root.position.z===item.z&&object.thing.visible})',ctx),true);console.log('PASS: shuffled vocabulary locations move each whole station including its object, pedestal and label.');

vm.runInContext("lesson='wants';setLessonWorld()",ctx);assert.equal(vm.runInContext('wantWorld.root.visible&&!garden.visible&&roomNodes.every(o=>!o.visible)&&wantWorld.stations.size===6',ctx),true);vm.runInContext("wantWorld.offer('milk');wantWorld.tick(3)",ctx);assert.equal(vm.runInContext('wantWorld.happy&&wantWorld.milkBottle.visible',ctx),true);vm.runInContext("lesson='ball';setLessonWorld()",ctx);assert.equal(vm.runInContext('!wantWorld.root.visible&&roomNodes.every(o=>o.visible)',ctx),true);console.log('PASS: new six-food 3D playhouse, baby/caregiver ending, and clean switching across all three lesson worlds.');

vm.runInContext("lesson='body';setLessonWorld();scene.updateMatrixWorld(true)",ctx);assert(ctx.bodyWorld.root.visible);assert.equal(ctx.bodyWorld.stations.length,2);assert(vm.runInContext('!garden.visible && !wantWorld.root.visible',ctx));vm.runInContext("lesson='wants';setLessonWorld()",ctx);assert(!ctx.bodyWorld.root.visible);assert(vm.runInContext('wantWorld.root.visible',ctx));console.log('PASS: Body Boogie park creates real Sesame Street friends and switches cleanly with the playhouse.');

vm.runInContext("lesson='phonics';setLessonWorld();scene.updateMatrixWorld(true)",ctx);assert(ctx.phonicsWorld.root.visible);assert.equal(ctx.phonicsWorld.entities.length,4);assert(!ctx.bodyWorld.root.visible);assert(vm.runInContext('!garden.visible && !wantWorld.root.visible',ctx));vm.runInContext("lesson='ball';setLessonWorld()",ctx);assert(!ctx.phonicsWorld.root.visible);console.log('PASS: Phonics park builds through the actual scene switcher and leaves other chapter roots hidden.');

const clearance=vm.runInContext(`CHARACTERS.map(c=>{const actor=puppet(c);const b=new THREE.Box3().setFromObject(actor);return {name:c.name,height:b.max.y,width:b.max.x-b.min.x};})`,ctx);
for(const actor of clearance){assert(actor.height+.5<HOUSE_DOOR.height,actor.name+' headroom including accessory allowance');assert(actor.width+.3<HOUSE_DOOR.width,actor.name+' shoulder clearance');}
console.log('PASS: all selectable characters fit the enlarged entrance with head and shoulder clearance.',clearance);

// Real character rigs, including Snuffy's trunk, hair and Abby's wings, against task views.
const {TaskCamera}=await import('./dist/task-camera.js');
let taskChecks=0;
for(const name of vm.runInContext('CHARACTERS.map(c=>c.name)',ctx)){
 ctx.name=name;const actor=vm.runInContext('puppet(CHARACTERS.find(c=>c.name===name))',ctx);
 actor.position.set(0,0,1.8);
 for(const aspect of [.6,1.6])for(const y of [.4,1.3,2.5]){
  const camera=new THREE.PerspectiveCamera(48,aspect,.1,100),goal=new THREE.Vector3(0,5,10),look=new THREE.Vector3(0,y,0);
  const rig=new TaskCamera(),focus={key:name+y,point:look.clone(),width:1.8,height:1.8,force:true};
  rig.select(focus);assert(rig.frame(.05,{focus,player:actor,camera,position:goal,look}));camera.position.copy(goal);camera.lookAt(look);camera.updateMatrixWorld(true);
  const hide=rig.obstructs(camera,actor,focus);assert(typeof hide==='boolean');assert(goal.toArray().every(Number.isFinite));
  const projected=focus.point.clone().project(camera);assert(Math.abs(projected.x)<.95&&Math.abs(projected.y)<.95,'task stays in view alongside the player');taskChecks++;
 }
}
console.log('PASS: '+taskChecks+' close-task compositions with all actual selectable character rigs in portrait and landscape.');

const kitchen=vm.runInContext('wantWorld',ctx);kitchen.root.visible=true;kitchen.fridgeOpen=true;kitchen.door.rotation.y=-2.65;
let shelfChecks=0;
for(let run=0;run<12;run++){
 const round=createWantRound();kitchen.reset(round);kitchen.fridgeOpen=true;kitchen.door.rotation.y=-2.65;kitchen.root.updateMatrixWorld(true);
 const view=new THREE.PerspectiveCamera(48,1.6,.1,100);view.position.set(.9,2.9,1.5);view.lookAt(3.1,1.8,-4.5);view.updateMatrixWorld(true);
 for(const item of round.filter(item=>item.location==='fridge')){
  const food=kitchen.stations.get(item.word).food,bounds=new THREE.Box3().setFromObject(food);
  const row=[.14,1.08,2.03].indexOf(item.y),top=[.97,1.92,3.55][row];
  assert(bounds.max.y<top-.01,item.word+' fits below the shelf above');
  const centre=bounds.getCenter(new THREE.Vector3()),ndc=centre.clone().project(view),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(ndc.x,ndc.y),view);
  assert.equal(kitchen.pick(ray),item.word,'each visible food remains selectable');
  const hit=ray.intersectObject(kitchen.root,true).find(hit=>hit.object.isMesh);
  assert.equal(hit?.object.userData.foodWord,item.word,item.word+' is not hidden by a shelf, door or label');shelfChecks++;
 }
}
console.log('PASS: '+shelfChecks+' actual fridge food bounds, direct visible rays and food selection across randomized layouts.');
