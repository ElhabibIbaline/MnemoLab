/* V2 : registre de contenu. Aucune progression n'est écrite par ces fichiers. */
(() => {
 const C=window.LAB_CONTENT;
 const verifiedAt='2026-09-24';
 const entries={
  zeroQcm:['Sujet zéro 2026 — QCM','https://rejoindrelesfinancespubliques.economie.gouv.fr//files/files/concours/Sujets_zero/CCC%20-%202026%20-%20Sujet%20test%20-%20%C3%89preuve%20de%20pr%C3%A9admissibilit%C3%A9.pdf','Sujet officiel'],
  zeroCase:['Sujet zéro 2026 — cas pratique','https://rejoindrelesfinancespubliques.economie.gouv.fr/files/files/concours/Sujets_zero/CCC%20-%202026%20-%20sujet%20test%20-%20admissibilit%C3%A9.pdf','Sujet officiel'],
  constitution:['Constitution — Légifrance','https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000571356/','Texte officiel'],
  history:['Éducation nationale — repères historiques','https://eduscol.education.gouv.fr/sites/default/files/document/spe626annexe1104409pdf-85491.pdf','Programme officiel'],
  europe:['Commission européenne — comprendre l’UE','https://france.representation.ec.europa.eu/leurope-comment-ca-marche_fr','Institution européenne'],
  euHistory:['Union européenne — traités fondateurs','https://european-union.europa.eu/principles-countries-history/principles-and-values/founding-agreements_en','Institution européenne'],
  overseas:['Insee — départements d’outre-mer','https://www.insee.fr/fr/metadonnees/definition/c2031','Institut public'],
  regions:['Insee — région et compétences','https://www.insee.fr/fr/metadonnees/definition/c1502','Institut public'],
  atlas:['Insee / IGN — carte des territoires','https://www.insee.fr/fr/statistiques/fichier/1288766/ter-1-2-1_regions_francaises.pdf','Carte officielle historique'],
  services:['DGFiP — services aux usagers','https://www.economie.gouv.fr/dgfip/comprendre-la-dgfip/nos-services','Administration'],
  online:['DGFiP — services en ligne','https://www.economie.gouv.fr/dgfip/services-en-ligne','Administration'],
  org:['Ministères économiques et financiers — organigrammes','https://www.economie.gouv.fr/actualites/organigrammes-directionnels','Administration'],
  customs:['Douane — missions','https://www.douane.gouv.fr/la-douane/qui-sommes-nous/les-missions-de-la-douane-francaise','Administration'],
  competition:['DGCCRF — missions','https://www.economie.gouv.fr/dgccrf/comprendre-la-dgccrf/les-missions-de-la-dgccrf','Administration'],
  treasury:['DG Trésor — missions','https://www.tresor.economie.gouv.fr/services-aux-entreprises/la-direction-generale-du-tresor','Administration'],
  budget:['Direction du Budget — présentation','https://www.budget.gouv.fr/files/files/publications%20direction/RA/plaquette_corporate_DB_2019_web.pdf','Administration — présentation 2019, missions générales'],
  insee:['Insee — statistique publique','https://www.insee.fr/fr/information/1302230','Institut public'],
  cyber:['Cybermalveillance.gouv.fr — dix mesures essentielles','https://www.cybermalveillance.gouv.fr/tous-nos-contenus/bonnes-pratiques/10-mesures-essentielles-assurer-securite-numerique','Service public'],
  privacy:['CNIL — donnée personnelle','https://www.cnil.fr/fr/definition/donnee-personnelle','Autorité publique indépendante'],
  cookies:['CNIL — cookie','https://cnil.fr/fr/definition/cookie','Autorité publique indépendante'],
  inflation:['Insee — inflation','https://www.insee.fr/fr/metadonnees/definition/c1473','Institut public'],
  gdp:['Insee — PIB','https://www.insee.fr/fr/metadonnees/definition/c1365','Institut public'],
  unemployment:['Insee — chômage au sens du BIT','https://www.insee.fr/fr/metadonnees/definition/c1129','Institut public'],
  poverty:['Insee — niveau de vie et pauvreté','https://www.insee.fr/fr/statistiques/7941411','Institut public'],
  cop:['CCNUCC — COP30','https://unfccc.int/cop30/about-cop30','Organisation internationale'],
  un:['Nations unies — présentation','https://www.un.org/fr/','Organisation internationale'],
  sdg:['ONU — programme 2030','https://www.un.org/sustainabledevelopment/fr/development-agenda/','Organisation internationale']
 };
 Object.entries(entries).forEach(([id,[label,url,type]])=>C.sources[id]={label,url,type,verifiedAt});
 Object.values(C.sources).forEach(s=>{s.verifiedAt??=verifiedAt;s.type??='Administration';});
 C.questions=[];C.currentAffairs=[];C.cases=[];C.microExercises=[];
 C.addNotion=function(category,source,rows){
  rows.forEach(([id,title,question,answer,choices,correct,explanation,mnemonic,extra={}])=>{
   C.notions.push({id,notionId:id,category,title,question,answer,choices,correct,explanation,mnemonic,difficulty:1,priority:2,source,sourceUrl:C.sources[source]?.url,sourceType:C.sources[source]?.type,verifiedAt,updated:verifiedAt,status:source?'Source officielle · question originale':'Exercice original · données fictives',...extra});
  });
 };
 C.addVariant=function(notionId,id,question,choices,correct,explanation){
  const n=C.notions.find(n=>n.id===notionId);
  if(!n)throw Error('Notion inconnue : '+notionId);
  C.questions.push({...n,table:undefined,id,notionId,question,choices,correct,answer:choices[correct],explanation,variant:true});
 };
})();
