# PROJECT_STATUS — LOCACTIF.CA

Dernière vérification : 2026-10-15. **Projet fonctionnel en pré-lancement; application de réservation de bout en bout non terminée.**

## GitHub et environnement
- Repository : `takatakca/LOCACTIF.CA`, branche autorisée `main`.
- Commit de référence testé avant cette relève : `2fea88d2cc9e6cfcfc3e4bda603084004ddfea62`, GitHub Actions run `38791032370` SUCCESS ; déploiement Vercel `dpl_JDqRpz9tqmJydZrcvYu97ZnzqgoC` READY.
- Pipeline de smoke HTTP ajouté au commit `1f6d0a7023e3355015e4d25bc3d57f8980173fab` ; la suite CI doit vérifier son résultat.
- Vercel project : `locactif-ca` (`prj_w4GSNu30m0PkDrQ0vQ74GSCY5bFj`), production GitHub `main`.
- URL de publication : https://locactif-ca.vercel.app.
- Nom de domaine officiel `locactif.ca` : aucune migration DNS vers Vercel réalisée.

## Fonctionnalités présentes
1. Accueil responsive bilingue FR/EN.
2. `/explore.html` : recherche, filtres, favoris **locaux seulement**, fiches liées.
3. `/experience.html?id=ID` : fiche d'offre vérifiée à partir du catalogue, description, catégorie, prix si renseigné, favori et lien contrôlé HTTPS vers l'origine. **Pas de réservation ni de disponibilité inventée.**
4. `site/catalog.json` : catalogue versionné, **vide pour l'instant** tant que la source réelle WordPress n'est pas vérifiée.
5. Importeur `npm run sync:catalog` pour WooCommerce Store API depuis une origine HTTPS autorisée ; import refusé si API échoue, si le catalogue est tronqué ou si les données ne sont pas validées.
6. `npm run verify:catalog`, tests Node.js, pipeline GitHub Actions et route statique `/health.json`.
7. Contrôle HTTP automatisé `scripts/smoke.mjs` sur la production Vercel, inclus dans CI sur push main. Ne jamais interpréter le simple marqueur `health.json` comme preuve d'une API/backend en santé.

## Incomplet / dépendances externes
- Accès réel et inventaire WordPress/WooCommerce historique (produits, extensions de booking, abonnements, commandes).
- Offres et prix actuels, disponibilité de créneaux, règles de réservation, paiements et remboursements.
- Authentification centralisée TAKATAK, entitlements LOCACTIF, historique de commandes, permissions et isolation tenant, messagerie, dashboards opérateurs/admin.
- Confirmation du DNS/HTTPS officiel et plan de migration sans interruption.
- Contrôles manuels responsive/accessibilité et réservation réelle de bout en bout.

## Sécurité et arbitrages
Ne pas recréer une autorité d'identité autonome. Ne pas exposer de tokens WP ou TAKATAK. Les favoris pré-compte restent dans localStorage. Le catalogue et ses liens doivent être publics, vérifiés, sans simulation. Le site de préparation reste noindex tant que le lancement n'est pas approuvé.

## Suite
Lire `AGENTS.md` et `docs/AGENT_HANDOFF.md`, puis `docs/TASK_QUEUE.md`. Reprendre le premier blocage technique avéré avant d'envisager le raccordement de WordPress/TAKATAK et du domaine officiel.
