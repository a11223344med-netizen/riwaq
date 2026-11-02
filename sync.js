const SB={url:'https://raqyhwhtcipwedqgtptv.supabase.co',key:'sb_publishable_6IH90kHvJmV133VXzNW2YA_HDYrLIOX'};
const AK='riwaq27_auth',DEV=(()=>{try{let d=localStorage.getItem('riwaq27_dev');if(!d){d='d'+Math.random().toString(36).slice(2,10);localStorage.setItem('riwaq27_dev',d)}return d}catch(e){return'd0'}})();
let au=null,sy={busy:0,msg:'',prov:null,otp:null},syT=null;try{au=JSON.parse(localStorage.getItem(AK)||'null')}catch(e){}
const saveAu=()=>{try{au?localStorage.setItem(AK,JSON.stringify(au)):localStorage.removeItem(AK)}catch(e){}},cl=()=>(st.cloud=st.cloud||{rev:0,dirty:false,last:0,uid:'',ts:0,syncing:0}),R2=()=>{if(tab=='acct')R()};
const canon=o=>o===null||typeof o!='object'?JSON.stringify(o):Array.isArray(o)?'['+o.map(canon).join(',')+']':'{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canon(o[k])).join(',')+'}';
const strip=()=>{const o=JSON.parse(JSON.stringify(st));delete o.cloud;delete o.tm;return o};
const AE={invalid_credentials:'البريد أو كلمة المرور غير صحيحة',user_already_exists:'هذا البريد مسجّل من قبل. سجّل الدخول.',weak_password:'كلمة المرور ضعيفة. استخدم 6 أحرف فأكثر.',email_not_confirmed:'أكّد بريدك من الرسالة المرسلة أولًا.',over_email_send_rate_limit:'محاولات كثيرة. انتظر قليلًا.',otp_expired:'انتهى الرمز أو غير صحيح.',phone_provider_disabled:'الدخول بالهاتف غير مفعّل بعد.',provider_disabled:'هذه الطريقة غير مفعّلة بعد.',signup_disabled:'إنشاء الحسابات متوقف.'};
const aer=j=>AE[j&&j.error_code]||'تعذّر تنفيذ الطلب. تحقق من البيانات والاتصال.';
async function sb(path,o){o=o||{};const h={apikey:SB.key,'Content-Type':'application/json'};if(o.tok)h.Authorization='Bearer '+o.tok;if(o.prefer)h.Prefer=o.prefer;const r=await fetch(SB.url+path,{method:o.m||'GET',headers:h,body:o.b?JSON.stringify(o.b):undefined});let j=null;try{j=await r.json()}catch(e){}return{ok:r.ok,s:r.status,j}}
const sess=j=>{const s=j.access_token?j:j.session;if(!s||!s.access_token)return false;const u=s.user||j.user||{};au={access:s.access_token,refresh:s.refresh_token,exp:Date.now()+(s.expires_in||3600)*1000,uid:u.id,email:u.email||u.phone||''};saveAu();return true};
async function tok(){if(!au)return null;if(Date.now()>au.exp-60000){const r=await sb('/auth/v1/token?grant_type=refresh_token',{m:'POST',b:{refresh_token:au.refresh}});if(!r.ok||!sess(r.j)){if(r.s==400||r.s==401){au=null;saveAu()}return null}}return au.access}
function onSave(){const c=cl();if(!c.syncing){c.dirty=true;c.ts=Date.now()}clearTimeout(syT);if(au&&st.set.cloudAuto!==0)syT=setTimeout(()=>sync(0),4000)}
const isEmpty=()=>!st.tasks.length&&!st.sess.length&&!st.q.rd.length&&!st.rev.length&&!Object.values(st.lf||{}).some(a=>a.length);
async function push(t,row,why){const c=cl(),data=strip(),ts0=c.ts;
if(!row){try{if(!localStorage.getItem('riwaq27_precloud'))localStorage.setItem('riwaq27_precloud',JSON.stringify(st))}catch(e){}}
else{const b=await sb('/rest/v1/state_backups',{m:'POST',tok:t,b:{user_id:au.uid,data:row.data,revision:row.revision,reason:why}});if(!b.ok)throw b}
const r=row?await sb(`/rest/v1/user_state?user_id=eq.${au.uid}&revision=eq.${row.revision}`,{m:'PATCH',tok:t,prefer:'return=representation',b:{data,revision:row.revision+1,device_id:DEV,updated_at:new Date().toISOString()}}):await sb('/rest/v1/user_state',{m:'POST',tok:t,prefer:'return=representation',b:{user_id:au.uid,data,revision:1,device_id:DEV}});
if(!r.ok&&r.s!=409)throw r;const nr=r.ok&&Array.isArray(r.j)?r.j[0]:null;if(!nr){sy.msg='تغيّرت نسخة السحابة أثناء الرفع. اضغط «زامن الآن» مرة أخرى.';return false}
const v=await sb('/rest/v1/user_state?select=*',{tok:t});if(!v.ok||!v.j[0]||canon(v.j[0].data)!==canon(data))throw{s:'verify'};
c.rev=v.j[0].revision;c.uid=au.uid;c.last=Date.now();if(c.ts===ts0)c.dirty=false;c.syncing=1;save();c.syncing=0;sy.msg='تمت المزامنة وتم التحقق من النسخة السحابية';return true}
function pull(row){if(!valid(row.data)){sy.msg='نسخة السحابة غير صالحة ولم تُطبَّق. بياناتك المحلية سليمة.';return false}
try{localStorage.setItem('riwaq27_backup',JSON.stringify(st));if(!localStorage.getItem('riwaq27_precloud'))localStorage.setItem('riwaq27_precloud',JSON.stringify(st))}catch(e){}
const k={cloud:st.cloud,tm:st.tm};st=Object.assign(def(),row.data);st.cloud=k.cloud;st.tm=k.tm;const c=cl();c.rev=row.revision;c.uid=au.uid;c.dirty=false;c.last=Date.now();c.syncing=1;save();c.syncing=0;R();sy.msg='نُزّلت نسخة السحابة. حُفظت نسخة من بيانات هذا الجهاز قبل ذلك.';return true}
async function conflict(row,t){const n=a=>(a&&a.tasks?a.tasks.length:0);
if(await dlg('بيانات هذا الجهاز ('+st.tasks.length+' مهمة) تختلف عن نسخة السحابة ('+n(row.data)+' مهمة، آخر تحديث '+new Date(row.updated_at).toLocaleString('ar')+').\nهل تستخدم نسخة السحابة؟ ستُحفظ نسخة من بيانات هذا الجهاز أولًا.',{ok:'استخدم السحابة'}))return pull(row);
if(await dlg('هل ترفع بيانات هذا الجهاز بدل نسخة السحابة؟\nستُحفظ نسخة السحابة الحالية في سجل النسخ.',{danger:1,ok:'ارفع بيانات هذا الجهاز'}))return push(t,row,'before_overwrite');sy.msg='لم يتغيّر شيء. اخترت إلغاء المزامنة.';return false}
async function sync(manual){if(sy.busy||!au)return;sy.busy=1;sy.msg='';R2();
try{const t=await tok();if(!t){sy.msg='انتهت الجلسة. سجّل الدخول من جديد.';return}
const g=await sb('/rest/v1/user_state?select=*',{tok:t});if(!g.ok)throw g;const row=g.j[0],c=cl();
if(!row)await push(t,null,'first');
else if(c.uid==au.uid&&c.rev==row.revision){if(c.dirty)await push(t,row,'update');else sy.msg='كل شيء محدّث'}
else if(c.uid==au.uid&&c.rev<row.revision&&!c.dirty)pull(row);
else if(c.uid!=au.uid&&isEmpty())pull(row);
else await conflict(row,t)}
catch(e){sy.msg=e&&e.s=='verify'?'فشل التحقق بعد الرفع. بياناتك المحلية سليمة، وحاول مرة أخرى.':e&&e.s?'خطأ من الخادم ('+e.s+'). بياناتك المحلية سليمة.':'لا اتصال. التغييرات محفوظة هنا وستُرفع عند عودة الإنترنت.'}
finally{sy.busy=0;R2()}}
async function loadProv(){if(sy.prov||sy.pb)return;sy.pb=1;try{const r=await sb('/auth/v1/settings');sy.prov=r.ok&&r.j&&r.j.external?r.j.external:{}}catch(e){sy.prov=null}sy.pb=0;R2()}
const fv=id=>(Q('#'+id).value||'').trim();
V.acct=()=>{loadProv();const c=cl(),p=sy.prov||{},st0=au?(c.dirty?'تغييرات لم تُرفع بعد':'محدّث'):'';
return au?`<div class='bx lv'><h3>حسابك</h3><div class='cl'><span>الدخول</span><b dir='ltr'>${E(au.email)}</b></div><div class='cl'><span>الحالة</span><b>${st0}</b></div><div class='cl'><span>آخر مزامنة</span><b>${c.last?new Date(c.last).toLocaleString('ar'):'—'}</b></div>${sy.msg?`<div class='w'>${E(sy.msg)}</div>`:''}<button class='b big' onclick='A.sbSync()' ${sy.busy?'disabled':''}>${sy.busy?'جارٍ المزامنة…':'زامن الآن'}</button><button class='b g' onclick='A.sbAuto()'>${st.set.cloudAuto===0?'المزامنة التلقائية متوقفة':'المزامنة التلقائية مفعّلة'}</button><button class='b g' onclick='A.sbOut()'>تسجيل الخروج</button></div><div class='w'>بياناتك على هذا الجهاز لا تُحذف أبدًا عند الخروج. كل رفع يحفظ نسخة قديمة في السحابة (آخر 20 نسخة)، ونسخة من بيانات الجهاز قبل ربط الحساب محفوظة محليًا.</div>`
:`<div class='bx lv'><h3>الحساب اختياري</h3><div class='m'>رِواق يعمل بدون حساب. الحساب يحفظ بياناتك في السحابة ويزامنها بين أجهزتك.</div><label>البريد الإلكتروني</label><input id='sx_e' type='email' dir='ltr'><label>كلمة المرور</label><input id='sx_p' type='password' dir='ltr'>${sy.msg?`<div class='w'>${E(sy.msg)}</div>`:''}<button class='b big' onclick='A.sbEmail("in")'>تسجيل الدخول</button><div class='row'><button class='b g' onclick='A.sbEmail("up")'>إنشاء حساب</button><button class='b g' onclick='A.sbEmail("rec")'>نسيت كلمة المرور</button></div>${p.google?`<button class='b g big' onclick='A.sbGoogle()'>الدخول بحساب Google</button>`:''}${p.phone?`<label>رقم الهاتف (مع رمز الدولة)</label><input id='sx_ph' type='tel' dir='ltr' placeholder='+20…'>${sy.otp?`<input id='sx_c' placeholder='رمز التحقق' dir='ltr'><button class='b' onclick='A.sbVerify()'>تأكيد الرمز</button>`:`<button class='b g' onclick='A.sbPhone()'>أرسل رمز SMS</button>`}`:''}${sy.prov===null?`<div class='m'>تعذّر قراءة الطرق المفعّلة. تحقق من الإنترنت.</div>`:''}</div>`};
Object.assign(A,{async sbEmail(m){const e=fv('sx_e'),p=Q('#sx_p').value||'';if(!/^\S+@\S+\.\S+$/.test(e))return toast('اكتب بريدًا صحيحًا','e');
try{if(m=='rec'){const r=await sb('/auth/v1/recover',{m:'POST',b:{email:e}});sy.msg=r.ok?'أُرسل رابط استعادة كلمة المرور إلى بريدك.':aer(r.j);return R2()}
if(p.length<6)return toast('كلمة المرور 6 أحرف على الأقل','e');
const r=m=='up'?await sb('/auth/v1/signup',{m:'POST',b:{email:e,password:p}}):await sb('/auth/v1/token?grant_type=password',{m:'POST',b:{email:e,password:p}});
if(r.ok&&sess(r.j)){sy.msg='';toast('تم تسجيل الدخول');R();sync(1)}else if(r.ok&&m=='up'){sy.msg='تم إنشاء الحساب. افتح بريدك واضغط رابط التأكيد ثم سجّل الدخول.';R2()}else{sy.msg=aer(r.j);R2()}}
catch(x){sy.msg='لا اتصال بالإنترنت.';R2()}},
sbGoogle(){location.href=SB.url+'/auth/v1/authorize?provider=google&redirect_to='+encodeURIComponent(location.origin+location.pathname)},
async sbPhone(){const ph=fv('sx_ph');if(!/^\+\d{8,15}$/.test(ph))return toast('اكتب الرقم مع رمز الدولة مثل +20…','e');try{const r=await sb('/auth/v1/otp',{m:'POST',b:{phone:ph}});if(r.ok){sy.otp=ph;sy.msg='أُرسل الرمز.'}else sy.msg=aer(r.j)}catch(x){sy.msg='لا اتصال بالإنترنت.'}R2()},
async sbVerify(){try{const r=await sb('/auth/v1/verify',{m:'POST',b:{type:'sms',phone:sy.otp,token:fv('sx_c')}});if(r.ok&&sess(r.j)){sy.otp=null;sy.msg='';R();sync(1)}else{sy.msg=aer(r.j);R2()}}catch(x){sy.msg='لا اتصال بالإنترنت.';R2()}},
sbSync(){sync(1)},sbAuto(){st.set.cloudAuto=st.set.cloudAuto===0?1:0;save();R2()},
async sbOut(){if(!await dlg('تسجيل الخروج؟\nبياناتك على هذا الجهاز تبقى كما هي.',{ok:'خروج'}))return;try{if(au)await sb('/auth/v1/logout',{m:'POST',tok:au.access})}catch(x){}au=null;saveAu();sy.msg='';R()}});
OTH.unshift('acct');NM.acct='الحساب والمزامنة';
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('online',()=>{if(au&&cl().dirty)sync(0)});
(function(){if(typeof location==='undefined'||!location.hash||!location.hash.includes('access_token='))return;const p=new URLSearchParams(location.hash.slice(1));au={access:p.get('access_token'),refresh:p.get('refresh_token'),exp:Date.now()+(+p.get('expires_in')||3600)*1000};saveAu();history.replaceState(null,'',location.pathname+location.search);sb('/auth/v1/user',{tok:au.access}).then(r=>{if(r.ok){au.uid=r.j.id;au.email=r.j.email||r.j.phone||'';saveAu();tab='acct';R();sync(1)}})})();
if(au)setTimeout(()=>sync(0),2000);
R();
