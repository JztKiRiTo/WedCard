const $=s=>document.querySelector(s), hero=$('#hero'), intro=$('#intro');
let muted=false, ac;
function chime(){ if(muted) return; try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)();
  [523,659,784,1047].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;
  g.gain.setValueAtTime(0,ac.currentTime+i*.18);g.gain.linearRampToValueAtTime(.08,ac.currentTime+i*.18+.05);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+i*.18+1.4);
  o.connect(g).connect(ac.destination);o.start(ac.currentTime+i*.18);o.stop(ac.currentTime+i*.18+1.5)}) }catch(e){} }

/* opening: doors slide -> curtains part -> valance falls -> content reveals */
let opened=false;
function openCard(){ if(opened) return; opened=true; chime();
  intro.classList.add('open');
  setTimeout(()=>{ hero.classList.add('open'); intro.classList.add('gone'); },1300);
  setTimeout(()=>hero.classList.add('drop'),2700);
  setTimeout(()=>{ hero.classList.add('show'); document.body.classList.remove('locked'); document.body.classList.add('live'); },3500);
}
$('#tap').addEventListener('click',openCard);
$('#tap').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCard()}});

/* scroll reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* scratch to reveal */
const cv=$('#sc'), cx=cv.getContext('2d'); let done=false;
function paint(){ const r=cv.getBoundingClientRect(); cv.width=r.width; cv.height=r.height;
  const g=cx.createLinearGradient(0,0,r.width,r.height); g.addColorStop(0,'#8d8a6c'); g.addColorStop(.5,'#c9c3a2'); g.addColorStop(1,'#7c7a5d');
  cx.fillStyle=g; cx.fillRect(0,0,r.width,r.height);
  for(let i=0;i<900;i++){cx.fillStyle=Math.random()>.5?'#fff8d8aa':'#4a4a3a88';cx.fillRect(Math.random()*r.width,Math.random()*r.height,1.6,1.6)}
}
paint();
let down=false;
function scratch(e){ if(!down||done) return; const r=cv.getBoundingClientRect(); cx.globalCompositeOperation='destination-out';
  cx.beginPath(); cx.arc(e.clientX-r.left,e.clientY-r.top,17,0,7); cx.fill(); check(); }
function check(){ if(Math.random()>.12) return; const d=cx.getImageData(0,0,cv.width,cv.height).data; let c=0;
  for(let i=3;i<d.length;i+=64) if(d[i]===0) c++; if(c/(d.length/64)>.42) win(); }
function win(){ done=true; cv.style.opacity=0; setTimeout(()=>cv.style.display='none',1000);
  const box=$('#heartbox').parentElement, cols=['#d9a21b','#d99a98','#6b7a4a','#fff6e6','#c07474'];
  for(let i=0;i<46;i++){const p=document.createElement('span');p.className='conf';p.style.cssText=`left:50%;top:230px;background:${cols[i%5]};--x:${(Math.random()-.5)*340}px;--y:${-60+Math.random()*260}px;animation-delay:${Math.random()*.25}s`;box.appendChild(p);setTimeout(()=>p.remove(),3000)}}
cv.addEventListener('pointerdown',e=>{down=true;cv.setPointerCapture(e.pointerId);scratch(e)});
cv.addEventListener('pointermove',scratch); addEventListener('pointerup',()=>down=false);

/* save the date (.ics) */
$('#std').onclick=()=>{ const ics=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT','SUMMARY:Zayn & Nora’s Wedding','DTSTART:20261130T103000','DTEND:20261130T170000','LOCATION:Grand Palace Hall\\, City centre\\, London','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); a.download='zayn-nora-wedding.ics'; a.click(); toast('Added to your calendar'); };

/* countdown */
const T=new Date('2026-11-30T10:30:00');
function tick(){ let s=Math.max(0,Math.floor((T-Date.now())/1000)); const p=n=>String(n).padStart(2,'0');
  $('#d').textContent=p(Math.floor(s/86400)); $('#hh').textContent=p(Math.floor(s%86400/3600)); $('#m').textContent=p(Math.floor(s%3600/60)); $('#s').textContent=p(s%60); }
tick(); setInterval(tick,1000);

/* controls */
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2200)}
$('#mute').onclick=e=>{muted=!muted;e.currentTarget.textContent=muted?'🔇':'🔊'};
let ar=false; document.querySelectorAll('[data-ar]').forEach(e=>e.dataset.en=e.textContent);
$('#lang').onclick=e=>{ar=!ar;document.documentElement.dir=ar?'rtl':'ltr';e.currentTarget.textContent=ar?'🌐 English':'🌐 Arabic';
  document.querySelectorAll('[data-ar]').forEach(h=>h.textContent=ar?h.dataset.ar:h.dataset.en)};
$('#rsvp').onsubmit=e=>{e.preventDefault();toast('Thank you, your reply has been sent');e.target.reset()};
