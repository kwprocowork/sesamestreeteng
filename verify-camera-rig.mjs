import {STATIONERY} from './dist/stationery.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {AutoCamera,STORY_DISTANCE,DETAIL_DISTANCE} from './dist/camera-rig.js';
const rig=new AutoCamera(),orbit={yaw:1,pitch:.4,zoom:.65};
for(let i=0;i<99;i++)rig.tick(.05,orbit);
assert.equal(orbit.yaw,1,'no early automatic movement');
rig.tick(.051,orbit);assert(orbit.yaw<1,'five active seconds starts a gentle return');
for(let i=0;i<80;i++)rig.tick(.05,orbit);
assert(Math.abs(orbit.yaw)<.001&&Math.abs(orbit.zoom-1)<.001);
rig.manual();orbit.yaw=1;
for(let i=0;i<90;i++)rig.tick(.05,orbit);
rig.manual();for(let i=0;i<90;i++)rig.tick(.05,orbit);
assert.equal(orbit.yaw,1,'manual input grants another five seconds');
for(const state of [{active:false},{protectedView:true},{dragging:true}]){
 for(let i=0;i<150;i++)rig.tick(.05,orbit,state);
 assert.equal(orbit.yaw,1);assert.equal(rig.elapsed,0);
}
for(let i=0;i<101;i++)rig.tick(.05,orbit,{reduced:true});
assert.equal(orbit.yaw,0,'reduced motion avoids a sweeping animation');
assert(STORY_DISTANCE/DETAIL_DISTANCE>1.09&&STORY_DISTANCE/DETAIL_DISTANCE<1.12);
// Exercise the real phase protection used by the game loop.
const src=fs.readFileSync('dist/game.js','utf8'),start=src.indexOf('function tickAutoCamera('),end=src.indexOf('function setupCameraDrag(',start);
let options;const ctx=vm.createContext({STATIONERY,stationeryWorld:null,phase:'explore',lesson:'ball',cameraOrbit:orbit,cameraDrag:null,autoCamera:{tick(dt,o,state){options=state;}},$:()=>({hidden:true}),document:{hidden:false},reducedTownMotion:{matches:false},TRANSPORTATION:{id:'transport'},FAMILY_GALLERY:{id:'gallery'},phonicsCardViewing:false,speakingPhase:()=>ctx.phase.endsWith('-say')});
vm.runInContext(src.slice(start,end),ctx);
for(const phase of ['intro','chapter-intro','body-find','phonics-detail','family-say','town-travel','town-night']){ctx.phase=phase;ctx.tickAutoCamera(.05);assert(options.protectedView,phase);}
for(const phase of ['explore','town-free','cat-find']){ctx.phase=phase;ctx.tickAutoCamera(.05);assert(!options.protectedView,phase);}
ctx.phase='explore';ctx.lesson='phonics';ctx.phonicsCardViewing=true;ctx.tickAutoCamera(.05);assert(options.protectedView);
ctx.document.hidden=true;ctx.tickAutoCamera(.05);assert(!options.active);
console.log('PASS: 5-second cadence, smooth return, manual grace, pause/drag/detail/speaking protection, reduced motion and 10.5% wider story view.');
