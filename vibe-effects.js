(function(){
"use strict";
document.documentElement.classList.add("js-ready");
const intro=document.getElementById("intro"),header=document.getElementById("siteHeader"),menuButton=document.getElementById("menuButton"),mobileMenu=document.getElementById("mobileMenu"),modal=document.getElementById("teamModal"),joinButton=document.getElementById("joinTeamButton"),closeModalButton=document.getElementById("closeTeamModal"),teamForm=document.getElementById("teamForm"),teamFormArea=document.getElementById("teamFormArea"),teamSuccess=document.getElementById("teamSuccess"),video=document.getElementById("hypeVideo"),placeholder=document.getElementById("hypePlaceholder");
function finishIntro(){if(intro)intro.style.display="none"}
if(intro){window.setTimeout(finishIntro,3050);intro.addEventListener("animationend",finishIntro,{once:true})}
function updateHeader(){if(header)header.classList.toggle("scrolled",window.scrollY>30)}
window.addEventListener("scroll",updateHeader,{passive:true});updateHeader();
const revealItems=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}})},{threshold:.08});revealItems.forEach(el=>observer.observe(el))}else{revealItems.forEach(el=>el.classList.add("visible"))}
function closeMenu(){if(!menuButton||!mobileMenu)return;mobileMenu.classList.remove("active");menuButton.classList.remove("active");menuButton.setAttribute("aria-expanded","false");mobileMenu.setAttribute("aria-hidden","true");document.body.classList.remove("menu-open")}
function toggleMenu(){if(!menuButton||!mobileMenu)return;const open=!mobileMenu.classList.contains("active");mobileMenu.classList.toggle("active",open);menuButton.classList.toggle("active",open);menuButton.setAttribute("aria-expanded",String(open));mobileMenu.setAttribute("aria-hidden",String(!open));document.body.classList.toggle("menu-open",open)}
if(menuButton)menuButton.addEventListener("click",toggleMenu);document.querySelectorAll(".full-menu-links a").forEach(a=>a.addEventListener("click",closeMenu));
function openModal(){if(!modal)return;if(teamForm)teamForm.reset();if(teamFormArea)teamFormArea.style.display="";if(teamSuccess)teamSuccess.classList.remove("active");modal.classList.add("active");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open")}
function closeModal(){if(!modal)return;modal.classList.remove("active");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")}
if(joinButton)joinButton.addEventListener("click",openModal);if(closeModalButton)closeModalButton.addEventListener("click",closeModal);if(modal)modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMenu();closeModal()}});
if(teamForm)teamForm.addEventListener("submit",e=>{e.preventDefault();if(!teamForm.reportValidity())return;if(teamFormArea)teamFormArea.style.display="none";if(teamSuccess)teamSuccess.classList.add("active")});
if(video&&placeholder){const showVideo=()=>{if(video.readyState>=2&&video.videoWidth>0){video.classList.add("is-ready");placeholder.classList.add("hidden")}};const showPlaceholder=()=>{video.classList.remove("is-ready");placeholder.classList.remove("hidden")};["loadeddata","canplay","playing"].forEach(event=>video.addEventListener(event,showVideo));video.addEventListener("error",showPlaceholder);const source=video.querySelector("source");if(source)source.addEventListener("error",showPlaceholder);video.play().catch(()=>{})}

// VIBE ATMOSPHERE: lightweight hero depth, no dependencies, respects reduced motion.
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");
if (hero && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const layers = [
    { el: hero.querySelector(".hero-grid"), strength: 5 },
    { el: hero.querySelector(".hero-glow"), strength: 10 },
    { el: hero.querySelector(".hero-orb.pink"), strength: 14 },
    { el: hero.querySelector(".hero-orb.blue"), strength: -12 }
  ].filter(layer => layer.el);
  let frame = 0, targetX = 0, targetY = 0;
  hero.addEventListener("pointermove", event => {
    const rect = hero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - .5) * 2;
    targetY = ((event.clientY - rect.top) / rect.height - .5) * 2;
    if (!frame) frame = requestAnimationFrame(() => {
      layers.forEach(({el, strength}) => {
        el.style.setProperty("--vibe-parallax-x", `${targetX * strength}px`);
        el.style.setProperty("--vibe-parallax-y", `${targetY * strength}px`);
        el.classList.add("vibe-parallax-ready");
      });
      frame = 0;
    });
  }, { passive: true });
  hero.addEventListener("pointerleave", () => layers.forEach(({el}) => {
    el.style.setProperty("--vibe-parallax-x", "0px");
    el.style.setProperty("--vibe-parallax-y", "0px");
  }), { passive: true });
}

// Give interactive cards and buttons a consistent, accessible press response.
document.querySelectorAll(".frequency-card, .night-stop, .event-card, .archive-card").forEach(el => {
  el.addEventListener("pointerdown", () => el.classList.add("vibe-pressed"), { passive: true });
  ["pointerup", "pointercancel", "pointerleave"].forEach(name => el.addEventListener(name, () => el.classList.remove("vibe-pressed"), { passive: true }));
});

})();
