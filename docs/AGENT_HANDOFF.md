# AGENT_HANDOFF — LOCACTIF.CA

Révision : 2026-10-15. Branche : `main`, dépôt : `takatakca/LOCACTIF.CA`.

## Dernière tâche terminée
Site `/explore.html` : recherche, catégories, favoris locaux, liens de réservations d'origine contrôlés, écran vide honnête et tests du normaliseur WooCommerce. Correctifs mineurs de balisage et documentation actualisée.

## Tâche en cours
Vérifier GitHub Actions/Vercel pour le dernier SHA et préparer l'import de véritables offres provenant du WordPress historique, sans modifier ce WordPress ni toucher au DNS.

## Commits réellement confirmés à cette relecture
- `c9d3dfdd77f06e419713e4af8e53b29cea524ea3` : config Vercel et relève ; GitHub Actions `38775635671` SUCCESS ; Vercel `dpl_3B7QyVgwQSWfFbgSAKLrmjW9F6j7` READY.
- `a7e4ae4f3ab429e742f31db62e939ee635a54723` : catalogue ; GitHub Actions `38776357758` SUCCESS ; Vercel `dpl_HSFNoagHMBFH7XVZnw81DevDDK6S` READY.
- Pour les commits ultérieurs (dont cet état documentaire), déterminer le dernier SHA exact avec `git rev-parse HEAD` et GitHub main ; ne pas supposer la réussite du run futur.

## Fichiers affectés
`site/index.html`, `site/translations.mjs`, `site/explore.html`, `site/explore.css`, `site/explore.js`, `site/catalog.json`, `site/catalog-utils.mjs`, `scripts/woocommerce-import.mjs`, `tests/catalog.test.mjs`, `tests/deployment.test.mjs`, `package.json`, `README.md`, `docs/DECISIONS.md`, `docs/TASK_QUEUE.md`, `docs/PROJECT_STATUS.md`, `docs/AGENT_HANDOFF.md`.

## Vérifications effectuées
- GitHub API : arbre main, README, rapports, workflows, commits/PR/issues, runs Actions ; `a7e4ae4` CI SUCCESS.
- Vercel : projet `prj_w4GSNu30m0PkDrQ0vQ74GSCY5bFj`, liste des déploiements ; `a7e4ae4` READY.
- Nouveau catalogue : tests unitaires ajoutés dans `tests/catalog.test.mjs`.
- Source de produits : **aucun import exécuté** ; aucune URL publique de WordPress vérifiée.
- HTTP réel : échec de résolution externe dans le terminal de cette session ; aucune confirmation GET `/` ou `/explore.html`.

## Problèmes connus et accès nécessaires
- Données et fonctionnement de l'ancien WordPress/WooCommerce : pas de connexion vérifiée depuis cette session. Origine validée nécessaire pour import.
- Vercel API fichiers/logs explicitement scoped a retourné 403 ; utiliser connexion autorisée au bon scope, sans exposer des tokens.
- `locactif.ca` est distinct de l'alias Vercel, aucune bascule DNS effectuée.
- Intégration TAKATAK Auth non configurée : pas de doubles comptes ni de fausse synchronisation de favoris.

## Statut réel du déploiement
La version `a7e4ae4` : CI GitHub SUCCESS et Vercel READY. Le commit d'actualisation de documents en cours doit encore être vérifié. Le domaine officiel et les tests navigateur/HTTP ne sont pas confirmés.

## Prochaine action exacte
1. Lire `AGENTS.md`, ce fichier, `docs/TASK_QUEUE.md` et `docs/DEPLOYMENT.md`.
2. Relever le SHA actuel GitHub main, la conclusion CI et le READY Vercel sur ce même SHA.
3. Corriger toute anomalie prouvée dans la CI ; ne pas refaire des retries identiques d'API Vercel 403.
4. Vérifier l'installation WordPress historique et son Store API avant de définir `LOCACTIF_WP_STORE_BASE_URL`, importer uniquement de vraies offres et vérifier les permaliens.
5. Réaliser ensuite les fiches, la réservation et l'authentification centrale TAKATAK selon les règles métier existantes.
