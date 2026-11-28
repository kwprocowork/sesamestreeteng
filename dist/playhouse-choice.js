export function foodChoices(round,used,index){return round.filter(item=>!used.has(item.word)&&(index>=2?item.word==='milk':item.word!=='milk'));}
