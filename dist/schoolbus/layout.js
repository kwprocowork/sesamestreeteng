// KW Schoolbus v223 source coordinates. Only one uniform transform fits the V69 play zone.
export const PLAYMAT_PLACEMENT={x:0,y:.14,z:2.55,scale:1.35};
export const PLAYMAT_REFERENCE={kitchen:[-1.7,0,-3.8],canopy:[1.65,0,-3.35],tower:[-2.7,0,-1.2],treehouse:[2.25,0,-.35],piano:[2.55,0,1.55],cars:[.74,.012,.12],lego:[1.25,.012,-1.95],fruit:[-2,0,-2.8],castle:[1.62,.012,-2.55]};
export const HOME_ROUTINES={fridge:{x:-18.8,z:-7.6,yaw:Math.PI/2,approach:[-16.6,0,-7.6]},wash:{x:-18.74,z:-3.9,yaw:Math.PI/2,approach:[-16.6,0,-3.9]}};
const t=PLAYMAT_PLACEMENT;
export const playmatRect=([x0,z0,x1,z1])=>[t.x+x0*t.scale,t.x+x1*t.scale,t.z+z0*t.scale,t.z+z1*t.scale];
// Exact fence spans, with the original front gate and left opening kept walkable.
export const PLAYMAT_BLOCKS=[[-3.12,-3.05,-2.98,-.05],[-3.12,.95,-2.98,2.95],[2.98,-2.55,3.12,2.95],[-3.05,2.88,-2,3.02],[-1,2.88,3.05,3.02],[-2.88,-4.26,-.52,-3.34],[.25,-4.2,3.05,-2.45],[-3.16,-1.62,-2.24,-.72],[1.9,-.8,2.65,.2],[2,.4,3.04,2.65]].map(playmatRect);
export const ROUTINE_BLOCKS=[[-19.48,-18.1,-8.86,-6.34],[-19.49,-17.98,-5.31,-2.49]];
