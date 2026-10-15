# PROJECT_STATUS — LOCACTIF.CA

État au 2026-10-15 : **socle de préparation livré ; application métier non définie, donc non terminée**.

## Source de vérité
- GitHub : `takatakca/LOCACTIF.CA` ; branche `main`.
- Commit de départ de cette reprise : `a3d205dc90deeeed78b9382b13c39ad3268e3759`.
- Depuis le commit initial `a6506b5`, le site FR/EN et les tests ont été ajoutés et GitHub Pages rendu facultatif.
- Aucun PR ni issue ouverte à la reprise.
- Dernier run initial inspecté : `38618522045`, succès le 14 octobre 2026 sur `a3d205d`.

## Technologies
Site statique HTML/CSS/JS en `site/`, traductions dans `site/translations.mjs`, contrôles natifs Node.js, Vercel Git sur production/main. Aucune base de données, API ou intégration de paiement.

## Réalisé
- Site de préparation responsive FR/EN et navigation mobile.
- Tests de balisage, traductions, liens et structure ; validation CI GitHub.
- Configuration Git versionnée Vercel pour rendre `site/` racine publique et appliquer en-têtes de sécurité.
- Marqueur statique `site/health.json` pour contrôles HTTP futurs.
- Documentation de relève et décisions : `AGENTS.md` et `docs/{TASK_QUEUE,AGENT_HANDOFF,DEPLOYMENT,DECISIONS,PROJECT_STATUS}.md`.

## Déploiement
Précédent déploiement Vercel en production READY : `dpl_AAgjgd4mXSqY2bwH4uwiYWuK3DKH` pour `a3d205d`. Alias connu : https://locactif-ca.vercel.app. L'accès HTTP depuis cette session n'a pas été confirmé. Le changement de configuration dans cette itération doit être revérifié par SHA après son push.

## Incomplet / bloqué
- Métier et fonctionnalités réelles du produit : aucune exigence validée.
- Domaine officiel `locactif.ca` : DNS et destination non vérifiés.
- Confirmation HTTP réelle de la version Vercel : outils web/terminal non concluants.
- Logs Vercel ciblés : 403 quand un teamId est explicitement passé.
- Aucune raison de créer auth, API, DB, paiement ou intégration TAKATAK avant le cahier des charges.

## Prochaine action
Consulter `docs/AGENT_HANDOFF.md` et la tâche LOC-005 dans `docs/TASK_QUEUE.md`. Corriger CI/déploiement uniquement selon des preuves, sinon recueillir les exigences métier auprès de la documentation approuvée.
