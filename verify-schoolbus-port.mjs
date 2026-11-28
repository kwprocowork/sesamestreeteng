import fs from 'node:fs';import {speechSegments,normalizeSpeech} from './dist/narrator.js';
const voiceManifest=JSON.parse(fs.readFileSync('dist/narration-manifest.json','utf8'));
import assert from 'node:assert/strict';import * as THREE from './dist/assets/three.module.js';
import {schoolBox,SCHOOL_RENDER} from './dist/schoolbus/core.js';import {createSchoolPlaymat as createSchoolHome,PLAYMAT_IDS} from './dist/schoolbus/playmat.js';import {createSchoolActor} from './dist/schoolbus/actor.js';
const gradient={addColorStop(){}};const canvas=()=>({width:256,height:256,toDataURL:()=>'',getContext(){return new Proxy({canvas:this,measureText:t=>({width:t.length*10}),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createPattern:()=>null,getImageData:()=>({data:new Uint8ClampedArray(this.width*this.height*4)}),getLineDash:()=>[]},{get(o,k){return k in o?o[k]:(()=>{})},set(o,k,v){o[k]=v;return true}})}});
globalThis.document={createElement:()=>canvas()};globalThis.window={};globalThis.localStorage={getItem:()=>null};
assert.equal(schoolBox(1,2,3),schoolBox(1,2,3));assert(schoolBox(1,2,3).attributes.position.count>24);assert.equal(SCHOOL_RENDER.fov,55);
for(const [name,build]of Object.entries({playmat:createSchoolHome})){
 const scene=new THREE.Scene(),out=build(scene);out.root.updateMatrixWorld(true);let meshes=0;out.root.traverse(o=>{if(o.isMesh){meshes++;if(o.geometry.attributes.position)assert(o.geometry.attributes.position.array.every(Number.isFinite),name+' finite positions');for(const m of Array.isArray(o.material)?o.material:[o.material])assert(m?.isMaterial);}});assert(meshes>100,name+' uses complete source model');console.log(name,meshes,new THREE.Box3().setFromObject(out.root).getSize(new THREE.Vector3()).toArray());
}
const actors=createSchoolActor(new THREE.Scene());const actor=actors.create({skin:0xf7c5a6,top:0x70a6ba,pants:true,s:1.6});assert(actor.kb);assert.equal(actor.kb.bones.length,13);
for(const pose of ['wave','clap','jump','sip','give']){actor.pose=pose;for(let i=0;i<15;i++)actors.animate(actor,.05,i*.05);actor.g.updateMatrixWorld(true);assert(actor.g.matrixWorld.elements.every(Number.isFinite));}
actor.g.traverse(o=>{if(o.isSkinnedMesh){const weights=o.geometry.getAttribute('skinWeight'),ids=o.geometry.getAttribute('skinIndex');for(let i=0;i<weights.count;i++){const sum=weights.getX(i)+weights.getY(i)+weights.getZ(i)+weights.getW(i);assert(Math.abs(sum-1)<.001);for(const f of ['getX','getY','getZ','getW'])assert(ids[f](i)<13);}}});
console.log('PASS: exact rounded-box cache, source-built playmat, finite geometry/materials, 13-bone source rig, normalized skin weights and original poses.');
// Every activity runs against the exact ported props with an isolated actor bridge.
for(const id of PLAYMAT_IDS){
 const home=createSchoolHome(new THREE.Scene()),g=new THREE.Group(),actor={g,pos:new THREE.Vector3(),body:new THREE.Group(),armL:new THREE.Group(),armR:new THREE.Group(),legL:new THREE.Group(),legR:new THREE.Group(),mv:0,yaw:0,pose:null,walkT:0,waveT:0};g.scale.setScalar(1.6);
 assert(home.start(id,actor));let result;for(let i=0;i<260;i++){result=home.tick(.1,i*.1);for(const line of speechSegments(result.caption)){const key=normalizeSpeech(line).toLowerCase();assert(voiceManifest.clips[key]||voiceManifest.clips[key.replace(/\.$/,'')],id+' missing actual narration: '+key);}if(result.done)break;}assert(result.done,id+' completes');assert(actor.g.visible,id+' preserves player visibility');console.log('activity',id,'complete');
}
