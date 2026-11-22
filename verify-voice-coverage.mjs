import assert from 'node:assert/strict';import fs from 'node:fs';
import {publicVoiceLines} from './tools/voice-lines.mjs';
import {speechSegments,normalizeSpeech,NARRATOR_VOICE} from './dist/narrator.js';
const manifest=JSON.parse(fs.readFileSync('dist/narration-manifest.json','utf8'));assert.equal(manifest.voice,NARRATOR_VOICE);assert.equal(manifest.accent,'en-US');
const missing=new Set(),checked=new Set();
for(const text of publicVoiceLines())for(const part of speechSegments(text)){
 const key=normalizeSpeech(part).toLowerCase();checked.add(key);const clip=manifest.clips[key]||(!/[?!]$/.test(key)&&manifest.clips[key.replace(/\.$/,'')]);
 if(!clip){missing.add(key);continue;}
 assert(/^assets\/narration\/[a-f0-9]{20}\.m4a$/.test(clip.src));const bytes=fs.readFileSync('dist/'+clip.src);assert(bytes.length>1000&&bytes.toString('ascii',4,8)==='ftyp');
}
assert.equal(missing.size,0,'Missing speech models/NPC replies: '+[...missing].slice(0,30).join(' | '));
for(const key of ['yes, please!','no, thank you.','no!','what?','i picked milk.','the turtle is slow.',"it's a book.",'this is the left hand.'])assert(manifest.clips[key],key);
console.log('PASS: '+checked.size+' unique public speech segments cover full/short player demos, NPC replies, gallery variants, food choices, anatomy sides, phonics sentences, alphabet clues and story data with '+NARRATOR_VOICE+'.');

for(const file of fs.readdirSync('dist').filter(file=>file.endsWith('.js'))){const source=fs.readFileSync('dist/'+file,'utf8');assert(!/\bspeechSynthesis\b|\bSpeechSynthesisUtterance\b/.test(source),'Older browser voice path in '+file);}
console.log('PASS: no alternate browser-speech entry point remains in the game source.');
