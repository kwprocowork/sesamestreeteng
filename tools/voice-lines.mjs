// Enumerate real dynamic learning models from the public game; never read runtime stories/notes.
import {BODY_WORDS} from '../dist/body.js';
import {PAIRED_PARTS,missionSentence,missionQuestion} from '../dist/body-world.js';
import {PHONICS_WORDS,phonicsSpeakingTarget} from '../dist/phonics.js';
import {VOCABULARY} from '../dist/vocabulary.js';
const lines=new Set(Object.keys(VOCABULARY));
for(const word of BODY_WORDS)for(const side of PAIRED_PARTS.has(word)?['','left','right']:['']){
 const m={word,side};lines.add(missionSentence(m));lines.add(missionQuestion(m));
}
for(const word of PHONICS_WORDS)lines.add(phonicsSpeakingTarget({word}));
for(const word of ['book','bag','pencil','crayon']){
 lines.add(`It's a ${word}.`);lines.add(`Name the ${word} sticker in a sentence.`);
}
console.log(JSON.stringify([...lines]));
