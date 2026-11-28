import {SchoolTHREE as THREE,schoolBox,schoolMaterial} from './schoolbus/core.js?v=75a';
import {homeModel} from './home-models.js?v=75a';
import {TERRAIN} from './town-terrain.js?v=75a';
import {buildTownFacade,buildTownFacility,townSign} from './town-architecture.js?v=75a';
const BOX=new THREE.BoxGeometry(1,1,1),LEAF=new THREE.SphereGeometry(1,8,6),TRUNK=new THREE.CylinderGeometry(1,1,1,9),CONE=new THREE.ConeGeometry(1,1,10),MAT=new Map();
export const CANAL={x:-8,half:5};
export function townWaterBlocked(x,z,places,cachedLanes=null){if(Math.abs(x-CANAL.x)>=CANAL.half)return false;const lanes=cachedLanes||places.map(p=>p.lane);if(z>Math.max(...lanes)+5||z<Math.min(...lanes)-6)return false;return !lanes.some(lane=>Math.abs(z-lane)<4.65);}
export const DISTRICT_PALETTES={ 'Friendship Harbour':0xf4d5a1,'Discovery Quarter':0x95d9d5,'Enchanted Gardens':0xdab4dc,'Adventure Heights':0xacd49d,'Storybook Village':0xb7bee8 };
export function buildFantasyTown(world,places,g,{spine,loop}){
 const {left,right,top,bottom}=world.bounds,mid=(top+bottom)/2,lanes=[...new Set(places.map(p=>p.lane))].sort((a,b)=>a-b),animations=[],lastLane=lanes.at(-1);
 const mesh=(geo,c,x,y,z,sx,sy,sz,parent=g)=>{if(!MAT.has(c))MAT.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.75}));const m=new THREE.Mesh(geo,MAT.get(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const box=(c,x,y,z,w,h,d,p=g)=>mesh(schoolBox(w,h,d),c,x,y,z,1,1,1,p),orb=(c,x,y,z,a,b=a,d=a,p=g)=>mesh(LEAF,c,x,y,z,a,b,d,p),cyl=(c,x,y,z,r,h,p=g)=>mesh(TRUNK,c,x,y,z,r,h,r,p);
 const label=(text,x,y,z,w=7)=>{const sign=new THREE.Group();sign.position.set(x,y,z);sign.scale.setScalar(w>10?1:.7);g.add(sign);townSign(text,0,0,0,w,sign,world.cube,{green:true});};
 const terrain=new THREE.BufferGeometry();terrain.setAttribute('position',new THREE.Float32BufferAttribute(TERRAIN.vertices,3));terrain.setAttribute('color',new THREE.Float32BufferAttribute(TERRAIN.colors,3));terrain.setIndex(TERRAIN.indices);terrain.computeVertexNormals();const land=new THREE.Mesh(terrain,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));land.receiveShadow=true;land.userData.townOwned=true;g.add(land);
 if(top< -260)box(0x79a76c,0,-.28,(top-260)/2,310,.2,-260-top+20);
 // A soft painted sky adds atmospheric depth without image downloads.
 const skyGeo=new THREE.SphereGeometry(1100,24,16),skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:'varying vec3 vSky;void main(){vSky=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 vSky;void main(){vec3 ray=normalize(vSky-cameraPosition);float h=smoothstep(-0.08,0.65,ray.y);vec3 haze=vec3(0.86,0.91,0.83);vec3 blue=vec3(0.43,0.70,0.82);gl_FragColor=vec4(mix(haze,blue,h),1.0);}'});const sky=new THREE.Mesh(skyGeo,skyMat);sky.renderOrder=-5;sky.frustumCulled=false;sky.userData.townOwned=true;g.add(sky);
 // Turquoise ocean, sheer island coast, and the navigable canal beneath five bridges.
 const sea=box(0x69bfca,0,-9,mid,1100,.2,1100);sea.castShadow=false;
 const water=box(0x65c6ce,-8,.012,(lanes[0]+lanes.at(-1))/2,10,.045,lanes.at(-1)-lanes[0]+12);water.castShadow=false;
 for(const side of[-1,1])box(0xc9d6ad,-8+side*5.4,.1,(lanes[0]+lanes.at(-1))/2,.8,.2,lanes.at(-1)-lanes[0]+12);
 const staticDecor=new THREE.Group();staticDecor.name='Batched vegetation and street furniture';g.add(staticDecor);
 const tree=(x,z,i)=>{world.blocks.push([x-.33,x+.33,z-.33,z+.33]);const p=staticDecor;cyl(0x906d56,x,1.6,z,.24,3.2,p);const colors=[0x77a877,0x64a58d,0xc4aecb,0xe7be8f];const color=colors[(i%4+4)%4];for(let k=0;k<4;k++){const a=k*2.4;orb(color,x+Math.sin(a)*.85,3.3+(k%2)*.8,z+Math.cos(a)*.7,1.45,1.6,1.35,p);}orb(0xf8e4ba,x,1.95,z+.27,.11,.08,.03,p);};
 const lamp=(x,z)=>{cyl(0x315e69,x,1.8,z,.08,3.6,staticDecor);orb(0xffe2a1,x,3.7,z,.29,.4,.29,staticDecor);box(0x548d85,x,4.05,z,.7,.12,.7,staticDecor);};
 const bench=(x,z,turn=0)=>{const b=new THREE.Group();b.position.set(x,0,z);b.rotation.y=turn;g.add(b);box(0xe0ae70,0,.65,0,2.7,.15,.8,b);box(0x6baba1,0,1.1,-.32,2.7,.7,.12,b);for(const s of[-1,1])box(0x3b6571,s,.3,0,.12,.6,.6,b);world.batchStreet(b);};
 // Broad connected boulevards, paved sidewalks and continuous bridge decks.
 for(const x of[spine,...loop]){box(0xe8dab7,x,.005,(lanes[0]+lastLane)/2,12.6,.13,lastLane-lanes[0]+12);box(0x889caa,x,.083,(lanes[0]+lastLane)/2,7,.045,lastLane-lanes[0]+12);}
 for(const z of lanes){box(0xe8dab7,0,.025,z,right-left-2,.14,11);box(0x8f9faa,0,.11,z,right-left-2,.045,6.8);
  for(let x=left+6;x<right-4;x+=6){if(Math.abs(x+8)<9)continue;box(0xf9edcf,x,.143,z,2.3,.015,.12);}
  // Bridge balustrades remain outside the walking deck.
  box(0xf0dba8,-8,.17,z,17,.14,10.8);for(const s of[-1,1]){box(0x609c9a,-8,.9,z+s*5,17,.15,.15);for(let x=-16;x<=0;x+=2)cyl(0x609c9a,x,.52,z+s*5,.065,.95);}
  for(const x of[spine,...loop])for(let i=-3;i<=3;i++)box(0xfff5dc,x+i*.85,.163,z+4.2,.5,.02,1.2);
  for(const x of[-101,-69,-36,20,50,79,101])lamp(x,z+4.3);
  for(const side of[-1,1]){tree(-22,z+side*9,Math.round(z));tree(2,z+side*9,Math.round(z)+1);}
 }
 // Each venue sits in a generous garden court, with a legible approach to the real door.
 for(const p of places){const front=p.z+p.depth/2;
  box(DISTRICT_PALETTES[p.district]||0xb7d5b4,p.x,-.035,p.z,p.width+8,.12,p.depth+9);
  box(0xf0dfbb,p.x,.03,(front+p.lane)/2,4.6,.12,p.lane-front);
  for(const side of[-1,1]){tree(p.x+side*(p.width/2+2.8),p.z,Math.round(p.x));orb(0x8fb27d,p.x+side*(p.width/2+2.3),.55,front+1.1,1,.65,.85,staticDecor);}
  world.blocks.push([p.x-p.width/2-.08,p.x+p.width/2+.08,p.z-p.depth/2-.08,front+.08]);
  if(p.action)buildTownFacility(p,g,world,world.cube);else buildTownFacade(p,g,world.cube);
  const disk=cyl(0xf4cd70,p.x,.05,p.doorZ,.65,.045);disk.castShadow=false;
 }
 // District parks fill the spaces between venues with a landscape hierarchy.
 const pathRing=(x,z,rx,rz)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.095,6,56),MAT.get(0xf0dfbb));ring.rotation.x=-Math.PI/2;ring.position.set(x,.07,z);ring.scale.set(rx,rz,1);ring.castShadow=false;g.add(ring);ring.userData.privateGeometry=true;};
 const garden=(x,z,rx,rz,pond=false)=>{const lawn=cyl(0x8fba88,x,.015,z,rx,.09);lawn.scale.z=rz/rx;pathRing(x,z,rx*.87,rz*.87);if(pond){const pool=cyl(0x76c8cf,x,.09,z,rx*.45,.08);pool.scale.z=rz/rx;world.blocks.push([x-rx*.47,x+rx*.47,z-rz*.47,z+rz*.47]);for(let i=0;i<7;i++)orb(0xc1d8a3,x+Math.sin(i*2.4)*rx*.35,.16,z+Math.cos(i*2.4)*rz*.33,.55,.07,.38,staticDecor);}for(let i=0;i<14;i++){const a=i*Math.PI*2/14,px=x+Math.cos(a)*rx*.73,pz=z+Math.sin(a)*rz*.73;orb(0x769d70,px,.3,pz,.55,.4,.55,staticDecor);for(let j=0;j<3;j++)orb([0xeab4c4,0xf4d68e,0xc9b7de][i%3],px+Math.sin(j*2.1)*.28,.65,pz+Math.cos(j*2.1)*.28,.17,.16,.17,staticDecor);}};
 garden(67,-33,19,14,true);garden(-59,70,22,12,true);garden(69,-87,19,12);garden(-61,-87,22,14);
 // Woodland courts, mushroom houses and a pavilion create smaller discoveries.
 for(const [x,z]of[[-84,-90],[-71,-101],[-45,-97],[-82,-79],[-42,-77],[50,-39],[86,-43],[86,-23],[-79,70],[-44,80]])tree(x,z,Math.round(x));
 for(const [i,[x,z]]of[[-67,-88],[-56,-92],[-53,-81]].entries()){const cottage=new THREE.Group();cottage.position.set(x,0,z);g.add(cottage);cyl(0xf0ddbb,0,1.4,0,1.5,2.8,cottage);orb([0xd5a5b7,0xadbfcf,0xd6bf8b][i],0,3.3,0,2.5,1.4,2.5,cottage);box(0x477c7b,0,.9,1.45,.7,1.8,.1,cottage);orb(0xf9e6bb,.7,1.8,1.4,.35,.35,.06,cottage);world.blocks.push([x-2,x+2,z-2,z+2]);world.batchStreet(cottage);}
 const pavilion=new THREE.Group();pavilion.position.set(88,0,-34);g.add(pavilion);cyl(0xe8d5af,0,.14,0,4,.28,pavilion);for(let i=0;i<6;i++){const a=i*Math.PI/3;cyl(0x689a9b,Math.cos(a)*3,2.3,Math.sin(a)*3,.12,4.6,pavilion);}mesh(CONE,0xbca7ce,0,5.5,0,4.5,2.6,4.5,pavilion);orb(0xffda94,0,7,0,.35,.35,.35,pavilion);world.batchStreet(pavilion);
 // A lighthouse balances the harbour skyline; warm flower borders follow its promenade.
 const lighthouse=new THREE.Group();lighthouse.position.set(-86,0,65);g.add(lighthouse);cyl(0xf1dabb,0,6,0,1.8,12,lighthouse);cyl(0xc6a7ba,0,6.1,0,1.86,2,lighthouse);cyl(0x8fc1c3,0,12.8,0,2.4,1.5,lighthouse);mesh(CONE,0x9ca3c6,0,14.4,0,3,1.8,3,lighthouse);orb(0xffd882,0,12.9,0,.9,.8,.9,lighthouse);world.blocks.push([-88.5,-83.5,62.5,67.5]);world.batchStreet(lighthouse);
 // Rabbit's district has cultivated plots, not another empty field.
 for(let row=0;row<5;row++){box(0xa8916e,87,.015,-146+row*2,29,.09,1.4);for(let col=0;col<18;col++){const x=74+col*1.5,z=-146+row*2;orb(row%2?0x739a68:0x92b87b,x,.3,z,.42,.32,.38,staticDecor);orb(0xe6bb7c,x,.17,z+.22,.12,.2,.12,staticDecor);}}
 // The narrow-gauge train circles outside walking bounds, avoiding player collisions.
 const railLeft=left-8,railRight=right+8,railTop=top-10,railBottom=bottom+8;
 for(const x of[railLeft,railRight]){box(0xc8bfa7,x,.03,(railTop+railBottom)/2,2,.15,railBottom-railTop);for(const side of[-1,1])box(0x66858a,x+side*.45,.14,(railTop+railBottom)/2,.07,.08,railBottom-railTop);for(let z=railTop;z<railBottom;z+=2.5)box(0x8c8274,x,.1,z,1.5,.1,.18,staticDecor);}
 for(const z of[railTop,railBottom]){box(0xc8bfa7,0,.03,z,railRight-railLeft,.15,2);for(const side of[-1,1])box(0x66858a,0,.14,z+side*.45,railRight-railLeft,.08,.07);for(let x=railLeft;x<railRight;x+=2.5)box(0x8c8274,x,.1,z,1.5,.1,.18,staticDecor);}
 const train=homeModel('toy-train',{cube:box,cyl,orb});train.scale.setScalar(3.3);g.add(train);const perimeter=2*(railRight-railLeft+railBottom-railTop);animations.push((t,reduced)=>{let d=(reduced?perimeter*.18:t*4)%perimeter;const edges=[[railLeft,railBottom,railRight,railBottom],[railRight,railBottom,railRight,railTop],[railRight,railTop,railLeft,railTop],[railLeft,railTop,railLeft,railBottom]];for(const [x,z,nx,nz]of edges){const length=Math.hypot(nx-x,nz-z);if(d<=length){train.position.set(x+(nx-x)*d/length,.16,z+(nz-z)*d/length);train.rotation.y=Math.atan2(-(nz-z),nx-x);break;}d-=length;}});world.batchStreet(train);
 // A landmark entrance frames the southern harbour without enclosing the vista.
 for(let i=0;i<3;i++){const arch=new THREE.Mesh(new THREE.TorusGeometry(7.4+i*.38,.16,7,40,Math.PI),MAT.get([0xf0b0a7,0xb0cee0,0xd4c1e5][i])||new THREE.MeshStandardMaterial({color:[0xf0b0a7,0xb0cee0,0xd4c1e5][i]}));arch.position.set(10,1.2,96);arch.userData.privateGeometry=true;g.add(arch);}for(const x of[2.2,17.8])box(0xf5d7aa,x,.65,96,.55,1.3,.55);label('Sesame Street Town',10,4.9,96,13);
 // Friendship Clock: a skyline anchor visible from the entry, not an obstacle on the road.
 const tower=new THREE.Group();tower.position.set(27,0,31);g.add(tower);box(0xf5d5aa,0,7,0,4,14,4,tower);box(0x80b7b4,0,1.2,0,4.8,2.4,4.8,tower);box(0xfbecc6,0,11.1,0,4.5,3.5,4.5,tower);const roof=mesh(CONE,0xd88d91,0,15.2,0,4,4,4,tower);orb(0xf7d17c,0,17.6,0,.4,.4,.4,tower);
 for(const z of[-2.3,2.3]){const face=cyl(0xffedbf,0,11.2,z,1.35,.1,tower);face.rotation.x=Math.PI/2;box(0x395867,0,11.55,z+Math.sign(z)*.08,.09,.8,.08,tower);box(0x395867,.35,11.2,z+Math.sign(z)*.09,.8,.09,.08,tower);const rim=new THREE.Mesh(new THREE.TorusGeometry(1.4,.075,6,36),MAT.get(0x609c9a));rim.position.set(0,11.2,z+Math.sign(z)*.08);rim.userData.privateGeometry=true;tower.add(rim);for(let i=0;i<12;i++){const a=i*Math.PI/6;orb(0x609c9a,Math.sin(a)*1.12,11.2+Math.cos(a)*1.12,z+Math.sign(z)*.10,.05,.05,.025,tower);}}
 world.blocks.push([24.6,29.4,28.6,33.4]);label('Friendship Square',27,3.1,34,7.7);
 // A sculpted fountain court, kept clear of the boulevards.
 const fx=-40,fz=20;cyl(0xd7c2a5,fx,.25,fz,5,.5);cyl(0x64b9c1,fx,.54,fz,4.5,.08);cyl(0xf2d5a0,fx,1.1,fz,1.6,1.2);cyl(0xc4d8c4,fx,1.8,fz,2.3,.22);cyl(0xf2d5a0,fx,2.5,fz,.7,1.3);orb(0xffd178,fx,3.4,fz,.7,.7,.7);
 for(let i=0;i<30;i++){const drop=orb(0xb0ecdf,fx,.6,fz,.06,.11,.06);drop.userData.townAnimated=true;world.water.push({dot:drop,x:fx,y:.6,z:fz,radius:3.8});}world.blocks.push([fx-5,fx+5,fz-5,fz+5]);bench(-48,21,Math.PI/2);bench(-32,21,-Math.PI/2);
 // Flower courts, floating cloud islands and a storybook castle on the far horizon.
 for(let i=0;i<70;i++){const side=i%2?1:-1,x=side*(124+(i%5)*7),z=top+10+Math.floor(i/2)*9;if(z>bottom+5)continue;tree(x,z,i);}
 for(let i=0;i<18;i++){const x=-190+i*23,z=top-55-(i%3)*12,h=15+(i%4)*6;orb(i%2?0x98b59e:0xa4bec2,x,h*.2,z,20,h,16);mesh(CONE,0xd4ddd1,x,h,z,10,14,10);}
 const castleZ=top-46;for(const x of[-18,0,18]){cyl(0xc6b8da,x,22,castleZ,4.5,44);mesh(CONE,0x8da7c2,x,49,castleZ,6.5,12,6.5);orb(0xf3d591,x,55.5,castleZ,.7,.7,.7);}box(0xd8cbe2,0,15,castleZ,35,30,7);
 for(let i=0;i<11;i++){const cloud=new THREE.Group();cloud.position.set(-130+i*27,25+(i%3)*8,top+35+(i%4)*56);g.add(cloud);for(let j=-2;j<=2;j++)orb(0xfff5e5,j*2,Math.cos(j)*.5,0,3,1.3,1.4,cloud);const base=cloud.position.clone();animations.push((t,reduced)=>{cloud.position.x=base.x+(reduced?0:Math.sin(t*.06+i)*3);cloud.position.y=base.y+(reduced?0:Math.sin(t*.2+i)*.4);});world.batchStreet(cloud);}
 // Sky gardens and windmill silhouettes break up the long views.
 for(const [x,z,y]of[[-74,-87,29],[82,-32,33]]){const isle=new THREE.Group();isle.position.set(x,y,z);g.add(isle);const cliff=mesh(CONE,0xa9b8aa,0,-4,0,8,8,8,isle);cliff.rotation.z=Math.PI;cyl(0x82b6a2,0,.15,0,7.3,.5,isle);box(0xf2dbbd,0,2.1,0,4,4.2,4,isle);mesh(CONE,0xb4a5ce,0,5.6,0,4.5,3.1,4.5,isle);for(let i=0;i<6;i++)orb(0x72a28a,Math.cos(i)*5,-2-i%3,Math.sin(i)*5,.4,1.9,.4,isle);const baseY=y;animations.push((t,reduced)=>isle.position.y=baseY+(reduced?0:Math.sin(t*.16+x)*.35));world.batchStreet(isle);}
 const windmill=new THREE.Group();windmill.position.set(-102,0,-84);g.add(windmill);cyl(0xe9d3ad,0,5,0,2,10,windmill);mesh(CONE,0x9e9ec6,0,11.4,0,3.2,3,3.2,windmill);const blades=new THREE.Group();blades.position.set(0,8,2.2);windmill.add(blades);for(let i=0;i<4;i++){const blade=new THREE.Group();blade.rotation.z=i*Math.PI/2;blades.add(blade);box(0xc7ba99,0,2.4,0,.18,4.8,.12,blade);box(0xffefca,.55,3,0,1.1,2.8,.1,blade);}animations.push((t,reduced)=>blades.rotation.z=reduced?0:t*.28);world.blocks.push([-104.3,-99.7,-86.3,-81.7]);world.batchStreet(windmill);
 // Flower borders use inexpensive shared meshes and instancing.
 for(const p of places)for(const side of[-1,1])for(let k=0;k<9;k++){const x=p.x+side*(p.width/2+2.5),z=p.z-4+k;orb(0x7da57e,x,.18,z,.34,.27,.35,staticDecor);orb([0xe4b5c0,0xf5dca0,0xc2b6db][k%3],x,.45,z,.16,.15,.17,staticDecor);}
 // Original balloon couriers: silhouettes use low-cost native meshes.
 for(let i=0;i<3;i++){const ship=new THREE.Group();g.add(ship);orb([0xf0b0a7,0xb0cee0,0xd4c1e5][i],0,2,0,2.7,3,2.4,ship);box(0xb98c66,0,-1.3,0,1.8,.7,1.4,ship);for(const s of[-1,1])cyl(0xe8d4ac,s*.7,-.2,0,.035,1.6,ship);const base=[-60+i*65,23+i*5,-35-i*45];animations.push((t,reduced)=>{ship.position.set(base[0]+(reduced?0:Math.sin(t*.04+i)*15),base[1]+(reduced?0:Math.sin(t*.7+i)*.5),base[2]);});world.batchStreet(ship);}
 // Bubbles and boats use a bounded set of animated meshes, never per-frame allocation.
 const boats=[];for(let i=0;i<3;i++){const boat=new THREE.Group();g.add(boat);box([0xf2c973,0xd899b0,0x91bcba][i],0,.24,0,1.5,.4,2.6,boat);cyl(0xe8d3a9,0,1.3,0,.035,2,boat);const sail=mesh(CONE,0xffebca,.3,1.5,0,.7,1.2,.08,boat);boats.push(boat);world.batchStreet(boat);}
 const foam=[];for(let i=0;i<24;i++){const q=box(0xb5e3de,-8+Math.sin(i)*3,.044,lanes[0]+i*(lastLane-lanes[0])/24,.9,.009,.08);q.castShadow=false;q.userData.townAnimated=true;foam.push(q);}
 for(const [name,z]of[['Friendship Harbour',56],['Discovery Quarter',8],['Enchanted Gardens',-49],['Adventure Heights',-107],['Storybook Village',-164]]){label(name,18,3,z+9,8);bench(33,z+8);bench(-27,z+8);}
 world.batchStreet(staticDecor);world.batchStreet(g);
 world.fantasyTick=(t,reduced)=>{animations.forEach(fn=>fn(t,reduced));boats.forEach((b,i)=>{const j=i%Math.max(1,lanes.length-1),lo=lanes[j]+8,hi=lanes[j+1]-8,u=reduced?.5:(1+Math.sin(t*.08+i))/2;b.position.set(-8,.05,lo+(hi-lo)*u);b.rotation.y=Math.cos(t*.08+i)>=0?0:Math.PI;b.rotation.z=reduced?0:Math.sin(t*2+i)*.04;});foam.forEach((q,i)=>q.scale.x=reduced?.9:.65+Math.sin(t*1.6+i)*.25);};
 // Animated foam must remain outside the static batch.
}
