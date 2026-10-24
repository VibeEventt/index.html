/* VIBE EVENT — 3D akışkan krom halka (Three.js)
   Kullanım: </body> öncesine ekle →  <script src="vibe-ring.js" defer></script>
   Three.js yüklenemezse eski SVG halka olduğu gibi kalır. */
(function(){
"use strict";
const art=document.querySelector(".hero-brand-art");
if(!art)return;
const sc=document.createElement("script");
sc.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
sc.onload=()=>{try{init(window.THREE);}catch(err){console.warn("VIBE ring:",err);}};
document.head.appendChild(sc);

function init(T){
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true});
 renderer.outputEncoding=T.sRGBEncoding;
 renderer.setClearColor(0x000000,0);
 const scene=new T.Scene(),cam=new T.PerspectiveCamera(32,1.48,.1,50);
 cam.position.set(0,0,8);

 /* Stüdyo yansıma haritası: parlak softbox'lar, koyu şeritler, marka renkleri */
 const ec=document.createElement("canvas");ec.width=1024;ec.height=512;
 const x=ec.getContext("2d"),g=x.createLinearGradient(0,0,0,512);
 [[0,"#1b1428"],[.36,"#9aa0b8"],[.5,"#ffffff"],[.58,"#2b2a36"],[1,"#040308"]].forEach(a=>g.addColorStop(a[0],a[1]));
 x.fillStyle=g;x.fillRect(0,0,1024,512);
 const box=(px,py,w,h,c,b)=>{x.shadowColor=c;x.shadowBlur=b;x.fillStyle=c;x.fillRect(px,py,w,h);};
 [[60,80,170,34],[330,30,300,22],[700,90,150,46],[880,40,110,30]].forEach(a=>box(a[0],a[1],a[2],a[3],"#fff",26));
 [[170,190,22,160],[470,170,46,190],[640,200,18,150],[930,180,30,170]].forEach(a=>box(a[0],a[1],a[2],a[3],"#fff",14));
 [[320,230,34,110],[560,220,60,120],[820,240,26,100]].forEach(a=>box(a[0],a[1],a[2],a[3],"#000",10));
 const orb=(px,py,r,c)=>{const q=x.createRadialGradient(px,py,0,px,py,r);q.addColorStop(0,"rgba("+c+",.95)");q.addColorStop(1,"rgba("+c+",0)");x.shadowBlur=0;x.fillStyle=q;x.fillRect(px-r,py-r,2*r,2*r);};
 orb(250,150,110,"255,41,152");orb(740,170,120,"64,200,255");orb(520,300,100,"161,77,255");orb(960,120,80,"255,130,77");
 const tex=new T.CanvasTexture(ec);tex.mapping=T.EquirectangularReflectionMapping;tex.encoding=T.sRGBEncoding;
 const pm=new T.PMREMGenerator(renderer),env=pm.fromEquirectangular(tex).texture;pm.dispose();

 /* Halka gövdesi: her karede yeniden hesaplanan, kalınlığı değişen kapalı tüp */
 const M=240,K=26,pos=new Float32Array(M*K*3),nor=new Float32Array(M*K*3),idx=[];
 for(let i=0;i<M;i++)for(let j=0;j<K;j++){
  const a=i*K+j,b=((i+1)%M)*K+j,c=((i+1)%M)*K+(j+1)%K,d=i*K+(j+1)%K;
  idx.push(a,d,b,d,c,b);
 }
 const geo=new T.BufferGeometry();
 geo.setAttribute("position",new T.BufferAttribute(pos,3));
 geo.setAttribute("normal",new T.BufferAttribute(nor,3));
 geo.setIndex(idx);
 const mat=new T.MeshStandardMaterial({color:0xf2f5ff,metalness:1,roughness:.07,envMap:env,envMapIntensity:1.35,side:T.DoubleSide});
 const ring=new T.Mesh(geo,mat);ring.frustumCulled=false;scene.add(ring);

 const S=Math.sin;
 /* Orta çizgi: düzensiz, her yöne dalgalı, zamanla akan şekil */
 const C=(a,t,o)=>{
  const r=2*(1+.15*S(2*a+.6*t+1)+.11*S(3*a-.8*t+2.1)+.06*S(5*a+1.1*t));
  return o.set(Math.cos(a)*r*1.06,S(a)*r*.92,.5*S(2*a-.5*t)+.26*S(3*a+.9*t+.5));
 };
 /* Tüp kalınlığı: şişkin damlalar ve ince boyunlar */
 const W=(a,t)=>.13*(1+.32*S(3*a+.7*t)+.16*S(5*a-1.1*t+1.7)+.1*S(2*a+.5*t));
 const p0=new T.Vector3(),p1=new T.Vector3(),p2=new T.Vector3(),tg=new T.Vector3(),nn=new T.Vector3(),bb=new T.Vector3(),zz=new T.Vector3(0,0,1),cs=[],sn=[];
 for(let j=0;j<K;j++){cs.push(Math.cos(j/K*6.28318530718));sn.push(Math.sin(j/K*6.28318530718));}

 function build(t){
  const h=.012;
  for(let i=0;i<M;i++){
   const a=i/M*6.28318530718;
   C(a,t,p0);C(a+h,t,p1);C(a-h,t,p2);
   tg.subVectors(p1,p2);const len=tg.length();tg.divideScalar(len);
   nn.crossVectors(zz,tg).normalize();bb.crossVectors(tg,nn);
   const r=W(a,t),dr=(W(a+h,t)-W(a-h,t))/len;
   for(let j=0;j<K;j++){
    const k=(i*K+j)*3,
     ux=cs[j]*nn.x+sn[j]*bb.x,uy=cs[j]*nn.y+sn[j]*bb.y,uz=cs[j]*nn.z+sn[j]*bb.z;
    pos[k]=p0.x+r*ux;pos[k+1]=p0.y+r*uy;pos[k+2]=p0.z+r*uz;
    const qx=ux-dr*tg.x,qy=uy-dr*tg.y,qz=uz-dr*tg.z,l=Math.hypot(qx,qy,qz);
    nor[k]=qx/l;nor[k+1]=qy/l;nor[k+2]=qz/l;
   }
  }
  geo.attributes.position.needsUpdate=true;geo.attributes.normal.needsUpdate=true;
 }

 /* Sayfaya iki katman ekle: biri VIBE yazısının arkasında, biri önünde */
 const st=document.createElement("style");
 st.textContent=".vr{position:absolute;inset:-8%;width:116%;height:116%;pointer-events:none}.vr-b{z-index:1}.vr-f{z-index:3}@media(max-width:650px){.vr{inset:-10%;width:120%;height:120%}}";
 document.head.appendChild(st);
 art.querySelectorAll(".mercury-svg").forEach(n=>n.remove());
 art.style.perspective="none";art.style.transformStyle="flat";
 const back=document.createElement("canvas"),front=document.createElement("canvas");
 back.className="vr vr-b";front.className="vr vr-f";
 back.setAttribute("aria-hidden","true");front.setAttribute("aria-hidden","true");
 art.insertBefore(back,art.firstChild);art.appendChild(front);
 const bx=back.getContext("2d"),fx=front.getContext("2d");

 /* z=0 (yazının düzlemi) ikiye böler: arka yarı yazının arkasında, ön yarı önünde görünür */
 const clipB=new T.Plane(new T.Vector3(0,0,-1),0),clipF=new T.Plane(new T.Vector3(0,0,1),0);
 function size(){
  const w=back.clientWidth,h=back.clientHeight,d=Math.min(window.devicePixelRatio||1,2);
  if(!w||!h)return;
  back.width=front.width=w*d;back.height=front.height=h*d;
  renderer.setSize(w*d,h*d,false);
  cam.aspect=w/h;cam.updateProjectionMatrix();
  ring.scale.setScalar(w/h<1.4?.8:1);
 }
 function draw(t){
  build(t);
  ring.rotation.set(-1.17+.2*S(t*.31),.4*S(t*.23+1.2),t*.5);
  renderer.clippingPlanes=[clipB];renderer.render(scene,cam);
  bx.clearRect(0,0,back.width,back.height);bx.drawImage(renderer.domElement,0,0);
  renderer.clippingPlanes=[clipF];renderer.render(scene,cam);
  fx.clearRect(0,0,front.width,front.height);fx.drawImage(renderer.domElement,0,0);
 }

 let on=true;
 const still=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 size();
 if("ResizeObserver" in window)new ResizeObserver(()=>{size();if(still)draw(4);}).observe(back);
 else window.addEventListener("resize",size);
 const home=document.getElementById("home");
 if(home&&"IntersectionObserver" in window)new IntersectionObserver(en=>{on=en[0].isIntersecting;}).observe(home);
 const loop=ms=>{requestAnimationFrame(loop);if(on)draw(ms/1000);};
 if(still)draw(4);else requestAnimationFrame(loop);
}
})();
