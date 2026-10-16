# AGENT_HANDOFF — LOCACTIF.CA

**Date :** 16 octobre 2026. **Dépôt :** `takatakca/LOCACTIF.CA`. **Branche de publication :** `main`.

## Dernière tâche terminée
- Ajout de `scripts/catalog-publish.mjs` : revue des suppressions/du changement d'origine, validation avant écriture, mise à jour atomique de `site/catalog.json`.
- Refactorisation de `scripts/woocommerce-import.mjs` pour utiliser cette transaction locale, sans écriture dans le WordPress historique. Tests `tests/catalog-publish.test.mjs` comprenant échec de renommage et conservation du fichier précédent.
- Amélioration du smoke HTTPS : confirmation des modules et assets JS/CSS réellement accessibles en production, au-delà des pages HTML.
- Audit read-only de `locactif.ca` et `www.locactif.ca` : DNS et routes d'origine. Création du runbook `docs/WORDPRESS_RECOVERY.md`.

## État des preuves avant ce commit documentaire
- Dernier commit technique avec vérifications terminées : `59864e54d624a25737867c73d5d7088eb3be9e70`.
- GitHub Actions `38942915068` : **SUCCESS** (`validate` et `smoke`).
- Déploiement Vercel `dpl_4R23MsvrZ71gDMWxVhgJczJQHXcV` : **READY** pour exactement le même SHA.
- Audit historique `38942774369` : `completed/success` = le diagnostic a réussi, **pas** WordPress. Sous GitHub Actions, apex et www pointent vers `209.42.24.127`, NS `mysecurecloudhost.com`, serveur Apache ; `/` 403, `/index.php` et `/wp-login.php` 404, WooCommerce Store API 404.
- **Le commit documentaire courant reçoit un nouveau SHA.** Avant de le déclarer publié, relire `main` et confirmer GitHub Actions/Vercel sur ce nouveau SHA.
- URL Vercel : https://locactif-ca.vercel.app. Domaine commercial `locactif.ca` distinct, **non basculé**.

## Fichiers modifiés durant cette reprise
`scripts/catalog-publish.mjs` (nouveau), `scripts/woocommerce-import.mjs`, `tests/catalog-publish.test.mjs` (nouveau), `package.json`, `scripts/source-audit.mjs`, `scripts/smoke.mjs`, `docs/WORDPRESS_RECOVERY.md` (nouveau), `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md`, `docs/DECISIONS.md`, `docs/DEPLOYMENT.md`, `docs/AGENT_HANDOFF.md`, `AGENTS.md`, `README.md`.

## Vérifications et commandes
- GitHub API : main SHA, arbres, PR/issues ouvertes (0/0), GitHub Actions jobs/logs, Vercel deployments et SHA source.
- GitHub Actions `npm run check`, tests de régression d'E/S et `node scripts/smoke.mjs https://locactif-ca.vercel.app` : réussite pour `59864e5`.
- Audit public read-only depuis runner GitHub ; dernière sonde `node scripts/source-audit.mjs` effectuée dans le workflow `38942774369`.
- **Aucun import WooCommerce réel** ni aucune modification du DNS/WordPress/commandes/clients. Les produits des tests sont des fixtures locales non publiées.

## Blocages actuels
1. Origine WordPress : `403` racine et `404` fichiers PHP/Store API. Le **DocumentRoot réel**, les sauvegardes et la base WooCommerce nécessitent des accès au panneau d'hébergement autorisé. La dernière IP publique n'est pas une preuve de propriétaire ou d'emplacement de la DB.
2. Contrat TAKATAK Auth, entitlements produit LOCACTIF, isolation entreprises vérifiée côté serveur : non disponibles dans ce repository.
3. Créneaux, réservations, commandes, paiements, abonnements, remboursements et administration : non implémentés. **Le produit n'est pas achevé.**
4. Domaine commercial non migré. Renouvellement signalé pour le **3 novembre 2026** ; statut de registraire à vérifier.

## Accès nécessaires (sans partager de secrets)
- Lecture du panneau d'hébergement du site WordPress historique, chemins des domaines, état de backups fichiers+DB et WordPress Store API vérifiée.
- Contrat technique d'identité TAKATAK autorisé : issuer, audience, droits `product=locactif`, tenant isolation, API et flux de réservation.

## Tâche en cours et prochaine action exacte
1. Vérifier `main`, CI complète et Vercel READY **pour le SHA documentaire de cette session** ; corriger tout échec avant de conclure.
2. Avec accès autorisé à l'hébergement historique, relever DocumentRoot, confirmer présence de `index.php`/`wp-content`, sauvegardes et logs Apache ; consulter `docs/WORDPRESS_RECOVERY.md`. **Ne pas écraser WordPress ni déplacer les DNS.**
3. Une fois une véritable origine WooCommerce disponible, lancer **d'abord** `LOCACTIF_WP_STORE_BASE_URL=https://ORIGINE_APPROUVEE npm run inspect:catalog` ; confirmer les catégories et règles de réservation ; importer les **vraies** offres selon les protections existantes.
4. Ajouter TAKATAK Auth/entitlements et les réservations réelles seulement après vérification du contrat et de l'isolation côté serveur. Reprendre QA mobile et transactionnelle.

## Préservation
Ne jamais forcer les pushs ni créer d'offres fictives. Seules les opérations en cours de session sont exécutées ; le prompt seul ne redémarre pas un agent. Cette relève est suffisante pour une reprise guidée par un orchestrateur externe autorisé.
