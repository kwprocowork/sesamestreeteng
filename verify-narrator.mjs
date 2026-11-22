import assert from 'node:assert/strict';import fs from 'node:fs';
import {StoryNarrator,NARRATOR_VOICE,normalizeSpeech,speechSegments,voiceDelivery} from './dist/narrator.js';
assert.equal(normalizeSpeech(' Let’s  play… '),"Let's play...");assert.deepEqual(speechSegments('Hello! Yes, please!'),['Hello!','Yes, please!']);assert.equal(NARRATOR_VOICE,'af_heart');assert.equal(voiceDelivery('Can you help?').mood,'curious');
const manifest={voice:'af_heart',accent:'en-US',clips:{'hello!':{src:'assets/narration/hello.m4a'},'yes, please!':{src:'assets/narration/yes.m4a'},'model sentence.':{src:'assets/narration/model.m4a'}}};
const audio={plays:0,duration:2,play(){this.plays++;return Promise.resolve();},pause(){}},timers=new Map();let id=0,unavailable=0,done=0;
const options={audio,fetcher:async()=>({ok:true,json:async()=>manifest}),onUnavailable:()=>unavailable++,delay:fn=>{timers.set(++id,fn);return id;},clearDelay:k=>timers.delete(k)};
const narrator=new StoryNarrator(options);await narrator.ready;
narrator.say('Hello! Yes, please!',()=>done++);assert.equal(audio.plays,1);audio.onended();assert(audio.src.endsWith('/yes.m4a'));audio.onended();assert.equal(done,1);assert.equal(unavailable,0);
narrator.say('Missing dialogue.',()=>done++);assert.equal(done,2);assert.equal(unavailable,1,'caption/retry notification instead of another speaker');
narrator.say('Hello!',()=>done++);const error=audio.onerror;error();error();assert.equal(done,3);assert.equal(unavailable,2);
const before=audio.plays;narrator.say('Hello!',()=>done++);assert.equal(audio.plays,before+1,'repeat retries the same voice recording');const stale=audio.onended;narrator.stop();stale();assert.equal(done,3);
narrator.say('Hello!',()=>done++);const old=audio.onended;narrator.say('Model sentence.',()=>done++);old();assert.equal(done,3);audio.onended();assert.equal(done,4);
let resolve;const delayed=new StoryNarrator({...options,fetcher:()=>new Promise(r=>resolve=r)});const startPlays=audio.plays;delayed.say('Yes, please!',()=>done++);assert.equal(audio.plays,startPlays,'wait for the voice manifest instead of using a browser voice');resolve({ok:true,json:async()=>manifest});await delayed.ready;await Promise.resolve();assert.equal(audio.plays,startPlays+1);audio.onended();assert.equal(done,5);
const wrong=new StoryNarrator({...options,fetcher:async()=>({ok:true,json:async()=>({...manifest,voice:'different'})})});await wrong.ready;assert(wrong.libraryError);wrong.say('Hello!',()=>done++);await wrong.ready;await Promise.resolve();assert.equal(done,6);assert.equal(unavailable,3);
assert.equal(timers.size,0);assert(!/speechSynthesis|SpeechSynthesisUtterance|nativeEnglishVoice/.test(fs.readFileSync('dist/narrator.js','utf8')),'no browser voice path');
console.log('PASS: one locked narrator for demos/replies, manifest readiness, no voice substitution, failed-audio repeat, voice validation, interruption and exactly-once completion.');

assert.deepEqual(speechSegments('Hello! ”.'),['Hello!'],'punctuation alone is not a spoken line');
