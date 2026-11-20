import * as THREE from './assets/three.module.js';
const sphere=new THREE.SphereGeometry(1,32,24);
export const HOUSE_LABEL_STYLE={background:'#fffbee',ink:'#173f36',frame:0x9c7845,height:.68,canvasWidth:1024,canvasHeight:320};
// Facial details follow the head's ellipsoid instead of sitting on a floating flat disc.
export function faceSurfaceZ(x,y,radii,padding=.014){const [rx,ry,rz]=radii;return rz*Math.sqrt(Math.max(.01,1-(x/rx)**2-(y/ry)**2))+padding;}
export function createFamilyCharacter(kind){
 const baby=kind==='baby',actor=new THREE.Group(),materials=new Map(),skin=baby?0xf0c6a2:0xd4aa85,hair=baby?0xa47548:0x75513c;
 actor.name=baby?'Baby brother':'Mama';
 const material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.86}));return materials.get(color)};
 function orb(parent,color,x,y,z,sx,sy=sx,sz=sx){const mesh=new THREE.Mesh(sphere,material(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function curve(parent,color,points,radius=.009){const path=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(path,28,radius,7,false),material(color));parent.add(mesh);return mesh;}
 const head=new THREE.Group();head.position.set(0,baby?.94:2.22,baby?.035:0);head.name='head';actor.add(head);const radii=baby?[.405,.405,.365]:[.395,.45,.345];
 if(!baby){orb(head,hair,0,.08,-.13,.445,.46,.3);for(const side of[-1,1])orb(head,hair,side*.34,-.04,-.1,.16,.36,.24);}
 const headSkin=orb(head,skin,0,0,0,...radii);headSkin.name='face-skin';
 const eyes=[];for(const side of[-1,1]){
  orb(head,skin,side*(radii[0]-.015),-.005,-.005,.075,.105,.065);
  const x=side*.133,y=.07,z=faceSurfaceZ(x,y,radii,.018);
  const eye=orb(head,0xfffbf2,x,y,z,baby?.073:.068,baby?.088:.085,.035);eye.name='eye-white';eyes.push(eye);
  orb(head,0x795e46,x,y-.004,z+.029,.037,.048,.012);orb(head,0x34352e,x,y-.006,z+.04,.021,.032,.009);orb(head,0xffffff,x-.009,y+.016,z+.048,.009,.011,.004);
  const brow=[];for(let i=0;i<=6;i++){const bx=x+(i/6-.5)*.13,by=.19+Math.sin(i/6*Math.PI)*.025;brow.push([bx,by,faceSurfaceZ(bx,by,radii,.014)])}curve(head,hair,brow,baby?.007:.009);
  const cx=side*.23,cy=-.083;orb(head,baby?0xeab29a:0xd59c87,cx,cy,faceSurfaceZ(cx,cy,radii,.014),.068,.028,.008);
 }
 orb(head,skin,0,-.026,faceSurfaceZ(0,-.026,radii,.019),baby?.047:.045,baby?.059:.066,.063);
 function mouth(smile){const group=new THREE.Group();group.name=smile?'natural-smile':'gentle-frown';const points=[];for(let i=0;i<=10;i++){const u=i/10,x=(u-.5)*(baby?.195:.215),y=smile?-.137-Math.sin(u*Math.PI)*.047:-.162+Math.sin(u*Math.PI)*.024;points.push([x,y,faceSurfaceZ(x,y,radii,.017)])}const line=curve(group,baby?0xa86a5b:0x9a5c52,points,baby?.009:.0095);line.name='closed-mouth-curve';line.userData.radii=radii;line.userData.surfacePadding=.017;head.add(group);return group;}
 const smile=mouth(true),frown=mouth(false);frown.visible=baby;smile.visible=!baby;
 if(baby){
  // A soft cotton romper, white bib, short seated limbs and small hands/feet.
  orb(actor,0xe4b966,0,.3,0,.29,.34,.22);orb(actor,0xfff4d9,0,.44,.202,.19,.21,.025);orb(actor,0xd8a452,0,.4,.233,.05,.047,.008);
  const arms=[];for(const side of[-1,1]){const arm=new THREE.Group();arm.position.set(side*.255,.47,.015);actor.add(arm);orb(arm,skin,side*.02,-.12,-.01,.105,.18,.11);orb(arm,skin,side*.065,-.27,.125,.09,.12,.085);for(let f=0;f<3;f++)orb(arm,skin,side*.065+(f-1)*.034,-.32,.185,.023,.043,.028);arms.push(arm);orb(actor,skin,side*.155,.02,.12,.12,.15,.13);orb(actor,skin,side*.17,-.055,.25,.125,.085,.18);}actor.userData.arms=arms;
  for(let j=0;j<3;j++){const points=[];for(let i=0;i<9;i++){const a=i/8*Math.PI*1.5;points.push([-.06+j*.055+Math.cos(a)*.037,.391+Math.sin(a)*.035,.025+j*.008])}curve(head,hair,points,.016);}
 }else{
  const dress=new THREE.Mesh(new THREE.CylinderGeometry(.29,.44,1.27,32),material(0xa58ab8));dress.position.y=1.03;dress.castShadow=true;actor.add(dress);orb(actor,0xa58ab8,0,1.6,0,.34,.22,.25);
  orb(actor,skin,0,1.78,0,.115,.19,.115);
  for(const side of[-1,1]){orb(actor,0xf7ebdc,side*.105,1.73,.2,.12,.075,.035);orb(actor,skin,side*.18,.33,0,.11,.24,.11);orb(actor,0x715b79,side*.19,.105,.08,.155,.09,.24);}
  const arms=[];for(const side of[-1,1]){const arm=new THREE.Group();arm.position.set(side*.29,1.6,0);arm.rotation.z=-side*.13;actor.add(arm);orb(arm,0xa58ab8,side*.09,-.17,0,.125,.24,.135);orb(arm,skin,side*.12,-.47,.015,.095,.21,.10);orb(arm,skin,side*.12,-.68,.06,.10,.12,.075);for(let f=0;f<3;f++)orb(arm,skin,side*.12+(f-1)*.035,-.76,.085,.023,.06,.026);arms.push(arm)}
  for(let j=0;j<5;j++){const fringe=orb(head,hair,(j-2)*.13,.34+Math.sin(j/4*Math.PI)*.045,.065,.115,.09,.13);fringe.rotation.z=(j-2)*-.12;}
  actor.userData.arms=arms;
 }
 actor.userData={...actor.userData,head,eyes,smile,frown,kind,radii};return actor;
}
export function setFamilyHappy(actor,happy){actor.userData.smile.visible=happy||actor.userData.kind==='mama';actor.userData.frown.visible=actor.userData.kind==='baby'&&!happy;if(actor.userData.kind==='baby'&&actor.userData.arms?.[1])actor.userData.arms[1].rotation.x=happy?-.8:0;}
export function createHouseLabel(text,width=2.1){
 const group=new THREE.Group();group.name='house-label';const canvas=document.createElement('canvas');canvas.width=Math.round(width/HOUSE_LABEL_STYLE.height*HOUSE_LABEL_STYLE.canvasHeight);canvas.height=HOUSE_LABEL_STYLE.canvasHeight;const ctx=canvas.getContext('2d');ctx.fillStyle=HOUSE_LABEL_STYLE.background;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=HOUSE_LABEL_STYLE.ink;ctx.textAlign='center';ctx.textBaseline='middle';let font=180;ctx.font=`700 ${font}px Arial, sans-serif`;while(ctx.measureText(text).width>canvas.width-100&&font>80){font-=2;ctx.font=`700 ${font}px Arial, sans-serif`;}ctx.fillText(text,canvas.width/2,canvas.height/2+4);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.generateMipmaps=true;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;
 const frame=new THREE.Mesh(new THREE.BoxGeometry(width+.09,HOUSE_LABEL_STYLE.height+.09,.07),new THREE.MeshStandardMaterial({color:HOUSE_LABEL_STYLE.frame,roughness:.9}));group.add(frame);
 const face=new THREE.Mesh(new THREE.PlaneGeometry(width,HOUSE_LABEL_STYLE.height),new THREE.MeshBasicMaterial({map:tex,depthTest:true,toneMapped:false}));face.position.z=.043;group.add(face);
 group.userData={text,fontPixels:font,baseWidth:width,texture:tex,face};return group;
}
export function faceHouseLabels(labels,camera,viewportHeight=600){if(!camera)return;const quaternion=camera.getWorldQuaternion(new THREE.Quaternion()),world=new THREE.Vector3(),height=Math.max(200,viewportHeight);for(const label of labels){label.quaternion.copy(quaternion);label.getWorldPosition(world);const distance=world.distanceTo(camera.position),unitsPerPixel=2*distance*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)/height;const scale=THREE.MathUtils.clamp(unitsPerPixel*46/HOUSE_LABEL_STYLE.height,.95,1.3);label.scale.setScalar(scale);label.userData.texture.anisotropy=4;}}
