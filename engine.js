(function(root){
 const DAY=86400000;
 const empty=()=>({version:1,progress:{},history:[],drafts:{},seconds:0,examDate:'2026-09-29'});
 function examDays(state,now=Date.now()){
  const today=new Date(now);today.setHours(0,0,0,0);
  return Math.ceil((new Date(state.examDate+'T00:00:00').getTime()-today.getTime())/DAY);
 }
 function capReview(state,next,now){
  const deadline=new Date(state.examDate+'T00:00:00').getTime();
  return deadline>now?Math.min(next,now+(deadline-now)/2):next;
 }
 function review(state,id,rating,now=Date.now(),mode='recall',questionId=null){
  const existed=!!state.progress[id];
  const old=state.progress[id]||{level:0,successes:0,errors:0};
  const level=rating<2?rating:Math.min(4,old.level+1);
  const days=rating===0?0:rating===1?1:rating===2?Math.min(14,2**Math.max(0,level-1)):Math.min(30,3*2**Math.max(0,level-1));
  const day=new Date(now).toLocaleDateString('en-CA');
  const success=rating>=2;
  state.progress[id]={...old,level,successes:old.successes+(success?1:0),errors:old.errors+(rating===0?1:0),lastReview:now,nextReview:capReview(state,now+(days?days*DAY:10*60000),now),lastRating:rating,
   firstSeenDay:old.firstSeenDay||(existed?new Date(old.lastReview).toLocaleDateString('en-CA'):day),
   successDays:(old.successDays||0)+(success&&old.lastSuccessDay!==day?1:0),lastSuccessDay:success?day:(old.lastSuccessDay||''),
   modes:{...(old.modes||{}),[mode]:(old.modes?.[mode]||0)+(success?1:0)},lastQuestion:questionId||old.lastQuestion||null};
  return state.progress[id];
 }
 function due(p,now=Date.now()){return !!p&&p.nextReview<=now;}
 function prioritize(notions,state,now=Date.now()) {return [...notions].sort((a,b)=>{const score=n=>{const p=state.progress[n.id];return !p?20:(due(p,now)?100:0)+(4-p.level)*10+Math.min(p.errors,10);};return score(b)-score(a);});}
 function mastery(p,now=Date.now()){
  if(!p)return 'Non étudié';
  if(due(p,now)||p.lastRating<2)return 'Fragile';
  if(p.level>=3&&p.successes>=3&&(p.successDays===undefined||p.successDays>=2))return 'Maîtrisé';
  return 'En cours';
 }
 function newAllowance(state,count,now=Date.now()){
  const days=examDays(state,now),day=new Date(now).toLocaleDateString('en-CA');
  const budget=days>=0&&days<=1?0:days>1&&days<=3?3:days>3&&days<=6?8:count;
  const used=Object.values(state.progress).filter(p=>p.firstSeenDay===day).length;
  return Math.max(0,Math.min(count,budget-used));
 }
 function adaptive(notions,state,count,now=Date.now()){
  const sorted=prioritize(notions,state,now),known=sorted.filter(n=>state.progress[n.id]);
  // Intercaler les catégories à score égal évite une session entièrement mathématique par défaut.
  const fresh=sorted.filter(n=>!state.progress[n.id]).sort((a,b)=>(b.priority||1)-(a.priority||1));
  const groups=new Map();fresh.forEach(n=>{if(!groups.has(n.category))groups.set(n.category,[]);groups.get(n.category).push(n);});
  const mixed=[];while([...groups.values()].some(g=>g.length))for(const group of groups.values())if(group.length)mixed.push(group.shift());
  const limit=newAllowance(state,count,now);
  const urgent=known.filter(n=>mastery(state.progress[n.id],now)!=='Maîtrisé');
  const rest=known.filter(n=>mastery(state.progress[n.id],now)==='Maîtrisé');
  return [...urgent,...mixed.slice(0,limit),...rest].slice(0,count);
 }
 function chooseQuestion(questions,notionId,progress){
  const choices=questions.filter(q=>q.notionId===notionId);
  if(!choices.length)throw Error('Question manquante pour '+notionId);
  const last=choices.findIndex(q=>q.id===progress?.lastQuestion);
  return choices[(last+1)%choices.length];
 }
 function prepareV2(state,now=Date.now()){
  Object.values(state.progress).forEach(p=>{if(p.nextReview>now)p.nextReview=capReview(state,p.nextReview,now);});
  state.contentVersion=2;return state;
 }
 function validate(data,ids){
  if(!data||data.version!==1||!data.progress||Array.isArray(data.progress)||!Array.isArray(data.history)||!data.drafts||typeof data.drafts!=='object'||!Number.isFinite(data.seconds)||data.seconds<0||data.history.length>10000)throw Error('Format de sauvegarde non reconnu.');
  const result=empty(); result.seconds=data.seconds;
  for(const [id,p]of Object.entries(data.progress)){if(!/^[a-zA-Z0-9_-]+$/.test(id)||['__proto__','constructor','prototype'].includes(id))throw Error('Identifiant invalide.'); if(!p||![p.level,p.successes,p.errors,p.lastReview,p.nextReview,p.lastRating].every(Number.isFinite)||p.level<0||p.level>4||p.lastRating<0||p.lastRating>3||p.successes<0||p.errors<0||p.lastReview<0||p.nextReview<0)throw Error('Progression invalide.'); result.progress[id]={...p};
   if(p.successDays!==undefined&&(!Number.isInteger(p.successDays)||p.successDays<0))throw Error('Compteur de rappel invalide.');
   if(p.lastQuestion!==undefined&&p.lastQuestion!==null&&typeof p.lastQuestion!=='string')throw Error('Question invalide.');
   if(p.modes!==undefined&&(!p.modes||typeof p.modes!=='object'||Object.values(p.modes).some(v=>!Number.isInteger(v)||v<0)))throw Error('Signaux invalides.');
  }
  result.history=data.history.map(h=>{if(!h||!Number.isFinite(h.date)||!Number.isInteger(h.total)||!Number.isInteger(h.score)||h.total<1||h.score<0||h.score>h.total||!Number.isFinite(h.seconds)||h.seconds<0||typeof h.mode!=='string')throw Error('Historique invalide.');return {date:h.date,total:h.total,score:h.score,seconds:h.seconds,mode:h.mode.slice(0,80)};});
  for(const [key,value] of Object.entries(data.drafts))if(/^[a-zA-Z0-9_-]+$/.test(key)&&!['__proto__','constructor','prototype'].includes(key)&&typeof value==='string')result.drafts[key]=value.slice(0,50000);
  if(data.contentVersion===2)result.contentVersion=2;
  if(typeof data.examDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(data.examDate)&&!isNaN(Date.parse(data.examDate)))result.examDate=data.examDate;
  return result;
 }
 root.LabEngine={empty,review,due,prioritize,validate,examDays,capReview,mastery,newAllowance,adaptive,chooseQuestion,prepareV2};
 if(typeof module!=='undefined')module.exports=root.LabEngine;
})(typeof window!=='undefined'?window:globalThis);
