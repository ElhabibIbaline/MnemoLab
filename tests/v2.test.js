const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../engine.js');
const ctx={window:{}};vm.createContext(ctx);
const files=['content.js',...['catalog','exercises','knowledge','current-affairs','palace','practical-cases','finalize'].map(n=>'data/'+n+'.js')];
for(const file of files)vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
const C=ctx.window.LAB_CONTENT;
test('V2 conserve les 15 identifiants historiques et couvre toutes les catégories',()=>{
 const legacy=['math-01','math-02','math-03','math-04','math-05','logic-01','logic-02','logic-03','dg-01','dg-02','dg-03','dg-04','num-01','num-02','num-03'];
 legacy.forEach(id=>assert.ok(C.notions.some(n=>n.id===id)));
 C.topics.forEach(t=>assert.ok(C.notions.some(n=>n.category===t),t));
 assert.ok(C.notions.length>=90);assert.equal(new Set(C.notions.map(n=>n.id)).size,C.notions.length);
});
test('chaque QCM, variante et objet pointe vers une notion unique valide',()=>{
 assert.equal(new Set(C.questions.map(q=>q.id)).size,C.questions.length);
 C.questions.forEach(q=>{assert.ok(C.notions.some(n=>n.id===q.notionId));assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);assert.ok(q.explanation);});
 C.rooms.forEach(r=>{assert.equal(r.objects.length,4);assert.equal(new Set(r.objects.map(o=>o.slot)).size,4);r.objects.forEach(o=>assert.ok(C.notions.some(n=>n.id===o.notionId)));});
 assert.deepEqual(Array.from(C.rooms[0].objects,o=>o.slot),['left','center','right','back']);
});
test('sources factuelles, dates et fiches actuelles traçables',()=>{
 C.notions.filter(n=>!['Mathématiques','Logique'].includes(n.category)&&n.id!=='num-02').forEach(n=>{assert.ok(n.source,n.id);assert.ok(C.sources[n.source]?.url.startsWith('https://'));assert.ok(n.verifiedAt);});
 C.currentAffairs.forEach(f=>{['date','verifiedAt','sourceUrl','context','question','why','reviewAfter'].forEach(k=>assert.ok(f[k],f.id+' '+k));f.notionIds.forEach(id=>assert.ok(C.notions.some(n=>n.id===id)));});
});
test('migration V1 sans perte de compteurs, historique, brouillons ni identifiant inconnu',()=>{
 const s=E.empty(),before=new Date('2026-09-24T12:00:00').getTime();
 s.progress['dg-02']={level:3,successes:9,errors:2,lastReview:before-1000,nextReview:before+30*86400000,lastRating:2};
 s.progress['custom-future']={...s.progress['dg-02']};s.history=[{date:before,total:5,score:3,seconds:120,mode:'exam'}];s.drafts={practice:'ancien brouillon',oral:'trame',custom:'notes'};
 const original=JSON.parse(JSON.stringify(s)),m=E.prepareV2(E.validate(s,C.notions.map(n=>n.id)),before);
 for(const id of Object.keys(original.progress)){for(const k of ['level','successes','errors','lastReview','lastRating'])assert.equal(m.progress[id][k],original.progress[id][k]);assert.ok(m.progress[id].nextReview<new Date('2026-09-29T00:00:00').getTime());}
 assert.deepEqual(m.history,original.history);assert.deepEqual(m.drafts,original.drafts);
});
test('intervalle futur avant épreuve, y compris pendant la dernière heure',()=>{
 for(const day of ['2026-09-24T10:00:00','2026-09-28T23:30:00']){const s=E.empty(),now=new Date(day).getTime();for(const rating of [0,1,2,3]){const p=E.review(s,'x',rating,now);assert.ok(p.nextReview>now);assert.ok(p.nextReview<new Date('2026-09-29T00:00:00').getTime());}}
});
test('maîtrise : répétition sur plusieurs jours plutôt que clics répétés',()=>{
 const s=E.empty();s.examDate='2027-01-01';const now=new Date('2026-09-24T10:00:00').getTime();
 for(let i=0;i<3;i++)E.review(s,'x',3,now,'qcm');assert.equal(E.mastery(s.progress.x,now),'En cours');
 E.review(s,'x',3,now+86400000,'palace');assert.equal(E.mastery(s.progress.x,now+86400000),'Maîtrisé');
 E.review(s,'x',0,now+86400000);assert.equal(E.mastery(s.progress.x,now+86400000),'Fragile');
});
test('sessions : moins de nouveautés avant les écrits, erreurs prioritaires et catégories variées',()=>{
 const s=E.empty(),now=new Date('2026-09-24T10:00:00').getTime();
 assert.equal(E.adaptive(C.notions,s,15,now).length,8);
 assert.ok(new Set(E.adaptive(C.notions,s,5,now).map(n=>n.category)).size>=4);
 E.review(s,'dg-02',0,now-700000);assert.equal(E.adaptive(C.notions,s,5,now)[0].id,'dg-02');
 assert.equal(E.newAllowance(s,10,new Date('2026-09-27T10:00:00').getTime()),3);
 assert.equal(E.newAllowance(s,10,new Date('2026-09-28T10:00:00').getTime()),0);
});
test('une erreur propose la variante suivante pour la même notion',()=>{
 const first=E.chooseQuestion(C.questions,'math-01');const next=E.chooseQuestion(C.questions,'math-01',{lastQuestion:first.id});
 assert.notEqual(first.id,next.id);assert.equal(first.notionId,next.notionId);assert.equal(next.correct,1);
});
test('une variante ne récupère pas le tableau chiffré d’un autre énoncé',()=>{
 assert.ok(C.questions.find(q=>q.id==='q-math-18').table);
 assert.equal(C.questions.find(q=>q.id==='v-math-18').table,undefined);
});
test('les dates de la frise correspondent à des repères sourcés',()=>{
 const years=C.timeline.map(t=>C.notions.find(n=>n.id===t.id).year);
 assert.ok(years.every(Number.isInteger));
 assert.deepEqual([...years].sort((a,b)=>a-b),[...years]);
});
test('dossiers et productions ont des clés distinctes et des corrections cohérentes',()=>{
 assert.equal(new Set(C.cases.map(p=>p.id)).size,C.cases.length);
 C.cases.forEach(p=>{assert.ok(p.context.toLowerCase().includes('fictif'));assert.ok(p.correction);assert.ok(p.cards.every(c=>['Constat','Organisation','Vigilance','Hors sujet'].includes(c.group)));});
 const order=C.microExercises.find(m=>m.type==='order');assert.deepEqual([...order.order].sort(),[0,1,2,3]);
});
test('fichiers du site tous servis et liens internes couverts',()=>{
 const html=fs.readFileSync('index.html','utf8'),server=fs.readFileSync('server.js','utf8');
 for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)){assert.ok(fs.existsSync(url),url);assert.ok(server.includes("'"+url+"'"),url);}
});
console.log(JSON.stringify({notions:C.notions.length,questions:C.questions.length,variants:C.questions.filter(q=>q.variant).length,rooms:C.rooms.length,cases:C.cases.length,micro:C.microExercises.length,categories:Object.fromEntries(C.topics.map(t=>[t,C.notions.filter(n=>n.category===t).length]))}));
