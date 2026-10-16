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

## Contrôles publics réellement réussis le 2026-10-15
- SHA produit vérifié : `6973794c74bdcaf6e31948c95392a95132f1bb73`.
- GitHub Actions CI + smoke : run [38792613374](https://github.com/takatakca/LOCACTIF.CA/actions/runs/38792613374), SUCCESS.
- Vercel deployment : `dpl_C22E37SKqHE8y1kBRGQzBMTxCdXA`, production READY sur ce SHA.
- `cleanUrls=false` dans `vercel.json`. Ne **pas** réactiver `cleanUrls` sans changer tous les liens `.html`, la stratégie de dev local et les tests.
- Le smoke a réellement relevé `X-Robots-Tag` absent en réponse ; la validation alternative des balises HTML noindex et du fichier robots a réussi. Les autres headers doivent être audités avant finalisation sécurité.
- Sonde historique [38792613363](https://github.com/takatakca/LOCACTIF.CA/actions/runs/38792613363) : domaine apex/www DNS disponible, accueil HTTP 403, WordPress REST HTTP 404 et WooCommerce Store API HTTP 404. Ce n'est pas une source importable : voir `docs/SOURCE_AUDIT.md`.

## Import sécurisé (mise à jour 2026-10-15, session suivante)
1. Confirmer l'instance WordPress **correcte** avant de renseigner `LOCACTIF_WP_STORE_BASE_URL`. Dernier audit apex et www : 403/404 ; aucune importation réelle possible sur ces URL en l'état.
2. `LOCACTIF_WP_STORE_BASE_URL=https://ORIGINE_APPROUVEE npm run inspect:catalog` : consultation **sans écriture**, affiche uniquement le nombre et les IDs/noms de catégories.
3. Approuver les catégories d'activités et exécuter `LOCACTIF_WP_STORE_BASE_URL=https://ORIGINE_APPROUVEE LOCACTIF_CATEGORY_IDS=12,34 npm run sync:catalog`.
4. Le programme rejette : HTTP anormal, redirections, MIME JSON invalide, réponses mal formées, doublons et plus de 500 produits potentiels. Les produits hors catégorie/hors stock et les fiches malformées ne sont pas importés.
5. Une suppression supérieure à 50 % par rapport au catalogue présent est refusée ; `CONFIRM_CATALOG_SHRINK=true` exige une vérification humaine de la source et des exclusions. `ALLOW_EMPTY_CATALOG=true` ne s'utilise qu'après approbation d'un catalogue vide.
6. `npm run check` inclut validation de `site/catalog.json` et tests de l'import avec données de test **isolées**, qui ne sont jamais publiées.
7. Examiner les permaliens, catégories, prix, règles et durées avant de committer le catalogue réel puis vérifier CI et smoke HTTPS. L'API publique ne prouve pas que des créneaux sont disponibles.
8. Les pages `explore.html` et `experience.html` annoncent la date du dernier import lorsqu'elle existe ; absence d'horaires ou transaction locale demeure explicite.

Les réponses publiques de Vercel ne comportaient pas l'en-tête `X-Robots-Tag` lors du dernier audit malgré `vercel.json` ; ne pas retirer les balises HTML `noindex` et `robots.txt`. Il reste nécessaire de comparer les en-têtes réels à la configuration.
