(function(){
  const root=document.documentElement;
  const toggle=document.getElementById('theme-toggle');
  try { if(localStorage.getItem('umrah-site-theme') === 'dark') root.dataset.theme='dark'; } catch(e) {}
  if(toggle){
    const update=()=>toggle.setAttribute('aria-label',root.dataset.theme==='dark'?'Switch to light theme':'Switch to dark theme');
    update();
    toggle.addEventListener('click',()=>{
      root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';
      try{localStorage.setItem('umrah-site-theme',root.dataset.theme);}catch(e){}
      update();
    });
  }
  const year=document.getElementById('year'); if(year) year.textContent=String(new Date().getFullYear());
})();
