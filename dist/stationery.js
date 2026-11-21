import * as THREE from './assets/three.module.js';

const supplies = {
 book:{color:0x4e83d1,model:'It’s a book.'},
 bag:{color:0xf2bb42,model:'It’s a yellow bag.'},
 pencil:{color:0xe0665d,model:'It’s a red pencil.'},
 crayon:{color:0x537bc9,model:'It’s a blue crayon.'}
};

const workshop = [
 {station:'rug',word:'book',icon:'📘',action:'Look around the rug',clue:'Pip’s class is setting up a show-and-tell. Walk to Pip on the blue rug.',
  prompt:'What can you see around the rug?',sentence:'I can see a book and a bag.',starter:'I can see a book.'},
 {station:'book',word:'book',action:'Point to the book',clue:'Listen for “book.” Walk to the blue book and point to it.',
  prompt:'What’s this? Name the thing you opened.',sentence:supplies.book.model},
 {station:'bag',word:'bag',action:'Open the bag',clue:'Now listen for “bag.” Walk to the yellow bag and open it.',
  prompt:'Tell Pip what the bag looks like.',sentence:supplies.bag.model,starter:'It’s a bag.'},
 {station:'pencil',word:'pencil',action:'Trace with the pencil',clue:'Walk to the red pencil. Help Pip trace a circle on the paper.',
  prompt:'What did you use to trace the circle?',sentence:supplies.pencil.model,starter:'It’s a pencil.'},
 {station:'crayon',word:'crayon',action:'Color the bus',clue:'Walk to the blue crayon. Use it to color the bus for the display.',
  prompt:'Tell Pip how you colored the bus.',sentence:'I colored the bus with a blue crayon.',starter:'I used a crayon.'},
 {station:'teacher',word:'crayon',action:'Hand over the crayon',clue:'Carry the crayon to teacher Clover’s table. She needs it for a guessing game.',
  prompt:'Ask Clover what she’s holding.',sentence:'What’s this?',reply:'It’s a crayon.'},
 {station:'student',word:'crayon',action:'Take your turn',clue:'Walk around the table to the other gold spot. It’s your turn to answer.',
  prompt:'What’s this?',sentence:'It’s a crayon.'}
];

const stickerOrder = ['book','pencil','crayon','bag'];
const stickers = stickerOrder.map(word=>({
 station:'sticker-'+word,word,action:'Stick the '+word,clue:'Clover says “'+word+'.” '+(word==='book'?'Walk around the left side of the poster to the book tray.':'Walk to its tray and stick it on the class poster.'),
 prompt:'Name the '+word+' sticker in a sentence.',sentence:'It’s a '+word+'.'
}));

const finale = {
 station:'show',word:'book',action:'Show Pip the finished poster',clue:'The poster is ready! Walk back to Pip to open the show-and-tell.',
 prompt:'Tell Pip two or three sentences. What did you use? What did you make? Which thing did you like?',
 sentence:'I used a blue crayon. I colored a bus. I like the book.',
 starter:'I used a crayon. I colored a bus.',banner:'I used …  I made …  I liked …',freeTalk:true
};

export const STATIONERY = {
 id:'mac-02e90911c657d5ac',title:'What’s This? · Stationery Studio',setting:'playroom',adventure:true,
 intro:'Help Pip get the classroom ready for a stationery show-and-tell.',
 ending:'The artwork and sticker poster are ready. Thanks for helping Pip and Clover!',
 beats:[...workshop,...stickers,finale]
};

function group(parent,x=0,y=0,z=0){
 const node=new THREE.Group();
 node.position.set(x,y,z);
 parent.add(node);
 return node;
}

function makeSupply(parent,word,{cube,orb,rod}){
 const node=group(parent),color=supplies[word].color;
 if(word==='book'){
  cube(color,0,.052,0,1.12,.104,.78,node);
  cube(0xfff4d6,0,.129,0,1.02,.086,.72,node);
  cube(0x315c9c,-.527,.097,0,.104,.194,.79,node);
  const cover=group(node,-.55,.184);
  cube(color,.55,.02,0,1.13,.074,.8,cover);
  orb(0xffcf6b,.55,.069,0,.17,.02,.17,cover);
  for(let i=0;i<3;i++)cube(0x96acbd,.12,.174,(i-1)*.135,.57,.008,.022,node);
  return {node,hinge:cover};
 }
 if(word==='bag'){
  orb(color,0,.45,0,.53,.54,.31,node);
  orb(0xe59b44,0,.31,.27,.39,.31,.16,node);
  const flap=group(node,0,.77,.20);
  orb(0xffd264,0,-.18,.09,.48,.28,.19,flap);
  cube(0xa95337,0,-.28,.263,.16,.14,.048,flap);
  rod(0xc77b41,[-.22,.91,0],[0,1.07,0],.055,node);
  rod(0xc77b41,[0,1.07,0],[.22,.91,0],.055,node);
  for(const x of [-.32,.32])rod(0xb77d4e,[x,.78,-.18],[x,.14,-.31],.066,node);
  return {node,hinge:flap};
 }

 rod(color,[-.46,.10,0],[.44,.10,0],.092,node);
 if(word==='pencil'){
  rod(0xf5b5be,[-.58,.10,0],[-.44,.10,0],.098,node);
  rod(0xe7c097,[.42,.10,0],[.60,.10,0],.069,node);
  rod(0x41394c,[.57,.10,0],[.66,.10,0],.032,node);
 }else{
  rod(0x95aeea,[-.29,.10,0],[.30,.10,0],.105,node);
  rod(color,[.41,.10,0],[.56,.10,0],.058,node);
 }
 return {node};
}

function makeClassmate(parent,teacher,kit){
 const {orb,cube}=kit,node=group(parent);
 const coat=teacher?0x9860a4:0x395875,cream=0xfff4df;
 const body=group(node);
 orb(coat,0,.75,0,.55,.65,.39,body);
 orb(cream,0,.77,.25,.38,.45,.20,body);
 for(const side of [-1,1])orb(0xed9b55,side*.26,.18,.17,.26,.115,.33,body);
 const face=group(body,0,1.42,0);
 orb(coat,0,0,0,.51,.48,.40,face);
 orb(cream,0,-.035,.266,.40,.34,.19,face);
 for(const side of [-1,1]){
  orb(0x2b2941,side*.158,.055,.440,.056,.078,.033,face);
  orb(0xffffff,side*.158-.018,.078,.465,.017,.019,.009,face);
  orb(0xefb7a3,side*.284,-.085,.410,.067,.036,.022,face);
  if(teacher){
   const ear=orb(coat,side*.22,.53,0,.145,.39,.115,face);
   ear.rotation.z=-side*.25;
   const inner=orb(0xf1accb,side*.23,.55,.085,.092,.275,.044,face);
   inner.rotation.z=-side*.25;
  }
 }
 orb(teacher?0xca78a4:0xeb9d47,0,-.071,.458,.097,.059,.069,face);
 if(!teacher)cube(0xe5b84e,0,1.097,.271,.59,.13,.17,body);
 const arms=[-1,1].map(side=>{
  const arm=group(body,side*.43,1.01,.03);
  orb(coat,side*.06,-.22,.015,.127,.34,.15,arm);
  return arm;
 });
 return {node,body,arms};
}

const STATIONS = {
 rug:[-3.7,3.6],book:[-6.2,1.55],bag:[-1.8,2.0],pencil:[-.5,-.14],crayon:[1.75,1.55],
 teacher:[5.66,1.77],student:[3.64,-.30],
 'sticker-book':[2.68,5.7],'sticker-pencil':[4.52,5.7],
 'sticker-crayon':[6.36,5.7],'sticker-bag':[8.14,5.7],show:[-2.6,3.55]
};

export class StationeryWorld {
 constructor(scene,kit){
  const {cube,cyl,orb,rod,labelBoard}=kit;
  const root=this.root=group(scene);
  this.targets=Object.fromEntries(Object.entries(STATIONS).map(([key,[x,z]])=>[key,new THREE.Vector3(x,0,z)]));
  this.props={};
  this.blocks=[
   {x:-4.2,z:-2.95,w:2.4,d:.70},{x:5.62,z:-.93,w:1.68,d:1.04},
   {x:1.10,z:-.83,w:1.39,d:.69},{x:5.4,z:3.78,w:3.47,d:.25}
  ];
  cube(0xc9ddad,0,-.25,0,20,.48,17,root);
  cube(0xf9d9a7,0,1.52,-4.52,20,3.1,.24,root);
  cube(0xfff0cd,0,.20,-4.36,20,.27,.12,root);
  for(const x of [-7.5,-.1,7.6]){
   cube(0xffebbf,x,1.95,-4.37,1.86,1.42,.12,root);
   cube(0xa7d5de,x,1.95,-4.29,1.64,1.21,.06,root);
   cube(0xfff0d2,x,1.95,-4.22,.08,1.21,.06,root);
  }
  const rug=cyl(0x8389cb,-3.85,.015,1.13,3.55,.045,root);
  rug.scale.z=.78;
  const inner=cyl(0x9ca5dc,-3.85,.042,1.13,3.29,.018,root);
  inner.scale.z=.78;
  cube(0xe28d84,-4.2,.51,-2.95,4.65,1,.79,root);
  cube(0xf1ada0,-4.2,.82,-3.25,4.62,.85,.27,root);
  for(const x of [-6.25,-2.15])cube(0xf1ada0,x,.82,-2.92,.45,.62,.86,root);
  for(const [x,color] of [[-5.23,0xf7c77c],[-3.14,0xc8d0fb]])
   orb(color,x,1.0,-3.14,.36,.32,.15,root);
  for(const [x,z,color] of [[-7.9,-1.8,0xe68f72],[-7.4,-2.0,0x7abda5],[.5,4.1,0xc1a5df]]){
   const block=cube(color,x,.13,z,.35,.25,.39,root);
   block.rotation.y=x*.5;
  }
  const table=(x,y,z,w,d,color)=>{
   const node=group(root,x,0,z);
   cube(color,0,y,0,w,.15,d,node);
   for(const a of [-1,1])for(const b of [-1,1])
    cube(0xd99864,a*(w/2-.2),y/2,b*(d/2-.19),.17,y,.17,node);
   return node;
  };
  const drawing=table(1.10,.78,-.83,2.56,1.18,0xffd98e);
  const teacherTable=table(5.62,.99,-.93,3.16,1.81,0xffcc78);
  const paper=group(drawing);
  cube(0xfff7e0,-.56,.868,.02,1.02,.025,.80,paper);
  cube(0xfff7e0,.65,.868,.02,1.13,.025,.80,paper);
  this.trace=Array.from({length:18},(_,i)=>{
   const a=i*Math.PI*2/18,b=(i+1)*Math.PI*2/18;
   return rod(0x4e5772,[-.56+Math.sin(a)*.29,.889,.02+Math.cos(a)*.29],
    [-.56+Math.sin(b)*.29,.889,.02+Math.cos(b)*.29],.016,paper);
  });
  const bus=group(paper,.66,.888,.02);
  cube(0x536e8e,0,.008,0,.87,.018,.41,bus);
  this.busPaint=cube(0x547ec8,0,.021,0,.81,.011,.35,bus);
  for(const x of [-.25,0,.25])cube(0xc7e4ed,x,.032,-.073,.17,.011,.13,bus);
  for(const x of [-.26,.26])cyl(0x495168,x,.019,.20,.088,.027,bus);
  this.pip=makeClassmate(root,false,kit);
  this.pip.node.position.set(-3.7,.05,2.48);
  const reader=makeClassmate(root,false,kit);
  reader.node.position.set(-6,.04,-.23);
  reader.node.rotation.y=.30;
  reader.body.scale.setScalar(.77);
  const artist=makeClassmate(root,true,kit);
  artist.node.position.set(1.7,0,-1.98);
  artist.body.scale.setScalar(.68);
  this.clover=makeClassmate(root,true,kit);
  this.clover.node.position.set(5.65,0,-2.49);
  labelBoard('Pip',-3.7,2.17,2.49,1.2,root);
  labelBoard('Clover',5.65,2.77,-2.48,1.55,root);

  const put=(station,word,x,y,z,r=0,parent=root)=>{
   const {node,hinge}=makeSupply(parent,word,kit);
   node.position.set(x,y,z);
   node.rotation.y=r;
   const prop={node,hinge,base:node.position.clone(),yaw:r};
   this.props[station]=prop;
   return prop;
  };
  const book=put('book','book',-6.2,.10,.68,-.25);
  const bag=put('bag','bag',-1.75,.06,1.08,-.30);
  const pencil=put('pencil','pencil',-.64,.86,-.59,-.28);
  const crayon=put('crayon','crayon',1.91,.86,-.59,.26);
  // The crayon is passed from the drawing desk to the player and then to Clover.
  this.carried=put('carried','crayon',0,0,0).node;
  const held=put('teacher','crayon',.08,-.48,.15,-.15,this.clover.arms[1]).node;
  held.scale.setScalar(.81);
  this.answerProp=cube(0xffefc8,-.83,1.09,.25,.72,.05,.47,teacherTable);
  const chart=group(root,5.40,0,3.78);
  cube(0xac6876,0,1.75,0,6.72,2.29,.22,chart);
  cube(0xfff0cf,0,1.75,.13,6.56,2.13,.11,chart);
  labelBoard('Class Sticker Poster',0,2.54,.235,3.45,chart);
  this.stickerCards=Object.fromEntries(stickerOrder.map((word,i)=>{
   const x=STATIONS['sticker-'+word][0],tray=group(root,x,0,4.83);
   cyl(supplies[word].color,0,.20,0,.58,.40,tray);
   const pick=put('sticker-'+word,word,0,.415,0,0,tray).node;
   pick.scale.setScalar(.73);
   const slot=group(chart,(i-1.5)*1.55,1.58,.24);
   cube(0xebdac5,0,0,0,.93,1.09,.06,slot);
   const sticker=makeSupply(slot,word,kit).node;
   sticker.scale.setScalar(.66);
   sticker.position.set(0,-.23,.13);
   if(word!=='bag')sticker.rotation.x=Math.PI/2;
   sticker.updateWorldMatrix(true,false);
   const start=slot.worldToLocal(pick.getWorldPosition(new THREE.Vector3()));
   return [word,{tray,pick,sticker,start,end:sticker.position.clone()}];
  }));
  this.hitObjects={
   rug:[this.pip.node],book:[book.node],bag:[bag.node],pencil:[pencil.node,paper.children[0]],
   crayon:[crayon.node,paper.children[1]],teacher:[teacherTable,this.clover.node],
   student:[this.answerProp,held],show:[this.pip.node],
   ...Object.fromEntries(stickerOrder.map(word=>['sticker-'+word,[this.stickerCards[word].tray]]))
  };
  this.showPaper=group(this.pip.node,-.48,1.05,.41);
  cube(0xfff1ce,0,0,0,.75,.54,.063,this.showPaper);
  cube(0x537bc9,0,-.026,.04,.54,.21,.027,this.showPaper);
  for(const x of [-.16,.16])orb(0x41475a,x,-.132,.06,.066,.066,.02,this.showPaper);
  this.ray=new THREE.Raycaster();
  this.reset();
  root.visible=false;
 }

 reset(){
  this.index=0;
  this.effectTime=0;
  this.carrying=false;
  this.root.visible=true;
  for(const {node,base,yaw,hinge} of Object.values(this.props)){
   node.position.copy(base);
   node.rotation.set(0,yaw,0);
   node.visible=true;
   if(hinge)hinge.rotation.set(0,0,0);
  }
  this.props.teacher.node.visible=false;
  this.carried.visible=false;
  this.showPaper.visible=false;
  this.trace.forEach(line=>line.visible=false);
  this.busPaint.visible=false;
  this.busPaint.scale.x=1;
  for(const {sticker,pick} of Object.values(this.stickerCards)){
   sticker.visible=false;
   sticker.scale.setScalar(.66);
   pick.visible=true;
  }
  for(const actor of [this.pip,this.clover]){
   actor.body.position.y=0;
   actor.arms.forEach(arm=>arm.rotation.z=0);
  }
 }

 get current(){return STATIONERY.beats[this.index];}
 target(){return this.targets[this.current.station].clone();}
 canWalk(x,z){return !this.blocks.some(o=>Math.abs(x-o.x)<o.w&&Math.abs(z-o.z)<o.d);}
 canAct(position){
  const target=this.targets[this.current.station];
  return !this.effectTime&&Math.hypot(position.x-target.x,position.z-target.z)<1.75;
 }
 hits(pointer,camera){
  this.ray.setFromCamera(pointer,camera);
  return this.ray.intersectObjects(this.hitObjects[this.current.station],true).some(({object})=>{
   for(let node=object;node;node=node.parent)if(!node.visible)return false;
   return true;
  });
 }
 frame(aspect,position,look){
  const {station}=this.current,target=this.target();
  if(station.startsWith('sticker-')){
   look.set(5.4,1.10,4.46);
   position.set(5.4,5.1,4.46+Math.max(7.4,10.45/aspect));
   return;
  }
  if(station==='pencil'||station==='crayon'){
   look.set(.93,.80,-.66);
   position.copy(look).add(new THREE.Vector3(-2.9,4.15,Math.max(3.7,2.25/aspect)));
   return;
  }
  if(station==='teacher'||station==='student'){
   look.set(5.37,1.25,-1.58);
   position.copy(look).add(new THREE.Vector3(-Math.max(2.35,1.6/aspect),3.45,4.45));
   return;
  }
  const focus=this.hitObjects[station][0].getWorldPosition(new THREE.Vector3());
  look.set((target.x+focus.x)/2,.90,(target.z+focus.z)/2);
  position.copy(look).add(new THREE.Vector3(-2.9,2.5,Math.max(4.05,2.5/aspect)));
 }

 interact(position){
  if(!this.canAct(position))return false;
  this.effectTime=.001;
  return true;
 }

 tick(dt,player,{paused=false,reduced=false}={}){
  if(paused)return false;
  this.carried.visible=this.carrying;
  if(this.carrying){
   this.carried.position.copy(player.position);
   this.carried.position.y+=1.07;
   this.carried.position.x+=.62*Math.cos(player.rotation.y);
   this.carried.position.z-=.62*Math.sin(player.rotation.y);
   this.carried.rotation.y=player.rotation.y;
  }
  if(!this.effectTime)return false;
  this.effectTime+=dt;
  const t=Math.min(1,this.effectTime/(reduced?.12:1.35));
  this.pose(reduced?1:t);
  if(t<1)return false;
  this.effectTime=0;
  if(this.current.station==='crayon'){
   this.props.crayon.node.visible=false;
   this.carrying=true;
  }
  return true;
 }

 pose(t){
  const {station,word}=this.current;
  const bounce=Math.sin(Math.PI*t);
  const prop=this.props[station];
  if(station==='book')prop.hinge.rotation.z=2.35*t;
  if(station==='bag')prop.hinge.rotation.x=-1.7*t;
  if(station==='pencil'){
   this.trace.forEach((line,i)=>line.visible=(i+1)/this.trace.length<=t);
   prop.node.position.y=prop.base.y+.12*bounce;
   prop.node.rotation.y=prop.yaw-.8*bounce;
  }
  if(station==='crayon'){
   this.busPaint.visible=true;
   this.busPaint.scale.x=Math.max(.01,t);
   prop.node.position.x=prop.base.x-.24*bounce;
   prop.node.position.y=prop.base.y+.16*bounce;
  }
  if(station==='teacher'||station==='student'){
   this.carrying=false;
   this.carried.visible=false;
   this.props.teacher.node.visible=true;
   this.clover.arms[1].rotation.z=station==='teacher'?1.92*t:1.92+.26*bounce;
  }
  if(station.startsWith('sticker-')){
   const {pick,sticker,start,end}=this.stickerCards[word];
   pick.visible=false;
   sticker.visible=true;
   sticker.position.lerpVectors(start,end,t);
   sticker.position.y+=.65*bounce;
   sticker.scale.setScalar(.66+.24*bounce);
  }
  if(station==='rug'||station==='show'){
   this.pip.body.position.y=.18*bounce;
   this.pip.arms[1].rotation.z=bounce*.95;
   if(station==='show')this.showPaper.visible=true;
  }
 }
}
