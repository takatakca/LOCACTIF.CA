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
- Contrôles Node natifs, CI GitHub, déploiement Vercel prêt.
- Robots noindex tant que le métier et les pages réelles ne sont pas validés.

## Ce qui n'est PAS terminé
- But du service, utilisateurs, règles métier, contenu et design définitif non spécifiés.
- Auth, base de données, API, intégrations, paiement et administrations : ni requis ni implémentés à ce stade.
- Vercel : déploiement production de la page de préparation READY, domaine Vercel attribué et protection SSO désactivée.
- GitHub Pages : refusé par permissions du GITHUB_TOKEN. Publication Pages désactivée par défaut, activable via ENABLE_GITHUB_PAGES=true après configuration des Pages.
- Domaine officiel locactif.ca : DNS et HTTPS non vérifiés ; aucun domaine personnalisé relié.

## Prochaine relève
1. Lire README, état GitHub et présent journal avant de coder.
2. Obtenir/identifier le cahier des charges réel. Ne pas inventer le métier en fonction du nom.
3. Construire par fonctionnalités verticales avec tests et rôles définis.
4. Si services partagés GROUPE TAKATAK : identité unique, entitlements explicites, données isolées par tenant.
5. Vérifier les validations GitHub et Vercel ; ne relier locactif.ca qu'après vérification de DNS et du produit final.
6. Conserver la navigation et l'identité LOCACTIF distinctes des autres applications.

## Déploiement de la première version (2026-10-14)
- Vercel project : locactif-ca (prj_w4GSNu30m0PkDrQ0vQ74GSCY5bFj).
- Deployment : dpl_EExk5iyevJLRycM9YDode9gnB2YU.
- Commit GitHub ciblé : f8809fe209b733990c13b42be2f2f729428928df.
- Statut API : READY ; alias : https://locactif-ca.vercel.app.
- GitHub CI : vérifications réussies ; déploiement Pages échoué faute d'autorisation de créer le site Pages.
- Ne pas confondre READY côté hébergeur et test navigateur de bout en bout, non réalisé.
