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
