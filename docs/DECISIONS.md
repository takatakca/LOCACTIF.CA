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
