# DGFiP Memory Lab — V2.1

Application personnelle de préparation au concours commun externe de catégorie C, branche administrative, objectif DGFiP. Le parcours privilégie **comprendre → cacher → rappeler → corriger → revoir**. Outil indépendant, non affilié à l’administration.

## Lancer

HTML, CSS et JavaScript classiques, sans dépendance ni compilation. Avec Node.js :

```sh
node server.js
```

Ouvrir http://127.0.0.1:4173. Arrêt : Ctrl+C. Le serveur écoute uniquement sur l’ordinateur local. Une ouverture directe de `index.html` est aussi possible, mais le serveur est préférable pour un stockage stable. `localhost`, `127.0.0.1`, un autre port, un autre navigateur et `file://` possèdent des stockages distincts. Les contenus fonctionnent hors connexion ; les sources externes nécessitent Internet.

## V2.1 : une intention par vue

La stack, les 108 notions, les 145 QCM et le moteur de progression V2 sont conservés.

- **Comprendre** : la carte du concours se déplie en QCM / cas pratique / oral. Quatre arbres complémentaires (DGFiP, institutions, repères, numérique) relient les notions existantes. Chaque branche s’ouvre et se replie ; la micro-explication reste près du nœud.
- **Mémoriser** : le hall et ses trois ailes sont reliés visuellement. Les cartes du palais se retournent sur place, avec `aria-pressed` et masquage de la face inactive aux lecteurs d’écran. Clic, toucher, Entrée et Espace sont disponibles. Les emplacements historiques sont conservés ; le repère « fond » reste dans la rangée inférieure pour ne pas déplacer les associations V2.
- **Détails sur demande** : source et développement dans une boîte de dialogue accessible, avec fermeture par Échap. Une branche conduit à sa pièce ; le détail d’un objet permet de revenir à sa carte mentale lorsqu’une relation existe.
- **Rappeler** : visite guidée, pause mentale, puis quatre niveaux : objet → notion, notion → objet, objet manquant, pièce vide. Le parcours global ne montre qu’une pièce à la fois, avec révélation après une tentative écrite. La bibliothèque affiche 12 notions par page et conserve ses filtres.
- **Appliquer** : atelier guidé en quatre étapes, retour en arrière et reprise de l’étape sauvegardée par dossier. Le mode « Examen · dossier complet » rend les quatre espaces accessibles ensemble. Valider une étape constate une tentative, pas la qualité de la rédaction ; aucune maîtrise n’est attribuée automatiquement.
- **Décider** : dashboard allégé autour d’un seul appel au rappel, trois durées, puis les accès Comprendre / Mémoriser / Appliquer. Les statistiques détaillées restent dans Progression.
- **Thèmes** : sombre par défaut, clair en option, préférence conservée dans une clé locale distincte. Palette sémantique avec libellés et symboles. Les transitions de branche et de retournement sont supprimées avec `prefers-reduced-motion`.
- **Mobile** : défilement horizontal natif des cartes spatiales ; zoom de 90 à 120 % et recentrage pour les arbres et le hall. Les objets gardent une taille lisible et les mêmes emplacements. Pas de bibliothèque graphique ni de 3D lourde.

Les nouveaux fichiers sont `data/mindmaps.js` (relations entre IDs) et `cognitive-ui.js` (vues et interactions). Les routes `#map`, `#palace` et `#practice` restent les mêmes. Les sources et l’algorithme de répétition sont inchangés dans cette itération.

Les nouveaux brouillons utilisent `brief-<dossier>` et `workshop-<dossier>`. Les textes V2 de production, plan, classement et parcours mental sont réutilisés. La préférence de thème utilise `<clé-de-progression>-theme` et n’est pas incluse dans l’export de progression.

### Ajouter une branche de carte mentale

Dans `data/mindmaps.js`, ajouter une branche à l’un des arbres :

```js
{ id: 'branche-stable', title: 'Titre', relation: 'Relation courte',
  room: 'identifiant-de-piece', notions: ['dg-05', 'dg-06'] }
```

`room` est facultatif. Les identifiants doivent déjà exister dans le corpus ; aucune réponse n’est dupliquée dans l’arbre. Lancer les tests pour vérifier les références.

## Contenu V2

La V1 et ses 15 identifiants sont conservés. La V2 contient **108 notions / flashcards, 145 QCM dont 37 variantes, 8 pièces et 32 objets fixes, une frise de 6 dates, 6 fiches thématiques datées, 3 dossiers fictifs et 5 micro-exercices**. Soit 93 nouvelles notions, 130 QCM supplémentaires et 7 nouvelles pièces.

| Domaine | Notions |
|---|---:|
| Mathématiques | 23 |
| Logique | 12 |
| DGFiP | 16 |
| Numérique | 11 |
| Histoire | 11 |
| Géographie | 9 |
| EMC | 9 |
| Ministères économiques et financiers | 8 |
| Actualité économique | 4 |
| Actualité sociale | 2 |
| Actualité internationale | 3 |

Le corpus est ciblé et non exhaustif. Les questions sont des créations pédagogiques, pas des annales officielles. La maîtrise mesure la banque intégrée, pas l’intégralité du programme. Les six fiches d’actualité présentent des grands thèmes et un événement daté ; elles ne remplacent pas une veille de septembre 2026. Aucun nom de ministre ni chiffre conjoncturel n’est ajouté sans vérification.

## Parcours

- Dashboard : rappels dus, fragilités et priorité concours ; sessions indicatives de 5/15/30 minutes.
- Bibliothèque : filtre par matière, recherche, compréhension puis réponse libre, révélation et auto-évaluation.
- QCM : entraînement avec correction immédiate ou finale ; examen simplifié avec chrono, navigation et marquage. Une question par notion dans une session ; les variantes alternent lors des tentatives suivantes.
- Erreurs : historique par notion, explications, nouvelle question liée et accès direct à la pièce correspondante. Le retour depuis le palais conserve le QCM en cours.
- Palais : hall et trois ailes, huit pièces, positions stables gauche/centre/droite/fond. Visite guidée, objet → notion, objet manquant, notion → objet, rappel libre, correction et évaluation par notion. Les trois premiers objets historiques partagent toujours la notion de chaîne fiscale : elle n’est évaluée qu’une fois par pièce.
- Parcours mental global : reconstruire chaque pièce, sauvegarder ses notes, vérifier ensuite. Frise : retrouver six années ; seules les dates tentées modifient la progression.
- Cas pratique : classement par menus accessibles ; construction d’un plan et rédaction. Trois dossiers, avec brouillons indépendants. Cinq ateliers courts : repérer, trier, synthétiser, hiérarchiser, produire. L’ordre des cartes se manipule par glisser-déposer ou flèches au clavier.
- Carte de maîtrise : non étudié, fragile, en cours, maîtrisé, avec texte et symboles. Oral V1 et mode focus conservés.

Les ateliers de rédaction ont une correction proposée et une grille de relecture ; ils ne prétendent pas noter automatiquement une synthèse. Les dossiers courts ne sont pas des épreuves blanches complètes de trois heures. Le score QCM est un taux de bonnes réponses : il ne reproduit pas le barème officiel, qui prévoit des pénalités pour les erreurs.

## Révision intensive et données

La date initiale des écrits est le **29 septembre 2026**, vérifiée sur la fiche officielle. Elle est personnalisable dans les réglages ; la convocation fait référence.

Oublié : 10 minutes ; difficile : 1 jour ; correct : 1/2/4/8 jours selon le niveau ; facile : 3/6/12/24 jours. **Avant l’épreuve, toute nouvelle échéance est plafonnée à la moitié du temps restant**. Après l’épreuve, les intervalles ordinaires reprennent. C’est une règle pratique transparente, pas un algorithme scientifiquement calibré.

Les sessions automatiques donnent priorité aux notions vues et fragiles. Nouveautés : maximum 8 par jour de J−6 à J−4, 3 de J−3 à J−2, zéro à J−1 et au jour J. La bibliothèque reste accessible pour un choix volontaire. Les sessions peuvent donc comporter moins de cartes que prévu. 5 minutes : jusqu’à 5 rappels ; 15 : rappels puis jusqu’à 5 QCM ; 30 : rappels, jusqu’à 10 QCM puis atelier pratique. Les durées sont indicatives.

La maîtrise nouvelle exige niveau ≥ 3, au moins trois réussites et des rappels réussis sur deux jours distincts. Une difficulté ou une révision due redevient fragile. Ouvrir une fiche n’accorde aucun point. Rappels, QCM, palais et frise utilisent le même identifiant de notion. Le type de rappel et la dernière question sont conservés.

La clé `dgfip-memory-lab-v1` et le schéma de sauvegarde `version: 1` restent compatibles. La première ouverture V2 valide les données, conserve compteurs, erreurs, historique et brouillons, copie le JSON original dans `dgfip-memory-lab-v1-before-v2`, puis rapproche les échéances trop lointaines. Un marqueur `contentVersion: 2` évite de répéter la migration à chaque lancement. Les identifiants inconnus valides sont préservés pour éviter une perte lors d’un import. La copie d’origine peut être exportée dans les réglages.

Les statistiques QCM comptent les sessions terminées. Une réponse déjà corrigée conserve sa révision même si la session est abandonnée. Les sessions en cours ne reprennent pas après rechargement ; les résultats terminés, rappels et brouillons persistent. Le temps actif reste une estimation.

## Architecture du contenu

- `content.js` : socle V1, identifiants historiques, première pièce et premier dossier.
- `data/catalog.js` : registre des sources et fonctions d’ajout.
- `data/exercises.js` : mathématiques, logique et variantes.
- `data/knowledge.js` : DGFiP, ministères, EMC, histoire, géographie, numérique.
- `data/current-affairs.js` : notions et fiches évolutives datées.
- `data/palace.js` : ailes, pièces, objets, associations et frise.
- `data/practical-cases.js` : dossiers et micro-exercices.
- `data/finalize.js` : normalisation et création de la banque QCM.
- `engine.js` : progression, validation, échéances et sélection adaptative.
- `app.js` : moteur UI V1, navigation et stockage.
- `learning-ui.js` : vues pédagogiques V2 et liens entre modules.
- `index.html`, `style.css`, `server.js` : chargement, thème et serveur sans dépendance.

### Ajouter une notion, une flashcard et son QCM

Dans le fichier de données approprié, avant `finalize.js` :

```js
C.addNotion('DGFiP', 'missions', [
 ['dg-nouvelle', 'Titre court', 'Une question précise ?', 'Une réponse',
  ['Choix A', 'Choix B', 'Choix C', 'Choix D'], 1,
  'Pourquoi B est correct.', 'Image mentale facultative.',
  {difficulty: 1, priority: 3, verifiedAt: '2026-09-24'}]
]);
```

Chaque notion produit une flashcard et un QCM principal `q-dg-nouvelle` dont `notionId` vaut `dg-nouvelle`. L’index de réponse commence à zéro. Remplacer l’exemple par un contenu vérifié ; ne pas réutiliser un identifiant pour une autre connaissance. La catégorie doit appartenir à `C.topics`. Pour un exercice mathématique original, utiliser `null` comme source ; ne pas prétendre qu’un organisme officiel a rédigé notre exercice.

### Ajouter une variante liée

```js
C.addVariant('dg-nouvelle', 'v-dg-nouvelle-2',
 'Une autre question sur la même connaissance ?',
 ['A', 'B', 'C', 'D'], 2, 'Explication de C.');
```

L’identifiant de notion commun alimente la même progression, le carnet d’erreurs et le palais. La variante ne récupère pas le tableau chiffré de l’énoncé principal : si nécessaire, lui attribuer son propre champ `table` (`headers`, `rows`).

### Ajouter une pièce

Dans `data/palace.js`, utiliser le constructeur `room` existant, avant la normalisation des objets :

```js
C.rooms.push(room('nouvelle-piece', 'DGFiP', 'Nom de la pièce',
 'Porte verte · quatrième couloir', 'Micro-histoire courte.', [
 ['🗝️', 'La clé', 'dg-nouvelle', 'Association concrète.'],
 ['📚', 'Les livres', 'dg-03', 'Association concrète.'],
 ['📐', 'Le plan', 'dg-13', 'Association concrète.'],
 ['🖥️', 'Le guichet', 'dg-16', 'Association concrète.']
]));
```

Quatre objets, dans l’ordre gauche/centre/droite/fond. Les positions sont ensuite normalisées et ne doivent pas être mélangées. Garder une identité distincte par objet. `recallCue` permet un indice inverse spécifique si plusieurs objets pointent sur la même notion. Les associations sont imaginaires : elles ne décrivent pas des locaux administratifs réels.

### Sources et actualité

Déclarer les sources dans `data/catalog.js` avec `label`, `url`, `type`, `verifiedAt`. Les notions exposent `source`, `sourceUrl`, `sourceType`, `verifiedAt`. Les liens sont visibles discrètement dans les corrections et les fiches ; le registre complet se trouve dans « Sauvegardes & sources ».

Une fiche évolutive ajoute `date`, `context`, `keys`, `why`, `question`, `notionIds`, `reviewAfter`. Vérifier le fond puis mettre à jour la date : un simple changement de date n’est pas une vérification. Voir [SOURCES.md](SOURCES.md) pour le périmètre de consultation et les limites des documents.

Si vous créez un nouveau fichier de données, le charger dans `index.html` après `catalog.js` et avant `finalize.js`, et l’ajouter à la liste explicite de `server.js`.

## Sauvegarde et restauration

Dans « Sauvegardes & sources », exporter le JSON et le garder hors du navigateur. Une copie textuelle apparaît aussi : la copier intégralement dans un fichier `.json` si le téléchargement est bloqué. Importer un JSON de moins de 2 Mo, lire l’aperçu, puis confirmer le remplacement. **L’import remplace, il ne fusionne pas** : exporter les données actuelles avant. Les anciennes sauvegardes V1 sont acceptées.

Le mode privé, un nettoyage ou un changement d’origine peut rendre le stockage indisponible. Une sauvegarde invalide n’est jamais écrasée automatiquement : une alerte demande d’exporter le travail. Aucun backend ni transmission distante de progression.

## Tests

```sh
node --test tests/engine.test.js tests/v2.test.js tests/cognitive.test.js tests/methodology.test.js
node --check app.js
node --check learning-ui.js
node --check cognitive-ui.js
node --check engine.js
```

29 tests couvrent identifiants, liens, sources, migration, compteurs, échéances, sélection adaptative, maîtrise, variantes, frise, fichiers servis, références des arbres, affichage séquentiel, états ARIA et contrastes des couleurs principales. Ouvrir `http://127.0.0.1:4173/?qa=1` pour tester l’interface dans un **stockage distinct**, sans toucher à la progression personnelle. Ne pas utiliser cette adresse pour les vraies révisions.

Voir [tests/VERIFICATION.md](tests/VERIFICATION.md) pour les parcours effectivement vérifiés et leurs limites.

## Atelier de méthodologie du cas pratique — 25 septembre 2026

Accès : **Cas pratique → Apprendre la méthode**, ou `#method`. Sept étapes indépendantes : décoder la commande, extraire, organiser, rédiger, communiquer, chronométrer, relire. Les trois dossiers et les modes guidé/complet restent disponibles ; chaque étape de dossier propose une aide contextuelle.

L’atelier utilise un dossier fictif de médiathèque : six passages de commande à identifier, trois documents, cinq informations à qualifier et référencer, six cartes à répartir dans un plan, quatre exercices de reformulation et une note courte annotée. Le support se construit avec quatre blocs éditables, déplaçables par boutons et prévisualisables. Sept cartes de relecture et sept rappels libres complètent le parcours. La comparaison est débloquée après une tentative, sans notation automatique des textes.

La table de travail est horizontale sur grand écran (document, exercice, aide). Sur mobile, trois boutons sélectionnent le panneau utile. Le mode « M’entraîner sans aide » place le conseil principal dans un volet à ouvrir volontairement. La frise de 180 minutes est une répartition pédagogique modifiable, distincte de la durée officielle ; elle signale les dépassements, minutes non attribuées et absence de relecture.

Le contenu est dans `data/methodology.js` (`METHOD_CONTENT`), le rendu et les interactions dans `methodology-ui.js`. Les collections `command`, `extracts`, `planCards`, `rewrites`, `support` et `checks` contiennent les exercices et propositions. Pour modifier un exercice, conserver sa position ou prévoir la migration des clés de brouillon correspondantes ; ce premier atelier est calibré pour sept étapes et quatre blocs de support. Les références documentaires des extraits doivent pointer vers `documents` ou « Aucun » pour une interprétation non fondée.

Les réponses, le budget, le mode, l’étape et l’ordre du support utilisent les clés `method-*` dans les brouillons existants. Ils sont inclus dans l’export/import habituel. Aucune migration ni suppression de progression, aucun point de maîtrise accordé pour une simple lecture. Le retournement temporaire des cartes et l’ouverture des corrections ne sont pas sauvegardés.

Les modalités et le sujet zéro ont été revérifiés le 25 septembre 2026 : liens dans le volet « Cadre officiel » et dans `SOURCES.md`. Le dossier, la note et les conseils sont des créations pédagogiques fictives, pas un corrigé officiel. Les structures de plan et la maquette ne sont pas universelles : la commande réelle prime. Cet atelier est un entraînement court, pas une nouvelle épreuve blanche complète de trois heures.
