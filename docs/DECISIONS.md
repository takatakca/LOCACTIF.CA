# DECISIONS — LOCACTIF.CA

## D-001 — Activités et expériences locales (orientation retrouvée)
**2026-10-15.** Des échanges antérieurs (mars 2026) décrivent LOCACTIF comme une plateforme mobile-first de découverte et de réservation d'activités locales, d'expériences, d'ateliers, de dégustations, de visites, d'événements et de services. Montréal était la première ville prévue. Un site WordPress avec WooCommerce, réservations, abonnements et adhésions a également été utilisé sur locactif.ca durant 2026. Le dépôt GitHub initial ne contenait aucune de ces spécifications. Ces éléments justifient une base de catalogue, **pas l'invention de vendeurs, prix ou disponibilités**.

## D-002 — Indépendance et données réelles
Le présent front consomme exclusivement `site/catalog.json` ; il n'affiche ni réservation fictive ni prix synthétique. L'importateur utilise une boutique HTTPS explicitement configurée et ses produits publiés via le WooCommerce Store API. Les réservations restent sur la source d'origine jusqu'à une migration contrôlée.

## D-003 — Authentification future
Le site de découverte peut être consulté en visiteur et proposer des favoris **locaux** sans compte, explicitement décrits comme non synchronisés. Les comptes, historiques, messages et droits d'achat devront être servis par l'identité centralisée TAKATAK, avec entitlements produit, jamais par un deuxième système sans autorisation.

## D-004 — Infrastructure
Vercel `locactif-ca` publie la nouvelle vitrine depuis `site/` via `vercel.json`; GitHub Actions teste `main`. GitHub Pages est optionnel car une tentative précédente a échoué sur les permissions. Ne pas associer `locactif.ca` à Vercel avant vérification et plan de migration : des systèmes WordPress/WooCommerce historiques peuvent dépendre de ce domaine.

## D-005 — Protection et publication
`noindex` et `robots.txt` bloquent l'indexation prématurée ; liens de réservation validés HTTPS même origine ; pas de clés d'API côté navigateur. Aucune collecte de données de compte. Conserver ces restrictions jusqu'au lancement approuvé.

## D-006 — Règles de migration
Les produits et leurs liens peuvent être lus depuis une API publique WooCommerce. **Ne pas écrire dans WooCommerce**, transférer abonnements/commandes/réservations, déplacer les DNS ou traiter des paiements sans inventaire approuvé, APIs vérifiées et trajectoire de conservation des données.

## D-007 — Fiches produit sans disponibilité fictive
**2026-10-15.** `experience.html?id=<id>` présente une offre uniquement si l'identifiant et le lien appartiennent à un enregistrement validé du catalogue importé. Le prix affiché est celui du dernier import et peut varier. Le bouton mène vers la page WooCommerce d'origine ; aucune étape de réservation simulée n'est intégrée.

## D-008 — Vérification du site public
**2026-10-15.** Après chaque push main, le job CI `smoke` vérifie les véritables réponses HTTPS de l'alias Vercel, au lieu de se satisfaire du statut READY. Le job vérifie les pages et assets de préparation. Il ne peut pas prouver la version SHA seul, ni les transactions absentes.

## D-009 — Routage sans cleanUrls
**2026-10-15.** L'audit HTTP GitHub Actions a montré `/explore` et `/experience` HTTP 200, mais `/explore.html` et `/experience.html` HTTP 404 lorsque `cleanUrls=true`. Les liens du projet et le serveur local utilisent explicitement `.html`. Le paramètre Vercel est donc `cleanUrls=false` ; CI smoke HTTP a ensuite réussi sur les URLs réelles.

## D-010 — WordPress historique à retrouver, sans migration forcée
**2026-10-15.** Audit en lecture seule des domaines apex et www : DNS OK, accueil HTTP 403, endpoints REST/Store API HTTP 404. Cela **ne prouve pas** qu'il n'existe plus de WordPress. On n'importe pas de catalogue fictif, ne réattribue pas le DNS et ne manipule aucune commande/abonnement. Voir `docs/SOURCE_AUDIT.md`.

## D-011 — Smoke sur preuves HTTP
**2026-10-15.** GitHub Actions utilise `scripts/smoke.mjs` pour interroger l'alias Vercel en HTTPS. Les en-têtes `X-Robots-Tag` sont absents malgré leur déclaration ; la protection de pré-lancement est donc contrôlée au moyen de la balise `noindex` des pages HTML et de `robots.txt` tant que la configuration des headers Vercel reste à investiguer. On n'assimile pas READY à un test métier.

## D-012 — Publication de catégories WooCommerce uniquement après approbation
**2026-10-15, reprise nocturne.** L'API Store expose les produits publics mais n'identifie pas nécessairement toutes les offres comme de vraies **activités réservable**s. La commande `npm run inspect:catalog` ne fait qu'inventorier en lecture seule. `sync:catalog` requiert `LOCACTIF_CATEGORY_IDS` explicitement autorisés. Déduire une disponibilité de stock, d'un prix ou d'un plugin WordPress sans contrat vérifié est interdit. Les données passent par une validation identique dans la CI et dans le navigateur.

## D-013 — Protection contre la perte de catalogue
Un import public se termine sans écriture en cas d'erreur d'API, de JSON, de redirection, de doublons, d'inventaire tronqué, de source différente ou de forte baisse de produits. Une suppression de plus de 50 % des fiches existantes nécessite l'approbation explicite `CONFIRM_CATALOG_SHRINK=true`. Un import vide nécessite `ALLOW_EMPTY_CATALOG=true`. Aucun des deux ne doit être automatisé sans revue.

## D-014 — Rechercher puis consulter sans perdre l'état
La recherche et la catégorie sont transportées dans le lien de la fiche et du retour, sans informations sensibles ; un lien direct avec catégorie conserve le filtre au premier chargement. Les pages montrent la date d'import seulement si elle est réellement enregistrée.

## D-015 — Configuration Vercel active dans site/
**2026-10-15/16.** Les premières mesures HTTP montraient **tous** les en-têtes personnalisés absents malgré leur déclaration dans `vercel.json` à la racine. Une configuration parallèle dans `site/vercel.json` a fait apparaître les en-têtes en production, prouvant que le projet Vercel existant lit ce dossier comme racine effective. Le diagnostic temporaire `X-Locactif-Config` a ensuite été retiré.

La politique définitive ajoute `Content-Security-Policy` incluant `frame-ancestors 'none'`, qui doit être envoyée comme **en-tête** (une balise meta n'offre pas cette protection). Les réponses publiques `/`, `/explore.html` et `/experience.html` doivent porter les mêmes protections. La CI vérifie désormais les en-têtes réellement reçus, en plus des balises noindex et de `robots.txt`.
