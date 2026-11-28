import {SchoolTHREE as THREE,SCHOOL_RENDER} from './core.js?v=71f';
import {createSchoolFX} from './post.js?v=71f';
// Values come from the Schoolbus v223 rig. r187 needs a photometric conversion.
export class SchoolGraphics{
 constructor(scene,renderer,camera){this.scene=scene;this.renderer=renderer;this.camera=camera;this.sourceLights=[];this.originalRender=renderer.render.bind(renderer);this.inPass=false;
  const hemi=new THREE.HemisphereLight(0xdcecff,0xa8a294,.62*Math.PI),key=new THREE.DirectionalLight(0xfff0dc,.55*Math.PI),sun=new THREE.DirectionalLight(0xfff1d6,1.25*Math.PI);
  key.position.set(-20,30,26);sun.position.set(34,50,22);sun.target.position.set(0,0,-8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.radius=3;sun.shadow.normalBias=.02;sun.shadow.bias=-.0006;Object.assign(sun.shadow.camera,{left:-34,bottom:-34,right:34,top:34,near:.1,far:220});
  this.hemi=hemi;this.key=key;this.sun=sun;this.sourceLights=[hemi,key,sun];scene.add(hemi,key,key.target,sun,sun.target);
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.97;
  try{const pm=new THREE.PMREMGenerator(renderer),env=new THREE.Scene(),geo=new THREE.SphereGeometry(10,32,16),colors=[],c=new THREE.Color(),top=new THREE.Color(0x9cc4ec),horizon=new THREE.Color(0xfff6ea),ground=new THREE.Color(0xb8a68e);for(let i=0;i<geo.attributes.position.count;i++){const y=geo.attributes.position.getY(i)/10;if(y>0)c.copy(horizon).lerp(top,Math.pow(y,.6));else c.copy(horizon).lerp(ground,Math.min(1,-y*3));colors.push(c.r*.38,c.g*.38,c.b*.38);}geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));env.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));const sd=new THREE.Mesh(new THREE.SphereGeometry(.9,16,8),new THREE.MeshBasicMaterial());sd.material.color.setRGB(2.6,2.4,2);sd.position.set(34,50,22).normalize().multiplyScalar(8);env.add(sd);this.environment=pm.fromScene(env,.03);scene.environment=this.environment.texture;pm.dispose();}catch(error){console.warn('Schoolbus environment unavailable',error.message);}
  this.fx=createSchoolFX(scene,renderer,camera);
  renderer.render=(s,c)=>{if(this.inPass||s!==this.scene||c!==this.camera||!this.fx.ok||!this.fx.on)return this.originalRender(s,c);this.inPass=true;try{this.fx.render();}finally{this.inPass=false;renderer.setRenderTarget(null);}};
 }
 prepare(){}
 update(mode,player){const indoor=['house','wants','ball','cat','comparison'].includes(mode),night=mode==='night';for(const n of this.scene.children)if(n.isLight&&!this.sourceLights.includes(n))n.visible=false;
  const p=player.position;this.hemi.intensity=(night?.18:indoor?.5:.62)*Math.PI;this.key.intensity=(night?.22:indoor?.6:.55)*Math.PI;this.key.position.copy(p).add(new THREE.Vector3(-20,30,26));this.key.target.position.copy(p);this.key.target.updateMatrixWorld();this.sun.visible=!indoor&&!night;this.sun.intensity=.85*Math.PI;this.sun.position.copy(p).add(new THREE.Vector3(34,50,22));this.sun.target.position.copy(p).add(new THREE.Vector3(0,0,-8));this.sun.target.updateMatrixWorld();this.renderer.toneMappingExposure=night?.55:indoor?.94:.97;this.fx.setScene(indoor?'E':'A');
 }
}
