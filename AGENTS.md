# AGENTS — LOCACTIF.CA

## Reprise obligatoire
1. Lire `docs/SOURCE_AUDIT.md` puis `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md`, `docs/DECISIONS.md` et `docs/DEPLOYMENT.md`.
2. Comparer le SHA documenté avec `git rev-parse HEAD` et GitHub `main`; contrôler les commits, PR et issues avant toute écriture.
3. Conserver les modifications des autres agents. Ne jamais forcer une branche.
4. Exécuter `npm run check` et vérifier le workflow Actions avant de considérer une modification comme fonctionnelle.
5. Mettre à jour les fichiers de relève après les changements et préciser la prochaine action exécutable.

## Architecture confirmée
- Le service actuellement implémenté est un front statique FR/EN de découverte d'expériences locales (accueil, explorer, fiche, favoris locaux) sans base de données, paiement ou système d'authentification. Le catalogue est vide tant que la source WordPress/WooCommerce historique n'est pas vérifiée.
- Code publié : `site/`. Test/CI : Node.js, sans dépendance tierce. L'hébergement Git est lié à Vercel (`locactif-ca`).
- Configuration Vercel versionnée dans `vercel.json` avec `outputDirectory: site`.
- Catalogue vérifié via `npm run verify:catalog` ; CI teste `npm run check` et le site HTTP réel sur l'alias Vercel via `scripts/smoke.mjs`.
- GitHub Pages est optionnel, désactivé si `ENABLE_GITHUB_PAGES` n'est pas `true`.

## Contraintes
- LOCACTIF est orienté vers la découverte et réservation d'activités locales. Les spécifications complètes (créneaux, prix, marchands, paiements) et les API WordPress ne sont pas confirmées ; ne rien inventer.
- Les futures intégrations à GROUPE TAKATAK utilisent l'identité centrale TAKATAK et des droits explicites par produit/entreprise ; aucun système d'identité parallèle.
- Ne jamais exposer de secrets ni ajouter de données fictives présentées comme de vraies données.
- Ne pas modifier le DNS `locactif.ca` sans preuve de propriété, de destination et de disponibilité du contenu attendu.
- Ne pas retirer `noindex` tant que le site public final n'est pas approuvé.
- Éviter toute modification côté hébergeur sans vérification préalable du projet et du périmètre.
