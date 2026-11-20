// A generated chapter is data only. Both locally authored and synced stories use this schema.
export function readFamilyStory(raw){
 const text=(s,limit)=>{if(typeof s!=='string'||!s.trim()||s.length>limit||/[<>\u0000-\u001f]/u.test(s))throw Error('Invalid story text');return s.trim();};
 if(!/^mac-[a-f0-9]{16}$/.test(raw?.id)||!Array.isArray(raw.beats)||raw.beats.length<2||raw.beats.length>6)throw Error('Invalid picture story');
 return {id:raw.id,title:text(raw.title,72),intro:text(raw.intro,240),ending:text(raw.ending,240),setting:raw.setting==='garden'?'garden':'playroom',
 beats:raw.beats.map(b=>({word:text(b.word,32),icon:text(b.icon,16),clue:text(b.clue,180),sentence:text(b.sentence,140)}))};
}
const CACHE='littleStreet.familyStories.v1',PAIR='littleStreet.storyPair.v1';
function decode(s){return Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
export function loadFamilyStories(){
 let saved=[];try{saved=JSON.parse(localStorage.getItem(CACHE)||'[]');}catch{}
 return (window.LITTLE_STREET_STORIES||saved).map(readFamilyStory);
}
export function pairMac(){
 const match=location.hash.match(/^#mac-sync=([0-9a-f]{20,64})\.([A-Za-z0-9_-]{43})$/);
 if(!match)return;
 localStorage.setItem(PAIR,JSON.stringify(match.slice(1)));
 history.replaceState(null,'',location.pathname+location.search);
}
export async function syncFamilyStories(){
 const pairing=JSON.parse(localStorage.getItem(PAIR)||'null');if(!pairing)return null;
 const [id,secret]=pairing;
 if(!/^[a-f0-9]{20,64}$/.test(id)||!/^[A-Za-z0-9_-]{43}$/.test(secret))throw Error('Invalid Mac pairing');
 const response=await fetch('https://api.github.com/gists/'+id,{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});
 if(!response.ok)throw Error('Mac story sync is unavailable.');const gist=await response.json(),file=gist.files?.['stories.enc'];
 if(!file||file.truncated)throw Error('Incomplete Mac story feed');
 const {nonce,data}=JSON.parse(file.content);
 const key=await crypto.subtle.importKey('raw',decode(secret),'AES-GCM',false,['decrypt']);
 const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(nonce)},key,decode(data));
 const list=JSON.parse(new TextDecoder().decode(bytes)).map(readFamilyStory);
 const existing=localStorage.getItem(CACHE),encoded=JSON.stringify(list);
 if(existing===encoded)return null;
 localStorage.setItem(CACHE,encoded);return list;
}
