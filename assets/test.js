// assets/test.js (v3) — 50 سؤال + تصحيح فوري + شرح + محاولة كل 24 ساعة
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const CFG = window.AYED.CONFIG;
  const LS = { user:'ayed_step_user_v3', result:'ayed_step_result_v3', cooldown:'ayed_step_cooldown_v3', progress:'ayed_step_progress_v3', history:'ayed_step_history_v3' };
  const dist = { Grammar:18, Vocabulary:14, Reading:14, Listening:4 };

  function loadJSON(path){ return fetch(path,{cache:'no-store'}).then(r=>r.json()); }
  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  function cooldownRemaining(){ const t=Number(localStorage.getItem(LS.cooldown)||0); return Math.max(0,(t+CFG.test.cooldownHours*3600*1000)-Date.now()); }
  function setCooldownNow(){ localStorage.setItem(LS.cooldown,String(Date.now())); }
  function saveProgress(p){ localStorage.setItem(LS.progress,JSON.stringify(p)); }
  function loadProgress(){ try{return JSON.parse(localStorage.getItem(LS.progress)||'null');}catch(e){return null;} }
  function clearProgress(){ localStorage.removeItem(LS.progress); }
  function setUser(u){ localStorage.setItem(LS.user,JSON.stringify(u)); }
  function getUser(){ try{return JSON.parse(localStorage.getItem(LS.user)||'null');}catch(e){return null;} }
  function setResult(r){
    localStorage.setItem(LS.result,JSON.stringify(r));
    const hist=(()=>{try{return JSON.parse(localStorage.getItem(LS.history)||'[]');}catch(e){return [];} })();
    hist.unshift({at:r.at,scorePct:r.scorePct,level:r.level.label,focus:r.focus,planDays:r.planDays});
    localStorage.setItem(LS.history,JSON.stringify(hist.slice(0,30)));
  }
  function levelFor(p){ if(p>=85) return {code:'ADV',label:'متقدم'}; if(p>=65) return {code:'INT',label:'متوسط'}; return {code:'BEG',label:'مبتدئ'}; }
  function sectionArabic(s){ return ({Grammar:'القواعد',Vocabulary:'المفردات',Reading:'القراءة',Listening:'الاستماع'}[s]||s); }

  function ensureConditionalFields(){
    const tested=$('#testedBefore'), prevWrap=$('#prevScoreWrap'), targetWrap=$('#targetScoreWrap');
    tested.addEventListener('change',()=>{ const yes=tested.value==='yes'; prevWrap.classList.toggle('hidden',!yes); targetWrap.classList.toggle('hidden',!yes); if(!yes){$('#prevScore').value='';$('#targetScore').value='';}});
    tested.dispatchEvent(new Event('change'));
    const edu=$('#eduStage'), uniWrap=$('#uniWrap'); edu.addEventListener('change',()=>uniWrap.classList.toggle('hidden',edu.value!=='university')); edu.dispatchEvent(new Event('change'));
    const weak=$('#weakGuess'), note=$('#weakNote'); weak.addEventListener('change',()=>note.classList.toggle('hidden',weak.value!=='auto')); weak.dispatchEvent(new Event('change'));
  }

  function pick(bank, per){
    const by = (sec)=> shuffle(bank.filter(q=>q.section===sec)).slice(0, dist[sec]);
    const set=[...by('Grammar'),...by('Vocabulary'),...by('Reading'),...by('Listening')];
    shuffle(set); return set.slice(0, per);
  }
  function getPlanDays(w){ if(w==='24h') return 1; if(w==='3d') return 3; if(w==='7d') return 7; if(w==='30d') return 30; if(w==='not_booked') return 60; return 30; }
  function breakdown(picked, ans){
    const b={}; picked.forEach((q,i)=>{ b[q.section]=b[q.section]||{total:0,correct:0}; b[q.section].total++; if(ans[i]===q.correctIndex) b[q.section].correct++; }); return b;
  }
  function focusFrom(b){
    const arr=Object.entries(b).map(([k,v])=>[k,Math.round((v.correct/Math.max(1,v.total))*100)]); arr.sort((a,b)=>a[1]-b[1]);
    return arr.slice(0,2).map(x=>sectionArabic(x[0])).join(' + ');
  }
  function planText(user, focus, days){
    const name=user.fullName||'يا بطل', mins=user.studyMinutes||'30-60', best=user.bestTime||'حسب وقتك';
    const L=[]; L.push(`يا ${name} 🌟`); L.push(`هذه خطة ${days} يوم — تركيزنا الأساسي: ${focus}`); L.push(`وقت مذاكرتك: ${mins} • الوقت المفضّل: ${best}`); L.push('');
    if(days<=1){ L.push('**خطة إنقاذ (24 ساعة)**'); L.push('- 60د: قواعد + أخطاء شائعة.'); L.push('- 90د: قراءة (قطعتين) بتوقيت.'); L.push('- 45د: استماع + تلخيص.'); L.push('- 30د: مفردات ربط (however/although).'); }
    else if(days<=3){ L.push('**خطة 3 أيام**'); L.push('اليوم 1: قواعد + 30 سؤال.'); L.push('اليوم 2: قراءة + مفردات.'); L.push('اليوم 3: استماع + مراجعة أخطاء.'); }
    else if(days<=7){ L.push('**خطة 7 أيام**'); L.push('1–2: قواعد + تثبيت.'); L.push('3–4: قراءة بتوقيت.'); L.push('5: استماع.'); L.push('6: كويزات + أخطاء.'); L.push('7: مراجعة + نوم بدري.'); }
    else if(days<=30){ L.push('**خطة 30 يوم**'); L.push('الأسبوع 1: تأسيس وتنظيم.'); L.push('الأسبوع 2: قواعد.'); L.push('الأسبوع 3: قراءة + مفردات.'); L.push('الأسبوع 4: استماع + نماذج.'); }
    else { L.push('**خطة 60 يوم**'); L.push('الشهر 1: تأسيس ببطء + تمارين قصيرة يوميًا.'); L.push('الشهر 2: نماذج + مراجعة أخطاء + تكرار.'); L.push('نصيحة: احجز بعد ما تثبت أسبوعين على الخطة.'); }
    return L.join('\n');
  }
  function buildTable(days, user){
    const mins=user.studyMinutes||'30-60', best=user.bestTime||'أي وقت';
    const rows=[]; for(let d=1; d<=days; d++){
      let task='مراجعة عامة + كويز (10 أسئلة)';
      if(d%4===1) task='قواعد: If + أزمنة + 20 سؤال';
      if(d%4===2) task='قراءة: قطعة + أسئلة (بتوقيت)';
      if(d%4===3) task='مفردات: 25 كلمة + ربط';
      if(d%7===0) task='مراجعة أسبوعية + تلخيص أخطاء';
      rows.push({day:d,time:`${mins} (${best})`,task});
    }
    return rows;
  }

  async function run(){
    const locked=document.getElementById('lockedState');
    const remain=cooldownRemaining();
    if(remain>0){ locked.style.display='block'; locked.querySelector('#cooldownTime').textContent=window.AYED_UTILS.fmtTime(remain); }

    ensureConditionalFields();
    const bank=await loadJSON('assets/questions.json');
    bank.forEach(q=>{ if(!['Grammar','Vocabulary','Reading','Listening'].includes(q.section)) q.section='Grammar'; });

    const startCard=$('#startCard'), testCard=$('#testCard'), resumeBtn=$('#resumeTest'), form=$('#infoForm');
    const qIndex=$('#qIndex'), qTotal=$('#qTotal'), qSection=$('#qSection'), qPrompt=$('#qPrompt');
    const bar=$('#bar'), options=$('#options'), explain=$('#explain'), feedback=$('#feedback');
    const prevBtn=$('#prevQ'), nextBtn=$('#nextQ'), finishBtn=$('#finishTest');
    const toggleExplain=$('#toggleExplain'), toggleFeedback=$('#toggleFeedback');
    const gridWrap=$('#qGridWrap'), qGrid=$('#qGrid');

    let state={picked:null,answers:[],idx:0,showExplain:true,showFeedback:true};

    function renderGrid(){
      gridWrap.classList.remove('hidden');
      qGrid.innerHTML='';
      for(let i=0;i<state.picked.length;i++){
        const b=document.createElement('div'); b.className='qnum';
        if(i===state.idx) b.classList.add('cur');
        if(state.answers[i]!==null) b.classList.add('ans');
        b.textContent=String(i+1);
        b.addEventListener('click',()=>{state.idx=i; render(); save();});
        qGrid.appendChild(b);
      }
    }
    function save(){ saveProgress({picked:state.picked,answers:state.answers,idx:state.idx,showExplain:state.showExplain,showFeedback:state.showFeedback,t:Date.now()}); }
    function setExplain(text){ if(!state.showExplain||!text){ explain.classList.add('hidden'); return; } explain.textContent=text; explain.classList.remove('hidden'); }
    function setFeedback(text, ok){
      if(!state.showFeedback||!text){ feedback.classList.add('hidden'); return; }
      feedback.textContent=text; feedback.classList.remove('hidden');
      feedback.style.borderColor = ok ? 'rgba(52,211,153,.35)' : 'rgba(251,113,133,.35)';
      feedback.style.background = ok ? 'rgba(52,211,153,.10)' : 'rgba(251,113,133,.10)';
    }

    function render(){
      const q=state.picked[state.idx];
      qTotal.textContent=String(state.picked.length);
      qIndex.textContent=String(state.idx+1);
      qSection.textContent=`${sectionArabic(q.section)} • صعوبة ${q.difficulty||3}/5`;
      qPrompt.textContent=q.prompt;
      bar.style.width=`${Math.round((state.idx/state.picked.length)*100)}%`;

      const chosen=state.answers[state.idx];
      options.innerHTML='';
      q.options.forEach((t,i)=>{
        const div=document.createElement('div'); div.className='opt'; div.textContent=t;
        if(chosen===i) div.classList.add('sel');
        if(chosen!==null){
          if(i===q.correctIndex) div.classList.add('ok');
          else if(i===chosen && i!==q.correctIndex) div.classList.add('bad');
        }
        div.addEventListener('click', ()=>{
          state.answers[state.idx]=i;
          const ok=i===q.correctIndex;
          const name=(getUser()?.fullName||'يا بطل');
          setFeedback(ok ? `ممتاز ${name} ✅` : `قريب يا ${name}… ركّز 👌`, ok);
          setExplain(q.explain_ar||'');
          renderGrid(); render(); save();
        });
        options.appendChild(div);
      });

      prevBtn.disabled = state.idx===0;
      nextBtn.disabled = state.idx===state.picked.length-1;
      finishBtn.classList.toggle('hidden', state.idx!==state.picked.length-1);

      if(chosen!==null){
        const ok=chosen===q.correctIndex;
        setFeedback(ok?'ممتاز ✅':'قريب…', ok);
        setExplain(q.explain_ar||'');
      } else { feedback.classList.add('hidden'); explain.classList.add('hidden'); }

      toggleExplain.textContent = state.showExplain ? 'إخفاء الشرح' : 'إظهار الشرح';
      toggleFeedback.textContent = state.showFeedback ? 'إخفاء رسائل التشجيع' : 'إظهار رسائل التشجيع';
    }

    function startNew(user){
      if(cooldownRemaining()>0 && !loadProgress()){
        window.AYED_UTILS.toast('الاختبار الكامل متاح مرة كل 24 ساعة. استخدم الكويزات الآن ✅');
        return;
      }
      state.picked=pick(bank,CFG.test.questionsPerAttempt||50);
      state.answers=new Array(state.picked.length).fill(null);
      state.idx=0;
      state.showExplain = CFG.test.explainDefault!==false;
      state.showFeedback = true;
      startCard.classList.add('hidden');
      testCard.classList.remove('hidden');
      renderGrid(); render(); save();
    }

    $('#startTest').addEventListener('click', (e)=>{
      e.preventDefault();
      const fd=new FormData(form);
      const user={
        fullName:(fd.get('fullName')||'').trim(),
        goal:fd.get('goal')||'',
        region:fd.get('region')||'',
        whenExam:fd.get('whenExam')||'',
        testedBefore:fd.get('testedBefore')||'no',
        prevScore:fd.get('prevScore')||'',
        targetScore:fd.get('targetScore')||'',
        weakGuess:fd.get('weakGuess')||'auto',
        studyMinutes:fd.get('studyMinutes')||'',
        bestTime:fd.get('bestTime')||'',
        eduStage:fd.get('eduStage')||'',
        uniYear:fd.get('uniYear')||'',
        major:(fd.get('major')||'').trim(),
        prefers:fd.get('prefers')||'',
        triedCourses:fd.get('triedCourses')||'',
        painPoints:fd.getAll('painPoints'),
        heardFrom:fd.get('heardFrom')||'',
        notes:(fd.get('notes')||'').trim()
      };
      if(!user.fullName){ window.AYED_UTILS.toast('اكتب اسمك أولاً 👌'); return; }
      setUser(user);
      startNew(user);
    });

    const prog=loadProgress();
    if(prog?.picked && Array.isArray(prog.answers)){
      resumeBtn.classList.remove('hidden');
      resumeBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        state.picked=prog.picked; state.answers=prog.answers; state.idx=prog.idx||0;
        state.showExplain=prog.showExplain??true; state.showFeedback=prog.showFeedback??true;
        startCard.classList.add('hidden'); testCard.classList.remove('hidden');
        renderGrid(); render();
      });
    }

    toggleExplain.addEventListener('click', ()=>{ state.showExplain=!state.showExplain; save(); render(); });
    toggleFeedback.addEventListener('click', ()=>{ state.showFeedback=!state.showFeedback; save(); render(); });

    prevBtn.addEventListener('click', ()=>{ if(state.idx>0){ state.idx--; renderGrid(); render(); save(); }});
    nextBtn.addEventListener('click', ()=>{
      if(state.answers[state.idx]===null){ window.AYED_UTILS.toast('اختر إجابة أولاً ✅'); return; }
      if(state.idx<state.picked.length-1){ state.idx++; renderGrid(); render(); save(); }
    });

    finishBtn.addEventListener('click', ()=>{
      if(state.answers[state.idx]===null){ window.AYED_UTILS.toast('اختر إجابة للسؤال الأخير ✅'); return; }
      const b=breakdown(state.picked,state.answers);
      let correct=0; state.picked.forEach((q,i)=>{ if(state.answers[i]===q.correctIndex) correct++; });
      const pct=Math.round((correct/state.picked.length)*100);
      const lvl=levelFor(pct);
      const user=getUser()||{};
      const days=getPlanDays(user.whenExam);
      const focus=focusFrom(b);
      const plan=planText(user,focus,days);
      const table=buildTable(days,user);
      setResult({at:Date.now(),scorePct:pct,correct,total:state.picked.length,level:lvl,breakdown:b,focus,planDays:days,planText:plan,table,user});
      setCooldownNow(); clearProgress(); location.href='results.html';
    });
  }

  document.addEventListener('DOMContentLoaded', run);
})();