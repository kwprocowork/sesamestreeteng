import * as THREE from './assets/three.module.js';
export const ART={
 'Baby Bear':{file:'baby-bear.jpg',matte:true},'Abby Cadabby':{file:'abby.jpg',matte:true},
 'Elmo':{file:'elmo.png',pose:'elmo-wave.png',joy:'elmo-joy.png'},
 'Cookie Monster':{file:'cookie-wave.png',pose:'cookie-wave.png',joy:'cookie-monster.png'},
 'Grover':{file:'grover.png'},'Rosita':{file:'rosita.png',joy:'rosita-joy.png'},
 'Zoe':{file:'zoe.png'},'Bert':{file:'bert.png'},'Ernie':{file:'ernie.png'},
 'Julia':{file:'julia.png',matte:true},'Oscar':{file:'oscar.png'},
 'Snuffleupagus':{file:'snuffleupagus.png'},'Tamir':{file:'tamir.jpg',matte:true},'Ji-Young':{file:'ji-young.jpg',matte:true}
};
export const artPath=file=>'./assets/characters/'+file;
// Runtime border-connected matting for three official photos supplied on pale backgrounds.
// Enclosed white details such as eyes stay intact; original downloaded files are unchanged.
export function matteBorder(pixels,width,height){
 const visited=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
 const push=index=>{if(index<0||index>=visited.length||visited[index])return;visited[index]=1;const p=index*4,r=pixels[p],g=pixels[p+1],b=pixels[p+2];if(Math.min(r,g,b)>226&&Math.max(r,g,b)-Math.min(r,g,b)<25)queue[tail++]=index;};
 for(let x=0;x<width;x++){push(x);push((height-1)*width+x)}for(let y=0;y<height;y++){push(y*width);push(y*width+width-1)}
 while(head<tail){const index=queue[head++];pixels[index*4+3]=0;const x=index%width;if(x>0)push(index-1);if(x<width-1)push(index+1);push(index-width);push(index+width)}return pixels;
}
const cache=new Map();
export function loadArt(name,pose='file'){
 const spec=ART[name]||ART.Elmo,file=spec[pose]||spec.file,key=file;
 if(cache.has(key))return cache.get(key);
 const promise=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{
 try{const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);const img=ctx.getImageData(0,0,canvas.width,canvas.height);if(spec.matte){matteBorder(img.data,canvas.width,canvas.height);ctx.putImageData(img,0,0)}
 let minX=canvas.width,minY=canvas.height,maxX=0,maxY=0;for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(img.data[(y*canvas.width+x)*4+3]>25){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}
 const cropped=document.createElement('canvas');cropped.width=Math.max(1,maxX-minX+1);cropped.height=Math.max(1,maxY-minY+1);cropped.getContext('2d').drawImage(canvas,minX,minY,cropped.width,cropped.height,0,0,cropped.width,cropped.height);const texture=new THREE.CanvasTexture(cropped);texture.colorSpace=THREE.SRGBColorSpace;resolve({texture,aspect:cropped.width/cropped.height,portrait:cropped.toDataURL()});
 }catch(e){reject(e)}};image.onerror=()=>reject(new Error('Could not load character artwork: '+name));image.src=artPath(file)});cache.set(key,promise);return promise;
}
