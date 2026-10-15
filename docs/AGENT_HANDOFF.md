# AGENT_HANDOFF — LOCACTIF.CA

Date : 2026-10-15.
Repository : `takatakca/LOCACTIF.CA` ; branche `main`.

## Dernière tâche terminée
LOC-003 : configuration explicite Vercel `outputDirectory=site`, marqueur `site/health.json` et tests correspondants. LOC-004 : documents de continuité et `AGENTS.md` écrits. Ces éléments doivent être confirmés par le commit `HEAD` et la CI.

## Tâche en cours
LOC-005 : contrôle de la CI et d'un déploiement Vercel du **nouveau** SHA, avec validation HTTP si possible.

## Dernier commit confirmé à la reprise
`a3d205dc90deeeed78b9382b13c39ad3268e3759` (production Vercel précédente). Pour la version de ce fichier, **le SHA courant réel est `git rev-parse HEAD`** après push ; ne pas inventer un SHA en anticipant le commit.

## Fichiers modifiés dans cette itération
Ajoutés : `AGENTS.md`, `vercel.json`, `site/health.json`, `tests/deployment.test.mjs`, `docs/TASK_QUEUE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEPLOYMENT.md`, `docs/DECISIONS.md`. Actualisé : `docs/PROJECT_STATUS.md`.

## Commandes et vérifications
- GitHub : inspection de l'arbre main, commits, branches, PR, issues, run Actions et fichiers existants.
- Vercel : `get_project`, `list_deployments`, `list_project_domains` ; dernier état production READY sur `a3d205d`.
- GitHub CI précédente : run `38618522045` conclu success.
- Tentatives de lecture de fichiers/logs Vercel avec teamId : HTTP 403, accès scope insuffisant.
- Tentatives HTTP externes depuis les outils : non vérifiables (résolution DNS indisponible).
- Vérifications des **nouveaux fichiers** : doivent être confirmées par GitHub Actions après push ; ne pas cocher avant le résultat du run.

## Erreurs et accès nécessaires
- Lire les logs Vercel ciblés peut nécessiter une reconnexion/autorisations sur le bon scope `takatakcas-projects`. Ne jamais afficher de token.
- URL publique cible connue : https://locactif-ca.vercel.app, mais disponibilité HTTP non confirmée.
- Les exigences de LOCACTIF et la configuration DNS officiel ne figurent pas dans le dépôt.
- GitHub Pages échouait faute de permissions et reste volontairement opt-in.

## Statut de déploiement
Vercel : version antérieure `a3d205d` READY ; nouveau commit en attente de vérification après publication. GitHub CI du dernier code à inspecter. Domaine `locactif.ca` non vérifié.

## Prochaine action exacte
1. Lire `AGENTS.md`, ce fichier et la file de tâches.
2. Relever `git rev-parse HEAD` sur `main`, puis GitHub Actions pour ce SHA.
3. Rechercher dans Vercel `locactif-ca` un déploiement production READY ayant `meta.githubCommitSha = HEAD`.
4. Tester par HTTP `/`, `/health.json` et les actifs sous l'alias Vercel ; consigner statut HTTP et sécurité.
5. Si l'accès Vercel 403 persiste, traiter le scope sans boucle de retries ; sinon corriger toute erreur vérifiée et refaire un commit.
6. Si seules les exigences métier manquent, reprendre LOC-006 ; ne pas inventer le métier.
