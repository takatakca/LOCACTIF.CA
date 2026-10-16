# WORDPRESS_RECOVERY — Diagnostic du site historique locactif.ca

Date : 16 octobre 2026. **Procédure non destructive**. Le nouveau front Vercel ne contient **aucune** réservation historique, commande ou compte WordPress. Ne jamais le substituer à l'ancien domaine sans inventaire.

## Observations publiques mesurées

GitHub Actions, workflow read-only : [38942774369](https://github.com/takatakca/LOCACTIF.CA/actions/runs/38942774369), code à `f04ef4f33e2b230f14a6cf8ef8a6351a2dba028e`.

| Vérification | locactif.ca | www.locactif.ca |
|---|---|---|
| DNS A | 209.42.24.127 | 209.42.24.127 |
| Nameservers | ns1–ns4.mysecurecloudhost.com | ns1–ns4.mysecurecloudhost.com |
| En-tête `Server` | Apache | Apache |
| `/` | HTTP 403 | HTTP 403 |
| `/index.php` | HTTP 404 | HTTP 404 |
| `/wp-login.php` | HTTP 404 | HTTP 404 |
| `/?rest_route=%2F` | HTTP 403 | HTTP 403 |
| `/wp-json/` | HTTP 404 | HTTP 404 |
| `/wp-json/wc/store/v1/products?per_page=1` | HTTP 404 | HTTP 404 |

Ces symptômes sont **compatibles** avec un mauvais DocumentRoot, une absence des fichiers d'application dans la racine servie, un domaine lié au mauvais hébergement, ou une configuration Apache. Les tests publics ne permettent pas de distinguer ces causes et **n'autorisent pas à conclure que les données ont disparu**. Les notifications Wordfence historiques du début octobre 2026 suggèrent qu'un WordPress a existé récemment.

## Contrôles de l'hébergement, avant toute écriture

1. Dans le panneau d'hébergement **autorisé**, identifier précisément quel compte, serveur et DocumentRoot sont affectés à `locactif.ca` et à `www.locactif.ca`. Comparer le DNS actuel et l'IP du serveur réellement censé héberger WordPress.
2. Vérifier en **lecture seule** le contenu de ce DocumentRoot : `index.php`, `wp-admin/`, `wp-includes/`, `wp-content/`, `.htaccess`, et leurs chemins de sauvegarde. Ne pas publier, télécharger ni committer `wp-config.php` ou des identifiants.
3. Vérifier l'état et la date des sauvegardes **fichiers + base de données**, extensions WooCommerce, abonnements et plugin de réservation YITH, ainsi que l'état des commandes actives. Conserver les preuves de volumes/horodatages, sans données personnelles.
4. Examiner les journaux d'erreurs Apache pour les réponses 403/404, les règles `.htaccess`, permissions de lecture et directives `DirectoryIndex`. Ne pas changer simultanément DNS et document root.
5. Seulement après validation de l'instance et autorisation, effectuer un test GET sans données clients sur son `/wp-json/` et `/wp-json/wc/store/v1/products?per_page=1` pour confirmer que l'origine WooCommerce publique est bien accessible.
6. Si WordPress a été migré, identifier la nouvelle origine autorisée et documenter les règles de redirection/compatibilité des anciennes URLs et des commandes.

## Suite vers l'import du catalogue réel

- `LOCACTIF_WP_STORE_BASE_URL=https://ORIGINE_APPROUVEE npm run inspect:catalog` : lecture des seules catégories publiques ; n'écrit rien.
- Approuver manuellement les catégories réelles d'activités. `LOCACTIF_WP_STORE_BASE_URL=https://ORIGINE_APPROUVEE LOCACTIF_CATEGORY_IDS=12,34 npm run sync:catalog` : publication locale uniquement après revue ; la commande ne fait aucune écriture dans WordPress.
- Les remplacements locaux sont atomiques, avec protection de réduction du catalogue. Commit sur `main` et vérifier CI, réponse HTTPS publique et SHA Vercel exact avant toute annonce.
- **Ne pas importer de réservations, commandes, abonnements, données personnelles ni ressources d'authentification** au moyen de ce connecteur. TAKATAK doit rester l'autorité d'identité quand ses contrats API seront connus.

## Intervention humaine encore nécessaire

Accès administratif autorisé au panneau de l'hébergement de l'ancien WordPress (vérification des Domain Roots et des sauvegardes), sans transmettre les mots de passe au dépôt. Une fois la source localisée, l'agent peut poursuivre les changements Git sans refaire ce diagnostic.

## Domaine

Un avis historique indique une échéance du domaine `locactif.ca` au **3 novembre 2026** ; vérifier le statut d'enregistrement/renouvellement chez le registraire. Aucun renouvellement ou paiement n'a été réalisé par l'agent.
