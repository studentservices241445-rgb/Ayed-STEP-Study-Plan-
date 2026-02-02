// assets/support.js (v3)
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  document.addEventListener('DOMContentLoaded', ()=>{
    const form=$('#supportForm'), ok=$('#supportOk');
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const name=$('#sName').value.trim(), msg=$('#sMsg').value.trim();
      if(!name||!msg){ window.AYED_UTILS.toast('اكتب اسمك ورسالتك 👌'); return; }
      ok.classList.remove('hidden');
      ok.textContent='شكراً لتواصلك معنا ✅ تم استلام استفسارك وسيتم النظر عليه قريباً بإذن الله.';
      form.reset();
      setTimeout(()=>ok.classList.add('hidden'),8000);
    });
  });
})();