import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import * as THREE from './dist/assets/three.module.js';
const source=fs.readFileSync('dist/game.js','utf8');
function fn(name){const start=source.indexOf('function '+name+'(');let i=source.indexOf('{',start)+1,d=1;for(;d;i++){if(source[i]==='{')d++;if(source[i]==='}')d--;}return source.slice(start,i);}
const events={},windowEvents={},canvas={style:{},addEventListener:(k,f)=>events[k]=f,setPointerCapture(){}};
let cancellations=0,picks=0,frames=0;const camera=new THREE.PerspectiveCamera(43,1.6,.1,100);camera.position.set(10,2.4,2.5);
const ctx=vm.createContext({THREE,renderer:{domElement:canvas},$:()=>({hidden:true}),document:{hidden:false},window:{addEventListener:(k,f)=>windowEvents[k]=f},phase:'explore',lesson:'wants',wantMode:'choose',townView:'',STATIONERY:{id:'stationery'},cameraDrag:null,cameraOrbit:{yaw:0,pitch:0,zoom:1},autoCamera:{manual(){}},taskCamera:{active:true,manual(){cancellations++;this.active=false},frame(){frames++;return true}},camera,cameraGoal:new THREE.Vector3(),lookGoal:new THREE.Vector3(),lookCurrent:new THREE.Vector3(3,1.8,-3.5),joy:{x:0,y:0},keys:new Set(),player:{},taskObstructors:()=>[],tapTaskMarker:()=>false,tapWantFood(){picks++}});
vm.runInContext(fn('setupCameraDrag')+'\n'+fn('frameStoryTask')+'\nsetupCameraDrag()',ctx);
const e=(x=200,y=220,id=1)=>({button:0,pointerId:id,clientX:x,clientY:y,type:'pointerup',preventDefault(){}});
events.pointerdown(e());assert.equal(cancellations,0,'touch down preserves selected view');
for(let i=0;i<20;i++){ctx.frameStoryTask(.016,{});assert(ctx.cameraGoal.equals(camera.position));assert(ctx.lookGoal.equals(ctx.lookCurrent));}
assert.equal(frames,0,'hold keeps view frozen until ray selection');
events.pointermove(e(203,222));assert.equal(cancellations,0,'finger jitter does not move camera');assert.equal(ctx.cameraOrbit.yaw,0);
events.pointerup(e(203,222));assert.equal(picks,1,'food tap arrives after a held touch');
events.pointerdown(e());events.pointermove(e(225,220));assert.equal(cancellations,1,'real drag releases automatic camera');assert.notEqual(ctx.cameraOrbit.yaw,0);events.pointerup(e(225,220));assert.equal(picks,1,'drag does not select food');
events.pointerdown(e());events.pointercancel({...e(),type:'pointercancel'});assert.equal(picks,1,'cancel does not pick');assert.equal(ctx.cameraDrag,null);
events.pointerdown(e(200,220));events.pointerdown(e(240,220,2));events.pointermove(e(270,220,2));assert.equal(ctx.cameraDrag.manual,true);assert(ctx.cameraOrbit.zoom<1);events.pointerup(e(270,220,2));events.pointerup(e());assert.equal(picks,1,'pinch does not pick');
console.log('PASS: held food tap freezes camera, finger jitter is ignored, one pick per tap, drag/pinch adjust view, cancellation never picks.');
