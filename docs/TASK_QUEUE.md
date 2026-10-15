# TASK_QUEUE — LOCACTIF.CA

Référence : 2026-10-15. Les critères de fin sont vérifiables, pas des pourcentages.

| ID | État | Priorité | Prochaine tâche et critères |
|---|---|---|---|
| LOC-001 | TERMINÉ | P0 | Audit GitHub : commit, main, PR, issues, accès et CI |
| LOC-002 | TERMINÉ | P0 | Accueil responsive FR/EN |
| LOC-003 | TERMINÉ | P0 | Vercel statique : `outputDirectory=site`, headers, noindex |
| LOC-004 | TERMINÉ | P1 | Documentation multi-agent et consignes de reprise |
| LOC-005 | PARTIEL | P0 | Vercel READY SHA exact ; valider par HTTP et navigateur l'alias production |
| LOC-006 | TERMINÉ | P0 | Catalogue Explorer : recherche, catégories, favoris locaux |
| LOC-007 | EN ATTENTE DE SOURCE | P0 | Importer les **vraies** offres WooCommerce après inventaire WordPress, revue des prix et des liens, commit validé |
| LOC-008 | PARTIEL | P0 | Fiche locale `experience.html?id=...` livrée, disponibilité/réservation restent sur la source ; construire la réservation intégrée seulement après définition métier |
| LOC-009 | BLOQUÉ : ACCÈS | P0 | Identifier installation WordPress historique, plugins de réservation, contrats et données, vérifier Store API sans écrire dans la source |
| LOC-010 | BLOQUÉ : CONTRAT D'API | P0 | Auth TAKATAK centrale, entitlements LOCACTIF, isolation tenant, favoris synchronisés, historiques |
| LOC-011 | NON DÉMARRÉ | P1 | Portail opérateurs, messagerie, admin, paiements selon cahier des charges confirmé |
| LOC-012 | BLOQUÉ : INFRA | P0 | Vérifier locactif.ca, DNS, HTTPS et préserver l'ancien commerce avant la migration |
| LOC-013 | EN COURS | P0 | Smoke HTTP Vercel automatique, tests réels du navigateur mobile et import WooCommerce |

## Prochaine action
Contrôler GitHub Actions du commit `1f6d0a7023e3355015e4d25bc3d57f8980173fab`. Nouveau job `smoke` sur HTTPS `locactif-ca.vercel.app`. Si échec, lire les logs du job et corriger selon erreur prouvée. Puis confirmer l'origine WordPress autorisée avant exécution de `npm run sync:catalog` et introduction d'offres réelles. Ne pas toucher au DNS ni aux réservations existantes à l'aveugle.
