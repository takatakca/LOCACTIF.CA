# TASK_QUEUE — LOCACTIF.CA

État du 2026-10-15 fondé sur Actions GitHub, déploiements Vercel et GET réels.

| Tâche | État | Priorité | Critère de clôture |
|---|---|---|---|
| LOC-001 Audit dépôt et décisions | TERMINÉ | P0 | Main, arbre, PR/issues, dernier SHA vérifiés |
| LOC-002 Accueil bilingue responsive | TERMINÉ | P0 | UI FR/EN et tests intégrés |
| LOC-003 Sécurité statique / Vercel | TERMINÉ POUR LE SOCLE | P0 | `site/` publié, .html fonctionne ; sécurité HTTP, CSP, noindex vérifiés depuis Actions |
| LOC-004 Journaux de relève | TERMINÉ | P1 | Cinq documents et AGENTS.md |
| LOC-005 CI et vérification HTTP | TERMINÉ pour le site de préparation | P0 | GitHub CI et smoke HTTP SUCCESS, Vercel READY même SHA |
| LOC-006 Catalogue Explorer | TERMINÉ côté front | P0 | Recherche/filtres/favoris locaux |
| LOC-007 Importer offres WooCommerce réelles | OUTIL PRÊT, SOURCE BLOQUÉE | P0 | Inspection publique sans écriture, catégories approuvées, import contrôlé ; source WooCommerce valide et catalogue réel encore requis |
| LOC-008 Fiches et réservation | PARTIEL | P0 | Fiche/renvoi HTTPS livrés ; slots, commande et paiement non opérationnels |
| LOC-009 Source WordPress historique | BLOQUÉ, DIAGNOSTIC APPROFONDI | P0 | DNS A 209.42.24.127, Apache 403/404 ; identifier docroot et sauvegardes, voir WORDPRESS_RECOVERY.md |
| LOC-010 TAKATAK Auth & permissions | BLOQUÉ CONTRAT API | P0 | SSO autorisé, entitlements produit, isolation tenant démontrés côté serveur |
| LOC-011 Admin opérateurs, paiements, support | NON DÉMARRÉ | P1 | Modèles, API et fonctionnalités selon exigences approuvées |
| LOC-012 Domaine locactif.ca | BLOQUÉ | P0 | Inventaire WordPress, DNS/HTTPS validés et bascule sans interruption |
| LOC-013 QA end-to-end | PARTIEL | P1 | Smoke HTTP + tests d'import isolé ; navigateur et réservations réelles à vérifier après accès métier |
| LOC-014 En-têtes HTTP Vercel | TERMINÉ | P1 | Config active déplacée dans `site/vercel.json`, CSP stricte, tests HTTP confirmés |
| LOC-015 Renouvellement du domaine | À VÉRIFIER | P0 | Avis de renouvellement : 2026-11-03 ; confirmer le statut auprès du registraire pour éviter une rupture de service |

| LOC-016 Intégrité et navigation du catalogue | TERMINÉ | P1 | Schéma commun serveur/navigateur, filtres et date d'import |

| LOC-017 Écriture atomique du catalogue | TERMINÉ | P0 | Tests de panne disque, refus des réductions de catalogue et mise à jour atomique ; CI validée |
| LOC-018 Diagnostic du WordPress historique | TERMINÉ POUR L'AUDIT PUBLIC | P0 | NS, IP, Apache, index.php, wp-login, Store API constatés ; suite demande accès hébergement |
| LOC-019 Smoke des modules JS publics | TERMINÉ | P1 | CI vérifie catalog-schema, catalog-utils, translations et assets en HTTPS |

## Ordre exact
Priorité 1 : retrouver la source WordPress historique ou une sauvegarde et confirmer que les commandes/réservations sont protégées. Priorité 2 : importer des offres publiques réelles et vérifier leurs liens. Priorité 3 : fonctionnalités de réservation et identité TAKATAK conforme au contrat. Priorité 4 : domaine, QA mobile et migration contrôlée.

## Accès requis
Administrateur de l'hébergement du WordPress historique (lecture fichiers/config sans exposer les secrets), informations WordPress/Store API, puis contrat TAKATAK Auth (issuer, audience, entitlements et permissions) pour les futurs parcours authentifiés. Les API publiques testées ne répondent pas actuellement.
