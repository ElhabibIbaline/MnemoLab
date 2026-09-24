(() => {
 const C=window.LAB_CONTENT;
 C.notions.forEach(n=>{
  n.notionId=n.id;n.priority??=3;n.verifiedAt??='2026-09-24';n.difficulty??=1;
  if(n.id==='dg-15')n.source='services';
  if(n.source){n.sourceUrl=C.sources[n.source].url;n.sourceType=C.sources[n.source].type;n.status='Source officielle · question originale';}
 });
 const variants=C.questions;
 C.questions=C.notions.map(n=>({...n,id:'q-'+n.id,notionId:n.id,variant:false})).concat(variants);
 C.version=2;
 // La source du programme calibre les exercices, elle n'est pas l'auteur de nos calculs.
 C.notions.filter(n=>['Mathématiques','Logique'].includes(n.category)).forEach(n=>n.programSource='zeroQcm');
})();
