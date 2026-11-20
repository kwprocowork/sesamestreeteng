// Original pentatonic arrangements: a fuller welcome/trailer mix and a softer game mix.
const MELODIES=[
 [72,76,79,76,74,72,69,67,69,72,76,72,74,76,79,0,77,76,72,69,67,69,72,0,74,76,79,81,79,76,72,0],
 [76,79,81,79,76,74,72,0,74,76,79,76,74,72,69,0,72,74,76,79,81,79,76,74,72,69,67,69,72,0,76,0],
 [79,76,72,76,81,79,76,0,77,76,74,72,69,72,74,0,76,79,84,81,79,76,74,72,69,72,76,74,72,0,0,0],
 [72,74,76,79,76,72,69,0,69,72,74,76,79,76,74,0,81,79,76,74,72,76,79,0,77,76,74,69,72,0,72,0]
];
// Instrumental sing-alongs for the street party. Each slot lasts one eighth note.
const WELCOME_SONGS=[
 // Original character themes: Elmo's tune answers each call with two claps,
 // and Cookie's kitchen rhythm taps a bright pair of pitched pot lids.
 {title:'Elmo’s Clap-Along',accent:'claps',notes:[
  72,0,76,79,0,76,74,0,72,0,0,0,0,0,0,0,
  77,0,81,84,0,81,79,0,77,0,0,0,0,0,0,0,
  79,0,83,86,0,83,81,0,79,0,0,0,0,0,0,0,
  76,79,84,0,79,76,74,0,72,0,0,0,0,0,0,0],bass:[48,48,53,53,55,55,48,48]},
 {title:'Cookie Monster’s Kitchen Band',accent:'pots',notes:[
  67,72,0,76,79,0,76,72,74,0,72,0,67,0,0,0,
  69,72,0,77,81,0,77,72,77,0,76,0,72,0,0,0,
  71,74,0,79,83,0,79,74,79,0,77,0,74,0,0,0,
  72,76,0,79,84,0,79,76,74,0,72,0,72,0,0,0],bass:[48,48,53,53,55,55,48,48]},
 {title:'The Alphabet Song',notes:[72,0,72,0,79,0,79,0,81,0,81,0,79,0,0,0,77,0,77,0,76,0,76,0,74,0,74,0,72,0,0,0,
 79,0,79,0,77,0,77,0,76,0,76,0,74,0,0,0,79,0,79,0,77,0,77,0,76,0,76,0,74,0,0,0,
 72,0,72,0,79,0,79,0,81,0,81,0,79,0,0,0,77,0,77,0,76,0,76,0,74,0,74,0,72,0,0,0],bass:[48,53,53,48,48,55,48,55,48,53,53,48]},
 {title:'Old MacDonald Had a Farm',notes:[72,0,72,0,72,0,67,0,69,0,69,0,67,0,0,0,76,0,76,0,74,0,74,0,72,0,0,0,0,0,67,0,
 72,0,72,0,72,0,67,0,69,0,69,0,67,0,0,0,76,0,76,0,74,0,74,0,72,0,0,0,0,0,0,0],bass:[48,53,48,48,48,53,48,48]}
];
export const MUSIC_LEVELS={front:.26,game:.038,frontDuck:.032,gameDuck:.004};
export class GardenMusic{
 constructor(quiet=()=>false){this.quiet=quiet;this.enabled=true;this.active=false;this.ctx=null;this.master=null;this.timer=null;this.index=0;this.generation=0;this.next=0;this.mode='game';this.welcomeSong=0;this.welcomeStep=0;}
 setScene(mode){if(!['front','game'].includes(mode))return;const changed=this.mode!==mode;this.mode=mode;if(changed&&this.ctx){this.next=this.ctx.currentTime+.05;this.master.gain.setTargetAtTime(this.enabled&&this.active?this.gainLevel():0,this.ctx.currentTime,.25)}}
 gainLevel(){return this.quiet()?(this.mode==='front'?MUSIC_LEVELS.frontDuck:MUSIC_LEVELS.gameDuck):MUSIC_LEVELS[this.mode];}
 async start(mode=this.mode){this.setScene(mode);this.active=true;const serial=++this.generation;if(!this.enabled)return;try{if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=0;this.master.connect(this.ctx.destination)}await this.ctx.resume();if(serial!==this.generation||!this.active||!this.enabled)return;if(!this.timer){this.next=this.ctx.currentTime+.05;this.timer=setInterval(()=>this.schedule(),100)}this.schedule()}catch{}}
 welcomeBeat(at){
  const song=WELCOME_SONGS[this.welcomeSong],step=this.welcomeStep,midi=song.notes[step];
  const bass=song.bass[Math.floor(step/8)];
  if(midi){
   let length=1;
   while(step+length<song.notes.length&&!song.notes[step+length])length++;
   this.note(midi,at,Math.min(length*.22,.86),.32,'triangle');
   this.note(midi+12,at+.012,.15,.065);
  }
  if(step%4===0){
   this.beat(at);
   this.note(step%8===0?bass:bass+7,at,.35,.23);
  }
  if(step%4===2){
   for(const interval of [12,16,19])this.note(bass+interval,at,.13,.075,'triangle');
   this.note(89,at,.065,.045);
  }
  if(song.accent==='claps'&&[10,14].includes(step%16)){
   this.note(74,at,.065,.08,'square');
   this.note(86,at+.018,.07,.065,'triangle');
  }
  if(song.accent==='pots'&&[3,6].includes(step%8)){
   this.note(step%8===3?87:91,at,.12,.08);
   this.note(97,at+.008,.06,.035);
  }
  if(++this.welcomeStep===song.notes.length){
   this.welcomeStep=0;
   this.welcomeSong=(this.welcomeSong+1)%WELCOME_SONGS.length;
  }
 }
 schedule(){
  if(!this.ctx||!this.active||!this.enabled)return;
  const now=this.ctx.currentTime;
  this.master.gain.setTargetAtTime(this.gainLevel(),now,.12);
  if(this.next<now-.3)this.next=now+.03;
  while(this.next<now+.2){
   if(this.mode==='front'){
    this.welcomeBeat(this.next);
    this.next+=this.welcomeStep%2?.26:.21;
   }else{
    const melody=MELODIES[Math.floor(this.index/32)%MELODIES.length],midi=melody[this.index%32];
    if(midi)this.note(midi,this.next,.65,.2);
    if(this.index%8===0){
     const bass=[48,53,55,57][Math.floor(this.index/8)%4];
     this.note(bass,this.next,2.3,.12);
     this.note(bass+7,this.next,1.8,.07);
    }
    this.next+=.43;
    this.index++;
   }
  }
 }
 note(midi,at,length,volume,type='sine'){const oscillator=this.ctx.createOscillator(),gain=this.ctx.createGain();oscillator.type=type;oscillator.frequency.value=440*2**((midi-69)/12);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.025);gain.gain.exponentialRampToValueAtTime(.0001,at+length);oscillator.connect(gain);gain.connect(this.master);oscillator.start(at);oscillator.stop(at+length+.02);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()};}
 beat(at){const oscillator=this.ctx.createOscillator(),gain=this.ctx.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(125,at);oscillator.frequency.exponentialRampToValueAtTime(52,at+.11);gain.gain.setValueAtTime(.07,at);gain.gain.exponentialRampToValueAtTime(.0001,at+.15);oscillator.connect(gain);gain.connect(this.master);oscillator.start(at);oscillator.stop(at+.17);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()};}
 stop(){this.active=false;const serial=++this.generation;if(this.timer){clearInterval(this.timer);this.timer=null}if(this.ctx&&this.ctx.state!=='closed'){this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.07);setTimeout(()=>{if(serial===this.generation&&!this.active)this.ctx.suspend().catch(()=>{})},240)}}
 setEnabled(enabled){this.enabled=enabled;if(!enabled){const wasActive=this.active;this.stop();this.active=wasActive}else if(this.active)this.start()}
}
