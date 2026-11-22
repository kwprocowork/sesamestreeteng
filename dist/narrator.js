// All spoken words/sentences use the same Mac-prepared narrator. No device-voice substitution.
export const NARRATOR_VOICE='af_heart';
export function normalizeSpeech(text){return String(text??'').replace(/[‘’]/g,"'").replace(/…/g,'...').replace(/\s+/g,' ').trim();}
export function speechSegments(text){return normalizeSpeech(text).match(/[^.!?]+(?:[.!?]+|$)/g)?.map(s=>s.trim()).filter(s=>/[A-Za-z0-9]/.test(s))||[];}
export function voiceDelivery(text){
 if(text.includes('?'))return {mood:'curious',rate:.94,pitch:1};
 if(/\b(crying|sad|lost|oops|oh no|careful)\b/i.test(text))return {mood:'gentle',rate:.91,pitch:.99};
 if(text.includes('!')||/\b(wonderful|great|hooray|well done|thank you)\b/i.test(text))return {mood:'bright',rate:1,pitch:1.03};
 return {mood:'warm',rate:.96,pitch:1};
}
export class StoryNarrator {
 constructor({audio,fetcher,onUnavailable=()=>{},delay=(fn,ms)=>globalThis.setTimeout(fn,ms),clearDelay=id=>globalThis.clearTimeout(id)}={}){
  this.audio=audio??(typeof Audio!=='undefined'?new Audio():null);this.fetcher=fetcher??globalThis.fetch?.bind(globalThis);
  this.delay=delay;this.clearDelay=clearDelay;this.onUnavailable=onUnavailable;this.serial=0;this.clips={};this.current=null;this.loaded=false;
  if(this.audio)this.audio.preload='auto';
  this.ready=this.loadLibrary();
 }
 async loadLibrary(){
  this.loaded=false;this.libraryError=false;
  const controller=typeof AbortController!=='undefined'?new AbortController():null;
  const timer=this.delay(()=>controller?.abort(),6000);
  try{
   if(!this.fetcher)throw Error('Voice library unavailable');
   const response=await this.fetcher(new URL('./narration-manifest.json',import.meta.url),{cache:'no-cache',signal:controller?.signal});
   if(!response.ok)throw Error('Voice library unavailable');
   const m=await response.json();
   if(m.voice!==NARRATOR_VOICE||m.accent!=='en-US')throw Error('Unexpected narrator');
   this.clips=m.clips||{};
  }catch{this.clips={};this.libraryError=true;}
  finally{this.loaded=true;this.clearDelay(timer);}
 }
 clipFor(line){
  const key=normalizeSpeech(line).toLowerCase();
  return this.clips[key]||(!/[?!]$/.test(key)?this.clips[key.replace(/\.$/,'')]:null);
 }
 unlock(){
  if(!this.audio||this.unlocked||this.current)return;
  this.audio.src=new URL('./assets/narration-unlock.wav',import.meta.url).href;
  this.audio.play()?.then(()=>{this.unlocked=true;}).catch(()=>{});
 }
 stop(){
  ++this.serial;this.clearDelay(this.timer);this.current=null;
  if(this.audio){this.audio.onended=this.audio.onerror=this.audio.onloadedmetadata=null;this.audio.pause();}
 }
 say(text,done){
  this.stop();const token=this.serial,parts=speechSegments(text);this.current={token};let index=0,finished=false,notified=false;
  const live=()=>token===this.serial&&!finished;
  const finish=()=>{if(!live())return;finished=true;this.clearDelay(this.timer);this.current=null;done?.();};
  const unavailable=()=>{if(!live())return;if(!notified){notified=true;this.onUnavailable();}finish();};
  const next=()=>{
   if(!live())return;this.clearDelay(this.timer);
   if(index>=parts.length){finish();return;}
   const line=parts[index++],clip=this.clipFor(line);let settled=false;
   const advance=()=>{if(settled||!live())return;settled=true;this.clearDelay(this.timer);next();};
   const failed=()=>{
    if(settled||!live())return;settled=true;this.clearDelay(this.timer);
    this.audio.onended=this.audio.onerror=this.audio.onloadedmetadata=null;this.audio.pause();unavailable();
   };
   this.audio.onended=advance;this.audio.onerror=failed;
   this.audio.onloadedmetadata=()=>{if(!live()||settled||!Number.isFinite(this.audio.duration)||this.audio.duration<=0)return;this.clearDelay(this.timer);this.timer=this.delay(failed,Math.max(10000,(this.audio.duration+4)*1000));};
   this.audio.src=new URL(clip.src,import.meta.url).href;this.timer=this.delay(failed,Math.max(10000,line.length*170));
   try{this.audio.play()?.then(()=>{this.unlocked=true;}).catch(failed);}catch{failed();}
  };
  const start=()=>{
   if(!live())return;this.clearDelay(this.timer);
   if(!parts.length){finish();return;}
   if(!this.audio||parts.some(line=>!this.clipFor(line))){unavailable();return;}
   next();
  };
  if(this.libraryError)this.ready=this.loadLibrary();
  if(this.loaded)start();
  else{this.timer=this.delay(unavailable,7000);this.ready.then(start);}
 }
}
