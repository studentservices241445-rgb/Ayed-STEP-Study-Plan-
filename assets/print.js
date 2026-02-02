// assets/print.js (v3)
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  document.addEventListener('DOMContentLoaded', ()=>{
    const data=(()=>{try{return JSON.parse(localStorage.getItem('ayed_step_print_v3')||'null');}catch(e){return null;} })();
    if(!data) return;
    $('#pName').textContent=data.name||'';
    $('#pScore').textContent=(data.scorePct??'-')+'%';
    $('#pLevel').textContent=data.level||'';
    $('#pFocus').textContent=data.focus||'';
    $('#pDays').textContent=data.planDays||'';
    $('#pText').textContent=data.planText||'';
    const tb=$('#pTable'); tb.innerHTML='';
    (data.table||[]).forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${r.day}</td><td>${r.time}</td><td>${r.task}</td>`; tb.appendChild(tr); });
    $('#pUrl').textContent=data.url||'';
    $('#printBtn').addEventListener('click', ()=> window.print());
  });
})();