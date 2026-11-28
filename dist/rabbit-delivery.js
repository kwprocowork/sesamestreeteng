import * as THREE from './assets/three.module.js';
import {PhonicsWorld} from './phonics-world.js?v=75a';

// Authored from all 15 supplied photographs, checked directly against the pages.
// Targets are actions in the scene; speaking never substitutes for an action.
const step=(scene,title,action,at,count,word,sentence,clue,page)=>({scene,title,action,at,count,word,sentence,clue,page,icon:'🥕'});
export const DELIVERY_STEPS=[
 step('garden','A seed becomes a carrot','Water',[-3,2],3,'water','', 'Help the rabbit family water their carrot. Watch it grow!',2),
 step('garden','Pull together','Pull',[-3,2],3,'pull','We can pull together.','The carrot is enormous. Pull together with the rabbit family!',2),
 step('home','A wonderful gift','Look',[0,0],1,'big carrot','This carrot is very big.','Look at the big, beautiful carrot on the table.',3),
 step('home','Mum has an errand','Help Mum',[-3,1],1,'Grandma','This carrot is for Grandma.','Mum asks Little Rabbit to take the carrot to Grandma. Will you help?',3),
 step('home','Wrap the gift','Tie a bow',[0,0],1,'bow','','Help Mum tie a red bow around the carrot.',4),
 step('home','Ready to go','Carry',[0,0],1,'carry',"Let’s go!",'Help Little Rabbit lift the gift. Keep it safe for Grandma.',4),
 step('path','Left, right, left','March',[-3,2],3,'left, right','','Follow the winding path together. Left, right, left! The carrot is for Grandma.',5),
 step('hill','The sunny hill','Rest',[-3,0],2,'hot','I am hot and tired.','Little Rabbit is hot and tired. Lead her to the shady tree and rest together.',6),
 step('hill','Cat has an idea','Talk to Cat',[3,1],1,'for Grandma','No, this carrot is for Grandma.','Cat asks why Rabbit does not eat the carrot. Help Rabbit keep her promise.',6),
 step('stream','A cool drink','Drink',[-2,2],2,'water','Can I have some water, please?','Rabbit is thirsty beside the stream. Help her take a drink; the gift stays on the bank.',7),
 step('stream','Fish asks a question','Talk to Fish',[2,1],1,'for Grandma','No, this carrot is for Grandma.','Fish pops out of the water and asks about the carrot. It is still Grandma’s gift.',7),
 step('forest','A little forest snack','Help Rabbit',[-3,1],2,'hungry','I am hungry.','Rabbit is hungry and tired. Help her sit on the grass. Rabbit nibbles grass as she does in the book.',8),
 step('forest','Bird asks a question','Talk to Bird',[2,1],1,'for Grandma','No, this carrot is for Grandma.','Bird asks why Rabbit does not eat the carrot. Help her explain who it is for.',8),
 step('outside','Grandma’s tree house','Walk to the door',[0,-1],1,'house','','Follow Rabbit out of the forest to Grandma’s tree house.',9),
 step('outside','Grandma, open please','Knock',[0,-1],3,'open','Can you open the door, please?','Knock on Grandma’s door. Look up: Grandma will appear at her window.',10),
 step('outside','A warm welcome','Hug Grandma',[1,0],1,'hello','Hello, Grandma!','Grandma opens the door, smiles and gives Rabbit a hug and a kiss. Join their welcome.',11),
 step('outside','The special delivery','Give the carrot',[1,0],1,'give','Here is your carrot, Grandma.','Help Rabbit hand the whole carrot to Grandma. You kept the gift safe all the way!',11),
 step('inside','A song together','Make music',[-1,1],4,'carrot','','Join Rabbit and Grandma’s carrot song. Tap the little drum four times to make music and see them dance.',12),
 step('inside','Goodbye, Grandma','Wave',[2,1],1,'goodbye','Goodbye, Grandma.','Rabbit is ready to go home. Wave goodbye to Grandma together.',13),
 step('return','A lighter journey home','Walk home',[-3,2],3,'home','','Walk home with empty hands. Wave to Fish, Cat and Bird along the way.',13),
 step('garden','Mum and Dad are waiting','Greet Mum and Dad',[2,1],1,'hello',"I’m home!",'Mum and Dad are waiting outside. Rabbit runs to meet them.',14),
 step('home','Tell the whole story','Tell Mum',[0,1],1,'happy','Grandma is happy!','Tell Mum and Dad that Grandma received the carrot and was very happy. The whole family celebrates your kindness.',15)
];
export function createRabbitRoute(random=Math.random){const pick=Math.min(2,Math.max(0,Math.floor(random()*3))),pairs=[[7,8],[9,10],[11,12]],route=[0,1,2,3,4,5,6,...pairs[pick],13,14,15,16,17,18,19,20,21];route.animal=['cat','fish','bird'][pick];return route;}
export const RABBIT_STORY={id:'mac-c9e229cf29d0c0d0',title:"Little Rabbit’s Special Delivery",setting:'garden',adventure:'rabbit-delivery',intro:'Help Little Rabbit grow a carrot, carry it safely to Grandma, visit her, and come home. This shorter visit includes one randomly chosen animal encounter on the way.',ending:'The carrot reached Grandma, and Rabbit told her parents the happy news. You helped her keep a promise from beginning to end!',beats:DELIVERY_STEPS};

export class RabbitDeliveryWorld{
 constructor(scene,kit){
  this.kit=kit;this.scene=scene;this.root=new THREE.Group();this.root.name='Little Rabbit complete story';scene.add(this.root);
  this.zones=new Map();this.index=0;this.taps=0;this.timer=0;this.effectTime=0;this.hasCarrot=false;this.delivered=false;this.time=0;
  this.rabbit=this.makeRabbit('child');this.root.add(this.rabbit);
  this.cargo=this.carrot(true);this.root.add(this.cargo);this.cargo.visible=false;
  this.build();this.root.visible=false;
 }
 get current(){return DELIVERY_STEPS[this.index];}
 group(name){const g=new THREE.Group();this.zones.set(name,g);this.root.add(g);return g;}
 makeRabbit(kind){
  const {orb,cube,cyl,rod}=this.kit,g=new THREE.Group(),adult=kind!=='child',color=kind==='mum'?0xe9b2c4:kind==='dad'?0x8e98a0:kind==='grandma'?0xbfc3c4:0xfff6e5;
  orb(color,0,1.75,0,.55,.53,.43,g);orb(color,0,1.48,.34,.40,.25,.22,g);
  for(const s of[-1,1]){const ear=orb(color,s*.28,2.4,-.04,.19,.64,.17,g);ear.rotation.z=-s*.18;const inner=orb(0xe4a9ad,s*.28,2.43,.105,.09,.43,.035,g);inner.rotation.z=-s*.18;orb(0xfffdf5,s*.2,1.82,.39,.13,.18,.06,g);orb(0x553b30,s*.18,1.8,.445,.065,.10,.03,g);orb(0xffffff,s*.18-.018,1.85,.474,.022,.032,.012,g);orb(color,s*.26,.16,.16,.23,.14,.35,g);orb(color,s*.56,1,.08,.14,.34,.15,g);}
  orb(0x774939,0,1.52,.56,.1,.075,.07,g);rod(0x78493a,[-.16,1.38,.50],[0,1.32,.55],.018,g);rod(0x78493a,[0,1.32,.55],[.16,1.38,.5],.018,g);
  orb(kind==='dad'?0x99694b:0x427da5,0,.68,0,.5,.55,.36,g);cube(kind==='mum'?0xffdc64:kind==='grandma'?0xe793a9:0xf2cb51,0,1.03,.22,.67,.65,.34,g);
  if(kind==='grandma'){orb(0xf4dfd2,0,2.03,-.17,.62,.4,.35,g);for(const s of[-1,1])orb(0xffffff,s*.24,1.87,.46,.15,.04,.025,g);}
  if(kind==='child'){for(const s of[-1,1])orb(s<0?0x58a9d0:0xf6d457,s*.1+.25,2.1,.30,.11,.10,.04,g);g.scale.setScalar(.66);}
  if(adult)g.scale.setScalar(.78);return g;
 }
 carrot(bow=false){const {orb,rod}=this.kit,g=new THREE.Group();const body=new THREE.Mesh(new THREE.ConeGeometry(.35,1.6,16),new THREE.MeshStandardMaterial({color:0xf28a35,roughness:.68}));body.rotation.z=Math.PI/2;g.add(body);for(let i=0;i<3;i++)rod(0x4e9b54,[-.7,0,0],[-1.15,.18*(i-1),.2*(i-1)],.065,g);if(bow){for(const s of[-1,1])orb(0xb8414d,s*.18,.20,0,.22,.13,.11,g);rod(0xb8414d,[0,.25,0],[0,-.28,0],.045,g);}return g;}
 tree(x,z,g){const {cyl,orb}=this.kit;cyl(0x927055,x,1.5,z,.3,3,g);for(let i=0;i<5;i++)orb(i%2?0x62996a:0x4d825c,x+Math.sin(i*2)*.8,3.5+Math.cos(i)*.35,z+Math.cos(i*2)*.6,1.3,1,1.2,g);}
 house(g,tree=false){const {cube,cyl,orb}=this.kit;
  if(tree){cyl(0x9c7853,0,2.8,-2.5,2.1,5.7,g);for(let i=0;i<5;i++)orb(0x66985c,(i-2)*1.2,6.5,-2.5,1.7,1.3,1.8,g);}
  else{cube(0xf1cc82,0,2.7,-3.2,6,5.4,1.4,g);orb(0xd66d59,0,5.7,-3.2,3.4,.8,1.3,g);}
  // Open frame rather than a solid panel across the doorway.
  for(const x of [-1.82,1.82])cube(0x577d91,x,2.25,-.59,.24,4.5,.2,g);
  cube(0x577d91,0,4.5,-.59,3.88,.22,.2,g);
  const door=new THREE.Group();door.position.set(-1.7,0,-.45);g.add(door);
  cube(0xc76049,1.7,2.2,0,3.4,4.4,.14,door);orb(0xf2d77c,3.05,1.85,.12,.08,.08,.06,door);
  cube(0x76a9bd,0,5.1,-.58,1,1,.12,g);cube(0xffdf8c,0,5.1,-.49,.75,.75,.02,g);return door;}

 build(){
  const {cube,cyl,orb,rod}=this.kit;
  for(const name of ['garden','home','path','hill','stream','forest','outside','inside','return']){
   const g=this.group(name),inside=['home','inside'].includes(name);cube(inside?0xc9ab7b:0x9fbd79,0,-.16,0,20,.3,17,g);
   if(inside){cube(0xf2dfaf,0,1.8,-4,18,3.6,.25,g);for(const x of[-7,7])cube(0xa7c7c5,x,2,-3.8,1.8,1.8,.15,g);cube(0xf6cf7a,0,1.1,-3.8,2.8,2,.1,g);}
   else{for(let i=0;i<9;i++)orb(0xdcc9a0,Math.sin(i*.8)*1.5,.02,6-i*1.1,.9,.04,.6,g);for(const x of[-7,7])for(const z of[-3,4])this.tree(x,z,g);for(let i=0;i<15;i++){const x=(i%2?-1:1)*(3.5+i%4*.7),z=-3+Math.floor(i/2)*1.3;rod(0x588d54,[x,0,z],[x,.4,z],.02,g);orb(i%2?0xe2a1ae:0xf6ce6c,x,.5,z,.13,.12,.13,g);}}
  }
  const garden=this.zones.get('garden');this.house(garden);cube(0x9c7456,-3,.06,1,2.2,.18,2.2,garden);this.plant=this.carrot();this.plant.rotation.z=-Math.PI/2;this.plant.position.set(-3,-.25,1);garden.add(this.plant);
  this.leaves=new THREE.Group();garden.add(this.leaves);this.leaves.position.set(-3,.15,1);for(let i=0;i<4;i++)rod(0x4d9653,[0,0,0],[Math.sin(i)*.4,.65,Math.cos(i)*.3],.06,this.leaves);
  this.water=new THREE.Group();garden.add(this.water);for(let i=0;i<7;i++)orb(0x80d0e2,-3+Math.sin(i)*.4,.3+i*.17,1+Math.cos(i)*.4,.06,.12,.06,this.water);this.water.visible=false;
  for(const name of['garden','home']){const g=this.zones.get(name);for(const [kind,x]of[['mum',2],['dad',4]]){const a=this.makeRabbit(kind);a.position.set(x,0,name==='garden'?0:-1);g.add(a);}}
  const home=this.zones.get('home');cyl(0x719b84,0,.75,-1,1.5,.18,home);cyl(0x98724e,0,.35,-1,.15,.7,home);this.tableGift=this.carrot();this.tableGift.position.set(0,1.12,-1);home.add(this.tableGift);this.tableBow=this.carrot(true);this.tableBow.position.copy(this.tableGift.position);home.add(this.tableBow);
  const hill=this.zones.get('hill');orb(0xffdc73,5,5,-4,.7,.7,.25,hill);this.tree(-3,-1.8,hill);this.cat=PhonicsWorld.prototype.model.call({kit:this.kit,animations:[]},'cat');this.cat.position.set(3,0,0);hill.add(this.cat);
  const stream=this.zones.get('stream');cube(0x79bbca,0,.01,-.7,18,.07,2,stream);for(let i=0;i<9;i++)orb(0xe4e1c3,-8+i*2,.07,.4,.35,.10,.22,stream);this.fish=PhonicsWorld.prototype.model.call({kit:this.kit,animations:[]},'fish');this.fish.position.set(2,-.3,-.5);stream.add(this.fish);
  const forest=this.zones.get('forest');for(const x of[-4,0,4])this.tree(x,-2.5,forest);this.grass=new THREE.Group();forest.add(this.grass);for(let i=0;i<15;i++)rod(0x47965b,[-3+Math.sin(i)*.55,0,Math.cos(i)*.5],[-3+Math.sin(i)*.55,.25,Math.cos(i)*.5],.03,this.grass);
  this.bird=new THREE.Group();forest.add(this.bird);this.bird.position.set(2,1.2,0);orb(0x58a6cf,0,.35,0,.3,.35,.25,this.bird);orb(0x58a6cf,0,.68,.12,.23,.23,.23,this.bird);orb(0xf2d466,0,.65,.36,.10,.06,.17,this.bird);for(const s of[-1,1])orb(0x386e9b,s*.29,.4,0,.16,.3,.1,this.bird);orb(0x253d47,.13,.74,.28,.045,.06,.025,this.bird);
  const outside=this.zones.get('outside');this.door=this.house(outside,true);this.grandma=this.makeRabbit('grandma');outside.add(this.grandma);this.grandma.position.set(0,1.9,-.4);this.grandma.scale.setScalar(.42);
  this.grandmaInside=this.makeRabbit('grandma');this.grandmaInside.position.set(2,0,0);this.zones.get('inside').add(this.grandmaInside);cyl(0x9b7456,-1,.65,0,.55,.7,this.zones.get('inside'));cyl(0xf0d4a3,-1,1.03,0,.58,.06,this.zones.get('inside'));
  this.notes=new THREE.Group();this.zones.get('inside').add(this.notes);for(let i=0;i<8;i++){orb(i%2?0xf3cc69:0xd68ca5,Math.sin(i)*2,2+i*.16,-1,.10,.14,.10,this.notes);rod(0x618e8a,[Math.sin(i)*2,2+i*.16,-1],[Math.sin(i)*2,2.5+i*.16,-1],.025,this.notes);}this.notes.visible=false;
  const ret=this.zones.get('return');cube(0x87bfca,0,.01,-1,18,.06,1.2,ret);for(const [source,x,z]of[[this.cat,3,1],[this.bird,-3,0],[this.fish,0,-1]]){const clone=source.clone();clone.position.set(x,.1,z);clone.userData.encounterAnimal=source===this.cat?'cat':source===this.fish?'fish':'bird';ret.add(clone);}
 }
 chooseEncounter(animal){this.encounterAnimal=animal;this.zones.get('return').children.forEach(o=>{if(o.userData.encounterAnimal)o.visible=o.userData.encounterAnimal===animal;});}
 reset(){this.index=0;this.taps=0;this.timer=0;this.effectTime=0;this.hasCarrot=false;this.delivered=false;this.root.visible=true;this.cargo.visible=false;this.water.visible=false;this.notes.visible=false;this.grass.scale.y=1;this.grandmaInside.rotation.z=0;this.plant.position.y=-.25;this.plant.scale.setScalar(.3);this.rabbit.position.set(1,0,4.5);}
 enter(index,player){const before=this.current?.scene;this.index=index;this.taps=0;this.timer=0;this.effectTime=0;const current=this.current;for(const [name,g]of this.zones)g.visible=name===current.scene;if(before!==current.scene||index===0){player.position.set(0,0,5.4);this.rabbit.position.set(1.2,0,4.4);}this.tableGift.visible=index<4||index===21;this.tableBow.visible=index>=4&&index<6;this.cargo.visible=this.hasCarrot&&!this.delivered;
  if(current.scene==='outside'){const open=index>=15;this.door.rotation.y=open?-1.3:0;this.grandma.visible=index>=14;this.grandma.position.set(open?1:0,open?0:1.9,open?-1:-.4);this.grandma.scale.setScalar(open?.78:.42);}
 }
 target(){const s=this.current;if(['March','Walk home'].includes(s.action)){const p=[[-3,2],[3,0],[0,-2]][Math.min(this.taps,2)];return new THREE.Vector3(p[0],0,p[1]);}return new THREE.Vector3(s.at[0],0,s.at[1]);}
 progress(){return this.current.count>1?' · '+this.taps+'/'+this.current.count:'';}
 interact(position,{completeStop=false}={}){if(this.timer||this.effectTime||position.clone().setY(0).distanceTo(this.target())>=1.75)return false;if(completeStop)this.taps=Math.max(this.taps,this.current.count-1);this.taps++;this.effectTime=.8;const i=this.index;
  if(i===0){this.water.visible=true;this.plant.scale.setScalar(.3+this.taps*.23);}
  if(i===1)this.plant.position.y=-.25+this.taps*.35;
  if(i===4){this.tableGift.visible=false;this.tableBow.visible=true;}
  if(i===5){this.hasCarrot=true;this.tableBow.visible=false;this.cargo.visible=true;}
  if(i===14){this.door.rotation.y=-.10*this.taps;this.grandma.visible=true;}
  if(i===16){this.delivered=true;this.cargo.visible=true;}
  if(i===17)this.notes.visible=true;
  if(this.taps>=this.current.count)this.timer=1.65;
  return true;
 }
 tick(dt,player,paused=false){if(!this.root.visible||paused)return;this.time+=dt;const t=this.time;this.effectTime=Math.max(0,this.effectTime-dt);this.water.visible=this.index===0&&this.effectTime>0;this.water.rotation.y=t;if(this.index===9&&this.effectTime>0)this.rabbit.rotation.x=-.3*Math.sin(Math.min(1,this.effectTime)*Math.PI);else this.rabbit.rotation.x=0;if(this.index===1&&this.effectTime>0){this.rabbit.rotation.z=Math.sin(t*12)*.12;this.rabbit.position.y=Math.abs(Math.sin(t*10))*.12;}if(this.index===18&&this.effectTime>0)this.rabbit.rotation.z=Math.sin(t*10)*.15;
  const goal=player.position.clone().add(new THREE.Vector3(1.15,0,-.6)),delta=goal.sub(this.rabbit.position).setY(0);if(delta.length()>1.15&&this.index!==15){this.rabbit.position.addScaledVector(delta.normalize(),Math.min(dt*2.6,delta.length()));this.rabbit.rotation.y=Math.atan2(delta.x,delta.z);this.rabbit.position.y=Math.abs(Math.sin(t*8))*.06;}else this.rabbit.position.y=Math.sin(t*2)*.012;
  if(this.index===15&&this.effectTime>0){this.rabbit.position.lerp(new THREE.Vector3(1.1,0,-.2),dt*4);this.grandma.rotation.z=Math.sin(t*5)*.06;}
  if(this.index===7&&this.taps)this.rabbit.rotation.z=Math.sin(t*2)*.04;else this.rabbit.rotation.z=0;
  if(this.index===11&&this.taps)this.grass.scale.y=.4;
  this.fish.position.y=-.3+Math.max(0,Math.sin(t*2))*.24;this.bird.rotation.z=Math.sin(t*3)*.10;
  if(this.hasCarrot&&!this.delivered){this.cargo.position.copy(this.rabbit.position).add(new THREE.Vector3(0,.85,.55));this.cargo.rotation.z=.16*Math.sin(t*3);}else if(this.delivered){this.cargo.position.set(1,1.15,-.2);this.cargo.rotation.z=-.3;}
  if(this.notes.visible){this.notes.rotation.y=t*.4;this.grandmaInside.rotation.z=Math.sin(t*5)*.08;this.rabbit.position.y=Math.abs(Math.sin(t*5))*.13;}
  if(this.timer){this.timer=Math.max(0,this.timer-dt);if(!this.timer)return true;}return false;
 }
}
