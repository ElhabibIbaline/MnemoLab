/* V2.1 : état de présentation uniquement. Les connaissances et le moteur restent ceux de V2. */
let cognitiveMap='concours',mapBranches=new Set(),mapNotion='',mapZoom=1,palaceZoom=1,flippedLoci=new Set(),guidedReady=false,mentalIndex=0,mentalRevealed=false,practiceMode='guided',practiceStep=0,libraryPage=0;
const cognitiveTools=[['map','🌳','Comprendre','Cartes mentales'],['palace','🏛️','Mémoriser','Palais de mémoire'],['practice','📝','Appliquer','Cas pratique']];
function cognitiveRefresh(focus){render();if(!focus)$('#main').focus({preventScroll:true});if(focus){const el=$(focus);el?.focus({preventScroll:true});el?.scrollIntoView({block:'nearest'});}}
function initCognitiveTheme(){
 let theme='dark';try{theme=localStorage.getItem(KEY+'-theme')==='light'?'light':'dark';}catch{}
 applyCognitiveTheme(theme);
 $('#theme').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';applyCognitiveTheme(next);try{localStorage.setItem(KEY+'-theme',next);}catch{toast('Thème appliqué pour cette visite ; stockage indisponible.');}});
}
function applyCognitiveTheme(theme){document.documentElement.dataset.theme=theme;$('#theme').textContent=theme==='light'?'☾ Thème sombre':'☀ Thème clair';$('#theme').setAttribute('aria-label',theme==='light'?'Activer le thème sombre':'Activer le thème clair');}
function cognitiveDashboard(){
 const count=adaptiveIds(10).length,days=E.examDays(state),fragile=studied().filter(n=>mastery(n)==='Fragile').length;
 return heading('📊 Décider quoi travailler','Votre prochain pas.',days>=0?`Écrits dans ${days} jour${days>1?'s':''} · priorité aux rappels et aux erreurs.`:'Consolidez vos acquis à votre rythme.')+
 `<section class="card cognitive-hero"><span class="eyebrow">Priorité du jour</span><h2>${due().length?due().length+' notions attendent votre rappel.':fragile?fragile+' notions à consolider.':'Réactivez vos repères.'}</h2><p>${count} rappels ciblés, puis un entraînement. Une chose à la fois.</p>${btn('🧠 Commencer mes rappels','priority-recall','','primary')}<details><summary>Pourquoi cette priorité ?</summary><p>Les notions dues et fragiles passent d’abord. Jusqu’à ${E.newAllowance(state,10)} nouveautés encore proposées aujourd’hui. Les intervalles tiennent compte des écrits.</p></details></section>
 <section aria-label="Choisir une durée" class="duration-strip"><span>Mon temps disponible</span>${[5,15,30].map(m=>btn(m+' min','quick',`data-minutes="${m}"`)).join('')}</section>
 <div class="intent-tools">${cognitiveTools.map(([route,icon,verb,title])=>`<a class="intent-tool" href="#${route}"><span>${icon}</span><strong>${verb}</strong><small>${title} →</small></a>`).join('')}</div>
 <div class="row secondary-routes"><a href="#qcm">✅ Vérifier en QCM</a><a href="#errors">↻ Revoir mes erreurs</a></div>
 <details class="card compact-details"><summary>Ma situation · ${mastered().length}/${C.notions.length} notions maîtrisées</summary><p>${studied().length} étudiées · ${fragile} fragiles · ${due().length} dues aujourd’hui.</p><a href="#progress">Voir ma progression →</a><p class="muted">La maîtrise concerne la banque intégrée, pas tout le programme.</p></details>`;
}
function zoomControls(kind,value){return `<div class="row zoom-tools" aria-label="Taille de la carte">${btn('−',kind+'-zoom',`data-delta="-0.1" aria-label="Réduire la carte" ${value<=.9?'disabled':''}`)}<output>${Math.round(value*100)} %</output>${btn('+',kind+'-zoom',`data-delta="0.1" aria-label="Agrandir la carte" ${value>=1.2?'disabled':''}`)}${btn('Recentrer',kind+'-center')}</div>`;}
function masteryBrief(ids){const ns=ids.map(notion).filter(Boolean),g=ns.filter(n=>mastery(n)==='Maîtrisé').length,f=ns.filter(n=>mastery(n)==='Fragile').length;return `<small>${f?'△ '+f+' fragiles · ':''}✓ ${g}/${ns.length} maîtrisées</small>`;}
function cognitiveMapView(){
 const map=C.mindmaps.find(m=>m.id===cognitiveMap);
 return heading('🌳 Comprendre les relations','Cartes mentales','Déployez une branche. Choisissez une notion. Reliez avant de mémoriser.')+
 `<div class="map-selector" aria-label="Choisir une carte">${[{id:'concours',title:'Concours'},...C.mindmaps].map(m=>btn(m.title,'mind-select',`data-id="${m.id}" aria-pressed="${cognitiveMap===m.id}"`,cognitiveMap===m.id?'selected':'')).join('')}</div>`+
 zoomControls('mind',mapZoom)+`<p class="pan-hint">↔ Faites défiler la carte horizontalement si nécessaire.</p><div class="spatial-viewport" tabindex="0" role="region" aria-label="Carte mentale défilante"><div class="mind-canvas ${map?'tone-'+map.tone:''}" style="--map-zoom:${mapZoom}"><div class="mind-root">${map?map.icon+' '+map.title:'🎯 Concours C → DGFiP'}</div><ul class="tree-branches">${map?map.branches.map(b=>mindBranch(map,b)).join(''):competitionBranches()}</ul></div></div><p class="source">Arbre pédagogique simplifié · comprendre ici, mémoriser au palais, rappeler en flashcard.</p>`;
}
function mindToggle(id,title,body,small=''){const open=mapBranches.has(id);return `<li class="tree-branch"><button class="branch-node" data-action="mind-toggle" data-id="${id}" aria-expanded="${open}" aria-controls="branch-${id}"><span>${open?'−':'+'} ${title}</span>${small}</button><div id="branch-${id}" class="branch-content" ${open?'':'hidden'}>${body}</div></li>`;}
function competitionBranches(){
 const qcm=C.topics.map(t=>{const mapId=t==='DGFiP'?'dgfip':t==='Ministères économiques et financiers'||t==='EMC'?'institutions':t==='Histoire'||t==='Géographie'?'reperes':t==='Numérique'?'numerique':null;
 const ids=C.notions.filter(n=>n.category===t).map(n=>n.id);
 return `<li>${btn(esc(t)+masteryBrief(ids),mapId?'mind-select':'mind-topic',mapId?`data-id="${mapId}"`:`data-topic="${esc(t)}"`,'topic-node tone-'+categoryTone(t))}</li>`;}).join('');
 return mindToggle('competition-qcm','✅ QCM',`<ul class="topic-nodes">${qcm}</ul>`,masteryBrief(C.notions.map(n=>n.id)))+
 mindToggle('competition-practice','📝 Cas pratique',`<p>Repérer → trier → hiérarchiser → produire.</p><a class="action-link" href="#practice">Ouvrir l’atelier →</a>`)+
 mindToggle('competition-oral','◌ Oral',`<p>Présentation, motivation et situations professionnelles.</p><a href="#oral">Préparer après les écrits →</a>`);
}
function mindBranch(map,b){
 const body=`<p class="relation-label">${b.relation}</p><ul class="notion-nodes">${b.notions.map(id=>{const n=notion(id),open=mapNotion===id;return `<li><button data-action="mind-notion" data-id="${id}" aria-expanded="${open}" aria-controls="mind-${id}">${esc(n.title)} <small>${status(n)[0]}</small></button><div id="mind-${id}" class="micro-explanation" ${open?'':'hidden'}><strong>${esc(n.answer)}</strong><details><summary>Explication et source</summary><p>${esc(n.explanation)}</p>${source(n)}</details>${btn('🧠 Rappeler cette notion','recall-one',`data-id="${id}"`,'link')}</div></li>`;}).join('')}</ul>${b.room?btn('🧠 Mémoriser cette branche','mind-memorize',`data-room="${b.room}"`,'primary branch-memory'):''}`;
 return mindToggle(map.id+'-'+b.id,b.title,body,masteryBrief(b.notions));
}
function mapForNotion(id){for(const m of C.mindmaps){const b=m.branches.find(b=>b.notions.includes(id));if(b)return {map:m,branch:b};}return null;}
function cognitivePalaceView(){
 if(palaceMode==='timeline')return timelineView();
 if(palaceMode==='global')return mentalJourney();
 if(palaceMode==='hall')return palaceHall();
 if(palaceMode==='test')return palaceTest();
 const r=C.rooms[roomIndex];
 return heading('🏛️ Mémoriser · '+r.wing,r.title,'Retournez un objet sur place pour lui associer sa notion.')+
 `<div class="row palace-controls">${btn('← Hall','palace-hall')}${btn('Visite guidée','guided-palace','','quiet')}${btn('Tester ma mémoire','test-room','','primary')}${palaceReturn?btn('Retour au QCM →','palace-return'):''}</div>`+
 `<p class="pan-hint">↔ Sur petit écran, faites défiler la pièce. Les emplacements restent fixes.</p><div class="spatial-viewport room-viewport" tabindex="0" role="region" aria-label="Pièce à positions fixes"><section class="room flip-room"><div class="room-grid">${r.objects.map((o,i)=>locusCard(o,i)).join('')}</div><div class="room-path">ENTRÉE → GAUCHE → CENTRE → DROITE → FOND</div></section></div>`+
 (palaceMode==='guided'?`<div class="guided-bar" aria-live="polite"><span>${guidedReady?'Fermez les yeux et refaites le trajet.':`Repère ${guidedIndex+1}/4 · ${r.objects[guidedIndex].position}`}</span><div class="row">${guidedIndex>0&&!guidedReady?btn('← Précédent','guided-prev'):''}${btn(guidedReady?'Tester ma mémoire':guidedIndex===3?'Terminer la visite →':'Objet suivant →',guidedReady?'test-room':'guided-next','','primary')}</div></div>`:'')+
 `<details><summary>La micro-histoire de la pièce</summary><p>${esc(r.story)}</p></details><dialog id="locus-dialog" aria-labelledby="locus-dialog-title"></dialog>`;
}
function locusCard(o,i){
 const n=notion(o.id),flipped=flippedLoci.has(i),cue=o.recallCue||(n.answer.length<5?n.title:n.answer);
 return `<article class="locus slot-${o.slot} ${palaceMode==='guided'&&i===guidedIndex?'is-current':''}"><button class="flip-card ${flipped?'is-flipped':''}" data-action="flip-locus" data-index="${i}" aria-pressed="${flipped}" aria-label="${esc((flipped?'Masquer':'Révéler')+' · '+o.position+' · '+o.label)}"><span class="flip-inner"><span class="flip-face flip-front" aria-hidden="${flipped}"><small>${o.position}</small><span class="emoji">${o.icon}</span><strong>${esc(o.label)}</strong><small>Retourner ↶</small></span><span class="flip-face flip-back" aria-hidden="${!flipped}"><small>${o.position} · ${o.icon}</small><strong>${esc(cue)}</strong><span>${esc(o.association)}</span><small>Masquer ↶</small></span></span></button>${flipped?btn('Détail / carte mentale','locus-detail',`data-index="${i}" aria-label="Détail de ${esc(o.label)}"`,'link locus-detail'):''}</article>`;
}
function palaceHall(){return heading('🏛️ Mémoriser dans l’espace','Le palais du concours','Du hall à une aile, puis à une pièce. Gardez toujours les mêmes repères.')+zoomControls('palace',palaceZoom)+`<p class="pan-hint">↔ Faites défiler la carte pour explorer les trois ailes.</p><div class="spatial-viewport" tabindex="0" role="region" aria-label="Plan du palais"><div class="palace-plan" style="--map-zoom:${palaceZoom}"><div class="mind-root">🏛️ HALL</div><ul class="tree-branches">${C.palaceWings.map(w=>`<li class="tree-branch wing-${w.id==='Repères'?'history':'institution'}"><div class="wing-sign"><small>${w.direction}</small><h2>${w.icon} ${w.id}</h2></div><div class="door-row">${C.rooms.map((r,i)=>r.wing===w.id?btn(`<span>🚪</span><strong>${r.title}</strong><small>4 objets</small>`,'room',`data-index="${i}"`,'place-door'):'').join('')}</div></li>`).join('')}</ul></div></div><div class="row palace-entry-actions">${btn('Faire le parcours mental global →','global-palace','','primary')}${btn('Reconstruire la frise','timeline')}</div>`;}
function mentalJourney(){
 const r=C.rooms[mentalIndex];
 return heading('🧠 Parcours mental',r.title,'Quels objets se trouvent ici ? Retrouvez leurs positions et leurs notions.')+`<nav class="breadcrumbs" aria-label="Votre position"><span>🏛️ Hall</span><span>→ ${r.wing}</span><strong>→ ${r.door}</strong></nav><section class="card mental-stage"><span class="eyebrow">Pièce ${mentalIndex+1}/${C.rooms.length}</span><div class="empty-room" aria-hidden="true">${['GAUCHE','CENTRE','DROITE','FOND'].map(p=>`<span>${p}<b>?</b></span>`).join('')}</div><label for="mental-answer">Votre tentative, même partielle</label><textarea id="mental-answer" data-draft="global-${r.id}" placeholder="À gauche… Au centre…">${esc(state.drafts['global-'+r.id]||'')}</textarea>${mentalRevealed?`<div class="feedback">${r.objects.map(o=>`<p>${o.position} · ${o.icon} ${o.label} → ${esc(o.recallCue||notion(o.id).answer)}</p>`).join('')}</div>${btn('Évaluer cette pièce','room-test-direct',`data-index="${mentalIndex}"`,'link')}`:btn('Révéler après ma tentative','mental-reveal','','primary')}<p id="mental-hint" role="status"></p></section><div class="row between">${btn('← Hall','palace-hall')}<div class="row">${btn('← Pièce précédente','mental-prev',mentalIndex===0?'disabled':'')}${btn(mentalIndex===C.rooms.length-1?'Terminer le parcours':'Pièce suivante →','mental-next')}</div></div>`;
}
function palaceTest(){
 const r=C.rooms[roomIndex],labels=['Objet → notion','Notion → objet','Objet manquant','Pièce vide','Correction'],correction=palaceStep===4;
 return heading('🧠 Rappel progressif',r.title,`Niveau ${Math.min(palaceStep+1,4)}/4 · ${labels[palaceStep]}`)+`<div class="row">${btn('← Revenir à la pièce','test-exit')}${palaceReturn?btn('Retour au QCM →','palace-return'):''}</div><ol class="stage-track">${labels.slice(0,4).map((l,i)=>`<li ${i===palaceStep?'aria-current="step"':''}>${i+1}. ${l}</li>`).join('')}</ol>`+
 (correction?`<section class="card"><h2>Comparer, puis évaluer</h2>${r.objects.map(o=>`<p><strong>${o.position} · ${o.icon} ${o.label}</strong><br>${esc(o.association)}</p>`).join('')}<details><summary>Mes tentatives</summary>${Object.entries(palaceAnswers).map(([step,text])=>`<h3>${labels[step]}</h3><pre>${esc(text)}</pre>`).join('')}</details>${[...new Set(r.objects.map(o=>o.id))].map(id=>`<div id="palace-rating-${id}"><h3>${esc(notion(id).title)}</h3>${palaceRatings.has(id)?'<p>✓ Évaluation enregistrée</p>':ratings('palace-rate',`data-id="${id}"`)}</div>`).join('')}</section>`:
 `<div class="spatial-viewport" tabindex="0" role="region" aria-label="Pièce de rappel"><div class="room test-room"><div class="room-grid">${r.objects.map((o,i)=>`<div class="recall-locus slot-${o.slot}"><small>${o.position}</small><strong>${palaceStep===0||palaceStep===2&&i!==1?o.icon:palaceStep===1?esc(o.recallCue||notion(o.id).title):'?'}</strong></div>`).join('')}</div><div class="room-path">ENTRÉE</div></div></div><section class="card exercise"><h2>${['Que représente chaque objet ?','Quels objets représentent ces notions ?','Quel objet manque au centre ? Que représente-t-il ?','Restituez le parcours complet sans indice.'][palaceStep]}</h2><label for="palace-recall">Votre réponse (ou rappel mental)</label><textarea id="palace-recall">${esc(palaceAnswers[palaceStep]||'')}</textarea><div class="row">${btn(palaceStep===3?'Comparer avec la correction':'Niveau suivant →','palace-next','','primary')}${btn('Voir la correction','reveal-room','','link')}</div></section>`);
}
function practiceStageState(){try{const s=JSON.parse(state.drafts['workshop-'+activeCase]||'{}');return {step:Number.isInteger(s.step)?Math.max(0,Math.min(3,s.step)):0,done:Array.isArray(s.done)?s.done.filter(n=>Number.isInteger(n)&&n>=0&&n<=3):[]};}catch{return {step:0,done:[]};}}
function savePracticeStep(done=false){const s=practiceStageState();if(done&&!s.done.includes(practiceStep))s.done.push(practiceStep);s.step=practiceStep;state.drafts['workshop-'+activeCase]=JSON.stringify(s);save();}
function dossierReference(){return `<details class="dossier-reference"><summary>📂 Revoir la commande et les documents</summary><p>${esc(currentCase().context)}</p><ol>${currentCase().cards.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ol></details>`;}
function practiceBrief(){const p=currentCase();return `<section class="card workshop-stage"><span class="eyebrow">🔎 Repérer</span><h2>Quelle est la commande ?</h2><p>${esc(p.context)}</p><label for="practice-brief">Destinataire, livrable et contraintes : reformulez la demande.</label><textarea id="practice-brief" data-draft="brief-${activeCase}">${esc(state.drafts['brief-'+activeCase]||'')}</textarea><details><summary>Consulter les documents</summary><ol>${p.cards.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ol></details></section>`;}
function practiceSort(){return `<section class="card workshop-stage"><span class="eyebrow">🗂️ Trier</span><h2>À quoi sert chaque information ?</h2><p class="muted">Ouvrez une information à la fois. Choisissez son thème et sa priorité.</p>${currentCase().cards.map((c,i)=>`<details class="sort-card" ${i===0?'open':''}><summary>Information ${i+1} · ${esc(c.text.slice(0,65))}…</summary><p>${esc(c.text)}</p><label for="group-${i}">Thème de l’information ${i+1}</label><select id="group-${i}"><option value="">Choisir…</option>${['Constat','Organisation','Vigilance','Hors sujet'].map(x=>`<option>${x}</option>`).join('')}</select><label for="priority-${i}">Priorité de l’information ${i+1}</label><select id="priority-${i}"><option value="">Choisir…</option><option>Essentiel</option><option>Secondaire</option></select></details>`).join('')}${btn('Vérifier mon classement','check-sort') }<div id="sort-feedback" aria-live="polite"></div></section>`;}
function practicePlan(){return `<section class="card workshop-stage"><span class="eyebrow">🧩 Hiérarchiser</span><h2>Construisez le fil de votre réponse.</h2>${dossierReference()}<label for="plan">Votre plan en quelques lignes</label><textarea id="plan" data-draft="${caseDraft('plan')}" placeholder="1. Constat…\n2. Organisation…\n3. Vigilance…">${esc(state.drafts[caseDraft('plan')]||'')}</textarea><details><summary>Un repère de méthode</summary><p>Reliez chaque partie à la commande. Placez les informations essentielles avant les détails ; conservez les points de vigilance.</p></details></section>`;}
function practiceProduce(){const p=currentCase();return `<section class="card workshop-stage"><span class="eyebrow">📝 Produire</span><h2>Rédigez une réponse utilisable.</h2>${dossierReference()}<details><summary>Relire mon plan</summary><pre>${esc(state.drafts[caseDraft('plan')]||'Aucun plan rédigé.')}</pre></details><label for="practice-draft">${p.targetMin} à ${p.targetMax} mots · respecter le livrable demandé</label><textarea id="practice-draft" data-draft="${caseDraft('practice')}" class="production-draft">${esc(state.drafts[caseDraft('practice')]||'')}</textarea><small id="word-count"></small><details><summary>Comparer avec une proposition de correction</summary><pre>${esc(p.correction)}</pre><p>Vérifiez : commande respectée, faits fidèles, essentiels présents, formulation claire. Proposition pédagogique sans notation automatique.</p></details></section>`;}
function cognitivePracticeView(){
 const p=currentCase(),s=practiceStageState();practiceStep=s.step;
 return heading('📝 Appliquer','L’atelier du cas pratique',practiceMode==='guided'?'Une intention à la fois. Vos brouillons restent sauvegardés.':'Mini-dossier en environnement complet · ce n’est pas une épreuve blanche de trois heures.')+
 `<div class="row between workshop-toolbar"><div class="row" aria-label="Mode de travail">${btn('Apprentissage guidé','practice-mode','data-mode="guided" aria-pressed="'+(practiceMode==='guided')+'"',practiceMode==='guided'?'selected':'')}${btn('Examen · dossier complet','practice-mode','data-mode="complete" aria-pressed="'+(practiceMode==='complete')+'"',practiceMode==='complete'?'selected':'')}</div><label>Dossier <select id="case-select">${C.cases.map(c=>`<option value="${c.id}" ${c.id===activeCase?'selected':''}>${esc(c.title)}</option>`).join('')}</select></label></div>`+
 `<div class="row between"><strong>${esc(p.title)}</strong><div class="row">${btn(practiceStarted?'Recommencer le chrono':'Chrono · 15 min','practice-clock','','quiet')}<span id="practice-clock" class="timer"></span></div></div>`+
 (practiceMode==='guided'?`<ol class="stage-track">${['Repérer','Trier','Hiérarchiser','Produire'].map((l,i)=>`<li ${i===practiceStep?'aria-current="step"':''}>${btn((s.done.includes(i)?'✓ ':i+1+'. ')+l,'practice-step',`data-index="${i}" ${i>s.step&&!s.done.includes(i-1)?'disabled':''}`)}</li>`).join('')}</ol>${[practiceBrief,practiceSort,practicePlan,practiceProduce][practiceStep]()}<p id="step-feedback" role="status"></p><div class="row between step-navigation">${btn('← Étape précédente','practice-back',practiceStep===0?'disabled':'')}${btn(practiceStep===3?'Terminer et relire':'Valider et continuer →','practice-next','','primary')}</div>`:
 `<div class="complete-workshop"><div>${practiceBrief()}${practiceSort()}</div><div>${practicePlan()}${practiceProduce()}</div></div>`)+
 `<details class="micro-workshop" ${activeMicro?'open':''}><summary>Travailler une micro-compétence séparément</summary><div class="row">${C.microExercises.map(m=>btn(m.skill,'micro',`data-id="${m.id}"`)).join('')}</div><div id="micro-panel">${activeMicro?microView():''}</div></details><p class="source"><a href="${C.sources.zeroCase.url}" target="_blank" rel="noopener">Sujet zéro officiel 2026 ↗</a> · Dossiers et exercices fictifs.</p>`;
}
function openLocusDetail(index){
 const o=C.rooms[roomIndex].objects[index],n=notion(o.id),map=mapForNotion(o.id),dialog=$('#locus-dialog');
 dialog.innerHTML=`<div class="row between"><h2 id="locus-dialog-title">${o.icon} ${esc(n.title)}</h2>${btn('Fermer','close-locus','aria-label="Fermer le détail"')}</div><p>${esc(n.answer)}</p><p>${esc(n.explanation)}</p><details><summary>Source et entraînement</summary>${source(n)}</details>${map?btn('🌳 Voir dans la carte mentale','locus-map',`data-id="${n.id}"`,'primary'):''}`;
 dialog.dataset.returnIndex=index;dialog.showModal();
}
function handleCognitiveAction(b){
 const a=b.dataset.action,id=b.dataset.id,index=Number(b.dataset.index);
 switch(a){
  case 'library-prev':libraryPage=Math.max(0,libraryPage-1);filterLibrary();break;
  case 'library-next':libraryPage++;filterLibrary();break;
  case 'mind-select':cognitiveMap=id;mapNotion='';mapBranches.clear();cognitiveRefresh();break;
  case 'mind-toggle':mapBranches.has(id)?mapBranches.delete(id):mapBranches.add(id);cognitiveRefresh(`[data-action="mind-toggle"][data-id="${id}"]`);break;
  case 'mind-notion':mapNotion=mapNotion===id?'':id;cognitiveRefresh(`[data-action="mind-notion"][data-id="${id}"]`);break;
  case 'mind-topic':libraryCategory=b.dataset.topic;libraryQuery='';flash=null;go('flashcards');break;
  case 'mind-memorize':roomIndex=C.rooms.findIndex(r=>r.id===b.dataset.room);palaceMode='explore';flippedLoci.clear();palaceReturn='';go('palace');break;
  case 'mind-zoom':mapZoom=Math.max(.9,Math.min(1.2,Math.round((mapZoom+Number(b.dataset.delta))*10)/10));cognitiveRefresh();break;
  case 'palace-zoom':palaceZoom=Math.max(.9,Math.min(1.2,Math.round((palaceZoom+Number(b.dataset.delta))*10)/10));cognitiveRefresh();break;
  case 'mind-center':mapZoom=1;cognitiveRefresh();{const v=$('.spatial-viewport');v.scrollLeft=(v.scrollWidth-v.clientWidth)/2;}break;
  case 'palace-center':palaceZoom=1;cognitiveRefresh();{const v=$('.spatial-viewport');v.scrollLeft=(v.scrollWidth-v.clientWidth)/2;}break;
  case 'room':roomIndex=index;palaceMode='explore';flippedLoci.clear();palaceRatings.clear();palaceAnswers={};cognitiveRefresh();break;
  case 'flip-locus':{const isFlipped=!flippedLoci.has(index),o=C.rooms[roomIndex].objects[index];
   if(isFlipped)flippedLoci.add(index);else flippedLoci.delete(index);
   b.classList.toggle('is-flipped',isFlipped);b.setAttribute('aria-pressed',String(isFlipped));b.setAttribute('aria-label',(isFlipped?'Masquer':'Révéler')+' · '+o.position+' · '+o.label);
   b.querySelector('.flip-front').setAttribute('aria-hidden',String(isFlipped));b.querySelector('.flip-back').setAttribute('aria-hidden',String(!isFlipped));
   const locus=b.closest('.locus');locus.querySelector('.locus-detail')?.remove();
   if(isFlipped)locus.insertAdjacentHTML('beforeend',btn('Détail / carte mentale','locus-detail',`data-index="${index}" aria-label="Détail de ${esc(o.label)}"`,'link locus-detail'));break;}
  case 'locus-detail':openLocusDetail(index);break;
  case 'close-locus':{const d=$('#locus-dialog'),i=d.dataset.returnIndex;d.close();$(`[data-action="locus-detail"][data-index="${i}"]`)?.focus();break;}
  case 'locus-map':{const found=mapForNotion(id);if(found){$('#locus-dialog')?.close();cognitiveMap=found.map.id;mapBranches=new Set([found.map.id+'-'+found.branch.id]);mapNotion=id;go('map');}break;}
  case 'guided-palace':palaceMode='guided';guidedIndex=0;guidedReady=false;flippedLoci=new Set([0]);cognitiveRefresh(`[data-action="flip-locus"][data-index="0"]`);break;
  case 'guided-next':if(guidedIndex<3){guidedIndex++;flippedLoci=new Set([guidedIndex]);}else{guidedReady=true;flippedLoci.clear();}cognitiveRefresh(guidedReady?'.guided-bar button':`[data-action="flip-locus"][data-index="${guidedIndex}"]`);break;
  case 'guided-prev':guidedIndex=Math.max(0,guidedIndex-1);guidedReady=false;flippedLoci=new Set([guidedIndex]);cognitiveRefresh();break;
  case 'palace-link':roomIndex=C.rooms.findIndex(r=>r.objects.some(o=>o.id===id));palaceReturn=view==='qcm'?'qcm':'';palaceMode='guided';guidedIndex=C.rooms[roomIndex].objects.findIndex(o=>o.id===id);guidedReady=false;flippedLoci=new Set([guidedIndex]);$('#locus-dialog')?.close();go('palace');break;
  case 'test-exit':palaceMode='explore';flippedLoci.clear();cognitiveRefresh();break;
  case 'global-palace':palaceMode='global';mentalIndex=0;mentalRevealed=false;cognitiveRefresh();break;
  case 'mental-reveal':if(!$('#mental-answer').value.trim()){$('#mental-hint').textContent='Notez une tentative, même « je ne sais plus », avant de vérifier.';$('#mental-answer').focus();}else{mentalRevealed=true;cognitiveRefresh();}break;
  case 'mental-prev':mentalIndex=Math.max(0,mentalIndex-1);mentalRevealed=false;cognitiveRefresh();break;
  case 'mental-next':if(mentalIndex===C.rooms.length-1){palaceMode='hall';}else{mentalIndex++;}mentalRevealed=false;cognitiveRefresh();break;
  case 'practice-mode':practiceMode=b.dataset.mode;cognitiveRefresh();break;
  case 'practice-step':practiceStep=index;savePracticeStep();cognitiveRefresh();break;
  case 'practice-back':practiceStep=Math.max(0,practiceStep-1);savePracticeStep();cognitiveRefresh();break;
  case 'practice-next':{let ready=true;
   if(practiceStep===0)ready=!!$('#practice-brief').value.trim();
   if(practiceStep===1)ready=currentCase().cards.every((c,i)=>$('#group-'+i).value&&$('#priority-'+i).value);
   if(practiceStep===2)ready=!!$('#plan').value.trim();
   if(practiceStep===3)ready=!!$('#practice-draft').value.trim();
   if(!ready){$('#step-feedback').textContent='Faites une tentative dans chaque champ de cette étape avant de continuer.';$('#step-feedback').scrollIntoView({block:'nearest'});break;}
   savePracticeStep(true);if(practiceStep<3){practiceStep++;savePracticeStep();cognitiveRefresh();$('#main').scrollIntoView({block:'start'});}else{$('#step-feedback').innerHTML='<div class="feedback">✓ Atelier terminé. Relisez votre production et comparez avec la proposition de correction. Vos brouillons sont conservés.</div>';}break;
  }
  default:return false;
 }
 return true;
}
function categoryTone(topic){return topic==='Numérique'?'digital':['Histoire','Géographie'].includes(topic)?'history':['Mathématiques','Logique'].includes(topic)?'numeric':'institution';}
function enhanceCognitiveView(){
 const active=view==='flashcards'&&flash&&flash.index<flash.ids.length?notion(flash.ids[flash.index]):view==='qcm'&&quiz&&!quiz.finished?question(quiz.ids[quiz.index]):null;
 $('#main').dataset.tone=active?categoryTone(active.category):'';
 if(view==='practice'){restoreSort();wordCount();tick();}
}
document.addEventListener('change',event=>{if(event.target.id==='case-select'){activeCase=event.target.value;activeMicro=null;practiceStarted=0;cognitiveRefresh();}});
