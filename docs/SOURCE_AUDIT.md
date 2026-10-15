# SOURCE_AUDIT — Historique WordPress/WooCommerce LOCACTIF

Vérification du 15 octobre 2026, depuis les serveurs GitHub Actions (et non par supposition). Audit **lecture seule**.

## Preuves
- Workflow : [Public source audit](https://github.com/takatakca/LOCACTIF.CA/actions/runs/38792613363) ; statut `success` = **exécution de la sonde terminée**, pas fonctionnement de WordPress.
- Commit testé : `6973794c74bdcaf6e31948c95392a95132f1bb73`.
- Fichier : `scripts/source-audit.mjs`.
- DNS : les deux noms `locactif.ca` et `www.locactif.ca` se résolvent depuis GitHub Actions.

| Endpoint | locactif.ca | www.locactif.ca |
|---|---|---|
| Accueil `/` | HTTP 403 | HTTP 403 |
| WordPress REST `/wp-json/` | HTTP 404 | HTTP 404 |
| WooCommerce public `/wp-json/wc/store/v1/products?per_page=1` | HTTP 404 | HTTP 404 |

Les pages HTTP retournent du contenu `text/html; charset=iso-8859-1`. Aucun marqueur WordPress n'a été détecté dans les réponses d'accueil consultables, ce qui ne démontre **pas** que les données WordPress ont disparu : il peut s'agir d'une protection, d'un autre docroot ou d'un WordPress ailleurs.

## Conséquences
- Ne pas lancer `npm run sync:catalog` sur ces URLs en l'état : la Store API publique ne répond pas.
- Ne pas créer un faux inventaire, copier des données clients, ni basculer le DNS.
- Identifier l'hébergement et le chemin WordPress d'origine, puis vérifier s'il est encore utilisé pour les réservations et abonnements.
- Confirmer l'origine correcte et son endpoint public autorisé avant import ; utiliser uniquement une lecture de produits publiés.
- Si la boutique WooCommerce a été retirée ou abandonnée, établir d'abord un inventaire de fichiers, DB, sauvegardes et contrats avant migration.

## Reprendre l'audit
Workflow GitHub : `LOCACTIF - Public source audit (read-only)` → `Run workflow`, ou `node scripts/source-audit.mjs` dans un environnement autorisant DNS/HTTPS. La sonde n'utilise aucun secret ni ne modifie la boutique.

## Limites
Cet audit n'identifie pas le propriétaire DNS, le fournisseur d'hébergement, la configuration PHP, le panneau WordPress, le contenu des commandes, les extensions Booking ou le contrat API TAKATAK. Ces informations nécessitent un accès d'administration explicitement autorisé et approprié.
