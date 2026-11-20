import {detailTexture} from './graphics.js?v=49';
import {HOME_ITEM,slotById} from './home-goods.js?v=44';
import {homeModel} from './home-models.js?v=44';
import * as THREE from './assets/three.module.js';

const SHELL={left:-19.65,right:19.65,back:-13.42,front:14.88,ceiling:10.75};
const EDGE={left:-19.31,right:19.31,back:-13.12,front:14.49};
const NOTES={x:18.09,z:3.1,yaw:-Math.PI/2};
const WARDROBE={x:-18.36,z:1.13,width:4.55,depth:2.06,yaw:Math.PI/2};
const LIBRARY={x:.2,z:-11.55,yaw:0};
const TOYS={x:-18.29,z:7.14,yaw:Math.PI/2};
const BED={x:15.45,z:-10.56};
const CABINET_X=9.8;
const PEN={left:-7.3,right:7.3,back:-3.8,front:7.4,gap:1.52};
const fenceMargin=.29;
export const ROOM = {
  start:[0,8.6], door:[0,13.95], corner:[-12.3,-9.2], bed:[BED.x,BED.z+2.7],
  sleepStart:[BED.x,.2], mat:[0,(PEN.back+PEN.front)/2],
};
export const HOUSE_STATIONS = [
  {id:'exit',name:'Main Door',action:'Open the main door',point:ROOM.door},
  {id:'activities',name:'Activity Corner',action:'Choose a story',point:ROOM.corner},
  {id:'computer',name:'Parent Notes',action:'Read parents’ notes',point:[NOTES.x-2.48,NOTES.z]},
  {id:'wardrobe',name:'Wardrobe',action:'Change accessories',point:[WARDROBE.x+2.57,WARDROBE.z]},
  {id:'bookshelf',name:'Word Library',action:'Read saved words',point:[LIBRARY.x,LIBRARY.z+2.48]},
  {id:'cabinet',name:'Figure Cabinet',action:'Change character',point:[CABINET_X,-9.12]},
  {id:'toy-cupboard',name:'Toy Cupboard',action:'See your toys',point:[TOYS.x+2.55,TOYS.z]},
  {id:'store-room',name:'Store Room',action:'Arrange the house',point:[17.1,11.48]},
];
const PALE=0xfff8e9, INK=0x244963, WOOD=0xffcf85;
export const PLAY_MAT_COLOR=0xeae5d9;
export const HOUSE_DOOR={width:2.05,height:2.68,z:SHELL.front};
const HOUSE_BLOCKS=[
  [-15.45,-9.14,-12.55,-10.38], [CABINET_X-3.19,CABINET_X+3.19,-13.13,-11.23],
  [LIBRARY.x-4.03,LIBRARY.x+4.03,-12.67,-10.39],
  [-19.46,-17.18,TOYS.z-2.86,TOYS.z+2.86],
  [15.05,19.48,8.44,8.79], [15.05,15.43,8.44,10.04],
  [15.05,15.43,12.84,14.96], [15.44,18.89,13.62,14.87],
  [NOTES.x-1.41,NOTES.x+1.41,NOTES.z-2.05,NOTES.z+2.05],
  [NOTES.x-2.87,NOTES.x-1.63,NOTES.z+.36,NOTES.z+1.63],
  [WARDROBE.x-WARDROBE.depth*.55,WARDROBE.x+WARDROBE.depth*.64,
    WARDROBE.z-WARDROBE.width*.54,WARDROBE.z+WARDROBE.width*.54],
  [BED.x-1.91,BED.x+1.91,BED.z-2.11,BED.z+2.23], [17.63,19.04,-12.81,-11.19],
  [-6.65,-4.36,-3.1,-1.5], [-1.47,.62,-3.05,-1.65], [3.72,5.94,-3.05,-.74],
  [PEN.left-fenceMargin,PEN.left+fenceMargin,PEN.back,PEN.front],
  [PEN.right-fenceMargin,PEN.right+fenceMargin,PEN.back,PEN.front],
  [PEN.left,PEN.right,PEN.back-fenceMargin,PEN.back+fenceMargin],
  [PEN.left,-PEN.gap,PEN.front-fenceMargin,PEN.front+fenceMargin],
  [PEN.gap,PEN.right,PEN.front-fenceMargin,PEN.front+fenceMargin],
];

export const HOUSE_CAMERA_ZOOM=.5;
export function clampHouseCamera(position){
  position.x=THREE.MathUtils.clamp(position.x,SHELL.left+.4,SHELL.right-.4);
  position.y=THREE.MathUtils.clamp(position.y,1.25,SHELL.ceiling-.48);
  position.z=THREE.MathUtils.clamp(position.z,SHELL.back+.41,SHELL.front-.41);
  return position;
}

export function canWalkInHouse(x,z,placed=[]){
  return x>EDGE.left&&x<EDGE.right&&z>EDGE.back&&z<EDGE.front
    && ![...HOUSE_BLOCKS,...placed].some(([left,right,back,front])=>x>left&&x<right&&z>back&&z<front);
}

// Route the short house-to-town cinematic around the toys and through a gate.
export function houseRoute(start,end,placed=[]){
  const blocks=[...HOUSE_BLOCKS,...placed];
  const points=[start,end,...blocks.flatMap(([left,right,back,front])=>[
    [left-.2,back-.2],[left-.2,front+.2],[right+.2,back-.2],[right+.2,front+.2]
  ]).filter(([x,z])=>canWalkInHouse(x,z,placed))];
  const length=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const clear=(a,b)=>!blocks.some(([left,right,back,front])=>{
    let enter=0,leave=1;
    for(const [axis,low,high] of [[0,left,right],[1,back,front]]){
      const delta=b[axis]-a[axis];
      if(Math.abs(delta)<1e-9){
        if(a[axis]<=low||a[axis]>=high)return false;
        continue;
      }
      const first=(low-a[axis])/delta,last=(high-a[axis])/delta;
      enter=Math.max(enter,Math.min(first,last));
      leave=Math.min(leave,Math.max(first,last));
      if(enter>=leave)return false;
    }
    return true;
  });
  const costs=points.map(()=>Infinity),previous=points.map(()=>-1),remaining=new Set(points.keys());
  costs[0]=0;
  while(remaining.size){
    const current=[...remaining].reduce((best,i)=>costs[i]<costs[best]?i:best);
    if(!Number.isFinite(costs[current]))break;
    if(current===1){
      const path=[];
      for(let at=1;at>=0;at=previous[at])path.unshift(points[at]);
      return path;
    }
    remaining.delete(current);
    for(const next of remaining){
      const candidate=costs[current]+length(points[current],points[next]);
      if(candidate<costs[next]&&clear(points[current],points[next])){
        costs[next]=candidate;
        previous[next]=current;
      }
    }
  }
  return null;
}

export const SHELF_CAPACITY=24;
export const shelfPageCount=words=>Math.max(1,Math.ceil(words.length/SHELF_CAPACITY));
export const shelfPageWords=(words,page)=>words.slice(page*SHELF_CAPACITY,(page+1)*SHELF_CAPACITY);
export const HOUSE_COLLECTION=[
  'Elmo','Cookie Monster','Grover','Rosita','Zoe','Bert','Ernie','Julia','Oscar',
  'Snuffleupagus','Tamir','Ji-Young','Baby Bear','Abby Cadabby',
];
export function pickCabinetFigures(previous=[],random=Math.random){
  const names=[...HOUSE_COLLECTION];
  for(let i=names.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1));
    [names[i],names[j]]=[names[j],names[i]];
  }
  if(names.slice(0,8).every(name=>previous.includes(name))) [names[7],names[8]]=[names[8],names[7]];
  const silhouettes=['figure','standee','medallion','figure','standee','figure','medallion','figure'];
  return names.slice(0,8).map((name,i)=>({
    name,kind:silhouettes[i],size:[.46,.67,.53,.59,.54,.49,.61,.43][i]+random()*.06,
  }));
}

function canvasPanel(g,{x,y,z,w,h,paint,pixels=768}){
  if(typeof document==='undefined')return null;
  const canvas=document.createElement('canvas');
  canvas.width=pixels;canvas.height=Math.round(canvas.width*h/w);
  const ctx=canvas.getContext('2d');
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,toneMapped:false,alphaTest:.15}));
  panel.position.set(x,y,z);g.add(panel);
  const redraw=()=>{paint(ctx,canvas.width,canvas.height);texture.needsUpdate=true;};
  redraw();
  return {redraw,canvas,ctx,texture};
}
function textLine(ctx,text,x,y,maxWidth,size,color,align='center'){
  ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;
  do {ctx.font='900 '+size+'px "Trebuchet MS", Arial, sans-serif';size--;}
  while(ctx.measureText(text).width>maxWidth&&size>12);
  ctx.fillText(text,x,y);
}

export const POSTER_BANK=Array.from({length:10},(_,i)=>'assets/house-posters/poster-'+String(i+1).padStart(2,'0')+'.webp');
export function pickHousePosters(previous=[],random=Math.random,count=6){
  const bank=[...POSTER_BANK];
  for(let i=bank.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[bank[i],bank[j]]=[bank[j],bank[i]];}
  const picked=bank.slice(0,count);
  if(picked.every((asset,i)=>asset===previous[i]))[picked[0],picked[1]]=[picked[1],picked[0]];
  return picked;
}
const posterImages=new Map();
function loadPoster(path){
  if(!posterImages.has(path)){
    const promise=new Promise((resolve,reject)=>{
      const image=new Image();
      image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Poster could not be loaded'));image.src=path;
    });
    posterImages.set(path,promise);
    promise.catch(()=>posterImages.delete(path));
  }
  return posterImages.get(path);
}
function posterFrame({house,box,orb},x,y,z,color,mat){
  box(color,x,y,z,5.56,3.45,.23,house);
  for(const dx of [-2.55,2.55])for(const dy of [-1.49,1.49])
    orb(0xffd15a,x+dx,y+dy,z+.15,.17,.17,.09,house);
  let image;
  const panel=canvasPanel(house,{x,y,z:z+.126,w:5.13,h:3.06,pixels:1024,paint(ctx,w,h){
    ctx.fillStyle=mat;ctx.fillRect(0,0,w,h);
    if(!image)return;
    const width=image.naturalWidth,height=image.naturalHeight;
    const scale=Math.min(w*.94/width,h*.93/height);
    ctx.drawImage(image,(w-width*scale)/2,(h-height*scale)/2,width*scale,height*scale);
  }});
  return poster=>{image=poster;panel?.redraw();};
}
function posterWall(kit){
  const frames=[
    posterFrame(kit,-12.25,5.56,-13.19,0xf3798d,'#fff2ba'),
    posterFrame(kit,12.87,7.63,-13.19,0x64bada,'#d1f2f0'),
    posterFrame(kit,-3.85,7.65,-13.19,0xffc34f,'#fff5d9'),
    posterFrame(kit,3.85,7.65,-13.19,0xa994ec,'#f4eaff'),
    ...[-1,1].map(side=>{
      const wall=new THREE.Group();wall.name='Side wall poster';wall.position.set(side*19.43,7.25,2.8);wall.rotation.y=-side*Math.PI/2;kit.house.add(wall);
      return posterFrame({...kit,house:wall},0,0,0,side<0?0x73c9b1:0xfba776,'#fff2d7');
    }),
  ];
  let previous=[],revision=0;
  return async()=>{
    const next=pickHousePosters(previous);
    const current=++revision;
    previous=next;
    if(typeof Image==='undefined')return;
    const pictures=await Promise.all(next.map(path=>loadPoster(path).catch(()=>null)));
    if(current===revision)pictures.forEach((picture,i)=>{if(picture)frames[i](picture);});
  };
}

function playArea({house:g,box,cyl,orb}){
  const w=PEN.right-PEN.left,d=PEN.front-PEN.back;
  box(PLAY_MAT_COLOR,(PEN.left+PEN.right)/2,.052,(PEN.back+PEN.front)/2,w-.08,.13,d-.08,g);
  const rail=0xfff8ed;
  function panel(x1,z1,x2,z2){
    const span=Math.hypot(x2-x1,z2-z1),alongZ=x1===x2;
    const n=Math.ceil(span/.59);
    for(let i=0;i<=n;i++){
      const f=i/n;
      box(rail,x1+(x2-x1)*f,.58,z1+(z2-z1)*f,.14,1.02,.14,g);
    }
    for(const y of [.19,1.08])box(rail,(x1+x2)/2,y,(z1+z2)/2,alongZ?.18:span,.14,alongZ?span:.18,g);
  }
  for(const x of [PEN.left,PEN.right])panel(x,PEN.back,x,PEN.front);
  panel(PEN.left,PEN.back,PEN.right,PEN.back);
  for(const z of [PEN.front]){
    panel(PEN.left,z,-PEN.gap,z);
    panel(PEN.gap,z,PEN.right,z);
    for(const x of [-PEN.gap,PEN.gap]){
      box(rail,x,.59,z,.24,1.18,.26,g);
      orb(0xf7c961,x,1.23,z,.16,.13,.16,g);
    }
  }
  // A hinged leaf folded open beside the wide front entrance.
  for(const y of [.2,1.02])box(0x9ad0c8,PEN.gap+.98,y,PEN.front-.13,1.95,.14,.13,g);
  for(let i=0;i<5;i++)box(0x9ad0c8,PEN.gap+.19+i*.4,.6,PEN.front-.13,.1,.82,.13,g);
  const toyX=-5.47,toyZ=-2.36;
  box(0xefa07d,toyX,.55,toyZ,1.94,1.02,1.15,g);
  box(PALE,toyX,1.1,toyZ,2.03,.16,1.25,g);
  box(0x82b9b1,toyX,1.62,toyZ-.47,2.03,1.08,.16,g);
  for(const dx of [-.46,.22])cyl(0x4d6270,toyX+dx,1.21,toyZ+.1,.21,.035,g);
  for(const x of [-5.88,-5.39,-4.93])box(0xffedbe,x,.57,toyZ+.594,.39,.55,.08,g);
  const busX=4.83,busZ=-2.05;
  cyl(0xffd58a,busX,.24,busZ,1.07,.36,g);
  box(0x5ab0cf,busX,.55,busZ,1.02,.21,.63,g);
  box(0xf5bd57,busX-.1,.74,busZ,.64,.23,.62,g);
  for(const dx of [-.32,.32])for(const dz of [-.32,.32])
    cyl(INK,busX+dx,.46,busZ+dz,.16,.13,g).rotation.x=Math.PI/2;
  box(0xb187c8,-.44,.52,-2.46,1.85,1,.73,g);
  for(let i=0;i<8;i++)box(PALE,-1.22+i*.21,.98,-2.13,.185,.1,.46,g);
  for(const i of [0,1,3,4,5])box(INK,-1.12+i*.21,1.05,-2.22,.108,.08,.27,g);

}

function activityCorner({house:g,box,cyl,orb,board}){
  const x=ROOM.corner[0],z=-11.46;
  box(0xdf9c76,x,.69,z,5.85,1.35,1.48,g);
  box(0xffd39f,x,1.42,z,6.05,.19,1.6,g);
  for(let i=0;i<5;i++)box([0xea655f,0xffc345,0x69c997,0x63bad7,0xa984d9][i],x-1.76+i*.62,1.82,z,.4,.73,.34,g);
  for(const offset of [-2.56,2.56])box(PALE,x+offset,2.65,z-.54,.115,2.44,.19,g);
  for(let i=0;i<10;i++){
    const s=x-2.48+i*.55;
    box(i%2?0xffdf95:0xfff6da,s,3.49,z-.15,.55,.1,1.48,g).rotation.x=.28;
    cyl(i%2?0xffdf95:0xfff6da,s,3.2,z+.53,.275,.19,g);
  }
  board('Activity Corner',x,2.6,z+.26,4.69,g);
  orb(0xf5a558,x+1.72,1.76,z,.36,.23,.29,g);
}

function displayCabinet({house,box,cyl,orb,board,figure,portrait}){
  const g=new THREE.Group();g.name='Sesame Street figure cabinet';house.add(g);
  const x=CABINET_X,z=-12.29,w=6.05;
  box(0x88db9c,x,2.67,z-.83,w,5.33,.2,g);
  box(0xf2a9bf,x,.31,z,w,.57,1.59,g);
  box(0xffd679,x,5.17,z,w,.34,1.65,g);
  for(const side of [-1,1]){
    box(0x82c9c1,x+side*w/2,2.67,z,.19,5.34,1.65,g);
    box(PALE,x+side*w/2,2.70,z+.84,.09,4.53,.08,g);
    for(let j=0;j<4;j++)orb(0xffdb7d,x+side*(w/2-.11),.8+j*1.16,z+.905,.09,.09,.045,g);
  }
  for(const y of [.68,2.81])box(0xffedb6,x,y,z,w,.14,1.6,g);
  const glazing=new THREE.Mesh(new THREE.PlaneGeometry(w-.17,4.43),
    new THREE.MeshBasicMaterial({color:0xccf9fa,transparent:true,opacity:.075,depthWrite:false,side:THREE.DoubleSide}));
  glazing.position.set(x,2.83,z+.86);g.add(glazing);
  board('Figure Cabinet',x,5.63,z+.837,4.55,g);
  const display=new THREE.Group();display.name='cabinet collectibles';g.add(display);
  const models=new Map(),pedestals=[];
  const colors=[0xf4a5b3,0x92c9e6,0xf7c969,0xb4a2d6];
  for(let i=0;i<8;i++){
    const px=x+(i%4-1.5)*1.43,py=(i<4?.78:2.91);
    const plinth=i%2?box(colors[i%4],px,py,z+.08,.91,.19,.86,g)
      :cyl(colors[i%4],px,py,z+.08,.49,.19,g);
    plinth.name='collectible display base';
    const tag=canvasPanel(g,{x:px,y:py-.12,z:z+.886,w:1.26,h:.27,pixels:384,paint(ctx,cw,ch){
      ctx.fillStyle='#fff1ca';ctx.fillRect(0,0,cw,ch);
      textLine(ctx,pedestals[i]?.name??'',cw/2,ch*.53,cw*.91,Math.floor(ch*.58),'#305965');
    }});
    pedestals.push({x:px,y:py+.105,tag,name:''});
  }
  let previous=[],revision=0;
  return ()=>{
    const entries=pickCabinetFigures(previous),current=++revision;
    previous=entries.map(entry=>entry.name);
    for(const obj of [...display.children]){
      if(obj.userData.cabinetArt){obj.geometry.dispose();obj.material.dispose();}
      obj.removeFromParent();
    }
    entries.forEach((entry,i)=>{
      const {name,kind,size}=entry,pedestal=pedestals[i];
      pedestal.name=name;pedestal.tag?.redraw();
      if(kind==='figure'||!portrait){
        if(!models.has(name)&&figure)models.set(name,figure(name));
        const model=models.get(name);
        if(!model)return;
        model.scale.setScalar(name==='Snuffleupagus'?size*.66:size);
        model.position.set(pedestal.x,pedestal.y,z-.09);
        model.rotation.y=(i%4-1.5)*-.13;
        model.userData.collectibleKind=kind;display.add(model);
        return;
      }
      portrait(name).then(art=>{
        if(current!==revision)return;
        const height=kind==='medallion'?size*1.57:size*2.42;
        const width=Math.min(1.14,height*art.aspect);
        if(kind==='medallion'){
          const disk=new THREE.Mesh(new THREE.CircleGeometry(height*.57,32),
            new THREE.MeshBasicMaterial({color:colors[i%4],side:THREE.DoubleSide}));
          disk.position.set(pedestal.x,pedestal.y+height*.54,z+.16);
          disk.userData.cabinetArt=true;display.add(disk);
        }
        const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),
          new THREE.MeshBasicMaterial({map:art.texture,alphaTest:.25,toneMapped:false,side:THREE.DoubleSide}));
        mesh.position.set(pedestal.x,pedestal.y+height/2,z+.17);
        mesh.rotation.y=kind==='medallion'?-.14:.08;
        mesh.userData.cabinetArt=true;mesh.userData.collectibleKind=kind;display.add(mesh);
      }).catch(()=>{});
    });
    return entries;
  };
}

function stationGroup(house,location,name){
  const group=new THREE.Group();group.position.set(location.x,0,location.z);
  group.rotation.y=location.yaw;group.name=name;house.add(group);return group;
}
function computerDesk({house,box,orb,board}){
  const g=stationGroup(house,NOTES,'notes desk'),x=0,z=0;
  box(0xffca71,x,1.48,z,3.91,.25,2.65,g);
  for(const dx of [-1.72,1.72])box(0x95cce1,x+dx,.74,z,.43,1.45,2.03,g);
  for(let i=0;i<2;i++){
    box(0xbee0df,x+1.72,.5+i*.54,z+1.05,.45,.42,.08,g);
    orb(0xf5d59e,x+1.72,.5+i*.54,z+1.11,.09,.055,.07,g);
  }
  box(INK,x,2.81,z-.55,3.45,2.04,.19,g);
  box(0x94d9f3,x,2.81,z-.43,3.18,1.78,.075,g);
  box(INK,x,1.82,z-.53,.25,.55,.22,g);
  box(PALE,x,1.63,z-.55,1.35,.11,.68,g);
  box(PALE,x-.23,1.63,z+.53,1.97,.1,.64,g);
  for(let row=0;row<3;row++)for(let i=0;i<10;i++)box(0x526f79,x-1.07+i*.185,1.69,z+.37+row*.15,.13,.045,.101,g);
  orb(PALE,x+1.12,1.65,z+.58,.22,.08,.28,g);
  box(0xd48d78,x+1.68,2.03,z-.27,.54,.91,.61,g);
  box(0xffc993,x+.97,.77,z+2.26,1.18,.17,1.03,g);
  for(const dx of [-.42,.42])for(const dz of [-.33,.33])box(0xb47859,x+.97+dx,.38,z+2.26+dz,.105,.76,.105,g);
  board('Parent Notes',x,4.25,z-.43,3.78,g);
  canvasPanel(g,{x,y:2.81,z:z-.382,w:3.14,h:1.74,paint(ctx,w,h){
    ctx.fillStyle='#153d55';ctx.fillRect(0,0,w,h);
    for(const [i,c] of ['#ffb6c2','#ffd47e','#9ad9c2'].entries()){
      ctx.fillStyle=c;ctx.fillRect(w*.19,h*(.16+i*.12),w*(.62-i*.11),h*.054);
    }
    textLine(ctx,'Read parents’ notes',w/2,h*.7,w*.86,w*.085,'#fff7d7');
  }});
}

function wordLibrary({house,box,board}){
  const g=stationGroup(house,LIBRARY,'word library'),x=0,z=0,bayWidth=7.6;
  box(0x70c9e9,x,2.63,z-.88,bayWidth,5.14,.2,g);
  for(const side of [-1,1])box(0x4eafd4,x+side*bayWidth/2,2.62,z,.21,5.22,1.65,g);
  for(let i=0;i<5;i++)box(0xffefbc,x,.26+i*1.18,z,bayWidth,.15,1.65,g);
  box(0x7ebcd9,x,5.26,z,bayWidth+.25,.29,1.85,g);
  board('Word Library',x,5.63,z+.86,5.8,g);
  const books=new THREE.Group();g.add(books);
  const colors=['#ffcb86','#f9b7b0','#b7e0c0','#b6deed','#d9bfeb','#fee1a3'];
  let displayed=[];
  const volumes=Array.from({length:SHELF_CAPACITY},(_,i)=>{
    const spine=box([0xedaa79,0xd99696,0xa8c694,0x8dbecc,0xb699c8,0xebc67b][i%6],
      x-3.635+((i%6)+.5)*7.27/6,2.63+(1.5-Math.floor(i/6))*1.17,z+.47,1.01,.89,.62,books);
    spine.visible=false;
    return spine;
  });
  const panel=canvasPanel(books,{x,y:2.63,z:z+.86,w:7.27,h:4.68,pixels:1536,paint(ctx,w,h){
    ctx.clearRect(0,0,w,h);
    const cellW=w/6,cellH=h/4;
    displayed.forEach((word,i)=>{
      const cx=(i%6)*cellW,cy=Math.floor(i/6)*cellH;
      ctx.fillStyle='#4b565e';ctx.fillRect(cx+cellW*.08,cy+cellH*.18,cellW*.89,cellH*.77);
      ctx.fillStyle=colors[i%colors.length];ctx.fillRect(cx+cellW*.07,cy+cellH*.14,cellW*.86,cellH*.76);
      ctx.fillStyle='#fff5d9';ctx.fillRect(cx+cellW*.115,cy+cellH*.23,cellW*.76,cellH*.55);
      textLine(ctx,word,cx+cellW*.495,cy+cellH*.5,cellW*.66,Math.floor(cellW*.25),'#21445d');
      ctx.fillStyle='#527586';ctx.fillRect(cx+cellW*.4,cy+cellH*.81,cellW*.19,cellH*.027);
    });
    if(!displayed.length){
      ctx.fillStyle='#f9e1b9';ctx.fillRect(w*.21,h*.4,w*.58,h*.17);
      textLine(ctx,'Your saved words go here',w*.5,h*.49,w*.53,w*.055,'#21445d');
    }
  }});
  let signature=null;
  return words=>{
    const next=JSON.stringify(words);
    if(next===signature)return;
    signature=next;displayed=words;
    volumes.forEach((book,i)=>{book.visible=i<words.length;});
    panel?.redraw();
  };
}

function wardrobe({house,box,orb,board}){
  const {x,z,width:w,depth}=WARDROBE;
  const g=new THREE.Group();
  g.position.set(x,0,z);
  g.rotation.y=WARDROBE.yaw;
  g.name='right-facing wardrobe';
  house.add(g);
  box(0xc598e7,0,2.05,0,w,4.1,depth,g);
  box(0xf9acc7,0,.24,0,w+.21,.41,depth+.16,g);
  box(0xffcc8c,0,4.08,0,w+.21,.26,depth+.16,g);
  for(const side of [-1,1]){
    const panelX=side*1.01;
    box(side<0?0xffa5bd:0xbde6ef,panelX,2.07,1.064,1.9,3.32,.125,g);
    box(side<0?0xffc0cc:0xd3f3f2,panelX,2.22,1.14,1.54,2.48,.049,g);
    orb(0xffcd62,side*.3,1.95,1.25,.13,.14,.085,g);
  }
  board('Wardrobe',0,4.51,1.04,3.2,g);
}

function bedroom({house:g,night,box,cyl,orb,board}){
  const {x,z}=BED;
  box(0x9bb9ec,x,1.2,z-1.91,3.49,2.4,.27,g);
  for(const [dx,y,r] of [[-1.16,2.37,.58],[-.57,2.58,.71],[.23,2.77,.76],[1.1,2.39,.59]])
    orb(0xc0d9f6,x+dx,y,z-1.83,r,r*.7,.14,g);
  orb(0xffd46b,x+.16,2.78,z-1.65,.22,.23,.09,g);
  box(0xa9bcec,x,.38,z,3.49,.62,4.04,g);
  box(0xfff5dd,x,.72,z,3.31,.22,3.92,g);
  const baseSheet=new THREE.Group();g.add(baseSheet);
  box(0x88cfbc,x,.87,z+.44,3.32,.19,2.92,baseSheet);
  for(let i=0;i<6;i++)box(0xbde0d8,x,.978,z-.7+i*.46,3.22,.018,.1,baseSheet);
  orb(0xffeccc,x,.915,z-1.32,.97,.17,.55,g);
  box(0xf4adba,18.29,.57,-11.99,1.22,1.11,1.36,g);
  cyl(0x8a638d,18.29,1.47,-11.99,.085,.69,g);
  orb(0xffdb89,18.29,1.95,-11.99,.36,.35,.36,g);
  for(let i=0;i<9;i++)orb(0xffed9e,x-1.8+i*.45,3.05+(i%3)*.35,z-.93,.08,.08,.08,night);
  g.add(night);
  board('Bedroom',x,3.56,z-1.73,3.47,g);
  box(0xded5ee,x,.025,z+.5,4.75,.052,4.8,g);
  return baseSheet;
}

function mainDoor({house:g,box,orb}){
  const {width,height,z}=HOUSE_DOOR,x=ROOM.door[0];
  for(const side of [-1,1])box(PALE,x+side*(width/2+.082),height/2,z,.16,height+.09,.23,g);
  box(PALE,x,height+.05,z,width+.33,.15,.25,g);
  box(0xffdb96,x,.04,z+.08,width+.23,.055,.49,g);
  const hinge=new THREE.Group();
  hinge.position.set(x-width/2,0,z+.08);g.add(hinge);
  box(0x61c3bd,width/2,height/2,0,width,height,.123,hinge);
  for(const side of [-1,1]){
    orb(0xc9eff6,width/2,1.83,.073*side,.38,.37,.027,hinge);
    orb(0xffce69,width-.26,1.14,.095*side,.081,.079,.065,hinge);
  }
  return hinge;
}

function buildStorage({house,box,cyl,orb,board}){
  const toyGroup=stationGroup(house,TOYS,'toy cupboard'),toyX=0,toyZ=0;
  box(0xa7d7bd,toyX,2.01,toyZ-.84,5.38,4,.2,toyGroup);
  for(const side of [-1,1])box(0x76b8ac,toyX+side*2.65,2.01,toyZ,.18,4.03,1.76,toyGroup);
  for(const y of [.32,1.5,2.82,4.01])box(0xffd888,toyX,y,toyZ,5.38,.15,1.76,toyGroup);
  for(let i=0;i<3;i++)box([0xf1a3b9,0xa1d6eb,0xc5a7df][i],toyX+(i-1)*1.47,.8,toyZ+.3,1.21,.67,.8,toyGroup);
  board('Toy Cupboard',toyX,4.39,toyZ+.85,4.6,toyGroup);
  const roomX=17.33,roomZ=11.65;
  box(0xf0c6ed,roomX,.027,roomZ,4.04,.034,5.94,house);
  box(0xc1dcf0,roomX,1.42,8.61,4.3,2.84,.22,house);
  for(const [z,d] of [[9.23,1.26],[13.84,1.94]]){
    box(0xc1dcf0,15.24,1.42,z,.25,2.84,d,house);
    box(0xf6dfaa,15.24,2.84,z,.33,.13,d,house);
  }
  box(0xf8da9e,15.24,3.1,11.43,.25,.21,2.9,house);
  const signGroup=new THREE.Group();
  signGroup.position.set(15.13,0,11.43);signGroup.rotation.y=-Math.PI/2;house.add(signGroup);
  board('Store Room',0,3.55,0,2.65,signGroup);
  box(0xc69edf,17.26,1.54,14.39,3.33,3.01,.8,house);
  for(const y of [.3,1.34,2.45])box(0xffd494,17.26,y,14.13,3.43,.13,1.13,house);
  for(let i=0;i<3;i++)box([0xe79bad,0x94cec7,0xf6c679][i],16.3+i*.94,.59,14.1,.71,.5,.71,house);
  const pill=cyl(0xffd489,17.1,.065,11.5,1.05,.06,house);pill.scale.z=.73;
  for(const x of [16.51,17.03,17.55])orb(0xf7aecc,x,2.95,14.06,.2,.14,.15,house);
  return TOYS;
}
function homeInventoryViews(kit,toysAt,baseSheet){
  const {house,box,cyl,orb}=kit;
  const dynamic=new THREE.Group();house.add(dynamic);
  let signature='';
  return state=>{
    const next=JSON.stringify([state.ownedItems,state.houseLayout,state.houseSheets,state.housePlush]);
    if(next===signature)return;
    signature=next;
    for(const item of [...dynamic.children]){
      item.traverse(mesh=>{
        if(mesh.userData.homeDisposable)mesh.geometry.dispose();
        if(mesh.userData.homeMaterial)mesh.material.dispose();
      });
      item.removeFromParent();
    }
    for(const [id,p] of Object.entries(state.houseLayout||{})){
      const spot=slotById.get(p.slot);
      if(!spot||!HOME_ITEM.has(id))continue;
      const model=homeModel(id,{cube:box,cyl,orb});
      model.position.set(spot.x,0,spot.z);model.rotation.y=p.turn*Math.PI/2;dynamic.add(model);
    }
    const stored=(state.ownedItems||[]).filter(id=>['furniture','decoration'].includes(HOME_ITEM.get(id)?.kind)&&!state.houseLayout?.[id]);
    stored.forEach((id,i)=>{
      const model=homeModel(id,{cube:box,cyl,orb});model.scale.setScalar(.21);
      model.position.set(16+(i%5)*.62,i<5?1.43:2.54,14.03);
      model.rotation.y=Math.PI;dynamic.add(model);
    });
    const toys=(state.ownedItems||[]).filter(id=>HOME_ITEM.get(id)?.kind==='toy');
    toys.forEach((id,i)=>{
      const toy=homeModel(id,{cube:box,cyl,orb});toy.scale.setScalar(1.12);
      toy.position.set(toysAt.x+.16,i<3?1.59:2.92,toysAt.z-(i%3-1)*1.56);
      toy.rotation.y=toysAt.yaw;
      dynamic.add(toy);
    });
    const sheet=HOME_ITEM.get(state.houseSheets);
    baseSheet.visible=!sheet;
    if(sheet){
      const group=new THREE.Group();dynamic.add(group);
      const {x,z}=BED;
      const color=new THREE.Color(sheet.color).getHex();
      box(color,x,.87,z+.44,3.32,.19,2.92,group);
      if(sheet.id==='sheets-berry'){
        for(let i=0;i<7;i++)box(0xffe6c9,x,.974,z-.72+i*.36,3.12,.014,.11,group);
      }else for(let i=0;i<16;i++){
        const color=sheet.id==='sheets-stars'?0xffdf87:0xc3eff0;
        const width=sheet.id==='sheets-stars'?.083:.2;
        orb(color,x-1.1+i%4*.73,.974,z-.58+Math.floor(i/4)*.61,width,.011,.065,group);
      }
    }
    if(HOME_ITEM.get(state.housePlush)?.kind==='plush'){
      const toy=homeModel(state.housePlush,{cube:box,cyl,orb});
      toy.position.set(BED.x+1.06,1.01,BED.z-.92);toy.rotation.y=-.24;
      dynamic.add(toy);
    }
  };
}
export function buildHouseInterior({house,night,cube:box,cyl,orb,figure,portrait}){
  const board=(name,x,y,z,w,g)=>{
    const h=w<1.7?.32:.63;
    box(0xffd68f,x,y,z,w+.13,h+.12,.12,g);
    canvasPanel(g,{x,y,z:z+.067,w,h,paint(ctx,cw,ch){
      ctx.fillStyle='#225878';ctx.fillRect(0,0,cw,ch);
      textLine(ctx,name,cw/2,ch*.52,cw*.91,Math.floor(ch*.63),'#fff4d8');
    }});
  };
  const kit={house,night,box,cyl,orb,board,figure,portrait};
  const {back,front,left,right,ceiling:height}=SHELL;
  const mid=(front+back)/2,depth=front-back,width=right-left;
  const walls={};
  function wall(name){
    const g=new THREE.Group();g.name='house '+name;
    walls[name]=g;house.add(g);return g;
  }
  const backWall=wall('back'),frontWall=wall('front'),leftWall=wall('left'),rightWall=wall('right');
  box(0xffe4b5,0,-.15,mid+.24,width+.42,.32,depth+.94,house);
  box(0x76cdec,0,height/2,back,width,height,.25,backWall);
  box(0xff8fbd,0,.72,back+.172,width,1.43,.13,backWall);
  for(let i=0;i<39;i++)orb(0xff8fbd,i-19,1.43,back+.19,.52,.32,.067,backWall);
  const half=(width-2.25)/2;
  for(const side of [-1,1]){
    const x=side*(1.125+half/2);
    box(0xb299eb,x,height/2,front,half,height,.24,frontWall);
    box(0xf6b6ca,x,.44,front-.16,half,.88,.08,frontWall);
  }
  const above=height-HOUSE_DOOR.height;
  box(0xb299eb,0,HOUSE_DOOR.height+above/2,front,2.25,above,.242,frontWall);
  for(const [x,side] of [[left,leftWall],[right,rightWall]]){
    box(0x78d8c3,x,height/2,mid,.24,height,depth,side);
    box(0xffc46c,x+Math.sign(-x)*.16,.68,mid,.08,1.36,depth,side);
  }
  const ceiling=wall('ceiling');
  box(0xffdd65,0,height,mid,width+.16,.26,depth+.16,ceiling);
  for(const x of [-11,0,11]){
    cyl(0xffca78,x,height-.36,-2,.055,.58,ceiling);
    orb(0xffd48b,x,height-.79,-2,.4,.17,.4,ceiling);
    orb(0xffefbb,x,height-.89,-2,.2,.095,.2,ceiling);
  }
  for(const [name,surface] of Object.entries(walls)){
    surface.traverse(node=>{if(node.isMesh)node.castShadow=false;});
    if(name==='ceiling')surface.userData.enclosed=true;
  }
  for(const [x,y] of [[-7.9,5.99],[-3.5,6.69],[4.68,6.29],[16,6.14]]){
    for(const [dx,dy,r] of [[-.52,0,.44],[-.06,.25,.62],[.53,.02,.46]])
      orb(0xfffbef,x+dx,y+dy,back+.22,r,r*.57,.06,house);
  }
  const windowX=-5.2;
  box(PALE,windowX,5.31,back+.2,3.27,3.2,.17,house);
  const window=box(0x94d9e8,windowX,5.31,back+.32,2.9,2.82,.1,house);
  box(PALE,windowX,5.31,back+.39,.115,2.88,.09,house);
  box(PALE,windowX,5.31,back+.39,3.0,.13,.09,house);
  for(const side of [-1,1])box(0xecac91,windowX+side*1.61,5.31,back+.42,.49,3.28,.13,house);
  for(let i=0;i<4;i++){
    const stripe=new THREE.Mesh(new THREE.TorusGeometry(1.33-i*.17,.084,8,28,Math.PI),
      new THREE.MeshBasicMaterial({color:[0xf68698,0xffc957,0x7ecdb7,0x79b8e0][i]}));
    stripe.position.set(4.7,4.73,back+.25);house.add(stripe);
  }
  const refreshPosters=posterWall(kit);
  // Recessed wall panels and skirting sit behind every interaction route.
  for(let x=left+.8;x<right-.4;x+=2.3){
    box(0xffc483,x,.16,back+.23,2.19,.24,.17,backWall);
    box(0x97d9df,x,2.35,back+.16,.08,1.53,.12,backWall);
  }
  for(const side of [-1,1]){
    box(0xffd18b,side*(right-.25),.15,mid,.16,.23,depth-.25,side<0?leftWall:rightWall);
  }
  activityCorner(kit);playArea(kit);computerDesk(kit);wardrobe(kit);
  const refreshCabinet=displayCabinet(kit);
  const baseSheet=bedroom(kit),toysAt=buildStorage(kit);
  const door=mainDoor(kit);
  box(0x61c3bd,0,HOUSE_DOOR.height/2,front+.22,2.28,HOUSE_DOOR.height+.014,.14,frontWall);
  const updateShelf=wordLibrary(kit);
  const updateInventory=homeInventoryViews(kit,toysAt,baseSheet);
  baseSheet.traverse(node=>{
    if(!node.isMesh)return;
    node.material=node.material.clone();
    node.material.bumpMap=detailTexture('cloth');node.material.bumpScale=.024;node.material.roughness=.91;
  });
  return {window,door,updateShelf,refreshPosters,refreshCabinet,updateInventory};
}
