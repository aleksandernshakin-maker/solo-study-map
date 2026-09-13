'use strict';
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
self.onmessage=e=>{
 const {lessonId,nodes,regions,sceneId,mode='world'}=e.data;
 const random=rng(hash(String(lessonId)+':'+String(sceneId||'world')));
 const activeRegions=regions.length?regions:[{id:'r0',name:'Регион'}];
 const cols=Math.ceil(Math.sqrt(activeRegions.length));
 const spacingX=1180,spacingY=900;
 const regionCenters={};
 activeRegions.forEach((r,i)=>{
   const row=Math.floor(i/cols),col=i%cols;
   const jitterX=(random()-.5)*120,jitterY=(random()-.5)*100;
   regionCenters[r.id]={x:700+col*spacingX+jitterX+(row%2?220:0),y:620+row*spacingY+jitterY};
 });
 const byRegion={}; activeRegions.forEach(r=>byRegion[r.id]=[]);
 nodes.forEach((n,i)=>{const rid=n.regionId&&byRegion[n.regionId]?n.regionId:activeRegions[i%activeRegions.length].id;byRegion[rid].push(n)});
 const positions={};
 Object.entries(byRegion).forEach(([rid,arr])=>{
   const c=regionCenters[rid];
   const rings=[];
   arr.forEach((n,i)=>{
     if(n.position?.pinned){positions[n.id]={x:n.position.x,y:n.position.y,pinned:true};return}
     const ring=Math.floor(i/12),slot=i%12,count=Math.min(12,arr.length-ring*12);
     const radius=190+ring*145;
     const angle=(Math.PI*2*(slot/Math.max(1,count)))+(ring*.33)+(random()-.5)*.16;
     positions[n.id]={x:c.x+Math.cos(angle)*radius+(random()-.5)*35,y:c.y+Math.sin(angle)*radius*.72+(random()-.5)*30,pinned:false};
   });
 });
 let maxX=1500,maxY=1000;
 Object.values(positions).forEach(p=>{maxX=Math.max(maxX,p.x+500);maxY=Math.max(maxY,p.y+400)});
 self.postMessage({positions,regionCenters,bounds:{width:maxX,height:maxY}});
};
