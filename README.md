# LOCACTIF.CA

LOCACTIF est un projet de **découverte et réservation d'activités et d'expériences locales**. L'orientation issue de travaux antérieurs prévoit des sorties, ateliers, événements, dégustations et expériences ; le catalogue historique utilisait WordPress/WooCommerce et des extensions de réservation.

L'ancien dépôt GitHub ne contenait initialement qu'un titre. Le code actuel fournit un socle public indépendant et **ne prétend pas que le système complet de réservation est opérationnel**.

## Disponible
- Accueil bilingue FR/EN, responsive et accessible.
- Page `/explore.html` : recherche, catégories, favoris locaux, filtres et liens vers les offres réellement importées. Aucun exemple fictif n'est montré comme disponible.
- Source de données : `site/catalog.json`, issue d'un import explicite du WooCommerce Store API public via `npm run sync:catalog`.
- Sécurité des liens de réservation (HTTPS limité à l'origine de la boutique configurée).
- Statut minimal : `/health.json` (son résultat atteste uniquement la disponibilité du fichier statique).
- GitHub Actions pour tests sur `main`, déploiement automatique par intégration Vercel/GitHub, GitHub Pages facultatif.

## Exécuter et vérifier
Node.js 20+ :

```bash
npm run check
python3 -m http.server 8080 --directory site
```

Ouvrir http://localhost:8080 puis http://localhost:8080/explore.html.

## Importer des offres réelles
Requiert l'accès à une **boutique WooCommerce validée** exposant l'API publique Store API. Ne pas utiliser un autre site arbitraire.

```bash
LOCACTIF_WP_STORE_BASE_URL=https://votre-boutique-approuvee.example npm run sync:catalog
```

- Aucune clé WooCommerce n'est utilisée ni demandée par cet import public.
- Les produits sont filtrés pour garder les liens HTTPS de cette même origine.
- Si la source échoue ou ne contient aucune offre valide, l'import refuse d'effacer le catalogue existant (sauf `ALLOW_EMPTY_CATALOG=true` explicite).
- Après revue du résultat, ajouter `site/catalog.json` dans un commit : la publication passe par `main` et Vercel.
- Les réservations/achats restent sur la boutique d'origine. Le présent front ne contient **aucun panier ni paiement local**.
- Les favoris sur l'appareil ne constituent pas un compte utilisateur ; une future connexion requiert TAKATAK Auth avec entitlements appropriés.

## Production et déploiement
Projet Vercel identifié : `locactif-ca`. Publication statique depuis `site/` via `vercel.json`. Alias : https://locactif-ca.vercel.app. Le domaine `locactif.ca` ne doit pas être routé avant inspection de la version WordPress et du DNS, afin d'éviter d'interrompre le catalogue/réservations historique. Voir `docs/DEPLOYMENT.md`.

## Reprise par agent
Lire `AGENTS.md`, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md` et `docs/AGENT_HANDOFF.md`. Les besoins retrouvés concernent un marché local, mais le fonctionnement du futur back-office, les règles tarifaires et la migration WooCommerce -> TAKATAK doivent encore être décidés et testés.
