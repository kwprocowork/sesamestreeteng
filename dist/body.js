// Parent-selected poster targets and small Bert illustrations for the post-game vocabulary bank. Gameplay uses real 3D actors in body-world.js.
export const BODY_GROUPS={
 'Head and face':['head','hair','eye','ear','nose','mouth'],
 'More face details':['eyebrow','forehead','cheek','lip','tooth','tongue','chin'],
 'Arms and hands':['shoulder','arm','elbow','hand','finger'],
 'Body':['throat','chest','stomach','waist','hip'],
 'Legs and feet':['leg','knee','ankle','foot','toe']
};
export const BODY_WORDS=Object.values(BODY_GROUPS).flat();
export const BODY_START=['head','nose','hand','foot'];
const POINTS={head:[150,70],hair:[130,27],eye:[126,67],ear:[91,79],nose:[150,86],mouth:[150,108],eyebrow:[125,51],forehead:[150,44],cheek:[115,91],lip:[150,101],tooth:[144,108],tongue:[153,118],chin:[150,132],throat:[150,151],shoulder:[116,167],arm:[83,191],elbow:[65,205],hand:[35,218],finger:[18,214],chest:[150,185],stomach:[150,222],waist:[127,241],hip:[125,269],leg:[122,310],knee:[120,337],ankle:[120,384],foot:[112,403],toe:[92,405]};
const faceWords=new Set(BODY_GROUPS['Head and face'].concat(BODY_GROUPS['More face details']));
export function validBodyWords(words){return [...new Set(Array.isArray(words)?words:[])].filter(w=>BODY_WORDS.includes(w));}
export function bodySentence(word){return `This is my ${word}.`;}
export function bodyAction(word){return `Point to your ${word}.`;}
export function bodyPicture(word='',options=[]){
 const face=faceWords.has(word)||(options.length>0&&options.every(w=>faceWords.has(w))),p=POINTS[word];
 const view=face?'75 0 150 150':'0 0 300 430';
 const outline='<g stroke="#93684f" stroke-width="2" stroke-linejoin="round"><path d="M119 259 107 387q-24 0-23 17 4 14 44 4l15-142m14 0 15 142q40 10 44-4 1-17-23-17l-12-128" fill="#e7c962"/><path d="M116 165 56 202l-24 4-19-5-5 7 16 8-18 2 2 8 23-1 13 4 76-36m64-28 60 37 24 4 19-5 5 7-16 8 18 2-2 8-23-1-13 4-76-36" fill="#e7c962"/><path d="M123 139v24l-14 8 3 79 7 24h62l7-24 3-79-14-8v-24" fill="#e7c962"/><path d="m119 161-13 14 6 74h76l6-74-14-14q-30 28-61 0" fill="url(#bertShirt)"/><path d="m112 244 5 40h28l5-25 5 25h28l5-40" fill="#4e729d"/><ellipse cx="93" cy="79" rx="12" ry="17" fill="#e7c962"/><ellipse cx="207" cy="79" rx="12" ry="17" fill="#e7c962"/><ellipse cx="150" cy="77" rx="57" ry="64" fill="#efd16a"/><path d="m137 25-9-22 14 13 2-22 9 19 11-19-2 24 14-11-7 22" fill="#292d2b" stroke="#292d2b"/><path d="M114 52q36-23 72 0" fill="none" stroke="#67473b" stroke-width="4" stroke-linecap="round"/><ellipse cx="126" cy="69" rx="12" ry="15" fill="white"/><ellipse cx="174" cy="69" rx="12" ry="15" fill="white"/><g fill="#4e7c87" stroke="none"><ellipse cx="128" cy="71" rx="6" ry="8"/><ellipse cx="172" cy="71" rx="6" ry="8"/></g><ellipse cx="150" cy="88" rx="13" ry="22" fill="#ee912c" stroke="#d68429"/><g fill="#eaa08c" stroke="none"><ellipse cx="114" cy="93" rx="10" ry="6"/><ellipse cx="186" cy="93" rx="10" ry="6"/></g><path d="M131 102q19 5 38 0-3 25-19 24-16 1-19-24Z" fill="#743f40"/><path d="M136 104h28l-3 8h-22Z" fill="#fffbed" stroke="none"/><path d="M141 120q9-10 18 0" fill="#ec8e97" stroke="none"/></g>';
 const marker=p?`<circle cx="${p[0]}" cy="${p[1]}" r="${face?9:13}" fill="#ffd36a" fill-opacity=".55" stroke="#df8b17" stroke-width="2"/><path d="m${p[0]+18} ${p[1]-18}-12 12" stroke="#df8b17" stroke-width="3"/>`:'';
 const taps=options.map((w,i)=>{const q=POINTS[w];return `<g data-body-part="${w}" role="button" tabindex="0" aria-label="Body spot ${i+1}" class="body-hotspot"><circle cx="${q[0]}" cy="${q[1]}" r="${face?10:18}" fill="#fff5ca" stroke="#528d90" stroke-width="2"/><text x="${q[0]}" y="${q[1]+(face?3:5)}" text-anchor="middle" fill="#284e59" font-family="Arial" font-weight="bold" font-size="${face?9:15}">${i+1}</text></g>`}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${word?'Body picture highlighting '+word:'Human body with numbered body spots'}"><defs><pattern id="bertShirt" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#75a581"/><rect width="5" height="20" fill="#ce7051"/><rect x="8" width="4" height="20" fill="#e5c85b"/><rect x="15" width="3" height="20" fill="#557f9c"/></pattern></defs>${outline}${marker}${taps}</svg>`;
}
export const NOTE_CATEGORIES={
 understanding:'Understanding', spelling:'Spelling & word recognition', speaking:'Speaking',
 engagement:'Engagement', nextPractice:'Next practice', gameFeedback:'Game feedback', general:'General'
};

const notePatterns={
 understanding:/\b(underst(and|ands|anding|ood)|comprehend\w*|comprehension|follow(ed|s)? (the )?(instructions?|directions?)|knew|knows|confus\w*)\b/i,
 spelling:/\b(spell\w*|letters?|read(ing)?|written|recognis\w*|recogniz\w*|word recognition)\b/i,
 speaking:/\b(say|says|said|saying|speak\w*|spoke\w*|talk\w*|pronounc\w*|pronunciation|sentences?|phrases?|repeat\w*|accent|oral)\b/i,
 engagement:/\b(enjoy\w*|fun|lov\w*|excited|bored|frustrat\w*|attention|engag\w*|distract\w*)\b/i,
 nextPractice:/\b(next time|next session|practi[cs]e again|needs? (more )?practi[cs]e|revisit|review again|try again)\b/i,
 gameFeedback:/\b(camera|joystick|keyboard|volume|music|glitch|button|controls?|lag|screen|bug)\b/i
};

export function reviewTags(note=''){
 if(!note.trim())return [];
 const tags=Object.keys(notePatterns).filter(key=>notePatterns[key].test(note));
 return tags.length?tags:['general'];
}

export function noteMatches(entry,filters={}){
 const categories=entry.categories||{};
 const matchesCategory=!filters.category||!!categories[filters.category]||reviewTags(entry.note).includes(filters.category);
 const searchable=JSON.stringify({phonics:entry.phonics,words:entry.words,sentence:entry.sentence,note:entry.note,categories});
 return (!filters.lesson||entry.lesson===filters.lesson)&&matchesCategory&&(!filters.query||searchable.toLowerCase().includes(filters.query.toLowerCase()));
}
