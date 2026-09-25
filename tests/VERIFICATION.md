# Vérification V2.1 — 24 septembre 2026

## Automatisée

Commande : `node --test tests/engine.test.js tests/v2.test.js tests/cognitive.test.js`.

**23 tests passent.** Couverture :

- règles de répétition, rechute et échéances avant l’épreuve ;
- lecture des sauvegardes V1, conservation des identifiants, compteurs, historique et brouillons ;
- corpus de 108 notions / 145 QCM, choix valides, variantes liées, dates et sources ;
- références des quatre arbres thématiques et des pièces ;
- état ARIA des deux faces, conservation du locus ;
- une étape seulement en mode guidé et les quatre espaces en mode complet ;
- une pièce à la fois dans le parcours mental, notes V2 réutilisées ;
- aucune évaluation créée par le simple affichage d’une carte ;
- contrastes des couleurs principales extraites du CSS, dans les deux thèmes ;
- ressources du site présentes dans la liste du serveur local.

## Navigateur

Tests effectués sur `http://127.0.0.1:4173/?qa=1`, qui utilise une clé de stockage séparée de la progression personnelle.

- **A — Comprendre** : dashboard → cartes mentales → DGFiP → fiscalité → assiette. Branches repliées initialement, micro-explication et source sur demande.
- **B — Mémoriser** : bouton de branche → salle des missions ; retournement avec Entrée et Espace ; dimensions et offsets du bouton inchangés. Détail de l’objet → retour à la branche fiscale dans la carte mentale.
- Visite guidée des quatre objets, puis invitation à reconstruire le parcours sans indice.
- Quatre niveaux testés : objets visibles, notions visibles, centre manquant, pièce vide. Correction et auto-évaluation enregistrées dans la progression existante.
- Parcours global : une pièce affichée, refus de révélation sans tentative, réponse libre puis correction de la pièce.
- **C — Appliquer** : étape vide bloquée ; reformulation, six classements, correction 6/6, plan puis production. Retour au brouillon et à l’étape 4 après rechargement. Mode complet : quatre espaces accessibles.
- Préférence clair/sombre conservée après rechargement.
- Bibliothèque : passage de la page 1 à 2, recherche « cadastre » ramenant à une seule fiche.
- Session courte, rappel révélé puis évalué, carte suivante, entrée/sortie du focus.
- QCM V2.1 : réponse correcte, explication immédiate et question liée. En V2, mode examen avec marquage, navigation et correction finale également vérifié.
- QCM → palais → retour au même QCM vérifié lors de la V2 ; conservation du même moteur et des mêmes objets de session en V2.1.
- Brouillons de dossier, classement et parcours mental retrouvés après rechargement.
- Export V2 : copie JSON de secours visible avec historique, progression et brouillons ; compatibilité import/export testée par le moteur.
- Desktop et mobile 390 × 844 : lecture des cartes, des branches et des champs. Pas de débordement horizontal de la page observé ; défilement horizontal volontaire dans les zones spatiales.
- Hall : zoom 110 %, puis retour à 100 % avec recentrage.
- Aucun message d’erreur ou avertissement JavaScript capturé dans les parcours V2.1.

## Limites du contrôle

Pas d’audit complet avec lecteur d’écran ou sur plusieurs navigateurs. Les règles `prefers-reduced-motion` sont présentes dans le CSS ; la préférence du système utilisateur n’a pas été modifiée pour le test. Le téléchargement de fichier n’a pas été confirmé par le navigateur intégré : la copie JSON reste disponible. Le test navigateur ne simule pas l’écoulement complet d’un chrono d’examen.

Les brouillons et étapes d’atelier persistent ; la session QCM en cours ne reprend toujours pas après rechargement. Le mode complet du cas pratique est un environnement de mini-dossier, pas une épreuve blanche de trois heures. Les étapes validées attestent une tentative, jamais une correction automatique de la rédaction.

## Méthodologie — 25 septembre 2026

29 tests automatisés passent, dont 6 nouveaux : budget de 180 minutes/relecture, cohérence du mini-dossier, tentative avant comparaison, ordre des blocs du support, export/import des nouveaux brouillons et rendu des sept étapes. Les 23 tests existants restent passants ; les 108 notions, 145 questions et identifiants sont inchangés.

Parcours navigateur réalisé dans `?qa=1` (stockage de test distinct) : commande avec comparaison bloquée avant réponse, extraction document/nature/utilité, six cartes de plan et titres, reformulation, quatre blocs de support avec déplacement et aperçu, budget sans relecture puis restauration, carte de relecture au clavier et rappel libre. Rechargement puis retour au dossier : l’ancien plan est conservé. Aide contextuelle présente dans chacune des quatre étapes du mode complet.

Présentation paysage contrôlée à 1440 × 900 ; mobile demandé à 390 × 844 (largeur utile remontée par le navigateur : 375 px), sans débordement de page. Sur mobile les panneaux Document/Exercice/Aide se sélectionnent et la comparaison affiche son panneau. Thème clair, thème sombre et conseil sur demande contrôlés. Les dimensions du navigateur ont été restaurées.

Une erreur de syntaxe des nouvelles données détectée au premier chargement a été corrigée. Aucun nouveau message JavaScript d’erreur ou d’avertissement observé depuis ce correctif dans les parcours ci-dessus. L’onglet personnel et son QCM n’ont pas été rechargés. Pas de simulation de trois heures ni d’évaluation automatique de la rédaction ; les limites générales d’accessibilité et de couverture navigateur indiquées plus haut restent applicables.
