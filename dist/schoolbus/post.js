// Original Schoolbus v223 bloom/grading with canvas-size and color-space compatibility.
import {SchoolTHREE as THREE,SCHOOL_RENDER} from './core.js?v=71f';
export function createSchoolFX(S,R,cam){let scene='A';
const FX=(()=>{const F={on:true,q:2,ok:false};try{const gl2=R.capabilities.isWebGL2;const mk=(w,h,ms)=>{const o={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat};const t=(ms&&gl2&&THREE.WebGLMultisampleRenderTarget)?new THREE.WebGLMultisampleRenderTarget(w,h,o):new THREE.WebGLRenderTarget(w,h,o);if(ms&&t.samples!==undefined)t.samples=4;t.texture.colorSpace=THREE.SRGBColorSpace;return t};
 const cam2=new THREE.OrthographicCamera(-1,1,1,-1,0,1),geo=new THREE.PlaneGeometry(2,2),scn=new THREE.Scene(),quad=new THREE.Mesh(geo);quad.frustumCulled=false;scn.add(quad);
 const V='varying vec2 vU;void main(){vU=uv;gl_Position=vec4(position.xy,0.,1.);}';
 const bright=new THREE.ShaderMaterial({uniforms:{t:{value:null}},vertexShader:V,fragmentShader:'uniform sampler2D t;varying vec2 vU;void main(){vec3 c=texture2D(t,vU).rgb;float l=dot(c,vec3(.299,.587,.114));gl_FragColor=vec4(c*smoothstep(.93,1.,l)*1.4,1.);}',depthTest:false,depthWrite:false});
 const blur=new THREE.ShaderMaterial({uniforms:{t:{value:null},dir:{value:new THREE.Vector2()}},vertexShader:V,fragmentShader:'uniform sampler2D t;uniform vec2 dir;varying vec2 vU;void main(){vec3 c=texture2D(t,vU).rgb*.227;c+=(texture2D(t,vU+dir*1.385).rgb+texture2D(t,vU-dir*1.385).rgb)*.316;c+=(texture2D(t,vU+dir*3.231).rgb+texture2D(t,vU-dir*3.231).rgb)*.07;gl_FragColor=vec4(c,1.);}',depthTest:false,depthWrite:false});
 const comp=new THREE.ShaderMaterial({uniforms:{t:{value:null},b:{value:null},bs:{value:.32},ind:{value:0},asp:{value:1}},vertexShader:V,fragmentShader:'uniform sampler2D t,b;uniform float bs,ind,asp;varying vec2 vU;void main(){vec3 c=texture2D(t,vU).rgb;vec3 bl=texture2D(b,vU).rgb;float l0=dot(c,vec3(.299,.587,.114));c+=bl*bs*(1.-l0*.7);float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,1.14);c=(c-.5)*1.08+.49;c+=vec3(.012,.004,-.01)*smoothstep(.4,1.,l);c+=vec3(-.004,0.,.012)*(1.-smoothstep(0.,.35,l));vec2 q=(vU-.5)*vec2(asp,1.);float vg=1.-smoothstep(.55,1.15,length(q)*.95)*.22;c*=vg;gl_FragColor=vec4(clamp(c,0.,1.),1.);}',depthTest:false,depthWrite:false});
 let main=null,bA=null,bB=null,W=0,H=0;
 F.size=()=>{const pr=R.getPixelRatio(),w=Math.floor((R.domElement.clientWidth||1)*pr),h=Math.floor((R.domElement.clientHeight||1)*pr);if(w===W&&h===H&&main)return;W=w;H=h;[main,bA,bB].forEach(x=>x&&x.dispose());main=mk(w,h,true);const bw=Math.max(1,w>>2),bh=Math.max(1,h>>2);bA=mk(bw,bh);bB=mk(bw,bh);comp.uniforms.asp.value=w/h};
 const pass=(m,tgt)=>{quad.material=m;R.setRenderTarget(tgt);R.render(scn,cam2)};
 F.render=()=>{F.size();R.setRenderTarget(main);R.render(S,cam);
  if(F.q>=2){bright.uniforms.t.value=main.texture;pass(bright,bA);blur.uniforms.t.value=bA.texture;blur.uniforms.dir.value.set(1/(W>>2),0);pass(blur,bB);blur.uniforms.t.value=bB.texture;blur.uniforms.dir.value.set(0,1/(H>>2));pass(blur,bA);comp.uniforms.bs.value=(scene==='A'||scene==='C'||scene==='L')?.22:.15}else comp.uniforms.bs.value=0;
  comp.uniforms.t.value=main.texture;comp.uniforms.b.value=bA.texture;pass(comp,null)};
 F.ok=true}catch(e){console.log('FX',e);F.ok=false}
 /* quality guard: watch the frame time and step down smoothly if the device struggles */
 F.ft=[];F.tick=dt=>{F.ft.push(dt);if(F.ft.length<90)return;const a=F.ft.reduce((x,y)=>x+y,0)/F.ft.length;F.ft.length=0;if(F.forced)return;
  if(a>.042&&F.q>0){F.q--;if(F.q===0)F.on=false;try{if(R.getPixelRatio()>1.25&&F.q<1){R.setPixelRatio(1.25);R.setSize(R.domElement.clientWidth||1,R.domElement.clientHeight||1)}}catch(e){}}};
 try{const v=localStorage.getItem('sesame.schoolbus.graphicsQ');if(v!==null){F.q=+v;F.on=F.q>0;F.forced=1}}catch(e){}
 return F})();
FX.setScene=key=>{scene=key;};return FX;}
