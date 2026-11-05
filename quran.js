let mp=0,mt=0;const MC={};
OTH.push('mus');NM.mus='المصحف والتفسير';
const _qq=V.quran;V.quran=()=>`<button class='b' onclick='A.mus()'>افتح المصحف والتفسير</button>`+_qq();
V.mus=()=>{setTimeout(mload,0);if(!mp)mp=st.q.rd.length?st.q.rd[st.q.rd.length-1].p:1;
return`<div class='bx lv'><div class='row'><button class='b g' onclick='A.mpg(-1)'>→ السابقة</button><input type='number' min='1' max='604' value='${mp}' onchange='A.mpg(0,this.value)'><button class='b g' onclick='A.mpg(1)'>التالية ←</button></div><div class='row'><button class='b ${mt?'g':''}' onclick='A.mtf(0)'>نص المصحف</button><button class='b ${mt?'':'g'}' onclick='A.mtf(1)'>التفسير الميسر</button></div></div><div class='bx'><div id='mq' class='mq'></div></div><button class='b' onclick='A.mread()'>سجّلت قراءة هذه الصفحة</button><div class='m'>المصدر: واجهة alquran.cloud (المصحف العثماني وتفسير الميسر). تحتاج إنترنت أول مرة لكل صفحة، وبعدها تُحفظ للقراءة بدون نت.</div>`};

Object.assign(A,{mus(){tab='mus';R();scrollTo(0,0)},mpg(d,v){mp=v?Math.min(604,Math.max(1,Math.round(+v)||1)):Math.min(604,Math.max(1,mp+d));R()},mtf(x){mt=x;R()},
mread(){st.q.rd.push({id:'q'+Date.now()+Math.random().toString(36).slice(2,6),p:mp,day:iso(new Date()),b:0,n:''});save();toast('سُجلت الصفحة '+mp)}});
R();
