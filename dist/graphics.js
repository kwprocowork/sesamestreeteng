import * as THREE from './assets/three.module.js';

const grain=new Map();
export function detailTexture(kind){
 if(grain.has(kind))return grain.get(kind);
 const size=128,values=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const noise=Math.sin(x*91.7+y*137.3)*43217.16;
  const random=noise-Math.floor(noise);
  let value=235+(random-.5)*11;
  if(kind==='cloth')value=232+((x%4<2)===(y%4<2)?10:-10)+(random-.5)*5;
  if(kind==='wood')value=235+Math.sin(x*.37+Math.sin(y*.06)*1.4)*10+(random-.5)*4;
  const at=(y*size+x)*4;
  values[at]=values[at+1]=values[at+2]=value;values[at+3]=255;
 }
 const texture=new THREE.DataTexture(values,size,size,THREE.RGBAFormat);
 texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
 texture.generateMipmaps=true;texture.minFilter=THREE.LinearMipmapLinearFilter;
 texture.needsUpdate=true;texture.name='Fine '+kind+' surface';grain.set(kind,texture);
 return texture;
}
export class SceneGraphics{
 constructor(scene,renderer){
  this.scene=scene;this.renderer=renderer;this.seen=new WeakSet();this.materials=new Map();this.frame=0;this.mode='';
  this.key=new THREE.DirectionalLight(0xffedd8,2.5);
  this.key.castShadow=true;this.key.shadow.mapSize.set(2048,2048);
  Object.assign(this.key.shadow.camera,{left:-16,right:16,top:16,bottom:-16,near:.2,far:55});
  this.key.shadow.bias=-.0003;this.key.shadow.normalBias=.035;
  this.key.shadow.radius=3;
  this.fill=new THREE.HemisphereLight(0xf5f5ff,0xb5a3a5,1.25);
  this.rim=new THREE.DirectionalLight(0xbfeaff,.7);
  scene.add(this.key,this.key.target,this.fill,this.rim);
  this.contact=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({
   map:this.contactTexture(),transparent:true,opacity:.3,depthWrite:false,toneMapped:false,
  }));
  this.contact.rotation.x=-Math.PI/2;this.contact.renderOrder=1;scene.add(this.contact);
 }
 contactTexture(){
  const size=64,data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const radius=Math.hypot((x+ .5-size/2)/(size/2),(y+.5-size/2)/(size/2));
   const at=(y*size+x)*4;data[at]=35;data[at+1]=44;data[at+2]=63;
   data[at+3]=Math.round(Math.max(0,1-radius)**2*230);
  }
  const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);texture.needsUpdate=true;return texture;
 }
 prepare(){
  const visit=(node,actor=false)=>{
   if(!node.visible||node===this.contact)return;
   const isActor=actor||!!node.userData.spec||!!node.userData.arms||!!node.userData.bodyPart;
   if(node.isMesh&&!this.seen.has(node)){
    this.seen.add(node);
    const source=node.material;
    if(source?.isMeshStandardMaterial&&!source.map&&!source.vertexColors&&!isActor){
     const bounds=node.geometry.parameters||{};
     const kind=node.geometry.type==='BoxGeometry'?(bounds.height<.4?'wood':'paint'):'paint';
     const key=source.id+':'+kind;
     if(!this.materials.has(key)){
      const material=source.clone();material.bumpMap=detailTexture(kind);material.bumpScale=.013;
      material.roughness=Math.min(.76,source.roughness);material.envMapIntensity=.35;
      this.materials.set(key,material);
     }
     node.material=this.materials.get(key);
    }
   }
   for(const child of node.children)visit(child,isActor);
  };
  visit(this.scene);
 }
 update(mode,player){
  const house=mode==='house';
  for(const node of this.scene.children)if(node.isLight&&![this.key,this.fill,this.rim].includes(node))node.visible=false;
  this.key.visible=this.key.target.visible=this.fill.visible=this.rim.visible=true;
  const x=player.position.x,z=player.position.z;
  this.key.position.set(x-8,house?9.8:17,z+6);
  this.key.target.position.set(x,0,z-3);this.key.target.updateMatrixWorld();
  this.rim.position.set(x+6,house?8.8:12,z-10);
  this.key.intensity=house?1.75:2.6;this.fill.intensity=house?1.55:1.13;
  this.rim.intensity=house?.5:.8;
  this.renderer.toneMappingExposure=mode==='night'?.55:1.03;
  this.contact.visible=player.visible&&mode!=='night';
  this.contact.position.set(x,.032,z);this.contact.scale.set(2.05,1.43,1);
  if(this.mode!==mode||this.frame++%30===0)this.prepare();
  this.mode=mode;
 }
}
