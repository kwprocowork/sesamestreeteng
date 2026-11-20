import {placedHouseBlocks} from './home-goods.js?v=46';
import * as THREE from './assets/three.module.js';

import {buildHouseInterior,canWalkInHouse} from './town-house.js?v=50';
export {ROOM} from './town-house.js?v=50';
import {buildTownscape} from './town-architecture.js?v=50';

export const TOWN_NAME = 'Sesame Street Town';
export const TOWN_LOOP = [-51,51];
export const HOME = {id:'house',name:'My House',icon:'🏠',swatch:'#ffca60',x:0,z:27.4,lane:38,
  doorZ:32.2,color:0xe85459,width:10,depth:8.8,district:'Welcome Plaza'};
const districts = [
  ['ball','Discovery Playroom','🔴','#ff995d',-24,-12,0xef654f,'rotunda','Main Street'],
  ['letters','Letter Garden','🌼','#fadc6c',-40,-35,0x73ae67,'garden','Wonder Park'],
  ['phonics','Sound Safari Park','🎵','#70d59e',-22,-58,0x50a496,'garden','Adventure Gardens'],
  ['body','Boogie Bandstand','🥁','#9bd6ff',20,-58,0x4389c9,'stage','Adventure Gardens'],
  ['cat','Cat’s Hideaway','🐈','#eba7e9',-41,-12,0xb165aa,'rowhouse','Main Street'],
  ['wants','Little Playhouse','🍼','#ffb994',13,-12,0xf79353,'rowhouse','Main Street'],
  ['comparison','Abby’s Toy Theatre','🎠','#f3b0fc',32,-35,0xc852a2,'theatre','Wonder Park'],
  ['mac-c9e229cf29d0c0d0','Rabbit’s Farm','🥕','#fdd26d',42,-58,0xe18a45,'barn','Adventure Gardens'],
];
const facilities = [
  ['carousel','Rainbow Carousel','🎠','#ffc667',-34,12,0xe56e71,'carousel','Welcome Plaza','Spin the carousel'],
  ['cafe','Cookie Café','🍪','#ffb266',-15,12,0x427fc2,'cafe','Welcome Plaza','Ring the café bell'],
  ['bubble','Bubble Bay','🫧','#7ae1f5',33,12,0x4bbccc,'bubble','Welcome Plaza','Make bubbles'],
  ['library','Storybook Library','📚','#a9dfaa',40,-12,0x6c9b78,'library','Main Street','Open the storybook'],
  ['star','Starlight Dome','⭐','#e6bbff',-20,-35,0xa65bc6,'dome','Wonder Park','Light the stars'],
  ['wheel','Skywheel','🎡','#a6e9ff',13,-35,0x4b97bb,'wheel','Wonder Park','Spin the Skywheel'],
  ['train','Rainbow Station','🚂','#ffd88c',-43,-58,0xdd7970,'station','Adventure Gardens','Send off the train'],
];
export const TOWN_SPINE = 5.55;
export const PLAY_LIMIT = 600000;
export const TRAVEL_TIME = 3000;
const dayFormat = new Intl.DateTimeFormat('en-CA',{
  timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit',
});
export const playDay = (now = Date.now()) => dayFormat.format(now - 6 * 3600000);
export function playBudget(record, now = Date.now()) {
  const day = playDay(now);
  return {
    day,
    used: record?.day === day && Number.isFinite(record.used)
      ? Math.max(0,Math.min(PLAY_LIMIT,record.used)) : 0
  };
}
export function townDestinations(lessons) {
  const fixed = [...districts,...facilities].map(([id,name,icon,swatch,x,z,color,style,district,action])=>{
    const depth=style==='wheel'?7:9.4;
    return {id,name,icon,swatch,x,z,color,style,district,action,width:13.8,depth,lane:z+10,doorZ:z+depth/2+.55};
  });
  const extras = Object.keys(lessons).filter(id=>id.startsWith('mac-') && !fixed.some(place=>place.id===id));
  return [HOME,...fixed.filter(place=>place.action||lessons[place.id]),...extras.map((id,index)=>{
    const x = [-42,-24,-10,15,31,44][index%6], z = -81 - 21*Math.floor(index/6);
    return {id,name:lessons[id].title,icon:'📚',swatch:'#e6b6f8',x,z,lane:z+10,doorZ:z+5.25,
      color:0xaf7ac6,style:'rowhouse',district:'Storybook Lane',width:11,depth:9.4};
  })];
}
export function townBounds(places) {
  return {left:-55,right:55,top:Math.min(-66,...places.map(p=>p.z-8)),bottom:43};
}
export function routeTo(start, destination, fromHome = false) {
  const end = [destination.x,destination.doorZ];
  if (!fromHome) return [start,end];
  return [start,[start[0],HOME.lane],[TOWN_SPINE,HOME.lane],
    [TOWN_SPINE,destination.lane],[destination.x,destination.lane],end];
}
export function routePoint(points, fraction) {
  const lengths = points.slice(1).map(([x,z],i)=>Math.hypot(x-points[i][0],z-points[i][1]));
  let remaining = lengths.reduce((a,b)=>a+b,0)*Math.max(0,Math.min(1,fraction));
  for (const [i,length] of lengths.entries()) {
    if (length && remaining <= length) {
      const [x,z] = points[i], [nx,nz] = points[i+1], along = remaining/length;
      return [x+(nx-x)*along,z+(nz-z)*along,Math.atan2(nx-x,nz-z)];
    }
    remaining -= length;
  }
  return [...points.at(-1),Math.PI];
}

export class TownWorld {
  constructor(scene, {cube,cyl,orb,figure,portrait}) {
    Object.assign(this,{cube,cyl,orb,scene,figure,portrait});
    this.house = new THREE.Group();
    this.street = new THREE.Group();
    this.night = new THREE.Group();
    this.route = new THREE.Group();
    this.water = [];
    this.kites = [];
    this.blocks = [];
    this.street.add(this.route);
    this.scene.add(this.house,this.street);
    const {window,door,updateShelf,refreshPosters,refreshCabinet,updateInventory}=buildHouseInterior(this);
    this.window=window;this.mainDoor=door;this.updateShelf=updateShelf;this.paintHouseInventory=updateInventory;
    this.houseObstacles=[];this.refreshPosters=refreshPosters;this.refreshCabinet=refreshCabinet;
    this.dayWindowMaterial=window.material;
    this.nightWindowMaterial=new THREE.MeshBasicMaterial({color:0x393867});
    this.hide();
  }
  syncHomeItems(state){
    this.houseObstacles=placedHouseBlocks(state.houseLayout);
    this.paintHouseInventory(state);
  }
  buildStreet(places) {
    const sig = JSON.stringify(places);
    if(this.streetSignature === sig) return;
    this.streetSignature = sig;
    const s=this.street;
    this.clearGroup(this.route);
    const old=s.children.find(o=>o!==this.route);
    if(old) {this.clearGroup(old);old.removeFromParent();}
    const g=new THREE.Group();s.add(g);
    this.water=[];this.kites=[];this.blocks=[];
    this.facilityEffects=new Map();
    this.bounds=townBounds(places);
    buildTownscape(this,places,g,{spine:TOWN_SPINE,loop:TOWN_LOOP});
  }
  useFacility(id, seconds) {
    const effect=this.facilityEffects.get(id);
    if(effect)effect.started=seconds;
  }
  batchStreet(group) {
    const buckets=new Map();
    for(const item of group.children) {
      if(!item.isMesh||item.material.map||item.userData.townAnimated)continue;
      const key=[item.geometry.id,item.material.id,item.castShadow,item.receiveShadow].join(':');
      if(!buckets.has(key))buckets.set(key,[]);
      buckets.get(key).push(item);
    }
    for(const items of buckets.values()) {
      if(items.length<3)continue;
      const first=items[0],batch=new THREE.InstancedMesh(first.geometry,first.material,items.length);
      items.forEach((item,index)=>{
        item.updateMatrix();batch.setMatrixAt(index,item.matrix);item.removeFromParent();
      });
      batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;
      group.add(batch);
    }
  }
  clearGroup(group) {
    while(group.children.length) {
      const root=group.children.at(-1);
      root.traverse(o=>{
        if(o.isInstancedMesh)o.dispose();
        if(o.userData.privateGeometry)o.geometry.dispose();
        if(o.userData.townOwned) {o.geometry.dispose();o.material.dispose();}
        if(o.material?.map?.isCanvasTexture) {o.material.map.dispose();o.material.dispose();o.geometry.dispose();}
      });
      group.remove(root);
    }
  }
  showRoute(points) {
    this.clearGroup(this.route);
    for(let i=0;i<points.length-1;i++) {
      const [x,z]=points[i], [nx,nz]=points[i+1];
      const length=Math.hypot(nx-x,nz-z);
      for(let d=.5;d<length;d+=.8) {
        const bead=this.cyl(0xffc547,x+(nx-x)*d/length,.075,z+(nz-z)*d/length,.13,.036,this.route);
        bead.castShadow=false;
      }
    }
  }
  show(view,night=false) {
    this.house.visible=view==='house';
    this.street.visible=view==='town';
    this.night.visible=night;
    this.mainDoor.rotation.y=0;
    this.window.material=night?this.nightWindowMaterial:this.dayWindowMaterial;
    this.scene.background.set(night?0x414265:view==='house'?0xd4edf4:0x9edbf2);
    this.scene.fog.color.copy(this.scene.background);
    this.scene.fog.near=view==='house'?38:55;
    this.scene.fog.far=view==='house'?77:155;
  }
  hide() {this.house.visible=false;this.street.visible=false;}
  canWalk(x,z,view) {
    if(view==='house')return canWalkInHouse(x,z,this.houseObstacles);
    const b=this.bounds;
    return x>b.left&&x<b.right&&z>b.top&&z<b.bottom
      && !this.blocks.some(([l,r,t,d])=>x>l&&x<r&&z>t&&z<d);
  }
  tick(seconds,reduced) {
    for(const effect of this.facilityEffects.values()){
      const elapsed=seconds-effect.started;
      const progress=Math.min(1,Math.max(0,elapsed/effect.duration));
      effect.update(reduced?(elapsed<=effect.duration?1:0):progress,elapsed,reduced);
    }
    if(reduced)return;
    for(const [i,{dot,x,y,z,radius}] of this.water.entries()) {
      const u=(seconds*.73+i*.163)%1,a=i*2.4;
      dot.position.set(x+Math.cos(a)*u*radius,y+Math.sin(u*Math.PI)*(1.65+radius*.36),z+Math.sin(a)*u*radius);
    }
    this.kites.forEach((kite,i)=>{kite.position.y=kite.userData.baseY+Math.sin(seconds*1.4+i)*.38;});
  }
}
