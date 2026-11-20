import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from './dist/assets/three.module.js';
import {RabbitDeliveryWorld,DELIVERY_STEPS,RABBIT_STORY} from './dist/rabbit-delivery.js';
const scene=new THREE.Scene();scene.background=new THREE.Color();
function basic(geo,c,x,y,z,p){const o=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:c}));o.position.set(x,y,z);(p||scene).add(o);return o;}
const kit={cube:(c,x,y,z,w,h,d,p)=>basic(new THREE.BoxGeometry(w,h,d),c,x,y,z,p),cyl:(c,x,y,z,r,h,p)=>basic(new THREE.CylinderGeometry(r,r,h,12),c,x,y,z,p),orb:(c,x,y,z,a,b=a,d=a,p)=>{const o=basic(new THREE.SphereGeometry(1,10,8),c,x,y,z,p);o.scale.set(a,b,d);return o;},rod:(c,a,b,r,p)=>basic(new THREE.CylinderGeometry(r,r,new THREE.Vector3(...a).distanceTo(new THREE.Vector3(...b))),c,...new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5).toArray(),p),labelBoard(){}};
const world=new RabbitDeliveryWorld(scene,kit),player=new THREE.Group();scene.add(player);world.reset();
const source=fs.readFileSync('dist/game.js','utf8');function fn(name){const start=source.indexOf('function '+name+'(');assert(start>=0);let i=source.indexOf('{',start)+1,d=1;for(;d;i++){if(source[i]==='{')d++;if(source[i]==='}')d--;}return source.slice(start,i);}
const elements=new Map(),$=id=>{if(!elements.has(id))elements.set(id,{hidden:id==='modalShade',querySelector:()=>({}),textContent:'',classList:{remove(){}}});return elements.get(id);};
const ctx=vm.createContext({THREE,RABBIT_STORY,DELIVERY_STEPS,player,rabbitWorld:world,familyIndex:0,familyStory:RABBIT_STORY,phase:'explore',lastNear:null,$,scene,beacon:{visible:false,position:new THREE.Vector3()},document:{body:{classList:{remove(){}}}},stopInput(){},bodyTools(){},dialogue(){},speak(){},resize(){},stopSpeech(){},updateSpeakingControls(){},cheerHelpers(){},helpCount:0,music:{enabled:false}});
for(const name of ['routeRabbit','interactRabbit','rabbitActionDone','nextRabbit'])vm.runInContext(fn(name),ctx);
let actions=0,spoken=0;
ctx.routeRabbit();
while(ctx.phase!=='family-end'){
 const index=ctx.familyIndex,s=DELIVERY_STEPS[index];
 assert.equal(world.current,s);assert.equal([...world.zones.values()].filter(g=>g.visible).length,1);
 player.position.set(8,0,7);ctx.interactRabbit();assert.equal(world.taps,0,'distant presses cannot progress');
 for(let n=0;n<s.count;n++){
  player.position.copy(world.target());ctx.interactRabbit();actions++;assert.equal(world.taps,n+1);
  ctx.interactRabbit();assert.equal(world.taps,n+1,'duplicate presses cannot skip actions');
  const timer=world.timer;world.tick(.5,player,true);assert.equal(world.timer,timer,'parent panel pauses effects');
  for(let frame=0;frame<40;frame++){if(world.tick(.05,player))ctx.rabbitActionDone();}
 }
 if(s.sentence){assert.equal(ctx.phase,'family-say');ctx.interactRabbit();assert.equal(ctx.familyIndex,index);ctx.nextRabbit();spoken++;}
 assert.equal(ctx.familyIndex,index+1);
 if(index===5)assert(world.hasCarrot&&!world.delivered);
 if(index===12)assert(world.hasCarrot&&!world.delivered,'all three encounters preserve the gift');
 if(index===16)assert(world.delivered,'actual gift handover');
}
assert.equal(DELIVERY_STEPS.length,22);assert(actions>30);assert(spoken>=10);
assert.deepEqual([...new Set(DELIVERY_STEPS.map(s=>s.page))],[2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
assert(DELIVERY_STEPS.find(s=>s.action==='Knock').count===3);
world.reset();assert(!world.delivered&&!world.hasCarrot&&!world.notes.visible);assert.equal(world.grass.scale.y,1);
// Every mission location is reachable under the master world's movement bounds.
for(let index=0;index<DELIVERY_STEPS.length;index++){world.enter(index,player);for(let tap=0;tap<DELIVERY_STEPS[index].count;tap++){world.taps=tap;const t=world.target();assert(t.x>=-8.8&&t.x<=8.8&&t.z>=-4.3&&t.z<=7.4);}}
console.log('PASS: all 22 events / 14 story spreads; '+actions+' world actions; '+spoken+' parent speaking gates; no distant/duplicate skips; pause/resume; carrot continuity; handover; return home; replay reset; reachable destinations.');
