import * as THREE from './assets/three.module.js';
// Original extension scenes. These are invented play, separate from book events.
export const WORKSHOPS={
 phonics:{title:'Help Pip open the sound park',tool:'watering can',action:'Water the flowers',kind:'grow',question:'Can I water the flowers?',answer:'The flowers are growing.',talk:'I found a sound. I watered the flowers. The park is ready.'},
 letters:{title:'Make a welcome garden',tool:'seed basket',action:'Plant and water',kind:'grow',question:'Can I plant a seed?',answer:'This is a little flower.',talk:'I found an apple. I planted a seed. My flower is growing.'},
 body:{title:'Build your own boogie',tool:'drumsticks',action:'Play three beats',kind:'drum',question:'Can you clap with me?',answer:'I can move my hands and feet.',talk:'These are my hands. I can clap my hands. I like to dance.'},
 comparison:{title:'Raise the theatre curtain',tool:'star ticket',action:'Turn the stage handle',kind:'theatre',question:'Can I start the show?',answer:'The curtain is open. The toys can dance.',talk:'This is my favourite toy. It can move. I like the show.'},
 cat:{title:'Make a playground for Cat',tool:'ball of yarn',action:'Roll the yarn to Cat',kind:'cat',question:'Would you like to play?',answer:'The cat is chasing the yarn.',talk:'Cat was in the basket. This is a ball of yarn. Cat likes to play.'},
 'mac-c9e229cf29d0c0d0':{title:'A new garden for Rabbit',tool:'watering can',action:'Water a new seed',kind:'grow',question:'Can we grow another carrot?',answer:'We can share our carrots.',talk:'Rabbit carried a carrot. Grandma was happy. I helped Rabbit.'},
 ball:{title:'A ball celebration',tool:'ball pump',action:'Bounce the celebration ball',kind:'ball',question:'Can we play with the ball?',answer:'The ball can bounce very high.',talk:'I looked for the ball. I found it. Now we can play.'},
 wants:{title:'Tell Baby about your choices',talk:'I chose some food. The baby wanted milk. Now the baby is happy.'}
};
export class AdventureWorkshop{
 constructor(scene,kit){this.kit=kit;this.root=new THREE.Group();this.root.visible=false;scene.add(this.root);this.index=0;this.taps=0;this.effect=0;this.cooldown=0;this.active=false;}
 start(key){this.config=WORKSHOPS[key];if(!this.config)return false;this.root.clear();this.root.visible=true;this.active=true;this.index=0;this.taps=0;this.effect=0;this.cooldown=0;this.carry=null;
 if(!this.config.kind){this.index=3;return true;}
 const {cube,cyl,orb,rod,labelBoard}=this.kit,g=this.root;
 // Pip: an original seed-shaped helper with leaf ears, boots and a big smile.
 this.pip=new THREE.Group();this.pip.position.set(4,0,5);g.add(this.pip);
 orb(0xf4bd67,0,1,0,.48,.64,.35,this.pip);for(const s of[-1,1]){orb(0x75b5a0,s*.38,1.65,0,.18,.38,.09,this.pip).rotation.z=-s*.5;orb(0x353f51,s*.16,1.2,.32,.055,.08,.03,this.pip);orb(0xe8898c,s*.28,1.02,.32,.08,.045,.03,this.pip);orb(0x5a9b9a,s*.23,.25,.08,.22,.17,.28,this.pip);}rod(0x805448,[-.12,.91,.33],[0,.86,.36],.025,this.pip);rod(0x805448,[0,.86,.36],[.12,.91,.33],.025,this.pip);
 labelBoard('Pip · garden helper',4,2.3,5,2.6,g);
 this.tool=new THREE.Group();this.tool.position.set(-4,.9,5);g.add(this.tool);cyl(0xf0ce82,-4,.35,5,.65,.7,g);
 if(key==='letters'){cyl(0xc99f6a,0,.05,0,.4,.35,this.tool);for(let i=0;i<5;i++)orb(0xd9ac5c,Math.sin(i)*.25,.3,Math.cos(i)*.2,.07,.07,.07,this.tool);rod(0xa98154,[-.35,.2,0],[0,.65,0],.035,this.tool);rod(0xa98154,[0,.65,0],[.35,.2,0],.035,this.tool);}
 else if(this.config.kind==='grow'){cyl(0x70aeb6,0,0,0,.3,.5,this.tool);rod(0x70aeb6,[.2,0,0],[.72,.3,0],.09,this.tool);orb(0x91c5c5,0,.3,0,.25,.08,.2,this.tool);}
 else if(this.config.kind==='drum'){for(const s of[-1,1]){rod(0xd29e64,[s*.15,0,0],[s*.25,.65,0],.045,this.tool);orb(0xf0d49c,s*.25,.65,0,.1,.1,.1,this.tool);}}
 else orb(this.config.kind==='cat'?0xc38fce:0xf5d26c,0,.2,0,.3,.3,.3,this.tool);
 labelBoard(this.config.tool,-4,2.5,5,2.6,g);
 this.station=new THREE.Group();this.station.position.set(0,0,3.8);g.add(this.station);this.mobile=new THREE.Group();this.station.add(this.mobile);
 if(this.config.kind==='grow'){cyl(0xb88963,0,.22,0,.9,.44,this.station);this.sprout=new THREE.Group();this.mobile.add(this.sprout);rod(0x629b64,[0,.4,0],[0,1.9,0],.06,this.sprout);for(const s of[-1,1])orb(0x78ad68,s*.25,1.2+s*.2,0,.4,.16,.15,this.sprout).rotation.z=s*.4;orb(0xf4bc68,0,1.95,0,.28,.28,.28,this.sprout);this.sprout.scale.setScalar(.15);}
 if(this.config.kind==='drum'){cyl(0xb76677,0,.75,0,.75,1.3,this.station);this.skin=cyl(0xf9e0ab,0,1.43,0,.78,.09,this.mobile);}
 if(this.config.kind==='theatre'){cube(0xcfaa74,0,.2,0,3,.4,1.6,this.station);this.curtains=[-1,1].map(s=>cube(0xab557d,s*.65,1.5,0,1.3,2.5,.18,this.mobile));this.toy=orb(0x80b8b9,0,.7,.2,.38,.5,.3,this.station);}
 if(this.config.kind==='cat'){this.yarn=orb(0xc38fce,0,.35,0,.32,.32,.32,this.mobile);this.kitten=new THREE.Group();this.station.add(this.kitten);orb(0xedba76,-1,.5,-.2,.5,.35,.27,this.kitten);orb(0xedba76,-.65,.8,-.2,.28,.28,.24,this.kitten);for(const s of[-1,1]){orb(0xedba76,-.65+s*.16,1.05,-.2,.09,.2,.1,this.kitten);orb(0x35494b,-.65+s*.1,.84,.02,.04,.065,.025,this.kitten);}}
 if(this.config.kind==='ball')this.bounceBall=orb(0xe97358,0,.4,0,.4,.4,.4,this.mobile);
 this.drops=Array.from({length:12},(_,i)=>orb(0x84c9df,Math.sin(i)*.4,1,Math.cos(i)*.3,.045,.09,.045,this.station));this.drops.forEach(o=>o.visible=false);
 return true;
 }
 target(){return new THREE.Vector3(...(this.index===0?[-4,0,6.1]:this.index===1?[0,0,5.2]:[4,0,6.1]));}
 interact(position){if(!this.active||this.index>2||this.effect>0||this.cooldown>0||position.clone().setY(0).distanceTo(this.target())>=1.75)return false;this.cooldown=.4;if(this.index===0){this.carry=this.tool;this.index=1;return 'carry';}if(this.index===2)return 'talk';this.taps++;this.effect=1.3;return 'animate';}
 tick(dt,player,{paused=false,reduced=false}={}){if(!this.active||paused)return false;this.cooldown=Math.max(0,this.cooldown-dt);if(this.carry&&this.index===1){this.carry.position.copy(player.position).add(new THREE.Vector3(.55,1.25,.3));this.carry.rotation.z=this.effect?-.65:0;}
 if(!this.effect)return false;this.effect=Math.max(0,this.effect-dt);const u=1-this.effect/1.3,w=reduced?0:Math.sin(u*Math.PI);const k=this.config.kind;
 if(k==='grow'){this.sprout.scale.setScalar(.15+.85*Math.min(1,(this.taps-1+u)/3));this.drops.forEach((o,i)=>{o.visible=this.effect>0;o.position.y=.5+(1-(u+i/12)%1)*1.2;});}
 if(k==='drum')this.skin.scale.y=1-w*.6;
 if(k==='theatre'){this.curtains.forEach((o,i)=>o.position.x=(i?1:-1)*(.65+Math.min(1,(this.taps-1+u)/3)*.8));this.toy.position.y=.7+w*.4;}
 if(k==='cat'){this.yarn.position.x=reduced?this.taps*.25:Math.sin(u*Math.PI*2)*1.2;this.yarn.rotation.z=reduced?0:u*8;this.kitten.position.x=this.yarn.position.x*.65;this.kitten.position.y=w*.35;}
 if(k==='ball')this.bounceBall.position.y=.4+w*2;
 if(!this.effect&&this.taps>=3){this.index=2;this.carry=null;this.tool.visible=false;return true;}return false;
 }
 stop(){this.active=false;this.root.visible=false;}
}
