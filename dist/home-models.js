import * as THREE from './assets/three.module.js';
import { HOME_ITEM } from './home-goods.js?v=76a';

export function homeModel(id,{cube:box,cyl,orb}){
  const item=HOME_ITEM.get(id);
  const g=new THREE.Group();
  g.name=id;
  const c=new THREE.Color(item.color).getHex(),cream=0xffedcd,ink=0x35445f;
  const b=(color,x,y,z,w,h,d)=>box(color,x,y,z,w,h,d,g);
  const o=(color,x,y,z,w,h,d)=>orb(color,x,y,z,w,h,d,g);
  const cy=(color,x,y,z,r,h)=>{
    const mesh=cyl(color,x,y,z,r,h,g);
    mesh.userData.homeDisposable=true;
    return mesh;
  };
  const feet=(w,d,h)=>{
    for(const x of [-w,w])for(const z of [-d,d])b(0xc99770,x,h/2,z,.14,h,.14);
  };
  if(id==='cloud-chair'||id==='berry-sofa'){
    const width=item.size[0];
    feet(width*.36,.48,.22);
    b(c,0,.44,0,width-.18,.45,1.42);
    b(c,0,.91,-.53,width-.16,.93,.42);
    for(const s of [-1,1]){
      b(c,s*(width/2-.19),.7,.07,.34,.61,1.34);
      o(cream,s*width*.17,.88,-.27,.34,.29,.13);
    }
  }else if(id==='puzzle-table'){
    feet(.74,.51,.78);
    b(c,0,.86,0,2,.18,1.56);
    for(const [i,color] of [0x8ecfb4,0xf191b5,0x91c5ed,0xe6b2ec].entries()){
      const x=(i%2-.5)*.45,z=(Math.floor(i/2)-.5)*.4;
      b(color,x,.97,z,.44,.066,.39);
      cy(color,x+.23,.97,z,.11,.068);
    }
  }else if(id==='moon-bookcase'){
    b(c,0,1.1,-.38,2.3,2.16,.13);
    for(const x of [-1.1,1.1])b(c,x,1.05,0,.14,2.08,.87);
    for(const y of [.13,.76,1.42,2.1])b(cream,0,y,0,2.28,.12,.87);
    for(let i=0;i<5;i++)b([0xf3b289,0x97c9e2,0xdea8d9][i%3],-.84+i*.4,1.02,0,.22,.41,.46);
  }else if(id==='mint-bench'){
    feet(.99,.33,.42);
    b(c,0,.49,0,2.41,.18,.97);
    b(c,0,.86,-.38,2.41,.55,.16);
  }else if(id==='puff-ottoman'){
    cy(c,0,.31,0,.61,.62);
    o(0xe2cbed,0,.59,0,.55,.11,.55);
  }else if(id==='floor-lamp'){
    cy(cream,0,.08,0,.49,.16);
    cy(0x74ac83,0,1.25,0,.063,2.5);
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5;
      o(c,Math.cos(a)*.24,2.44,Math.sin(a)*.24,.24,.32,.22);
    }
    o(0xffd97f,0,2.61,0,.21,.23,.21);
  }else if(id==='rainbow-stand'){
    b(cream,0,.12,0,2.24,.24,.72);
    for(const [i,color] of [0xef94b0,0xffcc68,0x98d8b4,0x9bbee8].entries()){
      const arch=new THREE.Mesh(new THREE.TorusGeometry(.96-i*.14,.087,8,30,Math.PI),
        new THREE.MeshStandardMaterial({color}));
      arch.position.y=.22;arch.userData.homeDisposable=true;arch.userData.homeMaterial=true;g.add(arch);
    }
  }else if(id==='daisy-pot'){
    cy(c,0,.27,0,.5,.55);
    for(const side of [-1,1]){
      cy(0x6bb184,side*.23,.72,0,.045,.65);
      for(let i=0;i<5;i++){
        const a=i*Math.PI*2/5;
        o(cream,side*.23+Math.cos(a)*.14,1.1+side*.1+Math.sin(a)*.14,0,.1,.1,.067);
      }
      o(0xffce5c,side*.23,1.1+side*.1,.056,.082,.082,.047);
    }
  }else if(id==='star-lantern'){
    cy(cream,0,.08,0,.44,.16);
    cy(0xdca46e,0,.48,0,.045,.81);
    o(c,0,1.03,0,.24,.24,.14);
    for(let i=0;i<5;i++){
      const a=Math.PI/2+i*Math.PI*2/5;
      o(c,Math.cos(a)*.245,1.03+Math.sin(a)*.245,0,.13,.13,.1);
    }
  }else if(id==='toy-train'||id==='toy-bus'){
    const count=id==='toy-train'?3:1;
    for(let i=0;i<count;i++){
      const x=(i-(count-1)/2)*.42;
      const body=[c,0xa4d6aa,0x92c5e9][i];
      b(body,x,.23,0,count===1?.8:.39,.26,.33);
      b(cream,x-.03,.37,0,count===1?.63:.23,.15,.29);
      for(const side of [-1,1])o(ink,x+side*(count===1?.26:.11),.095,.177,.069,.069,.036);
    }
  }else if(id==='toy-rocket'){
    o(c,0,.36,0,.21,.35,.17);
    o(0xef93b5,0,.63,0,.15,.18,.13);
    o(cream,0,.39,.152,.095,.108,.04);
    for(const side of [-1,1])o(0xeeaf87,side*.17,.17,0,.13,.16,.07);
  }else if(id==='toy-blocks'){
    b(c,-.22,.13,0,.25,.25,.25);
    b(0xe7a6d0,.08,.15,0,.28,.28,.27);
    b(0x8dcbb1,-.08,.405,0,.25,.25,.25).rotation.y=.17;
  }else if(id==='toy-duck'){
    o(c,0,.16,0,.24,.16,.18);o(c,.14,.33,.035,.135,.14,.124);
    o(0xeb8a5e,.22,.3,.126,.09,.057,.053);o(ink,.16,.36,.145,.026,.028,.015);
  }else if(id==='toy-drum'){
    cy(c,0,.24,0,.215,.41);cy(cream,0,.46,0,.222,.03);
    b(0xc79469,0,.49,.03,.35,.038,.035).rotation.y=.36;
    b(0xc79469,0,.52,.02,.35,.038,.035).rotation.y=-.4;
  }else if(item.kind==='plush'){
    o(c,0,.32,0,.29,.314,.22);o(c,0,.66,0,.265,.25,.22);
    o(cream,0,.3,.188,.18,.2,.065);
    for(const s of [-1,1]){
      if(id!=='bed-penguin')o(c,s*.18,id==='bed-bunny'?.924:.84,0,.09,id==='bed-bunny'?.21:.092,.075);
      o(c,s*.252,.31,0,.102,.19,.09);
      o(ink,s*.102,.684,.193,.031,.032,.018);
    }
    o(id==='bed-penguin'?0xf6ad62:0xb07887,0,.607,.218,.05,.037,.03);
  }
  return g;
}
