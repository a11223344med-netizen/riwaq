let nowD=()=>new Date();const NS={msg:''},tmm=s=>{const p=String(s).split(':');return +p[0]*60+ +p[1]};
const nt=()=>(st.set.nt=Object.assign({on:0,prayer:1,pmin:10,study:1,stime:'17:00',habit:1,htime:'21:00',azk:1,mtime:'06:00',etime:'17:30',wird:1,wtime:'20:00',dnd:0,from:'23:00',to:'05:00'},st.set.nt));
const inDnd=now=>{const n=nt();if(!n.dnd)return false;const m=now.getHours()*60+now.getMinutes(),f=tmm(n.from),t=tmm(n.to);return f>t?(m>=f||m<t):(m>=f&&m<t)};
function ntDue(now){const n=nt(),m=now.getHours()*60+now.getMinutes(),k=iso(now),L=[],win=(d,key,t,b)=>{if(m>=d&&m<d+15)L.push({key:k+'|'+key,t,b})};
if(n.prayer)PR.forEach(([i,nm])=>{if(st.pt[i]){const d=Math.max(0,tmm(st.pt[i])-n.pmin);win(d,'p-'+i,nm,n.pmin?'بعد '+n.pmin+' دقيقة ('+st.pt[i]+')':'حان وقت الصلاة ('+st.pt[i]+')')}});
if(n.study){const o=off(),op=st.tasks.filter(t=>t.st=='open'&&t.d!=null&&t.d<=o);if(op.length)win(tmm(n.stime),'study','مذاكرة اليوم','عندك '+op.length+' مهمة ('+fm(op.reduce((a,t)=>a+t.est,0))+'). المتاح '+fm(net()))}
if(n.habit){const hs=((st.lf&&st.lf.habits)||[]).filter(h=>!h.log.includes(k));if(hs.length)win(tmm(n.htime),'habit','عاداتك اليوم','باقي '+hs.length+' عادة لم تسجّلها')}
if(n.azk){win(tmm(n.mtime),'azk-m','أذكار الصباح','وقت أذكار الصباح');win(tmm(n.etime),'azk-e','أذكار المساء','وقت أذكار المساء')}
if(n.wird){const got=st.q.rd.filter(x=>x.day==k).length;if(got<st.q.wird)win(tmm(n.wtime),'wird','ورد القراءة','باقي '+(st.q.wird-got)+' صفحات من وردك')}
return L}
function ntShow(t,b,tag){try{const o={body:b,icon:'icon-192.png',badge:'icon-192.png',tag,dir:'rtl',lang:'ar'};if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(r=>r.showNotification(t,o)).catch(()=>{try{new Notification(t,o)}catch(e){}});else new Notification(t,o)}catch(e){}}
function ntTick(){try{if(typeof Notification==='undefined'||Notification.permission!=='granted'||!nt().on)return;const now=nowD();if(inDnd(now))return;const sent=st.nsent=st.nsent||{};let ch=0;ntDue(now).forEach(x=>{if(!sent[x.key]){sent[x.key]=1;ch=1;ntShow(x.t,x.b,x.key)}});const k=iso(now),y=iso(new Date(now-864e5));for(const key in sent)if(!key.startsWith(k)&&!key.startsWith(y)){delete sent[key];ch=1}if(ch)save()}catch(e){}}
V.notif=()=>{const n=nt(),sup=typeof Notification!=='undefined',perm=sup?Notification.permission:'unsupported',on=n.on&&perm==='granted';
const tg=(k,t)=>`<button class='ch ${n[k]?'on':''}' data-k='${k}' onclick='A.ntTog(this)'>${t}</button>`,tI=(k,l)=>`<label>${l}</label><input type='time' value='${n[k]}' data-k='${k}' onchange='A.ntSet(this)'>`;
return`<div class='bx lv'><h3>التذكيرات</h3><div class='m'>الحالة: ${on?'مفعّلة':perm==='denied'?'محظورة من المتصفح':!sup?'غير مدعومة في هذا المتصفح':'متوقفة'}</div>${NS.msg?`<div class='w'>${E(NS.msg)}</div>`:''}<button class='b big' onclick='A.ntOn()'>${on?'إعادة فحص الإذن':'تفعيل الإشعارات'}</button><button class='b g' onclick='A.ntTest()'>أرسل إشعار تجربة</button><button class='b g' onclick='A.ntOff()'>إيقاف الكل</button></div>
<div class='bx'><h3>الصلاة</h3><div class='chips'>${tg('prayer','تذكير الصلاة')}</div><label>قبل الأذان بـ (دقيقة)</label><input type='number' min='0' max='60' value='${n.pmin}' data-k='pmin' onchange='A.ntSet(this)'><div class='m'>يستخدم المواقيت المسجلة عندك في «الصلاة والذكر».</div></div>
<div class='bx'><h3>الدراسة والعادات والعبادات</h3><div class='chips'>${tg('study','المذاكرة')}${tg('habit','العادات')}${tg('azk','الأذكار')}${tg('wird','ورد القراءة')}</div>${tI('stime','وقت تذكير المذاكرة')}${tI('htime','وقت تذكير العادات')}${tI('mtime','أذكار الصباح')}${tI('etime','أذكار المساء')}${tI('wtime','ورد القراءة')}</div>
<div class='bx'><h3>عدم الإزعاج</h3><div class='chips'>${tg('dnd','تفعيل')}</div>${tI('from','من')}${tI('to','إلى')}</div>
<div class='w'>مهم: الإشعارات المحلية تصلك والتطبيق مفتوح أو شغّال في الخلفية القريبة فقط. وصولها والتطبيق مغلق تمامًا يحتاج Push من سيرفر، ولم أنفّذه بعد.</div>`};
Object.assign(A,{async ntOn(){if(typeof Notification==='undefined'){NS.msg='هذا المتصفح لا يدعم الإشعارات. على الآيفون أضف التطبيق إلى الشاشة الرئيسية أولًا (iOS 16.4 فأعلى).';return R()}
let p=Notification.permission;if(p==='default')try{p=await Notification.requestPermission()}catch(e){}
if(p==='granted'){nt().on=1;NS.msg='تم التفعيل. ستصلك التذكيرات والتطبيق مفتوح أو شغّال في الخلفية القريبة.'}else{nt().on=0;NS.msg=p==='denied'?'الإشعارات محظورة. فعّلها من إعدادات المتصفح للموقع ثم أعد المحاولة.':'لم تمنح الإذن.'}save();R();ntTick()},
ntTog(el){const n=nt(),k=el.dataset.k;n[k]=n[k]?0:1;save();R()},
ntSet(el){const n=nt(),k=el.dataset.k,v=el.value;if(k=='pmin'){const x=Math.round(+v);if(!(x>=0&&x<=60)){toast('من 0 إلى 60 دقيقة','e');return R()}n.pmin=x}else{if(!/^\d\d:\d\d$/.test(v)||tmm(v)>1439){toast('وقت غير صالح','e');return R()}n[k]=v}save();R()},
ntOff(){nt().on=0;save();NS.msg='أُوقفت كل الإشعارات.';R()},
ntTest(){if(typeof Notification==='undefined'||Notification.permission!=='granted'){NS.msg='فعّل الإشعارات أولًا وامنح الإذن.';return R()}ntShow('رِواق','هذا إشعار تجربة. لو وصلك فالتذكيرات تعمل.','test');toast('أُرسل إشعار التجربة')}});
setInterval(ntTick,20000);if(document.addEventListener)document.addEventListener('visibilitychange',ntTick);ntTick();
