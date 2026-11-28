import * as THREE from './assets/three.module.js';
export const MINI_LINES={retry:'Have another look. We can try together.',done:'Thank you! You helped our neighbour. You earned a bonus sticker.'};
export const MINI_TASKS={
 letters:{title:'Match a letter',instruction:'Listen. Apple begins with A. Tap the letter A.',model:'Apple begins with A.',kind:'choice'},
 candies:{title:'Count the candies',instruction:'Count the candies on the tray. Tap how many you can see.',model:'There are four candies.',kind:'choice'},
 shapes:{title:'Draw a shape',instruction:'Join the three glowing dots. We can draw a triangle together.',model:'I drew a triangle.',kind:'dots'},
 sweep:{title:'Sweep the path',instruction:'Tap the three leafy patches. Help our neighbour sweep the path.',model:'The path is clean.',kind:'collect'},
 fruits:{title:'Collect dropped fruit',instruction:'Pick up the three fallen apples. Put them in the basket.',model:'Here are your apples.',kind:'collect'},
 cap:{title:'Open a bottle',instruction:'Tap the cap three times. Turn it gently to open the bottle.',model:'I opened the bottle.',kind:'repeat'},
 zipper:{title:'Zip a bag',instruction:'Tap the zipper three times. Pull it up to close the bag.',model:'I closed the bag.',kind:'repeat'}
};
// Real world targets use the shared rounded mesh builders and original Schoolbus-style hand props.
export class NeighbourMiniWorld{
 constructor(scene,kit,n,type){this.kit=kit;this.type=type;this.task=MINI_TASKS[type];this.root=new THREE.Group();this.root.name='Neighbour '+type;this.root.position.copy(n.pos).add(new THREE.Vector3(0,0,2));scene.add(this.root);this.targets=[];this.progress=0;this.used=new Set();const {cube,orb,cyl,labelBoard}=kit,g=this.root;
 this.motions=[];if(!['sweep','fruits'].includes(type)){cube(0xc6b393,0,.62,0,3.6,.13,1.4,g);for(const x of [-1.45,1.45])cube(0xb6a187,x,.3,0,.1,.6,.1,g);}
 const target=(i,obj)=>{obj.traverse(o=>o.userData.miniIndex=i);this.targets.push(obj);return obj;};
 if(type==='letters'){labelBoard('apple',0,1.9,0,2,g);for(let i=0;i<3;i++)target(i,labelBoard(['A','B','C'][i],(i-1)*1.05,1, .5,.8,g));}
 else if(type==='candies'){for(let i=0;i<4;i++){orb([0xf1a5b3,0x9ccedb,0xf0cb80,0xb9a7d5][i],(i-1.5)*.55,.9,-.15,.18,.14,.13,g);for(const side of [-1,1])orb(0xf6d9a0,(i-1.5)*.55+side*.23,.9,-.15,.09,.12,.09,g);}for(let i=0;i<3;i++)target(i,labelBoard(String(i+3),(i-1)*1.05,1.3,.6,.8,g));}
 else if(type==='shapes'){this.vertices=[[-1,.85,.45],[0,1.9,.45],[1,.85,.45]];this.vertices.forEach((v,i)=>target(i,orb(0xffd76d,...v,.14,.14,.14,g)));}
 else if(type==='sweep'||type==='fruits'){this.basket=cyl(0xd1a46e,1.6,.23,-.3,.38,.45,g);for(let i=0;i<3;i++){const item=new THREE.Group();item.position.set((i-1)*1.1,.12,.5);g.add(item);if(type==='fruits'){orb(0xe8846c,0,0,0,.18,.18,.18,item);cube(0x7eaa6b,.04,.2,0,.14,.045,.06,item);}else{for(let j=0;j<4;j++){const leaf=orb(0xa6bd74,(j%2)*.12,0,Math.floor(j/2)*.1,.13,.02,.06,item);leaf.rotation.y=j;}}target(i,item);}}
 else if(type==='cap'){this.bottle=cyl(0x9acbd0,0,1,0,.25,.6,g);this.cap=cyl(0xf2ca7c,0,1.37,0,.19,.12,g);target(0,this.cap);}
 else{this.bag=cube(0xbca4d3,0,1.13,0,.9,1,.4,g);cube(0xeedbaa,0,1.2,.23,.035,.6,.03,g);this.zip=target(0,cube(0xf2d47c,0,.94,.28,.13,.14,.05,g));}
 }
 choices(){if(this.type==='letters')return ['A','B','C'].map(label=>({label}));if(this.type==='candies')return ['3','4','5'].map(label=>({label}));if(this.task.kind==='repeat')return [{label:this.type==='cap'?'Turn the cap':'Pull the zipper'}];return [0,1,2].filter(i=>!this.used.has(i)).map(i=>({label:this.type==='shapes'?'Join dot '+(i+1):this.type==='sweep'?'Sweep patch '+(i+1):'Pick up apple '+(i+1),index:i}));}
 answer(index){if(this.complete)return 'done';if(this.task.kind==='choice'){if(index!==(this.type==='letters'?0:1))return 'wrong';this.progress=3;}
 else if(this.task.kind==='repeat'){this.progress++;if(this.cap){this.cap.rotation.y+=1.4;this.cap.position.y+=.08;}if(this.zip)this.zip.position.y+=.18;}
 else{if(this.used.has(index)||!this.targets[index])return 'wrong';if(this.type==='shapes'){const previous=[...this.used].at(-1);if(previous!==undefined)this.kit.rod(0x79b7bc,this.vertices[previous],this.vertices[index],.045,this.root);this.targets[index].material=this.targets[index].material.clone();this.targets[index].material.color.set(0x8dd5ba);}else{const target=this.targets[index];target.visible=false;if(this.type==='fruits'){const carry=target.clone(true);carry.visible=true;this.root.add(carry);this.motions.push({object:carry,from:target.position.clone(),to:new THREE.Vector3(1.6+(index-1)*.12,.5,-.3),time:0,fruit:true});}else{const broom=new THREE.Group();broom.position.copy(target.position);this.root.add(broom);this.kit.rod(0xbfa079,[0,.2,0],[0,1.3,0],.035,broom);this.kit.cube(0xe6c680,0,.15,0,.55,.25,.16,broom);this.motions.push({object:broom,time:0});}}this.used.add(index);this.progress=this.used.size;if(this.progress===3&&this.type==='shapes'){const order=[...this.used];this.kit.rod(0x79b7bc,this.vertices[order[2]],this.vertices[order[0]],.045,this.root);}}
 return this.progress>=3?'done':'more';}
 tick(dt,{paused=false,reduced=false}={}){if(paused)return;for(const a of this.motions){a.time=Math.min(.8,a.time+dt);const u=a.time/.8;if(a.fruit){a.object.position.lerpVectors(a.from,a.to,u);if(!reduced)a.object.position.y+=Math.sin(u*Math.PI)*.65;}else{a.object.rotation.z=reduced?0:Math.sin(u*Math.PI*4)*.4;if(u===1)a.object.visible=false;}}}
 pick(ray){const hit=ray.intersectObjects(this.targets.filter(o=>o.visible),true)[0];if(!hit)return null;let o=hit.object;while(o&&o.userData.miniIndex===undefined)o=o.parent;return o?.userData.miniIndex??null;}
 dispose(){this.root.removeFromParent();this.root.traverse(o=>{if(o.isMesh&&o.geometry?.type==='PlaneGeometry'&&o.material?.map){o.material.map.dispose();o.material.dispose();o.geometry.dispose();}});}
}
