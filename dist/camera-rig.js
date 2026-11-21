// Five active-play seconds between gentle returns to the follow view.
export const CAMERA_INTERVAL=5;
export const STORY_DISTANCE=1.26;
export const DETAIL_DISTANCE=1.14;
export class AutoCamera {
 constructor(){this.manual();}
 manual(){this.elapsed=0;this.returning=false;}
 tick(dt,orbit,{active=true,protectedView=false,dragging=false,reduced=false}={}){
  if(!active||protectedView||dragging){this.manual();return;}
  this.elapsed+=Math.max(0,Math.min(dt,.1));
  if(this.elapsed>=CAMERA_INTERVAL){this.elapsed%=CAMERA_INTERVAL;this.returning=true;}
  if(!this.returning)return;
  const alpha=reduced?1:1-Math.exp(-dt*2.4);
  orbit.yaw+=(0-orbit.yaw)*alpha;orbit.pitch+=(0-orbit.pitch)*alpha;orbit.zoom+=(1-orbit.zoom)*alpha;
  if(Math.abs(orbit.yaw)+Math.abs(orbit.pitch)+Math.abs(1-orbit.zoom)<.002){orbit.yaw=orbit.pitch=0;orbit.zoom=1;this.returning=false;}
 }
}
