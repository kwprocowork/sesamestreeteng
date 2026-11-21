import assert from 'node:assert/strict';
import * as THREE from './dist/assets/three.module.js';
import {STATIONERY,StationeryWorld} from './dist/stationery.js';
import {townDestinations} from './dist/town.js';

const scene=new THREE.Scene();
const player=new THREE.Group();
const material=new THREE.MeshBasicMaterial();
function mesh(geometry,x,y,z,parent){
  const object=new THREE.Mesh(geometry,material);
  object.position.set(x,y,z);
  parent.add(object);
  return object;
}
const kit={
  cube:(color,x,y,z,w,h,d,parent)=>mesh(new THREE.BoxGeometry(w,h,d),x,y,z,parent),
  cyl:(color,x,y,z,r,h,parent)=>mesh(new THREE.CylinderGeometry(r,r,h,12),x,y,z,parent),
  orb:(color,x,y,z,a,b,d,parent)=>{
    const object=mesh(new THREE.SphereGeometry(1,10,8),x,y,z,parent);
    object.scale.set(a,b,d);
    return object;
  },
  rod:(color,a,b,r,parent)=>{
    const start=new THREE.Vector3(...a),delta=new THREE.Vector3(...b).sub(start);
    const half=start.addScaledVector(delta,.5);
    const object=mesh(new THREE.CylinderGeometry(r,r,delta.length()),...half.toArray(),parent);
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
    return object;
  },
  labelBoard(){}
};

const world=new StationeryWorld(scene,kit);
world.reset();
const reachable=new Set();
const front=[[-9,24]];
for(let i=0;i<front.length;i++){
  const [x,z]=front[i],key=x+','+z;
  if(reachable.has(key)||x<-35||x>35||z<-17||z>29||!world.canWalk(x/4,z/4))continue;
  reachable.add(key);
  front.push([x+1,z],[x-1,z],[x,z+1],[x,z-1]);
}
const camera=new THREE.PerspectiveCamera(43,1,.1,100);
const look=new THREE.Vector3(),pointer=new THREE.Vector3();
const goal=townDestinations({[STATIONERY.id]:STATIONERY}).find(place=>place.id===STATIONERY.id);
assert.equal(goal.name,STATIONERY.title);
assert.equal(goal.district,'Storybook Village');
const uniqueWords=new Set(STATIONERY.beats.map(beat=>beat.word));
assert.deepEqual([...uniqueWords],['book','bag','pencil','crayon']);

for(const [i,beat] of STATIONERY.beats.entries()){
  world.index=i;
  const target=world.target();
  world.target().setY(20);
  assert.equal(world.target().y,0);
  assert(reachable.has(Math.round(target.x*4)+','+Math.round(target.z*4)),beat.station);
  player.position.set(-8.8,0,7.4);
  assert(!world.interact(player.position));
  player.position.copy(target);
  assert(world.interact(player.position));
  assert(!world.interact(player.position));
  assert(!world.tick(2,player,{paused:true}));
  assert(world.effectTime<.01);
  if(beat.station==='crayon'){
    assert(!world.tick(.45,player));
    assert(world.busPaint.visible&&world.busPaint.scale.x<1);
  }
  assert(world.tick(2,player,{reduced:i%2===1}));
  scene.updateMatrixWorld(true);
  if(beat.station==='teacher')assert(world.props.teacher.node.visible&&!world.carrying);
  if(beat.station==='book')assert(world.props.book.hinge.rotation.z>2);
  if(beat.station==='bag')assert(world.props.bag.hinge.rotation.x<-1);
  if(beat.station==='pencil')assert(world.trace.every(line=>line.visible));
  if(beat.station==='crayon')assert(world.busPaint.visible&&world.carrying);
  if(beat.station.startsWith('sticker-')){
    const {pick,sticker,end}=world.stickerCards[beat.word];
    assert(!pick.visible&&sticker.visible);
    assert(sticker.position.distanceTo(end)<.001);
    for(const aspect of [.61,1,2.3]){
      camera.aspect=aspect;
      camera.updateProjectionMatrix();
      world.frame(aspect,camera.position,look);
      camera.lookAt(look);
      camera.updateMatrixWorld(true);
      sticker.getWorldPosition(pointer).project(camera);
      assert(Math.abs(pointer.x)<.91&&Math.abs(pointer.y)<.91);
    }
  }
}
assert(Object.values(world.stickerCards).every(({sticker})=>sticker.visible));
assert(world.showPaper.visible);
assert.equal(STATIONERY.beats.at(-1).starter.match(/\./g).length,2);
world.reset();
assert(!world.showPaper.visible&&!world.busPaint.visible&&!world.carrying);
assert(world.trace.every(line=>!line.visible));
assert(Object.values(world.stickerCards).every(({sticker,pick})=>!sticker.visible&&pick.visible));
console.log('PASS: town entry, 12 reachable actions, near-only activation, animation pause, visible classroom changes, chart framing, two-sentence support and clean replay.');
