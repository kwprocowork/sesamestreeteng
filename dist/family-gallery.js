import * as THREE from './assets/three.module.js';
import {GALLERY_PEOPLE,createGalleryPerson,smileForPhoto} from './gallery-people.js?v=76a';
import {buildGalleryVenue,WALL_Z} from './gallery-venue.js?v=76a';
import {shuffled} from './learning.js?v=76a';
export {VENUE_BOUNDS} from './gallery-venue.js?v=76a';

const photoGeometry=new THREE.PlaneGeometry(1.37,1.57);
const PERSON_REACH=1.85;

const beat=(station,action,clue,word,sentence,prompt,starter,reply,caption='')=>({
 station,action,clue,word,sentence,prompt,starter,reply,caption,icon:'🖼️'
});

const PORTRAITS={
 olderSister:{role:'older sister',at:[-9.3,.55],description:'She has long braids.',pronoun:'She',clue:'Find the taller girl with long braids and a purple shirt.'},
 youngerSister:{role:'younger sister',at:[-6.75,6.65],description:'She has a pink bow.',pronoun:'She',clue:'Find the little girl with a pink bow and a yellow shirt.'},
 olderBrother:{role:'older brother',at:[8.2,.70],description:'He has a striped shirt.',pronoun:'He',clue:'Find the taller boy in a red shirt with stripes.'},
 youngerBrother:{role:'younger brother',at:[10.65,5.05],description:'He has a green cap.',pronoun:'He',clue:'Find the little boy with a green cap.'},
 grandpa:{role:'grandpa',at:[10.6,-3.75],description:'He has a gray mustache.',pronoun:'He',clue:'Find the man with a gray mustache and a brown shirt.'},
 grandma:{role:'grandma',at:[-10.9,-3.25],description:'She has round glasses.',pronoun:'She',clue:'Find the woman with gray hair and round glasses.'},
 dad:{role:'dad',at:[5.6,-3.55],description:'He has a beard.',pronoun:'He',clue:'Find the man with a blue shirt and a beard.'},
 mom:{role:'mom',at:[-5.15,-3.75],description:'She is wearing a pink scarf.',pronoun:'She',clue:'Find the woman wearing a pink scarf.'}
};

function relativeBeat(id){
 const {role,description,pronoun,clue}=PORTRAITS[id];
 const relation=pronoun+' is my '+role+'.';
 if(id==='dad'||id==='mom'){
  const question=pronoun==='He'?'Who is he?':'Who is she?';
  return beat(id,'Take photo',clue,role,question,'Ask Milo who is in the photo.',question,relation+' '+description);
 }
 return beat(id,'Take photo',clue,role,relation+' '+description,
  'Pretend you are Milo. Say who this is and describe one thing you can see.',
  relation,'Let’s hang this picture in the gallery.','Milo’s '+role);
}

const OPENING_BEATS=[
 beat('milo','Wave to Milo','A friend is waiting by the rug. Walk over and say hello!','name','What is your name?','Ask your new friend his name.','What’s your name?','My name is Milo! Will you help me take pictures of my family?'),
 beat('pippa','Greet Pippa','Pippa is waiting on the other side of the rug. Walk over and introduce yourself.','name','My name is Alex.','Tell Pippa your name. Say “My name is” and add your own name.','My name is Alex.','Nice to meet you! Let’s meet Milo’s family.')
];

export const FAMILY_GALLERY={
 id:'mac-4b9930fabacb03a0',
 title:'What’s your name?',
 setting:'playroom',
 adventure:'family-gallery',
 intro:'Meet four of Milo’s relatives in the gallery hall, take their smiling photos, and make a frame for show-and-tell.',
 ending:'The family gallery is open! Milo and Pippa loved sharing their pictures with you.',
 beats:[...OPENING_BEATS,...Object.keys(PORTRAITS).map(relativeBeat)]
};

export function createFamilyGalleryRound(random=Math.random){
 const relatives=shuffled(Object.keys(PORTRAITS),random).slice(0,4);
 const pointingId=relatives.includes('dad')?'dad':relatives[0];
 const craftId=relatives.includes('mom')?'mom':relatives.at(-1);
 const pointing=PORTRAITS[pointingId],craft=PORTRAITS[craftId];
 const person='Milo’s '+craft.role;
 const familySentence=craft.pronoun+' is my '+craft.role+'.';
 return {
  ...FAMILY_GALLERY,relatives,pointingId,craftId,
  beats:[
   ...OPENING_BEATS,
   ...relatives.map(relativeBeat),
   beat('milo','Play the pointing game','Walk back to Milo. He’ll point to one of the photos you took.',pointing.role,
    pointing.pronoun+' is Milo’s '+pointing.role+'. '+pointing.description,
    'Who is Milo pointing to? Say who it is and describe one thing you can see.',
    pointing.pronoun+' is Milo’s '+pointing.role+'.','Let’s make a frame for one of your photos.','Milo’s '+pointing.role),
   beat('photos','Lift the picture','Walk to the picture stand. Lift the photo of '+person+' and look closely.','picture',
    craft.description,'Tell Milo one thing you can see in this photo.',craft.description,
    'Let’s put that photo in a frame.',person),
   beat('paint','Paint the frame','Take the photo to the craft table and brush pink paint onto the frame.','frame',
    'The frame is pink.','Describe the color of the frame you just painted.','It is pink.',
    'The paint is dry! Take the frame to the glue table.'),
   beat('glue','Fit the picture','Walk to the glue table. Fit the photo of '+person+' into your frame.','frame',
    'I put the photo in the frame.','Tell Pippa what you did.','I made a frame.',
    'It fits! Carry the finished frame to the show-and-tell stand.'),
   beat('gallery','Put the frame on display','Walk to the show-and-tell stand. Put your framed photo on the easel.',craft.role,
    familySentence+' '+craft.description+' The frame is pink.',
    'Speak as Milo. Say who is in the photo and describe something you can see.',
    familySentence+' The frame is pink.','Pippa wants to hear about your family or a pretend family.',person),
   beat('pippaStage','Ring the sharing bell','Walk to Pippa’s bell to start your own show-and-tell.','family',
    'This is my '+craft.role+'. '+craft.description+' We like to take pictures together.',
    'Say two or three sentences to Pippa. Start with “This is my…” or “In my family…”. Then describe the person or tell us what you do together.',
    'This is my '+craft.role+'. '+craft.description,'Thank you for sharing!')
  ]
 };
}

export const FAMILY_GALLERY_INTRO=[
 {speaker:'Milo',line:'Hi, I’m Milo! Find the person who matches my clue. Walk up and say hello, then take a smiling photo!'},
 {speaker:'Pippa',line:'I’m Pippa! We’ll hang your four photos on the gallery wall. Then we’ll make a frame and share our pictures.'}
];

const EFFECT_SECONDS=.85;

function place(x,y,z,parent){
 const group=new THREE.Group();
 group.position.set(x,y,z);
 parent.add(group);
 return group;
}

export class FamilyGalleryWorld {
 constructor(scene,kit,round){
  this.kit=kit;
  this.root=new THREE.Group();
  this.root.name='Family gallery hall';
  scene.add(this.root);
  this.stations=new Map();
  this.flights=[];
  this.craftPhotos=[];
  this.idleTime=0;
  this.build();
  this.reset(round);
  this.root.visible=false;
 }

 get current(){return this.round.beats[this.index];}

 get relative(){return this.activeRelatives.find(card=>card.id===this.current.station);}

 get pointingPortrait(){return this.activeRelatives.find(card=>card.id===this.round.pointingId);}

 nearbyPerson(position){
  let nearest=null,best=PERSON_REACH;
  for(const card of this.activeRelatives){
   const dx=position.x-card.station.position.x,dz=position.z-card.station.position.z;
   const distance=Math.hypot(dx,dz);
   if(distance<best){nearest=card;best=distance;}
  }
  return nearest;
 }

 canAct(position){
  if(!this.ready)return false;
  if(!this.relative)return position.clone().setY(0).distanceTo(this.target())<1.75;
  const near=this.nearbyPerson(position);
  return !!near&&(!this.photoReady||near===this.relative);
 }

 target(){return this.stations.get(this.current.station).target.clone();}

 station(id,x,z,approach=1.15){
  const group=place(x,0,z,this.root);
  this.stations.set(id,{group,target:new THREE.Vector3(x,0,z+approach)});
  return group;
 }

 portrait(parent,spec,frameColor){
  const {cube}=this.kit;
  const frame=place(0,0,0,parent);
  cube(0xfff4db,0,0,0,1.43,1.63,.09,frame);
  const edges=[];
  for(const side of [-1,1]){
   edges.push(cube(frameColor,side*.73,0,.08,.17,1.78,.17,frame));
   edges.push(cube(frameColor,0,side*.81,.08,1.4,.17,.17,frame));
  }
  let image,print,media;
  if(spec){
   media=place(0,0,0,frame);
   image=place(0,-.67,.11,media);
   if(spec!==true)createGalleryPerson(this.kit,image,spec).scale.setScalar(.58);
   print=new THREE.Mesh(photoGeometry,new THREE.MeshBasicMaterial({toneMapped:false}));
   print.position.z=.071;
   print.visible=false;
   media.add(print);
  }
  edges.forEach(edge=>{edge.material=edge.material.clone();});
  return {frame,edges,image,print,media};
 }

 craftPortrait(parent,frameColor){
  const picture=this.portrait(parent,true,frameColor);
  this.craftPhotos.push(picture);
  return picture;
 }

 table(parent,top=0xeca684){
  const {cube}=this.kit;
  cube(top,0,.76,0,2.18,.17,1.14,parent);
  for(const x of [-.83,.83]){
   for(const z of [-.39,.39])cube(0xba825c,x,.36,z,.16,.73,.16,parent);
  }
 }

 build(){
  const {cube,cyl,orb,labelBoard}=this.kit;
  buildGalleryVenue(this.root,this.kit);
  const milo=this.station('milo',-.55,3.75,.95);
  this.milo=createGalleryPerson(this.kit,milo,'milo');
  this.pointingArm=this.milo.userData.arms[1];
  const pippa=this.station('pippa',4.35,6.05,-1.05);
  pippa.rotation.y=-.6;
  this.pippa=createGalleryPerson(this.kit,pippa,'pippa');
  labelBoard('Milo',0,.45,-.64,1.3,milo);
  labelBoard('Pippa',0,.45,-.64,1.4,pippa);

  this.portraits=Object.entries(PORTRAITS).map(([id,spec])=>{
   const azimuth=spec.at[0]*-.014;
   const station=this.station(id,...spec.at,1.05);
   const person=createGalleryPerson(this.kit,station,id);
   person.scale.setScalar(1.07);
   person.rotation.y=azimuth;
   const card=this.portrait(station,id,GALLERY_PEOPLE[id].shirt);
   const first=new THREE.Vector3(0,1.73,.96);
   card.frame.position.copy(first);
   const slot=place(0,2.59,WALL_Z+.14,this.root);
   cube(0x3b6473,0,0,-.055,1.78,1.89,.09,slot);
   cube(0xd9aa63,0,1.085,.05,.20,.1,.14,slot);
   const label=this.kit.portraitLabel(spec.role,2.34);
   label.position.set(0,-.963,.18);label.scale.setScalar(.62);
   card.frame.add(label);
   return {...card,id,station,slot,first,label,person,azimuth,photo:null};
  });

  const photos=this.station('photos',-8.85,-5.2,1.15);
  this.table(photos,0xeab5a3);
  this.loosePhoto=this.craftPortrait(photos,0xfff3d6).frame;
  this.loosePhoto.position.set(0,1.28,0);
  this.loosePhoto.scale.setScalar(.56);
  this.loosePhoto.rotation.x=-.61;

  const paint=this.station('paint',-11.4,6.25);
  this.table(paint,0x86beb6);
  this.paintFrame=this.portrait(paint,null,0xe9bc89);
  this.paintFrame.frame.position.set(0,1.27,0);
  this.paintFrame.frame.scale.setScalar(.65);
  for(let i=0;i<3;i++)cyl([0xd9648e,0xe6af56,0x72a9c1][i],-.63+i*.24,.91,.38,.1,.14,paint);
  this.brush=place(.55,1.05,.33,paint);
  this.kit.rod(0x8b583e,[0,0,0],[0,.46,0],.033,this.brush);
  orb(0xd9648e,0,-.03,0,.067,.10,.05,this.brush);

  const glue=this.station('glue',11.5,8.40);
  this.table(glue,0xe3ba76);
  this.gluePhoto=this.craftPortrait(glue,0xe0799b);
  this.gluePhoto.frame.position.set(0,1.30,0);
  this.gluePhoto.frame.scale.setScalar(.63);
  cyl(0xfcf0db,.69,1.01,.02,.12,.38,glue);
  cyl(0xa49acb,.69,1.23,.02,.13,.12,glue);

  const gallery=this.station('gallery',0,-5.38,1.40);
  cyl(0xdd9b73,0,.13,0,1.25,.26,gallery);
  for(const x of [-.50,.50])cube(0xa96d52,x,.8,0,.14,1.22,.18,gallery);
  cube(0xbb7a54,0,1.27,.07,1.4,.12,.35,gallery);
  this.displayPhoto=this.craftPortrait(gallery,0xe0799b).frame;
  this.displayPhoto.position.set(0,2.11,.15);
  this.displayPhoto.rotation.x=-.10;
  labelBoard('Share',0,.59,.90,2.05,gallery);

  const pippaStage=this.station('pippaStage',2.7,-4.95);
  this.pippaStage=createGalleryPerson(this.kit,pippaStage,'pippa');

  this.introPippa=createGalleryPerson(this.kit,this.root,'pippa');
  this.introPippa.position.set(1.15,0,3.60);
  this.introFrame=this.craftPortrait(this.introPippa,0xe0799b).frame;
  this.introFrame.scale.setScalar(.52);
  cyl(0x98b9c9,.67,.31,.12,.22,.62,pippaStage);
  this.bell=orb(0xeaba49,.67,.73,.12,.25,.18,.24,pippaStage);
  orb(0xf5d878,.67,.94,.12,.059,.068,.059,pippaStage);
  this.carried=place(0,0,0,this.root);
  this.carryPicture=this.craftPortrait(this.carried,0xfff3d6).frame;
  this.carryFrame=this.portrait(this.carried,null,0xe0799b).frame;
  this.carryFinished=this.craftPortrait(this.carried,0xe0799b).frame;
  this.carried.scale.setScalar(.40);
  this.sparkles=place(0,0,0,this.root);
  for(let i=0;i<9;i++)orb(i%2?0xffd163:0xef9ab7,0,0,0,.074,.074,.074,this.sparkles);
 }

 reset(round){
  this.round=round;
  this.activeRelatives=round.relatives.map(id=>this.portraits.find(card=>card.id===id));
  this.index=0;
  this.effectTime=0;
  this.activeActor=null;
  this.activeCard=null;
  this.effectKind='';
  this.photoReady=false;
  this.flights.length=0;
  this.idleTime=0;
  this.endIntro();
  this.carried.visible=false;
  this.sparkles.visible=false;
  this.milo.position.y=this.pippa.position.y=this.pippaStage.position.y=0;
  this.milo.rotation.y=this.pippa.rotation.y=this.pippaStage.rotation.y=0;
  this.bell.rotation.z=0;
  this.brush.rotation.z=-.55;
  this.brush.position.set(.55,1.05,.33);
  this.loosePhoto.visible=false;
  this.loosePhoto.scale.setScalar(.56);
  this.loosePhoto.rotation.x=-.61;
  this.loosePhoto.position.set(0,1.28,0);
  this.paintFrame.frame.visible=true;
  this.paintFrame.edges.forEach(edge=>{edge.material.color.setHex(0xe9bc89);});
  this.gluePhoto.frame.visible=false;
  this.gluePhoto.media.visible=false;
  this.gluePhoto.media.position.set(0,0,0);
  this.displayPhoto.visible=false;
  for(const card of this.portraits){
   card.photo?.dispose();
   card.photo=null;
   card.station.add(card.frame);
   card.frame.position.copy(card.first);
   card.frame.rotation.set(0,0,0);
   card.frame.visible=false;
   card.person.rotation.y=card.azimuth;
   card.person.userData.arms[1].rotation.set(0,0,.19);
   smileForPhoto(card.person,true);
   const selected=this.activeRelatives.indexOf(card);
   card.station.visible=card.slot.visible=selected>=0;
   card.slot.position.x=(selected-(this.activeRelatives.length-1)/2)*3.38;
   this.applyPhoto(card,null);
  }
  for(const picture of this.craftPhotos){
   this.applyPhoto(picture,null);
   picture.image.clear();
   createGalleryPerson(this.kit,picture.image,round.craftId).scale.setScalar(.58);
  }
  this.ready=true;
 }

 poseIntro(line,time,motion){
  const wave=motion?Math.sin(time*8):0;
  const hop=motion?Math.max(0,Math.sin(time*5))*Math.exp(-time*.9):0;
  this.introPippa.visible=true;
  this.stations.get('pippa').group.visible=false;
  this.stations.get('pippaStage').group.visible=false;
  this.pointingArm.rotation.set(0,-.20,line===0?2.45+wave*.24:.19);
  this.milo.position.y=line===0?hop*.34:0;
  this.introPippa.position.y=line===1?hop*.25:0;
  this.introPippa.rotation.y=line===1?.14+wave*.08:-.25;
  this.introFrame.visible=line===1;
  const lift=motion?THREE.MathUtils.smoothstep(time,0,.85):1;
  this.introFrame.position.set(.06,.60+lift*.55,.45);
  this.introFrame.rotation.z=.13*(1-lift);
 }

 endIntro(){
  this.introPippa.visible=false;
  this.introFrame.visible=false;
  this.pointingArm.rotation.set(0,0,.19);
  this.milo.position.y=0;
 }

 enter(index){
  this.index=index;
  this.ready=true;
  this.photoReady=false;
  this.effectKind='';
  const station=this.current.station;
  const presenting=station==='gallery'||station==='pippaStage';
  this.stations.get('pippa').group.visible=!presenting;
  this.stations.get('pippaStage').group.visible=presenting;
  this.pointingArm.rotation.set(0,0,.19);
  this.carried.visible=['paint','glue','gallery'].includes(station);
  this.carryPicture.visible=station==='paint'||station==='glue';
  this.carryFrame.visible=station==='glue';
  this.carryFrame.position.x=-.50;
  this.carryPicture.position.x=station==='glue'?.50:0;
  this.carryFinished.visible=station==='gallery';
  if(station==='photos'||station==='paint')this.loosePhoto.visible=station==='photos';
  if(station==='glue')this.paintFrame.frame.visible=false;
  if(station==='gallery')this.gluePhoto.frame.visible=false;
 }

 cameraFocus(speaking){
  if(this.activeCard)return this.activeCard.frame.getWorldPosition(new THREE.Vector3());
  if(this.relative&&this.effectKind){
   const {person}=this.relative;
   const focus=person.getWorldPosition(new THREE.Vector3());
   focus.y+=GALLERY_PEOPLE[this.relative.id].height*.57;
   return focus;
  }
  const subject=(speaking&&this.isPointing())?this.pointingPortrait.frame:
   {photos:this.loosePhoto,paint:this.paintFrame.frame,glue:this.gluePhoto.frame,gallery:this.displayPhoto}[this.current.station];
  return subject?.getWorldPosition(new THREE.Vector3())??null;
 }

 isPointing(){
  return this.current.action==='Play the pointing game';
 }

 applyPhoto(picture,texture){
  picture.print.visible=!!texture;
  picture.print.material.map=texture;
  picture.print.material.needsUpdate=true;
  picture.image.visible=!texture;
 }

 showPhoto(renderer){
  const card=this.relative;
  this.activeCard=card;
  card.frame.visible=true;
  if(!renderer)return;
  const studio=new THREE.Scene();
  studio.background=new THREE.Color(0xf8e8ca).lerp(new THREE.Color(GALLERY_PEOPLE[card.id].shirt),.22);
  studio.add(new THREE.HemisphereLight(0xfff7e6,0xade3eb,2.1));
  const key=new THREE.DirectionalLight(0xfff4e5,2.55);
  key.position.set(3,4,5);studio.add(key);
  createGalleryPerson(this.kit,studio,card.id);
  const height=GALLERY_PEOPLE[card.id].height;
  const crop=height*.60, photoCamera=new THREE.OrthographicCamera(-crop*.87,crop*.87,crop,-crop,.1,15);
  photoCamera.position.set(.14,height*.58,5);
  photoCamera.lookAt(0,height*.51,0);
  const target=new THREE.WebGLRenderTarget(384,440);
  const previous=renderer.getRenderTarget();
  try{
   renderer.setRenderTarget(target);
   renderer.clear();
   renderer.render(studio,photoCamera);
  }catch(error){
   target.dispose();
   console.warn('Gallery snapshot used its 3D portrait fallback.',error);
   return;
  }finally{renderer.setRenderTarget(previous);}
  card.photo=target;
  this.applyPhoto(card,target.texture);
  if(card.id===this.round.craftId)this.craftPhotos.forEach(picture=>this.applyPhoto(picture,target.texture));
 }

 hangPortrait(reducedMotion=false){
  const card=this.activeCard;
  if(!card)return;
  card.slot.attach(card.frame);
  const from=card.frame.position.clone();
  card.frame.rotation.set(0,0,0);
  if(reducedMotion)card.frame.position.set(0,0,0);
  else this.flights.push({card,from,time:0});
  this.activeCard=null;
 }

 interact(position){
  if(!this.canAct(position))return '';
  if(this.relative){
   if(this.nearbyPerson(position)!==this.relative)return 'try-again';
   this.ready=false;
   this.effectKind=this.photoReady?'photo':'wave';
   this.effectTime=this.photoReady?1.12:1.30;
   const {person}=this.relative;
   person.rotation.y=0;
   if(this.effectKind==='photo'){
    smileForPhoto(person,false);
    person.userData.arms[1].rotation.set(0,0,.19);
    this.sparkles.visible=true;
   }
   return this.effectKind;
  }
  this.ready=false;
  this.effectKind='task';
  this.effectTime=EFFECT_SECONDS;
  this.activeActor=null;
  this.sparkles.visible=true;
  const station=this.current.station;
  if(station==='milo'){
   this.activeActor=this.milo;
   if(this.isPointing()){
    const slot=this.pointingPortrait.slot.position;
    this.pointingArm.rotation.set(0,Math.atan2(3.75-slot.z,slot.x+.55),1.57);
   }else this.pointingArm.rotation.z=2.43;
  }
  if(station==='pippa')this.activeActor=this.pippa;
  if(station==='pippaStage')this.activeActor=this.pippaStage;
  if(station==='glue'){
   this.carried.visible=false;
   this.gluePhoto.frame.visible=true;
   this.gluePhoto.media.visible=true;
   this.loosePhoto.visible=false;
   this.paintFrame.frame.visible=false;
  }
  if(station==='gallery'){
   this.carried.visible=false;
   this.displayPhoto.visible=true;
   this.gluePhoto.frame.visible=false;
  }
  return this.effectKind;
 }

 tick(dt,player,paused,reducedMotion=false){
  if(paused)return '';
  if(this.carried.visible){
   this.carried.position.set(player.position.x+.70,player.position.y+.92,player.position.z+.12);
  }
  if(!reducedMotion){
   this.idleTime+=dt;
   this.activeRelatives.forEach((card,i)=>{
    card.person.position.y=Math.sin(this.idleTime*1.32+i)*.014;
   });
  }
  if(this.flights.length)this.flights=this.flights.filter(flight=>{
   flight.time=Math.min(1,flight.time+dt/1.08);
   const blend=flight.time*flight.time*(3-2*flight.time);
   flight.card.frame.position.copy(flight.from).multiplyScalar(1-blend);
   flight.card.frame.position.y+=Math.sin(flight.time*Math.PI)*1.05;
   return flight.time<1;
  });
  if(!this.effectTime)return '';
  this.effectTime=Math.max(0,this.effectTime-dt);
  const station=this.current.station, card=this.relative;
  if(this.effectKind==='wave'){
   const t=1-this.effectTime/1.30;
   const arm=card.person.userData.arms[1];
   arm.rotation.z=reducedMotion?2.5:2.43+Math.sin(t*Math.PI*7)*.29;
   if(this.effectTime)return '';
   arm.rotation.z=.19;
   this.ready=true;
   this.photoReady=true;
   return 'wave';
  }
  const duration=this.effectKind==='photo'?1.12:EFFECT_SECONDS;
  const p=1-this.effectTime/duration, arc=Math.sin(p*Math.PI);
  if(this.effectKind==='photo'&&p>=.26)smileForPhoto(card.person,true);
  this.sparkles.position.copy(this.target());
  this.sparkles.position.y=1.45;
  this.sparkles.children.forEach((spark,i)=>{
   const angle=i*Math.PI*2/9+p;
   spark.position.set(Math.cos(angle)*p*.84,Math.sin(angle)*p*.62,Math.sin(angle)*.31);
   spark.scale.setScalar(reducedMotion?.45:Math.max(.001,arc));
  });
  if(this.activeActor){
   this.activeActor.position.y=arc*.30;
   this.activeActor.rotation.y=this.isPointing()?0:arc*.26;
   if(station==='milo'&&!this.isPointing())this.pointingArm.rotation.z=2.35+Math.sin(p*9)*arc*.24;
  }
  if(station==='photos'){
   this.loosePhoto.position.y=1.28+p*.38;
   this.loosePhoto.rotation.x=-.61*(1-p);
  }
  if(station==='paint'){
   this.brush.position.set(.55-p*1.1,1.05+arc*.62,.33);
   this.brush.rotation.z=-.55+arc*1.6;
   this.paintFrame.edges.forEach((edge,i)=>{if(p*4>=i+.65)edge.material.color.setHex(0xe0799b);});
  }
  if(station==='glue')this.gluePhoto.media.position.set((1-p)*1.35,arc*.32,0);
  if(station==='gallery')this.displayPhoto.scale.setScalar(.58+p*.42);
  if(station==='pippaStage'&&p>.3)this.pippaStage.rotation.y=arc*.42;
  if(station==='pippaStage')this.bell.rotation.z=Math.sin(p*6*Math.PI)*arc*.38;
  if(this.effectTime)return '';
  this.sparkles.visible=false;
  return this.effectKind;
 }
}
