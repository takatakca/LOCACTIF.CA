# DEPLOYMENT — LOCACTIF.CA

Dernière inspection : 2026-10-15.

## Cible vérifiée par métadonnées
- Repository : `takatakca/LOCACTIF.CA`, branche `main`.
- Vercel project : `locactif-ca` / `prj_w4GSNu30m0PkDrQ0vQ74GSCY5bFj`.
- Vercel accountId : `team_5evutKT6yGLTYxyLNsFfl1eH`.
- URL d'alias connue : https://locactif-ca.vercel.app.
- Avant cette reprise : deployment `dpl_AAgjgd4mXSqY2bwH4uwiYWuK3DKH` READY lié au commit `a3d205dc90deeeed78b9382b13c39ad3268e3759`.
- Aucune preuve de rattachement du domaine officiel `locactif.ca` ; ne pas annoncer qu'il sert ce site.

## Build
Le site est statique, sans compilation. `vercel.json` fixe `outputDirectory` à `site` pour publier la véritable racine (sans exposer README/docs). `site/health.json` est un indicateur HTTP statique ; il ne teste **pas** une API ni la base de données (absentes).

## Déployer
1. Vérifier `main`, les derniers commits et les permissions.
2. Exécuter `npm run check` sous Node >=20.
3. Pousser les changements de façon non destructive sur `main`.
4. Vérifier le run CI GitHub Actions pour le SHA poussé.
5. Vérifier sur Vercel un déploiement READY en production avec `meta.githubCommitSha` identique à `main` et alias `locactif-ca.vercel.app`.
6. Vérifier que `/` retourne une page HTML LOCACTIF, que `/app.js`, `/translations.mjs`, `/styles.css`, `/favicon.svg` et `/health.json` sont servis avec succès ; vérifier aussi le comportement FR/EN et mobile.
7. Si le fournisseur retourne READY mais que les requêtes publiques ne peuvent pas être effectuées, noter « statut fournisseur READY, HTTP non vérifié » et ne pas affirmer que le site est utilisable.

## GitHub Actions
`.github/workflows/site.yml` vérifie le code sur `main` et les PR. GitHub Pages est facultatif : l'activer manuellement dans Settings > Pages, puis définir `ENABLE_GITHUB_PAGES=true`. Ne pas activer Pages par défaut après l'échec de permissions précédent.

## Blocages connus
- L'observation du projet Vercel (liste des déploiements) fonctionne, mais les opérations de logs et de fichiers associées explicitement au scope team retournent **403 Forbidden**. Aucune authentification ne doit être inventée ; corriger la connexion/scope pour ces opérations.
- La navigation HTTP du site depuis les outils de cette session ne donne pas de réponse vérifiable. READY Vercel n'est pas un test HTTP.
- Le domaine officiel `locactif.ca` et les exigences de l'application ne sont pas encore vérifiés.

## Rollback
Utiliser dans Vercel le dernier déploiement marqué READY associé à un SHA connu, seulement en cas d'incident identifié. Ne pas effectuer de force-push et ne pas utiliser le rollback pour masquer des tests en échec.

## Catalogue d'activités (ajout 2026-10-15)
- Pages à vérifier : `/explore.html`, `/explore.css`, `/explore.js`, `/catalog-utils.mjs`, `/catalog.json`, ainsi que `/` et `/health.json`.
- `site/catalog.json` est volontairement vide tant qu'aucune offre WooCommerce réelle n'a été vérifiée. Ce n'est ni une panne ni une preuve de disponibilité de produits.
- Import manuel : `LOCACTIF_WP_STORE_BASE_URL=https://ORIGINE_WP_APPROUVEE npm run sync:catalog`, puis revue des prix, catégories, permaliens, règles de réservation et commit du catalogue.
- Le connecteur n'envoie pas de commandes à WooCommerce et n'effectue aucune réservation ni paiement. Les liens de fiches pointent vers leur boutique HTTPS d'origine ; préserver le WordPress existant jusqu'à un plan de migration approuvé.
- Refaire `npm run check` avant commit. Tester en particulier recherche, catégories, favoris locaux, FR/EN, état vide, sécurité des liens, navigabilité au clavier et disposition mobile.

## Smoke HTTP automatisé ajouté le 2026-10-15
- Script : `scripts/smoke.mjs`.
- Local : `npm run smoke -- https://locactif-ca.vercel.app`.
- Workflow `.github/workflows/site.yml` : job `smoke` après la validation des tests, sur push main ; essais avec délai en attendant la publication Git->Vercel.
- Vérifie réponse HTTP 200, origine HTTPS, en-tête `X-Robots-Tag` noindex, contenu des pages `/`, `/explore.html`, `/experience.html`, fichiers JS/CSS, `/health.json` et schéma de `/catalog.json`.
- La vérification du SHA réel reste celle du **déploiement Git Vercel** (`meta.githubCommitSha`), non de l'URL seule. Le smoke ne doit pas passer pour preuve de réservations ou paiements, qui ne sont pas implémentés.
- Si smoke échoue, lire le journal Actions, diagnostiquer le chemin exact avant de toucher au DNS. Ne pas supprimer le smoke juste pour rendre la CI verte.
