import * as THREE from './assets/three.module.js';
import {PhonicsWorld} from './phonics-world.js?v=74a';

export const PARADES={
 speed:{animals:['turtle','rabbit'],words:['slow','fast'],prop:'drum',action:'Beat the drum',intro:'Beat the drum to start the toy race!',clue:'Watch how each toy moves.'},
 size:{animals:['mouse','elephant'],words:['small','big'],prop:'gate',action:'Open the parade doors',intro:'Open the little door and the big gate. Who fits through each one?',clue:'Look at the two doorways.'},
 height:{animals:['giraffe','penguin'],words:['tall','short'],prop:'curtain',action:'Lower the curtain',intro:'Who can peek over the theatre curtain? Lower it to see both friends!',clue:'Look from their feet up to their heads.'},
 length:{animals:['snake','caterpillar'],words:['long','short'],prop:'mat',action:'Unroll the star mat',intro:'Unroll the mat. Which toy stretches to the far star?',clue:'Follow each toy from head to tail.'}
};
// Draw four different acts across two completed visits, including older journal entries.
export function visitParades(history=[],random=Math.random){
 const keys=Object.keys(PARADES);
 const previous=keys.filter(key=>PARADES[key].animals.every(n=>history[0]?.words?.includes(n)));
 const pool=history.length%2===1&&previous.length===2?keys.filter(key=>!previous.includes(key)):keys;
 const orders=pool.flatMap(a=>pool.filter(b=>a!==b).map(b=>[a,b]));
 const fresh=orders.filter(pair=>!pair.every(key=>previous.includes(key)));
 const choices=fresh.length?fresh:orders;
 return choices[Math.floor(random()*choices.length)];
}
function toy(name,kit){
 const {orb,rod}=kit,g=new THREE.Group();
 const oval=(c,x,y,z,w,h,d)=>orb(c,x,y,z,w,h,d,g);
 const eyes=(y,z,space)=>{for(const s of [-1,1]){oval(0x30343b,s*space,y,z,.041,.054,.031);oval(0xffffff,s*space-.013,y+.016,z+.025,.012,.013,.009);}};
 if(name==='elephant'){const elephant=PhonicsWorld.prototype.model.call({kit},name);elephant.scale.setScalar(1.33);g.add(elephant);return g;}
 if(name==='snake'||name==='caterpillar'){
  const snake=name==='snake',count=snake?15:5,step=snake?.18:.16;
  for(let i=0;i<count;i++)oval(snake?0x39ac95:i%2?0xa3bc58:0xe3b85c,i*step,.22,Math.sin(i*.7)*.12,.22,.19,.20);
  const head=oval(snake?0x329c85:0xc7c964,0,.33,.09,.245,.22,.23);eyes(head.position.y+.045,.29,.105);
  if(!snake)for(const s of [-1,1])rod(0x765046,[s*.085,.47,.09],[s*.15,.66,.08],.022,g);return g;
 }
 const c=({rabbit:0xf2dacf,turtle:0x8eb37a,mouse:0xa7a5b9,giraffe:0xf3bd57,penguin:0x38495b})[name];
 const tall=name==='giraffe',flat=name==='turtle',headY=tall?2.25:flat?.49:.92;
 oval(c,0,flat?.36:.58,0,.42,flat?.23:.49,.48);
 for(const s of [-1,1])for(const z of [-.20,.20])oval(c,s*.23,.16,z,.13,.17,.19);
 if(tall){oval(c,0,1.52,.18,.19,.80,.20);for(let i=0;i<4;i++)oval(0xaf783d,.11,1.12+.25*i,.34,.084,.09,.05);}
 oval(c,0,headY,.34,.33,.30,.30);eyes(headY+.06,.605,.126);
 if(name==='rabbit'||name==='mouse'||tall){
  for(const s of [-1,1]){const ear=oval(c,s*.21,headY+.30,.26,.135,name==='rabbit'?.42:.17,.10);ear.rotation.z=-s*.2;oval(tall?0xc8934e:0xe3a5a7,s*.22,headY+.32,.35,.079,name==='rabbit'?.29:.10,.028);}
  oval(0xb4797b,0,headY-.04,.64,.065,.054,.04);
 }
 if(flat){oval(0x4b836b,0,.48,-.09,.47,.28,.49);for(const s of [-1,0,1])oval(0x76985e,s*.2,.68,-.1,.105,.08,.14);}
 if(name==='penguin'){oval(0xffecd3,0,.60,.38,.28,.36,.10);oval(0xf5ad51,0,.89,.64,.107,.067,.12);}
 if(name==='mouse'){rod(0xd7a4a7,[0,.30,-.37],[.28,.32,-.80],.032,g);g.scale.setScalar(.60);}
 if(name==='rabbit')oval(0xffefe1,0,.44,-.42,.19,.2,.20);
 return g;
}
const V=(x,z)=>new THREE.Vector3(x,0,z);
export class ParadeHome{
 constructor(scene,kit){
  this.root=new THREE.Group();scene.add(this.root);
  const {cube,cyl,orb,labelBoard}=kit,r=this.root;
  cube(0xdcb898,0,-.12,1,22,.22,16,r);cube(0xc6a9bd,0,3,-5.8,22,6,.24,r);
  for(let i=-5;i<=5;i++)cube(0xe9cfc7,i*1.82,2.7,-5.61,.065,5.4,.12,r);
  this.theatre=buildTheatre(r,kit);
  // Painted arched windows and a row of hanging fairy lanterns frame the theatre.
  for(const x of [-6.2,6.2]){
   cube(0xf7dfa9,x,2.68,-5.4,2.85,2.6,.16,r);
   cube(0x99cfd9,x,2.68,-5.28,2.57,2.32,.08,r);
   for(const y of [2.12,3.13])orb(0xe7efe2,x+.54,y,-5.21,.48,.14,.06,r);
   cube(0xffe5ba,x,2.68,-5.14,.085,2.4,.1,r);cube(0xffe5ba,x,2.68,-5.14,2.68,.09,.1,r);
  }
  for(let i=0;i<12;i++){
   const x=-8.25+i*1.5,y=4.16+.007*x*x;orb(i%2?0xffdc85:0xf4a4ad,x,y,-5.1,.102,.14,.10,r);
   if(i<11)kit.rod(0x92808b,[x,y,-5.1],[x+1.5,4.16+.007*(x+1.5)**2,-5.1],.016,r);
  }

  this.chest=V(-3.6,4);cube(0x679caa,-3.6,.48,3.25,1.65,.92,1.12,r);
  this.lid=new THREE.Group();r.add(this.lid);this.lid.position.set(-3.6,.95,2.70);cube(0xe6ba7f,0,.08,.53,1.75,.18,1.16,this.lid);
  this.start=V(0,2.65);this.stage=V(0,-2.4);this.groups={};
  for(const [key,p] of Object.entries(PARADES)){
   const group=new THREE.Group();r.add(group);this.groups[key]=group;group.visible=false;
   if(key==='speed'){
    cyl(0xc47984,0,.38,2,.48,.70,group);cyl(0xffe5b3,0,.74,2,.50,.07,group);
    for(const x of [-2,2])cube(0xe4b782,x,.025,.15,1.2,.035,3.5,group);
   }
   if(key==='size'){
    this.doors=[];
    for(const [i,x] of [-2,2].entries()){
     const w=i?2.3:.80,h=i?2.45:.85;
     for(const s of [-1,1])cube(0x875b60,x+s*w/2,h/2,.35,.12,h,.15,group);
     cube(0x875b60,x,h,.35,w+.12,.13,.16,group);
     const hinge=new THREE.Group();hinge.position.set(x-w/2,0,.35);group.add(hinge);cube(i?0x91babb:0xe8bb82,w/2,h*.48,0,w-.08,h*.92,.10,hinge);this.doors.push(hinge);
    }
   }
   if(key==='height')this.curtain=cube(0xb96f93,0,.81,.72,5.65,1.60,.11,group);
   if(key==='length'){
    this.mat=cube(0x9ac5bd,0,.052,.15,7,.06,3.5,group);
    for(const [i,x] of [-1.25,-1.25].entries()){const star=new THREE.Shape();for(let k=0;k<10;k++){const a=Math.PI/2+k*Math.PI/5,rad=k%2?.12:.26;k?star.lineTo(rad*Math.cos(a),rad*Math.sin(a)):star.moveTo(0,rad);}star.closePath();const badge=new THREE.Mesh(new THREE.ShapeGeometry(star),new THREE.MeshBasicMaterial({color:0xffcd56,side:THREE.DoubleSide}));badge.rotation.x=-Math.PI/2;badge.position.set(x+(i?.75:2.5),.094,i?1.3:-1.0);group.add(badge);}
   }
  }
  this.toys={};for(const p of Object.values(PARADES))for(const animal of p.animals){const a=toy(animal,kit);a.userData.animal=animal;r.add(a);this.toys[animal]=a;}
  this.reset();
 }
 reset(){this.theatre.curtainCall(false);for(const a of Object.values(this.toys))a.visible=false;for(const g of Object.values(this.groups))g.visible=false;this.lid.rotation.x=0;this.elapsed=0;this.demo=false;this.carried=null;this.parading=false;this.opening=false;}
 setup(key){this.reset();this.key=key;this.pair=PARADES[key].animals;this.groups[key].visible=true;this.lid.rotation.x=-1.18;
  this.pair.forEach((n,i)=>{const a=this.toys[n];a.visible=true;a.rotation.set(0,0,0);a.position.set(key==='length'?-1.25:i?2:-2,.10,key==='length'?(i?1.3:-1.0):-.82);a.scale.setScalar(key==='length'?.15:1);});
  if(key==='size')this.doors.forEach(d=>d.rotation.y=0);
  if(key==='height'){this.curtain.scale.y=1;this.curtain.position.y=.81;}
  if(key==='length')this.mat.scale.z=.12;
 }
 run(){this.setup(this.key);this.opening=false;this.lid.rotation.x=-1.18;this.elapsed=0;this.demo=true;}
 lineup(names){this.reset();names.forEach((name,i)=>{const a=this.toys[name];a.visible=true;a.position.set(-4.5+i*3,.1,.6);a.scale.setScalar(name==='snake'?.7:1);a.rotation.set(0,0,0);});}
 nearest(pos,names){return names.reduce((best,n)=>pos.distanceTo(this.approach(n))<pos.distanceTo(this.approach(best))?n:best,names[0]);}
 approach(n){const p=this.toys[n].position;return V(p.x,p.z+.78);}
 tick(dt,player){
  if(this.opening){
   this.elapsed+=dt;const t=Math.min(1,this.elapsed/.95);
   this.lid.rotation.x=-1.18*t;
   this.pair.forEach((name,i)=>{const a=this.toys[name],x=this.key==='length'?-1.25:i?2:-2,z=this.key==='length'?(i?1.3:-1):-.82;
    a.position.set(-3.6+(x+3.6)*t,.1+(1-t)*.85+1.3*Math.sin(Math.PI*t),3.25+(z-3.25)*t);
   });
   if(t===1)this.opening=false;
  }
  if(this.carried){const a=this.toys[this.carried];a.position.copy(player.position);a.position.y+=1.08;a.position.x+=.62;a.scale.setScalar(.43);}
  if(this.parading){this.elapsed+=dt;this.theatre.curtainCall(true,this.elapsed);const a=this.toys[this.parading],speed=this.parading==='turtle'?.95:2;a.position.set(Math.sin(this.elapsed*speed)*1.6,.62+.12*Math.abs(Math.sin(this.elapsed*4)), -4.05+.48*Math.cos(this.elapsed*speed));return;}
  if(!this.demo)return;
  this.elapsed+=dt;const t=Math.min(this.elapsed/2.9,1);
  this.pair.forEach((n,i)=>{const a=this.toys[n];
   if(this.key==='speed'||this.key==='size'){const u=this.key==='speed'?(i?Math.min(1,t*2.2):t*.66):t;a.position.z=-.82+2.45*u;a.position.y=.12+(n==='rabbit'?.32:.07)*Math.abs(Math.sin(u*5*Math.PI));}
   if(this.key==='length')a.scale.setScalar(.15+.85*t);
  });
  if(this.key==='size')this.doors.forEach(d=>d.rotation.y=-1.5*Math.min(1,t*3.5));
  if(this.key==='height'){this.curtain.scale.y=1-.90*t;this.curtain.position.y=.81*this.curtain.scale.y;}
  if(this.key==='length')this.mat.scale.z=.12+.88*t;
  if(t===1)this.demo=false;
 }
}

function buildTheatre(root,{cube,orb,labelBoard}){
 const gold=0xe4b664, ruby=0x9a3155, night=0x333354;
 const group=new THREE.Group();root.add(group);
 // A shallow apron with a brass lip and two carpeted steps.
 cube(0x70394e,0,.28,-4.19,8.65,.54,2.92,group);
 cube(gold,0,.53,-4.19,8.71,.085,2.97,group);
 cube(0x986958,0,.584,-4.19,8.58,.038,2.89,group);
 for(let i=0;i<2;i++){
  cube(gold,0,.09+i*.11,-2.48-i*.19,3.05,.16+i*.11,.39,group);
  cube(ruby,0,.18+i*.165,-2.48-i*.19,2.72,.035,.40,group);
 }
 cube(night,0,2.67,-5.49,8.45,4.30,.10,group);
 const star=new THREE.Shape();
 for(let j=0;j<10;j++){
  const a=Math.PI/2+j*Math.PI/5,r=j%2?.43:1;
  if(j)star.lineTo(r*Math.cos(a),r*Math.sin(a));else star.moveTo(0,1);
 }
 star.closePath();
 const starGeo=new THREE.ExtrudeGeometry(star,{depth:.08,bevelEnabled:false});
 const brass=new THREE.MeshStandardMaterial({color:gold,metalness:.38,roughness:.42});
 function ornament(x,y,z,r){
  const m=new THREE.Mesh(starGeo,brass);m.position.set(x,y,z);m.scale.setScalar(r);group.add(m);return m;
 }
 for(let i=0;i<28;i++)ornament(-3.7+(i%14)*.56,1.75+Math.floor(i/14)*1.0+.30*Math.sin(i*3.8),-5.40,i%5===0?.095:.052);
 const silk=new THREE.MeshStandardMaterial({color:ruby,roughness:.80,side:THREE.DoubleSide});
 for(const side of [-1,1]){
  // Pinched pleats sweep in at the pelmet and gather into a gold tie halfway down.
  const pos=[],idx=[];
  for(let j=0;j<=20;j++)for(let i=0;i<=36;i++){
   const v=j/20,u=i/36,width=.35+.83*(2*v-1)**2+.68*v*v;
   pos.push(side*(4.02-width*u),.61+3.68*v,-4.99+.17*Math.cos(u*10*Math.PI)+.16*u);
   if(i&&j){const n=j*37+i;idx.push(n-38,n-37,n,n-38,n,n-1);}
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();
  group.add(new THREE.Mesh(geo,silk));
  orb(gold,side*3.85,2.37,-4.83,.29,.072,.21,group);
  cube(0x75404f,side*4.25,2.38,-4.73,.36,3.77,.42,group);
  for(const h of [.73,3.98])cube(gold,side*4.25,h,-4.72,.52,.17,.49,group);
 }
 // A curved, bulb-lined arch high above the animals.
 const profile=x=>4.08+.95*(1-(x/4.43)**2);
 const arch=new THREE.Shape();arch.moveTo(-4.43,profile(-4.43));
 for(let i=1;i<=32;i++){const x=-4.43+8.86*i/32;arch.lineTo(x,profile(x));}
 for(let i=32;i>=0;i--){const x=-4.43+8.86*i/32;arch.lineTo(x,profile(x)-.37);}
 arch.closePath();const frame=new THREE.Mesh(new THREE.ExtrudeGeometry(arch,{depth:.23,bevelEnabled:false}),brass);frame.position.z=-4.90;group.add(frame);
 const glow=new THREE.MeshBasicMaterial({color:0xffe4a3});
 const lampGeo=new THREE.SphereGeometry(.065,10,8);
 const lamps=new THREE.InstancedMesh(lampGeo,glow,38),matrix=new THREE.Matrix4();group.add(lamps);
 for(let i=0;i<25;i++){const x=(i-12)*.35;lamps.setMatrixAt(i,matrix.makeTranslation(x,profile(x)-.18,-4.63));}
 for(let i=0;i<13;i++)lamps.setMatrixAt(25+i,matrix.makeTranslation((i-6)*.65,.33,-2.70));
 labelBoard('Toy Parade',0,4.10,-4.94,3.25,group);
 ornament(0,5.18,-4.69,.29);
 const ribbons=[];
 for(const side of [-1,1])for(let i=0;i<5;i++){
  const x=side*(2.72+.22*i),y=2.68+.16*(i%3);
  const spark=ornament(x,y,-4.57,.09+.015*(i%3));spark.userData.restY=y;ribbons.push(spark);
 }
 const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 return {curtainCall(active,time=0){for(const [i,s] of ribbons.entries()){
  s.visible=active;if(active&&!reduced){s.position.y=s.userData.restY+.27*Math.sin(time*1.5+i);s.rotation.z=.20*Math.sin(time+i);}
 }}};
}
