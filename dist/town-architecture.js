import {SchoolTHREE as THREE,schoolMaterial} from './schoolbus/core.js?v=75a';

const INK=0x17375a, CREAM=0xffeabe, GOLD=0xffca50;
const PALETTE=[0xf15f64,0xffa94a,0xffd962,0x58bb87,0x46a6dc,0xa878da];
const DOME=new THREE.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2);
const RINGS=new Map();
const ROUND=new Map();
const MATERIALS=new Map();
const BALL=new THREE.SphereGeometry(1,24,16);
const GLASS=new THREE.MeshBasicMaterial({color:0x6dd5ec,transparent:true,opacity:.26,side:THREE.DoubleSide,depthWrite:false});
function solid(geo,color,x,y,z,group,sx=1,sy=1,sz=1){
  if(!MATERIALS.has(color))MATERIALS.set(color,schoolMaterial(color));
  const mesh=new THREE.Mesh(geo,MATERIALS.get(color));
  mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.receiveShadow=true;mesh.castShadow=true;
  group.add(mesh);return mesh;
}
function round(color,x,y,z,r,h,g,top=r){
  const key=top+':'+r+':'+h;
  if(!ROUND.has(key))ROUND.set(key,new THREE.CylinderGeometry(top,r,h,32));
  return solid(ROUND.get(key),color,x,y,z,g);
}
function ball(color,x,y,z,sx,sy,sz,g){
  return solid(BALL,color,x,y,z,g,sx,sy,sz);
}
function ring(color,x,y,z,r,thickness,g){
  const key=r+':'+thickness;
  if(!RINGS.has(key))RINGS.set(key,new THREE.TorusGeometry(r,thickness,8,64));
  return solid(RINGS.get(key),color,x,y,z,g);
}
function beam(color,start,end,r,g){
  const a=new THREE.Vector3(...start),b=new THREE.Vector3(...end);
  const length=a.distanceTo(b),m=a.clone().lerp(b,.5);
  const rod=round(color,m.x,m.y,m.z,r,1,g);
  rod.scale.y=length;
  rod.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());
  return rod;
}
export function signLines(text,maxLength=24){
  const lines=[];
  for(const word of text.trim().split(/\s+/)){
    if(lines.length&&(lines.at(-1)+' '+word).length<=maxLength)lines[lines.length-1]+=' '+word;
    else lines.push(word);
  }
  return lines;
}
function sign(text,x,y,z,w,g,box,{green=false,maxLength=24}={}){
  const lines=signLines(text,maxLength),h=Math.max(1.16,.55+lines.length*.66);
  box(green?GOLD:0xfbd889,x,y,z,w+.22,h+.19,.19,g);
  // The supplied renderer has no canvas context in geometry-only checks.
  if(typeof document==='undefined')return;
  const c=document.createElement('canvas');
  c.width=1536;c.height=Math.round(c.width*h/w);
  const ctx=c.getContext('2d');
  ctx.fillStyle=green?'#105236':'#183257';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.strokeStyle=green?'#f8d460':'#a8edff';ctx.lineWidth=7;
  ctx.strokeRect(12,12,c.width-24,c.height-24);
  ctx.fillStyle='#fff8dd';ctx.textAlign='center';ctx.textBaseline='middle';
  let size=Math.floor((c.height-32)/lines.length*.7);
  do {ctx.font='900 '+size+'px "Trebuchet MS", Arial, sans-serif';size--;}
  while(lines.some(line=>ctx.measureText(line).width>c.width-76)&&size>12);
  lines.forEach((line,i)=>ctx.fillText(line,c.width/2,(i+.5)*c.height/lines.length));
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  tex.generateMipmaps=true;tex.anisotropy=4;
  const plate=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,toneMapped:false,side:THREE.DoubleSide}));
  plate.position.set(x,y,z+.102);g.add(plate);
}
function windowPane(x,y,z,g,box,color=0x83d7ed){
  box(CREAM,x,y,z,1.58,1.94,.22,g);box(color,x,y,z+.15,1.28,1.58,.12,g);
  box(CREAM,x,y,z+.24,.11,1.6,.08,g);box(CREAM,x,y,z+.24,1.3,.1,.08,g);
  box(GOLD,x,y-.99,z+.12,1.82,.16,.48,g);
}
function canopy(x,y,z,g,box,colors,w=5.8){
  for(let i=0;i<10;i++){
    const panel=box(colors[i%colors.length],x+(i-4.5)*w/10,y,z,w/10+.015,.14,1.66,g);
    panel.rotation.x=.21;
    round(colors[i%colors.length],panel.position.x,y-.32,z+.8,w/21,.23,g);
  }
}
function dome(color,x,y,z,rx,ry,rz,g){
  return solid(DOME,color,x,y,z,g,rx,ry,rz);
}
function star(color,x,y,z,size,g){
  const shape=new THREE.Shape();
  for(let i=0;i<10;i++){
    const a=Math.PI/2+i*Math.PI/5,r=i%2?size*.43:size;
    const u=Math.cos(a)*r,v=Math.sin(a)*r;
    if(i===0)shape.moveTo(u,v);else shape.lineTo(u,v);
  }
  shape.closePath();
  const mesh=solid(new THREE.ShapeGeometry(shape),color,x,y,z,g);
  mesh.userData.privateGeometry=true;
  return mesh;
}
function facade(p,g,box){
  const {x,z,width:w,depth:d,style,color}=p,front=z+d/2;
  const height=p.id==='house'?7.65:style==='library'?7.8:style==='theatre'?6.65:6.2;
  const art=(label,y=5.5)=>sign(label,x,y,front+.36,w*.88,g,box);
  if(['rowhouse','library','barn'].includes(style)||p.id==='house'){
    const shape=new THREE.Shape();shape.moveTo(-w*.54,0);shape.lineTo(0,2.65);shape.lineTo(w*.54,0);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:d+.9,bevelEnabled:false});
    const roof=solid(geo,p.id==='house'?0xff69a0:PALETTE[(Math.abs(Math.round(x))%5)],x,height+1.12,z-d/2-.45,g);
    roof.name='Pitched colourful roof';roof.userData.privateGeometry=true;
    box(0xffd3a0,x+w*.28,height+2.7,z-d*.2,.8,2,.85,g);
  }

  box(0xf6dcac,x,.015,z,w+.8,.09,d+.6,g);
  if(['rotunda','dome','cafe','station'].includes(style)){
    const r=w*.49;
    for(const [y,h,radius,c] of [[height/2,height,r,color],[.5,.44,r+.16,CREAM],[height-.15,.34,r+.33,CREAM],[height+.24,.46,r+.5,color]]){
      const tier=round(c,x,y,z,radius,h,g);
      tier.scale.z=d/w;
    }
    dome(style==='cafe'?0x53aadf:color,x,height+.4,z,r+.53,style==='dome'?4.3:2.45,d*.55,g);
    box(color,x,2.23,front-.032,w*.76,4.49,1.03,g);
    if(style==='rotunda'||style==='dome'){
      const colors=style==='dome'?[0xffb047,0xfaaed3,0x8cd9ff]:[0xffeb7a,0x98f2df,0xffa78f];
      colors.forEach((c,i)=>star(c,x+(i-1)*2.05,height+1.02+(i===1?1.1:0),front-.25,.65+(i===1?.22:0),g));
    }
  }else if(style==='garden'||style==='stage'){
    box(color,x,2.3,z-1,w,4.6,d-2,g);
    box(CREAM,x,4.68,z-1,w+.55,.22,d-1.45,g);
    const count=style==='stage'?3:6;
    for(let i=0;i<count;i++){
      const sx=x+(i-(count-1)/2)*1.46;
      dome(PALETTE[i],sx,4.72,z-1,1.14,2.8-(i%2)*.5,2.65,g);
    }
    box(color,x,2.12,front-.15,w*.76,4.25,.67,g);
    for(const side of [-1,1]){
      box(GOLD,x+side*5.6,2.6,front,1.25,5.2,1.12,g);
      ball(PALETTE[side<0?0:4],x+side*5.6,5.44,front,.85,.55,.55,g);
    }
  }else{
    box(color,x,height/2,z,w,height,d,g);
    box(CREAM,x,height-.19,front+.11,w+.44,.34,.41,g);
    box(p.id==='house'?0xc84a60:INK,x,height+.28,z,w+.45,.51,d+.55,g);
    for(const side of [-1,1]){
      const tower=x+side*w*.35;
      box(color,tower,(height+1.1)/2,z,w*.29,height+1.1,d-.3,g);
      if(!['rowhouse','library','barn'].includes(style)&&p.id!=='house')dome(PALETTE[side<0?0:5],tower,height+1.06,z,w*.175,1.87,d*.49,g);
      for(const y of [1.82,height-1.17])windowPane(tower,y,front+.07,g,box);
      if(style==='theatre'){
        for(let i=0;i<5;i++)ball(GOLD,tower+(i-2)*.42,height+.85,front+.2,.115,.115,.095,g);
      }
    }
    if(style==='theatre'||style==='library'){
      box(0xf7bb63,x,height-.38,front+.14,w*.37,1.2,.38,g);
      star(CREAM,x,height-.39,front+.38,.5,g);
    }
  }
  // Layered base trim and individual pilasters give façades readable depth.
  box(0xffe5ba,x,.22,front+.16,w+.12,.4,.35,g);
  for(const side of [-1,1]){
    box(0xffe8bf,x+side*(w/2-.27),height*.45,front+.12,.31,height*.87,.3,g);
    box(0xe5ba84,x+side*(w/2-.27),.44,front+.24,.46,.16,.43,g);
  }
  for(const side of [-1,1])windowPane(x+side*w*.285,1.64,front+.185,g,box,style==='theatre'?0xf6a6cf:0x83d7ed);
  if(['rowhouse','library','barn'].includes(style)||p.id==='house')for(const side of [-1,1]){
    const bx=x+side*w*.285;
    box(0xffcf78,bx,.83,front+.52,1.85,.36,.53,g);
    for(let j=-2;j<=2;j++){
      round(0x55a964,bx+j*.29,1.12,front+.55,.03,.3,g);
      ball(PALETTE[(j+8)%6],bx+j*.29,1.3,front+.55,.16,.16,.12,g);
    }
  }
  // Entrances leave headroom for the tallest playable friend and wardrobe.
  box(CREAM,x,2.27,front+.28,3.8,4.54,.27,g);
  box(INK,x,2.2,front+.44,3.4,4.4,.13,g);
  box(style==='library'?0x9ae1b0:0x9de7f4,x,3.15,front+.52,2.85,1.4,.09,g);
  box(GOLD,x+1.25,1.85,front+.55,.11,.28,.1,g);
  if(['theatre','rowhouse','cafe','station'].includes(style))canopy(x,4.85,front+.64,g,box,[color,CREAM]);
  art(p.name);
  if(style==='garden'){
    for(const side of [-1,1]){
      const sx=x+side*4.6;
      round(0x489963,sx,2.45,front+.31,.1,2.55,g);
      for(let i=0;i<5;i++){
        const a=i*Math.PI*2/5;
        ball(p.id==='letters'?0xffad5f:0xad8ada,sx+Math.cos(a)*.57,3.71+Math.sin(a)*.57,front+.59,.38,.4,.17,g);
      }
      ball(GOLD,sx,3.71,front+.72,.31,.32,.17,g);
    }
  }else if(style==='barn'){
    for(const side of [-1,1]){
      const sx=x+side*4.2;
      box(0xb87351,sx,.24,front+.56,1.82,.43,.85,g);
      for(let i=-1;i<=1;i++){
        ball(0xf89646,sx+i*.44,.47,front+.6,.15,.21,.15,g);
        ball(0x67ac66,sx+i*.44,.69,front+.6,.11,.15,.095,g);
      }
    }
  }else if(style==='stage'){
    for(const side of [-1,1]){
      round(0xba7555,x+side*4.4,.75,front+.5,.72,1.49,g);
      round(CREAM,x+side*4.4,1.51,front+.5,.75,.12,g);
    }
  }
}
function fountain(x,z,r,g,water){
  round(0xf4d799,x,.22,z,r,.44,g);
  round(0x54c8e2,x,.451,z,r-.32,.055,g);
  round(0x3b8fbd,x,.545,z,.84,.19,g);
  round(0xf9e9aa,x,1.09,z,.38,1.08,g,.51);
  ball(0xffcf62,x,1.8,z,.56,.52,.56,g);
  for(let i=0;i<18;i++){
    const dot=ball(0xc4faff,x,1.75,z,.1,.19,.1,g);
    dot.userData.townAnimated=true;
    water.push({dot,x,y:1.68,z,radius:r*.79});
  }
}
function facility(p,g,world,box){
  const {x,z,doorZ,id}=p,front=z+p.depth/2;
  const addEffect=(duration,update)=>{update(0,Infinity,false);world.facilityEffects.set(id,{duration,update,started:-Infinity});};
  if(id==='carousel'){
    round(0xb74460,x,.24,z,5.6,.48,g).scale.z=.8;
    round(GOLD,x,.54,z,5.18,.22,g).scale.z=.8;
    dome(0xf47780,x,4.42,z,5.5,2.45,4.1,g);
    const ride=new THREE.Group();ride.position.set(x,.65,z);g.add(ride);
    round(0xffcf75,0,2,0,.43,4.1,ride);
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4,px=Math.cos(a)*3.75,pz=Math.sin(a)*3;
      round(CREAM,px,1.85,pz,.085,3.65,ride);
      ball(PALETTE[i%6],px,.88,pz,.6,.36,.39,ride);
      ball(CREAM,px+.35,1.18,pz,.28,.32,.28,ride);
    }
    addEffect(4,(u,elapsed,calm)=>{ride.rotation.y=calm?u*.45:u*Math.PI*2;});
  }else if(id==='wheel'){
    const wheel=new THREE.Group();wheel.position.set(x,6.9,z);g.add(wheel);
    const radius=5.45;
    ring(0x53bbe4,0,0,0,radius,.17,wheel);
    ring(0xffd66b,0,0,.12,radius-.35,.085,wheel);
    for(let i=0;i<10;i++){
      const a=i*Math.PI/5,px=Math.cos(a)*radius,py=Math.sin(a)*radius;
      beam(CREAM,[0,0,0],[px,py,0],.06,wheel);
      ball(PALETTE[i%6],px,py,.25,.52,.42,.5,wheel);
    }
    for(const side of [-1,1])beam(INK,[x+side*3.7,.21,z+.78],[x,7,z+.78],.22,g);
    round(GOLD,x,6.9,z+.35,.55,.9,g).rotation.x=Math.PI/2;
    addEffect(5,(u,elapsed,calm)=>{wheel.rotation.z=calm?u*.27:u*Math.PI*2;});
  }else if(id==='bubble'){
    const pool=new THREE.Group();pool.name='Complete ball pool';g.add(pool);
    round(0x3686bf,x,.3,z,5.4,.6,pool).scale.z=.78;
    round(0x7edcf4,x,.6,z,5.18,.09,pool).scale.z=.78;
    for(let i=0;i<252;i++){
      const a=i*2.39996,r=Math.sqrt((i+.5)/252)*4.78;
      ball([0xffd667,0x9adaff,0xd1acf1,0xff9fbf,0x7adcc6][i%5],
        x+Math.cos(a)*r,.77+(i%3)*.035,z+Math.sin(a)*r*.76,.235,.235,.235,pool);
    }
    const rim=ring(0xffe5a8,x,1.0,z,5.22,.16,pool);
    rim.rotation.x=Math.PI/2;rim.scale.y=.78;
    for(let i=0;i<20;i++){
      const a=i*Math.PI/10,px=x+Math.cos(a)*5.2,pz=z+Math.sin(a)*3.98;
      round(i%2?0x9acff1:0xf7b7d3,px,.8,pz,.115,1.03,pool);
    }
    // A supported, continuous slide ends inside the pool.
    const slideX=x+2.1;
    box(0x9d9bdf,slideX,1.08,z-2.7,1.65,2.16,1.21,pool);
    box(0xffd17b,slideX,2.23,z-2.7,1.97,.18,1.44,pool);
    const start=[slideX,2.3,z-2.13],end=[slideX,.91,z+1.06];
    const length=Math.hypot(start[1]-end[1],start[2]-end[2]),tilt=Math.atan2(start[1]-end[1],end[2]-start[2]);
    const chute=box(0x48bdca,slideX,(start[1]+end[1])/2,(start[2]+end[2])/2,1.43,.14,length,pool);
    chute.rotation.x=tilt;
    for(const side of [-1,1]){
      const lip=box(0xffd78b,slideX+side*.75,(start[1]+end[1])/2+.19,(start[2]+end[2])/2,.14,.36,length,pool);
      lip.rotation.x=tilt;
    }
    for(let i=0;i<6;i++)box(0xb3dce9,slideX, .53+i*.29,z-4.3+i*.24,1.16,.16,.29,pool);
    const bubbles=Array.from({length:19},(_,i)=>{
      const bead=ball(0xd5faff,x,0,z,.11+i%4*.055,.11+i%4*.055,.11+i%4*.055,g);
      bead.userData.townAnimated=true;return bead;
    });
    addEffect(4,(u,e,calm)=>bubbles.forEach((o,i)=>{
      o.visible=calm?u===1:u>0&&u<1;
      o.position.set(x+Math.cos(i*2.4)*4,1.1+(u+i*.091)%1*6,z+Math.sin(i*2.4)*2.8);
    }));
  }else{
    facade(p,g,box);
    if(id==='star'){
      const stars=Array.from({length:12},(_,i)=>star(PALETTE[i%6],x+(i%6-2.5)*1.7,4.75+Math.floor(i/6)*1.28,front+.7,.35,g));
      addEffect(4,(u,e,calm)=>stars.forEach((o,i)=>{o.visible=calm?u===1:u>0&&u<1;o.rotation.z=u*6+i;}));
    }else if(id==='cafe'){
      const bell=round(GOLD,x,4.78,front+.74,.49,.46,g,.32);
      ball(0xec9a4a,x+2.2,5.36,front+.64,.78,.76,.21,g);
      for(let i=0;i<6;i++)ball(0x78453a,x+2.2+Math.cos(i*2.4)*.46,5.36+Math.sin(i*2.4)*.45,front+.842,.069,.075,.055,g);
      addEffect(2.3,(u,e,calm)=>{bell.rotation.z=calm?u*.3:Math.sin(u*23)*Math.sin(u*Math.PI)*.38;});
    }else if(id==='library'){
      const cover=box(0xef7866,x,2.14,front+.91,1.72,1.4,.17,g);
      const pages=box(0xfff4d3,x,2.14,front+.8,1.53,1.28,.23,g);
      addEffect(3,(u,e,calm)=>{
        const amount=calm?u:Math.sin(Math.PI*u);
        cover.rotation.y=amount*1.18;
        cover.position.x=x-amount*.62;
        pages.rotation.z=amount*.13;
      });
    }else if(id==='train'){
      const train=new THREE.Group();train.position.set(x,.08,front+.83);g.add(train);
      for(let i=0;i<3;i++){
        const dx=(i-1)*1.27;
        box(PALETTE[i*2],dx,.54,0,1.05,.57,.62,train);
        box(CREAM,dx,.88,0,.82,.09,.66,train);
        for(const side of [-1,1])round(INK,dx+side*.26,.25,.33,.14,.12,train).rotation.x=Math.PI/2;
      }
      addEffect(4,(u,e,calm)=>{train.position.x=x+(calm?u:Math.sin(Math.PI*u))*3.1;});
    }
    return;
  }
  sign(p.name,x,2.18,doorZ-.1,8.4,g,box);
  for(const side of [-1,1]){
    round(CREAM,x+side*3.75,.92,doorZ-.16,.19,1.84,g);
    ball(GOLD,x+side*3.75,1.86,doorZ-.16,.23,.23,.23,g);
  }
}
function arch(x,z,g,box){
  const colors=[0xf46073,0xffa947,0xffd75c,0x66c18e,0x56bce5,0xb487e4];
  for(let j=0;j<colors.length;j++){
    const r=5.25+j*.29,length=28;
    for(let i=0;i<length;i++){
      const a=Math.PI*i/length,b=Math.PI*(i+1)/length;
      beam(colors[j],[x+r*Math.cos(a),3.7+r*Math.sin(a),z],[x+r*Math.cos(b),3.7+r*Math.sin(b),z],.21,g);
    }
  }
  for(const side of [-1,1]){
    const px=x+side*5.94;
    round(0x39a8ae,px,1.83,z,.53,3.66,g);
    round(CREAM,px,.24,z,.7,.48,g);
    for(let i=0;i<4;i++)ball(0xf4faff,px+(i-1.5)*.59,3.69+(i%2)*.22,z,.58,.52,.55,g);
  }
  sign('Sesame Street Town',x,6.43,z+.68,9.8,g,box,{green:true});
}
function arcade(x,g,box){
  const north=-17,south=-5;
  for(let z=north;z<=south;z+=3) {
    for(const side of [-1,1]){
      const px=x+side*2.5;
      round(0xfef5de,px,2.8,z,.16,5.6,g);
      round(0x518e96,px,.28,z,.33,.53,g);
      beam(0xfaf4df,[px,4.3,z],[x+side*1.7,5.9,z],.09,g);
    }
    for(let i=0;i<10;i++){
      const a=i*Math.PI/10,b=(i+1)*Math.PI/10;
      beam(0xe9f7f7,[x+Math.cos(a)*2.5,5.46+Math.sin(a)*1.16,z],
        [x+Math.cos(b)*2.5,5.46+Math.sin(b)*1.16,z],.08,g);
    }
  }
  for(let i=-2;i<=2;i++){
    const plate=new THREE.Mesh(new THREE.PlaneGeometry(1.05,south-north),GLASS);
    plate.rotation.set(-Math.PI/2,0,-i*.13);
    plate.position.set(x+i*.94,6.55-Math.abs(i)*.16,(north+south)/2);plate.userData.privateGeometry=true;g.add(plate);
  }
  sign('Rainbow Arcade',x,4.9,south+.14,4.8,g,box);
}
function tree(x,z,g){
  round(0xab7452,x,1.49,z,.29,2.94,g,.18);
  const kind=Math.abs(Math.round(x+z))%3;
  if(kind===0){
    for(let j=0;j<3;j++)round(j%2?0x38b76b:0x53c57a,x,2.2+j*.86,z,1.55-j*.28,2.3,g,0);
  }else{
    for(let j=0;j<3;j++)ball(kind===1?0xffabd1:(j===1?0x9cdb70:0x71c87b),x+(j-1)*.86,3.5+(j%2)*.62,z,1.43,1.79,1.31,g);
  }
}
function lamp(x,z,g){
  round(0x197f83,x,1.59,z,.1,3.17,g);
  round(0x235558,x,.23,z,.29,.44,g);
  round(GOLD,x,2.92,z,.2,.15,g);
  ball(0xffe8a3,x,3.4,z,.31,.38,.31,g);
}

export function buildTownscape(world,places,g,{spine:main,loop}){
  const box=world.cube,{top,bottom}=world.bounds;
  const left=world.bounds.left,right=world.bounds.right,depth=bottom-top;
  const lanes=[...new Set(places.map(p=>p.lane))].sort((a,b)=>a-b);
  const mid=(top+bottom)/2;
  const road=(color,x,z,w,d,raised=false)=>box(color,x,raised?.026:.012,z,w,.075,d,g);
  box(0x83bc69,0,-.21,mid,320,.4,depth+180,g);
  // Actual street surfaces: continuous roads, raised sidewalks and marked junctions.
  const first=lanes[0],last=lanes.at(-1);
  const streets=new THREE.Group();streets.name='Town streets and crossings';g.add(streets);
  const slab=(c,x,y,z,w,h,d)=>box(c,x,y,z,w,h,d,streets);
  for(const x of [main,...loop]){
    slab(0xffefc3,x,.035,(first+last)/2,11.2,.12,last-first+12);
    slab(0x778ca9,x,.11,(first+last)/2,7.4,.07,last-first+12);
  }
  for(const z of lanes){
    slab(0xffefc3,0,.035,z,116,.12,11.2);
    slab(0x778ca9,0,.115,z,116,.07,7.4);
  }
  const junction=(x,z)=>[main,...loop].some(v=>Math.abs(x-v)<6)&&lanes.some(v=>Math.abs(z-v)<6);
  for(const x of [main,...loop])for(let z=first-3;z<last+4;z+=3.5)
    if(!junction(x,z))slab(0xfffbed,x,.158,z,.13,.018,1.65);
  for(const z of lanes)for(let x=-55;x<56;x+=3.5)
    if(!junction(x,z))slab(0xfffbed,x,.163,z,1.65,.018,.13);
  for(const z of lanes)for(const x of [main,...loop]){
    for(const side of [-1,1])for(let i=-3;i<=3;i++){
      slab(0xfffdf1,x+i*.88,.169,z+side*4.6,.53,.018,1.7);
      slab(0xfffdf1,x+side*4.6,.17,z+i*.88,1.7,.018,.53);
    }
    for(const side of [-1,1]){
      const px=x+side*4.35,pz=z+side*6.1;
      round(INK,px,1.4,pz,.075,2.8,streets);
      slab(INK,px,2.85,pz,.46,.94,.36);
      ball(0xff7678,px,3.07,pz+.2,.13,.13,.065,streets);
      ball(0x72efb0,px,2.64,pz+.2,.13,.13,.065,streets);
    }
  }
  // Sidewalk joints follow the street without adding obstacles to walking routes.
  for(const z of lanes)for(let x=-56;x<=56;x+=1.4)for(const side of [-1,1])
    slab(0xe2d8ad,x,.101,z+side*4.8,.025,.012,1.35);
  const backdrop=new THREE.Group();backdrop.name='Colourful distant neighbourhood';g.add(backdrop);
  for(let i=0;i<17;i++){
    const x=-69+i*8.5,z=top-19-(i%3)*5,h=9+(i%4)*3;
    box([0x90cabc,0xffd773,0x9bbee2,0xefb5ca][i%4],x,h/2,z,7.2,h,7,backdrop);
    box(0xfef3d4,x,h+.15,z,7.6,.3,7.4,backdrop);
    for(let y=2;y<h-1;y+=2.2)for(let j=-2;j<=2;j++)
      box(0x52899e,x+j*1.12,y,z+3.52,.65,1.12,.06,backdrop);
  }
  for(let i=0;i<9;i++)ball(i%2?0x9cdb9c:0xb5e7ae,-108+i*27,0,top-48,30,19+(i%3)*7,18,backdrop);
  world.batchStreet(streets);world.batchStreet(backdrop);
  for(const p of places){
    const front=p.z+p.depth/2,ease=.07;
    world.blocks.push([p.x-p.width/2-ease,p.x+p.width/2+ease,p.z-p.depth/2-ease,front+ease]);
    road(0xffecc3,p.x,(front+p.lane)/2,p.id==='house'?5.1:3.7,p.lane-front);
    for(let z=front+.6;z<p.lane-1;z+=.75){
      for(const side of [-1,1])box(0xe8bf8e,p.x+side*1.33,.062,z,.64,.026,.59,g);
    }
    if(p.action)facility(p,g,world,box);else facade(p,g,box);
  }
  const waterX=-3.8,waterZ=10.9,r=4.1;
  box(0xffdea3,0,.06,11,18,.065,11,g);
  fountain(waterX,waterZ,r,g,world.water);
  world.blocks.push([waterX-r,waterX+r,waterZ-r,waterZ+r]);
  arch(main,19,g,box);
  // Keep the main street vista open; the rainbow entrance frames the plaza.
  for(const [x,z,label] of [[-5,17,'Welcome Plaza'],[-4,-.2,'Main Street'],[-3,-22,'Wonder Park'],[-3,-45,'Adventure Gardens']]){
    round(0x237877,x,1.22,z,.085,2.44,g);
    sign(label,x,2.42,z,5.3,g,box,{green:true});
  }
  for(let z=top+3;z<bottom;z+=5.7)for(const x of [-54,54])tree(x,z,g);
  for(const z of lanes)for(const x of [-46,-29,-13,1,23,39,49])lamp(x,z+3.25,g);
  for(const [x,z] of [[-9,7],[-9,15],[2,10],[-18,25],[24,26],[-34,-21],[27,-25]]){
    box(0x417fa4,x,.54,z,2.7,.18,.7,g);
    box(0x63b6c1,x,.96,z-.27,2.74,.38,.13,g);
    for(const side of [-1,1])box(INK,x+side*.91,.26,z,.14,.53,.49,g);
  }
  for(let i=0;i<24;i++){
    const x=-46+(i%12)*8.2,z=i<12?31:4.7;
    if(Math.abs(x-main)<3||Math.abs(x)<5.7&&i<12)continue;
    for(let j=0;j<3;j++)ball(PALETTE[(i+j)%6],x+j*.28,.15,z,.15,.17,.15,g);
  }
  for(const [i,[x,z,y]] of [[-41,12,15],[-17,2,18],[24,-16,17],[43,-43,17],[-17,-53,19],[26,35,19]].entries()){
    const cloud=new THREE.Group();cloud.position.set(x,y,z);cloud.userData.baseY=y;
    for(let j=-2;j<=2;j++)ball(0xfffcf0,j*1.3,(1-Math.abs(j)/3)*.68,0,1.92,1.02,1.01,cloud);
    g.add(cloud);world.kites.push(cloud);
    if(i%2===0)ball(PALETTE[i%6],x+4,y-1.85,z,1.03,1.28,1.04,g);
  }
  for(const z of lanes){
    for(const x of [-47,47]){
      round(0x83b69d,x,.19,z-3.8,1.04,.38,g);
      for(let i=0;i<7;i++){
        const a=i*2.4;
        round(0x6aa45f,x+Math.cos(a)*.64,.53,z-3.8+Math.sin(a)*.47,.022,.5,g);
        ball(PALETTE[i%6],x+Math.cos(a)*.64,.83,z-3.8+Math.sin(a)*.47,.17,.14,.17,g);
      }
    }
  }
  for(const p of places.filter(p=>p.id==='house')){
    for(const side of [-1,1]){
      const px=p.x+side*3.5,pz=p.doorZ+.35;
      box(0xffd77d,px,.14,pz,.8,.28,.8,g);
      round(0x4daea9,px,1.18,pz,.08,2.12,g);
      ball(0xffdf8c,px,2.31,pz,.27,.3,.27,g);
    }
  }
  world.batchStreet(g);
}

export {facade as buildTownFacade,facility as buildTownFacility,sign as townSign};
