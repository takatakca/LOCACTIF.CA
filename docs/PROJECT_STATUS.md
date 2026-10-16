# PROJECT_STATUS — LOCACTIF.CA

Mis à jour le 15 octobre 2026. **Socle vitrine/catalogue déployé et vérifié HTTP. Plateforme transactionnelle non terminée.**

## État réel GitHub
- Repo : `takatakca/LOCACTIF.CA` ; branche de publication : `main`.
- Dernier commit technique confirmé avant cette mise à jour : `6973794c74bdcaf6e31948c95392a95132f1bb73`.
- GitHub Actions CI `38792613374` : SUCCESS (tests de structure, JS, sécurité des liens, fichier catalogue, déploiement et vrai smoke HTTP).
- GitHub Actions audit source `38792613363` : SUCCESS (sonde effectuée ; endpoints source en échec HTTP 403/404).
- Vercel `locactif-ca`, projet `prj_w4GSNu30m0PkDrQ0vQ74GSCY5bFj`, déploiement `dpl_C22E37SKqHE8y1kBRGQzBMTxCdXA` READY sur exactement `6973794...`.
- Alias public : https://locactif-ca.vercel.app. Le domaine commercial `locactif.ca` n'est pas raccordé à ce projet.

## Fonctionnalités effectivement livrées
- Accueil FR/EN responsive, navigation mobile.
- Catalogue `/explore.html` avec recherche, filtres, favoris enregistrés **sur l'appareil**.
- Fiches `/experience.html?id=ID` avec texte, catégories, prix importé seulement si valide, favoris et lien sortant HTTPS vers une offre d'origine. Pas de créneaux ou réservation locaux fictifs.
- Catalogue vide `site/catalog.json` : **aucun produit réel importé** tant que WordPress n'est pas accessible.
- Importateur WooCommerce public en lecture seule, contrôles de source/limite/intégrité, tests Node.js natifs.
- Routage `.html` réparé en désactivant `cleanUrls` dans `vercel.json` (preuve : job smoke HTTP SUCCESS).
- Smoke GitHub Actions : GET pages + CSS/JS/catalogue/health/robots + contrôle HTML `noindex`.
- Audit HTTP du WordPress historique via `scripts/source-audit.mjs` sans secret.

## Anomalies et dépendances non résolues
1. **Source WordPress** : apex et www renvoient HTTP 403 sur l'accueil, 404 sur `/wp-json/` et WooCommerce Store API ; voir `docs/SOURCE_AUDIT.md`.
2. **Réservations/transactions** : réservations et disponibilité, paiements, abonnements, remboursements, historiques, support, admin non réalisés.
3. **Identité** : intégration TAKATAK Auth, entitlements, isolation par entreprise et droits côté serveur non réalisés.
4. **Domaine** : aucune migration DNS `locactif.ca` vers Vercel ni attestation de conservation du WordPress d'origine.
5. **Sécurité HTTP** : la réponse Vercel testée ne présente pas l'en-tête `X-Robots-Tag` configuré ; le smoke vérifie à la place les balises HTML `noindex` et `robots.txt` en `Disallow: /`. Investiguer la divergence des headers Vercel séparément.
6. Tests navigateur manuels et achat/réservation réelle en bout de chaîne non réalisables sans données/services autorisés.

## Reprise
Suivre `AGENTS.md`, `docs/AGENT_HANDOFF.md` et `docs/TASK_QUEUE.md`. Ne pas déclarer 100 % ni supprimer les contraintes de sécurité. Ne pas modifier le DNS ou l'hébergement WordPress tant que les informations historiques ne sont pas vérifiées.

## Signal externe de continuité
Des messages de surveillance datés du 5 au 8 octobre 2026 démontrent une installation WordPress avec WooCommerce/Wordfence et modules de réservation/abonnement encore signalée récemment. Cela ne contredit pas les réponses 403/404 observées le 15 octobre : l'origine peut être indisponible ou filtrée. Un avis de renouvellement du domaine mentionne le **3 novembre 2026** ; vérifier son état chez le registraire sans afficher d'identifiants ni entreprendre de facturation.

## Livraison supplémentaire du 15 octobre 2026 — durcissement de l'import
- Référence contrôlée avant documentation : commit `411940cc1dc625e62244945ac98afdef72d992af`, CI `38844284219` SUCCESS avec smoke HTTP réel, Vercel `dpl_9KDnrMEAYmUdLToWaXvaJ3YJ46Kt` READY.
- Importateur WooCommerce revu : inspection préalable de catégories via `npm run inspect:catalog`, catégories strictement autorisées pour `npm run sync:catalog`, exclusion des produits hors stock, échec fermé sur réponse erronée, redirection, doublons, dépassement de 500 et inventaire décroissant de plus de 50 % non approuvé.
- Nouveau `site/catalog-schema.mjs` réutilisé par le navigateur et le programme de validation. Les fiches affichent la date exacte du dernier import seulement lorsqu'elle existe ; navigation recherche/catégorie conservée jusqu'à la fiche et au retour.
- Tests unitaires supplémentaires pour API WooCommerce simulée localement (jamais affichée comme données réelles) et contrôles des liens.
- **Ne pas confondre ces validations avec une réservation fonctionnelle :** source `locactif.ca` toujours inaccessible en HTTP pour WordPress REST, aucune offre publiée, aucun TAKATAK Auth, aucune prise de paiement.

## Sécurité HTTP consolidée (2026-10-15/16)
- Ancien écart `X-Robots-Tag` absent : **résolu**, non plus une anomalie active. Cause vérifiée : le projet Vercel lit `site/vercel.json` comme fichier de configuration.
- Commit de code vérifié `f868b7f31bac2b28c82f207eac42216161c8d9a9` : GitHub Actions CI `38844937710` SUCCESS (validation + HTTP smoke), en-têtes réellement observés sur la production, dont `Content-Security-Policy` avec `frame-ancestors 'none'`.
- Les protections HTTP sont vérifiées pour les trois pages HTML principales. Les fichiers `vercel.json` (racine Git) et `site/vercel.json` (racine effective de Vercel) sont harmonisés et testés.
- Ce succès n'affecte pas les blocages métier : catalogue WooCommerce historique indisponible, réservations, paiements, TAKATAK Auth, permissions et domaine commercial non migrés.
