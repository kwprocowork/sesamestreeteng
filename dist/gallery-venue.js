export const VENUE_BOUNDS={minX:-13.75,maxX:13.75,minZ:-7.15,maxZ:10.55};
export const WALL_Z=-7.90;

export function buildGalleryVenue(root,{cube,cyl,orb,rod,portraitLabel}){
 const brass=0xecc47a, ink=0x24485b, plaster=0xf8e6c6;
 cube(0xeec897,0,-.14,1.75,30,.27,20.3,root);
 for(let z=-7.65;z<11.9;z+=.67)cube(0xe4b987,0,-.006,z,29.9,.012,.025,root);

 // A wide teal exhibition wall with clear space between the eight pictures.
 cube(0x4c8e90,0,3.65,WALL_Z-.37,30,7.3,.34,root);
 cube(ink,0,2.55,WALL_Z-.13,17.9,5.1,.15,root);
 cube(brass,0,5.14,WALL_Z+.02,18.28,.11,.15,root);
 cube(0x2e6571,0,5.02,WALL_Z+.03,18.05,.12,.18,root);
 cube(plaster,0,.135,WALL_Z+.12,29.9,.27,.16,root);
 const sign=portraitLabel('Family Gallery',4.7);
 sign.position.set(0,4.45,WALL_Z+.03);
 root.add(sign);

 // Wide pilasters, window seats, arched panes, and a gold picture rail.
 for(const side of [-1,1]){
  const x=side*11.8;
  for(const offset of [-2.05,2.05]){
   cube(0xd0e1ce,x+offset,3.05,WALL_Z-.02,.28,6.08,.42,root);
   cube(brass,x+offset,5.97,WALL_Z+.12,.48,.17,.52,root);
   cube(0xf6dcb2,x+offset,.20,WALL_Z+.08,.50,.4,.53,root);
  }
  orb(plaster,x,4.61,WALL_Z-.02,1.66,1.64,.25,root);
  cube(plaster,x,3.07,WALL_Z+.02,3.32,3.15,.42,root);
  orb(0xa8dfec,x,4.59,WALL_Z+.23,1.43,1.38,.10,root);
  cube(0xa8dfec,x,3.12,WALL_Z+.23,2.86,2.97,.16,root);
  for(let j=0;j<3;j++)orb(0xf1f5e4,x+side*.28+(j-1)*.43,4.55+(j%2)*.15,WALL_Z+.33,.51,.19,.035,root);
  for(let j=0;j<4;j++)orb(j%2?0x87bda6:0x6cae9d,x+(j-1.5)*.65,1.89,WALL_Z+.32,.47,.49,.032,root);
  cube(plaster,x,3.73,WALL_Z+.40,.115,4.62,.14,root);
  cube(plaster,x,3.83,WALL_Z+.41,2.91,.12,.15,root);
  cube(plaster,x,1.59,WALL_Z+.42,3.52,.20,.47,root);
  cube(0x466e81,x,.27,WALL_Z+1.03,2.9,.55,.94,root);
  cube(side<0?0xdca1a7:0x8cc3b3,x,.63,WALL_Z+1.06,3.1,.24,1.04,root);
 }

 const runner=orb(0x478c88,0,.018,2.65,4.85,.031,4.1,root);
 runner.name='Round welcome rug';
 orb(0xa1c5a8,0,.03,2.65,4.54,.027,3.82,root);
 orb(0x5c9a92,0,.04,2.65,4.32,.021,3.58,root);
 for(let i=0;i<18;i++){
  const angle=i*Math.PI/9;
  orb(0xf3ddaa,4.42*Math.cos(angle),.066,2.65+3.70*Math.sin(angle),.08,.014,.08,root);
 }
 for(const x of [-6.85,6.85]){
  for(let row=0;row<10;row++){
   cube(row%2?0xf7deb0:0xe8beb0,x,.004,-5.5+row*1.65,1.05,.018,1.04,root);
  }
 }

 // Bunting and pendant lights sit behind the play area, keeping the route open.
 const colors=[0xed9489,0xf2bf67,0x92c3a6,0xaa99d0,0x82bac3];
 const cordY=x=>6.58-.85*(1-(x/13)**2);
 for(let i=0;i<20;i++){
  const x=-13+i*1.30, next=x+1.30;
  rod(brass,[x,cordY(x),WALL_Z+.41],[next,cordY(next),WALL_Z+.41],.021,root);
  const flag=cube(colors[i%5],x+.65,cordY(x+.65)-.26,WALL_Z+.45,.55,.54,.047,root);
  flag.rotation.z=i%2?.085:-.085;
 }
 for(const x of [-6.8,0,6.8]){
  const z=WALL_Z+3.36;
  rod(ink,[x,7.9,z],[x,5.67,z],.03,root);
  orb(brass,x,5.58,z,.48,.17,.48,root);
  orb(0xffecc2,x,5.51,z,.37,.12,.37,root);
 }
 for(const [x,z,color] of [[-13.65,-5.3,0xda8a83],[13.65,-5.3,0xe3ae67],[-13.65,6.5,0x8fa1ba],[13.65,6.5,0xb588a1]]){
  cyl(color,x,.34,z,.47,.68,root);
  cyl(plaster,x,.68,z,.49,.09,root);
  for(let i=0;i<7;i++){
   const angle=i*2.39,dx=Math.cos(angle),dz=Math.sin(angle),height=1.19+(i%3)*.28;
   rod(0x467f63,[x,.69,z],[x+dx*.40,height,z+dz*.38],.034,root);
   const leaf=orb(i%2?0x80b57b:0x529979,x+dx*.40,height,z+dz*.38,.21,.39,.13,root);
   leaf.rotation.set(dz*.35,angle,-dx*.42);
  }
 }
}
