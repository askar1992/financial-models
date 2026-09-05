// общие утилиты витрины
const fmt = (v, d=0) => (v===null||v===undefined||!isFinite(v)) ? "—" :
  new Intl.NumberFormat('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d}).format(Math.round(v*10**d)/10**d);
const mln = v => !isFinite(v) ? "—" : fmt(v/1e6,1)+" млн";
const pct = (v,d=1) => !isFinite(v) ? "—" : fmt(v*100,d)+"%";
const money = v => fmt(v)+" ₸";

const PAL = ['#2E5A88','#C79A3B','#2E7D5B','#B4442E','#6B7FA8','#8E6BA8','#3E9AA8','#A88E6B','#5C6B7F','#C4746A','#7FA85C'];

function baseOpts(extra={}){
  return Object.assign({
    responsive:true, maintainAspectRatio:false,
    interaction:{mode:'index',intersect:false},
    plugins:{
      legend:{display:true,position:'bottom',labels:{boxWidth:10,boxHeight:10,usePointStyle:true,pointStyle:'circle',font:{size:11},padding:14}},
      tooltip:{callbacks:{label:c=>` ${c.dataset.label}: ${c.dataset.pctMode?pct(c.parsed.y):fmt(c.parsed.y ?? c.parsed)}`}}
    },
    scales:{
      x:{grid:{display:false},ticks:{font:{size:10},maxRotation:0,autoSkip:true,maxTicksLimit:13}},
      y:{grid:{color:'#EDF1F6'},border:{display:false},ticks:{font:{size:10},callback:v=>Math.abs(v)>=1e6?fmt(v/1e6,0)+'м':fmt(v/1e3,0)+'к'}}
    }
  }, extra);
}

// поле-ползунок
function field(host, cfg, onchange){
  const wrap=document.createElement('div'); wrap.className='f';
  const lab=document.createElement('label');
  const name=document.createElement('span'); name.textContent=cfg.label;
  const val=document.createElement('span'); val.className='val';
  lab.append(name,val);
  const inp=document.createElement('input');
  inp.type='range'; inp.min=cfg.min; inp.max=cfg.max; inp.step=cfg.step; inp.value=cfg.value;
  const show=()=> val.textContent = cfg.fmt ? cfg.fmt(+inp.value) : fmt(+inp.value);
  inp.addEventListener('input',()=>{show(); onchange();});
  show(); wrap.append(lab,inp); host.append(wrap);
  return ()=> +inp.value;
}
function group(host,title){ const g=document.createElement('div'); g.className='grp'; g.textContent=title; host.append(g); }

function kpi(host, items){
  host.innerHTML='';
  items.forEach(it=>{
    const d=document.createElement('div'); d.className='kpi';
    d.innerHTML=`<div class="l">${it.l}</div><div class="v${it.cls?' '+it.cls:''}">${it.v}</div>${it.s?`<div class="s">${it.s}</div>`:''}`;
    host.append(d);
  });
}

function table(host, cols, rows){
  const t=document.createElement('table'); t.className='fin';
  const th=document.createElement('thead'); const tr=document.createElement('tr');
  cols.forEach(c=>{const e=document.createElement('th'); e.textContent=c; tr.append(e);});
  th.append(tr); t.append(th);
  const tb=document.createElement('tbody');
  rows.forEach(r=>{
    const row=document.createElement('tr');
    if(r.type) row.className=r.type;
    const c0=document.createElement('td'); c0.textContent=r.name; row.append(c0);
    (r.vals||[]).forEach(v=>{
      const td=document.createElement('td');
      if(typeof v==='number'){ td.textContent = r.fmt? r.fmt(v) : fmt(v); if(v<0) td.classList.add('neg'); }
      else td.textContent = v ?? '';
      row.append(td);
    });
    tb.append(row);
  });
  t.append(tb);
  host.innerHTML=''; host.append(t);
}
