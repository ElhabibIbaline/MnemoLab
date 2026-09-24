(() => {
 const C=window.LAB_CONTENT;
 C.addNotion('Actualité économique','inflation',[
 ['eco-01','Inflation','L’inflation correspond à…','Une hausse générale et durable des prix',['La hausse d’un seul prix','Une hausse générale et durable des prix','Une hausse de production','Une hausse du seul salaire moyen'],1,'Il s’agit d’un phénomène d’ensemble, pas du prix isolé d’un produit.','Un panier entier monte dans un ascenseur.'],
 ['eco-02','Mesurer les prix','Quel indicateur sert à évaluer l’inflation en France ?','L’indice des prix à la consommation',['Le seul taux de chômage','Le PIB nominal','L’indice des prix à la consommation','Le nombre de contribuables'],2,'L’IPC observe les prix à la consommation ; il ne couvre pas tous les prix de l’économie.','Une règle mesure le panier.'],
 ['eco-03','Ralentissement des prix','Dans un exemple fictif, l’inflation annuelle passe de 5 % à 2 %. Que peut-on dire ?','Les prix augmentent moins vite',['Tous les prix baissent','Les prix augmentent moins vite','Le niveau des prix revient au départ','Les salaires augmentent de 2 %'],1,'Un taux positif plus faible reste une hausse ; ce n’est pas une baisse générale des prix.','L’ascenseur monte encore, mais ralentit.']
 ]);
 C.addNotion('Actualité économique','gdp',[
 ['eco-04','PIB','Le PIB mesure principalement…','La richesse créée sur un territoire pendant une période',['Le patrimoine total des ménages','La dette totale de l’État','La richesse créée sur un territoire pendant une période','Le seul montant des impôts'],2,'Il décrit un flux de production, pas un stock de patrimoine.','Un compteur de production tourne pendant l’année.']
 ]);
 C.addNotion('Actualité sociale','unemployment',[
 ['soc-01','Chômage au sens du BIT','Quelle combinaison résume les trois conditions du chômage BIT ?','Sans emploi, disponible, en recherche active (ou emploi trouvé commençant prochainement)',['Sans emploi uniquement','Inscrit à France Travail uniquement','Sans emploi, disponible, en recherche active (ou emploi trouvé commençant prochainement)','Retraité et sans activité'],2,'Les conditions sont cumulatives ; l’inscription administrative ne suffit pas à définir le chômage BIT.','Trois verrous : sans emploi, disponible, recherche.']
 ]);
 C.addNotion('Actualité sociale','poverty',[
 ['soc-02','Pauvreté monétaire','Le seuil usuel de pauvreté monétaire est fixé à quelle part du niveau de vie médian ?','60 %',['40 %','50 %','60 %','80 %'],2,'C’est une mesure relative au niveau de vie médian. Ce pourcentage n’est pas la part de personnes pauvres.','Une ligne à 60 sur une règle du niveau de vie.']
 ]);
 C.addNotion('Actualité internationale','cop',[
 ['int-01','COP30','Dans quel pays s’est tenue la COP30 à Belém en 2025 ?','Le Brésil',['L’Inde','Le Brésil','L’Afrique du Sud','L’Indonésie'],1,'Cette conférence s’inscrit dans les négociations internationales sur le climat.','Une feuille amazonienne porte COP30.',{evolving:true,eventDate:'2025-11'}]
 ]);
 C.addNotion('Actualité internationale','sdg',[
 ['int-02','Agenda 2030','Les 17 objectifs de développement durable visent quel horizon ?','2030',['2025','2030','2040','2050'],1,'Ils ont été adoptés par les États membres de l’ONU en 2015.','17 marches conduisent à une porte 2030.']
 ]);
 C.addNotion('Actualité internationale','un',[
 ['int-03','ONU','Quel objectif fondateur majeur porte l’ONU créée en 1945 ?','Maintenir la paix et la sécurité internationales',['Fixer un impôt mondial','Remplacer tous les États','Maintenir la paix et la sécurité internationales','Créer une monnaie mondiale'],2,'La coopération internationale est au cœur de l’organisation.','Une colombe protège un globe marqué 1945.']
 ]);
 C.currentAffairs=[
  {id:'prices',title:'Prix et pouvoir d’achat',date:'2026-09-24',kind:'Thème durable, sans chiffre conjoncturel',context:'Les débats sur les prix exigent de distinguer niveau des prix et vitesse de leur hausse.',keys:['Inflation','IPC','Ralentissement'],why:'Éviter de confondre ralentissement de l’inflation et baisse des prix.',notionIds:['eco-01','eco-02','eco-03'],source:'inflation',question:'Si l’inflation ralentit mais reste positive, les prix baissent-ils ?'},
  {id:'production',title:'Production et richesse',date:'2026-09-24',kind:'Thème durable, sans prévision',context:'Le PIB est fréquemment mobilisé dans les débats sur l’activité économique.',keys:['PIB','Production','Période'],why:'Lire un indicateur sans le confondre avec la richesse patrimoniale.',notionIds:['eco-04'],source:'gdp',question:'Le PIB représente-t-il un stock ou un flux ?'},
  {id:'employment',title:'Emploi et mesure du chômage',date:'2026-09-24',kind:'Thème durable, sans taux actuel',context:'Des indicateurs différents peuvent décrire des populations différentes.',keys:['BIT','Disponibilité','Recherche active'],why:'Ne pas assimiler automatiquement inscription administrative et chômage statistique.',notionIds:['soc-01'],source:'unemployment',question:'Être sans emploi suffit-il à être chômeur au sens du BIT ?'},
  {id:'poverty',title:'Inégalités et pauvreté',date:'2026-09-24',kind:'Thème durable ; définition seulement',context:'Le seuil monétaire relatif permet de comparer les niveaux de vie à une référence médiane.',keys:['Niveau de vie','Médiane','Seuil relatif'],why:'Distinguer le seuil utilisé et le taux de pauvreté observé.',notionIds:['soc-02'],source:'poverty',question:'Les 60 % désignent-ils la proportion de personnes pauvres ?'},
  {id:'climate',title:'COP30 et coopération climatique',date:'2025-11',kind:'Événement daté — pas un bilan exhaustif',context:'Belém, au Brésil, a accueilli la COP30 en 2025.',keys:['Climat','Négociations','Coopération'],why:'Situer les grandes rencontres internationales sans mémoriser des détails anecdotiques.',notionIds:['int-01'],source:'cop',question:'Quel pays a accueilli la COP30 ?'},
  {id:'development',title:'Développement durable',date:'2015',kind:'Cadre adopté en 2015, horizon 2030',context:'Les objectifs de développement durable organisent une action internationale commune.',keys:['17 ODD','ONU','2030'],why:'Relier enjeux sociaux, économiques et environnementaux.',notionIds:['int-02','int-03'],source:'sdg',question:'Quel horizon est associé aux ODD ?'}
 ].map(f=>({...f,verifiedAt:'2026-09-24',reviewAfter:'2026-10-01',sourceUrl:C.sources[f.source].url,sourceType:C.sources[f.source].type}));
})();
