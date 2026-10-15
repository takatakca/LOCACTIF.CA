# AGENT_HANDOFF — LOCACTIF.CA

Révision : 2026-10-15. Dépôt `takatakca/LOCACTIF.CA`, branche de publication `main`.

## Dernière tâche terminée
Correction d'une vraie anomalie de déploiement : Vercel répondait HTTP 404 sur les liens `.html` alors que l'option `cleanUrls=true` activait les chemins sans extension. Désactivation de `cleanUrls`, puis job GitHub Actions **smoke HTTP SUCCESS** et Vercel READY. Ajout d'une sonde WordPress historique apex + www, en lecture seule.

## Tâche actuellement en cours
LOC-009/007 : retrouver l'origine WordPress/WooCommerce et ses offres réelles ; les endpoints publics actuellement testés sont indisponibles HTTP 403/404. Secondaire : LOC-014 divergence des en-têtes Vercel.

## Dernier commit poussé et preuves
- Dernier SHA technique dont CI et Vercel sont confirmés avant mise à jour de ce fichier : `6973794c74bdcaf6e31948c95392a95132f1bb73`.
- GitHub CI `38792613374` : SUCCESS (validate + smoke). Sonde publique `38792613363` : SUCCESS (exécution correcte, **résultat source non accessible**).
- Vercel `dpl_C22E37SKqHE8y1kBRGQzBMTxCdXA` : READY, `meta.githubCommitSha = 6973794c...`.
- **Pour ce commit documentaire**, consulter `git rev-parse HEAD` et la CI/production réelle après push ; ne pas prédire le SHA du commit courant.

## Fichiers modifiés durant cette session
`site/experience.html`, `site/experience.css`, `site/experience.js`, `site/explore.js`, `site/explore.css`, `scripts/catalog-verify.mjs`, `scripts/woocommerce-import.mjs`, `scripts/smoke.mjs`, `scripts/source-audit.mjs`, `tests/experience.test.mjs`, `tests/deployment.test.mjs`, `package.json`, `vercel.json`, `.github/workflows/site.yml`, `.github/workflows/source-audit.yml`, `README.md`, `AGENTS.md`, `docs/*.md`.

## Commandes, contrôles, preuves
1. GitHub API : branche/arbre, code/README/docs, commits, issues et PR (aucune ouverte), workflow CI et détails/jobs/logs.
2. Vérifications `npm run check` exécutées par la CI GitHub, SUCCESS. Vérification des routes HTTP depuis GitHub Actions (GET `/`, `/explore.html`, `/experience.html`, CSS/JS, catalogue, robots, health) SUCCESS après correction du routage.
3. Vercel projet `prj_w4GSNu30m0PkDrQ0vQ74GSCY5bFj` : production READY sur SHA correspondants.
4. Source audit GitHub Actions read-only : `https://locactif.ca` et `https://www.locactif.ca` résolvent ; les deux `/` HTTP 403 ; les deux `/wp-json/` et `/wp-json/wc/store/v1/products?per_page=1` HTTP 404. Rapport `docs/SOURCE_AUDIT.md`.
5. Terminal local `curl` sur les deux sites : DNS indisponible depuis ce conteneur (GitHub runner est l'origine indépendante des requêtes HTTP concluantes).
6. Les appels Vercel fichiers/logs explicitement scoped ont renvoyé HTTP 403. Ne pas réessayer inchangés.

## Erreurs connues et accès requis
- WordPress historique et ses réservations réelles : **origine et accès non établis** ; besoin d'un accès d'hébergement autorisé ou de l'URL du véritable WordPress en service.
- Intégration TAKATAK Auth/entitlements/tenants non construite faute de contrat API et de parcours validés. Ne pas créer un système d'identité concurrent.
- `locactif.ca` n'est **pas** basculé sur Vercel ; préserver tout service historique.
- En-tête `X-Robots-Tag` absent de la réponse Vercel observée malgré `vercel.json`. HTML noindex et robots.txt vérifiés; investiguer ultérieurement.
- `site/catalog.json` vide : aucun produit fictif, aucune commande locale.

## Statut réel du déploiement
Le site de préparation est déployé sur l'alias https://locactif-ca.vercel.app, avec tests HTTP réussis pour le commit de référence `6973794c...`. Le produit métier de réservation n'est **pas fini**. Pour le SHA documentaire courant, vérifier nouveau run et déploiement.

## Prochaine action exacte
1. Lire `AGENTS.md`, ce fichier, `docs/SOURCE_AUDIT.md` puis `docs/TASK_QUEUE.md`.
2. Confirmer dernier `main`, CI (incluant smoke), et déploiement Vercel READY du même SHA.
3. Inspecter l'hébergement de `locactif.ca` et les sauvegardes/chemins WordPress depuis un accès autorisé : expliquer HTTP 403/404, identifier l'API Store et ses vraies offres. Ne pas réécrire le DNS.
4. Si l'API devient accessible, exécuter `npm run sync:catalog` avec l'origine de confiance, contrôler le catalogue et ses liens puis committer les offres.
5. Réaliser ensuite booking et TAKATAK Auth selon les exigences démontrées ; corriger les en-têtes Vercel en maintenant la CI smoke.
