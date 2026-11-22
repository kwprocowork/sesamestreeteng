import * as THREE from './assets/three.module.js';

// Shared, self-contained material library: no downloads, tracking or texture requests.
const textures=new Map();
function noise(x,y){const a=Math.sin(x*127.1+y*311.7)*43758.5453;return a-Math.floor(a)}
export function surfaceTexture(kind){
 if(textures.has(kind))return textures.get(kind);
 const size=256,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const n=noise(x,y),fine=(n-.5)*22;let v=225+fine;
  if(kind==='wood')v=220+Math.sin(x*.28+Math.sin(y*.035)*2+noise(x>>3,y>>4))*14+fine*.4;
  if(kind==='fabric')v=227+((x%4<2)===(y%4<2)?10:-12)+fine*.3;
  if(kind==='stone'){const row=Math.floor(y/64),seam=y%64<3||(x+row%2*64)%128<3;v=seam?155:224+fine+noise(Math.floor((x+row%2*64)/128),row)*15;}
  if(kind==='grass')v=209+fine*1.5+Math.sin(x*.8+y*1.7)*9;
  if(kind==='bark')v=190+Math.sin(x*.5+Math.sin(y*.05))*30+fine;
  if(kind==='water')v=220+Math.sin(x*.12+Math.sin(y*.08)*3)*14+Math.sin(y*.16)*9;
  const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;
 }
 const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true; t.name='Little Street '+kind;textures.set(kind,t);return t;
}
function material(color,kind='plaster',extras={}){return new THREE.MeshStandardMaterial({color,map:surfaceTexture(kind),bumpMap:surfaceTexture(kind),bumpScale:kind==='bark'?.045:kind==='fabric'?.012:.018,roughness:.82,...extras})}
const box=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(1,12,8),leafGeometry=new THREE.SphereGeometry(1,6,4);
function mesh(parent,geo,mat,x,y,z,sx=1,sy=sx,sz=sx){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
function block(parent,mat,x,y,z,sx,sy,sz){return mesh(parent,box,mat,x,y,z,sx,sy,sz)}
function branch(parent,mat,a,b,r){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),d=end.clone().sub(start);const m=mesh(parent,new THREE.CylinderGeometry(r*.65,r,d.length(),7),mat,...start.clone().add(end).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m}

export class LivingEnvironment{
 constructor(scene,{trailer=false}={}){
  this.scene=scene;this.trailer=trailer;this.root=new THREE.Group();this.root.name='Living scenery';scene.add(this.root);this.sets=new Map();this.active=null;this.elapsed=0;this.last=null;this.materials=new Map();this.surfaced=new WeakSet();this.reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
  this.sky=new THREE.Mesh(new THREE.SphereGeometry(65,24,12),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color('#72b9db')},bottom:{value:new THREE.Color('#eff2d9')}},vertexShader:'varying vec3 vPos; void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 vPos;uniform vec3 top;uniform vec3 bottom;void main(){float h=smoothstep(-0.05,0.7,normalize(vPos).y);gl_FragColor=vec4(mix(bottom,top,h),1.0); #include <tonemapping_fragment>\n #include <colorspace_fragment>\n}'}));
  // Shader preprocessor directives must start on their own lines.
  this.sky.material.fragmentShader=this.sky.material.fragmentShader.replace('; #include',';\n #include');this.sky.renderOrder=-10;this.root.add(this.sky);
 }
 surface(roots){
  for(const root of roots.filter(Boolean))root.traverse(o=>{
   if(!o.isMesh||this.surfaced.has(o)||!o.material?.isMeshStandardMaterial||o.material.map||o.material.vertexColors||o.userData.bodyPart)return;
   for(let p=o;p&&p!==root;p=p.parent)if(p.userData.spec||p.userData.arms||p.userData.entity||p.userData.helper)return;
   const c=o.material.color,hsl={};c.getHSL(hsl);const g=o.geometry.type;
   if(!['BoxGeometry','CylinderGeometry','SphereGeometry'].includes(g))return;
   let kind=null;
   if(g==='BoxGeometry')kind=hsl.h>.06&&hsl.h<.16?'wood':'plaster';
   if(g==='CylinderGeometry')kind=hsl.h>.45&&hsl.h<.62&&o.position.y<.1?'water':hsl.h>.18&&hsl.h<.43?'grass':hsl.h>.06&&hsl.h<.18?'wood':'fabric';
   // Only large horizontal surfaces get a weave; characters and learning objects stay untouched.
   if(g==='SphereGeometry'){
    if(hsl.h>.18&&hsl.h<.43&&o.position.y>2&&Math.max(o.scale.x,o.scale.y,o.scale.z)>.7&&Math.hypot(o.position.x,o.position.z)>5){
     const leaves=new THREE.InstancedMesh(leafGeometry,material(c,'grass'),90),d=new THREE.Object3D();
     for(let i=0;i<90;i++){const a=i*2.399,r=Math.sqrt(noise(i,4));d.position.set(Math.cos(a)*r,noise(i,5)*1.8-.9,Math.sin(a)*r);d.scale.set(.24,.1,.2);d.rotation.set(i*.3,a,i*.7);d.updateMatrix();leaves.setMatrixAt(i,d.matrix);leaves.setColorAt(i,new THREE.Color().setHSL(hsl.h,.36,.3+noise(i,7)*.2));}
     leaves.position.copy(o.position);leaves.rotation.copy(o.rotation);leaves.scale.copy(o.scale);leaves.castShadow=leaves.receiveShadow=true;o.parent.add(leaves);o.visible=false;this.surfaced.add(o);
    }return;
   }
   const key=o.material.uuid+kind;if(!this.materials.has(key)){const m=o.material.clone();m.map=surfaceTexture(kind);m.bumpMap=surfaceTexture(kind);m.bumpScale=.015;m.roughness=kind==='wood'?.66:.9;this.materials.set(key,m)}o.material=this.materials.get(key);o.receiveShadow=true;this.surfaced.add(o);
  });
 }
 setLesson(name,roots=[]){
  this.viewRoots=roots;this.surface(roots);if(!this.sets.has(name)){const set={root:new THREE.Group(),sways:[],clouds:[],birds:[],water:[],curtains:[]};set.root.name=name+' scenery';this.root.add(set.root);this.sets.set(name,set);if(['ball','wants'].includes(name))this.indoor(set,name);else this.outdoor(set,name);}
  this.active=this.sets.get(name);for(const [key,set] of this.sets)set.root.visible=key===name;
  const indoor=['ball','wants'].includes(name);this.sky.visible=!indoor;this.scene.fog=new THREE.Fog(indoor?0xece6d4:0xdbe8d6,indoor?28:25,indoor?58:62);
 }
 tree(set,x,z,size=1,seed=0){
  const p=new THREE.Group();p.position.set(x,0,z);p.scale.setScalar(size);set.root.add(p);const bark=material(0x806245,'bark');branch(p,bark,[0,0,0],[.12,3.5,0],.2);
  for(let i=0;i<7;i++){const a=i*2.399+seed;branch(p,bark,[.08,1.9+i*.17,0],[Math.cos(a)*1.1,3+i*.22,Math.sin(a)*1.1],.065)}
  const canopy=new THREE.Group();canopy.position.set(0,2.6,0);p.add(canopy);const leaves=new THREE.InstancedMesh(leafGeometry,material(0x75a24c,'grass'),160),dummy=new THREE.Object3D();
  for(let i=0;i<160;i++){const a=i*2.399+seed,r=Math.sqrt(noise(i,seed+3))*1.7,y=noise(i,seed+7)*2.3;dummy.position.set(Math.cos(a)*r,y,Math.sin(a)*r*.8);dummy.scale.set(.22+noise(i,3)*.22,.09,.14+noise(i,8)*.15);dummy.rotation.set(i*.37,a,i*.2);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);leaves.setColorAt(i,new THREE.Color().setHSL(.22+noise(i,6)*.08,.35,.25+noise(i,9)*.25));}
  leaves.castShadow=leaves.receiveShadow=true;canopy.add(leaves);set.sways.push({node:canopy,seed});
 }
 townhouse(set,x,z,color,height=6){
  const p=set.root,wall=material(color,'stone'),trim=material(0xf4e6cc,'wood'),glass=material(0x527b87,'plaster',{roughness:.21,metalness:.25});
  block(p,wall,x,height/2,z,4.6,height,3.5);block(p,trim,x,height+.15,z,4.95,.28,3.8);block(p,trim,x,height-.22,z-1.77,4.8,.16,.2);
  for(let floor=0;floor<2;floor++)for(const dx of[-1.15,1.15]){const y=1.7+floor*2.4;block(p,trim,x+dx,y,z+1.8,1.25,1.75,.15);block(p,glass,x+dx,y,z+1.9,1.04,1.5,.045);block(p,trim,x+dx,y,z+1.94,.06,1.5,.05);block(p,trim,x+dx,y,z+1.94,1.04,.06,.05);block(p,trim,x+dx,y-.92,z+1.95,1.45,.14,.35);}
  block(p,material(0x316b61,'wood'),x,.95,z+1.8,.85,1.9,.18);for(let i=0;i<3;i++)block(p,material(0xb9ac95,'stone'),x,.1+i*.13,z+2.5-i*.18,1.3,.2,.65);
 }
 outdoor(set,name){
  const p=set.root,grass=material(0x87aa61,'grass'),stone=material(0xd6c7a8,'stone'),wood=material(0xb08a58,'wood'),metal=material(0x365a54,'plaster',{metalness:.65,roughness:.4});
  // Broad ground and distant architecture replace a floating disc in a flat sky.
  const terrain=mesh(p,new THREE.CircleGeometry(46,96),grass,0,-.23,0);terrain.rotation.x=-Math.PI/2;terrain.castShadow=false;
  for(let i=0;i<7;i++)this.townhouse(set,-18+i*6,-23,[0xb66f55,0xe0b77f,0x88a79c,0xc7978b,0xb7bd96,0xa28f83,0xcba472][i],5.8+i%3*.8);
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=17+i%3;this.tree(set,Math.cos(a)*r,Math.sin(a)*r,1.1+i%3*.12,i+1)}
  for(const [x,z,s]of[[-9,-8,1.15],[10,-8,1.25],[-11,5,.95],[11,6,1.05]])this.tree(set,x,z,s,x+20);
  // A detailed bandstand at the back; its open columns retain views into the park.
  const band=new THREE.Group();band.position.set(name==='body'?0:-10,0,-12);p.add(band);mesh(band,new THREE.CylinderGeometry(2.7,2.8,.35,8),stone,0,.02,0);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;block(band,trimMaterial(),Math.cos(a)*2.25,1.6,Math.sin(a)*2.25,.14,3,.14)}
  const roof=mesh(band,new THREE.ConeGeometry(3.2,1.65,8),material(0x477c77,'wood'),0,3.85,0);roof.rotation.y=Math.PI/8;mesh(band,new THREE.SphereGeometry(.13,10,8),metal,0,4.8,0);
  for(const x of[-9.5,9.5]){for(let i=0;i<5;i++)block(p,wood,x,.68,-3.8+i*.13,2.8,.1,.1);for(let i=0;i<3;i++)block(p,wood,x,1.02+i*.22,-4,2.8,.14,.12);for(const dx of[-1.05,1.05])block(p,metal,x+dx,.4,-3.55,.1,.7,.65);}
  // Raised flower borders and low grass blades use instancing rather than hundreds of draw calls.
  const flowerGeo=new THREE.ConeGeometry(.09,.38,3),blades=new THREE.InstancedMesh(flowerGeo,grass,500),d=new THREE.Object3D();
  for(let i=0;i<500;i++){const a=i*2.399,r=12+noise(i,2)*8;d.position.set(Math.cos(a)*r,.13,Math.sin(a)*r);d.rotation.set(.15, a,Math.sin(i)*.15);d.scale.setScalar(.6+noise(i,7));d.updateMatrix();blades.setMatrixAt(i,d.matrix)}p.add(blades);
  for(const x of[-8.6,8.6]){block(p,stone,x,.18,-7.3,2.7,.36,1.15);for(let i=0;i<12;i++){const f=new THREE.Group();f.position.set(x-1.15+i%6*.46,.34,-7.6+Math.floor(i/6)*.5);p.add(f);branch(f,grass,[0,0,0],[0,.4,0],.018);for(let j=0;j<5;j++)mesh(f,sphere,material([0xeaa2af,0xf5c760,0xb3a0cd][i%3],'fabric'),Math.cos(j*1.257)*.09,.42,Math.sin(j*1.257)*.09,.09,.035,.065);set.sways.push({node:f,seed:i});}}
  // Background pond doesn't take the place of the phonics fish's interactive pond.
  const pond=mesh(p,new THREE.CircleGeometry(2.3,48),material(0x4f9ca4,'water',{roughness:.24,metalness:.35}),7,.015,-10.5);pond.rotation.x=-Math.PI/2;pond.scale.y=.68;set.water.push(pond);
  for(let i=0;i<20;i++){const a=i*Math.PI/10;mesh(p,new THREE.DodecahedronGeometry(1),stone,7+Math.cos(a)*2.35,.1,-10.5+Math.sin(a)*1.6,.24,.15,.2)}
  for(let i=0;i<5;i++){const ripple=new THREE.Mesh(new THREE.RingGeometry(.3,.315,40),new THREE.MeshBasicMaterial({color:0xc9ebe4,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide}));ripple.rotation.x=-Math.PI/2;ripple.position.set(7+Math.sin(i)*.8,.025,-10.5+Math.cos(i)*.6);p.add(ripple);set.water.push(ripple);}
  for(let i=0;i<6;i++){const c=new THREE.Group();c.position.set(-22+i*8,10+i%3,-28+i%2*8);p.add(c);for(let j=0;j<4;j++){const m=mesh(c,sphere,new THREE.MeshStandardMaterial({color:0xfffcf1,roughness:1}),j*.9,Math.sin(j)*.3,0,1.5,.45,.7);m.castShadow=false;}set.clouds.push({node:c,x:c.position.x,seed:i});}
  for(let i=0;i<4;i++){const bird=new THREE.Group();p.add(bird);const wings=[];for(const side of[-1,1]){const w=mesh(bird,new THREE.ConeGeometry(.14,.65,3),metal,side*.2,0,0);w.rotation.z=side*Math.PI/2;wings.push(w)}set.birds.push({node:bird,wings,seed:i});}
 }
 indoor(set,name){
  const p=set.root,wood=material(0xc29b6a,'wood'),cloth=material(name==='wants'?0xd9a68d:0xc8a866,'fabric'),cream=trimMaterial();
  // Window pleats have real depth and a gentle breeze; no overlay crosses the learning dock.
  const centers=name==='wants'?[-6,5]:[-2.4];
  for(const center of centers)for(const side of[-1,1]){const curtain=new THREE.Group();curtain.position.set(center+side*(name==='wants'?1.83:2.47),5.8,-5.36);p.add(curtain);const geo=new THREE.PlaneGeometry(.68,3.05,16,20),pos=geo.attributes.position;
   for(let i=0;i<pos.count;i++)pos.setZ(i,Math.sin(pos.getX(i)*29)*.085);geo.computeVertexNormals();const panel=mesh(curtain,geo,cloth,0,-1.5,0);panel.material.side=THREE.DoubleSide;set.curtains.push(curtain);branch(p,wood,[center-2.7,5.88,-5.4],[center+2.7,5.88,-5.4],.055);
  }
  // Joinery and inset panels add constructed, rather than moulded, room surfaces.
  for(let x=-9;x<10;x+=1.6){block(p,cream,x,2.3,-5.68,1.4,.045,.07);block(p,cream,x,.34,-5.68,1.4,.045,.07);for(const dx of[-.7,.7])block(p,cream,x+dx,1.32,-5.68,.045,2,.07)}
  block(p,cream,0,6.7,-5.93,20,.2,.35);block(p,wood,0,6.9,-6,20,.12,.28);
  // Ceiling pendants give the room an architectural scale without a ceiling blocking the camera.
  for(const x of[-6,5.5]){branch(p,material(0x72746a),[x,6.8,-2.5],[x,5.6,-2.5],.025);const shade=mesh(p,new THREE.ConeGeometry(.65,.45,24,1,true),cloth,x,5.4,-2.5);shade.material.side=THREE.DoubleSide;mesh(p,sphere,new THREE.MeshStandardMaterial({color:0xffefc7,emissive:0xffd58c,emissiveIntensity:.5}),x,5.19,-2.5,.13);}
  // Recessed woven border is kept away from playable objects.
  for(const x of[-8.5,8.5]){block(p,wood,x,.32,3.5,1.4,.6,1.1);block(p,cloth,x,.68,3.5,1.45,.18,1.15);for(let i=0;i<4;i++)block(p,cream,x-.5+i*.33,.4,4.06,.015,.32,.02);}
 }

 clearView(camera,player,focus,subjects=[]){
  if(!camera||!player)return;
  for(const mesh of this.hiddenForView||[])mesh.visible=true;
  this.hiddenForView=[];
  this.scene.updateMatrixWorld(true);
  const origin=camera.position;
  const targets=[player.position.clone().add(new THREE.Vector3(0,1.3,0)),focus].filter(Boolean);
  for(const actor of new Set([player,...subjects])){
   if(!actor?.visible)continue;
   const box=new THREE.Box3().setFromObject(actor),centre=box.getCenter(new THREE.Vector3());
   for(const height of [.4,.8,1])for(const x of [box.min.x,centre.x,box.max.x])targets.push(new THREE.Vector3(x,box.min.y+(box.max.y-box.min.y)*height,centre.z));
  }
  const ray=new THREE.Raycaster();
  for(const target of targets){
   const direction=target.clone().sub(origin),distance=direction.length();
   ray.set(origin,direction.normalize());ray.far=Math.max(0,distance-.6);
   const hits=ray.intersectObjects([this.active.root,...this.viewRoots.filter(Boolean)],true);
   for(const hit of hits){
    const object=hit.object;
    if(!object.visible||hit.point.y<.25||object===this.sky)continue;
    let protectedObject=false;
    for(let ancestor=object;ancestor;ancestor=ancestor.parent){
     if(ancestor.userData.spec||ancestor.userData.entity||ancestor.userData.part||ancestor.userData.helper)protectedObject=true;
    }
    if(protectedObject)continue;
    object.visible=false;this.hiddenForView.push(object);
   }
  }
 }
 tick(time,{paused=false}={}){
  const dt=this.last===null?0:Math.min(.05,Math.max(0,time-this.last));this.last=time;if(!paused&&!this.reduced)this.elapsed+=dt;const t=this.elapsed,s=this.active;if(!s)return;
  for(const {node,seed}of s.sways)node.rotation.z=Math.sin(t*.65+seed)*.018;
  s.curtains.forEach((c,i)=>{c.rotation.x=Math.sin(t*.65+i)*.016;c.rotation.z=Math.sin(t*.5+i)*.012});
  for(const {node,x,seed}of s.clouds)node.position.x=x+Math.sin(t*.025+seed)*2;
  for(const {node,wings,seed}of s.birds){const a=t*.11+seed*1.8;node.position.set(Math.cos(a)*14,7.5+Math.sin(a*2)*.8,-13+Math.sin(a)*4);node.rotation.y=-a;wings.forEach((w,i)=>w.rotation.x=Math.sin(t*4+seed)*(i?-.45:.45));}
  s.water.forEach((w,i)=>{if(w.geometry.type==='RingGeometry'){const u=(t*.17+i*.19)%1;w.scale.setScalar(.4+u*2);w.material.opacity=(1-u)*.24;}});
 }
}
function trimMaterial(){return material(0xf1e4c9,'wood')}
