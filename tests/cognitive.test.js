const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../engine.js');
function setup(){
 const ctx={window:{},document:{addEventListener(){}},console};vm.createContext(ctx);
 for(const file of ['content.js',...['catalog','exercises','knowledge','current-affairs','palace','practical-cases','finalize','mindmaps'].map(n=>'data/'+n+'.js')])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
 ctx.C=ctx.window.LAB_CONTENT;ctx.E=E;ctx.state=E.empty();ctx.roomIndex=0;ctx.practiceStarted=0;ctx.palaceReturn='';ctx.source=()=>'';
 ctx.esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 ctx.btn=(text,action,extra='',cls='')=>`<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
 ctx.heading=(k,t,d)=>`<h1>${t}</h1><p>${d}</p>`;
 ctx.notion=id=>ctx.C.notions.find(n=>n.id===id);ctx.status=n=>[E.mastery(ctx.state.progress[n.id])];ctx.mastery=n=>E.mastery(ctx.state.progress[n.id]);
 for(const file of ['learning-ui.js','cognitive-ui.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
 return ctx;
}
test('cartes mentales : références valides et aucune modification du corpus',()=>{
 const ctx=setup(),C=ctx.C;assert.equal(C.notions.length,108);assert.equal(C.questions.length,145);
 const ids=new Set();for(const m of C.mindmaps){assert.ok(!ids.has(m.id));ids.add(m.id);for(const b of m.branches){assert.ok(b.notions.length);b.notions.forEach(id=>assert.ok(C.notions.some(n=>n.id===id),id));if(b.room)assert.ok(C.rooms.some(r=>r.id===b.room),b.room);}}
 assert.equal(vm.runInContext("mapForNotion('dg-02').map.id",ctx),'dgfip');
});
test('retourner un locus conserve la position et donne le bon état ARIA',()=>{
 const ctx=setup();const front=vm.runInContext('locusCard(C.rooms[0].objects[0],0)',ctx);
 const back=vm.runInContext('flippedLoci.add(0);locusCard(C.rooms[0].objects[0],0)',ctx);
 for(const html of [front,back])assert.match(html,/locus slot-left/);
 assert.match(front,/aria-pressed="false"/);assert.match(back,/aria-pressed="true"/);
 assert.match(back,/flip-front" aria-hidden="true"/);assert.match(back,/flip-back" aria-hidden="false"/);
 assert.match(back,/Assiette de l’impôt/);
});
test('un atelier guidé ne rend qu’une étape, le mode complet conserve les quatre',()=>{
 const ctx=setup();const first=vm.runInContext('cognitivePracticeView()',ctx);
 assert.match(first,/id="practice-brief"/);assert.doesNotMatch(first,/id="practice-draft"/);assert.doesNotMatch(first,/id="group-0"/);
 ctx.state.drafts['workshop-accueil']=JSON.stringify({step:3,done:[0,1,2]});ctx.state.drafts.practice='Brouillon ancien';
 const last=vm.runInContext('cognitivePracticeView()',ctx);assert.match(last,/Brouillon ancien/);assert.doesNotMatch(last,/id="practice-brief"/);
 const full=vm.runInContext("practiceMode='complete';cognitivePracticeView()",ctx);
 for(const id of ['practice-brief','group-0','plan','practice-draft'])assert.equal((full.match(new RegExp('id="'+id+'"','g'))||[]).length,1);
});
test('le parcours mental ne montre qu’une pièce et préserve le brouillon V2',()=>{
 const ctx=setup();ctx.state.drafts['global-missions']='Assiette et loupe';
 const html=vm.runInContext('mentalJourney()',ctx);assert.match(html,/Assiette et loupe/);assert.match(html,/Pièce 1\/8/);assert.doesNotMatch(html,/Le bureau des usagers/);
});
test('déplier une carte ne donne aucun point et la reprise ne change pas les évaluations',()=>{
 const ctx=setup();E.review(ctx.state,'dg-02',2);const before=JSON.stringify(ctx.state);
 vm.runInContext("cognitiveMap='dgfip';mapBranches.add('dgfip-fiscalite');mapNotion='dg-05';cognitiveMapView();cognitivePalaceView();",ctx);
 assert.equal(JSON.stringify(ctx.state),before);
});
test('préférences et atelier restent compatibles avec la validation V1',()=>{
 const s=E.empty();s.drafts['workshop-lecture']=JSON.stringify({step:2,done:[0,1]});s.drafts['brief-lecture']='Une fiche pour les agents';s.drafts['practice-lecture']='Ancien texte';
 const restored=E.validate(JSON.parse(JSON.stringify(s)),[]);assert.deepEqual(restored.drafts,s.drafts);
 const ctx=setup();ctx.state.drafts['workshop-accueil']='null';assert.equal(vm.runInContext('practiceStageState().step',ctx),0);
});
test('contrastes des tokens principaux des deux thèmes : texte et action',()=>{
 const lum=hex=>{const c=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 const css=fs.readFileSync('style.css','utf8'),tokens=body=>Object.fromEntries([...body.matchAll(/--([\w-]+):#([0-9a-f]{3,6})/g)].map(([,k,v])=>[k,v.length===3?v.split('').map(x=>x+x).join(''):v]));
 const dark=tokens([...css.matchAll(/:root\{([^}]+)\}/g)].map(m=>m[1]).join(';')),light={...dark,...tokens(css.match(/html\[data-theme=light\]\{([^}]+)\}/)[1])};
 for(const t of [dark,light])for(const key of ['text','muted','institution','history','digital'])assert.ok(ratio(t[key],t.panel)>=4.5,key);
 assert.ok(ratio('ffffff',light.accent)>=4.5);assert.ok(ratio('10251c',dark.accent)>=4.5);
});
