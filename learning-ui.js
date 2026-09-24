/* Vues pédagogiques V2, sur le moteur et la navigation existants. */
let palaceMode='hall',guidedIndex=0,palaceStep=0,palaceAnswers={},palaceRatings=new Set(),palaceReturn='',activeCase='accueil',activeMicro=null,orderDraft=[],libraryCategory='all',libraryQuery='',timelineChecked=false;
const currentCase=()=>C.cases.find(p=>p.id===activeCase)||C.practice;
const caseDraft=kind=>activeCase==='accueil'?kind:`${kind}-${activeCase}`;
const adaptiveIds=count=>E.adaptive(C.notions,state,count).map(n=>n.id);

function learningLinks(n){
 const id=n.notionId||n.id,room=C.rooms.find(r=>r.objects.some(o=>o.id===id));
 return `<div class="row learning-links">${room?btn('⌂ Revoir dans le palais','palace-link',`data-id="${id}"`,'link'):''}${btn('Essayer une question liée →','related-quiz',`data-id="${id}"`,'link')}</div>`;
}
function topicMastery(topic){
 const ns=C.notions.filter(n=>n.category===topic),counts={'Non étudié':0,'Fragile':0,'En cours':0,'Maîtrisé':0};
 ns.forEach(n=>counts[E.mastery(state.progress[n.id])]++);
 return `<span class="mastery-counts">○ ${counts['Non étudié']} non étudiées · △ ${counts.Fragile} fragiles · ◐ ${counts['En cours']} en cours · ✓ ${counts.Maîtrisé} maîtrisées</span>`;
}
function tableFor(n){return n.table?`<table class="learning-table"><caption>Données fictives de l’exercice</caption><thead><tr>${n.table.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${n.table.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'';}
function enhanceView(){
 $('#nav').insertAdjacentHTML('beforeend','<a class="mobile-settings" href="#settings">Sauvegardes & sources</a>');
 if(view==='map')document.querySelectorAll('[data-action="topic"]').forEach(b=>{b.innerHTML=esc(b.dataset.topic)+topicMastery(b.dataset.topic);});
 if(view==='flashcards'&&!flash){
  const grid=$('#main > .grid');
  grid.insertAdjacentHTML('beforebegin',`<div class="form-grid"><div><label for="library-category">Filtrer les notions</label><select id="library-category"><option value="all">Toutes les matières</option>${C.topics.map(t=>`<option ${libraryCategory===t?'selected':''}>${esc(t)}</option>`).join('')}</select></div><div><label for="library-query">Chercher une notion</label><input id="library-query" type="search" value="${esc(libraryQuery)}" placeholder="Cadastre, fractions, République…"></div></div><p id="library-count" class="muted"></p>`);
  filterLibrary();
 }
 if(view==='flashcards'&&flash&&flash.index<flash.ids.length){
  const n=notion(flash.ids[flash.index]);$('.question')?.insertAdjacentHTML('afterend',tableFor(n));
 }
 if(view==='qcm'&&quiz&&!quiz.finished){const n=question(quiz.ids[quiz.index]);$('.question')?.insertAdjacentHTML('afterend',tableFor(n));}
 if(view==='progress'){
  const box=$('#main > .callout');
  box.innerHTML='<strong>Révision intensive et maîtrise</strong><p>Les délais habituels sont conservés, mais avant les écrits une échéance ne dépasse pas la moitié du temps encore disponible. Les anciennes échéances trop lointaines sont rapprochées une seule fois lors du passage en V2.</p><p>Pour les nouvelles révisions, « maîtrisé » demande un niveau ≥ 3, trois réussites et des rappels réussis sur au moins deux jours. Une échéance due ou une difficulté remet la notion parmi les fragilités. Ouvrir une fiche ne donne aucun point. La maîtrise héritée de V1 est conservée jusqu’à sa prochaine évaluation.</p><p>Nouveautés automatiques : au plus 8 par jour de J−6 à J−4, 3 de J−3 à J−2, aucune à J−1 et le jour J. Les révisions déjà vues restent disponibles ; la bibliothèque permet toujours un choix explicite.</p>';
 }
 if(view==='settings'){
  const paragraph=$('#main .grid > section:nth-child(2) p.muted');
  paragraph.textContent=`${C.notions.length} notions, ${C.questions.length} questions dont ${C.questions.filter(q=>q.variant).length} variantes, ${C.rooms.length} pièces et ${C.currentAffairs.length} fiches thématiques datées. ${C.cases.length} dossiers fictifs et ${C.microExercises.length} micro-exercices. Corpus ciblé, non exhaustif ; pas de veille automatique de l’actualité.`;
  try{if(localStorage.getItem(KEY+'-before-v2'))$('#main .grid > section').insertAdjacentHTML('beforeend',`<p>${btn('Exporter la copie antérieure à la V2','export-v1')}</p>`);}catch{}
 }
}
function filterLibrary(){
 const matches=C.notions.filter(n=>(libraryCategory==='all'||n.category===libraryCategory)&&`${n.title} ${n.question} ${n.category}`.toLocaleLowerCase('fr').includes(libraryQuery.toLocaleLowerCase('fr')));
 const pages=Math.max(1,Math.ceil(matches.length/12));libraryPage=Math.min(libraryPage,pages-1);
 const ids=new Set(matches.slice(libraryPage*12,(libraryPage+1)*12).map(n=>n.id));
 document.querySelectorAll('#main > .grid > article').forEach((card,i)=>{card.hidden=!ids.has(C.notions[i].id);});
 if($('#library-count'))$('#library-count').textContent=`${matches.length} notions · page ${libraryPage+1}/${pages}`;
 if(!$('#library-pagination'))$('#library-count').insertAdjacentHTML('afterend','<div id="library-pagination" class="row" aria-label="Pages de notions"></div>');
 $('#library-pagination').innerHTML=btn('← Précédentes','library-prev',libraryPage===0?'disabled':'')+btn('Suivantes →','library-next',libraryPage>=pages-1?'disabled':'');
}

function palaceView(){
 if(palaceMode==='timeline')return timelineView();
 if(palaceMode==='hall')return heading('Un lieu pour chaque connaissance','Le palais du concours','Entrez par le hall. Choisissez une aile, puis suivez toujours le même chemin.')+`<section class="palace-hall"><div class="hall-door"><span>🏛️</span><h2>HALL</h2><p>Trois ailes. Des objets à positions fixes.</p></div><div class="palace-wings">${C.palaceWings.map(w=>`<section class="wing"><div class="eyebrow">${w.direction}</div><h2>${w.icon} ${w.id}</h2><p class="muted">${w.description}</p>${C.rooms.map((r,i)=>r.wing===w.id?btn(`<span>🚪</span> ${r.title}<small>${r.objects.length} objets · ${new Set(r.objects.map(o=>o.id)).size} notions</small>`,'room',`data-index="${i}"`,'room-door'):'').join('')}</section>`).join('')}</div></section><div class="row">${btn('Faire le parcours mental global →','global-palace','','primary')}${btn('Reconstruire la frise','timeline')}<small>Les associations sont pédagogiques, pas des locaux réels.</small></div>`;
 if(palaceMode==='global')return heading('Sans indice','Votre parcours mental','Partez du hall, puis reconstruisez chaque pièce sans ouvrir vos notes.')+`<div class="row">${btn('← Revenir au hall','palace-hall')}</div><div class="mental-path"><strong>HALL</strong>${C.rooms.map((r,i)=>`<section class="card"><span class="number">${r.wing} · ${r.door}</span><h2>${r.title}</h2><label for="global-${i}">Quels objets et quelles notions retrouve-t-on ?</label><textarea id="global-${i}" data-draft="global-${r.id}">${esc(state.drafts['global-'+r.id]||'')}</textarea><details><summary>Vérifier cette pièce</summary>${r.objects.map(o=>`<p>${o.position} · ${o.icon} ${o.label} → ${notion(o.id).answer}</p>`).join('')}${btn('Évaluer le rappel de cette pièce','room-test-direct',`data-index="${i}"`)}</details></section>`).join('')}</div>`;
 const r=C.rooms[roomIndex],testing=palaceMode==='test',correction=testing&&palaceStep===4;
 const stepNames=['Objets → notions','L’objet manquant','Notions → objets','Rappel libre','Correction et évaluation'];
 const hiddenObjects=testing&&palaceStep>=2&&palaceStep<4;
 const objects=r.objects.map((o,i)=>{
  const hidden=hiddenObjects||(testing&&palaceStep===1&&i===1),hideLabels=testing&&palaceStep<4;
  return btn(`<small>${o.position}</small><span class="emoji">${hidden?'?':o.icon}</span><span>${hideLabels?'Repère '+(i+1):o.label}</span>`,'object',`data-index="${i}" ${testing?'disabled':''} aria-label="${esc(hideLabels?o.position+', repère '+(i+1):o.position+', '+o.label)}"`,'object slot-'+o.slot+(palaceMode==='guided'&&i===guidedIndex?' current':''));
 }).join('');
 return heading(r.wing+' / '+r.door,r.title,testing?`Étape ${palaceStep+1}/5 · ${stepNames[palaceStep]}`:r.subtitle)+`<div class="row">${btn('← Hall','palace-hall')}${btn('Visite guidée','guided-palace')}${btn('Tester cette pièce','test-room','','primary')}${palaceReturn?btn('Retour au QCM →','palace-return'):''}</div><section class="room spatial-room"><div class="room-grid">${objects}</div><div class="room-path">ENTRÉE → GAUCHE → CENTRE → DROITE → FOND</div></section>${!testing?`<details><summary>La micro-histoire de cette pièce</summary><p>${r.story}</p></details><div id="object-detail" aria-live="polite">${palaceMode==='guided'?guidedObject():''}</div>`:correction?`<section class="card"><h2>Vérifiez sans vous surévaluer</h2>${r.objects.map(o=>`<div class="item"><strong>${o.position} · ${o.icon} ${o.label}</strong><p>${o.association}</p><small>${notion(o.id).answer}</small></div>`).join('')}<details><summary>Revoir mes réponses</summary>${Object.entries(palaceAnswers).map(([step,text])=>`<p><strong>${stepNames[step]}</strong></p><pre>${esc(text)}</pre>`).join('')}</details>${[...new Set(r.objects.map(o=>o.id))].map(id=>`<div id="palace-rating-${id}"><h3>${notion(id).title}</h3>${palaceRatings.has(id)?'<p>✓ Évaluation enregistrée</p>':ratings('palace-rate',`data-id="${id}"`)}${source(notion(id))}</div>`).join('')}</section>`:`<section class="card"><h2>${[
 'Que représente chacun des quatre objets ?',
 'Quel objet manque au centre ? Que représente-t-il ?',
 'À chaque notion ci-dessous, associez l’objet et sa position.',
 'Sans indice : restituez toutes les notions de la pièce.'
 ][palaceStep]}</h2>${palaceStep===2?`<ul>${r.objects.map(o=>`<li>${o.recallCue||notion(o.id).title}</li>`).join('')}</ul>`:''}<label for="palace-recall">Votre réponse (ou rappel mental)</label><textarea id="palace-recall">${esc(palaceAnswers[palaceStep]||'')}</textarea><div class="row">${btn(palaceStep===3?'Révéler et comparer →':'Étape suivante →','palace-next','','primary')}${btn('Passer à la correction','reveal-room')}</div></section>`}`;
}
function guidedObject(){
 const r=C.rooms[roomIndex],o=r.objects[guidedIndex],n=notion(o.id);
 return `<div class="feedback"><span class="eyebrow">Repère ${guidedIndex+1}/${r.objects.length} · ${o.position}</span><h2>${o.icon} ${o.label}</h2><p>${o.association}</p><strong>${n.answer}</strong><p>${n.explanation}</p>${source(n)}<div class="row">${guidedIndex>0?btn('← Objet précédent','guided-prev'):''}${btn(guidedIndex===r.objects.length-1?'Cacher et rappeler →':'Objet suivant →','guided-next','','primary')}</div></div>`;
}
function affairsView(){return heading('Comprendre les grands thèmes','Fiches d’actualité','Des repères datés, à distinguer des faits de dernière minute.')+`<div class="callout">Les fiches ci-dessous sont des thèmes structurants ou des événements explicitement datés. Elles ne constituent pas une revue exhaustive de septembre 2026. Vérifiez les sources avant de mémoriser une donnée évolutive.</div><div class="grid two">${C.currentAffairs.map(f=>`<article class="card"><span class="badge">${f.kind}</span><h2>${f.title}</h2><small>Contexte : ${f.date} · vérifié le ${f.verifiedAt}</small><p>${f.context}</p><div class="row">${f.keys.map(k=>`<span class="badge">${k}</span>`).join('')}</div><p><strong>Pourquoi le travailler ?</strong> ${f.why}</p><p>${f.question}</p>${btn('Rappeler ces notions →','affair-review',`data-id="${f.id}"`,'primary')}<p class="source"><a href="${f.sourceUrl}" target="_blank" rel="noopener">${C.sources[f.source].label} ↗</a> · ${f.sourceType}${Date.now()>new Date(f.reviewAfter+'T00:00:00')?' · À revérifier avant usage':''}</p></article>`).join('')}</div>`;}
function practiceExtras(){
 return `<section class="card practice-menu"><div class="row between"><h2>Ateliers courts et dossiers</h2><a href="${C.sources.zeroCase.url}" target="_blank" rel="noopener">Sujet zéro officiel 2026 ↗</a></div><p class="muted">Le sujet zéro combine des réponses courtes, une synthèse et un support visuel. Ici, les données sont fictives et les exercices plus courts : ils entraînent la méthode, sans reproduire une épreuve complète.</p><div class="row">${C.cases.map(p=>btn(p.title,'select-case',`data-id="${p.id}"`,activeCase===p.id?'primary':'')).join('')}</div><h3 style="margin-top:20px">Une micro-compétence en 3 minutes</h3><div class="row">${C.microExercises.map(m=>btn(m.skill,'micro',`data-id="${m.id}"`)).join('')}</div><div id="micro-panel">${activeMicro?microView():''}</div></section>`;
}
function microView(){
 const m=C.microExercises.find(m=>m.id===activeMicro);
 return `<div class="callout"><h3>${m.title}</h3><p>${m.prompt}</p>${m.type==='order'?`<div class="order-list">${orderDraft.map((idx,pos)=>`<div class="order-card" draggable="true" data-order="${pos}"><span>${pos+1}. ${m.items[idx]}</span><div>${btn('↑','order-up',`data-index="${pos}" ${pos===0?'disabled':''} aria-label="Monter ${esc(m.items[idx])}"`)}${btn('↓','order-down',`data-index="${pos}" ${pos===orderDraft.length-1?'disabled':''} aria-label="Descendre ${esc(m.items[idx])}"`)}</div></div>`).join('')}</div><small>Glissez les cartes ou utilisez les flèches au clavier.</small>`:`<label for="micro-answer">Votre tentative</label><textarea id="micro-answer" data-draft="micro-${m.id}">${esc(state.drafts['micro-'+m.id]||'')}</textarea>`}${btn('Comparer mon raisonnement','micro-check','','primary')}<div id="micro-correction" aria-live="polite"></div></div>`;
}
function restoreSort(){
 let saved={};try{saved=JSON.parse(state.drafts['sort-'+activeCase]||'{}');}catch{}
 currentCase().cards.forEach((c,i)=>{if($('#group-'+i))$('#group-'+i).value=saved['group-'+i]||'';if($('#priority-'+i))$('#priority-'+i).value=saved['priority-'+i]||'';});
}
function handleLearningAction(b){
 const id=b.dataset.id,index=Number(b.dataset.index),action=b.dataset.action;
 switch(action){
  case 'timeline':palaceMode='timeline';timelineChecked=false;render();break;
  case 'timeline-check':if(!timelineChecked){C.timeline.forEach(t=>{const n=notion(t.id),value=$('#year-'+t.id).value,ok=Number(value)===n.year;if(value)E.review(state,t.id,ok?2:0,Date.now(),'timeline');$('#timeline-'+t.id).innerHTML='<div class="feedback">'+(ok?'✓ ':value?'↻ ':'')+n.year+' · '+n.explanation+'</div>';$('#year-'+t.id).disabled=true;});timelineChecked=true;save();}break;
  case 'export-v1':{const raw=localStorage.getItem(KEY+'-before-v2');if(raw){$('#import-preview').innerHTML='<label for="export-json">Copie originale avant V2 : copiez ce texte dans un fichier .json</label><textarea id="export-json" readonly></textarea>';$('#export-json').value=raw;}break;}
  case 'priority-recall':quick=null;startFlash(adaptiveIds(10));break;
  case 'palace-hall':palaceMode='hall';render();break;
  case 'room':roomIndex=index;palaceMode='explore';palaceRatings.clear();palaceAnswers={};render();break;
  case 'object':guidedIndex=index;$('#object-detail').innerHTML=guidedObject();break;
  case 'guided-palace':palaceMode='guided';guidedIndex=0;render();break;
  case 'guided-prev':guidedIndex=Math.max(0,guidedIndex-1);render();break;
  case 'guided-next':if(guidedIndex<C.rooms[roomIndex].objects.length-1){guidedIndex++;palaceMode='guided';}else{beginPalaceTest();}render();break;
  case 'test-room':beginPalaceTest();render();break;
  case 'palace-next':palaceAnswers[palaceStep]=$('#palace-recall').value;palaceStep++;render();break;
  case 'reveal-room':if($('#palace-recall'))palaceAnswers[palaceStep]=$('#palace-recall').value;palaceStep=4;palaceMode='test';render();break;
  case 'palace-rate':if(!palaceRatings.has(id)){E.review(state,id,Number(b.dataset.rating),Date.now(),'palace');palaceRatings.add(id);save();$('#palace-rating-'+id).innerHTML='<p>✓ Révision enregistrée · '+new Date(state.progress[id].nextReview).toLocaleString('fr-FR')+'</p>';}break;
  case 'global-palace':palaceMode='global';render();break;
  case 'room-test-direct':roomIndex=index;beginPalaceTest();render();break;
  case 'palace-link':roomIndex=C.rooms.findIndex(r=>r.objects.some(o=>o.id===id));palaceReturn=view==='qcm'?'qcm':'';palaceMode='guided';guidedIndex=C.rooms[roomIndex].objects.findIndex(o=>o.id===id);go('palace');break;
  case 'palace-return':go('qcm');break;
  case 'related-quiz':quick=null;startQuiz({notionIds:[id],count:1});break;
  case 'affair-review':quick=null;startFlash(C.currentAffairs.find(f=>f.id===id).notionIds);break;
  case 'select-case':activeCase=id;practiceStarted=0;activeMicro=null;render();break;
  case 'micro':activeMicro=id;orderDraft=C.microExercises.find(m=>m.id===id).items?.map((_,i)=>i)||[];$('#micro-panel').innerHTML=microView();break;
  case 'order-up':if(index>0)[orderDraft[index],orderDraft[index-1]]=[orderDraft[index-1],orderDraft[index]];$('#micro-panel').innerHTML=microView();break;
  case 'order-down':if(index<orderDraft.length-1)[orderDraft[index],orderDraft[index+1]]=[orderDraft[index+1],orderDraft[index]];$('#micro-panel').innerHTML=microView();break;
  case 'micro-check':{const m=C.microExercises.find(m=>m.id===activeMicro);$('#micro-correction').innerHTML=`<div class="feedback">${m.type==='order'?`<strong>${orderDraft.every((v,i)=>v===m.order[i])?'✓ Ordre retrouvé':'↻ Comparez l’enchaînement'}</strong>`:''}<p>${m.answer}</p></div>`;break;}
  default:return false;
 }
 return true;
}
function beginPalaceTest(){palaceMode='test';palaceStep=0;palaceAnswers={};palaceRatings.clear();}
function timelineView(){return heading('Repères dans le temps','Reconstruire la frise','Retrouvez les années avant de comparer. Les événements sont dans l’ordre chronologique.')+`<div class="row">${btn('← Hall','palace-hall')}</div><div class="timeline">${C.timeline.map(t=>`<article class="card"><h2>${t.event}</h2><label for="year-${t.id}">Année</label><input id="year-${t.id}" type="number" min="1700" max="2100" inputmode="numeric"><div id="timeline-${t.id}"></div></article>`).join('')}</div>${btn('Vérifier mes dates','timeline-check','','primary')}<p class="muted">Une vérification enregistre chaque date tentée comme un rappel ; les cases vides ne modifient pas votre progression.</p>`;}
let draggedOrder=null;
document.addEventListener('dragstart',event=>{const card=event.target.closest('[data-order]');if(card){draggedOrder=Number(card.dataset.order);event.dataTransfer.setData('text/plain',String(draggedOrder));}});
document.addEventListener('dragover',event=>{if(event.target.closest('[data-order]'))event.preventDefault();});
document.addEventListener('drop',event=>{const card=event.target.closest('[data-order]');if(!card||draggedOrder===null)return;event.preventDefault();const target=Number(card.dataset.order),[item]=orderDraft.splice(draggedOrder,1);orderDraft.splice(target,0,item);draggedOrder=null;$('#micro-panel').innerHTML=microView();});
document.addEventListener('dragend',()=>draggedOrder=null);
