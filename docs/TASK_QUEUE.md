# TASK_QUEUE — LOCACTIF.CA

État du 2026-10-15 fondé sur Actions GitHub, déploiements Vercel et GET réels.

| Tâche | État | Priorité | Critère de clôture |
|---|---|---|---|
| LOC-001 Audit dépôt et décisions | TERMINÉ | P0 | Main, arbre, PR/issues, dernier SHA vérifiés |
| LOC-002 Accueil bilingue responsive | TERMINÉ | P0 | UI FR/EN et tests intégrés |
| LOC-003 Sécurité statique / Vercel | PARTIEL | P0 | `site/` publié, .html fonctionne ; divergence headers Vercel à examiner |
| LOC-004 Journaux de relève | TERMINÉ | P1 | Cinq documents et AGENTS.md |
| LOC-005 CI et vérification HTTP | TERMINÉ pour le site de préparation | P0 | GitHub CI et smoke HTTP SUCCESS, Vercel READY même SHA |
| LOC-006 Catalogue Explorer | TERMINÉ côté front | P0 | Recherche/filtres/favoris locaux |
| LOC-007 Importer offres WooCommerce réelles | OUTIL PRÊT, SOURCE BLOQUÉE | P0 | Inspection publique sans écriture, catégories approuvées, import contrôlé ; source WooCommerce valide et catalogue réel encore requis |
| LOC-008 Fiches et réservation | PARTIEL | P0 | Fiche/renvoi HTTPS livrés ; slots, commande et paiement non opérationnels |
| LOC-009 Source WordPress historique | BLOQUÉ HTTP 403/404 | P0 | Localiser origin/WordPress/DB/extensions ou confirmer migration/abandon, voir SOURCE_AUDIT.md |
| LOC-010 TAKATAK Auth & permissions | BLOQUÉ CONTRAT API | P0 | SSO autorisé, entitlements produit, isolation tenant démontrés côté serveur |
| LOC-011 Admin opérateurs, paiements, support | NON DÉMARRÉ | P1 | Modèles, API et fonctionnalités selon exigences approuvées |
| LOC-012 Domaine locactif.ca | BLOQUÉ | P0 | Inventaire WordPress, DNS/HTTPS validés et bascule sans interruption |
| LOC-013 QA end-to-end | PARTIEL | P1 | Smoke HTTP + tests d'import isolé ; navigateur et réservations réelles à vérifier après accès métier |
| LOC-014 En-têtes HTTP Vercel | À INVESTIGUER | P1 | Identifier cause `X-Robots-Tag` absent ; déployer fix puis tester l'en-tête réellement reçu |
| LOC-015 Renouvellement du domaine | À VÉRIFIER | P0 | Avis de renouvellement : 2026-11-03 ; confirmer le statut auprès du registraire pour éviter une rupture de service |

| LOC-016 Intégrité et navigation du catalogue | TERMINÉ | P1 | Schéma commun serveur/navigateur, retour aux filtres et affichage date d'import testés |

## Ordre exact
Priorité 1 : retrouver la source WordPress historique ou une sauvegarde et confirmer que les commandes/réservations sont protégées. Priorité 2 : importer des offres publiques réelles et vérifier leurs liens. Priorité 3 : fonctionnalités de réservation et identité TAKATAK conforme au contrat. Priorité 4 : domaine, QA mobile et migration contrôlée.

## Accès requis
Administrateur de l'hébergement du WordPress historique (lecture fichiers/config sans exposer les secrets), informations WordPress/Store API, puis contrat TAKATAK Auth (issuer, audience, entitlements et permissions) pour les futurs parcours authentifiés. Les API publiques testées ne répondent pas actuellement.
