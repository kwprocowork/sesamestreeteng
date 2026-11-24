export const LESSONS={ball:{id:'ball',number:'01',title:'Can you find the ball?',setting:'The playroom',targets:['in','on','under']},letters:{id:'letters',type:'vocabulary',number:'02',title:'The A a & B b Garden',setting:'Letter Garden',targets:['A','a','B','b','apple','ant','ball','butterfly']}};
LESSONS.wants={id:'wants',number:'03',type:'story',title:'What do you want?',setting:'The Little Playhouse',targets:['cookies','bread','rice','ice cream','juice','milk'],minutes:3};
export const ALPHABET_STEPS=[{letter:'A',form:'capital',word:'apple',family:'A',icon:'🍎',x:-4},{letter:'a',form:'small',word:'ant',family:'A',icon:'🐜',x:-1.35},{letter:'B',form:'capital',word:'ball',family:'B',icon:'⚽',x:1.35},{letter:'b',form:'small',word:'butterfly',family:'B',icon:'🦋',x:4}];
export const letterMatches=(choice,target)=>choice===target;
export const familyMatches=(choice,item)=>choice===item.family;
export function shuffled(values,random=Math.random){const copy=[...values];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy;}
export const levelNeed=level=>180;
export function grantExperience(state,amount,roster){if(!Number.isSafeInteger(amount)||amount<1||amount>5000)throw new Error('Choose a whole number from 1 to 5000.');state.pendingRewards=Math.max(0,Math.floor(state.pendingRewards||0));state.xp+=amount;let levels=0;while(state.xp>=levelNeed(state.level)){state.xp-=levelNeed(state.level);state.level++;levels++;if(roster.length-state.unlocked.length-state.pendingRewards>0)state.pendingRewards++;}return levels;}
export function mysteryCandidates(state,roster,random=Math.random){const locked=roster.filter(name=>!state.unlocked.includes(name));if(!state.pendingRewards||!locked.length)return [];if(Array.isArray(state.rewardChoices)&&state.rewardChoices.length===3&&state.rewardChoices.every(n=>locked.includes(n)))return state.rewardChoices;const pool=shuffled(locked,random);state.rewardChoices=Array.from({length:3},(_,i)=>pool[i%pool.length]);return state.rewardChoices;}
export function claimMystery(state,index){if(!Number.isInteger(index)||index<0||index>2||!state.pendingRewards||!Array.isArray(state.rewardChoices))return null;const name=state.rewardChoices[index];if(!name||state.unlocked.includes(name))return null;state.unlocked.push(name);state.pendingRewards--;state.rewardChoices=null;return name;}

// Independent shuffles: no fixed word sequence, world location, or review position.
export function createVocabularyRound(random=Math.random){
 const slots=shuffled([{x:-4.5,z:-2.3},{x:-1.5,z:.15},{x:1.5,z:-2.3},{x:4.5,z:.15}],random);
 return shuffled(ALPHABET_STEPS,random).map((item,index)=>({...item,...slots[index]}));
}

LESSONS.body={id:'body',number:'04',type:'story',title:'Ready for the Body Boogie?',setting:'The park stage',targets:['head','nose','hand','foot'],minutes:3};

LESSONS.phonics={id:'phonics',number:'05',type:'story',title:'Sound Safari Parade',setting:'The parade park',targets:['Two letters','Initial sounds','Four word missions'],minutes:3};

LESSONS.cat={id:'cat',number:'06',type:'story',title:'Can you see the cat?',setting:'The hide-and-seek house',targets:['cat','bed','chair','basket','under','on','in'],minutes:3};

LESSONS.comparison={id:'comparison',number:'07',type:'story',title:'Comparison — Abby’s Toy Parade',setting:'Abby’s home',targets:['fast / slow','big / small','tall / short','long / short'],minutes:3};
