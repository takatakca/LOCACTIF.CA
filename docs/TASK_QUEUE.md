# TASK_QUEUE — LOCACTIF.CA

Mis à jour le 2026-10-15. Les états ne sont pas des pourcentages arbitraires.

| ID | État | Priorité | Tâche | Acceptation |
|---|---|---|---|---|
| LOC-001 | TERMINÉ | P0 | Inspecter l'état réel du dépôt | Commit, branche, fichiers, CI et Vercel relevés |
| LOC-002 | TERMINÉ | P0 | Site statique de préparation FR/EN | Code `site/`, navigation et tests présents |
| LOC-003 | TERMINÉ | P0 | Fixer la racine de publication Vercel | `vercel.json` pointe vers `site/` et test associé |
| LOC-004 | TERMINÉ | P1 | Mettre en place la relève inter-agents | Cinq documents et `AGENTS.md` créés |
| LOC-005 | EN VÉRIFICATION | P0 | Confirmer CI et déploiement du dernier commit | Actions success + Vercel READY sur exactement le SHA poussé + réponse HTTP vérifiée |
| LOC-006 | BLOQUÉ : SPÉCIFICATIONS ABSENTES | P0 | Définir le métier, utilisateurs et parcours du produit | Cahier des charges ou spécifications GitHub approuvés |
| LOC-007 | BLOQUÉ : SPÉCIFICATIONS ABSENTES | P0 | Implémenter les fonctions métier de bout en bout | Tests, vrais services, validation et rôles sur besoins approuvés |
| LOC-008 | BLOQUÉ : INFRA/APPROBATION | P1 | Associer `locactif.ca` et confirmer HTTPS | Domaine et DNS vérifiés, destination approuvée et requête réelle réussie |
| LOC-009 | APRÈS SPÉCIFICATIONS | P1 | Décider et réaliser l'intégration TAKATAK | Décisions sur identité/entitlements/tenants, APIs réelles et isolation vérifiée |

## Reprise
La prochaine action exécutable est LOC-005. Si la CI ou Vercel échoue, inspecter et corriger avant LOC-006. Ne pas lancer une base de données, un paiement ou une authentification sans exigence validée.
