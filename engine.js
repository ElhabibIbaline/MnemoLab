(function(root){
 const DAY=86400000;
 const empty=()=>({version:1,progress:{},history:[],drafts:{},seconds:0,examDate:'2026-09-29'});
 function review(state,id,rating,now=Date.now()){
  const old=state.progress[id]||{level:0,successes:0,errors:0};
  const level=rating<2?rating:Math.min(4,old.level+1);
  const days=rating===0?0:rating===1?1:rating===2?Math.min(14,2**Math.max(0,level-1)):Math.min(30,3*2**Math.max(0,level-1));
  state.progress[id]={level,successes:old.successes+(rating>=2?1:0),errors:old.errors+(rating===0?1:0),lastReview:now,nextReview:now+(days?days*DAY:10*60000),lastRating:rating};
  return state.progress[id];
 }
 function due(p,now=Date.now()){return !!p&&p.nextReview<=now;}
 function prioritize(notions,state,now=Date.now()) {return [...notions].sort((a,b)=>{const score=n=>{const p=state.progress[n.id];return !p?20:(due(p,now)?100:0)+(4-p.level)*10+Math.min(p.errors,10);};return score(b)-score(a);});}
 function validate(data,ids){
  if(!data||data.version!==1||!data.progress||Array.isArray(data.progress)||!Array.isArray(data.history)||!data.drafts||typeof data.drafts!=='object'||!Number.isFinite(data.seconds)||data.seconds<0||data.history.length>10000)throw Error('Format de sauvegarde non reconnu.');
  const result=empty(); result.seconds=data.seconds;
  for(const [id,p]of Object.entries(data.progress)){if(!ids.includes(id))continue; if(!p||![p.level,p.successes,p.errors,p.lastReview,p.nextReview,p.lastRating].every(Number.isFinite)||p.level<0||p.level>4||p.lastRating<0||p.lastRating>3||p.successes<0||p.errors<0||p.lastReview<0||p.nextReview<0)throw Error('Progression invalide.'); result.progress[id]={...p};}
  result.history=data.history.map(h=>{if(!h||!Number.isFinite(h.date)||!Number.isInteger(h.total)||!Number.isInteger(h.score)||h.total<1||h.score<0||h.score>h.total||!Number.isFinite(h.seconds)||h.seconds<0||typeof h.mode!=='string')throw Error('Historique invalide.');return {date:h.date,total:h.total,score:h.score,seconds:h.seconds,mode:h.mode.slice(0,80)};});
  for(const key of ['practice','plan','oral'])if(typeof data.drafts[key]==='string')result.drafts[key]=data.drafts[key].slice(0,50000);
  if(typeof data.examDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(data.examDate)&&!isNaN(Date.parse(data.examDate)))result.examDate=data.examDate;
  return result;
 }
 root.LabEngine={empty,review,due,prioritize,validate};
 if(typeof module!=='undefined')module.exports=root.LabEngine;
})(typeof window!=='undefined'?window:globalThis);
