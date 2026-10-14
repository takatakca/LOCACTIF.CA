# LOCACTIF.CA

Première base de LOCACTIF.CA, créée après inspection du dépôt GitHub : il ne contenait que ce titre (aucun produit, code, document fonctionnel ou déploiement).

## Cette version
- Page publique de préparation avec mise en page responsive.
- Français et anglais, navigation mobile, contrôles accessibles au clavier et langue mémorisée sur l'appareil.
- Sans dépendance de production, sans suivi ni formulaire factice.
- Tests Node.js natifs et workflow CI + publication GitHub Pages.
- Indexation désactivée tant que la nature du service n'est pas documentée.

## Démarrer
Node.js 20+.
Exécuter : npm run check
Pour le serveur local : python3 -m http.server 8080 --directory site

## Publication GitHub Pages
Le workflow .github/workflows/site.yml s'exécute sur main, vérifie le code puis publie site/ avec GitHub Pages. La configuration Settings > Pages > Source: GitHub Actions doit être activée côté dépôt pour rendre la publication fonctionnelle. Il ne modifie pas le DNS ni le domaine personnalisé locactif.ca.

## Suite
Lire docs/PROJECT_STATUS.md avant toute nouvelle fonctionnalité. Le métier et les parcours de LOCACTIF ne sont pas décrits dans le dépôt. Ne pas inventer les services, les tarifs, les contacts ou les intégrations. Les futurs liens avec les services partagés de GROUPE TAKATAK devront respecter les permissions et le cloisonnement par client.
