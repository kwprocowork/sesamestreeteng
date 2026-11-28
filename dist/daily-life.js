import {HOME_SECONDS} from './story-pace.js?v=74a';
export const LIFE_LINES={departure:"Little child, it's time to start your adventure!",continue:'Do you want to continue your adventure?',food:'Let us have some food before we go out.',wash:'Brush your teeth and wash your face.',ready:'You are ready for your adventure.',route:'Follow the yellow marker to your story.',bike:'You can walk or ride your bicycle.',neighbours:'You have helped two neighbours. Let us go to our story.',delay:'It is time to go to our story. You may lose one sticker if we keep waiting.',thanks:'Well done! Thank you for helping.',night:'We are home. Let us get ready to sleep.',sleep:'Good night, my friend.'};
export const HEALTHY=35,RECOVER_TO=75;
export function lifeDay(now=new Date()){const date=new Date(now.getTime()-6*3600000);return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
export class DailyLife{
 constructor(raw={},now=new Date()){this.state=raw?.day===lifeDay(now)?{...raw}:{day:lifeDay(now),stage:'home',homeSeconds:0,energy:70,hygiene:60,completed:[],neighbours:[],earned:0,spent:0,journeySeconds:0,delayWarned:false,delayCharged:false,nightWashed:false};this.state.energy=Math.max(0,Math.min(100,Number(this.state.energy)||0));this.state.hygiene=Math.max(0,Math.min(100,Number(this.state.hygiene)||0));this.state.completed??=[];this.state.neighbours??=[];}
 get healthy(){return this.state.energy>=HEALTHY&&this.state.hygiene>=HEALTHY;}
 tick(dt,{paused=false,moving=false,riding=false,story=false}={}){if(paused||!Number.isFinite(dt)||dt<=0||this.state.stage==='done')return;dt=Math.min(dt,1);const s=this.state;if(s.stage==='home')s.homeSeconds=Math.min(HOME_SECONDS,s.homeSeconds+dt);if(s.stage==='journey')s.journeySeconds+=dt;const active=moving||riding||story;s.energy=Math.max(0,s.energy-dt*(riding?.04:moving?.025:story?.008:0));s.hygiene=Math.max(0,s.hygiene-dt*(active?.02:.002));}
 leaveHome(){if(this.state.homeSeconds<HOME_SECONDS||!this.healthy||this.state.stage!=='home')return false;this.state.stage='journey';this.newJourney();return true;}
 newJourney(){this.state.journeySeconds=0;this.state.delayWarned=false;this.state.delayCharged=false;this.state.journeyHelps=0;}
 startStory(id){if(!this.healthy||this.state.completed.length>=2||this.state.stage==='night'||this.state.stage==='done')return false;this.state.stage='story';this.state.activeStory=id;return true;}
 completeStory(id){const s=this.state;if(s.activeStory!==id||s.completed.includes(id))return false;s.completed.push(id);s.earned+=3;s.activeStory=null;s.stage=s.completed.length>=2?'night':'continue';return true;}
 continue(yes){if(this.state.stage!=='continue')return false;if(yes){this.state.stage='journey';this.newJourney();}else this.state.stage='night';return true;}
 help(key){const s=this.state;if(s.stage!=='journey'||(s.journeyHelps||0)>=2||s.neighbours.includes(key))return false;s.neighbours.push(key);s.journeyHelps=(s.journeyHelps||0)+1;s.earned++;return true;}
 delay(){const s=this.state;if(s.stage!=='journey')return '';if(s.journeySeconds>=90&&!s.delayWarned){s.delayWarned=true;return 'warn';}if(s.journeySeconds>=120&&!s.delayCharged){s.delayCharged=true;return 'charge';}return '';}
 eat(){this.state.energy=Math.max(RECOVER_TO,this.state.energy);}
 wash(){this.state.hygiene=Math.max(RECOVER_TO,this.state.hygiene);if(this.state.stage==='night')this.state.nightWashed=true;}
 sleep(){if(this.state.stage!=='night'||this.state.hygiene<HEALTHY)return false;this.state.stage='done';return true;}
}
export function randomPick(items,random=Math.random){return items.length?items[Math.min(items.length-1,Math.floor(random()*items.length))]:null;}
export function easySubset(items,count=3,random=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out.slice(0,count);}
