# AGENTS — LOCACTIF.CA

## Reprise obligatoire
1. Lire `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md`, `docs/DECISIONS.md` et `docs/DEPLOYMENT.md`.
2. Comparer le SHA documenté avec `git rev-parse HEAD` et GitHub `main`; contrôler les commits, PR et issues avant toute écriture.
3. Conserver les modifications des autres agents. Ne jamais forcer une branche.
4. Exécuter `npm run check` et vérifier le workflow Actions avant de considérer une modification comme fonctionnelle.
5. Mettre à jour les fichiers de relève après les changements et préciser la prochaine action exécutable.

## Architecture confirmée
- Le service actuellement implémenté est uniquement une page de préparation statique FR/EN, sans base de données ni système d'authentification.
- Code publié : `site/`. Test/CI : Node.js, sans dépendance tierce. L'hébergement Git est lié à Vercel (`locactif-ca`).
- Configuration Vercel versionnée dans `vercel.json` avec `outputDirectory: site`.
- GitHub Pages est optionnel, désactivé si `ENABLE_GITHUB_PAGES` n'est pas `true`.

## Contraintes
- Aucune spécification métier du produit LOCACTIF n'a été fournie : ne pas prétendre qu'un service spécifique, ses plans, ses clients ou ses API existent.
- Les futures intégrations à GROUPE TAKATAK utilisent l'identité centrale TAKATAK et des droits explicites par produit/entreprise ; aucun système d'identité parallèle.
- Ne jamais exposer de secrets ni ajouter de données fictives présentées comme de vraies données.
- Ne pas modifier le DNS `locactif.ca` sans preuve de propriété, de destination et de disponibilité du contenu attendu.
- Ne pas retirer `noindex` tant que le site public final n'est pas approuvé.
- Éviter toute modification côté hébergeur sans vérification préalable du projet et du périmètre.
