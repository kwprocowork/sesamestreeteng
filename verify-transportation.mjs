import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from './dist/assets/three.module.js';
import {TransportationWorld,TRANSPORTATION} from './dist/transportation.js';
const scene=new THREE.Scene();scene.background=new THREE.Color();
function basic(geo,c,x,y,z,p){const o=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:c}));o.position.set(x,y,z);(p||scene).add(o);return o;}
const kit={cube:(c,x,y,z,w,h,d,p)=>basic(new THREE.BoxGeometry(w,h,d),c,x,y,z,p),cyl:(c,x,y,z,r,h,p)=>basic(new THREE.CylinderGeometry(r,r,h,12),c,x,y,z,p),orb:(c,x,y,z,a,b=a,d=a,p)=>{const o=basic(new THREE.SphereGeometry(1,10,8),c,x,y,z,p);o.scale.set(a,b,d);return o;},rod:(c,a,b,r,p)=>basic(new THREE.CylinderGeometry(r,r,new THREE.Vector3(...a).distanceTo(new THREE.Vector3(...b))),c,...new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5).toArray(),p),labelBoard(){}};
const transportationWorld=new TransportationWorld(scene,kit);
transportationWorld.reset();
const player=new THREE.Group();
const source=fs.readFileSync('dist/game.js','utf8');
const elements=new Map();
const $=id=>{
  if(!elements.has(id))elements.set(id,{hidden:id==='modalShade',querySelector:()=>({})});
  return elements.get(id);
};
let ratings=0;
const ctx=vm.createContext({schoolNextIndex:(key,current,total)=>current+1,
  TRANSPORTATION,transportationWorld,player,phase:'explore',familyIndex:0,
  cameraOrbit:{},beacon:{},$,helpCount:0,guideName:'Grover',
  document:{body:{classList:{remove(){}}}},
  familyWalk(){ctx.phase='explore';},
  stopSpeech(){},stopInput(){},closeModal(){},dialogue(){},speak(){},
  updateSpeakingControls(){},cheerHelpers(){},ratePanel(){ratings++;}
});
for(const name of ['routeTransportation','interactTransportation','transportationActionDone','transportationSpeak','acceptTransportation']){
  const start=source.indexOf('function '+name+'(');
  assert(start>=0);
  vm.runInContext(source.slice(start,source.indexOf('\n}',start)+2),ctx);
}
ctx.routeTransportation(true);
const targets=new Set();
for(const [index,beat] of TRANSPORTATION.beats.entries()){
  const target=transportationWorld.target();
  assert(target.x>=-8.8&&target.x<=8.8&&target.z>=-4.3&&target.z<=7.4);
  targets.add(target.toArray().join(','));
  player.position.set(-8.8,0,7.4);
  ctx.interactTransportation();
  assert.equal(ctx.phase,'explore');
  ctx.acceptTransportation();
  assert.equal(ctx.familyIndex,index);
  player.position.copy(target);
  ctx.interactTransportation();
  assert.equal(ctx.phase,'family-action');
  const timer=transportationWorld.timer;
  assert.equal(transportationWorld.interact(player.position),false);
  transportationWorld.tick(1,true);
  assert.equal(transportationWorld.timer,timer);
  ctx.acceptTransportation();
  assert.equal(ctx.familyIndex,index);
  assert(!transportationWorld.tick(1.8,false));
  if(index<5){
    const {toy,light,runwayLights}=transportationWorld.routes[index];
    assert(light.visible);
    assert(toy.position.z<1.26);
    assert.equal(runwayLights.visible,index===4);
  }else{
    assert(transportationWorld.routes.every(({toy})=>toy.position.z>-1.65));
    assert.match(beat.prompt,/favourite vehicle.*own words/);
  }
  assert(transportationWorld.tick(4,false));
  ctx.transportationActionDone();
  if(index===5){
    assert.equal(ctx.phase,'explore');
    assert(transportationWorld.routes.every(route=>route.pickupMarker.visible));
    player.position.set(0,0,7.4);
    ctx.interactTransportation();
    assert.equal(ctx.phase,'explore');
    ctx.acceptTransportation();
    assert.equal(ratings,0);
    // Each of the five parked toys can be picked independently.
    for(const stop of TRANSPORTATION.beats.slice(0,5)){
      player.position.set(stop.x,0,stop.z+1.26);
      assert.equal(transportationWorld.nearestPickup(player.position),stop);
    }
    ctx.interactTransportation();
    assert.equal(ctx.phase,'family-action');
    assert.equal(transportationWorld.picked.word,'airplane');
    assert(transportationWorld.tick(2,false));
    assert(transportationWorld.routes[4].toy.position.y>1);
    ctx.transportationActionDone();
  }
  assert.equal(ctx.phase,'family-say');
  ctx.interactTransportation();
  assert.equal(ctx.familyIndex,index);
  ctx.acceptTransportation();
}
assert.equal(targets.size,6);
assert.equal(ctx.phase,'rating');
assert.equal(ratings,1);
ctx.acceptTransportation();
assert.equal(ratings,1);
transportationWorld.reset();
assert(transportationWorld.routes.every(({toy,control,light})=>toy.position.z===1.26&&control.visible&&!light.visible));
const camera=new THREE.PerspectiveCamera(43,1,.1,230);
const focus=new THREE.Vector3();
for(const aspect of [.58,1,1.75]){
  camera.aspect=aspect;
  camera.updateProjectionMatrix();
  transportationWorld.reset();
  for(const [index] of TRANSPORTATION.beats.entries()){
    transportationWorld.index=index;
    transportationWorld.interact(transportationWorld.target());
    for(let sample=0;sample<=20;sample++){
      transportationWorld.frame(camera,camera.position,focus);
      camera.lookAt(focus);
      camera.updateMatrixWorld();
      scene.updateMatrixWorld(true);

      const routes=index===5?transportationWorld.routes:[transportationWorld.routes[index]];
      for(const {toy} of routes){
        const {min,max}=new THREE.Box3().setFromObject(toy);
        for(const x of [min.x,max.x])for(const y of [min.y,max.y])for(const z of [min.z,max.z]){
          const point=new THREE.Vector3(x,y,z).project(camera);
          assert(Math.abs(point.x)<1&&Math.abs(point.y)<1,JSON.stringify({aspect,index,sample,point}));
        }
      }
      transportationWorld.tick(transportationWorld.effectTime/20+.00001,false);
    }
  }
}
console.log('PASS: six reachable stops, nearby actions, vehicle movement, paused animations, six manual speaking gates, and replay reset.');
