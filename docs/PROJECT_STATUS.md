# PROJECT_STATUS — LOCACTIF.CA

Mis à jour le 2026-10-15. **Le front de découverte progresse ; le produit de réservation complet n'est pas encore terminé.**

## Orientation et source de vérité
- GitHub : `takatakca/LOCACTIF.CA`, `main`.
- Des travaux antérieurs décrivent une plateforme de découverte et réservation d'activités/expériences locales (Montréal initialement), avec recherche, catégories, fiches, favoris, réservations, messagerie, espaces utilisateurs.
- Un WordPress historique sur `locactif.ca` utilisait WooCommerce, abonnements, réservation et adhésion en 2026. Les données métier et les secrets de cette installation **ne se trouvent pas** dans ce dépôt.
- L'écosystème TAKATAK impose l'autorité d'identité centrale, entitlements produit et permissions cloisonnées par entreprise.

## Livré / contrôles
- Page d'accueil FR/EN responsive ; page `/explore.html` interactive.
- Recherche avec suppression d'accents, filtres de catégories, favoris enregistrés localement sur cet appareil uniquement.
- Les résultats ne proviennent que du `catalog.json` versionné ; le fichier est actuellement vide, aucun marchand fictif.
- Importateur WooCommerce Store API public sécurisé : `npm run sync:catalog` avec origine HTTPS validée, aucun secret requis ; redirections vers les permaliens originaux.
- Tests Node natifs pour liens, normalisation Store API, filtrage, noindex et configuration Vercel.
- `vercel.json` pointe vers `site/`, marqueur statique `/health.json`.
- Cinq documents de continuité et `AGENTS.md`.

## Pipeline / infrastructure
GitHub Actions teste chaque commit `main`. GitHub Pages est opt-in. Projet Vercel `locactif-ca` connecté à GitHub : des builds antérieurs sont READY sur SHA exact ; vérifier de nouveau la version courante avant de déclarer succès. Nom d'alias : https://locactif-ca.vercel.app. Tests HTTP depuis cet environnement indisponibles (DNS externe inaccessible) ; ne pas prétendre à une navigation fonctionnelle vérifiée.

## En cours et blocages
- Offres réelles WooCommerce : source, contenu et API WordPress historiques non vérifiés ; import non exécuté, catalogue public vide.
- Réservations, profils, paiements, abonnements, disponibilité réelle, messagerie, permissions, back-office : non implémentés dans ce nouveau front.
- Rattachement domaine officiel : non réalisé ; une installation WordPress historique impose un inventaire avant toute bascule DNS.
- Appels de logs Vercel explicitement scoped ont retourné 403 ; métadonnées des déploiements consultables.

## À reprendre
Consulter `docs/AGENT_HANDOFF.md`, `docs/TASK_QUEUE.md` et `docs/DEPLOYMENT.md`. Ne jamais maquiller le statut du site ou inventer des réservations.
