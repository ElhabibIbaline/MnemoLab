# Vérification V1 — 23 septembre 2026

- `node --check app.js`, `engine.js`, `content.js` : syntaxe valide.
- `node --test tests/engine.test.js` : 4 tests réussis.
- Serveur démarré sur `127.0.0.1:4173`.
- Navigateur : entraînement avec réponse incorrecte, correction immédiate et fin anticipée ; erreur visible dans le carnet.
- Navigateur : examen de logique terminé à 3/3, navigation et marquage, absence de correction avant la fin.
- Navigateur : session de 15 minutes, cinq flashcards évaluées puis passage automatique au mini-QCM.
- Navigateur : palais, affichage de l’association, masquage des quatre repères.
- Navigateur : classement du dossier et correction ; brouillon conservé après rechargement.
- Navigateur : import JSON validé, aperçu puis restauration ; état de test remis à zéro avec `empty-progress.json`.
- Export : le navigateur intégré n’a pas confirmé l’événement de téléchargement. La copie JSON de secours est visible et contient les données attendues. Le téléchargement de fichier reste à vérifier dans le navigateur habituel.
- Responsive : inspection visuelle à 1440 × 1000 et 390 × 844, sans débordement horizontal du document sur mobile. Navigation mobile défilante.
- Mode focus : masquage et retour de navigation vérifiés.
- Aucun message d’erreur ou avertissement JavaScript capturé pendant les parcours testés.

Limites : pas d’audit complet au lecteur d’écran, pas de validation multi-navigateurs ; expiration réelle du chrono non attendue dans le test navigateur. Les sessions en cours ne sont pas restaurées après rechargement, contrairement aux révisions et brouillons.
