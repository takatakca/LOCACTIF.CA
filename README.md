# LOCACTIF.CA

Première base de LOCACTIF.CA, créée après inspection du dépôt GitHub : il ne contenait que ce titre (aucun produit, code, document fonctionnel ou déploiement).

## Cette version
- Page publique de préparation avec mise en page responsive.
- Français et anglais, navigation mobile, contrôles accessibles au clavier et langue mémorisée sur l'appareil.
- Sans dépendance de production, sans suivi ni formulaire factice.
- Tests Node.js natifs et vérification continue GitHub Actions ; déploiement Vercel connecté au dépôt GitHub.
- Indexation désactivée tant que la nature du service n'est pas documentée.

## Démarrer
Node.js 20+.
Exécuter : npm run check
Pour le serveur local : python3 -m http.server 8080 --directory site

## Publication
La première version a été déployée sur Vercel le 14 octobre 2026, à https://locactif-ca.vercel.app ; elle reste une page de préparation, non un produit final.

GitHub Actions vérifie le code sur main. Le déploiement GitHub Pages est optionnel : il s'exécute uniquement lorsque la variable de dépôt ENABLE_GITHUB_PAGES vaut true ET que Pages a été activé dans Settings > Pages > Source: GitHub Actions. Sans ces permissions, GitHub Pages ne peut pas être initialisé par GITHUB_TOKEN (échec constaté).

L'intégration Vercel/GitHub constitue la voie de déploiement active. Aucun DNS ni rattachement du domaine officiel locactif.ca n'a été modifié.

## Suite
Lire docs/PROJECT_STATUS.md avant toute nouvelle fonctionnalité. Le métier et les parcours de LOCACTIF ne sont pas décrits dans le dépôt. Ne pas inventer les services, les tarifs, les contacts ou les intégrations. Les futurs liens avec les services partagés de GROUPE TAKATAK devront respecter les permissions et le cloisonnement par client.
