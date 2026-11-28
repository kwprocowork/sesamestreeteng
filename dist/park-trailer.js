import {LivingEnvironment} from './environment.js?v=76a';
import * as THREE from './assets/three.module.js';
import {shuffled} from './learning.js';
// Palette, silhouette, clothes and accessories follow the family's supplied photo references.
export const PARK_ROSTER=[
 {name:'Elmo',color:0xe21b35,nose:0xf59b22},
 {name:'Cookie Monster',color:0x187bc2,nose:null},
 {name:'Ernie',color:0xf1a24d,nose:0xed303b},
 {name:'Bert',color:0xf4cd39,nose:0xf28224},
 {name:'Count von Count',color:0xb883c5,nose:0xb883c5},
 {name:'Snuffleupagus',color:0x936044,nose:null},
 {name:'Zoe',color:0xf4aa25,nose:0xe27eae},
 {name:'Julia',color:0xf5d43c,nose:0xe8a13d},
 {name:'Gonger',color:0xe92695,nose:0x20bace},
 {name:'Rudy',color:0xf78324,nose:0x20bad1},
 {name:'Baby Bear',color:0x995529,nose:0x352820},
 {name:'Tango',color:0xa75b2b,nose:0x242527},
 {name:'Telly Monster',color:0xa82b70,nose:0xf79a35},
 {name:'Gabrielle',color:0xae642d,nose:0xed7827},
 {name:'Ji-Young',color:0xe4ae7d,nose:0xe46ba1},
 {name:'Tamir',color:0xbb7a43,nose:0xee779c},
 {name:'Rosita',color:0x26b7bb,nose:0xf5942b},
 {name:'Abby Cadabby',color:0xf19ac2,nose:0xe96894},
 {name:'Grover',color:0x2264c0,nose:0xda71aa},
 {name:'Oscar',color:0x658f3c,nose:null}
];
export function chooseParkCast(random=Math.random){return shuffled(PARK_ROSTER,random).slice(0,4);}
export const CHARACTER_ANIMATIONS={
 'Elmo':['wave','hop','bubbles','twirl','clap'],
 'Cookie Monster':['wave','cookie','juggle','dance','bow'],
 'Ernie':['wave','juggle','bubbles','hop','clap'],
 'Bert':['bow','stretch','kite','dance','wave'],
 'Count von Count':['bow','count','magic','twirl','clap'],
 'Snuffleupagus':['wave','stretch','bubbles','sniff','bow'],
 'Zoe':['wave','dance','twirl','flower','bow'],
 'Julia':['wave','flower','bubbles','dance','clap'],
 'Gonger':['wave','cook','juggle','dance','bow'],
 'Rudy':['wave','hop','bubbles','twirl','clap'],
 'Baby Bear':['wave','bubbles','hop','dance','clap'],
 'Tango':['wave','chase','bubbles','sniff','hop'],
 'Telly Monster':['wave','stretch','kite','juggle','clap'],
 'Gabrielle':['wave','dance','kite','twirl','clap'],
 'Ji-Young':['wave','guitar','bubbles','dance','bow'],
 'Tamir':['wave','juggle','kite','dance','clap'],
 'Rosita':['wave','guitar','bubbles','twirl','clap'],
 'Abby Cadabby':['wave','magic','bubbles','twirl','bow'],
 'Grover':['wave','stretch','juggle','hop','bow'],
 'Oscar':['wave','peek','bubbles','dance','bow']
};
export const ACTION_TITLES={wave:'A big little hello!',hop:'Up, up, hooray!',bubbles:'Pop! A little wonder.',twirl:'Round and round we go!',clap:'Give yourself a cheer!',cookie:'A cookie-sized smile!',juggle:'Catch a little colour!',dance:'Find your happy wiggle!',bow:'Ta-da! That was fun!',stretch:'Reach for the sunshine!',kite:'Let your dreams fly!',count:'One, two, three smiles!',magic:'A sprinkle of magic!',sniff:'What a lovely surprise!',flower:'Stop and smell a flower.',cook:'A delicious little dance!',chase:'Ready, set, puppy play!',guitar:'A song and a smile!',peek:'Peekaboo, sunshine!'};
export const TRAILER_DURATION=40,SHOT_DURATION=2;
export function parkShotAt(time,cast){const t=((time%TRAILER_DURATION)+TRAILER_DURATION)%TRAILER_DURATION,shot=Math.floor(t/SHOT_DURATION),character=shot%4,act=Math.floor(shot/4);return {shot,character,act,local:t%SHOT_DURATION,action:CHARACTER_ANIMATIONS[cast[character].name][act]};}
// Five authored actions per character; one featured friend in each cinematic vignette.
export function animateParkActor(actor,action,time,variant=0){
 const info=actor.userData,dog=info.spec.name==='Tango',snuffy=info.spec.name==='Snuffleupagus',oscar=info.spec.name==='Oscar',w=Math.sin(time*7),hop=Math.abs(Math.sin(time*Math.PI*2));
 actor.position.set(0,0,0);actor.rotation.set(0,0,0);actor.scale.setScalar(snuffy?.8:dog?1.3:1);
 info.arms.forEach((arm,j)=>{arm.rotation.set(0,0,j===0?-.22:.22)});info.legs.forEach(leg=>leg.rotation.set(0,0,0));info.mouth.scale.y=1;
 if(action==='wave'){info.arms.forEach((arm,j)=>{arm.rotation.z=j===1?1.8+w*.25:-.25;arm.rotation.x=-.1});actor.rotation.z=Math.sin(time*3)*.045;}
 if(action==='dance'||action==='guitar'||action==='cook'){actor.position.x=Math.sin(time*4)*.18;actor.position.y=hop*.08;actor.rotation.z=Math.sin(time*4)*.08;info.arms.forEach((arm,j)=>{arm.rotation.x=-.7+Math.sin(time*8+j*Math.PI)*.25;arm.rotation.z=(j===0?-1:1)*.6});info.legs.forEach((leg,j)=>leg.rotation.x=Math.sin(time*8+j*Math.PI)*.3);}
 if(action==='hop'){actor.position.y=hop*.42;actor.rotation.y=Math.sin(time*3)*.22;info.arms.forEach((arm,j)=>arm.rotation.z=(j===0?-1:1)*(1+hop*.3));}
 if(action==='twirl'){actor.rotation.y=time*Math.PI*1.1;actor.position.y=hop*.1;info.arms.forEach((arm,j)=>arm.rotation.z=(j===0?-1:1)*1.05);}
 if(action==='clap'){info.arms.forEach((arm,j)=>{arm.rotation.x=-1.2;arm.rotation.z=(j===0?1:-1)*(.3+hop*.25)});actor.position.y=hop*.1;info.mouth.scale.y=1+hop*.15;}
 if(action==='bow'){actor.rotation.x=Math.sin(Math.min(time/1.6,1)*Math.PI)*.35;info.arms.forEach((arm,j)=>arm.rotation.z=(j===0?-1:1)*.9);}
 if(action==='stretch'){info.arms.forEach((arm,j)=>arm.rotation.z=(j===0?-1:1)*(1.7+hop*.2));actor.scale.y*=1+Math.sin(time*3)*.035;actor.rotation.z=Math.sin(time*3)*.08;}
 if(['bubbles','magic','kite','count','flower','juggle'].includes(action)){info.arms.forEach((arm,j)=>{arm.rotation.x=-.8+Math.sin(time*6+j)*.18;arm.rotation.z=(j===0?-1:1)*.6});actor.rotation.y=Math.sin(time*2.5)*.18;actor.rotation.z=Math.sin(time*3)*.03;}
 if(action==='cookie'){info.arms.forEach((arm,j)=>{arm.rotation.x=-1.5+Math.sin(time*8)*.2;arm.rotation.z=(j===0?1:-1)*.2});info.mouth.scale.y=1+hop*.35;actor.rotation.z=Math.sin(time*7)*.045;}
 if(action==='peek'){actor.position.y=-.24+hop*.28;info.arms.forEach((arm,j)=>{arm.rotation.x=-2;arm.rotation.z=(j===0?1:-1)*(.12+hop*.4)});}
 if(action==='sniff'){actor.rotation.x=.13+hop*.08;actor.rotation.y=Math.sin(time*3)*.22;}
 if(action==='chase'){actor.position.x=Math.sin(time*3)*.8;actor.position.z=Math.cos(time*3)*.25;actor.rotation.y=Math.cos(time*3)*.6;actor.position.y=hop*.1;info.legs.forEach((leg,j)=>leg.rotation.x=Math.sin(time*11+j*Math.PI)*.45);}
 if(dog){info.tail.rotation.z=Math.sin(time*12)*.45;if(action==='wave')actor.rotation.z=Math.sin(time*5)*.09;if(['bubbles','hop'].includes(action))actor.position.y=hop*.22;}
 if(snuffy){if(action==='wave')actor.rotation.y=Math.sin(time*4)*.25;if(action==='bubbles')actor.rotation.x=-.08+Math.sin(time*4)*.06;if(action==='sniff')actor.position.z=-hop*.2;}
 if(oscar)actor.position.y=Math.max(actor.position.y,-.04);
 // Stable character variation keeps repeated shared actions from moving in lockstep.
 if(!['twirl','chase'].includes(action))actor.rotation.y+=Math.sin(time*2+variant)*.04;
}
export function createParkActor(spec,kit){
 const {puppet,orb,cube,cyl,rod,fur}=kit,n=spec.name;
 if(n==='Tango'){
  const g=new THREE.Group(),legs=[],arms=[];
  orb(0xf8eed9,0,.65,0,.38,.38,.62,g);fur(g,0xf8eed9,[0,.65,0],[.38,.38,.62],700);
  for(const x of[-.25,.25])for(const z of[-.35,.35]){const leg=new THREE.Group();leg.position.set(x,.28,z);orb(0xf7eedb,0,0,0,.13,.24,.15,leg);orb(0xf7eedb,0,-.14,.07,.16,.1,.2,leg);g.add(leg);legs.push(leg)}
  orb(0xf7efdc,0,1.1,.42,.43,.43,.35,g);fur(g,0xf7efdc,[0,1.1,.42],[.43,.43,.35],650);
  orb(spec.color,-.24,1.24,.62,.2,.27,.12,g);orb(spec.color,.24,1.24,.62,.19,.28,.12,g);
  for(const side of[-1,1]){const ear=orb(spec.color,side*.4,1.15,.35,.18,.38,.2,g);ear.rotation.z=side*.3;fur(ear,spec.color,[0,0,0],[.9,.9,.9],140);orb(0xffffff,side*.16,1.22,.73,.12,.15,.07,g);orb(0x242527,side*.16,1.22,.79,.06,.085,.03,g)}
  orb(0xfaf1dc,0,.99,.73,.28,.19,.17,g);orb(0x282729,0,1.07,.88,.12,.08,.06,g);orb(0x452b2b,0,.91,.84,.14,.09,.025,g);orb(0xe88791,0,.87,.87,.07,.1,.02,g);
  const tail=new THREE.Group();tail.position.set(0,.8,-.5);orb(spec.color,0,.2,-.15,.11,.31,.12,tail);tail.rotation.x=-.5;g.add(tail);
  const collar=cyl(0xf5bd34,0,.89,.24,.32,.09,g);orb(0xf8ca3e,0,.77,.63,.09,.11,.04,g);
  g.userData={arms,legs,tail,spec,pose:'file',mouth:new THREE.Group()};return g;
 }
 const g=puppet(spec,false),smooth=['Bert','Ernie','Julia','Ji-Young','Tamir','Gabrielle','Count von Count'].includes(n);
 if(!smooth&&n!=='Snuffleupagus'){const hx=n==='Cookie Monster'?.72:.61;fur(g,spec.color,[0,1.02,0],[n==='Cookie Monster'?.57:.49,.65,.39],900);fur(g,spec.color,[0,2.01,.02],[hx,.55,.49],1350);}
 const front=(color,x,y,sx,sy,sz=.08)=>orb(color,x,y,.47,sx,sy,sz,g);
 const hair=(color,x,y,z,sx,sy=sx,sz=sx)=>orb(color,x,y,z,sx,sy,sz,g);
 const lashes=()=>{for(const side of[-1,1])for(let j=0;j<3;j++)rod(0x302a29,[side*.21+(j-1)*.09,2.46,.47],[side*.21+(j-1)*.13,2.61,.48],.018,g)};
 if(n==='Bert'){
  // Long yellow head, continuous eyebrow and vertical multicolour striped sweater.
  for(let j=-3;j<=3;j++)cube([0x287f80,0xd44738,0xe9be37][(j+3)%3],j*.115,1.03,.413,.055,.75,.045,g);
  front(0xfff1dc,0,1.52,.26,.11);for(const side of[-1,1])orb(spec.color,side*.45,2.02,0,.13,.2,.14,g);
 }
 if(n==='Ernie')for(let j=0;j<5;j++)cube(j%2?0xeebd3b:0x246cac,0,.77+j*.14,.425,.78,.05,.05,g);
 if(n==='Gabrielle'){
  front(0xf7ca68,0,1.1,.41,.5);for(let j=0;j<4;j++)cube(0xf3e2a8,0,.8+j*.15,.56,.62,.05,.025,g);
  for(const side of[-1,1]){front(0xf78328,side*.34,1.1,.2,.48);for(let i=0;i<28;i++){const a=i*2.4,r=.34*Math.sqrt((i+.5)/28);hair(0x302523,side*.42+Math.cos(a)*r,2.69+Math.sin(a)*r,.0+Math.sin(i*3)*.12,.14,.14,.13)}}
  hair(0x302523,0,2.46,-.16,.54,.24,.4);lashes();
 }
 if(n==='Zoe')lashes();
 if(n==='Gonger'){
  const hat=cyl(0xfff2d1,0,2.69,0,.38,.52,g);for(let i=0;i<6;i++){const a=i*Math.PI/3;hair(0xfff8dc,Math.cos(a)*.23,3.03,Math.sin(a)*.18,.25,.22,.23)}
  front(0xffedcb,0,.99,.35,.5);for(let i=0;i<11;i++){const a=i*Math.PI*2/11;hair(0xf232a0,Math.cos(a)*.64,2.06+Math.sin(a)*.21,-.02,.13,.09,.1)}
  rod(0xbd8852,[.7,.8,.12],[.85,2,.12],.035,g);orb(0xc29460,.85,2.09,.12,.11,.2,.055,g);
 }
 if(n==='Rudy'){
  for(const side of[-1,1]){const horn=new THREE.Mesh(new THREE.ConeGeometry(.12,.46,16),new THREE.MeshStandardMaterial({color:0xf3e4bd}));horn.position.set(side*.44,2.64,0);horn.rotation.z=-side*.3;g.add(horn)}
  for(let i=0;i<17;i++){const a=i*2.4,r=.32*Math.sqrt((i+.5)/17);hair(0x238dbb,Math.cos(a)*r,2.55+Math.sin(a)*.14,.02+Math.cos(i)*.16,.09,.14,.09)}
 }
 if(n==='Telly Monster'){
  g.children[1].scale.x=.5;g.children[1].scale.y=.67;for(let i=0;i<8;i++)hair(0xc84c91,(i-3.5)*.1,2.58+(i%3)*.04,-.02,.04,.19,.04);
  for(const side of[-1,1]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.235,.022,6,28),new THREE.MeshStandardMaterial({color:0x82b8c5}));ring.position.set(side*.22,2.3,.61);g.add(ring)}rod(0x82b8c5,[-.02,2.32,.62],[.02,2.32,.62],.018,g);
 }
 if(n==='Count von Count'){
  front(0x252c32,0,1.02,.5,.62,.12);front(0xf7e6cc,0,1.39,.22,.15);front(0xd94c48,0,1.26,.09,.13);
  const capeShape=new THREE.Shape();capeShape.moveTo(-.52,1.65);capeShape.lineTo(.52,1.65);capeShape.lineTo(.91,.12);capeShape.quadraticCurveTo(0,.36,-.91,.12);capeShape.closePath();const cape=new THREE.Mesh(new THREE.ShapeGeometry(capeShape),new THREE.MeshStandardMaterial({color:0x183c3a,side:THREE.DoubleSide}));cape.position.z=-.38;g.add(cape);
  for(const side of[-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.21,.52,3),new THREE.MeshStandardMaterial({color:spec.color}));ear.position.set(side*.62,2.1,0);ear.rotation.z=-side*1.1;g.add(ear);rod(0x292c30,[side*.04,2.53,.5],[side*.37,2.63,.39],.045,g);const tooth=new THREE.Mesh(new THREE.ConeGeometry(.045,.16,3),new THREE.MeshStandardMaterial({color:0xfff0bc}));tooth.position.set(side*.21,1.85,.64);tooth.rotation.z=Math.PI;g.add(tooth)}
  hair(0x25292c,0,2.49,-.11,.5,.23,.4);const goatee=new THREE.Mesh(new THREE.ConeGeometry(.15,.35,3),new THREE.MeshStandardMaterial({color:0x25292c}));goatee.position.set(0,1.55,.48);goatee.rotation.z=Math.PI;g.add(goatee);
  const monocle=new THREE.Mesh(new THREE.TorusGeometry(.23,.018,6,32),new THREE.MeshStandardMaterial({color:0xd9caa3}));monocle.position.set(.21,2.3,.63);g.add(monocle);rod(0xd9caa3,[.43,2.3,.6],[.5,1.8,.46],.009,g);
 }
 if(n==='Oscar'){
  cube(0x654c2d,0,2.47,.48,.65,.09,.08,g);for(let i=0;i<9;i++)hair(0x83a74d,(i-4)*.09,2.55,-.03,.04,.16,.05);
  const lid=cyl(0xa6aaa0,0,2.63,-.13,.67,.09,g);lid.rotation.x=-.2;
 }
 g.userData.spec=spec;return g;
}
export class ParkTrailer{
 constructor(host,kit,random=Math.random){this.host=host;this.kit=kit;this.random=random;this.actors=[];this.time=0;this.disposed=false;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xbce7ec);this.scene.fog=new THREE.Fog(0xcce9dc,22,55);this.camera=new THREE.PerspectiveCamera(40,1,.1,70);
  this.renderer=new (kit.Renderer||THREE.WebGLRenderer)({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.renderer.domElement.setAttribute('aria-hidden','true');host.appendChild(this.renderer.domElement);
  this.scene.add(new THREE.HemisphereLight(0xfff5df,0x68966b,1.2));const sun=new THREE.DirectionalLight(0xffecd2,2.5);sun.position.set(-6,12,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10});sun.shadow.normalBias=.04;this.scene.add(sun);
  this.buildPark();this.environment=new LivingEnvironment(this.scene,{trailer:true});this.environment.setLesson('trailer',this.scene.children.filter(o=>o!==this.environment.root&&!o.isLight));this.buildVignettes();this.castGroup=new THREE.Group();this.scene.add(this.castGroup);this.newCast();this.resize();this.observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>this.resize()):null;this.observer?.observe(host);
 }
 buildPark(){const {orb,cube,cyl,rod}=this.kit,p=this.scene;
  cyl(0x83ba70,0,-.18,0,16,.3,p);const path=cyl(0xe4d7a5,0,-.005,1,6,.025,p);path.scale.z=.76;cyl(0x9cc879,0,.015,0,3.8,.025,p);
  for(const [x,z,s]of[[-7,-5,1.1],[6,-6,1.2],[-8,3,.9],[8,3,.9],[1,-9,1.2]]){cyl(0xa5794c,x,1.4,z,.25,2.8,p);orb(0x5b9c60,x,3.4,z,1.6*s,1.7*s,1.4*s,p);orb(0x85b66a,x+.85,3.2,z+.1,1.15*s,1.2*s,1.05*s,p);orb(0x9bc47b,x-.7,4,z,1.1*s,1.2*s,1.1*s,p)}
  for(let i=-7;i<=7;i++){cube(0xf7e8c2,i,1,-7,.14,1.8,.14,p);for(const y of[.6,1.25])cube(0xefdbb1,i,y,-7,1.03,.1,.1,p)}
  // A picnic, wooden bench, archway and flowering borders surround the open play space.
  cube(0xd87e64,-4,.04,2.3,2.7,.045,1.9,p);for(let i=0;i<5;i++)cube(0xffdca8,-5.1+i*.5,.07,2.3,.12,.015,1.85,p);cyl(0xb98a53,-4,.29,2.4,.33,.45,p);orb(0xf5c863,-4,.56,2.4,.35,.08,.35,p);
  for(const x of[3.7,5.7]){cube(0x658775,x,.5,-4,.12,1,.65,p);cube(0x658775,x,1.1,-4.3,.12,1.4,.12,p)}for(let i=0;i<3;i++){cube(0xc89d61,4.7,.8+i*.21,-4.26,2.5,.14,.11,p);cube(0xd7af70,4.7,.73,-3.9+i*.17,2.5,.12,.13,p)}
  for(const x of[-1.6,1.6])cyl(0xc8a873,x,1.7,-6,.1,3.4,p);const arch=new THREE.Mesh(new THREE.TorusGeometry(1.6,.1,8,48,Math.PI),new THREE.MeshStandardMaterial({color:0xc8a873}));arch.position.set(0,3.4,-6);p.add(arch);cube(0x237858,0,3.5,-5.9,2.6,.55,.14,p);
  for(let i=0;i<35;i++){const x=-8+(i%18)*.9,z=i<18?-5.7:5.8;rod(0x4c9b5d,[x,0,z],[x,.35,z],.02,p);for(let j=0;j<5;j++){const a=j*Math.PI*2/5;orb([0xf6cb53,0xf294ad,0xbf9ed6][i%3],x+Math.cos(a)*.1,.4+Math.sin(a)*.1,z,.085,.085,.04,p)}orb(0xffefbc,x,.4,z+.04,.055,.055,.025,p)}
  for(let i=0;i<4;i++)orb(0xf3faf2,-7+i*4.3,7+(i%2),-12,2.2,.5,.6,p);
  this.playBall=orb(0xf17845,0,.6,0,.28,.28,.28,p);const stripe=new THREE.Mesh(new THREE.TorusGeometry(.282,.022,6,32),new THREE.MeshStandardMaterial({color:0xffdb60}));stripe.rotation.x=.6;this.playBall.add(stripe);
  this.bubbles=[];for(let i=0;i<7;i++){const bubble=orb(0xffffff,0,0,0,.07+i*.012,.07+i*.012,.07+i*.012,p);bubble.material=new THREE.MeshPhysicalMaterial({color:0xc9f3ff,transparent:true,opacity:.32,roughness:.05,metalness:.1,clearcoat:1});this.bubbles.push(bubble)}
 }
 newCast(){for(const a of this.actors){this.castGroup.remove(a);a.traverse(o=>{if(o.geometry&&!this.kit.sharedGeometry?.(o.geometry))o.geometry.dispose();if(o.material&&!this.kit.sharedMaterial?.(o.material))o.material.dispose()})}this.cast=chooseParkCast(this.random);this.actors=this.cast.map(spec=>{const a=createParkActor(spec,this.kit);this.castGroup.add(a);return a});this.render(0);return this.cast.map(s=>s.name)}
 resize(){const r=this.host.getBoundingClientRect();if(!r.width||!r.height)return;this.renderer.setSize(r.width,r.height);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();this.render(this.time)}
 buildVignettes(){const {orb,cube,cyl,rod}=this.kit;this.vignettes=[];
  for(let i=0;i<5;i++){const stage=new THREE.Group();this.scene.add(stage);this.vignettes.push(stage);
   const rug=cyl([0xf1cd68,0x9ecad8,0xc8a9db,0xedab91,0x9bcab0][i],0,.025,0,2.3,.035,stage);rug.scale.z=.78;
   if(i===0||i===4){for(const side of[-1,1])for(let j=0;j<3;j++){const b=orb([0xf4bc51,0xf29eb4,0x9fc9dd][j],side*(2+j*.2),2.6+j*.35,-1,.24,.31,.24,stage);rod(0xf2e6c7,[side*2,0,-1],[b.position.x,b.position.y,-1],.012,stage)}}
   if(i===1){for(const side of[-1,1]){cyl(0xbca079,side*2.2,1.4,-1.5,.055,2.8,stage);orb(0xf5d788,side*2.2,2.9,-1.5,.17,.19,.15,stage)}for(let j=0;j<8;j++)orb([0xf2b968,0xeaa4bc,0x99c7c7][j%3],-2.1+j*.6,2.9+Math.sin(j/7*Math.PI)*.35,-1.5,.09,.11,.06,stage)}
   if(i===2){for(let j=0;j<5;j++){const a=j*1.4;orb(0x9cc8a1,Math.sin(a)*2.8,.24,-1+Math.cos(a),.7,.3,.55,stage)}}
   if(i===3){cube(0xf0b289,1.8,.045,.5,1.2,.05,1.4,stage);cyl(0xb58f5a,2,.25,.7,.25,.4,stage)}
  }
  this.props=new THREE.Group();this.scene.add(this.props);this.cookie=new THREE.Group();this.props.add(this.cookie);orb(0xd9a45a,0,0,0,.26,.26,.055,this.cookie);for(let i=0;i<8;i++){const a=i*2.4;orb(0x634334,Math.cos(a)*.17,Math.sin(a)*.17,.056,.027,.027,.014,this.cookie)}
  this.guitar=new THREE.Group();this.props.add(this.guitar);orb(0xd2a265,0,0,0,.24,.32,.09,this.guitar);orb(0x5e4329,0,.03,.1,.07,.07,.02,this.guitar);cube(0x8e6848,.12,.4,0,.07,.55,.055,this.guitar);this.guitar.rotation.z=-.55;
  this.flower=new THREE.Group();this.props.add(this.flower);rod(0x559059,[0,0,0],[0,.65,0],.018,this.flower);for(let j=0;j<6;j++){const a=j*Math.PI/3;orb(0xf3b5ce,Math.cos(a)*.12,.65+Math.sin(a)*.12,0,.09,.09,.035,this.flower)}orb(0xf7d76e,0,.65,.04,.075,.075,.025,this.flower);
  this.kite=new THREE.Group();this.props.add(this.kite);const sh=new THREE.Shape();sh.moveTo(0,.45);sh.lineTo(.28,0);sh.lineTo(0,-.35);sh.lineTo(-.28,0);sh.closePath();this.kite.add(new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshStandardMaterial({color:0xea9266,side:THREE.DoubleSide})));rod(0xf4dfac,[0,0,0],[-.5,-1.4,0],.009,this.kite);
  this.pan=new THREE.Group();this.props.add(this.pan);cyl(0x59777b,0,0,0,.3,.09,this.pan);rod(0x806344,[.2,0,0],[.7,0,0],.04,this.pan);orb(0xf1cc73,0,.07,0,.2,.03,.2,this.pan);
  this.sparkles=[];for(let i=0;i<12;i++){const star=new THREE.Mesh(new THREE.OctahedronGeometry(.055+(i%3)*.025),new THREE.MeshStandardMaterial({color:[0xf4ca57,0xf6b4c8,0xa7d3de][i%3],emissive:0x5d4310,emissiveIntensity:.15}));this.scene.add(star);this.sparkles.push(star)}
  this.juggleBalls=[];for(let i=0;i<3;i++)this.juggleBalls.push(orb([0xe89162,0xe1c655,0x8ebfc9][i],0,0,0,.13,.13,.13,this.scene));
 }
 render(t){this.time=t;const shot=parkShotAt(t,this.cast);this.currentShot=shot;const local=shot.local,progress=local/SHOT_DURATION,action=shot.action,actor=this.actors[shot.character];
  this.actors.forEach((a,i)=>{a.visible=i===shot.character;if(a.visible)animateParkActor(a,action,local,i)});this.vignettes.forEach((stage,i)=>stage.visible=i===shot.act);
  this.scene.background.set([0xbce7ec,0xc7e2da,0xd9d9ef,0xf2dfc5,0xc7e4d6][shot.act]);
  this.cookie.visible=action==='cookie';this.cookie.position.set(.08,1.8+Math.sin(local*7)*.04,.9);this.cookie.rotation.y=Math.sin(local*3)*.2;
  this.guitar.visible=action==='guitar';this.guitar.position.set(0,1.12,.68);this.guitar.rotation.z=-.55+Math.sin(local*6)*.06;
  this.flower.visible=['flower','sniff'].includes(action);this.flower.position.set(.65,.65,.7);
  this.kite.visible=action==='kite';this.kite.position.set(1.2+Math.sin(local*2)*.2,3.2+Math.sin(local*3)*.12,-.4);this.kite.rotation.z=Math.sin(local*2)*.15;
  this.pan.visible=action==='cook';this.pan.position.set(.55,1.25+Math.abs(Math.sin(local*6))*.1,.65);this.pan.rotation.z=Math.sin(local*6)*.15;
  this.playBall.visible=action==='chase';this.playBall.position.set(Math.sin(local*3+.9)*1.2,.3,.8);this.playBall.rotation.x=local*5;
  this.juggleBalls.forEach((b,i)=>{b.visible=action==='juggle'||action==='count';const a=local*4+i*Math.PI*2/3;b.position.set(Math.sin(a)*.7,2+Math.cos(a)*.45,.75);});
  this.bubbles.forEach((b,i)=>{b.visible=action==='bubbles';const u=(local*.33+i/7)%1;b.position.set(Math.sin(i*2.4+local)*1.2,.7+u*2.5,.8+Math.cos(i)*.7);b.scale.setScalar(.8+u)});
  this.sparkles.forEach((star,i)=>{star.visible=['magic','clap','twirl','bow'].includes(action);const a=i*Math.PI/6+local*.7;star.position.set(Math.cos(a)*(1.2+(i%3)*.15),1.8+Math.sin(a)*1.2,Math.sin(i)*.7);star.rotation.set(local+i,local*2,0)});
  // A gentle dolly on each cut; wider framing for the kite and Snuffy, lower for Tango.
  const dog=actor.userData.spec.name==='Tango',snuffy=actor.userData.spec.name==='Snuffleupagus',wide=action==='kite'||snuffy,angles=[-.12,.18,-.2,.1,0],angle=angles[shot.act]+Math.sin(progress*Math.PI)*.07,dist=(wide?11.6:10.7)-progress*.45;
  this.camera.position.set(Math.sin(angle)*dist,wide?4.3:dog?2.5:3.8,Math.cos(angle)*dist);this.camera.lookAt(0,dog?1.2:1.65,0);this.environment?.tick(t);this.renderer.render(this.scene,this.camera);
 }
}
