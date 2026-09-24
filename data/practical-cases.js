(() => {
 const C=window.LAB_CONTENT;
 C.practice.id='accueil';C.practice.targetMin=120;C.practice.targetMax=180;
 C.cases.push(C.practice,{
  id:'lecture',title:'Une médiathèque prépare ses ateliers',targetMin:80,targetMax:120,
  context:'Mini-dossier entièrement fictif. En 15 minutes, préparez une fiche opérationnelle de 80 à 120 mots à destination des agents : constat, organisation, vigilance. Utilisez uniquement les documents ci-dessous.',
  cards:[
   {text:'Document 1 — bilan fictif : 60 inscriptions au printemps, 90 à l’automne. Les horaires des deux périodes sont identiques.',group:'Constat',priority:'Essentiel'},
   {text:'Document 2 — décision : deux ateliers seront proposés le mercredi à partir du 14 octobre.',group:'Organisation',priority:'Essentiel'},
   {text:'Document 2 — chaque atelier dispose de 12 places ; l’inscription préalable est nécessaire.',group:'Organisation',priority:'Essentiel'},
   {text:'Document 3 — accueil : proposer une inscription sur place aux personnes qui ne peuvent pas utiliser le formulaire numérique.',group:'Vigilance',priority:'Essentiel'},
   {text:'Document 3 — évaluation : relever le nombre de participants et les demandes non satisfaites après chaque atelier.',group:'Vigilance',priority:'Essentiel'},
   {text:'Document 1 — le logo de la médiathèque a changé de couleur l’an dernier.',group:'Hors sujet',priority:'Secondaire'}
  ],correction:'Fiche agents — ateliers à partir du 14 octobre\n\nConstat : les inscriptions passent de 60 au printemps à 90 à l’automne, soit 30 inscriptions supplémentaires et une hausse de 50 %. Les horaires sont restés identiques.\n\nOrganisation : deux ateliers sont proposés le mercredi. Chacun dispose de 12 places et nécessite une inscription préalable.\n\nVigilance : proposer une inscription sur place aux personnes ne pouvant pas utiliser le formulaire numérique. Après chaque atelier, relever le nombre de participants et les demandes non satisfaites afin de disposer d’un suivi.\n\nNe pas utiliser le changement de logo, sans rapport avec la demande.'
 },{
  id:'energie',title:'Réduire la consommation d’un bâtiment',targetMin:90,targetMax:140,
  context:'Mini-dossier entièrement fictif. Produisez en 15 minutes un support de communication de 90 à 140 mots organisé en quatre blocs : constat, objectif, gestes, suivi. Aucun dessin décoratif n’est nécessaire ; un message utile par bloc.',
  cards:[
   {text:'Document 1 — tableau fictif : consommation 2024 = 100 unités ; 2025 = 90 unités, à périmètre identique.',group:'Constat',priority:'Essentiel'},
   {text:'Document 2 — note : poursuivre la réduction des usages inutiles sans dégrader l’accueil du public.',group:'Organisation',priority:'Essentiel'},
   {text:'Document 2 — consigne : éteindre l’éclairage des salles inoccupées à la fin de leur utilisation.',group:'Organisation',priority:'Essentiel'},
   {text:'Document 3 — consigne : ne pas éteindre les équipements explicitement signalés comme devant rester en service.',group:'Vigilance',priority:'Essentiel'},
   {text:'Document 3 — suivi : relever la consommation chaque mois et comparer des périodes comparables.',group:'Vigilance',priority:'Essentiel'},
   {text:'Document 1 — le bâtiment est représenté sur une ancienne carte postale.',group:'Hors sujet',priority:'Secondaire'}
  ],correction:'CONSOMMATION : AGIR ET SUIVRE\n\nConstat — À périmètre identique, la consommation est passée de 100 unités en 2024 à 90 en 2025, soit une baisse de 10 %.\n\nObjectif — Poursuivre la réduction des usages inutiles tout en préservant la qualité de l’accueil du public.\n\nGestes — À la fin de l’utilisation d’une salle, éteindre l’éclairage lorsqu’elle est inoccupée. Respecter les indications sur les équipements : ceux signalés comme devant rester en service ne doivent pas être éteints.\n\nSuivi — Effectuer un relevé mensuel de consommation. Comparer des périodes comparables pour apprécier les évolutions, sans attribuer automatiquement toute variation à un seul geste.'
 });
 C.microExercises=[
  {id:'brief',skill:'Repérer',title:'Lire une commande',prompt:'Commande fictive : « Informez les agents, avant vendredi, de la nouvelle procédure dans un courriel de 100 mots. » Relevez le destinataire, le livrable, l’échéance et la contrainte.',answer:'Destinataire : agents. Livrable : courriel. Échéance : avant vendredi. Contrainte : 100 mots.',type:'free'},
  {id:'facts',skill:'Trier',title:'Fait ou interprétation ?',prompt:'Document fictif : « 80 demandes ont été traitées, contre 100 l’an dernier. » Peut-on écrire que les agents travaillent moins ? Justifiez.',answer:'Non. Le document établit une baisse du nombre de demandes traitées, pas sa cause. La charge, les moyens ou la complexité ne sont pas précisés.',type:'free'},
  {id:'synthesis',skill:'Synthétiser',title:'Une phrase, deux sources',prompt:'Documents fictifs : A : « Le délai moyen passe de 10 à 7 jours. » B : « Les usagers sans accès numérique doivent être accompagnés. » Rédigez une phrase qui conserve résultat et vigilance.',answer:'Le délai moyen diminue de 10 à 7 jours, mais l’accompagnement des usagers sans accès numérique doit être maintenu. On ne déduit pas une causalité absente des documents.',type:'free'},
  {id:'order',skill:'Hiérarchiser',title:'Construire l’ordre d’un message',prompt:'Remettez ces blocs dans l’ordre proposé : exposer le constat, annoncer l’action, préciser les modalités, indiquer le suivi.',type:'order',items:['Indiquer comment le résultat sera suivi','Présenter le problème constaté','Préciser qui agit et quand','Annoncer la mesure retenue'],order:[1,3,2,0],answer:'Constat → mesure → qui et quand → suivi. Ce plan répond successivement à pourquoi, quoi, comment et comment vérifier.'},
  {id:'visual',skill:'Produire',title:'Choisir quatre blocs utiles',prompt:'Pour un support visuel sur une nouvelle permanence, quels quatre blocs d’information aideraient concrètement l’usager ?',answer:'Exemple : à quoi sert la permanence ; à qui elle s’adresse ; quand et où venir ; comment prendre rendez-vous. Les couleurs ou pictogrammes servent à repérer ces informations.',type:'free'}
 ];
})();
