(function(){if(st.tasks.length||st.set.ob)return;
M(`<h2>أهلًا بك في رِواق</h2><div class='m'>منظّم دراستك وعباداتك وحياتك اليومية. بياناتك تبقى على جهازك فقط، ولا حساب مطلوب الآن.</div><label>اختر لونك (تغيّره لاحقًا من الإعدادات)</label><div class='sws'>${swA()}</div><button class='b' onclick='A.ob(0)'>ابدأ فارغًا</button><button class='b g' onclick='A.ob(1)'>حمّل خطة تجريبية (٤ أسابيع)</button><button class='b g' onclick='A.ob(2)'>عندي نسخة احتياطية</button>`)})();
A.ob=function(k){st.set.ob=1;if(k==1)A.seedAgain();else save();XM();if(k==2)tab='data';R()};
