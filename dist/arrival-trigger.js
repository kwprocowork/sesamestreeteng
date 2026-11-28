export class ArrivalTrigger{
 constructor(){this.clear();}
 clear(){this.key='';this.elapsed=0;this.fired=false;}
 tick(dt,{key='',near=false,enabled=true,paused=false}={}){if(!enabled||paused||!key)return false;if(key!==this.key){this.key=key;this.elapsed=0;this.fired=false;}if(!near){this.elapsed=0;this.fired=false;return false;}if(this.fired)return false;this.elapsed+=Math.min(.1,Math.max(0,dt));if(this.elapsed<.3)return false;this.fired=true;return true;}
}
