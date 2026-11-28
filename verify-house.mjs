import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from './dist/assets/three.module.js';
import {TownWorld, routePoint} from './dist/town.js';
import {
  ROOM, HOUSE_STATIONS, HOUSE_COLLECTION, HOUSE_CAMERA_ZOOM, clampHouseCamera, pickCabinetFigures, HOUSE_DOOR, PLAY_MAT_COLOR, canWalkInHouse, houseRoute, SHELF_CAPACITY,
  shelfPageCount, shelfPageWords, POSTER_BANK, pickHousePosters
} from './dist/town-house.js';
import {HOME_GOODS, HOUSE_SLOTS, canPlaceOnFloor, chooseBedItem, placedHouseBlocks, placeHouseItem} from './dist/home-goods.js';
import {buyItem,equipItem,normalizeShop} from './dist/shop.js';
import {VOCABULARY} from './dist/vocabulary.js';

function assertReachable(from,to,blocks=[]) {
  const path=houseRoute(from,to,blocks);
  assert(path,JSON.stringify({from,to}));
  assert.deepEqual(path[0],from);
  assert.deepEqual(path.at(-1),to);
  for(let i=0;i<=400;i++){
    const [x,z]=routePoint(path,i/400);
    assert(canWalkInHouse(x,z,blocks),'house route clips furniture or a fence');
  }
}
assert(HOUSE_STATIONS.every(station=>canWalkInHouse(...station.point)));
for(const from of [ROOM.start,ROOM.mat,ROOM.corner,...HOUSE_STATIONS.map(s=>s.point)]){
  for(const to of HOUSE_STATIONS.map(s=>s.point))assertReachable(from,to);
}
assertReachable(ROOM.sleepStart,ROOM.bed);
assert.equal(houseRoute(ROOM.sleepStart,ROOM.bed).length,2,'the bedroom aisle stays clear');
const maxBlocks=HOUSE_SLOTS.map(spot=>[spot.x-1.51,spot.x+1.51,spot.z-1.51,spot.z+1.51]);
assert(HOUSE_STATIONS.every(station=>canWalkInHouse(...station.point,maxBlocks)));
for(const from of [ROOM.start,ROOM.mat,...HOUSE_STATIONS.map(s=>s.point)])
  for(const to of HOUSE_STATIONS.map(s=>s.point))assertReachable(from,to,maxBlocks);
assert.equal(houseRoute(ROOM.sleepStart,ROOM.bed,maxBlocks).length,2);
for(let i=0;i<HOUSE_SLOTS.length;i++)for(let j=i+1;j<HOUSE_SLOTS.length;j++){
  const a=maxBlocks[i],b=maxBlocks[j];
  assert(a[1]<=b[0]||b[1]<=a[0]||a[3]<=b[2]||b[3]<=a[2],'maximum item footprints do not overlap');
}
const purchase={stickers:100,ownedItems:[],equippedItem:null};
assert(buyItem(purchase,'berry-sofa').ok);
assert(!equipItem(purchase,'berry-sofa'));
assert(buyItem(purchase,'cloud-chair').ok);
assert(placeHouseItem(purchase,'berry-sofa',HOUSE_SLOTS[0].id));
purchase.houseLayout['berry-sofa'].turn=3; // Imported layouts face inward after migration.
assert(!placeHouseItem(purchase,'cloud-chair',HOUSE_SLOTS[0].id,2));
assert(placeHouseItem(purchase,'cloud-chair',HOUSE_SLOTS[1].id,0));
assert(placeHouseItem(purchase,'cloud-chair','storage'));
assert(!placeHouseItem(purchase,'moon-bookcase',HOUSE_SLOTS[2].id));
assert(buyItem(purchase,'sheets-stars').ok&&buyItem(purchase,'bed-bunny').ok);
assert(chooseBedItem(purchase,'sheets-stars')&&chooseBedItem(purchase,'bed-bunny'));
const reload=normalizeShop(JSON.parse(JSON.stringify(purchase)));
assert.equal(reload.houseLayout['berry-sofa'].turn,1);
assert.equal(reload.houseSheets,'sheets-stars');
assert.equal(reload.housePlush,'bed-bunny');
assert(placedHouseBlocks(reload.houseLayout).length===1);
assert(chooseBedItem(reload,'bed-bunny'));
assert.equal(reload.housePlush,null);
assert(!canWalkInHouse(0,6.5325),'padded-mat fence blocks movement');
assert(canWalkInHouse(-2.025,6.5325),'padded-mat gate permits movement');
assert(!canWalkInHouse(10,14.87),'the front return wall stops movement');
assert.deepEqual(ROOM.door,[0,13.95]);
assert(HOUSE_STATIONS.some(station=>station.id==='exit'&&station.point[0]===0&&station.point[1]>11),'main door is centred on the front wall');

const words=Object.keys(VOCABULARY);
assert(words.length>SHELF_CAPACITY);
assert.deepEqual(Array.from({length:shelfPageCount(words)},(_,i)=>shelfPageWords(words,i)).flat(),words);
assert.equal(shelfPageCount([]),1);

assert.equal(POSTER_BANK.length,10);
for(const asset of POSTER_BANK)assert(fs.readFileSync('dist/'+asset).subarray(8,12).toString()==='WEBP');
const firstPair=pickHousePosters([],()=>0);
const nextPair=pickHousePosters(firstPair,()=>0);
assert.equal(new Set(firstPair).size,6);
assert.notDeepEqual(nextPair,firstPair);

const renderedWords=[];
const posters=[];
globalThis.document={createElement:()=>({getContext:()=>({
  fillRect(){},clearRect(){},drawImage(image){posters.push(image.src);},
  measureText:t=>({width:t.length*27}),
  fillText:text=>renderedWords.push(text),
})})};
const scene=new THREE.Scene();scene.background=new THREE.Color(0xffffff);scene.fog=new THREE.Fog(0xffffff,30,60);
function model(geometry,color,x,y,z,group){
  const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color}));
  mesh.position.set(x,y,z);group.add(mesh);return mesh;
}
const figurines=[];
const firstDisplay=pickCabinetFigures([],()=>0);
const nextDisplay=pickCabinetFigures(firstDisplay.map(entry=>entry.name),()=>0);
assert.equal(new Set(firstDisplay.map(entry=>entry.name)).size,8);
assert.equal(new Set(firstDisplay.map(entry=>entry.kind)).size,3);
assert(new Set(firstDisplay.map(entry=>entry.size)).size>3);
assert.notDeepEqual(nextDisplay.map(entry=>entry.name),firstDisplay.map(entry=>entry.name));
globalThis.Image=class {
  naturalWidth=250;naturalHeight=360;
  set src(value){this.path=value;queueMicrotask(()=>this.onload());}
  get src(){return this.path;}
};
const world=new TownWorld(scene,{
  cube:(c,x,y,z,w,h,d,g)=>model(new THREE.BoxGeometry(w,h,d),c,x,y,z,g),
  cyl:(c,x,y,z,r,h,g)=>model(new THREE.CylinderGeometry(r,r,h,8),c,x,y,z,g),
  orb:(c,x,y,z,w,h,d,g)=>{
    const mesh=model(new THREE.SphereGeometry(1,8,6),c,x,y,z,g);
    mesh.scale.set(w,h,d);return mesh;
  },
  figure:name=>{figurines.push(name);return new THREE.Group();},
  portrait:async()=>({aspect:.72,texture:new THREE.Texture()}),

});
await world.refreshPosters();
const displayed=world.refreshCabinet();
await Promise.resolve();
const collection=world.house.getObjectByName('cabinet collectibles');
assert.equal(collection.children.filter(obj=>obj.userData.collectibleKind).length,8);
assert(figurines.every(name=>HOUSE_COLLECTION.includes(name)));
const freshDisplay=world.refreshCabinet();
await Promise.resolve();
assert.notDeepEqual([...freshDisplay.map(entry=>entry.name)].sort(),[...displayed.map(entry=>entry.name)].sort());
assert.equal(new Set(posters).size,6);
await world.refreshPosters();
assert.equal(new Set(posters.slice(6)).size,6);
assert.notDeepEqual(posters.slice(6),posters.slice(0,6));
for(const label of ['Parent Notes','Wardrobe','Word Library','Bedroom','Figure Cabinet','Toy Cupboard','Store Room'])
  assert(renderedWords.includes(label),label);
for(let i=0;i<shelfPageCount(words);i++)world.updateShelf(shelfPageWords(words,i));
assert(words.every(word=>renderedWords.includes(word)),'every saved word can appear on the shelf');
assert(!renderedWords.includes('Play Mat'));
assert(!renderedWords.includes('Main Door'),'no sign is painted above the door');
const wardrobe=world.house.getObjectByName('right-facing wardrobe');
const facing=new THREE.Vector3(0,0,1).applyEuler(wardrobe.rotation);
assert(facing.x>.999&&Math.abs(facing.z)<.001&&wardrobe.position.x<-15.5);
const mat=world.house.children.filter(o=>o.isMesh&&o.material.color.getHex()===PLAY_MAT_COLOR);
assert.equal(mat.length,0,'SchoolWorld owns the original reference mat surface');
const complete={ownedItems:HOME_GOODS.map(item=>item.id),houseLayout:{},houseSheets:'sheets-ocean',housePlush:'bed-bear'};
const floorItems=HOME_GOODS.filter(canPlaceOnFloor);
HOUSE_SLOTS.forEach((spot,i)=>assert(placeHouseItem(complete,floorItems[i].id,spot.id)));
world.syncHomeItems(complete);
const toyModels=HOME_GOODS.filter(item=>item.kind==='toy').map(item=>world.house.getObjectByName(item.id));
assert(toyModels.every(toy=>toy?.position.x<0),'owned toys appear on the cupboard shelves');
assert(world.house.getObjectByName('bed-bear')?.position.y>0);
for(const item of floorItems)assert(world.house.getObjectByName(item.id),'placed and stored goods have models');
assert.equal(world.houseObstacles.length,HOUSE_SLOTS.length);
world.show('house');
scene.updateMatrixWorld(true);
const shell=['left','right','front','back','ceiling'].map(face=>world.house.getObjectByName('house '+face));
assert(shell.every(face=>face.visible));
assert.equal(HOUSE_CAMERA_ZOOM,.5);
const clamped=clampHouseCamera(new THREE.Vector3(100,50,100));
assert(clamped.x<19.65&&clamped.y<10.75&&clamped.z<14.88);
const inside=new THREE.Vector3(0,1.8,0);
for(const direction of [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0]]){
  const ray=new THREE.Raycaster(inside,new THREE.Vector3(...direction),0,75);
  assert(ray.intersectObjects([...shell,world.mainDoor],true).length>0,'no opening to the outside');
}
for(const [name,expected] of [['notes desk',-1],['toy cupboard',1]]){
  const station=world.house.getObjectByName(name);
  const facing=new THREE.Vector3(0,0,1).applyEuler(station.rotation);
  assert(Math.abs(facing.x-expected)<.01&&Math.abs(station.position.x)>17);
}
assert(HOUSE_SLOTS.every(spot=>spot.x<0&&spot.turn===1||spot.z>12&&spot.turn===2));
const [sx,sz]=ROOM.start;
const cameraStart=clampHouseCamera(new THREE.Vector3(sx*.69+2.05,8.9,sz*.63+13)),
  playerHead=new THREE.Vector3(sx,2.6,sz);
const sight=new THREE.Raycaster(cameraStart,playerHead.clone().sub(cameraStart).normalize(),0,cameraStart.distanceTo(playerHead));
assert.equal(sight.intersectObject(world.mainDoor,true).length,0,'the foreground door does not cover the player');
assert(HOUSE_DOOR.height>=4.4&&HOUSE_DOOR.width>=3.4,'entrance clears tall friends and their accessories');
assert.equal(world.mainDoor.rotation.y,0);
world.show('house',true);
assert(world.night.visible);
delete globalThis.document;delete globalThis.Image;

const source=fs.readFileSync('dist/game.js','utf8');
const start=source.indexOf('function interactTown()');
const calls=[];
const state=vm.createContext({
  townView:'house',data:{carriedToy:null},toast(){},HOME:{id:'house'},$(){return {hidden:true};},
  exploreStreet:()=>calls.push('exit'),openTownActivities:()=>calls.push('stories'),
  friends:()=>calls.push('characters'),openShop:view=>calls.push(view),
  vocabularyBank:source=>calls.push(source),journal:()=>calls.push('notes'),
  openHouseCollection:(view='storage')=>calls.push(view),
});
vm.runInContext(source.slice(start,source.indexOf('function markTownDestination(',start)),state);
for(const townNear of HOUSE_STATIONS){state.townNear=townNear;vm.runInContext('interactTown()',state);}
assert.deepEqual(calls,['exit','stories','notes','wardrobe','house-shelf','characters','toys','storage']);
const pickerCalls=[];
const picker=vm.createContext({
  startWelcomeMusic:()=>pickerCalls.push('music'),friends:options=>pickerCalls.push(options.startAtHouse),
});
const pickerStart=source.indexOf('function startTownPicker()');
vm.runInContext(source.slice(pickerStart,source.indexOf('function getTownWorld()',pickerStart)),picker);
vm.runInContext('startTownPicker()',picker);
assert.deepEqual(pickerCalls,['music',true]);
assert(source.includes("$('frontStart').onclick=startTownPicker"));
const html=fs.readFileSync('dist/index.html','utf8');
assert(html.includes('id="frontStart">START</button>'));
assert(html.indexOf('id="houseControls"')<html.indexOf('id="world"'));
assert.match(fs.readFileSync('dist/town.css','utf8'),/#frontStart\{justify-content:center/);
const moves=[];
const elements=Object.fromEntries(['houseControls','world','townHud','townToolbar','targetLabel','topNotices'].map(id=>[id,{id,prepend(...children){moves.push([id,...children.map(child=>child.id)]);},append(...children){moves.push([id,...children.map(child=>child.id)]);}}]));
const hud=vm.createContext({townView:'town',$:id=>elements[id],document:{body:{classList:{toggle(){}}}}});
const controlsStart=source.indexOf('function setHouseControls(');
vm.runInContext(source.slice(controlsStart,source.indexOf('function syncTownToolbar(',controlsStart)),hud);
vm.runInContext('setHouseControls(true);setHouseControls(false)',hud);
assert.deepEqual(moves,[
 ['houseControls','townHud','townToolbar'],['topNotices','targetLabel'],
 ['houseControls','townHud','townToolbar'],['topNotices','targetLabel']
]);
console.log('PASS: furniture and gate collision, all house station routes, exterior-wall door, posters, rotating Sesame Street collectibles, all word shelf pages, bedtime route, enclosed shell, shop purchases, rotation, storage, and bedding persistence.');
