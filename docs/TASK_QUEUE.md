# TASK_QUEUE — LOCACTIF.CA

Reprise au 2026-10-15. Les statuts représentent les faits démontrés, non des pourcentages.

| ID | État | P | Tâche / critère |
|---|---|---|---|
| LOC-001 | TERMINÉ | P0 | Audit GitHub et Vercel réel, commits/branches/CI/PR/issues |
| LOC-002 | TERMINÉ | P0 | Accueil responsive FR/EN et tests |
| LOC-003 | TERMINÉ | P0 | Config Vercel versionnée (`site/`), en-têtes de sécurité, contrôles |
| LOC-004 | TERMINÉ | P1 | Documents de relève et `AGENTS.md` |
| LOC-005 | TERMINÉ POUR LES METADONNÉES | P0 | GitHub CI succès et Vercel READY sur le SHA publié ; HTTP non vérifié |
| LOC-006 | TERMINÉ POUR LE FRONT | P0 | Explorer : recherche, catégories, favoris locaux, état vide honnête |
| LOC-007 | CODE PRÊT, SOURCE NON VALIDÉE | P0 | Import WooCommerce public réel ; à exécuter sur origine approuvée ; importer/soumettre des offres vérifiées |
| LOC-008 | NON DÉMARRÉ | P0 | Définir/réaliser fiches complètes, disponibilités réelles et réservation intégrée ou redirection contrôlée |
| LOC-009 | BLOQUÉ PAR ACCÈS | P0 | Inventaire du WordPress historique (produits, abonnements, bookings) et plan de migration sans rupture |
| LOC-010 | NON DÉMARRÉ | P0 | Auth TAKATAK, entitlements LOCACTIF, historique, favoris synchronisés, messages, rôles, permissions backend |
| LOC-011 | NON DÉMARRÉ | P1 | Console opérateurs/admin et intégrations de services après règles métier approuvées |
| LOC-012 | BLOQUÉ PAR DNS/APPROBATION | P0 | Domaine locactif.ca : vérifier WordPress actuel, DNS et continuité de réservations avant toute migration |
| LOC-013 | PARTIEL | P1 | Tests navigateur mobile, FR/EN, import réel, tests d'intégration et vérification HTTP de production |

## Prochaine action exécutable
Confirmer le dernier run CI + READY Vercel sur `main` puis inspecter l'origine historique WordPress par un accès autorisé. Exécuter `LOCACTIF_WP_STORE_BASE_URL=... npm run sync:catalog` seulement après validation du système source, examiner les vrais produits, et committer un catalogue réel. Pas de création d'un nouveau système d'identité : TAKATAK est l'autorité.
