import * as THREE from './assets/three.module.js';
import {homeModel} from './home-models.js?v=76a';
import {HOME_ITEM} from './home-goods.js?v=76a';
export const MAT_SLOTS=[[-5.8,-1.6],[5.8,-1.6],[-5.8,1.9],[5.8,1.9],[-5.8,5.4],[5.8,5.4]];
const ownedToy=(s,id)=>s.ownedItems?.includes(id)&&HOME_ITEM.get(id)?.kind==='toy';
export function normalizeToyPlay(s){s.playmatToys=[...new Set(Array.isArray(s.playmatToys)?s.playmatToys:[])].filter(id=>ownedToy(s,id)).slice(0,MAT_SLOTS.length);if(!ownedToy(s,s.carriedToy)||s.playmatToys.includes(s.carriedToy))s.carriedToy=null;return s;}
export function takeShelfToy(s,id){normalizeToyPlay(s);if(!ownedToy(s,id)||s.carriedToy||s.playmatToys.includes(id))return false;s.carriedToy=id;return true;}
export function placeMatToy(s){normalizeToyPlay(s);if(!s.carriedToy||s.playmatToys.length>=MAT_SLOTS.length)return false;s.playmatToys.push(s.carriedToy);s.carriedToy=null;return true;}
export function putAwayToy(s,id){normalizeToyPlay(s);if(!ownedToy(s,id))return false;const at=s.playmatToys.indexOf(id);if(at>=0)s.playmatToys.splice(at,1);else if(s.carriedToy===id)s.carriedToy=null;else return false;return true;}
export function poseToy(model,id,u,reduced=false){const wave=reduced?0:Math.sin(u*Math.PI),turn=reduced?0:Math.sin(u*Math.PI*2);model.position.set(0,0,0);model.rotation.set(0,0,0);model.scale.setScalar(1);
 if(id==='toy-train'||id==='toy-bus'){model.position.x=turn*1.15;model.rotation.y=turn*.18;}
 if(id==='toy-rocket'){model.position.y=wave*2;model.rotation.z=turn*.12;}
 if(id==='toy-blocks'){model.children.forEach((o,i)=>{o.userData.playBase??=o.position.clone();o.position.copy(o.userData.playBase);o.position.y+=wave*(i+1)*.15;o.rotation.z=turn*(i%2?.2:-.2);});}
 if(id==='toy-duck'){model.position.y=Math.abs(turn)*.35;model.rotation.z=turn*.18;model.rotation.y=turn*.35;}
 if(id==='toy-drum'){model.scale.y=1-Math.abs(turn)*.13;model.children.slice(-2).forEach((o,i)=>o.rotation.z=turn*(i?1:-1)*.6);}
}
export class ToyPlayWorld{
 constructor(house,kit){this.root=new THREE.Group();this.root.name='Owned playmat toys';house.add(this.root);this.kit=kit;this.toys=new Map();this.signature='';this.effect=null;this.carried=null;}
 sync(state){normalizeToyPlay(state);const signature=JSON.stringify([state.playmatToys,state.carriedToy]);if(signature===this.signature)return;this.signature=signature;this.root.clear();this.toys.clear();this.effect=null;this.carried=null;
 state.playmatToys.forEach((id,i)=>{const anchor=new THREE.Group();anchor.position.set(MAT_SLOTS[i][0],.055,MAT_SLOTS[i][1]);this.root.add(anchor);const scale=new THREE.Group();scale.scale.setScalar(2.2);anchor.add(scale);const model=homeModel(id,this.kit);scale.add(model);model.traverse(o=>o.userData.playToy=id);this.toys.set(id,{anchor,model});});
 if(state.carriedToy){this.carried=homeModel(state.carriedToy,this.kit);this.carried.scale.setScalar(1.5);this.root.add(this.carried);}
 }
 nearest(position){return [...this.toys.entries()].filter(([,t])=>position.clone().setY(0).distanceTo(t.anchor.position.clone().setY(0))<3).sort((a,b)=>position.distanceTo(a[1].anchor.position)-position.distanceTo(b[1].anchor.position))[0]?.[0];}
 pick(ray){this.root.updateMatrixWorld(true);return ray.intersectObjects([...this.toys.values()].map(t=>t.model),true)[0]?.object.userData.playToy;}
 play(id,position){const t=this.toys.get(id);if(!t||this.effect||position.clone().setY(0).distanceTo(t.anchor.position.clone().setY(0))>=3)return false;this.effect={id,time:0};return true;}
 tick(dt,player,{paused=false,reduced=false}={}){if(paused)return;if(this.carried){this.carried.position.copy(player.position).add(new THREE.Vector3(.55,1.25,.35));this.carried.rotation.y=player.rotation.y;}
 if(this.effect){const e=this.effect;e.time=Math.min(3,e.time+dt);poseToy(this.toys.get(e.id).model,e.id,e.time/3,reduced);if(e.time===3){poseToy(this.toys.get(e.id).model,e.id,0,true);this.effect=null;}}
 }
}
