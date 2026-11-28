import {FAMILY_CHATS,FAMILY_LINES} from '../dist/home-family.js';
import {MINI_LINES,MINI_TASKS} from '../dist/neighbour-mini.js';
import {HOME_FOODS,MEAL_LINES} from '../dist/home-meals.js';
import {SOCIAL_LINES,JOBS,GREETINGS} from '../dist/neighbour-life.js';
import {ADVENTURE_LINES,TASK_GUIDANCE} from '../dist/story-pace.js';
import fs from 'node:fs';
import {LIFE_LINES} from '../dist/daily-life.js';
import {HOME_ACTIVITIES} from '../dist/schoolbus/activity-catalog.js';
// Public speech catalog: demos, short models, NPC replies and generated story beats.
import {BODY_WORDS} from '../dist/body.js';
import {PAIRED_PARTS,missionSentence,missionQuestion,missionLabel} from '../dist/body-world.js';
import {PHONICS_WORDS,phonicsSpeakingTarget} from '../dist/phonics.js';
import {VOCABULARY} from '../dist/vocabulary.js';
import {ALPHABET_STEPS} from '../dist/learning.js';
import {ART} from '../dist/character-art.js';
import {EXTRA_PLACES} from '../dist/discovery-room.js';
import {FAMILY_GALLERY,createFamilyGalleryRound} from '../dist/family-gallery.js';
import {TRANSPORTATION} from '../dist/transportation.js';
import {RABBIT_STORY} from '../dist/rabbit-delivery.js';
import {STATIONERY} from '../dist/stationery.js';
import {CAT_TURNS} from '../dist/cat-story.js';
import {WORKSHOPS} from '../dist/adventure-workshop.js';
import {CHAPTER_INTROS} from '../dist/chapter-intros.js';
import {PARADES} from '../dist/comparison.js';
import {WANT_ITEMS,wantAnswer,wantQuestion} from '../dist/wants.js';
const fields=new Set(['sentence','starter','reply','clue','prompt','intro','ending','description','voice','talk','question','answer','short','model','caption','word','lines']);
export function publicVoiceLines(){
 const lines=new Set(Object.keys(VOCABULARY));for(const line of Object.values(FAMILY_LINES))lines.add(line);for(const row of Object.values(FAMILY_CHATS).flat()){lines.add(row.model);lines.add(row.reply);}for(const g of GREETINGS){lines.add(g.model);lines.add(g.reply);}for(const t of Object.values(MINI_TASKS)){lines.add(t.instruction);lines.add(t.model);}for(const line of [...Object.values(MINI_LINES),...Object.values(MEAL_LINES)])lines.add(line);for(const f of HOME_FOODS)lines.add(f.request);for(const turn of CAT_TURNS)if(turn.resultPrompt)lines.add(turn.resultPrompt);
 for(const line of JSON.parse(fs.readFileSync(new URL('../dist/schoolbus/voice-lines.json',import.meta.url),'utf8')))lines.add(line);
 for(const text of [...Object.values(LIFE_LINES),...Object.values(SOCIAL_LINES),...Object.values(JOBS).flatMap(j=>[j.answer,j.model]),...Object.values(ADVENTURE_LINES),...Object.values(TASK_GUIDANCE),...Object.values(HOME_ACTIVITIES).map(a=>a.txt),'I like it.','I found the ball.','I helped my friend.','Where is the cat?','Here is the carrot.'])lines.add(text);
 for(const word of BODY_WORDS)lines.add('I can touch my '+word+'.');
 for(const word of PHONICS_WORDS)lines.add('I can see '+(/^[aeiou]/i.test(word)?'an':'a')+' '+word+'.');
 for(const word of Object.keys(VOCABULARY)){lines.add('I have '+(/^[aeiou]/i.test(word)?'an':'a')+' '+word+'.');lines.add('This is '+(/^[aeiou]/i.test(word)?'an':'a')+' '+word+'.');}
 for(const word of ['mother','father','sister','brother','grandmother','grandfather','family','mom','dad','grandma','grandpa','aunt','uncle','cousin'])lines.add('This is my '+word+'.');
 for(const word of ['big','small','fast','slow','tall','short','long'])lines.add('It is '+word+'.');
 const visit=(value,key='')=>{
  if(typeof value==='string'){if(fields.has(key)&&value.trim())lines.add(value);return;}
  if(Array.isArray(value)){value.forEach(v=>visit(v,key));return;}
  if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))visit(v,k);
 };
 for(const data of [FAMILY_GALLERY,TRANSPORTATION,RABBIT_STORY,STATIONERY,CAT_TURNS,WORKSHOPS,CHAPTER_INTROS,PARADES])visit(data);
 // Exercise the actual gallery factory, including every relative in pointing/craft roles.
 let seed=712067;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const pointing=new Set(),crafting=new Set();
 for(let i=0;i<800;i++){const round=createFamilyGalleryRound(random);pointing.add(round.pointingId);crafting.add(round.craftId);visit(round);}
 for(const relative of FAMILY_GALLERY.beats.slice(2).map(beat=>beat.station))if(!pointing.has(relative)||!crafting.has(relative))throw Error('Missing gallery voice role: '+relative);
 for(const word of BODY_WORDS)for(const side of PAIRED_PARTS.has(word)?['','left','right']:['']){
  const m={word,side};lines.add(missionSentence(m));lines.add(missionQuestion(m));lines.add(missionLabel(m));
  for(const name of Object.keys(ART)){
   lines.add(`Walk to ${name}. ${missionQuestion(m)}`);lines.add(`Walk to ${name}. We need to find the ${missionLabel(m)}.`);
  }
 }
 for(const word of PHONICS_WORDS)lines.add(phonicsSpeakingTarget({word}));
 for(const word of ['book','bag','pencil','crayon']){
  lines.add(`It's a ${word}.`);lines.add(`Name the ${word} sticker in a sentence.`);
 }
 for(const word of WANT_ITEMS){
  for(const text of [wantAnswer(word),wantQuestion(word),`I picked ${word}.`,`I want ${word}.`,`The baby wants ${word}.`,`Tell your friend what you picked: ${word}.`,`Ask the baby about ${word}.`,`Find the ${word}.`])lines.add(text);
 }
 for(const act of Object.values(PARADES))for(const [index,animal] of act.animals.entries()){
  lines.add(`The ${animal} is ${act.words[index]}.`);lines.add(act.words[index]);lines.add(`Hooray for the ${animal}!`);lines.add(`Tell me about the ${animal}.`);lines.add(`Look again. ${act.clue}`);
 }
 for(const word of ['Yes, please!','No, thank you.','No!','Not yet.','What?','Where?','in','on','under','behind','next to','above','below','In the basket!','Under the bed?','On the chair?'])lines.add(word);
 for(const item of ALPHABET_STEPS){
  lines.add(`Find ${item.form} ${item.letter}.`);lines.add(`Have another look. Find ${item.form} ${item.letter}.`);
  lines.add(`Yes, ${item.form} ${item.letter}! Now find the ${item.word}.`);
 }
 const places={box:{name:'box',prep:'in'},table:{name:'table',prep:'on'},chair:{name:'chair',prep:'under'},...EXTRA_PLACES};
 for(const [key,p] of Object.entries(places)){
  lines.add(`Let's look ${p.prep} the ${p.name}!`);lines.add(`The ball is not ${p.prep} the ${key}. Let's keep looking!`);lines.add(`The ball is ${p.prep} the ${key}.`);lines.add(p.prep);
 }
 for(const name of Object.keys(ART))lines.add(`Surprise! ${name} is your new friend!`);
 for(const word of Object.keys(VOCABULARY))lines.add(`Yes, ${word}!`);
 for(const c of Object.values(WORKSHOPS)){
  if(c.title)lines.add(c.title+'.');if(c.tool)lines.add('Pick up the '+c.tool);if(c.action)lines.add(c.action);lines.add('Talk to Pip');
 }
 return [...lines].filter(text=>typeof text==='string'&&text.trim()).sort();
}
if(process.argv[1]&&decodeURIComponent(new URL(import.meta.url).pathname)===process.argv[1])console.log(JSON.stringify(publicVoiceLines()));
