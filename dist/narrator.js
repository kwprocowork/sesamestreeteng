// Mac-prepared neural narration, with device speech for newly authored/dynamic lines.
export function normalizeSpeech(text){return String(text??'').replace(/[‘’]/g,"'").replace(/…/g,'...').replace(/\s+/g,' ').trim();}
export function speechSegments(text){return normalizeSpeech(text).match(/[^.!?]+(?:[.!?]+|$)/g)?.map(s=>s.trim()).filter(Boolean)||[];}
export function voiceDelivery(text){
 if(text.includes('?'))return {mood:'curious',rate:.94,pitch:1};
 if(/\b(crying|sad|lost|oops|oh no|careful)\b/i.test(text))return {mood:'gentle',rate:.91,pitch:.99};
 if(text.includes('!')||/\b(wonderful|great|hooray|well done|thank you)\b/i.test(text))return {mood:'bright',rate:1,pitch:1.03};
 return {mood:'warm',rate:.96,pitch:1};
}
export function nativeEnglishVoice(voices){
 const candidates=voices.filter(v=>/^en[-_]US$/i.test(v.lang));
 const score=v=>(/premium|enhanced|natural|neural/i.test(v.name)?20:0)+(/Ava|Samantha|Aria|Jenny|Google US English/i.test(v.name)?10:0)+(/compact/i.test(v.name)?-5:0);
 return candidates.sort((a,b)=>score(b)-score(a))[0]||voices.find(v=>/^en[-_]/i.test(v.lang))||null;
}
export class StoryNarrator {
 constructor({audio,fetcher,synth,Utterance,delay=(fn,ms)=>globalThis.setTimeout(fn,ms),clearDelay=id=>globalThis.clearTimeout(id)}={}){
  this.audio=audio??(typeof Audio!=='undefined'?new Audio():null);
  this.synth=synth??globalThis.speechSynthesis;
  this.Utterance=Utterance??globalThis.SpeechSynthesisUtterance;
  this.delay=delay;this.clearDelay=clearDelay;this.serial=0;this.clips={};this.failed=new Set();this.current=null;
  this.audio&&(this.audio.preload='auto');
  const get=fetcher??globalThis.fetch?.bind(globalThis);
  this.ready=get?Promise.resolve().then(()=>get(new URL('./narration-manifest.json',import.meta.url),{cache:'no-cache'})).then(r=>{if(!r.ok)throw Error('Voice library unavailable');return r.json();}).then(m=>{this.clips=m.clips||{};}).catch(()=>{}):Promise.resolve();
 }
 unlock(){
  if(!this.audio||this.unlocked||this.current)return;
  this.audio.src=new URL('./assets/narration-unlock.wav',import.meta.url).href;
  this.audio.play()?.then(()=>{this.unlocked=true;}).catch(()=>{});
 }
 stop(){
  ++this.serial;this.clearDelay(this.timer);this.current=null;
  if(this.audio){this.audio.onended=this.audio.onerror=this.audio.onloadedmetadata=null;this.audio.pause();}
  this.synth?.cancel();
 }
 say(text,done){
  this.stop();const token=this.serial,parts=speechSegments(text);this.current={token};let index=0,finished=false;
  const finish=()=>{if(finished||token!==this.serial)return;finished=true;this.clearDelay(this.timer);this.current=null;done?.();};
  const next=()=>{
   if(token!==this.serial||finished)return;
   this.clearDelay(this.timer);
   if(index>=parts.length){finish();return;}
   const line=parts[index++],clip=this.clips[line.toLowerCase()];
   let settled=false,fallbackStarted=false;
   const advance=()=>{if(settled||token!==this.serial)return;settled=true;this.clearDelay(this.timer);next();};
   const fallback=()=>{
    if(settled||fallbackStarted||token!==this.serial)return;fallbackStarted=true;
    this.clearDelay(this.timer);
    if(this.audio){this.audio.onended=this.audio.onerror=this.audio.onloadedmetadata=null;this.audio.pause();}
    if(!this.synth||!this.Utterance){advance();return;}
    const u=new this.Utterance(line),profile=voiceDelivery(line);u.lang='en-US';u.voice=nativeEnglishVoice(this.synth.getVoices());u.rate=profile.rate;u.pitch=profile.pitch;
    u.onend=advance;u.onerror=advance;this.timer=this.delay(()=>{if(token===this.serial){this.synth.cancel();advance();}},Math.max(6500,line.length*150));
    try{this.synth.speak(u);}catch{advance();}
   };
   if(!clip||!this.audio||this.failed.has(clip.src)){fallback();return;}
   const failed=()=>{if(settled||token!==this.serial)return;this.failed.add(clip.src);fallback();};
   this.audio.onended=advance;this.audio.onerror=failed;
   this.audio.onloadedmetadata=()=>{if(token!==this.serial||settled||fallbackStarted||!Number.isFinite(this.audio.duration)||this.audio.duration<=0)return;this.clearDelay(this.timer);this.timer=this.delay(failed,Math.max(10000,(this.audio.duration+4)*1000));};
   this.audio.src=new URL(clip.src,import.meta.url).href;
   this.timer=this.delay(failed,Math.max(10000,line.length*170));
   try{this.audio.play()?.then(()=>{this.unlocked=true;}).catch(failed);}catch{failed();}
  };
  next();
 }
}
