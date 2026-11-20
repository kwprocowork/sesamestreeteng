import fs from 'node:fs';
import vm from 'node:vm';
import {awardStickers} from './dist/shop.js';
import {grantExperience} from './dist/learning.js';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/game.js','utf8');
function fn(name){const start=source.indexOf('function '+name+'(');const body=source.indexOf('{',start);let depth=1,i=body+1;for(;depth;i++){if(source[i]==='{')depth++;if(source[i]==='}')depth--}return source.slice(start,i)}
const ctx=vm.createContext({selected:"Elmo",sessionWords:()=>["in","on","under"],data:{xp:0,level:1,unlocked:['Elmo','Cookie Monster'],plays:{},journal:[]},CHARACTERS:[{name:'Elmo'},{name:'Cookie Monster'},{name:'Grover'},{name:'Rosita'}],completed:false,newXP:0,rating:50,grantExperience,awardStickers,lesson:'ball',lessonSummary:()=> 'The ball is under the chair.',pendingUnlocks:[],phase:'rating',save(){},updateProgress(){},rewardPanel(){},$:()=>({value:'Said under independently.'}),targetSentence:()=> 'The ball is under the chair.',Date,Math});
vm.runInContext(fn('need')+';'+fn('finish'),ctx);
vm.runInContext("finish('day1',false)",ctx);assert.equal(ctx.newXP,50);assert.equal(ctx.data.level,1);assert.equal(ctx.data.stickers,3);assert.equal(ctx.data.xp,50);assert.equal(ctx.data.journal[0].note,'Said under independently.');
vm.runInContext("finish('day1',false)",ctx);assert.equal(ctx.data.journal.length,1,'double confirmation must not award twice');assert.equal(ctx.data.stickers,3);
ctx.completed=false;vm.runInContext("finish('day1',true)",ctx);assert.equal(ctx.newXP,25);assert.equal(ctx.data.stickers,6,'replays still earn three stickers');assert.equal(ctx.data.xp,75);assert.equal(ctx.data.level,1);
ctx.completed=false;vm.runInContext("finish('day2',false)",ctx);assert.equal(ctx.data.level,2);assert.equal(ctx.data.xp,35);assert.equal(ctx.data.unlocked.length,2);assert.equal(ctx.data.pendingRewards,1);assert.equal(vm.runInContext('need()',ctx),120);
assert.equal(ctx.data.stickers,9);assert(ctx.data.journal.every(entry=>entry.stickers===3));assert.equal(ctx.data.plays.day1,2);assert.equal(ctx.data.journal.length,3);assert(!source.includes('MediaRecorder'));assert(!source.includes('SpeechRecognition'));assert(!source.includes('fetch('));
for(const path of ['assets/three.module.js','assets/three.core.js','style.css','game.js'])assert(fs.existsSync('dist/'+path));
assert.equal((fs.readFileSync('dist/index.html','utf8').match(/id="/g)||[]).length,new Set([...fs.readFileSync('dist/index.html','utf8').matchAll(/id="([^"]+)"/g)].map(x=>x[1])).size);
console.log('PASS: XP, replay reduction, duplicate confirmation, level carryover, unlock, journal, asset integrity, no recording/transcription/network calls.');
