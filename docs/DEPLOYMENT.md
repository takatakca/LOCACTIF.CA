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

## Résolution de la configuration active (2026-10-15/16)
- Projet Vercel `locactif-ca` : racine effective du projet Git = `site/`. La seule présence du fichier à la racine Git `vercel.json` **ne suffit pas** pour les en-têtes HTTP de ce projet.
- Nouveau `site/vercel.json` : règles actives pour tous les chemins et règles explicites pour `/`, `/explore.html` et `/experience.html`. Le fichier `vercel.json` principal conserve la politique équivalente, avec `outputDirectory: site` pour la compatibilité du dépôt racine.
- `tests/deployment.test.mjs` compare les règles des deux fichiers et exige `frame-ancestors 'none'`.
- Commit `f868b7f31bac2b28c82f207eac42216161c8d9a9` : contrôle de code et smoke HTTPS `38844937710` **SUCCESS**. Journal du job smoke `116793247261` : réponse réelle contenant `X-Robots-Tag=noindex, nofollow`, `X-Content-Type-Options=nosniff`, `X-Frame-Options=DENY`, `Referrer-Policy`, `Permissions-Policy` et `Content-Security-Policy`.
- Le marqueur temporaire `X-Locactif-Config` a été retiré. Les routes 404 utilisent maintenant `site/404.css` externe pour respecter `style-src 'self'`.
- Ne pas supprimer les tests d'en-têtes pour rendre une publication artificiellement verte. Une erreur indique un changement de racine Vercel, une régression du fichier de configuration ou une divergence HTTP à expliquer.

La mention antérieure d'en-têtes absents correspond à **l'état avant correction** ; la politique vérifiée à partir du commit indiqué ci-dessus la remplace.

## Mise à jour vérifiée du 16 octobre 2026

- Projet Vercel et branche inchangés : `locactif-ca` / `main`. La racine Vercel active reste `site/` ; ne pas perdre `site/vercel.json`.
- Commit fonctionnel `59864e54d624a25737867c73d5d7088eb3be9e70` : GitHub Actions CI/smoke run `38942915068` `completed/success` ; Vercel `dpl_4R23MsvrZ71gDMWxVhgJczJQHXcV` READY sur exactement le même SHA.
- `scripts/smoke.mjs` contrôle dorénavant les dépendances JS chargées par le navigateur : `/catalog-utils.mjs`, `/catalog-schema.mjs`, `/translations.mjs`, ainsi que les feuilles de style et le favicon.
- Nouvel import sûr : `scripts/catalog-publish.mjs` et tests de restauration après erreur. Le catalogue est écrit atomiquement dans `site/catalog.json` ; l'ancien catalogue doit être présent, valide et protégé des écrasements dangereux.
- Audit historique indépendant `38942774369` (source `f04ef4f`) : DNS `209.42.24.127`, NS `ns1`–`ns4.mysecurecloudhost.com`, Apache, 403 racine, 404 fichiers WordPress. Voir `docs/WORDPRESS_RECOVERY.md`.
- Ne jamais assimiler le `health.json` statique à une preuve de fonctionnement du système WordPress ou TAKATAK.
