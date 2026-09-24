/* Relations pédagogiques V2.1 : références aux notions V2, sans duplication du contenu. */
(() => {
 const C=window.LAB_CONTENT;
 C.mindmaps=[
  {id:'dgfip',title:'DGFiP',icon:'🏛️',tone:'institution',branches:[
   {id:'fiscalite',title:'Fiscalité',relation:'Établir → vérifier → percevoir',room:'missions',notions:['dg-05','dg-06','dg-07','dg-02']},
   {id:'gestion',title:'Gestion publique',relation:'Des comptes, des dépenses et un patrimoine',room:'comptes',notions:['dg-03','dg-08','dg-09','dg-10']},
   {id:'usagers',title:'Services aux usagers',relation:'Identifier le bon interlocuteur',room:'guichets',notions:['dg-11','dg-12','dg-13','dg-14','dg-16']}
  ]},
  {id:'institutions',title:'Institutions',icon:'⚖️',tone:'institution',branches:[
   {id:'directions',title:'Les directions de Bercy',relation:'Une administration, des missions distinctes',room:'bercy',notions:['min-01','min-03','min-05','min-06','min-07','min-08']},
   {id:'principes',title:'Principes de la République',relation:'Valeurs et souveraineté',room:'republique',notions:['emc-01','emc-02','emc-03','emc-09']},
   {id:'pouvoirs',title:'Institutions françaises',relation:'Distinguer les fonctions',room:'republique',notions:['emc-04','emc-05','emc-06','emc-07','emc-08']}
  ]},
  {id:'reperes',title:'Repères',icon:'🧭',tone:'history',branches:[
   {id:'droits',title:'Conquête des droits',relation:'Situer les repères dans le temps',room:'dates',notions:['hist-01','hist-02','hist-03','hist-04','hist-05','hist-06','hist-07']},
   {id:'europe',title:'France et Europe',relation:'Traités, régime et espaces',room:'europe',notions:['hist-08','hist-10','hist-11','geo-05','geo-06','geo-07']}
  ]},
  {id:'numerique',title:'Numérique',icon:'🛡️',tone:'digital',branches:[
   {id:'proteger',title:'Protéger ses usages',relation:'Repérer le piège → protéger → sauvegarder',room:'numerique',notions:['num-01','num-04','num-05','num-06']},
   {id:'pratiquer',title:'Comprendre les outils',relation:'Des notions pour agir',notions:['num-02','num-03','num-07','num-08','num-09','num-10','num-11']}
  ]}
 ];
})();
