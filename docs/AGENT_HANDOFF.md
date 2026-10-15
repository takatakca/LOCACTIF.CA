# AGENT_HANDOFF — LOCACTIF.CA

Date de reprise : 2026-10-15 ; dépôt `takatakca/LOCACTIF.CA` ; branche `main`.

## Dernière tâche terminée
LOC-008 en partie : création de la vraie page statique `/experience.html?id=<id>` reliée au catalogue et à ses liens HTTPS d'origine, favori local et messages d'indisponibilité honnêtes. Renforcement de l'import WooCommerce (refus de redirection/troncation), script de validation du catalogue. Ajout d'un test HTTP smoke automatisé.

## Tâche actuellement en cours
LOC-013 : confirmer l'exécution **réelle** du nouveau job de vérification HTTP sur le dernier push. Ensuite LOC-007/009 : obtenir et vérifier la source WooCommerce historique avant import de données.

## Dernier commit poussé / ancrage
- Dernier commit produit testé : `2fea88d2cc9e6cfcfc3e4bda603084004ddfea62`, Actions `38791032370` SUCCESS, Vercel `dpl_JDqRpz9tqmJydZrcvYu97ZnzqgoC` READY.
- Dernier commit technique avant cette documentation : `1f6d0a7023e3355015e4d25bc3d57f8980173fab`, ajout du smoke HTTP ; Vercel `dpl_5SP6msdkwqXf2iE2b6hLtftbzgZv` READY ; test CI smoke en cours à cette rédaction.
- **Ne pas prétendre connaître d'avance le SHA de ce commit documentaire** : consulter le head de `main` et les runs Actions pour vérifier.

## Fichiers modifiés durant cette reprise
Ajoutés : `site/experience.html`, `site/experience.css`, `site/experience.js`, `scripts/catalog-verify.mjs`, `scripts/smoke.mjs`, `tests/experience.test.mjs`.
Modifiés : `site/explore.js`, `site/explore.css`, `scripts/woocommerce-import.mjs`, `package.json`, `.github/workflows/site.yml`, `AGENTS.md`, `README.md`, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md`, `docs/DEPLOYMENT.md`, `docs/DECISIONS.md`, `docs/AGENT_HANDOFF.md`.

## Commandes et vérifications exécutées
- GitHub : branche, arbre, derniers commits, code, docs, PR/issues, exécutions Actions (aucune PR/issue ouverte constatée).
- `npm run check` et tests Node.js sous GitHub Actions sur le SHA `2fea88d2...` : SUCCESS ; pour `1f6d0a70...`, phase validate SUCCESS, phase smoke à contrôler.
- Vercel : liste des déploiements, métadonnées Git SHA et READY pour les commits précités.
- Terminal local : `curl -I https://locactif.ca` et `https://locactif-ca.vercel.app` -> DNS non résolu dans ce conteneur. Le smoke GitHub apporte un contrôle réseau indépendant.
- Aucune requête d'import WooCommerce n'a été exécutée : origine de confiance non identifiée et DNS local inaccessible.

## Problèmes / erreurs connus
1. Accès WordPress WooCommerce d'origine et état des bookings/abonnements inconnus ; ne pas détruire ni migrer sans inventaire.
2. `locactif.ca` n'est pas rattaché à Vercel dans la configuration vérifiée ; préserver le routage historique.
3. Certaines lectures de fichiers/logs Vercel avec `teamId` ont renvoyé 403. Les métadonnées sans scope explicite fonctionnent.
4. Catalogue vide ; l'affichage ne prétend pas proposer des offres.
5. Comptes TAKATAK, entitlements/tenant permissions et paiements non implémentés dans ce front.

## Statut réel du déploiement
Dernier READY confirmé avant ce commit documentaire : `1f6d0a7023e3355015e4d25bc3d57f8980173fab` (`dpl_5SP6msdkwqXf2iE2b6hLtftbzgZv`), production Vercel. HTTP smoke et déploiement de ce commit documentaire : à vérifier après push.

## Accès nécessaires
Accès autorisé en lecture aux réglages du WordPress existant, Store API publique et contrat d'intégration TAKATAK ; aucun secret à envoyer dans les fichiers Git. Droits Vercel de lecture des journaux du bon scope si des erreurs de production se produisent.

## Prochaine action exacte
1. Lire `AGENTS.md` et ce fichier, puis `docs/TASK_QUEUE.md`.
2. Vérifier SHA réel `main`, conclusion du dernier workflow (validate + smoke) et déploiement Vercel sur **exactement** ce SHA.
3. Si smoke échoue, lire les logs du job, corriger le chemin/headers ou l'attente de publication, et republier sans le désactiver.
4. Si tous les contrôles sont verts, déterminer l'origine WooCommerce légitime et importer seulement les offres réelles, en validant chaque lien et la continuité du WordPress historique.
5. Poursuivre ensuite les exigences de réservation et TAKATAK Auth depuis une spécification approuvée.
