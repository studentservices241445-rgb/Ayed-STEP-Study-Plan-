// assets/quiz.js (v3)
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  function loadJSON(path){ return fetch(path,{cache:'no-store'}).then(r=>r.json()); }
  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  function params(){ return Object.fromEntries(new URLSearchParams(location.search).entries()); }
  function mkSeed(){ return Math.random().toString(16).slice(2)+Date.now().toString(16); }
  async function copyText(text){
    try{ await navigator.clipboard.writeText(text); window.AYED_UTILS.toast('تم النسخ ✅'); }
    catch(e){ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); window.AYED_UTILS.toast('تم النسخ ✅'); }
  }
  function sectionName(sec){ return ({Grammar:'القواعد',Vocabulary:'المفردات',Reading:'القراءة',Listening:'الاستماع'}[sec]||sec); }

  async function run(){
    const bank=await loadJSON('assets/questions.json');
    const p=params();
    const builder=$('#builder'), player=$('#player');
    const sectionSel=$('#qSection'), countSel=$('#qCount'), diffSel=$('#qDiff'), topicInp=$('#qTopic');
    const startBtn=$('#startQuiz'), linkOut=$('#shareLink'), copyBtn=$('#copyLink'), shareBtn=$('#shareQuiz');
    const bar=$('#bar'), idxEl=$('#qIndex'), totalEl=$('#qTotal'), promptEl=$('#qPrompt'), optsEl=$('#options'), explainEl=$('#explain'), nextBtn=$('#nextQ');
    let picked=[], idx=0;

    function buildLink(){
      const u=new URL(location.href); u.search='';
      u.searchParams.set('section', sectionSel.value);
      u.searchParams.set('count', countSel.value);
      if(diffSel.value) u.searchParams.set('diff', diffSel.value);
      if(topicInp.value.trim()) u.searchParams.set('topic', topicInp.value.trim());
      u.searchParams.set('seed', mkSeed());
      return u.toString();
    }
    function filter(section,count,diff,topic){
      let list=bank.filter(q=>q.section===section);
      if(diff) list=list.filter(q=>String(q.difficulty||'')===String(diff));
      if(topic){ const t=topic.toLowerCase(); list=list.filter(q=>(q.prompt||'').toLowerCase().includes(t)||(q.skillTag||'').toLowerCase().includes(t)); }
      shuffle(list); return list.slice(0,count);
    }
    function render(){
      const q=picked[idx];
      totalEl.textContent=String(picked.length); idxEl.textContent=String(idx+1);
      bar.style.width=`${Math.round((idx/picked.length)*100)}%`;
      promptEl.textContent=q.prompt;
      optsEl.innerHTML=''; explainEl.classList.add('hidden'); nextBtn.disabled=true;
      q.options.forEach((t,i)=>{
        const div=document.createElement('div'); div.className='opt'; div.textContent=t;
        div.addEventListener('click', ()=>{
          $$('.opt',optsEl).forEach(o=>o.classList.remove('sel','ok','bad'));
          div.classList.add('sel');
          $$('.opt',optsEl).forEach((o,j)=>{ if(j===q.correctIndex) o.classList.add('ok'); });
          if(i!==q.correctIndex) div.classList.add('bad');
          if(q.explain_ar){ explainEl.textContent=q.explain_ar; explainEl.classList.remove('hidden'); }
          nextBtn.disabled=false;
        });
        optsEl.appendChild(div);
      });
      nextBtn.textContent=(idx===picked.length-1)?'إنهاء':'التالي';
    }
    function start(section,count,diff,topic){
      picked=filter(section,count,diff,topic); idx=0;
      builder.classList.add('hidden'); player.classList.remove('hidden');
      $('#quizTitle').textContent=`كويز ${sectionName(section)} • ${count} سؤال`;
      render();
    }
    startBtn.addEventListener('click', ()=>{ linkOut.value=buildLink(); window.AYED_UTILS.toast('تم إنشاء رابط الكويز ✅'); });
    copyBtn.addEventListener('click', ()=>{ if(!linkOut.value) linkOut.value=buildLink(); copyText(linkOut.value); });
    shareBtn.addEventListener('click', async ()=>{
      if(!linkOut.value) linkOut.value=buildLink();
      const text=`﴿وَقُل رَّبِّ زِدْنِي عِلْمًا﴾\n\nكويز STEP سريع من برنامج أكاديمية عايد (مجاني)\n${linkOut.value}`;
      if(navigator.share){ try{ await navigator.share({title:'كويز STEP',text,url:linkOut.value}); }catch(_){ } }
      else await copyText(text);
    });
    nextBtn.addEventListener('click', ()=>{ if(idx===picked.length-1){ location.href='index.html'; return; } idx++; render(); });
    if(p.section){ start(p.section, Math.min(20, Math.max(5, Number(p.count||10))), p.diff||'', p.topic||''); }
  }
  document.addEventListener('DOMContentLoaded', run);
})();