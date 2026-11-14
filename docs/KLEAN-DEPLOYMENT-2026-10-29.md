# KLEAN — Carte de déploiement LOCACTIF.CA — 2026-10-29

Note de travail KLEAN, docs seulement. Aucun code fonctionnel modifié, aucun déploiement
en production, aucun changement DNS, aucun secret dans cette note.

## Vérifié 2026-10-29
- Main : a8d818a (2026-10-16), inchangée. Issues ouvertes : 0. PR #1 (note de travail)
  reste ouverte et n'est pas mergée ici (décision propriétaire requise selon son texte).
- Cible déclarée : Vercel, projet `locactif-ca`, statique depuis `site/`,
  alias `locactif-ca.vercel.app`. Config : `vercel.json` (racine) et `site/vercel.json`
  (configuration active, racine Vercel = `site/`). Workflows : `site.yml` (tests + smoke
  HTTPS), `source-audit.yml` (sondes lecture seule). Aucun Dockerfile, Coolify ou Render.
- Auto-déploiement : OUI, vérifié via le connecteur Vercel le 2026-10-29 : déploiement
  production READY sur exactement main a8d818a, et previews READY sur la branche de la
  PR #1. L'intégration GitHub → Vercel fonctionne pour ce projet.
- Domaine locactif.ca : NON routé vers Vercel à ce stade. Constat mission 17:01–17:03 EDT
  = Apache 403, pas une page Vercel ; docs repo : aucune preuve de rattachement du
  domaine. La lecture des domaines du projet via le connecteur a retourné 403 scope
  équipe et n'est pas utilisée comme preuve.

## Règle dure — respectée
- Inventaire ancien WordPress D'ABORD (docs/WORDPRESS_RECOVERY.md, docs/SOURCE_AUDIT.md,
  docs/DEPLOYMENT.md). Mesures historiques : DNS 209.42.24.127, nameservers
  mysecurecloudhost.com, Apache, `/` 403, `/index.php` 404, `/wp-login.php` 404,
  `/wp-json/` 404, WooCommerce Store API 404. Ces sondes ne permettent pas de distinguer
  les causes (DocumentRoot, fichiers absents, mauvais hébergement, config Apache) et
  n'autorisent pas à conclure que les données ont disparu. Le front Vercel ne contient
  aucune réservation historique, commande ou compte WordPress.
- locactif.ca NE DOIT PAS être routé vers Vercel avant inventaire + plan de migration
  approuvé. Aucun deuxième système d'identité créé (future connexion = TAKATAK Auth,
  contrat indisponible ; favoris locaux seulement).
- Renouvellement : écart NON TRANCHÉ — docs repo 2026-11-03 vs MochaHost 2026-12-14
  (contexte mission). À vérifier chez le registraire. Aucun paiement fait ici.

## Checklist propriétaire (panneau, résumé)
1. Hébergement autorisé : identifier compte, serveur, DocumentRoot de locactif.ca/www.
2. Lecture seule du DocumentRoot (index.php, wp-admin/, wp-includes/, wp-content/,
   .htaccess, sauvegardes). Ne jamais committer wp-config.php ou des identifiants.
3. Sauvegardes fichiers + base, WooCommerce, YITH, commandes actives.
4. Journaux Apache 403/404, .htaccess, permissions, DirectoryIndex.
5. Après validation seulement : test GET sans données clients sur /wp-json/ et
   /wp-json/wc/store/v1/products?per_page=1.
6. Réconcilier l'échéance du domaine chez le registraire.
7. SEULEMENT après inventaire + plan approuvé : ajouter locactif.ca dans Vercel
   (projet locactif-ca), mettre à jour le DNS, vérifier production READY sur le SHA
   main et les pages /, /explore.html, /experience.html, /health.json en HTTPS.

## État en ligne réel
- Alias Vercel : production READY sur main a8d818a (preuve connecteur Vercel, SHA exact).
- Domaine locactif.ca : non vérifié en ligne sur Vercel, action panneau requise,
  interdite avant inventaire. Apache 403 au check 17:01–17:03 EDT.

Signé KLEAN, 2026-10-29. Copie Drive dans « 00 — Opérations TAKATAK »
(note déploiement 1/10 locactif + ramassedebris, 2026-10-29).
