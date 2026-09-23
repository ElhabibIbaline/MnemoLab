# DGFiP Memory Lab

Application personnelle locale de préparation au concours commun externe de catégorie C, branche administrative, objectif DGFiP. Priorité aux écrits, au rappel actif et à la correction des erreurs. Outil indépendant, non affilié à la DGFiP.

## Lancement

Aucune installation nécessaire : ouvrir `index.html` dans un navigateur moderne. Tout le contenu fonctionne hors connexion ; seuls les liens vers les sources nécessitent Internet.

Pour une adresse locale stable (recommandé pour conserver le même stockage), avec Node.js installé :

```sh
node server.js
```

Ouvrir http://127.0.0.1:4173. Arrêter avec Ctrl+C. Garder cette adresse : `localhost`, `127.0.0.1`, un autre port et un fichier local ont des stockages distincts. Le comportement du stockage en `file://` dépend du navigateur : préférer le serveur local et exporter régulièrement.

## Architecture

- `index.html` : structure sémantique et navigation.
- `style.css` : thème sombre responsive, focus clavier et réduction des mouvements.
- `content.js` : notions, QCM, flashcards, sources, pièces du palais et dossier fictif.
- `engine.js` : règles de répétition, priorisation, validation des sauvegardes.
- `app.js` : vues, interactions, sessions et stockage.
- `server.js` : serveur local facultatif sans dépendance.
- `tests/engine.test.js` : tests du moteur et cohérence du contenu.

Les scripts classiques permettent l’ouverture directe sans compilation, modules distants, polices externes ni CDN.

## Contenu pédagogique

La V1 contient 15 notions originales : mathématiques, logique, DGFiP et numérique. Les quatre notions DGFiP s’appuient sur la page officielle des missions, consultée le 23 septembre 2026. Les exercices ne sont pas des annales. Le cas pratique est explicitement fictif. La carte expose aussi les matières du programme sans contenu initial ; la progression porte uniquement sur la banque intégrée, jamais sur tout le concours.

Sources :

- [Fiche officielle du concours](https://www.economie.gouv.fr/rejoignez-nous/agent-administratif-principal-des-finances-publiques-de-2eme-classe-externe-dgfip)
- [Missions DGFiP](https://www.economie.gouv.fr/dgfip/comprendre-la-dgfip/nos-missions)

La date initiale des écrits est le 29 septembre 2026, personnalisable dans les réglages. La convocation fait référence.

### Ajouter une question ou une flashcard

Ajouter une ligne dans `raw`, dans `content.js`, en respectant cet ordre :

```js
['math-06', 'Mathématiques', 'Titre', 'Question ?', 'Réponse',
 'Explication du raisonnement.', 'Association facultative.',
 ['Choix A', 'Choix B', 'Choix C'], 1]
```

Le dernier nombre est l’index de la bonne réponse (ici B, index 1). Chaque notion devient une flashcard et une question QCM : ajouter une carte se fait donc au même endroit, sans changer le moteur. Utiliser un identifiant unique et stable. Pour une source officielle, ajouter sa clé après l’index et la déclarer dans `sources`. Chaque objet normalisé possède `id`, `category`, `title`, `question`, `answer`, `explanation`, `mnemonic`, `choices`, `correct`, `source`, `updated`, `status`, `difficulty`. Adapter la date et le statut si le contenu évolue ; ne pas labelliser une actualité comme stable.

### Ajouter une pièce

Ajouter dans `rooms` :

```js
{ id: 'nouvelle-piece', title: 'Nom', subtitle: 'Parcours conseillé',
  objects: [{ icon: '📖', label: 'Un objet', id: 'math-06',
    association: 'Pourquoi cet objet rappelle cette notion.' }] }
```

Chaque objet référence une notion existante. Le test masque les objets ; l’auto-évaluation est enregistrée séparément pour chaque notion. Garder des pièces courtes : la disposition actuelle convient particulièrement à trois ou quatre objets.

## Parcours disponibles

Tableau de bord, carte, apprentissage et rappels libres, flashcards, QCM entraînement ou examen simplifié, carnet d’erreurs, palais, statistiques, atelier de classement et rédaction, trame d’oral. Le classement utilise des menus accessibles plutôt que le glisser-déposer. Le mode focus masque la navigation.

Sessions suggérées : 5 minutes = 5 rappels ; 15 minutes = rappels puis 5 QCM ; 30 minutes = rappels, 10 QCM puis cas pratique. Ce sont des budgets indicatifs, pas une promesse de durée exacte. Le cas pratique propose un chrono de 15 minutes ; l’oral un chrono de 2 minutes. Aucun correcteur automatique ne prétend évaluer la rédaction.

## Progression et répétition

Chaque notion conserve niveau, réussites, erreurs, dernière et prochaine révision, dernière évaluation. Oublié : rappel dans 10 minutes et niveau 0 ; difficile : 1 jour et niveau 1 ; correct : niveau +1, délai 1/2/4/8 jours ; facile : niveau +1, délai 3/6/12/24 jours. Niveau plafonné à 4, maîtrise affichée à partir de 3. Un QCM correct vaut « correct », une erreur ou absence de réponse à la fin vaut « oublié ». Les erreurs restent comptabilisées historiquement même après récupération. Les délais ne sont pas scientifiquement calibrés.

Les statistiques QCM comptent seulement les sessions terminées. Une réponse corrigée avant abandon reste dans les révisions mais ne crée pas un résultat de session. Les sessions en cours ne reprennent pas après rechargement ; progression, sessions terminées et brouillons persistent. Le temps actif est approximatif, compté quand la page est visible et récemment utilisée.

## Sauvegarder et restaurer

Dans « Sauvegardes & sources », exporter un JSON puis le conserver hors du navigateur. Si le navigateur bloque le téléchargement, une copie JSON est affichée : la copier intégralement dans un fichier texte avec extension `.json`. Importer ce fichier, lire l’aperçu puis confirmer le remplacement. Une validation vérifie le format avant toute modification. L’import n’est pas une fusion. Exporter les données actuelles avant de les remplacer. Aucun contenu de sauvegarde n’est interprété comme du HTML.

Le stockage local peut être effacé par le navigateur, le mode privé ou un nettoyage du système. Aucun service distant ne récupère vos données. Si le stockage est indisponible ou corrompu, une alerte est affichée ; exporter le travail courant. Une sauvegarde corrompue n’est pas écrasée automatiquement.

## Vérification

```sh
node --test tests/engine.test.js
node --check app.js
```

Parcours manuels : répondre à un QCM, vérifier l’erreur et le rappel dû ; terminer un examen avec réponses marquées ; rappeler une carte et noter ; masquer/révéler le palais ; rédiger et recharger ; exporter/importer ; tester à largeur mobile et au clavier.
