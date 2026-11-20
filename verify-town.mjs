import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from './dist/assets/three.module.js';
import {LESSONS} from './dist/learning.js';
import {signLines} from './dist/town-architecture.js';
import {RABBIT_STORY} from './dist/rabbit-delivery.js';
import {HOME, ROOM, PLAY_LIMIT, TRAVEL_TIME, TownWorld, playBudget, playDay, routeTo, routePoint, townDestinations} from './dist/town.js';

const lessons={...LESSONS,[RABBIT_STORY.id]:RABBIT_STORY,'mac-example':{title:'A Family Story'}};
const places=townDestinations(lessons);
const facilities=places.filter(p=>p.action);
assert.equal(facilities.length,7);
assert.equal(places.length,Object.keys(lessons).length+facilities.length+1);
assert.equal(places.find(p=>p.id===RABBIT_STORY.id).name,'Rabbit’s Farm');
assert.equal(places.at(-1).name,'A Family Story');
assert.equal(signLines('Discovery Playroom').join(' '),'Discovery Playroom');
assert.equal(signLines('A Very Long Family Story about Finding Something Wonderful').join(' '),'A Very Long Family Story about Finding Something Wonderful');
assert.equal(new Set(places.map(p=>p.x+','+p.z)).size,places.length);

const scene=new THREE.Scene();
scene.background=new THREE.Color();
scene.fog=new THREE.Fog(0xffffff,27,54);
const material=new THREE.MeshStandardMaterial(),sphere=new THREE.SphereGeometry(1,8,6);
function model(geometry,x,y,z,group){
 const result=new THREE.Mesh(geometry,material);result.position.set(x,y,z);group.add(result);return result;
}
const world=new TownWorld(scene,{
 cube:(c,x,y,z,w,h,d,g)=>model(new THREE.BoxGeometry(w,h,d),x,y,z,g),
 cyl:(c,x,y,z,r,h,g)=>model(new THREE.CylinderGeometry(r,r,h,8),x,y,z,g),
 orb:(c,x,y,z,w,h,d,g)=>{const m=model(sphere,x,y,z,g);m.scale.set(w,h,d);return m;},
 labelBoard:()=>{},
});
const painted=[];
globalThis.document={createElement:()=>({getContext:()=>({
  fillRect(){},strokeRect(){},measureText(line){return {width:line.length*35};},fillText(line){painted.push(line);},
})})};
world.buildStreet(places);
delete globalThis.document;
assert(painted.includes('Sesame Street Town'));
for(const place of places)for(const line of signLines(place.name))assert(painted.includes(line),place.name+' has a full sign');
for(const place of facilities){
 world.useFacility(place.id,2);
 assert.equal(world.facilityEffects.get(place.id).started,2);
}
world.tick(2.5,false);
world.tick(8,true);
assert(world.water.every(item=>item.dot.parent),'fountain droplets remain animated meshes');
assert(world.street.children.some(group=>group.children.some(mesh=>mesh.isInstancedMesh)));
world.show('house');
assert.equal(world.street.visible,false);
assert.equal(world.house.visible,true);
assert.equal(world.night.visible,false);
world.show('house',true);
assert.equal(world.night.visible,true);
world.show('town');
assert.equal(world.house.visible,false);
assert.equal(world.canWalk(HOME.x,HOME.z,'town'),false);
for(const spot of [ROOM.start,ROOM.door,ROOM.corner])assert(world.canWalk(...spot,'house'));
for(const place of places.slice(1)){
 assert(world.canWalk(place.x,place.doorZ,'town'),place.name+' has a reachable door');
 const path=routeTo([HOME.x,HOME.doorZ],place,true);
 assert(Math.hypot(routePoint(path,1)[0]-place.x,routePoint(path,1)[1]-place.doorZ)<1e-8);
 for(let i=0;i<=300;i++)assert(world.canWalk(...routePoint(path,i/300).slice(0,2),'town'),place.name+' path stays on walkable ground');
}
assert.equal(TRAVEL_TIME,3000);

const before=Date.parse('2026-11-19T21:59:59+00:00'),after=before+1000;
assert.equal(playDay(before),'2026-11-19');
assert.equal(playDay(after),'2026-11-20');
assert.equal(playBudget({day:playDay(before),used:PLAY_LIMIT+3000},before).used,PLAY_LIMIT);
assert.equal(playBudget({day:playDay(before),used:PLAY_LIMIT},after).used,0);

const source=fs.readFileSync('dist/game.js','utf8');
function fn(name,next){
 const start=source.indexOf('function '+name+'('),end=source.indexOf('function '+next+'(',start+1);
 return source.slice(start,end);
}
let epoch=before-3600000,stamp=7000,bedtimes=0,wakeups=0,saves=0;
const nodes={modalShade:{hidden:true},townClock:{classList:{toggle(){}}}};
const context=vm.createContext({
 Date:{now:()=>epoch},performance:{now:()=>stamp},document:{hidden:false},$:key=>nodes[key],
 townSession:true,townStoryActive:false,townView:'town',phase:'town-free',townBudget:playBudget(null,epoch),
 townLastClock:stamp,townLastSave:stamp,ROOM,TOWN_WRAP_UP:['rating','reward'],PLAY_LIMIT,playBudget,
 saveTownBudget(){saves++;},showTownView(){wakeups++;context.phase='town-free';},music:{start(){}},
 putTownToBed(){bedtimes++;context.phase='town-night';},
});
vm.runInContext(fn('tickTownBudget','refreshTownPlaces'),context);
const tick=(ms=1000)=>{stamp+=ms;vm.runInContext('tickTownBudget()',context);};
context.townBudget.used=PLAY_LIMIT-1200;
tick();
assert.equal(nodes.townClock.textContent,'0:01');
nodes.modalShade.hidden=false;
tick();
assert.equal(context.townBudget.used,PLAY_LIMIT-200,'parent preview pauses the allowance');
nodes.modalShade.hidden=true;
context.phase='explore';context.townView='';context.townStoryActive=true;
tick(250);
assert.equal(nodes.townClock.textContent,'Finish this story');
assert.equal(bedtimes,0,'an active story can finish');
context.phase='town-free';context.townView='town';context.townStoryActive=false;
tick();
assert.equal(bedtimes,1);
assert.equal(nodes.townClock.textContent,'Rest time');
tick();
assert.equal(bedtimes,1,'the bedtime animation starts only once');
epoch=after;
tick();
assert.equal(wakeups,1);
assert(nodes.townClock.textContent.startsWith('9:')||nodes.townClock.textContent==='10:00');
assert(saves>0);
console.log('PASS: expanded town, seven attractions, full signs, collision-free shortcut paths, three-second travel, daily cutoff, story grace and 06:00 Hong Kong reset.');

const interactionStart=source.indexOf('function interactTown()');
const interactionEnd=source.indexOf('function markTownDestination(',interactionStart);
let entries=0;
const sceneryGate=vm.createContext({
 $:()=>({hidden:true}),HOME,LESSONS:lessons,
 travelToStory:()=>entries++,showTownView:()=>entries++,
});
vm.runInContext(source.slice(interactionStart,interactionEnd),sceneryGate);
for(const place of facilities){
 sceneryGate.townNear=place;
 vm.runInContext('interactTown()',sceneryGate);
}
assert.equal(entries,0,'scenery facilities cannot be entered or activated');
sceneryGate.townNear=places.find(p=>p.id==='ball');
vm.runInContext('interactTown()',sceneryGate);
assert.equal(entries,1,'story entrances remain playable');
assert(world.street.getObjectByName('Complete ball pool'),'ball pool is assembled as a complete facility');
