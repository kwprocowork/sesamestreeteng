const collections={
  furniture:[
    ['cloud-chair','Cloud armchair',4,'🪑','#a9ccf4','Cloud-shaped seat for a cosy corner.',[2.2,1.65]],
    ['berry-sofa','Berry loveseat',6,'🛋️','#f5a8bc','A pink seat with two squashy cushions.',[2.6,1.62]],
    ['puzzle-table','Puzzle table',4,'🧩','#fbd078','A low table with a puzzle top.',[2.03,1.6]],
    ['moon-bookcase','Moon bookcase',5,'📚','#94c5cc','A small shelf for a reading spot.',[2.4,.9]],
    ['mint-bench','Mint bench',3,'🪑','#8fd4bf','A low bench with room for two friends.',[2.45,1.04]],
    ['puff-ottoman','Puff ottoman',3,'🟣','#c5ade6','A round lilac footstool.',[1.26,1.26]],
  ],
  toy:[
    ['toy-train','Rainbow train',3,'🚂','#e88b83','A little engine and two bright carriages.'],
    ['toy-rocket','Moon rocket',3,'🚀','#84cce7','A pocket-sized rocket for pretend launches.'],
    ['toy-blocks','ABC blocks',2,'🔠','#f1c876','Three colourful blocks.'],
    ['toy-duck','Rubber duck',2,'🐤','#f9cc51','A yellow duck for your toy shelf.'],
    ['toy-drum','Parade drum',3,'🥁','#b296d7','A tiny drum with two sticks.'],
    ['toy-bus','Sunny bus',3,'🚌','#ffd375','A bright bus with little wheels.'],
  ],
  decoration:[
    ['floor-lamp','Tulip lamp',4,'🌷','#ec9ac2','A tall lamp with a pink flower shade.',[1.1,1.1]],
    ['rainbow-stand','Rainbow sculpture',4,'🌈','#96c5e1','A rainbow built for a little display corner.',[2.28,.9]],
    ['daisy-pot','Daisy planter',3,'🌼','#99d2a0','Two daisies in a mint pot.',[1.2,1.2]],
    ['star-lantern','Floor star lantern',4,'⭐','#f1c565','A golden star on a short stand.',[1.18,1.18]],
  ],
  plush:[
    ['bed-bear','Honey teddy',3,'🧸','#bd854f','A soft little bear for the bed.'],
    ['bed-bunny','Cloud bunny',3,'🐰','#edd7e8','A lilac bunny with long ears.'],
    ['bed-penguin','Pocket penguin',4,'🐧','#83a6d1','A blue penguin with a tiny orange beak.'],
  ],
  sheet:[
    ['sheets-stars','Night-sky bedsheets',4,'🌙','#8596d5','Lavender-blue bedding with golden stars.'],
    ['sheets-berry','Berry stripe bedsheets',4,'🍓','#f2a5ba','Pink bedding with cream stripes.'],
    ['sheets-ocean','Ocean wave bedsheets',4,'🌊','#81cdd7','A blue quilt with little waves.'],
  ],
};
export const HOME_GOODS=Object.entries(collections).flatMap(([kind,rows])=>
  rows.map(([id,name,price,icon,color,description,size])=>({
    id,name,price,icon,color,description,size,kind,
    category:kind==='plush'||kind==='sheet'?'bedding':kind==='toy'?'toys':kind,
  })));
export const HOME_ITEM=new Map(HOME_GOODS.map(item=>[item.id,item]));
export const canPlaceOnFloor=item=>item?.kind==='furniture'||item?.kind==='decoration';
export const HOUSE_SLOTS=[
  {id:'reading-left',name:'West wall · back',x:-17.73,z:-8.92,turn:1},
  {id:'play-left',name:'West wall · middle',x:-17.73,z:-4.65,turn:1},
  {id:'porch-east',name:'West wall · front',x:-17.73,z:12.57,turn:1},
  {id:'bed-east',name:'Front wall · far left',x:-11.85,z:13.01,turn:2},
  {id:'hall-left',name:'Front wall · left of the door',x:-6.1,z:13.01,turn:2},
  {id:'hall-right',name:'Front wall · right of the door',x:6.15,z:13.01,turn:2},
  {id:'play-right',name:'Front wall · far right',x:11.9,z:13.01,turn:2},
];
export const slotById=new Map(HOUSE_SLOTS.map(spot=>[spot.id,spot]));

export function normalizeHouseInventory(state){
  const owned=new Set(state.ownedItems||[]);
  const boxes=new Set();
  const layout={};
  Object.entries(state.houseLayout||{}).forEach(([id,placement])=>{
    const location=slotById.get(placement?.slot);
    if(!owned.has(id)||!canPlaceOnFloor(HOME_ITEM.get(id))||!location||boxes.has(location.id))return;
    layout[id]={slot:location.id,turn:location.turn};
    boxes.add(location.id);
  });
  state.houseLayout=layout;
  for(const kind of ['sheet','plush']){
    const key=kind==='sheet'?'houseSheets':'housePlush';
    if(!owned.has(state[key])||HOME_ITEM.get(state[key])?.kind!==kind)state[key]=null;
  }
}
export function placeHouseItem(state,id,slot){
  normalizeHouseInventory(state);
  const item=HOME_ITEM.get(id);
  if(!state.ownedItems.includes(id)||!canPlaceOnFloor(item))return false;
  if(slot==='storage'){delete state.houseLayout[id];return true;}
  if(!slotById.has(slot)||Object.entries(state.houseLayout).some(([other,p])=>other!==id&&p.slot===slot))return false;
  state.houseLayout[id]={slot,turn:slotById.get(slot).turn};
  return true;
}
export function chooseBedItem(state,id){
  normalizeHouseInventory(state);
  const kind=HOME_ITEM.get(id)?.kind;
  if(!state.ownedItems.includes(id)||!['sheet','plush'].includes(kind))return false;
  const key=kind==='sheet'?'houseSheets':'housePlush';
  state[key]=state[key]===id?null:id;
  return true;
}
export function placedHouseBlocks(layout){
  return Object.entries(layout||{}).flatMap(([id,placement])=>{
    const slot=slotById.get(placement.slot),item=HOME_ITEM.get(id);
    if(!slot||!item?.size)return [];
    const [w,d]=slot.turn%2?[item.size[1],item.size[0]]:item.size;
    return [[slot.x-w/2-.21,slot.x+w/2+.21,slot.z-d/2-.21,slot.z+d/2+.21]];
  });
}
