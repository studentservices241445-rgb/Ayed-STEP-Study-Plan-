// assets/results.js (v3)
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const CFG = window.AYED.CONFIG;
  const LS = { result:'ayed_step_result_v3', print:'ayed_step_print_v3' };
  function getResult(){ try{return JSON.parse(localStorage.getItem(LS.result)||'null');}catch(e){return null;} }
  function sectionName(sec){ return ({Grammar:'القواعد',Vocabulary:'المفردات',Reading:'القراءة',Listening:'الاستماع'}[sec]||sec); }
  function secPct(b){ const o={}; for(const [k,v] of Object.entries(b||{})){ o[k]=Math.round((v.correct/Math.max(1,v.total))*100); } return o; }
  function siteUrl(){
    const cfgUrl=CFG.links?.siteUrl;
    if(cfgUrl && !cfgUrl.includes('ضع-رابط')) return cfgUrl;
    return location.origin + location.pathname.replace(/\/[^\/]*$/, '/');
  }
  async function copyText(text){
    try{ await navigator.clipboard.writeText(text); window.AYED_UTILS.toast('تم النسخ ✅'); }
    catch(e){ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); window.AYED_UTILS.toast('تم النسخ ✅'); }
  }
  function renderTable(rows){
    const tb=$('#planTbody'); tb.innerHTML='';
    (rows||[]).forEach(r=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `<td data-label="اليوم">${r.day}</td><td data-label="الوقت">${r.time}</td><td data-label="المهمة">${r.task}</td>`;
      tb.appendChild(tr);
    });
  }
  function render(){
    const res=getResult();
    const empty=$('#emptyState'), content=$('#content');
    if(!res){ empty.classList.remove('hidden'); content.classList.add('hidden'); return; }
    empty.classList.add('hidden'); content.classList.remove('hidden');
    const cta = document.getElementById('courseCta');
    if(cta && CFG.links?.courseIntensiveUrl){ cta.href = CFG.links.courseIntensiveUrl; }

    $('#name').textContent=res.user?.fullName||'—';
    $('#score').textContent=(res.scorePct??'-')+'%';
    $('#level').textContent=res.level?.label||'—';
    $('#focus').textContent=res.focus||'—';
    $('#correct').textContent=`${res.correct}/${res.total}`;
    $('#whenExam').textContent=({'24h':'أقل من 24 ساعة','3d':'خلال 3 أيام','7d':'خلال 7 أيام','30d':'خلال شهر','not_booked':'لسه ما حجزت'}[res.user?.whenExam]||'—');
    if(res.user?.whenExam==='not_booked'){ const hint=$('#bookingHint'); hint.classList.remove('hidden'); hint.textContent='نصيحة: احجز بعد ما تثبت أسبوعين على الخطة — عشان تدخل الاختبار بدون ضغط.'; }
    const bars=$('#bars'); bars.innerHTML='';
    const p=secPct(res.breakdown);
    Object.entries(p).forEach(([sec,val])=>{
      const c=document.createElement('div'); c.className='card pad';
      c.innerHTML = `<div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
        <div><b>${sectionName(sec)}</b><div style="color:var(--muted2);font-size:12px;margin-top:4px">${res.breakdown[sec]?.correct||0}/${res.breakdown[sec]?.total||0}</div></div>
        <div class="pill"><b>${val}%</b></div></div>
        <div class="progress" style="margin-top:10px"><i style="width:${val}%"></i></div>`;
      bars.appendChild(c);
    });
    $('#planText').textContent=res.planText||'';
    renderTable(res.table||[]);
    const planShareText = CFG.share.planText(siteUrl(), res.user?.fullName||'أنا', `${res.planDays} يوم`, res.focus||'تحسين عام');
    $('#sharePlan').addEventListener('click', async ()=>{ if(navigator.share){ try{ await navigator.share({title:CFG.appName,text:planShareText,url:siteUrl()}); }catch(_){ } } else await copyText(planShareText); });
    $('#copyPlan').addEventListener('click', ()=> copyText(planShareText));
    const progText = CFG.share.programText(siteUrl());
    $('#shareProgram').addEventListener('click', async ()=>{ if(navigator.share){ try{ await navigator.share({title:CFG.appName,text:progText,url:siteUrl()}); }catch(_){ } } else await copyText(progText); });
    $('#downloadPdf').addEventListener('click', ()=>{
      localStorage.setItem(LS.print, JSON.stringify({at:res.at,name:res.user?.fullName||'',scorePct:res.scorePct,level:res.level?.label||'',focus:res.focus||'',planDays:res.planDays,planText:res.planText||'',table:res.table||[],url:siteUrl()}));
      location.href='print.html';
    });
  }
  document.addEventListener('DOMContentLoaded', render);
})();