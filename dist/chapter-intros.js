import * as THREE from './assets/three.module.js';
import {homeModel} from './home-models.js?v=74a';
import {poseToy} from './toy-play.js?v=74a';
export const CHAPTER_INTROS={
 ball:{title:'Discovery Playroom',lines:['A bouncy ball has rolled away!','Search the room together and tell your friend where it is.'],toy:'toy-blocks',kind:'ball'},
 letters:{title:'Letter Garden',lines:['Four little surprises need a home.','Find their letters, carry each surprise, and help our garden grow!'],toy:'toy-blocks',kind:'garden'},
 phonics:{title:'Sound Safari Park',lines:['Our park friends are playing with sounds!','Listen for a starting sound, then explore and find its word.'],toy:'toy-duck',kind:'sound'},
 body:{title:'Boogie Bandstand',lines:['The band is ready, but our dance needs your help!','Find the body parts, use your voice, and make a happy beat.'],toy:'toy-drum',kind:'dance'},
 wants:{title:'Little Playhouse',lines:['Baby is wondering what to eat.','Open the fridge, choose three foods to try, then help with milk.'],toy:'toy-duck',kind:'food'},
 cat:{title:'Cat’s Hideaway',lines:['Cat has a very sneaky hiding place!','Look under, on and behind things. Can you find our playful friend?'],toy:'toy-duck',kind:'cat'},
 comparison:{title:'Abby’s Toy Theatre',lines:['The toy actors are waiting behind the curtain!','Start their show, discover how they move, and choose your favourite.'],toy:'toy-train',kind:'theatre'},
 'mac-c9e229cf29d0c0d0':{title:'Rabbit’s Farm',lines:['Little Rabbit has a very big gift for Grandma!','Grow it, carry it safely, and meet one surprise animal on the way.'],toy:'toy-bus',kind:'carrot'},
 'mac-02e90911c657d5ac':{title:'Stationery Studio',lines:['Pip’s class is getting ready for show-and-tell.','Make a picture and play Clover’s sticker game.'],toy:'toy-bus',kind:'stationery'},
 'transportation':{title:'Transportation Toy Parade',lines:['The toy vehicles are ready for an adventure!','Help them travel by road, water and air, then choose your own ride.'],toy:'toy-rocket',kind:'travel'}
};
export class ChapterIntro{
 constructor(scene,kit){this.kit=kit;this.root=new THREE.Group();this.root.visible=false;scene.add(this.root);this.active=false;}
 start(key,fallback,visual=null){this.doors=null;this.spec=CHAPTER_INTROS[key]||fallback;this.root.clear();this.root.position.set(0,0,2);this.root.visible=true;this.active=true;this.elapsed=0;this.duration=8;this.line=0;const {orb,cube,cyl,rod}=this.kit,g=this.root;
 cyl(0xf2d690,0,.04,0,2.5,.08,g);this.prop=new THREE.Group();g.add(this.prop);this.prop.scale.setScalar(2);this.toy=new THREE.Group();const item=visual||homeModel(this.spec.toy||'toy-blocks',this.kit);item.position.set(0,0,0);item.visible=true;this.toy.add(item);this.prop.add(this.toy);if(visual)this.prop.scale.setScalar(this.spec.kind==='carrot'?1.2:1.5);
 this.special=new THREE.Group();g.add(this.special);const kind=this.spec.kind;
 if(kind==='ball')orb(0xe97358,0,.5,.5,.42,.42,.42,this.special);
 if(kind==='garden'){for(const s of[-1,1]){rod(0x669c6a,[s,0,0],[s,1.5,0],.05,this.special);for(let i=0;i<5;i++)orb(0xed99b2,s+Math.sin(i*1.26)*.22,1.5+Math.cos(i*1.26)*.22,0,.15,.15,.1,this.special);}}
 if(kind==='carrot'){const carrot=new THREE.Mesh(new THREE.ConeGeometry(.3,1.5,16),new THREE.MeshStandardMaterial({color:0xf18f45}));carrot.rotation.z=Math.PI/2;this.special.add(carrot);for(let i=0;i<3;i++)rod(0x65a268,[-.7,0,0],[-1.2,.25*(i-1),0],.06,this.special);this.special.position.y=1.1;}
 if(kind==='theatre'||kind==='cat'||kind==='food'){this.doors=[-1,1].map(s=>cube(kind==='theatre'?0xb86f91:0x9dc5bd,s*.7,1.2,-.2,1.4,2.4,.12,this.special));}
 this.stars=Array.from({length:7},(_,i)=>orb(i%2?0xf5c968:0x8accc4,Math.sin(i)*2,1+Math.cos(i),.2,.09,.09,.09,g));return this.spec;
 }
 tick(dt,{paused=false,reduced=false}={}){if(!this.active||paused)return false;this.elapsed=Math.min(this.duration,this.elapsed+dt);this.line=this.elapsed<this.duration/2?0:1;const t=this.elapsed,u=(t%4)/4;poseToy(this.toy,this.spec.toy,u,reduced);const bounce=reduced?0:Math.abs(Math.sin(t*2));if(this.spec.kind==='ball')this.special.position.set(Math.sin(t)*1.2,bounce*1.2,0);if(this.spec.kind==='garden')this.special.scale.setScalar(reduced?1:.35+Math.min(1,t/5)*.65);if(this.spec.kind==='carrot')this.special.rotation.z=reduced?0:Math.sin(t*3)*.12;if(this.spec.kind==='food')this.toy.position.y=reduced?0:Math.sin(t*2)*.045;if(this.doors)this.doors.forEach((d,i)=>d.position.x=(i?1:-1)*(.7+Math.min(1,t/3)*1.2));this.stars.forEach((o,i)=>o.position.y=1.4+(reduced?0:Math.sin(t*2+i)*.4));return this.elapsed===this.duration;}
 stop(){this.active=false;this.root.visible=false;}
}
