import {STATIONERY} from './dist/stationery.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from './dist/assets/three.module.js';
import { GALLERY_PEOPLE } from './dist/gallery-people.js';
import { TRANSPORTATION } from './dist/transportation.js';
import { FAMILY_GALLERY, FAMILY_GALLERY_INTRO, VENUE_BOUNDS, createFamilyGalleryRound, FamilyGalleryWorld } from './dist/family-gallery.js';

const scene=new THREE.Scene();
function primitive(color,x,y,z,parent){
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial({color}));
 mesh.position.set(x,y,z);
 parent.add(mesh);
 return mesh;
}
const kit={
 cube:(color,x,y,z,w,h,d,parent)=>primitive(color,x,y,z,parent),
 cyl:(color,x,y,z,r,h,parent)=>primitive(color,x,y,z,parent),
 orb:(color,x,y,z,a,b,c,parent)=>primitive(color,x,y,z,parent),
 rod:(color,from,to,r,parent)=>primitive(color,...from,parent),
 labelBoard(){},portraitLabel(){return new THREE.Group();}
};
const round=createFamilyGalleryRound(()=>.9999);
assert(!round.relatives.includes('mom')&&!round.relatives.includes('dad'),'play fully with no parent portraits');
const world=new FamilyGalleryWorld(scene,kit,round),player=new THREE.Group();
const possibleRelatives=new Set(),casts=new Set();
let seed=183;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
for(let run=0;run<250;run++){
 const sample=createFamilyGalleryRound(random);
 assert.equal(new Set(sample.relatives).size,4);
 assert.equal(sample.beats.length,12);
 assert(sample.relatives.includes(sample.craftId)&&sample.relatives.includes(sample.pointingId));
 assert.deepEqual(sample.beats.slice(2,6).map(beat=>beat.station),sample.relatives);
 for(const id of sample.relatives)possibleRelatives.add(id);
 casts.add(sample.relatives.slice().sort().join(' '));
}
assert.equal(possibleRelatives.size,8);
assert(casts.size>=60,'replays can draw many different casts');
const source=fs.readFileSync('dist/game.js','utf8');
const nodes=new Map();
const $=id=>{
 if(!nodes.has(id))nodes.set(id,{hidden:id==='modalShade',querySelector:()=>({})});
 return nodes.get(id);
};
const guide=new THREE.Group();
guide.userData={npcOpacity:1,npcMaterials:[]};
const spoken=[];
const prints=[];
const renderer={
 target:null,
 getRenderTarget(){return this.target;},
 setRenderTarget(target){this.target=target;},
 clear(){},
 render(studio,camera){
  assert(this.target instanceof THREE.WebGLRenderTarget);
  assert(camera.isOrthographicCamera);
  const portrait=studio.children.find(child=>child.userData.smileFace);
  assert(portrait?.userData.smileFace.visible,'the photographed person smiles');
  prints.push(portrait.name);
 }
};
let speechDone;
const state=vm.createContext({STATIONERY,stationeryWorld:null,
 THREE,FAMILY_GALLERY,FAMILY_GALLERY_INTRO,TRANSPORTATION,familyGalleryWorld:world,familyIndex:0,familyStory:round,
 lesson:FAMILY_GALLERY.id,phase:'family-gallery-intro',lastNear:null,player,sound:false,$,music:{},renderer,
 galleryIntroLine:0,galleryIntroElapsed:0,galleryIntroSpoken:false,reducedTownMotion:{matches:false},
 helperCast:{},rosita:guide,ambientHelpers:[],camera:{position:new THREE.Vector3()},
 npcObstructs(){return false;},
 beacon:{visible:false,position:new THREE.Vector3()},
 document:{body:{classList:{remove(){}}}},
 stopInput(){},bodyTools(){},dialogue(){},speak(line,whenDone){spoken.push(line);speechDone=whenDone;},resize(){},stopSpeech(){speechDone=null;},updateSpeakingControls(){},cheerHelpers(){}
});
for(const name of ['familyTarget','updateSupportCast','playFamilyGalleryIntroLine','tickFamilyGalleryIntro','finishFamilyGalleryIntro','speakingTarget','routeFamilyGallery','updateFamilyGalleryAction','interactFamilyGallery','familyGalleryActionDone','familyGallerySpeaking','advanceFamilyGallery','familyInteract','familyAccept']){
 const start=source.indexOf('function '+name+'(');
 assert(start>=0);
 let end=source.indexOf('{',start)+1,depth=1;
 for(;depth;end++){
  if(source[end]==='{')depth++;
  if(source[end]==='}')depth--;
 }
 vm.runInContext(source.slice(start,end),state);
}

state.playFamilyGalleryIntroLine();
assert.equal(spoken.at(-1),FAMILY_GALLERY_INTRO[0].line);
assert(world.introPippa.visible&&world.pointingArm.rotation.z>2);
assert(!state.beacon.visible);
state.tickFamilyGalleryIntro(.2);
assert(world.milo.position.y>0,'Milo hops and waves during the first line');
speechDone();
state.tickFamilyGalleryIntro(4);
assert.equal(state.galleryIntroLine,1);
assert(world.introFrame.visible);
assert.equal(spoken.at(-1),FAMILY_GALLERY_INTRO[1].line);
state.tickFamilyGalleryIntro(.5);
assert(world.introFrame.position.y>.53,'Pippa lifts the finished frame');
state.tickFamilyGalleryIntro(12);
assert.equal(state.phase,'explore','a missing speech callback must not block play');
assert(!world.introPippa.visible&&state.beacon.visible);

state.phase='family-gallery-intro';
state.galleryIntroLine=0;
state.playFamilyGalleryIntroLine();
state.finishFamilyGalleryIntro();
assert.equal(state.phase,'explore','skip leads straight to the first mission');
assert.equal(speechDone,undefined,'skip cancels the intro speech');
assert(!world.introPippa.visible&&state.beacon.visible);
assert.equal(world.milo.name,'milo');
assert.equal(world.introPippa.name,'pippa');
assert.equal(world.portraits.length,8);
for(const [older,younger] of [['olderSister','youngerSister'],['olderBrother','youngerBrother']]){
 assert(GALLERY_PEOPLE[older].height-GALLERY_PEOPLE[younger].height>=.5);
 assert.notEqual(GALLERY_PEOPLE[older].style,GALLERY_PEOPLE[younger].style);
}
for(const card of world.portraits){
 const person=card.image.getObjectByName(card.id);
 assert(person);
 assert(person.getObjectByName(GALLERY_PEOPLE[card.id].feature));
 assert(!card.frame.visible,'the wall starts empty and relatives stand outside their frames');
 assert.equal(card.person.parent,card.station);
 assert.equal(card.station.visible,round.relatives.includes(card.id));
 assert.equal(card.slot.visible,card.station.visible);
}
const settle=()=>{
 for(let frame=0;frame<35;frame++){
  const effect=world.tick(.05,player,false);
  if(effect)state.familyGalleryActionDone(effect);
 }
};

for(const [i,beat] of round.beats.entries()){
 assert.equal(state.familyIndex,i);
 assert.equal(state.phase,'explore');
 assert.equal(world.current,beat);
 const card=world.relative;
 assert.equal(state.beacon.visible,!card,'the clue does not reveal the correct person');
 for(let frame=0;frame<120;frame++)state.updateSupportCast(0,.016);
 const target=world.target();
 assert.equal(target.y,0,'the action stays centered on the ground marker');
 assert.deepEqual(target.toArray(),state.beacon.position.toArray());
 assert(target.x>=VENUE_BOUNDS.minX&&target.x<=VENUE_BOUNDS.maxX);
 assert(target.z>=VENUE_BOUNDS.minZ&&target.z<=VENUE_BOUNDS.maxZ);

 player.position.set(target.x>0?-13.6:13.6,0,10.5);
 state.familyInteract();
 assert.equal(state.phase,'explore','far-away actions must do nothing');
 if(card){
  const wrong=world.activeRelatives.find(candidate=>candidate!==card);
  player.position.copy(wrong.station.position);
  state.updateFamilyGalleryAction();
  assert(!$('actionButton').disabled,'all relatives can be guessed');
  state.familyInteract();
  assert.equal(state.phase,'explore','the wrong person does not advance the story');
  assert.equal(world.effectKind,'');
  assert(!card.frame.visible&&!card.photo);
 }

 player.position.copy(target);
 $('modalShade').hidden=false;
 state.familyInteract();
 assert.equal(state.phase,'explore','a parent panel blocks scene interaction');
 $('modalShade').hidden=true;
 state.familyInteract();
 assert.equal(state.phase,'family-action');
 state.familyInteract();
 state.familyAccept();
 const timer=world.effectTime;
 assert.equal(world.tick(.5,player,true),'');
 assert.equal(world.effectTime,timer);
 if(card){
  assert.equal(world.effectKind,'wave');
  world.tick(.20,player,false);
  assert(card.person.userData.arms[1].rotation.z>2,'the right person waves');
  settle();
  assert.equal(state.phase,'explore');
  assert(world.photoReady&&!card.frame.visible);
  assert.equal($('actionLabel').textContent,'Take photo');
  player.position.set(target.x>0?-13.6:13.6,0,10.5);
  state.familyInteract();
  assert.equal(state.phase,'explore','the player must stay near to take the photo');
  player.position.copy(target);
  state.familyInteract();
  assert.equal(world.effectKind,'photo');
  assert.equal(state.phase,'family-action');
  assert(!card.person.userData.smileFace.visible);
 }
 settle();
 assert.equal(state.phase,'family-say');
 assert.equal(state.speakingTarget(),beat.sentence);
 assert.equal(world.tick(3600,player,false),'');
 assert.equal(state.phase,'family-say','speaking has no timeout');
 state.familyInteract();
 assert.equal(state.familyIndex,i,'the hand cannot approve speech');
 if(card){
  assert.equal(card.frame.parent,card.station,'the photo stays close during the speaking turn');
  assert(world.cameraFocus(true).distanceTo(card.frame.getWorldPosition(new THREE.Vector3()))<.001);
  assert(card.frame.visible&&card.person.userData.smileFace.visible);
  assert(card.photo&&card.print.visible&&!card.image.visible);
  assert.equal(card.print.material.map,card.photo.texture);
  assert.equal(renderer.target,null,'snapshot capture restores the game render target');
 }
 if(beat.station==='glue'){
  assert(world.gluePhoto.media.visible&&world.gluePhoto.print.visible);
  const subject=world.activeRelatives.find(person=>person.id===round.craftId);
  assert.equal(world.gluePhoto.print.material.map,subject.photo.texture);
 }
 if(world.isPointing()){
  assert.equal(world.pointingPortrait.id,round.pointingId);
  assert(world.cameraFocus(true).distanceTo(world.pointingPortrait.frame.getWorldPosition(new THREE.Vector3()))<.001);
 }
 if(beat.station==='gallery')assert(world.displayPhoto.visible&&!world.carried.visible);
 if(beat.station==='pippaStage')assert.equal(beat.sentence.split(/[.!?]/).filter(s=>s.trim()).length,3);
 state.familyAccept();
 if(card){
  assert.equal(card.frame.parent,card.slot);
  assert(world.flights.some(flight=>flight.card===card));
  settle();
  assert(card.frame.position.length()<.001);
 }
}
assert.equal(new Set(prints).size,4);
assert.deepEqual(prints,round.relatives);
assert.equal(state.phase,'family-end');
assert(world.activeRelatives.every(card=>card.frame.parent===card.slot));
assert(world.portraits.filter(card=>!round.relatives.includes(card.id)).every(card=>!card.photo&&!card.frame.visible));
assert.equal(typeof $('familyFinish').onclick,'function');
const next=createFamilyGalleryRound(()=>0);
assert.notDeepEqual(next.relatives,round.relatives);
world.reset(next);
world.enter(0);
assert(world.portraits.every(card=>card.frame.parent===card.station));
assert(world.portraits.every(card=>!card.frame.visible&&!card.photo&&!card.print.visible));
assert.deepEqual(world.activeRelatives.map(card=>card.id),next.relatives);
assert(!world.displayPhoto.visible&&!world.carried.visible);
console.log('PASS: narrated animation and skip/fallback; camera-safe action marker; replay variety and full family pool; wrong-person retry, four waves and smiling photos, wall gallery, and all 12 missions, distance and modal guards, animation pause, portrait and frame continuity, timed-effect completion, manual speaking gates, free talk, and replay reset.');
