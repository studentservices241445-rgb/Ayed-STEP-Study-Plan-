// assets/progress.js (v3)
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const histKey='ayed_step_history_v3';
  const cooldownKey='ayed_step_cooldown_v3';
  const cooldownHours=window.AYED.CONFIG.test.cooldownHours;
  function fmtDate(ts){ return new Date(ts).toLocaleString('ar',{year:'numeric',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'}); }
  function remaining(){ const t=Number(localStorage.getItem(cooldownKey)||0); return Math.max(0,(t+cooldownHours*3600*1000)-Date.now()); }
  function render(){
    const list=(()=>{try{return JSON.parse(localStorage.getItem(histKey)||'[]');}catch(e){return [];} })();
    const wrap=$('#history'); wrap.innerHTML='';
    if(!list.length) wrap.innerHTML=`<div class="card pad"><b>لا يوجد سجل حتى الآن.</b><div class="p" style="margin-top:6px">ابدأ الاختبار من صفحة الاختبار.</div></div>`;
    else list.forEach(it=>{
      const c=document.createElement('div'); c.className='card pad';
      c.innerHTML=`<b>${it.level} • ${it.scorePct}%</b><div style="color:var(--muted2);font-size:12.5px;margin-top:4px">${fmtDate(it.at)}</div><div style="color:var(--muted);margin-top:8px">التركيز: <b>${it.focus||'-'}</b> • خطة: ${it.planDays||'-'} يوم</div>`;
      wrap.appendChild(c);
    });
    const rem=remaining();
    $('#cooldownBox').classList.toggle('hidden', rem===0);
    if(rem>0) $('#cooldownTime').textContent=window.AYED_UTILS.fmtTime(rem);
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    render();
    $('#clearAll').addEventListener('click', ()=>{
      if(!confirm('متأكد؟ سيتم مسح كل البيانات من هذا الجهاز.')) return;
      ['ayed_step_history_v3','ayed_step_result_v3','ayed_step_user_v3','ayed_step_cooldown_v3','ayed_step_progress_v3'].forEach(k=>localStorage.removeItem(k));
      window.AYED_UTILS.toast('تم المسح ✅');
      render();
    });
  });
})();