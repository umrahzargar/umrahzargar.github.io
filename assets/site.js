(()=>{
  'use strict';
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=window.matchMedia('(max-width: 720px)');
  const journey=document.querySelector('.journey');
  const chapters=[...document.querySelectorAll('[data-chapter]')];
  const portraits=[...document.querySelectorAll('[data-portrait]')];
  const stack=document.getElementById('portrait-stack');
  const counter=document.getElementById('portrait-counter');
  const dots=[...document.querySelectorAll('.chapter-dot')];
  const fill=document.getElementById('journey-progress');
  const work=document.querySelector('.work-section');
  const track=document.getElementById('work-track');
  const workFill=document.getElementById('work-progress-fill');
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const smooth=t=>t*t*(3-2*t);
  const staticMode=()=>reduce.matches||mobile.matches;
  const flipRanges=[[.13,.29],[.39,.55],[.65,.81]];
  let travel=0;
  let pending=false;
  let previous=-1;

  // The number of half turns (0 through 3). Pauses between turns give readers
  // time to read each chapter instead of making the portrait spin continuously.
  function turnsFor(progress){
    let turns=0;
    for(const [start,end] of flipRanges){
      if(progress>=end){turns+=1;continue;}
      if(progress>start) turns+=smooth((progress-start)/(end-start));
      break;
    }
    return turns;
  }

  function update(){
    pending=false;
    if(staticMode())return;
    const journeyTravel=Math.max(1,journey.offsetHeight-window.innerHeight);
    const progress=clamp(-journey.getBoundingClientRect().top/journeyTravel,0,1);
    const turns=turnsFor(progress);
    const active=Math.min(chapters.length-1,Math.round(turns));
    if(active!==previous){
      chapters.forEach((el,i)=>{
        const isActive=i===active;
        el.classList.toggle('active',isActive);
        if(isActive)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden','true');
      });
      dots.forEach((el,i)=>el.classList.toggle('is-active',i===active));
      counter.textContent=String(active+1).padStart(2,'0')+' / 04';
      previous=active;
    }
    // Each consecutive portrait occupies the reverse face of the preceding
    // illustration. The active image never becomes mirrored as it turns away.
    const frontIndex=Math.min(2,Math.floor(Math.min(turns,2.999999)));
    portraits.forEach((el,i)=>{
      const show=(i===frontIndex||i===frontIndex+1);
      el.classList.toggle('is-visible',show);
      el.setAttribute('aria-hidden',i===active?'false':'true');
    });
    const tilt=(Math.sin(turns*Math.PI)*1.8).toFixed(2);
    stack.style.transform=`rotateY(${-180*turns}deg) rotateZ(${tilt}deg)`;
    fill.style.width=(progress*100).toFixed(1)+'%';

    const workProgress=clamp(-work.getBoundingClientRect().top/Math.max(travel,1),0,1);
    track.style.transform=`translate3d(${(-workProgress*travel).toFixed(1)}px,0,0)`;
    workFill.style.width=(workProgress*100).toFixed(1)+'%';
  }
  function layout(){
    if(staticMode()){
      work.style.removeProperty('--travel');
      track.style.removeProperty('transform');
      stack.style.removeProperty('transform');
      chapters.forEach(el=>{el.classList.add('active');el.removeAttribute('aria-hidden')});
      portraits.forEach(el=>el.classList.remove('is-visible'));
      travel=0;previous=-1;
      return;
    }
    travel=Math.max(0,track.scrollWidth-window.innerWidth+window.innerWidth*.05);
    work.style.setProperty('--travel',Math.ceil(travel)+'px');
    update();
  }
  window.addEventListener('scroll',()=>{
    if(!pending){pending=true;requestAnimationFrame(update)}
  },{passive:true});
  window.addEventListener('resize',layout,{passive:true});
  if(reduce.addEventListener)reduce.addEventListener('change',layout);
  if(mobile.addEventListener)mobile.addEventListener('change',layout);
  window.addEventListener('load',layout,{once:true});


const details={
  customer:{
    tag:'01 / CUSTOMER ANALYTICS',
    title:'Customer 360 & CRM Analytics',
    intro:'A five-page Power BI project built on the dunnhumby Complete Journey dataset to explore customer value, engagement, campaigns and CRM opportunities.',
    approach:'I cleaned and modelled transaction, household and campaign data in Snowflake using SQL, then built a Power BI report covering overview, segmentation, retention, campaign performance and CRM opportunities.',
    outcome:'This project highlights how analytical outputs can lead to a concrete next step: 140 households were flagged as Potential Lapse, with a proposed CRM audience for a re-engagement test. It shows customer insight work, not a measured campaign uplift.',
    skills:['SQL','Snowflake','Power BI','DAX','Customer segmentation','CRM analytics'],
    facts:['2,500 households analysed','£8.06M total sales value','140 Potential Lapse households','1,584 assigned · 434 redeemers'],
    images:[
      ['assets/customer-overview.jpg','Executive overview: introduces the Customer 360 measures, household shopping and value at a glance.'],
      ['assets/customer-segmentation.jpg','Segmentation: RFM-style recency, frequency and value groups help explain differences in shopping and value contribution.'],
      ['assets/customer-retention.jpg','Retention and lapse: compares two 90-day windows and flags 140 Potential Lapse households, not confirmed churn.'],
      ['assets/customer-campaigns.jpg','Campaign performance: 30 campaigns with response rates by type. These are descriptive comparisons, not causal uplift.'],
      ['assets/customer-opportunities.jpg','CRM opportunities: illustrates a proposed audience of 14 historically valuable households for a controlled re-engagement test.']
    ],
    links:[['VIEW CASE STUDY','projects/customer-360.html'],['EXPLORE CODE','https://github.com/umrahzargar/customer-360-crm-analytics']]
  },
  healthcare:{
    tag:'02 / HEALTHCARE ANALYTICS',
    title:'NHS RTT Performance',
    intro:'A business intelligence project focused on NHS referral-to-treatment waiting times, provider pressure and how to turn a dense operational dataset into something decision-makers can actually use.',
    approach:'I analysed waiting-list trends, treatment-function pressure points and definition logic, then organised the findings into dashboard views for overview, executive reporting and data definitions.',
    outcome:'The project demonstrates operational reporting, data-quality thinking and the ability to make large public datasets easier to interpret. Figures shown are project visuals, not new official claims beyond the source data.',
    skills:['Excel','Power Query','Power BI','Operational reporting','Data quality'],
    facts:['6.57M total waiting list','150 providers selected','90K 52+ week waits','1.4% over 52 weeks'],
    images:[
      ['assets/nhs-overview.jpeg','Operational overview: March 2026 waiting list, top providers, treatment functions, monthly trends and 52+ week pressure.'],
      ['assets/nhs-exec-1.jpeg','Excel executive dashboard: compares new RTT periods and completed pathways with the reported movement in the incomplete waiting list.'],
      ['assets/nhs-exec-2.jpeg','Executive dashboard: examines net flow and residual adjustments, helping explain why stock changes cannot be read from completions alone.'],
      ['assets/nhs-definition.jpeg','Definitions: documents the meaning of incomplete pathways, 52+ week waits and dashboard measures before interpretation.']
    ],
    links:[['VIEW CASE STUDY','projects/nhs-rtt.html'],['EXPLORE CODE','https://github.com/umrahzargar/nhs-rtt-waiting-times-analysis']]
  },
  research:{
    tag:'03 / MSC DISSERTATION',
    title:'Boundary-Specific Uncertainty in NER',
    intro:'My MSc dissertation explored how reliably transformer-based named entity recognition models identify entity boundaries, especially under noisy or out-of-domain conditions.',
    approach:'I compared BERT and span-based approaches, then evaluated calibration, boundary-specific uncertainty and conformal prediction under clean, corrupted and external text settings.',
    outcome:'This work reflects the kind of data science I enjoy most: not just building a model, but understanding how reliable it is, how uncertainty behaves and how to communicate those limits clearly.',
    skills:['Python','Transformers','BERT','NLP','Calibration','Conformal prediction'],
    facts:['CoNLL-2003 as primary dataset','WNUT-17 external evaluation','Boundary uncertainty + calibration','Robustness under noisy text'],
    images:[
      ['assets/research-cover.png','Dissertation presentation: the research question centres on uncertainty about where named entities start and end.'],
      ['assets/research-page2.png','NER boundaries: model predictions require both an entity type and correct start/end positions.']
    ],
    links:[['VIEW CASE STUDY','projects/ner-research.html'],['READ PDF','documents/boundary-specific-uncertainty.pdf'],['EXPLORE CODE','https://github.com/umrahzargar/Boundary-Specific-Uncertainty-in-Transformer-Based-Named-Entity-Recognition']]
  },
  road:{
    tag:'04 / ROAD SAFETY MACHINE LEARNING',
    title:'Road Casualty Severity Prediction',
    intro:'An interpretable binary classification project using the 2023 Great Britain STATS19 public dataset, with an interactive Streamlit demonstration.',
    approach:'I joined collision, vehicle and casualty records at casualty level, built 42 selected raw predictors and used group-aware validation by collision ID to avoid leakage. I compared Logistic Regression, Random Forest and XGBoost and evaluated SHAP feature importance.',
    outcome:'The held-out XGBoost model achieved macro-F1 of 0.619, Severe recall of 0.649 and ROC-AUC of 0.739. It is an academic screening demonstration and not suitable for real emergency or safety decisions.',
    skills:['Python','Scikit-learn','XGBoost','SHAP','Grouped cross-validation','Streamlit'],
    facts:['132,977 casualty records','Held-out ROC-AUC 0.739','Severe recall 0.649','Live model demo'],
    images:[
      ['assets/stats-model-comparison.png','10-fold grouped CV: tuning improved XGBoost macro-F1 but not the already strong Random Forest baseline.'],
      ['assets/stats-shap.png','SHAP: casualty type, vehicle manoeuvre and vehicle type were important model inputs, not causal explanations.'],
      ['assets/stats-cost-sensitive.png','Oversampling experiment: random oversampling offered no meaningful benefit over cost-sensitive XGBoost for Severe recall.']
    ],
    links:[['CASE STUDY','projects/road-casualty.html'],['LIVE DEMO','https://stats19-road-casualty-severity-prediction.streamlit.app/'],['SOURCE CODE','https://github.com/umrahzargar/stats19-road-casualty-severity-prediction']]
  },
  fraud:{
    tag:'05 / FRAUD DETECTION AT SCALE',
    title:'Fraud Detection at Scale',
    intro:'A PySpark and Databricks research project exploring distributed SMOTEBagging approaches for severely imbalanced fraud transactions.',
    approach:'I compared local partition-level, stratified-repartitioned and global minority-broadcast distributed SMOTEBagging designs. Tests measured ranking performance, precision, recall, partition scaling and training runtime.',
    outcome:'The stratified repartitioned V2B approach struck a practical balance. At the measured settings its training time was 20.61 seconds with AUPRC 0.8311. Results are portfolio experiments, not production fraud-detection benchmarks.',
    skills:['Python','PySpark','Databricks','SMOTE','Bagging','AUPRC','Distributed ML'],
    facts:['284,807 transactions','492 fraud cases','3 distributed strategies','V2B AUPRC 0.8311'],
    images:[
      ['assets/credit-runtime-auc.png','Runtime, speed-up and ROC-AUC by partition count'],
      ['assets/credit-speedup-shuffle.png','Scaling with dataset fractions']
    ],
    links:[['CASE STUDY','projects/fraud-detection.html'],['SOURCE CODE','https://github.com/umrahzargar/credit-card-fraud-detection-at-scale'],['READ REPORT','documents/credit-card-fraud-report.pdf']]
  }
};
  const dialog=document.getElementById('project-modal');
  const close=document.getElementById('modal-close');
  const skills=document.getElementById('modal-skills');
  const actions=document.getElementById('modal-actions');
  const media=document.getElementById('modal-media');
  const facts=document.getElementById('modal-facts');
  let opener=null;
  function openProject(key,source){
    const item=details[key];
    if(!item)return;
    opener=source;
    document.getElementById('modal-kicker').textContent=item.tag;
    document.getElementById('modal-title').textContent=item.title;
    document.getElementById('modal-intro').textContent=item.intro;
    document.getElementById('modal-approach').textContent=item.approach;
    document.getElementById('modal-outcome').textContent=item.outcome;
    skills.replaceChildren();actions.replaceChildren();media.replaceChildren();facts.replaceChildren();
    for(const skill of item.skills){const chip=document.createElement('span');chip.textContent=skill;skills.append(chip)}
    for(const fact of (item.facts||[])){const chip=document.createElement('span');chip.textContent=fact;facts.append(chip)}
    for(const [src,alt] of (item.images||[])){
      const figure=document.createElement('figure');
      const img=document.createElement('img'); img.src=src; img.alt=alt; img.loading='lazy';
      const cap=document.createElement('figcaption'); cap.textContent=alt;
      figure.append(img,cap); media.append(figure);
    }
    for(const [label,url] of item.links){
      const link=document.createElement('a');link.href=url;link.textContent=label+' ↗';
      if(url.startsWith('https://')){link.target='_blank';link.rel='noopener noreferrer'}
      actions.append(link);
    }
    dialog.showModal();
    document.body.classList.add('modal-open');
    close.focus();
  }
  document.querySelectorAll('button[data-project]').forEach(button=>{
    button.addEventListener('click',()=>openProject(button.dataset.project,button));
  });
  close.addEventListener('click',()=>dialog.close());

const extraDialog=document.getElementById('extra-about-modal');
const extraClose=document.getElementById('extra-close');
let extraOpener=null;
document.querySelectorAll('[data-open-extra]').forEach(button=>{
  button.addEventListener('click',()=>{
    extraOpener=button;
    extraDialog.showModal();
    document.body.classList.add('modal-open');
    extraClose.focus();
  });
});
if(extraClose){
  extraClose.addEventListener('click',()=>extraDialog.close());
  extraDialog.addEventListener('click',event=>{if(event.target===extraDialog)extraDialog.close()});
  extraDialog.addEventListener('close',()=>{
    document.body.classList.remove('modal-open');
    if(extraOpener?.isConnected) extraOpener.focus({preventScroll:true});
  });
}

  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('modal-open');
    if(opener?.isConnected)opener.focus({preventScroll:true});
  });


  const awardsButton=document.querySelector('.edu-awards .awards-toggle');
  const awardsPanel=document.getElementById('award-panel');
  if(awardsButton && awardsPanel){
    awardsButton.addEventListener('click',()=>{
      const expanded=awardsButton.getAttribute('aria-expanded')==='true';
      awardsButton.setAttribute('aria-expanded',String(!expanded));
      awardsPanel.setAttribute('aria-hidden',String(expanded));
      awardsPanel.classList.toggle('is-open',!expanded);
    });
  }

  // Fixed navigation: visible at top and when visitors scroll upward.
  const nav=document.querySelector('header.nav');
  let lastScrollY=Math.max(0,window.scrollY);
  function updateNav(){
    if(!nav)return;
    const current=Math.max(0,window.scrollY);
    const pastTop=current>85;
    nav.classList.toggle('nav-scrolled',pastTop);
    nav.classList.toggle('nav-dark',current > journey.offsetTop+journey.offsetHeight-110 && current < document.querySelector('.footer').offsetTop);
    if(current<85 || current<lastScrollY-4) nav.classList.remove('nav-away');
    else if(current>lastScrollY+5 && current>155) nav.classList.add('nav-away');
    lastScrollY=current;
  }
  window.addEventListener('scroll',updateNav,{passive:true});
  window.addEventListener('resize',updateNav,{passive:true});
  updateNav();

  // Matching animated coursework reveal with the existing awards button.
  const courseButton=document.querySelector('.courses-toggle');
  const coursePanel=document.getElementById('courses-panel');
  if(courseButton && coursePanel){
    courseButton.addEventListener('click',()=>{
      const wasOpen=courseButton.getAttribute('aria-expanded')==='true';
      courseButton.setAttribute('aria-expanded',String(!wasOpen));
      coursePanel.setAttribute('aria-hidden',String(wasOpen));
      coursePanel.classList.toggle('is-open',!wasOpen);
    });
  }

  // Auto-advancing, pausable Kashmir photo story. All images are bundled locally.
  const gallery=document.querySelector('.kashmir-gallery');
  if(gallery){
    const slides=[...gallery.querySelectorAll('.kashmir-slide')];
    const navDots=[...gallery.querySelectorAll('.kashmir-dot')];
    const title=gallery.querySelector('#kashmir-title');
    const titles=['Dal Lake','The mountains','Autumn chinars','Saffron season','Craft and culture'];
    let index=0, timer=null;
    let paused=false;
    const motionOff=window.matchMedia('(prefers-reduced-motion: reduce)');
    function displaySlide(next){
      index=(next+slides.length)%slides.length;
      slides.forEach((slide,i)=>{
        const selected=i===index;
        slide.classList.toggle('is-active',selected);
        slide.setAttribute('aria-hidden',String(!selected));
      });
      navDots.forEach((dot,i)=>{
        dot.classList.toggle('is-active',i===index);
        dot.setAttribute('aria-current',i===index?'true':'false');
      });
      title.textContent=titles[index];
    }
    function stop(){clearInterval(timer);timer=null;}
    function resume(){
      stop();
      if(!paused && !motionOff.matches && !document.hidden){
        timer=setInterval(()=>displaySlide(index+1),4400);
      }
    }
    gallery.querySelector('.kashmir-back')?.addEventListener('click',()=>{displaySlide(index-1);resume()});
    gallery.querySelector('.kashmir-forward')?.addEventListener('click',()=>{displaySlide(index+1);resume()});
    navDots.forEach((dot,i)=>dot.addEventListener('click',()=>{displaySlide(i);resume()}));
    gallery.addEventListener('mouseenter',()=>{paused=true;stop()});
    gallery.addEventListener('mouseleave',()=>{paused=false;resume()});
    gallery.addEventListener('focusin',()=>{paused=true;stop()});
    gallery.addEventListener('focusout',event=>{
      if(!gallery.contains(event.relatedTarget)){paused=false;resume()}
    });
    document.addEventListener('visibilitychange',resume);
    if(motionOff.addEventListener) motionOff.addEventListener('change',resume);
    resume();
  }

  layout();
})();
