import * as THREE from './assets/three.module.js';
export const NPC_REACTION_SECONDS=8;
export const NPC_SEARCH_SPEED=.34;
export const ANIMAL_WORDS=new Set(['ant','bear','cat','dog','elephant','fish','goose','hen']);
export class PhonicsParkLife{
 constructor(world){this.world=world;this.kit=world.kit;this.root=new THREE.Group();world.root.add(this.root);this.agents=[];this.guide=null;this.card=null;this.elapsed=0;this.delay=NPC_REACTION_SECONDS;this.buildHelpers();}
 buildHelpers(){const {orb,cube,cyl}=this.kit;['Pip','Toby','Milo'].forEach((name,i)=>{const actor=new THREE.Group(),color=[0x8fbcb2,0xd8ac88,0xa9a6ce][i];orb(color,0,.75,0,.31,.4,.23,actor);orb(color,0,1.35,0,.36,.31,.25,actor);for(const s of[-1,1]){orb(0xfff9df,s*.12,1.39,.23,.095,.105,.045,actor);orb(0x304c46,s*.12,1.38,.27,.036,.047,.025,actor);}orb(0x8f725b,0,1.20,.25,.09,.022,.02,actor);const arms=[],legs=[];for(const s of[-1,1]){const arm=new THREE.Group();arm.position.set(s*.31,.96,0);orb(color,s*.08,-.16,0,.10,.24,.10,arm);actor.add(arm);arms.push(arm);const leg=new THREE.Group();leg.position.set(s*.16,.4,0);orb(0x6d8e80,0,-.15,.05,.12,.24,.17,leg);actor.add(leg);legs.push(leg);}cyl(i===1?0xc99a5e:0x7e9f83,0,1.68,0,.24,.08,actor);actor.userData.helper={arms,legs};this.root.add(actor);this.agents.push({name,actor,index:i,external:false,speed:NPC_SEARCH_SPEED,goal:new THREE.Vector3(),home:new THREE.Vector3()});});}
 bindGuide(actor){this.guide=actor;const old=this.agents.find(a=>a.external);if(old){const pos=old.actor.position.clone();old.actor=actor;old.name=actor.userData.spec?.name||'Guide';actor.position.copy(pos);return;}else this.agents.push({name:actor.userData.spec?.name||'Guide',actor,index:3,external:true,speed:.30,goal:new THREE.Vector3(),home:new THREE.Vector3()});this.resetAgents();}
 resetAgents(){const spots=[[-5,4.7],[5,4.6],[0,1.4],[6.7,2.7]];for(const a of this.agents){a.home.set(spots[a.index][0],0,spots[a.index][1]);a.actor.position.copy(a.home);a.goal.copy(a.home);a.velocity=0;a.stride=a.index*1.7;a.rest=.4+a.index*.37;a.searchTarget=null;}this.clearCard();this.elapsed=0;this.task=null;}
 onClue(task){this.task=task;this.elapsed=0;this.delay=NPC_REACTION_SECONDS;this.clearCard();for(const a of this.agents){a.searchTarget=null;a.goal.copy(a.actor.position);}if(task.kind==='card-word')this.showCard(task.word);}
 waitLonger(){this.delay=Math.max(this.delay,this.elapsed+10);}
 clearCard(){if(this.card){this.card.removeFromParent();this.world.release(this.card);this.card=null;}this.holder=null;}
 showCard(word){this.holder=this.agents[0];const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=360;const c=canvas.getContext('2d');c.fillStyle='#fff9e6';c.fillRect(0,0,1024,360);c.strokeStyle='#e2b655';c.lineWidth=18;c.strokeRect?.(12,12,1000,336);let size=160,text=word[0].toUpperCase()+word.slice(1);c.font=`bold ${size}px Arial`;while(c.measureText(text).width>900&&size>50){size-=4;c.font=`bold ${size}px Arial`;}c.textBaseline='middle';const width=c.measureText(text).width,x=(1024-width)/2;c.fillStyle='#db642e';c.fillText(text[0],x,185);c.fillStyle='#244e55';c.fillText(text.slice(1),x+c.measureText(text[0]).width,185);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const card=new THREE.Group(),back=new THREE.Mesh(new THREE.BoxGeometry(2.9,1.05,.065),new THREE.MeshStandardMaterial({color:0xe5c376})),front=new THREE.Mesh(new THREE.PlaneGeometry(2.82,.99),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));front.position.z=.043;card.add(back,front);card.position.set(0,2.7,.12);card.userData={word,initial:text[0],initialColor:'#db642e',remainderColor:'#244e55',holder:this.holder.name};this.holder.actor.add(card);this.card=card;this.holder.actor.position.set(0,.3,-3.5);this.holder.actor.rotation.y=0;this.holder.velocity=0;this.holder.goal.copy(this.holder.actor.position);}
 tick(time,dt,{paused=false,playing=true,camera,player}={}){
  if(!paused){
   this.elapsed+=dt;
   for(const agent of this.agents)this.walk(agent,dt,playing,player);
  }
  if(this.card&&camera){
   const inverse=this.holder.actor.getWorldQuaternion(new THREE.Quaternion()).invert();
   this.card.quaternion.copy(inverse).multiply(camera.quaternion);
  }
 }

 walk(agent,dt,playing,player){
  const {actor,goal,index}=agent,holding=agent===this.holder;
  if(holding){actor.position.set(0,.3,-3.5);actor.rotation.y=0;agent.velocity=0;return;}
  const searching=playing&&this.task&&this.elapsed>=this.delay+index*.28;
  if(holding)goal.set(0,0,2.1);
  else if(searching){
   const matches=this.world.entities.filter(e=>this.world.matchesCurrent(this.task,e));
   const target=matches[index%matches.length];
   if(target){
    agent.searchTarget=target;
    const angle=(index+.5)*Math.PI/2;
    goal.copy(target.root.position);
    goal.x+=Math.cos(angle)*1.75;
    goal.z+=Math.sin(angle)*1.75;
   }
  }else if(actor.position.distanceTo(goal)<.19){
   agent.rest-=dt;
   if(agent.rest<=0){
    const t=this.elapsed*.31+index*2.3;
    goal.set(agent.home.x+Math.sin(t)*1.45,0,agent.home.z+Math.cos(t*.79)*.95);
    agent.rest=1.2+index*.39;
   }
  }
  const direction=goal.clone().sub(actor.position).setY(0),distance=direction.length();
  direction.normalize();
  // Give passing companions and the player a little room.
  for(const other of [...this.agents.map(a=>a.actor),player]){
   if(!other||other===actor)continue;
   const away=actor.position.clone().sub(other.position).setY(0),gap=away.length();
   if(gap>.001&&gap<.95)direction.addScaledVector(away,(.95-gap)*1.8/gap);
  }
  const arrived=distance<.22;
  let heading=actor.rotation.y;
  if(!arrived)heading=Math.atan2(direction.x,direction.z);
  else if(holding)heading=0;
  else if(searching&&agent.searchTarget){
   const pos=agent.searchTarget.root.position;
   heading=Math.atan2(pos.x-actor.position.x,pos.z-actor.position.z);
  }
  const angle=heading-actor.rotation.y;
  const turn=Math.atan2(Math.sin(angle),Math.cos(angle));
  actor.rotation.y+=THREE.MathUtils.clamp(turn,-2.2*dt,2.2*dt);
  const pace=holding?.24:searching?agent.speed:.19;
  const desired=arrived?0:pace*Math.min(1,distance/.65)*Math.max(0,Math.cos(turn));
  agent.velocity+=(desired-agent.velocity)*(1-Math.exp(-4*dt));
  actor.position.x+=Math.sin(actor.rotation.y)*agent.velocity*dt;
  actor.position.z+=Math.cos(actor.rotation.y)*agent.velocity*dt;
  agent.stride+=agent.velocity*dt*(10+index*.5);
  const weight=agent.velocity/NPC_SEARCH_SPEED;
  actor.position.y=.016*weight*(1-Math.cos(agent.stride*2));
  const rig=actor.userData.helper||actor.userData;
  const blend=1-Math.exp(-5*dt);
  for(let i=0;i<2;i++){
   const swing=Math.sin(agent.stride+i*Math.PI)*weight;
   const leg=rig.legs?.[i],arm=rig.arms?.[i];
   if(leg)leg.rotation.x+=(swing*.29-leg.rotation.x)*blend;
   if(!arm)continue;
   let reach=-swing*.23,splay=(i?1:-1)*.09;
   if(holding){reach=-.4;splay=(i?1:-1)*.9;}
   else if(searching&&arrived&&i===0)reach=-1+.08*Math.sin(this.elapsed+index);
   else if(playing&&this.task&&!searching&&i===1)reach-=.32*(1+Math.sin(this.elapsed*.85+index));
   arm.rotation.x+=(reach-arm.rotation.x)*blend;
   arm.rotation.z+=(splay-arm.rotation.z)*blend;
  }
 }
}
