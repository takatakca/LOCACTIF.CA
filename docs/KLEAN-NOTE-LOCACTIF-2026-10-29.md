# KLEAN — Note de travail — LOCACTIF.CA — 2026-10-29

Agent : KLEAN (projet 10/10). Client : locactif.ca. Dépôt : `takatakca/LOCACTIF.CA`.
Date de la note : 2026-10-29. Lecture seule pour la vérification ; aucun code poussé, aucun merge, aucun déploiement, aucun secret touché.

## 1. Entrepris

- Vérification en lecture seule du dépôt `takatakca/LOCACTIF.CA` (branche `main`, issues, PR, README, AGENTS, docs, code de réservation existant).
- Préparation de la revue exacte, fichier par fichier, et d'une proposition d'approbation par étapes.
- Dépôt de cette note dans Google Drive (dossier « 00 — Opérations TAKATAK ») et dans GitHub (branche + PR, jamais de push direct sur `main`, jamais de merge).

## 2. Vérifié (faits, 2026-10-29)

- `main` actuel : `a8d818a24734e66ca0e7fcf25c6472cc6d64aad9`, « docs: record atomic catalog release and verified legacy hosting diagnostics », 2026-10-16. Inchangé depuis la vérification du 2026-10-29 matin.
- Issues ouvertes : 0. PR ouvertes : 0.
- `site/catalog.json` : `schema_version` 1, `source_origin` https://locactif.ca, `imported_at` null, `items` vide. Vide volontairement, pas une panne.
- **Correction importante par rapport à l'hypothèse de départ : il n'existe PAS de « système de réservation complet » en attente d'approbation dans le dépôt.** Le README l'écrit noir sur blanc : le code actuel fournit un socle public indépendant et « ne prétend pas que le système complet de réservation est opérationnel ». Ce qui existe, c'est une vitrine de découverte + des liens de réservation sortants vers l'organisateur. Le système de réservation complet est un chantier futur, pas du code à merger.
- Recherche code : 0 occurrence de « reservation » ; « booking » = liens sortants sécurisés uniquement (`safeBookingUrl`).
- Site live : l'état réel de locactif.ca n'a PAS été vérifié dans ce travail (lecture texte du 2026-10-29 : page générique « My Blog » sur une copie datée du 2026-10-04, sans rapport avec Locactif). La vérification live reste à faire dans un navigateur normal — voir Blocages.

## 3. Revue exacte, fichier par fichier

| Fichier | Ce qu'il fait | État | Avis |
|---|---|---|---|
| `README.md` | Orientation découverte + réservation ; dit explicitement que le système complet n'est pas opérationnel ; règles d'import strictes | À jour | Aucun changement proposé |
| `AGENTS.md` | Front statique FR/EN sans base de données, paiement ni authentification ; contraintes (pas de changement DNS sans preuve, garder `noindex`) | À jour | Aucun changement proposé |
| `site/catalog.json` | Catalogue publié, vide volontairement | Vide, valide | Rester vide tant qu'aucun import réel n'est approuvé |
| `site/catalog-utils.mjs` | `safeBookingUrl` (HTTPS seulement, origine de confiance seulement, sans identifiants), normalisation des produits, filtres, liens fiche/retour | Sain | Aucun changement proposé |
| `site/catalog-schema.mjs` | `validateCatalog` : schéma v1, max 500 articles, règles prix/devise, URL sûres | Sain | Aucun changement proposé |
| `site/experience.js` | Fiche détail FR/EN ; bouton = lien vers l'offre originale ; mention « Aucun paiement n'est traité ici » ; favoris locaux seulement | Sain | Aucun changement proposé |
| `scripts/woocommerce-import.mjs`, `scripts/catalog-publish.mjs`, `scripts/catalog-import-core.mjs` | Import public WooCommerce, publication atomique, revue des pertes, refus en cas d'échec (fail-closed) | Outil prêt, source bloquée | Ne pas lancer sans origine approuvée |
| `scripts/smoke.mjs` | Vérifie en HTTPS les pages, en-têtes de sécurité et modules sur l'alias Vercel | Sain | Aucun changement proposé |
| `scripts/source-audit.mjs` | Sonde publique en lecture seule du WordPress historique | Sain | À relancer après récupération de l'hébergement |
| `package.json` | Scripts `check`, `sync:catalog`, `verify:catalog`, `smoke`, `inspect:catalog` ; Node 20+ ; aucune dépendance tierce | Sain | Aucun changement proposé |
| `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md`, `docs/AGENT_HANDOFF.md`, `docs/DECISIONS.md`, `docs/DEPLOYMENT.md`, `docs/SOURCE_AUDIT.md`, `docs/WORDPRESS_RECOVERY.md` | État, files de tâches LOC-001 à LOC-019, décisions D-001 à D-010, runbook de récupération | À jour au 2026-10-16 | Aucun changement proposé, sauf cette note |

## 4. Proposition d'approbation par étapes (rien n'est approuvé d'avance)

- **Étape 0 — Décisions propriétaire (aucun code) :** accès autorisé au panneau d'hébergement WordPress historique (DocumentRoot, sauvegardes fichiers + base de données, extensions WooCommerce/YITH, commandes actives) ; contrat TAKATAK Auth (émetteur, audience, entitlements produit, isolation tenant) ; règles créneaux, prix, marchands, paiements, remboursements, administration.
- **Étape 1 — Cette note (docs seulement) :** PR GitHub + copie Drive. Aucun effet fonctionnel.
- **Étape 2 — Catalogue réel (après récupération de la source) :** d'abord `npm run inspect:catalog` en lecture seule sur l'origine approuvée, approbation manuelle des catégories, puis `npm run sync:catalog`, `npm run verify:catalog`, `npm run check`, commit de `site/catalog.json` par PR, vérification CI + Vercel sur le même SHA.
- **Étape 3 — Réservation complète (chantier futur, non démarré) :** créneaux, commandes, paiements, abonnements, remboursements, back-office opérateurs, TAKATAK Auth. Exige les spécifications et le contrat de l'étape 0 avant tout code.
- **Jamais sans approbation :** changement DNS de locactif.ca, retrait du `noindex`, écriture dans WooCommerce, transfert de réservations/commandes/abonnements, traitement de paiements.

## 5. Poussé

- Code : RIEN. Aucun commit sur `main`, aucun merge, aucun déploiement.
- Note GitHub : PR #1 — https://github.com/takatakca/LOCACTIF.CA/pull/1 (branche `klean/locactif-note-2026-10-29`, fichier `docs/KLEAN-NOTE-LOCACTIF-2026-10-29.md`, commit `3e0b2753`). NON mergée.
- Note Drive : fichier « 2026-10-29 — KLEAN — locactif — note de travail.md » dans « 00 — Opérations TAKATAK », ID Drive : 1ns3RPfD42p-tKbc0rq5R4-ENoITsHluB.

## 6. Blocages

1. **Source WordPress historique bloquée (P0) :** `locactif.ca` et `www.locactif.ca` répondent HTTP 403 à la racine et 404 sur `/wp-login.php`, `/wp-json/` et la Store API WooCommerce (audit public du 2026-10-15/16). Aucun import réel possible tant que le DocumentRoot et les sauvegardes ne sont pas retrouvés côté hébergement autorisé. Ne pas conclure que les données ont disparu.
2. **Contrat TAKATAK Auth indisponible (P0) :** aucune identité centralisée ni entitlements produit validés ; aucun deuxième système d'identité ne doit être créé.
3. **Réservation complète non implémentée (P0) :** créneaux, commandes, paiements, remboursements, administration : non démarrés.
4. **Domaine locactif.ca non migré (P0) :** ne pas router vers Vercel avant inventaire WordPress et plan de migration. Point à réconcilier : les docs du dépôt citent un avis de renouvellement au 2026-11-03 (statut registraire non vérifié), alors que le relevé MochaHost indique un renouvellement au 2026-12-14 — vérifier lequel s'applique avant toute action.
5. **Vérification live du site (à faire au navigateur) :** l'état réel actuel de locactif.ca n'est pas établi par ce travail (copie texte du 2026-10-29 datée du 2026-10-04, page générique sans rapport). À vérifier dans un navigateur normal avant toute conclusion sur le live.
6. **Limite de lecture :** l'énumération des branches n'est pas disponible via l'outil de lecture seule du connecteur GitHub (elle exige une approbation d'écriture) ; la vérification repose donc sur `main`, 0 issue ouverte et 0 PR ouverte, qui excluent déjà toute proposition de réservation en attente côté GitHub.

Aucun mot de passe, code ou secret dans cette note.
