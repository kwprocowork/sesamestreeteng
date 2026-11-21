import assert from 'node:assert/strict';
import {StoryNarrator,normalizeSpeech,speechSegments,voiceDelivery,nativeEnglishVoice} from './dist/narrator.js';
assert.equal(normalizeSpeech('  Let’s   play… '),"Let's play...");
assert.deepEqual(speechSegments('Hello! Can you help? Yes.'),['Hello!','Can you help?','Yes.']);
assert.equal(voiceDelivery('Can you help?').mood,'curious');assert.equal(voiceDelivery('Baby is crying.').mood,'gentle');assert.equal(voiceDelivery('Wonderful!').mood,'bright');
assert.equal(nativeEnglishVoice([{name:'UK Premium',lang:'en-GB'},{name:'Samantha compact',lang:'en-US'},{name:'Ava Enhanced',lang:'en-US'}]).name,'Ava Enhanced');
const audio={playCount:0,pauseCount:0,duration:2,play(){this.playCount++;return Promise.resolve();},pause(){this.pauseCount++;}},spoken=[],timers=new Map();let timerId=0;
const synth={cancel(){},getVoices:()=>[{name:'Samantha Enhanced',lang:'en-US'}],speak(u){spoken.push(u);}};
const narrator=new StoryNarrator({audio,synth,Utterance:class{constructor(text){this.text=text;}},fetcher:async()=>({ok:true,json:async()=>({clips:{'hello!':{src:'assets/narration/hello.m4a'},'well done.':{src:'assets/narration/well.m4a'}}})}),delay:fn=>{timers.set(++timerId,fn);return timerId;},clearDelay:id=>timers.delete(id)});
await narrator.ready;let completions=0;
narrator.say('Hello! Well done.',()=>completions++);assert.equal(audio.playCount,1);assert(audio.src.endsWith('/assets/narration/hello.m4a'));audio.onended();assert.equal(audio.playCount,2);audio.onended();assert.equal(completions,1);assert.equal(spoken.length,0);
narrator.say('Can you help?',()=>completions++);const u=spoken.at(-1);assert.equal(u.lang,'en-US');assert.equal(u.rate,.94);u.onend();u.onerror();assert.equal(completions,2,'native callbacks finish exactly once');
narrator.say('Hello!',()=>completions++);const reject=audio.onerror;reject();reject();assert.equal(spoken.length,2,'one fallback despite duplicate failures');spoken.at(-1).onend();assert.equal(completions,3);
// Failed downloads are remembered during this page visit, so repeats use device speech immediately.
const before=audio.playCount;narrator.say('Hello!',()=>completions++);assert.equal(audio.playCount,before);const stale=spoken.at(-1).onend;narrator.stop();stale();assert.equal(completions,3,'parent acceptance cancels callbacks');
narrator.say('New story line.',()=>completions++);const old=spoken.at(-1).onend;narrator.say('Next line.',()=>completions++);old();assert.equal(completions,3);spoken.at(-1).onend();assert.equal(completions,4);
// A missing library and unavailable speech API must never trap the game in narration.
const silent=new StoryNarrator({audio:null,synth:null,Utterance:null,fetcher:async()=>({ok:false}),delay:()=>0,clearDelay(){}});await silent.ready;silent.say('Hello!',()=>completions++);assert.equal(completions,5);
assert.equal(timers.size,0);console.log('PASS: neural clip sequencing, warm/question/concern profiles, native-US preference, missing/failed audio fallback, replay, interruption, stale events and exactly-once completion.');
