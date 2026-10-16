# AGENT_HANDOFF — LOCACTIF.CA

Mise à jour : 2026-10-15, reprise du dépôt `takatakca/LOCACTIF.CA` sur `main`.

## Dernière tâche terminée
Stabilisation du catalogue et amélioration des liens de fiches :
- `site/catalog-schema.mjs` partage une validation stricte des offres avec le navigateur, les tests et l'importateur.
- `npm run inspect:catalog` inventorie l'API WooCommerce sans modifier de fichier ni de commande.
- `npm run sync:catalog` exige des IDs de catégories réellement approuvés ; vérifie les pages JSON, les doublons, les ruptures de pagination, la source d'origine et les baisses de catalogue supérieures à 50 %.
- Les fiches conservent la recherche/catégorie et la date réelle du dernier import est affichée.
- Ajout de tests isolés pour faux appels réseau (fixtures **uniquement dans les tests**).
- Correctif du test de lien qui attendait auparavant une URL construite en dur.

## Tâche en cours
LOC-009 / LOC-007 : retrouver l'origine WordPress historique et son inventaire WooCommerce réel ; la source publique apex/www a retourné HTTP 403/404 lors de la dernière sonde. De manière indépendante, LOC-014 : comparer les en-têtes Vercel réellement exposés à `vercel.json` avant de supprimer les protections HTML existantes.

## Commit, vérifications et déploiement
- Dernier commit fonctionnel validé avant ce document : `411940cc1dc625e62244945ac98afdef72d992af`.
- CI GitHub `38844284219` : `completed/success`, tests Node.js et job `smoke` HTTPS de l'alias Vercel inclus.
- Vercel production `dpl_9KDnrMEAYmUdLToWaXvaJ3YJ46Kt` : READY lié à `411940cc...`.
- Pour ce commit documentaire ultérieur : retrouver le SHA exact dans GitHub `main`, confirmer la nouvelle CI et le déploiement Vercel sur ce SHA avant de conclure.
- Pages publiques vérifiées auparavant : `/`, `/explore.html`, `/experience.html`, CSS/JS, `/catalog.json`, `/robots.txt`, `/health.json`. Domaine publié : https://locactif-ca.vercel.app (distinct de https://locactif.ca).

## Fichiers modifiés dans cette session
`site/catalog-schema.mjs` (nouveau), `site/catalog-utils.mjs`, `site/explore.js`, `site/explore.html`, `site/explore.css`, `site/experience.js`, `site/experience.html`, `site/experience.css`, `scripts/catalog-verify.mjs`, `scripts/catalog-import-core.mjs` (nouveau), `scripts/woocommerce-import.mjs`, `tests/catalog-import.test.mjs` (nouveau), `tests/catalog.test.mjs`, `tests/experience.test.mjs`, `package.json`, `README.md`, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md`, `docs/DECISIONS.md`, `docs/DEPLOYMENT.md`, `docs/AGENT_HANDOFF.md`.

## Commandes / contrôles
- GitHub API : lecture branche/arbre/code/docs, dernière CI, PR/issues ouvertes (0/0), historique Vercel.
- GitHub Actions (`npm run check` -> vérification JS, schéma `catalog.json`, tests Node.js) et `node scripts/smoke.mjs https://locactif-ca.vercel.app` : succès constaté pour `411940cc...`.
- Vercel : `meta.githubCommitSha` et état READY confirmés pour le SHA ci-dessus.
- Import WooCommerce réel : **non lancé**, endpoint WordPress refusant l'accès public. Les données des tests sont des objets locaux synthétiques, jamais des offres affichées.
- Nouveau processus après levée du blocage source : `LOCACTIF_WP_STORE_BASE_URL=https://ORIGINE_APPROUVEE npm run inspect:catalog` puis choisir les IDs d'activités et exécuter `LOCACTIF_WP_STORE_BASE_URL=... LOCACTIF_CATEGORY_IDS=... npm run sync:catalog`.

## Erreurs et accès nécessaires
- `locactif.ca` et `www.locactif.ca` : accueil HTTP 403, WP REST/Store API HTTP 404 lors du dernier audit `38792613363`. Voir `docs/SOURCE_AUDIT.md`. WordPress, commandes et plugins historiques **ne doivent pas être modifiés** tant que leur emplacement n'est pas identifié.
- Contrat TAKATAK Auth, entitlements produit et modèle de permissions tenant manquants ; ne pas déployer une autorité concurrente.
- Aucun panier, paiement, réservation réelle ou synchronisation de favoris multi-appareils actuellement.
- En-tête `X-Robots-Tag` absent dans la réponse Vercel précédemment observée ; balises HTML `noindex` et robots.txt servent de protection contrôlée.
- Certains endpoints de logs Vercel ont renvoyé 403 de scope ; lecture des métadonnées fonctionne.
- Avis de renouvellement du domaine `locactif.ca` pour le 2026-11-03 ; statut à confirmer chez le registraire. Ne pas entreprendre d'opération payante sans autorisation.

## Prochaine action exacte
1. Lire `AGENTS.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_QUEUE.md`, `docs/SOURCE_AUDIT.md`.
2. Contrôler le SHA GitHub `main`, GitHub Actions `validate` + `smoke` et Vercel production READY **sur le même SHA**.
3. Retrouver l'instance WordPress réelle et vérifier son Store API public avec une autorisation appropriée. Inspecter l'inventaire **sans écriture** et noter les IDs de catégories des vraies activités.
4. Une fois les catégories confirmées, importer le catalogue avec protections, vérifier les prix/URLs/conditions de réservation puis committer et publier.
5. Ensuite implémenter TAKATAK SSO + entitlements vérifiés côté serveur, commandes/réservations et droits des opérateurs, en utilisant un contrat API approuvé ; ne pas bricoler de connexion fictive.
6. Réinvestiguer séparément les en-têtes HTTP de sécurité Vercel et tester l'expérience complète en navigateur sur mobile.
