const FD=[15,25,45,60,90],BD=[5,10,15];
const tmTot=()=>(st.tm.mode=='b'?(st.tm.bdur||5):st.tm.dur)*60,tmRem=()=>st.tm.run?Math.max(0,Math.ceil((st.tm.end-Date.now())/1000)):st.tm.left;
V.focus=()=>{const tm=st.tm,b=tm.mode=='b',k=iso(new Date()),w0=new Date(iso(new Date())+'T00:00');w0.setDate(w0.getDate()-6);const ss=st.sess.filter(x=>x.day==k),wk=st.sess.filter(x=>new Date(x.day+'T00:00')>=w0),sm=a=>a.reduce((x,s)=>x+s.min,0),tk=st.tasks.find(t=>t.id==tm.task),el=tmTot()-tm.left;
return`<div class='fc ${b?'brk':''}'><div class='row' style='gap:0'><button class='b ${b?'g':''}' onclick='A.fmd("f")'>تركيز</button><button class='b ${b?'':'g'}' onclick='A.fmd("b")'>راحة</button></div>
<div class='fring'><svg viewBox='0 0 120 120'><circle cx='60' cy='60' r='54' class='fr0'/><circle cx='60' cy='60' r='54' id='fr' class='fr1' transform='rotate(-90 60 60)'/></svg><div class='ftx'><b id='ft'></b><small>${b?'وقت الراحة':'وقت التركيز'}</small></div></div>
<div class='chips'>${(b?BD:FD).map(m=>`<button class='ch ${(b?tm.bdur||5:tm.dur)==m?'on':''}' data-v='${m}' onclick='A.fdu(this)'>${m} د</button>`).join('')}<input type='number' min='1' max='180' placeholder='مخصص' onchange='A.fdu(this)' style='width:90px'></div>
${b?'':`<button class='fl' onclick='A.pickT()'>${tk?E(tk.n):'اربط الجلسة بمهمة (اختياري)'}</button>`}
<button class='b big' onclick='A.ftp()'>${tm.run?'إيقاف مؤقت':(el>0&&tm.left?'استئناف':'بدء')}</button><div class='row'>${!tm.run&&el>=60&&!b?`<button class='b g' onclick='A.fstop()'>إنهاء وتسجيل (${Math.round(el/60)} د)</button>`:''}${!tm.run&&el>0?`<button class='b g' onclick='A.frs()'>إعادة ضبط</button>`:''}</div>
<div class='m' style='text-align:center'>${tm.run?'يعمل بالوقت الفعلي حتى لو أغلقت الشاشة.':'لن تُسجَّل الجلسة إلا بتأكيدك.'}</div></div>
<div class='st3'><div><b>${sm(ss)}</b>دقيقة اليوم</div><div><b>${sm(wk)}</b>دقيقة الأسبوع</div><div><b>${ss.length}</b>جلسات اليوم</div></div>
<div class='bx'><h3>سجل اليوم</h3>${ss.length?ss.map(x=>`<div class='t' style='cursor:default'><div class='n'>${x.min} د<div class='m'>${E(x.tn||'بلا مهمة')}</div></div><button class='b g' data-id='${x.id}' onclick='A.delS2(this)'>حذف</button></div>`).join(''):`<div class='e'>لا جلسات مؤكدة اليوم</div>`}</div>
<button class='b g' onclick='A.fsnd()'>${st.set.snd?'الصوت مفعّل':'الصوت متوقف'}</button>`};
function fupd(){const r=Q('#fr'),t=Q('#ft');if(!r||!t)return;const l=tmRem(),tot=tmTot(),C=339.3;t.textContent=pad(Math.floor(l/60))+':'+pad(l%60);r.style.strokeDasharray=C;r.style.strokeDashoffset=C*(1-(tot?l/tot:0))}
function fdraw(){const tm=st.tm;if(tm.run&&tmRem()<=0){tm.run=0;tm.left=0;save();fend()}fupd()}
function fsave(mn){const t=st.tasks.find(x=>x.id==st.tm.task);st.sess.push({id:'s'+Date.now()+Math.random().toString(36).slice(2,6),min:mn,day:iso(new Date()),tn:t?t.n:''});if(t)hist(t,'جلسة تركيز '+mn+' د')}
function beep(){try{const a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.15;o.frequency.value=660;o.start();setTimeout(()=>{o.stop();a.close()},350)}catch(e){}}
async function fend(){const tm=st.tm;if(st.set.snd)beep();if(tm.mode=='b'){toast('انتهت الراحة');tm.mode='f';tm.left=tmTot();save();R();return}
R();const ok=await dlg('انتهت جلسة التركيز ('+tm.dur+' د). هل أكملتها فعلًا؟\nانتهاء المؤقت وحده لا يعني إتمام المهمة.',{ok:'سجّل الجلسة'});if(ok){fsave(tm.dur);toast('سُجلت الجلسة')}tm.mode='b';tm.left=tmTot();save();R()}
Object.assign(A,{fmd(m){const tm=st.tm;if(tm.run)return toast('أوقف المؤقت أولًا','e');tm.mode=m;tm.left=tmTot();save();R()},
fdu(el){const v=Math.round(+(el.dataset.v||el.value)),tm=st.tm;if(!(v>=1&&v<=180)){toast('المدة بين 1 و180 دقيقة','e');return R()}if(tm.run)return toast('أوقف المؤقت أولًا','e');if(tm.mode=='b')tm.bdur=v;else tm.dur=v;tm.left=v*60;save();R()},
ftp(){const tm=st.tm;if(tm.run){tm.left=tmRem();tm.run=0}else{if(!tm.left)tm.left=tmTot();tm.run=1;tm.end=Date.now()+tm.left*1000}save();R()},
frs(){const tm=st.tm;tm.run=0;tm.left=tmTot();save();R()},
async fstop(){const tm=st.tm,mn=Math.round((tmTot()-tm.left)/60);if(!await dlg('تسجيل جلسة تركيز فعلية مدتها '+mn+' دقيقة؟',{ok:'سجّل'}))return;fsave(mn);tm.left=tmTot();save();R();toast('سُجلت الجلسة')},
async delS2(el){if(!await dlg('حذف هذه الجلسة؟',{danger:1,ok:'حذف'}))return;st.sess=st.sess.filter(x=>x.id!=el.dataset.id);save();R()},
fsnd(){st.set.snd=st.set.snd?0:1;save();R();if(st.set.snd)beep()}});
setInterval(fdraw,500);if(document.addEventListener)document.addEventListener('visibilitychange',fdraw);
