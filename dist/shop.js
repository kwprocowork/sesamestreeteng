import {HOME_GOODS,normalizeHouseInventory} from './home-goods.js?v=44';
import * as THREE from './assets/three.module.js';
const wearableItems=[
 {id:'bow',name:'Sunshine bow',price:2,kind:'wear',color:'#ef858d',description:'A cheerful bow beside your friend’s head.'},
 {id:'glasses',name:'Super shades',price:2,kind:'wear',color:'#527eae',description:'Round blue sunglasses for sunny adventures.'},
 {id:'flower',name:'Happy flower',price:2,kind:'carry',color:'#eb99bf',description:'Carry a bright little flower.'},
 {id:'hat',name:'Explorer hat',price:2,kind:'wear',color:'#c7a46b',description:'A soft golden hat for little discoveries.'},
 {id:'wand',name:'Twinkle wand',price:2,kind:'carry',color:'#d5af50',description:'Carry your very own golden star.'},
 {id:'balloon',name:'Rainbow balloon',price:2,kind:'carry',color:'#81b5bf',description:'A colourful balloon that bobs as you walk.'},
 {id:'crown',name:'Golden crown',price:4,kind:'wear',color:'#e5be4f',description:'A sparkling crown for a wonderful friend.'},
 {id:'backpack',name:'Adventure pack',price:3,kind:'wear',color:'#75a996',description:'A little green backpack for big adventures.'},
 {id:'royal-crown',name:'Royal peacock headdress',price:5,kind:'wear',color:'#27b8ad',description:'A fan of jewel-tipped peacock feathers.',icon:'🦚'},
 {id:'fairy-wand',name:'Crystal lantern',price:5,kind:'carry',color:'#a883df',description:'A glowing crystal inside a golden lantern cage.',icon:'🏮'},
 {id:'festival-hat',name:'Dragon helmet',price:5,kind:'wear',color:'#77b781',description:'Curved horns, a spiky crest and cheek guards.',icon:'🐉'},
 {id:'rose-bow',name:'Butterfly wings',price:5,kind:'wear',color:'#e68ac5',description:'Four translucent wings with bright jewel spots.',icon:'🦋'},
 {id:'galaxy-pack',name:'Rocket pack',price:5,kind:'wear',color:'#647ed1',description:'Twin rocket engines with flickering golden flames.',icon:'🚀'},
 {id:'rainbow-flower',name:'Pinwheel',price:3,kind:'carry',color:'#efab64',description:'Four folded rainbow sails that spin gently.',icon:'🌈'},
 {id:'headphones',name:'Music headphones',price:3,kind:'wear',color:'#eb8958',description:'Cushioned ear cups joined by a curved headband.',icon:'🎧'},
 {id:'scarf',name:'Striped scarf',price:2,kind:'wear',color:'#db6a78',description:'A soft scarf with two fringed ends.',icon:'🧣'},
 {id:'camera',name:'Little photographer',price:3,kind:'carry',color:'#69abc0',description:'A camera with a big lens and a wrist strap.',icon:'📷'},
 {id:'telescope',name:'Pirate telescope',price:4,kind:'carry',color:'#c49a55',description:'An extending brass telescope with a blue lens.',icon:'🔭'},
 {id:'umbrella',name:'Rainbow umbrella',price:4,kind:'carry',color:'#ac8ed1',description:'A small striped canopy with a curved handle.',icon:'☂️'},
 {id:'guitar',name:'Star guitar',price:5,kind:'carry',color:'#eaa748',description:'A polished guitar with strings and a star sound hole.',icon:'🎸'}
,
 {id:'star-clip',name:'Star hair clip',price:2,kind:'wear',color:'#e9a861',icon:'⭐',description:'A golden star pinned near one ear.'},
 {id:'bead-bracelet',name:'Rainbow bracelet',price:2,kind:'wear',color:'#84bfaa',icon:'📿',description:'Colourful beads for one wrist.'},
 {id:'raincoat',name:'Sunshine raincoat',price:4,kind:'wear',category:'clothes',color:'#f3bf5e',icon:'🧥',description:'A yellow coat for rainy-day adventures.'},
 {id:'striped-shirt',name:'Berry stripe shirt',price:4,kind:'wear',category:'clothes',color:'#ea8ca9',icon:'👕',description:'A pink top with bright horizontal stripes.'},
 {id:'mint-cape',name:'Mint superhero cape',price:4,kind:'wear',category:'clothes',color:'#87cbb4',icon:'🦸',description:'A mint cape with a golden clasp.'}
];
export const SHOP_ITEMS=[...wearableItems.map(item=>({category:item.id==='scarf'?'clothes':'accessories',...item})),...HOME_GOODS];
export const isWearable=item=>item?.kind==='wear'||item?.kind==='carry';
export function normalizeShop(state){
 state.stickers=Number.isSafeInteger(state.stickers)&&state.stickers>=0?state.stickers:0;
 state.ownedItems=[...new Set((Array.isArray(state.ownedItems)?state.ownedItems:[]).filter(id=>SHOP_ITEMS.some(item=>item.id===id)))];
 state.equippedItem=state.ownedItems.includes(state.equippedItem)&&isWearable(SHOP_ITEMS.find(item=>item.id===state.equippedItem))?state.equippedItem:null;
 normalizeHouseInventory(state);return state;
}
export function awardStickers(state){normalizeShop(state);state.stickers+=3;return 3;}
export function buyItem(state,id){normalizeShop(state);const item=SHOP_ITEMS.find(item=>item.id===id);if(!item)return {ok:false,reason:'unknown'};if(state.ownedItems.includes(id))return {ok:false,reason:'owned'};if(state.stickers<item.price)return {ok:false,reason:'insufficient'};state.stickers-=item.price;state.ownedItems.push(id);return {ok:true,item};}
export function equipItem(state,id){normalizeShop(state);if(id!==null&&(!state.ownedItems.includes(id)||!isWearable(SHOP_ITEMS.find(item=>item.id===id))))return false;state.equippedItem=id;return true;}
export function stickerSVG(){return '<svg class="elmo-sticker" viewBox="0 0 100 100" role="img" aria-label="Elmo golden sticker"><circle cx="50" cy="50" r="46" fill="#efd06b" stroke="#bc8734" stroke-width="3"/><circle cx="50" cy="50" r="40" fill="#ffe697" stroke="#fff4c4" stroke-dasharray="3 3" stroke-width="2"/><path d="M23 46l4-5-1-5 6-1 2-6 6 2 4-5 6 3 5-3 5 5 6-1 3 6 6 1-1 6 4 4-3 6 1 5-5 3-1 6-6 1-4 4-5-2-5 3-5-3-6 2-3-5-6-1-1-6-5-3 2-6z" fill="#d72d38"/><ellipse cx="42" cy="38" rx="9" ry="11" fill="white"/><ellipse cx="59" cy="38" rx="9" ry="11" fill="white"/><ellipse cx="44" cy="39" rx="3" ry="4" fill="#202a2c"/><ellipse cx="57" cy="39" rx="3" ry="4" fill="#202a2c"/><path d="M32 52q18 4 36 0Q63 73 50 73T32 52" fill="#382a2c"/><ellipse cx="51" cy="49" rx="9" ry="12" fill="#f7a12e"/><path d="m16 24 2-5 2 5 5 2-5 2-2 5-2-5-5-2zm64 50 2-4 2 4 4 2-4 2-2 4-2-4-4-2z" fill="#fff9d8"/></svg>';}
export function itemSVG(id){const item=SHOP_ITEMS.find(x=>x.id===id);if(item?.icon)return `<svg class="item-art" viewBox="0 0 100 100" aria-hidden="true"><text x="50" y="73" text-anchor="middle" font-size="66">${item.icon}</text></svg>`;const shapes={
 bow:'<path d="M48 42Q15 13 17 40Q14 68 48 49M52 42Q85 13 83 40Q86 68 52 49" fill="#ef858d" stroke="#d56d7c" stroke-width="3"/><circle cx="50" cy="45" r="9" fill="#f8c65c"/>',
 glasses:'<path d="M13 40h15m44 0h15M44 47q6-8 12 0" fill="none" stroke="#355577" stroke-width="5"/><circle cx="29" cy="48" r="17" fill="#6d9fb3" stroke="#355577" stroke-width="5"/><circle cx="71" cy="48" r="17" fill="#6d9fb3" stroke="#355577" stroke-width="5"/><path d="m19 43 13-8m29 8 13-8" stroke="#c9edf0" stroke-width="4"/>',
 flower:'<path d="M50 80V40M50 68q-25-20-23-3q6 13 23 5" fill="#8bb37e" stroke="#608c68" stroke-width="3"/><g fill="#ed9abb" stroke="#d77eaa" stroke-width="2"><ellipse cx="50" cy="24" rx="10" ry="14"/><ellipse cx="66" cy="36" rx="14" ry="10"/><ellipse cx="60" cy="53" rx="10" ry="14"/><ellipse cx="40" cy="53" rx="10" ry="14"/><ellipse cx="34" cy="36" rx="14" ry="10"/></g><circle cx="50" cy="39" r="12" fill="#f6d667"/>',
 hat:'<ellipse cx="50" cy="61" rx="39" ry="13" fill="#bb935c"/><path d="M24 60V40Q24 18 50 19Q76 18 76 40v20z" fill="#d8ba7f"/><path d="M24 49q26 9 52 0v10q-26 10-52 0" fill="#7b9e7b"/>',
 wand:'<path d="m34 83 24-48" stroke="#a58bb7" stroke-width="7" stroke-linecap="round"/><path d="m61 12 6 13 14 2-10 11 2 14-12-7-13 7 3-14-11-11 15-2z" fill="#f1cc5f" stroke="#d1a03c" stroke-width="2"/><path d="m24 24 3-7 3 7 7 3-7 3-3 7-3-7-7-3z" fill="#e5b5c9"/>',
 balloon:'<path d="M50 59q18 12 0 26" fill="none" stroke="#a58d67" stroke-width="2"/><ellipse cx="50" cy="34" rx="24" ry="29" fill="#83b9c7"/><path d="M42 7q-7 27 0 55M56 7q16 27 0 55" stroke="#f3b2bb" stroke-width="8" fill="none"/><path d="m50 61-5 7h10z" fill="#e8c46a"/><ellipse cx="39" cy="23" rx="4" ry="9" fill="#ffffff90"/>',
 crown:'<path d="m18 30 17 16L50 20l15 26 17-16-7 43H25z" fill="#f0ce64" stroke="#ca9d3e" stroke-width="3"/><path d="M25 62h50" stroke="#ffe9a3" stroke-width="5"/><circle cx="50" cy="53" r="5" fill="#dc8d9e"/><circle cx="31" cy="51" r="3" fill="#8eb6ba"/><circle cx="69" cy="51" r="3" fill="#8eb6ba"/>',
 backpack:'<path d="M38 25V18q12-12 24 0v7" fill="none" stroke="#4e7d6c" stroke-width="6"/><rect x="23" y="23" width="54" height="60" rx="16" fill="#7eb29c" stroke="#548773" stroke-width="3"/><path d="M24 36q26 24 52 0" fill="#9cc6ab" stroke="#548773" stroke-width="3"/><rect x="32" y="56" width="36" height="18" rx="6" fill="#b5d3ad"/><circle cx="50" cy="45" r="5" fill="#efcd75"/>'};return `<svg class="item-art" viewBox="0 0 100 100" aria-hidden="true">${shapes[id]||''}</svg>`;}
export function clearAccessory(actor){const root=actor?.userData.accessory;if(!root)return;root.parent?.remove(root);root.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material]))m.dispose()});delete actor.userData.accessory;delete actor.userData.accessoryId;}
export function attachAccessory(actor,id){clearAccessory(actor);if(!actor||!SHOP_ITEMS.some(item=>item.id===id&&isWearable(item)))return null;
 const selectedItem=SHOP_ITEMS.find(item=>item.id===id);
 const root=new THREE.Group();root.name='equipped-'+id;actor.userData.accessory=root;actor.userData.accessoryId=id;
 function mesh(geo,color,x,y,z,sx=1,sy=1,sz=1){const o=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,roughness:.65}));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;root.add(o);return o;}
 const orb=(c,x,y,z,sx,sy=sx,sz=sx)=>mesh(new THREE.SphereGeometry(1,20,14),c,x,y,z,sx,sy,sz);
 const cube=(c,x,y,z,w,h,d)=>mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z);
 const cylinder=(c,x,y,z,r,h)=>mesh(new THREE.CylinderGeometry(r,r,h,24),c,x,y,z);
 const ring=(c,x,y,z,r,t=.025)=>mesh(new THREE.TorusGeometry(r,t,7,28),c,x,y,z);

 const name=actor.userData.spec.name,snuffy=name==='Snuffleupagus',bert=name==='Bert',head=bert?2.81:name==='Julia'||name==='Tamir'?2.74:2.64;
 if(SHOP_ITEMS.find(item=>item.id===id).kind==='carry'){
  const arm=actor.userData.arms[1];if(arm){arm.add(root);root.position.set(.21,-.55,.2)}else{actor.add(root);root.position.set(.55,.65,1.7)}
 }else actor.add(root);
 if(id==='bow'){root.position.set(snuffy?.5:.49,snuffy?2:head-.2,snuffy?1.2:.27);for(const side of[-1,1]){const loop=orb(0xe88999,side*.12,0,0,.16,.13,.07);loop.rotation.z=side*.4}orb(0xf3cf68,0,0,.04,.07);}
 if(id==='glasses'){root.position.set(0,snuffy?1.84:2.3,snuffy?1.54:.64);for(const side of[-1,1]){ring(0x456786,side*.21,0,.02,.195);orb(0x679aaf,side*.21,0,0,.17,.17,.025);cube(0x456786,side*.41,0,-.14,.045,.04,.28)}cube(0x456786,0,0,.02,.08,.035,.035);}
 if(id==='hat'){root.position.set(0,snuffy?2.1:head,snuffy?.9:0);cylinder(0xc3a06d,0,0,0,.58,.07);orb(0xd9bd88,0,.14,0,.37,.27,.36);cylinder(0x759d82,0,.075,0,.375,.085);}
 if(id==='crown'){root.position.set(0,snuffy?2.12:head,snuffy?.9:0);cylinder(0xe7c25d,0,.03,0,.39,.14);for(let j=0;j<7;j++){const a=j*Math.PI*2/7;mesh(new THREE.ConeGeometry(.1,.27,4),0xefce65,Math.sin(a)*.32,.2,Math.cos(a)*.32);orb(0xf6dfa0,Math.sin(a)*.32,.34,Math.cos(a)*.32,.035)}orb(0xdd8ba4,0,.03,.4,.065,.07,.025);}
 if(id==='backpack'){root.position.set(0,snuffy?1.8:1.03,snuffy?-.15:-.42);orb(0x79ad96,0,0,-.12,.4,.48,.18);cube(0xa7cdb0,0,-.17,-.29,.48,.25,.09);if(!snuffy)for(const side of[-1,1])cube(0x5b8e78,side*.29,.05,.72,.055,.75,.045);ring(0x5b8e78,0,.49,-.12,.12);}
 if(id==='flower'){cylinder(0x699a6c,0,.26,0,.016,.65);for(let j=0;j<6;j++){const a=j*Math.PI/3;orb(0xe99cbc,Math.cos(a)*.11,.6+Math.sin(a)*.11,0,.085,.085,.035)}orb(0xf6d574,0,.6,.04,.07,.07,.025);}
 if(id==='wand'){cylinder(0xb59ac8,0,.37,0,.025,.85);const shape=new THREE.Shape();for(let j=0;j<10;j++){const a=Math.PI/2+j*Math.PI/5,r=j%2?.09:.2;if(j===0)shape.moveTo(Math.cos(a)*r,Math.sin(a)*r);else shape.lineTo(Math.cos(a)*r,Math.sin(a)*r)}shape.closePath();mesh(new THREE.ExtrudeGeometry(shape,{depth:.04,bevelEnabled:false}),0xf0ca5f,0,.88,0);}
 if(id==='balloon'){cylinder(0xd9c594,0,.55,0,.008,1.1);const b=orb(0x83b5c3,0,1.4,0,.27,.36,.26);for(let j=0;j<3;j++){const band=ring([0xf1aab8,0xe9d073,0x9ccbae][j],0,1.4,0,.27,.019);band.scale.y=1.33;band.rotation.y=j*Math.PI/3}root.userData.balloon=b;}

 if(id==='star-clip'){
  root.position.set(.43,snuffy?2.0:head-.2,snuffy?1.2:.38);
  const star=orb(0xffd065,0,0,.014,.145,.15,.045);
  for(let i=0;i<5;i++){
   const angle=i*Math.PI*.4;
   orb(0xffd065,Math.cos(angle)*.112,Math.sin(angle)*.112,.01,.072,.066,.035);
  }
  star.rotation.z=.24;
 }
 if(id==='bead-bracelet'){
  const arm=actor.userData.arms[0];
  if(arm)arm.add(root);
  root.position.set(arm?-.2:.59,arm?-.43:.67,arm?.03:1.41);
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7;orb([0xf7a5bb,0x88cfbb,0xffd475][i%3],Math.cos(a)*.16,0,Math.sin(a)*.16,.062);}
 }
 if(['raincoat','striped-shirt','mint-cape'].includes(id)){
  if(id==='mint-cape'){
   root.position.set(0,1.12,-.42);
   const cape=cube(0x7dcead,0,-.06,-.1,.86,1.11,.14);cape.rotation.x=.16;
   orb(0xffdb7a,0,.44,.82,.104,.076,.053);
  }else{
   root.position.set(0,1.02,0);
   orb(id==='raincoat'?0xf3bf5e:0xea8ca9,0,0,0,.55,.59,.435);
   if(id==='raincoat'){
    for(const y of [-.24,-.03,.17])orb(0xffecaa,.05,y,.443,.047,.05,.026);
   }else for(const y of [-.22,.02,.25])cube(0xffd2dd,0,y,.425,.70,.068,.035);
  }
 }

 const jewelColors=[0xf28aba,0x72d4e1,0xf4d56d,0xa98ce0,0x8cd39d];
 const tube=(color,points,r=.025)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),24,r,8,false),color,0,0,0);
 const headPosition=()=>root.position.set(0,snuffy?2.15:head,snuffy?.9:0);
 if(id==='royal-crown'){
  headPosition();cylinder(0xe6bf54,0,0,0,.4,.12);
  for(let j=0;j<7;j++){
   const angle=(j-3)*.24,x=Math.sin(angle)*.65,y=.24+Math.cos(angle)*.45;
   tube(0xc7a04f,[[0,0,-.12],[x*.5,y*.5,-.15],[x,y,-.16]],.018);
   const feather=orb(0x27b8ad,x,y,-.16,.10,.25,.035);feather.rotation.z=-angle;
   orb(0x3260aa,x,y+.04,-.116,.058,.095,.018);orb(0xf1c655,x,y+.04,-.094,.025,.04,.014);
  }
 }
 if(id==='fairy-wand'){
  cylinder(0xe2c169,0,.18,0,.2,.07);cylinder(0xe2c169,0,.75,0,.2,.07);
  for(let j=0;j<6;j++){const a=j*Math.PI/3;cylinder(0xe2c169,Math.cos(a)*.17,.46,Math.sin(a)*.17,.015,.53);}
  const crystal=mesh(new THREE.OctahedronGeometry(.22),0xb294f0,0,.46,0);crystal.material.emissive.set(0x9971dd);crystal.material.emissiveIntensity=.7;
  const handle=ring(0xe2c169,0,.95,0,.14);handle.rotation.y=Math.PI/2;root.userData.crystal=crystal;
 }
 if(id==='festival-hat'){
  headPosition();orb(0x6da879,0,.05,-.03,.43,.27,.4);
  for(const side of [-1,1]){
   tube(0xf5db9b,[[side*.3,.15,0],[side*.53,.32,0],[side*.48,.53,0]],.07);
   cube(0x547e69,side*.38,-.13,.08,.10,.3,.2);
  }
  for(let j=0;j<4;j++)mesh(new THREE.ConeGeometry(.09,.22,4),0xefb568,0,.28,-.24+j*.15);
 }
 if(id==='rose-bow'){
  root.position.set(0,snuffy?1.8:1.27,snuffy?-.3:-.47);
  for(const side of [-1,1])for(let j=0;j<2;j++){
   const wing=orb(j?0xa8b6e9:0xef9dcc,side*(j?.36:.45),j?-.25:.20,-.06,j?.31:.40,j?.3:.42,.04);
   wing.material.transparent=true;wing.material.opacity=.78;
   for(let k=0;k<3;k++)orb(jewelColors[k],side*(j?.36:.45)+Math.cos(k*2.1)*.15,(j?-.25:.2)+Math.sin(k*2.1)*.2,-.005,.05,.07,.02);
  }
 }
 if(id==='galaxy-pack'){
  root.position.set(0,snuffy?1.7:1.1,snuffy?-.35:-.52);
  cube(0x6179bb,0,0,0,.58,.6,.22);
  for(const side of [-1,1]){
   cylinder(0xe3e5dd,side*.3,0,-.1,.17,.75);
   mesh(new THREE.ConeGeometry(.18,.27,16),0xe2795e,side*.3,.5,-.1);
   const flame=mesh(new THREE.ConeGeometry(.12,.35,12),0xffcc56,side*.3,-.53,-.1);flame.rotation.z=Math.PI;
   root.userData.flames??=[];root.userData.flames.push(flame);
  }
 }
 if(id==='rainbow-flower'){
  cylinder(0xaf9871,0,.3,0,.022,.7);
  const rotor=new THREE.Group();root.add(rotor);rotor.position.y=.78;
  for(let j=0;j<4;j++){
   const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(.32,.12);shape.lineTo(.18,.35);shape.closePath();
   const sail=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshStandardMaterial({color:jewelColors[j],side:THREE.DoubleSide}));
   sail.rotation.z=j*Math.PI/2;rotor.add(sail);
  }
  orb(0xffde71,0,.78,.04,.065);root.userData.rotor=rotor;
 }
 if(id==='headphones'){
  headPosition();root.position.y-=.30;
  tube(0x445b77,[[-.57,-.02,0],[-.48,.48,0],[0,.61,0],[.48,.48,0],[.57,-.02,0]],.055);
  for(const side of [-1,1]){orb(0xf09c5f,side*.55,-.05,0,.12,.22,.22);orb(0x536d8f,side*.64,-.05,0,.04,.15,.15);}
 }
 if(id==='scarf'){
  root.position.set(0,snuffy?1.75:1.55,snuffy?.8:0);
  const loop=ring(0xdd6e82,0,0,0,.37,.085);loop.rotation.x=Math.PI/2;
  for(let j=0;j<2;j++){
   cube(0xdd6e82,j?.16:-.12,-.24-j*.1,.37,.17,.48,.06);
   for(let k=0;k<4;k++)cube(0xf4d37c,j?.16:-.12,-.09-k*.1-j*.1,.41,.17,.028,.025);
   for(let k=0;k<4;k++)cylinder(0xdd6e82,(j?.16:-.12)+(k-1.5)*.037,-.53-j*.1,.38,.012,.12);
  }
 }
 if(id==='camera'){
  cube(0x5eacc1,0,.25,0,.55,.35,.2);cube(0x304958,.1,.48,0,.16,.10,.15);
  const lens=cylinder(0x344756,0,.25,.16,.14,.18);lens.rotation.x=Math.PI/2;
  orb(0x8ecfe3,0,.25,.26,.11,.11,.02);orb(0xffd66e,.2,.43,0,.05);
  tube(0x354d5e,[[-.27,.3,0],[-.4,.1,0],[-.35,-.07,0]],.017);
 }
 if(id==='telescope'){
  for(let j=0;j<3;j++){const barrel=cylinder(j%2?0xd8b35f:0xc99543,0,.4,j*.17,.13-j*.025,.30);barrel.rotation.x=Math.PI/2;}
  orb(0x78bbd3,0,.4,.49,.08,.08,.02);cube(0x795e43,0,.18,.04,.10,.3,.11);
 }
 if(id==='umbrella'){
  cylinder(0x9d8662,0,.55,0,.018,1.0);
  for(let j=0;j<8;j++){
   const canopy=mesh(new THREE.SphereGeometry(.44,8,6,j*Math.PI/4,Math.PI/4,0,Math.PI/2),jewelColors[j%5],0,1.02,0);
   canopy.scale.y=.55;canopy.material.side=THREE.DoubleSide;
  }
  tube(0xc8a466,[[0,.05,0],[0,-.10,0],[.12,-.16,0],[.2,-.08,0]],.025);
 }
 if(id==='guitar'){
  orb(0xe5a84f,0,.33,0,.25,.31,.08);orb(0xf0bd62,0,.60,0,.19,.22,.08);
  cube(0x986241,0,.94,0,.085,.6,.06);cube(0xbd8654,0,1.28,0,.14,.17,.07);
  const hole=mesh(new THREE.CircleGeometry(.085,5),0x493b37,0,.49,.085);hole.rotation.z=Math.PI/2;
  for(let j=0;j<4;j++)cube(0xe9e4cc,(j-1.5)*.014,.78,.091,.005,.95,.006);
  for(let j=0;j<3;j++)for(const side of [-1,1])orb(0xe4d6aa,side*.09,1.22+j*.05,0,.025);
 }

 return root;
}
export function updateAccessoryPose(actor,time,moving=false){const root=actor?.userData.accessory;if(!root)return;if(SHOP_ITEMS.find(item=>item.id===actor.userData.accessoryId)?.kind==='carry'&&actor.userData.arms[1])actor.userData.arms[1].rotation.x=-.55+(moving?Math.sin(time*4)*.06:0);if(root.userData.rotor)root.userData.rotor.rotation.z=time*.8;if(root.userData.crystal)root.userData.crystal.rotation.y=time*.5;root.userData.flames?.forEach((flame,i)=>flame.scale.y=.8+.15*Math.sin(time*5+i));if(actor.userData.accessoryId==='balloon')root.rotation.z=Math.sin(time*2)*.06;}
