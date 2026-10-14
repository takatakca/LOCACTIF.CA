# Reprise agent — LOCACTIF.CA (2026-10-14)

## Inventaire initial vérifié
- Repository : takatakca/LOCACTIF.CA, branche main.
- Dernier commit initial : a6506b5264768b43332d811b8abc146825c83dcc.
- Seul fichier : README.md avec le titre « LOCACTIF.CA ».
- Aucune autre branche, PR ouverte, issue ouverte, exécution GitHub Actions ou spécification produit dans ce dépôt.

## Livré dans cette première itération
- Site statique FR/EN responsive et identité visuelle de départ.
- Navigation mobile et clavier, traduction centralisée.
- Zéro backend, zéro donnée personnelle collectée, zéro dépendance de production.
- Contrôles Node natifs et pipeline GitHub Pages.
- Robots noindex tant que le métier et les pages réelles ne sont pas validés.

## Ce qui n'est PAS terminé
- But du service, utilisateurs, règles métier, contenu et design définitif non spécifiés.
- Auth, base de données, API, intégrations, paiement et administrations : ni requis ni implémentés à ce stade.
- Activation Pages, rattachement DNS/HTTPS de locactif.ca et mise en production : non vérifiés.

## Prochaine relève
1. Lire README, état GitHub et présent journal avant de coder.
2. Obtenir/identifier le cahier des charges réel. Ne pas inventer le métier en fonction du nom.
3. Construire par fonctionnalités verticales avec tests et rôles définis.
4. Si services partagés GROUPE TAKATAK : identité unique, entitlements explicites, données isolées par tenant.
5. Contrôler le résultat Actions et la configuration Pages; déployer le domaine uniquement une fois vérifié.
6. Conserver la navigation et l'identité LOCACTIF distinctes des autres applications.
