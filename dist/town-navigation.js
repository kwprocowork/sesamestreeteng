// Bounded A* over the same collision rules used by the playable character.
export function findWorldRoute(start,end,bounds,walk){
 const safe=(x,z)=>walk(x,z)&&walk(x-.24,z)&&walk(x+.24,z)&&walk(x,z-.24)&&walk(x,z+.24);
 const clear=(a,b)=>{const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.2);for(let i=0;i<=n;i++){const t=n?i/n:0,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;if(!(i===0||i===n?walk(x,z):safe(x,z)))return false;}return true;};
 if(!walk(...start)||!walk(...end))return null;if(clear(start,end))return [start,end];
 const step=2,key=(x,z)=>x+','+z,point=(x,z)=>[bounds.left+1+x*step,bounds.top+1+z*step],width=Math.floor((bounds.right-bounds.left-2)/step),height=Math.floor((bounds.bottom-bounds.top-2)/step);
 const nearest=p=>{const x=Math.round((p[0]-bounds.left-1)/step),z=Math.round((p[1]-bounds.top-1)/step);for(let r=0;r<=4;r++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){const q=point(x+dx,z+dz);if(x+dx>=0&&x+dx<=width&&z+dz>=0&&z+dz<=height&&safe(...q)&&clear(p,q))return [x+dx,z+dz];}return null;};
 const from=nearest(start),to=nearest(end);if(!from||!to)return null;const open=[],scores=new Map(),parents=new Map(),closed=new Set();
 const push=n=>{open.push(n);let i=open.length-1;while(i){const p=(i-1)>>1;if(open[p].f<=n.f)break;open[i]=open[p];i=p;}open[i]=n;};
 const pop=()=>{const first=open[0],last=open.pop();if(open.length){let i=0;while(i*2+1<open.length){let c=i*2+1;if(c+1<open.length&&open[c+1].f<open[c].f)c++;if(last.f<=open[c].f)break;open[i]=open[c];i=c;}open[i]=last;}return first;};
 const h=(x,z)=>Math.abs(x-to[0])+Math.abs(z-to[1]);push({x:from[0],z:from[1],g:0,f:h(...from)});scores.set(key(...from),0);
 for(let count=0;open.length&&count<26000;count++){
  const n=pop(),k=key(n.x,n.z);if(closed.has(k))continue;closed.add(k);
  if(n.x===to[0]&&n.z===to[1]){const path=[end,point(n.x,n.z)];let at=k;while(parents.has(at)){const prev=parents.get(at);path.push(point(...prev));at=key(...prev);}path.push(start);path.reverse();const smooth=[path[0]];for(let i=0;i<path.length-1;){let next=path.length-1;while(next>i+1&&!clear(path[i],path[next]))next--;smooth.push(path[next]);i=next;}return smooth;}
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=n.x+dx,z=n.z+dz,k2=key(x,z);if(x<0||x>width||z<0||z>height||closed.has(k2)||!safe(...point(x,z))||!clear(point(n.x,n.z),point(x,z)))continue;const g=n.g+1;if(g>=(scores.get(k2)??Infinity))continue;scores.set(k2,g);parents.set(k2,[n.x,n.z]);push({x,z,g,f:g+h(x,z)});}
 }return null;
}
