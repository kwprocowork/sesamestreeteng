import * as THREE from './assets/three.module.js';
import {PhonicsWorld} from './phonics-world.js?v=23';
// Public, reusable three-action versions. Original photo/OCR data never enters this file.
const a=(word,action,kind='bounce',model='')=>({word,action,kind,model});
export const SHORT_ADVENTURES={
 ball:{title:'The Playful Ball Park',pattern:'I found the ball.',intro:'The ball wants to play hide and seek!',ending:'I found the ball.',theme:'play',actions:[a('bench','Look under the bench','hide'),a('basket','Open the picnic basket','hide'),a('slide','Send the ball down the slide','roll'),a('fountain','Catch the bouncing ball','bounce')]},
 letters:{title:'The Letter Garden Picnic',pattern:'This is a ...',intro:'The garden friends are having a picnic. Bring a surprise!',ending:'This is my favourite surprise.',theme:'garden',actions:[a('apple','Pick an apple for the picnic','grow','This is an apple.'),a('ant','Help Ant cross the bridge','walk','This is an ant.'),a('ball','Roll the ball to the picnic','roll','This is a ball.'),a('butterfly','Wake the butterfly garden','fly','This is a butterfly.')]},
 phonics:{title:'Sound Safari Friends',pattern:'I can see a ...',intro:'The sound park is full of playful friends!',ending:'I can see a friend.',theme:'safari',actions:[a('cat','Play peekaboo with Cat','hide','I can see a cat.'),a('dog','Roll a toy to Dog','roll','I can see a dog.'),a('fish','Make a splash for Fish','splash','I can see a fish.'),a('hen','Help Hen hop home','hop','I can see a hen.'),a('goose','Start the goose parade','walk','I can see a goose.'),a('elephant','Give Elephant a shower','splash','I can see an elephant.')]},
 body:{title:'Boogie in the Sunshine',pattern:'I can ...',intro:'The park band is ready. Make a little dance!',ending:'I can dance.',theme:'music',actions:[a('clap','Clap with the band','clap','I can clap.'),a('jump','Bounce on the soft stage','hop','I can jump.'),a('wave','Wave to the balloon friends','wave','I can wave.'),a('dance','Start a silly dance','dance','I can dance.')]},
 wants:{title:'Baby’s Picnic Playhouse',pattern:'I picked ...',intro:'Baby is coming to the picnic. Choose some food!',ending:'I picked some food.',theme:'picnic',actions:[a('bread','Choose some bread','food','I picked bread.'),a('rice','Choose some rice','food','I picked rice.'),a('cookies','Choose some cookies','food','I picked cookies.'),a('ice cream','Choose some ice cream','food','I picked ice cream.'),a('juice','Choose some juice','food','I picked juice.'),a('milk','Choose some milk','food','I picked milk.')]},
 cat:{title:'Cat’s Secret Garden',pattern:'I can see the cat.',intro:'Cat has three funny surprises. Come and play!',ending:'I can see the cat.',theme:'hideaway',actions:[a('flowerpot','Wake the sleepy flowerpot','hide'),a('basket','Open the wobbling basket','hide'),a('bench','Look under the garden bench','hide'),a('tree','Call Cat down from the tree','hop')]},
 comparison:{title:'Abby’s Open-air Toy Theatre',pattern:'It is ...',intro:'The toys are putting on a show. You can start the fun!',ending:'This is my favourite toy.',theme:'theatre',actions:[a('cat','Open the curtain for Cat','dance','It is small.'),a('dog','Start Dog’s skating show','roll','It is fast.'),a('elephant','Give Elephant a big entrance','hop','It is big.'),a('goose','Start the goose parade','walk','It is slow.')]},
 'mac-c9e229cf29d0c0d0':{title:'Rabbit’s Little Delivery',pattern:'Here is the ...',intro:'Little Rabbit has a carrot for Grandma. Let us help!',ending:'Here is the carrot.',theme:'rabbit',ordered:true,actions:[a('carrot','Pull up the giant carrot','grow','Here is the carrot.'),a('bow','Wrap Grandma’s gift','wrap','Here is the bow.'),a('water','Give Rabbit a cool drink','splash','Here is the water.'),a('carrot','Deliver the carrot to Grandma','gift','Here is the carrot.')]},
};
export function shortSpec(lesson,story,ids={},options={}){
 let spec=SHORT_ADVENTURES[lesson];
 if(lesson===ids.transport)spec={title:'The Little Transport Festival',pattern:'This is a ...',intro:'The town vehicles are ready for a little adventure!',ending:'This is my favourite vehicle.',theme:'transport',actions:[a('train','Raise the signal for the train','ride','This is a train.'),a('school bus','Open the gate for the bus','ride','This is a school bus.'),a('bicycle','Clear the bicycle path','ride','This is a bicycle.'),a('boat','Let the boat sail','sail','This is a boat.'),a('airplane','Light up the runway','fly','This is an airplane.')]};
 if(lesson===ids.stationery)spec={title:'Pip’s Garden Art Party',pattern:'I have a ...',intro:'Pip is making a garden picture. Choose something to help!',ending:'I have a picture.',theme:'art',actions:[a('book','Open the pop-up book','open','I have a book.'),a('bag','Unpack the surprise bag','open','I have a bag.'),a('pencil','Draw a giant spiral','draw','I have a pencil.'),a('crayon','Colour the party picture','draw','I have a crayon.')]};
 if(lesson===ids.gallery)spec={title:'The Family Garden Gallery',pattern:'This is my ...',intro:'The family is having a garden photo party!',ending:'This is my family.',theme:'gallery',actions:[a('grandma','Take Grandma’s smiling photo','photo','This is my grandma.'),a('grandpa','Help Grandpa frame his photo','photo','This is my grandpa.'),a('sister','Paint a picture with Sister','draw','This is my sister.'),a('brother','Hang Brother’s party picture','gift','This is my brother.')]};
 if(lesson==='body'&&options.words?.length)spec={...spec,pattern:'I can touch my ...',actions:[...new Set(options.words)].map(word=>a(word,'Move with your friend','point',`I can touch my ${word}.`))};
 if(lesson==='phonics'&&options.words?.length)spec={...spec,actions:[...new Set(options.words)].filter(word=>word!=='fin').map(word=>({...a(word,'Play with the '+word,({ant:'walk',ball:'roll',boat:'sail',cat:'hide',dog:'roll',egg:'hop',elephant:'splash',fish:'splash',goose:'walk',gate:'open',hat:'fly'})[word]||'bounce'),model:`I can see ${/^[aeiou]/i.test(word)?'an':'a'} ${word}.`}))};
 if(!spec){const beats=story?.beats||[];spec={title:story?.title||'A Little Story Adventure',pattern:'I can see ...',intro:story?.intro||'Our friends have a little adventure for you.',ending:'I helped my friends.',theme:'story',ordered:true,actions:beats.map(b=>a(b.word,b.clue,'bounce',`I can see ${b.word}.`))};}
 return {...spec,actions:spec.actions.map(x=>({...x,model:x.model||spec.pattern}))};
}
export function chooseShortRound(spec,random=Math.random){
 const pool=spec.actions.map((item,index)=>({...item,sourceIndex:index}));
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 let round=pool.slice(0,3);
 if(spec.ordered&&spec.actions.length>3){const end=spec.actions.length-1;round=pool.filter(x=>x.sourceIndex!==end).slice(0,2).concat({...spec.actions[end],sourceIndex:end});}
 if(spec.ordered)round.sort((a,b)=>a.sourceIndex-b.sourceIndex);
 return round;
}
export class ShortSession{
 constructor(spec,random=Math.random){this.spec=spec;this.round=chooseShortRound(spec,random);this.done=new Set();this.state='play';this.current=null;this.elapsed=0;this.approved=false;}
 choose(index){if(this.state!=='play'||this.done.has(index)||!this.round[index])return false;this.current=index;this.state='animation';this.elapsed=0;return true;}
 tick(dt){if(this.state!=='animation')return false;this.elapsed+=dt;if(this.elapsed<2.2)return false;this.state='practice';return true;}
 continue(){if(this.state!=='practice')return false;this.done.add(this.current);this.state=this.done.size===this.round.length?'show':'play';return true;}
 approve(){if(this.state!=='show'||this.approved)return false;this.approved=true;this.state='done';return true;}
}
export class ShortWorld{
 constructor(scene,kit,spec,round){this.kit=kit;this.spec=spec;this.round=round;this.root=new THREE.Group();this.root.name='Open story park';scene.add(this.root);this.balloons=[];this.npcs=[];this.stations=[];this.effects=[];this.time=0;this.build();}
 model(word){return PhonicsWorld.prototype.model.call({kit:this.kit,animations:[]},word);}
 friend(color,index=0,elder=false){const {orb,rod,cyl}=this.kit,g=new THREE.Group();g.userData.helper=true;
 orb(color,0,.9,0,.46,.6,.35,g);orb(color,0,1.65,.04,.48,.45,.38,g);
 for(const s of [-1,1]){orb(0xfffcf1,s*.16,1.73,.38,.13,.15,.07,g);orb(0x263a51,s*.16,1.73,.445,.055,.075,.035,g);orb(0xf38b99,s*.32,1.53,.35,.09,.055,.03,g);orb(color,s*.52,1.0,.03,.17,.28,.16,g);orb(0x477380,s*.23,.2,.13,.23,.19,.28,g);}
 rod(0x7c4d48,[-.14,1.48,.39],[0,1.42,.43],.025,g);rod(0x7c4d48,[0,1.42,.43],[.14,1.48,.39],.025,g);
 for(const s of [-1,1])orb(color,s*.26,2.12,.02,index%3===2?.24:.16,index%3===2?.17:.36,.13,g).rotation.z=s*.3;
 orb(0xf3b37d,0,1.57,.43,.10,.08,.08,g);
 if(index===3)cyl(0xeac96a,0,2.1,0,.57,.12,g);
 if(index===4){rod(0x81a688,[0,2.1,0],[0,2.55,0],.025,g);orb(0xf4d66b,0,2.6,0,.16,.16,.16,g);}
 if(elder){cyl(0xecc785,0,2.05,0,.54,.08,g);orb(0xf6dcc2,0,2.15,0,.38,.18,.28,g);}
 const scarf=cyl([0xf5c750,0xa58ad0,0xf7887b][index%3],0,1.28,0,.39,.12,g);g.userData.scarf=scarf;return g;}
 build(){const {orb,cube,cyl,rod,labelBoard}=this.kit,g=this.root;
 cyl(0x84c69b,0,-.32,0,29,.55,g);cyl(0xddeac1,0,-.025,1,14,.12,g);
 for(const x of [-7,0,7])cube(0xedd4ab,x,.04,1,3,.08,24,g);cube(0xedd4ab,0,.05,2,27,.08,3,g);
 // Open pavilions and a creek: scenery surrounds play without enclosing the child.
 for(const [x,z,c]of [[-13,-8,0x8cc6de],[0,-12,0xbaa7e2],[13,-8,0xf2b99e]]){
  cube(0xf5ead0,x,.15,z,7,.3,5,g);for(const dx of [-2.8,2.8])for(const dz of [-1.8,1.8])cyl(0xe4c18e,x+dx,2,z+dz,.12,4,g);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(5,2,4),new THREE.MeshStandardMaterial({color:c,roughness:.8}));roof.position.set(x,4.7,z);roof.rotation.y=Math.PI/4;g.add(roof);
  for(let i=0;i<5;i++)orb([0xf6c960,0xdb88a5,0x8fbad6][i%3],x-2+i,3.5,z+1.9,.14,.2,.12,g);
 }
 labelBoard(this.spec.title,0,4.6,-10,6.8,g);
 cyl(0x74c7dc,15,.08,3,4.2,.12,g);for(let i=0;i<10;i++)orb(0xe5d5af,15+Math.cos(i*.63)*4.3,.13,3+Math.sin(i*.63)*4.3,.45,.25,.38,g);
 for(let i=0;i<8;i++)cube(0xd8ac77,11+i*.65,.24,3, .6,.18,2,g);
 for(let i=0;i<18;i++){const angle=i/18*Math.PI*2,r=23+(i%3);const x=Math.cos(angle)*r,z=Math.sin(angle)*r;cyl(0xae805e,x,1.6,z,.22,3.2,g);orb([0x78ad7b,0x91bd82,0xafd28a][i%3],x,3.8,z,1.8,2,1.6,g);}
 for(let i=0;i<65;i++){const x=Math.sin(i*7.1)*23,z=Math.cos(i*3.9)*20;if(Math.abs(x)<10&&z>-7&&z<7)continue;rod(0x6c9b68,[x,0,z],[x,.45,z],.025,g);orb([0xf7c65c,0xe995b7,0xc4b6eb][i%3],x,.5,z,.13,.13,.10,g);}
 for(let i=0;i<7;i++){const b=new THREE.Group();b.position.set(-15+i*5,5+i%2,-6-i%3);orb([0xeea6bf,0x8ac8e3,0xf4ce73][i%3],0,0,0,.48,.62,.45,b);rod(0xe2ceb0,[0,-.5,0],[0,-2,0],.016,b);g.add(b);this.balloons.push(b);}
 for(let i=0;i<5;i++){const npc=this.friend([0xf1ba78,0x97c7d5,0xb8a5df,0xadd184,0xeea9bc][i],i);npc.position.set(-14+i*7,0,-4-(i%2)*3);g.add(npc);this.npcs.push({root:npc,base:npc.position.clone(),phase:i*1.7});}
 this.round.forEach((item,i)=>this.station(item,i));
 // Theme landmarks help every park feel like its own story.
 if(this.spec.theme==='theatre'||this.spec.theme==='music'){cube(0xb797cb,0,.3,-6,8,.6,4,g);for(const s of [-1,1]){cube(0xd36a95,s*3,2,-7,1,3.3,.2,g);cyl(0xf0cd7e,s*4,2,-7,.1,4,g);}labelBoard('The little show',0,3.7,-7,3.7,g);}
 if(this.spec.theme==='rabbit'){this.rabbit=this.friend(0xf0e6d5,1);this.rabbit.scale.setScalar(.75);this.rabbit.position.set(-4,0,4);g.add(this.rabbit);labelBoard('Little Rabbit',0,3,0,2.8,this.rabbit);}
 if(this.spec.theme==='picnic')this.kitchen();
 }
 station(item,index){const {orb,cube,cyl,rod,labelBoard}=this.kit,root=new THREE.Group(),g=this.root;root.position.set([-7,0,7][index],0,[-1,-6,0][index]);g.add(root);
 const model=new THREE.Group();root.add(model);const base=cyl([0xe9c38e,0xb6b5df,0x8fc9ba][index],0,.15,0,1.75,.3,root);base.userData.shortIndex=index;
 let prop=this.model(item.word);
 if(['cat','comparison'].includes(this.spec.theme)||this.spec.theme==='hideaway')prop=this.model(item.word==='dog'?'dog':item.word==='elephant'?'elephant':item.word==='goose'?'goose':'cat');
 if(this.spec.theme==='play'){prop=new THREE.Group();orb(0xe85d61,0,.65,0,.48,.48,.48,prop);if(item.kind==='hide'){cube(0xcba97e,0,.6,-.35,2,.16,.85,root);for(const x of [-.8,.8])cube(0xa8825c,x,.3,-.35,.12,.6,.7,root);}}
 if(this.spec.theme==='music')prop=this.friend(0xb8cde5,index);
 if(!prop.children.length)this.customProp(prop,item.word,index);
 if(this.spec.theme==='theatre')prop.scale.setScalar(item.word==='elephant'?1.4:item.word==='cat'?.8:1);model.add(prop);model.position.y=.32;root.userData.shortIndex=index;
 labelBoard(item.word,0,2.7,0,2.4,root);if(this.spec.theme==='garden')labelBoard(item.word[0].toUpperCase()+' '+item.word[0].toLowerCase(),1.65,1.2,0,1.2,root);const action=labelBoard(item.action,0,3.25,0,4.4,root);if(action)action.userData.shortIndex=index;
 const helper=this.friend([0xeab779,0x91c8c4,0xc3a5df][index],index);helper.position.set(-2.2,0,-.4);root.add(helper);
 const star=orb(0xffd66a,0,2.1,0,.13,.18,.13,root);
 const station={root,model,helper,item,base,star,home:model.position.clone(),index,done:false};this.stations.push(station);this.context(station);
 }
 context(s){const {cube,cyl,orb,rod}=this.kit,g=s.root,w=s.item.word,theme=this.spec.theme;
 if(w==='apple'){cyl(0xad805a,-.7,1.6,-1,.16,3.2,g);orb(0x7fb869,-.7,3,-1,1.25,1.2,.95,g);for(const x of [-1.3,-.3])orb(0xec7160,x,2.5,-.4,.2,.2,.2,g);}
 if(w==='ant'){cube(0x87cfdf,0,.12,0,5,.08,1.6,g);for(let i=0;i<9;i++)cube(0xc79a6c,-2+i*.5,.28,0,.46,.12,1.8,g);}
 if(w==='butterfly'){for(let i=0;i<8;i++){const x=Math.sin(i*2)*1.4,z=Math.cos(i*2)*1.1;rod(0x73a169,[x,.1,z],[x,.7,z],.025,g);orb([0xf4bb78,0xdd91b8,0xaaa4dc][i%3],x,.75,z,.22,.17,.15,g);}}
 if(['train','school bus','bicycle'].includes(w)){cube(0xaeb8b8,0,.2,0,5,.08,2,g);for(const z of [-.6,.6])cube(0x77695e,0,.27,z,5,.06,.07,g);}
 if(w==='boat'){cyl(0x75c7dc,0,.2,0,2.2,.1,g);}
 if(w==='airplane'){cube(0x9fa9bd,0,.2,0,6,.08,2,g);for(let x=-2;x<=2;x++)orb(0xf5d06b,x,.3,1,.08,.08,.08,g);}
 if(theme==='art'){cube(0xcda477,0,.3,0,3.5,.2,2.4,g);cube(0xfff5dc,0,.42,.1,2.9,.035,2,g);}
 if(theme==='gallery'){const frame=new THREE.Group();frame.position.set(1.1,1.5,-.5);g.add(frame);cube(0xf3d18c,0,0,0,1.9,2.1,.12,frame);cube(0xedb4c1,0,0,.08,1.65,1.85,.03,frame);const face=this.friend(0xd3af9a,s.index,w.startsWith('grand'));face.scale.setScalar(.55);face.position.set(0,-.8,.15);frame.add(face);}
 if(theme==='hideaway'||theme==='play'){
  if(s.item.kind==='hide'){s.model.visible=false;const cover=new THREE.Group();g.add(cover);s.cover=cover;
   if(w==='basket'||w==='flowerpot'){cyl(w==='basket'?0xd5ad7e:0xde9c7c,0,.65,0,1,1.2,cover);for(let i=0;i<3;i++)orb(0x8db477,(i-1)*.35,1.4,0,.25,.6,.2,cover);}
   else{cube(0xcba57a,0,1,0,2.7,.22,1.1,cover);for(const x of [-1,1])cube(0xa5825e,x,.5,0,.15,1,.8,cover);}
  }
  if(w==='slide'){const slide=cube(0x87b8d5,0,.9,0,1.5,.12,3.2,g);slide.rotation.x=.5;for(const x of [-.8,.8])rod(0xe8c776,[x,0,-1.4],[x,2,-1.4],.08,g);}
  if(w==='fountain'){cyl(0x82cbd8,0,.3,0,1.5,.4,g);for(let i=0;i<6;i++)orb(0xc1e9ec,Math.sin(i)*.7,.7+Math.cos(i)*.2,Math.cos(i)*.7,.09,.26,.09,g);}
 }
 if(theme==='rabbit'&&s.item.kind==='gift'){const tiny=this.friend(0xe3b6a2,2,true);tiny.position.set(2.3,0,-.5);g.add(tiny);s.recipient=tiny;}
 }
 customProp(g,word,index){const {orb,cube,cyl,rod}=this.kit;
 if(word==='apple'){orb(0xdf625b,-.22,.8,0,.5,.55,.45,g);orb(0xdf625b,.22,.8,0,.5,.55,.45,g);rod(0x977356,[0,1.15,0],[.1,1.65,0],.05,g);orb(0x7faf68,.3,1.6,0,.25,.09,.14,g);return;}
 if(word==='butterfly'){for(const side of [-1,1]){orb(0xe7a1cc,side*.55,1,0,.55,.65,.08,g);orb(0x9fc6e0,side*.45,.45,0,.42,.4,.08,g);}orb(0x765c8f,0,.85,.05,.13,.6,.13,g);return;}
 if(word==='carrot'){const carrot=new THREE.Mesh(new THREE.ConeGeometry(.5,2,12),new THREE.MeshStandardMaterial({color:0xf39543}));carrot.rotation.z=-.45;carrot.position.y=1.1;g.add(carrot);for(const s of [-1,0,1])orb(0x71af63,s*.2,2.1,0,.15,.5,.12,g);return;}
 if(word==='bicycle'){for(const x of [-.85,.85]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.55,.07,8,24),new THREE.MeshStandardMaterial({color:0x526477}));wheel.position.set(x,.6,0);g.add(wheel);for(const angle of [0,1.57]){const spoke=cube(0xc3d8da,x,.6,0,1,.025,.025,g);spoke.rotation.z=angle;}}for(const [a,b]of [[[-.85,.6,0],[0,.65,0]],[[0,.65,0],[-.25,1.35,0]],[[-.25,1.35,0],[-.85,.6,0]],[[-.25,1.35,0],[.5,1.3,0]],[[.5,1.3,0],[0,.65,0]],[[.5,1.3,0],[.85,.6,0]]])rod(0xe78f82,a,b,.055,g);cube(0x74647b,-.25,1.48,0,.5,.12,.23,g);rod(0x667c87,[.5,1.3,0],[.6,1.65,0],.045,g);rod(0x667c87,[.6,1.65,-.35],[.6,1.65,.35],.045,g);return;}
 if(['train','school bus','boat','airplane'].includes(word)){
  cube(word==='school bus'?0xf7c84b:0x73b9d6,0,.8,0,2.3,.8,1,g);if(word==='train'){cyl(0x576e8a,-.6,1.5,0,.17,.7,g);orb(0xeae2db,-.6,2,0,.35,.3,.3,g);cube(0x5d93b2,.65,1.4,0,.8,.8,1,g);}for(const x of [-.7,.1,.7])cube(0xd6f0ed,x,1.05,.52,.42,.4,.035,g);
  if(word==='airplane'){cube(0xe6c5dc,0,.85,0,4,.12,.8,g);cube(0xe6c5dc,-.8,1.3,0,.8,.15,1.5,g);}else if(word==='boat'){cube(0xee8d9f,0,.35,0,2.7,.3,1.2,g);rod(0xe1cda5,[0,1.1,0],[0,2.6,0],.04,g);cube(0xfff0cc,.45,2,0,.8,1,.07,g);}else for(const x of [-.8,.8])for(const z of [-.55,.55]){const wheel=cyl(0x526477,x,.35,z,.3,.12,g);wheel.rotation.x=Math.PI/2;}return;
 }
 if(['pencil','crayon'].includes(word)){cyl(word==='pencil'?0xe9c16d:0x8eaee0,0,1,0,.15,1.6,g);const tip=new THREE.Mesh(new THREE.ConeGeometry(.15,.4,8),new THREE.MeshStandardMaterial({color:0x755f52}));tip.position.y=2;g.add(tip);return;}
 if(word==='book'){cube(0x7baadb,0,.5,0,1.7,.2,1.2,g);cube(0xffedce,0,.62,0,1.55,.12,1.1,g);return;}
 if(word==='bag'||word==='basket'){cube(0xe4b86c,0,.6,0,1.2,1.1,.7,g);rod(0xa97d61,[-.5,1.2,0],[0,1.75,0],.06,g);rod(0xa97d61,[0,1.75,0],[.5,1.2,0],.06,g);return;}
 if(['grandma','grandpa','sister','brother'].includes(word)){g.add(this.friend(0xe8b7a3,index,word.startsWith('grand')));return;}
 if(['bread','rice','cookies','ice cream','juice','milk','water'].includes(word)){
  if(word==='bread')orb(0xdbb77e,0,.55,0,.65,.4,.4,g);
  else if(word==='cookies')for(let i=0;i<3;i++){cyl(0xd7ab75,(i-1)*.4,.4,0,.3,.13,g);for(let j=0;j<3;j++)orb(0x86634f,(i-1)*.4+Math.sin(j*2)*.12,.48,Math.cos(j*2)*.12,.04,.02,.04,g);}
  else if(word==='ice cream'){const cone=new THREE.Mesh(new THREE.ConeGeometry(.3,.65,10),new THREE.MeshStandardMaterial({color:0xcda470}));cone.rotation.z=Math.PI;cone.position.y=.5;g.add(cone);orb(0xe5b6cb,0,.95,0,.38,.37,.35,g);}
  else if(word==='rice'){orb(0x8baebc,0,.4,0,.6,.25,.45,g);orb(0xffedce,0,.58,0,.5,.08,.4,g);}
  else{cyl(word==='juice'?0xf0c36d:0xe1ece9,0,.7,0,.27,.9,g);rod(0x7fbdcc,[.05,1,0],[.18,1.5,0],.035,g);}return;
 }
 if(word==='bow'){for(const s of [-1,1])orb(0xe987a3,s*.3,.8,0,.35,.25,.15,g);orb(0xe987a3,0,.8,.05,.16,.16,.16,g);return;}
 // A pop-up present supports unknown public story words without asserting a photo detail.
 cube(0x98c8db,0,.6,0,1.2,1.1,1.1,g);cube(0xf1c46a,0,.6,.56,.18,1.1,.04,g);cube(0xf1c46a,0,1.18,0,1.3,.16,1.2,g);
 }
 kitchen(){const {cube,rod,labelBoard}=this.kit,g=this.root;this.fridge=new THREE.Group();this.fridge.position.set(-11,0,5);g.add(this.fridge);cube(0xc1d9d9,0,1.65,-.65,3,3.3,.18,this.fridge);for(const x of [-1.5,1.5])cube(0xc1d9d9,x,1.65,0,.12,3.3,1.4,this.fridge);for(const y of [.1,1.2,2.3,3.3])cube(0xe9eee8,0,y,0,3,.12,1.4,this.fridge);this.door=new THREE.Group();this.door.position.set(-1.5,0,.8);this.fridge.add(this.door);cube(0x9ebcc7,1.5,1.65,0,3,3.3,.16,this.door);rod(0xe9d1aa,[2.75,1,0],[2.75,2,0],.05,this.door);this.fridge.userData.fridge=true;labelBoard('Open the fridge',0,3.7,0,3.5,this.fridge);
 this.stations.forEach((s,i)=>{s.root.position.set(i===2?-5:-11,0,i===2?5:5);s.helper.visible=false;s.base.visible=false;s.star.visible=false;s.model.position.set(i===2?0:-.65,i===2?1.1: .3+i*1.1,0);s.model.scale.setScalar(.72);s.root.children.filter(o=>o!==s.model&&o!==s.helper&&o!==s.base&&o!==s.star).forEach(o=>o.visible=false);});
 this.stations.forEach((s,i)=>{const label=labelBoard(s.item.word,i===2?0:1.7,i===2?1.7:.65,.45,i===2?2.4:1.8,s.model);if(label)label.userData.shortFoodLabel=true;});
 cube(0xd7b182,-5,.9,5,3,.18,2,g);for(const x of [-6.2,-3.8])for(const z of [4.3,5.7])cube(0xb28d67,x,.45,z,.12,.9,.12,g);
 const baby=this.friend(0xf0cfac,1);baby.scale.setScalar(.65);baby.position.set(2,0,6);g.add(baby);this.baby=baby;labelBoard('Baby',2,2.1,6,2,g);
 }
 pick(ray){this.root.updateMatrixWorld(true);for(const hit of ray.intersectObject(this.root,true)){for(let node=hit.object;node&&node!==this.root;node=node.parent){if(node.userData.fridge)return {fridge:true};if(Number.isInteger(node.userData.shortIndex))return {index:node.userData.shortIndex};}}return null;}
 fridgeFocus(){return {key:'short-fridge',point:this.fridge.position.clone().add(new THREE.Vector3(0,1.65,0)),approach:this.fridge.position.clone().add(new THREE.Vector3(0,0,2.5)),width:4,height:3.6,hold:true,force:true,frontView:true,subjects:[]};}
 focus(index){const s=this.stations[index];return {key:'short-'+index,point:s.model.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,1,0)),approach:s.root.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,0,2)),width:3,height:3,force:true,hold:true,subjects:s.helper.visible?[s.helper]:[],frontView:this.spec.theme==='picnic'};}
 tick(dt,session,{reduced=false}={}){this.time+=dt;const t=this.time;if(this.rabbit){const target=session.current===null?new THREE.Vector3(-4,0,4):this.stations[session.current].root.position.clone().add(new THREE.Vector3(2.6,0,1));this.rabbit.position.lerp(target,Math.min(1,dt*1.8));if(!reduced)this.rabbit.position.y=Math.abs(Math.sin(t*4))*.08;}for(const [i,b]of this.balloons.entries())if(!reduced)b.rotation.z=Math.sin(t*.6+i)*.07;
 for(const n of this.npcs){n.root.position.x=n.base.x+(reduced?0:Math.sin(t*.3+n.phase)*1.4);n.root.position.y=reduced?0:Math.abs(Math.sin(t*2+n.phase))*.055;n.root.rotation.y=Math.sin(t*.5+n.phase)*.4;}
 if(this.baby&&this.babyCheer>0){this.babyCheer=Math.max(0,this.babyCheer-dt);this.baby.position.y=reduced?0:Math.abs(Math.sin(this.babyCheer*9))*.25;}
 if(this.door){const to=this.open?-2.35:0;this.door.rotation.y+=(to-this.door.rotation.y)*Math.min(1,dt*7);}
 for(const s of this.stations){s.star.visible=!session.done.has(s.index)&&this.spec.theme!=='picnic';s.star.position.y=2.1+(reduced?0:Math.sin(t*2+s.index)*.16);s.helper.rotation.y=Math.sin(t*.7+s.index)*.15;}
 if(session.state!=='animation')return;const s=this.stations[session.current],u=Math.min(1,session.elapsed/2.2),w=reduced?0:Math.sin(u*Math.PI),kind=s.item.kind;
 s.model.visible=true;s.model.position.copy(s.home);if(reduced){s.model.scale.setScalar(1);s.model.rotation.set(0,0,0);if(s.cover)s.cover.visible=false;return;}if(s.cover)s.cover.position.y=Math.sin(u*Math.PI)*1.4;
 if(this.spec.theme==='picnic'){s.model.position.y+=w*.8;if(this.baby)this.baby.rotation.z=Math.sin(u*Math.PI*4)*.08;}
 else if(['fly','hop','bounce','splash','dance','hide'].includes(kind)){s.model.position.y+=w*(kind==='fly'?3:1.2);s.model.rotation.y=u*Math.PI*2;if(kind==='hide')s.model.scale.setScalar(.35+.65*Math.min(1,u*4));}
 else if(['roll','walk','ride','sail'].includes(kind)){s.model.position.x=Math.sin(u*Math.PI*(kind==='walk'?1:2))*2.5;s.model.rotation.y=Math.sin(u*Math.PI*2)*.6;}
 else if(kind==='grow'){s.model.scale.setScalar(.3+u*.7);s.model.position.y+=w*.8;}
 else if(kind==='draw'){s.model.rotation.z=Math.sin(u*10)*.6;if(!s.art){s.art=this.kit.orb(0xf0b6d3,0,.4,.8,1.5,.1,1.2,s.root);}s.art.scale.setScalar(Math.max(.1,u));}
 else if(kind==='point'){s.helper.rotation.z=Math.sin(u*8)*.12;s.model.rotation.z=Math.sin(u*8)*.12;}
 else if(kind==='photo'){s.model.rotation.y=Math.sin(u*8)*.15;}
 else{s.model.position.y+=w;s.model.rotation.z=Math.sin(u*7)*.25;if(s.recipient)s.model.position.x=u*1.5;}
 }
 stop(){this.root.visible=false;}
 dispose(){const geometries=new Set(),materials=new Set();this.root.traverse(o=>{if(o.geometry&&!this.kit.sharedGeometry?.(o.geometry))geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])if(!this.kit.sharedMaterial?.(m))materials.add(m);});geometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();});this.root.removeFromParent();}
}
export function shortPublicLines(){const list=Object.entries(SHORT_ADVENTURES).map(([id])=>shortSpec(id));for(const key of ['transport','stationery','gallery'])list.push(shortSpec(key,null,{[key]:key}));return [...new Set(list.flatMap(s=>[s.intro,s.ending,...s.actions.map(a=>a.model)]))];}
