import {SceneGraphics} from './graphics.js?v=49';
import {HOME_GOODS, HOUSE_SLOTS, HOME_ITEM, canPlaceOnFloor, placeHouseItem, chooseBedItem} from './home-goods.js?v=49';
import {HOUSE_STATIONS, HOUSE_CAMERA_ZOOM, clampHouseCamera, houseRoute, shelfPageCount, shelfPageWords} from './town-house.js?v=50';
import {TownWorld, HOME, ROOM, TOWN_SPINE, TOWN_LOOP, TOWN_NAME, PLAY_LIMIT, TRAVEL_TIME, playBudget, townDestinations, townBounds, routeTo, routePoint} from './town.js?v=50';
import {loadFamilyStories,pairMac,syncFamilyStories,readFamilyStory} from './family-stories.js?v=36';
import {TRANSPORTATION,TransportationWorld} from './transportation.js';
import {RABBIT_STORY,DELIVERY_STEPS,RabbitDeliveryWorld} from './rabbit-delivery.js?v=37';
import {PARADES,ParadeHome,visitParades} from './comparison.js?v=35';
import {CatStoryWorld,CAT_TURNS} from './cat-story.js?v=28';
import {SOUND_MODELS} from './sound-models.js?v=20';
import {LivingEnvironment} from './environment.js?v=24';
import {PHONICS,PHONICS_LETTERS,PHONICS_WORDS,PHONICS_TAGS,validPhonicsPool,choosePhonicsPair,phonicsWords,createPhonicsTasks,phonicsMatches,phonicsSpeakingTarget} from './phonics.js?v=18';
import {PhonicsWorld} from './phonics-world.js?v=23';
import {addSignatureHair,chooseGuideName,replaceGuideText} from './character-design.js?v=34';
import {BODY_GROUPS,BODY_WORDS,BODY_START,validBodyWords,NOTE_CATEGORIES,noteMatches,reviewTags} from './body.js?v=21';
import {BodyMissionWorld,FACE_PARTS,createBodyMissions,missionLabel,missionSentence,missionQuestion,matchesBodyPart} from './body-world.js?v=16';
import * as THREE from './assets/three.module.js';
import {ART,artPath,loadArt} from './character-art.js?v=31';
import {LESSONS,ALPHABET_STEPS,letterMatches,shuffled,grantExperience,mysteryCandidates,claimMystery} from './learning.js?v=49';
import {VOCABULARY,wordPicture,reviewChoices,rememberWord,saveWordSet} from './vocabulary.js?v=17';
import {GardenMusic} from './music.js?v=21';
import {SHOP_ITEMS,isWearable,normalizeShop,awardStickers,buyItem,equipItem,stickerSVG,itemSVG,attachAccessory,clearAccessory,updateAccessoryPose} from './shop.js?v=49';
import {ParkTrailer,TRAILER_DURATION,parkShotAt,ACTION_TITLES} from './park-trailer.js?v=31';
import {createVocabularyRound} from './learning.js?v=49';
import {WANT_ITEMS,wantQuestion,wantOptions,wantAnswer,createWantRound,WantWorld} from './wants.js?v=11';
const $=id=>document.getElementById(id);
const CHARACTERS=[{name:'Elmo',color:0xd51b2d,nose:0xf18a22},{name:'Cookie Monster',color:0x155fac,nose:null},{name:'Grover',color:0x417eb4,nose:0xe48ca3},{name:'Rosita',color:0x41aea1,nose:0xebb45a},{name:'Zoe',color:0xf6ae32,nose:0xf07bab},{name:'Bert',color:0xe7c962,nose:0xe79a52},{name:'Ernie',color:0xe8a261,nose:0xe86346},{name:'Julia',color:0xf5d43c,nose:0xe8a13d},{name:'Oscar',color:0x7d9760,nose:null},{name:'Snuffleupagus',color:0x947154,nose:0x947154},{name:'Tamir',color:0xbb7a43,nose:0xee779c},{name:'Ji-Young',color:0xe4ae7d,nose:0xe46ba1},{name:'Baby Bear',color:0x995529,nose:0x352820},{name:'Abby Cadabby',color:0xf19ac2,nose:0xe96894}];
const DEFAULT={xp:0,level:1,unlocked:['Elmo','Cookie Monster','Rosita','Tamir','Grover'],journal:[],plays:{},lastPlace:'chair',pendingRewards:0,rewardChoices:null,musicEnabled:true,vocabulary:{},vocabularySets:[],pendingWordSaves:[],stickers:0,ownedItems:['bow','wand','hat'],equippedItem:null,wordSaveBatch:[]};
let data;try{data={...DEFAULT,...JSON.parse(localStorage.getItem('littleStreet.v1')||'{}')};if(!Array.isArray(data.unlocked)||!Array.isArray(data.journal)||typeof data.xp!=='number'||!data.plays||typeof data.plays!=='object')throw Error();}catch{data=structuredClone(DEFAULT)}
if(!data.vocabulary||typeof data.vocabulary!=='object'||Array.isArray(data.vocabulary))data.vocabulary={};if(!Array.isArray(data.vocabularySets))data.vocabularySets=[];if(!Array.isArray(data.pendingWordSaves))data.pendingWordSaves=[];
if(!Array.isArray(data.wordSaveBatch))data.wordSaveBatch=[];
data.unlocked=[...new Set([...data.unlocked,'Elmo','Cookie Monster','Rosita','Tamir','Grover'])];
data.ownedItems=[...new Set([...(data.ownedItems||[]),'bow','wand','hat'])];
normalizeShop(data);
let shopReturn='',shopView='shop',shopCategory='all';
let houseItemSelection='';
let storageOK=true;function save(){try{localStorage.setItem('littleStreet.v1',JSON.stringify(data));}catch{storageOK=false;toast('Progress could not be saved on this browser.')}}
let guideName='Rosita';
let selected=null,phase='landing',step=0,order=[],place='chair',helpCount=0,sound=true,modalKind='',rating=40,sessionToken=0,completed=false,newXP=0;
let cameraDrag=null;
let graphics;
const cameraOrbit={yaw:0,pitch:0,zoom:1};
let introElapsed=0,wideView=false,speechSerial=0,speechFinish=null;
let bodyWords=validBodyWords(data.bodyWords||BODY_START),bodyOrder=[],bodyIndex=0,bodyResults={},bodyWorld=null,bodyCloseView=false,bodyReturning=false;
let phonicsPool=validPhonicsPool(data.phonicsPool||PHONICS_LETTERS),phonicsPair=[],phonicsTasks=[],phonicsIndex=0,phonicsWorld=null,phonicsResults={},phonicsAudio=null,phonicsIntroTime=0,phonicsFocusEntity=null,phonicsFound=[],phonicsCardViewing=false;
let lesson='ball',alphaIndex=0,letterCorrect=false,xpUndo=null;
let alphaSteps=ALPHABET_STEPS.map(item=>({...item,z:-1.35}));
let wantWorld=null,wantRound=[],wantIndex=0,wantStage='opening',wantChoice='milk';
let garden,roomNodes=[],gardenItems=[],butterflyWings=[];
const INTRO_SECONDS=10;
const OPENING_PROMPT='Little child, seems that you could not find your ball. What should you ask?';
const music=new GardenMusic(()=>speechActive||speakingPhase());music.enabled=data.musicEnabled!==false;
let helperCast,guideSpot,ambientHelpers=[],reviewIndex=0,reviewOrder=[],bankSelection=new Set();
let speechActive=false,audioUnlocked=false,parentApprovalReady=false,lastApprovalAt=-Infinity;
const places={box:{name:'box',prep:'in',target:new THREE.Vector3(-4,0,1.1),ball:new THREE.Vector3(-4,.7,-1)},table:{name:'table',prep:'on',target:new THREE.Vector3(0,0,1.25),ball:new THREE.Vector3(0,2.05,-1.2)},chair:{name:'chair',prep:'under',target:new THREE.Vector3(4,0,1.05),ball:new THREE.Vector3(4,.36,-1.2)}};
const targetSentence=()=>`The ball is ${places[place].prep} the ${place}.`;
function need(level=data.level){return 180}
function lessonSummary(){if(lesson.startsWith('mac-'))return familyStory.title+' · '+familyStory.beats.map(b=>b.sentence).join(' ');if(lesson==='comparison')return 'Abby’s Toy Parade · '+paradeRounds.map(k=>PARADES[k].animals.map((n,i)=>'The '+n+' is '+PARADES[k].words[i]+'.').join(' ')).join(' ');if(lesson==='cat')return 'Can you see the cat? · '+CAT_TURNS.map(t=>t.sentence).join(' ');if(lesson==='phonics')return 'Sound Safari Phonics · '+phonicsPair.map(l=>l+' '+l.toLowerCase()+' /'+PHONICS[l].sound+'/').join(' · ')+' · '+phonicsWords(phonicsPair).join(', ');if(lesson==='body')return 'Body Boogie park missions · '+bodyWords.join(', ')+' · '+bodyOrder.map(missionSentence).join(' ');if(lesson==='wants')return 'What do you want? · Do you want cookies / bread / rice / ice cream / juice / milk? · I want '+wantChoice+'. · The baby wants milk.';return lesson==='letters'?'Vocabulary: apple, ant, ball, butterfly · A / a and B / b':targetSentence()}
function speakingPhase(){return ['family-say','parade-say','cat-say','ask','answer','alpha-say','want-say','body-say','phonics-say'].includes(phase)}
function speakingTarget(){if(phase==='family-say'&&lesson===TRANSPORTATION.id&&transportationWorld.picked)return transportationWorld.picked.description;if(phase==='family-say')return familyStory.beats[familyIndex].sentence;if(phase==='parade-say')return paradeSaid;if(phase==='cat-say')return CAT_TURNS[catIndex].sentence;if(phase==='phonics-say')return phonicsSpeakingTarget(currentPhonicsTask());if(phase==='body-say')return missionSentence(currentBodyMission());if(phase==='want-say')return wantSpeakingTarget();return phase==='alpha-say'?`${['apple','ant'].includes(alphaSteps[alphaIndex].word)?'An':'A'} ${alphaSteps[alphaIndex].word}.`:phase==='ask'?'Where is the ball?':targetSentence()}
function updateProgress(){$('levelLabel').textContent=`Level ${data.level}`;$('xpLabel').textContent=`${data.xp} / ${need()} XP`;$('xpFill').style.width=`${Math.min(data.xp/need()*100,100)}%`;$('friendCount').textContent=data.unlocked.length;$('bankCount').textContent=Object.keys(data.vocabulary||{}).length;$('frontBankCount').textContent=Object.keys(data.vocabulary||{}).length;$('musicButton').textContent=data.musicEnabled!==false?'♫ Music on':'♫ Music off';$('frontMusic').textContent=data.musicEnabled===false?'♫ Music off':audioUnlocked?'♫ Music on':'♫ Play music';$('frontMusic').setAttribute('aria-pressed',String(data.musicEnabled!==false&&audioUnlocked));$('frontStickerCount').textContent=data.stickers;$('navStickerCount').textContent=data.stickers;}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3300)}
function showModal(kind,html,wide=false){if(['plan','parent','body-plan','reward'].includes(kind))html=storyText(html);modalKind=kind;$('modal').className='modal'+(wide?' wide':'');$('modal').innerHTML=html;$('modalShade').hidden=false;stopInput();requestAnimationFrame(()=>{$('modal').querySelector('button')?.focus()})}
function closeModal(){if(townView==='town'&&phase==='home')cancelTownStoryPreview();$('modalShade').hidden=true;modalKind='';$('parentButton').focus();}
const closeHTML='<button class="close" id="closeModal" aria-label="Close panel">×</button>';
function wireClose(){$('closeModal')?.addEventListener('click',closeModal)}
function speak(text,after){
 stopPhonicsAudio();
 text=storyText(text);
 const serial=++speechSerial;window.speechSynthesis?.cancel();speechFinish=null;
 if(!sound||!('speechSynthesis'in window)){speechActive=false;after?.();return}
 const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.85;u.pitch=1;
 const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==='en-US'&&/Samantha|Aria|Jenny|Google US English/.test(v.name))||voices.find(v=>v.lang==='en-US')||null;
 let done=false;const finish=()=>{if(done||serial!==speechSerial)return;done=true;speechFinish=null;speechActive=false;after?.()};
 speechFinish=finish;u.onend=finish;u.onerror=finish;speechActive=true;speechSynthesis.speak(u);
 setTimeout(finish,Math.max(6500,text.length*180));
}
function stopSpeech(complete=false){stopPhonicsAudio();const finish=speechFinish;if(complete)finish?.();++speechSerial;window.speechSynthesis?.cancel();speechFinish=null;speechActive=false}
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
// Sculpted 3D puppet-style actors, with photographic references retained for the gallery.
const familyShelf=new Map();let familyProps=null,familyStops=[],familyIndex=0,familyStory=null;
let rabbitWorld=null,transportationWorld=null;
let paradeWorld,paradeRounds=[],paradeRound=0,paradeTurn=0,paradeMode='',paradePrompt='',paradeWord='',paradeSaid='',paradeFavorite=null;
let catWorld,catIndex=0,environment,scene,camera,renderer,player,rosita,ball,beacon,boxLid,door,portraits=Object.fromEntries(CHARACTERS.map(c=>[c.name,artPath(ART[c.name].file)])),clock=new THREE.Clock(),walkT=0;
const cameraGoal=new THREE.Vector3(),lookGoal=new THREE.Vector3(),lookCurrent=new THREE.Vector3(0,1,0);
const sphereGeo=new THREE.SphereGeometry(1,40,28),mats=new Map(),furCache=new Map();
function mat(color,roughness=.85){if(!mats.has(color))mats.set(color,new THREE.MeshStandardMaterial({color,roughness}));return mats.get(color)}
function mesh(geo,color,x,y,z,sx=1,sy=1,sz=1,parent=scene){const o=new THREE.Mesh(geo,mat(color));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
const boxCache=new Map();
function cube(c,x,y,z,w,h,d,parent=scene){const key=[w,h,d].join(',');let geo=boxCache.get(key);if(!geo){geo=new THREE.BoxGeometry(w,h,d,4,4,4);const pos=geo.getAttribute('position'),normals=geo.getAttribute('normal'),radius=Math.min(.09,Math.min(w,h,d)*.2),v=new THREE.Vector3(),core=new THREE.Vector3(),n=new THREE.Vector3();for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i);core.set(THREE.MathUtils.clamp(v.x,-w/2+radius,w/2-radius),THREE.MathUtils.clamp(v.y,-h/2+radius,h/2-radius),THREE.MathUtils.clamp(v.z,-d/2+radius,d/2-radius));n.copy(v).sub(core).normalize();v.copy(core).addScaledVector(n,radius);pos.setXYZ(i,v.x,v.y,v.z);normals.setXYZ(i,n.x,n.y,n.z)}boxCache.set(key,geo)}return mesh(geo,c,x,y,z,1,1,1,parent)}
function orb(c,x,y,z,sx,sy=sx,sz=sx,parent=scene){return mesh(sphereGeo,c,x,y,z,sx,sy,sz,parent)}
function cyl(c,x,y,z,r,h,parent=scene){return mesh(new THREE.CylinderGeometry(r,r,h,32),c,x,y,z,1,1,1,parent)}
function fur(parent,color,center,scale,count){
 // Curved, tapered yarn fibres; shared geometry keeps detailed puppets light enough for tablets.
 const pile=color===0xf19ac2?.31:1;
 const key=scale.join(',')+':'+count+':'+pile;let geo=furCache.get(key);
 if(!geo){const pos=[],colors=[];const up=new THREE.Vector3(0,1,0);
 for(let i=0;i<count;i++){
 const yy=1-2*(i+.5)/count,rr=Math.sqrt(1-yy*yy),a=i*2.39996323;
 const n=new THREE.Vector3(Math.cos(a)*rr,yy,Math.sin(a)*rr);
 const root=new THREE.Vector3(n.x*scale[0],n.y*scale[1],n.z*scale[2]);
 const tangent=new THREE.Vector3().crossVectors(n,Math.abs(yy)>.96?new THREE.Vector3(1,0,0):up).normalize();
 const bitangent=new THREE.Vector3().crossVectors(n,tangent).normalize();
 const length=pile*(.035+((i*37)%101)/101*.045),width=.0045+((i*13)%17)/17*.0035;
 const bend=Math.sin(i*1.73)*.55,brightness=.78+((i*29)%97)/97*.35;
 const rings=[];for(let j=0;j<4;j++){const u=j/3,r=width*(1-u*.93);const mid=root.clone().addScaledVector(n,length*u).addScaledVector(tangent,length*bend*u*u).addScaledVector(bitangent,-length*.25*u*u);
 const ring=[];for(let k=0;k<3;k++){const aa=k*Math.PI*2/3;ring.push(mid.clone().addScaledVector(tangent,Math.cos(aa)*r).addScaledVector(bitangent,Math.sin(aa)*r))}rings.push(ring)}
 for(let j=0;j<3;j++)for(let k=0;k<3;k++){const q=(k+1)%3;for(const v of[rings[j][k],rings[j+1][k],rings[j][q],rings[j][q],rings[j+1][k],rings[j+1][q]]){pos.push(v.x,v.y,v.z);colors.push(brightness,brightness,brightness)}}
 }geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();furCache.set(key,geo)}
 const material=new THREE.MeshStandardMaterial({color,vertexColors:true,roughness:1});const coat=new THREE.Mesh(geo,material);coat.position.set(...center);coat.receiveShadow=true;parent.add(coat);
}
function puppet(spec,detail=true){if(spec.name==='Snuffleupagus')return snuffyModel(spec);
 const g=new THREE.Group(),c=spec.color,cookie=spec.name==='Cookie Monster',bert=spec.name==='Bert',human=['Julia','Tamir','Ji-Young','Ernie','Bert','Gabrielle','Count von Count'].includes(spec.name),headX=bert?.43:cookie?.72:.61;
 orb(c,0,1.02,0,cookie?.57:.49,.65,.39,g);orb(c,0,2.01,.02,headX,bert?.72:.55,.49,g);
 if(detail&&!human){fur(g,c,[0,1.02,0],[cookie?.57:.49,.65,.39],2200);fur(g,c,[0,2.01,.02],[headX,bert?.72:.55,.49],3200)}
 const arms=[],legs=[];for(const side of[-1,1]){
 const arm=new THREE.Group();arm.position.set(side*.46,1.4,0);arm.rotation.z=side*.22;
 orb(c,side*.13,-.25,0,.17,.38,.18,arm);orb(c,side*.21,-.55,.035,.21,.18,.2,arm);
 if(detail&&!human){fur(arm,c,[side*.13,-.25,0],[.17,.38,.18],420);fur(arm,c,[side*.21,-.55,.035],[.21,.18,.2],240)}
 for(let f=0;f<4;f++)orb(c,side*.21+(f-1.5)*.075,-.67,.12,.047,.105,.052,arm);
 g.add(arm);arms.push(arm);
 const leg=new THREE.Group();leg.position.set(side*.23,.43,0);orb(c,0,-.11,0,.19,.32,.18,leg);orb(c,0,-.32,.16,.26,.15,.34,leg);if(detail&&!human)fur(leg,c,[0,-.11,0],[.19,.32,.18],350);g.add(leg);legs.push(leg);
 }
 const mouth=new THREE.Group();mouth.position.set(0,1.94,.6);
 const shape=new THREE.Shape();shape.moveTo(-.37,0);shape.quadraticCurveTo(0,.06,.37,0);shape.bezierCurveTo(.3,-.34,-.3,-.34,-.37,0);
 const abbyMouth=spec.name==='Abby Cadabby';
 if(abbyMouth){mouth.position.set(0,1.875,.511);mouth.scale.x=.84;}
 const rosyMouth=['Abby Cadabby','Julia','Zoe','Ernie','Bert'].includes(spec.name);
 const inside=new THREE.Mesh(new THREE.ShapeGeometry(shape,28),new THREE.MeshStandardMaterial({color:abbyMouth?0xdb5289:rosyMouth?0xa43049:0x30252b,roughness:1,side:THREE.DoubleSide}));mouth.add(inside);orb(abbyMouth?0xff8fb3:rosyMouth?0xed6c87:0xc96c71,0,abbyMouth?-.165:-.2,.016,abbyMouth?.158:rosyMouth?.20:.16,abbyMouth?.067:rosyMouth?.105:.05,.018,mouth);g.add(mouth);
 if(!abbyMouth)for(const side of[-1,1]){const ey=2.3+(cookie&&side===-1?.05:0);const eye=orb(0xfffdf2,side*.205,ey,.43,.215,.24,.185,g);eye.material=new THREE.MeshPhysicalMaterial({color:0xfffdf2,roughness:.23,clearcoat:.35});orb(0x162323,side*(cookie?.235:.155),ey-.015+(cookie&&side===1?.035:0),.607,.072,.091,.025,g);orb(0xffffff,side*(cookie?.235:.155)-.021,ey+.02,.63,.023,.027,.009,g)}
 if(!abbyMouth&&spec.nose!==null&&spec.name!=='Baby Bear')orb(spec.nose,0,2.055,.62,spec.name==='Grover'?.22:.18,bert?.28:['Zoe','Abby Cadabby'].includes(spec.name)?.13:.22,.17,g);
 if(spec.name==='Rosita'){for(let i=0;i<6;i++){const a=i*Math.PI/3;orb(0xf4cc59,.48+Math.cos(a)*.105,2.38+Math.sin(a)*.105,.31,.08,.08,.03,g)}orb(0xfff3c0,.48,2.38,.345,.055,.055,.035,g);for(let i=0;i<10;i++){const hair=orb(0x65c6b3,-.45+i*.1,2.49+(i%3)*.065,.015,.07,.19,.09,g);hair.rotation.z=(i-5)*-.13}}
 if(spec.name==='Bert')cube(0x39362b,0,2.47,.44,.5,.06,.08,g);
 if(spec.name==='Snuffleupagus')orb(c,0,1.7,.68,.16,.49,.18,g);

 if(['Bert','Ernie'].includes(spec.name)){const shirt=orb(spec.name==='Bert'?0x80a56a:0xcf4942,0,1.04,.015,.51,.55,.4,g);for(let j=0;j<5;j++){const stripe=mesh(new THREE.TorusGeometry(.46,.035,6,32),j%2?0xf4d56e:0x477b9c,0,.73+j*.14,.02,1,.75,1,g);stripe.rotation.x=Math.PI/2}}
 if(spec.name==='Zoe'){
  const gold=[0xf6ac30,0xfcc354,0xe89826];
  for(const side of [-1,1]){
   for(let i=0;i<19;i++){
    const u=i/18,lock=orb(gold[i%3],side*(.32+.21*u),2.32-.38*u,.14+.13*Math.sin(i),.045,.21,.045,g);
    lock.rotation.z=side*(.55+u*.6);
   }
   for(let i=0;i<8;i++){const tuft=orb(gold[i%3],side*(.08+i*.049),2.54,.02,.036,.16,.038,g);tuft.rotation.z=side*(.3+i*.09);}
   for(let j=0;j<4;j++){const angle=j*Math.PI/2;orb(side===1?0xe95370:0x947dc8,side*.54+Math.cos(angle)*.055,2.24+Math.sin(angle)*.055,.31,.044,.054,.025,g);}
  }
  mouth.scale.set(1.16,1.09,1);
  for(let i=0;i<15;i++){const angle=i*Math.PI*2/15;orb([0xe76790,0xa57cce,0xe98560][i%3],Math.sin(angle)*.38,1.53-.11*Math.cos(angle),Math.cos(angle)*.38,.054,.058,.05,g);}
 }
 if(spec.name==='Oscar'){const can=mesh(new THREE.CylinderGeometry(.55,.49,.95,32),0x929c99,0,.5,0,1,1,1,g);for(let j=0;j<12;j++){const a=j*Math.PI/6;cube(0xb3bcb7,Math.sin(a)*.52,.5,Math.cos(a)*.52,.035,.9,.035,g)}}
 addSignatureHair(g,spec.name,arms,orb,rod);g.userData={arms,legs,mouth,spec,pose:'file',ready:Promise.resolve()};return g;
}
function setCharacterPose(actor,pose){actor.userData.pose=pose;return Promise.resolve()}
function updateCharacter(actor,time,moving=false){const info=actor.userData,joy=info.pose==='joy',catching=phase==='intro';info.arms.forEach((arm,i)=>{arm.rotation.x=catching?-.8+Math.sin(time*4+i)*.3:moving?Math.sin(walkT+i*Math.PI)*.5:Math.sin(time*2+i)*.04;arm.rotation.z=joy?(i===0?-1.25:1.25):(i===0?-.22:.22);});info.legs.forEach((leg,i)=>leg.rotation.x=moving?Math.sin(walkT+i*Math.PI)*.28:0);info.mouth.scale.y=speechActive&&actor===rosita?.75+Math.abs(Math.sin(time*11))*.45:1;}
function refreshGuide(){const previousName=guideName;guideName=lesson==='comparison'?(selected==='Abby Cadabby'?'Grover':'Abby Cadabby'):chooseGuideName(selected,guideName);if(scene&&rosita){const old=rosita,position=old.position.clone(),rotation=old.rotation.clone();scene.remove(old);for(const material of old.userData.npcMaterials||[])material.dispose();rosita=puppet(CHARACTERS.find(c=>c.name===guideName));rosita.position.copy(position);rosita.rotation.copy(rotation);prepareNPCMaterials(rosita);scene.add(rosita);rosita.visible=old.visible&&lesson!==RABBIT_STORY.id;}for(const id of ['speakerName','dialogue','instruction']){const node=$(id);if(node)node.textContent=node.textContent.split(previousName).join(guideName).split(previousName.toUpperCase()).join(guideName.toUpperCase());}if(lesson==='phonics'&&phonicsWorld)phonicsWorld.bindGuide(rosita);const portrait=$('guidePortrait');if(portrait){portrait.src=portraits[guideName];portrait.alt=guideName+' — story guide';}}
function availableCharacters(){return CHARACTERS.filter(c=>data.unlocked.includes(c.name))}
function toyboxStar(){const shape=new THREE.Shape();for(let i=0;i<10;i++){const angle=Math.PI/2+i*Math.PI/5,r=i%2?.11:.24;const x=Math.cos(angle)*r,y=Math.sin(angle)*r;if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y)}shape.closePath();const star=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshStandardMaterial({color:0xf5d57e,roughness:.85,side:THREE.DoubleSide}));star.position.set(-4,.75,-.445);scene.add(star)}
const obstacles=[{x:-4,z:-1.25,w:1.3,d:1.05},{x:0,z:-1.2,w:1.6,d:1.3},{x:4,z:-1.2,w:.9,d:.95},{x:-7.6,z:1,w:1.1,d:2.3}];
function decorateRoom(){
 // Soft reading sofa, patchwork cushions, a second book nook, alphabet bunting and a sunlit door.
 cube(0x7fa9a4,-7.7,.75,1.5,1.4,1.15,4.2);cube(0x64988e,-8.25,1.5,1.5,.4,1.9,4.25);
 for(const z of[-.5,3.5])cube(0x79a89b,-7.65,1.2,z,1.65,.8,.35);
 for(let i=0;i<3;i++){cube(i%2?0xaac6b0:0x90b8a7,-7.55,1.4,.1+i*1.3,.85,.95,1.15);const pillow=cube(i%2?0xf1c86d:0xe5a4a1,-7.5,1.95,.15+i*1.3,.37,.68,.7);pillow.rotation.z=-.15;}
 cube(0xd2a573,-6.6,.5,5.1,1.7,1,1.1);cube(0xe6bf80,-6.6,1.05,5.1,1.85,.12,1.25);const book=cube(0x6c9d93,-6.6,1.16,5.1,.7,.1,.85);book.rotation.y=.25;
 const door=new THREE.Group();door.position.set(8.3,0,-5.8);cube(0xdcb96f,0,2.25,0,2.2,4.5,.18,door);cube(0x83aaa0,0,2.2,.13,1.88,4.15,.13,door);for(const x of[-.46,.46]){cube(0x9bbdb0,x,2.8,.24,.65,1.8,.045,door);cube(0x9bbdb0,x,1,.24,.65,.95,.045,door)}orb(0xdcb251,.65,2,.37,.09,.09,.09,door);scene.add(door);
 for(let i=0;i<13;i++){const x=-8+i*1.3,y=6.45-Math.sin(i/12*Math.PI)*.5;const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([x-.3,y,-5.85,x+.3,y,-5.85,x,y-.5,-5.85],3));geometry.computeVertexNormals();const pennant=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:[0xe9b85b,0x97b9a7,0xdf9d91,0xa8b9c7][i%4],side:THREE.DoubleSide}));scene.add(pennant)}
 const globe=new THREE.Group();globe.position.set(5.7,3.9,-4.8);orb(0x7eb9c1,0,.33,0,.38,.38,.38,globe);for(let i=0;i<6;i++)orb(0xadc58c,Math.sin(i*2)*.24,.33+Math.cos(i*2)*.24,.2,.15,.16,.1,globe);cyl(0xc4a05e,0,-.08,0,.06,.25,globe);cyl(0xc4a05e,0,-.22,0,.28,.07,globe);scene.add(globe);
 // A wooden toy train and a few larger building blocks deepen the foreground.
 for(let i=0;i<3;i++){cube([0xcd7f60,0x7eaaa0,0xe3bd66][i],3.6+i*.85,.27,5.5,.65,.4,.5);for(const z of[5.21,5.79])for(const x of[3.39+i*.85,3.81+i*.85]){const wheel=cyl(0x6b715f,x,.17,z,.14,.07);wheel.rotation.x=Math.PI/2}}
 const torus=mesh(new THREE.TorusGeometry(.4,.12,10,40),0xd99c90,6,.18,3.9);torus.rotation.x=Math.PI/2;

}
function initWorld(){scene=new THREE.Scene();scene.background=new THREE.Color(0xdce7db);scene.fog=new THREE.Fog(0xe7eddd,27,54);camera=new THREE.PerspectiveCamera(43,1,.1,230);renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;$('canvasHost').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xfff9dd,0x8baf9e,1.05));const sun=new THREE.DirectionalLight(0xffe7ba,2.3);sun.position.set(-5,12,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:40});sun.shadow.bias=-.0006;sun.shadow.normalBias=.035;scene.add(sun);const fill=new THREE.DirectionalLight(0xd9efff,.65);fill.position.set(8,8,-4);scene.add(fill);
// Honey-colored floorboards and sage wainscoting.
cube(0xe3c39a,0,-.18,1.8,21,.3,18);for(let i=0;i<21;i++){cube(i%3===0?0xe4c79f:i%3===1?0xe9cea8:0xdec097,-10+i,.001,1.8,.97,.025,17.8);for(let j=-5;j<=9;j+=3)cube(0xc3a582,-10+i,.016,j+(i%2)*1.5,.96,.005,.018)}
cube(0xf0e7c9,0,4,-6.3,21,8.4,.3);cube(0x97b7a0,0,1.03,-6.08,21,2.1,.16);cube(0xecddba,0,2.1,-5.93,21,.11,.16);cube(0xf4e9ca,0,.16,-5.91,21,.22,.18);for(let i=-10;i<11;i++)cube(0x85a890,i,1,-5.97,.045,1.9,.03);
// Left wall keeps the room enclosed without obscuring the play area.
cube(0xf0e7c9,-10.4,4,1.8,.3,8.4,18);cube(0x97b7a0,-10.2,1,1.8,.16,2,18);cube(0xecddba,-10.08,2.1,1.8,.12,.12,18);
// A big sky-blue window, framed in cream wood.
cube(0xf6f0d8,-2.4,4.5,-5.93,4.6,3.45,.2);cube(0xa6d7de,-2.4,4.5,-5.78,4.16,3.06,.08);cube(0xe3ecd0,-2.4,3.28,-5.68,4.1,.6,.04);orb(0xffe8a0,-3.6,5.36,-5.65,.36,.36,.03);for(let i=0;i<3;i++)orb(0xc2d2a0,-4+i*1.35,3.4,-5.63,1,.6,.03);cube(0xfaf2d9,-2.4,4.5,-5.53,.12,3.1,.16);cube(0xfaf2d9,-2.4,4.5,-5.52,4.2,.12,.17);cube(0xe9d8ad,-2.4,2.86,-5.48,4.8,.18,.55);
for(const x of[-5.0,.2]){cube(0xe9c76f,x,4.55,-5.46,.55,3.65,.22);for(let i=0;i<3;i++)cyl(0xe1bc5d,x-.17+i*.16,4.55,-5.32,.06,3.65)}
// Circular woven play rug.
const rug=cyl(0xd9898b,.1,.045,1.0,4.7,.04);rug.scale.z=.71;for(let i=0;i<6;i++){const ring=mesh(new THREE.TorusGeometry(4.55-i*.1,.018,4,100),i%2?0xe9d4ad:0xd9b89a,.1,.07,1);ring.rotation.x=-Math.PI/2;ring.scale.y=.71}
const inner=cyl(0xe9b3a1,.1,.075,1,3.9,.015);inner.scale.z=.71;for(let i=0;i<36;i++){const a=i*Math.PI/18;const o=cube(0xcdac80,.1+Math.cos(a)*3.55,.09,1+Math.sin(a)*2.5,.22,.012,.07);o.rotation.y=-a}
// Bookcase and little colourful books.
cube(0xb48e60,5.4,1.8,-5.42,3.3,3.6,.65);cube(0xd8b786,5.4,1.8,-5.04,3.1,3.4,.12);for(let y=.15;y<3.7;y+=1.15)cube(0xc79d68,5.4,y,-4.85,3.35,.13,1.05);for(const x of[3.8,7])cube(0xc79d68,x,1.8,-4.95,.15,3.6,1);const colors=[0xc66d51,0x7f9f8c,0xe7b954,0x9bb6b4,0xe9d4a2];for(let row=0;row<3;row++)for(let j=0;j<8;j++){let h=.5+((j*7+row*3)%5)*.1;const b=cube(colors[(j+row)%5],4.05+j*.34,row*1.15+.23+h/2,-4.65,.23,h,.42);b.rotation.z=j===6?.17:0;cube(0xf3e2b8,4.05+j*.34,row*1.15+.3,-4.42,.17,.035,.02)}
// Framed art, plants and playful blocks.
cube(0xcf9b62,1.55,4.6,-5.96,1.75,2,.15);cube(0xfaf0ce,1.55,4.6,-5.85,1.5,1.75,.05);orb(0xe2af61,1.55,4.8,-5.8,.46,.46,.03);cube(0x85a994,1.55,4.15,-5.8,.8,.2,.04);
for(const [x,z]of[[-7,-4.7],[7,-3.7]]){cyl(0xc58966,x,.45,z,.42,.7);cyl(0x755f3e,x,.83,z,.37,.04);for(let j=0;j<8;j++){const a=j*2.4;const stem=cyl(0x608257,x+Math.cos(a)*.13,1.2+j%3*.15,z+Math.sin(a)*.1,.027,.9);const leaf=orb(j%2?0x759c68:0x8daa72,x+Math.cos(a)*.38,1.35+j%3*.2,z+Math.sin(a)*.3,.24,.48,.15);leaf.rotation.z=Math.sin(a)*.6}}
for(let j=0;j<5;j++){const b=cube(colors[j],-6.5+(j%3)*.45,.2+Math.floor(j/3)*.4,2.6,.4,.4,.4);b.rotation.y=j*.4}
decorateRoom();
// Search objects, spaced along one clear route.
cube(0xc99b61,-4,.1,-1.25,2,.2,1.5);cube(0x88663e,-4,.22,-1.25,1.75,.035,1.23);cube(0xc99b61,-4,.7,-.55,2,1.2,.14);cube(0xc99b61,-4,.7,-1.95,2,1.2,.14);for(const x of[-4.97,-3.03])cube(0xe0ba7c,x,.7,-1.25,.12,1.3,1.55);cube(0xe3bb77,-4,.7,-.48,1.9,.12,.04);boxLid=new THREE.Group();boxLid.position.set(-4,1.3,-2);cube(0xdeba7c,0,.07,.75,2.08,.14,1.6,boxLid);scene.add(boxLid);toyboxStar();
const tabletop=cyl(0xe4bb7b,0,1.67,-1.2,1.43,.22);tabletop.scale.z=.75;for(const x of[-.9,.9])for(const z of[-1.8,-.6]){const leg=cyl(0xc69961,x,.8,z,.1,1.6);leg.rotation.z=x*.07}
for(const x of[3.48,4.52])for(const z of[-1.73,-.67]){const leg=cube(0xd4a24f,x,.58,z,.14,1.16,.14);leg.rotation.z=(x-4)*.08}cube(0xe9bc5f,4,1.16,-1.2,1.35,.18,1.35);for(const x of[3.48,4.52])cube(0xd7a64e,x,1.95,-1.78,.14,1.7,.14);cube(0xeac16e,4,2.15,-1.78,1.24,.8,.14);
ball=orb(0xe85e40,4,.36,-1.2,.33);const seam=mesh(new THREE.TorusGeometry(1.005,.025,6,48),0xf6c990,0,0,0,1,1,1,ball);seam.rotation.x=.4;orb(0xffb09b,-.3,.36,.86,.14,.19,.03,ball);ball.visible=false;
beacon=new THREE.Group();const base=mesh(new THREE.TorusGeometry(.73,.035,7,48),0xf3cf6d,0,.06,0,1,1,1,beacon);base.rotation.x=-Math.PI/2;const arrow=mesh(new THREE.ConeGeometry(.16,.32,3),0xf4cc65,0,3.4,0,1,1,1,beacon);arrow.rotation.z=Math.PI;beacon.userData.arrow=arrow;scene.add(beacon);beacon.visible=false;
player=puppet(CHARACTERS[0]);player.visible=false;player.position.set(-1,0,2);scene.add(player);rosita=puppet(CHARACTERS[3]);scene.add(rosita);buildSupportCast();parkGuide();
// Portraits use the same actual character artwork, without generating substitute faces.
CHARACTERS.forEach(spec=>loadArt(spec.name).then(art=>{portraits[spec.name]=art.portrait;if(phase==='home')renderChoices()}).catch(console.error));
roomNodes=scene.children.filter(o=>!o.isLight&&o!==player&&o!==rosita&&o!==ball&&o!==beacon&&o!==helperCast);buildGarden();wantWorld=new WantWorld(scene,{orb,cube,cyl,rod,labelBoard});if(typeof LivingEnvironment!=='undefined')environment=new LivingEnvironment(scene);setLessonWorld();setupCameraDrag();
graphics=new SceneGraphics(scene,renderer);
resize();window.addEventListener('resize',resize);camera.position.set(9,6.5,14);lookCurrent.set(0,1,0);animate();}
function resize(){if(!renderer)return;const r=$('world').getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
function setPlayer(name){if(!availableCharacters().some(c=>c.name===name))return;selected=name;if(scene&&player){const pos=player.position.clone(),rotation=player.rotation.y;scene.remove(player);clearAccessory(player);player.traverse(o=>{if(o.material?.vertexColors)o.material.dispose()});player=puppet(CHARACTERS.find(c=>c.name===name));attachAccessory(player,data.equippedItem);player.position.copy(pos);player.rotation.y=rotation;player.visible=true;scene.add(player)}refreshGuide();renderChoices();}
function renderChoices(){$('characterChoices').innerHTML=selected?`<div class="selected-friend"><img class="selected-portrait" alt="${selected}" src="${portraits[selected]}"><div><small>YOUR ADVENTURE FRIEND</small><strong>${selected}</strong><span>${availableCharacters().length} friends available</span></div></div><button id="chooseCharacter" class="choose-character">Change character <span>→</span></button>`:`<div class="no-character"><span>?</span><strong>Your adventure needs you!</strong><small>Choose any unlocked friend to begin.</small></div><button id="chooseCharacter" class="choose-character">Choose your character <span>→</span></button>`;$('chooseCharacter').onclick=friends;$('startButton').disabled=!selected||worldFailed;$('startButton').textContent=worldFailed?'3D unavailable':selected?'Enter my house':'Choose a character first';}
const keys=new Set(),joy={x:0,y:0};let joyPointer=null;
function stopInput(){cameraDrag=null;if(renderer)renderer.domElement.style.cursor='grab';document.querySelectorAll('[data-direction]').forEach(b=>b.classList.remove('pressed'));keys.clear();joy.x=joy.y=0;$('stick').style.transform='';joyPointer=null}
window.addEventListener('keydown',e=>{
 if(!$('modalShade').hidden){
  if(e.key==='Escape'){
   if(['shop','wardrobe'].includes(modalKind)){closeShop();return;}
   if(modalKind==='house-collection'){$('collectionsDone').click();return;}
   if(['memory','memory-complete'].includes(modalKind)){home();return;}
   if(modalKind==='vocabulary-bank'&&phase==='memory-complete'){memoryComplete();return;}
   closeModal();
  }
  return;
 }
 if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();
 if(e.key===' '&&['explore','town-free'].includes(phase)){interact();return;}
 keys.add(e.key.toLowerCase());
});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',stopInput);
$('joystick').addEventListener('pointerdown',e=>{joyPointer=e.pointerId;$('joystick').setPointerCapture(e.pointerId);moveJoy(e)});$('joystick').addEventListener('pointermove',e=>{if(joyPointer===e.pointerId)moveJoy(e)});for(const ev of['pointerup','pointercancel','lostpointercapture'])$('joystick').addEventListener(ev,stopInput);
function moveJoy(e){const r=$('joystick').getBoundingClientRect();let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;const len=Math.hypot(x,y),max=r.width*.28;if(len>max){x=x/len*max;y=y/len*max}joy.x=x/max;joy.y=y/max;$('stick').style.transform=`translate(${x}px,${y}px)`}
let lastNear=false;
function introPose(seconds,destination){
 const t=Math.max(0,Math.min(seconds,INTRO_SECONDS));
 if(t<7){const pass=(t%1.75)/1.75,cycle=Math.floor(t/1.75),u=cycle%2?1-pass:pass;return {x:-1.65+3.3*u,y:.55+Math.sin(pass*Math.PI)*1.4,z:2.3,playing:true};}
 const u=Math.min((t-7)/2.4,1),smooth=u*u*(3-2*u);return {x:-1.65+(destination.x+1.65)*smooth,y:.55+(destination.y-.55)*smooth+Math.abs(Math.sin(u*Math.PI*3))*.28*(1-u),z:2.3+(destination.z-2.3)*smooth,playing:false};
}
function animate(){
 requestAnimationFrame(animate);
 if(typeof syncSpeakingBanner==='function')syncSpeakingBanner();
 if(lesson!=='phonics'||!['explore','phonics-detail'].includes(phase))$('soundLetterBanner').hidden=true;
 if(['landing','chapter'].includes(phase)){clock.getDelta();return}const elapsed=clock.getDelta(),dt=Math.min(elapsed,.05),t=clock.elapsedTime,portrait=innerWidth<741;
 if(townSession){tickTownBudget();if(townView){animateTown(dt,elapsed,t);return;}}
 const transportationShot=lesson===TRANSPORTATION.id&&(phase==='family-action'||phase==='family-say'&&transportationWorld.picked);
 if(phase==='home'){aimTownCamera('house',false,1-Math.exp(-dt*3));graphics?.update(townView==='house'?(phase==='town-night'?'night':'house'):townView==='town'?'town':lesson,player);renderer.render(scene,camera);return;}
 else if(transportationShot)transportationWorld.frame(camera,cameraGoal,lookGoal);
 else if(lesson==='comparison'&&['parade-watch','parade-finale'].includes(phase)){const finale=phase==='parade-finale',z=finale?-4:0;lookGoal.set(0,finale?2.25:1,z);cameraGoal.set(0,finale?3.7:4,z+Math.max(finale?8.9:8,(finale?11.8:6)/camera.aspect));}
 else if(lesson==='phonics'&&phase==='explore'&&phonicsCardViewing&&phonicsWorld.life.holder){const a=phonicsWorld.life.holder.actor,cardDistance=Math.max(6.5,2.25/(Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*camera.aspect));cameraGoal.set(a.position.x,3,a.position.z+cardDistance);lookGoal.set(a.position.x,2.7,a.position.z)}
 else if(lesson==='phonics'&&phase==='phonics-detail'){const e=phonicsFocusEntity||phonicsWorld.expected(currentPhonicsTask());cameraGoal.set(e.root.position.x,2.0,e.root.position.z+4.3);lookGoal.set(e.root.position.x,1,e.root.position.z)}
 else if(lesson==='body'&&['body-find','body-say','phonics-say'].includes(phase)){const pose=bodyWorld.cameraPose(currentBodyMission(),bodyCloseView);cameraGoal.copy(pose.position);lookGoal.copy(pose.target)}
 else if(phase==='intro'){cameraGoal.set(4.2,3.8,12);lookGoal.set(.2,1.5,1.3)}
 else if(wideView){cameraGoal.set(5,8,16);lookGoal.set(0,1.1,0)}
 else{const distance=portrait?12.3:8.8;cameraGoal.set(player.position.x*.85+3,5,player.position.z*.5+distance);lookGoal.set(player.position.x*.8,1.35,player.position.z*.3-.65)}
 if(!transportationShot&&!['landing','chapter','home'].includes(phase)){
 const offset=cameraGoal.clone().sub(lookGoal);
 cameraGoal.copy(lookGoal).addScaledVector(offset,1.14);
}
 if(transportationShot){
 camera.position.copy(cameraGoal);lookCurrent.copy(lookGoal);
 }else{
 if(phase!=='intro')applyCameraOrbit(cameraGoal,lookGoal,cameraOrbit);
 camera.position.lerp(cameraGoal,1-Math.exp(-dt*2.4));lookCurrent.lerp(lookGoal,1-Math.exp(-dt*3));
 }
 camera.lookAt(lookCurrent);
 let moving=false;if(lesson==='phonics'&&phase==='phonics-intro'&&$('modalShade').hidden&&!document.hidden){phonicsIntroTime+=dt;phonicsWorld.windIntro(phonicsIntroTime);if(phonicsIntroTime>=10)startPhonicsMissions();}
 if(phase==='intro'&&$('modalShade').hidden&&!document.hidden){introElapsed+=dt;const pose=introPose(introElapsed,places[place].ball);ball.position.set(pose.x,pose.y,pose.z);ball.rotation.x+=dt*5;ball.rotation.z+=dt*3;
 player.position.y=Math.max(0,Math.sin(t*4))*.065;rosita.position.y=Math.max(0,Math.sin(t*4+1))*.065;
 updateCharacter(player,t,true);updateCharacter(rosita,t+1,true);
 if(introElapsed>7){dialogue('Oops… where did the ball go?','The ball has rolled out of sight.');player.rotation.y=THREE.MathUtils.lerp(player.rotation.y,.2,.025);rosita.rotation.y=THREE.MathUtils.lerp(rosita.rotation.y,-.2,.025)}
 if(introElapsed>=INTRO_SECONDS){setCharacterPose(player,'file');setCharacterPose(rosita,'file');ball.visible=false;ball.position.copy(places[place].ball);startSpeaking('question')}
 }
 if(phase==='explore'&&$('modalShade').hidden){
 let x=joy.x+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),z=joy.y+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);const len=Math.hypot(x,z);
 if(len>.1){if(lesson==='phonics')phonicsCardViewing=false;x/=Math.max(len,1);z/=Math.max(len,1);const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0));const movement=right.multiplyScalar(x).addScaledVector(forward,-z);
 const previous=player.position.clone(),nx=THREE.MathUtils.clamp(previous.x+movement.x*dt*3.6,-8.8,8.8),nz=THREE.MathUtils.clamp(previous.z+movement.z*dt*3.6,-4.3,7.4);
 player.position.set(nx,0,nz);for(const o of (lesson==='ball'?obstacles:[])){if(nx>o.x-o.w&&nx<o.x+o.w&&nz>o.z-o.d&&nz<o.z+o.d){player.position.copy(previous);break}}
 const angle=Math.atan2(movement.x,movement.z);player.rotation.y+=Math.atan2(Math.sin(angle-player.rotation.y),Math.cos(angle-player.rotation.y))*Math.min(dt*12,1);moving=player.position.distanceTo(previous)>.001;walkT+=dt*9;}
 const transportationPickup=lesson===TRANSPORTATION.id&&transportationWorld.choosing;
 if(transportationPickup){
 const toy=transportationWorld.nearestPickup(player.position);
 $('actionButton').disabled=!toy;
 $('actionLabel').textContent=toy?'Pick up '+toy.word:'Come closer';
 $('targetLabel').textContent=toy?'Tap the hand or press Space':'Walk to any gold ring';
 }else{
 const p=lesson.startsWith('mac-')?{target:familyTarget()}:lesson==='comparison'?{target:paradeTarget()}:lesson==='cat'?{target:catTarget()}:lesson==='phonics'?{target:phonicsTarget()}:lesson==='body'?{target:bodyMissionTarget()}:lesson==='wants'?{target:wantTarget()}:lesson==='letters'?{target:new THREE.Vector3(alphaSteps[alphaIndex].x,0,alphaSteps[alphaIndex].z+1.25)}:places[order[step]],near=lesson==='phonics'?!!phonicsWorld.nearest(player.position,currentPhonicsTask()):player.position.clone().setY(0).distanceTo(p.target)<1.75;
 if(lesson==='cat'){
 $('playControls').hidden=false;
 const lookButton=$('catLookButton');
 if(lookButton){lookButton.disabled=!near;lookButton.textContent=near?catActionLabel():'Walk to the marker';}
}
 if(lesson.startsWith('mac-')){
 const actionWorld=lesson===TRANSPORTATION.id?transportationWorld:familyStory?.adventure?rabbitWorld:null;
 $('actionButton').disabled=!near||!!actionWorld?.effectTime;
 $('actionLabel').textContent=near?(actionWorld? actionWorld.current.action+(actionWorld.progress?.()||''):'Collect'):'Come closer';$('targetLabel').textContent=near?'Tap the hand or press Space':'Follow the gold spot';}
 else if(lesson==='comparison'){const label=near?paradeAction():'Walk closer';$('actionButton').disabled=!near;$('actionLabel').textContent=label;const hand=$('paradeHand');if(hand){hand.disabled=!near;hand.textContent=label;}$('targetLabel').textContent=near?'Tap the hand or press Space':beacon.visible?'Follow the gold spot':'Walk to either toy';}
 else if(near!==lastNear){lastNear=near;$('actionButton').disabled=!near;$('actionLabel').textContent=near?(lesson==='phonics'?'Help / collect':lesson==='body'?(bodyReturning?'Dance!':'Help friend'):['letters','wants'].includes(lesson)?'Collect':lesson==='cat'?'Look':order[step]==='box'?'Open':'Look'):'Come closer';$('targetLabel').textContent=near?'Tap the hand or press Space':`Follow the marker to the ${lesson==='cat'?CAT_TURNS[catIndex].place:lesson==='phonics'?'parade clue':lesson==='body'?(bodyReturning?'dance stage':bodyWorld.stations[currentBodyMission().actorIndex].spec.name):lesson==='wants'?WANT_ITEMS[wantIndex]:lesson==='letters'?alphaSteps[alphaIndex].word:order[step]}`;}
 }
 }
 if(phase!=='intro'){player.position.y=moving?Math.abs(Math.sin(walkT))*.07:Math.sin(t*2)*.016;rosita.position.y=Math.sin(t*1.8)*.016;}
 updateCharacter(player,t,moving||phase==='intro');updateAccessoryPose(player,t,moving);if(lesson!=='phonics')updateCharacter(rosita,t+.7,phase==='intro');
 butterflyWings.forEach((wing,i)=>wing.rotation.y=Math.sin(t*4)*(i%2?1:-1)*.5);
 if(beacon.visible){beacon.userData.arrow.position.y=3.1+Math.sin(t*3)*.16;beacon.rotation.y=t*.4}
 if(lesson==='comparison'&&paradeWorld&&$('modalShade').hidden&&!document.hidden){paradeWorld.tick(dt,player);if(phase==='parade-watch'&&!paradeWorld.demo)paradePick();}
 if(lesson===TRANSPORTATION.id&&phase==='family-action'&&transportationWorld.tick(dt,!$('modalShade').hidden||document.hidden))transportationActionDone();
 if(lesson===RABBIT_STORY.id&&rabbitWorld?.tick(dt,player,!$('modalShade').hidden||document.hidden)){rabbitActionDone();}if(lesson==='cat')catWorld?.tick(t,dt,player);if(lesson==='phonics')phonicsWorld?.tick(t,{paused:!$('modalShade').hidden||speechActive||phase==='phonics-say'||phase==='phonics-detail',playing:phase==='explore',camera,player});if(lesson==='phonics'&&guideSpot)guideSpot.position.set(rosita.position.x,.035,rosita.position.z);if(lesson==='body')bodyWorld?.tick(t,phase==='body-show');if(lesson==='wants')wantWorld?.tick(t,camera,$('world').clientHeight||600);if(phase==='found')ball.rotation.y+=dt;updateSupportCast(t,dt);if(typeof environment!=='undefined')environment?.tick(t,{paused:!$('modalShade').hidden||document.hidden});if(typeof environment!=='undefined'&&environment&&phase!=='home')environment.clearView(camera,player,lookCurrent);graphics?.update(townView==='house'?(phase==='town-night'?'night':'house'):townView==='town'?'town':lesson,player);if(transportationShot){
 const actors=[player,rosita,helperCast,guideSpot].filter(actor=>actor?.visible);
 for(const actor of actors)actor.visible=false;
 const nearFog=scene.fog.near;
 scene.fog.near=Math.min(scene.fog.far-1,Math.max(nearFog,camera.position.distanceTo(lookCurrent)+10));
 try{renderer.render(scene,camera);}finally{
 scene.fog.near=nearFog;
 for(const actor of actors)actor.visible=true;
 }
 }else renderer.render(scene,camera);
}
let worldInitialized=false,worldFailed=false;
function ensureWorld(){if(worldInitialized)return true;if(worldFailed)return false;try{initWorld();worldInitialized=true;return true}catch(err){console.error(err);worldFailed=true;$('loadError').hidden=false;$('startButton').disabled=true;$('startButton').textContent='3D unavailable';return false}}
updateProgress();
function plan(){if(lesson.startsWith('mac-')&&phase==='home'){familyPlan();return;}if(lesson==='comparison'&&phase==='home'){paradePlan();return;}if(lesson==='cat'&&phase==='home'){catPlan();return;}if(['landing','chapter'].includes(phase)){showChapter();return}if(phase!=='home')return;if(!selected){friends();return}if(lesson==='phonics'){phonicsPlan();return;}if(lesson==='body'){bodyPlan();return;}if(lesson==='wants'){wantsPlan();return;}if(lesson==='letters'){alphabetPlan();return;}place=data.lastPlace||'chair';renderPlan()}
function renderPlan(){showModal('plan',`${closeHTML}<div class="eyebrow">PARENT PREVIEW · ADVENTURE 01</div><h2 id="modalTitle">Can you find the ball?</h2><p>A familiar playroom, three little clues, and one sentence to share. Review today’s learning before you begin.</p><div class="learning-card"><small>LEARNING TARGETS</small><div class="chips"><span>in</span><span>on</span><span>under</span></div><small>EXACT QUESTION</small><strong>Where is the ball?</strong><small>EXACT ANSWER</small><strong>${targetSentence()}</strong></div><label>Today’s hiding place</label><div class="choice-row">${Object.keys(places).map(k=>`<button class="${place===k?'selected':''}" data-place="${k}">${places[k].prep} the ${k}</button>`).join('')}</div><p class="note-caption">You approve the matching sentence when starting. Rosita will guide the search in order, ending here.</p><div class="status-box">Try first, tap Hear pronunciation when needed, then use the nearby parent approval button. No microphone access is needed.</div><button id="beginPractice" class="primary">Approve & start →</button>`);wireClose();document.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>{place=b.dataset.place;renderPlan()});$('beginPractice').onclick=()=>begin()}



async function begin(){
 if(!selected){friends();return}if(lesson.startsWith('mac-')){beginFamily();return;}if(lesson==='comparison'){beginParade();return}if(lesson==='cat'){beginCat();return}if(lesson==='phonics'){beginPhonics();return}if(lesson==='body'){beginBody();return}if(lesson==='wants'){beginWants();return}if(lesson==='letters'){beginAlphabet();return}if(!startTownStory())return;audioUnlocked=true;music.start('game');closeModal();const token=++sessionToken;phase='preparing';completed=false;helpCount=0;newXP=0;data.lastPlace=place;save();order=Object.keys(places).filter(k=>k!==place).concat(place);step=0;boxLid.rotation.x=0;ball.position.copy(places[place].ball);ball.visible=false;
 $('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;document.body.classList.add('playing');$('playNav').classList.add('active');
 dialogue('An afternoon in the playroom…','Getting ready to play together.');
 await Promise.all([player.userData.ready,rosita.userData.ready]);if(token!==sessionToken||phase!=='preparing')return;
 phase='intro';introElapsed=0;wideView=false;cameraOrbit.yaw=0;cameraOrbit.pitch=0;setCharacterPose(player,'pose');setCharacterPose(rosita,'joy');player.position.set(-1.8,0,2.3);rosita.position.set(1.8,0,2.3);player.rotation.y=Math.PI/2;rosita.rotation.y=-Math.PI/2;ball.visible=true;drawSteps(0);
 $('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('speakerName').textContent='STORYTIME';dialogue('An afternoon in the playroom…',`${selected} and Rosita are playing catch.`);resize();
}
function storyText(text){return replaceGuideText(text,guideName);}
function dialogue(title,instruction){$('dialogue').textContent=storyText(title);$('instruction').textContent=storyText(instruction);if($('speakerName').textContent==='ROSITA')$('speakerName').textContent=guideName.toUpperCase();}
function drawSteps(count){$('steps').innerHTML=Array.from({length:lesson==='cat'?CAT_TURNS.length:lesson==='wants'?9:lesson==='letters'?4:5},(_,i)=>`<i class="${i<count?'done':''}"></i>`).join('')}
function startSpeaking(kind){parkGuide();phase=kind==='question'?'ask':'answer';stopInput();beacon.visible=false;$('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=false;$('parentDot').hidden=true;drawSteps(kind==='question'?0:4);$('speakerName').textContent=kind==='question'?'STORYTELLER':'ROSITA';dialogue(kind==='question'?OPENING_PROMPT:'Where is the ball?',kind==='question'?'Your turn. Ask Rosita for help.':'Tell Rosita where you found it. Take your time.');const token=sessionToken;updateSpeakingControls('Listen to the story…');speak(kind==='question'?OPENING_PROMPT:'You found it! Where is the ball?',()=>{if(token!==sessionToken||!speakingPhase())return;updateSpeakingControls();});}
function updateSpeakingControls(override){if(!speakingPhase())return;if(typeof syncSpeakingBanner==='function')syncSpeakingBanner();parentApprovalReady=true;$('pronunciationButton').textContent='▶ Hear pronunciation';$('shortPhraseButton').textContent='Shorter phrase';$('nearbyApprove').textContent='Parent: accept answer →';$('listening').hidden=false;$('listenTitle').textContent=override||'Your turn — try first';$('listenDetail').textContent=override?'Listen, then have a try.':'After your try, hear the pronunciation. Your parent can accept your answer here.';$('nearbyApprove').disabled=false;$('pronunciationButton').disabled=!!override;$('shortPhraseButton').disabled=!!override;if(override){$('modelSentence').hidden=true;$('modelSentence').textContent='';}document.body.classList.add('speaking-turn');if(phase==='phonics-say')updatePhonicsSpeakingUI();}

function startExplore(){phase='explore';$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('playControls').hidden=false;$('targetLabel').hidden=false;$('parentDot').hidden=true;lastNear=true;const p=places[order[step]];beacon.position.copy(p.target);beacon.visible=true;drawSteps(step+1);$('speakerName').textContent='ROSITA';dialogue(`Let’s look ${p.prep} the ${p.name}!`,'Use the arrow keys or movement pad. Space or the hand to look.');$('targetLabel').textContent=`Walk to the ${p.name} ↓`;parkGuide();speak(`Let's look ${p.prep} the ${p.name}!`)}
function interact(){if(phase==='town-free'){interactTown();return;}if(lesson.startsWith('mac-')){familyInteract();return;}if(lesson==='comparison'){interactParade();return;}if(lesson==='cat'){interactCat();return;}if(lesson==='phonics'){interactPhonics();return}if(lesson==='body'){interactBody();return}if(lesson==='wants'){collectWant();return}if(lesson==='letters'){collectAlphabet();return}if(phase!=='explore'||!$('modalShade').hidden||player.position.distanceTo(places[order[step]].target)>=1.75)return;phase='searching';stopInput();$('playControls').hidden=true;$('targetLabel').hidden=true;beacon.visible=false;const k=order[step];if(k==='box')boxLid.rotation.x=-1.55;const token=sessionToken;if(step<2){dialogue('Not here. Let’s keep looking!',`We looked ${places[k].prep} the ${k}.`);speak(`The ball is not ${places[k].prep} the ${k}. Let's keep looking!`,()=>{if(sessionToken!==token||phase!=='searching')return;step++;startExplore()})}else{ball.visible=true;phase='found';cheerHelpers();setCharacterPose(player,'joy');setCharacterPose(rosita,'joy');dialogue('You found the ball!','Now tell Rosita where it is.');speak('You found the ball! Thank you!',()=>{if(sessionToken===token&&phase==='found')startSpeaking('answer')})}}
function parentPanel(){stopInput();let body='';if(speakingPhase()){const expected=speakingTarget();body=`<div class="learning-card"><small>TARGET SENTENCE</small><strong>${expected}</strong></div><p>Your child can try, then tap Hear pronunciation below the scene. Accept her answer with the nearby parent button whenever she is ready.</p><button id="acceptAnswer" class="primary">Parent: accept answer & continue →</button><div class="hint-list"><button id="model" class="secondary">Hear pronunciation</button><button id="shorter" class="secondary">Practise a shorter phrase</button></div>`}else if((townSession&&townView)||phase==='home'){body='<p>Your child gets 10 minutes of active play each day. Play renews at 6:00 a.m. Hong Kong time. A story already in progress can be finished.</p><button id="openJournal" class="secondary">Read my notes</button>';}else if(['landing','chapter'].includes(phase)){body=`<p>Today’s adventure practises <strong>${lesson==='phonics'?'two letter forms, initial sounds and four words':lesson==='body'?'your chosen body-part words':lesson==='wants'?'What do you want? and six food words':lesson==='letters'?'A, a, B, b and four words':'in, on, under'}</strong>. You approve learning targets before each play.</p><button id="openPlan" class="primary">Review today’s adventure →</button><button id="openJournal" class="secondary">Read my notes</button><div class="status-box">Five guided adventures are available. Worksheet uploads and automatic scene creation are not available yet.</div>`}else if(['intro','preparing'].includes(phase)){body=`<p>${lesson==='letters'?'Rosita introduces the four garden deliveries. Your child will identify each letter form, say each word with a or an, and review four words with pictures and spoken prompts.':`The ten-second opening shows ${selected} and Rosita playing catch. When the ball rolls away, the storyteller invites her to ask for help.`}</p>`}else{body=`<p>Help her follow Rosita’s clues. Move using the movement pad, joystick, or arrow keys, then use the hand button near the golden marker.</p><button id="parentHint" class="secondary">Repeat the current clue</button>`}showModal('parent',`${closeHTML}<div class="eyebrow">A MOMENT FOR THE GROWN-UP</div><h2 id="modalTitle">Playing together</h2>${body}<button id="parentShop" class="secondary">Sticker shop & wardrobe</button><button id="parentVocabulary" class="secondary">Vocabulary bank & word sets</button><button id="experienceSettings" class="secondary">Experience & surprise rewards</button><p class="note-caption">${storageOK?'Notes and progress stay in this browser.':'Browser storage unavailable: progress is temporary.'} No microphone access is needed.</p>${(!townSession||!townView)&&!['home','landing','chapter'].includes(phase)?'<button id="exitAdventure" class="text-button">Leave this adventure</button>':''}`);wireClose();$('parentShop').onclick=()=>openShop('shop');$('parentVocabulary').onclick=vocabularyBank;$('experienceSettings').onclick=experiencePanel;$('acceptAnswer')?.addEventListener('click',approveSpeaking);$('model')?.addEventListener('click',()=>giveHint(false));$('shorter')?.addEventListener('click',()=>giveHint(true));$('openPlan')?.addEventListener('click',plan);$('openJournal')?.addEventListener('click',journal);$('parentHint')?.addEventListener('click',()=>{helpCount++;closeModal();repeat()});$('exitAdventure')?.addEventListener('click',()=>{showModal('exit',`${closeHTML}<h2 id="modalTitle">Leave the adventure?</h2><p>XP is awarded when the adventure is finished. Her previous progress will stay safe.</p><button class="primary" id="stay">Keep playing</button><button class="secondary" id="leave">Leave for now</button>`);wireClose();$('stay').onclick=closeModal;$('leave').onclick=home})}
function giveHint(short){demonstratePronunciation(short)}
function acceptAnswer(){if(phase==='family-say'){familyAccept();return;}if(phase==='parade-say'){acceptParade();return;}if(phase==='cat-say'){catIndex++;routeCat();return;}if(phase==='phonics-say'){acceptPhonics();return}if(phase==='body-say'){acceptBody();return}if(phase==='want-say'){acceptWant();return}if(phase==='alpha-say'){acceptAlphabet();return}if(!speakingPhase())return;const previous=phase;closeModal();$('parentDot').hidden=true;if(previous==='ask'){startExplore()}else{phase='rating';$('listening').hidden=true;document.body.classList.remove('speaking-turn');drawSteps(5);dialogue('You did it. Thank you, friend!','A little adventure, a growing voice.');stopSpeech();rating=helpCount>=3?30:helpCount>0?40:50;ratePanel()}}
function ratePanel(){const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const playKey=day+':'+lesson;const replay=!!data.plays[playKey]||(lesson==='ball'&&!!data.plays[day]);showModal('rating',`<div class="eyebrow">ADVENTURE COMPLETE</div><h2 id="modalTitle">A little moment of progress</h2><p>Confirm today’s suggested rating. It uses in-game help only; adjust it for any support you gave. Pronunciation is not scored.</p><div class="choice-row">${[[30,'With help'],[40,'Some help'],[50,'Mostly independent']].map(([v,l])=>`<button data-rating="${v}" class="${rating===v?'selected':''}">${l}<br><strong>${v} XP</strong></button>`).join('')}</div>${replay?'<div class="status-box">A lovely bit of extra practice! Replays today earn half XP, rounded up.</div>':''}<label for="parentNote">My note <span style="font-weight:normal">(optional)</span></label><textarea id="parentNote" placeholder="What did she try? What felt easier today?" maxlength="3000"></textarea><p class="note-caption">Notes, chosen words, character, date, and game progress are saved in this browser. Export your notes from the journal to keep a backup.</p><button id="confirmXP" class="primary">Confirm & celebrate · ${Math.ceil(rating*(replay?.5:1))} XP ✦</button>`);document.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>{rating=Number(b.dataset.rating);document.querySelectorAll('[data-rating]').forEach(btn=>btn.classList.toggle('selected',btn===b));$('confirmXP').textContent=`Confirm & celebrate · ${Math.ceil(rating*(replay?.5:1))} XP ✦`});$('confirmXP').onclick=()=>finish(playKey,replay)}
function finish(playKey,replay){if(completed)return;completed=true;awardStickers(data);newXP=Math.ceil(rating*(replay?.5:1));data.plays[playKey]=(data.plays[playKey]||0)+1;grantExperience(data,newXP,CHARACTERS.map(c=>c.name));data.journal.unshift({date:new Date().toISOString(),note:$('parentNote').value.trim(),xp:newXP,stickers:3,sentence:lessonSummary(),lesson,rating,character:selected,words:sessionWords(),bodyResults:lesson==='body'?structuredClone(bodyResults):undefined,phonics:lesson==='phonics'?phonicsJournal():undefined});if(['letters','wants','body','phonics'].includes(lesson)){data.pendingWordSaves=[...new Set([...(data.pendingWordSaves||[]),...(lesson==='phonics'?phonicsWords(phonicsPair):lesson==='body'?bodyWords:lesson==='wants'?WANT_ITEMS:ALPHABET_STEPS.map(item=>item.word))])];data.wordSaveBatch=[...data.pendingWordSaves];}save();updateProgress();phase='reward';rewardPanel()}
function rewardPanel(){showModal('reward',`<div class="reward"><div class="eyebrow" style="justify-content:center">A LITTLE BRAVER. A LITTLE PROUDER.</div><h2 id="modalTitle" style="margin-right:0">Wonderful playing, ${selected||'friend'}!</h2><div class="sticker-prize"><div class="earned-stickers">${[0,1,2].map(i=>`<span style="--sticker-delay:${i*.14}s">${stickerSVG()}</span>`).join('')}</div><strong>+3 Elmo golden stickers!</strong><small>You have ${data.stickers} to spend in the shop.</small></div><div class="big-xp">+${newXP} <small>XP</small></div><p>${lesson==='phonics'?'You searched with the park friends<br>and matched words by sound and spelling!':lesson==='body'?'You explored the park, helped your friends,<br>and got the dance show ready!':lesson==='wants'?'You helped Rosita ask about six foods<br>and tell the baby’s story.':lesson==='letters'?'You collected four garden surprises<br>and matched each picture to its word.':'You and Rosita found the ball<br>and used your voice to tell her where.'}</p><div class="learning-card"><small>WHAT WE PRACTISED</small><strong>${lessonSummary()}</strong></div><button id="rewardShop" class="secondary">Visit the sticker shop ♡</button><button id="rewardNext" class="primary">${['letters','wants','body','phonics'].includes(lesson)?`Save my ${lesson==='body'?bodyWords.length:lesson==='wants'?'six':'four'} words →`:data.pendingRewards?'Three mystery boxes are waiting! ✦':'Return to town'}</button></div>`);$('rewardShop').onclick=()=>openShop('shop');$('rewardNext').onclick=()=>['letters','wants','body','phonics'].includes(lesson)?memoryCards():data.pendingRewards?unlockPanel():home()}
function home(){if(townSession){returnFromStory();return;}showLanding()}
function friends({startAtHouse=false}={}){const unlocked=availableCharacters();showModal('friends',`${closeHTML}<div class="eyebrow">PICK YOUR ADVENTURE FRIEND</div><h2 id="modalTitle">Who would you like to be?</h2><p>All ${unlocked.length} unlocked friends are ready to play. Choose any one.</p><div class="friend-grid">${unlocked.map(c=>`<button class="friend-tile ${selected===c.name?'chosen':''}" data-friend="${c.name}" aria-pressed="${selected===c.name}"><img alt="${c.name}" src="${portraits[c.name]}"><strong>${c.name}</strong><small>${selected===c.name?'Playing as this friend':'Choose this friend'}</small></button>`).join('')}</div><p class="note-caption">More surprise friends join you as you level up.</p>`,true);wireClose();document.querySelectorAll('[data-friend]').forEach(b=>b.onclick=()=>{if(startAtHouse&&!ensureWorld()){
 closeModal();toast('The 3D house needs a browser with WebGL enabled.');return;
 }
 setPlayer(b.dataset.friend);
 if(startAtHouse)enterTownSession();
 else{closeModal();toast(`${selected} is ready to play!`);}})}
function journal(){openJournal();}
function repeat(){if(lesson===TRANSPORTATION.id&&transportationWorld?.choosing){speak(transportationWorld.current.prompt);return;}if(lesson.startsWith('mac-')&&phase==='explore'){speak(familyStory.beats[familyIndex].clue);return;}if(lesson==='comparison'&&phase==='explore'){speak(paradePrompt);return;}if(lesson==='cat'&&phase==='explore'){speak(CAT_TURNS[catIndex].prompt);return;}if(lesson==='phonics'&&['explore','phonics-detail','phonics-intro'].includes(phase)){speak(phonicsPrompt(currentPhonicsTask()));return;}if(lesson==='body'&&phase==='explore'){speak(bodyReturning?'Walk to the dance stage.':`Walk to ${bodyWorld.stations[currentBodyMission().actorIndex].spec.name}. ${missionQuestion(currentBodyMission())}`);return}if(lesson==='body'&&phase==='body-find'){speak(missionQuestion(currentBodyMission()));return}if(lesson==='wants'&&['want-find','want-response','want-preference'].includes(phase)){speak(phase==='want-find'?`Find the ${WANT_ITEMS[wantIndex]}.`:phase==='want-response'?wantAnswer(WANT_ITEMS[wantIndex]):'What do you want?');return}if(['vocab-review','vocab-feedback'].includes(phase)){speak(reviewOrder[reviewIndex]);return}if(speakingPhase()){updateSpeakingControls('Listen to the instruction…');const token=sessionToken;speak($('dialogue').textContent,()=>{if(token!==sessionToken||!speakingPhase())return;updateSpeakingControls();})}else speak($('dialogue').textContent)}
$('startButton').onclick=enterTownSession;$('actionButton').onclick=interact;$('repeatButton').onclick=repeat;$('parentButton').onclick=parentPanel;$('friendsNav').onclick=friends;$('journalNav').onclick=journal;$('playNav').onclick=()=>{if(townView&&phase==='town-free')openTownMap();else if(phase==='home')closeModal();else toast('You’re in an adventure. Open Parent to leave the adventure.')};document.querySelector('.brand').onclick=e=>{e.preventDefault();if(phase==='home'&&!townSession)showLanding();else parentPanel()};$('soundButton').onclick=()=>{sound=!sound;$('soundButton').textContent=sound?'♫ Sound on':'♫ Sound off';if(!sound)stopSpeech(true)};
$('modalShade').addEventListener('click',e=>{if(e.target===$('modalShade')&&['shop','wardrobe'].includes(modalKind)){closeShop();return}if(e.target===$('modalShade')&&['parent','plan','friends','journal','exit'].includes(modalKind))closeModal()});
window.addEventListener('pagehide',()=>{music.stop();stopSpeech()});document.addEventListener('visibilitychange',()=>{if(document.hidden){music.stop();stopInput()}else if(audioUnlocked&&phase!=='town-night')music.start(['landing','chapter','home'].includes(phase)?'front':'game')});
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||$('modalShade').hidden)return;const nodes=[...$('modal').querySelectorAll('button:not([disabled]),textarea,input,select,a[href]')].filter(el=>!el.hidden);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});

// Visible keyboard pad supports press-and-hold and simultaneous touch directions.
for(const button of document.querySelectorAll('[data-direction]')){
 const release=()=>{keys.delete(button.dataset.direction);button.classList.remove('pressed')};
 button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.direction);button.classList.add('pressed')});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,release);
}
$('controlToggle').onclick=()=>{stopInput();const useJoystick=$('joystick').hidden;$('joystick').hidden=!useJoystick;$('directionPad').hidden=useJoystick;$('controlToggle').textContent=useJoystick?'▦ Keyboard pad':'◉ Joystick'};
$('cameraButton').onclick=()=>{wideView=!wideView;cameraOrbit.yaw=0;cameraOrbit.pitch=0;$('cameraButton').textContent=wideView?'⊙ Follow view':'↔ Room view'};
$('expandButton').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();resize()}catch{toast('For a bigger view, turn your tablet sideways.')}};

// Navigation remains available without WebGL; the park has a labelled still-photo fallback.
const TRAILER_SECONDS=TRAILER_DURATION;
const TRAILER_SHOTS=[
 {title:'HELLO, SUNSHINE',caption:'Every friend has a little sparkle.',voice:'Hello, sunshine! Come and play!'},
 {title:'SILLY LITTLE MOVES',caption:'Wiggles, giggles, and happy feet.',voice:'Wiggle, giggle, and dance!'},
 {title:'LITTLE WONDERS',caption:'Look! A lovely little surprise.',voice:'A little wonder is waiting!'},
 {title:'PLAYTIME SURPRISES',caption:'Something fun around every corner.',voice:'What a wonderful day to play!'},
 {title:'BIG HAPPY SMILES',caption:'Your next adventure starts with a smile.',voice:'Big smiles, little adventures. Come join us!'}
];
let parkTrailer=null,parkTried=false;
function ensureParkTrailer(){if(parkTried)return;parkTried=true;try{parkTrailer=new ParkTrailer($('parkCanvas'),{puppet,orb,cube,cyl,rod,fur,sharedGeometry:geo=>geo===sphereGeo||[...boxCache.values(),...furCache.values()].includes(geo),sharedMaterial:material=>[...mats.values()].includes(material)});$('parkCanvas').classList.add('ready');updateParkCast();}catch(error){console.warn('3D park preview unavailable',error);$('parkFallbackNote').hidden=false;}}
function updateParkCast(){$('parkCastNames').textContent=parkTrailer?parkTrailer.cast.map(spec=>spec.name).join(' · '):'Your friends are ready to play';}
function shuffleParkCast(){if(parkTrailer){parkTrailer.newCast();updateParkCast();}}
let trailerElapsed=0,trailerLast=performance.now(),trailerIndex=-1,trailerAudio=false,parkFrame=-1;
let trailerPlaying=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function trailerShotAt(seconds){return Math.min(4,Math.max(0,Math.floor(seconds/8)))}
function paintTrailer(){
 if(phase==='landing')ensureParkTrailer();
 const index=trailerShotAt(trailerElapsed),shot=TRAILER_SHOTS[index];
 if(index!==trailerIndex){trailerIndex=index;document.querySelectorAll('[data-trailer-jump]').forEach((el,i)=>el.classList.toggle('active',i===index));$('trailerChapter').textContent=`0${index+1} / ${shot.title}`;if(trailerAudio&&trailerPlaying&&phase==='landing'){const previous=sound;sound=true;speak(shot.voice);sound=previous;}}
 const cut=parkTrailer?parkShotAt(trailerElapsed,parkTrailer.cast):null;$('trailerHeadline').textContent=cut?`${parkTrailer.cast[cut.character].name} · ${ACTION_TITLES[cut.action]}`:shot.caption;
 const dissolve=cut&&trailerPlaying?Math.max(0,1-cut.local/.16,(cut.local-1.84)/.16):0;$('parkTransition').style.opacity=String(Math.min(.92,dissolve*.92));$('trailerProgress').style.width=`${trailerElapsed/TRAILER_SECONDS*100}%`;
 $('trailerTime').textContent=`0:${String(Math.floor(trailerElapsed)).padStart(2,'0')} / 0:40`;
 $('trailerScreen').classList.toggle('paused',!trailerPlaying);
 $('trailerToggle').textContent=trailerPlaying?'Ⅱ Pause':'▶ Play';$('trailerToggle').setAttribute('aria-label',trailerPlaying?'Pause trailer':'Play trailer');
 $('trailerSound').textContent=trailerAudio?'Voice on':'Hear trailer voice';
}
function trailerTick(now){const delta=Math.min((now-trailerLast)/1000,.2);trailerLast=now;if(phase==='landing'&&trailerPlaying&&!document.hidden&&$('modalShade').hidden){trailerElapsed+=delta;if(trailerElapsed>=TRAILER_SECONDS){trailerElapsed=0;trailerIndex=-1;}paintTrailer();const frame=Math.floor(trailerElapsed*30);if(frame!==parkFrame){parkFrame=frame;parkTrailer?.render(trailerElapsed)}}requestAnimationFrame(trailerTick)}
function resetWorld(){if(!worldInitialized)return;beacon.visible=false;ball.visible=false;boxLid.rotation.x=0;player.position.set(-1,0,2);parkGuide();setCharacterPose(player,'file');setCharacterPose(rosita,'file')}
function showLanding(){phonicsWorld?.clearCargo();document.body.classList.remove('body-missions','phonics-missions');$('bodyMissionTools').hidden=true;parentApprovalReady=false;document.body.classList.remove('speaking-turn');if(audioUnlocked)music.start('front');else music.stop();sessionToken++;stopSpeech();stopInput();closeModal();resetWorld();phase='landing';selected=null;if(player)player.visible=false;completed=false;document.body.classList.remove('playing','chapter','story-learning');document.body.classList.add('landing');$('frontPage').hidden=false;$('chapterPage').hidden=true;$('sceneTools').hidden=true;$('parentDot').hidden=true;trailerAudio=false;trailerIndex=-1;trailerElapsed=0;parkFrame=-1;shuffleParkCast();paintTrailer();parkTrailer?.resize();updateProgress();$('frontStart').focus()}
function showChapter(){if(audioUnlocked)music.start('front');selected=null;if(player)player.visible=false;showLessonPicker();return;}
function openCharacterSelect(){document.body.classList.remove('body-missions','phonics-missions');$('bodyMissionTools').hidden=true;selected=null;if(player)player.visible=false;stopSpeech();phase='home';document.body.classList.remove('landing','chapter','playing','story-learning');$('frontPage').hidden=true;$('chapterPage').hidden=true;closeModal();$('welcome').hidden=false;$('roomTag').hidden=false;$('quest').hidden=true;clearLearningTray();$('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('sceneTools').hidden=true;const ready=ensureWorld();renderChoices();if(ready){resetWorld();previewTownHouse();resize();$('chooseCharacter').focus()}updateProgress()}
$('frontStart').onclick=startTownPicker;$('chapterContinue').onclick=openCharacterSelect;$('chapterBack').onclick=showLanding;$('selectionBack').onclick=showLanding;
$('frontParent').onclick=()=>{stopSpeech();parentPanel()};
$('trailerToggle').onclick=()=>{startWelcomeMusic();trailerPlaying=!trailerPlaying;if(!trailerPlaying)stopSpeech();else trailerIndex=-1;paintTrailer()};
$('trailerReplay').onclick=()=>{startWelcomeMusic();stopSpeech();trailerElapsed=0;trailerIndex=-1;trailerPlaying=true;shuffleParkCast();paintTrailer();parkTrailer?.render(0)};
$('trailerSound').onclick=()=>{startWelcomeMusic();trailerAudio=!trailerAudio;stopSpeech();if(trailerAudio){trailerPlaying=true;trailerIndex=-1}paintTrailer()};
for(const button of document.querySelectorAll('[data-trailer-jump]'))button.onclick=()=>{startWelcomeMusic();stopSpeech();trailerElapsed=Number(button.dataset.trailerJump)*8;trailerIndex=-1;paintTrailer();parkTrailer?.render(trailerElapsed)};
paintTrailer();requestAnimationFrame(trailerTick);

function applyCameraOrbit(position,target,orbit){const offset=position.clone().sub(target),spherical=new THREE.Spherical().setFromVector3(offset);spherical.radius*=orbit.zoom??1;spherical.theta+=orbit.yaw;spherical.phi=THREE.MathUtils.clamp(spherical.phi+orbit.pitch,.34,1.38);position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical));return position;}
function setupCameraDrag(){
 const canvas=renderer.domElement;
 const touches=new Map();
 let pinched=false;
 canvas.style.touchAction='none';
 canvas.style.cursor='grab';
 const span=()=>{const [a,b]=touches.values();return Math.max(1,Math.hypot(a.x-b.x,a.y-b.y));};
 const zoomBy=ratio=>{cameraOrbit.zoom=THREE.MathUtils.clamp(cameraOrbit.zoom*ratio,.55,1.65);};
 canvas.addEventListener('pointerdown',event=>{
  if(event.button!==0||!$('modalShade').hidden||['intro','town-travel','town-night'].includes(phase))return;
  if(!cameraDrag){touches.clear();pinched=false;}
  if(touches.size>=2)return;
  const point={x:event.clientX,y:event.clientY};
  touches.set(event.pointerId,point);
  if(touches.size===2)pinched=true;
  cameraDrag={...point,startX:point.x,startY:point.y,distance:0};
  canvas.setPointerCapture(event.pointerId);canvas.style.cursor='grabbing';
 });
 canvas.addEventListener('pointermove',event=>{
  const old=touches.get(event.pointerId);
  if(!cameraDrag||!old)return;
  const before=touches.size===2?span():0;
  const x=event.clientX,y=event.clientY;
  touches.set(event.pointerId,{x,y});
  if(before){zoomBy(before/span());return;}
  cameraDrag.distance=Math.max(cameraDrag.distance,Math.hypot(x-cameraDrag.startX,y-cameraDrag.startY));
  cameraOrbit.yaw-=(x-old.x)*.006;
  cameraOrbit.pitch=THREE.MathUtils.clamp(cameraOrbit.pitch-(y-old.y)*.004,-.75,.65);
  if(lesson==='body'&&['body-find','body-say'].includes(phase))cameraOrbit.yaw=THREE.MathUtils.clamp(cameraOrbit.yaw,-.8,.8);
 });
 function release(event){
  if(!touches.has(event.pointerId))return;
  const tap=event.type==='pointerup'&&!pinched&&cameraDrag&&cameraDrag.distance<9&&Math.hypot(event.clientX-cameraDrag.startX,event.clientY-cameraDrag.startY)<9;
  touches.delete(event.pointerId);
  if(!touches.size){cameraDrag=null;canvas.style.cursor='grab';}
  if(tap&&$('modalShade').hidden){
   if(lesson==='phonics'&&['explore','phonics-detail'].includes(phase))tapPhonicsWorld(event.clientX,event.clientY);
   if(lesson==='comparison')paradeTap(event.clientX,event.clientY);
   if(lesson==='body'&&phase==='body-find')tapBodyPart(event.clientX,event.clientY);
  }
 }
 for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,release);
 canvas.addEventListener('wheel',event=>{if(!$('modalShade').hidden||['intro','town-travel','town-night'].includes(phase))return;event.preventDefault();zoomBy(Math.exp(Math.sign(event.deltaY)*.075));},{passive:false});
 window.addEventListener('blur',()=>{touches.clear();cameraDrag=null;canvas.style.cursor='grab';});
}
$('resetCamera').onclick=()=>{cameraOrbit.zoom=1;cameraOrbit.yaw=0;cameraOrbit.pitch=0;wideView=false;$('cameraButton').textContent='↔ Room view'};
$('inGameCharacters').onclick=friends;

function showLessonPicker(){stopSpeech();stopInput();closeModal();phase='chapter';document.body.classList.remove('landing','playing','learning','story-learning');document.body.classList.add('chapter');$('frontPage').hidden=true;$('chapterPage').hidden=false;$('chapterPage').innerHTML=`<button id="pickerBack" class="chapter-back">← Back to the trailer</button><div class="lesson-hub"><span class="chapter-number">CHOOSE AN ADVENTURE</span><h1 id="chapterTitle">A little world<br>of <em>discovery.</em></h1><div class="lesson-grid"><button data-lesson="ball"><span class="lesson-symbol red-ball-symbol"></span><small>CHAPTER 01 · THE PLAYROOM</small><strong>Can you find<br>the ball?</strong><p>Explore in, on, and under.<br>Ask a question. Tell the story.</p><span>Let’s explore →</span></button><button data-lesson="letters"><span class="lesson-symbol alphabet-symbol">Aa <i>Bb</i></span><small>CHAPTER 02 · VOCABULARY GAME</small><strong>The A a & B b<br>Garden</strong><p>Four letter forms. Four little surprises.<br>Find, say, and remember.</p><span>Let’s discover →</span></button><button data-lesson="wants"><span class="lesson-symbol want-symbol">${wordPicture('milk')}</span><small>CHAPTER 03 · STORY GAME · 5 MIN</small><strong>What do<br>you want?</strong><p>A baby brother. Six little ideas.<br>Listen, ask, and tell the story.</p><span>Let’s help Rosita →</span></button><button data-lesson="body"><span class="lesson-symbol alphabet-symbol">♫</span><small>CHAPTER 04 · MOVE & SAY · 3–5 MIN</small><strong>Body<br>Boogie!</strong><p>Choose today’s body words.<br>Find, say, move, and dance.</p><span>Let’s dance →</span></button><button data-lesson="cat"><span class="lesson-symbol">🐈</span><small>CHAPTER 06 · STORY GAME</small><strong>Can you see<br>the cat?</strong><p>Look under, on, and in.<br>Find Cat with a friendly dog.</p><span>Let’s find Cat →</span></button><button data-lesson="phonics"><span class="lesson-symbol alphabet-symbol">♪ Aa</span><small>CHAPTER 05 · PHONICS · 5 MIN</small><strong>Sound Safari<br>Parade</strong><p>Two surprise letters. Roaming animal friends.<br>Find by sound, then follow the cards.</p><span>Let’s start the parade →</span></button><button data-lesson="comparison"><span class="lesson-symbol">🐢</span><small>CHAPTER 07 · COMPARISON</small><strong>Abby’s Toy<br>Parade</strong><p>Wind up two toy animals and describe your parade star.</p><span>Play with the toys →</span></button></div></div>`;$('pickerBack').onclick=showLanding;document.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>showChapterTitle(b.dataset.lesson));familyPicker();refreshFamilyShelf();}
function showChapterTitle(id){lesson=id;if(id==='phonics'){phonicsTitle(true);return}if(id==='body'){bodyTitle();return}selected=null;if(player)player.visible=false;const info=LESSONS[id];$('chapterPage').innerHTML=`<button id="titleBack" class="chapter-back">← Choose another adventure</button><div class="chapter-spark spark-one">✦</div><div class="chapter-content"><span class="chapter-number">CHAPTER ${info.number}</span><p class="chapter-kicker">${info.setting.toUpperCase()}${info.type==='vocabulary'?' · VOCABULARY GAME':''}</p><h1 id="chapterTitle">${id.startsWith('mac-')?escapeHTML(info.title):id==='comparison'?'Comparison<br><em>Abby’s Toy Parade</em>':id==='cat'?'Can you see<br><em>the cat?</em>':id==='wants'?'What do<br><em>you want?</em>':id==='ball'?'Can you find<br><em>the ball?</em>':'The A a & B b<br><em>Garden</em>'}</h1><p>${id.startsWith('mac-')?escapeHTML(familyShelf.get(id).intro):id==='comparison'?'Open the toy chest, start two animal acts, and introduce your favorite toy.':id==='cat'?'A playful cat is hiding in the house. Walk, look, ask, and tell your friend where Cat is.':id==='wants'?'Help a friend find what the baby wants.<br>Six food words. Questions, choices, and a happy ending.':id==='ball'?'One missing ball. Three little clues.<br>A question only you can ask.':'Help the friends deliver four garden surprises.<br>Apple, ant, ball, and butterfly.'}</p><div class="chapter-targets">${info.targets.slice(0,id==='ball'?3:id==='wants'?6:4).map(t=>`<span>${t}</span>`).join('')}</div><button id="chapterContinue" class="front-start">Choose your friend <span>→</span></button><small>${id==='wants'?'About five minutes, with extra speaking time.':'Choose your own character.'} A grown-up can help.</small></div>`;$('titleBack').onclick=showChapter;$('chapterContinue').onclick=openCharacterSelect;$('chapterContinue').focus();}
function labelBoard(text,x,y,z,width,parent){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=180;const ctx=canvas.getContext('2d');ctx.fillStyle='#f9e6ba';ctx.fillRect(0,0,512,180);ctx.font='bold 94px Arial';ctx.fillStyle='#355e46';ctx.textAlign='center';ctx.fillText(text,256,122);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;cube(0xbd945c,x,y,z-.035,width,.64,.12,parent);const board=new THREE.Mesh(new THREE.PlaneGeometry(width-.05,.59),new THREE.MeshBasicMaterial({map:tex,depthTest:true,toneMapped:false}));board.position.set(x,y,z+.04);parent.add(board);}
function rod(c,a,b,r,parent){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),object=mesh(new THREE.CylinderGeometry(r,r,delta.length(),10),c,0,0,0,1,1,1,parent);object.position.copy(start).add(end).multiplyScalar(.5);object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return object;}
function buildGarden(){garden=new THREE.Group();garden.visible=false;scene.add(garden);cyl(0xa7c681,0,-.12,0,11,.2,garden);for(let z=-4;z<8;z+=1.15)cube(0xe6d6ac,0,.015,z,2.3,.035,.95,garden);
 for(let i=-9;i<=9;i++){cube(0xe7d3a4,i,1,-5.5,.18,2,.18,garden);for(const y of[.65,1.4])cube(0xd8bd84,i,y,-5.5,1.05,.12,.12,garden)}
 for(const [x,z]of[[-8,-4],[8,-4],[-8,5],[8,5]]){cyl(0xab7d51,x,1,z,.2,2,garden);orb(0x84ac69,x,3,z,1.3,1.5,1.1,garden);orb(0x9bbd7b,x+.7,2.6,z+.2,.9,1,.85,garden)}
 for(let i=0;i<20;i++){const x=-7+(i%10)*1.5,z=i<10?-4.1:5.7;rod(0x6a985b,[x,0,z],[x,.55,z],.025,garden);for(let p=0;p<5;p++){const a=p*Math.PI*2/5;orb(i%2?0xefb99d:0xd2b2d8,x+Math.cos(a)*.12,.6+Math.sin(a)*.12,z,.1,.1,.05,garden)}orb(0xf1d16d,x,.6,z+.05,.07,.07,.03,garden)}
 for(const [x,text,color]of[[-3,'A a',0x82a46b],[3,'B b',0x739fb7]]){cube(color,x,1.25,-4.5,1.7,1.5,.9,garden);cyl(0xba965d,x,.45,-4.5,.1,.9,garden);labelBoard(text,x,1.6,-3.99,1.4,garden);cube(0x334c3e,x,.95,-3.99,.8,.09,.02,garden)}
 gardenItems=[];butterflyWings=[];
 ALPHABET_STEPS.forEach((item,index)=>{const root=new THREE.Group();root.position.set(item.x,0,-1.35);garden.add(root);cyl(0xd8b67d,0,.2,0,.82,.4,root);labelBoard(item.word,0,2.2,-.7,1.55,root);const thing=new THREE.Group();thing.position.y=.44;root.add(thing);
 if(index===0){orb(0xdd3a36,-.15,.4,0,.34,.4,.34,thing);orb(0xe74c36,.15,.4,0,.34,.4,.34,thing);rod(0x795c34,[0,.7,0],[.06,1,0],.045,thing);const leaf=orb(0x689b58,.2,.9,0,.23,.08,.1,thing);leaf.rotation.z=.35;}
 if(index===1){for(let i=0;i<3;i++)orb(0x5d3b2c,(i-1)*.28,.32,0,.18,.18,.16,thing);for(let i=0;i<3;i++)for(const side of[-1,1]){const x=(i-1)*.22;rod(0x48372b,[x,.25,side*.09],[x-.1,.05,side*.42],.024,thing)}for(const side of[-1,1]){rod(0x48372b,[.36,.45,side*.06],[.55,.69,side*.13],.018,thing);orb(0xfbf8e6,.43,.39,side*.12,.07,.07,.04,thing)}thing.scale.setScalar(1.5);}
 if(index===2){orb(0xe76a3d,0,.42,0,.43,.43,.43,thing);const band=mesh(new THREE.TorusGeometry(.431,.035,6,48),0xf5d679,0,.42,0,1,1,1,thing);band.rotation.x=.6;}
 if(index===3){orb(0x455f72,0,.7,0,.075,.36,.075,thing);for(const side of[-1,1]){const wing=new THREE.Group();wing.position.set(0,.7,0);orb(side<0?0x7ebbc5:0xc39ed5,side*.28,.12,0,.32,.37,.06,wing);orb(side<0?0xe1b3cf:0x96c8c7,side*.24,-.22,0,.26,.25,.06,wing);orb(0xf2d69c,side*.3,.15,.065,.1,.12,.02,wing);thing.add(wing);butterflyWings.push(wing);rod(0x455f72,[0,1,0],[side*.14,1.22,0],.018,thing)}}gardenItems.push({root,thing,word:item.word});});
}
function randomizeVocabularyGarden(){alphaSteps=createVocabularyRound();for(const item of alphaSteps){const entry=gardenItems.find(entry=>entry.word===item.word);entry.root.position.set(item.x,0,item.z);entry.thing.visible=true;}}
function setLessonWorld(){try{$('guidePortrait').hidden=lesson===RABBIT_STORY.id;if(rosita)rosita.visible=lesson!==RABBIT_STORY.id;if(rabbitWorld)rabbitWorld.root.visible=false;if(typeof clearFamilyProps==='function')clearFamilyProps();if(typeof paradeWorld!=='undefined'&&paradeWorld)paradeWorld.root.visible=false;if(typeof guideSpot!=='undefined'&&guideSpot)guideSpot.visible=lesson!=='cat';if(!garden)return;if(typeof catWorld!=='undefined'&&catWorld)catWorld.root.visible=false;
 if(lesson.startsWith('mac-')){
  const s=familyShelf.get(lesson);for(const w of [wantWorld,bodyWorld,phonicsWorld])if(w)w.root.visible=false;
  const outdoor=s.setting==='garden';garden.visible=outdoor&&!s.adventure;gardenItems.forEach(o=>o.thing.visible=false);roomNodes.forEach(o=>o.visible=!outdoor&&!s.adventure);ambientHelpers.forEach(o=>o.visible=false);
  $('roomTag').textContent=LESSONS[lesson].setting;$('modeLabel').textContent=s.title;$('quest').querySelector('.pill').textContent=s.title;$('playNav').textContent='Picture story';
  $('welcome').querySelector('.eyebrow').textContent='FAMILY PICTURE STORY';$('welcome').querySelector('.intro').textContent=s.intro;return;
 }
 if(lesson==='comparison'){
  for(const w of [wantWorld,bodyWorld,phonicsWorld])if(w)w.root.visible=false;
  garden.visible=false;roomNodes.forEach(o=>o.visible=false);ambientHelpers.forEach(o=>o.visible=false);
  if(!paradeWorld)paradeWorld=new ParadeHome(scene,{orb,cube,cyl,rod,labelBoard});
  paradeWorld.root.visible=true;scene.background.set(0xebd1cf);if(guideSpot)guideSpot.visible=false;
  $('roomTag').textContent='ABBY’S HOME · TOY THEATRE';$('welcome').querySelector('.eyebrow').textContent='CHAPTER 07 · COMPARISON';
  $('welcome').querySelector('.intro').textContent='Choose a friend for Abby’s Toy Parade.';setLessonLabels();return;
 }
 if(lesson==='cat'){
  if(wantWorld)wantWorld.root.visible=false;if(bodyWorld)bodyWorld.root.visible=false;if(phonicsWorld)phonicsWorld.root.visible=false;
  garden.visible=false;roomNodes.forEach(o=>o.visible=true);
  if(!catWorld)catWorld=new CatStoryWorld(scene,{orb,cube,cyl,rod});
  catWorld.root.visible=true;setLessonLabels();
  $('welcome').querySelector('.eyebrow').textContent='CHAPTER 06 · FIND CAT';
  $('welcome').querySelector('.intro').textContent='Choose a friend to play hide-and-seek with Cat.';
  return;
 }ambientHelpers.forEach(a=>a.visible=lesson!=='phonics');if(phonicsWorld)phonicsWorld.root.visible=false;if(lesson==='phonics'){if(bodyWorld)bodyWorld.root.visible=false;if(wantWorld)wantWorld.root.visible=false;garden.visible=false;roomNodes.forEach(o=>o.visible=false);if(!phonicsPair.length)phonicsPair=choosePhonicsPair(phonicsPool);if(!phonicsWorld)phonicsWorld=new PhonicsWorld(scene,{orb,cube,cyl,rod,labelBoard,sharedGeometry:g=>g===sphereGeo||[...boxCache.values(),...furCache.values()].includes(g),sharedMaterial:m=>[...mats.values()].includes(m)});phonicsWorld.root.visible=true;phonicsWorld.reset(phonicsPair);phonicsWorld.bindGuide(rosita);scene.background.set(0xc4e4df);$('roomTag').textContent='SOUND SAFARI · THE PARADE PARK';$('welcome').querySelector('.eyebrow').textContent='CHAPTER 05 · PHONICS';$('welcome').querySelector('.intro').textContent='Choose a friend, then approve two letters and meet your guide.';setLessonLabels();return}if(bodyWorld)bodyWorld.root.visible=false;if(lesson==='body'){if(!bodyWorld)bodyWorld=new BodyMissionWorld(scene,{orb,cube,cyl,labelBoard,puppet});bodyWorld.root.visible=true;bodyWorld.setCast(CHARACTERS.filter(c=>['Bert','Ernie','Tamir'].includes(c.name)&&c.name!==selected).sort((a,b)=>['Bert','Ernie','Tamir'].indexOf(a.name)-['Bert','Ernie','Tamir'].indexOf(b.name)).slice(0,2));if(wantWorld)wantWorld.root.visible=false;roomNodes.forEach(o=>o.visible=false);garden.visible=false;scene.background.set(0xc3e5e4);$('roomTag').textContent='BODY BOOGIE · THE PARK STAGE';$('welcome').querySelector('.eyebrow').textContent='CHAPTER 04 · BODY BOOGIE';$('welcome').querySelector('.intro').textContent='Choose your own friend for the park dance show.';setLessonLabels();return}const story=lesson==='wants',alphabet=lesson==='letters';if(wantWorld)wantWorld.root.visible=story;if(story){roomNodes.forEach(o=>o.visible=false);garden.visible=false;scene.background.set(0xe5ece0);$('roomTag').innerHTML='<span>♡</span> THE LITTLE PLAYHOUSE <small>What do you want?</small>';$('welcome').querySelector('.eyebrow').textContent='CHAPTER 03 · WHAT DO YOU WANT?';$('welcome').querySelector('.intro').textContent='Choose a friend to help the baby.';setLessonLabels();return}setLessonLabels();roomNodes.forEach(o=>o.visible=!alphabet);garden.visible=alphabet;gardenItems.forEach(o=>o.thing.visible=true);scene.background.set(alphabet?0xc3e5e4:0xdce7db);$('roomTag').innerHTML=alphabet?'<span>✦</span> LETTER GARDEN <small>A a · B b</small>':'<span>✦</span> THE PLAYROOM <small>In · On · Under</small>';$('welcome').querySelector('.eyebrow').textContent=`CHAPTER ${LESSONS[lesson].number} · ${LESSONS[lesson].title.toUpperCase()}`;$('welcome').querySelector('.intro').textContent=alphabet?'Choose a friend to deliver garden surprises.':'Choose a friend to play catch with your story guide.';}finally{if(typeof environment!=='undefined'&&environment){const roots=lesson==='ball'?roomNodes:lesson==='letters'?[garden]:lesson==='wants'?[wantWorld?.root]:lesson==='body'?[bodyWorld?.root]:[phonicsWorld?.root];environment.root.visible=lesson!==RABBIT_STORY.id;environment.sky.visible=lesson!==RABBIT_STORY.id;environment.setLesson(lesson.startsWith('mac-')?(familyShelf.get(lesson).setting==='garden'?'letters':'ball'):['comparison','cat'].includes(lesson)?'ball':lesson,lesson.startsWith('mac-')||lesson==='comparison'?[]:lesson==='cat'?roomNodes:roots);}}}
function clearLearningTray(){$('learningTray').hidden=true;$('learningTray').innerHTML='';document.body.classList.remove('learning','vocabulary-review');if(renderer)resize()}
function learningTray(html){$('learningTray').innerHTML=storyText(html);$('learningTray').hidden=false;document.body.classList.add('learning');if(renderer)resize()}
function alphabetPlan(){showModal('plan',`${closeHTML}<div class="eyebrow">VOCABULARY GAME · CHAPTER 02</div><h2 id="modalTitle">Letter Garden Delivery</h2><p>Find four garden surprises, recognise each letter form, and name what you find with “a” or “an”. Then hear each word and match its picture to one of four written choices.</p><div class="learning-card"><div class="chips"><span>A</span><span>a</span><span>B</span><span>b</span></div><strong>A / a → apple, ant</strong><strong>B / b → ball, butterfly</strong><p>Speaking targets: “An apple.”, “An ant.”, “A ball.”, “A butterfly.”</p></div><p class="note-caption">She tries first. A parent approves each spoken response. Shorter word practice and full models are available. About three minutes, with extra speaking time.</p><button id="alphaBegin" class="primary">Approve & start →</button>`);wireClose();$('alphaBegin').onclick=()=>beginAlphabet();}
async function beginAlphabet(){if(!selected){friends();return}if(!startTownStory())return;audioUnlocked=true;music.start('game');closeModal();const token=++sessionToken;phase='preparing';completed=false;helpCount=0;newXP=0;alphaIndex=0;randomizeVocabularyGarden();setLessonWorld();player.visible=true;player.position.set(-2,0,3);parkGuide();$('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;$('playControls').hidden=true;$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('targetLabel').hidden=true;ball.visible=false;beacon.visible=false;clearLearningTray();document.body.classList.add('playing');$('speakerName').textContent='ROSITA';dialogue('Welcome to Letter Garden!','Help Rosita deliver four little surprises.');resize();if(token!==sessionToken||phase!=='preparing')return;phase='alpha-intro';speak('Welcome to Letter Garden! Four surprises need a home. Let us find their letters!',()=>{if(token===sessionToken&&phase==='alpha-intro')alphabetLetter()});}
function alphabetLetter(){phase='alpha-letter';letterCorrect=false;stopInput();beacon.visible=false;$('playControls').hidden=true;$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('targetLabel').hidden=true;const item=alphaSteps[alphaIndex];drawSteps(alphaIndex);dialogue(`Find the ${item.form} letter.`,'Listen to Rosita, then tap the matching letter below.');learningTray(`<div class="letter-options">${shuffled(['A','a','B','b']).map(letter=>`<button data-letter="${letter}" aria-label="${letter===letter.toUpperCase()?'Capital':'Small'} ${letter}">${letter}</button>`).join('')}</div><p class="tray-note" id="letterFeedback">Which one is ${item.form} ${item.letter}?</p>`);document.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>chooseAlphabetLetter(b.dataset.letter));speak(`Find ${item.form} ${item.letter}.`);}
function chooseAlphabetLetter(choice){if(phase!=='alpha-letter'||letterCorrect)return;const item=alphaSteps[alphaIndex];if(!letterMatches(choice,item.letter)){helpCount++;$('letterFeedback').textContent=`Have another look. Find ${item.form} ${item.letter}.`;speak(`Have another look. Find ${item.form} ${item.letter}.`);return}letterCorrect=true;cheerHelpers();clearLearningTray();phase='explore';const point=new THREE.Vector3(item.x,0,item.z+1.25);beacon.position.copy(point);beacon.visible=true;lastNear=null;$('playControls').hidden=false;$('targetLabel').hidden=false;$('targetLabel').textContent=`Walk to the ${item.word}`;parkGuide();dialogue(`Yes! Now find the ${item.word}.`,'Walk to the marker, then collect the garden surprise.');speak(`Yes, ${item.form} ${item.letter}! Now find the ${item.word}.`);}
function collectAlphabet(){if(phase!=='explore'||!$('modalShade').hidden)return;const item=alphaSteps[alphaIndex];if(player.position.clone().setY(0).distanceTo(new THREE.Vector3(item.x,0,item.z+1.25))>=1.75)return;phase='alpha-say';stopInput();beacon.visible=false;$('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=false;$('parentDot').hidden=true;dialogue('Tell Rosita what you found. Use “a” or “an”.','Try first. A grown-up can help if you need it.');const token=sessionToken;updateSpeakingControls('Listen to your friend…');speak('What did you find?',()=>{if(token===sessionToken&&phase==='alpha-say'){updateSpeakingControls();}});}
function alphabetHint(short){demonstratePronunciation(short)}
function acceptAlphabet(){if(phase!=='alpha-say')return;closeModal();stopSpeech();$('parentDot').hidden=true;$('listening').hidden=true;document.body.classList.remove('speaking-turn');phase='alpha-delivery';gardenItems.find(entry=>entry.word===alphaSteps[alphaIndex].word).thing.visible=false;setCharacterPose(player,'joy');dialogue('A lovely delivery!','Another little surprise is on its way home.');const token=sessionToken;const next=()=>{if(token!==sessionToken||phase!=='alpha-delivery')return;if(!$('modalShade').hidden){setTimeout(next,200);return}setCharacterPose(player,'file');alphaIndex++;if(alphaIndex<ALPHABET_STEPS.length)alphabetLetter();else{reviewIndex=0;reviewOrder=shuffled(ALPHABET_STEPS.map(item=>item.word));vocabularyReview()}};setTimeout(next,900);}
function experiencePanel(){stopInput();const canUnwrap=['landing','chapter','home','reward'].includes(phase);showModal('experience',`${closeHTML}<div class="eyebrow">PARENT SETTINGS</div><h2 id="modalTitle">Experience & surprises</h2><div class="learning-card"><strong>Level ${data.level} · ${data.xp} / ${need()} XP</strong><p>${data.unlocked.length} friends unlocked · ${data.pendingRewards||0} surprise rewards waiting</p></div><label for="xpAmount">Add experience points</label><div class="xp-input-row"><input id="xpAmount" type="number" min="1" max="5000" step="1" value="40" inputmode="numeric"><button id="addXP" class="primary">Add XP</button></div><p class="tray-note" id="xpFeedback"></p><button id="resetXP" class="secondary">Reset XP & level</button><p class="note-caption">Reset returns to Level 1 and 0 XP. Unlocked friends, vocabulary, earned surprise rewards, and your notes are kept.</p>${xpUndo?'<button id="undoXP" class="secondary">Undo last XP change</button>':''}${data.pendingRewards&&canUnwrap?'<button id="openBoxes" class="primary">Let her choose a mystery box ✦</button>':''}${data.pendingRewards&&!canUnwrap?'<p class="note-caption">Open the surprise boxes after this adventure.</p>':''}`);wireClose();$('addXP').onclick=()=>{const amount=Number($('xpAmount').value);if(!Number.isSafeInteger(amount)||amount<1||amount>5000){$('xpFeedback').textContent='Please enter a whole number from 1 to 5000.';return}xpUndo=captureExperience();grantExperience(data,amount,CHARACTERS.map(c=>c.name));save();updateProgress();experiencePanel();toast(`Added ${amount} XP`)};$('resetXP').onclick=()=>{xpUndo=captureExperience();data.xp=0;data.level=1;save();updateProgress();experiencePanel();toast('XP and level reset. Friends, words and notes kept.');};$('undoXP')?.addEventListener('click',()=>{Object.assign(data,xpUndo);xpUndo=null;save();updateProgress();experiencePanel()});$('openBoxes')?.addEventListener('click',unlockPanel);}
function celebrationChime(){if(!sound)return;try{const ctx=new(window.AudioContext||window.webkitAudioContext)();[523.25,659.25,783.99,1046.5].forEach((frequency,i)=>{const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,ctx.currentTime+i*.13);gain.gain.linearRampToValueAtTime(.085,ctx.currentTime+i*.13+.03);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.13+.6);oscillator.connect(gain).connect(ctx.destination);oscillator.start(ctx.currentTime+i*.13);oscillator.stop(ctx.currentTime+i*.13+.65)});setTimeout(()=>ctx.close(),1600)}catch{}}
function unlockPanel(){const choices=mysteryCandidates(data,CHARACTERS.map(c=>c.name));if(!choices.length){home();return}save();showModal('unlock',`<div class="reward mystery-reward"><div class="eyebrow" style="justify-content:center">LEVEL ${data.level} · A NEW FRIEND</div><h2 id="modalTitle" style="margin-right:0">Choose your surprise!</h2><p id="mysteryInstruction">Three mystery boxes. One wonderful new friend.<br>Every box has a friend you haven’t unlocked!</p><div class="mystery-stage" id="mysteryStage"><div class="reward-beam"></div><div class="mystery-boxes">${choices.map((_,i)=>`<button class="mystery-box box-${i}" data-box="${i}" aria-label="Choose mystery box ${i+1}"><span class="box-lid"></span><span class="box-base"><b>?</b></span><small>BOX ${i+1}</small></button>`).join('')}</div><div id="rewardFriend" class="reward-friend" hidden><img id="rewardPortrait" alt=""><div class="reward-halo"></div></div><div class="reward-confetti" id="rewardConfetti"></div></div><h3 id="revealedName" aria-live="polite" hidden></h3><button id="mysteryContinue" class="primary" hidden>${data.pendingRewards>1?'Another surprise is waiting →':'Back to the adventures →'}</button></div>`,true);let opened=false;document.querySelectorAll('[data-box]').forEach(button=>button.onclick=()=>{if(opened)return;const name=claimMystery(data,Number(button.dataset.box));if(!name)return;opened=true;xpUndo=null;save();updateProgress();document.querySelectorAll('[data-box]').forEach(b=>{b.disabled=true;b.classList.add(b===button?'winner':'unchosen')});$('mysteryStage').classList.add('opening');$('mysteryInstruction').textContent='A little sparkle… a new friend is on the way!';$('rewardPortrait').src=portraits[name];$('rewardPortrait').alt=name;celebrationChime();const delay=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:1200;setTimeout(()=>{if(modalKind!=='unlock')return;$('rewardFriend').hidden=false;$('mysteryStage').classList.add('revealed');$('revealedName').hidden=false;$('revealedName').textContent=`${name} has joined your adventures!`;$('mysteryInstruction').textContent='Your new friend is now in Choose character.';$('rewardConfetti').innerHTML=Array.from({length:32},(_,i)=>`<i style="--x:${(i*37)%100}%;--delay:${(i%5)*.07}s;--color:${['#e9bd59','#98b9a2','#db99ad','#8caec7'][i%4]};--turn:${i*43}deg"></i>`).join('');$('mysteryContinue').hidden=false;speak(`Surprise! ${name} is your new friend!`);},delay)});$('mysteryContinue').onclick=()=>data.pendingRewards?unlockPanel():home();}
function snuffyModel(spec){const g=new THREE.Group(),legs=[];orb(spec.color,0,1.25,-.1,.92,.73,1.25,g);fur(g,spec.color,[0,1.25,-.1],[.92,.73,1.25],2200);orb(spec.color,0,1.55,.9,.67,.6,.65,g);fur(g,spec.color,[0,1.55,.9],[.67,.6,.65],1300);for(const x of[-.56,.56])for(const z of[-.8,.65]){const leg=new THREE.Group();leg.position.set(x,.47,z);orb(spec.color,0,0,0,.28,.43,.28,leg);g.add(leg);legs.push(leg)}for(const side of[-1,1]){orb(0xf4f0cc,side*.3,1.84,1.4,.19,.23,.12,g);orb(0x29362c,side*.3,1.84,1.51,.07,.11,.02,g);for(let j=0;j<3;j++)rod(0x4a3025,[side*.3+(j-1)*.09,2.02,1.47],[side*.3+(j-1)*.11,2.18,1.5],.025,g)}for(let i=0;i<7;i++)orb(spec.color,0,1.35-i*.13,1.42+i*.075,.2-i*.012,.2,.2,g);const mouth=new THREE.Group();g.add(mouth);g.userData={arms:[],legs,mouth,spec,pose:'file',ready:Promise.resolve()};return g;}

function captureExperience(){return {xp:data.xp,level:data.level,pendingRewards:data.pendingRewards||0,rewardChoices:data.rewardChoices?structuredClone(data.rewardChoices):null}}
function vocabularyReview(){phase='vocab-review';beacon.visible=false;stopInput();stopSpeech();const word=reviewOrder[reviewIndex];dialogue('Look, listen, and choose.','Tap the word that matches the picture.');document.body.classList.add('vocabulary-review');learningTray(`<div class="vocabulary-review-layout"><div class="review-picture">${wordPicture(word)}<button id="hearReviewWord" class="hear-word">♫ Hear the word</button></div><div class="review-answers"><div class="word-options">${reviewChoices(word).map(option=>`<button data-review-word="${option}">${option}</button>`).join('')}</div><p id="reviewFeedback" class="tray-note" role="status">Word ${reviewIndex+1} of ${reviewOrder.length}</p></div></div>`);$('hearReviewWord').onclick=()=>speak(word);document.querySelectorAll('[data-review-word]').forEach(button=>button.onclick=()=>chooseReviewWord(button.dataset.reviewWord));speak(word);}
function chooseReviewWord(choice){if(phase!=='vocab-review')return;const word=reviewOrder[reviewIndex];if(choice!==word){helpCount++;$('reviewFeedback').textContent='Look at the picture and listen once more.';speak(word);return}phase='vocab-feedback';document.querySelectorAll('[data-review-word]').forEach(button=>{button.disabled=true;if(button.dataset.reviewWord===word)button.classList.add('correct')});$('reviewFeedback').textContent=`Yes! ${word}.`;cheerHelpers();const token=sessionToken;const next=()=>{if(token!==sessionToken||phase!=='vocab-feedback')return;if(!$('modalShade').hidden){setTimeout(next,200);return}reviewIndex++;if(reviewIndex<reviewOrder.length){vocabularyReview();return}document.body.classList.remove('vocabulary-review');clearLearningTray();stopSpeech();phase='rating';drawSteps(4);rating=helpCount>=3?30:helpCount>0?40:50;dialogue('Four words, wonderfully practised!','Next, save each word to your vocabulary bank.');ratePanel();};speak(`Yes, ${word}!`,()=>setTimeout(next,400));}
function memoryCards(){const pending=(data.pendingWordSaves||[]).filter(word=>VOCABULARY[word]);if(!pending.length){memoryComplete();return}phase='memory';if(!data.wordSaveBatch?.length){data.wordSaveBatch=[...pending];save()}const batch=data.wordSaveBatch;const word=pending[0],index=batch.length-pending.length+1;showModal('memory',`<div class="memory-card"><div class="eyebrow" style="justify-content:center">MY VOCABULARY · ${Math.max(1,index)} OF ${batch.length}</div><h2 id="modalTitle" style="margin-right:0">A word to remember</h2><div class="memory-picture">${wordPicture(word)}</div><h3>${word}</h3><button id="hearMemoryWord" class="hear-word">♫ Hear ${word}</button><p>Have you learnt and remembered this word?</p><button id="saveMemoryWord" class="primary">I know this word — save it! ♡</button><button id="practiceMemoryWord" class="text-button">Let’s practise once more</button><button id="saveWordsLater" class="text-button">Save the remaining words later</button><small>You choose when a word joins your bank.</small></div>`);$('saveWordsLater').onclick=showLanding;$('hearMemoryWord').onclick=()=>speak(word);$('practiceMemoryWord').onclick=()=>speak(word);let saved=false;$('saveMemoryWord').onclick=()=>{if(saved)return;saved=true;rememberWord(data,word,new Date().toISOString(),lesson==='phonics'?'Sound Safari Phonics':undefined);save();updateProgress();$('saveMemoryWord').disabled=true;$('saveMemoryWord').textContent='Saved to my word bank ✓';cheerHelpers();setTimeout(()=>{if(modalKind==='memory')memoryCards()},450)};speak(word);}
function memoryComplete(){const batch=(data.wordSaveBatch?.length?data.wordSaveBatch:Object.keys(data.vocabulary||{})).filter(word=>data.vocabulary?.[word]&&VOCABULARY[word]);phase='memory-complete';showModal('memory-complete',`<div class="memory-card"><div class="eyebrow" style="justify-content:center">MY LITTLE COLLECTION OF WORDS</div><h2 id="modalTitle" style="margin-right:0">${batch.length} words in your bank!</h2><div class="saved-word-row">${batch.map(word=>`<div>${wordPicture(word)}<strong>${word}</strong><span>✓ Marked learnt</span></div>`).join('')}</div><p>You chose to save each word as learnt and remembered.<br>You can hear and practise them again in your bank.</p><button id="seeVocabularyBank" class="secondary">Open my vocabulary bank</button><button id="memoryDone" class="primary">${data.pendingRewards?'Choose a mystery box! ✦':'Back to the adventures →'}</button></div>`,true);$('seeVocabularyBank').onclick=vocabularyBank;$('memoryDone').onclick=()=>data.pendingRewards?unlockPanel():home();}
function vocabularyBank(source){stopInput();const fromShelf=source==='house-shelf';const words=Object.keys(data.vocabulary||{}).filter(word=>VOCABULARY[word]);bankSelection=new Set([...bankSelection].filter(word=>words.includes(word)));const fromMemory=phase==='memory-complete',canSave=['landing','chapter','home','reward','memory','memory-complete'].includes(phase),pending=(data.pendingWordSaves||[]).filter(word=>VOCABULARY[word]);const shelfControls=fromShelf&&shelfPageCount(words)>1
 ? '<div class="house-shelf-pager"><button id="houseShelfPrevious" class="secondary">Previous shelf</button><strong id="houseShelfPage" role="status"></strong><button id="houseShelfNext" class="secondary">Next shelf</button></div>' : '';
 showModal('vocabulary-bank',`${closeHTML}<div class="eyebrow">MY VOCABULARY BANK</div><h2 id="modalTitle">${fromShelf?'Word Library':'Little words, kept for later'}</h2>${shelfControls}<p>${words.length} ${words.length===1?'word':'words'} marked as learnt by your child. Hear them again, or choose words for a future game.</p>${pending.length&&canSave?`<button id="resumeWordSaving" class="primary">Finish saving ${pending.length} ${pending.length===1?'word':'words'} →</button>`:''}${words.length?`<div class="vocabulary-grid">${words.map(word=>`<article class="vocabulary-card"><label class="vocabulary-select"><input type="checkbox" data-bank-select="${word}" aria-label="Select ${word} for a word set" ${bankSelection.has(word)?'checked':''}>${wordPicture(word)}<strong>${word}</strong></label><span class="learnt-mark">✓ Marked learnt & remembered</span><button class="hear-word" data-bank-hear="${word}">♫ Hear the word</button></article>`).join('')}</div><div class="word-set-builder"><h3>Keep a word set for another game</h3><p>Tick the words you want to reuse, then name this set.</p><label for="wordSetName">Word set name</label><div class="word-set-input"><input id="wordSetName" maxlength="60" placeholder="e.g. My garden words"><button id="saveWordSet" class="secondary">Save word set</button></div><p id="wordSetFeedback" class="tray-note" role="status"></p></div>`:'<div class="empty-word-bank"><span>♡</span><strong>Your first words are waiting.</strong><p>Finish the vocabulary adventure, then save each word yourself.</p></div>'}${data.vocabularySets?.length?`<div class="saved-word-sets"><h3>Word sets for future games</h3>${data.vocabularySets.map(set=>`<article><strong>${escapeHTML(set.title)}</strong><p>${set.words.filter(w=>VOCABULARY[w]).map(escapeHTML).join(' · ')}</p></article>`).join('')}</div>`:''}<p class="note-caption">Saved words and word sets stay in this browser. “Learnt” records your child’s own save action; it is not an automatic memory assessment. Word sets are kept for future game creation.</p><button id="bankDone" class="primary">${fromMemory?'Back to my word celebration':'Done'}</button>`,true);if(shelfControls){
  const paint=()=>{
   syncHouseShelf(words);
   $('houseShelfPage').textContent=`Shelf ${houseShelfPage+1} of ${shelfPageCount(words)}`;
   $('houseShelfPrevious').disabled=houseShelfPage===0;
   $('houseShelfNext').disabled=houseShelfPage+1>=shelfPageCount(words);
  };
  $('houseShelfPrevious').onclick=()=>{houseShelfPage--;paint();};
  $('houseShelfNext').onclick=()=>{houseShelfPage++;paint();};
  paint();
 }
 const done=()=>fromMemory?memoryComplete():closeModal();$('closeModal').onclick=done;$('bankDone').onclick=done;$('resumeWordSaving')?.addEventListener('click',memoryCards);document.querySelectorAll('[data-bank-hear]').forEach(button=>button.onclick=()=>speak(button.dataset.bankHear));document.querySelectorAll('[data-bank-select]').forEach(input=>input.onchange=()=>{if(input.checked)bankSelection.add(input.dataset.bankSelect);else bankSelection.delete(input.dataset.bankSelect)});$('saveWordSet')?.addEventListener('click',()=>{try{saveWordSet(data,$('wordSetName').value,[...bankSelection]);save();vocabularyBank(fromShelf?'house-shelf':undefined);toast('Word set saved for a future game.')}catch(error){$('wordSetFeedback').textContent=error.message}});}
function buildSupportCast(){helperCast=new THREE.Group();helperCast.userData.npcSupport=true;scene.add(helperCast);guideSpot=new THREE.Group();helperCast.add(guideSpot);for(const radius of[.7,.82]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.025,6,48),new THREE.MeshBasicMaterial({color:0xe8bc4e,transparent:true,opacity:.6,depthWrite:false}));ring.rotation.x=-Math.PI/2;guideSpot.add(ring)}guideSpot.position.y=.035;prepareNPCMaterials(rosita);ambientHelpers=[];const colours=[0x88b8b1,0xd5a58a,0xaab77a,0xaaa0c3];for(let i=0;i<2;i++){const robot=new THREE.Group(),colour=colours[Math.floor(Math.random()*colours.length)];orb(colour,0,.6,0,.28,.33,.22,robot);orb(colour,0,1.08,0,.33,.27,.25,robot);for(const side of[-1,1]){orb(0xfff7e1,side*.105,1.1,.22,.09,.1,.04,robot);orb(0x34574c,side*.105,1.09,.256,.036,.05,.015,robot);orb(0x556e64,side*.18,.2,.03,.13,.16,.14,robot)}rod(0x7b957e,[0,1.3,0],[0,1.55,0],.025,robot);orb(0xe8c570,0,1.57,0,.08,.08,.08,robot);const arms=[];for(const side of[-1,1]){const arm=new THREE.Group();arm.position.set(side*.3,.72,0);orb(colour,side*.09,-.08,0,.1,.2,.1,arm);robot.add(arm);arms.push(arm)}robot.userData={arms,cheerUntil:0};helperCast.add(robot);prepareNPCMaterials(robot);ambientHelpers.push(robot)}}
function prepareNPCMaterials(actor){const clones=new Map();actor.traverse(object=>{if(object.isMesh){const original=object.material;if(!clones.has(original))clones.set(original,original.clone());object.material=clones.get(original)}});actor.userData.npcMaterials=[...clones.values()];actor.userData.npcOpacity=1;}
function parkGuide(){if(!rosita)return;rosita.position.set(lesson==='phonics'?8.5:lesson==='letters'?6.8:6.6,0,lesson==='phonics'?-3.5:-1.05);rosita.rotation.y=-.7;if(guideSpot)guideSpot.position.set(rosita.position.x,.035,rosita.position.z);ambientHelpers.forEach((helper,index)=>helper.position.set(index===0?-7.6:7.8,0,index===0?-2.7:4.2));}
function npcObstructs(npc,cameraPosition,target,radius=1){const direction=target.clone().sub(cameraPosition),distance=direction.length();direction.normalize();const relative=npc.clone().sub(cameraPosition),along=relative.dot(direction);return along>0&&along<distance&&relative.addScaledVector(direction,-along).length()<radius;}
function updateSupportCast(time,dt){if(!helperCast||!player)return;const targets=[player.position.clone().add(new THREE.Vector3(0,1.3,0))];if(phase==='explore')targets.push(lesson.startsWith('mac-')?familyTarget().add(new THREE.Vector3(0,1,0)):lesson==='comparison'?paradeTarget().add(new THREE.Vector3(0,1,0)):lesson==='cat'?catTarget().add(new THREE.Vector3(0,1,0)):lesson==='phonics'?phonicsTarget().add(new THREE.Vector3(0,1.1,0)):lesson==='body'?bodyMissionTarget().add(new THREE.Vector3(0,1.1,0)):lesson==='wants'?wantTarget().add(new THREE.Vector3(0,1,0)):lesson==='letters'?new THREE.Vector3(alphaSteps[alphaIndex].x,1,alphaSteps[alphaIndex].z):places[order[step]].target.clone().add(new THREE.Vector3(0,1.1,0)));for(const actor of[rosita,...ambientHelpers]){const point=actor.position.clone().add(new THREE.Vector3(0,1.1,0)),blocked=actor===rosita&&phase==='intro'?false:targets.some(target=>npcObstructs(point,camera.position,target,actor===rosita?1:.65)),wanted=blocked?.12:1;actor.userData.npcOpacity+=(wanted-actor.userData.npcOpacity)*Math.min(dt*8,1);for(const material of actor.userData.npcMaterials){const transparent=actor.userData.npcOpacity<.995;if(material.transparent!==transparent){material.transparent=transparent;material.needsUpdate=true}material.opacity=actor.userData.npcOpacity;material.depthWrite=!transparent}if(actor!==rosita){actor.position.y=Math.sin(time*1.7)*.012;actor.rotation.y=Math.atan2(player.position.x-actor.position.x,player.position.z-actor.position.z);actor.userData.arms.forEach((arm,i)=>arm.rotation.z=time<actor.userData.cheerUntil?(i===0?-1.2:1.2)+Math.sin(time*10)*.2:Math.sin(time*1.2+i)*.08)}}}
function cheerHelpers(){ambientHelpers.forEach(helper=>helper.userData.cheerUntil=clock.elapsedTime+1.5)}
$('musicButton').onclick=toggleBackgroundMusic;
$('vocabularyNav').onclick=vocabularyBank;$('frontVocabulary').onclick=vocabularyBank;

// One shared wallet and wardrobe, independent of XP or the chosen character.
function openShop(view='shop'){if(!['shop','wardrobe'].includes(modalKind))shopReturn=modalKind==='reward'?'reward':modalKind==='memory-complete'?'memory-complete':'';shopView=view;renderShop();}
function closeShop(){const destination=shopReturn;shopReturn='';if(destination==='reward')rewardPanel();else if(destination==='memory-complete')memoryComplete();else closeModal();}
const SHOP_DEPARTMENTS=[
 ['all','All items'],['accessories','Accessories'],['clothes','Clothes'],['furniture','Furniture'],
 ['toys','Toys'],['decoration','Decorations'],['bedding','Bedding & teddies']
];
function ownedHomeDestination(item){
 return item.kind==='toy'?'Toy Cupboard':isWearable(item)?'Wardrobe':'Store Room';
}
function renderShop(message=''){
 normalizeShop(data);
 const wardrobe=shopView==='wardrobe';
 const equipped=SHOP_ITEMS.find(item=>item.id===data.equippedItem);
 const ownedWearables=SHOP_ITEMS.filter(item=>isWearable(item)&&data.ownedItems.includes(item.id));
 const inventory=wardrobe?ownedWearables:SHOP_ITEMS;
 const items=wardrobe||shopCategory==='all'?inventory:inventory.filter(item=>item.category===shopCategory);
 const outfit=`<div class="outfit-status"><span>${equipped?`${itemSVG(equipped.id)} <strong>${equipped.name}</strong> is ready for your adventure.`:'Choose an item to wear or carry.'}</span>${equipped?'<button id="takeOff" class="small-button">Take off</button>':''}</div>`;
 const filters=wardrobe?'':`<div class="shop-tabs shop-categories" role="group" aria-label="Shop departments">${SHOP_DEPARTMENTS.map(([value,label])=>`<button data-shop-category="${value}" aria-pressed="${value===shopCategory}" class="${value===shopCategory?'active':''}">${label}</button>`).join('')}</div>`;
 const cards=items.map(item=>{
  const owned=data.ownedItems.includes(item.id),wearing=data.equippedItem===item.id,afford=data.stickers>=item.price;
  const department=SHOP_DEPARTMENTS.find(([key])=>item.category===key)[1];
  const kindLabel=isWearable(item)&&item.category==='accessories'?(item.kind==='wear'?'Wear':'Carry'):department;
  const cost=`<div class="item-price">${stickerSVG()}<span>${item.price} ${item.price===1?'sticker':'stickers'}</span></div>`;
  const action=owned?isWearable(item)
    ?`<button data-equip="${item.id}" class="${wearing?'secondary':'primary'}" ${wearing?'disabled':''}>${wearing?'Equipped':item.kind==='wear'?'Wear this':'Carry this'}</button>`
    :`<button class="secondary" data-home-collection="${item.kind==='toy'?'toys':'storage'}">Open ${ownedHomeDestination(item)}</button>`
    :`<button data-buy="${item.id}" class="primary" aria-label="Buy ${item.name} for ${item.price} stickers" ${afford?'':'disabled'}>Buy · ${item.price}</button>`;
  return `<article class="shop-item ${wearing?'equipped':''}"><div class="shop-item-picture">${itemSVG(item.id)}<span class="item-kind">${kindLabel}</span></div><h3>${item.name}</h3><p>${item.description}</p>${cost}${action}<small class="owned-mark">${owned?'In your '+ownedHomeDestination(item):afford?'':'Earn '+(item.price-data.stickers)+' more to buy'}</small></article>`;
 }).join('');
 showModal(wardrobe?'wardrobe':'shop',`${closeHTML}<h2 id="modalTitle">${wardrobe?'My wardrobe':'Sticker Shop'}</h2><div class="shop-wallet">${stickerSVG()}<div><strong>${data.stickers} <span>golden ${data.stickers===1?'sticker':'stickers'}</span></strong><small>Finish any adventure to earn 3 more.</small></div></div><div class="shop-tabs" role="group" aria-label="Shop or wardrobe"><button id="shopTab" class="${wardrobe?'':'active'}" aria-pressed="${!wardrobe}">Shop</button><button id="wardrobeTab" class="${wardrobe?'active':''}" aria-pressed="${wardrobe}">Wardrobe · ${ownedWearables.length}</button></div>${wardrobe?outfit:filters}<p id="shopStatus" class="shop-status" role="status">${escapeHTML(message)}</p>${cards?`<div class="shop-grid">${cards}</div>`:'<p>Collect stickers by finishing an adventure, then visit the shop.</p>'}<button id="shopDone" class="secondary">${shopReturn?'Back to your celebration':'Done'}</button>`,true);
 $('closeModal').onclick=closeShop;$('shopDone').onclick=closeShop;
 $('shopTab').onclick=()=>openShop('shop');$('wardrobeTab').onclick=()=>openShop('wardrobe');
 $('modal').querySelectorAll('[data-shop-category]').forEach(button=>button.onclick=()=>{
  shopCategory=button.dataset.shopCategory;renderShop();
 });
 $('modal').querySelectorAll('[data-home-collection]').forEach(button=>button.onclick=()=>openHouseCollection(button.dataset.homeCollection,true));
 $('modal').querySelectorAll('[data-buy]').forEach(button=>button.onclick=()=>{
  const result=buyItem(data,button.dataset.buy);
  if(!result.ok){renderShop(result.reason==='insufficient'?'Earn more stickers to buy this item.':'You already own this item.');return;}
  save();updateProgress();townWorld?.syncHomeItems(data);
  renderShop(`${result.item.name} was added to your ${ownedHomeDestination(result.item)}.`);
 });
 $('modal').querySelectorAll('[data-equip]').forEach(button=>button.onclick=()=>{
  if(!equipItem(data,button.dataset.equip))return;
  attachAccessory(player,data.equippedItem);save();updateProgress();renderShop('Ready for your next adventure!');
 });
 $('takeOff')?.addEventListener('click',()=>{equipItem(data,null);clearAccessory(player);save();renderShop('Item returned to your wardrobe.');});
}

function openHouseCollection(view='storage',fromShop=false,message=''){
 normalizeShop(data);
 const toys=view==='toys',atHome=townView==='house'&&phase==='town-free';
 const owned=HOME_GOODS.filter(item=>data.ownedItems.includes(item.id)&&(toys?item.kind==='toy':item.kind!=='toy'));
 const floorItems=owned.filter(canPlaceOnFloor);
 const active=floorItems.find(item=>item.id===houseItemSelection)??floorItems[0];
 houseItemSelection=active?.id??'';
 const layout=data.houseLayout;
 const selectedPlace=active?layout[active.id]:null;
 const occupied=new Map(Object.entries(layout).map(([id,p])=>[p.slot,id]));
 const slotPicker=active?HOUSE_SLOTS.map(spot=>{
  const owner=occupied.get(spot.id),blocked=!!owner&&owner!==active.id;
  const stateLabel=blocked?HOME_ITEM.get(owner).name:owner?'Here now':'Available';
  return `<button data-place-house="${spot.id}" class="house-spot ${owner===active.id?'current':''}" ${blocked?'disabled':''}><strong>${spot.name}</strong><small>${stateLabel}</small></button>`;
 }).join(''):'';
 const placement=active?`<section class="house-arrange"><h3 id="houseArrangeTitle" tabindex="-1">Place ${active.name}</h3><div class="house-spots">${slotPicker}</div>${selectedPlace?'<button data-place-house="storage" class="secondary">Put it back in storage</button>':''}</section>`:'';
 const cards=owned.map(item=>{
  const where=layout[item.id],used=data.houseSheets===item.id||data.housePlush===item.id;
  const action=toys?'':canPlaceOnFloor(item)
    ?`<button class="secondary" data-arrange-item="${item.id}" aria-pressed="${active?.id===item.id}">Arrange</button>`
    :`<button class="${used?'secondary':'primary'}" data-bed-item="${item.id}">${used?'Put away':item.kind==='sheet'?'Change bedsheets':'Put on the bed'}</button>`;
  return `<article class="shop-item"><div class="shop-item-picture">${itemSVG(item.id)}</div><h3>${item.name}</h3><p>${toys?'On the toy shelf':used?'On the bed':where?HOUSE_SLOTS.find(spot=>spot.id===where.slot)?.name:'In storage'}</p>${action}</article>`;
 }).join('');
 showModal('house-collection',`${closeHTML}<h2 id="modalTitle">${toys?'Toy Cupboard':'Store Room'}</h2><p>${toys?'Toys you buy go straight onto the cupboard shelves.':'Pick an owned item, choose a spot along a wall. It will face the open floor.'}</p><p role="status">${escapeHTML(message)}</p>${cards?`<div class="shop-grid">${cards}</div>`:`<p>${toys?'Buy a toy in the Sticker Shop to fill your cupboard.':'Buy furniture, decorations or bedding in the Sticker Shop to fill your storeroom.'}</p><button id="collectionsShop" class="primary">Sticker Shop</button>`}${toys?'':placement}<button id="collectionsDone" class="secondary">${fromShop?'Back to shop':'Done'}</button>`,true);
 const redraw=text=>openHouseCollection(view,fromShop,text);
 const finish=()=>fromShop?renderShop():closeModal();
 $('closeModal').onclick=finish;$('collectionsDone').onclick=finish;
 $('collectionsShop')?.addEventListener('click',()=>openShop('shop'));
 $('modal').querySelectorAll('[data-arrange-item]').forEach(button=>button.onclick=()=>{
  houseItemSelection=button.dataset.arrangeItem;redraw('');
  $('houseArrangeTitle').focus();
 });
 $('modal').querySelectorAll('[data-place-house]').forEach(button=>button.onclick=()=>{
  const prior=data.houseLayout[active.id];
  if(!placeHouseItem(data,active.id,button.dataset.placeHouse)){
   redraw('That spot is already in use.');return;
  }
  townWorld?.syncHomeItems(data);
  if(atHome&&!townWorld.canWalk(player.position.x,player.position.z,'house')){
   if(prior)data.houseLayout[active.id]=prior;
   else delete data.houseLayout[active.id];
   townWorld.syncHomeItems(data);
   redraw('Move away from that spot before placing the item.');return;
  }
  save();redraw(button.dataset.placeHouse==='storage'?'Item returned to storage.':'Item placed in your house.');
 });
 $('modal').querySelectorAll('[data-bed-item]').forEach(button=>button.onclick=()=>{
  if(!chooseBedItem(data,button.dataset.bedItem))return;
  save();townWorld?.syncHomeItems(data);redraw('Bed updated.');
 });
}
$('frontShop').innerHTML=`${stickerSVG()} Shop & wardrobe <span id="frontStickerCount">${data.stickers}</span>`;
$('shopNav').innerHTML=`${stickerSVG()} Shop <span id="navStickerCount">${data.stickers}</span>`;
$('frontShop').onclick=()=>openShop('shop');$('shopNav').onclick=()=>openShop('shop');$('inGameWardrobe').onclick=()=>openShop('wardrobe');

// Chapter 03 follows the supplied book's six food questions, with parent-led speaking.
function setLessonLabels(){if(lesson==='comparison'){$('modeLabel').textContent='Toy Parade · About 3 minutes';$('welcome').querySelector('.session-details span').textContent='◷ About 3 minutes';$('quest').querySelector('.pill').textContent='ABBY’S TOY PARADE';$('playNav').textContent='Toy Parade';return;}if(lesson==='cat'){$('modeLabel').textContent='Can you see the cat? · 3–5 minutes';$('quest').querySelector('.pill').textContent='CAN YOU SEE THE CAT?';$('playNav').textContent='Find Cat';return;}if(lesson==='phonics'){$('modeLabel').textContent='Sound Safari · About 5 minutes';$('welcome').querySelector('.session-details span').textContent='◷ About 5 minutes';$('quest').querySelector('.pill').textContent='SOUND SAFARI PHONICS';$('playNav').textContent='Sound Safari';return}if(lesson==='body'){$('modeLabel').textContent='Move, find & say · 3–5 minutes';$('welcome').querySelector('.session-details span').textContent='◷ About 3–5 minutes';$('quest').querySelector('.pill').textContent='BODY BOOGIE';$('playNav').textContent='Body Boogie';return}const story=lesson==='wants';$('modeLabel').textContent=story?'A story to tell · About 5 minutes':'A guided adventure · Ages 4+';$('welcome').querySelector('.session-details span').textContent=story?'◷ About 5 minutes':'◷ About 3 minutes';$('quest').querySelector('.pill').textContent=story?'WHAT DO YOU WANT?':lesson==='letters'?'LETTER GARDEN':'FIND THE MISSING BALL';$('playNav').textContent=story?'Playhouse':lesson==='letters'?'Letter Garden':'Playroom';}
function wantsPlan(){showModal('plan',`${closeHTML}<div class="eyebrow">PARENT PREVIEW · CHAPTER 03 · ABOUT 5 MINUTES</div><h2 id="modalTitle">What do you want?</h2><p>A baby is crying. Help your guide try six ideas in the pretend kitchen. He wants milk! Then your child chooses something and tells the story.</p><div class="learning-card"><small>FROM YOUR BOOK · EXACT FOOD QUESTIONS</small>${WANT_ITEMS.filter(word=>word!=='milk').map(word=>`<strong>${wantQuestion(word)}</strong>`).join('')}<small>MATCHING MILK QUESTION & SHOW-AND-TELL</small><strong>Do you want milk?</strong><strong>What do you want?</strong><strong>I want [my choice].</strong><strong>The baby wants milk.</strong></div><p class="note-caption">Nine speaking turns: an opening question, six food questions, her own choice, and a final story sentence. She tries first. Hear a model or practise a shorter phrase if needed; you approve every answer. Picture choices and short walks break up the speaking. Around five minutes, with no speaking deadline.</p><div class="status-box">Only pretend food is used. A grown-up puppet helps the baby at the end. No microphone access is needed; you accept each answer using the nearby button.</div><button id="wantsBegin" class="primary">Approve & start →</button>`);wireClose();$('wantsBegin').onclick=()=>beginWants();}
async function beginWants(){if(!selected){friends();return}if(!startTownStory())return;audioUnlocked=true;music.start('game');closeModal();const token=++sessionToken;phase='preparing';completed=false;helpCount=0;newXP=0;wantIndex=0;wantStage='opening';wantChoice='milk';wantRound=createWantRound();wantWorld.reset(wantRound);setLessonWorld();player.visible=true;player.position.set(2,0,3.6);player.rotation.y=-.3;parkGuide();ball.visible=false;beacon.visible=false;clearLearningTray();$('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;$('playControls').hidden=true;$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('parentDot').hidden=true;$('targetLabel').hidden=true;document.body.classList.add('playing','story-learning');$('speakerName').textContent='ROSITA';dialogue('The baby is crying.','Let’s find out what he wants. We can help together.');drawSteps(0);resize();if(token!==sessionToken||phase!=='preparing')return;phase='want-intro';speak('The baby is crying. Let us find out what he wants. Can you help me?',()=>{if(token===sessionToken&&phase==='want-intro')wantSpeaking('opening')});}
function wantTarget(){const item=wantRound[wantIndex];return item?new THREE.Vector3(item.x,0,item.z+1.15):new THREE.Vector3(2,0,3);}
function wantSpeakingTarget(){if(wantStage==='opening')return 'What do you want?';if(wantStage==='question')return wantQuestion(WANT_ITEMS[wantIndex]);if(wantStage==='choice')return `I want ${wantChoice}.`;return 'The baby wants milk.';}
function wantSpeaking(stage){wantStage=stage;phase='want-say';stopInput();beacon.visible=false;clearLearningTray();$('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=false;$('parentDot').hidden=true;$('speakerName').textContent=stage==='choice'?'ROSITA':'YOUR TURN';const word=stage==='question'?WANT_ITEMS[wantIndex]:stage==='choice'?wantChoice:'milk';const prompt=stage==='opening'?'What could you ask the baby?':stage==='question'?`Ask the baby about ${word}.`:stage==='choice'?'Tell Rosita what you want.':'Tell the story. What does the baby want?';dialogue(prompt,'Try first. Your grown-up can help. Take all the time you need.');if(stage!=='opening')learningTray(`<div class="want-speaking-picture">${wordPicture(word)}<span>${word}</span></div>`);drawSteps(stage==='opening'?0:stage==='question'?wantIndex+1:stage==='choice'?7:8);updateSpeakingControls('Listen, then have a try…');const token=sessionToken;speak(prompt,()=>{if(token===sessionToken&&phase==='want-say'){updateSpeakingControls();}});}
function wantHint(short){demonstratePronunciation(short)}
function wantFindFood(){phase='want-find';stopInput();$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('parentDot').hidden=true;beacon.visible=false;$('speakerName').textContent='ROSITA';const word=WANT_ITEMS[wantIndex];dialogue(`Let’s try ${word}.`,'Listen, look, and tap the matching picture.');learningTray(`<div class="want-food-grid">${wantOptions(word).map(option=>`<button data-want-food="${option}" aria-label="Choose ${option}">${wordPicture(option)}<strong>${option}</strong></button>`).join('')}</div><p id="wantFeedback" class="tray-note" role="status">Find the ${word}.</p>`);document.querySelectorAll('[data-want-food]').forEach(button=>button.onclick=()=>chooseWantFood(button.dataset.wantFood));speak(`Find the ${word}.`);}
function chooseWantFood(word){if(phase!=='want-find')return;const target=WANT_ITEMS[wantIndex];if(word!==target){helpCount++;$('wantFeedback').textContent=`Listen once more. Find the ${target}.`;speak(`Find the ${target}.`);return}cheerHelpers();clearLearningTray();phase='explore';beacon.position.copy(wantTarget());beacon.visible=true;lastNear=null;$('playControls').hidden=false;$('targetLabel').hidden=false;$('targetLabel').textContent=`Walk to the ${word}`;dialogue(`Yes! Collect the pretend ${word}.`,'Walk to the golden marker, then tap the hand.');speak(`Yes, ${word}! Let us collect it.`);}
function collectWant(){if(phase!=='explore'||!$('modalShade').hidden||player.position.clone().setY(0).distanceTo(wantTarget())>=1.75)return;wantSpeaking('question');}
function acceptWant(){if(phase!=='want-say')return;closeModal();stopSpeech();$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('parentDot').hidden=true;if(wantStage==='opening'){wantFindFood();return}if(wantStage==='choice'){wantSpeaking('show');return}if(wantStage==='show'){clearLearningTray();phase='rating';rating=helpCount>=3?30:helpCount>0?40:50;drawSteps(9);dialogue('You told the story!','Six foods, kind questions, and a happy little brother.');ratePanel();return}
 phase='want-response';const word=WANT_ITEMS[wantIndex],yes=word==='milk';wantWorld.stations.get(word).food.visible=false;wantWorld.offer(word);cheerHelpers();setCharacterPose(player,'joy');dialogue(yes?'Oh! You want milk.':wantAnswer(word),yes?'The grown-up helps the baby. Now he is happy!':'A good question. Let’s try another idea.');learningTray(`<div class="want-story-response"><div class="want-answer ${yes?'yes':'no'}">${yes?'♡ Yes, please!':'No, thank you.'}</div><p>${yes?'You listened and helped Rosita understand.':'That was a kind question. Keep helping Rosita.'}</p><button id="wantNext" class="primary">${yes?'What would you like? →':'Try another idea →'}</button></div>`);$('wantNext').disabled=true;const token=sessionToken;speak(yes?'Oh! You want milk. A grown-up can help. Now the baby is happy!':wantAnswer(word),()=>{if(token===sessionToken&&phase==='want-response')$('wantNext').disabled=false});$('wantNext').onclick=()=>advanceWant();}
function advanceWant(){if(phase!=='want-response'||$('wantNext').disabled)return;setCharacterPose(player,'file');if(WANT_ITEMS[wantIndex]==='milk'){wantPreference();return}wantIndex++;wantFindFood();}
function wantPreference(){phase='want-preference';$('speakerName').textContent='ROSITA';dialogue('What do you want?','Choose your own favourite, then tell Rosita.');learningTray(`<div class="want-food-grid preference-grid">${shuffled(WANT_ITEMS).map(word=>`<button data-want-choice="${word}" aria-label="I want ${word}">${wordPicture(word)}<strong>${word}</strong></button>`).join('')}</div>`);document.querySelectorAll('[data-want-choice]').forEach(button=>button.onclick=()=>chooseWantPreference(button.dataset.wantChoice));speak('What do you want? Choose something you like.');}
function chooseWantPreference(word){if(phase!=='want-preference'||!WANT_ITEMS.includes(word))return;wantChoice=word;wantSpeaking('choice');}

// Manual speaking flow: a model is optional and only a parent advances the turn.
function shorterSpeakingTarget(){if(phase==='family-say'&&lesson===TRANSPORTATION.id)return ['Where is the train?','It is yellow.','It has two wheels.','It goes on water.','Can it fly?',transportationWorld.picked?.description][familyIndex];if(phase==='family-say')return familyStory.adventure?familyStory.beats[familyIndex].sentence:familyStory.beats[familyIndex].word;if(phase==='parade-say')return paradeWord;if(phase==='cat-say')return CAT_TURNS[catIndex].short;if(phase==='phonics-say')return currentPhonicsTask().word||PHONICS[currentPhonicsTask().letter||phonicsPair[0]].words[0];if(phase==='body-say')return missionLabel(currentBodyMission());if(phase==='alpha-say')return alphaSteps[alphaIndex].word;if(phase==='want-say')return wantStage==='opening'?'What?':wantStage==='question'?WANT_ITEMS[wantIndex]:wantStage==='choice'?wantChoice:'milk';return phase==='ask'?'Where?':places[place].prep;}
function demonstratePronunciation(short=false){if(!speakingPhase())return;if(short)helpCount++;closeModal();const model=short?shorterSpeakingTarget():speakingTarget(),token=sessionToken,turn=phase,target=speakingTarget();updateSpeakingControls('Listen to the pronunciation…');$('modelSentence').hidden=false;$('modelSentence').textContent=model;const wasSound=sound;sound=true;speak(model,()=>{if(token!==sessionToken||phase!==turn||speakingTarget()!==target)return;updateSpeakingControls();$('modelSentence').hidden=false;$('modelSentence').textContent=model});sound=wasSound;}
function approveSpeaking(){if(!speakingPhase()||!parentApprovalReady||performance.now()-lastApprovalAt<450)return;lastApprovalAt=performance.now();parentApprovalReady=false;$('nearbyApprove').disabled=true;stopSpeech();acceptAnswer();}
function startWelcomeMusic(){audioUnlocked=true;if(data.musicEnabled!==false){music.setEnabled(true);music.start('front')}updateProgress();}
function toggleBackgroundMusic(){const enable=data.musicEnabled===false||!audioUnlocked;audioUnlocked=true;data.musicEnabled=enable;music.setEnabled(enable);if(enable)music.start(['landing','chapter','home'].includes(phase)?'front':'game');save();updateProgress();}
$('pronunciationButton').onclick=()=>demonstratePronunciation(false);$('shortPhraseButton').onclick=()=>demonstratePronunciation(true);$('nearbyApprove').onclick=approveSpeaking;$('frontMusic').onclick=toggleBackgroundMusic;
for(const id of ['frontShop','frontVocabulary','frontParent'])$(id).addEventListener('click',startWelcomeMusic);

function sessionWords(){if(lesson.startsWith('mac-'))return [...new Set(familyStory.beats.map(b=>b.word))];if(lesson==='comparison')return [...new Set(paradeRounds.flatMap(k=>[...PARADES[k].animals,...PARADES[k].words]))];if(lesson==='cat')return ['cat','bed','chair','basket','under','on','in'];if(lesson==='phonics')return phonicsWords(phonicsPair);return lesson==='body'?[...bodyWords]:lesson==='wants'?[...WANT_ITEMS]:lesson==='letters'?[...VOCABULARY_WORDS()]:['in','on','under'];}
function VOCABULARY_WORDS(){return [...new Set(ALPHABET_STEPS.map(x=>x.word))];}
function openJournal(filters={}){const entries=data.journal.filter(e=>noteMatches(e,filters));showModal('journal',`${closeHTML}<div class="eyebrow">PARENT LEARNING JOURNAL</div><h2 id="modalTitle">Small steps worth remembering</h2><p>Observations and game feedback, organized for the next adventure. Notes stay in this browser; export a copy to keep or share.</p><div class="journal-filters"><label>Chapter<select id="journalLesson"><option value="">All chapters</option>${Object.entries(LESSONS).map(([id,l])=>`<option value="${id}" ${filters.lesson===id?'selected':''}>${l.title}</option>`).join('')}</select></label><label>Category<select id="journalCategory"><option value="">All categories</option>${Object.entries(NOTE_CATEGORIES).map(([id,label])=>`<option value="${id}" ${filters.category===id?'selected':''}>${label}</option>`).join('')}</select></label><label>Word or phrase<input id="journalQuery" value="${escapeHTML(filters.query||'')}" placeholder="e.g. nose or pronunciation"></label></div><button id="filterNotes" class="secondary">Filter notes</button><button id="exportNotes" class="secondary">Download all notes (JSON)</button><p>${entries.length} matching sessions · ${data.journal.length} total</p>${entries.map(e=>`<article class="journal-entry"><strong>${escapeHTML(LESSONS[e.lesson]?.title||e.sentence)}</strong><small>${new Date(e.date).toLocaleString('en-HK',{timeZone:'Asia/Hong_Kong'})} · ${escapeHTML(e.character||'Friend')} · +${e.xp} XP</small><p>${escapeHTML((e.words||[]).join(' · ')||e.sentence)}</p>${Object.entries(e.categories||{}).filter(([,v])=>v).map(([k,v])=>`<h3>${NOTE_CATEGORIES[k]||escapeHTML(k)}</h3><p>${escapeHTML(v)}</p>`).join('')}${e.note?`<h3>${reviewTags(e.note).map(key=>NOTE_CATEGORIES[key]).join(' · ')}</h3><p>${escapeHTML(e.note)}</p>`:''}${!e.note&&!Object.values(e.categories||{}).some(Boolean)?'<p>No parent note added.</p>':''}${e.phonics?`<details><summary>Phonics session details</summary><p>Letters: ${escapeHTML(e.phonics.pair.join(' / '))} · Guide: ${escapeHTML(e.phonics.guide)}<br>${escapeHTML(e.phonics.tags.join(' · '))}</p></details>`:''}${e.bodyResults?`<details><summary>In-game body word observations</summary><p>${Object.entries(e.bodyResults).map(([w,r])=>`${escapeHTML(w)}: ${r.misses||0} identification retries; ${r.confirmed??(r.speakingConfirmed?1:0)} spoken missions confirmed by parent${r.sentences?.length?'; '+r.sentences.map(escapeHTML).join(' / '):''}`).join('<br>')}</p></details>`:''}</article>`).join('')||'<p>No sessions match these filters.</p>'}`,true);wireClose();$('filterNotes').onclick=()=>openJournal({lesson:$('journalLesson').value,category:$('journalCategory').value,query:$('journalQuery').value.trim()});$('exportNotes').onclick=()=>{const blob=new Blob([JSON.stringify({schemaVersion:1,exportedAt:new Date().toISOString(),timezone:'Asia/Hong_Kong',sessions:data.journal.map(entry=>({...entry,reviewCategories:reviewTags(entry.note)}))},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='little-street-parent-notes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};}
function bodyTitle(){selected=null;if(player)player.visible=false;$('chapterPage').innerHTML=`<button id="titleBack" class="chapter-back">← Choose another adventure</button><div class="chapter-content"><span class="chapter-number">CHAPTER 04 · THE PARK STAGE</span><h1 id="chapterTitle">Ready for the<br><em>Body Boogie?</em></h1><p>The friends need a body-part detective!<br>Explore the park, visit your friends, and get the show ready.</p><div class="chapter-targets">${bodyWords.map(w=>`<span>${w}</span>`).join('')}</div><button id="bodyChooseWords" class="secondary">Parent: choose today’s words (${bodyWords.length})</button><button id="chapterContinue" class="front-start" ${bodyWords.length?'':'disabled'}>Choose your friend →</button><small>Walk → tap a part on a friend → speak → next mission.<br>About 3–5 minutes with four words; extra speaking time is welcome.</small></div>`;$('titleBack').onclick=showChapter;$('bodyChooseWords').onclick=()=>bodyPlan(true);$('chapterContinue').onclick=openCharacterSelect;}
function bodyPlan(fromTitle=false){let draft=new Set(bodyWords);showModal('body-plan',`${closeHTML}<div class="eyebrow">PARENT SETUP · BODY BOOGIE</div><h2 id="modalTitle">Choose today’s body words</h2><p>Pick words from your poster. Your child will walk between Sesame Street friends, tap the part directly on the 3D character, and practise speaking. A second mission relay revises the same words. Four words keeps this short; more words means a longer adventure.</p><div class="choice-row"><button id="bodyStarter">Starter four</button><button id="bodyClear">Clear all</button></div>${Object.entries(BODY_GROUPS).map(([group,words])=>`<fieldset class="body-word-group"><legend>${group}</legend>${words.map(w=>`<label><input type="checkbox" data-body-word="${w}" ${draft.has(w)?'checked':''}> ${w}</label>`).join('')}</fieldset>`).join('')}<label class="body-side-setting"><input id="bodySides" type="checkbox" ${data.bodySides!==false?'checked':''}> Include left and right for paired parts</label><p class="note-caption">“Left” and “right” belong to the friend, not the screen. When facing you, their left is on your right. Examples: “This is the left hand.” or “This is the nose.” Small parts use a closer view of the same 3D character.</p><p id="bodySelectionInfo" role="status"></p><button id="bodyPlanSave" class="primary">${fromTitle?'Save words & return':'Approve words & start →'}</button>`,true);wireClose();const paint=()=>{$('bodySelectionInfo').textContent=draft.size?`${draft.size} words · ${draft.size*2} walking missions${draft.size>6?' · Longer adventure':''}`:'Select at least one word to continue.';$('bodyPlanSave').disabled=!draft.size;document.querySelectorAll('[data-body-word]').forEach(c=>c.checked=draft.has(c.dataset.bodyWord));};document.querySelectorAll('[data-body-word]').forEach(c=>c.onchange=()=>{c.checked?draft.add(c.dataset.bodyWord):draft.delete(c.dataset.bodyWord);paint();});$('bodyStarter').onclick=()=>{draft=new Set(BODY_START);paint()};$('bodyClear').onclick=()=>{draft.clear();paint()};$('bodyPlanSave').onclick=()=>{bodyWords=validBodyWords([...draft]);data.bodyWords=bodyWords;data.bodySides=$('bodySides').checked;save();if(fromTitle){closeModal();bodyTitle();}else beginBody();};paint();}
function currentBodyMission(){return bodyOrder[bodyIndex];}
function bodyMissionTarget(){return bodyReturning?bodyWorld.finishTarget.clone():bodyWorld.target(currentBodyMission().actorIndex);}
function bodyTools(html=''){$('bodyMissionTools').innerHTML=html;$('bodyMissionTools').hidden=!html;}
function beginBody(){if(!selected){friends();return}if(!bodyWords.length){bodyPlan();return}if(!startTownStory())return;audioUnlocked=true;music.start('game');sessionToken++;completed=false;helpCount=0;newXP=0;bodyIndex=0;bodyReturning=false;bodyOrder=createBodyMissions(bodyWords,data.bodySides!==false);bodyResults=Object.fromEntries(bodyWords.map(w=>[w,{misses:0,confirmed:0,sentences:[]}]));closeModal();setLessonWorld();player.visible=true;player.position.set(0,0,5.7);parkGuide();ball.visible=false;clearLearningTray();$('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;document.body.classList.add('playing','body-missions');bodyFind(true);resize();}
function bodyFind(opening=false){phase='explore';stopInput();stopSpeech();$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('playControls').hidden=false;$('targetLabel').hidden=false;bodyTools();const m=currentBodyMission(),station=bodyWorld.stations[m.actorIndex];bodyWorld.activate(m.actorIndex);beacon.position.copy(bodyMissionTarget());beacon.visible=true;lastNear=null;bodyCloseView=false;cameraOrbit.yaw=0;cameraOrbit.pitch=0;$('speakerName').textContent='ROSITA';dialogue(opening?'Body parts can be tricky. Can you help me?':m.round===1?'Show-time relay! Help the next friend.':'Another friend needs your help!',`Walk to ${station.spec.name}, then tap the hand button. Mission ${bodyIndex+1} of ${bodyOrder.length}.`);$('targetLabel').textContent=`Walk to ${station.spec.name} ↓`;speak((opening?'It is hard to identify different body parts. Can you help me? ':bodyIndex===bodyWords.length?'Time for the show-time relay! ':'')+`Walk to ${station.spec.name}. We need to find the ${missionLabel(m)}.`);bodySteps();}
function interactBody(){if(phase!=='explore'||!$('modalShade').hidden||!bodyWorld||player.position.distanceTo(bodyMissionTarget())>=1.75)return;if(bodyReturning){finishBodyShow();return}inspectBody();}
function inspectBody(){const m=currentBodyMission();if(!bodyWorld.near(player.position,m.actorIndex))return;phase='body-find';stopInput();stopSpeech();beacon.visible=false;$('playControls').hidden=true;$('targetLabel').hidden=true;bodyCloseView=(FACE_PARTS.has(m.word)&&m.word!=='head'&&m.word!=='hair')||['finger','toe','ankle','elbow'].includes(m.word);cameraOrbit.yaw=0;cameraOrbit.pitch=0;bodyWorld.clearHighlight();$('speakerName').textContent='ROSITA';dialogue(missionQuestion(m),`Tap directly on ${bodyWorld.stations[m.actorIndex].spec.name}. Drag to look around.${m.side?' Left/right belongs to the friend.':''}`);bodyTools('<button id="bodyZoom">Whole friend / closer look</button><button id="bodyWalkAgain">Walk again</button>');$('bodyZoom').onclick=()=>{bodyCloseView=!bodyCloseView;cameraOrbit.yaw=0;cameraOrbit.pitch=0};$('bodyWalkAgain').onclick=()=>bodyFind();speak(missionQuestion(m));}
function tapBodyPart(x,y){if(phase!=='body-find'||!$('modalShade').hidden)return;const m=currentBodyMission();if(!bodyWorld.near(player.position,m.actorIndex))return;const r=renderer.domElement.getBoundingClientRect();if(!r.width||!r.height)return;const raycaster=new THREE.Raycaster();raycaster.setFromCamera(new THREE.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),camera);chooseBodyPart(bodyWorld.pick(raycaster,m));}
function chooseBodyPart(part){if(phase!=='body-find'||!part)return;const m=currentBodyMission();if(!matchesBodyPart(part,m)){helpCount++;bodyResults[m.word].misses++;dialogue(`Let’s look again. ${missionQuestion(m)}`,m.side?'Use the friend’s own left and right.':'You can move the camera or take a closer look.');speak(missionQuestion(m));return}bodyWorld.highlight({...m,side:m.side||part.side},part);cheerHelpers();bodySpeaking();}
function bodySpeaking(){phase='body-say';stopInput();bodyTools();$('listening').hidden=false;$('speakerName').textContent='YOUR TURN';dialogue('You found it! Tell Rosita.',`Try: “${missionSentence(currentBodyMission())}”`);updateSpeakingControls();}
function bodySteps(){const count=Math.min(bodyOrder.length,12),done=Math.floor(bodyIndex/Math.max(1,bodyOrder.length)*count);$('steps').innerHTML=Array.from({length:count},(_,i)=>`<i class="${i<done?'done':''}"></i>`).join('');}
function acceptBody(){if(phase!=='body-say')return;stopSpeech();closeModal();const m=currentBodyMission();bodyResults[m.word].confirmed++;bodyResults[m.word].sentences.push(missionSentence(m));bodyIndex++;if(bodyIndex<bodyOrder.length){bodyFind();return}bodyDance();}
function bodyDance(){phase='explore';bodyReturning=true;bodyCloseView=false;cameraOrbit.yaw=0;cameraOrbit.pitch=0;bodyWorld.clearHighlight();stopInput();$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('playControls').hidden=false;$('targetLabel').hidden=false;beacon.position.copy(bodyWorld.finishTarget);beacon.visible=true;lastNear=null;bodyTools();dialogue('The friends are ready for the show!','One last mission: walk to the dance stage and tap the hand.');$('targetLabel').textContent='Walk to the dance stage ↓';speak('You helped every friend! Now walk to the dance stage. Let us celebrate!');bodySteps();}
function finishBodyShow(){phase='body-show';stopInput();beacon.visible=false;$('playControls').hidden=true;$('targetLabel').hidden=true;player.position.set(0,0,-4);setCharacterPose(player,'joy');cheerHelpers();dialogue('You saved the Body Boogie show!','You explored, found the parts, and used your voice.');bodyTools('<button id="bodyFinish">Finish & add parent notes →</button>');$('bodyFinish').onclick=()=>{if(phase!=='body-show')return;stopSpeech();bodyTools();phase='rating';rating=helpCount>=3?30:helpCount?40:50;ratePanel();};speak('You saved the Body Boogie show! Thank you, friend!');}

// Chapter 05: all learning tasks happen on physical objects in the same 3D park.
function currentPhonicsTask(){return phonicsTasks[phonicsIndex];}
function phonicsTarget(){return phonicsWorld.target(currentPhonicsTask());}
function phonicsPrompt(task){if(!task)return 'Let’s play in the sound park.';return task.kind==='sound-search'?'Can you find something that starts with this sound?':'Look at the big word card. Can you find it in the park?';}
function phonicsTitle(fresh=false){selected=null;if(player)player.visible=false;if(phonicsPool.length<2)phonicsPool=[...PHONICS_LETTERS];if(fresh||!phonicsPair.length)phonicsPair=choosePhonicsPair(phonicsPool,data.phonicsLastPair||[]);$('chapterPage').innerHTML=`<button id="titleBack" class="chapter-back">← Choose another adventure</button><div class="chapter-content"><span class="chapter-number">CHAPTER 05 · PHONICS · ABOUT 5 MINUTES</span><h1 id="chapterTitle">Sound Safari<br><em>Parade</em></h1><p>The park friends are playing a sound-finding game!<br>Listen for starting sounds, then follow the word cards.</p><div class="chapter-targets">${phonicsPair.map(l=>`<span>${l} ${l.toLowerCase()}</span>`).join('')}${phonicsWords(phonicsPair).map(w=>`<span>${w}</span>`).join('')}</div><button id="phonicsChoosePool" class="secondary">Parent: choose the letter pool</button><button id="chapterContinue" class="front-start">Choose your friend →</button><small>Two random letters from your enabled A–H pool.<br>Extra speaking time is always welcome.</small></div>`;$('titleBack').onclick=showChapter;$('phonicsChoosePool').onclick=()=>phonicsPlan(true);$('chapterContinue').onclick=openCharacterSelect;}
function phonicsPlan(fromTitle=false){const draft=new Set(phonicsPool);showModal('phonics-plan',`${closeHTML}<div class="eyebrow">PARENT PREVIEW · SOUND SAFARI</div><h2 id="modalTitle">An open park. Two playful searches.</h2><p>${selected?`Playing as ${escapeHTML(selected)}, with ${escapeHTML(guideName)} as your guide.`:'Choose a character after setting today’s letters. Your guide will be a different friend.'} Enable the school letters you want available; every new adventure chooses two.</p><fieldset class="body-word-group"><legend>Enabled letter pool</legend>${PHONICS_LETTERS.map(l=>`<label><input type="checkbox" data-phonics-pool="${l}" ${draft.has(l)?'checked':''}> ${l} ${l.toLowerCase()}</label>`).join('')}</fieldset><div id="phonicsPreview" class="learning-card"></div><div class="choice-row"><button id="phonicsReroll">Draw two different letters</button><button id="phonicsReplayPair">Use last adventure’s pair</button></div><p id="phonicsPoolFeedback" role="status"></p><label for="phonicsCardCount">Words in the spelling-card round</label><select id="phonicsCardCount"><option value="3" ${data.phonicsCardCount!==2?'selected':''}>3 words</option><option value="2" ${data.phonicsCardCount===2?'selected':''}>2 words</option></select><details class="sound-clip-settings"><summary>Optional letter-sound clips</summary><p>Each search plays its built-in letter sound. A checked recording replaces that sound. You may add a short sound file (up to 180 KB) for each letter; these files stay on this device. Listen first, then confirm that the clip models the intended sound.</p>${PHONICS_LETTERS.map(l=>`<div class="sound-clip-row"><strong>${l} /${PHONICS[l].sound}/</strong><small>${PHONICS[l].hint}</small><input type="file" data-phonics-clip="${l}" accept="audio/*" aria-label="Add ${l} sound clip"><label><input type="checkbox" data-phonics-checked="${l}" ${data.phonicsSounds?.[l]?.checked?'checked':''}> I checked this sound</label><button data-phonics-preview="${l}" class="text-button">Preview clip</button><button data-phonics-remove="${l}" class="text-button">Remove clip</button><span data-phonics-status="${l}">${escapeHTML(data.phonicsSounds?.[l]?.name||'Built-in sound')}</span></div>`).join('')}</details><div class="status-box">Round 1 covers all four words by their starting sounds. Round 2 uses two or three spelling cards held by an NPC. Four slow-moving friends search alongside your child. Pronunciation models are optional; you approve speaking nearby. No microphone or voice scoring. Three stickers and parent notes follow the parade.</div><button id="phonicsApprove" class="primary">${fromTitle?'Save settings & return':'Approve & start the parade mission →'}</button>`,true);wireClose();const paint=()=>{const pool=[...draft];if(pool.length>=2&&!phonicsPair.every(l=>draft.has(l)))phonicsPair=choosePhonicsPair(pool,data.phonicsLastPair||[]);$('phonicsPreview').innerHTML=pool.length<2?'<strong>Enable at least two letters.</strong>':`<small>TODAY’S LETTERS AND WORDS</small>${phonicsPair.map(l=>`<strong>${l} ${l.toLowerCase()} · /${PHONICS[l].sound}/</strong><p>${PHONICS[l].words.join(' · ')}</p>`).join('')}`;$('phonicsApprove').disabled=pool.length<2;$('phonicsReroll').disabled=pool.length<2;$('phonicsReplayPair').disabled=!(data.phonicsLastPair?.length===2&&data.phonicsLastPair.every(l=>draft.has(l)));$('phonicsPoolFeedback').textContent=pool.length>=2?`${pool.length} enabled letters. Only these two letters and their four words are tested.`:'Enable two or more letters to continue.';};document.querySelectorAll('[data-phonics-pool]').forEach(c=>c.onchange=()=>{c.checked?draft.add(c.dataset.phonicsPool):draft.delete(c.dataset.phonicsPool);paint();});$('phonicsReroll').onclick=()=>{phonicsPair=choosePhonicsPair([...draft],phonicsPair);paint()};$('phonicsReplayPair').onclick=()=>{phonicsPair=[...data.phonicsLastPair];paint()};$('phonicsApprove').onclick=()=>{if(draft.size<2)return;phonicsPool=[...draft];data.phonicsPool=phonicsPool;data.phonicsCardCount=Number($('phonicsCardCount').value)===2?2:3;save();if(fromTitle){closeModal();phonicsTitle(false);}else beginPhonics();};
 document.querySelectorAll('[data-phonics-clip]').forEach(input=>input.onchange=()=>{const file=input.files?.[0],letter=input.dataset.phonicsClip;if(!file)return;if(!file.type.startsWith('audio/')||file.size>180000){toast('Choose an audio file up to 180 KB.');input.value='';return}const reader=new FileReader();reader.onload=()=>{data.phonicsSounds??={};data.phonicsSounds[letter]={src:reader.result,name:file.name,checked:false};save();const status=document.querySelector(`[data-phonics-status="${letter}"]`),check=document.querySelector(`[data-phonics-checked="${letter}"]`);if(status)status.textContent=file.name+' — please check the sound';if(check)check.checked=false;};reader.onerror=()=>toast('The clip could not be read. You can model the sound yourself.');reader.readAsDataURL(file);});
 document.querySelectorAll('[data-phonics-checked]').forEach(c=>c.onchange=()=>{const entry=data.phonicsSounds?.[c.dataset.phonicsChecked];if(!entry){c.checked=false;toast('Add a sound file first, or model it yourself.');return}entry.checked=c.checked;save();});document.querySelectorAll('[data-phonics-preview]').forEach(b=>b.onclick=()=>playPhonicsClip(b.dataset.phonicsPreview,true));document.querySelectorAll('[data-phonics-remove]').forEach(b=>b.onclick=()=>{const l=b.dataset.phonicsRemove;stopPhonicsAudio();if(data.phonicsSounds)delete data.phonicsSounds[l];save();document.querySelector(`[data-phonics-status="${l}"]`).textContent='Built-in sound';document.querySelector(`[data-phonics-checked="${l}"]`).checked=false;});paint();}
function beginPhonics(){if(!selected){friends();return}if(phonicsPair.length!==2){phonicsPlan();return}if(!startTownStory())return;stopSpeech();closeModal();audioUnlocked=true;music.start('game');sessionToken++;completed=false;helpCount=0;newXP=0;phonicsIndex=0;phonicsFound=[];phonicsCardViewing=false;phonicsTasks=createPhonicsTasks(phonicsPair,Math.random,data.phonicsCardCount===2?2:3);phonicsResults={};data.phonicsLastPair=[...phonicsPair];save();setLessonWorld();player.visible=true;player.position.set(0,0,6.4);phonicsWorld.bindGuide(rosita);phonicsWorld.life.resetAgents();ball.visible=false;beacon.visible=false;clearLearningTray();$('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;$('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=true;document.body.classList.remove('speaking-turn');document.body.classList.add('playing','phonics-missions');phase='phonics-intro';phonicsIntroTime=0;$('speakerName').textContent=guideName.toUpperCase();dialogue('Our park friends are ready to play!','First find by starting sound. Then follow the big word cards.');bodyTools('<button id="phonicsStartNow">Let’s play! →</button>');$('phonicsStartNow').onclick=startPhonicsMissions;resize();speak('Our park friends are ready to play! First, find something that starts with the sound. Then, look at a word card and find it again.');}
function startPhonicsMissions(){if(phase!=='phonics-intro')return;stopSpeech();routePhonics();}
function routePhonics(){$('soundLetterBanner').hidden=true;phase='explore';stopSpeech();stopInput();$('listening').hidden=true;document.body.classList.remove('speaking-turn');$('playControls').hidden=false;$('targetLabel').hidden=false;beacon.visible=false;lastNear=null;phonicsFocusEntity=null;const task=currentPhonicsTask();task.excluded=task.kind==='sound-search'?[...phonicsFound]:[];phonicsCardViewing=task.kind==='card-word';cameraOrbit.yaw=0;cameraOrbit.pitch=0;phonicsWorld.beginSearch(task);$('speakerName').textContent=guideName.toUpperCase();dialogue(phonicsPrompt(task),task.kind==='sound-search'?`ROUND 1 · ${phonicsFound.length} / 4 words found · Find a new word for /${PHONICS[task.letter].sound}/. Your friends will give you time.`:`ROUND 2 · ${phonicsIndex-3} / ${phonicsTasks.length-4} cards · Read ${phonicsWorld.life.holder?.name||'your friend'}’s card, then find the animal or object.`);bodyTools(`${task.kind==='sound-search'?`<button id="phonicsSearchSound">Hear sound again</button>`:'<button id="phonicsViewCard">Look at the word card</button>'}<button id="phonicsMoreTime">More thinking time</button>`);$('phonicsSearchSound')?.addEventListener('click',modelSearchSound);$('phonicsViewCard')?.addEventListener('click',()=>{phonicsCardViewing=true;cameraOrbit.yaw=0;cameraOrbit.pitch=0;});$('phonicsMoreTime').onclick=()=>{phonicsWorld.life.waitLonger();toast('The park friends will wait another ten seconds.');};$('targetLabel').textContent='Explore the open park · friends help slowly';phonicsProgress();const token=sessionToken,index=phonicsIndex;speak(phonicsPrompt(task),()=>{if(token!==sessionToken||index!==phonicsIndex||phase!=='explore'||task.kind!=='sound-search')return;$('soundLetter').textContent=task.letter.toLowerCase();$('soundLetterBanner').hidden=false;if(sound)playPhonicsClip(task.letter);});}
function modelSearchSound(){const task=currentPhonicsTask();if(!task||task.kind!=='sound-search'||phase!=='explore')return;if(!playPhonicsClip(task.letter)){$('instruction').textContent=`Parent: model /${PHONICS[task.letter].sound}/ (${PHONICS[task.letter].hint}), then let her search. The friends will wait.`;phonicsWorld.life.waitLonger();}}
function phonicsProgress(){$('steps').innerHTML=phonicsTasks.map((_,i)=>`<i class="${i<phonicsIndex?'done':''}"></i>`).join('');}
function interactPhonics(){if(phase!=='explore'||!$('modalShade').hidden)return;const task=currentPhonicsTask(),entity=phonicsWorld.nearest(player.position,task);if(!entity)return;const needsFin=task.word==='fin'||task.kind==='sound-search'&&task.letter==='F'&&phonicsFound.includes('fish')&&!phonicsFound.includes('fin');if(needsFin&&['fin','fish'].includes(entity.word)){phase='phonics-detail';phonicsFocusEntity=entity;phonicsCardViewing=false;cameraOrbit.yaw=0;cameraOrbit.pitch=0;stopInput();$('playControls').hidden=true;$('targetLabel').hidden=true;dialogue('Look closely at the fish.','Tap the matching part directly on the fish in its pond.');bodyTools('<button id="phonicsWalkAgain">Walk again</button>');$('phonicsWalkAgain').onclick=routePhonics;return;}choosePhonicsEntity(entity,entity);}
function tapPhonicsWorld(x,y){if(!['explore','phonics-detail'].includes(phase)||!$('modalShade').hidden)return;const rect=renderer.domElement.getBoundingClientRect();if(!rect.width||!rect.height)return;const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1),camera);const hit=phonicsWorld.pick(ray,currentPhonicsTask(),player.position);if(hit)choosePhonicsEntity(hit.entity,hit.choice);}
function choosePhonicsEntity(entity,choice){if(!['explore','phonics-detail'].includes(phase)||!$('modalShade').hidden)return;const task=currentPhonicsTask();if(player.position.clone().setY(0).distanceTo(entity.approach)>=2)return;if(!phonicsMatches(task,choice)){helpCount++;const key=task.kind==='sound-search'?task.letter+' sound':task.word;phonicsResults[key]??={retries:0,confirmed:0};phonicsResults[key].retries++;dialogue('Let’s keep looking.',phonicsPrompt(task));return;}task.foundWord=choice.word;phonicsCardViewing=false;phonicsWorld.collect(entity);cheerHelpers();startPhonicsSpeaking();}
function startPhonicsSpeaking(){$('modelSentence').hidden=true;$('modelSentence').textContent='';phase='phonics-say';stopInput();stopSpeech();bodyTools();$('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=false;$('speakerName').textContent='YOUR TURN';dialogue('You found it! What is it?',`Try the word: ${currentPhonicsTask().foundWord}. Your grown-up approves when you are ready.`);updateSpeakingControls();bodyTools('<button id="phonicsPhrase">Hear a short phrase</button>');const id=currentPhonicsTask().id;$('phonicsPhrase').onclick=()=>{if(phase!=='phonics-say'||currentPhonicsTask().id!==id)return;const wasSound=sound;sound=true;speak(phonicsPhrase(currentPhonicsTask().foundWord));sound=wasSound;};}
function phonicsPhrase(word){return ['cut','dig'].includes(word)?`I can ${word}.`:`I found ${['axe','egg','elephant','ant'].includes(word)?'an':'a'} ${word}.`;}
function updatePhonicsSpeakingUI(){}
function stopPhonicsAudio(){if(!phonicsAudio)return;const audio=phonicsAudio;phonicsAudio=null;audio.onended=null;audio.onerror=null;audio.pause();speechActive=false;}
function playPhonicsClip(letter,preview=false){const clip=data.phonicsSounds?.[letter];const src=(preview||clip?.checked)&&clip?.src?clip.src:SOUND_MODELS[letter];if(!src)return false;stopSpeech();const audio=new Audio(src),token=sessionToken,index=phonicsIndex;phonicsAudio=audio;speechActive=true;const finish=()=>{if(phonicsAudio!==audio)return;phonicsAudio=null;speechActive=false;if(token===sessionToken&&index===phonicsIndex&&phase==='phonics-say')updatePhonicsSpeakingUI();};audio.onended=finish;audio.onerror=()=>{finish();toast('The clip could not play. Please model the sound together.');};audio.play().catch(()=>audio.onerror?.());return true;}
function acceptPhonics(){if(phase!=='phonics-say')return;stopSpeech();closeModal();const task=currentPhonicsTask(),key=task.foundWord;phonicsResults[key]??={retries:0,confirmed:0};phonicsResults[key].confirmed++;if(task.kind==='sound-search'&&!phonicsFound.includes(key))phonicsFound.push(key);advancePhonics();}
function advancePhonics(){phonicsIndex++;if(phonicsIndex>=phonicsTasks.length){finishPhonicsParade();return}routePhonics();}
function finishPhonicsParade(){phase='phonics-show';$('listening').hidden=true;document.body.classList.remove('speaking-turn');phonicsWorld.clearCargo();phonicsWorld.parade=true;phonicsWorld.life.clearCard();phonicsWorld.life.task=null;beacon.visible=false;setCharacterPose(player,'joy');cheerHelpers();dialogue('Wonderful sound-park exploring!','You found all four words by sound, then matched the big word cards.');bodyTools('<button id="phonicsFinish">Finish & add parent notes →</button>');$('phonicsFinish').onclick=()=>{if(phase!=='phonics-show')return;stopSpeech();bodyTools();phase='rating';rating=helpCount>=3?30:helpCount?40:50;ratePanel();};speak('Wonderful sound-park exploring! Thank you for playing with the park friends!');}
function phonicsJournal(){return {pair:[...phonicsPair],pool:[...phonicsPool],guide:guideName,words:phonicsWords(phonicsPair),observations:structuredClone(phonicsResults),soundRoundWords:[...phonicsFound],cardRoundWords:phonicsTasks.filter(t=>t.kind==='card-word').map(t=>t.word),npcReactionSeconds:8,soundMode:Object.fromEntries(phonicsPair.map(l=>[l,data.phonicsSounds?.[l]?.checked?'parent-checked clip':'built-in sound'])),tags:[...document.querySelectorAll('[data-phonics-tag]:checked')].map(c=>PHONICS_TAGS[Number(c.dataset.phonicsTag)]).filter(Boolean)};}


function catTarget(){return catWorld.targets[CAT_TURNS[catIndex]?.place]?.clone()||new THREE.Vector3(0,0,3);}
function catPlan(){
 showModal('plan',`${closeHTML}<h2 id="modalTitle">Can you see the cat?</h2><p>Walk under the bed, check on the chair, peek behind the curtain, and discover Cat in the basket.</p><p>Practise the book’s questions, “I can not see Cat,” “No!” and “Cat is in the basket!” A friendly dog searches with you.</p><p>About 3–5 minutes, with extra speaking time.</p><button id="catBegin" class="primary">Start the story →</button>`);
 wireClose();$('catBegin').onclick=beginCat;
}
function beginCat(){
 if(!selected){friends();return;}
 if(!startTownStory())return;stopSpeech();closeModal();sessionToken++;completed=false;helpCount=0;newXP=0;catIndex=0;
 setLessonWorld();catWorld.reset();player.visible=true;player.position.set(0,0,5.8);parkGuide();
 ball.visible=false;beacon.visible=false;if(guideSpot)guideSpot.visible=false;clearLearningTray();music.start('game');
 $('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;
 document.body.classList.add('playing');resize();
 catWorld.startOpening();phase='cat-intro';dialogue('Cat wants to play hide-and-seek!','Our dog friend will help us search the house.');
 const token=sessionToken;
 speak('Cat wants to play hide and seek! Our dog friend will help us look.',()=>{if(token===sessionToken&&lesson==='cat'&&phase==='cat-intro'){const wait=()=>{if(token!==sessionToken||phase!=='cat-intro')return;if(catWorld.opening){setTimeout(wait,120);return;}routeCat();};wait();}});
}
function routeCat(){
 stopSpeech();stopInput();$('listening').hidden=true;document.body.classList.remove('speaking-turn');beacon.visible=false;
 if(catIndex>=CAT_TURNS.length){phase='rating';rating=helpCount>2?30:helpCount?40:50;dialogue('We found Cat!','Silly Cat! Thank you for searching together.');ratePanel();return;}
 const turn=CAT_TURNS[catIndex];
 drawSteps(catIndex);
 if(!turn.place){catSpeaking();return;}
 catWorld.searchGoal=catTarget().add(new THREE.Vector3(-.85,0,-.35));phase='explore';lastNear=null;$('playControls').hidden=false;$('actionButton').hidden=false;$('actionButton').disabled=true;
 bodyTools('<button id="catLookButton" class="primary" disabled>Walk to the marker</button>');
 $('catLookButton').onclick=interactCat;
 $('targetLabel').hidden=false;resize();beacon.position.copy(catTarget());beacon.visible=true;
 $('speakerName').textContent=guideName.toUpperCase();dialogue(turn.prompt,'Walk to the marker, then tap the hand to look.');
 speak(turn.prompt);
}
function interactCat(){
 if(phase!=='explore'||!$('modalShade').hidden||player.position.clone().setY(0).distanceTo(catTarget())>=1.75)return;
 phase='cat-search';stopInput();beacon.visible=false;$('playControls').hidden=true;bodyTools();
 const place=CAT_TURNS[catIndex].place,token=sessionToken;
 dialogue(catActionLabel(),place==='bed'?'Lift the red drape… two slippers!':place==='chair'?'Lift the blue cushion… a ball of yarn!':place==='curtain'?'Pull back the curtain. The dog is sniffing near the basket!':place==='basket'?'Lift the blue cloth… who is inside?':'Give Cat a gentle hello.');
 catWorld.onInspectDone=()=>{catWorld.onInspectDone=null;if(token===sessionToken&&phase==='cat-search')catSpeaking();};
 catWorld.inspect(place);
}
function catSpeaking(){
 if(CAT_TURNS[catIndex]?.sentence==='Silly Cat!'){finishCatNarration();return;}
 bodyTools();
 phase='cat-say';stopInput();beacon.visible=false;$('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=false;
 $('speakerName').textContent='YOUR TURN';dialogue(CAT_TURNS[catIndex].prompt,'Try first. Hear a model if needed. Your grown-up can accept your answer below.');
 updateSpeakingControls();
}

function catActionLabel(){return ({bed:'Lift the red bed drape ✋',chair:'Lift the blue cushion ✋',curtain:'Pull the curtain ✋',basket:'Lift the basket cloth ✋',cat:'Pet Cat ✋'})[CAT_TURNS[catIndex]?.place]||'Look here ✋';}

function syncSpeakingBanner(){
 const banner=$('speakingBanner');
 const active=speakingPhase()&&!['landing','chapter','home'].includes(phase);
 const changed=banner.hidden===active;
 banner.hidden=!active;
 if(active)$('speakingBannerText').textContent=speakingTarget();
 if(changed&&typeof resize==='function')resize();
}
function finishCatNarration(){
 bodyTools();phase='cat-ending';stopInput();beacon.visible=false;
 $('playControls').hidden=true;$('listening').hidden=true;
 document.body.classList.remove('speaking-turn');
 dialogue('Silly Cat!','We found our playful friend in the basket.');
 const token=sessionToken;
 speak('Silly Cat!',()=>{if(token!==sessionToken||phase!=='cat-ending')return;catIndex++;routeCat();});
}

function paradePlan(){
 if(!selected){friends();return;}
 const visits=data.journal.filter(entry=>entry.lesson==='comparison');
 paradeRounds=visitParades(visits);
 const choices=paradeRounds.map(key=>PARADES[key].animals.join(' and ')).join(' · ');
 showModal('plan',closeHTML+'<h2 id="modalTitle">Abby’s Toy Parade</h2><p>Today’s toys: '+choices+'. Start each toy act, choose the animal, and describe it together. Finish with your favorite toy on stage.</p><button id="startParade" class="primary">Open the toy room →</button>');
 wireClose();$('startParade').onclick=beginParade;
}
function beginParade(){
 if(!selected){friends();return;}
 if(!paradeRounds.length)paradeRounds=visitParades(data.journal.filter(e=>e.lesson==='comparison'));
 if(!startTownStory())return;stopSpeech();closeModal();sessionToken++;completed=false;helpCount=0;newXP=0;
 setLessonWorld();paradeWorld.reset();parkGuide();ball.visible=false;player.visible=true;player.position.set(.2,0,5.6);clearLearningTray();music.start('game');
 $('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;
 document.body.classList.add('playing','body-missions');paradeRound=0;paradeTurn=0;paradeSaid='';paradeFavorite=null;
 paradeWalk('chest','Our parade needs some toys! Come open my toy chest.');
}
function paradeMission(){return PARADES[paradeRounds[paradeRound]];}
function paradeAnimals(){return paradeMode==='favorite'?paradeRounds.flatMap(key=>PARADES[key].animals):paradeMission().animals;}
function paradeTarget(){
 if(paradeMode==='chest')return paradeWorld.chest.clone();
 if(paradeMode==='start'){const key=paradeRounds[paradeRound];return key==='speed'?paradeWorld.start.clone():new THREE.Vector3(key==='size'?-2:0,0,key==='size'?1.25:key==='height'?1.58:2.45);}
 if(paradeMode==='stage')return paradeWorld.stage.clone();
 if(paradeMode==='trace'){const p=paradeWorld.approach(paradeMission().animals[paradeTurn]);p.x+=paradeTurn?.75:2.5;return p;}
 return paradeWorld.approach(paradeWorld.nearest(player.position,paradeAnimals()));
}
function paradeAction(){
 if(paradeMode==='pick'||paradeMode==='favorite')return 'Choose '+paradeWorld.nearest(player.position,paradeAnimals());
 return paradeMode==='trace'?'Touch the star':paradeMode==='chest'?'Open toy chest':paradeMode==='stage'?'Present my toy':paradeMission().action;
}
function paradeWalk(mode,prompt){
 paradeMode=mode;paradePrompt=prompt;phase='explore';lastNear=null;stopInput();
 $('playControls').hidden=false;$('actionButton').hidden=false;$('actionButton').disabled=true;$('targetLabel').hidden=false;
 $('listening').hidden=true;document.body.classList.remove('speaking-turn');
 beacon.visible=!['pick','favorite'].includes(mode);if(beacon.visible)beacon.position.copy(paradeTarget());
 bodyTools('<button id="paradeHand" class="primary" disabled>Walk closer</button>'+(mode==='pick'?'<button id="paradeReplay">Watch again</button>':''));
 $('paradeHand').onclick=interactParade;if(mode==='pick')$('paradeReplay').onclick=()=>{paradeWorld.setup(paradeRounds[paradeRound]);paradeWorld.run();paradeDemo();};
 $('speakerName').textContent=guideName.toUpperCase();dialogue(prompt,beacon.visible?'Walk to the gold spot and tap the hand.':'Walk to a toy, then tap it or choose it with the hand.');speak(prompt);resize();
}
function paradeDemo(){
 phase='parade-watch';beacon.visible=false;stopInput();bodyTools();$('playControls').hidden=true;$('targetLabel').hidden=true;
 dialogue('Watch the toys! ',paradeMission().clue);speak(paradeMission().clue);
}
function paradePick(){
 const w=paradeMission().words[paradeTurn];paradeWalk('pick','Which animal is '+w+'?');
}
function interactParade(hit){
 if(phase!=='explore'||!$('modalShade').hidden)return;
 const choice=typeof hit==='string'?hit:null;
 if(choice&&(!['favorite','pick'].includes(paradeMode)||!paradeAnimals().includes(choice)))return;
 const target=choice?paradeWorld.approach(choice):paradeTarget();
 if(player.position.clone().setY(0).distanceTo(target)>=1.75)return;
 switch(paradeMode){
 case 'chest':
  paradeWorld.setup(paradeRounds[paradeRound]);paradeWorld.opening=true;paradeWorld.lid.rotation.x=0;paradeWorld.elapsed=0;
  paradeWalk('start',paradeMission().intro);break;
 case 'start':
  paradeWorld.run();paradeDemo();break;
 case 'pick':{
  const n=choice||paradeWorld.nearest(player.position,paradeAnimals());
  if(n!==paradeMission().animals[paradeTurn]){const hint='Look again. '+paradeMission().clue;dialogue(hint,paradePrompt);speak(hint);return;}
  if(paradeRounds[paradeRound]==='length'){paradeWalk('trace','Follow the '+n+' from its head to the star by its tail.');return;}
  paradeSpeaking(n);break;
 }
 case 'trace':paradeSpeaking(paradeMission().animals[paradeTurn]);break;
 case 'favorite':
  paradeFavorite=choice||paradeWorld.nearest(player.position,paradeAnimals());paradeWorld.carried=paradeFavorite;
  paradeWalk('stage','Bring your '+paradeFavorite+' to the stage!');break;
 case 'stage':
  paradeWorld.carried=null;paradeWorld.toys[paradeFavorite].position.set(0,.6,-3.7);paradeWorld.toys[paradeFavorite].scale.setScalar(.85);
  paradeSpeaking(paradeFavorite);break;
 }
}
function paradeSpeaking(animal){
 const mission=Object.values(PARADES).find(p=>p.animals.includes(animal));paradeWord=mission.words[mission.animals.indexOf(animal)];paradeSaid='The '+animal+' is '+paradeWord+'.';
 phase='parade-say';stopInput();beacon.visible=false;bodyTools();$('playControls').hidden=true;$('targetLabel').hidden=true;$('listening').hidden=false;
 $('speakerName').textContent='YOUR TURN';dialogue(paradeMode==='stage'?'Introduce your parade star!':'Tell me about the '+animal+'.','Try first, then hear the model if you like.');updateSpeakingControls();
}
function acceptParade(){
 stopSpeech();$('listening').hidden=true;document.body.classList.remove('speaking-turn');
 if(paradeMode==='stage'){
  phase='parade-finale';paradeWorld.elapsed=0;paradeWorld.parading=paradeFavorite;setCharacterPose(rosita,'joy');cheerHelpers();
  dialogue('Hooray for the '+paradeFavorite+'!','Your toy leads the parade.');speak('Hooray for the '+paradeFavorite+'!');
  bodyTools('<button id="finishParade">Finish &amp; add parent notes →</button>');$('finishParade').onclick=()=>{if(phase!=='parade-finale')return;bodyTools();phase='rating';rating=helpCount>=3?30:helpCount?40:50;ratePanel();};return;
 }
 if(paradeTurn===0){paradeTurn=1;paradePick();return;}
 if(paradeRound===0){paradeRound=1;paradeTurn=0;paradeWorld.reset();paradeWalk('chest','Another pair of toys is waiting! Open the chest.');return;}
 paradeWorld.lineup(paradeRounds.flatMap(key=>PARADES[key].animals));paradeWalk('favorite','Pick your favorite toy for the parade!');
}
function paradeTap(x,y){
 if(phase!=='explore'||!['favorite','pick'].includes(paradeMode))return;
 const bounds=renderer.domElement.getBoundingClientRect(),ray=new THREE.Raycaster();
 ray.setFromCamera(new THREE.Vector2(2*(x-bounds.left)/bounds.width-1,1-2*(y-bounds.top)/bounds.height),camera);
 let o=ray.intersectObjects(paradeAnimals().map(n=>paradeWorld.toys[n]),true)[0]?.object;
 while(o&&!o.userData.animal)o=o.parent;if(o)interactParade(o.userData.animal);
}

function registerFamilyStories(list){
 for(const raw of list){const s=raw.id===TRANSPORTATION.id?TRANSPORTATION:raw.id===RABBIT_STORY.id?RABBIT_STORY:raw;familyShelf.set(s.id,s);LESSONS[s.id]={id:s.id,number:'★',type:'story',title:s.title,setting:s.setting==='garden'?'Story Garden':'Story Playroom',targets:s.beats.map(b=>b.word)};}
}
function familyPicker(){
 const grid=$('chapterPage').querySelector('.lesson-grid');if(!grid)return;
 if(!document.getElementById('familyImport')){
  const tools=document.createElement('details');tools.innerHTML='<summary>Parent · Add a Mac story</summary><label>Choose a file from Generated <input id="familyImport" type="file" accept=".json,application/json"></label>';
  grid.after(tools);
  tools.querySelector('input').onchange=async event=>{try{
   const file=event.target.files[0];if(!file)return;if(file.size>50000)throw Error();
   const story=readFamilyStory(JSON.parse(await file.text()));
   const imports=JSON.parse(localStorage.getItem('littleStreet.familyImports.v1')||'{}');imports[story.id]=story;
   localStorage.setItem('littleStreet.familyImports.v1',JSON.stringify(imports));registerFamilyStories([story]);showLessonPicker();toast('Picture story added.');
  }catch{toast('Choose a valid story JSON file from Generated.');}};
 }
 for(const s of familyShelf.values()){
  if(grid.querySelector('[data-lesson="'+s.id+'"]'))continue;
  const card=document.createElement('button');card.dataset.lesson=s.id;
  card.innerHTML='<span class="lesson-symbol">'+escapeHTML(s.beats[0].icon)+'</span><small>'+(s.adventure?'THE WHOLE STORY · 5–10 MIN':'FAMILY PICTURE STORY')+'</small><strong>'+escapeHTML(s.title)+'</strong><span>Play this story →</span>';
  card.onclick=()=>showChapterTitle(s.id);grid.appendChild(card);
 }
}
function familyPlan(){
 if(lesson===TRANSPORTATION.id){
  if(!selected){friends();return;}
  showModal('plan',closeHTML+'<h2 id="modalTitle">Transportation Toy Parade</h2><p>Clear the routes for five toys, then ring the parade bell. Ask and answer in full sentences and tell your helper about your favourite toy.</p><p>Allow about 5–10 minutes. A grown-up accepts each speaking turn, including the final description.</p><button id="familyStart" class="primary">Approve &amp; play</button>');
  wireClose();$('familyStart').onclick=beginTransportation;return;
 }
 if(lesson===RABBIT_STORY.id){rabbitPlan();return;}
 if(!selected){friends();return;}
 familyStory=familyShelf.get(lesson);const s=familyStory;
 showModal('plan',closeHTML+'<h2 id="modalTitle">'+escapeHTML(s.title)+'</h2><p>'+escapeHTML(s.intro)+'</p><p>'+s.beats.map(b=>escapeHTML(b.sentence)).join(' · ')+'</p><button id="familyStart" class="primary">Approve &amp; play →</button>');
 wireClose();$('familyStart').onclick=beginFamily;
}
function familyTarget(){if(lesson===TRANSPORTATION.id)return transportationWorld.target();return familyStory?.adventure?rabbitWorld.target():familyStops[familyIndex].clone();}
function clearFamilyProps(){
 if(transportationWorld)transportationWorld.root.visible=false;
 if(rabbitWorld)rabbitWorld.root.visible=false;
 if(!familyProps)return;
 scene.remove(familyProps);
 familyProps.traverse(o=>{if(o.material?.map?.isCanvasTexture){o.material.map.dispose();o.material.dispose();o.geometry.dispose();}});
 familyProps=null;
}
function beginFamily(){
 if(lesson===RABBIT_STORY.id){beginRabbit();return;}
 if(!selected){friends();return;}
 if(!startTownStory())return;familyStory=familyShelf.get(lesson);stopSpeech();closeModal();sessionToken++;completed=false;newXP=0;helpCount=0;familyIndex=0;
 setLessonWorld();clearFamilyProps();familyProps=new THREE.Group();scene.add(familyProps);
 const slots=shuffled([[-4,2],[3,2.9],[-2,-.7],[4,-.7],[-4.6,4.7],[1,5.1]]);
 familyStops=familyStory.beats.map((b,i)=>{const [x,z]=slots[i];const marker=new THREE.Group();familyProps.add(marker);marker.position.set(x,0,z);
  cyl(0xbc9d76,0,.16,0,.62,.32,marker);labelBoard(b.icon+' '+b.word,0,1.02,0,2.35,marker);return new THREE.Vector3(x,0,z+.65);});
 player.position.set(0,0,6.4);player.visible=true;ball.visible=false;parkGuide();music.start('game');clearLearningTray();
 $('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;document.body.classList.add('playing');
 familyWalk(true);
}
function familyWalk(opening=false,reply=''){
 const b=familyStory.beats[familyIndex];phase='explore';lastNear=null;
 $('playControls').hidden=false;$('actionButton').hidden=false;$('actionButton').disabled=true;$('targetLabel').hidden=false;$('listening').hidden=true;document.body.classList.remove('speaking-turn');
 beacon.position.copy(familyTarget());beacon.visible=true;$('speakerName').textContent=guideName.toUpperCase();const prompt=(reply?reply+' ':'')+(opening?familyStory.intro+' ':'')+b.clue;
 dialogue(prompt,lesson===TRANSPORTATION.id?'Follow the gold marker and tap the hand.':'Go to the story picture and tap the hand.');speak(prompt);resize();
}
function familyInteract(){
 if(lesson===TRANSPORTATION.id){interactTransportation();return;}
 if(familyStory?.adventure){interactRabbit();return;}
 if(phase!=='explore'||!$('modalShade').hidden||player.position.clone().setY(0).distanceTo(familyTarget())>=1.75)return;
 phase='family-say';stopInput();beacon.visible=false;$('playControls').hidden=true;$('targetLabel').hidden=true;$('speakerName').textContent='YOUR TURN';
 dialogue(familyStory.beats[familyIndex].word,'Tell your friend what you found.');updateSpeakingControls();
}
function familyAccept(){
 if(lesson===TRANSPORTATION.id){acceptTransportation();return;}
 if(familyStory?.adventure){nextRabbit();return;}
 stopSpeech();$('listening').hidden=true;document.body.classList.remove('speaking-turn');familyProps.children[familyIndex].visible=false;
 if(++familyIndex<familyStory.beats.length){familyWalk();return;}
 phase='family-end';dialogue(familyStory.ending,'Your picture story is complete.');speak(familyStory.ending);cheerHelpers();
 bodyTools('<button id="familyFinish">Finish &amp; add parent notes →</button>');$('familyFinish').onclick=()=>{if(phase!=='family-end')return;bodyTools();phase='rating';rating=helpCount>=3?30:helpCount?40:50;ratePanel();};
}
let familySyncBusy=false;
async function refreshFamilyShelf(){
 if(familySyncBusy||document.hidden)return;familySyncBusy=true;
 try{const list=await syncFamilyStories();if(list){registerFamilyStories(list);if(phase==='chapter')familyPicker();else if(townView)refreshTownPlaces();}}
 catch{if(phase==='chapter')toast('Mac sync is unavailable. Saved stories are still ready to play.');}
 finally{familySyncBusy=false;}
}
registerFamilyStories([RABBIT_STORY,TRANSPORTATION]);
try{pairMac();registerFamilyStories(loadFamilyStories());registerFamilyStories(Object.values(JSON.parse(localStorage.getItem('littleStreet.familyImports.v1')||'{}')).map(readFamilyStory));refreshFamilyShelf();}catch{toast('Could not read the Mac story collection.');}
window.addEventListener('focus',refreshFamilyShelf);
setInterval(()=>{if(phase==='chapter'||phase==='landing'||townView)refreshFamilyShelf();},120000);

function beginTransportation(){
 if(!selected){friends();return;}
 if(!startTownStory())return;
 familyStory=TRANSPORTATION;stopSpeech();stopInput();closeModal();sessionToken++;
 completed=false;newXP=0;helpCount=0;familyIndex=0;
 setLessonWorld();
 if(!transportationWorld)transportationWorld=new TransportationWorld(scene,{orb,cube,cyl,rod,labelBoard});
 transportationWorld.reset();
 player.position.set(0,0,6.1);player.visible=true;ball.visible=false;
 parkGuide();rosita.position.set(0,0,-3.9);rosita.rotation.y=0;
 if(guideSpot)guideSpot.visible=false;
 scene.background.set(0xf2dfbd);scene.fog.color.set(0xf2dfbd);
 Object.assign(cameraOrbit,{yaw:0,pitch:0,zoom:1});wideView=false;
 music.start('game');clearLearningTray();
 $('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;
 document.body.classList.add('playing');
 routeTransportation(true);
}
function routeTransportation(opening=false,reply=''){
 transportationWorld.index=familyIndex;
 familyWalk(opening,reply);
 const beat=transportationWorld.current;
 $('quest').querySelector('.pill').textContent=familyIndex===TRANSPORTATION.beats.length-1?'Toy parade':(familyIndex+1)+' / 5 · '+beat.word;
}
function interactTransportation(){
 if(phase!=='explore'||!$('modalShade').hidden)return;
 const picking=transportationWorld.choosing;
 if(!(picking?transportationWorld.pickUp(player.position):transportationWorld.interact(player.position)))return;
 stopSpeech();stopInput();
 phase='family-action';beacon.visible=false;$('playControls').hidden=true;$('targetLabel').hidden=true;
 Object.assign(cameraOrbit,{yaw:0,pitch:0,zoom:1});
 if(picking)dialogue('You picked up the '+transportationWorld.picked.word+'!','Look closely at your toy.');
 else dialogue(transportationWorld.current.action,'Watch the toys move!');
}
function transportationActionDone(){
 const beat=transportationWorld.current;
 if(beat.word==='toy parade'&&!transportationWorld.picked){
  transportationWorld.beginPickup();
  phase='explore';$('playControls').hidden=false;$('actionButton').disabled=true;$('targetLabel').hidden=false;
  $('speakerName').textContent=guideName.toUpperCase();
  dialogue(beat.prompt,'Walk to a gold ring and tap the hand.');
  speak(beat.prompt);
  return;
 }
 transportationSpeak();
}
function transportationSpeak(){
 phase='family-say';$('speakerName').textContent='YOUR TURN';$('parentDot').hidden=true;
 $('modelSentence').hidden=true;$('modelSentence').textContent='';
 const beat=transportationWorld.current;
 dialogue(transportationWorld.picked?'Tell us about your '+transportationWorld.picked.word+'.':beat.prompt,'Take your time. Your grown-up can listen and accept your answer.');
 updateSpeakingControls();
 if(transportationWorld.picked)$('nearbyApprove').textContent='Parent: accept free talk';
 else speak(beat.prompt);
}
function acceptTransportation(){
 if(phase!=='family-say')return;
 closeModal();stopSpeech();$('listening').hidden=true;document.body.classList.remove('speaking-turn');
 const reply=({train:'The train goes along the track.',airplane:'Yes! The airplane can fly over the town.'})[transportationWorld.current.word];
 if(++familyIndex<TRANSPORTATION.beats.length){routeTransportation(false,reply);return;}
 phase='rating';dialogue(TRANSPORTATION.ending,'You finished the toy parade.');cheerHelpers();
 rating=helpCount>=3?30:helpCount?40:50;ratePanel();
}

// Full-book adventure: actions change the story before any optional model or parent approval.
function rabbitPlan(){
 if(!selected){friends();return;}
 familyStory=RABBIT_STORY;
 showModal('plan',closeHTML+'<div class="eyebrow">THE WHOLE STORY · ABOUT 5–10 MINUTES</div><h2 id="modalTitle">Little Rabbit’s Special Delivery</h2><p>Your chosen friend helps Little Rabbit from the vegetable garden to Grandma’s tree house and all the way home.</p><p>Water and pull the carrot, wrap and carry it, rest on the sunny hill, meet Cat, Fish and Bird, keep the gift safe, knock, give, sing, wave goodbye, and tell Mum and Dad.</p><p>Short English phrases grow out of these actions. Hear a model only if wanted; a grown-up accepts speaking with no deadline.</p><button id="familyStart" class="primary">Begin the whole story →</button>');
 wireClose();$('familyStart').onclick=beginRabbit;
}
function beginRabbit(){
 if(!selected){friends();return;}
 if(!startTownStory())return;familyStory=RABBIT_STORY;stopSpeech();stopInput();closeModal();sessionToken++;completed=false;newXP=0;helpCount=0;familyIndex=0;
 setLessonWorld();clearFamilyProps();if(!rabbitWorld)rabbitWorld=new RabbitDeliveryWorld(scene,{orb,cube,cyl,rod,labelBoard});rabbitWorld.reset();
 player.visible=true;ball.visible=false;rosita.visible=false;if(guideSpot)guideSpot.visible=false;music.start('game');clearLearningTray();
 $('welcome').hidden=true;$('roomTag').hidden=true;$('quest').hidden=false;$('sceneTools').hidden=false;document.body.classList.add('playing');
 cameraOrbit.yaw=0;cameraOrbit.pitch=0;cameraOrbit.zoom=1;routeRabbit();
}
function routeRabbit(){
 rabbitWorld.enter(familyIndex,player);const beat=DELIVERY_STEPS[familyIndex];phase='explore';lastNear=null;stopInput();bodyTools();
 $('playControls').hidden=false;$('actionButton').hidden=false;$('actionButton').disabled=true;$('targetLabel').hidden=false;$('listening').hidden=true;document.body.classList.remove('speaking-turn');
 $('speakerName').textContent='LITTLE RABBIT';$('guidePortrait').hidden=true;$('quest').querySelector('.pill').textContent=(familyIndex+1)+' / '+DELIVERY_STEPS.length+' · '+beat.title;
 scene.background.set(['home','inside'].includes(beat.scene)?0xf5e1b4:beat.scene==='forest'?0xb9d4bf:0xc7e7ed);
 beacon.position.copy(rabbitWorld.target());beacon.visible=true;dialogue(beat.clue,(familyIndex+1)+' / '+DELIVERY_STEPS.length+' · '+beat.title+' · Walk together, then '+beat.action.toLowerCase()+'.'+(beat.count>1?' '+beat.count+' actions.':''));speak(beat.clue);resize();
}
function interactRabbit(){
 if(phase!=='explore'||!$('modalShade').hidden)return;
 if(!rabbitWorld.interact(player.position))return;
 if(familyIndex===17&&music.enabled&&music.ctx){const at=music.ctx.currentTime;music.note([72,76,79,84][rabbitWorld.taps-1],at,.35,.35,'triangle');music.beat(at);}
 stopSpeech();$('actionButton').disabled=true;
 if(rabbitWorld.timer){phase='family-action';stopInput();$('playControls').hidden=true;beacon.visible=false;dialogue(DELIVERY_STEPS[familyIndex].title,'Watch what happens!');}
 else {beacon.position.copy(rabbitWorld.target());dialogue(DELIVERY_STEPS[familyIndex].clue,rabbitWorld.current.action+rabbitWorld.progress());}
}
function rabbitActionDone(){
 if(phase!=='family-action')return;
 const beat=DELIVERY_STEPS[familyIndex];if(!beat.sentence){nextRabbit();return;}
 phase='family-say';$('speakerName').textContent='YOUR TURN';dialogue(beat.title,'Try a few words to help Little Rabbit.');updateSpeakingControls();
}
function nextRabbit(){
 if(!['family-action','family-say'].includes(phase))return;
 stopSpeech();$('listening').hidden=true;document.body.classList.remove('speaking-turn');
 if(++familyIndex<DELIVERY_STEPS.length){routeRabbit();return;}
 phase='family-end';beacon.visible=false;dialogue(RABBIT_STORY.ending,'Your whole story is complete.');speak(RABBIT_STORY.ending);cheerHelpers();
 bodyTools('<button id="familyFinish">Finish &amp; add parent notes →</button>');$('familyFinish').onclick=()=>{if(phase!=='family-end')return;bodyTools();phase='rating';rating=helpCount>=3?30:helpCount?40:50;ratePanel();};
}

// A session has one selected player and one shared 3D camera, whether at home,
// outside on the street, or inside an adventure.
const TOWN_BUDGET_KEY='littleStreet.townPlay.v1';
const reducedTownMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const TOWN_WRAP_UP=['rating','reward','memory','memory-complete','body-show','phonics-show','family-end'];
let townWorld=null,townView='',townSession=false,townStoryActive=false;
let townPlaces=[],townTrip=null,townSleepElapsed=0,townNear=null,townFocus=null;
let townLandmark='',townFacilityMessage='',townFacilityUntil=0;
const townFacing=new THREE.Vector3();
let houseOverview=false,houseDoorGuide=false,houseTownTarget=null,houseShelfPage=0;
let bedtimeStart=null,townBudget=readTownBudget(),townLastClock=0,townLastSave=0;

function readTownBudget(){
 try{return playBudget(JSON.parse(localStorage.getItem(TOWN_BUDGET_KEY)||'null'));}
 catch{return playBudget(null);}
}
function saveTownBudget(){
 try{
  const stored=readTownBudget();
  if(stored.day===townBudget.day)townBudget.used=Math.max(townBudget.used,stored.used);
  localStorage.setItem(TOWN_BUDGET_KEY,JSON.stringify(townBudget));
 }catch{/* The current tab can still enforce its timer. */}
}
function resetTownTime(){
 townBudget=playBudget(null);
 townLastClock=performance.now();townLastSave=townLastClock;
 // Reset writes directly: normal saves merge elapsed time to prevent accidental extensions.
 try{localStorage.setItem(TOWN_BUDGET_KEY,JSON.stringify(townBudget));}catch{}
 $('townClock').textContent='10:00';
 $('townClock').classList.remove('last-minute');
 if(phase==='town-night'){
  bedtimeStart=null;townSleepElapsed=0;
  showTownView('house',ROOM.start);
  music.start('game');
 }
 toast('Play time reset to 10 minutes');
}
function tickTownBudget(){
 const now=Date.now(),stamp=performance.now(),fresh=playBudget(townBudget,now);
 if(fresh.day!==townBudget.day){
  townBudget=fresh;
  if(phase==='town-night'){
   showTownView('house',ROOM.start);
   music.start('game');
  }
 }
 const delta=townLastClock?Math.min(1000,Math.max(0,stamp-townLastClock)):0;
 townLastClock=stamp;
 const playing=townSession&&!document.hidden&&$('modalShade').hidden&&
  (phase==='town-free'||phase==='town-travel'||townStoryActive&&!TOWN_WRAP_UP.includes(phase));
 if(playing&&townBudget.used<PLAY_LIMIT)townBudget.used=Math.min(PLAY_LIMIT,townBudget.used+delta);
 if(stamp-townLastSave>=1000&&playing){saveTownBudget();townLastSave=stamp;}
 const seconds=Math.ceil((PLAY_LIMIT-townBudget.used)/1000);
 const label=seconds?`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`:
  townStoryActive?'Finish this story':'Rest time';
 if($('townClock').textContent!==label)$('townClock').textContent=label;
 $('townClock').classList.toggle('last-minute',seconds<=60);
 if(!seconds&&townView&&phase!=='town-night')putTownToBed();
}
function refreshTownPlaces(){
 const places=townDestinations(LESSONS);
 if(JSON.stringify(places)!==JSON.stringify(townPlaces)){
  townPlaces=places;
  if(townView==='town'&&phase==='town-free')townWorld.buildStreet(townPlaces);
 }
}
function startTownPicker(){
 startWelcomeMusic();
 friends({startAtHouse:true});
}
function getTownWorld(){
 return townWorld??=new TownWorld(scene,{
  cube,cyl,orb,portrait:loadArt,
  figure:name=>puppet(CHARACTERS.find(spec=>spec.name===name),false)
 });
}
function syncHouseShelf(words=Object.keys(data.vocabulary||{}).filter(word=>VOCABULARY[word])){
 houseShelfPage=Math.max(0,Math.min(houseShelfPage,shelfPageCount(words)-1));
 townWorld?.updateShelf(shelfPageWords(words,houseShelfPage));
}
function previewTownHouse(){
 getTownWorld();
 hideLessonScenery();
 syncHouseShelf();
 player.position.set(ROOM.start[0],0,ROOM.start[1]);
 townWorld.show('house');
 townWorld.refreshPosters();townWorld.refreshCabinet();
}
function enterTownSession(){
 if(!selected||!ensureWorld())return;
 townSession=true;
 townBudget=readTownBudget();
 townLastClock=0;
 getTownWorld();
 refreshTownPlaces();
 audioUnlocked=true;music.start('game');
 if(townBudget.used>=PLAY_LIMIT)putTownToBed();
 else showTownView('house',ROOM.start);
}
function clearTownHUD(){
 setHouseControls(false);
 $('townHud').hidden=true;$('townToolbar').hidden=true;$('townSleep').hidden=true;$('townTravel').hidden=true;
 document.body.classList.remove('in-town');
}
function hideLessonScenery(){
 for(const node of scene.children){
  if(!node.isLight&&node!==player&&node!==townWorld?.house&&node!==townWorld?.street)node.visible=false;
 }
 clearFamilyProps();
 for(const root of [garden,wantWorld?.root,bodyWorld?.root,phonicsWorld?.root,catWorld?.root,paradeWorld?.root,rabbitWorld?.root,
  helperCast,guideSpot,rosita,ball,beacon,environment?.root,environment?.sky,...roomNodes]){
  if(root)root.visible=false;
 }
}
function setHouseControls(inHouse){
 const strip=$('houseControls'),stage=$('world');
 strip.hidden=!inHouse;
 document.body.classList.toggle('in-house',inHouse);
 if(inHouse)strip.append($('townHud'),$('townToolbar'),$('targetLabel'));
 else stage.append($('townHud'),$('townToolbar'),$('targetLabel'));
}
function syncTownToolbar(){
 const inHouse=townView==='house';
 $('townDoor').hidden=!inHouse;
 $('houseView').hidden=!inHouse;
 $('townActivities').hidden=!inHouse;
 $('townHome').hidden=inHouse;
}
function showTownView(view,position,{night=false}={}){
 sessionToken++;
 phase=night?'town-night':'town-free';
 stopSpeech();stopInput();closeModal();
 hideLessonScenery();
 townView=view;townTrip=null;townNear=null;townFocus=null;townLandmark='';townFacilityMessage='';
 houseOverview=false;houseDoorGuide=false;houseTownTarget=null;
 $('houseView').textContent='House view';
 document.body.classList.remove('landing','chapter','speaking-turn','body-missions','phonics-missions','story-learning');
 document.body.classList.add('playing','in-town');
 setHouseControls(view==='house');
 for(const id of ['frontPage','chapterPage','welcome','roomTag','quest','sceneTools','targetLabel','listening','soundLetterBanner','parentDot'])$(id).hidden=true;
 clearLearningTray();bodyTools();
 Object.assign(cameraOrbit,{yaw:0,pitch:0,zoom:1});wideView=false;
 player.rotation.set(0,Math.PI,0);player.position.set(position[0],0,position[1]);player.visible=true;setCharacterPose(player,'file');
 if(view==='town')townWorld.buildStreet(townPlaces);
 else{syncHouseShelf();townWorld.refreshPosters();townWorld.refreshCabinet();townWorld.syncHomeItems(data);}
 townWorld.show(view,night);
 $('playNav').textContent='Town';
 $('modeLabel').textContent=night?'See you tomorrow':view==='house'?'Home sweet home':'Explore Sesame Street Town';
 $('townDistrict').textContent=TOWN_NAME;
 $('townPlace').textContent=view==='house'?`${selected}’s house`:'Welcome Plaza';
 $('townHud').hidden=false;$('townToolbar').hidden=night;$('townTravel').hidden=true;$('townSleep').hidden=!night;
 $('playControls').hidden=night;$('actionButton').hidden=false;$('actionButton').disabled=true;$('actionLabel').textContent='Walk closer';
 syncTownToolbar();
 aimTownCamera(view,false,1);
 resize();
}
function aimTownCamera(view,cinematic,blend){
 const {x,z}=player.position;
 if(view==='house'){
  const portrait=camera.aspect<.85;
  if(houseOverview){
   cameraGoal.set(0,10.14,14.12);lookGoal.set(0,2.25,-6.25);
  }else{
   const back=portrait?14:13;
   cameraGoal.set(x*.69+2.05,portrait?9.55:8.9,z*.63+back);
   lookGoal.set(x*.79,2.5,z*.79-4.2);
  }
 }else if(cinematic){
  cameraGoal.set(x+5.3,8,z+10.5);lookGoal.set(x,2.15,z-.8);
 }else{
  const back=Math.max(14,10.4/Math.max(.62,camera.aspect));
  cameraGoal.set(x+1.8,6.8,z+back);lookGoal.set(x,2.6,z-4.5);
 }
 if(view==='house'&&phase==='town-night'){
  cameraGoal.set(ROOM.bed[0]-2.58,7.85,ROOM.bed[1]+11.6);lookGoal.set(ROOM.bed[0]-.29,1.3,ROOM.bed[1]-1.45);
 }else if(phase!=='town-travel')applyCameraOrbit(cameraGoal,lookGoal,cameraOrbit);
 const zoom=view==='house'?phase==='town-night'?.88:houseOverview?.39:HOUSE_CAMERA_ZOOM:1;
 if(camera.zoom!==zoom){camera.zoom=zoom;camera.updateProjectionMatrix();}
 if(view==='house'){clampHouseCamera(cameraGoal);clampHouseCamera(lookGoal);}
 camera.position.lerp(cameraGoal,blend);
 if(view==='house')clampHouseCamera(camera.position);
 lookCurrent.lerp(lookGoal,blend);camera.lookAt(lookCurrent);
}
function animateTown(dt,elapsed,t){
 const active=$('modalShade').hidden&&!document.hidden;
 const calm=reducedTownMotion.matches;
 let moving=false;
 if(phase==='town-travel'&&active){
  const trip=townTrip;
  trip.elapsed=Math.min(TRAVEL_TIME,trip.elapsed+elapsed*1000);
  $('townTravel').querySelector('progress').value=trip.elapsed;
  const fade=trip.elapsed<700?trip.elapsed/700:trip.elapsed<1600?1:1-(trip.elapsed-1600)/1400;
  $('activityFade').style.opacity=String(Math.max(0,Math.min(1,fade)));
  if(trip.elapsed>=700&&!trip.arrived){
   trip.arrived=true;
   townView='town';setHouseControls(false);resize();townWorld.buildStreet(townPlaces);townWorld.show('town');
   player.position.set(trip.place.x,0,trip.place.doorZ+.7);
   player.rotation.y=Math.PI;
   aimTownCamera('town',false,1);
  }
  if(trip.elapsed>=TRAVEL_TIME){
   $('activityFade').hidden=true;
   arriveAtTownStory(trip.place);return;
  }
 }else if(phase==='town-free'&&active){
  moving=walkInTown(dt);
  const spots=townView==='house'?HOUSE_STATIONS:
   townPlaces.filter(p=>p.id===HOME.id||LESSONS[p.id]).map(p=>({...p,point:[p.x,p.doorZ]}));
  townNear=spots.find(p=>Math.hypot(player.position.x-p.point[0],player.position.z-p.point[1])<(p.id==='exit'||p.id===HOME.id?3.4:townView==='house'?1.65:2.1));
  $('actionButton').disabled=!townNear;
  $('actionLabel').textContent=townNear?(townNear.action||'Enter '+townNear.name):'Walk closer';
  if(townView==='town')updateTownWayfinding(t);
  else updateHouseWayfinding();
 }else if(phase==='town-night'&&active){
  townSleepElapsed=Math.min(3.25,townSleepElapsed+dt);
  const [x,z]=routePoint(bedtimeStart,calm?1:Math.min(1,townSleepElapsed/1.9));
  const tuck=calm?1:THREE.MathUtils.smoothstep(townSleepElapsed,1.9,2.85);
  player.position.set(x,.98*tuck,z-1.27*tuck);
  player.rotation.set(-Math.PI/2*tuck,0,0,'YXZ');
  moving=!calm&&townSleepElapsed<1.9;
 }
 if(moving)walkT+=dt*13;
 if(phase!=='town-night')player.position.y=moving?Math.abs(Math.sin(walkT))*.07:0;
 updateCharacter(player,t,moving);updateAccessoryPose(player,t,moving);
 if(active&&townView==='town')townWorld.tick(t,calm);
 if(beacon.visible){
  beacon.position.y=.1;
  beacon.userData.arrow.position.y=3.1+(calm?0:Math.sin(t*4)*.18);
 }
 aimTownCamera(townView,phase==='town-travel',calm?1:1-Math.exp(-dt*(phase==='town-travel'?7:5)));
 graphics?.update(townView==='house'?(phase==='town-night'?'night':'house'):townView==='town'?'town':lesson,player);renderer.render(scene,camera);
}
function updateHouseWayfinding(){
 const nearDoor=townNear?.id==='exit';
 const location=(nearDoor?null:townNear?.name)??`${selected}’s house`;
 if(townLandmark!==location){
  townLandmark=location;
  $('townPlace').textContent=location;
  $('townDistrict').textContent=townNear&&!nearDoor?`${selected}’s house`:TOWN_NAME;
 }
 $('targetLabel').hidden=!houseDoorGuide||nearDoor;
 if(houseDoorGuide&&!nearDoor)$('targetLabel').textContent=houseTownTarget
  ? 'Main door to town · '+houseTownTarget.name : 'Follow the gold marker to the main door';
}
function updateTownWayfinding(seconds){
 const {x,z}=player.position;
 const nearby=townNear??townPlaces.find(place=>Math.abs(x-place.x)<place.width*.65&&Math.abs(z-place.doorZ)<8);
 const district=nearby?.district??(z<=-68?'Storybook Lane':z<=-45?'Adventure Gardens':z<=-23?'Wonder Park':z<1?'Main Street':'Welcome Plaza');
 const name=nearby?.name??district;
 if(townLandmark!==name){
  townLandmark=name;
  $('townPlace').textContent=name;
  $('townDistrict').textContent=nearby?district:TOWN_NAME;
 }
 const activeMessage=seconds<townFacilityUntil?townFacilityMessage:'';
 const guide=townFocus&&townNear?.id!==townFocus.id;
 $('targetLabel').hidden=!guide&&!activeMessage;
 if(activeMessage)$('targetLabel').textContent=activeMessage;
 else if(guide){
  camera.getWorldDirection(townFacing);
  const dx=townFocus.x-x,dz=townFocus.doorZ-z;
  const angle=Math.atan2(-townFacing.z*dx+townFacing.x*dz,townFacing.x*dx+townFacing.z*dz);
  const direction=['↑','↗','→','↘','↓','↙','←','↖'][(Math.round(angle/(Math.PI/4))+8)%8];
  $('targetLabel').textContent=direction+'  '+townFocus.name;
 }
}
function walkInTown(dt){
 const x=joy.x+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);
 const z=joy.y+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
 const length=Math.hypot(x,z);
 if(length<.1)return false;
 const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();
 const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0));
 const motion=right.multiplyScalar(x).addScaledVector(forward,-z).multiplyScalar(dt*(townView==='town'?7:4.6)/Math.max(length,1));
 const p=player.position,oldX=p.x,oldZ=p.z;
 if(townWorld.canWalk(p.x+motion.x,p.z,townView))p.x+=motion.x;
 if(townWorld.canWalk(p.x,p.z+motion.z,townView))p.z+=motion.z;
 if(p.x===oldX&&p.z===oldZ)return false;
 const angle=Math.atan2(motion.x,motion.z),difference=angle-player.rotation.y;
 player.rotation.y+=Math.atan2(Math.sin(difference),Math.cos(difference))*Math.min(1,dt*14);
 return true;
}
function interactTown(){
 if(!townNear||!$('modalShade').hidden)return;
 if(townNear.id==='exit'){exploreStreet();return;}
 if(townNear.id==='activities'){openTownActivities();return;}
 if(townNear.id==='computer'){journal();return;}
 if(townNear.id==='wardrobe'){openShop('wardrobe');return;}
 if(townNear.id==='bookshelf'){vocabularyBank('house-shelf');return;}
 if(townNear.id==='cabinet'){friends();return;}
 if(townNear.id==='toy-cupboard'){openHouseCollection('toys');return;}
 if(townNear.id==='store-room'){openHouseCollection();return;}
 if(townNear.id===HOME.id){showTownView('house',ROOM.start);return;}
 if(!LESSONS[townNear.id])return;
 travelToStory(townNear);
}
function markTownDestination(destination){
 townFocus=destination;townFacilityMessage='';townFacilityUntil=0;
 beacon.position.set(destination.x,0,destination.doorZ);beacon.visible=true;
}
function markMainDoor(destination=null){
 if(phase!=='town-free'||townView!=='house')return;
 houseTownTarget=destination;houseDoorGuide=true;
 beacon.position.set(ROOM.door[0],0,ROOM.door[1]);beacon.visible=true;
}
function exploreStreet(){
 if(phase!=='town-free'||townView!=='house')return;
 const destination=houseTownTarget;
 showTownView('town',[TOWN_SPINE,HOME.doorZ+.7]);
 if(destination)markTownDestination(destination);
}
function travelToStory(place){
 if(phase!=='town-free'||!LESSONS[place.id])return;
 tickTownBudget();
 if(phase!=='town-free')return;
 closeModal();stopInput();beacon.visible=false;
 townFocus=null;townNear=null;
 townTrip={place,elapsed:0,arrived:false};
 $('activityFade').hidden=false;$('activityFade').style.opacity='0';
 phase='town-travel';
 $('townToolbar').hidden=true;$('playControls').hidden=true;$('targetLabel').hidden=true;
 $('townTravelFrom').textContent='Going to';
 $('townTravelTo').textContent=place.name;
 $('townTravel').querySelector('progress').value=0;
 $('townTravel').hidden=false;
}
function arriveAtTownStory(place){
 townTrip=null;townWorld.clearGroup(townWorld.route);
 $('townTravel').hidden=true;$('townPlace').textContent=place.name;
 townFocus=place;
 phase='home';lesson=place.id;
 if(lesson==='phonics')phonicsPair=choosePhonicsPair(phonicsPool,data.phonicsLastPair||[]);
 refreshGuide();rosita.visible=false;
 plan();
}
function cancelTownStoryPreview(){
 phase='town-free';
 townFocus=null;townNear=null;
 townLandmark='';
 $('townPlace').textContent=TOWN_NAME;
 $('townToolbar').hidden=false;$('playControls').hidden=false;
}
function startTownStory(){
 if(!townSession)return true;
 tickTownBudget();
 if(!townView||phase!=='home'||townBudget.used>=PLAY_LIMIT)return false;
 townStoryActive=true;townView='';townWorld.hide();clearTownHUD();
 camera.zoom=1;camera.updateProjectionMatrix();
 player.position.set(0,0,5.4);player.rotation.set(0,Math.PI,0);
 Object.assign(cameraOrbit,{yaw:0,pitch:0,zoom:1});wideView=false;
 scene.fog.near=27;scene.fog.far=54;scene.fog.color.set(0xe7eddd);
 if(lesson==='ball')setLessonWorld(); // Other adventure starters restore their own scenery.
 $('townDistrict').textContent='STORY TIME';
 $('townHud').hidden=false;
 if(guideSpot)guideSpot.visible=!['cat','comparison','phonics',RABBIT_STORY.id].includes(lesson);
 if(helperCast)helperCast.visible=true;
 return true;
}
function returnFromStory(){
 if(townView)return;
 const destination=townPlaces.find(p=>p.id===lesson);
 townStoryActive=false;
 if(townBudget.used>=PLAY_LIMIT){putTownToBed();return;}
 if(destination)showTownView('town',[destination.x,destination.doorZ+.85]);
 else showTownView('house',ROOM.start);
}
function putTownToBed(){
 $('activityFade').hidden=true;
 if(phase==='town-night')return;
 saveTownBudget();
 townStoryActive=false;
 const start=ROOM.sleepStart;
 showTownView('house',start,{night:true});
 bedtimeStart=houseRoute(start,ROOM.bed,townWorld.houseObstacles)??[ROOM.bed,ROOM.bed];townSleepElapsed=0;
 $('townSleepTitle').textContent=`Goodnight, ${selected}!`;
 $('townClock').textContent='Rest time';
 music.stop();
}
function mapCard(place){
 const text=place.name;
 const sub=place.action||LESSONS[place.id]?.title||place.district;
 return `<button class="town-activity-card" data-town-place="${escapeHTML(place.id)}" ${place.action?'disabled':''} data-color style="--landmark:${place.swatch}"><span class="town-icon" aria-hidden="true">${place.icon}</span><span><strong>${escapeHTML(text)}</strong><small>${escapeHTML(sub)}</small></span></button>`;
}
function openTownActivities(){
 if(phase!=='town-free'||townView!=='house')return;
 refreshTownPlaces();
 showModal('town-activities',`${closeHTML}<h2 id="modalTitle">Activity Corner</h2><p>Pick a story and watch your friend take the road there.</p><div class="town-activity-list">${townPlaces.filter(p=>LESSONS[p.id]).map(mapCard).join('')}</div><details class="town-import"><summary>Parent · Add a Mac story</summary><label>Choose a story file from Generated <input id="townFamilyImport" type="file" accept=".json,application/json"></label></details>`,true);
 wireClose();
 $('modal').querySelectorAll('[data-town-place]').forEach(button=>button.onclick=()=>travelToStory(townPlaces.find(p=>p.id===button.dataset.townPlace)));
 $('townFamilyImport').onchange=async event=>{
  try{
   const file=event.target.files[0];if(!file)return;if(file.size>50000)throw Error();
   const story=readFamilyStory(JSON.parse(await file.text()));
   const imports=JSON.parse(localStorage.getItem('littleStreet.familyImports.v1')||'{}');imports[story.id]=story;
   localStorage.setItem('littleStreet.familyImports.v1',JSON.stringify(imports));registerFamilyStories([story]);
   openTownActivities();toast('A story cottage has opened.');
  }catch{toast('Choose a valid story JSON file from Generated.');}
 };
}
function openTownMap(){
 if(phase!=='town-free')return;
 refreshTownPlaces();
 const b=townBounds(townPlaces);
 const left=x=>7+86*(x-b.left)/(b.right-b.left);
 const top=z=>6+88*(z-b.top)/(b.bottom-b.top);
 const here=townView==='house'?HOME:player.position;
 const roads=[...new Set(townPlaces.map(p=>p.lane))].map(z=>`<i class="road" style="left:8%;right:8%;top:${top(z)}%"></i>`).join('');
 const spine=[...TOWN_LOOP,TOWN_SPINE].map(x=>`<i class="road spine" style="left:${left(x)}%;top:${top(Math.min(...townPlaces.map(p=>p.lane)))}%;bottom:${100-top(HOME.lane)}%"></i>`).join('');
 const markers=townPlaces.map(p=>`<button class="town-map-marker" data-town-place="${escapeHTML(p.id)}" ${p.action?'disabled':''} aria-label="${escapeHTML(p.name)}" style="left:${left(p.x)}%;top:${top(p.z)}%;--landmark:${p.swatch}">${p.icon}</button>`).join('');
 const height=Math.max(330,Math.round((b.bottom-b.top)*3.65));
 const groups=new Map();
 for(const place of townPlaces){
  if(!groups.has(place.district))groups.set(place.district,[]);
  groups.get(place.district).push(place);
 }
 showModal('town-map',`${closeHTML}<h2 id="modalTitle">Sesame Street Town map</h2><p>The blue dot is you. Choose a place to mark it, then follow the arrow and gold marker.</p><div class="town-map-layout"><div class="town-mini" style="min-height:${height}px">${roads}${spine}${markers}<i class="town-map-you" style="left:${left(here.x)}%;top:${top(here.z)}%"></i></div><div class="town-map-list">${[...groups].map(([district,places])=>`<section class="town-map-district"><h3>${district}</h3>${places.map(mapCard).join('')}</section>`).join('')}</div></div>`,true);
 wireClose();
 $('modal').querySelectorAll('[data-town-place]').forEach(button=>button.onclick=()=>{
  const destination=townPlaces.find(p=>p.id===button.dataset.townPlace);
  if(!destination||destination.action)return;
  closeModal();
  if(townView==='house'){
   if(destination.id!==HOME.id)markMainDoor(destination);
  }else markTownDestination(destination);
 });
}
$('resetPlayTime').onclick=resetTownTime;
$('townDoor').onclick=exploreStreet;
$('houseView').onclick=()=>{
 if(townView!=='house'||phase!=='town-free')return;
 houseOverview=!houseOverview;

 Object.assign(cameraOrbit,{yaw:0,pitch:0,zoom:1});
 $('houseView').textContent=houseOverview?'Follow view':'House view';
};
$('townActivities').onclick=openTownActivities;
$('townMap').onclick=openTownMap;
$('townHome').onclick=()=>{if(phase==='town-free'&&townView==='town')showTownView('house',ROOM.start);};
window.addEventListener('pagehide',()=>{if(townSession)saveTownBudget();});
document.addEventListener('visibilitychange',()=>{
 if(!townSession)return;
 if(document.hidden)saveTownBudget();
 townLastClock=0;
});
window.addEventListener('storage',event=>{
 if(event.key!==TOWN_BUDGET_KEY)return;
 const stored=readTownBudget();
 if(stored.day===townBudget.day)townBudget.used=Math.max(stored.used,townBudget.used);
});
