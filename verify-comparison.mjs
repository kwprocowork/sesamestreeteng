import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import * as THREE from './dist/assets/three.module.js';import {ParadeHome,PARADES,visitParades} from './dist/comparison.js';
const scene=new THREE.Scene();
function basic(geo,color,x,y,z,parent){const o=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color}));o.position.set(x,y,z);(parent||scene).add(o);return o;}
const kit={cube:(c,x,y,z,w,h,d,p)=>basic(new THREE.BoxGeometry(w,h,d),c,x,y,z,p),cyl:(c,x,y,z,r,h,p)=>basic(new THREE.CylinderGeometry(r,r,h,12),c,x,y,z,p),orb:(c,x,y,z,a,b=a,d=a,p)=>{const o=basic(new THREE.SphereGeometry(1,12,8),c,x,y,z,p);o.scale.set(a,b,d);return o;},rod:(c,a,b,r,p)=>basic(new THREE.CylinderGeometry(r,r,new THREE.Vector3(...a).distanceTo(new THREE.Vector3(...b))),c,...new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5).toArray(),p)};
const source=fs.readFileSync('dist/game.js','utf8');function fn(n){const a=source.indexOf('function '+n+'(');let i=source.indexOf('{',a)+1,d=1;for(;d;i++){if(source[i]==='{')d++;if(source[i]==='}')d--;}return source.slice(a,i);}
kit.labelBoard=()=>{};
const world=new ParadeHome(scene,kit);
const nodes=new Map(),$=id=>{if(!nodes.has(id))nodes.set(id,{hidden:id==='modalShade'});return nodes.get(id);};
const player=new THREE.Group();let ratings=0;
const ctx=vm.createContext({THREE,PARADES,paradeWorld:world,paradeRound:0,paradeTurn:0,paradeRounds:[],phase:'explore',player,$,beacon:{position:new THREE.Vector3()},document:{body:{classList:{remove(){}}}},bodyTools(){},resize(){},stopSpeech(){},stopInput(){},dialogue(){},speak(){},updateSpeakingControls(){},guideName:'Abby Cadabby',rating:0,helpCount:0,ratePanel(){ratings++;},setCharacterPose(){},cheerHelpers(){},rosita:{}});
for(const n of ['paradeMission','paradeAnimals','paradeWalk','paradeTarget','interactParade','paradeDemo','paradePick','paradeSpeaking','acceptParade'])vm.runInContext(fn(n),ctx);
function act(name){if(name)player.position.copy(world.approach(name));else player.position.copy(ctx.paradeTarget());ctx.interactParade(name);}
const firstOrders=new Set(Array.from({length:12},(_,i)=>visitParades([],()=>(i+.5)/12).join(',')));
assert.equal(firstOrders.size,12);
for(const order of firstOrders){
 const first=order.split(',');
 const next=visitParades([{words:first.flatMap(key=>PARADES[key].animals)}]);
 assert.equal(new Set([...first,...next]).size,4);
}
const history=[];
for(let visit=0;visit<4;visit++){
 ctx.paradeRounds=visitParades(history,()=>.5);ctx.paradeRound=ctx.paradeTurn=0;world.reset();ctx.paradeWalk('chest','Open!');
 history.unshift({words:ctx.paradeRounds.flatMap(k=>PARADES[k].animals)});
 const turns=[];
 for(const key of ctx.paradeRounds){
  act();assert.equal(ctx.paradeMode,'start');world.tick(1,player);act();assert.equal(ctx.phase,'parade-watch');
  for(let i=0;i<65;i++)world.tick(.05,player);assert.equal(world.demo,false);ctx.paradePick();
  const mission=PARADES[key];act(mission.animals[1]);assert.equal(ctx.phase,'explore');
  for(const animal of mission.animals){act(animal);if(key==='length')act();assert.equal(ctx.phase,'parade-say');assert.equal(ctx.paradeSaid,'The '+animal+' is '+mission.words[mission.animals.indexOf(animal)]+'.');turns.push(ctx.paradeSaid);ctx.acceptParade();}
 }
 assert.equal(new Set(turns).size,4);const favorite=ctx.paradeAnimals()[0];act(favorite);world.tick(.05,player);assert.equal(world.carried,favorite);act();assert.equal(ctx.paradeSaid,turns[0]);ctx.acceptParade();assert.equal(ctx.phase,'parade-finale');world.tick(1,player);$('finishParade').onclick();assert.equal(ctx.phase,'rating');
}
assert.equal(ratings,4);scene.updateMatrixWorld(true);scene.traverse(o=>assert(o.matrixWorld.elements.every(Number.isFinite)));
console.log('PASS: all eight animal models, first visit and follow-up pairings, wrong guesses, five speaking turns, carrying, parade and rating.');
