# PROJECT_STATUS — LOCACTIF.CA

Dernière inspection : 16 octobre 2026. **Socle statique de découverte publié, testé, sécurisé ; produit de réservation et intégration TAKATAK non terminés.**

## Source de vérité et état vérifié

- GitHub : `takatakca/LOCACTIF.CA` ; branche de publication `main`; aucune PR ou issue ouverte à la reprise.
- Dernier **commit technique confirmé** avant cette mise à jour : `59864e54d624a25737867c73d5d7088eb3be9e70`. GitHub Actions run `38942915068` : **SUCCESS** (tests + smoke HTTP).
- Vercel projet `locactif-ca`, `prj_w4GSNu30m0PkDrQ0vQ74GSCY5bFj` ; déploiement `dpl_4R23MsvrZ71gDMWxVhgJczJQHXcV` READY sur le SHA `59864e5...`.
- Alias Vercel : https://locactif-ca.vercel.app. Le domaine commercial `locactif.ca` n'est **pas** associé à ce déploiement ; ne pas remplacer le site historique aveuglément.
- Pour tout commit ultérieur (documentation comprise), **recontrôler** `main`, GitHub Actions et `meta.githubCommitSha` Vercel.

## Fonctionnel

- Accueil et navigation FR/EN responsive ; explorer avec recherche, catégories, favoris locaux et conservation de filtres ; fiches de présentation avec prix importé seulement si réel et horodatage.
- `site/catalog.json` reste **vide volontairement**. Pas d'expériences fictives ou de créneaux simulés.
- Contrôle partagé du schéma du catalogue entre importateur, tests CI et navigateur.
- `npm run inspect:catalog` en lecture seule ; `npm run sync:catalog` sous approbation de catégories, uniquement après découverte du WordPress autorisé.
- **Nouveau le 16 octobre :** revue des changements de catalogue dans `scripts/catalog-publish.mjs`, refus des suppressions massives ou du changement d'origine ; écriture atomique en fichier temporaire suivie d'un renommage. Test vérifiant qu'une erreur d'E/S ne tronque pas `catalog.json`.
- CI `npm run check` et tests HTTP réels des pages, headers de sécurité, CSS, modules JS, catalogue, robots et indicateur statique de santé.
- Politique CSP, `X-Robots-Tag`, `nosniff` et protection iframe vérifiées sur la racine Vercel active `site/vercel.json`.

## Nouveau constat sur l'ancien WordPress (audit 16 octobre)

- `locactif.ca` et `www.locactif.ca` : DNS A `209.42.24.127` ; NS `ns1`–`ns4.mysecurecloudhost.com` ; serveur Apache.
- Accueil HTTP **403** ; `index.php` et `wp-login.php` HTTP **404** ; API REST/WooCommerce HTTP **404** ; variante REST HTTP **403**.
- Source et commandes non confirmées : aucun import WordPress possible depuis ces URLs actuellement.
- Lire `docs/WORDPRESS_RECOVERY.md` et `docs/SOURCE_AUDIT.md` ; ne pas modifier DNS, les réservations, abonnements ni les fichiers du serveur sans inventaire.
- Renouvellement du domaine : avis mentionnant le **3 novembre 2026**, statut du registraire non vérifié.

## Blocages majeurs

1. WordPress réel/document root, sauvegardes, inventaire d'expériences publiées et règles de réservation.
2. TAKATAK Auth centrale, entitlements du produit, isolation entreprise/tenant vérifiée côté serveur ; aucun contrat d'API validé.
3. Disponibilités réelles, réservations, commandes, paiements, abonnements, remboursements, opérateurs et administration non réalisés.
4. Bascule contrôlée de `locactif.ca`, QA navigateur mobile et transactions end-to-end.

Le site statique est **pré-lancement** et reste `noindex`. Le statut Vercel READY et la CI verte ne prouvent pas l'achèvement du produit métier.
