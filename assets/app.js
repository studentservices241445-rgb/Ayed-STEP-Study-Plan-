// assets/app.js (v3)
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const CFG = (window.AYED && window.AYED.CONFIG) ? window.AYED.CONFIG : null;

  function toast(msg){
    const el = $('#toast'); if(!el) return;
    el.textContent = msg; el.classList.add('show');
    clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),2800);
  }
  function fmtTime(ms){
    const s=Math.max(0,Math.ceil(ms/1000));
    const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60;
    if(h>0) return `${h}س ${m}د`;
    if(m>0) return `${m}د ${ss}ث`;
    return `${ss}ث`;
  }

  function initDrawer(){
    const drawer=$('#drawer'), btn=$('#menuBtn'), close=$('#drawerClose');
    if(!drawer||!btn) return;
    btn.addEventListener('click', (e)=>{ e.preventDefault(); drawer.classList.toggle('open'); });
    close && close.addEventListener('click', ()=> drawer.classList.remove('open'));
    drawer.addEventListener('click', (e)=>{ if(e.target===drawer) drawer.classList.remove('open'); });
    $$('#drawer a').forEach(a=>a.addEventListener('click', ()=> drawer.classList.remove('open')));
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') drawer.classList.remove('open'); });
  }

  function initPopups(){
    const pop=$('#pop'); if(!pop||!CFG?.social) return;
    const items=CFG.social.items||[];
    const interval=Math.max(20,CFG.social.intervalSec||45)*1000;
    const stop=()=> CFG.test?.stopPopupsDuringTest && location.pathname.endsWith('test.html');
    let i=Math.floor(Math.random()*Math.max(1,items.length));
    function show(){
      if(stop()||!items.length) return;
      $('.box',pop).textContent = items[i%items.length]; i++;
      $('.meta',pop).textContent = 'قبل لحظات';
      pop.classList.add('show');
      clearTimeout(pop._t); pop._t=setTimeout(()=>pop.classList.remove('show'),5600);
    }
    setTimeout(show,6500);
    setInterval(show,interval);
  }

  let deferred=null;
  function initInstall(){
    const banner=$('#installBanner'), btn=$('#installBtn'), how=$('#installHow');
    if(!banner||!btn) return;
    window.addEventListener('beforeinstallprompt',(e)=>{
      e.preventDefault(); deferred=e;
      if(CFG?.install?.showInstallBanner!==false) banner.classList.remove('hidden');
    });
    btn.addEventListener('click', async ()=>{
      if(!deferred){ toast('iPhone: Safari → مشاركة → Add to Home Screen'); return; }
      deferred.prompt(); await deferred.userChoice; deferred=null;
      banner.classList.add('hidden'); toast('تم طلب التثبيت ✅');
    });
    how && how.addEventListener('click', ()=> toast('Android: اضغط تثبيت. iPhone: Safari → مشاركة → Add to Home Screen'));
    window.addEventListener('appinstalled', ()=>{ toast('تم تثبيت التطبيق ✅'); banner.classList.add('hidden'); });
  }

  async function copyText(text){
    try{ await navigator.clipboard.writeText(text); toast('تم النسخ ✅'); }
    catch(e){ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('تم النسخ ✅'); }
  }

  function initShare(){
    const shareBtn=$('#shareProgram'), copyBtn=$('#copyProgram');
    if(!shareBtn||!CFG?.share) return;
    const url=(CFG.links?.siteUrl && !CFG.links.siteUrl.includes('ضع-رابط')) ? CFG.links.siteUrl : (location.origin + location.pathname.replace(/\/[^\/]*$/, '/'));
    shareBtn.addEventListener('click', async ()=>{
      const text=CFG.share.programText(url);
      if(navigator.share){ try{ await navigator.share({title:CFG.appName,text,url}); }catch(_){ } }
      else await copyText(text);
    });
    copyBtn && copyBtn.addEventListener('click', ()=> copyText(CFG.share.programText(url)));
  }

  function initAssistant(){
    if(!CFG?.assistant?.enabled) return;
    const fab=$('#chatFab'), panel=$('#chatPanel');
    if(!fab||!panel) return;
    const log=$('#chatLog'), input=$('#chatInput'), send=$('#chatSend'), chips=$('#chatChips');
    $('#chatTitle').textContent = CFG.assistant.title || 'مساعد';
    $('#chatStatus').textContent = CFG.assistant.statusOnline || 'متصل';

    function add(text, me=false){
      const d=document.createElement('div'); d.className='bubble'+(me?' me':''); d.textContent=text;
      log.appendChild(d); log.scrollTop=log.scrollHeight;
    }
    function setTyping(on){ $('#chatStatus').textContent = on ? (CFG.assistant.typing||'...') : (CFG.assistant.statusOnline||'متصل'); }
    function answer(msg){
      const m=msg.toLowerCase();
      for(const it of (CFG.assistant.intents||[])){
        for(const k of it.keys){ if(m.includes(k.toLowerCase())) return it.answer; }
      }
      return "تمام 👌 اكتب: (خطة) أو (تثبيت) أو (كويز) أو (حجز).";
    }
    fab.addEventListener('click', ()=> panel.classList.toggle('open'));
    $('#chatClose').addEventListener('click', ()=> panel.classList.remove('open'));

    chips.innerHTML='';
    (CFG.assistant.quick||[]).forEach(q=>{
      const c=document.createElement('div'); c.className='chip'; c.textContent=q.label;
      c.addEventListener('click', ()=>{
        if(q.go) location.href=q.go;
        if(q.action==='install_help') toast('Android: اضغط تثبيت. iPhone: Safari → مشاركة → Add to Home Screen');
      });
      chips.appendChild(c);
    });

    async function sendMsg(){
      const msg=(input.value||'').trim(); if(!msg) return;
      input.value=''; add(msg,true); setTyping(true);
      await new Promise(r=>setTimeout(r,650));
      add(answer(msg),false); setTyping(false);
    }
    send.addEventListener('click', sendMsg);
    input.addEventListener('keydown',(e)=>{ if(e.key==='Enter') sendMsg(); });
    if(!panel._hello){ panel._hello=true; add("هلا والله 👋 كيف أقدر أخدمك؟"); }
  }

  async function initSW(){
    if(!('serviceWorker' in navigator)) return;
    try{ await navigator.serviceWorker.register('sw.js'); }catch(e){}
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initDrawer(); initPopups(); initInstall(); initShare(); initAssistant(); initSW();
  });

  window.AYED_UTILS = { toast, fmtTime };
})();